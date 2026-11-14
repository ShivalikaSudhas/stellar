import { HealthReading, MetricType, QualityStatus } from '@/types';

export interface ValidationError {
  row: number;
  field: string;
  value: unknown;
  reason: string;
  remediation: string;
}

export interface ValidationResult {
  isValid: boolean;
  totalRecords: number;
  validRecords: HealthReading[];
  errors: ValidationError[];
  warnings: string[];
  summary: {
    validCount: number;
    errorCount: number;
    metricsDetected: string[];
    astronautsDetected: string[];
  };
}

export const ALLOWED_METRICS: Record<MetricType, { units: string[]; min: number; max: number }> = {
  heart_rate: { units: ['bpm', 'beats/min'], min: 30, max: 230 },
  blood_pressure_sys: { units: ['mmHg', 'mmhg'], min: 70, max: 240 },
  blood_pressure_dia: { units: ['mmHg', 'mmhg'], min: 40, max: 140 },
  glucose: { units: ['mg/dL', 'mg/dl'], min: 40, max: 500 },
  spo2: { units: ['%', 'percent'], min: 70, max: 100 },
  sleep_duration: { units: ['hours', 'h', 'hrs'], min: 0, max: 18 },
  activity: { units: ['mins', 'min', 'minutes'], min: 0, max: 360 },
  weight: { units: ['kg', 'lbs'], min: 20, max: 300 },
  temperature: { units: ['°C', 'celsius', 'C'], min: 32.0, max: 43.0 },
  fatigue: { units: ['scale_1_10', '1-10', 'pts'], min: 1, max: 10 },
  stress: { units: ['scale_1_10', '1-10', 'pts'], min: 1, max: 10 },
  core_temp: { units: ['°C', 'celsius', 'C'], min: 34.0, max: 42.0 }
};

export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Support basic comma separation with quoted strings
    const values: string[] = [];
    let inQuotes = false;
    let current = '';

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] ?? '';
    });
    rows.push(rowObj);
  }

  return rows;
}

