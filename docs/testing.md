# Verification & Testing Protocol — STELLAR

## 1. Test Architecture
The test suite is built on **Vitest** and **React Testing Library**, validating all core computational units, data generation scenarios, and boundary limits.

```bash
# Execute unit test suite
npm test

# Run tests in continuous watch mode
npm run test:watch
```

---

## 2. Test Suites Summary

| Test File | Tests | Coverage Scope | Status |
|---|---|---|---|
| `src/tests/baselineEngine.test.ts` | 6 tests | Mean, median (odd/even), std dev, rolling averages, profile isolation, minimum sample threshold | PASSED |
| `src/tests/trendDetection.test.ts` | 2 tests | Z-Score calculation, sustained direction, multi-indicator temporal correlation | PASSED |
| `src/tests/alertEngine.test.ts` | 3 tests | Alert threshold triggering, duplicate suppression, explainable narrative synthesis | PASSED |
| `src/tests/validator.test.ts` | 4 tests | CSV/JSON parsing, missing field checks, physiological out-of-bounds, duplicate detection | PASSED |
| `src/tests/simulator.test.ts` | 4 tests | Multi-day baseline dataset synthesis, Scenarios 1, 2, 3 verification, synthetic tagging | PASSED |

Total: **19 / 19 tests passing**.

---

## 3. End-to-End Functional Verification Matrix

- [x] **Local Persistence:** Data persists in IndexedDB across browser reloads without server interaction.
- [x] **Offline Standalone:** Progressive Web App shell caches all assets; application functions with network disconnected.
- [x] **Personal Baseline Recalculation:** Adding new telemetry immediately updates the personal baseline mean and deviation bands.
- [x] **Scenario 1 (Normal Mission Day):** Generates stable readings around baseline; no false positive alerts.
- [x] **Scenario 2 (Sleep Disruption):** Decreases sleep to <5.5h, increases fatigue to 7/10, and generates an explainable WARNING alert.
- [x] **Scenario 3 (Unusual Physiological Trend):** Climbs heart rate across consecutive steps (>2.5σ), triggering an URGENT alert with persistence tracking.
- [x] **Export Engines:** Telemetry and Alerts CSVs download immediately; Mission Health Report prints or saves to PDF.
