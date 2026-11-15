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
  Zap,
  Activity,
  Heart,
  ShieldAlert,
  Clock,
  User,
  Pill,
  Utensils,
  Droplets,
  Sun,
  Dumbbell,
  Smile,
  Check,
  AlertOctagon,
  Lock
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
    primaryCondition: 'Acute Tachycardia & Orthostatic Intolerance',
    lastSystolicBP: 138,
    lastDiastolicBP: 92,
    lastHeartRate: 88,
    spo2: 96.2,
    adherenceRate: 82,
    unacknowledgedAlerts: 2,
    lastUpdated: '12 mins ago',
    baselineHeartRate: 68,
    baselineSystolicBP: 118,
    baselineDiastolicBP: 76,
    baselineSpo2: 98.5,
    baselineSleepHours: 7.5,
    lastSleepHours: 5.1,
    sleepDebtHours: 2.4,
    caloriesPlanned: 2800,
    caloriesConsumed: 2150,
    waterConsumedMl: 1850,
    waterTargetMl: 2500,
    radiationDailyMilliSv: 1.15,
    radiationCumulativeMilliSv: 42.8,
    exerciseAredMinutes: 45,
    exerciseT2Minutes: 0,
    moodRating: 3,
    nauseaRating: 2,
    urgencyRationale: 'Acute resting tachycardia (+20 bpm above personal baseline), SpO2 dropped 2.3%, 2.4h sleep debt, and active SOS incident recorded.',
    hasActiveSos: true,
    sosDetails: {
      timestamp: 'Today, 08:42:15 UTC',
      pulse: 142,
      bp: '148/98 mmHg',
      spo2: 94.8,
      acknowledged: false,
      backupEscalationSeconds: 245
    }
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
    primaryCondition: 'Circadian Sleep Misalignment & Caloric Deficit',
    lastSystolicBP: 126,
    lastDiastolicBP: 82,
    lastHeartRate: 76,
    spo2: 98.1,
    adherenceRate: 89,
    unacknowledgedAlerts: 1,
    lastUpdated: '1 hour ago',
    baselineHeartRate: 64,
    baselineSystolicBP: 115,
    baselineDiastolicBP: 74,
    baselineSpo2: 98.8,
    baselineSleepHours: 7.8,
    lastSleepHours: 5.4,
    sleepDebtHours: 2.4,
    caloriesPlanned: 2900,
    caloriesConsumed: 2050,
    waterConsumedMl: 2100,
    waterTargetMl: 2500,
    radiationDailyMilliSv: 0.88,
    radiationCumulativeMilliSv: 38.2,
    exerciseAredMinutes: 30,
    exerciseT2Minutes: 30,
    moodRating: 3,
    nauseaRating: 1,
    urgencyRationale: 'Accumulated 2.4h circadian sleep misalignment from 16 orbital sunrises, 29% caloric intake deficit, and mild exercise lag.',
    hasActiveSos: false
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
    primaryCondition: 'Essential Hypertension (Well Controlled in Microgravity)',
    lastSystolicBP: 121,
    lastDiastolicBP: 79,
    lastHeartRate: 72,
    spo2: 98.8,
    adherenceRate: 96,
    unacknowledgedAlerts: 0,
    lastUpdated: '25 mins ago',
    baselineHeartRate: 70,
    baselineSystolicBP: 120,
    baselineDiastolicBP: 78,
    baselineSpo2: 99.0,
    baselineSleepHours: 7.2,
    lastSleepHours: 7.4,
    sleepDebtHours: 0.0,
    caloriesPlanned: 2400,
    caloriesConsumed: 2350,
    waterConsumedMl: 2450,
    waterTargetMl: 2500,
    radiationDailyMilliSv: 0.72,
    radiationCumulativeMilliSv: 31.5,
    exerciseAredMinutes: 50,
    exerciseT2Minutes: 30,
    moodRating: 4,
    nauseaRating: 1,
    urgencyRationale: 'All vital telemetry within ±1.2σ personal baseline range. High medication adherence (96%), balanced nutrition and full countermeasure completion.',
    hasActiveSos: false
  }
];

