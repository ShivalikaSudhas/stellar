import React, { useState } from 'react';
import {
  WellnessCheckIn
} from '@/types';
import {
  ClipboardCheck,
  Moon,
  BatteryMedium,
  Brain,
  Smile,
  AlertCircle,
  Save,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface WellnessPageProps {
  wellnessHistory: WellnessCheckIn[];
  onSubmitCheckIn: (entry: Omit<WellnessCheckIn, 'id' | 'astronautId' | 'timestamp'>) => Promise<void>;
}

export const WellnessPage: React.FC<WellnessPageProps> = ({
  wellnessHistory,
  onSubmitCheckIn
}) => {
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [fatigue, setFatigue] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [mood, setMood] = useState<number>(4);
  const [discomfort, setDiscomfort] = useState<number>(1);
  const [discomfortLocation, setDiscomfortLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitCheckIn({
        sleepQuality,
        fatigue,
        stress,
        mood,
        discomfort,
        discomfortLocation: discomfort > 1 ? discomfortLocation : undefined,
        notes: notes.trim() || undefined,
        source: 'manual_entry'
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck size={20} className="text-cyan-accent" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Daily Crew Wellness & Psychomotor Check-in
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Subjective fatigue, circadian sleep recovery, and operational workload log
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/20 border border-status-success/40 text-status-success text-xs font-mono animate-fade-in">
            <CheckCircle2 size={15} />
            <span>Check-in persisted locally in IndexedDB!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-2 aerospace-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="pb-3 border-b border-space-700 flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono uppercase">
                New Operational Entry
              </span>
              <span className="text-xs font-mono text-space-400">
                Timestamp: {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Metric Sliders */}
            <div className="space-y-5">
              {/* Sleep Quality */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Moon size={16} className="text-indigo-400" />
                    <span className="font-semibold">Subjective Sleep Quality (1 - 5)</span>
                  </div>
                  <span className="text-cyan-accent font-bold text-sm">{sleepQuality} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full accent-cyan-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-space-400 font-mono">
                  <span>1: Fragmented / Severe disruption</span>
                  <span>3: Acceptable</span>
                  <span>5: Deep restorative rest</span>
                </div>
              </div>

              {/* Fatigue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <BatteryMedium size={16} className="text-amber-400" />
                    <span className="font-semibold">Psychomotor Fatigue Level (1 - 10)</span>
                  </div>
                  <span className={`font-bold text-sm ${fatigue >= 7 ? 'text-red-400' : fatigue >= 5 ? 'text-amber-400' : 'text-cyan-accent'}`}>
                    {fatigue} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={fatigue}
                  onChange={(e) => setFatigue(Number(e.target.value))}
                  className="w-full accent-cyan-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-space-400 font-mono">
                  <span>1: Fully alert & energized</span>
                  <span>5: Moderate tiredness</span>
                  <span>10: Exhaustion / Task impairment</span>
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Brain size={16} className="text-purple-400" />
                    <span className="font-semibold">Operational Stress / Cognitive Load (1 - 10)</span>
                  </div>
                  <span className="text-cyan-accent font-bold text-sm">{stress} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-cyan-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-space-400 font-mono">
                  <span>1: Calm / Nominal ops</span>
                  <span>5: High task volume</span>
                  <span>10: Overwhelming pressure</span>
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Smile size={16} className="text-status-success" />
                    <span className="font-semibold">General Mood & Morale (1 - 5)</span>
                  </div>
                  <span className="text-cyan-accent font-bold text-sm">{mood} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-cyan-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-space-400 font-mono">
                  <span>1: Low / Demotivated</span>
                  <span>3: Neutral</span>
                  <span>5: High morale / Motivated</span>
                </div>
              </div>

              {/* Physical Discomfort */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <AlertCircle size={16} className="text-amber-400" />
                    <span className="font-semibold">Physical Discomfort / Microgravity Strain (1 - 10)</span>
                  </div>
                  <span className="text-cyan-accent font-bold text-sm">{discomfort} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={discomfort}
                  onChange={(e) => setDiscomfort(Number(e.target.value))}
                  className="w-full accent-cyan-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-space-400 font-mono">
                  <span>1: No discomfort</span>
                  <span>5: Moderate ache</span>
                  <span>10: Severe pain</span>
                </div>
              </div>

              {discomfort > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-space-300">
                    Discomfort Location / Symptom
                  </label>
                  <input
                    type="text"
                    value={discomfortLocation}
                    onChange={(e) => setDiscomfortLocation(e.target.value)}
                    placeholder="e.g. Lumbar spinal lengthening ache, vestibular dizziness, ocular pressure"
                    className="w-full aerospace-input text-xs"
                  />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-space-300">
                  Mission Operational Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note circadian schedule shifts, EVA preparation, sleep disruptions, or countermeasure anomalies..."
                  rows={3}
                  className="w-full aerospace-input text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-space-700 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-cyan-accent text-space-950 font-bold font-mono text-xs hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save size={15} />
                <span>{isSubmitting ? 'Recording...' : 'Submit Daily Check-in'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* History Overview Panel */}
        <div className="aerospace-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-space-700 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-cyan-accent" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Check-in History ({wellnessHistory.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-space-400">Local Cache</span>
            </div>

            {wellnessHistory.length === 0 ? (
              <div className="py-12 text-center text-space-400">
                <p className="text-xs font-mono">No wellness logs entered yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {wellnessHistory.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-space-850 border border-space-750 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1.5 text-space-300">
                      <span className="text-white font-bold text-[11px]">
                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-space-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-2 text-[10px] text-center">
                      <div className="p-1 rounded bg-space-900 border border-space-700">
                        <span className="text-space-400 block">SLEEP</span>
                        <span className="font-bold text-white">{item.sleepQuality}/5</span>
                      </div>
                      <div className="p-1 rounded bg-space-900 border border-space-700">
                        <span className="text-space-400 block">FATIGUE</span>
                        <span className={item.fatigue >= 7 ? 'font-bold text-red-400' : 'font-bold text-white'}>
                          {item.fatigue}/10
                        </span>
                      </div>
                      <div className="p-1 rounded bg-space-900 border border-space-700">
                        <span className="text-space-400 block">STRESS</span>
                        <span className="font-bold text-white">{item.stress}/10</span>
                      </div>
                    </div>

                    {item.discomfortLocation && (
                      <div className="text-[10px] text-amber-300 mt-1">
                        Symptom: {item.discomfortLocation} (Level {item.discomfort}/10)
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-space-300 font-sans text-[11px] mt-1.5 pt-1.5 border-t border-space-800 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-space-700 text-[10px] font-mono text-space-400">
            *Entries immediately update the multi-indicator correlation engine.
          </div>
        </div>
      </div>
    </div>
  );
};
