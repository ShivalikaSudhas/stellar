import React, { useState, useMemo } from 'react';
import {
  HealthAlert,
  SeverityLevel,
  MetricType
} from '@/types';
import { METRIC_DEFINITIONS } from '@/core/data/metricDefinitions';
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Eye,
  Check,
  Shield,
  FileQuestion,
  Info
} from 'lucide-react';

interface AlertsPageProps {
  alerts: HealthAlert[];
  onAcknowledgeAlert: (id: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onAcknowledgeAlert
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNACKNOWLEDGED' | 'ACKNOWLEDGED'>('ALL');
  const [metricFilter, setMetricFilter] = useState<'ALL' | MetricType>('ALL');
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<HealthAlert | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
      if (statusFilter === 'UNACKNOWLEDGED' && a.acknowledged) return false;
      if (statusFilter === 'ACKNOWLEDGED' && !a.acknowledged) return false;
      if (metricFilter !== 'ALL' && a.metric !== metricFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter, metricFilter]);

  const urgentCount = alerts.filter((a) => a.severity === 'URGENT' && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged).length;
  const infoCount = alerts.filter((a) => a.severity === 'INFO' && !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Explainable Alert Management & Events
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Transparent deterministic alert triggers evaluated against individual baseline deviations
          </p>
        </div>

        {/* Severity Count Chips */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>URGENT: {urgentCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>WARNING: {warningCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-accent"></span>
            <span>INFO: {infoCount}</span>
          </div>
        </div>
      </div>

      {/* Disclaimers & Operational Context */}
      <div className="p-3.5 rounded-lg bg-space-900 border border-space-700 text-xs font-mono text-space-300 flex items-start gap-2.5">
        <Info size={16} className="text-cyan-accent flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-semibold">Non-Diagnostic Operational Classification:</span>{' '}
          Alert categories (INFO, WARNING, URGENT) represent demonstration software event priorities evaluated by configured statistical rules. They do not constitute clinical diagnoses or replace Mission Flight Surgeons.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="aerospace-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-space-400">
            <Filter size={14} />
            <span>SEVERITY:</span>
          </div>
          {(['ALL', 'URGENT', 'WARNING', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-accent text-space-950 font-bold'
                  : 'bg-space-850 border border-space-700 text-space-300 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-space-700 hidden sm:inline">|</span>

          <div className="text-xs font-mono text-space-400">METRIC:</div>
          <select
            value={metricFilter}
            onChange={(e) => setMetricFilter(e.target.value as 'ALL' | MetricType)}
            className="bg-space-850 border border-space-700 text-xs text-space-200 rounded px-2 py-1 font-mono focus:outline-none focus:border-cyan-accent"
          >
            <option value="ALL">ALL METRICS</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="spo2">SpO2</option>
            <option value="sleep_duration">Sleep Duration</option>
            <option value="activity">Exercise Activity</option>
            <option value="fatigue">Fatigue Score</option>
            <option value="stress">Stress Level</option>
          </select>
          {(['ALL', 'UNACKNOWLEDGED', 'ACKNOWLEDGED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-accent text-space-950 font-bold'
                  : 'bg-space-850 border border-space-700 text-space-300 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-space-400">
          Showing <span className="text-white font-bold">{filteredAlerts.length}</span> of {alerts.length} events
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="aerospace-card py-16 text-center text-space-400">
          <CheckCircle size={36} className="mx-auto text-status-success mb-2 opacity-80" />
          <h3 className="text-base font-medium text-slate-200">No Alerts Matching Configured Filters</h3>
          <p className="text-xs font-mono text-space-400 mt-1 max-w-md mx-auto">
            Change filter criteria or trigger the Mission Data Simulator scenarios to observe alert generation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const def = METRIC_DEFINITIONS[alert.metric];
            const isUrgent = alert.severity === 'URGENT';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`aerospace-card p-5 transition-all ${
                  !alert.acknowledged
                    ? isUrgent
                      ? 'border-red-500/60 bg-red-950/10'
                      : isWarning
                      ? 'border-amber-500/60 bg-amber-950/10'
                      : 'border-cyan-500/50 bg-cyan-950/10'
                    : 'opacity-75 border-space-700'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-space-700/70 gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-red-500 text-white shadow-sm'
                          : isWarning
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-cyan-accent text-black'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-bold text-white text-sm uppercase">
                      {def?.label || alert.metric.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-space-400">
                      ID: {alert.id.slice(0, 18)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-space-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    {alert.acknowledged ? (
                      <span className="text-status-success flex items-center gap-1 text-[11px]">
                        <Check size={13} /> ACKNOWLEDGED
                      </span>
                    ) : (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 rounded bg-space-800 hover:bg-space-750 border border-space-600 text-cyan-accent text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Check size={13} />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Explanation Body */}
                <div className="space-y-3">
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {alert.explanation}
                  </p>

                  {/* Quantitative Metric Comparison Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs bg-space-900 p-3 rounded-lg border border-space-750">
                    <div>
                      <span className="text-space-400 block text-[10px]">OBSERVED VALUE</span>
                      <span className="text-white font-bold text-sm">
                        {alert.observedValue} {def?.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-space-400 block text-[10px]">PERSONAL BASELINE</span>
                      <span className="text-space-200 font-medium text-sm">
                        {alert.baselineValue} {def?.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-space-400 block text-[10px]">NET DEVIATION</span>
                      <span className={alert.deviation > 0 ? 'text-amber-400 font-bold text-sm' : 'text-cyan-accent font-bold text-sm'}>
                        {alert.deviation > 0 ? `+${alert.deviation}` : alert.deviation} {def?.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-space-400 block text-[10px]">PERSISTENCE</span>
                      <span className="text-cyan-accent font-medium text-sm">
                        {alert.consecutiveReadings} consecutive reading(s)
                      </span>
                    </div>
                  </div>

                  {/* Recommended Non-Diagnostic Protocol */}
                  <div className="p-3 rounded-lg bg-space-850 border border-space-700/80 flex items-start gap-2 text-xs">
                    <Shield size={16} className="text-cyan-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-cyan-accent font-semibold font-mono uppercase text-[11px] block">
                        Recommended Operational Protocol:
                      </span>
                      <p className="text-slate-300 font-sans mt-0.5">
                        {alert.recommendedProtocol}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card footer details & view action */}
                <div className="mt-3 pt-2.5 border-t border-space-700/50 flex items-center justify-between text-[11px] font-mono text-space-400">
                  <div className="flex items-center gap-3">
                    <span>Rule Trigger: <code className="text-space-300">{alert.ruleId}</code></span>
                    <span>Data Quality: <code className="text-status-success">{alert.dataQuality}</code></span>
                  </div>
                  <button
                    onClick={() => setSelectedAlertForModal(alert)}
                    className="text-cyan-accent hover:underline flex items-center gap-1"
                  >
                    <Eye size={13} />
                    <span>View Technical Telemetry Trace</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Technical Trace Detail Modal */}
      {selectedAlertForModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-900 border border-space-700 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-space-700">
              <div className="flex items-center gap-2">
                <FileQuestion size={18} className="text-cyan-accent" />
                <h3 className="text-base font-bold text-white">
                  Technical Alert Trace & Evidence Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="text-space-400 hover:text-white font-mono text-sm"
              >
                [CLOSE]
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-space-400">Alert Identifier:</span>{' '}
                <span className="text-white">{selectedAlertForModal.id}</span>
              </div>
              <div>
                <span className="text-space-400">Astronaut ID:</span>{' '}
                <span className="text-cyan-accent">{selectedAlertForModal.astronautId}</span>
              </div>
              <div>
                <span className="text-space-400">Trigger Timestamp:</span>{' '}
                <span className="text-white">{selectedAlertForModal.timestamp}</span>
              </div>
              <div>
                <span className="text-space-400">Contributing Factors Logged:</span>{' '}
                {selectedAlertForModal.contributingFactors.length > 0 ? (
                  <ul className="list-disc list-inside mt-1 text-slate-300">
                    {selectedAlertForModal.contributingFactors.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-space-400 italic">None isolated</span>
                )}
              </div>
              <div className="p-3 rounded bg-space-950 border border-space-800 text-slate-300 font-sans text-xs">
                {selectedAlertForModal.explanation}
              </div>
            </div>

            <div className="pt-3 border-t border-space-700 flex justify-end">
              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="px-4 py-2 rounded bg-space-800 hover:bg-space-700 text-white text-xs font-mono transition-colors"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
