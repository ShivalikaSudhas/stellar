import { HealthReading, HealthBaseline, MetricType, QualityStatus } from '@/types';

export interface TrendAnalysisResult {
  metric: MetricType;
  currentValue: number;
  baselineMean: number;
  stdDev: number;
  zScore: number;
  difference: number;
  percentageChange: number;
  direction: 'stable' | 'increasing' | 'decreasing' | 'fluctuating';
  isSustained: boolean;
  consecutiveDeviations: number;
  severity: 'nominal' | 'elevated' | 'warning' | 'urgent';
  recentReadings: HealthReading[];
  dataQuality: QualityStatus;
}

export interface MultiIndicatorCorrelation {
  id: string;
  timestamp: string;
  summary: string;
  primaryMetric: MetricType;
  relatedMetrics: MetricType[];
  observations: string[];
  caveat: string;
}

/**
 * Analyzes trend for a single metric against personal baseline.
 */
export function analyzeMetricTrend(
  metric: MetricType,
  readings: HealthReading[],
  baseline?: HealthBaseline,
  options: {
    warningStdDevThreshold?: number;
    urgentStdDevThreshold?: number;
    sustainedCount?: number;
  } = {}
): TrendAnalysisResult | null {
  const {
    warningStdDevThreshold = 1.5,
    urgentStdDevThreshold = 2.5,
    sustainedCount = 3
  } = options;

  const validReadings = readings
    .filter((r) => r.metric === metric && r.quality !== 'unreliable')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (validReadings.length === 0) {
    return null;
  }

  const latestReading = validReadings[validReadings.length - 1];
  const currentValue = latestReading.value;
  const baselineMean = baseline?.referenceMean ?? currentValue;
  const stdDev = baseline?.standardDeviation ?? 1;

  const difference = Number((currentValue - baselineMean).toFixed(2));
  const percentageChange = baselineMean !== 0 ? Number(((difference / baselineMean) * 100).toFixed(1)) : 0;
  const zScore = stdDev > 0 ? Number((difference / stdDev).toFixed(2)) : 0;

  // Determine consecutive readings deviating in the same direction
  let consecutive = 0;
  const isHigher = difference > 0;
  for (let i = validReadings.length - 1; i >= 0; i--) {
    const val = validReadings[i].value;
    const diff = val - baselineMean;
    if ((isHigher && diff > 0.5 * stdDev) || (!isHigher && diff < -0.5 * stdDev)) {
      consecutive++;
    } else {
      break;
    }
  }

  const isSustained = consecutive >= sustainedCount;

  // Trend direction across the last 5 readings
  const lastN = validReadings.slice(-5);
  let direction: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable';
  if (lastN.length >= 3) {
    const values = lastN.map((r) => r.value);
    let upMoves = 0;
    let downMoves = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) upMoves++;
      else if (values[i] < values[i - 1]) downMoves++;
    }
    if (upMoves >= values.length - 2) direction = 'increasing';
    else if (downMoves >= values.length - 2) direction = 'decreasing';
    else if (upMoves > 0 && downMoves > 0 && Math.abs(upMoves - downMoves) <= 1) direction = 'fluctuating';
  }

  // Severity classification
  const absZ = Math.abs(zScore);
  let severity: 'nominal' | 'elevated' | 'warning' | 'urgent' = 'nominal';
  if (absZ >= urgentStdDevThreshold) {
    severity = 'urgent';
  } else if (absZ >= warningStdDevThreshold) {
    severity = 'warning';
  } else if (absZ >= 1.0) {
    severity = 'elevated';
  }

  return {
    metric,
    currentValue,
    baselineMean,
    stdDev,
    zScore,
    difference,
    percentageChange,
    direction,
    isSustained,
    consecutiveDeviations: consecutive,
    severity,
    recentReadings: lastN,
    dataQuality: latestReading.quality
  };
}

/**
 * Cross-analyzes multiple indicators over an observation window to identify overlapping trends.
 * Implements requirement: "Multi-indicator contextual analysis... present as observations, not proof of condition."
 */
