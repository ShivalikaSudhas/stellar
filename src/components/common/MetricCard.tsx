import React from 'react';
import {
  Heart,
  Droplet,
  Moon,
  Zap,
  BatteryLow,
  Brain,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle
} from 'lucide-react';
import { MetricType, HealthBaseline, QualityStatus, DataSource } from '@/types';
import { METRIC_DEFINITIONS } from '@/core/data/metricDefinitions';

interface MetricCardProps {
  metric: MetricType;
  currentValue: number;
  baseline?: HealthBaseline;
  source: DataSource;
  quality: QualityStatus;
  timestamp?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  currentValue,
  baseline,
  source,
  quality,
  timestamp,
  onClick
}) => {
  const def = METRIC_DEFINITIONS[metric] || {
    label: metric,
    shortLabel: metric,
    unit: '',
    displayFormat: (v: number) => String(v),
    defaultNominalRange: [0, 100],
    description: ''
  };

  const hasBaseline = baseline && baseline.confidenceStatus !== 'insufficient_data';
  const baselineMean = hasBaseline ? baseline.referenceMean : undefined;
  const stdDev = hasBaseline ? baseline.standardDeviation : 1;

  let diff = 0;
  let zScore = 0;
  if (baselineMean !== undefined) {
    diff = Number((currentValue - baselineMean).toFixed(1));
    zScore = stdDev > 0 ? Number((diff / stdDev).toFixed(2)) : 0;
  }

  // Icon mapping
  const renderIcon = () => {
    switch (metric) {
      case 'heart_rate':
        return <Heart size={18} className="text-red-400" />;
      case 'spo2':
        return <Droplet size={18} className="text-cyan-accent" />;
      case 'sleep_duration':
        return <Moon size={18} className="text-indigo-400" />;
      case 'activity':
        return <Zap size={18} className="text-amber-400" />;
      case 'fatigue':
        return <BatteryLow size={18} className="text-amber-300" />;
      case 'stress':
        return <Brain size={18} className="text-purple-400" />;
      case 'core_temp':
        return <Thermometer size={18} className="text-emerald-400" />;
      default:
        return <Heart size={18} className="text-cyan-accent" />;
    }
  };

  // Severity style
  const absZ = Math.abs(zScore);
  let statusBorder = 'border-space-700 hover:border-space-600';
  let badgeColor = 'bg-status-success/10 text-status-success border-status-success/30';
  let statusText = 'NOMINAL';

  if (hasBaseline) {
    if (absZ >= 2.5) {
      statusBorder = 'border-red-500/50 hover:border-red-500 bg-red-950/10';
      badgeColor = 'bg-red-500/20 text-red-400 border-red-500/40';
      statusText = 'URGENT DEVIATION';
    } else if (absZ >= 1.5) {
      statusBorder = 'border-amber-500/50 hover:border-amber-500 bg-amber-950/10';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      statusText = 'ELEVATED VARIANCE';
    }
  }

  // Provenance Tag
  const renderProvenanceTag = () => {
    if (source === 'simulated') {
      return (
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-850 text-cyan-accent border border-cyan-accent/20">
          SIMULATED
        </span>
      );
    }
    if (source === 'imported_csv' || source === 'imported_json') {
      return (
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
          IMPORTED
        </span>
      );
    }
    if (source === 'manual_entry') {
      return (
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
          CREW REPORT
        </span>
      );
    }
    return (
      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
        SENSOR TELEMETRY
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`aerospace-card p-4 transition-all cursor-pointer ${statusBorder} flex flex-col justify-between`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-space-900 border border-space-700">
              {renderIcon()}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200 block leading-tight">
                {def.label}
              </span>
              <span className="text-[10px] text-space-400 font-mono">
                {def.shortLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {quality !== 'nominal' && (
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-850 text-space-400 border border-space-700">
                {quality}
              </span>
            )}
            {renderProvenanceTag()}
          </div>
        </div>

        {/* Big Number Reading */}
        <div className="my-3 flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold tracking-tight font-mono text-white">
              {typeof currentValue === 'number' ? (Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(1)) : '--'}
            </span>
            <span className="ml-1.5 text-xs text-space-400 font-mono">{def.unit}</span>
          </div>

          {/* Deviation indicator */}
          {hasBaseline && (
            <div className="flex items-center gap-1 text-xs font-mono">
              {diff > 0 ? (
                <span className="text-amber-400 flex items-center">
                  <TrendingUp size={14} className="mr-0.5" />+{diff}
                </span>
              ) : diff < 0 ? (
                <span className="text-cyan-accent flex items-center">
                  <TrendingDown size={14} className="mr-0.5" />{diff}
                </span>
              ) : (
                <span className="text-space-400 flex items-center">
                  <Minus size={14} className="mr-0.5" />0.0
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Personal Baseline Comparison */}
      <div className="pt-2 border-t border-space-700/70 text-[11px] font-mono">
        {hasBaseline ? (
          <div className="flex items-center justify-between text-space-300">
            <span className="text-space-400">BASELINE:</span>
            <span className="text-white font-medium">
              {baselineMean} {def.unit} <span className="text-space-400 font-normal">(±{baseline.standardDeviation})</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-400/90 text-[10px]">
            <AlertCircle size={12} />
            <span>Establishing baseline ({baseline?.sampleCount || 0}/{baseline?.requiredSampleCount || 7})</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between text-[10px]">
          <span className={`px-1.5 py-0.2 rounded border font-semibold tracking-wider ${badgeColor}`}>
            {statusText}
          </span>
          {timestamp && (
            <span className="text-space-400">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
