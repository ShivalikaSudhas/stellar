import React from 'react';
import { Astronaut } from '@/types';
import { Radio, Clock, ShieldCheck, Wifi, WifiOff, HardDrive } from 'lucide-react';

interface HeaderProps {
  currentAstronaut: Astronaut;
  astronauts: Astronaut[];
  onSelectAstronaut: (id: string) => void;
  isOnline: boolean;
  lastMeasurementTime?: string;
  totalAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentAstronaut,
  astronauts,
  onSelectAstronaut,
  isOnline,
  lastMeasurementTime,
  totalAlertsCount
}) => {
  // Format Mission Elapsed Time (MET)
  const days = currentAstronaut.missionElapsedDays || 84;
  const hours = 14;
  const mins = 22;

  const formattedLastTime = lastMeasurementTime
    ? new Date(lastMeasurementTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'STANDBY';

  return (
    <header className="h-16 bg-space-900 border-b border-space-700 px-6 flex items-center justify-between z-10 select-none">
      {/* Left: Astronaut Selector & Mission Tag */}
      <div className="flex items-center gap-4">
        {/* Astronaut Selector */}
        <div className="flex items-center gap-2.5 bg-space-800 border border-space-700 rounded-lg px-3 py-1.5 hover:border-space-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent font-semibold text-xs">
            {currentAstronaut.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={currentAstronaut.id}
                onChange={(e) => onSelectAstronaut(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-2"
              >
                {astronauts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-space-900 text-white">
                    {a.name} ({a.callsign})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[10px] text-space-300 font-mono">
              {currentAstronaut.role}
            </div>
          </div>
        </div>

        {/* Mission Identifier */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-space-850 border border-space-700 rounded-lg font-mono text-xs">
          <span className="text-space-400">MISSION:</span>
          <span className="font-semibold text-white">{currentAstronaut.missionId}</span>
          <span className="text-[9px] uppercase tracking-wider text-cyan-accent bg-cyan-accent/10 px-1 py-0.2 rounded border border-cyan-accent/30">
            DEMO
          </span>
        </div>

        {/* Mission Elapsed Time (MET) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-space-850 border border-space-700 rounded-lg font-mono text-xs">
          <Clock size={14} className="text-space-400" />
          <span className="text-space-400">MET:</span>
          <span className="text-cyan-accent font-semibold tracking-wider">
            +{days}d {hours.toString().padStart(2, '0')}h {mins.toString().padStart(2, '0')}m
          </span>
          <span className="text-[9px] text-space-400">(SIMULATED)</span>
        </div>
      </div>

      {/* Right: Telemetry sync, Online/Offline, and System Integrity */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Last telemetry timestamp */}
        <div className="hidden sm:flex items-center gap-1.5 text-space-300 bg-space-850 border border-space-700 px-2.5 py-1.5 rounded-lg">
          <Radio size={13} className="text-cyan-accent animate-pulse" />
          <span className="text-space-400">LAST TELEMETRY:</span>
          <span className="text-white font-medium">{formattedLastTime}</span>
        </div>

        {/* Honest Sync & Offline Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-space-700 bg-space-850 text-space-200">
          <HardDrive size={13} className="text-status-success" />
          <span className="hidden xl:inline text-space-400">STORAGE:</span>
          <span className="text-status-success font-semibold">LOCAL DB</span>
          <span className="text-space-500">|</span>
          {isOnline ? (
            <span className="flex items-center gap-1 text-cyan-accent" title="Network available. Core application works 100% offline via IndexedDB.">
              <Wifi size={13} />
              <span>ONLINE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400" title="Offline mode active. Full local analytics enabled.">
              <WifiOff size={13} />
              <span>OFFLINE</span>
            </span>
          )}
        </div>

        {/* Flight Rules System Status */}
        <div className="flex items-center gap-1.5 bg-space-800 border border-space-700 px-3 py-1.5 rounded-lg">
          <ShieldCheck size={14} className="text-cyan-accent" />
          <span className="text-space-400 hidden sm:inline">ALERTS:</span>
          <span className={totalAlertsCount > 0 ? 'text-amber-400 font-bold' : 'text-status-success font-bold'}>
            {totalAlertsCount}
          </span>
        </div>
      </div>
    </header>
  );
};
