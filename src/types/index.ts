export type MetricType =
  | 'heart_rate'
  | 'blood_pressure_sys'
  | 'blood_pressure_dia'
  | 'glucose'
  | 'spo2'
  | 'sleep_duration'
  | 'activity'
  | 'weight'
  | 'temperature'
  | 'fatigue'
  | 'stress'
  | 'core_temp';

export type MetricUnit =
  | 'bpm'
  | 'mmHg'
  | 'mg/dL'
  | '%'
  | 'hours'
  | 'mins'
  | 'kg'
  | '°C'
  | 'scale_1_10'
  | 'scale_1_5';

export type QualityStatus = 'nominal' | 'degraded' | 'unreliable' | 'synthetic';

export type SeverityLevel = 'INFO' | 'WARNING' | 'URGENT';

export type DataSource =
  | 'sensor'
  | 'imported_csv'
  | 'imported_json'
  | 'simulated'
  | 'manual_entry'
  | 'camera_rppg'
  | 'voice_biomarker';

export type UserRole = 'patient' | 'doctor';

export type LanguageCode = 'en' | 'hi' | 'es' | 'ta' | 'te';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  notifyOnCritical: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  age: number;
  gender: string;
  callsign?: string;
  missionId?: string;
  bloodType?: string;
  selectedLanguage: LanguageCode;
  elderlyMode: boolean;
  lowCostMode: boolean;
  emergencyContacts: EmergencyContact[];
  doctorName?: string;
  hospitalAffiliation?: string;
}

export interface Astronaut {
  id: string;
  name: string;
  callsign: string;
  role: string;
  missionId: string;
  missionElapsedDays: number;
  avatarUrl?: string;
  createdAt?: string;
  baselineProfileId?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
}

