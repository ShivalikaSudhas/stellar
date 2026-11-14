import Dexie, { Table } from 'dexie';
import {
  Astronaut,
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  SimulationSession,
  AlertRuleConfig
} from '@/types';

export class StellarDatabase extends Dexie {
  astronauts!: Table<Astronaut, string>;
  readings!: Table<HealthReading, string>;
  baselines!: Table<HealthBaseline, string>;
  alerts!: Table<HealthAlert, string>;
  wellness!: Table<WellnessCheckIn, string>;
  simulations!: Table<SimulationSession, string>;
  alertRules!: Table<AlertRuleConfig, string>;

  constructor() {
    super('StellarAstronautHealthDB');
    this.version(1).stores({
      astronauts: 'id, missionId, name',
      readings: 'id, astronautId, metric, timestamp, [astronautId+metric], [astronautId+metric+timestamp], source, quality',
      baselines: 'id, astronautId, metric, [astronautId+metric], calculatedAt, confidenceStatus',
      alerts: 'id, astronautId, metric, severity, timestamp, [astronautId+metric], acknowledged, ruleId',
      wellness: 'id, astronautId, timestamp',
      simulations: 'id, scenario, status',
      alertRules: 'id, metric, enabled'
    });
  }
}

export const db = new StellarDatabase();

export const DEFAULT_ASTRONAUTS: Astronaut[] = [
  {
    id: 'astro-01',
    name: 'Dr. Evelyn Vance',
    callsign: 'Valkyrie',
    role: 'Commander / Flight Engineer',
    missionId: 'ARTEMIS-VII',
    missionElapsedDays: 84,
    createdAt: '2026-08-20T00:00:00.000Z',
    avatarUrl: '/avatars/astro-1.png'
  },
  {
    id: 'astro-02',
    name: 'Marcus Chen',
    callsign: 'Apex',
    role: 'Payload Specialist / Astrobiologist',
    missionId: 'ARTEMIS-VII',
    missionElapsedDays: 84,
    createdAt: '2026-08-20T00:00:00.000Z',
    avatarUrl: '/avatars/astro-2.png'
  },
  {
    id: 'astro-03',
    name: 'Elena Rostova',
    callsign: 'Mirage',
    role: 'Systems Pilot / EVA Specialist',
    missionId: 'ARTEMIS-VII',
    missionElapsedDays: 84,
    createdAt: '2026-08-20T00:00:00.000Z',
    avatarUrl: '/avatars/astro-3.png'
  }
];

export const DEFAULT_ALERT_RULES: AlertRuleConfig[] = [
  {
    id: 'rule-hr-sustained-elevated',
    metric: 'heart_rate',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 3,
    minSamplesForBaseline: 7,
    enabled: true,
    description: 'Triggers when resting heart rate deviates by >1.5σ (Warning) or >2.5σ (Urgent) across consecutive readings.'
  },
  {
    id: 'rule-spo2-desaturation',
    metric: 'spo2',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 7,
    enabled: true,
    description: 'Triggers when arterial blood oxygen saturation drops significantly below individual baseline.'
  },
  {
    id: 'rule-sleep-deficit',
    metric: 'sleep_duration',
    warningStdDevThreshold: 1.2,
    urgentStdDevThreshold: 2.0,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 5,
    enabled: true,
    description: 'Triggers on acute or persistent circadian sleep duration reduction compared to crew baseline.'
  },
  {
    id: 'rule-activity-decline',
    metric: 'activity',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 3,
    minSamplesForBaseline: 7,
    enabled: true,
    description: 'Flags reduced physical countermeasure compliance, risking microgravity musculoskeletal deconditioning.'
  },
  {
    id: 'rule-fatigue-elevation',
    metric: 'fatigue',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 5,
    enabled: true,
    description: 'Detects subjective psychomotor fatigue elevation above standard personal recovery norms.'
  }
];

export async function initializeDatabase() {
  const count = await db.astronauts.count();
  if (count === 0) {
    await db.astronauts.bulkAdd(DEFAULT_ASTRONAUTS);
  }

  const rulesCount = await db.alertRules.count();
  if (rulesCount === 0) {
    await db.alertRules.bulkAdd(DEFAULT_ALERT_RULES);
  }
}
