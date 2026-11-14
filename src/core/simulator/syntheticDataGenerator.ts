import { HealthReading, SimulationScenario, WellnessCheckIn } from '@/types';

// Helper for gaussian random distribution
function randomGaussian(mean: number, stdev: number): number {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdev;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export interface SyntheticDatasetOptions {
  astronautId: string;
  scenario: SimulationScenario;
  days: number;
  readingsPerDay?: number;
  includeWellness?: boolean;
}

/**
 * Generates initial historical baseline data (e.g., 7-14 days of nominal readings)
 * to establish a reliable personal baseline before anomalies occur.
 */
export function generateHistoricalBaselineDataset(
  astronautId: string,
  days: number = 14
): { readings: HealthReading[]; wellness: WellnessCheckIn[] } {
  const readings: HealthReading[] = [];
  const wellness: WellnessCheckIn[] = [];

  const baseHR = 62 + (astronautId.charCodeAt(astronautId.length - 1) % 5);
  const baseSpO2 = 98.2;
  const baseSleep = 7.4;
  const baseActivity = 105; // 105 min daily countermeasure exercise

  const now = new Date();

  for (let d = days; d >= 1; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    // Sleep reading (once per day at 07:00)
    const sleepTime = new Date(dayDate);
    sleepTime.setHours(7, 0, 0, 0);
    const sleepVal = Number(clamp(randomGaussian(baseSleep, 0.4), 6.0, 8.8).toFixed(1));
    readings.push({
      id: `sim-sleep-${astronautId}-${sleepTime.getTime()}`,
      astronautId,
      metric: 'sleep_duration',
      value: sleepVal,
      unit: 'hours',
      timestamp: sleepTime.toISOString(),
      source: 'simulated',
      quality: 'synthetic',
      notes: 'Actigraphy estimate (nominal circadian cycle)'
    });

    // Resting HR (3 times per day: 07:30, 14:00, 22:00)
    const hrHours = [7, 14, 22];
    hrHours.forEach((hour) => {
      const hrTime = new Date(dayDate);
      hrTime.setHours(hour, 30, 0, 0);
      const hrVal = Math.round(clamp(randomGaussian(baseHR, 2.5), 55, 75));
      readings.push({
        id: `sim-hr-${astronautId}-${hrTime.getTime()}`,
        astronautId,
        metric: 'heart_rate',
        value: hrVal,
        unit: 'bpm',
        timestamp: hrTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
    });

    // SpO2 (twice per day: 08:00, 20:00)
    [8, 20].forEach((hour) => {
      const spo2Time = new Date(dayDate);
      spo2Time.setHours(hour, 0, 0, 0);
      const spo2Val = Number(clamp(randomGaussian(baseSpO2, 0.4), 96.5, 99.5).toFixed(1));
      readings.push({
        id: `sim-spo2-${astronautId}-${spo2Time.getTime()}`,
        astronautId,
        metric: 'spo2',
        value: spo2Val,
        unit: '%',
        timestamp: spo2Time.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
    });

    // Activity (once per day at 17:00)
    const actTime = new Date(dayDate);
    actTime.setHours(17, 0, 0, 0);
    const actVal = Math.round(clamp(randomGaussian(baseActivity, 8), 80, 130));
    readings.push({
      id: `sim-act-${astronautId}-${actTime.getTime()}`,
      astronautId,
      metric: 'activity',
      value: actVal,
      unit: 'mins',
      timestamp: actTime.toISOString(),
      source: 'simulated',
      quality: 'synthetic'
    });

    // Wellness check-in (once per day at 21:30)
    const wellTime = new Date(dayDate);
    wellTime.setHours(21, 30, 0, 0);
    wellness.push({
      id: `sim-well-${astronautId}-${wellTime.getTime()}`,
      astronautId,
      timestamp: wellTime.toISOString(),
      sleepQuality: 4,
      fatigue: Math.round(clamp(randomGaussian(2.5, 0.8), 1, 4)),
      stress: Math.round(clamp(randomGaussian(2.2, 0.6), 1, 4)),
      mood: 4,
      discomfort: 1,
      source: 'simulated',
      notes: 'Nominal mission ops schedule. Countermeasures completed.'
    });

    // Also push fatigue and stress as metric readings for analytics trends
    readings.push({
      id: `sim-fatigue-${astronautId}-${wellTime.getTime()}`,
      astronautId,
      metric: 'fatigue',
      value: Math.round(clamp(randomGaussian(2.5, 0.8), 1, 4)),
      unit: 'scale_1_10',
      timestamp: wellTime.toISOString(),
      source: 'simulated',
      quality: 'synthetic'
    });
    readings.push({
      id: `sim-stress-${astronautId}-${wellTime.getTime()}`,
      astronautId,
      metric: 'stress',
      value: Math.round(clamp(randomGaussian(2.2, 0.6), 1, 4)),
      unit: 'scale_1_10',
      timestamp: wellTime.toISOString(),
      source: 'simulated',
      quality: 'synthetic'
    });
  }

  return { readings, wellness };
}

/**
 * Generates incremental synthetic step readings for live simulation scenarios.
 */
export function generateScenarioStep(
  astronautId: string,
  scenario: SimulationScenario,
  stepIndex: number,
  baseTimestamp: Date = new Date()
): { readings: HealthReading[]; wellness?: WellnessCheckIn; description: string } {
  const stepTime = new Date(baseTimestamp.getTime() + stepIndex * 4 * 60 * 60 * 1000); // each step represents 4 hours
  const readings: HealthReading[] = [];
  let description = '';

  const baseHR = 63;
  const baseSpO2 = 98.0;

  switch (scenario) {
    case 'normal': {
      // Nominal stable state
      const hr = Math.round(clamp(randomGaussian(baseHR, 2), 58, 68));
      const spo2 = Number(clamp(randomGaussian(baseSpO2, 0.3), 97.2, 99.2).toFixed(1));
      const fatigue = Number(clamp(randomGaussian(2.5, 0.5), 1, 4).toFixed(1));

      readings.push({
        id: `step-${astronautId}-hr-${stepTime.getTime()}`,
        astronautId,
        metric: 'heart_rate',
        value: hr,
        unit: 'bpm',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-spo2-${stepTime.getTime()}`,
        astronautId,
        metric: 'spo2',
        value: spo2,
        unit: '%',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-fatigue-${stepTime.getTime()}`,
        astronautId,
        metric: 'fatigue',
        value: Number(fatigue),
        unit: 'scale_1_10',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });

      description = `Step ${stepIndex + 1}: Stable nominal telemetry. Heart rate ${hr} bpm, SpO2 ${spo2}%.`;
      break;
    }

    case 'sleep_disruption': {
      // Progressive sleep loss and fatigue accumulation
      const sleepHours = Math.max(3.2, Number((7.2 - stepIndex * 0.9).toFixed(1)));
      const fatigueScore = Math.min(9, Math.round(3 + stepIndex * 1.5));
      const hrElevation = Math.round(baseHR + stepIndex * 3.5);
      const stressScore = Math.min(8, Math.round(2.5 + stepIndex * 1.2));

      readings.push({
        id: `step-${astronautId}-sleep-${stepTime.getTime()}`,
        astronautId,
        metric: 'sleep_duration',
        value: sleepHours,
        unit: 'hours',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-fatigue-${stepTime.getTime()}`,
        astronautId,
        metric: 'fatigue',
        value: fatigueScore,
        unit: 'scale_1_10',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-hr-${stepTime.getTime()}`,
        astronautId,
        metric: 'heart_rate',
        value: hrElevation,
        unit: 'bpm',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-stress-${stepTime.getTime()}`,
        astronautId,
        metric: 'stress',
        value: stressScore,
        unit: 'scale_1_10',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });

      const wellness: WellnessCheckIn = {
        id: `step-${astronautId}-well-${stepTime.getTime()}`,
        astronautId,
        timestamp: stepTime.toISOString(),
        sleepQuality: Math.max(1, 5 - stepIndex),
        fatigue: fatigueScore,
        stress: stressScore,
        mood: Math.max(1, 4 - stepIndex),
        discomfort: Math.min(7, 1 + stepIndex),
        discomfortLocation: stepIndex >= 2 ? 'Headache / Eyestrain' : undefined,
        notes: `Simulated Sleep Disruption cycle step ${stepIndex + 1}. Circadian sleep curtailment recorded.`,
        source: 'simulated'
      };

      description = `Step ${stepIndex + 1} (Sleep Disruption): Sleep curtailed to ${sleepHours}h, fatigue risen to ${fatigueScore}/10, RHR elevated to ${hrElevation} bpm.`;
      return { readings, wellness, description };
    }

    case 'unusual_trend': {
      // Acute cardiovascular deviation and subtle desaturation
      // Step 0: hr ~ 64, spo2 98.0
      // Step 1: hr ~ 72, spo2 97.1
      // Step 2: hr ~ 81, spo2 96.0
      // Step 3: hr ~ 91, spo2 94.6 (Trigger urgent alert)
      const hrDev = Math.round(baseHR + (stepIndex + 1) * 7.5);
      const spo2Dev = Number(Math.max(92.0, baseSpO2 - (stepIndex + 1) * 0.9).toFixed(1));
      const activityDev = Math.max(30, Math.round(110 - (stepIndex + 1) * 22));

      readings.push({
        id: `step-${astronautId}-hr-${stepTime.getTime()}`,
        astronautId,
        metric: 'heart_rate',
        value: hrDev,
        unit: 'bpm',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-spo2-${stepTime.getTime()}`,
        astronautId,
        metric: 'spo2',
        value: spo2Dev,
        unit: '%',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });
      readings.push({
        id: `step-${astronautId}-activity-${stepTime.getTime()}`,
        astronautId,
        metric: 'activity',
        value: activityDev,
        unit: 'mins',
        timestamp: stepTime.toISOString(),
        source: 'simulated',
        quality: 'synthetic'
      });

      description = `Step ${stepIndex + 1} (Unusual Physiological Trend): RHR progressively climbed to ${hrDev} bpm (+${hrDev - baseHR} bpm vs baseline), SpO2 dropped to ${spo2Dev}%.`;
      break;
    }
  }

  return { readings, description };
}
