# Telemetry Data Formats & Schema Specification — STELLAR

STELLAR supports strict CSV and JSON data ingestion with physiological range bounds checking and source provenance tagging.

---

## 1. Supported Physiological Indicators

| Metric Identifier | Human Label | Standard Unit | Valid Bounds | Default Nominal Range |
|---|---|---|---|---|
| `heart_rate` | Resting Heart Rate (RHR) | `bpm` | [30, 230] | 55 – 85 bpm |
| `spo2` | Blood Oxygen Saturation | `%` | [70, 100] | 95.0 – 100.0% |
| `sleep_duration` | Sleep Duration | `hours` | [0, 18] | 6.5 – 8.5 h |
| `activity` | Countermeasure Exercise | `mins` | [0, 360] | 60 – 150 min |
| `fatigue` | Psychomotor Fatigue Score | `scale_1_10` | [1, 10] | 1.0 – 4.0 |
| `stress` | Cognitive Stress Index | `scale_1_10` | [1, 10] | 1.0 – 4.0 |
| `core_temp` | Circadian Core Body Temp | `°C` | [34.0, 42.0] | 36.4 – 37.5 °C |

---

## 2. CSV Ingestion Format

CSV files must provide the mandatory header line. Comma separation is expected; string values may be quoted.

### Required Header
```csv
astronautId,metric,value,unit,timestamp,source,quality,notes
```

### Example Valid CSV
```csv
astronautId,metric,value,unit,timestamp,source,quality,notes
astro-01,heart_rate,64,bpm,2026-10-14T08:00:00Z,imported_csv,nominal,"Pre-exercise check"
astro-01,spo2,98.4,%,2026-10-14T08:05:00Z,imported_csv,nominal,"Cabin pO2 nominal"
astro-01,sleep_duration,7.2,hours,2026-10-14T07:00:00Z,imported_csv,nominal,"Sleep quarters actigraphy"
astro-01,activity,105,mins,2026-10-14T17:00:00Z,imported_csv,nominal,"T2 treadmill + ARED"
astro-01,fatigue,3,scale_1_10,2026-10-14T21:00:00Z,imported_csv,nominal,"Post-exercise recovery"
```

---

## 3. JSON Ingestion Format

JSON payloads can be structured either as an array of observations or an object with a `readings` key.

### Example JSON Payload
```json
{
  "readings": [
    {
      "astronautId": "astro-01",
      "metric": "heart_rate",
      "value": 78,
      "unit": "bpm",
      "timestamp": "2026-10-15T09:00:00Z",
      "source": "imported_json",
      "quality": "nominal",
      "notes": "Post-EVA recovery monitoring"
    },
    {
      "astronautId": "astro-01",
      "metric": "spo2",
      "value": 97.2,
      "unit": "%",
      "timestamp": "2026-10-15T09:05:00Z",
      "source": "imported_json",
      "quality": "nominal"
    }
  ]
}
```

---

## 4. Validation Rules & Remediation

1. **Missing Identifier:** Rows lacking `astronautId` are flagged with remediation: *"Specify astronautId (e.g., 'astro-01')'*.
2. **Unsupported Metric:** Metric types outside allowed indicators are rejected.
3. **Out-of-Bounds Values:** Values outside biological extremes (e.g., `heart_rate > 230` or `spo2 < 70%`) are caught with sensor artifact warnings.
4. **Invalid Timestamps:** Timestamps must be valid ISO 8601 strings. Future timestamps (>24h ahead) trigger temporal warnings.
5. **Deduplication:** Duplicate tuples of `[astronautId + metric + timestamp]` are rejected to prevent baseline distortion.
