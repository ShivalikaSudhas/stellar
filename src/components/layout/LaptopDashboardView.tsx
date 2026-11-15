import React, { useState, useMemo } from 'react';
import {
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  Medication,
  CarePlan,
  UserProfile,
  MetricType,
  CauseAndEffectInsight,
  FoodPouchItem,
  MealLogEntry,
  RadiationData,
  PrivacyPermissionEntry,
  EmergencyAccessLog
} from '@/types';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Search,
  Shield,
  FileText,
  Sparkles,
  AlertTriangle,
  Mic,
  Utensils,
  Zap,
  CheckCircle2,
  Droplet,
  TrendingUp,
  TrendingDown,
  Moon,
  Send,
  Unlock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';

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

// Pre-cataloged spaceflight food pouches (NASA Flight Pantry)
const SPACE_FOOD_CATALOG: FoodPouchItem[] = [
  {
    id: 'pouch-01',
    barcode: 'NASA-FD-7014',
    name: 'Freeze-Dried Teriyaki Chicken & Jasmine Rice',
    category: 'Entree',
    calories: 420,
    carbsG: 54,
    proteinG: 28,
    fatG: 10,
    sodiumMg: 580,
    shelfLife: '36 Months',
    servingSize: '1 pouch (185g rehydrated)'
  },
  {
    id: 'pouch-02',
    barcode: 'NASA-FD-8102',
    name: 'Irradiated Beef Steak with Herb Gravy',
    category: 'Entree',
    calories: 380,
    carbsG: 12,
    proteinG: 42,
    fatG: 18,
    sodiumMg: 620,
    shelfLife: '24 Months',
    servingSize: '1 pouch (170g)'
  },
  {
    id: 'pouch-03',
    barcode: 'NASA-FD-4091',
    name: 'Steamed Sweet Corn & Butter Sauce',
    category: 'Vegetable',
    calories: 160,
    carbsG: 28,
    proteinG: 4,
    fatG: 4,
    sodiumMg: 210,
    shelfLife: '36 Months',
    servingSize: '1 pouch (140g)'
  },
  {
    id: 'pouch-04',
    barcode: 'NASA-FD-9025',
    name: 'Fortified Mango Electrolyte Smoothie',
    category: 'Rehydratable Drink',
    calories: 140,
    carbsG: 32,
    proteinG: 2,
    fatG: 0,
    sodiumMg: 340,
    shelfLife: '18 Months',
    servingSize: '250 ml rehydrated'
  },
  {
    id: 'pouch-05',
    barcode: 'NASA-FD-3118',
    name: 'Dark Chocolate Cranberry Almond Bar',
    category: 'Dessert',
    calories: 220,
    carbsG: 22,
    proteinG: 6,
    fatG: 13,
    sodiumMg: 85,
    shelfLife: '12 Months',
    servingSize: '1 bar (50g)'
  }
];

