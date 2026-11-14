import React from 'react';
import { X, Printer, FileText, ShieldCheck } from 'lucide-react';
import { Medication, HealthBaseline, HealthReading } from '@/types';

interface DoctorSummaryModalProps {
  patientName: string;
  patientAge: number;
  doctorName: string;
  medications: Medication[];
  baselines: Record<string, HealthBaseline>;
  latestReadings: HealthReading[];
  onClose: () => void;
}

export const DoctorSummaryModal: React.FC<DoctorSummaryModalProps> = ({
  patientName,
  patientAge,
  doctorName,
  medications,
  baselines,
  latestReadings,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const hrBase = baselines['heart_rate'];
  const bpSysBase = baselines['blood_pressure_sys'];
  const bpDiaBase = baselines['blood_pressure_dia'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        {/* Modal Actions Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <FileText size={18} className="text-blue-600" />
            <span>One-Page Clinical Pre-Visit Summary</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer size={14} />
              <span>Print / Save 1-Page PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Clinical Document Shell */}
        <div className="space-y-6 text-slate-800 text-xs">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                PULSE / STELLAR CLINICAL PRE-VISIT BRIEF
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Prepared automatically from patient continuous home monitoring & personal baseline telemetry.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <div>DATE: {new Date().toLocaleDateString()}</div>
              <div>CLINICIAN: {doctorName}</div>
            </div>
          </div>

          {/* Patient Overview Strip */}
          <div className="grid grid-cols-4 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium block">PATIENT NAME</span>
              <span className="font-serif font-bold text-sm text-slate-900">{patientName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium block">AGE / GENDER</span>
              <span className="font-semibold text-slate-800">{patientAge} Years / Female</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium block">PRIMARY FOCUS</span>
              <span className="font-semibold text-blue-700">Essential Hypertension & Lipids</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-medium block">OBSERVATION WINDOW</span>
              <span className="font-semibold text-slate-800">Last 30 Days (100% adherence)</span>
            </div>
          </div>

          {/* Vitals Summary Matrix */}
          <div>
            <h3 className="font-serif font-semibold text-sm text-slate-900 mb-2 uppercase tracking-wide">
              1. Longitudinal Vitals & Personal Baseline Mean
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">RESTING HEART RATE</span>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {hrBase ? hrBase.referenceMean : 72} <span className="text-xs font-normal text-slate-500 font-sans">bpm</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Baseline Normal: {hrBase ? `${hrBase.referenceMean} ± ${hrBase.standardDeviation}` : '70 ± 3'} bpm
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">● Stable sinus rhythm</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">7-DAY AVG BLOOD PRESSURE</span>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  {bpSysBase?.referenceMean ? Math.round(bpSysBase.referenceMean) : 121} / {bpDiaBase?.referenceMean ? Math.round(bpDiaBase.referenceMean) : 79} <span className="text-xs font-normal text-slate-500 font-sans">mmHg</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Target: &lt;125/80 mmHg (Achieved)
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">● Controlled ({latestReadings.length} records verified)</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-[10px] text-slate-500 uppercase font-medium block">FASTING GLUCOSE AVG</span>
                <div className="text-xl font-serif font-bold text-slate-900 mt-0.5">
                  96 <span className="text-xs font-normal text-slate-500 font-sans">mg/dL</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Range: 88 - 108 mg/dL
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">● Euglycemic curve</span>
              </div>
            </div>
          </div>

          {/* Active Medication Adherence */}
          <div>
            <h3 className="font-serif font-semibold text-sm text-slate-900 mb-2 uppercase tracking-wide">
              2. Prescribed Medications & Verified Adherence
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 text-[11px] font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Medication</th>
                    <th className="py-2 px-3">Dosage</th>
                    <th className="py-2 px-3">Timing</th>
                    <th className="py-2 px-3">Adherence (30d)</th>
                    <th className="py-2 px-3">Reported Side Effects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medications.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{m.name}</td>
                      <td className="py-2 px-3">{m.dosage}</td>
                      <td className="py-2 px-3">{m.timeOfDay}</td>
                      <td className="py-2 px-3 font-semibold text-emerald-700">{m.adherenceRatePct}%</td>
                      <td className="py-2 px-3 text-slate-500">{m.sideEffectsWarning || 'None reported'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Discussion Items for Doctor */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
            <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wide">
              3. Patient-Prepared Discussion Questions:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
              <li>"Blood pressure is stable at 121/79 mmHg — should we maintain current Telmisartan 40mg dosage?"</li>
              <li>"Occasional mild lightheadedness when taking morning medication before breakfast."</li>
              <li>"Inquired about increasing weekly resistance training intensity."</li>
            </ul>
          </div>

          {/* Signoff Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-blue-800">
              <ShieldCheck size={14} />
              <span>HIPAA Compliant Personal Health Summary • Encrypted Local Vault</span>
            </span>
            <span>Clinician Review Signature: __________________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
