# Dr. ORBIT — Astronaut Health & Spaceflight Telemetry
### Autonomous Offline-First Space Health Monitoring, Explainable AI & Doctor Telemetry Platform

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-blue.svg)](https://www.spaceappschallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-19%2F19%20passing-brightgreen.svg)]()
[![Offline First](https://img.shields.io/badge/offline-IndexedDB%20%2B%20PWA%20Ready-cyan.svg)]()
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)]()

> **NASA Space Apps Challenge 2026 | Astronaut Health Monitoring Software**  
> An autonomous, offline-first operational health intelligence system tailored for deep-space long-duration spaceflight (Artemis Lunar Base & Mars Transit) and comprehensive personalized longitudinal health monitoring.

---

## 1. Project Overview & Problem Statement

Long-duration space missions expose astronauts to the **five hazards of human spaceflight**: space radiation, isolation and confinement, distance from Earth, altered gravity fields, and hostile closed environments. These conditions induce rapid physiological shifts:
- Upper-body cephalic fluid redistribution ("puffy head, bird legs")
- 1.0–1.5% bone mineral density loss per month (space osteopenia)
- Up to 20% muscle mass loss in under two weeks without countermeasures
- Cardiovascular remodeling and spaceflight-associated neuro-ocular syndrome (SANS)
- Circadian misalignment caused by 16 orbital sunrises every 24 hours
- Up to 22 minutes of one-way communication latency between Earth and Mars

With long distances and light-speed delays, astronauts cannot wait for real-time instructions from flight surgeons on Earth. **Dr. ORBIT** gives astronauts the tools to self-monitor, interpret their own health trends through transparent **Explainable AI**, log nutrition with a NASA food pouch scanner, track space radiation, and collaborate directly with attending doctors.

---

## 2. Instant Zero-Friction Multi-Interface Showcase

To make evaluation seamless for hackathon judges and mission operators, **Dr. ORBIT features a persistent Global Interface Mode Switcher at the top of the application**. 

Judges and evaluators can switch between all 4 specialized operational viewpoints in one click without authenticating through tedious multi-account logins:

flowchart TD
    App[Dr. ORBIT Global Interface Switcher] --> V1[💻 Laptop Dashboard\n(Astronaut Interface)]
    App --> V2[🩺 Doctor Console\n(Attending Doctor)]
    App --> V3[📱 Mobile Terminal\n(Crew Pocket Device)]
    App --> V4[🛰️ Mission Telemetry\n(Ground Control & MCC)]


### The 4 Integrated Interfaces:

1. **💻 Laptop Dashboard — Astronaut Interface (`LaptopDashboardView.tsx`)**:
   - The primary workstation for the astronaut aboard the spacecraft or habitat.
   - **Vitals Overview**: Real-time readouts for Heart Rate, Blood Pressure, $\text{SpO}_2$, and Sleep with individual baseline comparisons, deviation indicators, and 1-day/7-day/30-day filters.
   - **Explainable AI Insights**: 9-point causal reasoning box (*"Possible cause found from your data trends"*) explaining what was detected, baseline divergence, onset, contributing ECLSS factors, and concrete countermeasure recommendations without black-box opacity.
   - **Daily Logging & NASA Food Pouch Scanner**: Barcode scanner for space rations (`NASA-PK` series), calorie/macro breakdown, percentage eaten selector, water dispenser tracking, 1–5 space motion sickness (nausea) & appetite rating, and exercise countermeasure logging (ARED, T2 Treadmill, CEVIS Cycle).
   - **Care & Ground Sync**: Prescribed medications table, clinical discussion questions, and asynchronous ground synchronization.
   - **Radiation & Dosimetry**: Real-time dosimeter rate ($\mu\text{Sv/h}$), daily accumulated dose ($\text{mSv/day}$), career radiation gauge against NASA's $600\text{ mSv}$ lifetime limit, and 24-hour dosimeter trend charts.
   - **Data Privacy & Override**: Granular permission matrix for attending doctors, BME daemons, and station commanders with an auditable emergency access log.

2. **🩺 Doctor Console — Doctor Interface (`DoctorView.tsx`)**:
   - Dedicated medical console for attending flight physicians (Dr. Rajesh Mehta, MD, FACC).
   - **Physician Detail**: Medical license, Space Medicine Operations Division, and live S-band telemetry uplink ($2287.5\text{ MHz}$, $0.42\text{s}$ latency).
   - **Crew Triage by Urgency**: Instant filtering across `HIGH`, `MODERATE`, and `STABLE` risk levels with explicit clinical justifications displayed for each astronaut.
   - **Detailed Astronaut Dossier**: Longitudinal vitals vs. personal baselines, scanned food pouch history, water consumption, and radiation exposure.
   - **Recommendations with "Why is that?" Rationale**: Prescribed countermeasures accompanied by explicit spaceflight physiology explanations (e.g., fluid redistribution, bone resorption, melatonin entrainment).
   - **Clinical Notes & Instructions**: Structured clinical note composer with review date scheduling and cryptographic digital sign-off.
   - **Emergency SOS Beacon Management**: Incident panel with trigger timestamp, attached biometrics (Pulse $142\text{ bpm}$, BP $148/98\text{ mmHg}$, $\text{SpO}_2$ $94.8\%$), delivery confirmation across NASA MCC Houston and station intercom, mandatory doctor acknowledgment, and standby backup doctor escalation.

3. **📱 Mobile Terminal — Crew Pocket Device (`MobilePhoneView.tsx`)**:
   - High-contrast pocket companion for quick astronaut check-ins during habitat transit.
   - Features the signature woven plaid navy card with live 72 bpm ECG waveform, high-contrast dark ink typography, and 12-screen orbital navigation suite.

4. **🛰️ Mission Telemetry — Ground Control Suite (`MissionOverviewPage.tsx`)**:
   - Comprehensive telemetry engineering console with population baseline engines, multi-indicator trend analytics, synthetic data playback simulator (Normal, Sleep Curtailment, and Tachycardia scenarios), and PDF/CSV health report exports.

---

## 3. Core Architectural Innovations

### A. Profile-Isolated Personal Baseline Engine
In microgravity, population-average terrestrial reference cutoffs fail. Dr. ORBIT computes mathematical statistical baselines ($\mu$, Median, Standard Deviation $\sigma$, rolling averages) computed strictly from each astronaut's own verified telemetry history, requiring at least 7 valid sols before activating high-confidence anomaly detection.

### B. Transparent Explainable AI (XAI)
Rather than producing unverified diagnostic scores, Dr. ORBIT provides deterministic, rule-governed causal explanations:
- What was detected?
- Which health metric diverged from the personal baseline?
- When did the change begin?
- What secondary factors (sleep fragmentation, ECLSS carbon dioxide, high-resistance workout deficit) correlate with the trend?
- What operational countermeasure should the astronaut take?

### C. 100% Offline-First Architecture (Zero Cloud Dependency)
Deep-space exploration cannot depend on terrestrial cloud APIs or constant connectivity. Dr. ORBIT operates 100% locally via browser **IndexedDB (Dexie.js)** with 15 persistent relational object stores, complemented by Progressive Web App (PWA) service worker caching. All data logging, trend analysis, food scans, and clinical notes persist locally across sessions.

---

## 4. Technology Stack

- **Frontend & UI:** React 18, TypeScript (Strict Mode), Tailwind CSS, Lucide React
- **Data Visualization:** Recharts (ComposedChart, Area, Bar, ReferenceLine, Tooltips)
- **Local Persistence:** IndexedDB via Dexie.js and `dexie-react-hooks`
- **Offline & PWA:** Service Worker caching via `vite-plugin-pwa`
- **Unit Testing:** Vitest, jsdom, React Testing Library (19/19 passing tests)
- **Design Tokens:** High-contrast ink typography (`#060A14`, `#0F172A`) on sculpted ivory and white cards with aerospace cyan/sky accents (`#38BDF8`)

---

## 5. Quickstart & Verification

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript compilation check
npx tsc --noEmit

# 3. Run unit test suite
npm test

# 4. Launch local development server
npm run dev
```

Visit `http://localhost:5173` to explore all four interfaces using the top global interface switcher.

---

## 6. License & Hackathon Attribution

Developed for the **NASA Space Apps Challenge 2026** under the **MIT License**.
