import { describe, it, expect } from 'vitest';
import {
  generateHistoricalBaselineDataset,
  generateScenarioStep
} from '@/core/simulator/syntheticDataGenerator';

describe('Mission Data Simulator', () => {
  it('generates multi-day historical baseline dataset tagged explicitly as synthetic', () => {
    const { readings, wellness } = generateHistoricalBaselineDataset('astro-01', 7);

    expect(readings.length).toBeGreaterThan(20);
    expect(wellness.length).toBe(7);

    // Verify synthetic tagging provenance
    readings.forEach((r) => {
      expect(r.source).toBe('simulated');
      expect(r.quality).toBe('synthetic');
      expect(r.astronautId).toBe('astro-01');
    });

    wellness.forEach((w) => {
      expect(w.source).toBe('simulated');
      expect(w.astronautId).toBe('astro-01');
    });
  });

  it('generates Scenario 1 (Normal Mission Day) with stable nominal readings', () => {
    const step = generateScenarioStep('astro-01', 'normal', 1);
    expect(step.readings.length).toBeGreaterThan(0);

    const hr = step.readings.find((r) => r.metric === 'heart_rate');
    expect(hr).toBeDefined();
    expect(hr!.value).toBeGreaterThanOrEqual(55);
    expect(hr!.value).toBeLessThanOrEqual(75);
    expect(step.description).toContain('Stable nominal telemetry');
  });

  it('generates Scenario 2 (Sleep Disruption) with sleep deficit and fatigue spike', () => {
    const step = generateScenarioStep('astro-01', 'sleep_disruption', 2);
    expect(step.wellness).toBeDefined();

    const sleep = step.readings.find((r) => r.metric === 'sleep_duration');
    const fatigue = step.readings.find((r) => r.metric === 'fatigue');

    expect(sleep!.value).toBeLessThan(6.0);
    expect(fatigue!.value).toBeGreaterThanOrEqual(5);
    expect(step.description).toContain('Sleep Disruption');
  });

  it('generates Scenario 3 (Unusual Physiological Trend) with progressive deviation', () => {
    const step0 = generateScenarioStep('astro-01', 'unusual_trend', 0);
    const step2 = generateScenarioStep('astro-01', 'unusual_trend', 2);

    const hr0 = step0.readings.find((r) => r.metric === 'heart_rate')!.value;
    const hr2 = step2.readings.find((r) => r.metric === 'heart_rate')!.value;

    expect(hr2).toBeGreaterThan(hr0);
    expect(step2.description).toContain('Unusual Physiological Trend');
  });
});
