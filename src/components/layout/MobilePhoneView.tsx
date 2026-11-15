import React, { useState } from 'react';
import {
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  Medication,
  CarePlan,
  UserProfile,
  MetricType
} from '@/types';
import {
  Heart,
  Activity,
  Moon,
  TrendingUp,
  AlertTriangle,
  FileText,
  User,
  Shield,
  Calendar,
  Sparkles,
  Mic,
  Camera,
  Utensils,
  ChevronRight,
  Bell,
  Radio,
  Share2,
  MoreVertical,
  MessageCircle,
  X as XIcon,
  Plus,
  Layers,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

export type MobileTab =
  | 'home'
  | 'vitals'
  | 'sleep'
  | 'trends'
  | 'insights'
  | 'careplan'
  | 'messages'
  | 'profile'
  | 'emergency'
  | 'privacy';

interface MobilePhoneViewProps {
  userProfile: UserProfile;
  readings: HealthReading[];
  baselines: Record<string, HealthBaseline>;
  alerts: HealthAlert[];
  wellness: WellnessCheckIn[];
  medications: Medication[];
  carePlan: CarePlan;
  onOpenVitalDetail: (metric: MetricType) => void;
  onOpenVoiceModal: () => void;
  onOpenCameraModal: () => void;
  onOpenFoodModal: () => void;
  onOpenSosModal: () => void;
  onOpenDoctorSummary: () => void;
  onToggleMedication: (id: string) => Promise<void>;
}

export const MobilePhoneView: React.FC<MobilePhoneViewProps> = ({
  userProfile,
  readings,
  baselines,
  alerts: _alerts,
  wellness: _wellness,
  medications,
  carePlan: _carePlan,
  onOpenVitalDetail,
  onOpenVoiceModal,
  onOpenCameraModal,
  onOpenFoodModal,
  onOpenSosModal,
  onOpenDoctorSummary,
  onToggleMedication
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [phoneSubStyle, setPhoneSubStyle] = useState<'pulse_daily' | 'orbital_flow'>('pulse_daily');
  const [vitalsTimeRange, setVitalsTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [trendsTimeRange, setTrendsTimeRange] = useState<'1W' | '1M' | '3M' | '1Y'>('1W');
  const [messageFilter, setMessageFilter] = useState<'All' | 'Alerts' | 'Care' | 'System'>('All');
  const [privacyToggles, setPrivacyToggles] = useState({
    medicalTeam: true,
    familyMember: true,
    researchUse: false
  });

  // Latest vital readings
  const getLatest = (m: MetricType, fallback: number) => {
    const list = readings.filter((r) => r.metric === m);
    return list.length > 0 ? list[list.length - 1].value : fallback;
  };

  const hrValue = getLatest('heart_rate', 72);
  const bpSysValue = getLatest('blood_pressure_sys', 120);
  const bpDiaValue = getLatest('blood_pressure_dia', 80);
  const spo2Value = getLatest('spo2', 98);
  const tempValue = getLatest('temperature', 36.6);
  const sleepValue = getLatest('sleep_duration', 7.8);

  // 24-hour wave curve data for vitals
  const vitalsWaveData = [
    { time: '12AM', value: 64 },
    { time: '3AM', value: 61 },
    { time: '6AM', value: 68 },
    { time: '9AM', value: 74 },
    { time: '12PM', value: 72 },
    { time: '3PM', value: 75 },
    { time: '6PM', value: 70 },
    { time: '9PM', value: 67 }
  ];

  // Sleep stage breakdown data
  const sleepStageData = [
    { stage: 'Deep', hours: 2.1, color: '#3B82F6' },
    { stage: 'Light', hours: 4.3, color: '#60A5FA' },
    { stage: 'REM', hours: 1.4, color: '#93C5FD' }
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-[840px] bg-space-950 rounded-[2.5rem] border-4 border-space-700 shadow-2xl overflow-hidden flex flex-col relative select-none font-sans">
      {/* Top Phone Status Bar (Exact to reference Image 1) */}
      <div className="h-10 px-6 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20 bg-space-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span>10:57</span>
        </div>
        <div className="w-20 h-4 bg-black rounded-full mx-auto"></div>
        <div className="flex items-center gap-2 text-[10px]">
          <span>Vo) LTE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>61%</span>
        </div>
      </div>

      {/* Main Screen Content Switcher */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 text-slate-100">
        {/* ========================================================= */}
        {/* SCREEN 1: HOME / DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-fade-in">
            {/* SUB-VIEW 1A: PULSE DAILY VIEW (EXACT REPLICA OF USER IMAGE 1) */}
            {phoneSubStyle === 'pulse_daily' ? (
              <div className="space-y-4">
                {/* Pulse Header */}
                <div className="flex items-center justify-between px-1 text-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPhoneSubStyle('orbital_flow')}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                      title="Switch to Orbital Flow"
                    >
                      <XIcon size={18} />
                    </button>
                    <span className="font-serif font-bold text-base text-white">
                      Pulse – Health...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <button
                      onClick={onOpenDoctorSummary}
                      title="Clinician Notes"
                      className="hover:text-white"
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button
                      onClick={onOpenDoctorSummary}
                      title="Share Summary"
                      className="hover:text-white"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={() => setPhoneSubStyle('orbital_flow')}
                      title="Toggle Orbital View"
                      className="hover:text-white"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Plaid Navy Signature Greeting Card (Image 1) */}
                <div className="plaid-navy-card p-6 text-white space-y-3 relative overflow-hidden shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-serif font-bold leading-tight tracking-tight text-white">
                        Good morning,<br />{userProfile.name.split(' ')[0] || 'Asha'}.
                      </h1>
                    </div>
                    <button
                      onClick={() => setPhoneSubStyle('orbital_flow')}
                      className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-cyan-200 border border-white/20 transition-colors flex items-center gap-1"
                    >
                      <Layers size={11} />
                      <span>Orbital Mode</span>
                    </button>
                  </div>

                  <p className="text-xs text-blue-100 font-sans leading-relaxed pt-1">
                    Grab your coffee and take it slow. Your blood pressure is a little above your own normal today, and everything else looks steady.
                  </p>

                  {/* 72 bpm live readout */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-bold tracking-tight text-white">
                      {hrValue}
                    </span>
                    <span className="text-xs text-blue-200 font-sans">
                      beats per minute, live from your band
                    </span>
                  </div>

                  {/* Live ECG Waveform */}
                  <div className="h-10 w-full flex items-center overflow-hidden pt-2">
                    <svg className="w-full h-8 text-blue-300 stroke-current fill-none stroke-2" viewBox="0 0 360 40">
                      <path
                        d="M 0 20 L 35 20 L 42 20 L 48 8 L 54 32 L 60 2 L 66 38 L 72 20 L 115 20 L 122 20 L 128 8 L 134 32 L 140 2 L 146 38 L 152 20 L 195 20 L 202 20 L 208 8 L 214 32 L 220 2 L 226 38 L 232 20 L 275 20 L 282 20 L 288 8 L 294 32 L 300 2 L 306 38 L 312 20 L 360 20"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Section Title: "Your vitals" with Darker Serif Font */}
                <div className="pt-2">
                  <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                    Your vitals
                  </h2>
                </div>

                {/* Vitals White Cards with Darker Typography (Dark fonts on white backgrounds) */}
                <div className="space-y-3">
                  {/* Heart Rate Card (Image 1) */}
                  <div
                    onClick={() => onOpenVitalDetail('heart_rate')}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 cursor-pointer hover:border-blue-400 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Heart size={14} className="text-slate-800" />
                      <span>Heart rate</span>
                    </div>

                    <div className="text-3xl font-serif font-bold text-slate-950">
                      {hrValue} <span className="text-sm font-normal text-slate-600 font-sans">bpm</span>
                    </div>

                    {/* Dark Sparkline Line (Image 1) */}
                    <div className="h-6 w-full py-1">
                      <svg className="w-full h-full text-slate-900 stroke-current fill-none stroke-2" viewBox="0 0 300 30">
                        <path
                          d="M 0 20 L 35 20 L 70 14 L 110 24 L 150 10 L 190 18 L 230 22 L 270 12 L 300 18"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                      <span>Normal</span>
                    </div>
                  </div>

                  {/* Blood Pressure Card */}
                  <div
                    onClick={() => onOpenVitalDetail('blood_pressure_sys')}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 cursor-pointer hover:border-blue-400 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Activity size={14} className="text-slate-800" />
                      <span>Blood pressure</span>
                    </div>

                    <div className="text-2xl font-serif font-bold text-slate-950">
                      {bpSysValue} / {bpDiaValue} <span className="text-sm font-normal text-slate-600 font-sans">mmHg</span>
                    </div>

                    <div className="h-6 w-full py-1">
                      <svg className="w-full h-full text-slate-900 stroke-current fill-none stroke-2" viewBox="0 0 300 30">
                        <path
                          d="M 0 16 L 40 18 L 80 12 L 120 22 L 160 14 L 200 16 L 240 10 L 280 14 L 300 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="text-xs text-amber-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                      <span>A little above your own normal</span>
                    </div>
                  </div>

                  {/* Blood Oxygen SpO2 Card */}
                  <div
                    onClick={() => onOpenVitalDetail('spo2')}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 cursor-pointer hover:border-blue-400 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Activity size={14} className="text-slate-800" />
                      <span>Blood oxygen (SpO2)</span>
                    </div>

                    <div className="text-2xl font-serif font-bold text-slate-950">
                      {spo2Value}%
                    </div>

                    <div className="h-6 w-full py-1">
                      <svg className="w-full h-full text-slate-900 stroke-current fill-none stroke-2" viewBox="0 0 300 30">
                        <path
                          d="M 0 15 L 45 15 L 90 14 L 135 15 L 180 14 L 225 15 L 270 14 L 300 15"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                      <span>Normal baseline</span>
                    </div>
                  </div>

                  {/* Sleep Card */}
                  <div
                    onClick={() => onOpenVitalDetail('sleep_duration')}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 cursor-pointer hover:border-blue-400 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Moon size={14} className="text-slate-800" />
                      <span>Sleep duration</span>
                    </div>

                    <div className="text-2xl font-serif font-bold text-slate-950">
                      {sleepValue} <span className="text-sm font-normal text-slate-600 font-sans">hours</span>
                    </div>

                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                      <span>Restful recovery</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SUB-VIEW 1B: ORBITAL MISSION VIEW (IMAGE 3 SCREEN 1) */
              <div className="space-y-4">
                {/* Top Brand Header with Corner Checkerboards */}
                <div className="flex items-center justify-between px-1">
                  <div className="w-6 h-6 checkerboard-badge rounded"></div>
                  <div className="text-center">
                    <span className="font-serif tracking-widest text-xs font-bold text-white uppercase block">
                      ORBITAL / STELLAR
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                      HEALTH SYSTEM
                    </span>
                  </div>
                  <div className="w-6 h-6 checkerboard-badge rounded"></div>
                </div>

                {/* Signature Sculpted Ivory Card (Image 3 Screen 1) with High Contrast Dark Font */}
                <div className="ivory-panel p-6 relative overflow-hidden">
                  <div className="w-4 h-4 checkerboard-badge-dark rounded absolute top-3 right-3 opacity-30"></div>

                  <div className="space-y-1">
                    <h1 className="text-2xl font-serif text-ink-950 font-bold tracking-tight leading-tight">
                      Welcome back,<br />{userProfile.name.split(' ')[0] || 'Astronaut'}.
                    </h1>
                    <p className="text-xs font-bold text-ink-700 font-mono">
                      Mission Day 42 • 12 Oct 2026
                    </p>
                  </div>

                  {/* Realistic Earth Orbit Visual */}
                  <div className="my-5 relative flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-900 relative shadow-2xl flex items-center justify-center border border-blue-400/30 overflow-hidden orbital-glow">
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-teal-500 to-transparent"></div>
                      <div className="w-20 h-20 rounded-full border border-dashed border-cyan-300/40 animate-spin"></div>
                      <span className="text-3xl filter drop-shadow">🌍</span>
                    </div>
                    <div className="absolute w-44 h-16 rounded-full border border-blue-600/30 -rotate-12 pointer-events-none"></div>
                    <div className="absolute w-48 h-24 rounded-full border border-blue-400/20 rotate-45 pointer-events-none"></div>
                  </div>

                  {/* Status Pill */}
                  <div className="py-2 px-3 rounded-full bg-ink-950 text-white flex items-center justify-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-wide">
                      All systems nominal — Vitals in great shape!
                    </span>
                  </div>
                </div>

                {/* Quick Access Card */}
                <div className="ivory-panel p-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500 font-mono px-1">
                    Quick Access
                  </div>

                  <button
                    onClick={() => setActiveTab('vitals')}
                    className="w-full p-2.5 rounded-xl hover:bg-ivory-dark flex items-center justify-between text-xs font-bold text-ink-900 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                        <Heart size={15} />
                      </div>
                      <span>Health Overview</span>
                    </div>
                    <ChevronRight size={15} className="text-ink-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('trends')}
                    className="w-full p-2.5 rounded-xl hover:bg-ivory-dark flex items-center justify-between text-xs font-bold text-ink-900 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                        <TrendingUp size={15} />
                      </div>
                      <span>View Trends</span>
                    </div>
                    <ChevronRight size={15} className="text-ink-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full p-2.5 rounded-xl hover:bg-ivory-dark flex items-center justify-between text-xs font-bold text-ink-900 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                        <Bell size={15} />
                      </div>
                      <span>Messages & Doctor Notes</span>
                    </div>
                    <ChevronRight size={15} className="text-ink-400" />
                  </button>
                </div>

                {/* Quick Vitals Snapshot Strip */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => onOpenVitalDetail('heart_rate')}
                    className="space-card p-3.5 cursor-pointer hover:border-accent-blue/50 transition-all"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Heart Rate</span>
                      <Heart size={14} className="text-accent-coral" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-white">
                      {hrValue} <span className="text-xs font-sans text-slate-400">bpm</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                      ● Normal baseline ({baselines['heart_rate']?.referenceMean || 68} bpm)
                    </span>
                  </div>

                  <div
                    onClick={() => onOpenVitalDetail('blood_pressure_sys')}
                    className="space-card p-3.5 cursor-pointer hover:border-accent-blue/50 transition-all"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Blood Pressure</span>
                      <Activity size={14} className="text-accent-blue" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-white">
                      {bpSysValue}/{bpDiaValue}
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                      ● 120/80 Target
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: VITALS DRILLDOWN (Image Reference #3) */}
        {/* ========================================================= */}
        {activeTab === 'vitals' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Vitals</span>
              <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/30">
                LIVE TELEMETRY
              </span>
            </div>

            {/* Big Luminous Pulse Gauge Card */}
            <div className="space-card p-6 text-center relative overflow-hidden">
              <div className="w-40 h-40 mx-auto rounded-full border-4 border-accent-blue/30 bg-gradient-to-b from-space-900 to-space-850 flex flex-col items-center justify-center relative orbital-glow">
                <div className="flex items-center gap-1 text-accent-blue text-xs font-mono">
                  <Activity size={14} className="animate-pulse" />
                  <span>Resting</span>
                </div>
                <div className="text-5xl font-serif font-bold text-white my-1">
                  {hrValue}
                </div>
                <span className="text-xs text-slate-400 font-mono">bpm</span>
                <span className="text-[10px] text-accent-blue mt-1">↓ 2% from yesterday</span>
              </div>

              {/* Top right metric micro-chips */}
              <div className="grid grid-cols-3 gap-2 mt-5 text-xs font-mono">
                <div
                  onClick={() => onOpenVitalDetail('spo2')}
                  className="p-2 rounded-xl bg-space-900 border border-space-700 cursor-pointer hover:border-accent-blue"
                >
                  <span className="text-slate-400 text-[10px] block">SpO2</span>
                  <span className="font-bold text-white text-sm">{spo2Value}%</span>
                </div>
                <div
                  onClick={() => onOpenVitalDetail('temperature')}
                  className="p-2 rounded-xl bg-space-900 border border-space-700 cursor-pointer hover:border-accent-blue"
                >
                  <span className="text-slate-400 text-[10px] block">TEMP</span>
                  <span className="font-bold text-white text-sm">{tempValue}°C</span>
                </div>
                <div
                  onClick={() => onOpenVitalDetail('blood_pressure_sys')}
                  className="p-2 rounded-xl bg-space-900 border border-space-700 cursor-pointer hover:border-accent-blue"
                >
                  <span className="text-slate-400 text-[10px] block">BP</span>
                  <span className="font-bold text-white text-sm">{bpSysValue}/{bpDiaValue}</span>
                </div>
              </div>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center justify-between bg-space-900 p-1 rounded-xl border border-space-700 font-mono text-xs">
              {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setVitalsTimeRange(t)}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    vitalsTimeRange === t
                      ? 'bg-white text-space-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Luminous Smooth Blue Wave Graph */}
            <div className="space-card p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>Diurnal Pulse Variation</span>
                <span className="text-accent-blue">Continuous rPPG</span>
              </div>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vitalsWaveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mobilePulseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#5A7EA8"
                      tick={{ fill: '#8CA7C7', fontSize: 10, fontFamily: 'monospace' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#5A7EA8"
                      tick={{ fill: '#8CA7C7', fontSize: 10, fontFamily: 'monospace' }}
                      tickLine={false}
                      domain={[55, 85]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-space-900 border border-space-700 p-2 rounded text-xs font-mono text-white">
                              {payload[0].payload.time}: <strong className="text-accent-blue">{payload[0].value} bpm</strong>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#38BDF8"
                      strokeWidth={2.5}
                      fill="url(#mobilePulseGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: SLEEP (Image Reference #4) */}
        {/* ========================================================= */}
        {activeTab === 'sleep' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Sleep</span>
              <span className="text-xs text-slate-400 font-mono">Actigraphy Verified</span>
            </div>

            {/* Deep Space Crescent Planet Backdrop Card */}
            <div className="space-card p-6 relative overflow-hidden text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-500/30 mx-auto flex items-center justify-center text-3xl shadow-lg">
                🌙
              </div>
              <div className="text-4xl font-serif font-bold text-white pt-1">
                7h 48m
              </div>
              <div className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
                <span>Good sleep quality</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>

            {/* Stage Breakdown Bar Chart */}
            <div className="space-card p-4 space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide block font-mono">
                Sleep Stage Distribution
              </span>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepStageData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      stroke="#8CA7C7"
                      tick={{ fill: '#B8CCE3', fontSize: 11, fontFamily: 'monospace' }}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#38BDF8" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono text-slate-400 pt-2 border-t border-space-700">
                <div>Deep: <strong className="text-white">2.1h</strong></div>
                <div>Light: <strong className="text-white">4.3h</strong></div>
                <div>REM: <strong className="text-white">1.4h</strong></div>
              </div>
            </div>

            {/* Bottom Insight Card */}
            <div className="p-4 rounded-2xl bg-space-900 border border-space-700 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Insight: Sleep Efficiency Improved
                </span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Your restorative deep sleep increased by 18% this week following the 3:00 PM caffeine cutoff.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: TRENDS (Image Reference #5) */}
        {/* ========================================================= */}
        {activeTab === 'trends' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Trends</span>
              <span className="text-xs text-slate-400 font-mono">Longitudinal 30d</span>
            </div>

            {/* Ivory Card with Time Pills and High-Contrast Dark Text */}
            <div className="ivory-panel p-5 space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center justify-between bg-ivory-dark/60 p-1 rounded-xl text-xs font-mono font-bold text-ink-700">
                {(['1W', '1M', '3M', '1Y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendsTimeRange(r)}
                    className={`flex-1 py-1 rounded-lg transition-colors ${
                      trendsTimeRange === r
                        ? 'bg-ink-950 text-white shadow-sm'
                        : 'text-ink-700 hover:text-ink-950'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Metric Trend Rows with Crisp Dark Text */}
              <div className="space-y-3.5 divide-y divide-ivory-border">
                {/* Heart Rate */}
                <div
                  onClick={() => onOpenVitalDetail('heart_rate')}
                  className="pt-2 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-ink-900 block">Heart Rate</span>
                    <span className="text-[10px] text-ink-600 font-mono">Baseline: 68 bpm</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-ink-950">{hrValue} bpm</span>
                    <span className="text-[10px] text-accent-cobalt font-bold block">↑ 2%</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div
                  onClick={() => onOpenVitalDetail('spo2')}
                  className="pt-2.5 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-ink-900 block">SpO2 Oxygen</span>
                    <span className="text-[10px] text-ink-600 font-mono">Baseline: 98.2%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-ink-950">{spo2Value}%</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">~ 0% (Stable)</span>
                  </div>
                </div>

                {/* Temperature */}
                <div
                  onClick={() => onOpenVitalDetail('temperature')}
                  className="pt-2.5 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-ink-900 block">Temperature</span>
                    <span className="text-[10px] text-ink-600 font-mono">Baseline: 36.5°C</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-ink-950">{tempValue}°C</span>
                    <span className="text-[10px] text-accent-cobalt font-bold block">↑ 0.1%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Finding Card */}
            <div className="space-card p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue mt-0.5">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  ✦ Key Finding: Cabin Temperature Correlation
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Your resting heart rate tends to elevate by +3 bpm on days when ambient cabin temperature rises above 24.5°C.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: HEALTH INSIGHTS / CAUSE & EFFECT (Image Ref #6) */}
        {/* ========================================================= */}
        {activeTab === 'insights' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Health Insights</span>
              <span className="text-xs text-accent-blue font-mono">DISCOVERY ENGINE</span>
            </div>

            {/* Cause & Effect Card with Exact Flow Diagram in Image */}
            <div className="space-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Cause & Effect Discovery
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Poor sleep may be linked to increased stress levels and elevated resting pulse.
              </p>

              {/* Exact Flow Diagram from Reference Image: [Sleep ↓] -> [Stress ↑] -> [HR ↑] */}
              <div className="p-3 rounded-2xl bg-space-950 border border-space-700 flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-lg">🌙</span>
                  <span className="text-[11px] text-accent-blue font-bold">Sleep ↓</span>
                  <span className="text-[9px] text-slate-500">5.2h</span>
                </div>

                <div className="text-slate-500 text-sm">➔</div>

                <div className="flex flex-col items-center">
                  <span className="text-lg">⏱</span>
                  <span className="text-[11px] text-amber-400 font-bold">Stress ↑</span>
                  <span className="text-[9px] text-slate-500">7 / 10</span>
                </div>

                <div className="text-slate-500 text-sm">➔</div>

                <div className="flex flex-col items-center">
                  <span className="text-lg">❤️</span>
                  <span className="text-[11px] text-accent-coral font-bold">HR ↑</span>
                  <span className="text-[9px] text-slate-500">+8 bpm</span>
                </div>
              </div>
            </div>

            {/* Personal Baseline Card */}
            <div className="space-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Personal Baseline
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Reliable Profile</span>
              </div>
              <p className="text-xs text-slate-300">
                Your normal heart rate range is <strong className="text-white">60 – 75 bpm</strong> (μ = 68 bpm, σ = 3.2).
              </p>
              <div className="h-10 w-full bg-space-950 rounded-lg border border-space-800 p-2 flex items-center">
                <div className="w-full h-2 bg-space-800 rounded-full relative overflow-hidden">
                  <div className="absolute left-[30%] right-[30%] h-full bg-accent-blue/40 rounded-full"></div>
                  <div className="absolute left-[52%] w-2 h-4 -top-1 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>

            {/* Just-In-Time Nudge Card with Play Action */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 to-space-900 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white block">Try a 5-min breathing exercise</span>
                  <span className="text-slate-400 text-[11px]">Reduces acute stress by ~15%</span>
                </div>
              </div>
              <button
                onClick={onOpenVoiceModal}
                className="w-8 h-8 rounded-full bg-white text-space-950 flex items-center justify-center shadow hover:scale-105 transition-all"
              >
                <Play size={14} className="ml-0.5" />
              </button>
            </div>

            {/* Biometric Modality Buttons */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <button
                onClick={onOpenVoiceModal}
                className="p-3 rounded-xl space-card hover:border-accent-blue transition-all"
              >
                <Mic size={18} className="mx-auto text-accent-blue mb-1" />
                <span className="text-[11px] block">Voice Check</span>
              </button>

              <button
                onClick={onOpenCameraModal}
                className="p-3 rounded-xl space-card hover:border-accent-blue transition-all"
              >
                <Camera size={18} className="mx-auto text-accent-blue mb-1" />
                <span className="text-[11px] block">Camera rPPG</span>
              </button>

              <button
                onClick={onOpenFoodModal}
                className="p-3 rounded-xl space-card hover:border-accent-blue transition-all"
              >
                <Utensils size={18} className="mx-auto text-accent-blue mb-1" />
                <span className="text-[11px] block">Food Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 6: CARE PLAN (Image Reference #7) */}
        {/* ========================================================= */}
        {activeTab === 'careplan' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Care Plan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white text-space-950 font-bold font-mono">
                Active Plan
              </span>
            </div>

            {/* Ivory Card with High-Contrast Dark Text */}
            <div className="ivory-panel p-5 space-y-4">
              <div className="space-y-3.5">
                {/* Medication Item */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded-md bg-blue-100 text-blue-900 mt-0.5">
                      <Sparkles size={14} />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-ink-950 block">Medication</span>
                      <p className="text-xs text-ink-700 font-medium">
                        Take 1 tablet daily (After breakfast)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleMedication(medications[0]?.id || 'med-1')}
                    className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0"
                  >
                    ✓
                  </button>
                </div>

                {/* Exercise Item */}
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-ivory-border">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded-md bg-emerald-100 text-emerald-900 mt-0.5">
                      <Activity size={14} />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-ink-950 block">Exercise</span>
                      <p className="text-xs text-ink-700 font-medium">
                        25 min light cardio / treadmill walk
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                </div>

                {/* Diet Item */}
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-ivory-border">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded-md bg-amber-100 text-amber-900 mt-0.5">
                      <Utensils size={14} />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-ink-950 block">Diet</span>
                      <p className="text-xs text-ink-700 font-medium">
                        Increase protein intake, keep sodium &lt;1,800mg
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-ink-400 flex-shrink-0"></div>
                </div>
              </div>
            </div>

            {/* Next Review Dark Card */}
            <div className="space-card p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Next Clinician Review</span>
                <span className="text-sm font-serif font-bold text-white">18 Oct 2026</span>
              </div>
              <button
                onClick={onOpenDoctorSummary}
                className="px-3 py-1.5 rounded-xl bg-white text-space-950 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                View Details ➔
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 7: MESSAGES & NOTIFICATIONS (Image Reference #8) */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Messages</span>
              <span className="text-xs text-accent-blue font-mono">4 UNREAD</span>
            </div>

            {/* Filter Tabs matching image */}
            <div className="flex items-center justify-between bg-space-900 p-1 rounded-xl border border-space-700 text-xs font-mono">
              {(['All', 'Alerts', 'Care', 'System'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMessageFilter(filter)}
                  className={`flex-1 py-1 rounded-lg transition-colors ${
                    messageFilter === filter
                      ? 'bg-white text-space-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Message Items List */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-space-900 border border-space-700 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Elevated Stress Detected</span>
                    <span className="text-[10px] text-slate-500 font-mono">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Consider taking a 10-minute rest break.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-space-900 border border-space-700 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue mt-0.5">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Dr. Patel / Mehta</span>
                    <span className="text-[10px] text-slate-500 font-mono">3h ago</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your 7-day blood pressure report is ready for review.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-space-900 border border-space-700 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Medication Reminder</span>
                    <span className="text-[10px] text-slate-500 font-mono">5h ago</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Time for your evening Atorvastatin dose.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-space-900 border border-space-700 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Shield size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Mission Update</span>
                    <span className="text-[10px] text-slate-500 font-mono">1d ago</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cabin bio-telemetry sensors operating nominally.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDoctorSummary}
              className="w-full py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-medium text-slate-300 transition-colors text-center"
            >
              View Clinical Brief ➔
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: PROFILE (Image Reference #9) */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Profile</span>
              <div className="w-5 h-5 checkerboard-badge rounded"></div>
            </div>

            {/* Astronaut Helmet Card */}
            <div className="ivory-panel p-5 text-ink-950 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl shadow-md border-2 border-slate-700">
                  👨‍🚀
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-ink-950">
                    A. Patel / Asha Sharma
                  </h3>
                  <span className="text-xs font-semibold text-ink-700 font-mono block">
                    Mission Day 42 • Crew ID 084
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-ivory-border font-medium text-xs text-ink-900">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className="w-full py-2 flex items-center justify-between hover:text-accent-cobalt"
                >
                  <span>Health Profile & Biometrics</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className="w-full py-2 flex items-center justify-between hover:text-accent-cobalt"
                >
                  <span>Emergency Contacts</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="w-full py-2 flex items-center justify-between hover:text-accent-cobalt"
                >
                  <span>Privacy & Data Access</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={onOpenDoctorSummary}
                  className="w-full py-2 flex items-center justify-between hover:text-accent-cobalt"
                >
                  <span>Doctor Pre-Visit Brief</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign Out / Switch Profile
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 9: EMERGENCY SOS (Image Reference #10) */}
        {/* ========================================================= */}
        {activeTab === 'emergency' && (
          <div className="space-y-5 animate-fade-in text-center py-4">
            <div className="w-24 h-24 rounded-full bg-red-950/40 border-4 border-accent-coral mx-auto flex items-center justify-center text-accent-coral shadow-glow-coral animate-pulse">
              <AlertTriangle size={44} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-accent-coral tracking-wide">
                SOS EMERGENCY
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Alert mission medical control and broadcast real-time bio-telemetry.
              </p>
            </div>

            <div className="space-card p-4 text-xs font-mono text-left space-y-1.5 text-slate-300">
              <div className="text-slate-400 uppercase text-[10px]">Telemetry Distress Recipients:</div>
              <div>• NASA Mission Control (MCC Houston - S-Band)</div>
              <div>• Doctor Console (Channel BME-1)</div>
              <div>• Station Commander (Intercom Loop Alpha)</div>
            </div>

            <button
              onClick={onOpenSosModal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-glow-coral transition-all active:scale-98"
            >
              🚀 Send Alert!
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 10: DATA ACCESS / PRIVACY (Image Reference #11) */}
        {/* ========================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-lg font-bold text-white">Data Access</span>
              <span className="text-xs text-emerald-400 font-mono">ENCRYPTED</span>
            </div>

            <div className="space-card p-5 space-y-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  You're in control.
                </h3>
                <p className="text-xs text-slate-400">
                  Who can view your health data & baselines?
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-1 border-b border-space-800">
                  <span className="text-xs font-medium text-slate-200">Medical Team</span>
                  <input
                    type="checkbox"
                    checked={privacyToggles.medicalTeam}
                    onChange={(e) =>
                      setPrivacyToggles((p) => ({ ...p, medicalTeam: e.target.checked }))
                    }
                    className="w-4 h-4 accent-accent-blue cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-1 border-b border-space-800">
                  <span className="text-xs font-medium text-slate-200">NASA Flight Operations (MCC)</span>
                  <input
                    type="checkbox"
                    checked={privacyToggles.familyMember}
                    onChange={(e) =>
                      setPrivacyToggles((p) => ({ ...p, familyMember: e.target.checked }))
                    }
                    className="w-4 h-4 accent-accent-blue cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-medium text-slate-200">Research Use (Anonymized)</span>
                  <input
                    type="checkbox"
                    checked={privacyToggles.researchUse}
                    onChange={(e) =>
                      setPrivacyToggles((p) => ({ ...p, researchUse: e.target.checked }))
                    }
                    className="w-4 h-4 accent-accent-blue cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={onOpenDoctorSummary}
                className="w-full py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-space-700 text-xs font-semibold text-accent-blue transition-colors text-center mt-2 block"
              >
                Manage Access & Revoke Permissions ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation (Exact to user Image 1 & Image 3) */}
      <div className="absolute bottom-3 left-3 right-3 z-30">
        {phoneSubStyle === 'pulse_daily' ? (
          /* Signature Image 1 White Floating Pill Navigation */
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 py-1 px-3.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio size={14} />
              <span>Today</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-[#0F172A] text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={15} />
              <span>Insights</span>
            </button>

            <button
              onClick={onOpenCameraModal}
              title="Camera Vitals / Quick Log"
              className="flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium text-slate-600 hover:text-slate-900 transition-all"
            >
              <Plus size={16} />
              <span>Log</span>
            </button>

            <button
              onClick={() => setActiveTab('careplan')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'careplan'
                  ? 'bg-[#0F172A] text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={15} />
              <span>Care</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#0F172A] text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield size={15} />
              <span>Privacy</span>
            </button>
          </div>
        ) : (
          /* Image 3 Orbital Space Floating Navigation */
          <div className="bg-space-900/95 backdrop-blur-md border border-space-700 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio size={14} />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'vitals'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart size={14} />
              <span>Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab('sleep')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'sleep'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon size={14} />
              <span>Sleep</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'trends'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={14} />
              <span>Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('careplan')}
              className={`flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium transition-all ${
                activeTab === 'careplan'
                  ? 'bg-white text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={14} />
              <span>Care</span>
            </button>

            <button
              onClick={() => setPhoneSubStyle('pulse_daily')}
              title="Switch to Pulse Daily View (Image 1)"
              className="flex flex-col items-center py-1 px-2 rounded-full text-[10px] font-medium text-cyan-300 hover:text-white"
            >
              <Layers size={14} />
              <span>Pulse</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
