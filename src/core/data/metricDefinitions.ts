import { MetricDefinition, MetricType } from '@/types';

export const METRIC_DEFINITIONS: Record<MetricType, MetricDefinition> = {
  heart_rate: {
    type: 'heart_rate',
    label: 'Resting Heart Rate',
    shortLabel: 'RHR',
    unit: 'bpm',
    displayFormat: (val: number) => `${Math.round(val)} bpm`,
    defaultNominalRange: [55, 85],
    description: 'Autonomous resting cardiovascular rate measured during inactive or pre-sleep periods.',
    iconName: 'Activity'
  },
  spo2: {
    type: 'spo2',
    label: 'Blood Oxygen Saturation',
    shortLabel: 'SpO2',
    unit: '%',
    displayFormat: (val: number) => `${val.toFixed(1)}%`,
    defaultNominalRange: [95, 100],
    description: 'Peripheral arterial oxygen saturation via pulse oximetry under cabin atmosphere.',
    iconName: 'Droplet'
  },
  sleep_duration: {
    type: 'sleep_duration',
    label: 'Sleep Duration',
    shortLabel: 'Sleep',
    unit: 'hours',
    displayFormat: (val: number) => `${val.toFixed(1)} h`,
    defaultNominalRange: [6.5, 8.5],
    description: 'Actigraphy or PSG measured sleep duration per 24-hour crew circadian cycle.',
    iconName: 'Moon'
  },
  activity: {
    type: 'activity',
    label: 'Countermeasure Exercise',
    shortLabel: 'Exercise',
    unit: 'mins',
    displayFormat: (val: number) => `${Math.round(val)} min`,
    defaultNominalRange: [60, 150],
    description: 'Daily resistive and aerobic countermeasure protocol duration (ARED / T2 Treadmill).',
    iconName: 'Zap'
  },
  fatigue: {
    type: 'fatigue',
    label: 'Fatigue Score',
    shortLabel: 'Fatigue',
    unit: 'scale_1_10',
    displayFormat: (val: number) => `${val.toFixed(1)} / 10`,
    defaultNominalRange: [1, 4],
    description: 'Crew subjective fatigue index derived from psychomotor self-report.',
    iconName: 'BatteryLow'
  },
  stress: {
    type: 'stress',
    label: 'Stress / Workload',
    shortLabel: 'Stress',
    unit: 'scale_1_10',
    displayFormat: (val: number) => `${val.toFixed(1)} / 10`,
    defaultNominalRange: [1, 4],
    description: 'Self-reported subjective cognitive stress and operational operational workload load.',
    iconName: 'Brain'
  },
  core_temp: {
    type: 'core_temp',
    label: 'Core Temperature',
    shortLabel: 'Temp',
    unit: '°C',
    displayFormat: (val: number) => `${val.toFixed(2)} °C`,
    defaultNominalRange: [36.4, 37.5],
    description: 'Circadian core body temperature monitoring for thermoregulatory adaptation.',
    iconName: 'Thermometer'
  }
};
