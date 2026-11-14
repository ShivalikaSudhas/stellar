import React, { useState, useMemo } from 'react';
import {
  HealthReading,
  HealthBaseline,
  MetricType
} from '@/types';
import { METRIC_DEFINITIONS } from '@/core/data/metricDefinitions';
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
import {
  Heart,
  Droplet,
  Moon,
  Zap,
  BatteryLow,
  Brain,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { calculateRollingAverage } from '@/core/analysis/baselineEngine';

interface HealthAnalyticsPageProps {
  readings: HealthReading[];
  baselines: Record<MetricType, HealthBaseline>;
  selectedMetricInitial?: MetricType;
}

export const HealthAnalyticsPage: React.FC<HealthAnalyticsPageProps> = ({
  readings,
  baselines,
  selectedMetricInitial = 'heart_rate'
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>(selectedMetricInitial);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [showRollingAvg, setShowRollingAvg] = useState(true);
  const [showBaselineBands, setShowBaselineBands] = useState(true);

  const def = METRIC_DEFINITIONS[activeMetric];
  const baseline = baselines[activeMetric];

  // Filter readings by time range
  const filteredReadings = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    if (timeRange === '24h') cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    else if (timeRange === '7d') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return readings
      .filter((r) => r.metric === activeMetric && new Date(r.timestamp) >= cutoff)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [readings, activeMetric, timeRange]);

  // Rolling averages
  const rollingAverages = useMemo(() => {
    return calculateRollingAverage(filteredReadings.map((r) => r.value), 3);
  }, [filteredReadings]);

  // Chart data formatting with baseline bands
  const chartData = useMemo(() => {
    const mean = baseline?.referenceMean ?? 0;
    const std = baseline?.standardDeviation ?? 1;

    return filteredReadings.map((r, index) => {
      const d = new Date(r.timestamp);
      const formattedDate =
        timeRange === '24h'
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      return {
        timestamp: r.timestamp,
        formattedDate,
        value: r.value,
        rollingAvg: rollingAverages[index] ?? r.value,
        baselineMean: mean,
        baselineUpper: Number((mean + 1.5 * std).toFixed(1)),
        baselineLower: Number(Math.max(0, mean - 1.5 * std).toFixed(1)),
        urgentUpper: Number((mean + 2.5 * std).toFixed(1)),
        urgentLower: Number(Math.max(0, mean - 2.5 * std).toFixed(1)),
        source: r.source,
        quality: r.quality,
        isDeviated: Math.abs(r.value - mean) > 1.5 * std
      };
    });
  }, [filteredReadings, baseline, rollingAverages, timeRange]);

  const metricButtons: { type: MetricType; icon: React.ReactNode }[] = [
    { type: 'heart_rate', icon: <Heart size={15} /> },
    { type: 'spo2', icon: <Droplet size={15} /> },
    { type: 'sleep_duration', icon: <Moon size={15} /> },
    { type: 'activity', icon: <Zap size={15} /> },
    { type: 'fatigue', icon: <BatteryLow size={15} /> },
    { type: 'stress', icon: <Brain size={15} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Physiological Health Analytics</h1>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Empirical longitudinal telemetry with statistical personal baseline reference bands
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-space-700 font-mono text-xs">
          <Calendar size={14} className="text-space-400 ml-2 mr-1" />
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                timeRange === range
                  ? 'bg-cyan-accent text-space-950 font-bold'
                  : 'text-space-300 hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {metricButtons.map((btn) => {
          const itemDef = METRIC_DEFINITIONS[btn.type];
          const isSelected = activeMetric === btn.type;
          const b = baselines[btn.type];

          return (
            <button
              key={btn.type}
              onClick={() => setActiveMetric(btn.type)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-space-800 border-cyan-accent shadow-sm'
                  : 'bg-space-900 border-space-700 hover:bg-space-850 hover:border-space-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={isSelected ? 'text-cyan-accent' : 'text-space-400'}>
                  {btn.icon}
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  {itemDef.shortLabel}
                </span>
              </div>
              <div className="text-[10px] font-mono text-space-400 truncate">
                Base: {b && b.confidenceStatus !== 'insufficient_data' ? `${b.referenceMean} ${itemDef.unit}` : 'Calc...'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="aerospace-card p-5">
        {/* Chart Controls & Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-space-700 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{def.label} Trend</h2>
              <span className="text-xs font-mono text-cyan-accent bg-cyan-accent/10 px-2 py-0.5 rounded border border-cyan-accent/30">
                Unit: {def.unit}
              </span>
            </div>
            <p className="text-xs text-space-400 mt-0.5 max-w-xl">
              {def.description}
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-4 text-xs font-mono text-space-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showRollingAvg}
                onChange={(e) => setShowRollingAvg(e.target.checked)}
                className="accent-cyan-accent"
              />
              <span>Rolling Avg (3-pt)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showBaselineBands}
                onChange={(e) => setShowBaselineBands(e.target.checked)}
                className="accent-cyan-accent"
              />
              <span>Baseline Band (±1.5σ)</span>
            </label>
          </div>
        </div>

        {/* Recharts Container */}
        {chartData.length === 0 ? (
          <div className="py-24 text-center text-space-400 border border-dashed border-space-700 rounded-lg">
            <AlertCircle size={32} className="mx-auto text-amber-400 mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-300">No Telemetry Observations in this Period</p>
            <p className="text-xs text-space-400 font-mono mt-1">
              Select another time range or run the Mission Data Simulator to generate synthetic crew telemetry.
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="baselineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#36D6E7" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#36D6E7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2E47" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#5B6E88"
                  tick={{ fill: '#8E9EB5', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#223552' }}
                />
                <YAxis
                  stroke="#5B6E88"
                  tick={{ fill: '#8E9EB5', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#223552' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-space-900 border border-space-700 p-3 rounded-lg shadow-xl text-xs font-mono">
                          <div className="text-space-400 text-[10px] mb-1">{data.timestamp}</div>
                          <div className="text-white font-bold text-sm mb-1">
                            Observed: <span className="text-cyan-accent">{data.value} {def.unit}</span>
                          </div>
                          {showRollingAvg && (
                            <div className="text-space-300 text-[11px]">
                              Rolling Mean: {data.rollingAvg} {def.unit}
                            </div>
                          )}
                          <div className="text-space-400 text-[11px] mt-1 pt-1 border-t border-space-800">
                            Baseline: {data.baselineMean} {def.unit} (Band: {data.baselineLower} - {data.baselineUpper})
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            <span className="uppercase text-space-400">Source: {data.source}</span>
                            <span className={data.isDeviated ? 'text-amber-400 font-bold' : 'text-status-success'}>
                              {data.isDeviated ? 'DEVIATION' : 'NOMINAL'}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Baseline reference line */}
                {baseline && baseline.confidenceStatus !== 'insufficient_data' && (
                  <ReferenceLine
                    y={baseline.referenceMean}
                    stroke="#36D6E7"
                    strokeDasharray="4 4"
                    strokeOpacity={0.8}
                    label={{
                      value: `Baseline (${baseline.referenceMean})`,
                      fill: '#36D6E7',
                      fontSize: 10,
                      position: 'insideTopLeft'
                    }}
                  />
                )}

                {/* Baseline band */}
                {showBaselineBands && (
                  <Area
                    type="monotone"
                    dataKey="baselineUpper"
                    stroke="none"
                    fill="url(#baselineAreaGrad)"
                  />
                )}

                {/* Rolling Average line */}
                {showRollingAvg && (
                  <Line
                    type="monotone"
                    dataKey="rollingAvg"
                    stroke="#568CFF"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Rolling Average"
                  />
                )}

                {/* Main telemetry reading line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#36D6E7"
                  strokeWidth={2.2}
                  dot={{ r: 3.5, fill: '#36D6E7', stroke: '#080E1B', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#36D6E7', stroke: '#fff', strokeWidth: 2 }}
                  name="Observed Value"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Statistical Footnote */}
        <div className="mt-4 pt-3 border-t border-space-700/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-space-400">
          <div className="flex items-center gap-4">
            <span>
              Samples: <strong className="text-white">{filteredReadings.length}</strong>
            </span>
            <span>
              Mean: <strong className="text-white">{baseline?.referenceMean ?? '--'} {def.unit}</strong>
            </span>
            <span>
              Std Dev (σ): <strong className="text-white">{baseline?.standardDeviation ?? '--'}</strong>
            </span>
            <span>
              Confidence:{' '}
              <strong className={baseline?.confidenceStatus === 'reliable' ? 'text-status-success' : 'text-amber-400'}>
                {baseline?.confidenceStatus.toUpperCase() ?? 'PENDING'}
              </strong>
            </span>
          </div>
          <div className="text-[10px] text-space-500">
            *Non-diagnostic reference model calculated strictly from crew historical telemetry
          </div>
        </div>
      </div>
    </div>
  );
};
