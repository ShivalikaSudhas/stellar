import React, { useState, useMemo } from 'react';
import { HealthReading, HealthBaseline, MetricType } from '@/types';
import { METRIC_DEFINITIONS } from '@/core/data/metricDefinitions';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface VitalHistoryModalProps {
  metric: MetricType;
  currentValue: number;
  readings: HealthReading[];
  baseline?: HealthBaseline;
  onClose: () => void;
}

export const VitalHistoryModal: React.FC<VitalHistoryModalProps> = ({
  metric,
  currentValue,
  readings,
  baseline,
  onClose
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const def = METRIC_DEFINITIONS[metric] || {
    label: metric,
    shortLabel: metric,
    unit: '',
    displayFormat: (v: number) => String(v),
    defaultNominalRange: [0, 100],
    description: ''
  };

  const metricReadings = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    if (timeRange === '24h') cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (timeRange === '7d') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return readings
      .filter((r) => r.metric === metric && new Date(r.timestamp) >= cutoff)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [readings, metric, timeRange]);

  const chartData = useMemo(() => {
    const mean = baseline?.referenceMean ?? currentValue;
    const std = baseline?.standardDeviation ?? 3;

    return metricReadings.map((r) => {
      const d = new Date(r.timestamp);
      const formattedDate =
        timeRange === '24h'
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      return {
        timestamp: r.timestamp,
        formattedDate,
        value: r.value,
        baselineMean: mean,
        baselineUpper: Number((mean + 1.5 * std).toFixed(1)),
        baselineLower: Number(Math.max(0, mean - 1.5 * std).toFixed(1)),
        quality: r.quality,
        source: r.source
      };
    });
  }, [metricReadings, baseline, currentValue, timeRange]);

  const mean = baseline?.referenceMean ?? currentValue;
  const diff = Number((currentValue - mean).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-xl font-serif font-semibold text-slate-900">
                {def.label} History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {def.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Stats Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">LATEST VALUE</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-serif font-bold text-slate-900">
                {typeof currentValue === 'number' ? (Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(1)) : '--'}
              </span>
              <span className="text-sm font-medium text-slate-500">{def.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {baseline && baseline.confidenceStatus !== 'insufficient_data' ? (
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-500 block text-[11px]">YOUR NORMAL BASELINE</span>
                <span className="font-semibold text-slate-900">
                  {baseline.referenceMean} {def.unit} <span className="text-slate-400 font-normal">(±{baseline.standardDeviation})</span>
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>Establishing personal baseline...</span>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
              <span className="text-slate-500 block text-[11px]">VARIATION</span>
              <div className="flex items-center gap-1 font-semibold">
                {diff > 0 ? (
                  <span className="text-amber-600 flex items-center">
                    <TrendingUp size={14} className="mr-0.5" />+{diff} {def.unit}
                  </span>
                ) : diff < 0 ? (
                  <span className="text-blue-600 flex items-center">
                    <TrendingDown size={14} className="mr-0.5" />{diff} {def.unit}
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center">
                    <Minus size={14} className="mr-0.5" />Normal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
            Telemetry Graph
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <Calendar size={13} className="text-slate-400 ml-1.5 mr-1" />
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === r
                    ? 'bg-white text-blue-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-64 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
              No readings logged in this timeframe.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="vitalBaselineBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#94A3B8"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                          <div className="text-slate-400 text-[10px]">{data.timestamp}</div>
                          <div className="font-semibold text-sm">
                            {data.value} {def.unit}
                          </div>
                          <div className="text-slate-300 text-[11px]">
                            Normal Baseline: {data.baselineMean} {def.unit}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="baselineUpper"
                  stroke="none"
                  fill="url(#vitalBaselineBand)"
                />
                {baseline && baseline.confidenceStatus !== 'insufficient_data' && (
                  <ReferenceLine
                    y={baseline.referenceMean}
                    stroke="#2563EB"
                    strokeDasharray="4 4"
                    label={{
                      value: `Normal: ${baseline.referenceMean}`,
                      fill: '#2563EB',
                      fontSize: 10,
                      position: 'insideTopLeft'
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1D72E8"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#1D72E8', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Logged Samples Table */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
              Recent Observations ({metricReadings.length})
            </span>
            <span className="text-[11px] text-slate-400">Source Tracked</span>
          </div>

          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs">
            {metricReadings.slice(-6).reverse().map((r) => (
              <div key={r.id} className="py-2 flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">
                    {new Date(r.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                    {r.source}
                  </span>
                </div>
                <div className="font-semibold text-slate-900">
                  {r.value} {def.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 size={13} />
            <span>Validated personal normal bounds</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
