import React from 'react';
import {
  Astronaut,
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  MetricType
} from '@/types';
import { MetricCard } from '@/components/common/MetricCard';
import {
  AlertTriangle,
  CheckCircle,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle
} from 'lucide-react';
import { detectMultiIndicatorCorrelations, analyzeMetricTrend } from '@/core/analysis/trendDetection';
import { NavigationTab } from '@/components/layout/Navbar';

interface MissionOverviewPageProps {
  astronaut: Astronaut;
  readings: HealthReading[];
  baselines: Record<MetricType, HealthBaseline>;
  alerts: HealthAlert[];
  wellness: WellnessCheckIn[];
  onAcknowledgeAlert: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const MissionOverviewPage: React.FC<MissionOverviewPageProps> = ({
  astronaut,
  readings,
  baselines,
  alerts,
  wellness,
  onAcknowledgeAlert,
  onNavigate
}) => {
  // Get latest readings for each primary metric
  const getLatestReading = (m: MetricType): HealthReading | undefined => {
    const list = readings.filter((r) => r.metric === m);
    return list.length > 0 ? list[list.length - 1] : undefined;
  };

  const hrReading = getLatestReading('heart_rate');
  const spo2Reading = getLatestReading('spo2');
  const sleepReading = getLatestReading('sleep_duration');
  const activityReading = getLatestReading('activity');
  const fatigueReading = getLatestReading('fatigue');
  const stressReading = getLatestReading('stress');

  // Trend analysis map for multi-indicator correlations
  const trendMap = React.useMemo(() => {
    const metrics: MetricType[] = ['heart_rate', 'spo2', 'sleep_duration', 'activity', 'fatigue', 'stress'];
    const map: Record<string, ReturnType<typeof analyzeMetricTrend>> = {};
    metrics.forEach((m) => {
      map[m] = analyzeMetricTrend(m, readings, baselines[m]);
    });
    return map;
  }, [readings, baselines]);

  const correlations = React.useMemo(() => {
    return detectMultiIndicatorCorrelations(trendMap);
  }, [trendMap]);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Top Banner: Astronaut Mission Context & System Status */}
      <div className="aerospace-card p-5 bg-gradient-to-r from-space-900 via-space-850 to-space-900 border-l-4 border-l-cyan-accent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-space-800 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-bold text-xl shadow-inner">
            {astronaut.callsign.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">{astronaut.name}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-space-750 text-cyan-accent border border-space-700">
                "{astronaut.callsign}"
              </span>
            </div>
            <p className="text-xs text-space-300 font-mono mt-0.5">
              {astronaut.role} | Mission: <span className="text-white font-semibold">{astronaut.missionId}</span> | MET: +{astronaut.missionElapsedDays}d 14h (Demo)
            </p>
          </div>
        </div>

        {/* Quick status pill counters */}
        <div className="flex items-center gap-3 font-mono text-xs w-full md:w-auto justify-between md:justify-end">
          <div className="bg-space-800 border border-space-700 rounded-lg px-3 py-2 text-center min-w-[90px]">
            <div className="text-[10px] text-space-400">READINGS</div>
            <div className="text-sm font-bold text-white">{readings.length}</div>
          </div>
          <div className="bg-space-800 border border-space-700 rounded-lg px-3 py-2 text-center min-w-[90px]">
            <div className="text-[10px] text-space-400">BASELINES</div>
            <div className="text-sm font-bold text-cyan-accent">ESTABLISHED</div>
          </div>
          <div className="bg-space-800 border border-space-700 rounded-lg px-3 py-2 text-center min-w-[90px]">
            <div className="text-[10px] text-space-400">WELLNESS</div>
            <div className="text-sm font-bold text-white">{wellness.length} LOGS</div>
          </div>
          <div className="bg-space-800 border border-space-700 rounded-lg px-3 py-2 text-center min-w-[90px]">
            <div className="text-[10px] text-space-400">ACTIVE ALERTS</div>
            <div className={`text-sm font-bold ${unacknowledgedAlerts.length > 0 ? 'text-amber-400' : 'text-status-success'}`}>
              {unacknowledgedAlerts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Health Indicator Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-accent" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-200">
              Primary Physiological Indicators
            </h2>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-mono text-cyan-accent hover:underline flex items-center gap-1"
          >
            <span>View Full Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            metric="heart_rate"
            currentValue={hrReading?.value ?? 65}
            baseline={baselines['heart_rate']}
            source={hrReading?.source ?? 'simulated'}
            quality={hrReading?.quality ?? 'synthetic'}
            timestamp={hrReading?.timestamp}
            onClick={() => onNavigate('analytics')}
          />
          <MetricCard
            metric="spo2"
            currentValue={spo2Reading?.value ?? 98.2}
            baseline={baselines['spo2']}
            source={spo2Reading?.source ?? 'simulated'}
            quality={spo2Reading?.quality ?? 'synthetic'}
            timestamp={spo2Reading?.timestamp}
            onClick={() => onNavigate('analytics')}
          />
          <MetricCard
            metric="sleep_duration"
            currentValue={sleepReading?.value ?? 7.4}
            baseline={baselines['sleep_duration']}
            source={sleepReading?.source ?? 'simulated'}
            quality={sleepReading?.quality ?? 'synthetic'}
            timestamp={sleepReading?.timestamp}
            onClick={() => onNavigate('analytics')}
          />
          <MetricCard
            metric="activity"
            currentValue={activityReading?.value ?? 105}
            baseline={baselines['activity']}
            source={activityReading?.source ?? 'simulated'}
            quality={activityReading?.quality ?? 'synthetic'}
            timestamp={activityReading?.timestamp}
            onClick={() => onNavigate('analytics')}
          />
          <MetricCard
            metric="fatigue"
            currentValue={fatigueReading?.value ?? 2.5}
            baseline={baselines['fatigue']}
            source={fatigueReading?.source ?? 'simulated'}
            quality={fatigueReading?.quality ?? 'synthetic'}
            timestamp={fatigueReading?.timestamp}
            onClick={() => onNavigate('wellness')}
          />
          <MetricCard
            metric="stress"
            currentValue={stressReading?.value ?? 2.1}
            baseline={baselines['stress']}
            source={stressReading?.source ?? 'simulated'}
            quality={stressReading?.quality ?? 'synthetic'}
            timestamp={stressReading?.timestamp}
            onClick={() => onNavigate('wellness')}
          />
        </div>
      </div>

      {/* Middle Split: Active Alerts & Explainable Correlation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts Panel */}
        <div className="aerospace-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Active Mission Alerts ({unacknowledgedAlerts.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-mono text-cyan-accent hover:underline flex items-center gap-1"
              >
                <span>Alert Manager</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {unacknowledgedAlerts.length === 0 ? (
              <div className="py-8 text-center text-space-400 border border-dashed border-space-700 rounded-lg">
                <CheckCircle size={32} className="mx-auto text-status-success mb-2 opacity-80" />
                <p className="text-sm text-slate-300 font-medium">All Physiological Indicators Nominal</p>
                <p className="text-xs text-space-400 mt-1 max-w-sm mx-auto font-mono">
                  No active deviations from personal baseline. Prototype rules continuously evaluating incoming telemetry.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {unacknowledgedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-lg border text-xs font-mono ${
                      alert.severity === 'URGENT'
                        ? 'bg-red-950/20 border-red-500/40 text-red-200'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alert.severity === 'URGENT'
                              ? 'bg-red-500 text-white'
                              : alert.severity === 'WARNING'
                              ? 'bg-amber-500 text-black'
                              : 'bg-cyan-accent text-black'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-semibold text-white uppercase">{alert.metric.replace('_', ' ')}</span>
                      </div>
                      <span className="text-[10px] text-space-400">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] font-sans leading-relaxed mb-2">
                      {alert.explanation}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-space-700/60">
                      <div className="text-[10px] text-space-400">
                        Observed: <span className="text-white font-bold">{alert.observedValue}</span> | Baseline: {alert.baselineValue}
                      </div>
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded bg-space-800 hover:bg-space-700 border border-space-600 text-[10px] text-white font-mono transition-colors"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-space-700 text-[10px] font-mono text-space-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-cyan-accent" />
              Explainable deterministic rule engine active
            </span>
            <span>Duplicate suppression: ON</span>
          </div>
        </div>

        {/* Multi-Indicator Contextual Analysis Panel */}
        <div className="aerospace-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-cyan-accent" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Multi-Indicator Contextual Analysis
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-cyan-accent border border-cyan-accent/20">
                Cross-Telemetry
              </span>
            </div>

            {correlations.length === 0 ? (
              <div className="py-8 text-center text-space-400 border border-dashed border-space-700 rounded-lg">
                <CheckCircle size={32} className="mx-auto text-cyan-accent/60 mb-2" />
                <p className="text-sm text-slate-300 font-medium">No Multi-Indicator Stress Patterns</p>
                <p className="text-xs text-space-400 mt-1 max-w-sm mx-auto font-mono">
                  Telemetry parameters are varying independently within standard biological deviation bands.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {correlations.map((corr) => (
                  <div key={corr.id} className="p-3.5 rounded-lg bg-space-850 border border-space-700 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-cyan-accent text-xs">
                        {corr.summary}
                      </span>
                      <span className="text-[10px] font-mono text-space-400">
                        {corr.relatedMetrics.join(' + ')}
                      </span>
                    </div>

                    <ul className="space-y-1 mb-2 font-mono text-[11px] text-slate-300 list-disc list-inside">
                      {corr.observations.map((obs, idx) => (
                        <li key={idx}>{obs}</li>
                      ))}
                    </ul>

                    <div className="p-2 rounded bg-space-900 border border-space-750 text-[10px] text-space-300 font-mono italic">
                      {corr.caveat}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-space-700 text-[10px] font-mono text-space-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <HelpCircle size={12} className="text-space-400" />
              Temporal co-occurrence, not clinical causality
            </span>
            <span>Microgravity adaptation index</span>
          </div>
        </div>
      </div>

      {/* Recent Telemetry Stream & Wellness Summary */}
      <div className="aerospace-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Recent Telemetry Stream (Last 6 Observations)
          </h3>
          <span className="text-[10px] font-mono text-space-400">
            Source Provenance Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-700 text-space-400 text-[10px] uppercase">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Indicator</th>
                <th className="py-2 px-3">Observed Value</th>
                <th className="py-2 px-3">Baseline Mean</th>
                <th className="py-2 px-3">Source Provenance</th>
                <th className="py-2 px-3">Data Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800 text-slate-200">
              {readings.slice(-6).reverse().map((r) => {
                const b = baselines[r.metric];
                return (
                  <tr key={r.id} className="hover:bg-space-850/50 transition-colors">
                    <td className="py-2 px-3 text-space-300 text-[11px]">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2 px-3 font-semibold text-white uppercase text-[11px]">
                      {r.metric.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-3 font-bold text-cyan-accent">
                      {r.value} <span className="text-space-400 font-normal text-[10px]">{r.unit}</span>
                    </td>
                    <td className="py-2 px-3 text-space-300">
                      {b && b.confidenceStatus !== 'insufficient_data' ? `${b.referenceMean} ${r.unit}` : 'Calculating...'}
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-space-800 text-space-300 border border-space-700">
                        {r.source}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                          r.quality === 'nominal'
                            ? 'text-status-success bg-status-success/10'
                            : r.quality === 'synthetic'
                            ? 'text-cyan-accent bg-cyan-accent/10'
                            : 'text-amber-400 bg-amber-400/10'
                        }`}
                      >
                        {r.quality}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
