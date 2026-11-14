# Scientific & Operational Methodology — STELLAR

## 1. Spaceflight Physiological Context
Long-duration spaceflight induces marked biological adaptations:
1. **Cephalad Fluid Shift:** In microgravity ($0g$), approximately 1.5 to 2 liters of interstitial fluids shift from lower extremities toward the head and thoracic cavity, altering central venous pressure and resetting resting cardiovascular dynamics.
2. **Cardiovascular Deconditioning:** Stroke volume and cardiac output remodel over weeks in transit, shifting the resting heart rate baseline.
3. **Circadian Dysregulation:** Low Earth Orbit (LEO) experiences 16 sunrises/sunsets every 24 hours, while transit to Mars deprives crew of natural photoperiods, causing frequent sleep fragmentation.
4. **Communication Latency:** Deep space communication introduces multi-minute one-way light delays (up to 22 minutes at Mars), preventing real-time Earth-based medical telemedicine for rapid anomalies.

---

## 2. The Personal Baseline Paradigm
Conventional terrestrial health software relies on fixed population reference ranges (e.g., standard heart rate: 60–100 bpm). In an astronaut crew:
- An elite athlete astronaut may have a true resting heart rate baseline of 52 bpm. A sustained climb to 72 bpm represents a substantial physiological shift ($+6.6\sigma$), yet a generic tracker would consider 72 bpm "nominal."
- Another astronaut's baseline may be 70 bpm.

**STELLAR enforces individual profile calibration:**
- Only telemetry from the specific astronaut profile is aggregated.
- Data flagged with `quality === 'unreliable'` is strictly excluded from calibration.
- Baselines remain marked as `provisional` or `insufficient_data` until a minimum observation threshold (default: 7 valid samples) is satisfied.

---

## 3. Explainable Alert Synthesis
Rather than relying on opaque deep neural networks that emit unexplained risk scores, STELLAR uses **deterministic, rule-governed flight criteria**:

$$\text{Severity} = \begin{cases}
\text{URGENT} & \text{if } |Z| \ge 2.5 \text{ and sustained} \\
\text{WARNING} & \text{if } |Z| \ge 1.5 \text{ and sustained} \\
\text{INFO} & \text{if } |Z| \ge 1.5 \text{ and acute (1 cycle)}
\end{cases}$$

Every generated alert includes:
1. **Empirical Evidence:** Observed value, personal reference mean, standard deviation, and consecutive reading count.
2. **Multi-Indicator Context:** Concurrently elevated fatigue, sleep duration deficits, or SpO2 changes.
3. **Traceability:** Rule identifier and data quality grade.
4. **Actionable Operational Protocol:** Pre-defined, non-diagnostic mitigation guidance (e.g. check sensor placement, inspect cabin airflow velocity, schedule power-nap).

---

## 4. Duplicate Suppression Strategy
To protect astronauts from alert fatigue during prolonged stress events:
- Active unacknowledged alerts for the same metric within a 120-minute window are suppressed from creating duplicate inbox noise.
- The existing alert maintains continuous persistence and consecutive reading counters.
- Full event history is preserved for mission health audits.
