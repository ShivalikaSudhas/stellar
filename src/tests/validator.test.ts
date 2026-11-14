import { describe, it, expect } from 'vitest';
import { validateHealthDataset, parseCsv } from '@/core/validation/validator';

describe('Telemetry Validator and Data Provenance', () => {
  it('parses valid CSV lines into structured rows', () => {
    const csv = `astronautId,metric,value,unit,timestamp\nastro-01,heart_rate,65,bpm,2026-10-14T08:00:00Z`;
    const rows = parseCsv(csv);
    expect(rows.length).toBe(1);
    expect(rows[0].astronautId).toBe('astro-01');
    expect(rows[0].metric).toBe('heart_rate');
    expect(rows[0].value).toBe('65');
  });

  it('validates correct CSV dataset and tags source provenance', () => {
    const csv = `astronautId,metric,value,unit,timestamp,source,quality\nastro-01,heart_rate,65,bpm,2026-10-14T08:00:00Z,imported_csv,nominal`;
    const result = validateHealthDataset(csv, 'csv', 'imported_csv');
    expect(result.isValid).toBe(true);
    expect(result.validRecords.length).toBe(1);
    expect(result.validRecords[0].source).toBe('imported_csv');
    expect(result.validRecords[0].value).toBe(65);
  });

  it('detects missing fields and out-of-bounds physiological anomalies', () => {
    const invalidCsv = `astronautId,metric,value,unit,timestamp\n,heart_rate,65,bpm,2026-10-14T08:00:00Z\nastro-01,heart_rate,999,bpm,2026-10-14T09:00:00Z\nastro-01,invalid_metric,70,bpm,2026-10-14T10:00:00Z`;
    const result = validateHealthDataset(invalidCsv, 'csv');

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBe(3);

    // Row 1: Missing astronautId
    expect(result.errors.some((e) => e.field === 'astronautId')).toBe(true);

    // Row 2: Value 999 is outside physiological limits
    expect(result.errors.some((e) => e.field === 'value' && e.reason.includes('physiological limits'))).toBe(true);

    // Row 3: Invalid metric
    expect(result.errors.some((e) => e.field === 'metric')).toBe(true);
  });

  it('detects and rejects duplicate observation records', () => {
    const duplicateCsv = `astronautId,metric,value,unit,timestamp\nastro-01,heart_rate,65,bpm,2026-10-14T08:00:00Z\nastro-01,heart_rate,66,bpm,2026-10-14T08:00:00Z`;
    const result = validateHealthDataset(duplicateCsv, 'csv');

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field === 'duplicate')).toBe(true);
    expect(result.validRecords.length).toBe(1); // first valid record preserved
  });
});
