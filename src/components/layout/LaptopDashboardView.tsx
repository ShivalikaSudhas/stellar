import React, { useState } from 'react';
import {
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  Medication,
  CarePlan,
  UserProfile,
  MetricType,
  CauseAndEffectInsight
} from '@/types';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Calendar,
  Bell,
  Search,
  Shield,
  FileText,
  Sparkles,
  AlertTriangle,
  Mic,
  Camera,
  Utensils
} from 'lucide-react';

interface LaptopDashboardViewProps {
  userProfile: UserProfile;
  readings: HealthReading[];
  baselines: Record<string, HealthBaseline>;
  alerts: HealthAlert[];
  wellness: WellnessCheckIn[];
  medications: Medication[];
  carePlan: CarePlan;
  insights: CauseAndEffectInsight[];
  onOpenVitalDetail: (metric: MetricType) => void;
  onOpenVoiceModal: () => void;
  onOpenCameraModal: () => void;
  onOpenFoodModal: () => void;
  onOpenSosModal: () => void;
  onOpenDoctorSummary: () => void;
  onToggleMedication: (id: string) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
}

export const LaptopDashboardView: React.FC<LaptopDashboardViewProps> = ({
  userProfile,
  readings,
  baselines,
  alerts: _alerts,
  wellness: _wellness,
  medications: _medications,
  carePlan: _carePlan,
  insights: _insights,
  onOpenVitalDetail,
  onOpenVoiceModal,
  onOpenCameraModal,
  onOpenFoodModal,
  onOpenSosModal,
  onOpenDoctorSummary,
  onToggleMedication: _onToggleMedication,
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSideNav, setActiveSideNav] = useState('dashboard');

  const getLatest = (m: MetricType, fallback: number) => {
    const list = readings.filter((r) => r.metric === m);
    return list.length > 0 ? list[list.length - 1].value : fallback;
  };

  const hrValue = getLatest('heart_rate', 72);
  const bpSysValue = getLatest('blood_pressure_sys', 120);
  const bpDiaValue = getLatest('blood_pressure_dia', 80);
  const spo2Value = getLatest('spo2', 98);
  const sleepValue = getLatest('sleep_duration', 7.8);

  const hrBaseline = baselines['heart_rate']?.referenceMean || 68;

  return (
    <div className="min-h-[860px] bg-space-950 text-slate-100 rounded-3xl border border-space-700 shadow-2xl flex overflow-hidden font-sans">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Matching Image 2 Reference) */}
      {/* ========================================================= */}
      <aside className="w-64 bg-space-900 border-r border-space-800 p-5 flex flex-col justify-between flex-shrink-0 select-none">
        <div className="space-y-6">
          {/* Brand Logo & Checkerboard Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center font-bold text-sm border border-accent-blue/30 shadow-inner">
              ✦
            </div>
            <div>
              <span className="font-serif font-bold text-white tracking-wider text-base block">
                STELLAR
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
                Health Monitoring
              </span>
            </div>
          </div>

          {/* User Profile Mini Badge (Matching Sophia in Image 2) */}
          <div className="p-3 rounded-2xl bg-space-850 border border-space-750 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xl border border-space-700">
              👩‍🚀
            </div>
            <div className="truncate">
              <span className="font-semibold text-white text-xs block truncate">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-accent-blue font-mono">
                {userProfile.role.toUpperCase()} • DAY 42
              </span>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
              { id: 'vitals', label: 'Vitals & Telemetry', icon: <Heart size={16} /> },
              { id: 'insights', label: 'Health Insights', icon: <Sparkles size={16} /> },
              { id: 'careplan', label: 'Care Plan & Meds', icon: <FileText size={16} /> },
              { id: 'schedule', label: 'Schedule & Doctors', icon: <Calendar size={16} /> },
              { id: 'privacy', label: 'Data & Privacy', icon: <Shield size={16} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSideNav(item.id);
                  onNavigateToTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeSideNav === item.id
                    ? 'bg-white text-space-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-space-850'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* SOS Alert & Emergency Button */}
        <div className="pt-4 border-t border-space-800 space-y-2">
          <button
            onClick={onOpenSosModal}
            className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle size={14} />
            <span>Emergency SOS Trigger</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA (Matching Image 2 Architecture) */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-space-800 px-8 flex items-center justify-between gap-4 flex-shrink-0 bg-space-900/60 backdrop-blur-md">
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-white uppercase">
              HELLO, {userProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Mission Day 42 • Telemetry sync: Active (Offline-ready)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vitals, doctors, meds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue"
              />
            </div>

            {/* Biomarker Actions */}
            <button
              onClick={onOpenVoiceModal}
              title="Voice Biomarkers"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-white"
            >
              <Mic size={15} />
            </button>
            <button
              onClick={onOpenCameraModal}
              title="Camera rPPG"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-white"
            >
              <Camera size={15} />
            </button>
            <button
              onClick={onOpenFoodModal}
              title="Food Logging"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-white"
            >
              <Utensils size={15} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenDoctorSummary}
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-accent-blue relative"
            >
              <Bell size={16} />
              <span className="w-2 h-2 rounded-full bg-accent-coral absolute top-1.5 right-1.5 animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Multi-Panel Dashboard Grid (Matching Image 2) */}
        <div className="p-8 grid grid-cols-12 gap-6">
          {/* LEFT 8 COLUMNS: Doctors, Events, Calendar, and Vitals */}
          <div className="col-span-8 space-y-6">
            {/* Top Row: Linked Clinicians & Upcoming Events */}
            <div className="grid grid-cols-2 gap-6">
              {/* Widget 1: Linked Clinicians (Matching "Linked Teachers" in image) */}
              <div className="ivory-panel p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                  <span className="text-xs font-bold text-ink-950 uppercase font-mono tracking-wider">
                    Linked Clinicians
                  </span>
                  <span className="text-[11px] text-ink-500 font-medium">BME Care Team</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Dr. Rajesh Mehta, MD', specialty: 'Lead Cardiologist', status: 'Online' },
                    { name: 'Dr. Priya Patel', specialty: 'Flight Surgeon', status: 'In consult' },
                    { name: 'Dr. Kevin Vance', specialty: 'Exercise Physiologist', status: 'Reviewing' }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-ink-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {doc.name[4]}
                        </div>
                        <div>
                          <span className="font-bold text-ink-950 block leading-tight">{doc.name}</span>
                          <span className="text-[10px] text-ink-600">{doc.specialty}</span>
                        </div>
                      </div>
                      <button
                        onClick={onOpenDoctorSummary}
                        className="px-2 py-1 rounded-lg bg-ivory-dark hover:bg-ink-950 hover:text-white text-[10px] font-bold text-ink-900 transition-colors"
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Upcoming Clinical Events (Matching Image 2) */}
              <div className="ivory-panel p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                  <span className="text-xs font-bold text-ink-950 uppercase font-mono tracking-wider">
                    Upcoming Events
                  </span>
                  <span className="text-[11px] text-ink-500 font-medium">October 2026</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-ivory-dark/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-ink-950 block">Monthly Telehealth Review</span>
                      <span className="text-[10px] text-ink-600">18 Oct 2026 • 14:00 GMT</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-cobalt text-white font-bold">
                      Confirmed
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-ivory-dark/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-ink-950 block">Continuous Glucose Calibration</span>
                      <span className="text-[10px] text-ink-600">22 Oct 2026 • 09:30 GMT</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-950 text-white font-bold">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Care Schedule & Tasks (Matching "My Schedule" in image) */}
            <div className="ivory-panel p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                <span className="text-xs font-bold text-ink-950 uppercase font-mono tracking-wider">
                  Care Protocol Schedule
                </span>
                <span className="text-[11px] text-accent-cobalt font-bold cursor-pointer hover:underline">
                  View Full Calendar ➔
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-ivory-dark/60">
                  <span className="text-lg font-serif font-bold text-ink-950 block">18</span>
                  <span className="text-[10px] text-ink-600 block uppercase font-mono">Today</span>
                  <span className="text-xs font-bold text-ink-900 mt-1 block">T2 Treadmill Session (30m)</span>
                </div>

                <div className="p-3 rounded-xl bg-ivory-dark/60">
                  <span className="text-lg font-serif font-bold text-ink-950 block">19</span>
                  <span className="text-[10px] text-ink-600 block uppercase font-mono">Tomorrow</span>
                  <span className="text-xs font-bold text-ink-900 mt-1 block">Electrolyte Hydration Check</span>
                </div>

                <div className="p-3 rounded-xl bg-ivory-dark/60">
                  <span className="text-lg font-serif font-bold text-ink-950 block">20</span>
                  <span className="text-[10px] text-ink-600 block uppercase font-mono">Wednesday</span>
                  <span className="text-xs font-bold text-ink-900 mt-1 block">ARED Resistance Mobility</span>
                </div>
              </div>
            </div>

            {/* Widget 4: Live Vitals Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => onOpenVitalDetail('heart_rate')}
                className="space-card p-4 cursor-pointer hover:border-accent-blue transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pulse Rate</span>
                  <Heart size={14} className="text-accent-coral" />
                </div>
                <div className="text-3xl font-serif font-bold text-white">
                  {hrValue} <span className="text-xs font-normal text-slate-400">bpm</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Baseline: {hrBaseline} bpm <span className="text-emerald-400 font-bold">(Nominal)</span>
                </div>
              </div>

              <div
                onClick={() => onOpenVitalDetail('blood_pressure_sys')}
                className="space-card p-4 cursor-pointer hover:border-accent-blue transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Blood Pressure</span>
                  <Activity size={14} className="text-accent-blue" />
                </div>
                <div className="text-3xl font-serif font-bold text-white">
                  {bpSysValue}/{bpDiaValue}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Target: &lt;125/80 mmHg <span className="text-emerald-400 font-bold">(Achieved)</span>
                </div>
              </div>

              <div
                onClick={() => onOpenVitalDetail('spo2')}
                className="space-card p-4 cursor-pointer hover:border-accent-blue transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>SpO2 Oxygen</span>
                  <Activity size={14} className="text-accent-blue" />
                </div>
                <div className="text-3xl font-serif font-bold text-white">
                  {spo2Value}%
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Cabin pO2: 21.0% <span className="text-emerald-400 font-bold">(Nominal)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Circular Progress Rings (Matching Image 2: 60%, 90%, 75%) */}
          <div className="col-span-4 space-y-5">
            {/* Circular Ring 1: Medication Adherence (90%) */}
            <div className="space-card p-5 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                Medication Adherence
              </span>

              {/* Exact Circular Progress Ring from Image 2 */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-space-800"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-accent-blue"
                    strokeWidth="9"
                    strokeDasharray="283"
                    strokeDashoffset="28" // 90%
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-2xl font-serif font-bold text-white">
                  90%
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                Morning doses verified on schedule.
              </p>
            </div>

            {/* Circular Ring 2: Exercise & Activity Goal (60%) */}
            <div className="space-card p-5 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                Daily Countermeasures
              </span>

              {/* Circular Ring 60% */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-space-800"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-emerald-400"
                    strokeWidth="9"
                    strokeDasharray="283"
                    strokeDashoffset="113" // 60%
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-2xl font-serif font-bold text-white">
                  60%
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                25 of 45 active minutes completed.
              </p>
            </div>

            {/* Circular Ring 3: Sleep Quality & Rest (75%) */}
            <div className="space-card p-5 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                Sleep Recovery Score
              </span>

              {/* Circular Ring 75% */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-space-800"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="45"
                    className="text-amber-400"
                    strokeWidth="9"
                    strokeDasharray="283"
                    strokeDashoffset="71" // 75%
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-2xl font-serif font-bold text-white">
                  75%
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                {sleepValue}h rest duration logged.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
