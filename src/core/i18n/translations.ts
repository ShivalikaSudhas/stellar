import { LanguageCode } from '@/types';

export interface TranslationDictionary {
  greeting: (name: string) => string;
  subGreeting: string;
  heartRate: string;
  bloodPressure: string;
  glucose: string;
  oxygen: string;
  sleep: string;
  activity: string;
  normal: string;
  warning: string;
  alert: string;
  yourVitals: string;
  baselineNormal: string;
  causeAndEffect: string;
  microHabit: string;
  carePlan: string;
  doctorSummary: string;
  familyCircle: string;
  emergencySos: string;
  elderlyMode: string;
  lowCostMode: string;
  today: string;
  insights: string;
  log: string;
  care: string;
  privacy: string;
  doctorView: string;
  caregiverView: string;
  patientView: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    greeting: (name: string) => `Good morning, ${name}.`,
    subGreeting: 'Grab your coffee and take it slow. Your blood pressure is a little above your own normal today, and everything else looks steady.',
    heartRate: 'Heart rate',
    bloodPressure: 'Blood pressure',
    glucose: 'Blood glucose',
    oxygen: 'Oxygen saturation',
    sleep: 'Sleep duration',
    activity: 'Daily exercise',
    normal: 'Normal',
    warning: 'Mildly Elevated',
    alert: 'Needs Attention',
    yourVitals: 'Your vitals',
    baselineNormal: 'Relative to your personal baseline',
    causeAndEffect: 'Cause & Effect Discovery',
    microHabit: 'Micro-Habit Coaching',
    carePlan: 'Doctor Care Plan',
    doctorSummary: '1-Page Doctor Summary',
    familyCircle: 'Family Privacy Circle',
    emergencySos: 'Emergency SOS',
    elderlyMode: 'Elderly Mode (Large Text)',
    lowCostMode: 'Low-Cost Phone Mode',
    today: 'Today',
    insights: 'Insights',
    log: 'Log',
    care: 'Care',
    privacy: 'Privacy',
    doctorView: 'Doctor View',
    caregiverView: 'Caregiver View',
    patientView: 'Patient View'
  },
  hi: {
    greeting: (name: string) => `नमस्ते, ${name} जी।`,
    subGreeting: 'अपनी चाय या कॉफ़ी लें और आराम से शुरुआत करें। आपका रक्तचाप आज आपके सामान्य स्तर से थोड़ा अधिक है, बाकी सभी संकेत पूरी तरह स्थिर हैं।',
    heartRate: 'हृदय गति (पल्स)',
    bloodPressure: 'रक्तचाप (बीपी)',
    glucose: 'रक्त शर्करा (शुगर)',
    oxygen: 'ऑक्सीजन का स्तर',
    sleep: 'नींद की अवधि',
    activity: 'दैनिक व्यायाम',
    normal: 'सामान्य',
    warning: 'हल्का सा बढ़ा हुआ',
    alert: 'ध्यान देने की आवश्यकता',
    yourVitals: 'आपके स्वास्थ्य संकेत',
    baselineNormal: 'आपके व्यक्तिगत सामान्य स्तर के अनुसार',
    causeAndEffect: 'कारण और प्रभाव खोज',
    microHabit: 'दैनिक छोटी अच्छी आदत',
    carePlan: 'डॉक्टर की देखभाल योजना',
    doctorSummary: 'डॉक्टर हेतु 1-पेज सारांश',
    familyCircle: 'पारिवारिक घेरा',
    emergencySos: 'आपातकालीन एसओएस',
    elderlyMode: 'बुजुर्ग मोड (बड़ा टेक्स्ट)',
    lowCostMode: 'सरल फोन मोड',
    today: 'आज',
    insights: 'विश्लेषण',
    log: 'दर्ज करें',
    care: 'देखभाल',
    privacy: 'गोपनीयता',
    doctorView: 'डॉक्टर दृश्य',
    caregiverView: 'देखभालकर्ता दृश्य',
    patientView: 'मरीज दृश्य'
  },
  es: {
    greeting: (name: string) => `Buenos días, ${name}.`,
    subGreeting: 'Toma tu café con calma. Tu presión arterial está un poco por encima de tu normal hoy, pero todo lo demás está estable.',
    heartRate: 'Frecuencia cardíaca',
    bloodPressure: 'Presión arterial',
    glucose: 'Glucosa en sangre',
    oxygen: 'Saturación de oxígeno',
    sleep: 'Duración del sueño',
    activity: 'Actividad física',
    normal: 'Normal',
    warning: 'Ligeramente elevado',
    alert: 'Requiere atención',
    yourVitals: 'Tus signos vitales',
    baselineNormal: 'Comparado con tu rango habitual',
    causeAndEffect: 'Descubrimiento de causas y efectos',
    microHabit: 'Micro-hábito diario',
    carePlan: 'Plan de cuidados médicos',
    doctorSummary: 'Resumen médico en 1 página',
    familyCircle: 'Círculo familiar de privacidad',
    emergencySos: 'SOS de Emergencia',
    elderlyMode: 'Modo Mayores (Texto grande)',
    lowCostMode: 'Modo Teléfono Básico',
    today: 'Hoy',
    insights: 'Perspectivas',
    log: 'Registrar',
    care: 'Cuidados',
    privacy: 'Privacidad',
    doctorView: 'Vista Médico',
    caregiverView: 'Vista Cuidador',
    patientView: 'Vista Paciente'
  },
  ta: {
    greeting: (name: string) => `காலை வணக்கம், ${name}.`,
    subGreeting: 'காபியை அருந்திவிட்டு அமைதியாக தொடங்குங்கள். உங்கள் ரத்த அழுத்தம் உங்கள் இயல்பான அளவை விட சற்று அதிகமாக உள்ளது, மற்றவை சீராக உள்ளன.',
    heartRate: 'இதயத் துடிப்பு',
    bloodPressure: 'ரத்த அழுத்தம்',
    glucose: 'ரத்த சர்க்கரை',
    oxygen: 'ஆக்சிஜன் அளவு',
    sleep: 'தூக்க நேரம்',
    activity: 'உடற்பயிற்சி',
    normal: 'இயல்பானது',
    warning: 'சற்று அதிகம்',
    alert: 'கவனம் தேவை',
    yourVitals: 'உங்கள் முக்கிய அளவீடுகள்',
    baselineNormal: 'உங்கள் தனிப்பட்ட இயல்புடன் ஒப்பிடுகையில்',
    causeAndEffect: 'காரணம் மற்றும் விளைவு',
    microHabit: 'தினசரி பழக்கவழக்கம்',
    carePlan: 'மருத்துவர் பராமரிப்புத் திட்டம்',
    doctorSummary: 'மருத்துவர் சுருக்கம் (1 பக்கம்)',
    familyCircle: 'குடும்ப வட்டம்',
    emergencySos: 'அவசர உதவி SOS',
    elderlyMode: 'முதியோர் பயன்முறை (பெரிய எழுத்துகள்)',
    lowCostMode: 'எளிய தொலைபேசி முறை',
    today: 'இன்று',
    insights: 'ஆய்வு',
    log: 'பதிவு',
    care: 'பராமரிப்பு',
    privacy: 'தனியுரிமை',
    doctorView: 'மருத்துவர் பார்வை',
    caregiverView: 'பராமரிப்பாளர் பார்வை',
    patientView: 'நோயாளி பார்வை'
  },
  te: {
    greeting: (name: string) => `శుభోదయం, ${name} గారు.`,
    subGreeting: 'కాఫీ తాగి ప్రశాంతంగా రోజును ప్రారంభించండి. మీ రక్తపోటు ఈరోజు సాధారణం కంటే కొద్దిగా ఎక్కువగా ఉంది, మిగతావన్నీ నిలకడగా ఉన్నాయి.',
    heartRate: 'గుండె వేగం',
    bloodPressure: 'రక్తపోటు (బీపీ)',
    glucose: 'రక్తంలో చక్కెర',
    oxygen: 'ఆక్సిజన్ శాతం',
    sleep: 'నిద్ర సమయం',
    activity: 'వ్యాయామం',
    normal: 'సాధారణం',
    warning: 'కొద్దిగా ఎక్కువ',
    alert: 'జాగ్రత్త అవసరం',
    yourVitals: 'మీ ఆరోగ్య కొలతలు',
    baselineNormal: 'మీ వ్యక్తిగత సాధారణ స్థాయి ప్రకారం',
    causeAndEffect: 'కారణం - ప్రభావం విశ్లేషణ',
    microHabit: 'రోజువారీ మంచి అలవాటు',
    carePlan: 'వైద్యుల సంరక్షణ ప్రణాళిక',
    doctorSummary: 'డాక్టర్ సమ్మరీ (1 పేజీ)',
    familyCircle: 'కుటుంబ భద్రత వలయం',
    emergencySos: 'అత్యవసర SOS',
    elderlyMode: 'పెద్దల మోడ్ (పెద్ద అక్షరాలు)',
    lowCostMode: 'తక్కువ డేటా మోడ్',
    today: 'ఈరోజు',
    insights: 'అంతర్దృష్టులు',
    log: 'నమోదు',
    care: 'సంరక్షణ',
    privacy: 'గోప్యత',
    doctorView: 'డాక్టర్ వీక్షణ',
    caregiverView: 'సంరక్షకుల వీక్షణ',
    patientView: 'రోగి వీక్షణ'
  }
};
