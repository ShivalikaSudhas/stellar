# System Architecture — STELLAR

## 1. Architectural Philosophy
STELLAR (**Spaceflight Telemetry, Evaluation, Longitudinal Longevity & Anomaly Recognition**) is engineered as an **offline-first, zero-cloud, client-side operational health intelligence platform** for deep space missions (e.g., Artemis lunar surface stays and Mars transit).

```mermaid
flowchart TD
    subgraph Cabin Sensors & Inputs
        HW[Cabin Telemetry Sensors]
        CSV[External CSV / JSON Data]
        CREW[Daily Crew Wellness Input]
        SIM[Mission Scenario Simulator]
    end

    subgraph Data & Validation Layer
        VAL[Schema & Physiological Validator]
        PROV[Source Provenance Tracker]
    end

    subgraph Storage Layer (Offline-First)
        IDB[(IndexedDB via Dexie.js)]
        SW[Service Worker Asset Cache]
    end

    subgraph Analysis & Intelligence Core
        BASE[Personal Baseline Engine\n(μ, Median, σ, Bounds)]
        TREND[Multi-Indicator Trend Detector\n(Z-Score, Consecutive Shifts)]
        ALERT[Explainable Alert Generator\n(Duplicate Suppression)]
    end

    subgraph User Experience Layer
        DASH[Mission Overview Dashboard]
        CHARTS[Recharts Longitudinal Trends]
        BASE_UI[Personal Baseline Matrix]
        ALERT_UI[Alert Triage & Trace Viewer]
        WELL_UI[Psychomotor Wellness Form]
        REP_UI[Mission Report & PDF Export]
    end

    HW --> VAL
    CSV --> VAL
    CREW --> PROV
    SIM --> PROV
    VAL --> PROV
    PROV --> IDB
    SW --> DASH

    IDB <--> BASE
    IDB <--> TREND
    BASE --> ALERT
    TREND --> ALERT
    ALERT --> IDB

    IDB --> DASH
    IDB --> CHARTS
    IDB --> BASE_UI
    IDB --> ALERT_UI
    IDB --> WELL_UI
    IDB --> REP_UI
```

## 2. Component Subsystems

### 2.1 Storage & Local Persistence
- **Database Engine:** IndexedDB managed through Dexie.js (`StellarAstronautHealthDB`).
- **Tables:**
  - `astronauts`: Individual crew member profiles, callsigns, roles, and mission IDs.
  - `readings`: Time-series observations tagged with `astronautId`, `metric`, `value`, `timestamp`, `source`, `quality`.
  - `baselines`: Stored reference metrics (`referenceMean`, `standardDeviation`, `confidenceStatus`, `sampleCount`).
  - `alerts`: Deterministic alerts with full qualitative and quantitative supporting explanation.
  - `wellness`: Subjective psychomotor, sleep, fatigue, stress, and discomfort check-ins.
  - `alertRules`: Flight monitoring thresholds (warning σ, urgent σ, sustained counts).

### 2.2 Offline PWA Shell
- Asset precaching configured with `vite-plugin-pwa` and Workbox.
- Enables complete standalone operation inside spacecraft cabins with zero external internet dependencies.

### 2.3 Mathematical Baseline Engine
- Calculates individual historical parameters:
  $$\mu = \frac{1}{N} \sum_{i=1}^N x_i$$
  $$s^2 = \frac{1}{N - 1} \sum_{i=1}^N (x_i - \mu)^2$$
  $$\sigma = \sqrt{s^2}$$
  $$Z = \frac{x_{\text{observed}} - \mu}{\sigma}$$
- Refuses to establish a reliable baseline until meeting configurable sample threshold (default 7 samples).
- Does not cross-contaminate profiles between crew members.

### 2.4 Multi-Indicator Correlation Engine
- Temporal correlation across overlapping observation windows:
  - Sleep Curtailment ($\Delta \text{Sleep} < -1.0\text{h}$) + Cardiovascular Strain ($\Delta \text{RHR} > 1.5\sigma$) + Subjective Fatigue ($\ge 6/10$).
  - Peripheral Desaturation ($\text{SpO}_2 < 95\%$) + Compensatory Tachycardia ($\Delta \text{RHR} > 0$).
  - Countermeasure reduction ($\Delta \text{Activity} < -20\text{min}$) + Musculoskeletal fatigue.
