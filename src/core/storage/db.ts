import Dexie, { Table } from 'dexie';
import {
  HealthReading,
  HealthBaseline,
  HealthAlert,
  WellnessCheckIn,
  SimulationSession,
  AlertRuleConfig,
  UserProfile,
  Medication,
  CarePlan,
  FamilyCircleMember,
  DataAccessAuditEntry,
  DoctorFeedbackNote,
  FoodPhotoLog,
  NotificationItem,
  EmergencyContact
} from '@/types';

export interface AstronautLegacy {
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

export class StellarDatabase extends Dexie {
  astronauts!: Table<AstronautLegacy, string>;
  readings!: Table<HealthReading, string>;
  baselines!: Table<HealthBaseline, string>;
  alerts!: Table<HealthAlert, string>;
  wellness!: Table<WellnessCheckIn, string>;
  simulations!: Table<SimulationSession, string>;
  alertRules!: Table<AlertRuleConfig, string>;
  
  // New tables for Health Monitoring Suite
  users!: Table<UserProfile, string>;
  medications!: Table<Medication, string>;
  carePlans!: Table<CarePlan, string>;
  familyCircle!: Table<FamilyCircleMember, string>;
  auditLogs!: Table<DataAccessAuditEntry, string>;
  doctorNotes!: Table<DoctorFeedbackNote, string>;
  foodLogs!: Table<FoodPhotoLog, string>;
  notifications!: Table<NotificationItem, string>;

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

    this.version(2).stores({
      astronauts: 'id, missionId, name',
      readings: 'id, astronautId, metric, timestamp, [astronautId+metric], [astronautId+metric+timestamp], source, quality',
      baselines: 'id, astronautId, metric, [astronautId+metric], calculatedAt, confidenceStatus',
      alerts: 'id, astronautId, metric, severity, timestamp, [astronautId+metric], acknowledged, ruleId',
      wellness: 'id, astronautId, timestamp',
      simulations: 'id, scenario, status',
      alertRules: 'id, metric, enabled',
      users: 'id, role, name, email',
      medications: 'id, name, timeOfDay, takenToday',
      carePlans: 'id, patientId, doctorName',
      familyCircle: 'id, privacyTier',
      auditLogs: 'id, timestamp, accessorRole',
      doctorNotes: 'id, patientId, read',
      foodLogs: 'id, timestamp',
      notifications: 'id, type, read, timestamp'
    });
  }
}

export const db = new StellarDatabase();

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'NASA Mission Control (MCC Houston)',
    relationship: 'Flight Operations Director',
    phone: 'Freq 2287.5 MHz (S-Band)',
    isPrimary: true,
    notifyOnCritical: true
  },
  {
    id: 'em-2',
    name: 'Dr. Rajesh Mehta, MD',
    relationship: 'Lead Attending Doctor',
    phone: 'Channel BME-1 (Direct Telemetry)',
    isPrimary: false,
    notifyOnCritical: true
  },
  {
    id: 'em-3',
    name: 'Station Commander (Habitat Intercom)',
    relationship: 'Onboard Mission Lead',
    phone: 'Internal Loop Alpha',
    isPrimary: false,
    notifyOnCritical: true
  }
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-asha',
    name: 'Asha Sharma',
    email: 'asha.sharma@nasa.gov',
    role: 'patient',
    age: 42,
    gender: 'Female',
    callsign: 'VALKYRIE',
    missionId: 'ARTEMIS-VII',
    bloodType: 'B+',
    selectedLanguage: 'en',
    elderlyMode: false,
    lowCostMode: false,
    emergencyContacts: DEFAULT_EMERGENCY_CONTACTS,
    doctorName: 'Dr. Rajesh Mehta, MD',
    hospitalAffiliation: 'NASA Johnson Space Center • Flight Medicine Division'
  },
  {
    id: 'user-dr-mehta',
    name: 'Dr. Rajesh Mehta, MD',
    email: 'dr.mehta@nasa.gov',
    role: 'doctor',
    age: 49,
    gender: 'Male',
    selectedLanguage: 'en',
    elderlyMode: false,
    lowCostMode: false,
    emergencyContacts: DEFAULT_EMERGENCY_CONTACTS,
    hospitalAffiliation: 'NASA Mission Health Operations'
  }
];

