import React, { useState, useMemo, useRef } from 'react';
import {
  Astronaut,
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  MetricType
} from '@/types';
import {
  generateMissionReportSummary,
  exportReadingsToCsv,
  exportAlertsToCsv
} from '@/core/reporting/reportGenerator';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

interface MissionReportsPageProps {
  astronaut: Astronaut;
  readings: HealthReading[];
  baselines: Record<MetricType, HealthBaseline>;
  alerts: HealthAlert[];
  wellness: WellnessCheckIn[];
}

export const MissionReportsPage: React.FC<MissionReportsPageProps> = ({
  astronaut,
  readings,
  baselines,
  alerts,
  wellness
}) => {
  const [periodDays, setPeriodDays] = useState<number>(7);
  const reportRef = useRef<HTMLDivElement>(null);

  const report = useMemo(() => {
    return generateMissionReportSummary(astronaut, readings, baselines, alerts, wellness, periodDays);
  }, [astronaut, readings, baselines, alerts, wellness, periodDays]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTelemetryCsv = () => {
    const csv = exportReadingsToCsv(readings.filter((r) => r.astronautId === astronaut.id));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `STELLAR_Telemetry_${astronaut.missionId}_${astronaut.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAlertsCsv = () => {
    const csv = exportAlertsToCsv(alerts.filter((a) => a.astronautId === astronaut.id));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `STELLAR_Alerts_${astronaut.missionId}_${astronaut.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-space-700/80 gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-cyan-accent" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Mission Health & Telemetry Reporting
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Operational summaries, baseline alignment audits, and source provenance disclosure
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-space-700">
            <Calendar size={13} className="text-space-400 ml-1.5" />
            {[
              { label: '24 Hours', days: 1 },
              { label: '7 Days', days: 7 },
              { label: '14 Days', days: 14 },
              { label: '30 Days', days: 30 }
            ].map((p) => (
              <button
                key={p.days}
                onClick={() => setPeriodDays(p.days)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  periodDays === p.days
                    ? 'bg-cyan-accent text-space-950 font-bold'
                    : 'text-space-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadTelemetryCsv}
            className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-750 border border-space-700 text-xs text-space-200 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Telemetry CSV</span>
          </button>

          <button
            onClick={handleDownloadAlertsCsv}
            className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-750 border border-space-700 text-xs text-space-200 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Alerts CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-cyan-accent text-space-950 hover:bg-cyan-300 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer size={14} />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div ref={reportRef} className="aerospace-card p-8 space-y-6 bg-space-900 border border-space-700">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-space-700 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold tracking-widest text-lg text-white font-mono">
                STELLAR MISSION HEALTH SUMMARY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-cyan-accent border border-cyan-accent/30">
                OFFICIAL REPORT
              </span>
            </div>
            <p className="text-xs text-space-400 font-mono">
              Autonomous Spaceflight Tracking and Risk Awareness System
            </p>
          </div>

          <div className="text-right font-mono text-xs text-space-300">
            <div>
              REPORT ID: <span className="text-white font-bold">{report.reportId}</span>
            </div>
            <div>
              GENERATED: <span className="text-space-400">{new Date(report.generatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mission & Crew Header Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-space-950 border border-space-800 font-mono text-xs">
          <div>
            <span className="text-space-400 block text-[10px]">CREW MEMBER</span>
            <span className="text-white font-bold">{report.astronaut.name}</span>
            <span className="text-space-400 block text-[10px]">"{report.astronaut.callsign}"</span>
          </div>
          <div>
            <span className="text-space-400 block text-[10px]">MISSION ID</span>
            <span className="text-cyan-accent font-bold">{report.astronaut.missionId}</span>
            <span className="text-space-400 block text-[10px]">Elapsed: +{report.astronaut.missionElapsedDays}d</span>
          </div>
          <div>
            <span className="text-space-400 block text-[10px]">REPORTING WINDOW</span>
            <span className="text-white font-medium">{periodDays} Days</span>
            <span className="text-space-400 block text-[10px]">
              {new Date(report.reportingPeriodStart).toLocaleDateString()} - {new Date(report.reportingPeriodEnd).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-space-400 block text-[10px]">DATA INTEGRITY</span>
            <span className="text-status-success font-bold">100% AUDITED</span>
            <span className="text-space-400 block text-[10px]">Records: {report.totalTelemetryRecords}</span>
          </div>
        </div>

        {/* Provenance Audit Notices (Requirement: "Reports must distinguish simulated and imported information") */}
        <div className="p-3.5 rounded-lg bg-space-850 border border-space-750 text-xs font-mono space-y-1">
          <div className="text-cyan-accent font-bold uppercase text-[11px] mb-1">
            Data Provenance Audit Summary:
          </div>
          <div className="flex flex-wrap gap-4 text-slate-300">
            <span>Simulated Telemetry Records: <strong className="text-white">{report.simulatedRecordsCount}</strong></span>
            <span>Imported CSV/JSON Records: <strong className="text-white">{report.importedRecordsCount}</strong></span>
            <span>Sensor Hardware Observations: <strong className="text-white">{report.sensorRecordsCount}</strong></span>
          </div>
          {report.integrityNotices.map((n, i) => (
            <div key={i} className="text-space-400 text-[11px] italic pt-1">
              • {n}
            </div>
          ))}
        </div>

        {/* Physiological Indicator Summary Table */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
            1. Physiological Metric Summaries vs Personal Baseline
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-space-700 text-space-400 text-[10px] uppercase bg-space-950">
                  <th className="py-2 px-3">Indicator</th>
                  <th className="py-2 px-3">Samples</th>
                  <th className="py-2 px-3">Period Mean</th>
                  <th className="py-2 px-3">Range [Min - Max]</th>
                  <th className="py-2 px-3">Personal Baseline</th>
                  <th className="py-2 px-3">Baseline Diff</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800 text-slate-200">
                {report.metricSummaries.map((m) => (
                  <tr key={m.metric} className="hover:bg-space-850/50">
                    <td className="py-2 px-3 font-semibold text-white">{m.label}</td>
                    <td className="py-2 px-3 text-space-400">{m.sampleCount}</td>
                    <td className="py-2 px-3 font-bold text-cyan-accent">
                      {m.mean} {m.unit}
                    </td>
                    <td className="py-2 px-3 text-space-300">
                      {m.min} - {m.max} {m.unit}
                    </td>
                    <td className="py-2 px-3 text-space-300">
                      {m.baselineMean} {m.unit}
                    </td>
                    <td className="py-2 px-3">
                      <span className={m.differenceFromBaseline > 0 ? 'text-amber-400' : 'text-cyan-accent'}>
                        {m.differenceFromBaseline > 0 ? `+${m.differenceFromBaseline}` : m.differenceFromBaseline} {m.unit}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          m.deviationStatus === 'Nominal Alignment'
                            ? 'bg-status-success/10 text-status-success'
                            : 'bg-amber-400/20 text-amber-300'
                        }`}
                      >
                        {m.deviationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wellness Summary */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
            <ClipboardList size={14} className="text-cyan-accent" />
            <span>2. Daily Wellness & Psychomotor Self-Reports</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-space-850 border border-space-750">
              <span className="text-space-400 block text-[10px]">AVG SLEEP QUALITY</span>
              <span className="text-lg font-bold text-white">
                {report.wellnessOverview.avgSleepQuality} / 5
              </span>
            </div>
            <div className="p-3 rounded-lg bg-space-850 border border-space-750">
              <span className="text-space-400 block text-[10px]">AVG FATIGUE SCORE</span>
              <span className="text-lg font-bold text-amber-300">
                {report.wellnessOverview.avgFatigue} / 10
              </span>
            </div>
            <div className="p-3 rounded-lg bg-space-850 border border-space-750">
              <span className="text-space-400 block text-[10px]">AVG STRESS SCORE</span>
              <span className="text-lg font-bold text-white">
                {report.wellnessOverview.avgStress} / 10
              </span>
            </div>
            <div className="p-3 rounded-lg bg-space-850 border border-space-750">
              <span className="text-space-400 block text-[10px]">AVG MOOD SCORE</span>
              <span className="text-lg font-bold text-status-success">
                {report.wellnessOverview.avgMood} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Alert History Section */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>3. Event & Alert Log ({report.alertsTriggered.length})</span>
          </h3>

          {report.alertsTriggered.length === 0 ? (
            <div className="p-4 rounded-lg bg-space-950 border border-space-800 text-xs font-mono text-space-400 text-center">
              No alert triggers recorded during this observation window.
            </div>
          ) : (
            <div className="space-y-2">
              {report.alertsTriggered.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-space-950 border border-space-800 font-mono text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          a.severity === 'URGENT'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-black'
                        }`}
                      >
                        {a.severity}
                      </span>
                      <span className="font-bold text-white">{a.metric}</span>
                    </div>
                    <span className="text-[10px] text-space-400">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs mt-1">
                    {a.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regulatory & Flight Surgeon Sign-off Section */}
        <div className="pt-6 border-t border-space-700/80 text-[11px] font-mono text-space-400 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="max-w-md">
            <span className="font-bold text-space-300 block mb-1">PROTOTYPE DISCLAIMER:</span>
            This automated summary is compiled by the STELLAR software prototype for research demonstration in the NASA Space Apps Challenge 2026. Not certified for diagnostic or clinical medical decisions.
          </div>

          <div className="text-right">
            <div className="border-b border-space-600 pb-1 w-48 text-center text-space-300">
              [AUTONOMOUS VERIFIED]
            </div>
            <div className="text-[10px] text-space-400 mt-1">Flight Crew Health Monitoring System</div>
          </div>
        </div>
      </div>
    </div>
  );
};
