import React from 'react';
import {
  Target,
  Layers,
  HardDrive,
  Users,
  Compass,
  Cpu
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="aerospace-card p-8 bg-gradient-to-br from-space-900 via-space-850 to-space-950 border border-space-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-cyan-accent/50 flex items-center justify-center p-0.5 shadow-md flex-shrink-0">
            <img src="/dr-orbit-logo.png" alt="Dr. ORBIT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-widest text-white">Dr. ORBIT</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/40 font-bold">
                NASA Space Apps Challenge 2026
              </span>
            </div>
            <p className="text-xs text-space-300 font-mono">
              Astronaut Health Monitoring, Explainable Spaceflight AI & Ground Doctor Telemetry
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans mt-4 max-w-3xl">
          An offline-first operational health intelligence platform designed for deep-space missions and planetary expeditions. Dr. ORBIT replaces static Earth thresholds with individual personal baselines, multi-indicator temporal correlation, and deterministic explainable AI insights to empower astronaut autonomy and direct collaboration with flight surgeons and attending doctors.
        </p>
      </div>

      {/* Core Innovation Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aerospace-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-accent font-bold font-mono text-sm">
            <Target size={18} />
            <span>1. Profile-Isolated Statistical Baselines</span>
          </div>
          <p className="text-xs text-space-300 font-sans leading-relaxed">
            In microgravity, cephalad fluid shift and cardiovascular remodeling invalidate Earth-normal clinical standards. STELLAR derives empirical reference profiles (Mean, Median, Standard Deviation σ, Rolling Averages) specifically for each astronaut, refusing cross-crew baseline pollution.
          </p>
        </div>

        <div className="aerospace-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-accent font-bold font-mono text-sm">
            <Layers size={18} />
            <span>2. Multi-Indicator Contextual Analysis</span>
          </div>
          <p className="text-xs text-space-300 font-sans leading-relaxed">
            Rather than analyzing isolated numbers, STELLAR identifies overlapping temporal shifts across cardiovascular rate, blood oxygen saturation, sleep deficit, and psychomotor fatigue, surfacing actionable operational insights.
          </p>
        </div>

        <div className="aerospace-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-accent font-bold font-mono text-sm">
            <Cpu size={18} />
            <span>3. Explainable Deterministic Alerts</span>
          </div>
          <p className="text-xs text-space-300 font-sans leading-relaxed">
            Every notification is traceable to a specific mathematical flight rule and supporting telemetry observations. Alerts never use opaque "black box" risk scores and always provide non-diagnostic operational mitigation protocols.
          </p>
        </div>

        <div className="aerospace-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-accent font-bold font-mono text-sm">
            <HardDrive size={18} />
            <span>4. 100% Offline-First Architecture</span>
          </div>
          <p className="text-xs text-space-300 font-sans leading-relaxed">
            For Lunar and Mars transit, communication latencies range from seconds to 22 minutes. STELLAR operates completely offline in the crew cabin using browser-native IndexedDB (Dexie.js), client-side analytics, and local PWA asset caching.
          </p>
        </div>
      </div>

      {/* Team & Challenge Architecture */}
      <div className="aerospace-card p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-space-700">
          <Users size={18} className="text-cyan-accent" />
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Two-Member Engineering Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="p-4 rounded-lg bg-space-850 border border-space-750 space-y-2">
            <span className="text-cyan-accent font-bold text-sm block">
              Workstream A: Data & Intelligence
            </span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
              <li>Mathematical baseline calculation engine (μ, s², σ, rolling averages)</li>
              <li>Multi-indicator cross-telemetry trend detection algorithms</li>
              <li>Explainable alert generator with duplicate suppression</li>
              <li>Synthetic flight data simulator (Normal, Sleep Disruption, Outlier)</li>
              <li>CSV & JSON validation engine with schema remediation guidelines</li>
              <li>Comprehensive Vitest unit test suite</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750 space-y-2">
            <span className="text-cyan-accent font-bold text-sm block">
              Workstream B: Frontend & Aerospace Product
            </span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
              <li>NASA/SpaceX telemetry-inspired deep navy responsive interface</li>
              <li>Interactive Recharts telemetry trends with statistical baseline bands</li>
              <li>Daily psychomotor wellness & microgravity discomfort tracking</li>
              <li>Alert triage manager with full technical telemetry traces</li>
              <li>Offline Progressive Web App (PWA) and IndexedDB persistence</li>
              <li>Mission health report generator with PDF and CSV export</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="aerospace-card p-5 font-mono text-xs text-space-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
          <Compass size={14} className="text-amber-400" />
          <span>Ethical & Clinical Boundaries Disclosure:</span>
        </div>
        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
          STELLAR is a research and health-awareness prototype engineered for the NASA Space Apps Challenge 2026. It is not an FDA or CE-approved medical device, does not establish clinical causality, and does not replace Mission Control Flight Surgeons or biomedical engineers (BME). All demo flight rules are prototype parameters pending space agency flight certification.
        </p>
      </div>
    </div>
  );
};
