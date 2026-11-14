import React, { useState } from 'react';
import {
  Pill,
  Smile,
  PhoneCall,
  AlertTriangle,
  Volume2
} from 'lucide-react';

interface ElderlyModeViewProps {
  patientName: string;
  heartRate: number;
  bloodPressure: string;
  onOpenSosModal: () => void;
  onExitElderlyMode: () => void;
}

export const ElderlyModeView: React.FC<ElderlyModeViewProps> = ({
  patientName,
  heartRate,
  bloodPressure,
  onOpenSosModal,
  onExitElderlyMode
}) => {
  const [medTaken, setMedTaken] = useState(true);
  const [checkedInFine, setCheckedInFine] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const speak = (msg: string) => {
    setSpeakingText(msg);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setSpeakingText(null), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 select-none font-sans">
      {/* Header with Exit Button */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700">
        <div>
          <span className="text-sm font-bold text-accent-blue font-mono uppercase tracking-wider block">
            ELDERLY CARE MODE • EXTRA LARGE FONT
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Good morning, {patientName.split(' ')[0]}.
          </h1>
        </div>

        <button
          onClick={onExitElderlyMode}
          className="px-4 py-2 rounded-2xl bg-space-850 hover:bg-space-800 border-2 border-space-700 text-slate-300 text-xs font-bold transition-colors"
        >
          Standard View ✕
        </button>
      </div>

      {/* Voice Assistant Reading Bar */}
      <div className="p-4 rounded-2xl bg-blue-950/60 border-2 border-blue-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Volume2 size={24} className="text-accent-blue animate-pulse" />
          <span className="text-sm text-slate-200 font-medium">
            {speakingText || 'Tap any button to hear spoken instructions.'}
          </span>
        </div>
        <button
          onClick={() =>
            speak(`Good morning ${patientName.split(' ')[0]}. Your heart rate is ${heartRate} beats per minute and your blood pressure is normal. All systems are fine.`)
          }
          className="px-3 py-1.5 rounded-xl bg-white text-space-950 font-bold text-xs shadow"
        >
          Read Aloud
        </button>
      </div>

      {/* Large Big-Number Vital Display Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Heart Rate */}
        <div className="ivory-panel p-6 text-center space-y-1">
          <span className="text-xs font-bold text-ink-600 uppercase font-mono tracking-wider block">
            HEART RATE
          </span>
          <div className="text-6xl font-serif font-bold text-ink-950 my-1">
            {heartRate}
          </div>
          <span className="text-base text-ink-700 font-medium block">
            Beats / Minute
          </span>
          <span className="text-xs text-emerald-700 font-bold block pt-1">
            ● Very steady and calm
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="ivory-panel p-6 text-center space-y-1">
          <span className="text-xs font-bold text-ink-600 uppercase font-mono tracking-wider block">
            BLOOD PRESSURE
          </span>
          <div className="text-5xl font-serif font-bold text-ink-950 my-1">
            {bloodPressure}
          </div>
          <span className="text-base text-ink-700 font-medium block">
            mmHg (Normal)
          </span>
          <span className="text-xs text-emerald-700 font-bold block pt-1">
            ● Well within safe zone
          </span>
        </div>
      </div>

      {/* Large 1-Touch Action Buttons */}
      <div className="space-y-4">
        {/* Morning Meds */}
        <button
          onClick={() => {
            setMedTaken(!medTaken);
            speak(medTaken ? 'Medication marked as pending' : 'Thank you. Morning blood pressure medication marked as taken.');
          }}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
            medTaken
              ? 'bg-emerald-950/40 border-emerald-500 text-white'
              : 'bg-space-900 border-space-700 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${medTaken ? 'bg-emerald-500 text-white' : 'bg-space-800'}`}>
              <Pill size={28} />
            </div>
            <div>
              <span className="text-xl font-bold block">
                {medTaken ? 'Morning Medicine: Taken ✓' : 'Take Morning Medicine'}
              </span>
              <span className="text-xs text-slate-400">
                Telmisartan (40 mg) with a glass of water
              </span>
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg ${medTaken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500'}`}>
            {medTaken ? '✓' : ''}
          </div>
        </button>

        {/* Check-in Fine */}
        <button
          onClick={() => {
            setCheckedInFine(true);
            speak('Wonderful. Your daily check-in is logged, and Rohan has been informed you are doing fine.');
          }}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
            checkedInFine
              ? 'bg-blue-950/40 border-accent-blue text-white'
              : 'bg-space-900 border-space-700 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-accent-blue flex items-center justify-center text-2xl">
              <Smile size={28} />
            </div>
            <div>
              <span className="text-xl font-bold block">
                {checkedInFine ? 'Checked in: Feeling Good ✓' : 'I Am Feeling Fine Today'}
              </span>
              <span className="text-xs text-slate-400">
                Sends a reassuring update to Rohan (Son)
              </span>
            </div>
          </div>
          <span className="text-sm font-bold text-accent-blue">Tap Here</span>
        </button>

        {/* Call Son */}
        <a
          href="tel:+15552348901"
          onClick={() => speak('Connecting phone call to Rohan')}
          className="w-full p-5 rounded-2xl bg-space-900 border-2 border-space-700 hover:border-slate-500 text-white flex items-center justify-between text-left transition-all block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-space-800 text-emerald-400 flex items-center justify-center text-2xl">
              <PhoneCall size={28} />
            </div>
            <div>
              <span className="text-xl font-bold block">Call Rohan (Son)</span>
              <span className="text-xs text-slate-400">+1 (555) 234-8901</span>
            </div>
          </div>
          <span className="text-sm font-bold text-emerald-400">Call ➔</span>
        </a>

        {/* Big Emergency SOS Button */}
        <button
          onClick={() => {
            speak('Emergency SOS button pressed. Opening dispatch screen.');
            onOpenSosModal();
          }}
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-2 border-red-400 text-white flex items-center justify-center gap-3 text-2xl font-bold shadow-glow-coral transition-all active:scale-98"
        >
          <AlertTriangle size={32} />
          <span>EMERGENCY HELP (SOS)</span>
        </button>
      </div>
    </div>
  );
};