const CLINICAL_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    category: 'Countermeasures',
    title: 'Increase Daily Resistive Workout (+20 min ARED unit)',
    instruction: 'Complete an additional 20 minutes of high-resistance axial loading (deadlifts & squats) on the Advanced Resistive Exercise Device.',
    why: 'Zero gravity eliminates skeletal gravitational loading, inducing 1.0-1.5% bone mineral density loss and significant sarcomere atrophy per month without targeted axial resistance.'
  },
  {
    id: 'rec-2',
    category: 'Hydration & Fluids',
    title: 'Oral Electrolyte Restitution (600 mL Isotonic Chilled Fluid)',
    instruction: 'Consume 600 mL isotonic electrolyte solution 1 hour prior to scheduled sleep cycle.',
    why: 'Microgravity causes cephalic fluid redistribution ("puffy head, bird legs"), which the body misinterprets as hypervolemia, flushing 10-15% of circulating plasma volume. Electrolyte restitution restores stroke volume and stabilizes blood pressure.'
  },
  {
    id: 'rec-3',
    category: 'Sleep & Circadian',
    title: 'Enforce 480nm Blue-Cutoff in Personal Sleep Quarters',
    instruction: 'Switch sleep cabin illumination to dim red-shifted spectrum 60 minutes prior to scheduled sleep window.',
    why: 'Low Earth Orbit spacecraft encounter 16 sunrises every 24 hours. Narrow-spectrum blue-depleted lighting entrains the suprachiasmatic nucleus for melatonin synthesis, avoiding chronic cognitive fatigue.'
  },
  {
    id: 'rec-4',
    category: 'Space Radiation',
    title: 'Solar Particle Event (SPE) Temporary Shielding Protocol',
    instruction: 'Relocate prolonged rest to the polyethylene-shielded aft crew sleep module during peak dosimeter rates.',
    why: 'Solar flares and Galactic Cosmic Radiation elevate ionizing particle fluxes beyond 25 μSv/h. Hydrogen-rich polyethylene shielding mitigates secondary neutron backscatter and double-strand DNA cleavage.'
  }
];

const SCANNED_FOOD_POUCH_HISTORY = [
  { barcode: 'NASA-PK-8812', item: 'Shrimp Cocktail in Horseradish Sauce', kcal: 180, carbs: 12, protein: 26, fat: 2, portion: '100% Eaten' },
  { barcode: 'NASA-PK-4421', item: 'Rehydratable Beef Stroganoff & Noodles', kcal: 420, carbs: 48, protein: 32, fat: 12, portion: '85% Eaten' },
  { barcode: 'NASA-PK-1109', item: 'Tortilla with Natural Peanut Butter', kcal: 260, carbs: 22, protein: 9, fat: 16, portion: '100% Eaten' },
  { barcode: 'NASA-PK-9043', item: 'Freeze-Dried Strawberries with Cream', kcal: 140, carbs: 24, protein: 3, fat: 4, portion: '100% Eaten' }
];

