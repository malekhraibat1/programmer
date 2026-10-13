import { useState, useEffect } from 'react';
import { AppId, AppNode } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { 
  Code, 
  Database, 
  Network, 
  ShieldCheck, 
  GitMerge, 
  Activity, 
  Terminal, 
  UserCheck,
  Layers,
  ChevronUp,
  BrainCircuit,
  FolderGit2,
  Fingerprint
} from 'lucide-react';

interface TaskbarProps {
  nodes: AppNode[];
  activeApps: AppId[];
  onOpenApp: (id: AppId) => void;
  onMinimizeAll: () => void;
  onToggleAppWindow: (id: AppId) => void;
  circuitViewActive: boolean;
  onToggleCircuitView: () => void;
}

export function Taskbar({
  nodes,
  activeApps,
  onOpenApp,
  onMinimizeAll,
  onToggleAppWindow,
  circuitViewActive,
  onToggleCircuitView,
}: TaskbarProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (name: string, className = "w-4 h-4") => {
    switch (name) {
      case 'Code': return <Code className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Network': return <Network className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'GitMerge': return <GitMerge className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'UserCheck': return <Fingerprint className={className} />;
      case 'BrainCircuit': return <BrainCircuit className={className} />;
      case 'FolderGit2': return <FolderGit2 className={className} />;
      default: return <Layers className={className} />;
    }
  };

  return (
    <div className="h-14 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-40 select-none">
      {/* Left: Circuit Mode Switcher + Apps Launch dock */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        <button
          onClick={() => {
            sound.playClick(750);
            onToggleCircuitView();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            circuitViewActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">لوحة الدوائر</span>
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-1 shrink-0" />

        {/* Apps Dock */}
        {nodes.map((node) => {
          const isRunning = activeApps.includes(node.id);

          return (
            <button
              key={node.id}
              onClick={() => {
                sound.playClick(600);
                if (isRunning) {
                  onToggleAppWindow(node.id);
                } else {
                  onOpenApp(node.id);
                }
              }}
              title={`${node.name} (${node.nameEn})`}
              className={`p-2 rounded-lg flex items-center gap-1.5 transition-all shrink-0 relative ${
                isRunning
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div style={{ color: isRunning ? node.accentColor : undefined }}>
                {getIcon(node.iconName, 'w-4 h-4')}
              </div>
              <span className="text-xs font-medium hidden md:inline truncate max-w-[90px]">
                {node.name.split(' ')[0]}
              </span>

              {/* Running indicator pip */}
              {isRunning && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: node.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: Clock & Quick Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playClick(400);
            onMinimizeAll();
          }}
          title="تصغير / استعادة كافة النوافذ"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors hidden sm:flex items-center gap-1 text-[11px]"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>النوافذ</span>
        </button>

        <div className="font-mono text-xs text-slate-300 px-2 py-1 rounded bg-slate-900 border border-slate-800/80 tabular-nums">
          {timeStr}
        </div>
      </div>
    </div>
  );
}
