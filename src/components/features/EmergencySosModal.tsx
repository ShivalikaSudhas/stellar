import React, { useState, useEffect } from 'react';
import { AlertOctagon, PhoneCall, CheckCircle2, MapPin } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl border-2 border-red-500 max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
        {!dispatched ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-100 border-4 border-red-500 mx-auto flex items-center justify-center text-red-600 animate-ping">
              <AlertOctagon size={40} />
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-red-600">
                EMERGENCY SOS ALERT
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Dispatching alert with telemetry and location in:
              </p>
            </div>

            <div className="text-5xl font-serif font-bold text-red-600 animate-pulse">
              0{countdown}
            </div>

            {/* Target Contacts */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
                Designated Emergency Responders:
              </span>
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <PhoneCall size={13} className="text-red-500" />
                    <span>{c.name} ({c.relationship})</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{c.phone}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <MapPin size={13} className="text-slate-400" />
              <span>Simulated GPS: 28.6139° N, 77.2090° E | Pulse: {currentHeartRate} bpm</span>
            </div>

            <div className="pt-2 flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
              >
                Cancel SOS
              </button>
              <button
                type="button"
                onClick={() => setDispatched(true)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Send Now
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Emergency Alert Dispatched
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                SMS notifications, current telemetry, and location beacon delivered to your emergency contacts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
              <div>✓ Caregiver Rohan Sharma alerted via SMS & Priority Call</div>
              <div>✓ Emergency Medical Dispatcher notified with vital signs link</div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