export const DoctorView: React.FC<DoctorViewProps> = ({
  onSendFeedbackNote,
  patientReadings: _patientReadings,
  onTriggerSos
}) => {
  const [patients, setPatients] = useState<DoctorPatient[]>(SAMPLE_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(SAMPLE_PATIENTS[0].id);
  const [activeTab, setActiveTab] = useState<'vitals' | 'nutrition' | 'recommendations' | 'notes' | 'sos'>('vitals');
  
  // Note composer state
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [reviewDate, setReviewDate] = useState('Next Orbital Pass (12 Hours)');
  const [selectedRecs, setSelectedRecs] = useState<string[]>([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Triage filter state
  const [filterMode, setFilterMode] = useState<'ALL' | 'high' | 'moderate' | 'stable' | 'ALERTS' | 'SOS'>('ALL');
  
  // SOS management state
  const [acknowledgedSos, setAcknowledgedSos] = useState<Record<string, boolean>>({});
  const [sosSentBanner, setSosSentBanner] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Filter patients by urgency & conditions
  const filteredPatients = patients.filter((p) => {
    if (filterMode === 'high') return p.riskLevel === 'high';
    if (filterMode === 'moderate') return p.riskLevel === 'moderate';
    if (filterMode === 'stable') return p.riskLevel === 'stable';
    if (filterMode === 'ALERTS') return p.unacknowledgedAlerts > 0;
    if (filterMode === 'SOS') return p.hasActiveSos;
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
          return rec ? `• [${rec.category}] ${rec.title}: ${rec.instruction}\n  (Rationale: ${rec.why})` : '';
        })
        .filter(Boolean)
        .join('\n');

      fullMessage = `${fullMessage}\n\n[RECOMMENDATIONS FOR PATIENT - EVIDENCE & WHY]:\n${recsText}`;
    }

    fullMessage = `${fullMessage}\n\n[FOLLOW-UP REVIEW]: Scheduled for ${reviewDate}\n[DIGITAL SIGN-OFF]: Dr. Rajesh Mehta, MD, FACC • Lic: MED-8842-SP • ${new Date().toISOString()}`;

    await onSendFeedbackNote({
      patientId: selectedPatient.id,
      doctorName: 'Dr. Rajesh Mehta, MD (Lead Attending Doctor)',
      title: feedbackTitle.trim() || 'Clinical Review Note & Medical Instructions',
      message: fullMessage
    });

    setSendSuccess(true);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setSelectedRecs([]);
    setTimeout(() => setSendSuccess(false), 4500);
  };

  const handleAcknowledgeSos = (patientId: string) => {
    setAcknowledgedSos((prev) => ({ ...prev, [patientId]: true }));
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId && p.sosDetails) {
          return {
            ...p,
            sosDetails: {
              ...p.sosDetails,
              acknowledged: true,
              acknowledgedAt: new Date().toLocaleTimeString()
            }
          };
        }
        return p;
      })
    );
  };

  const handleSosTrigger = () => {
    if (onTriggerSos) {
      onTriggerSos();
    } else {
      setSosSentBanner(true);
      setTimeout(() => setSosSentBanner(false), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* ========================================================= */}
      {/* 1. BRANDING & PHYSICIAN DETAIL HEADER */}
      {/* ========================================================= */}
      <div className="space-card p-6 bg-gradient-to-r from-space-900 via-space-850 to-space-900 border-l-4 border-l-accent-blue shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Dr. ORBIT Official Logo SVG */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-space-800 to-space-950 border border-accent-blue/40 flex items-center justify-center p-2.5 shadow-glow-blue flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Earth Globe */}
                <circle cx="50" cy="50" r="32" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
                <path d="M35 42C38 38 46 38 50 42C54 46 62 45 65 42C67 49 60 55 54 55C48 55 45 61 38 61C33 61 32 50 35 42Z" fill="#0284c7" opacity="0.6" />
                {/* Orbit Ring */}
                <ellipse cx="50" cy="50" rx="44" ry="16" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-25 50 50)" />
                {/* Medical Cross */}
                <rect x="46" y="38" width="8" height="24" rx="2" fill="#ef4444" />
                <rect x="38" y="46" width="24" height="8" rx="2" fill="#ef4444" />
                {/* Stethoscope Accent */}
                <path d="M42 66C42 72 58 72 58 66" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="74" r="3" fill="#f8fafc" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-serif font-bold text-white tracking-wide">
                  Dr. ORBIT
                </span>
                <span className="text-xs text-slate-500 font-mono">|</span>
                <h1 className="text-lg font-serif font-semibold text-slate-200">
                  Doctor Console
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/40 font-bold">
                  Attending Doctor
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs">
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Stethoscope size={14} className="text-accent-blue" />
                  Dr. Rajesh Mehta, MD, FACC
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono">License: MED-8842-SP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">JSC Space Medicine Operations Division</span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400 flex-wrap">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  Telemetry Uplink: S-Band 2287.5 MHz (Live Sync: 0.42s)
                </span>
                <span className="text-slate-600">•</span>
                <span>Console Loop: BME-1</span>
                <span className="text-slate-600">•</span>
                <span>Habitat: ISS / Gateway Node 2 Alpha</span>
              </div>
            </div>
          </div>

          {/* SOS Dispatch Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleSosTrigger}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all border border-red-400 active:scale-95"
            >
              <AlertTriangle size={15} />
              <span>DISPATCH MEDICAL SOS BEACON</span>
            </button>
          </div>
        </div>
      </div>

      {sosSentBanner && (
        <div className="p-4 bg-red-950/90 border-2 border-red-500 rounded-2xl text-xs text-red-200 flex items-center justify-between animate-fade-in font-mono shadow-2xl">
          <span className="flex items-center gap-2.5">
            <Radio size={18} className="text-red-400 animate-pulse" />
            <span>
              <strong>CRITICAL SOS BROADCAST ENGAGED:</strong> Telemetry distress packet transmitted to Mission Control (MCC Houston) & Onboard Crew Habitat.
            </span>
          </span>
          <span className="text-[10px] bg-red-900 px-3 py-1 rounded text-white font-bold tracking-wider">
            S-BAND DELIVERED
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CREW OVERVIEW & CLINICAL TRIAGE FILTER */}
      {/* ========================================================= */}
      <div className="bg-space-900/90 p-3.5 rounded-2xl border border-space-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-accent-blue" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Astronaut Triage & Clinical Urgency:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              filterMode === 'ALL'
                ? 'bg-white text-space-950 font-bold shadow'
                : 'text-slate-400 hover:text-white bg-space-950 border border-space-800'
            }`}
          >
            ALL CREW ({patients.length})
          </button>

          <button
            onClick={() => setFilterMode('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'high'
                ? 'bg-red-500 text-white shadow-glow-red'
                : 'text-red-400 bg-red-950/30 border border-red-800/40 hover:bg-red-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            HIGH URGENCY ({patients.filter((p) => p.riskLevel === 'high').length})
          </button>

          <button
            onClick={() => setFilterMode('moderate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'moderate'
                ? 'bg-amber-500 text-space-950 shadow-glow-amber'
                : 'text-amber-400 bg-amber-950/30 border border-amber-800/40 hover:bg-amber-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            MODERATE ({patients.filter((p) => p.riskLevel === 'moderate').length})
          </button>

          <button
            onClick={() => setFilterMode('stable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'stable'
                ? 'bg-emerald-500 text-space-950 shadow'
                : 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            STABLE ({patients.filter((p) => p.riskLevel === 'stable').length})
          </button>

          <button
            onClick={() => setFilterMode('ALERTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'ALERTS'
                ? 'bg-orange-500 text-white'
                : 'text-orange-400 bg-orange-950/30 border border-orange-800/40 hover:bg-orange-900/40'
            }`}
          >
            ALERTS ({patients.filter((p) => p.unacknowledgedAlerts > 0).length})
          </button>

          <button
            onClick={() => setFilterMode('SOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'SOS'
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-red-400 bg-red-950/40 border border-red-800/50 hover:bg-red-900/40'
            }`}
          >
            <AlertOctagon size={12} />
            SOS BEACON ({patients.filter((p) => p.hasActiveSos).length})
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column = Patient List (5 cols), Right Column = Patient Details & Actions (7 cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* PATIENT LIST (Sorted by Urgency) */}
        {/* ========================================================= */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User size={13} className="text-accent-blue" />
              Active Astronaut Patients ({filteredPatients.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Click to Inspect Telemetry</span>
          </div>

          <div className="space-y-3">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`space-card p-4 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-accent-blue bg-space-850 shadow-glow-blue'
                      : 'border-space-800 hover:border-space-600 bg-space-900/70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-space-950 border border-space-700 text-white font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          {p.callsign && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-space-800 text-cyan-accent border border-space-700">
                              {p.callsign}
                            </span>
                          )}
                          {p.hasActiveSos && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold animate-pulse">
                              SOS ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {p.age}y • {p.gender} • Blood {p.bloodType || 'O+'} • {p.missionId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full ${
                        p.riskLevel === 'high'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                          : p.riskLevel === 'moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {p.riskLevel === 'high' ? 'High Urgency' : p.riskLevel === 'moderate' ? 'Moderate' : 'Stable'}
                    </span>
                  </div>

                  {/* Explicit Clinical Urgency Rationale */}
                  <div className="p-2.5 rounded-lg bg-space-950/80 border border-space-800 mb-2 text-xs">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase">
                      Clinical Reason:
                    </span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed text-[11px]">
                      {p.urgencyRationale || p.primaryCondition}
                    </p>
                  </div>

                  {/* Vitals Summary Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-space-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">BP</span>
                      <span className="font-bold text-white">{p.lastSystolicBP}/{p.lastDiastolicBP}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">PULSE</span>
                      <span className={`font-bold ${p.lastHeartRate > 80 ? 'text-amber-400' : 'text-white'}`}>
                        {p.lastHeartRate} bpm
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">SpO2</span>
                      <span className="font-bold text-cyan-accent">{p.spo2 || 98}%</span>
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

        {/* Right Column: Tabbed Patient Dossier, Instructions & SOS Management */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {/* Astronaut Details Header Card */}
          <div className="space-card p-5 space-y-3">
            <div className="flex items-start justify-between pb-3 border-b border-space-800">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
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
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                  <span>Age: <strong className="text-white">{selectedPatient.age}</strong></span>
                  <span>Gender: <strong className="text-white">{selectedPatient.gender}</strong></span>
                  <span>Blood Type: <strong className="text-white">{selectedPatient.bloodType || 'B+'}</strong></span>
                  <span>Mission: <strong className="text-cyan-accent">{selectedPatient.missionId}</strong></span>
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

            {/* Navigation Tabs for Astronaut Details */}
            <div className="flex items-center gap-1.5 border-b border-space-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('vitals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'vitals'
                    ? 'bg-accent-blue text-space-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white bg-space-900 border border-space-800'
                }`}
              >
                <Activity size={13} />
                <span>Vitals vs Baseline</span>
              </button>

              <button
                onClick={() => setActiveTab('nutrition')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'nutrition'
                    ? 'bg-accent-blue text-space-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white bg-space-900 border border-space-800'
                }`}
              >
                <Utensils size={13} />
                <span>Nutrition & Radiation</span>
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'recommendations'
                    ? 'bg-accent-blue text-space-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white bg-space-900 border border-space-800'
                }`}
              >
                <Sparkles size={13} />
                <span>Recommendations ("Why")</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'bg-accent-blue text-space-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white bg-space-900 border border-space-800'
                }`}
              >
                <FileText size={13} />
                <span>Clinical Notes & Sign-Off</span>
              </button>

              {selectedPatient.hasActiveSos && (
                <button
                  onClick={() => setActiveTab('sos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'sos'
                      ? 'bg-red-600 text-white shadow-glow-red animate-pulse'
                      : 'text-red-400 bg-red-950/40 border border-red-800/60'
                  }`}
                >
                  <AlertOctagon size={13} />
                  <span>SOS Beacon (Active)</span>
                </button>
              )}
            </div>

            {/* ========================================================= */}
            {/* SUB-TAB 1: VITALS VS PERSONAL BASELINE */}
            {/* ========================================================= */}
            {activeTab === 'vitals' && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  {/* Heart Rate Card */}
                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                      <span className="flex items-center gap-1">
                        <Heart size={11} className="text-red-400" />
                        Heart Rate
                      </span>
                      <span className="text-amber-400 font-bold">+20 bpm</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-serif font-bold text-white">
                        {selectedPatient.lastHeartRate}
                      </span>
                      <span className="text-xs text-slate-400">bpm</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-space-800/80">
                      Baseline: <strong className="text-slate-300">{selectedPatient.baselineHeartRate || 68} bpm</strong>
                    </div>
                  </div>

                  {/* Blood Pressure Card */}
                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                      <span className="flex items-center gap-1">
                        <Activity size={11} className="text-accent-blue" />
                        Blood Pressure
                      </span>
                      <span className="text-red-400 font-bold">Stage 1</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-serif font-bold text-white">
                        {selectedPatient.lastSystolicBP}/{selectedPatient.lastDiastolicBP}
                      </span>
                      <span className="text-xs text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-space-800/80">
                      Baseline: <strong className="text-slate-300">{selectedPatient.baselineSystolicBP || 118}/{selectedPatient.baselineDiastolicBP || 76}</strong>
                    </div>
                  </div>

                  {/* Blood Oxygen SpO2 */}
                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                      <span className="flex items-center gap-1">
                        <Droplets size={11} className="text-cyan-accent" />
                        SpO2 Saturation
                      </span>
                      <span className="text-amber-400 font-bold">-2.3%</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-serif font-bold text-cyan-accent">
                        {selectedPatient.spo2 || 96.2}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-space-800/80">
                      Baseline: <strong className="text-slate-300">{selectedPatient.baselineSpo2 || 98.5}%</strong>
                    </div>
                  </div>

                  {/* Sleep Duration */}
                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-indigo-400" />
                        Sleep Duration
                      </span>
                      <span className="text-red-400 font-bold">-2.4h debt</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-serif font-bold text-white">
                        {selectedPatient.lastSleepHours || 5.1}
                      </span>
                      <span className="text-xs text-slate-400">hrs</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-space-800/80">
                      Baseline: <strong className="text-slate-300">{selectedPatient.baselineSleepHours || 7.5} hrs</strong>
                    </div>
                  </div>
                </div>

                {/* Clinical Comparison Explanation */}
                <div className="p-4 rounded-xl bg-space-900/80 border border-space-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-accent-blue" />
                      Doctor Baseline Deviation Analysis:
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Algorithm: Z-Score Statistical Variance (N=30 sols)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Astronaut {selectedPatient.name} exhibits significant resting heart rate elevation (+20 bpm vs personal normal) alongside systolic blood pressure divergence (+20 mmHg). This pattern strongly correlates with microgravity cephalic fluid redistribution, compensatory peripheral vasoconstriction, and cumulative 2.4-hour circadian sleep deficit from orbital solar cycling.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-TAB 2: NUTRITION, HYDRATION, RADIATION & EXERCISE */}
            {/* ========================================================= */}
            {activeTab === 'nutrition' && (
              <div className="space-y-4 pt-1">
                {/* 4 Cards: Calories, Water, Radiation, Countermeasures */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                    <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-1">
                      <Utensils size={10} className="text-amber-400" />
                      Food Intake
                    </span>
                    <span className="text-lg font-serif font-bold text-white mt-1 block">
                      {selectedPatient.caloriesConsumed} / {selectedPatient.caloriesPlanned}
                    </span>
                    <span className="text-[10px] text-amber-400 block">
                      76.8% of daily plan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                    <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-1">
                      <Droplets size={10} className="text-cyan-accent" />
                      Dispensed Water
                    </span>
                    <span className="text-lg font-serif font-bold text-cyan-accent mt-1 block">
                      {selectedPatient.waterConsumedMl} mL
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Target: {selectedPatient.waterTargetMl} mL
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                    <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-1">
                      <Sun size={10} className="text-orange-400" />
                      Radiation Dose
                    </span>
                    <span className="text-lg font-serif font-bold text-orange-400 mt-1 block">
                      {selectedPatient.radiationDailyMilliSv} mSv/d
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Cumul: {selectedPatient.radiationCumulativeMilliSv} mSv (7.1% limit)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                    <span className="text-[10px] text-slate-400 block uppercase flex items-center gap-1">
                      <Dumbbell size={10} className="text-emerald-400" />
                      Countermeasures
                    </span>
                    <span className="text-lg font-serif font-bold text-emerald-400 mt-1 block">
                      {selectedPatient.exerciseAredMinutes}m ARED
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      T2 Treadmill: {selectedPatient.exerciseT2Minutes}m
                    </span>
                  </div>
                </div>

                {/* Scanned Food Pouch History */}
                <div className="space-card p-4 space-y-3 bg-space-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Utensils size={13} className="text-amber-400" />
                      Scanned NASA Food Pouches (Astronaut Barcode Log):
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Auto-Synced via Pouch Scanner</span>
                  </div>

                  <div className="space-y-2">
                    {SCANNED_FOOD_POUCH_HISTORY.map((pouch, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-space-950 border border-space-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-[10px]">{pouch.barcode}</span>
                          <span className="text-slate-200 font-sans font-medium">{pouch.item}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-amber-400">{pouch.kcal} kcal</span>
                          <span className="text-slate-400">P:{pouch.protein}g C:{pouch.carbs}g F:{pouch.fat}g</span>
                          <span className="text-emerald-400 text-[10px] font-bold">{pouch.portion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Space Adaptation Symptoms & Medication Adherence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Smile size={13} className="text-cyan-accent" />
                      Daily Space Adaptation Ratings:
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                      <div className="p-2 rounded bg-space-950 border border-space-800">
                        <span className="text-slate-500 text-[10px] block">APPETITE</span>
                        <span className="font-bold text-white text-base">{selectedPatient.moodRating || 3}/5</span>
                      </div>
                      <div className="p-2 rounded bg-space-950 border border-space-800">
                        <span className="text-slate-500 text-[10px] block">NAUSEA</span>
                        <span className="font-bold text-amber-400 text-base">{selectedPatient.nauseaRating || 2}/5</span>
                      </div>
                      <div className="p-2 rounded bg-space-950 border border-space-800">
                        <span className="text-slate-500 text-[10px] block">MOOD</span>
                        <span className="font-bold text-emerald-400 text-base">{selectedPatient.moodRating || 3}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Pill size={13} className="text-emerald-400" />
                      Medication Adherence & Symptoms:
                    </span>
                    <div className="p-2.5 rounded-lg bg-space-950 border border-space-800 text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-white font-bold">Propranolol 10mg PO QD</span>
                        <span className="text-emerald-400 font-bold">{selectedPatient.adherenceRate}% Adherent</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Astronaut reported mild orthostatic dizziness upon waking; schedule adjusted to bedtime administration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-TAB 3: RECOMMENDATIONS WITH "WHY IS THAT" */}
            {/* ========================================================= */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between pb-2 border-b border-space-800">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-accent" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Evidence-Based Countermeasure Protocols
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Select to append to clinical instructions
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Spaceflight medicine requires educating astronauts on physiological mechanisms. Each recommendation below includes an explicit rationale so the crew understands the causal science behind their prescribed countermeasure:
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
                          <div className="flex items-center gap-2.5">
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
                          <strong>Prescribed Action:</strong> {rec.instruction}
                        </p>

                        {/* Explicit "WHY IS THAT?" Physiological Rationale */}
                        <div className="mt-2.5 ml-6 p-2.5 rounded-lg bg-space-950/80 border border-space-800 text-[11px]">
                          <span className="text-cyan-accent font-mono font-semibold flex items-center gap-1.5">
                            <Zap size={11} />
                            WHY IS THAT? (Physiological Rationale):
                          </span>
                          <p className="text-slate-400 mt-1 leading-relaxed font-sans">
                            {rec.why}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-TAB 4: CLINICAL NOTES, INSTRUCTIONS & DIGITAL SIGN-OFF */}
            {/* ========================================================= */}
            {activeTab === 'notes' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between pb-2 border-b border-space-800">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-accent-blue" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Clinical Note & Medical Instructions Composer
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
                    PHYSICIAN DOCUMENTATION PROTOCOL:
                  </span>
                  <p>
                    1. Review historical trend deviations against the astronaut's individual baseline.
                  </p>
                  <p>
                    2. Provide non-diagnostic guidance explaining microgravity physiological adaptation.
                  </p>
                  <p>
                    3. Sign off digitally with clinician identity, license, and assigned review date.
                  </p>
                </div>

                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Clinical Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Microgravity Tachycardia Modulation & Countermeasure Adjustment"
                      value={feedbackTitle}
                      onChange={(e) => setFeedbackTitle(e.target.value)}
                      className="w-full bg-space-900 border border-space-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Follow-Up Review Schedule
                      </label>
                      <select
                        value={reviewDate}
                        onChange={(e) => setReviewDate(e.target.value)}
                        className="w-full bg-space-900 border border-space-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-mono"
                      >
                        <option>Next Orbital Pass (12 Hours)</option>
                        <option>Tomorrow Morning Sol Briefing (24 Hours)</option>
                        <option>48 Hours Telemetry Evaluation</option>
                        <option>Weekly Health Review (7 Days)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Clinician Digital Identity
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Dr. Rajesh Mehta, MD, FACC (MED-8842-SP)"
                        className="w-full bg-space-950 border border-space-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Physician Assessment, Guidance & Action Instructions
                    </label>
                    <textarea
                      rows={4}
                      required={selectedRecs.length === 0}
                      placeholder="Enter detailed clinical evaluation, physiological observations, and specific instructions for the astronaut..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="w-full bg-space-900 border border-space-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-sans leading-relaxed"
                    />
                  </div>

                  {/* Digital Sign-Off Card */}
                  <div className="p-3.5 rounded-xl bg-space-950 border border-space-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-emerald-400" />
                      <div>
                        <span className="text-slate-200 block font-semibold">
                          Cryptographic Clinician Signature Ready
                        </span>
                        <span className="text-[10px] text-slate-500">
                          HMAC-SHA256 • Verified Attending Doctor Credentials
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                      VERIFIED DOCTOR
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedRecs.length > 0
                        ? `${selectedRecs.length} preset recommendation(s) with 'Why' attached.`
                        : 'No preset recommendations attached.'}
                    </span>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-accent-blue text-space-950 font-bold text-xs hover:bg-sky-300 transition-colors flex items-center gap-2 shadow-glow-blue"
                    >
                      <Send size={14} />
                      <span>Sign & Transmit Clinical Instructions</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUB-TAB 5: SOS ALERT MANAGEMENT */}
            {/* ========================================================= */}
            {activeTab === 'sos' && selectedPatient.hasActiveSos && (
              <div className="space-y-4 pt-1 animate-fade-in">
                <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertOctagon size={20} className="animate-ping" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        ACTIVE EMERGENCY DISTRESS BEACON LOGGED
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                      CRITICAL PRIORITY
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-space-950 border border-red-800/60">
                      <span className="text-slate-400 text-[10px] block">ASTRONAUT</span>
                      <span className="font-bold text-white">{selectedPatient.name} ({selectedPatient.callsign})</span>
                    </div>
                    <div className="p-2 rounded bg-space-950 border border-red-800/60">
                      <span className="text-slate-400 text-[10px] block">TRIGGER TIME</span>
                      <span className="font-bold text-red-300">{selectedPatient.sosDetails?.timestamp}</span>
                    </div>
                    <div className="p-2 rounded bg-space-950 border border-red-800/60">
                      <span className="text-slate-400 text-[10px] block">PULSE AT TRIGGER</span>
                      <span className="font-bold text-red-400 text-base">{selectedPatient.sosDetails?.pulse} bpm</span>
                    </div>
                    <div className="p-2 rounded bg-space-950 border border-red-800/60">
                      <span className="text-slate-400 text-[10px] block">BP / SPO2</span>
                      <span className="font-bold text-white">{selectedPatient.sosDetails?.bp} • {selectedPatient.sosDetails?.spo2}%</span>
                    </div>
                  </div>

                  {/* Multi-Channel Delivery Status */}
                  <div className="p-3 rounded-lg bg-space-950 border border-red-900/60 text-xs space-y-1.5 font-mono">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Ground & Station Telemetry Delivery:
                    </span>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check size={12} />
                      <span>NASA Mission Control (MCC Houston): Telemetry Beacon Acknowledged</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check size={12} />
                      <span>Attending Doctor Console: High-Priority S-Band Channel Engaged</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check size={12} />
                      <span>Station Crew Habitat: Audio Emergency Chime Triggered</span>
                    </div>
                  </div>

                  {/* Automatic Backup Escalation Indicator */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-400" />
                      Automatic backup escalation to Deputy Doctor (Dr. Elena Rostova, MD) standby.
                    </span>

                    {acknowledgedSos[selectedPatient.id] || selectedPatient.sosDetails?.acknowledged ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                        <CheckCircle2 size={14} />
                        SOS Acknowledged by Dr. Mehta
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledgeSos(selectedPatient.id)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 border border-red-400 active:scale-95"
                      >
                        <CheckCircle2 size={14} />
                        <span>ACKNOWLEDGE SOS & LOG PROTOCOL</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
