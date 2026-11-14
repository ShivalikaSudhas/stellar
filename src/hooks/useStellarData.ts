import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, DEFAULT_ASTRONAUTS } from '@/core/storage/db';
import {
  HealthReading,
  HealthBaseline,
  WellnessCheckIn,
  MetricType,
  SimulationScenario
} from '@/types';
import { calculateAllPersonalBaselines } from '@/core/analysis/baselineEngine';
import { evaluateAlerts } from '@/core/alerts/alertEngine';
import {
  generateHistoricalBaselineDataset,
  generateScenarioStep
} from '@/core/simulator/syntheticDataGenerator';

export function useStellarData() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<string>('astro-01');
  const [isDbReady, setIsDbReady] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('normal');
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationSpeedMs, setSimulationSpeedMs] = useState(3000);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize DB tables and seed if empty
  useEffect(() => {
    initializeDatabase().then(() => {
      setIsDbReady(true);
    });
  }, []);

  // Live queries from Dexie
  const astronauts = useLiveQuery(() => db.astronauts.toArray(), [], DEFAULT_ASTRONAUTS);
  
  const allReadings = useLiveQuery(
    () => db.readings.where('astronautId').equals(selectedAstronautId).sortBy('timestamp'),
    [selectedAstronautId],
    []
  );

  const allAlerts = useLiveQuery(
    () => db.alerts.where('astronautId').equals(selectedAstronautId).reverse().sortBy('timestamp'),
    [selectedAstronautId],
    []
  );

  const allWellness = useLiveQuery(
    () => db.wellness.where('astronautId').equals(selectedAstronautId).reverse().sortBy('timestamp'),
    [selectedAstronautId],
    []
  );

  const alertRules = useLiveQuery(() => db.alertRules.toArray(), [], []);

  // Current selected astronaut
  const currentAstronaut = useMemo(() => {
    return astronauts.find((a) => a.id === selectedAstronautId) || astronauts[0] || DEFAULT_ASTRONAUTS[0];
  }, [astronauts, selectedAstronautId]);

  // Dynamically calculate baselines for the selected astronaut
  const baselines = useMemo<Record<MetricType, HealthBaseline>>(() => {
    return calculateAllPersonalBaselines(selectedAstronautId, allReadings || []);
  }, [selectedAstronautId, allReadings]);

  // Re-evaluate alerts whenever readings or rules update
  useEffect(() => {
    if (!allReadings || allReadings.length === 0 || !alertRules || alertRules.length === 0) return;

    const newAlerts = evaluateAlerts({
      astronautId: selectedAstronautId,
      readings: allReadings,
      baselines,
      rules: alertRules,
      existingAlerts: allAlerts || []
    });

    if (newAlerts.length > 0) {
      db.alerts.bulkAdd(newAlerts).catch(console.error);
    }
  }, [allReadings, baselines, alertRules, selectedAstronautId, allAlerts]);

  // Seed initial baseline dataset if selected astronaut has no readings
  const seedAstronautBaseline = useCallback(async (astroId: string) => {
    const existing = await db.readings.where('astronautId').equals(astroId).count();
    if (existing === 0) {
      const { readings, wellness } = generateHistoricalBaselineDataset(astroId, 14);
      await db.readings.bulkAdd(readings);
      await db.wellness.bulkAdd(wellness);
    }
  }, []);

  useEffect(() => {
    if (isDbReady && selectedAstronautId) {
      seedAstronautBaseline(selectedAstronautId);
    }
  }, [isDbReady, selectedAstronautId, seedAstronautBaseline]);

  // Simulation execution loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(async () => {
      const stepData = generateScenarioStep(
        selectedAstronautId,
        simulationScenario,
        simulationStep
      );

      await db.readings.bulkAdd(stepData.readings);
      if (stepData.wellness) {
        await db.wellness.add(stepData.wellness);
      }

      setSimulationStep((prev) => prev + 1);
    }, simulationSpeedMs);

    return () => clearInterval(interval);
  }, [isSimulating, selectedAstronautId, simulationScenario, simulationStep, simulationSpeedMs]);

  // Actions
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    await db.alerts.update(alertId, {
      acknowledged: true,
      acknowledgedAt: new Date().toISOString()
    });
  }, []);

  const addWellnessCheckIn = useCallback(async (entry: Omit<WellnessCheckIn, 'id' | 'astronautId' | 'timestamp'>) => {
    const newEntry: WellnessCheckIn = {
      id: `well-${selectedAstronautId}-${Date.now()}`,
      astronautId: selectedAstronautId,
      timestamp: new Date().toISOString(),
      ...entry
    };
    await db.wellness.add(newEntry);

    // Also record fatigue and stress as telemetry readings for analytics
    const time = newEntry.timestamp;
    await db.readings.bulkAdd([
      {
        id: `reading-fatigue-${Date.now()}`,
        astronautId: selectedAstronautId,
        metric: 'fatigue',
        value: entry.fatigue,
        unit: 'scale_1_10',
        timestamp: time,
        source: 'manual_entry',
        quality: 'nominal',
        notes: entry.notes
      },
      {
        id: `reading-stress-${Date.now() + 1}`,
        astronautId: selectedAstronautId,
        metric: 'stress',
        value: entry.stress,
        unit: 'scale_1_10',
        timestamp: time,
        source: 'manual_entry',
        quality: 'nominal',
        notes: entry.notes
      }
    ]);
  }, [selectedAstronautId]);

  const addReadings = useCallback(async (readings: HealthReading[]) => {
    await db.readings.bulkAdd(readings);
  }, []);

  const resetAstronautData = useCallback(async (astroId: string) => {
    await db.readings.where('astronautId').equals(astroId).delete();
    await db.alerts.where('astronautId').equals(astroId).delete();
    await db.wellness.where('astronautId').equals(astroId).delete();
    setIsSimulating(false);
    setSimulationStep(0);
    // Re-seed clean nominal baseline
    const { readings, wellness } = generateHistoricalBaselineDataset(astroId, 14);
    await db.readings.bulkAdd(readings);
    await db.wellness.bulkAdd(wellness);
  }, []);

  const clearAllData = useCallback(async () => {
    await db.readings.clear();
    await db.alerts.clear();
    await db.wellness.clear();
    setIsSimulating(false);
    setSimulationStep(0);
    for (const a of DEFAULT_ASTRONAUTS) {
      const { readings, wellness } = generateHistoricalBaselineDataset(a.id, 14);
      await db.readings.bulkAdd(readings);
      await db.wellness.bulkAdd(wellness);
    }
  }, []);

  return {
    isDbReady,
    isOnline,
    astronauts,
    currentAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    readings: allReadings || [],
    alerts: allAlerts || [],
    wellness: allWellness || [],
    baselines,
    alertRules,
    // Simulator
    isSimulating,
    setIsSimulating,
    simulationScenario,
    setSimulationScenario,
    simulationStep,
    setSimulationStep,
    simulationSpeedMs,
    setSimulationSpeedMs,
    // Actions
    acknowledgeAlert,
    addWellnessCheckIn,
    addReadings,
    resetAstronautData,
    clearAllData
  };
}
