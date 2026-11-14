import React, { useState } from 'react';
import {
  Astronaut,
  HealthReading,
  HealthBaseline,
  MetricType
} from '@/types';
import { METRIC_DEFINITIONS } from '@/core/data/metricDefinitions';
import {
  Target,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Calculator
} from 'lucide-react';

interface PersonalBaselinesPageProps {
  astronaut: Astronaut;
  readings: HealthReading[];
  baselines: Record<MetricType, HealthBaseline>;
  onRecalculate?: () => void;
}

export const PersonalBaselinesPage: React.FC<PersonalBaselinesPageProps> = ({
  astronaut,
  readings,
  baselines,
  onRecalculate
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('heart_rate');

  const metrics: MetricType[] = [
    'heart_rate',
    'spo2',
    'sleep_duration',
    'activity',
    'fatigue',
    'stress'
  ];

  const currentBaseline = baselines[selectedMetric];
  const def = METRIC_DEFINITIONS[selectedMetric];

  // Specific valid readings for this astronaut and metric
  const metricReadings = readings
    .filter((r) => r.metric === selectedMetric && r.quality !== 'unreliable')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const isReliable = currentBaseline && currentBaseline.confidenceStatus === 'reliable';
  const isInsufficient = !currentBaseline || currentBaseline.confidenceStatus === 'insufficient_data';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target size={20} className="text-cyan-accent" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Personal Baseline Engine
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Individual statistical reference profiles calibrated for {astronaut.name} ({astronaut.callsign})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-space-850 border border-space-700 text-space-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-accent" />
            <span>Profile-Isolated Baseline</span>
          </div>
          {onRecalculate && (
            <button
              onClick={onRecalculate}
              className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-600 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Recalculate</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => {
          const mDef = METRIC_DEFINITIONS[m];
          const b = baselines[m];
          const isSelected = selectedMetric === m;
          const reliable = b?.confidenceStatus === 'reliable';

          return (
            <button
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-space-800 border-cyan-accent shadow-md'
                  : 'bg-space-900 border-space-700 hover:bg-space-850'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white uppercase">{mDef.shortLabel}</span>
                {reliable ? (
                  <CheckCircle2 size={13} className="text-status-success" />
                ) : (
                  <AlertCircle size={13} className="text-amber-400" />
                )}
              </div>
              <div className="text-lg font-bold font-mono text-cyan-accent">
                {b && b.confidenceStatus !== 'insufficient_data' ? `${b.referenceMean}` : '--'}
                <span className="text-xs text-space-400 font-normal ml-1">{mDef.unit}</span>
              </div>
              <div className="text-[10px] font-mono text-space-400 mt-1">
                Samples: {b?.sampleCount || 0}/{b?.requiredSampleCount || 7}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Baseline Calculation Deep Dive */}
      <div className="aerospace-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-space-700 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{def.label} Reference Profile</h2>
              <span
                className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
                  isReliable
                    ? 'bg-status-success/10 text-status-success border-status-success/30'
                    : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                }`}
              >
                {currentBaseline?.confidenceStatus.replace('_', ' ') || 'INSUFFICIENT'}
              </span>
            </div>
            <p className="text-xs text-space-400 font-mono mt-1">
              Metric ID: <code className="text-cyan-accent">{selectedMetric}</code> | Unit: {def.unit}
            </p>
          </div>

          <div className="bg-space-900 border border-space-700 px-4 py-2 rounded-lg text-xs font-mono">
            <span className="text-space-400">ASTRONAUT TARGET:</span>{' '}
            <span className="text-white font-bold">{astronaut.name} ({astronaut.id})</span>
          </div>
        </div>

        {/* Insufficient data banner if threshold not met */}
        {isInsufficient ? (
          <div className="p-6 mb-6 rounded-lg bg-amber-950/20 border border-amber-500/40 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <AlertCircle size={18} className="text-amber-400" />
              <span>Insufficient historical data to establish a reliable personal baseline.</span>
            </div>
            <p className="text-xs font-mono text-slate-300">
              Only {currentBaseline?.sampleCount || 0} valid telemetry reading(s) logged. A minimum of {currentBaseline?.requiredSampleCount || 7} consecutive valid observations is required by flight monitoring parameters to establish statistical mean and variance bands.
            </p>
            <p className="text-[11px] font-mono text-space-400 mt-2">
              *STELLAR does not substitute baseline values from other astronauts or generic clinical population templates without explicit user authorization.
            </p>
          </div>
        ) : null}

        {/* Statistical Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Mean (μ)</span>
            <span className="text-2xl font-bold font-mono text-white">
              {currentBaseline?.referenceMean ?? '--'}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">{def.unit}</span>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Median (M)</span>
            <span className="text-2xl font-bold font-mono text-white">
              {currentBaseline?.referenceMedian ?? '--'}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">{def.unit}</span>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Std Dev (σ)</span>
            <span className="text-2xl font-bold font-mono text-cyan-accent">
              {currentBaseline?.standardDeviation ?? '--'}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">{def.unit}</span>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Observed Min</span>
            <span className="text-2xl font-bold font-mono text-white">
              {currentBaseline?.minimum ?? '--'}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">{def.unit}</span>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Observed Max</span>
            <span className="text-2xl font-bold font-mono text-white">
              {currentBaseline?.maximum ?? '--'}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">{def.unit}</span>
          </div>

          <div className="p-4 rounded-lg bg-space-850 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-space-400 block mb-1">Valid Samples</span>
            <span className="text-2xl font-bold font-mono text-white">
              {currentBaseline?.sampleCount ?? 0}
            </span>
            <span className="text-xs text-space-400 ml-1 font-mono">pts</span>
          </div>
        </div>

        {/* Mathematical Transparency & Formula Disclosure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-space-700">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={16} className="text-cyan-accent" />
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                Mathematical Baseline Formulae
              </h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-slate-300 bg-space-900 p-4 rounded-lg border border-space-750">
              <div>
                <span className="text-space-400">Mean:</span>{' '}
                <code className="text-cyan-accent">μ = (Σ x_i) / N</code>
              </div>
              <div>
                <span className="text-space-400">Sample Variance:</span>{' '}
                <code className="text-cyan-accent">s² = Σ (x_i - μ)² / (N - 1)</code>
              </div>
              <div>
                <span className="text-space-400">Sample Standard Deviation:</span>{' '}
                <code className="text-cyan-accent">σ = √(s²)</code>
              </div>
              <div>
                <span className="text-space-400">Operational Deviation Z-Score:</span>{' '}
                <code className="text-cyan-accent">Z = (x_current - μ) / σ</code>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={16} className="text-space-400" />
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                Calibration Methodology
              </h3>
            </div>
            <div className="text-xs font-mono text-space-300 bg-space-900 p-4 rounded-lg border border-space-750 space-y-2">
              <p>
                1. Telemetry points flagged with <code className="text-amber-400">quality = 'unreliable'</code> are strictly discarded prior to baseline aggregation.
              </p>
              <p>
                2. Baselines are computed per individual crew member to accommodate spaceflight microgravity adaptation (cephalad fluid shift, cardiovascular deconditioning).
              </p>
              <p>
                3. Warning triggers are initialized at <code className="text-cyan-accent">±1.5σ</code>; Urgent triggers at <code className="text-cyan-accent">±2.5σ</code> across consecutive passes.
              </p>
            </div>
          </div>
        </div>

        {/* Contributing Telemetry Sample Points Table */}
        <div className="mt-6 pt-4 border-t border-space-700">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">
            Calibration Historical Readings ({metricReadings.length})
          </h3>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-space-700 text-space-400 text-[10px] uppercase">
                  <th className="py-1.5 px-3">Index</th>
                  <th className="py-1.5 px-3">Timestamp</th>
                  <th className="py-1.5 px-3">Value</th>
                  <th className="py-1.5 px-3">Deviation from μ</th>
                  <th className="py-1.5 px-3">Source</th>
                  <th className="py-1.5 px-3">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800 text-slate-300">
                {metricReadings.map((r, i) => {
                  const mean = currentBaseline?.referenceMean ?? 0;
                  const d = Number((r.value - mean).toFixed(1));
                  return (
                    <tr key={r.id} className="hover:bg-space-850/40">
                      <td className="py-1.5 px-3 text-space-400">{i + 1}</td>
                      <td className="py-1.5 px-3 text-[11px]">{new Date(r.timestamp).toLocaleString()}</td>
                      <td className="py-1.5 px-3 font-bold text-white">{r.value} {def.unit}</td>
                      <td className="py-1.5 px-3">
                        <span className={d > 0 ? 'text-amber-400' : d < 0 ? 'text-cyan-accent' : 'text-space-400'}>
                          {d > 0 ? `+${d}` : d} {def.unit}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-space-400 text-[10px] uppercase">{r.source}</td>
                      <td className="py-1.5 px-3 text-status-success text-[10px] uppercase">{r.quality}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
