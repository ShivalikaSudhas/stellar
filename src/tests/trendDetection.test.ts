import { describe, it, expect } from 'vitest';
import { analyzeMetricTrend, detectMultiIndicatorCorrelations } from '@/core/analysis/trendDetection';
import { HealthBaseline, HealthReading } from '@/types';

describe('Trend Detection and Correlation Engine', () => {
  const dummyBaseline: HealthBaseline = {
    id: 'base-1',
    astronautId: 'astro-01',
    metric: 'heart_rate',
    referenceMean: 60,
    referenceMedian: 60,
    standardDeviation: 3,
    minimum: 55,
    maximum: 65,
    sampleCount: 14,
    referencePeriodStart: '2026-10-01T00:00:00Z',
    referencePeriodEnd: '2026-10-14T00:00:00Z',
    calculatedAt: '2026-10-14T00:00:00Z',
    confidenceStatus: 'reliable',
    requiredSampleCount: 7
  };

  it('detects sustained elevation and computes correct Z-score', () => {
    const readings: HealthReading[] = [
      { id: '1', astronautId: 'astro-01', metric: 'heart_rate', value: 65, unit: 'bpm', timestamp: '2026-10-15T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '2', astronautId: 'astro-01', metric: 'heart_rate', value: 66, unit: 'bpm', timestamp: '2026-10-15T04:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '3', astronautId: 'astro-01', metric: 'heart_rate', value: 68, unit: 'bpm', timestamp: '2026-10-15T08:00:00Z', source: 'sensor', quality: 'nominal' }
    ];

    const result = analyzeMetricTrend('heart_rate', readings, dummyBaseline, {
      warningStdDevThreshold: 1.5,
      urgentStdDevThreshold: 2.5,
      sustainedCount: 3
    });

    expect(result).not.toBeNull();
    expect(result?.currentValue).toBe(68);
    expect(result?.difference).toBe(8);
    expect(result?.zScore).toBeCloseTo(2.67, 1);
    expect(result?.consecutiveDeviations).toBe(3);
    expect(result?.isSustained).toBe(true);
    expect(result?.severity).toBe('urgent');
  });

  it('identifies multi-indicator cardiovascular and sleep correlation', () => {
    const trends = {
      heart_rate: {
        metric: 'heart_rate' as const,
        currentValue: 74,
        baselineMean: 62,
        stdDev: 3,
        zScore: 4.0,
        difference: 12,
        percentageChange: 19.3,
        direction: 'increasing' as const,
        isSustained: true,
        consecutiveDeviations: 3,
        severity: 'urgent' as const,
        recentReadings: [],
        dataQuality: 'synthetic' as const
      },
      sleep_duration: {
        metric: 'sleep_duration' as const,
        currentValue: 4.2,
        baselineMean: 7.4,
        stdDev: 0.5,
        zScore: -6.4,
        difference: -3.2,
        percentageChange: -43.2,
        direction: 'decreasing' as const,
        isSustained: true,
        consecutiveDeviations: 2,
        severity: 'urgent' as const,
        recentReadings: [],
        dataQuality: 'synthetic' as const
      },
      fatigue: {
        metric: 'fatigue' as const,
        currentValue: 7.5,
        baselineMean: 2.5,
        stdDev: 0.8,
        zScore: 6.2,
        difference: 5.0,
        percentageChange: 200,
        direction: 'increasing' as const,
        isSustained: true,
        consecutiveDeviations: 2,
        severity: 'urgent' as const,
        recentReadings: [],
        dataQuality: 'synthetic' as const
      }
    };

    const correlations = detectMultiIndicatorCorrelations(trends);
    expect(correlations.length).toBeGreaterThan(0);
    expect(correlations[0].summary).toContain('Cardiovascular Elevation Co-Occurring with Sleep Deficit');
    expect(correlations[0].relatedMetrics).toContain('sleep_duration');
    expect(correlations[0].caveat).toContain('temporal co-occurrence');
  });
});
