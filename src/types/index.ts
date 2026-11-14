export type MetricType =
  | 'heart_rate'
  | 'spo2'
  | 'sleep_duration'
  | 'activity'
  | 'fatigue'
  | 'stress'
  | 'core_temp';

export type MetricUnit = 'bpm' | '%' | 'hours' | 'mins' | 'scale_1_10' | 'scale_1_5' | '°C';

export type QualityStatus = 'nominal' | 'degraded' | 'unreliable' | 'synthetic';

export type SeverityLevel = 'INFO' | 'WARNING' | 'URGENT';

export type DataSource =
  | 'sensor'
  | 'imported_csv'
  | 'imported_json'
  | 'simulated'
  | 'manual_entry';

export interface Astronaut {
  id: string;
  name: string;
  callsign: string;
  role: string;
  missionId: string;
  missionElapsedDays: number;
  baselineProfileId?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface HealthReading {
  id: string;
  astronautId: string;
  metric: MetricType;
  value: number;
  unit: string;
  timestamp: string; // ISO 8601
  source: DataSource;
  quality: QualityStatus;
  deviceId?: string;
  notes?: string;
}

export interface HealthBaseline {
  id: string;
  astronautId: string;
  metric: MetricType;
  referenceMean: number;
  referenceMedian: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
  sampleCount: number;
  referencePeriodStart: string;
  referencePeriodEnd: string;
  calculatedAt: string;
  confidenceStatus: 'reliable' | 'provisional' | 'insufficient_data';
  requiredSampleCount: number;
}

export interface HealthAlert {
  id: string;
  astronautId: string;
  metric: MetricType;
  severity: SeverityLevel;
  observedValue: number;
  baselineValue: number;
  deviation: number; // percentage or absolute difference
  deviationType: 'elevated' | 'depressed' | 'sustained_shift' | 'rapid_fluctuation';
  durationHours?: number;
  consecutiveReadings: number;
  explanation: string;
  contributingFactors: string[];
  ruleId: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  recommendedProtocol: string;
  dataQuality: QualityStatus;
}

export interface WellnessCheckIn {
  id: string;
  astronautId: string;
  timestamp: string;
  sleepQuality: number; // 1 to 5
  fatigue: number; // 1 to 10
  stress: number; // 1 to 10
  mood: number; // 1 to 5
  discomfort: number; // 1 to 10
  discomfortLocation?: string;
  notes?: string;
  source: DataSource;
}

export type SimulationScenario = 'normal' | 'sleep_disruption' | 'unusual_trend';

export interface SimulationSession {
  id: string;
  scenario: SimulationScenario;
  status: 'idle' | 'running' | 'paused' | 'completed';
  startedAt: string;
  endedAt?: string;
  stepIndex: number;
  totalSteps: number;
  intervalMs: number;
}

export interface AlertRuleConfig {
  id: string;
  metric: MetricType;
  warningStdDevThreshold: number;
  urgentStdDevThreshold: number;
  sustainedReadingCount: number;
  minSamplesForBaseline: number;
  enabled: boolean;
  description: string;
}

export interface MetricDefinition {
  type: MetricType;
  label: string;
  shortLabel: string;
  unit: string;
  displayFormat: (val: number) => string;
  defaultNominalRange: [number, number];
  description: string;
  iconName: string;
}
