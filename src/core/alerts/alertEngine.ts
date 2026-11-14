import {
  HealthAlert,
  HealthReading,
  HealthBaseline,
  AlertRuleConfig,
  SeverityLevel,
  MetricType
} from '@/types';
import { METRIC_DEFINITIONS } from '../data/metricDefinitions';
import { analyzeMetricTrend } from '../analysis/trendDetection';

export interface AlertGenerationContext {
  astronautId: string;
  readings: HealthReading[];
  baselines: Record<MetricType, HealthBaseline>;
  rules: AlertRuleConfig[];
  existingAlerts: HealthAlert[];
}

/**
 * Predefined, non-diagnostic operational mitigation protocols for alerts.
 */
export const OPERATIONAL_PROTOCOLS: Record<MetricType, { info: string; warning: string; urgent: string }> = {
  heart_rate: {
    info: 'Log daily wellness check-in and verify chest strap / optical sensor skin contact.',
    warning: 'Schedule 15-minute relaxation countermeasure. Review caffeine/stimulant intake and hydration log.',
    urgent: 'Re-seat telemetry sensor. Recheck resting pulse in supine/neutral body posture. Alert Mission Flight Surgeon (BME console) on next scheduled communication pass.'
  },
  spo2: {
    info: 'Ensure clean optical contact on pulse oximeter probe. Confirm fingernail cleanliness.',
    warning: 'Verify cabin environmental partial pressure (pO2) on ECLSS telemetry. Re-measure SpO2 on alternate finger.',
    urgent: 'Check cabin ECLSS emergency atmospheric readouts. Inspect local ventilation airflow velocity. Initiate crew secondary oxygen check per Flight Rule B-12.'
  },
  sleep_duration: {
    info: 'Review crew sleep quarters acoustic shielding and dimming baffles.',
    warning: 'Consider adjusting evening crew duty cycle by -45 minutes. Dim personal quarters lighting 1h pre-sleep.',
    urgent: 'Engage operational fatigue management mitigation protocol. Discuss circadian shift with Flight Surgeon.'
  },
  activity: {
    info: 'Log reason for abbreviated exercise session in daily operational logbook.',
    warning: 'Reschedule missed countermeasure session (ARED or T2 Treadmill) within 18-hour window.',
    urgent: 'Flag musculoskeletal deconditioning hazard. Consult Exercise Countermeasures Specialist for protocol adjustment.'
  },
  fatigue: {
    info: 'Hydrate (0.5 L electrolyte buffer) and conduct brief ocular rest.',
    warning: 'Authorize operational power-nap (20-30 min) prior to critical EVA or robotic operations.',
    urgent: 'Halt non-essential high-risk physical or robotic tasks. Enact secondary operator cross-check.'
  },
  stress: {
    info: 'Utilize Earth-view cupola observation interval or audio relaxation module.',
    warning: 'Review mission timeline with Capcom to defer non-critical maintenance tasks.',
    urgent: 'Notify crew commander for duty re-allocation and private medical conference (PMC) request.'
  },
  core_temp: {
    info: 'Verify thermal sensor calibration against cabin standard.',
    warning: 'Hydrate and evaluate crew liquid cooling garment (LCG) temperature setpoint.',
    urgent: 'Inspect for thermoregulatory dysregulation or infection markers. Review crew medical kit protocol.'
  },
  blood_pressure_sys: {
    info: 'Log resting blood pressure in a calm, seated position with arm supported at heart level.',
    warning: 'Rest for 10 minutes in quiet room; re-measure. Check hydration and recent sodium intake.',
    urgent: 'Systolic pressure persistently elevated above personal baseline. Rest quietly; notify primary physician or care team.'
  },
  blood_pressure_dia: {
    info: 'Diastolic reading logged. Ensure cuff is properly fitted over bare upper arm.',
    warning: 'Diastolic variance detected. Avoid caffeine or strenuous activity for 30 minutes; repeat check.',
    urgent: 'Sustained diastolic deviation. Review medication timing and contact consulting physician.'
  },
  glucose: {
    info: 'Record meal timing and carbohydrate content in the daily nutrition log.',
    warning: 'Post-prandial glycemic excursion detected. Drink water, engage in a 10-minute light stroll.',
    urgent: 'Significant blood glucose spike or rapid drop below target threshold. Follow prescribed hypoglycemia/hyperglycemia protocol.'
  },
  weight: {
    info: 'Weigh yourself at the same time each morning after voiding.',
    warning: 'Acute weight shift detected (>1.5 kg in 48h). Check for fluid retention or dehydration symptoms.',
    urgent: 'Rapid fluid accumulation pattern. Alert clinical team to evaluate heart failure / diuretic protocol.'
  },
  temperature: {
    info: 'Log temperature reading; verify probe placement.',
    warning: 'Low-grade thermal elevation. Hydrate, rest, and monitor for accompanying infection symptoms.',
    urgent: 'Significant fever response. Contact primary doctor and follow acute infection care guidelines.'
  }
};

/**
 * Generates transparent, human-readable explanations based on empirical telemetry and personal baselines.
 */
export function generateAlertExplanation(
  metric: MetricType,
  observedValue: number,
  baseline: HealthBaseline,
  difference: number,
  consecutiveCount: number,
  contributing: string[]
): string {
  const def = METRIC_DEFINITIONS[metric];
  const unit = def.unit;
  const directionStr = difference > 0 ? 'above' : 'below';
  const absDiff = Math.abs(difference);

  let explanation = `${def.label} observed at ${def.displayFormat(observedValue)}, which is ${absDiff} ${unit} ${directionStr} the crew personal baseline mean of ${baseline.referenceMean} ${unit} (σ = ${baseline.standardDeviation}).`;

  if (consecutiveCount > 1) {
    explanation += ` This deviation has persisted across ${consecutiveCount} consecutive telemetry readings.`;
  }

  if (contributing.length > 0) {
    explanation += ` Relevant co-occurring indicators include: ${contributing.join('; ')}.`;
  }

  explanation += ' This alert is generated deterministically by configured flight monitoring rules and represents an operational observation, not a clinical diagnosis.';

  return explanation;
}

