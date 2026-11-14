import { describe, it, expect } from 'vitest';
import {
  evaluateAlerts,
  isDuplicateAlert,
  generateAlertExplanation
} from '@/core/alerts/alertEngine';
import { HealthAlert, HealthBaseline, HealthReading, AlertRuleConfig } from '@/types';

describe('Explainable Alert Engine', () => {
  const dummyBaseline: HealthBaseline = {
    id: 'base-hr-astro1',
    astronautId: 'astro-01',
    metric: 'heart_rate',
    referenceMean: 62,
    referenceMedian: 62,
    standardDeviation: 3,
    minimum: 57,
    maximum: 67,
    sampleCount: 14,
    referencePeriodStart: '2026-10-01T00:00:00Z',
    referencePeriodEnd: '2026-10-14T00:00:00Z',
    calculatedAt: '2026-10-14T00:00:00Z',
    confidenceStatus: 'reliable',
    requiredSampleCount: 7
  };

  const dummyRule: AlertRuleConfig = {
    id: 'rule-hr-elevated',
    metric: 'heart_rate',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 7,
    enabled: true,
    description: 'HR elevation rule'
  };

  it('generates an explainable alert when threshold is exceeded', () => {
    const readings: HealthReading[] = [
      { id: '1', astronautId: 'astro-01', metric: 'heart_rate', value: 72, unit: 'bpm', timestamp: '2026-10-15T00:00:00Z', source: 'sensor', quality: 'nominal' },
      { id: '2', astronautId: 'astro-01', metric: 'heart_rate', value: 74, unit: 'bpm', timestamp: '2026-10-15T04:00:00Z', source: 'sensor', quality: 'nominal' }
    ];

    const alerts = evaluateAlerts({
      astronautId: 'astro-01',
      readings,
      baselines: { heart_rate: dummyBaseline } as any,
      rules: [dummyRule],
      existingAlerts: []
    });

    expect(alerts.length).toBe(1);
    const alert = alerts[0];
    expect(alert.metric).toBe('heart_rate');
    expect(alert.severity).toBe('URGENT');
    expect(alert.observedValue).toBe(74);
    expect(alert.baselineValue).toBe(62);
    expect(alert.explanation).toContain('Resting Heart Rate observed at 74 bpm');
    expect(alert.explanation).toContain('crew personal baseline mean of 62 bpm');
    expect(alert.recommendedProtocol).toBeDefined();
  });

  it('suppresses duplicate unacknowledged alerts within timeframe', () => {
    const existingAlert: HealthAlert = {
      id: 'existing-1',
      astronautId: 'astro-01',
      metric: 'heart_rate',
      severity: 'WARNING',
      observedValue: 69,
      baselineValue: 62,
      deviation: 7,
      deviationType: 'elevated',
      consecutiveReadings: 2,
      explanation: 'test',
      contributingFactors: [],
      ruleId: 'rule-hr-elevated',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      recommendedProtocol: 'protocol',
      dataQuality: 'nominal'
    };

    const duplicate = isDuplicateAlert([existingAlert], 'astro-01', 'heart_rate', 'WARNING', 60);
    expect(duplicate).toBeDefined();

    // Different metric is not duplicate
    const diffMetric = isDuplicateAlert([existingAlert], 'astro-01', 'spo2', 'WARNING', 60);
    expect(diffMetric).toBeUndefined();

    // Acknowledged alert is not duplicate
    const acknowledged = isDuplicateAlert(
      [{ ...existingAlert, acknowledged: true }],
      'astro-01',
      'heart_rate',
      'WARNING',
      60
    );
    expect(acknowledged).toBeUndefined();
  });

  it('formats comprehensive non-diagnostic explanation', () => {
    const explanation = generateAlertExplanation(
      'heart_rate',
      78,
      dummyBaseline,
      16,
      3,
      ['reduced sleep duration (4.5 h)']
    );

    expect(explanation).toContain('Resting Heart Rate observed at 78 bpm');
    expect(explanation).toContain('16 bpm above the crew personal baseline mean of 62 bpm');
    expect(explanation).toContain('persisted across 3 consecutive');
    expect(explanation).toContain('reduced sleep duration (4.5 h)');
    expect(explanation).toContain('represents an operational observation, not a clinical diagnosis');
  });
});
