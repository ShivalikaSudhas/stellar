import React, { useState } from 'react';
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
import { Menu, X, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

  const renderActiveView = () => {
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
            onRecalculate={() => {
              // Baselines are automatically recalculated reactively
            }}
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
    <div className="flex h-screen overflow-hidden bg-space-950 text-slate-100">
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

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
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

        {/* Global Operational Header */}
        <Header
          currentAstronaut={currentAstronaut}
          astronauts={astronauts}
          onSelectAstronaut={setSelectedAstronautId}
          isOnline={isOnline}
          lastMeasurementTime={latestReading?.timestamp}
          totalAlertsCount={unacknowledgedAlerts.length}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
