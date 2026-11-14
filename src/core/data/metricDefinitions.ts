import { MetricDefinition, MetricType } from '@/types';

export const METRIC_DEFINITIONS: Record<MetricType, MetricDefinition> = {
  heart_rate: {
    type: 'heart_rate',
    label: 'Resting Heart Rate',
    shortLabel: 'Pulse',
    unit: 'bpm',
    displayFormat: (val: number) => `${Math.round(val)} bpm`,
    defaultNominalRange: [55, 85],
    description: 'Resting pulse rate measured continuously from connected sensor or smart wearable.',
    iconName: 'Activity'
  },
  blood_pressure_sys: {
    type: 'blood_pressure_sys',
    label: 'Systolic Blood Pressure',
    shortLabel: 'BP Sys',
    unit: 'mmHg',
    displayFormat: (val: number) => `${Math.round(val)} mmHg`,
    defaultNominalRange: [110, 125],
    description: 'Arterial pressure during heart contraction phase.',
    iconName: 'Gauge'
  },
  blood_pressure_dia: {
    type: 'blood_pressure_dia',
    label: 'Diastolic Blood Pressure',
    shortLabel: 'BP Dia',
    unit: 'mmHg',
    displayFormat: (val: number) => `${Math.round(val)} mmHg`,
    defaultNominalRange: [70, 85],
    description: 'Arterial pressure when the heart rests between beats.',
    iconName: 'Gauge'
  },
  glucose: {
    type: 'glucose',
    label: 'Blood Glucose',
    shortLabel: 'Glucose',
    unit: 'mg/dL',
    displayFormat: (val: number) => `${Math.round(val)} mg/dL`,
    defaultNominalRange: [80, 130],
    description: 'Fasting and post-prandial blood sugar level.',
    iconName: 'Droplet'
  },
  spo2: {
    type: 'spo2',
    label: 'Oxygen Saturation',
    shortLabel: 'SpO2',
    unit: '%',
    displayFormat: (val: number) => `${val.toFixed(1)}%`,
    defaultNominalRange: [95, 100],
    description: 'Peripheral blood oxygen saturation measured via pulse oximeter.',
    iconName: 'Wind'
  },
  sleep_duration: {
    type: 'sleep_duration',
    label: 'Sleep Duration',
    shortLabel: 'Sleep',
    unit: 'hours',
    displayFormat: (val: number) => `${val.toFixed(1)} h`,
    defaultNominalRange: [7.0, 8.5],
    description: 'Tracked nocturnal sleep duration and circadian rest cycle.',
    iconName: 'Moon'
  },
  activity: {
    type: 'activity',
    label: 'Daily Activity / Exercise',
    shortLabel: 'Active',
    unit: 'mins',
    displayFormat: (val: number) => `${Math.round(val)} min`,
    defaultNominalRange: [30, 90],
    description: 'Moderate-to-vigorous physical movement and daily cardiovascular exercise.',
    iconName: 'Zap'
  },
  weight: {
    type: 'weight',
    label: 'Body Weight',
    shortLabel: 'Weight',
    unit: 'kg',
    displayFormat: (val: number) => `${val.toFixed(1)} kg`,
    defaultNominalRange: [60, 80],
    description: 'Tracked body mass for longitudinal health trend analysis.',
    iconName: 'Scale'
  },
  temperature: {
    type: 'temperature',
    label: 'Body Temperature',
    shortLabel: 'Temp',
    unit: '°C',
    displayFormat: (val: number) => `${val.toFixed(1)} °C`,
    defaultNominalRange: [36.1, 37.2],
    description: 'Core body temperature monitoring for fever or circadian rhythm shift.',
    iconName: 'Thermometer'
  },
  fatigue: {
    type: 'fatigue',
    label: 'Fatigue Score',
    shortLabel: 'Fatigue',
    unit: 'scale_1_10',
    displayFormat: (val: number) => `${val.toFixed(1)} / 10`,
    defaultNominalRange: [1, 4],
    description: 'Subjective fatigue index derived from psychomotor self-report.',
    iconName: 'BatteryLow'
  },
  stress: {
    type: 'stress',
    label: 'Stress / Cognitive Load',
    shortLabel: 'Stress',
    unit: 'scale_1_10',
    displayFormat: (val: number) => `${val.toFixed(1)} / 10`,
    defaultNominalRange: [1, 4],
    description: 'Self-reported subjective cognitive stress and daily workload load.',
    iconName: 'Brain'
  },
  core_temp: {
    type: 'core_temp',
    label: 'Core Temperature',
    shortLabel: 'Core Temp',
    unit: '°C',
    displayFormat: (val: number) => `${val.toFixed(2)} °C`,
    defaultNominalRange: [36.4, 37.5],
    description: 'Thermoregulatory body temperature monitoring.',
    iconName: 'Thermometer'
  }
};
