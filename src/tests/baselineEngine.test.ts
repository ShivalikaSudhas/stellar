import { describe, it, expect } from 'vitest';
import {
  calculateMean,
  calculateMedian,
  calculateStandardDeviation,
  calculateRollingAverage,
  calculatePersonalBaseline
} from '@/core/analysis/baselineEngine';
import { HealthReading } from '@/types';

describe('Personal Baseline Engine', () => {
  it('calculates statistical mean correctly', () => {
    expect(calculateMean([60, 70, 80])).toBe(70);
    expect(calculateMean([65.5, 66.5])).toBe(66);
    expect(calculateMean([])).toBe(0);
  });

  it('calculates statistical median for odd and even length series', () => {
    expect(calculateMedian([70, 60, 80])).toBe(70);
    expect(calculateMedian([60, 70, 80, 90])).toBe(75);
    expect(calculateMedian([])).toBe(0);
  });

  it('calculates sample standard deviation', () => {
    const values = [60, 62, 58, 64, 61];
    const mean = calculateMean(values);
    const sd = calculateStandardDeviation(values, mean);
    expect(sd).toBeGreaterThan(2);
    expect(sd).toBeLessThan(3);
    expect(calculateStandardDeviation([50], 50)).toBe(0);
  });

  it('calculates moving rolling averages correctly', () => {
    const values = [10, 20, 30, 40, 50];
    const rolling = calculateRollingAverage(values, 3);
    expect(rolling).toEqual([10, 15, 20, 30, 40]);
  });

  it('calculates personal baseline for specific astronaut and metric', () => {
    const mockReadings: HealthReading[] = [
      { id: '1', astronautId: 'astro-01', metric: 'heart_rate', value: 60, unit: 'bpm', timestamp: '2026-10-01T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '2', astronautId: 'astro-01', metric: 'heart_rate', value: 62, unit: 'bpm', timestamp: '2026-10-02T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '3', astronautId: 'astro-01', metric: 'heart_rate', value: 64, unit: 'bpm', timestamp: '2026-10-03T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '4', astronautId: 'astro-01', metric: 'heart_rate', value: 60, unit: 'bpm', timestamp: '2026-10-04T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '5', astronautId: 'astro-01', metric: 'heart_rate', value: 62, unit: 'bpm', timestamp: '2026-10-05T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '6', astronautId: 'astro-01', metric: 'heart_rate', value: 61, unit: 'bpm', timestamp: '2026-10-06T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '7', astronautId: 'astro-01', metric: 'heart_rate', value: 63, unit: 'bpm', timestamp: '2026-10-07T00:00:00Z', source: 'sensor', quality: 'nominal' },
      // Reading from different astronaut (must be excluded)
      { id: '8', astronautId: 'astro-02', metric: 'heart_rate', value: 85, unit: 'bpm', timestamp: '2026-10-08T00:00:00Z', source: 'sensor', quality: 'nominal' },
      // Unreliable reading (must be excluded)
      { id: '9', astronautId: 'astro-01', metric: 'heart_rate', value: 140, unit: 'bpm', timestamp: '2026-10-09T00:00:00Z', source: 'sensor', quality: 'unreliable' }
    ];

    const baseline = calculatePersonalBaseline('astro-01', 'heart_rate', mockReadings, {
      minRequiredSamples: 7
    });

    expect(baseline.astronautId).toBe('astro-01');
    expect(baseline.metric).toBe('heart_rate');
    expect(baseline.sampleCount).toBe(7);
    expect(baseline.confidenceStatus).toBe('reliable');
    expect(baseline.referenceMean).toBeCloseTo(61.71, 1);
    expect(baseline.minimum).toBe(60);
    expect(baseline.maximum).toBe(64);
  });

  it('marks baseline as insufficient_data when sample threshold is not met', () => {
    const mockReadings: HealthReading[] = [
      { id: '1', astronautId: 'astro-01', metric: 'heart_rate', value: 60, unit: 'bpm', timestamp: '2026-10-01T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '2', astronautId: 'astro-01', metric: 'heart_rate', value: 62, unit: 'bpm', timestamp: '2026-10-02T00:00:00Z', source: 'sensor', quality: 'nominal' }
    ];

    const baseline = calculatePersonalBaseline('astro-01', 'heart_rate', mockReadings, {
      minRequiredSamples: 7
    });

    expect(baseline.confidenceStatus).toBe('provisional');
    expect(baseline.sampleCount).toBe(2);

    const emptyBaseline = calculatePersonalBaseline('astro-01', 'heart_rate', []);
    expect(emptyBaseline.confidenceStatus).toBe('insufficient_data');
  });
});
