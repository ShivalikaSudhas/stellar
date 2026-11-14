import React, { useState } from 'react';
import {
  UserProfile,
  Medication,
  HealthReading
} from '@/types';
import {
  Users,
  Shield,
  PhoneCall,
  Lock
} from 'lucide-react';

interface CaregiverViewProps {
  patientProfile: UserProfile;
  medications: Medication[];
  latestReadings: HealthReading[];
  onCallPatient: () => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  patientProfile,
  medications,
  latestReadings: _latestReadings,
  onCallPatient
}) => {
  const [selectedTier, setSelectedTier] = useState<'full' | 'summary' | 'emergency'>('summary');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-space-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent-blue/15 text-accent-blue border border-accent-blue/30">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                Family & Caregiver Circle View
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Logged in as: Rohan Sharma (Son & Primary Caregiver) • Monitoring: {patientProfile.name}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Tier Preview Selector */}
        <div className="flex items-center gap-2 bg-space-900 p-1 rounded-xl border border-space-700 text-xs font-mono">
          <span className="text-slate-400 pl-2">Privacy Tier:</span>
          {(['summary', 'full', 'emergency'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-lg uppercase transition-colors ${
                selectedTier === tier
                  ? 'bg-white text-space-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Reassuring Family Peace-of-Mind Hero Card */}
      <div className="ivory-panel p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl border-2 border-slate-700 shadow">
              👵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-ink-950">
                  {patientProfile.name} is doing well today.
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-ink-600 font-medium">
                Last checked in 25 minutes ago from home monitor.
              </p>
            </div>
          </div>

          <button
            onClick={onCallPatient}
            className="px-4 py-2 rounded-xl bg-ink-950 hover:bg-ink-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <PhoneCall size={14} />
            <span>Call Mom</span>
          </button>
        </div>

        {/* Summary Tier Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-ivory-border">
          <div className="p-3.5 rounded-xl bg-ivory-dark/60">
            <span className="text-[10px] text-ink-600 font-mono uppercase font-bold block">
              Blood Pressure
            </span>
            <span className="text-2xl font-serif font-bold text-ink-950 mt-0.5 block">
              121 / 79 <span className="text-xs font-normal text-ink-600 font-sans">mmHg</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
              ● Within normal range
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory-dark/60">
            <span className="text-[10px] text-ink-600 font-mono uppercase font-bold block">
              Resting Pulse
            </span>
            <span className="text-2xl font-serif font-bold text-ink-950 mt-0.5 block">
              72 <span className="text-xs font-normal text-ink-600 font-sans">bpm</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
              ● Calm & steady rhythm
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory-dark/60">
            <span className="text-[10px] text-ink-600 font-mono uppercase font-bold block">
              Daily Medication
            </span>
            <span className="text-2xl font-serif font-bold text-ink-950 mt-0.5 block">
              Taken
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">
              ✓ Telmisartan 08:15 AM
            </span>
          </div>
        </div>
      </div>

      {/* Conditional Detail: If Full Tier Selected */}
      {selectedTier === 'full' ? (
        <div className="space-card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 pb-2 border-b border-space-800">
            <Shield size={16} className="text-accent-blue" />
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
              Full Medical Access: Prescriptions & Adherence History
            </h3>
          </div>

          <div className="space-y-3">
            {medications.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-space-900 border border-space-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">{m.name} ({m.dosage})</span>
                  <span className="text-slate-400 text-[11px]">{m.purpose}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">{m.adherenceRatePct}% Adherence</span>
                  <span className="text-[10px] text-slate-500 block">30d compliance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedTier === 'emergency' ? (
        <div className="p-5 rounded-2xl bg-space-900 border border-space-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Lock size={15} className="text-amber-400" />
            <span>Emergency-Only Tier Active</span>
          </div>
          <p>
            Detailed vitals and daily check-ins are kept private per {patientProfile.name}'s settings. You will be immediately alerted via priority phone call and push notification if an emergency SOS is triggered or vital signs breach critical safety limits.
          </p>
        </div>
      ) : null}
    </div>
  );
};