export interface HealthReading {
  id: string;
  astronautId: string; // patientId / user identifier
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
  deviation: number;
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

// ----------------------------------------------------
// NEW SPECIFICATION INTERFACES
// ----------------------------------------------------

export interface CauseAndEffectInsight {
  id: string;
  title: string;
  cause: string;
  effect: string;
  confidenceScore: number; // 0 to 100
  timeframe: string;
  explanation: string;
  actionableNudge: string;
  severity: 'info' | 'warning' | 'positive';
  icon: string;
}

export interface EnvironmentalData {
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy';
  pollenLevel: 'Low' | 'Moderate' | 'High';
  temperatureC: number;
  humidityPct: number;
  altitudeM: number;
  healthImplication: string;
}

export interface JustInTimeNudge {
  id: string;
  title: string;
  message: string;
  category: 'hydration' | 'breathing' | 'movement' | 'medication' | 'sleep';
  actionLabel: string;
  completed: boolean;
  timestamp: string;
}

export interface MicroHabit {
  id: string;
  title: string;
  description: string;
  streakDays: number;
  targetDaily: string;
  completedToday: boolean;
  impactMetric: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  purpose: string;
  takenToday: boolean;
  adherenceRatePct: number;
  sideEffectsWarning?: string;
}

export interface MedicationSideEffectReport {
  id: string;
  medicationId: string;
  medicationName: string;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  timestamp: string;
  notes?: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  doctorName: string;
  hospital: string;
  dietPlan: string[];
  exercisePrescription: string[];
  medications: Medication[];
  clinicalTargets: { metric: string; target: string }[];
  doctorNotes: string;
  lastUpdated: string;
}

export type PrivacyTier = 'full' | 'summary' | 'emergency';

export interface FamilyCircleMember {
  id: string;
  name: string;
  relation: string;
  avatarUrl?: string;
  privacyTier: PrivacyTier;
  phone: string;
  lastActive: string;
}

export interface DataAccessAuditEntry {
  id: string;
  accessorName: string;
  accessorRole: string;
  organization: string;
  purpose: string;
  timestamp: string;
  scope: string;
  status: 'active' | 'revoked';
}

export interface VoiceBiomarkerResult {
  id: string;
  timestamp: string;
  jitterPct: number;
  shimmerPct: number;
  vocalFatigueScore: number; // 1-10
  stressIndex: number; // 1-10
  respiratoryRateEstimate: number;
  statusDescription: string;
}

export interface FoodPhotoLog {
  id: string;
  timestamp: string;
  photoUrl: string;
  mealName: string;
  estimatedCalories: number;
  estimatedCarbsG: number;
  estimatedProteinG: number;
  glucoseSpikeRisk: 'Low' | 'Moderate' | 'High';
  insight: string;
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: 'high' | 'moderate' | 'stable';
  primaryCondition: string;
  lastSystolicBP: number;
  lastDiastolicBP: number;
  lastHeartRate: number;
  adherenceRate: number;
  unacknowledgedAlerts: number;
  lastUpdated: string;
  callsign?: string;
  missionId?: string;
  bloodType?: string;
  spo2?: number;
  baselineHeartRate?: number;
  baselineSystolicBP?: number;
  baselineDiastolicBP?: number;
  baselineSpo2?: number;
  baselineSleepHours?: number;
  lastSleepHours?: number;
  sleepDebtHours?: number;
  caloriesPlanned?: number;
  caloriesConsumed?: number;
  waterConsumedMl?: number;
  waterTargetMl?: number;
  radiationDailyMilliSv?: number;
  radiationCumulativeMilliSv?: number;
  exerciseAredMinutes?: number;
  exerciseT2Minutes?: number;
  moodRating?: number;
  nauseaRating?: number;
  urgencyRationale?: string;
  hasActiveSos?: boolean;
  sosDetails?: {
    timestamp: string;
    pulse: number;
    bp: string;
    spo2: number;
    acknowledged: boolean;
    acknowledgedAt?: string;
    backupEscalationSeconds?: number;
  };
}

export interface DoctorFeedbackNote {
  id: string;
  patientId: string;
  doctorName: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  reviewDate?: string;
  digitalSignature?: string;
  credentials?: string;
  status?: 'Sent to Crew Terminal' | 'Acknowledged by Astronaut';
}

export interface NotificationItem {
  id: string;
  type: 'medication' | 'alert' | 'doctor' | 'habit' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'urgent';
}

export interface RadiationData {
  currentRateMicroSvPerHour: number; // e.g. 18.5 uSv/h
  dailyAccumulatedMilliSv: number;    // e.g. 0.44 mSv/day
  missionCumulativeMilliSv: number;   // e.g. 19.8 mSv
  careerLimitMilliSv: number;         // e.g. 600 mSv (NASA lifetime limit)
  thresholdWarningMilliSvPerDay: number; // 1.0 mSv/day
  thresholdCriticalMilliSvPerDay: number; // 2.5 mSv/day (SPE - Solar Particle Event)
  solarActivityStatus: 'Quiet' | 'Moderate Flare Warning' | 'Active SPE Alert';
  dosimeterReadings: { time: string; rateUSvH: number }[];
}

export interface FoodPouchItem {
  id: string;
  barcode: string;
  name: string;
  category: 'Entree' | 'Vegetable' | 'Dessert' | 'Rehydratable Drink' | 'Fresh Ration';
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  sodiumMg: number;
  shelfLife: string;
  servingSize: string;
}

export interface MealLogEntry {
  id: string;
  timestamp: string;
  astronautId: string;
  pouchBarcode: string;
  itemName: string;
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  portionEatenPct: number; // 25, 50, 75, 100
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'EVA Snack' | 'Extra Swap';
  plannedVsActual: 'Planned' | 'Unplanned Swap' | 'Extra';
  confirmed: boolean;
}

export interface DailyAstronautWellnessLog {
  id: string;
  timestamp: string;
  astronautId: string;
  waterDispenserMl: number;
  waterManualMl: number;
  appetiteRating: number; // 1-5
  nauseaRating: number;   // 1-5 (space motion adaptation)
  moodRating: number;     // 1-5
  exerciseCompletedMin: number;
  resistanceDeviceUsed: 'ARED' | 'T2 Treadmill' | 'CEVIS Cycle' | 'None';
  voiceAcousticNotes?: string;
}

export interface PrivacyPermissionEntry {
  id: string;
  accessorName: string;
  accessorRole: string;
  agencyOrUnit: string;
  category: 'Flight Surgery' | 'Biomedical Engineering' | 'Command Team' | 'Research Study';
  accessLevel: 'Full Real-time' | 'Aggregated Daily Summary' | 'Emergency Only' | 'Revoked';
  lastAccessed: string;
  revocable: boolean;
}

export interface EmergencyAccessLog {
  id: string;
  timestamp: string;
  accessorIdentity: string;
  reason: string;
  patientId: string;
  dataAccessed: string;
}

export interface ClinicianReviewSession {
  id: string;
  reviewDate: string;
  clinicianName: string;
  clinicianRole: string;
  status: 'Pending' | 'Completed & Signed' | 'Transmitted to Ground';
  clinicalNotes: string;
  instructions: string;
  digitalSignature?: string;
  signedAt?: string;
  discussionQuestions: { id: string; question: string; answered: boolean }[];
}
