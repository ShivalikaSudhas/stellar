import React, { useState } from 'react';
import {
  DoctorPatient,
  DoctorFeedbackNote,
  HealthReading
} from '@/types';
import {
  Stethoscope,
  CheckCircle2,
  Send,
  Filter,
  AlertTriangle,
  Radio,
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';

interface DoctorViewProps {
  onSendFeedbackNote: (note: Omit<DoctorFeedbackNote, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  patientReadings: HealthReading[];
  onTriggerSos?: () => void;
}

const SAMPLE_PATIENTS: DoctorPatient[] = [
  {
    id: 'user-chen',
    name: 'R. Chen',
    callsign: 'PHOENIX',
    missionId: 'ARTEMIS-VII',
    age: 41,
    gender: 'Male',
    bloodType: 'A+',
    riskLevel: 'high',
    primaryCondition: 'Acute Tachycardia & Fatigue',
    lastSystolicBP: 138,
    lastDiastolicBP: 92,
    lastHeartRate: 88,
    spo2: 96.2,
    adherenceRate: 82,
    unacknowledgedAlerts: 2,
    lastUpdated: '12 mins ago'
  },
  {
    id: 'user-kim',
    name: 'J. Kim',
    callsign: 'VANGUARD',
    missionId: 'ARTEMIS-VII',
    age: 36,
    gender: 'Male',
    bloodType: 'O-',
    riskLevel: 'moderate',
    primaryCondition: 'Circadian Sleep Misalignment',
    lastSystolicBP: 126,
    lastDiastolicBP: 82,
    lastHeartRate: 76,
    spo2: 98.1,
    adherenceRate: 89,
    unacknowledgedAlerts: 1,
    lastUpdated: '1 hour ago'
  },
  {
    id: 'user-asha',
    name: 'Asha Sharma',
    callsign: 'VALKYRIE',
    missionId: 'ARTEMIS-VII',
    age: 58,
    gender: 'Female',
    bloodType: 'B+',
    riskLevel: 'stable',
    primaryCondition: 'Essential Hypertension (Controlled)',
    lastSystolicBP: 121,
    lastDiastolicBP: 79,
    lastHeartRate: 72,
    spo2: 98.8,
    adherenceRate: 96,
    unacknowledgedAlerts: 0,
    lastUpdated: '25 mins ago'
  }
];

const CLINICAL_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    category: 'Countermeasures',
    title: 'Increase Daily Resistive Workout (+20 min ARED)',
    instruction: 'Complete additional 20 minutes of high-resistance deadlifts and squats on the ARED unit.',
    why: 'Zero gravity eliminates skeletal loading, inducing 1-1.5% bone mineral density loss and rapid muscle atrophy per month without aggressive resistive loading.'
  },
  {
    id: 'rec-2',
    category: 'Hydration & Fluids',
    title: 'Oral Electrolyte Restitution (600 ml isotonic)',
    instruction: 'Consume 600 ml isotonic electrolyte fluid 1 hour prior to sleep cycle.',
    why: 'Microgravity causes cephalic fluid redistribution ("puffy face, bird legs"), triggering the brain to flush plasma volume. Electrolyte restitution restores circulating volume and stabilizes blood pressure.'
  },
  {
    id: 'rec-3',
    category: 'Sleep & Circadian',
    title: 'Enforce 480nm Blue-Cutoff in Sleep Quarters',
    instruction: 'Switch personal sleep cabin illumination to dim red-shifted spectrum 60 mins before rest.',
    why: 'Orbiting spacecraft experience 16 sunrises daily. Narrow-spectrum lighting entrains melatonin synthesis, preventing chronic sleep debt and cognitive degradation.'
  }
];

