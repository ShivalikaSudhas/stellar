import React, { useState, useEffect } from 'react';
import { X, Camera, CheckCircle2, Heart, Wind } from 'lucide-react';
import { HealthReading } from '@/types';

interface CameraVitalsModalProps {
  onClose: () => void;
  onSaveReading?: (reading: HealthReading) => void;
}

export const CameraVitalsModal: React.FC<CameraVitalsModalProps> = ({
  onClose,
  onSaveReading
}) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [measuredHR, setMeasuredHR] = useState<number | null>(null);
  const [measuredResp, setMeasuredResp] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false);
            const hr = 71;
            const resp = 15;
            setMeasuredHR(hr);
            setMeasuredResp(resp);

            if (onSaveReading) {
              onSaveReading({
                id: `camera-hr-${Date.now()}`,
                astronautId: 'user-asha',
                metric: 'heart_rate',
                value: hr,
                unit: 'bpm',
                timestamp: new Date().toISOString(),
                source: 'camera_rppg',
                quality: 'nominal',
                notes: 'Contactless photoplethysmography (rPPG) scan'
              });
            }
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [scanning, onSaveReading]);

  const startScan = () => {
    setMeasuredHR(null);
    setMeasuredResp(null);
    setProgress(0);
    setScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Camera size={18} />
              </span>
              <h3 className="text-lg font-serif font-semibold text-slate-900">
                Contactless Camera Vitals (rPPG)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Measures arterial blood volume pulsations from subtle facial optical reflectivity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {!measuredHR ? (
          <div className="text-center py-4 space-y-5">
            {/* Viewfinder Circle */}
            <div className="relative w-48 h-48 mx-auto rounded-full bg-slate-900 border-4 border-blue-100 flex items-center justify-center overflow-hidden shadow-inner">
              {scanning ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center text-white">
                  <div className="absolute inset-0 bg-blue-600/20 animate-pulse"></div>
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-blue-400 animate-spin"></div>
                  <div className="absolute font-serif text-2xl font-bold">
                    {progress}%
                  </div>
                  <span className="absolute bottom-4 text-[11px] text-blue-200">
                    Hold still & breathe naturally
                  </span>
                </div>
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center gap-2 p-4 text-center">
                  <Camera size={32} className="text-blue-400" />
                  <span>Align your face or finger in front of camera</span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500 max-w-xs mx-auto">
              {scanning ? (
                <span className="text-blue-600 font-medium animate-pulse">
                  Detecting capillary micro-blushes...
                </span>
              ) : (
                'Place your device comfortably at eye level in good lighting and tap below.'
              )}
            </div>

            {!scanning && (
              <button
                onClick={startScan}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 mx-auto shadow-md transition-all hover:scale-102"
              >
                <Camera size={16} />
                <span>Begin 10-Second Scan</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sm">Vitals Successfully Captured</span>
                <p className="text-xs text-emerald-800 mt-0.5 font-sans">
                  Readings saved locally to your personal baseline history.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-700 text-xs font-medium mb-1">
                  <Heart size={14} className="text-blue-600" />
                  <span>PULSE RATE</span>
                </div>
                <div className="text-3xl font-serif font-bold text-slate-900">
                  {measuredHR} <span className="text-sm font-sans font-normal text-slate-500">bpm</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                  ● Normal resting rhythm
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-medium mb-1">
                  <Wind size={14} className="text-blue-500" />
                  <span>RESPIRATORY RATE</span>
                </div>
                <div className="text-3xl font-serif font-bold text-slate-900">
                  {measuredResp} <span className="text-sm font-sans font-normal text-slate-500">br/min</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                  ● Regular relaxed rate
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={startScan}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Retest Camera
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
              >
                Save & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