export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Telmisartan (Micardis)',
    dosage: '40 mg',
    frequency: 'Once Daily',
    timeOfDay: 'Morning',
    purpose: 'Blood Pressure regulation & arterial protection',
    takenToday: true,
    adherenceRatePct: 96,
    sideEffectsWarning: 'Mild morning dizziness if taken on empty stomach'
  },
  {
    id: 'med-2',
    name: 'Atorvastatin (Lipitor)',
    dosage: '10 mg',
    frequency: 'Once Daily',
    timeOfDay: 'Evening',
    purpose: 'Cholesterol & vascular endothelial health',
    takenToday: false,
    adherenceRatePct: 92,
    sideEffectsWarning: 'Report any unexplained muscle soreness'
  },
  {
    id: 'med-3',
    name: 'Omega-3 CoQ10',
    dosage: '1000 mg',
    frequency: 'Once Daily',
    timeOfDay: 'Morning',
    purpose: 'Cardiovascular cellular energy & microcirculation',
    takenToday: true,
    adherenceRatePct: 100
  }
];

export const DEFAULT_CARE_PLAN: CarePlan = {
  id: 'careplan-asha',
  patientId: 'user-asha',
  doctorName: 'Dr. Rajesh Mehta, MD',
  hospital: 'Metro Heart Institute',
  dietPlan: [
    'Target sodium intake under 1,800 mg/day (DASH Protocol)',
    'Hydration baseline: 2.2 Liters of water daily',
    'Limit caffeine after 3:00 PM to protect sleep latency'
  ],
  exercisePrescription: [
    '30 minutes brisk walking 5 days/week (target heart rate 105-120 bpm)',
    'Low-impact resistance band mobility 2x/week',
    'Post-dinner 10-minute light stroll for glucose flattening'
  ],
  medications: DEFAULT_MEDICATIONS,
  clinicalTargets: [
    { metric: 'Resting Blood Pressure', target: '< 125 / 80 mmHg' },
    { metric: 'Resting Heart Rate', target: '60 - 75 bpm' },
    { metric: 'Fasting Blood Glucose', target: '80 - 110 mg/dL' }
  ],
  doctorNotes: 'Asha is responding very well to the Telmisartan adjustment. Noticeable improvement in morning resting pressure. Keep monitoring sleep quality.',
  lastUpdated: '2026-11-12T14:30:00.000Z'
};

export const DEFAULT_FAMILY_MEMBERS: FamilyCircleMember[] = [
  {
    id: 'fam-1',
    name: 'NASA Mission Control (MCC Houston)',
    relation: 'Flight Operations Directorate',
    privacyTier: 'full',
    phone: 'S-Band Loop 1',
    lastActive: 'Active now'
  },
  {
    id: 'fam-2',
    name: 'Commander Marcus Vance',
    relation: 'Mission Commander (Onboard)',
    privacyTier: 'full',
    phone: 'Intercom Loop Alpha',
    lastActive: '5 mins ago'
  },
  {
    id: 'fam-3',
    name: 'Dr. Rajesh Mehta, MD',
    relation: 'Lead Attending Doctor',
    privacyTier: 'emergency',
    phone: 'Channel BME-1',
    lastActive: 'Active now'
  }
];

export const DEFAULT_AUDIT_LOGS: DataAccessAuditEntry[] = [
  {
    id: 'audit-1',
    accessorName: 'Dr. Rajesh Mehta, MD',
    accessorRole: 'Lead Attending Doctor',
    organization: 'NASA Mission Health Directorate',
    purpose: 'Routine in-flight cardiovascular telemetry review',
    timestamp: '2026-11-14T08:15:00.000Z',
    scope: 'Full Vitals & Protocol Adherence History',
    status: 'active'
  },
  {
    id: 'audit-2',
    accessorName: 'NASA Mission Telemetry Gateway',
    accessorRole: 'Flight Operations Health Console',
    organization: 'NASA JSC Flight Ops',
    purpose: 'Autonomous telemetry packet verification & ECLSS sync',
    timestamp: '2026-11-14T07:45:00.000Z',
    scope: 'Real-time Vitals & Anomaly Stream',
    status: 'active'
  },
  {
    id: 'audit-3',
    accessorName: 'Mission Biological Telemetry Hub',
    accessorRole: 'Biomedical Telemetry Relay',
    organization: 'Spaceflight Health Monitoring System',
    purpose: 'Offline baseline verification & trend calibration',
    timestamp: '2026-11-10T12:00:00.000Z',
    scope: 'Longitudinal baseline calculations',
    status: 'active'
  }
];