export function detectMultiIndicatorCorrelations(
  trends: Record<string, TrendAnalysisResult | null>
): MultiIndicatorCorrelation[] {
  const correlations: MultiIndicatorCorrelation[] = [];
  const hrTrend = trends['heart_rate'];
  const sleepTrend = trends['sleep_duration'];
  const fatigueTrend = trends['fatigue'];
  const activityTrend = trends['activity'];
  const spo2Trend = trends['spo2'];

  const now = new Date().toISOString();

  // Pattern 1: Circadian Fatigue-Cardiovascular Correlation
  if (
    hrTrend &&
    (hrTrend.severity === 'warning' || hrTrend.severity === 'urgent' || hrTrend.direction === 'increasing') &&
    sleepTrend &&
    sleepTrend.difference < 0 &&
    Math.abs(sleepTrend.difference) >= 1.0
  ) {
    const obs: string[] = [
      `Resting heart rate observed at ${hrTrend.currentValue} bpm (+${hrTrend.difference} bpm vs personal baseline of ${hrTrend.baselineMean} bpm).`,
      `Sleep duration recorded at ${sleepTrend.currentValue} h (${Math.abs(sleepTrend.difference)} h below baseline mean of ${sleepTrend.baselineMean} h).`
    ];

    if (fatigueTrend && fatigueTrend.currentValue > fatigueTrend.baselineMean) {
      obs.push(`Concurrent crew fatigue score elevated to ${fatigueTrend.currentValue} / 10.`);
    }

    correlations.push({
      id: `corr-sleep-cardio-${Date.now()}`,
      timestamp: now,
      summary: 'Cardiovascular Elevation Co-Occurring with Sleep Deficit',
      primaryMetric: 'heart_rate',
      relatedMetrics: ['sleep_duration', 'fatigue'],
      observations: obs,
      caveat: 'Observed temporal co-occurrence across valid telemetry. This operational insight indicates physiological stress response rather than a definitive medical etiology.'
    });
  }

  // Pattern 2: Hypoxic / Atmospheric or Respiratory shift
  if (
    spo2Trend &&
    (spo2Trend.severity === 'warning' || spo2Trend.severity === 'urgent') &&
    hrTrend &&
    hrTrend.difference > 0
  ) {
    correlations.push({
      id: `corr-spo2-hr-${Date.now()}`,
      timestamp: now,
      summary: 'Peripheral SpO2 Desaturation Accompanied by Compensatory Heart Rate Elevation',
      primaryMetric: 'spo2',
      relatedMetrics: ['heart_rate'],
      observations: [
        `SpO2 measured at ${spo2Trend.currentValue}%, which is ${Math.abs(spo2Trend.difference)}% below baseline.`,
        `Resting heart rate currently elevated at ${hrTrend.currentValue} bpm (Z-score: +${hrTrend.zScore}σ).`
      ],
      caveat: 'Sensor artifact or cabin ambient partial pressure variation should be cross-referenced with Environmental Control and Life Support System (ECLSS) logs before clinical escalation.'
    });
  }

  // Pattern 3: Exercise Deconditioning & Fatigue
  if (
    activityTrend &&
    activityTrend.difference < -20 &&
    fatigueTrend &&
    fatigueTrend.currentValue >= 6
  ) {
    correlations.push({
      id: `corr-activity-fatigue-${Date.now()}`,
      timestamp: now,
      summary: 'Countermeasure Exercise Reduction Correlated with High Fatigue Score',
      primaryMetric: 'activity',
      relatedMetrics: ['fatigue'],
      observations: [
        `Daily countermeasure exercise logged at ${activityTrend.currentValue} min (${Math.abs(activityTrend.difference)} min below schedule).`,
        `Self-reported crew fatigue level is high at ${fatigueTrend.currentValue} / 10.`
      ],
      caveat: 'Prolonged omission of resistive/aerobic exercise increases musculoskeletal deconditioning risk in microgravity.'
    });
  }

  return correlations;
}