export function validateHealthDataset(
  rawData: unknown,
  format: 'csv' | 'json',
  sourceTag: 'imported_csv' | 'imported_json' = 'imported_csv'
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  const validRecords: HealthReading[] = [];
  const seenKeys = new Set<string>();

  let records: Record<string, unknown>[] = [];

  if (format === 'csv') {
    if (typeof rawData !== 'string') {
      return {
        isValid: false,
        totalRecords: 0,
        validRecords: [],
        errors: [{
          row: 0,
          field: 'file',
          value: null,
          reason: 'Input must be a valid CSV text string.',
          remediation: 'Provide raw plaintext CSV data.'
        }],
        warnings: [],
        summary: { validCount: 0, errorCount: 1, metricsDetected: [], astronautsDetected: [] }
      };
    }
    records = parseCsv(rawData);
  } else {
    if (typeof rawData === 'string') {
      try {
        records = JSON.parse(rawData);
      } catch (err: unknown) {
        return {
          isValid: false,
          totalRecords: 0,
          validRecords: [],
          errors: [{
            row: 0,
            field: 'json',
            value: null,
            reason: `JSON parsing syntax error: ${err instanceof Error ? err.message : 'Invalid JSON'}`,
            remediation: 'Verify valid JSON syntax formatting.'
          }],
          warnings: [],
          summary: { validCount: 0, errorCount: 1, metricsDetected: [], astronautsDetected: [] }
        };
      }
    } else if (Array.isArray(rawData)) {
      records = rawData as Record<string, unknown>[];
    } else if (rawData && typeof rawData === 'object') {
      // If object with 'readings' array
      const obj = rawData as { readings?: Record<string, unknown>[] };
      if (Array.isArray(obj.readings)) {
        records = obj.readings;
      } else {
        records = [rawData as Record<string, unknown>];
      }
    }
  }

  if (!Array.isArray(records) || records.length === 0) {
    return {
      isValid: false,
      totalRecords: 0,
      validRecords: [],
      errors: [{
        row: 0,
        field: 'data',
        value: null,
        reason: 'Dataset is empty or does not contain records.',
        remediation: 'Upload a file containing at least one telemetry observation row.'
      }],
      warnings: [],
      summary: { validCount: 0, errorCount: 1, metricsDetected: [], astronautsDetected: [] }
    };
  }

  const metricsSet = new Set<string>();
  const astronautsSet = new Set<string>();

  records.forEach((row, index) => {
    const rowNum = index + 1;
    let rowHasError = false;

    // Check astronautId
    const astronautId = String(row.astronautId || row.astronaut_id || row.crewId || '').trim();
    if (!astronautId) {
      errors.push({
        row: rowNum,
        field: 'astronautId',
        value: row.astronautId,
        reason: 'Missing astronaut identifier.',
        remediation: 'Specify astronautId (e.g., "astro-01").'
      });
      rowHasError = true;
    } else {
      astronautsSet.add(astronautId);
    }

    // Check metric
    const rawMetric = String(row.metric || row.indicator || row.type || '').trim().toLowerCase();
    const metric = rawMetric as MetricType;
    if (!rawMetric || !ALLOWED_METRICS[metric]) {
      errors.push({
        row: rowNum,
        field: 'metric',
        value: row.metric,
        reason: `Invalid or unsupported metric "${rawMetric}".`,
        remediation: `Use one of: ${Object.keys(ALLOWED_METRICS).join(', ')}.`
      });
      rowHasError = true;
    } else {
      metricsSet.add(metric);
    }

    // Check value
    const rawValue = row.value !== undefined ? row.value : row.reading;
    const numValue = Number(rawValue);
    if (rawValue === undefined || rawValue === '' || isNaN(numValue) || !isFinite(numValue)) {
      errors.push({
        row: rowNum,
        field: 'value',
        value: rawValue,
        reason: `Numeric value is missing or not a valid finite number.`,
        remediation: 'Provide a valid numeric measurement.'
      });
      rowHasError = true;
    } else if (ALLOWED_METRICS[metric]) {
      const bounds = ALLOWED_METRICS[metric];
      if (numValue < bounds.min || numValue > bounds.max) {
        errors.push({
          row: rowNum,
          field: 'value',
          value: numValue,
          reason: `Value ${numValue} is outside physiological limits (${bounds.min} - ${bounds.max}) for ${metric}.`,
          remediation: `Verify sensor calibration or remove anomalous artifact.`
        });
        rowHasError = true;
      }
    }

    // Check timestamp
    const rawTime = String(row.timestamp || row.time || row.date || '').trim();
    const parsedTime = Date.parse(rawTime);
    if (!rawTime || isNaN(parsedTime)) {
      errors.push({
        row: rowNum,
        field: 'timestamp',
        value: row.timestamp,
        reason: 'Timestamp is missing or cannot be parsed as a valid date.',
        remediation: 'Provide an ISO 8601 formatted timestamp (e.g., "2026-10-12T14:30:00Z").'
      });
      rowHasError = true;
    } else {
      const now = Date.now();
      const readingTime = new Date(parsedTime).getTime();
      // Future date check (> 24h ahead)
      if (readingTime > now + 24 * 60 * 60 * 1000) {
        warnings.push(`Row ${rowNum}: Timestamp ${rawTime} is in the future.`);
      }
    }

    // Duplicate detection
    const dedupKey = `${astronautId}:${metric}:${rawTime}`;
    if (seenKeys.has(dedupKey)) {
      errors.push({
        row: rowNum,
        field: 'duplicate',
        value: dedupKey,
        reason: 'Duplicate observation detected (identical astronaut, metric, and timestamp).',
        remediation: 'Ensure observation timestamps are unique per astronaut and metric.'
      });
      rowHasError = true;
    } else {
      seenKeys.add(dedupKey);
    }

    // Check unit compatibility
    const unit = String(row.unit || (metric && ALLOWED_METRICS[metric]?.units[0]) || '').trim();

    // Data quality check
    let quality: QualityStatus = 'nominal';
    const rawQuality = String(row.quality || '').toLowerCase();
    if (rawQuality === 'degraded' || rawQuality === 'unreliable' || rawQuality === 'synthetic') {
      quality = rawQuality;
    }

    if (!rowHasError) {
      validRecords.push({
        id: `reading-${astronautId}-${metric}-${parsedTime}-${Math.floor(Math.random() * 1000)}`,
        astronautId,
        metric,
        value: numValue,
        unit,
        timestamp: new Date(parsedTime).toISOString(),
        source: sourceTag,
        quality,
        deviceId: row.deviceId ? String(row.deviceId) : undefined,
        notes: row.notes ? String(row.notes) : undefined
      });
    }
  });

  return {
    isValid: errors.length === 0,
    totalRecords: records.length,
    validRecords,
    errors,
    warnings,
    summary: {
      validCount: validRecords.length,
      errorCount: errors.length,
      metricsDetected: Array.from(metricsSet),
      astronautsDetected: Array.from(astronautsSet)
    }
  };
}
