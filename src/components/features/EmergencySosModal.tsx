import React, { useState, useEffect } from 'react';
import { AlertOctagon, Radio, CheckCircle2, Globe, ShieldAlert } from 'lucide-react';
import { EmergencyContact } from '@/types';

interface EmergencySosModalProps {
  contacts: EmergencyContact[];
  currentHeartRate: number;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  contacts,
  currentHeartRate,
  onClose
}) => {
  const [countdown, setCountdown] = useState(5);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !dispatched) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0 && !dispatched) {
      setDispatched(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, dispatched]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white rounded-2xl border-2 border-red-500 max-w-lg w-full p-6 shadow-2xl space-y-5 text-center">
        {!dispatched ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-500 mx-auto flex items-center justify-center text-red-600 animate-ping">
              <AlertOctagon size={40} />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500 block">
                MISSION SAFETY PROTOCOL • CRITICAL PRIORITY
              </span>
              <h2 className="text-2xl font-serif font-bold text-red-600 mt-1">
                EMERGENCY DISTRESS BEACON
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Transmitting real-time telemetry, biometric status, and distress beacon to NASA Mission Control & Onboard Crew in:
              </p>
            </div>

            <div className="text-5xl font-serif font-bold text-red-600 animate-pulse font-mono">
              0{countdown}
            </div>

            {/* Target Emergency Responders */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Radio size={13} className="text-red-500" />
                Emergency Telemetry Recipients:
              </span>
              {contacts.length > 0 ? (
                contacts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-slate-700 py-0.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={13} className="text-red-500 flex-shrink-0" />
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-400 text-[11px]">({c.relationship})</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[11px]">{c.phone}</span>
                  </div>
                ))
              ) : (
                <div className="space-y-1 text-slate-700 text-xs">
                  <div className="flex justify-between">
                    <span>NASA Mission Control (MCC Houston)</span>
                    <span className="font-mono text-slate-500">S-Band 2287.5 MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attending Doctor Console (Dr. Mehta)</span>
                    <span className="font-mono text-slate-500">Channel BME-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Onboard Station Commander</span>
                    <span className="font-mono text-slate-500">Intercom Loop Alpha</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
              <Globe size={13} className="text-slate-400" />
              <span>Orbit: LEO-ISS 418 km | Inc 51.6° | Biometric Pulse: {currentHeartRate} bpm</span>
            </div>

            <div className="pt-2 flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
              >
                Abort Beacon
              </button>
              <button
                type="button"
                onClick={() => setDispatched(true)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Transmit Immediately
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 block">
                DISTRESS BEACON BROADCAST SUCCESSFUL
              </span>
              <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">
                Emergency Alert Dispatched
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Emergency telemetry distress beacon, orbital coordinates, and biometric data transmitted to NASA Mission Control and Onboard Crew.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-left space-y-1.5 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>NASA Mission Control (MCC Houston):</strong> High-priority telemetry distress beacon acknowledged</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Onboard Crew & Commander:</strong> Station habitat emergency audio chime triggered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Doctor Console:</strong> Real-time biometric link engaged (Cardiovascular & SpO₂ stream)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
