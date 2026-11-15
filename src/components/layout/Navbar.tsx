import React from 'react';
import {
  LayoutDashboard,
  Target,
  AlertTriangle,
  Cpu,
  FileText,
  Settings,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export type NavigationTab =
  | 'overview'
  | 'analytics'
  | 'baselines'
  | 'alerts'
  | 'wellness'
  | 'simulator'
  | 'import'
  | 'reports'
  | 'settings'
  | 'about';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  unacknowledgedAlertCount: number;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  unacknowledgedAlertCount,
  isSimulating
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Mission Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'baselines', label: 'Personal Baselines', icon: <Target size={18} /> },
    {
      id: 'alerts',
      label: 'Alerts & Events',
      icon: <AlertTriangle size={18} />,
      badge: unacknowledgedAlertCount > 0 ? unacknowledgedAlertCount : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
    },
    {
      id: 'simulator',
      label: 'Data Simulator',
      icon: <Cpu size={18} />,
      badge: isSimulating ? 'ACTIVE' : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-accent border border-cyan-500/30 animate-pulse'
    },
    { id: 'reports', label: 'Mission Reports', icon: <FileText size={18} /> },
    { id: 'settings', label: 'System Settings', icon: <Settings size={18} /> },
    { id: 'about', label: 'About STELLAR', icon: <Info size={18} /> },
  ];

  return (
    <aside className="w-64 bg-space-900 border-r border-space-700 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-space-700 bg-space-950">
        <div className="w-9 h-9 rounded bg-cyan-accent/10 border border-cyan-accent/40 flex items-center justify-center flex-shrink-0 text-cyan-accent">
          <ShieldAlert size={20} className="text-cyan-accent animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-widest text-white text-base">STELLAR</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/30">
              v1.0
            </span>
          </div>
          <div className="text-[10px] text-space-300 font-mono tracking-tight uppercase">
            Crew Health Intelligence
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-space-400 font-semibold">
          Operational Modules
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-space-800 text-cyan-accent border-l-2 border-cyan-accent shadow-sm'
                  : 'text-space-300 hover:bg-space-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-cyan-accent' : 'text-space-400 group-hover:text-space-200'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${item.badgeColor || 'bg-space-700 text-space-200'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="text-cyan-accent opacity-70" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mission Meta Footer */}
      <div className="p-3 border-t border-space-700 bg-space-950/70 text-[11px] font-mono text-space-400">
        <div className="flex justify-between items-center mb-1">
          <span className="text-space-400">CHALLENGE:</span>
          <span className="text-space-200">NASA Space Apps '26</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-space-400">MODE:</span>
          <span className="text-status-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping inline-block"></span>
            OFFLINE READY
          </span>
        </div>
      </div>
    </aside>
  );
};
