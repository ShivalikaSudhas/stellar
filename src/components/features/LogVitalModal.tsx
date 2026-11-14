import React, { useState } from 'react';
import { X, Heart, Droplet, Activity, Scale, Thermometer, Check } from 'lucide-react';
import { HealthReading, MetricType } from '@/types';

interface LogVitalModalProps {
  onClose: () => void;
  onSaveReadings: (readings: HealthReading[]) => Promise<void>;
  patientId: string;
}

export const LogVitalModal: React.FC<LogVitalModalProps> = ({
  onClose,
  onSaveReadings,
  patientId
}) => {
  const [selectedType, setSelectedType] = useState<MetricType>('heart_rate');
  const [value, setValue] = useState<string>('72');
  const [diastolicValue, setDiastolicValue] = useState<string>('80');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const now = new Date().toISOString();

    const createdReadings: HealthReading[] = [];

    if (selectedType === 'blood_pressure_sys') {
      createdReadings.push({
        id: `reading-bpsys-${Date.now()}`,
        astronautId: patientId,
        metric: 'blood_pressure_sys',
        value: parseFloat(value) || 120,
        unit: 'mmHg',
        timestamp: now,
        source: 'manual_entry',
        quality: 'nominal',
        notes: notes.trim() || undefined
      });
      createdReadings.push({
        id: `reading-bpdia-${Date.now() + 1}`,
        astronautId: patientId,
        metric: 'blood_pressure_dia',
        value: parseFloat(diastolicValue) || 80,
        unit: 'mmHg',
        timestamp: now,
        source: 'manual_entry',
        quality: 'nominal',
        notes: notes.trim() || undefined
      });
    } else {
      let unit = 'bpm';
      if (selectedType === 'glucose') unit = 'mg/dL';
      else if (selectedType === 'spo2') unit = '%';
      else if (selectedType === 'weight') unit = 'kg';
      else if (selectedType === 'temperature') unit = '°C';
      else if (selectedType === 'sleep_duration') unit = 'hours';

      createdReadings.push({
        id: `reading-${selectedType}-${Date.now()}`,
        astronautId: patientId,
        metric: selectedType,
        value: parseFloat(value) || 0,
        unit,
        timestamp: now,
        source: 'manual_entry',
        quality: 'nominal',
        notes: notes.trim() || undefined
      });
    }

    try {
      await onSaveReadings(createdReadings);
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-serif font-semibold text-slate-900">
              Log Health Measurement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recorded immediately into your encrypted local health history.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="font-serif font-semibold text-slate-900">Measurement Logged</h4>
            <p className="text-xs text-slate-500">Your personal baseline has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Metric selection pills */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'heart_rate', label: 'Heart Rate', icon: <Heart size={14} />, defaultVal: '72' },
                { type: 'blood_pressure_sys', label: 'Blood Pressure', icon: <Activity size={14} />, defaultVal: '122' },
                { type: 'glucose', label: 'Blood Glucose', icon: <Droplet size={14} />, defaultVal: '98' },
                { type: 'spo2', label: 'SpO2 Oxygen', icon: <Droplet size={14} />, defaultVal: '98.5' },
                { type: 'weight', label: 'Body Weight', icon: <Scale size={14} />, defaultVal: '65.0' },
                { type: 'temperature', label: 'Temperature', icon: <Thermometer size={14} />, defaultVal: '36.6' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setSelectedType(item.type as MetricType);
                    setValue(item.defaultVal);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedType === item.type
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={selectedType === item.type ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="text-[11px] text-center leading-tight">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input Value */}
            {selectedType === 'blood_pressure_sys' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Systolic (Upper)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full health-input text-base font-serif font-bold pr-14"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-sans">
                      mmHg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Diastolic (Lower)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      required
                      value={diastolicValue}
                      onChange={(e) => setDiastolicValue(e.target.value)}
                      className="w-full health-input text-base font-serif font-bold pr-14"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-sans">
                      mmHg
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observed Measurement
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full health-input text-lg font-serif font-bold"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Context / Symptoms (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Taken post-morning coffee, felt slightly rushed"
                className="w-full health-input text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Measurement'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
