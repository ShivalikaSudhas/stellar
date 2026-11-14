import React, { useState } from 'react';
import {
  CarePlan,
  Medication,
  MedicationSideEffectReport
} from '@/types';
import {
  Pill,
  Utensils,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';

interface CarePlanViewProps {
  carePlan: CarePlan;
  medications: Medication[];
  onToggleMedicationTaken: (id: string) => Promise<void>;
  onReportSideEffect?: (report: MedicationSideEffectReport) => void;
  onOpenDoctorSummary: () => void;
}

export const CarePlanView: React.FC<CarePlanViewProps> = ({
  carePlan,
  medications,
  onToggleMedicationTaken,
  onReportSideEffect,
  onOpenDoctorSummary
}) => {
  const [showSideEffectModal, setShowSideEffectModal] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState(medications[0]?.id || '');
  const [sideEffectSymptom, setSideEffectSymptom] = useState('');
  const [sideEffectSeverity, setSideEffectSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [sideEffectSuccess, setSideEffectSuccess] = useState(false);

  const handleSideEffectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medications.find((m) => m.id === selectedMedId);
    if (!med) return;

    const report: MedicationSideEffectReport = {
      id: `se-${Date.now()}`,
      medicationId: med.id,
      medicationName: med.name,
      symptom: sideEffectSymptom,
      severity: sideEffectSeverity,
      timestamp: new Date().toISOString()
    };

    if (onReportSideEffect) onReportSideEffect(report);
    setSideEffectSuccess(true);
    setTimeout(() => {
      setSideEffectSuccess(false);
      setShowSideEffectModal(false);
      setSideEffectSymptom('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Personal Care Plan
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              Prescribed by {carePlan.doctorName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized clinical protocol covering daily medications, nutrition, activity, and targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSideEffectModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
          >
            Report Side Effect
          </button>
          <button
            onClick={onOpenDoctorSummary}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} />
            <span>1-Page Doctor Brief</span>
          </button>
        </div>
      </div>

      {/* Doctor Clinical Advice Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50/50 border border-blue-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-serif font-bold text-xs flex items-center justify-center">
              Dr
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm block">
                {carePlan.doctorName}
              </span>
              <span className="text-[11px] text-slate-500">{carePlan.hospital}</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Updated: {new Date(carePlan.lastUpdated).toLocaleDateString()}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-serif italic pt-1">
          "{carePlan.doctorNotes}"
        </p>
      </div>

      {/* Daily Medication Schedule & 1-Tap Adherence */}
      <div className="health-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill size={18} className="text-blue-600" />
            <h2 className="text-base font-serif font-semibold text-slate-900">
              Prescribed Medications & Daily Doses
            </h2>
          </div>
          <span className="text-xs text-slate-400">Tap checkmark when taken</span>
        </div>

        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleMedicationTaken(med.id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    med.takenToday
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-300 hover:border-blue-500 text-transparent'
                  }`}
                >
                  <CheckCircle2 size={16} />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {med.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {med.frequency} • {med.timeOfDay} • {med.purpose}
                  </div>
                  {med.sideEffectsWarning && (
                    <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{med.sideEffectsWarning}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-700">
                  {med.adherenceRatePct}% Adherence
                </div>
                <span className="text-[10px] text-slate-400 block">30-day verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diet & Exercise Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diet Guidelines */}
        <div className="health-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-serif font-semibold text-base pb-2 border-b border-slate-100">
            <Utensils size={18} className="text-blue-600" />
            <span>Prescribed Nutrition Guidelines</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {carePlan.dietPlan.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exercise Prescription */}
        <div className="health-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-serif font-semibold text-base pb-2 border-b border-slate-100">
            <Activity size={18} className="text-blue-600" />
            <span>Physical Exercise Prescription</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {carePlan.exercisePrescription.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Clinical Targets Section */}
      <div className="health-card p-6 space-y-3">
        <h3 className="font-serif font-semibold text-sm text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wide">
          Target Health Metrics Defined by Doctor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {carePlan.clinicalTargets.map((target, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 uppercase font-medium block">
                {target.metric}
              </span>
              <span className="text-base font-serif font-bold text-slate-900 mt-0.5 block">
                {target.target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Effect Modal */}
      {showSideEffectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-serif font-semibold text-slate-900">
                Log Medication Side Effect
              </h3>
              <button
                onClick={() => setShowSideEffectModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {sideEffectSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <p className="font-medium text-slate-900 text-sm">Side effect recorded</p>
                <p className="text-xs text-slate-500">Flagged on your next clinician review brief.</p>
              </div>
            ) : (
              <form onSubmit={handleSideEffectSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Select Medication
                  </label>
                  <select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    className="w-full health-input text-xs"
                  >
                    {medications.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.dosage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Symptom Experienced
                  </label>
                  <input
                    type="text"
                    required
                    value={sideEffectSymptom}
                    onChange={(e) => setSideEffectSymptom(e.target.value)}
                    placeholder="e.g. Dizziness 30 min after morning dose, dry cough"
                    className="w-full health-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Severity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSideEffectSeverity(sev)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize ${
                          sideEffectSeverity === sev
                            ? 'bg-blue-50 border-blue-600 text-blue-900'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSideEffectModal(false)}
                    className="px-4 py-2 text-slate-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
