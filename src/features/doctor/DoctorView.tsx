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
  Filter
} from 'lucide-react';

interface DoctorViewProps {
  onSendFeedbackNote: (note: Omit<DoctorFeedbackNote, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  patientReadings: HealthReading[];
}

const SAMPLE_PATIENTS: DoctorPatient[] = [
  {
    id: 'user-chen',
    name: 'R. Chen (Payload Specialist)',
    age: 41,
    gender: 'Male',
    riskLevel: 'high',
    primaryCondition: 'Acute Tachycardia & Fatigue',
    lastSystolicBP: 138,
    lastDiastolicBP: 92,
    lastHeartRate: 88,
    adherenceRate: 82,
    unacknowledgedAlerts: 2,
    lastUpdated: '12 mins ago'
  },
  {
    id: 'user-asha',
    name: 'Asha Sharma (Astronaut Pilot)',
    age: 58,
    gender: 'Female',
    riskLevel: 'stable',
    primaryCondition: 'Essential Hypertension (Controlled)',
    lastSystolicBP: 121,
    lastDiastolicBP: 79,
    lastHeartRate: 72,
    adherenceRate: 96,
    unacknowledgedAlerts: 0,
    lastUpdated: '25 mins ago'
  },
  {
    id: 'user-kim',
    name: 'J. Kim (EVA Lead)',
    age: 36,
    gender: 'Male',
    riskLevel: 'moderate',
    primaryCondition: 'Circadian Sleep Misalignment',
    lastSystolicBP: 126,
    lastDiastolicBP: 82,
    lastHeartRate: 76,
    adherenceRate: 89,
    unacknowledgedAlerts: 1,
    lastUpdated: '1 hour ago'
  }
];

export const DoctorView: React.FC<DoctorViewProps> = ({
  onSendFeedbackNote,
  patientReadings: _patientReadings
}) => {
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient>(SAMPLE_PATIENTS[1]);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'high' | 'moderate' | 'stable'>('ALL');

  const filteredPatients = SAMPLE_PATIENTS.filter((p) => {
    if (filterRisk !== 'ALL' && p.riskLevel !== filterRisk) return false;
    return true;
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    await onSendFeedbackNote({
      patientId: selectedPatient.id,
      doctorName: 'Dr. Rajesh Mehta, MD (Cardiology Console)',
      title: feedbackTitle.trim() || 'Clinical Review Note',
      message: feedbackMessage.trim()
    });

    setSendSuccess(true);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-space-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent-blue/15 text-accent-blue border border-accent-blue/30">
              <Stethoscope size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                Mission Control & Clinician Console
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Attending Physician: Dr. Rajesh Mehta, MD • Flight Surgeon Telemetry Link
              </p>
            </div>
          </div>
        </div>

        {/* Risk filter */}
        <div className="flex items-center gap-1.5 bg-space-900 p-1 rounded-xl border border-space-700 text-xs font-mono">
          <Filter size={13} className="text-slate-400 ml-2" />
          {(['ALL', 'high', 'moderate', 'stable'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1 rounded-lg uppercase transition-colors ${
                filterRisk === r
                  ? 'bg-white text-space-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Patient Roster on Left, Clinical Detail & Note Sender on Right */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Patient List sorted by Risk */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block px-1">
            Active Crew / Patient Roster ({filteredPatients.length})
          </span>

          <div className="space-y-2.5">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`space-card p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-accent-blue bg-space-850 shadow-glow-blue'
                      : 'hover:border-space-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-space-900 border border-space-700 text-white font-serif font-bold text-xs flex items-center justify-center">
                        {p.name[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-white text-xs block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.age}y • {p.gender}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                        p.riskLevel === 'high'
                          ? 'bg-red-500/20 text-accent-coral border border-red-500/40'
                          : p.riskLevel === 'moderate'
                          ? 'bg-amber-500/20 text-accent-amber border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-space-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">BP</span>
                      <span className="font-bold text-white">{p.lastSystolicBP}/{p.lastDiastolicBP}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">HR</span>
                      <span className="font-bold text-white">{p.lastHeartRate} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">ADHERENCE</span>
                      <span className="font-bold text-emerald-400">{p.adherenceRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Patient Clinical Card & Note Sender */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* Patient Clinical Profile Card */}
          <div className="space-card p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-space-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif font-bold text-white">
                    {selectedPatient.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-space-900 border border-space-700 text-slate-300 font-mono">
                    ID: {selectedPatient.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Condition: <strong className="text-white">{selectedPatient.primaryCondition}</strong>
                </p>
              </div>

              <div className="text-right text-xs font-mono text-slate-400">
                <span>Updated {selectedPatient.lastUpdated}</span>
              </div>
            </div>

            {/* Vitals Matrix */}
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Latest Pulse</span>
                <span className="text-2xl font-serif font-bold text-white">{selectedPatient.lastHeartRate}</span>
                <span className="text-xs text-slate-400 block">bpm</span>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Blood Pressure</span>
                <span className="text-2xl font-serif font-bold text-white">{selectedPatient.lastSystolicBP}/{selectedPatient.lastDiastolicBP}</span>
                <span className="text-xs text-slate-400 block">mmHg</span>
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">30d Adherence</span>
                <span className="text-2xl font-serif font-bold text-emerald-400">{selectedPatient.adherenceRate}%</span>
                <span className="text-xs text-slate-400 block">compliance</span>
              </div>
            </div>
          </div>

          {/* Feedback Note Composer (Requirement #20) */}
          <div className="space-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-space-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Transmit Clinical Note & Instructions to {selectedPatient.name.split(' ')[0]}
              </span>
              {sendSuccess && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 size={13} />
                  <span>Transmitted to Patient Dashboard!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSend} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Note Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent 7-day BP stabilization, maintain current routine"
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  className="w-full bg-space-900 border border-space-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Physician Feedback & Recommendations
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type guidance for patient to see upon next dashboard sync..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full bg-space-900 border border-space-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent-blue text-space-950 font-bold text-xs hover:bg-sky-300 transition-colors flex items-center gap-2 shadow-glow-blue"
                >
                  <Send size={14} />
                  <span>Send Clinical Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