export const DEFAULT_DOCTOR_NOTES: DoctorFeedbackNote[] = [
  {
    id: 'note-1',
    patientId: 'user-asha',
    doctorName: 'Dr. Rajesh Mehta',
    title: 'Great BP control this week',
    message: 'Hello Asha, I reviewed your 7-day average blood pressure (121/79 mmHg). It is right within our target zone. Your sleep duration improved to 7.2 hours. Keep up the post-dinner walking habit!',
    timestamp: '2026-11-13T11:20:00.000Z',
    read: false
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'medication',
    title: 'Evening Medication Reminder',
    message: 'Time for Atorvastatin (10 mg) with a glass of water.',
    timestamp: '2026-11-14T20:00:00.000Z',
    read: false,
    priority: 'normal'
  },
  {
    id: 'notif-2',
    type: 'doctor',
    title: 'New Note from Dr. Rajesh Mehta',
    message: 'Your cardiologist sent feedback on your 7-day blood pressure trend.',
    timestamp: '2026-11-13T11:20:00.000Z',
    read: false,
    priority: 'normal'
  },
  {
    id: 'notif-3',
    type: 'habit',
    title: 'Daily Micro-Habit Completed!',
    message: 'You completed your 5-minute post-lunch walk. 4-day streak active!',
    timestamp: '2026-11-14T14:10:00.000Z',
    read: true,
    priority: 'normal'
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
    id: 'rule-bp-sys-elevation',
    metric: 'blood_pressure_sys',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 5,
    enabled: true,
    description: 'Triggers when systolic blood pressure exceeds personal baseline bounds.'
  },
  {
    id: 'rule-glucose-spike',
    metric: 'glucose',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 5,
    enabled: true,
    description: 'Detects significant post-prandial glycemic excursions.'
  },
  {
    id: 'rule-spo2-desaturation',
    metric: 'spo2',
    warningStdDevThreshold: 1.5,
    urgentStdDevThreshold: 2.5,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 7,
    enabled: true,
    description: 'Triggers when blood oxygen saturation drops below individual baseline.'
  },
  {
    id: 'rule-sleep-deficit',
    metric: 'sleep_duration',
    warningStdDevThreshold: 1.2,
    urgentStdDevThreshold: 2.0,
    sustainedReadingCount: 2,
    minSamplesForBaseline: 5,
    enabled: true,
    description: 'Triggers on acute or persistent sleep duration reduction compared to baseline.'
  }
];

export const DEFAULT_ASTRONAUTS: AstronautLegacy[] = [
  {
    id: 'user-asha',
    name: 'Asha Sharma',
    callsign: 'Asha',
    role: 'Patient (Primary Profile)',
    missionId: 'HEALTH-CARE',
    missionElapsedDays: 42,
    createdAt: '2026-09-01T00:00:00.000Z',
    avatarUrl: '/avatars/asha.png'
  },
  {
    id: 'astro-01',
    name: 'Dr. Evelyn Vance',
    callsign: 'Valkyrie',
    role: 'Flight Commander / Engineer',
    missionId: 'ARTEMIS-VII',
    missionElapsedDays: 84,
    createdAt: '2026-08-20T00:00:00.000Z',
    avatarUrl: '/avatars/astro-1.png'
  }
];

export async function initializeDatabase() {
  const usersCount = await db.users.count();
  if (usersCount === 0) {
    await db.users.bulkAdd(DEFAULT_USERS);
  }

  const astroCount = await db.astronauts.count();
  if (astroCount === 0) {
    await db.astronauts.bulkAdd(DEFAULT_ASTRONAUTS);
  }

  const rulesCount = await db.alertRules.count();
  if (rulesCount === 0) {
    await db.alertRules.bulkAdd(DEFAULT_ALERT_RULES);
  }

  const medsCount = await db.medications.count();
  if (medsCount === 0) {
    await db.medications.bulkAdd(DEFAULT_MEDICATIONS);
  }

  const carePlanCount = await db.carePlans.count();
  if (carePlanCount === 0) {
    await db.carePlans.add(DEFAULT_CARE_PLAN);
  }

  const famCount = await db.familyCircle.count();
  if (famCount === 0) {
    await db.familyCircle.bulkAdd(DEFAULT_FAMILY_MEMBERS);
  }

  const auditCount = await db.auditLogs.count();
  if (auditCount === 0) {
    await db.auditLogs.bulkAdd(DEFAULT_AUDIT_LOGS);
  }

  const notesCount = await db.doctorNotes.count();
  if (notesCount === 0) {
    await db.doctorNotes.bulkAdd(DEFAULT_DOCTOR_NOTES);
  }

  const notifCount = await db.notifications.count();
  if (notifCount === 0) {
    await db.notifications.bulkAdd(DEFAULT_NOTIFICATIONS);
  }
}
