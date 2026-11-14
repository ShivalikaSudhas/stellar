import { HealthReading, HealthBaseline, MetricType } from '@/types';

export interface BaselineCalculationOptions {
  minRequiredSamples?: number;
  excludeUnreliable?: boolean;
  timeWindowDays?: number;
}

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(2));
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
  }
  return Number(sorted[mid].toFixed(2));
}

export function calculateStandardDeviation(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Number(Math.sqrt(variance).toFixed(2));
}

export function calculateRollingAverage(values: number[], windowSize: number = 3): number[] {
  if (values.length === 0 || windowSize <= 0) return [];
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const windowSlice = values.slice(start, i + 1);
    const avg = windowSlice.reduce((s, x) => s + x, 0) / windowSlice.length;
    result.push(Number(avg.toFixed(2)));
  }
  return result;
}

/**
 * Calculates personal baseline for an astronaut and metric based on valid historical readings.
 */
export function calculatePersonalBaseline(
  astronautId: string,
  metric: MetricType,
  readings: HealthReading[],
  options: BaselineCalculationOptions = {}
): HealthBaseline {
  const {
    minRequiredSamples = 7,
    excludeUnreliable = true,
    timeWindowDays
  } = options;

  // Filter strictly for this astronaut and metric
  let validReadings = readings.filter(
    (r) => r.astronautId === astronautId && r.metric === metric
  );

  // Exclude unreliable readings if configured
  if (excludeUnreliable) {
    validReadings = validReadings.filter((r) => r.quality !== 'unreliable');
  }

  // Filter by time window if specified
  if (timeWindowDays && timeWindowDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - timeWindowDays);
    validReadings = validReadings.filter((r) => new Date(r.timestamp) >= cutoff);
  }

  // Sort chronologically
  validReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const values = validReadings.map((r) => r.value);
  const sampleCount = values.length;

  let confidenceStatus: 'reliable' | 'provisional' | 'insufficient_data';
  if (sampleCount === 0) {
    confidenceStatus = 'insufficient_data';
  } else if (sampleCount < minRequiredSamples) {
    confidenceStatus = 'provisional';
  } else {
    confidenceStatus = 'reliable';
  }

  const mean = calculateMean(values);
  const median = calculateMedian(values);
  const stdDev = calculateStandardDeviation(values, mean);
  const minimum = values.length > 0 ? Math.min(...values) : 0;
  const maximum = values.length > 0 ? Math.max(...values) : 0;

  const referencePeriodStart = validReadings.length > 0 ? validReadings[0].timestamp : new Date().toISOString();
  const referencePeriodEnd = validReadings.length > 0 ? validReadings[validReadings.length - 1].timestamp : new Date().toISOString();

  return {
    id: `baseline-${astronautId}-${metric}`,
    astronautId,
    metric,
    referenceMean: mean,
    referenceMedian: median,
    standardDeviation: stdDev,
    minimum,
    maximum,
    sampleCount,
    referencePeriodStart,
    referencePeriodEnd,
    calculatedAt: new Date().toISOString(),
    confidenceStatus,
    requiredSampleCount: minRequiredSamples
  };
}

/**
 * Calculates personal baselines for all metrics for a given astronaut.
 */
export function calculateAllPersonalBaselines(
  astronautId: string,
  readings: HealthReading[],
  minRequiredSamples: Record<MetricType, number> = {
    heart_rate: 7,
    spo2: 7,
    sleep_duration: 5,
    activity: 7,
    fatigue: 5,
    stress: 5,
    core_temp: 7
  }
): Record<MetricType, HealthBaseline> {
  const metrics: MetricType[] = [
    'heart_rate',
    'spo2',
    'sleep_duration',
    'activity',
    'fatigue',
    'stress',
    'core_temp'
  ];

  const baselines: Partial<Record<MetricType, HealthBaseline>> = {};

  for (const m of metrics) {
    baselines[m] = calculatePersonalBaseline(astronautId, m, readings, {
      minRequiredSamples: minRequiredSamples[m] || 7
    });
  }

  return baselines as Record<MetricType, HealthBaseline>;
}