export const DoctorView: React.FC<DoctorViewProps> = ({
  onSendFeedbackNote,
  patientReadings: _patientReadings,
  onTriggerSos
}) => {
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient>(SAMPLE_PATIENTS[0]);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedRecs, setSelectedRecs] = useState<string[]>([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'high' | 'moderate' | 'stable'>('ALL');
  const [sosSent, setSosSent] = useState(false);

  // Filter patients by urgency
  const filteredPatients = SAMPLE_PATIENTS.filter((p) => {
    if (filterRisk !== 'ALL' && p.riskLevel !== filterRisk) return false;
    return true;
  });

  const toggleRecommendation = (id: string) => {
    setSelectedRecs((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim() && selectedRecs.length === 0) return;

    let fullMessage = feedbackMessage.trim();
    if (selectedRecs.length > 0) {
      const recsText = selectedRecs
        .map((rid) => {
          const rec = CLINICAL_RECOMMENDATIONS.find((r) => r.id === rid);
          return rec ? `• ${rec.title}: ${rec.instruction} (Rationale: ${rec.why})` : '';
        })
        .filter(Boolean)
        .join('\n');

      fullMessage = `${fullMessage}\n\n[RECOMMENDATIONS FOR PATIENT]:\n${recsText}`;
    }

    await onSendFeedbackNote({
      patientId: selectedPatient.id,
      doctorName: 'Dr. Rajesh Mehta, MD (Lead Attending Doctor)',
      title: feedbackTitle.trim() || 'Clinical Review Note & Recommendations',
      message: fullMessage
    });

    setSendSuccess(true);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setSelectedRecs([]);
    setTimeout(() => setSendSuccess(false), 3500);
  };

  const handleSosTrigger = () => {
    if (onTriggerSos) {
      onTriggerSos();
    } else {
      setSosSent(true);
      setTimeout(() => setSosSent(false), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ========================================================= */}
      {/* 1. PHYSICIAN DETAIL HEADER */}
      {/* ========================================================= */}
      <div className="space-card p-5 bg-gradient-to-r from-space-900 via-space-850 to-space-900 border-l-4 border-l-accent-blue flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-blue/15 border border-accent-blue/40 flex items-center justify-center text-accent-blue shadow-inner flex-shrink-0">
            <Stethoscope size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                Dr. Rajesh Mehta, MD, FACC
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/40 font-bold">
                Attending Doctor
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                Lic: MED-8842-SP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Mission Health Directorate • Cardiovascular & Telemetry Division</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                Live Telemetry Uplink Active
              </span>
            </p>
          </div>
        </div>

        {/* SOS Emergency Dispatch Button in Doctor Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSosTrigger}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all border border-red-400"
          >
            <AlertTriangle size={15} />
            <span>DISPATCH MEDICAL SOS</span>
          </button>
        </div>
      </div>

      {sosSent && (
        <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-200 flex items-center justify-between animate-fade-in font-mono">
          <span className="flex items-center gap-2">
            <Radio size={16} className="text-red-400 animate-pulse" />
            CRITICAL SOS DISPATCHED: High-priority emergency beacon transmitted to patient terminal & Mission Control.
          </span>
          <span className="text-[10px] bg-red-900 px-2 py-0.5 rounded text-white font-bold">SENT</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. URGENCY FILTER BAR (High, Moderate, Stable) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-space-900/80 p-3 rounded-2xl border border-space-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter size={13} className="text-accent-blue" />
            Patient Triage by Clinical Urgency:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              filterRisk === 'ALL'
                ? 'bg-white text-space-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-space-950 border border-space-800'
            }`}
          >
            ALL ({SAMPLE_PATIENTS.length})
          </button>

          <button
            onClick={() => setFilterRisk('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterRisk === 'high'
                ? 'bg-red-500 text-white shadow-glow-red'
                : 'text-red-400 bg-red-950/30 border border-red-800/40 hover:bg-red-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            HIGH URGENCY ({SAMPLE_PATIENTS.filter((p) => p.riskLevel === 'high').length})
          </button>

          <button
            onClick={() => setFilterRisk('moderate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterRisk === 'moderate'
                ? 'bg-amber-500 text-space-950 shadow-glow-amber'
                : 'text-amber-400 bg-amber-950/30 border border-amber-800/40 hover:bg-amber-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            MODERATE URGENCY ({SAMPLE_PATIENTS.filter((p) => p.riskLevel === 'moderate').length})
          </button>

          <button
            onClick={() => setFilterRisk('stable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterRisk === 'stable'
                ? 'bg-emerald-500 text-space-950 shadow'
                : 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            STABLE ({SAMPLE_PATIENTS.filter((p) => p.riskLevel === 'stable').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Patient List on Left (5 col), Patient Info & Actions on Right (7 col) */}
      <div className="grid grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* PATIENT LIST (Sorted by Urgency) */}
        {/* ========================================================= */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Active Astronaut Patients ({filteredPatients.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Sorted by Clinical Urgency</span>
          </div>

          <div className="space-y-3">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`space-card p-4 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-accent-blue bg-space-850 shadow-glow-blue'
                      : 'border-space-800 hover:border-space-600 bg-space-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-space-950 border border-space-700 text-white font-serif font-bold text-sm flex items-center justify-center">
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          {p.callsign && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-space-800 text-cyan-accent border border-space-700">
                              {p.callsign}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {p.age}y • {p.gender} • Blood {p.bloodType || 'O+'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full ${
                        p.riskLevel === 'high'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
                          : p.riskLevel === 'moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {p.riskLevel === 'high' ? 'High Urgency' : p.riskLevel === 'moderate' ? 'Moderate Urgency' : 'Stable'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 font-medium">
                    Primary: <span className="text-white">{p.primaryCondition}</span>
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-space-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">BP</span>
                      <span className="font-bold text-white">{p.lastSystolicBP}/{p.lastDiastolicBP}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">PULSE</span>
                      <span className="font-bold text-white">{p.lastHeartRate} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">SpO2</span>
                      <span className="font-bold text-cyan-accent">{p.spo2 || 98}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">ALERTS</span>
                      <span className={`font-bold ${p.unacknowledgedAlerts > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {p.unacknowledgedAlerts}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Patient Info Detail + Clinical Notes + Recommendations */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* ========================================================= */}
          {/* 2. PATIENT INFO DETAIL CARD */}
          {/* ========================================================= */}
          <div className="space-card p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-space-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-serif font-bold text-white">
                    {selectedPatient.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-space-800 border border-space-700 text-cyan-accent font-mono font-bold">
                    CALLSIGN: {selectedPatient.callsign || 'CREW'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-space-950 border border-space-800 text-slate-400 font-mono">
                    ID: {selectedPatient.id}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Age: <strong className="text-white">{selectedPatient.age}</strong></span>
                  <span>Gender: <strong className="text-white">{selectedPatient.gender}</strong></span>
                  <span>Blood Type: <strong className="text-white">{selectedPatient.bloodType || 'B+'}</strong></span>
                  <span>Mission: <strong className="text-cyan-accent">{selectedPatient.missionId || 'ARTEMIS'}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs uppercase font-mono font-bold px-3 py-1 rounded-full inline-block ${
                    selectedPatient.riskLevel === 'high'
                      ? 'bg-red-500/20 text-red-300 border border-red-500'
                      : selectedPatient.riskLevel === 'moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                  }`}
                >
                  {selectedPatient.riskLevel.toUpperCase()} URGENCY
                </span>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">
                  Updated {selectedPatient.lastUpdated}
                </span>
              </div>
            </div>

            {/* Vitals Matrix */}
            <div className="grid grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Heart Rate</span>
                <span className="text-2xl font-serif font-bold text-white">{selectedPatient.lastHeartRate}</span>
                <span className="text-[10px] text-slate-400 block">bpm</span>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Blood Pressure</span>
                <span className="text-xl font-serif font-bold text-white">
                  {selectedPatient.lastSystolicBP}/{selectedPatient.lastDiastolicBP}
                </span>
                <span className="text-[10px] text-slate-400 block">mmHg</span>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Blood Oxygen</span>
                <span className="text-2xl font-serif font-bold text-cyan-accent">{selectedPatient.spo2 || 98.4}%</span>
                <span className="text-[10px] text-slate-400 block">SpO2</span>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Adherence</span>
                <span className="text-2xl font-serif font-bold text-emerald-400">{selectedPatient.adherenceRate}%</span>
                <span className="text-[10px] text-slate-400 block">Protocol</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. RECOMMENDATIONS FOR PATIENTS (With "Why is that tho") */}
          {/* ========================================================= */}
          <div className="space-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-space-800">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-accent" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Evidence-Based Recommendations for Patient
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Select to attach to note
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Astronauts experience unique zero-G physiological adaptations. Recommendations must clearly explain the underlying rationale so the astronaut understands why the action is required:
            </p>

            <div className="space-y-3">
              {CLINICAL_RECOMMENDATIONS.map((rec) => {
                const isChecked = selectedRecs.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    onClick={() => toggleRecommendation(rec.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-cyan-accent bg-cyan-950/20 shadow-sm'
                        : 'border-space-800 bg-space-900/60 hover:border-space-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-space-700 text-cyan-accent focus:ring-0"
                        />
                        <span className="text-xs font-bold text-white">{rec.title}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-space-800 text-slate-400 border border-space-700">
                        {rec.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 pl-6">
                      <strong>Instruction:</strong> {rec.instruction}
                    </p>

                    {/* Explanatory "Why is that" block */}
                    <div className="mt-2 ml-6 p-2.5 rounded-lg bg-space-950/80 border border-space-800 text-[11px]">
                      <span className="text-cyan-accent font-mono font-semibold flex items-center gap-1">
                        <Zap size={11} />
                        WHY IS THAT? (Physiological Rationale):
                      </span>
                      <p className="text-slate-400 mt-1 leading-relaxed">
                        {rec.why}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. CLINICAL NOTE INSTRUCTIONS COMPOSER */}
          {/* ========================================================= */}
          <div className="space-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-space-800">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-accent-blue" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Clinical Note & Instructions Composer
                </h3>
              </div>
              {sendSuccess && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 size={14} />
                  <span>Transmitted to {selectedPatient.name}'s Terminal!</span>
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block font-mono">
                CLINICAL NOTE INSTRUCTIONS FOR ATTENDING DOCTOR:
              </span>
              <p>
                1. Review historical trend deviations against astronaut's individual baseline.
              </p>
              <p>
                2. Formulate concise non-diagnostic guidance explaining physiological adaptation.
              </p>
              <p>
                3. Check applicable recommendations above to attach rationale directly to patient.
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Clinical Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. In-Flight Microgravity BP Modulation & Recovery Plan"
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  className="w-full bg-space-900 border border-space-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Physician Assessment, Guidance & Instructions
                </label>
                <textarea
                  rows={4}
                  required={selectedRecs.length === 0}
                  placeholder="Enter medical evaluation, symptom review, and specific operational countermeasures for the astronaut..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full bg-space-900 border border-space-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  {selectedRecs.length > 0
                    ? `${selectedRecs.length} recommendation(s) with 'Why' rationale will be attached.`
                    : 'No preset recommendations selected.'}
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent-blue text-space-950 font-bold text-xs hover:bg-sky-300 transition-colors flex items-center gap-2 shadow-glow-blue"
                >
                  <Send size={14} />
                  <span>Send Clinical Note & Instructions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
