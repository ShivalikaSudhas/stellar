import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, DEFAULT_USERS, DEFAULT_MEDICATIONS, DEFAULT_CARE_PLAN } from '@/core/storage/db';
import { useStellarData } from '@/hooks/useStellarData';
import { Navbar, NavigationTab } from '@/components/layout/Navbar';
import { Header } from '@/components/layout/Header';
import { MissionOverviewPage } from '@/features/mission-overview/MissionOverviewPage';
import { HealthAnalyticsPage } from '@/features/analytics/HealthAnalyticsPage';
import { PersonalBaselinesPage } from '@/features/baselines/PersonalBaselinesPage';
import { AlertsPage } from '@/features/alerts/AlertsPage';
import { WellnessPage } from '@/features/wellness/WellnessPage';
import { SimulatorPage } from '@/features/simulator/SimulatorPage';
import { DataImportPage } from '@/features/imports/DataImportPage';
import { MissionReportsPage } from '@/features/reports/MissionReportsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AboutPage } from '@/features/about/AboutPage';

// Specialized Perspectives & Layouts
import { MobilePhoneView } from '@/components/layout/MobilePhoneView';
import { LaptopDashboardView } from '@/components/layout/LaptopDashboardView';
import { DoctorView } from '@/features/doctor/DoctorView';

// Interactive Drilldown Modals
import { VitalHistoryModal } from '@/components/common/VitalHistoryModal';
import { VoiceBiomarkerModal } from '@/components/features/VoiceBiomarkerModal';
import { CameraVitalsModal } from '@/components/features/CameraVitalsModal';
import { FoodPhotoModal } from '@/components/features/FoodPhotoModal';
import { EmergencySosModal } from '@/components/features/EmergencySosModal';
import { DoctorSummaryModal } from '@/components/features/DoctorSummaryModal';
import { LogVitalModal } from '@/components/features/LogVitalModal';

import { discoverCauseAndEffectInsights } from '@/core/analysis/causeAndEffectEngine';
import { MetricType, HealthReading, DoctorFeedbackNote } from '@/types';
import {
  Menu,
  X,
  ShieldAlert,
  Smartphone,
  Laptop,
  Activity,
  Stethoscope,
  Plus,
  FileText,
  AlertTriangle
} from 'lucide-react';