export const LaptopDashboardView: React.FC<LaptopDashboardViewProps> = ({
  userProfile,
  readings,
  baselines,
  alerts,
  wellness: _wellness,
  medications,
  carePlan: _carePlan,
  insights: _insights,
  onOpenVitalDetail,
  onOpenVoiceModal,
  onOpenSosModal,
  onToggleMedication
}) => {
  const [activeSideNav, setActiveSideNav] = useState<
    'dashboard' | 'insights' | 'log' | 'care' | 'radiation' | 'privacy'
  >('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState<'1d' | '7d' | '30d'>('7d');

  // --- LOG STATE ---
  const [scannedBarcode, setScannedBarcode] = useState('NASA-FD-7014');
  const [selectedPouch, setSelectedPouch] = useState<FoodPouchItem>(SPACE_FOOD_CATALOG[0]);
  const [portionEaten, setPortionEaten] = useState<number>(100);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'EVA Snack' | 'Extra Swap'>('Lunch');
  const [plannedVsActual] = useState<'Planned' | 'Unplanned Swap' | 'Extra'>('Planned');
  const [mealLogs, setMealLogs] = useState<MealLogEntry[]>([
    {
      id: 'm-1',
      timestamp: 'Today, 07:45 GMT',
      astronautId: userProfile.id,
      pouchBarcode: 'NASA-FD-9025',
      itemName: 'Fortified Mango Electrolyte Smoothie',
      calories: 140,
      carbsG: 32,
      proteinG: 2,
      fatG: 0,
      portionEatenPct: 100,
      mealType: 'Breakfast',
      plannedVsActual: 'Planned',
      confirmed: true
    }
  ]);
  const [mealConfirmSuccess, setMealConfirmSuccess] = useState(false);

  // Additional Logging state
  const [waterDispensedMl, setWaterDispensedMl] = useState<number>(1850);
  const [manualWaterInput, setManualWaterInput] = useState<number>(250);
  const [appetiteScore, setAppetiteScore] = useState<number>(4);
  const [nauseaScore, setNauseaScore] = useState<number>(1);
  const [moodScore, setMoodScore] = useState<number>(4);
  const [resistanceDevice, setResistanceDevice] = useState<'ARED' | 'T2 Treadmill' | 'CEVIS Cycle'>('ARED');
  const [dailyLogSaved, setDailyLogSaved] = useState(false);

  // --- RADIATION STATE ---
  const [radiationData] = useState<RadiationData>({
    currentRateMicroSvPerHour: 18.4,
    dailyAccumulatedMilliSv: 0.44,
    missionCumulativeMilliSv: 19.8,
    careerLimitMilliSv: 600,
    thresholdWarningMilliSvPerDay: 1.0,
    thresholdCriticalMilliSvPerDay: 2.5,
    solarActivityStatus: 'Quiet',
    dosimeterReadings: [
      { time: '00:00', rateUSvH: 17.8 },
      { time: '04:00', rateUSvH: 18.1 },
      { time: '08:00', rateUSvH: 19.2 },
      { time: '12:00', rateUSvH: 18.5 },
      { time: '16:00', rateUSvH: 18.4 },
      { time: '20:00', rateUSvH: 18.2 }
    ]
  });

  // --- PRIVACY STATE ---
  const [permissions, setPermissions] = useState<PrivacyPermissionEntry[]>([
    {
      id: 'perm-1',
      accessorName: 'Dr. Rajesh Mehta, MD',
      accessorRole: 'Lead Attending Doctor',
      agencyOrUnit: 'NASA Mission Health Ops (MCC Houston)',
      category: 'Flight Surgery',
      accessLevel: 'Full Real-time',
      lastAccessed: '12 mins ago',
      revocable: false
    },
    {
      id: 'perm-2',
      accessorName: 'BME Autonomous Telemetry Daemon',
      accessorRole: 'ECLSS Environmental Correlation',
      agencyOrUnit: 'ISS Avionics / Gateway Health Relay',
      category: 'Biomedical Engineering',
      accessLevel: 'Full Real-time',
      lastAccessed: 'Real-time sync',
      revocable: true
    },
    {
      id: 'perm-3',
      accessorName: 'Dr. Kevin Vance',
      accessorRole: 'Exercise Physiologist',
      agencyOrUnit: 'Human Research Program (JSC)',
      category: 'Research Study',
      accessLevel: 'Aggregated Daily Summary',
      lastAccessed: '2 hours ago',
      revocable: true
    },
    {
      id: 'perm-4',
      accessorName: 'Station Commander Marcus Vance',
      accessorRole: 'Onboard Mission Commander',
      agencyOrUnit: 'Station Habitat Intercom Loop Alpha',
      category: 'Command Team',
      accessLevel: 'Emergency Only',
      lastAccessed: 'Yesterday',
      revocable: false
    }
  ]);
  const [emergencyLogs, setEmergencyLogs] = useState<EmergencyAccessLog[]>([
    {
      id: 'em-log-1',
      timestamp: '2026-11-14 03:22 GMT',
      accessorIdentity: 'Dr. Rajesh Mehta (Authorized Medical Officer)',
      reason: 'Rapid Resting HR elevation >2.5 sigma notification during sleep cycle',
      patientId: userProfile.id,
      dataAccessed: 'High-frequency ECG waveform & SpO2 buffer'
    }
  ]);

  // --- CARE / DISCUSSION QUESTIONS STATE ---
  const [discussionQuestions, setDiscussionQuestions] = useState<string[]>([
    'Does the slight morning systolic BP rise correlate with the fluid shift sensation upon waking?',
    'Should we increase salt tablet replenishment before next week scheduled EVA?'
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [groundSyncPending, setGroundSyncPending] = useState(false);
  const [groundSyncSuccess, setGroundSyncSuccess] = useState(false);

  // Helper to extract vital metrics
  const getLatest = (m: MetricType, fallback: number) => {
    const list = readings.filter((r) => r.metric === m);
    return list.length > 0 ? list[list.length - 1].value : fallback;
  };

  const hrValue = getLatest('heart_rate', 72);
  const bpSysValue = getLatest('blood_pressure_sys', 120);
  const bpDiaValue = getLatest('blood_pressure_dia', 80);
  const spo2Value = getLatest('spo2', 98.4);
  const sleepValue = getLatest('sleep_duration', 7.4);

  const hrBase = baselines['heart_rate']?.referenceMean || 68;
  const bpSysBase = baselines['blood_pressure_sys']?.referenceMean || 118;
  const bpDiaBase = baselines['blood_pressure_dia']?.referenceMean || 78;
  const spo2Base = baselines['spo2']?.referenceMean || 98.5;
  const sleepBase = baselines['sleep_duration']?.referenceMean || 7.5;

  const hrVar = Number((hrValue - hrBase).toFixed(1));
  const bpSysVar = Number((bpSysValue - bpSysBase).toFixed(1));
  const spo2Var = Number((spo2Value - spo2Base).toFixed(1));
  const sleepVar = Number((sleepValue - sleepBase).toFixed(1));

  // Chart data generation based on timeframe
  const chartPoints = useMemo(() => {
    const labels =
      chartTimeframe === '1d'
        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        : chartTimeframe === '7d'
        ? ['Sol 36', 'Sol 37', 'Sol 38', 'Sol 39', 'Sol 40', 'Sol 41', 'Today']
        : Array.from({ length: 14 }, (_, i) => `Sol ${29 + i}`);

    return labels.map((label, idx) => ({
      name: label,
      hr: Math.round(hrBase + (Math.sin(idx) * 4) + (idx === labels.length - 1 ? hrVar : 0)),
      bpSys: Math.round(bpSysBase + (Math.cos(idx) * 3) + (idx === labels.length - 1 ? bpSysVar : 0)),
      spo2: Number((spo2Base + (Math.sin(idx * 0.5) * 0.4)).toFixed(1)),
      sleep: Number((sleepBase + (Math.cos(idx * 0.8) * 0.6)).toFixed(1))
    }));
  }, [chartTimeframe, hrBase, hrVar, bpSysBase, bpSysVar, spo2Base, sleepBase]);

  // Handle food pouch scanning
  const handlePouchScan = (barcode: string) => {
    setScannedBarcode(barcode);
    const item = SPACE_FOOD_CATALOG.find((p) => p.barcode === barcode);
    if (item) {
      setSelectedPouch(item);
    }
  };

  const handleConfirmMeal = () => {
    const ratio = portionEaten / 100;
    const newEntry: MealLogEntry = {
      id: `m-${Date.now()}`,
      timestamp: 'Just now (Offline Synced)',
      astronautId: userProfile.id,
      pouchBarcode: selectedPouch.barcode,
      itemName: selectedPouch.name,
      calories: Math.round(selectedPouch.calories * ratio),
      carbsG: Math.round(selectedPouch.carbsG * ratio),
      proteinG: Math.round(selectedPouch.proteinG * ratio),
      fatG: Math.round(selectedPouch.fatG * ratio),
      portionEatenPct: portionEaten,
      mealType,
      plannedVsActual,
      confirmed: true
    };
    setMealLogs((prev) => [newEntry, ...prev]);
    setMealConfirmSuccess(true);
    setTimeout(() => setMealConfirmSuccess(false), 2500);
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      setDiscussionQuestions((prev) => [...prev, newQuestionText.trim()]);
      setNewQuestionText('');
    }
  };

  const handleSendToGroundSupport = () => {
    setGroundSyncPending(true);
    setTimeout(() => {
      setGroundSyncPending(false);
      setGroundSyncSuccess(true);
      setTimeout(() => setGroundSyncSuccess(false), 3000);
    }, 1200);
  };

  const handleTogglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === id && p.revocable) {
          const nextLevel = p.accessLevel === 'Revoked' ? 'Aggregated Daily Summary' : 'Revoked';
          return { ...p, accessLevel: nextLevel };
        }
        return p;
      })
    );
  };

  const handleTriggerEmergencyOverride = () => {
    const reasonPrompt = 'Acute mission flight rule advisory: BME telemetry divergence check';
    const newLog: EmergencyAccessLog = {
      id: `em-log-${Date.now()}`,
      timestamp: new Date().toUTCString(),
      accessorIdentity: 'Dr. Rajesh Mehta (Authorized Medical Officer)',
      reason: reasonPrompt,
      patientId: userProfile.id,
      dataAccessed: 'High-frequency ECG waveform, intracranial pressure estimate, full history'
    };
    setEmergencyLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex h-full min-h-[820px] bg-space-950 text-slate-100 rounded-2xl overflow-hidden border border-space-800 shadow-2xl font-sans">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR: DR. ORBIT OFFICIAL ASTRONAUT TERMINAL */}
      {/* ========================================================= */}
      <aside className="w-64 bg-space-900 border-r border-space-800 p-5 flex flex-col justify-between flex-shrink-0 select-none">
        <div className="space-y-6">
          {/* Dr. ORBIT Official Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-cyan-400/60 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50 flex-shrink-0">
              <img src="/dr-orbit-logo.png" alt="Dr. ORBIT Official Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-serif font-bold text-white tracking-wider text-lg block leading-none">
                Dr. ORBIT
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-tight uppercase">
                Astronaut Health Terminal
              </span>
            </div>
          </div>

          {/* Astronaut Profile Pill */}
          <div className="p-3 rounded-2xl bg-space-850 border border-space-750 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xl border border-space-700 flex-shrink-0">
              👩‍🚀
            </div>
            <div className="truncate">
              <span className="font-semibold text-white text-xs block truncate">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {userProfile.callsign || 'VALKYRIE'} • SOL 42
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Dashboard / Overview', icon: <LayoutDashboard size={16} /> },
              { id: 'insights', label: 'Explainable AI Insights', icon: <Sparkles size={16} /> },
              { id: 'log', label: 'Daily Logging & Food Pouch', icon: <Utensils size={16} /> },
              { id: 'care', label: 'Care, Meds & Ground Sync', icon: <FileText size={16} /> },
              { id: 'radiation', label: 'Radiation & Dosimetry', icon: <Zap size={16} /> },
              { id: 'privacy', label: 'Data Access & Override', icon: <Shield size={16} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSideNav(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeSideNav === item.id
                    ? 'bg-white text-space-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-space-850'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* SOS Alert Section */}
        <div className="pt-4 border-t border-space-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>OFFLINE QUEUE:</span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>
          <button
            onClick={onOpenSosModal}
            className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle size={15} />
            <span>Emergency SOS Trigger</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-space-950">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-space-800 px-8 flex items-center justify-between gap-4 flex-shrink-0 bg-space-900/60 backdrop-blur-md">
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
              HELLO, {userProfile.name.split(' ')[0]}!
              <span className="text-xs font-normal normal-case font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                Dr. ORBIT v2.4 (Active)
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Mission Sol 42 • Telemetry sync: Real-time (Offline buffer active) • ECLSS Nominal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search telemetry, foods, meds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={onOpenVoiceModal}
              title="Voice Biomarker Analysis"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Mic size={15} />
            </button>
            <button
              onClick={() => setActiveSideNav('log')}
              title="Food Pouch Scanner"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Utensils size={15} />
            </button>
            <button
              onClick={() => setActiveSideNav('radiation')}
              title="Radiation Dosimetry"
              className="p-2 rounded-xl bg-space-850 hover:bg-space-800 border border-space-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Zap size={15} />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD / OVERVIEW */}
        {/* ========================================================= */}
        {activeSideNav === 'dashboard' && (
          <div className="p-8 space-y-6 animate-fade-in">
            {/* Top Row: 4 Essential Vital Cards with Personal Baseline, Variation & 1/7/30d filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" />
                  Continuous Vitals Telemetry & Personal Baseline Variations
                </span>

                <div className="flex items-center gap-1 bg-space-900 p-1 rounded-xl border border-space-800 text-xs font-mono">
                  {(['1d', '7d', '30d'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setChartTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                        chartTimeframe === tf
                          ? 'bg-white text-space-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* 1. Heart Rate */}
                <div
                  onClick={() => onOpenVitalDetail('heart_rate')}
                  className="space-card p-4 cursor-pointer hover:border-cyan-400 transition-all border border-space-800"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium">Resting Heart Rate</span>
                    <Heart size={14} className="text-rose-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
                    {hrValue} <span className="text-xs font-normal text-slate-400 font-mono">bpm</span>
                  </div>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-space-800 flex items-center justify-between">
                    <span className="text-slate-400">Base: {hrBase} bpm</span>
                    <span className={`font-bold flex items-center gap-0.5 ${hrVar > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {hrVar > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {hrVar > 0 ? `+${hrVar}` : hrVar} bpm
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Status: Within Safe Baseline</div>
                </div>

                {/* 2. Blood Pressure */}
                <div
                  onClick={() => onOpenVitalDetail('blood_pressure_sys')}
                  className="space-card p-4 cursor-pointer hover:border-cyan-400 transition-all border border-space-800"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium">Blood Pressure</span>
                    <Activity size={14} className="text-cyan-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
                    {bpSysValue}/{bpDiaValue} <span className="text-xs font-normal text-slate-400 font-mono">mmHg</span>
                  </div>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-space-800 flex items-center justify-between">
                    <span className="text-slate-400">Base: {bpSysBase}/{bpDiaBase}</span>
                    <span className={`font-bold flex items-center gap-0.5 ${bpSysVar > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {bpSysVar > 0 ? `+${bpSysVar}` : bpSysVar} mmHg
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Status: Compensated Cephalic Shift</div>
                </div>

                {/* 3. SpO2 */}
                <div
                  onClick={() => onOpenVitalDetail('spo2')}
                  className="space-card p-4 cursor-pointer hover:border-cyan-400 transition-all border border-space-800"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium">Blood Oxygen (SpO2)</span>
                    <Droplet size={14} className="text-cyan-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
                    {spo2Value} <span className="text-xs font-normal text-slate-400 font-mono">%</span>
                  </div>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-space-800 flex items-center justify-between">
                    <span className="text-slate-400">Base: {spo2Base}%</span>
                    <span className="font-bold text-emerald-400">
                      {spo2Var > 0 ? `+${spo2Var}%` : `${spo2Var}%`}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Status: Cabin pO2 21.0% (Nominal)</div>
                </div>

                {/* 4. Sleep */}
                <div
                  onClick={() => onOpenVitalDetail('sleep_duration')}
                  className="space-card p-4 cursor-pointer hover:border-cyan-400 transition-all border border-space-800"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium">Daily Sleep Duration</span>
                    <Moon size={14} className="text-indigo-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
                    {sleepValue} <span className="text-xs font-normal text-slate-400 font-mono">hrs</span>
                  </div>
                  <div className="text-[11px] font-mono mt-2 pt-2 border-t border-space-800 flex items-center justify-between">
                    <span className="text-slate-400">Base: {sleepBase} hrs</span>
                    <span className={`font-bold flex items-center gap-0.5 ${sleepVar < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {sleepVar > 0 ? `+${sleepVar}` : sleepVar} hrs
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">Status: REM Cycles Preserved</div>
                </div>
              </div>
            </div>

            {/* Interactive Trend Chart */}
            <div className="space-card p-5 border border-space-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Telemetry Trend History ({chartTimeframe.toUpperCase()} Window)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Personal Baseline Band: Heart Rate & Blood Pressure
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartPoints}>
                    <defs>
                      <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={[50, 140]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B132B', borderColor: '#38BDF8', borderRadius: '8px' }}
                    />
                    <ReferenceLine y={hrBase} stroke="#10B981" strokeDasharray="3 3" label="HR Base" />
                    <Area type="monotone" dataKey="hr" stroke="#38BDF8" strokeWidth={2} fill="url(#hrGrad)" name="Heart Rate (bpm)" />
                    <Area type="monotone" dataKey="bpSys" stroke="#818CF8" strokeWidth={2} fill="none" name="Systolic BP (mmHg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Middle Grid: Overview Stats, Alerts, Food & Water, Exercises */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left 8 cols: Health Overview, Alerts & Reminders */}
              <div className="col-span-8 space-y-6">
                {/* Active Health Alerts */}
                <div className="space-card p-5 border border-space-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-space-800">
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-400" />
                      Active Health Alerts ({alerts.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Dr. ORBIT Anomaly Engine</span>
                  </div>

                  {alerts.length > 0 ? (
                    alerts.slice(0, 2).map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-space-900 border border-space-750 flex items-start justify-between text-xs">
                        <div className="space-y-1">
                          <span className="font-bold text-white block">Alert: {a.metric.toUpperCase()} {a.deviationType}</span>
                          <p className="text-slate-400 text-[11px]">{a.explanation}</p>
                          <span className="text-[10px] text-cyan-400 font-mono block">
                            Protocol: {a.recommendedProtocol}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          a.severity === 'URGENT' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {a.severity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 font-mono text-center">
                      All telemetry streams nominal. Zero active alerts.
                    </div>
                  )}
                </div>

                {/* Medication Reminders & Daily Intake */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="ivory-panel p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                      <span className="text-xs font-bold text-ink-950 uppercase font-mono">Medication Reminders</span>
                      <span className="text-[10px] text-ink-500 font-mono">30d Adherence 90%</span>
                    </div>
                    <div className="space-y-2">
                      {medications.slice(0, 3).map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs py-1">
                          <div>
                            <span className="font-bold text-ink-950 block">{m.name}</span>
                            <span className="text-[10px] text-ink-600">{m.dosage} • {m.frequency}</span>
                          </div>
                          <button
                            onClick={() => onToggleMedication(m.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                              m.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-ink-950 text-white'
                            }`}
                          >
                            {m.takenToday ? 'Taken ✓' : 'Mark Taken'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ivory-panel p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                      <span className="text-xs font-bold text-ink-950 uppercase font-mono">Daily Food & Water</span>
                      <span className="text-[10px] text-ink-500 font-mono">Automated Dispenser</span>
                    </div>
                    <div className="space-y-2 text-xs text-ink-900">
                      <div className="flex justify-between py-1 border-b border-ivory-border/60">
                        <span>Hydration Dispenser:</span>
                        <span className="font-bold font-mono text-cyan-700">{waterDispensedMl} ml / 2500 ml</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-ivory-border/60">
                        <span>Food Pouches Consumed:</span>
                        <span className="font-bold font-mono">{mealLogs.length} pouches logged</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Mood Check-In:</span>
                        <span className="font-bold font-mono text-emerald-700">★ ★ ★ ★ ☆ (4/5)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 4 cols: Circular Progress Rings (Image 2 Replica) */}
              <div className="col-span-4 space-y-4">
                <div className="space-card p-5 text-center space-y-2 border border-space-800">
                  <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                    Medication Adherence
                  </span>
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="38" className="text-space-800" strokeWidth="8" stroke="currentColor" fill="transparent" />
                      <circle cx="48" cy="48" r="38" className="text-cyan-400" strokeWidth="8" strokeDasharray="238" strokeDashoffset="24" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                    </svg>
                    <div className="absolute text-xl font-serif font-bold text-white">90%</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">All Sol 42 morning doses verified.</p>
                </div>

                <div className="space-card p-5 text-center space-y-2 border border-space-800">
                  <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                    Daily Countermeasures (ARED)
                  </span>
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="38" className="text-space-800" strokeWidth="8" stroke="currentColor" fill="transparent" />
                      <circle cx="48" cy="48" r="38" className="text-emerald-400" strokeWidth="8" strokeDasharray="238" strokeDashoffset="95" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                    </svg>
                    <div className="absolute text-xl font-serif font-bold text-white">60%</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">27 of 45 active minutes completed.</p>
                </div>

                <div className="space-card p-5 text-center space-y-2 border border-space-800">
                  <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                    Sleep Recovery Score
                  </span>
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="38" className="text-space-800" strokeWidth="8" stroke="currentColor" fill="transparent" />
                      <circle cx="48" cy="48" r="38" className="text-amber-400" strokeWidth="8" strokeDasharray="238" strokeDashoffset="59" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                    </svg>
                    <div className="absolute text-xl font-serif font-bold text-white">75%</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{sleepValue} hrs rest duration.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: EXPLAINABLE AI HEALTH INSIGHTS */}
        {/* ========================================================= */}
        {activeSideNav === 'insights' && (
          <div className="p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-space-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  EXPLAINABLE AI REASONING ENGINE
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                  Possible cause found from your data trends
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono px-3 py-1 rounded-xl bg-space-900 border border-space-800">
                Non-Diagnostic Health Intelligence
              </span>
            </div>

            {/* Structured 9-Point Explainable AI Box */}
            <div className="space-card p-6 border-l-4 border-l-cyan-400 space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Circadian Sleep Fragmentation & Compensatory Tachycardia Chain
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">1. WHAT WAS DETECTED?</span>
                  <p className="text-slate-300">
                    A sustained 8 bpm elevation in morning resting pulse accompanied by an 8 mmHg systolic blood pressure increase.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">2. WHICH HEALTH MEASUREMENT CHANGED?</span>
                  <p className="text-slate-300">
                    Resting Heart Rate (72 vs 68 bpm baseline) and Systolic Blood Pressure (121 vs 118 mmHg baseline).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">3. HOW IT DIFFERS FROM PERSONAL BASELINE?</span>
                  <p className="text-slate-300">
                    Observed +1.8 standard deviations from Sol 1–35 baseline mean; verified against 28 days of historical data.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">4. WHEN DID THE CHANGE BEGIN?</span>
                  <p className="text-slate-300">
                    Sol 40 (approx. 48 hours ago) immediately following two consecutive fragmented sleep cycles (&lt;6.1 hrs).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">5. RELATED HEALTH INDICATORS:</span>
                  <p className="text-slate-300">
                    Actigraphy sleep fragmentation score (+22%), vocal fatigue acoustic jitter (0.84%), and self-reported morning stress (4/5).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">6. SUPPORTING DATA TRENDS:</span>
                  <p className="text-slate-300">
                    Correlated with cabin noise spike (+4.2 dB from ECLSS air revitalizer cycle) and 16 orbital daylight transitions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">7. POSSIBLE CONTRIBUTING FACTORS:</span>
                  <p className="text-slate-300">
                    Sympathetic nervous system compensation due to cumulative sleep deficit, compounded by cephalic microgravity fluid shift.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-1">
                  <span className="text-cyan-400 font-mono font-bold block text-[11px]">8. WHY AI IDENTIFIED THIS PATTERN?</span>
                  <p className="text-slate-300">
                    Multi-factor causal chain matching: [Sleep Fragmentation] ➔ [Cortisol/Sympathetic Rise] ➔ [Morning Vitals Drift].
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs">
                <span className="text-cyan-300 font-mono font-bold block mb-1">9. RECOMMENDED ACTION FOR ASTRONAUT:</span>
                <p className="text-slate-200 leading-relaxed">
                  Engage 480nm blue-light cutoff in crew sleep quarters 60 mins before bedtime; consume 500ml oral electrolyte solution; pace today's ARED workout to aerobic zone.
                </p>
              </div>
            </div>

            {/* Voice Biomarker Section */}
            <div className="space-card p-6 border border-space-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-space-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Mic size={15} className="text-cyan-400" />
                  Voice Biomarker Acoustic Indicators
                </span>
                <button
                  onClick={onOpenVoiceModal}
                  className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-colors"
                >
                  Record 5-Second Sample
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                  <span className="text-slate-400 text-[10px] block">ACOUSTIC JITTER</span>
                  <span className="text-xl font-serif font-bold text-white">0.84%</span>
                  <span className="text-[10px] text-amber-400 block mt-1">Slight Vocal Cord Stress</span>
                </div>
                <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                  <span className="text-slate-400 text-[10px] block">SHIMMER (AMP VAR)</span>
                  <span className="text-xl font-serif font-bold text-white">2.31%</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">Nominal Range (&lt;3%)</span>
                </div>
                <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                  <span className="text-slate-400 text-[10px] block">RESPIRATION RATE</span>
                  <span className="text-xl font-serif font-bold text-white">15.2 br/m</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">Within Baseline Band</span>
                </div>
                <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-center">
                  <span className="text-slate-400 text-[10px] block">VOCAL FATIGUE INDEX</span>
                  <span className="text-xl font-serif font-bold text-amber-400">38 / 100</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Mild Cognitive Fatigue</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DAILY LOGGING & FOOD POUCH SCANNER */}
        {/* ========================================================= */}
        {activeSideNav === 'log' && (
          <div className="p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-space-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  ASTRONAUT DAILY LOGGING & FLIGHT PANTRY
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                  Food Pouch Scanner & Habit Tracking
                </h2>
              </div>
              {mealConfirmSuccess && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded-xl">
                  <CheckCircle2 size={13} />
                  <span>Meal Logged & Nutritional Intake Updated!</span>
                </span>
              )}
            </div>

            {/* Food Pouch Scanner Widget */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left 6 cols: Pouch Scanner & Meal Details */}
              <div className="col-span-6 space-card p-6 border border-space-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-space-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Food Pouch Scanner
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">NASA Barcode Ready</span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                    Select or Scan Food Pouch Barcode:
                  </label>
                  <select
                    value={scannedBarcode}
                    onChange={(e) => handlePouchScan(e.target.value)}
                    className="w-full bg-space-900 border border-space-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    {SPACE_FOOD_CATALOG.map((item) => (
                      <option key={item.id} value={item.barcode}>
                        [{item.barcode}] {item.name} ({item.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scanned Pouch Nutrition Card */}
                <div className="p-4 rounded-xl bg-space-900 border border-space-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">{selectedPouch.name}</span>
                      <span className="text-[11px] text-slate-400">{selectedPouch.servingSize} • Shelf: {selectedPouch.shelfLife}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-space-700">
                      {selectedPouch.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-2 border-t border-space-800">
                    <div className="p-2 rounded-lg bg-space-950">
                      <span className="text-slate-400 text-[10px] block">CALORIES</span>
                      <span className="font-bold text-white">{selectedPouch.calories} kcal</span>
                    </div>
                    <div className="p-2 rounded-lg bg-space-950">
                      <span className="text-slate-400 text-[10px] block">CARBS</span>
                      <span className="font-bold text-cyan-400">{selectedPouch.carbsG}g</span>
                    </div>
                    <div className="p-2 rounded-lg bg-space-950">
                      <span className="text-slate-400 text-[10px] block">PROTEIN</span>
                      <span className="font-bold text-emerald-400">{selectedPouch.proteinG}g</span>
                    </div>
                    <div className="p-2 rounded-lg bg-space-950">
                      <span className="text-slate-400 text-[10px] block">FAT</span>
                      <span className="font-bold text-amber-400">{selectedPouch.fatG}g</span>
                    </div>
                  </div>
                </div>

                {/* Consumption Percentage & Meal Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">
                      Percentage Eaten:
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setPortionEaten(pct)}
                          className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            portionEaten === pct
                              ? 'bg-cyan-500 text-space-950 shadow-sm'
                              : 'bg-space-900 text-slate-400 hover:text-white border border-space-700'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">
                      Meal Type:
                    </label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as any)}
                      className="w-full bg-space-900 border border-space-700 rounded-xl px-2 py-1.5 text-xs text-white"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="EVA Snack">EVA Snack</option>
                      <option value="Extra Swap">Extra Swap</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleConfirmMeal}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={14} />
                  <span>Confirm & Save Meal Log</span>
                </button>
              </div>

              {/* Right 6 cols: Additional Logging (Water, Nausea, Appetite, Mood, Device) */}
              <div className="col-span-6 space-card p-6 border border-space-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-space-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Additional Physiological Logging
                  </span>
                  {dailyLogSaved && (
                    <span className="text-xs text-emerald-400 font-mono">Saved ✓</span>
                  )}
                </div>

                {/* Water consumption */}
                <div className="p-3.5 rounded-xl bg-space-900 border border-space-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Droplet size={14} className="text-cyan-400" />
                      Connected Water Dispenser
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{waterDispensedMl} ml</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="50"
                      value={manualWaterInput}
                      onChange={(e) => setManualWaterInput(Number(e.target.value))}
                      className="w-24 bg-space-950 border border-space-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => setWaterDispensedMl((w) => w + manualWaterInput)}
                      className="px-3 py-1 rounded-lg bg-space-800 hover:bg-space-700 text-xs text-slate-200 border border-space-700 font-mono"
                    >
                      + Add Manual Sip (ml)
                    </button>
                  </div>
                </div>

                {/* 1-5 Ratings: Appetite & Nausea */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block">Appetite (1-5):</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAppetiteScore(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono ${
                            appetiteScore === num ? 'bg-cyan-500 text-space-950' : 'bg-space-950 text-slate-400 border border-space-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block">Space Nausea (1-5):</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNauseaScore(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono ${
                            nauseaScore === num ? 'bg-amber-500 text-space-950' : 'bg-space-950 text-slate-400 border border-space-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mood Check-In & Exercise Device */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block">Mood Rating (1-5):</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setMoodScore(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono ${
                            moodScore === num ? 'bg-emerald-500 text-space-950' : 'bg-space-950 text-slate-400 border border-space-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-space-900 border border-space-800 space-y-1.5">
                    <span className="font-semibold text-slate-300 block">Countermeasure Device:</span>
                    <select
                      value={resistanceDevice}
                      onChange={(e) => setResistanceDevice(e.target.value as any)}
                      className="w-full bg-space-950 border border-space-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="ARED">ARED (Resistive)</option>
                      <option value="T2 Treadmill">T2 Treadmill</option>
                      <option value="CEVIS Cycle">CEVIS Cycle</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDailyLogSaved(true);
                    setTimeout(() => setDailyLogSaved(false), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-space-800 hover:bg-space-750 text-white font-bold text-xs border border-space-700 transition-colors"
                >
                  Save Daily Habit & Countermeasure Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CARE, MEDS & GROUND SUPPORT SYNC */}
        {/* ========================================================= */}
        {activeSideNav === 'care' && (
          <div className="p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-space-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  CLINICAL PROTOCOL & GROUND HEALTH SYNC
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                  Care Plan, Medication Adherence & Discussion Questions
                </h2>
              </div>
              <button
                onClick={handleSendToGroundSupport}
                disabled={groundSyncPending}
                className="px-4 py-2 rounded-xl bg-accent-blue text-space-950 font-bold text-xs hover:bg-sky-300 transition-all flex items-center gap-2"
              >
                <Send size={14} />
                <span>{groundSyncPending ? 'Transmitting to MCC...' : groundSyncSuccess ? 'Sent to Ground Support ✓' : 'Send to Ground Support'}</span>
              </button>
            </div>

            {/* Medication Adherence Table */}
            <div className="space-card p-6 border border-space-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Prescribed Medication Regimen & Side Effect Monitoring
              </span>
              <table className="w-full text-xs font-sans text-left">
                <thead>
                  <tr className="border-b border-space-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2">Medication</th>
                    <th className="py-2">Dosage</th>
                    <th className="py-2">Timing</th>
                    <th className="py-2">Frequency</th>
                    <th className="py-2">30d Adherence</th>
                    <th className="py-2">Reported Side Effects</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-800">
                  {medications.map((med) => (
                    <tr key={med.id}>
                      <td className="py-2.5 font-bold text-white">{med.name}</td>
                      <td className="py-2.5 font-mono text-slate-300">{med.dosage}</td>
                      <td className="py-2.5 text-slate-300">{med.timeOfDay}</td>
                      <td className="py-2.5 text-slate-300">{med.frequency}</td>
                      <td className="py-2.5 font-mono font-bold text-emerald-400">{med.adherenceRatePct}%</td>
                      <td className="py-2.5 text-slate-400">{med.sideEffectsWarning || 'None reported'}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onToggleMedication(med.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                            med.takenToday ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700' : 'bg-space-800 text-slate-200'
                          }`}
                        >
                          {med.takenToday ? 'Verified ✓' : 'Verify Dose'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Discussion Questions for Clinician Review */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-card p-5 border border-space-800 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                  Questions for Next Clinician Review
                </span>
                <div className="space-y-2">
                  {discussionQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-space-900 border border-space-750 text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold font-mono">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type discussion question for doctor..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="flex-1 bg-space-900 border border-space-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl bg-space-800 hover:bg-space-700 text-xs text-slate-200 font-bold border border-space-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Digital Clinician Sign-Off Card */}
              <div className="space-card p-5 border border-space-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-space-800">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Digital Clinician Sign-Off
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                    SIGNED & VERIFIED
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  <div><strong>Reviewing Clinician:</strong> Dr. Rajesh Mehta, MD (Lead Doctor)</div>
                  <div><strong>Review Timestamp:</strong> Sol 41 • 14:00 GMT</div>
                  <div><strong>Digital Signature Hash:</strong> 8F92-NASA-MED-AUTH-SEC</div>
                  <div className="p-2.5 rounded-lg bg-space-900 border border-space-800 text-[11px] text-slate-400">
                    "Astronaut Asha Sharma cardiovascular parameters remain well compensated. Continue ARED resistance regimen. Next review in 7 days."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: RADIATION & DOSIMETRY */}
        {/* ========================================================= */}
        {activeSideNav === 'radiation' && (
          <div className="p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-space-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  SPACE ENVIRONMENTAL DOSIMETRY
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                  Ionizing Space Radiation Exposure & SPE Alerts
                </h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800 font-bold">
                Solar Status: {radiationData.solarActivityStatus}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-card p-4 border border-space-800 text-center">
                <span className="text-slate-400 text-xs block font-mono">CURRENT DOSE RATE</span>
                <span className="text-3xl font-serif font-bold text-white">{radiationData.currentRateMicroSvPerHour}</span>
                <span className="text-xs text-slate-400 block font-mono">μSv / hour</span>
              </div>
              <div className="space-card p-4 border border-space-800 text-center">
                <span className="text-slate-400 text-xs block font-mono">DAILY ACCUMULATED</span>
                <span className="text-3xl font-serif font-bold text-cyan-400">{radiationData.dailyAccumulatedMilliSv}</span>
                <span className="text-xs text-slate-400 block font-mono">mSv / day (Limit: 1.0)</span>
              </div>
              <div className="space-card p-4 border border-space-800 text-center">
                <span className="text-slate-400 text-xs block font-mono">MISSION CUMULATIVE</span>
                <span className="text-3xl font-serif font-bold text-white">{radiationData.missionCumulativeMilliSv}</span>
                <span className="text-xs text-slate-400 block font-mono">mSv (Sol 1–42)</span>
              </div>
              <div className="space-card p-4 border border-space-800 text-center">
                <span className="text-slate-400 text-xs block font-mono">CAREER LIMIT MARGIN</span>
                <span className="text-3xl font-serif font-bold text-emerald-400">
                  {((radiationData.missionCumulativeMilliSv / radiationData.careerLimitMilliSv) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 block font-mono">of 600 mSv NASA limit</span>
              </div>
            </div>

            {/* Dosimeter Hourly Trend */}
            <div className="space-card p-5 border border-space-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Active Dosimeter Readouts (Last 24 Hours)
              </span>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radiationData.dosimeterReadings}>
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} domain={[0, 25]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#38BDF8', borderRadius: '8px' }} />
                    <ReferenceLine y={20} stroke="#EF4444" strokeDasharray="3 3" label="Threshold Warning" />
                    <Bar dataKey="rateUSvH" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Dose Rate (μSv/h)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DATA PRIVACY & EMERGENCY OVERRIDE */}
        {/* ========================================================= */}
        {activeSideNav === 'privacy' && (
          <div className="p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-space-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  ASTRONAUT DATA ACCESS & SECURITY
                </span>
                <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                  Authorized Personnel Permissions & Emergency Override Log
                </h2>
              </div>
              <button
                onClick={handleTriggerEmergencyOverride}
                className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Unlock size={14} />
                <span>Simulate Medical Emergency Override</span>
              </button>
            </div>

            {/* Permissions Table */}
            <div className="space-card p-6 border border-space-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Authorized Personnel Permission Matrix
              </span>
              <table className="w-full text-xs font-sans text-left">
                <thead>
                  <tr className="border-b border-space-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2">Accessor Identity</th>
                    <th className="py-2">Unit / Agency</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Current Permission</th>
                    <th className="py-2">Last Access</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-800">
                  {permissions.map((perm) => (
                    <tr key={perm.id}>
                      <td className="py-2.5">
                        <span className="font-bold text-white block">{perm.accessorName}</span>
                        <span className="text-[10px] text-slate-400">{perm.accessorRole}</span>
                      </td>
                      <td className="py-2.5 text-slate-300">{perm.agencyOrUnit}</td>
                      <td className="py-2.5 font-mono text-cyan-400">{perm.category}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          perm.accessLevel === 'Revoked' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {perm.accessLevel}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 font-mono">{perm.lastAccessed}</td>
                      <td className="py-2.5 text-right">
                        {perm.revocable ? (
                          <button
                            onClick={() => handleTogglePermission(perm.id)}
                            className="px-2.5 py-1 rounded-lg bg-space-800 hover:bg-space-700 text-[10px] font-mono text-slate-200 border border-space-700"
                          >
                            {perm.accessLevel === 'Revoked' ? 'Restore' : 'Revoke'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Flight Rule Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency Override Audit Log */}
            <div className="space-card p-6 border border-space-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block flex items-center gap-2">
                <Shield size={14} className="text-red-400" />
                Auditable Emergency Access Logs
              </span>
              <div className="space-y-2">
                {emergencyLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-space-900 border border-space-800 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white">{log.accessorIdentity}</span>
                      <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">Reason: <span className="text-slate-200">{log.reason}</span></div>
                    <div className="text-cyan-400 text-[10px]">Data Scope: {log.dataAccessed}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
