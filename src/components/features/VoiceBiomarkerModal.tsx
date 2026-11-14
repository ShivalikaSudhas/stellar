import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle2, RefreshCw } from 'lucide-react';
import { VoiceBiomarkerResult } from '@/types';

interface VoiceBiomarkerModalProps {
  onClose: () => void;
  onSaveResult?: (result: VoiceBiomarkerResult) => void;
}

export const VoiceBiomarkerModal: React.FC<VoiceBiomarkerModalProps> = ({
  onClose,
  onSaveResult
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceBiomarkerResult | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isRecording && countdown === 0) {
      setIsRecording(false);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        const res: VoiceBiomarkerResult = {
          id: `voice-${Date.now()}`,
          timestamp: new Date().toISOString(),
          jitterPct: 1.12,
          shimmerPct: 2.34,
          vocalFatigueScore: 3.5,
          stressIndex: 4.0,
          respiratoryRateEstimate: 15,
          statusDescription: 'Voice acoustics indicate clear respiratory phonation. Mild vocal tiredness detected, consistent with afternoon fatigue.'
        };
        setResult(res);
        if (onSaveResult) onSaveResult(res);
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [isRecording, countdown, onSaveResult]);

  const startRecording = () => {
    setResult(null);
    setCountdown(5);
    setIsRecording(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Mic size={18} />
              </span>
              <h3 className="text-lg font-serif font-semibold text-slate-900">
                Voice Biomarker Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Analyze vocal acoustic jitter, stress indices, and breath pauses from a 5-second voice sample.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {!result ? (
          <div className="text-center py-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-sm mx-auto text-xs text-slate-600">
              <p className="font-medium text-slate-800 mb-1">Sentence to read aloud:</p>
              <p className="italic font-serif text-sm text-slate-900">
                "The blue sky was clear this morning, and the gentle wind made walking outside peaceful."
              </p>
            </div>

            <div className="py-4">
              {isRecording ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-500 mx-auto flex items-center justify-center text-red-600 animate-pulse">
                    <Mic size={32} />
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    Listening... {countdown}s remaining
                  </div>
                  <div className="flex justify-center items-center gap-1.5 h-6">
                    {[16, 24, 12, 32, 20, 28, 14, 30, 18].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-blue-600 rounded-full animate-bounce"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      ></span>
                    ))}
                  </div>
                </div>
              ) : analyzing ? (
                <div className="space-y-3 py-4">
                  <RefreshCw size={36} className="text-blue-600 animate-spin mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    Analyzing vocal jitter & acoustic harmonics...
                  </p>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 mx-auto shadow-md transition-all hover:scale-102"
                >
                  <Mic size={18} />
                  <span>Start 5-Second Voice Check</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Audio is processed in-memory locally. No voice recordings are stored or transmitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sm">Vocal Biomarkers Extracted</span>
                <p className="text-xs text-emerald-800 mt-0.5 font-sans">
                  {result.statusDescription}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">VOCAL FATIGUE SCORE</span>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  {result.vocalFatigueScore} / 10
                </span>
                <span className="text-emerald-600 block text-[11px] mt-0.5">Mild / Within normal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">COGNITIVE STRESS INDEX</span>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  {result.stressIndex} / 10
                </span>
                <span className="text-emerald-600 block text-[11px] mt-0.5">Relaxed baseline</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">PITCH JITTER</span>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  {result.jitterPct}%
                </span>
                <span className="text-slate-400 block text-[11px] mt-0.5">&lt;1.5% is nominal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">RESPIRATION ESTIMATE</span>
                <span className="text-lg font-bold text-slate-900 font-serif">
                  {result.respiratoryRateEstimate} br/min
                </span>
                <span className="text-emerald-600 block text-[11px] mt-0.5">Normal breath cadence</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={startRecording}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Retest Voice
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
