import React, { useState } from 'react';
import {
  Astronaut,
  AlertRuleConfig
} from '@/types';
import {
  Settings,
  Shield,
  Trash2,
  Save,
  CheckCircle2,
  Sliders,
  HardDrive
} from 'lucide-react';
import { db } from '@/core/storage/db';

interface SettingsPageProps {
  currentAstronaut: Astronaut;
  alertRules: AlertRuleConfig[];
  isOnline: boolean;
  onClearAllData: () => Promise<void>;
  onResetAstronaut: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentAstronaut,
  alertRules,
  isOnline,
  onClearAllData,
  onResetAstronaut
}) => {
  const [localRules, setLocalRules] = useState<AlertRuleConfig[]>(alertRules);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [missionIdInput, setMissionIdInput] = useState(currentAstronaut.missionId);

  // Sync if incoming alertRules change
  React.useEffect(() => {
    if (alertRules && alertRules.length > 0) {
      setLocalRules(alertRules);
    }
  }, [alertRules]);

  const handleRuleToggle = (id: string) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleRuleChange = (
    id: string,
    field: 'warningStdDevThreshold' | 'urgentStdDevThreshold' | 'sustainedReadingCount',
    val: number
  ) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleSaveSettings = async () => {
    // Update rules in Dexie
    for (const rule of localRules) {
      await db.alertRules.put(rule);
    }

    if (missionIdInput !== currentAstronaut.missionId) {
      await db.astronauts.update(currentAstronaut.id, { missionId: missionIdInput });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-cyan-accent" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              System Settings & Configurable Flight Rules
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Operational preferences, statistical sensitivity parameters, and local data persistence
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/20 border border-status-success/40 text-status-success text-xs font-mono animate-fade-in">
            <CheckCircle2 size={15} />
            <span>Parameters Updated & Synchronized!</span>
          </div>
        )}
      </div>

      {/* Warning Notice about Demonstration Thresholds */}
      <div className="p-4 rounded-lg bg-space-900 border border-space-700 text-xs font-mono text-space-300 flex items-start gap-3">
        <Shield size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-amber-300 font-bold uppercase">
            Notice: Demonstration Flight Rules Calibration
          </span>
          <p className="text-slate-300 font-sans leading-relaxed">
            The thresholds below configure the software anomaly detection sensitivity (multiples of personal standard deviation σ). They are research demonstration rules for the NASA Space Apps Challenge and must not be misconstrued as clinically certified medical emergency thresholds.
          </p>
        </div>
      </div>

      {/* Section 1: Mission & Profile Configuration */}
      <div className="aerospace-card p-6 space-y-4">
        <div className="pb-3 border-b border-space-700">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            1. Mission & Astronaut Profile Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="text-space-400 block mb-1">Active Crew Member</label>
            <input
              type="text"
              disabled
              value={`${currentAstronaut.name} (${currentAstronaut.callsign})`}
              className="w-full aerospace-input bg-space-950 text-space-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-space-400 block mb-1">Mission Identifier</label>
            <input
              type="text"
              value={missionIdInput}
              onChange={(e) => setMissionIdInput(e.target.value)}
              className="w-full aerospace-input text-white font-bold"
            />
          </div>

          <div>
            <label className="text-space-400 block mb-1">Elapsed Mission Duration</label>
            <input
              type="text"
              disabled
              value={`+${currentAstronaut.missionElapsedDays} Days (Demo MET)`}
              className="w-full aerospace-input bg-space-950 text-space-300 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Configurable Alert Sensitivity Rules */}
      <div className="aerospace-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-space-700">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              2. Configurable Prototype Alert Rules
            </h2>
            <p className="text-xs text-space-400 font-mono mt-0.5">
              Tune warning (σ) and urgent (σ) bounds and required consecutive readings
            </p>
          </div>
          <Sliders size={16} className="text-cyan-accent" />
        </div>

        <div className="space-y-4">
          {localRules.map((rule) => (
            <div key={rule.id} className="p-4 rounded-lg bg-space-850 border border-space-750 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleRuleToggle(rule.id)}
                    className="accent-cyan-accent w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      {rule.metric.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-space-400 font-mono ml-2">ID: {rule.id}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    rule.enabled ? 'bg-status-success/20 text-status-success' : 'bg-space-700 text-space-400'
                  }`}
                >
                  {rule.enabled ? 'RULE ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <p className="text-xs text-space-300 font-sans">{rule.description}</p>

              {rule.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2 border-t border-space-700/60">
                  <div>
                    <label className="text-[10px] text-amber-300 block mb-1">
                      Warning Std Dev (σ)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="4.0"
                      value={rule.warningStdDevThreshold}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'warningStdDevThreshold', parseFloat(e.target.value) || 1.5)
                      }
                      className="w-full aerospace-input text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-red-400 block mb-1">
                      Urgent Std Dev (σ)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={rule.urgentStdDevThreshold}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'urgentStdDevThreshold', parseFloat(e.target.value) || 2.5)
                      }
                      className="w-full aerospace-input text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-accent block mb-1">
                      Consecutive Readings
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="10"
                      value={rule.sustainedReadingCount}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'sustainedReadingCount', parseInt(e.target.value, 10) || 3)
                      }
                      className="w-full aerospace-input text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-lg bg-cyan-accent text-space-950 font-bold font-mono text-xs hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-md"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Section 3: Offline Storage & Data Management */}
      <div className="aerospace-card p-6 space-y-4">
        <div className="pb-3 border-b border-space-700 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            3. Local Storage & Database Management
          </h2>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-space-400">Network:</span>
            <span className={isOnline ? 'text-cyan-accent font-semibold' : 'text-amber-400 font-semibold'}>
              {isOnline ? 'ONLINE (ASSET CACHED)' : 'OFFLINE ACTIVE'}
            </span>
            <span className="text-space-600">|</span>
            <span className="text-status-success flex items-center gap-1">
              <HardDrive size={14} />
              <span>IndexedDB Engine</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-space-850 border border-space-750 space-y-2">
            <span className="font-bold text-white block">Reset Active Astronaut Telemetry</span>
            <p className="text-space-400 font-sans text-xs">
              Deletes simulated and imported readings for {currentAstronaut.name} and re-seeds clean 14-day nominal baseline.
            </p>
            <button
              onClick={onResetAstronaut}
              className="px-4 py-2 rounded bg-space-800 hover:bg-space-750 border border-space-600 text-space-200 text-xs font-mono transition-colors"
            >
              Reset {currentAstronaut.callsign}'s Telemetry
            </button>
          </div>

          <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/40 space-y-2">
            <span className="font-bold text-red-300 block">Purge Complete Local Database</span>
            <p className="text-slate-300 font-sans text-xs">
              Wipes all local IndexedDB tables (readings, baselines, alerts, wellness check-ins) and re-initializes defaults.
            </p>
            {showConfirmClear ? (
              <div className="space-y-2 pt-1">
                <p className="text-red-400 font-bold text-[11px]">
                  Confirm purge of all local telemetry records?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await onClearAllData();
                      setShowConfirmClear(false);
                    }}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                  >
                    Confirm Wipe
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 rounded bg-space-800 text-space-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-4 py-2 rounded bg-red-950/50 hover:bg-red-900 border border-red-500/60 text-red-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} />
                <span>Purge Entire Database</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