/**
 * Checks if a new alert is a duplicate of an existing unacknowledged alert.
 */
export function isDuplicateAlert(
  existingAlerts: HealthAlert[],
  astronautId: string,
  metric: MetricType,
  severity: SeverityLevel,
  withinMinutes: number = 60
): HealthAlert | undefined {
  const cutoff = Date.now() - withinMinutes * 60 * 1000;
  return existingAlerts.find(
    (a) =>
      a.astronautId === astronautId &&
      a.metric === metric &&
      a.severity === severity &&
      !a.acknowledged &&
      new Date(a.timestamp).getTime() >= cutoff
  );
}

/**
 * Evaluates rules against telemetry and baseline to produce explainable alerts.
 */
export function evaluateAlerts(context: AlertGenerationContext): HealthAlert[] {
  const { astronautId, readings, baselines, rules, existingAlerts } = context;
  const newAlerts: HealthAlert[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    const metric = rule.metric;
    const baseline = baselines[metric];

    // Check baseline reliability
    if (!baseline || baseline.confidenceStatus === 'insufficient_data') {
      continue;
    }

    const metricReadings = readings
      .filter((r) => r.astronautId === astronautId && r.metric === metric && r.quality !== 'unreliable')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (metricReadings.length === 0) continue;

    const trend = analyzeMetricTrend(metric, metricReadings, baseline, {
      warningStdDevThreshold: rule.warningStdDevThreshold,
      urgentStdDevThreshold: rule.urgentStdDevThreshold,
      sustainedCount: rule.sustainedReadingCount
    });

    if (!trend) continue;

    // Check if deviation exceeds thresholds
    const absZ = Math.abs(trend.zScore);
    let severity: SeverityLevel | null = null;

    if (absZ >= rule.urgentStdDevThreshold && trend.isSustained) {
      severity = 'URGENT';
    } else if (absZ >= rule.warningStdDevThreshold && (trend.isSustained || absZ >= rule.urgentStdDevThreshold)) {
      severity = 'WARNING';
    } else if (absZ >= rule.warningStdDevThreshold && trend.consecutiveDeviations >= 1) {
      severity = 'INFO';
    }

    if (!severity) continue;

    // Duplicate suppression: if an active unacknowledged alert of the same or higher severity exists, don't spam
    const existing = isDuplicateAlert(existingAlerts, astronautId, metric, severity, 120);
    if (existing) {
      continue;
    }

    // Check contributing factors from other metrics
    const contributing: string[] = [];
    if (metric === 'heart_rate') {
      const sleepB = baselines['sleep_duration'];
      const sleepReadings = readings.filter((r) => r.metric === 'sleep_duration');
      if (sleepReadings.length > 0 && sleepB) {
        const latestSleep = sleepReadings[sleepReadings.length - 1];
        if (latestSleep.value < sleepB.referenceMean - 1.0) {
          contributing.push(`reduced sleep duration (${latestSleep.value} h vs baseline ${sleepB.referenceMean} h)`);
        }
      }
      const fatigueReadings = readings.filter((r) => r.metric === 'fatigue');
      if (fatigueReadings.length > 0) {
        const latestFatigue = fatigueReadings[fatigueReadings.length - 1];
        if (latestFatigue.value >= 6) {
          contributing.push(`elevated subjective fatigue index (${latestFatigue.value}/10)`);
        }
      }
    } else if (metric === 'spo2') {
      const hrReadings = readings.filter((r) => r.metric === 'heart_rate');
      if (hrReadings.length > 0 && baselines['heart_rate']) {
        const latestHR = hrReadings[hrReadings.length - 1];
        if (latestHR.value > baselines['heart_rate'].referenceMean) {
          contributing.push(`compensatory resting heart rate elevation (${latestHR.value} bpm)`);
        }
      }
    }

    const latest = metricReadings[metricReadings.length - 1];
    const explanation = generateAlertExplanation(
      metric,
      trend.currentValue,
      baseline,
      trend.difference,
      trend.consecutiveDeviations,
      contributing
    );

    const protocolKey = severity.toLowerCase() as 'info' | 'warning' | 'urgent';
    const recommendedProtocol =
      OPERATIONAL_PROTOCOLS[metric]?.[protocolKey] ||
      'Review telemetry trend, verify sensor position, and log subjective status in daily check-in.';

    const deviationType =
      trend.difference > 0
        ? 'elevated'
        : trend.difference < 0
        ? 'depressed'
        : 'sustained_shift';

    newAlerts.push({
      id: `alert-${astronautId}-${metric}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      astronautId,
      metric,
      severity,
      observedValue: trend.currentValue,
      baselineValue: baseline.referenceMean,
      deviation: trend.difference,
      deviationType,
      durationHours: trend.consecutiveDeviations * 4, // approximate 4h intervals
      consecutiveReadings: trend.consecutiveDeviations,
      explanation,
      contributingFactors: contributing,
      ruleId: rule.id,
      timestamp: latest.timestamp,
      acknowledged: false,
      recommendedProtocol,
      dataQuality: trend.dataQuality
    });
  }

  return newAlerts;
}
