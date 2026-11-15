# STELLAR — Spaceflight Telemetry, Evaluation, Longitudinal Longevity & Anomaly Recognition
### Autonomous Offline-First Astronaut & Personal Health Intelligence System

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-blue.svg)](https://www.spaceappschallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-19%2F19%20passing-brightgreen.svg)]()
[![Offline First](https://img.shields.io/badge/offline-IndexedDB%20%2B%20PWA%20Ready-cyan.svg)]()
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)]()

> **NASA Space Apps Challenge 2026 | Astronaut Health Monitoring Software**  
> An autonomous, offline-first operational health intelligence system tailored for deep-space long-duration spaceflight (Artemis Lunar Base & Mars Transit) and comprehensive personalized longitudinal health monitoring.

---

## 1. Project Overview & Vision

During long-duration space missions beyond Low Earth Orbit, crew members endure prolonged microgravity-related physiological adaptations (fluid cephalic shifts, cardiovascular deconditioning, circadian rhythm disruption, and bone-mineral density loss) while operating under severe communication delays with Earth (up to 22 minutes one-way latency to Mars).

Traditional terrestrial health tracking systems fail in this environment:
1. **Generic Static Cutoffs:** They evaluate astronauts against fixed population reference bands rather than learning the individual's personalized adaptive normal.
2. **Cloud Dependency:** They rely on always-on external backends and cloud APIs unavailable in deep space.
3. **Opaque Outputs:** They generate unexplained "black-box" risk scores without providing mathematically verifiable traceability to flight rules and operational protocols.

**STELLAR** is engineered from the ground up to address both deep-space operational telemetry needs and modern personal health monitoring:
- **Personal Baseline Learning:** Automatically calculates statistical norms ($\mu, M, \sigma$, min, max, rolling windows) exclusively from each individual's valid historical telemetry with rigorous confidence assessment.
- **Cause-and-Effect Discovery:** Empirically maps the temporal chains connecting sleep quality, dietary macronutrients, cognitive stress, and physiological responses (e.g., `[Sleep Fragmentation] ➔ [Sympathetic Stress ↑] ➔ [Morning HR Spike]`).
- **Explainable Non-Diagnostic Alerts:** Deterministic, rule-governed alerts with complete mathematical provenance, co-occurring indicator correlation, and actionable operational mitigation protocols.
- **Dual Visual Architectures (Mobile & Laptop):** Faithfully implements both a mobile phone interface (featuring the signature woven plaid navy card, 72 bpm live ECG waveform, and 12-screen Orbital Flow) and a laptop dashboard (with linked clinicians, calendar schedule, and 3 circular progress rings).
- **Darker High-Contrast Ink Typography:** Crisp, readable ink typography (`#060A14`, `#0F172A`) paired with classic serif typography (`Lora`) on sculpted ivory and white cards for maximum legibility under varying lighting conditions.
- **100% Offline-First Operation:** Local persistence via IndexedDB (Dexie.js) paired with a Progressive Web App (PWA) service worker cache. Zero cloud APIs, zero external AI keys required.

---

## 2. Dual User Experience & Layout Architecture

STELLAR features a persistent, top-level **Interface Mode Switcher** allowing instant transitions between specialized device viewports and clinical roles:

```mermaid
flowchart TD
    App[Global Interface Mode Switcher] --> V1[📱 Astronaut Mobile Terminal]
    App --> V2[💻 Astronaut Laptop Workstation]
    App --> V3[📊 NASA Mission Telemetry Console]
    App --> V4[🩺 Doctor Console]

    subgraph Astronaut Terminal Views
        V1 --> M1[Pulse Daily View\n(Plaid Navy Card, 72 bpm ECG, Dark Font Vitals)]
        V1 --> M2[Orbital 12-Flow System\n(Rotating 3D Earth, Telemetry Gauge, Sleep, Trends)]
        V2 --> L1[Habitat Workstation Grid\n(Linked Clinicians, Calendar, 3 Circular Countermeasure Rings)]
    end

    subgraph Mission Control & Clinical Consoles
        V3 --> N1[Mission Overview & Personal Baseline Engine\n(Z-score deviations, Trend correlations, Anomaly simulator)]
        V4 --> D1[Doctor Triage & Clinical Notes\n(High/Moderate/Stable urgency, Clinical instructions, Recommendations, SOS)]
    end
```

### A. Mobile Phone Experience
Located in [`src/components/layout/MobilePhoneView.tsx`](file:///d:/STELLAR/src/components/layout/MobilePhoneView.tsx):
- **Pulse Daily View (Signature Home Screen):**
  - **Status & App Header:** Realistic status bar (`10:57`, `Vo LTE`, `61% battery`), header with share, messages, and menu icons.
  - **Plaid Navy Signature Card:** Deep navy gingham pattern card featuring:
    - *"Good morning, Asha."* in bold white serif typography.
    - Clinical context note: *"Grab your coffee and take it slow. Your blood pressure is a little above your own normal today, and everything else looks steady."*
    - **72 bpm** readout: Large 50px bold serif numeral with live animated ECG cardiac waveform.
  - **"Your vitals" Section:** Set in bold dark ink serif typography (`#060A14`).
  - **White Vitals Cards:** High-contrast dark typography with sparkline wave curves and status indicators:
    - *Heart Rate:* `72 bpm` • `Normal` (tap to open interactive 30-day drilldown).
    - *Blood Pressure:* `124/82 mmHg` • `A little above your own normal`.
    - *Blood Oxygen (SpO2):* `98%` • `Normal baseline`.
    - *Sleep Duration:* `7.8 hrs` • `Restful recovery`.
  - **Floating Pill Bottom Navigation:** White floating bar with dark active button:
    `Today` | `Insights` | `Log (+)` | `Care` | `Privacy`.
- **Orbital 12-Flow View:**
  - 1-click toggle to the complete 12-screen orbital mission suite:
    1. *Welcome back, Astronaut* (Mission Day 42, rotating 3D Earth orbit, *"All systems nominal"* pill).
    2. *Vitals Telemetry* (72 bpm gauge, BP, SpO2, Temp, 1D/1W/1M/1Y tabs, live AreaChart).
    3. *Sleep Quality* (7h 48m, deep/light/REM stages, bar charts, sleep insights).
    4. *Trends* (Heart rate +2%, SpO2 0%, Temp +0.1%, key clinical findings).
    5. *Health Insights* (Cause-and-Effect flowchart: `[Sleep ↓] ➔ [Stress ↑] ➔ [HR ↑]`).
    6. *Care Plan* (Active medication adherence checklist, exercise countermeasures, diet plan).
    7. *Messages* (Doctor notes, flight surgeon advisories, system notifications).
    8. *Profile* (Astronaut Asha / Patel, emergency contacts, privacy settings).
    9. *Emergency SOS* (Location beacon, primary contact dispatch).
    10. *Data Access Privacy* (Medical team, family member, research use toggles).

---

### B. Laptop / Desktop Dashboard Experience
Located in [`src/components/layout/LaptopDashboardView.tsx`](file:///d:/STELLAR/src/components/layout/LaptopDashboardView.tsx):
- **Left Sidebar:** Brand badge, user avatar card (`Asha Sharma • Patient / Astronaut`), vertical navigation links, and Emergency SOS button.
- **Top Header Bar:** `HELLO, ASHA!` in uppercase bold serif typography, search bar for vitals/meds, and instant biomarker triggers (*Voice*, *Camera rPPG*, *Food Photo*).
- **Middle Column:**
  - **Linked Clinicians:** Cards for Dr. Rajesh Mehta (Lead Cardiologist), Dr. Priya Patel (Flight Surgeon), and Dr. Kevin Vance (Exercise Physiologist) with direct messaging actions.
  - **Upcoming Clinical Events:** Monthly telehealth reviews and glucose calibration schedules.
  - **Care Protocol Schedule:** Interactive mini calendar and daily schedule agenda items (T2 Treadmill, hydration checks, resistance mobility).
  - **Live Vitals Matrix:** Pulse rate, blood pressure, and SpO2 cards.
- **Right Column (3 Circular Progress Rings):**
  - **Medication Adherence (90%):** Circular SVG ring with morning dose verification.
  - **Daily Countermeasures (60%):** Circular SVG ring tracking 25/45 active minutes completed.
  - **Sleep Recovery Score (75%):** Circular SVG ring tracking rest duration.

---

### C. Doctor & Mission Operations Consoles
- **Doctor Console View** ([`DoctorView.tsx`](file:///d:/STELLAR/src/features/doctor/DoctorView.tsx)): Comprehensive clinical console for attending doctors. Features:
  - **Physician Detail:** Doctor profile, credentials (MD, FACC), license ID, and active telemetry sync status.
  - **Patient Info:** Complete astronaut medical profile (callsign, mission, blood type, age, primary condition) and latest vitals matrix (HR, BP, SpO₂, protocol adherence).
  - **Urgency Triage (High, Moderate, Stable):** Visual color-coded triage badges and quick filters to prioritize crew members requiring immediate intervention.
  - **Clinical Note Instructions:** Structured guidance for recording clinical observations and operational duty modifications.
  - **Recommendations for Patients (with 'Why is that' rationale):** Prescribed countermeasures (exercise, hydration, circadian) paired with explicit physiological justifications explaining zero-G adaptation.
  - **Medical SOS Alert:** Direct trigger to dispatch high-priority emergency medical beacons to the astronaut's terminal.
- **Mission Telemetry Console** (Original NASA Space Apps Operational Suite): Full engineering suite featuring personal baseline engines, multi-indicator trend analytics, mission data simulator, CSV/JSON schema validator, and downloadable PDF/CSV flight health reports.

---

## 3. Complete Feature Matrix (23+ Capabilities)

| Category | Feature | Description & Implementation |
|---|---|---|
| **Data Collection** | **Multi-Metric Telemetry** | Tracks Resting HR, Systolic/Diastolic BP, Fasting Glucose, $\text{SpO}_2$, Sleep, Physical Activity, Body Weight, Temperature, and ECG. |
| **Data Collection** | **Camera-Based Vitals (rPPG)** | Contactless photoplethysmography pulse & respiratory scanner using optical facial blood volume variations ([`CameraVitalsModal.tsx`](file:///d:/STELLAR/src/components/features/CameraVitalsModal.tsx)). |
| **Data Collection** | **Voice Biomarkers** | 5-second acoustic analysis extracting simulated pitch, jitter, shimmer, respiration rate, and voice fatigue score ([`VoiceBiomarkerModal.tsx`](file:///d:/STELLAR/src/components/features/VoiceBiomarkerModal.tsx)). |
| **Data Collection** | **Food Photo Logging** | Visual meal logging with automated macronutrient breakdown and glycemic spike risk estimation ([`FoodPhotoModal.tsx`](file:///d:/STELLAR/src/components/features/FoodPhotoModal.tsx)). |
| **Data Collection** | **Manual Vital Logging** | Fast, flexible manual entry modal for crew self-reporting ([`LogVitalModal.tsx`](file:///d:/STELLAR/src/components/features/LogVitalModal.tsx)). |
| **Intelligence** | **Personal Baseline Engine** | Individualized statistical calculations ($\mu, M, \sigma$, min, max, rolling average) with confidence status requiring 7+ valid samples ([`baselineEngine.ts`](file:///d:/STELLAR/src/core/analysis/baselineEngine.ts)). |
| **Intelligence** | **Cause-and-Effect Discovery** | Analyzes multi-factor temporal correlations across sleep fragmentation, high-carb intake, workload stress, and subsequent blood pressure / pulse spikes ([`causeAndEffectEngine.ts`](file:///d:/STELLAR/src/core/analysis/causeAndEffectEngine.ts)). |
| **Intelligence** | **Trend & Anomaly Detection** | Z-score statistical trend tracking with multi-indicator correlation ([`trendDetection.ts`](file:///d:/STELLAR/src/core/analysis/trendDetection.ts)). |
| **Intelligence** | **Explainable Alert Engine** | Deterministic rule engine producing transparent observations, personal baseline deviations, persistence tracking, and operational action protocols ([`alertEngine.ts`](file:///d:/STELLAR/src/core/alerts/alertEngine.ts)). |
| **Care & Support** | **Care Plan & Adherence** | Doctor-prescribed diet plans, exercise countermeasure schedules, daily medication adherence, and side-effect reporting ([`CarePlanView.tsx`](file:///d:/STELLAR/src/features/careplan/CarePlanView.tsx)). |
| **Care & Support** | **Doctor Console View** | Urgency-sorted crew triage list (`high`, `moderate`, `stable`), physician detail, longitudinal vitals timeline, clinical instructions, and patient recommendations with physiological rationale ([`DoctorView.tsx`](file:///d:/STELLAR/src/features/doctor/DoctorView.tsx)). |
| **Care & Support** | **1-Page Doctor Brief** | Comprehensive pre-visit summary optimized for clinical review and printing (`window.print()`) ([`DoctorSummaryModal.tsx`](file:///d:/STELLAR/src/components/features/DoctorSummaryModal.tsx)). |
| **Safety & Security** | **Emergency SOS Trigger** | 5-second countdown modal with automatic beacon dispatch simulation to mission control and primary family contacts ([`EmergencySosModal.tsx`](file:///d:/STELLAR/src/components/features/EmergencySosModal.tsx)). |
| **Safety & Security** | **Data Access & Privacy** | Crew data ownership dashboard allowing toggleable permissions for medical teams, family members, and research use. |
| **Data & Integrations** | **Full History Drilldown** | Tapping any vital opens a 30-day interactive Recharts chart with baseline envelope bands ($\mu \pm 2\sigma$) ([`VitalHistoryModal.tsx`](file:///d:/STELLAR/src/components/common/VitalHistoryModal.tsx)). |
| **Data & Integrations** | **CSV / JSON Ingestion** | Comprehensive schema validation, unit verification, and error remediation ([`validator.ts`](file:///d:/STELLAR/src/core/validation/validator.ts)). |
| **Data & Integrations** | **Mission Health Reports** | Multi-window health report generation with CSV telemetry download and PDF export ([`MissionReportsPage.tsx`](file:///d:/STELLAR/src/features/reports/MissionReportsPage.tsx)). |
| **Data & Integrations** | **Mission Data Simulator** | Interactive playback of 3 demonstration scenarios (Normal Day, Sleep Disruption, Unusual Physiological Trend) ([`SimulatorPage.tsx`](file:///d:/STELLAR/src/features/simulator/SimulatorPage.tsx)). |
| **Platform Essentials**| **100% Offline-First** | IndexedDB storage (Dexie.js) paired with Vite PWA Service Worker caching. Zero cloud dependencies. |
| **Platform Essentials**| **Multilingual Support** | Plain-language health explanations translated across English, Hindi, Spanish, Tamil, and Telugu ([`translations.ts`](file:///d:/STELLAR/src/core/i18n/translations.ts)). |
| **Platform Essentials**| **Role-Based Access** | Seamless operational switching between Crew Terminal (Mobile/Laptop), Mission Telemetry Console, and Doctor Console. |

---

## 4. Visual Design & Typography Guidelines

- **Typography System:**
  - **Headings & Readouts:** Classic Serif (`Lora`, `Merriweather`, `Georgia`) for elegance, warmth, and clinical authority.
  - **Body & UI Controls:** Clean modern sans-serif (`Inter`, system font stack).
  - **Telemetry & Technical Codes:** Monospaced (`JetBrains Mono`, `Fira Code`).
- **Dark Font Requirement:** All light/white/ivory cards utilize deep ink typography (`#060A14`, `#0A1020`, `#0F172A`) to ensure high contrast and maximum readability.
- **Color Palette (Blue & White — No Purple):**
  - **Deep Space Obsidian:** `#060B14` (primary backdrop).
  - **Midnight Space Blue:** `#0B1220` (secondary containers).
  - **Woven Plaid Navy:** `#1A2C4E` (signature mobile greeting card).
  - **Sculpted Ivory Panel:** `#F6F3ED` (warm, high-contrast light panels).
  - **Pure White Cards:** `#FFFFFF` (vitals snapshot cards).
  - **Aerospace Cyan / Sky Accent:** `#38BDF8` (waveform glow and active indicators).
  - **Cobalt Blue Accent:** `#2563EB` (primary clinical buttons).
  - **Emerald Green:** `#10B981` (nominal baseline indicators).
  - **Amber:** `#F59E0B` (warning alerts and elevated vitals).
  - **Coral Red:** `#EF4444` (urgent flight alerts and Emergency SOS).

---

## 5. Technology Stack

- **Frontend Framework:** React 18 with TypeScript in Strict Mode
- **Bundler & Tooling:** Vite 6 with `@vitejs/plugin-react`
- **Styling Architecture:** Tailwind CSS, PostCSS, custom CSS utilities
- **Iconography:** Lucide React
- **Data Visualization:** Recharts (ComposedChart, Area, Bar, ReferenceLine, Tooltip)
- **Local Persistence:** IndexedDB via Dexie.js (`v2` schema) and `dexie-react-hooks`
- **Offline Infrastructure:** Progressive Web App (PWA) via `vite-plugin-pwa` and Service Worker precaching
- **Document Export:** Native print styling (`@media print`), jsPDF, html2canvas, and CSV generators
- **Testing Framework:** Vitest, React Testing Library, jsdom

---

## 6. Installation & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher recommended; verified on Node v22.13.0)
- npm (v9.0.0 or higher)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/stellar-astronaut-health.git
cd stellar-astronaut-health
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Run Unit Test Suite
```bash
npm test
```
Executes all 19 Vitest unit tests covering baseline calculations, trend detection, alert explanation rules, CSV/JSON validators, and synthetic data simulation.

### 4. Build for Production (PWA)
```bash
npm run build
```
Generates production-optimized bundles in `dist/` with PWA service worker precaching (`sw.js`).

---

## 7. How to Demonstrate the Application for Judges

### Demonstration 1: Mobile Phone Interface (Image 1 & 3)
1. At the top of the application, click **"Mobile Phone (Image 1 & 3)"** on the Interface Mode switcher.
2. Observe the **Pulse Daily View**:
   - Inspect the woven **Plaid Navy Card** displaying *"Good morning, Asha."*, clinical context notes, and the live animated **72 bpm ECG waveform**.
   - Review the **"Your vitals"** section with dark ink typography on clean white cards.
   - Tap the **Heart rate (72 bpm)** card to launch the **Full Vital History Modal** with interactive 30-day charts and personal baseline bands.
3. Click the **"Orbital Mode"** button on the card or floating navbar to explore the **12-Screen Orbital Flow**:
   - Screen 1: Rotating 3D Earth orbit visual with *"All systems nominal"* status pill.
   - Screen 2: Live 72 bpm telemetry gauge and 24-hour wave curve.
   - Screen 5: **Cause-and-Effect flowchart** demonstrating empirical links (`[Sleep Fragmentation] ➔ [Stress ↑] ➔ [Morning HR Spike]`).
   - Screen 6: Care plan checklist with medication adherence tracking.

### Demonstration 2: Laptop Dashboard Interface (Image 2)
1. Click **"Laptop Dashboard (Image 2)"** on the top switcher.
2. Observe the multi-panel layout:
   - Left sidebar with astronaut avatar and navigation.
   - Top header with `HELLO, ASHA!`, search bar, and biomarker triggers.
   - Middle column showing **Linked Clinicians** (Dr. Mehta, Dr. Patel, Dr. Vance), **Upcoming Events**, and the **Care Protocol Calendar**.
   - Right column showing the **3 Circular Progress Rings** (90% Medication Adherence, 60% Countermeasures, 75% Sleep Recovery).

### Demonstration 3: Specialized Modals & Tools
1. **Camera rPPG Vitals:** Click the camera icon in the header to run a contactless pulse scan.
2. **Voice Biomarkers:** Click the microphone icon to analyze voice pitch, jitter, and fatigue score.
3. **Food Photo Logging:** Click the utensils icon to inspect macronutrients and glycemic spike risk.
4. **1-Page Doctor Brief:** Click **"1-Page Doctor Brief"** to preview the printable clinical summary.
5. **Emergency SOS:** Click **"SOS"** to trigger the 5-second countdown and simulated dispatch.

### Demonstration 4: Mission Telemetry & Data Simulator
1. Click **"Mission Telemetry"** on the top switcher.
2. Navigate to the **Data Simulator** tab from the left sidebar.
3. Test the 3 operational scenarios:
   - **Scenario 1 (Normal Mission Day):** Telemetry remains stable within personal baseline reference bands with zero false alarms.
   - **Scenario 2 (Sleep Disruption):** Induces sleep curtailment and fatigue accumulation, generating an explainable warning alert.
   - **Scenario 3 (Unusual Physiological Trend):** Simulates progressive heart rate elevation ($>2.5\sigma$) with SpO2 desaturation, generating an explainable urgent flight alert with persistence verification.

---

## 8. Two-Member Team Contribution Model

| Workstream | Focus Area | Deliverables |
|---|---|---|
| **Workstream A: Data & Intelligence** | Core Computation & Statistical Modeling | Mathematical baseline algorithms, statistical deviation models, multi-indicator trend correlation, cause-and-effect engine, explainable alert engine, synthetic data generator, CSV/JSON validation rules, and Vitest test suite. |
| **Workstream B: Frontend & Aerospace UX** | Product Architecture & Interface Design | Dual layout architectures (Mobile Phone & Laptop Dashboard), dark high-contrast typography, interactive Recharts analytics, biomarker and contactless scanner modals, PWA offline caching, doctor & caregiver views, and PDF/CSV reports. |

---

## 9. Clinical Boundaries & Disclosures

1. **Operational Awareness Aid:** STELLAR is a research prototype and astronaut health awareness aid developed for the NASA Space Apps Challenge 2026. It does not provide medical diagnoses or replace flight surgeons and licensed medical personnel.
2. **Correlation vs. Causality:** Cause-and-effect insights and multi-indicator correlations represent statistical co-occurrences and physiological stress patterns.
3. **Data Authenticity:** All telemetry and astronaut profiles shown are synthesized for software evaluation and do not represent actual classified NASA astronaut health records.

---

## 9. Doctor Perspective (Physician Detail)

- **Patient Info** – name, age, gender, callsign, mission ID, current vitals snapshot.
- **Urgency Levels** – High, Moderate, Stable. Alerts are color‑coded (red, amber, green) and listed in the Doctor Console.
- **Clinical Note Instructions** – Free‑form note entry with required fields (assessment, plan, follow‑up). Saved notes appear in the patient’s Message feed.
- **Recommendations for Patients** – Each alert includes an explanatory paragraph and a concrete next‑step (e.g., “Perform a 5‑minute guided breathing exercise”, “Increase daily resistance‑band reps”, “Log a 5‑second voice sample”). This gives astronauts actionable guidance without prescribing medical treatment.
- **SOS Alert** – Dedicated red button in the Doctor view that immediately pushes a high‑priority SOS to the astronaut’s Emergency modal and logs the event for mission control.

## 10. Astronaut Physiology Differences (Why Our Baselines Matter)

1. **Bone Density Loss (Space Osteopenia)** – 1–1.5 % BMD loss per month, equivalent to a year of loss for an elderly person on Earth. Increases fracture risk and kidney‑stone formation.
2. **Rapid Muscle Atrophy** – Up to 20 % loss in 5–11 days without counter‑measure exercise. Daily 2–2.5 h resistance training is mandatory.
3. **Fluid Shifts (“Puffy Face, Bird Legs”)** – Upper‑body fluid redistribution causes facial edema, sinus congestion, and reduced plasma volume, leading to dizziness on return.
4. **Vision Changes (SANS)** – Optic disc swelling and retinal folds from increased intracranial pressure; can cause permanent farsightedness.
5. **Cardiovascular Deconditioning** – Heart remodels to a more spherical shape, reducing stroke volume; risk of arrhythmias and orthostatic intolerance on Earth.
6. **Height Increase & Back Pain** – Spine decompresses, adding up to 5 cm height; leads to lower‑back pain and disc injury risk.
7. **Space Radiation Exposure** – ~10× Earth background; DNA damage, accelerated aging, higher cancer risk, early cataracts.
8. **Immune Dysregulation & Reactivated Viruses** – Immune cells become sluggish or hyper‑active; latent viruses (HSV, EBV) may reactivate.
9. **Circadian Rhythm Disruption & Sleep Deprivation** – 16 sunrises per day → average 6 h sleep, impacting cognition and mood.
10. **Altered Taste & Smell** – Nasal congestion dulls taste; astronauts crave strong flavors.
11. **Balance & Inner‑Ear Confusion (Space Motion Sickness)** – 60–80 % experience nausea and vertigo during initial adaptation.
12. **Genetic & Microbiome Changes** – Twin study shows lasting gene‑expression shifts and gut‑microbiome alterations.

These differences justify the **Personal Baseline Engine** and **Explainable Alerts** that STELLAR provides.

## 11. UI Simplification & Self‑Testing

- **Removed Redundant Views**: Stripped out terrestrial consumer modes (`Caregiver Circle`, `Elderly Mode`) to keep STELLAR 100% focused on astronaut physiology, flight surgery, and NASA mission telemetry.
- **Mission Planner**: Fixed responsive layout on laptop view; renders correctly across desktop browsers and tablet breakpoints.
- **Testing Checklist** (run `npm test` and then manually open each view mode):
  1. Astronaut Mobile (`viewMode='mobile'`) – verify Pulse Daily View and Orbital 12‑Flow.
  2. Astronaut Laptop (`viewMode='laptop'`) – verify sidebar, header, middle column, and three countermeasure progress rings.
  3. Doctor Console (`viewMode='doctor'`) – physician detail, patient info, urgency colors (High/Moderate/Stable), clinical note composer with instructions, recommendations with 'Why' rationale, and SOS dispatch button.
  4. NASA Mission Telemetry (`viewMode='nasa'`) – Mission Overview, Personal Baselines Engine, Data Simulator, CSV/PDF Reports.

All components pass the **19 Vitest unit tests** and the **production build** (`npm run build`) succeeds without errors.

## 12. License

Distributed under the **MIT License**. Developed for the **NASA Space Apps Challenge 2026**.