export type MasterViewMode = 'mobile' | 'laptop' | 'nasa' | 'doctor';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<MasterViewMode>('mobile');
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modal active states
  const [selectedVitalModal, setSelectedVitalModal] = useState<MetricType | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showDoctorSummaryModal, setShowDoctorSummaryModal] = useState(false);
  const [showLogVitalModal, setShowLogVitalModal] = useState(false);

  const {
    isDbReady,
    isOnline,
    astronauts,
    currentAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    readings,
    alerts,
    wellness,
    baselines,
    alertRules,
    isSimulating,
    setIsSimulating,
    simulationScenario,
    setSimulationScenario,
    simulationStep,
    simulationSpeedMs,
    setSimulationSpeedMs,
    acknowledgeAlert,
    addWellnessCheckIn,
    addReadings,
    resetAstronautData,
    clearAllData
  } = useStellarData();

  // Dexie live queries for extended suite
  const medications = useLiveQuery(() => db.medications.toArray(), [], DEFAULT_MEDICATIONS);
  const carePlan = useLiveQuery(() => db.carePlans.toCollection().first(), [], DEFAULT_CARE_PLAN);
  const foodLogs = useLiveQuery(() => db.foodLogs.toArray(), [], []);

  // Primary user profile
  const primaryUserProfile = useMemo(() => {
    return {
      ...DEFAULT_USERS[0],
      name: currentAstronaut.name || 'Asha Sharma',
      id: selectedAstronautId
    };
  }, [currentAstronaut, selectedAstronautId]);

  // Dynamic Cause-and-Effect Discovery
  const causeAndEffectInsights = useMemo(() => {
    return discoverCauseAndEffectInsights(readings, wellness, foodLogs || []);
  }, [readings, wellness, foodLogs]);

  // Medication adherence toggle
  const handleToggleMedication = async (medId: string) => {
    const med = await db.medications.get(medId);
    if (med) {
      await db.medications.update(medId, { takenToday: !med.takenToday });
    }
  };

  // Doctor feedback sender
  const handleSendDoctorFeedback = async (
    note: Omit<DoctorFeedbackNote, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNote: DoctorFeedbackNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    await db.doctorNotes.add(newNote);
  };

  // Save manual vital readings
  const handleSaveManualReadings = async (newReadings: HealthReading[]) => {
    await db.readings.bulkAdd(newReadings);
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-space-950 flex flex-col items-center justify-center text-cyan-accent font-mono p-4">
        <ShieldAlert size={48} className="animate-pulse mb-4 text-cyan-accent" />
        <div className="text-lg font-bold tracking-widest text-white">STELLAR INITIALIZING</div>
        <div className="text-xs text-space-400 mt-2">Connecting to local IndexedDB storage...</div>
      </div>
    );
  }

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : undefined;
  const currentHeartRate = readings.filter((r) => r.metric === 'heart_rate').slice(-1)[0]?.value || 72;

  // NASA Space Apps operational tabs
  const renderNasaOperationalView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <MissionOverviewPage
            astronaut={currentAstronaut}
            readings={readings}
            baselines={baselines}
            alerts={alerts}
            wellness={wellness}
            onAcknowledgeAlert={acknowledgeAlert}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'analytics':
        return (
          <HealthAnalyticsPage
            readings={readings}
            baselines={baselines}
            selectedMetricInitial="heart_rate"
          />
        );
      case 'baselines':
        return (
          <PersonalBaselinesPage
            astronaut={currentAstronaut}
            readings={readings}
            baselines={baselines}
            onRecalculate={() => {}}
          />
        );
      case 'alerts':
        return (
          <AlertsPage
            alerts={alerts}
            onAcknowledgeAlert={acknowledgeAlert}
          />
        );
      case 'wellness':
        return (
          <WellnessPage
            wellnessHistory={wellness}
            onSubmitCheckIn={addWellnessCheckIn}
          />
        );
      case 'simulator':
        return (
          <SimulatorPage
            isSimulating={isSimulating}
            onToggleSimulate={() => setIsSimulating(!isSimulating)}
            simulationScenario={simulationScenario}
            onSelectScenario={setSimulationScenario}
            simulationStep={simulationStep}
            simulationSpeedMs={simulationSpeedMs}
            onChangeSpeed={setSimulationSpeedMs}
            onResetData={() => resetAstronautData(selectedAstronautId)}
            astronautName={currentAstronaut.name}
          />
        );
      case 'import':
        return (
          <DataImportPage
            onImportValidReadings={addReadings}
            currentAstronautId={selectedAstronautId}
          />
        );
      case 'reports':
        return (
          <MissionReportsPage
            astronaut={currentAstronaut}
            readings={readings}
            baselines={baselines}
            alerts={alerts}
            wellness={wellness}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            currentAstronaut={currentAstronaut}
            alertRules={alertRules}
            isOnline={isOnline}
            onClearAllData={clearAllData}
            onResetAstronaut={() => resetAstronautData(selectedAstronautId)}
          />
        );
      case 'about':
        return <AboutPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-space-950 text-slate-100 font-sans">
      {/* ========================================================= */}
      {/* GLOBAL MASTER PERSPECTIVE SWITCHER BAR */}
      {/* ========================================================= */}
      <div className="h-12 bg-space-900 border-b border-space-800 px-4 flex items-center justify-between text-xs z-30 select-none flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {/* Dr. ORBIT Official Logo & Title */}
          <div className="flex items-center gap-2 mr-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-space-800 to-space-950 border border-accent-blue/40 flex items-center justify-center p-1 shadow-glow-blue flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="32" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
                <path d="M35 42C38 38 46 38 50 42C54 46 62 45 65 42C67 49 60 55 54 55C48 55 45 61 38 61C33 61 32 50 35 42Z" fill="#0284c7" opacity="0.6" />
                <ellipse cx="50" cy="50" rx="44" ry="16" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-25 50 50)" />
                <rect x="46" y="38" width="8" height="24" rx="2" fill="#ef4444" />
                <rect x="38" y="46" width="24" height="8" rx="2" fill="#ef4444" />
                <path d="M42 66C42 72 58 72 58 66" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="74" r="3" fill="#f8fafc" />
              </svg>
            </div>
            <span className="font-serif font-bold text-white text-sm tracking-wide hidden sm:inline">Dr. ORBIT</span>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hidden xl:inline">
            INTERFACE:
          </span>

          <div className="flex items-center bg-space-950 p-1 rounded-xl border border-space-800 gap-1">
            <button
              onClick={() => setViewMode('laptop')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all text-xs ${
                viewMode === 'laptop'
                  ? 'bg-white text-space-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop size={13} />
              <span>Laptop Dashboard (Astronaut)</span>
            </button>

            <button
              onClick={() => setViewMode('doctor')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all text-xs ${
                viewMode === 'doctor'
                  ? 'bg-white text-space-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope size={13} />
              <span>Doctor Console</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all text-xs ${
                viewMode === 'mobile'
                  ? 'bg-white text-space-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Mobile Phone</span>
            </button>

            <button
              onClick={() => setViewMode('nasa')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all text-xs ${
                viewMode === 'nasa'
                  ? 'bg-white text-space-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={13} />
              <span className="hidden md:inline">Mission Telemetry</span>
            </button>
          </div>
        </div>

        {/* Master Quick Trigger Modals */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowLogVitalModal(true)}
            className="px-2.5 py-1 rounded-lg bg-space-850 hover:bg-space-800 text-slate-200 border border-space-700 text-[11px] font-medium flex items-center gap-1"
          >
            <Plus size={12} />
            <span className="hidden sm:inline">Log Vital</span>
          </button>

          <button
            onClick={() => setShowDoctorSummaryModal(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <FileText size={12} />
            <span className="hidden sm:inline">1-Page Doctor Brief</span>
          </button>

          <button
            onClick={() => setShowSosModal(true)}
            className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <AlertTriangle size={12} />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT CONTAINER */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-hidden flex">
        {/* VIEW MODE 1: MOBILE PHONE EXPERIENCE (Matching Image 1 & 3) */}
        {viewMode === 'mobile' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-space-950">
            <MobilePhoneView
              userProfile={primaryUserProfile}
              readings={readings}
              baselines={baselines}
              alerts={alerts}
              wellness={wellness}
              medications={medications}
              carePlan={carePlan || DEFAULT_CARE_PLAN}
              onOpenVitalDetail={(m) => setSelectedVitalModal(m)}
              onOpenVoiceModal={() => setShowVoiceModal(true)}
              onOpenCameraModal={() => setShowCameraModal(true)}
              onOpenFoodModal={() => setShowFoodModal(true)}
              onOpenSosModal={() => setShowSosModal(true)}
              onOpenDoctorSummary={() => setShowDoctorSummaryModal(true)}
              onToggleMedication={handleToggleMedication}
            />
          </div>
        )}

        {/* VIEW MODE 2: LAPTOP / DESKTOP DASHBOARD (Matching Image 2) */}
        {viewMode === 'laptop' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-space-950">
            <div className="max-w-7xl mx-auto">
              <LaptopDashboardView
                userProfile={primaryUserProfile}
                readings={readings}
                baselines={baselines}
                alerts={alerts}
                wellness={wellness}
                medications={medications}
                carePlan={carePlan || DEFAULT_CARE_PLAN}
                insights={causeAndEffectInsights}
                onOpenVitalDetail={(m) => setSelectedVitalModal(m)}
                onOpenVoiceModal={() => setShowVoiceModal(true)}
                onOpenCameraModal={() => setShowCameraModal(true)}
                onOpenFoodModal={() => setShowFoodModal(true)}
                onOpenSosModal={() => setShowSosModal(true)}
                onOpenDoctorSummary={() => setShowDoctorSummaryModal(true)}
                onToggleMedication={handleToggleMedication}
                onNavigateToTab={(tab) => {
                  if (tab === 'vitals') setSelectedVitalModal('heart_rate');
                  if (tab === 'careplan') setViewMode('mobile');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE 3: DOCTOR CONSOLE */}
        {viewMode === 'doctor' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-space-950">
            <DoctorView
              onSendFeedbackNote={handleSendDoctorFeedback}
              patientReadings={readings}
              onTriggerSos={() => setShowSosModal(true)}
            />
          </div>
        )}

        {/* VIEW MODE 4: NASA MISSION CONTROL (Original Operational Suite) */}
        {viewMode === 'nasa' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-shrink-0">
              <Navbar
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
                unacknowledgedAlertCount={unacknowledgedAlerts.length}
                isSimulating={isSimulating}
              />
            </div>

            {/* Mobile Sidebar Drawer */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm">
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-space-900">
                  <div className="absolute top-0 right-0 p-2">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-space-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <Navbar
                    activeTab={activeTab}
                    onSelectTab={(tab) => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    unacknowledgedAlertCount={unacknowledgedAlerts.length}
                    isSimulating={isSimulating}
                  />
                </div>
              </div>
            )}

            {/* NASA Telemetry View */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="md:hidden h-14 bg-space-900 border-b border-space-700 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-1.5 rounded-lg bg-space-800 text-space-300 hover:text-white"
                  >
                    <Menu size={20} />
                  </button>
                  <span className="font-bold tracking-widest text-white text-sm">STELLAR</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30">
                  {currentAstronaut.callsign}
                </span>
              </div>

              <Header
                currentAstronaut={currentAstronaut}
                astronauts={astronauts}
                onSelectAstronaut={setSelectedAstronautId}
                isOnline={isOnline}
                lastMeasurementTime={latestReading?.timestamp}
                totalAlertsCount={unacknowledgedAlerts.length}
              />

              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {renderNasaOperationalView()}
              </main>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE DRILLDOWN MODALS */}
      {/* ========================================================= */}
      {selectedVitalModal && (
        <VitalHistoryModal
          metric={selectedVitalModal}
          currentValue={
            readings.filter((r) => r.metric === selectedVitalModal).slice(-1)[0]?.value || 72
          }
          readings={readings}
          baseline={baselines[selectedVitalModal]}
          onClose={() => setSelectedVitalModal(null)}
        />
      )}

      {showVoiceModal && (
        <VoiceBiomarkerModal
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {showCameraModal && (
        <CameraVitalsModal
          onClose={() => setShowCameraModal(false)}
        />
      )}

      {showFoodModal && (
        <FoodPhotoModal
          onClose={() => setShowFoodModal(false)}
        />
      )}

      {showSosModal && (
        <EmergencySosModal
          contacts={primaryUserProfile.emergencyContacts}
          currentHeartRate={currentHeartRate}
          onClose={() => setShowSosModal(false)}
        />
      )}

      {showDoctorSummaryModal && (
        <DoctorSummaryModal
          patientName={primaryUserProfile.name}
          patientAge={primaryUserProfile.age}
          doctorName={primaryUserProfile.doctorName || 'Dr. Rajesh Mehta, MD'}
          medications={medications}
          baselines={baselines}
          latestReadings={readings}
          onClose={() => setShowDoctorSummaryModal(false)}
        />
      )}

      {showLogVitalModal && (
        <LogVitalModal
          patientId={selectedAstronautId}
          onSaveReadings={handleSaveManualReadings}
          onClose={() => setShowLogVitalModal(false)}
        />
      )}
    </div>
  );
};
