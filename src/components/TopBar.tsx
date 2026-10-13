import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface TopBarProps {
  currentView: 'circuit' | 'workspace' | 'matrix' | 'ai-suite';
  onViewChange: (view: 'circuit' | 'workspace' | 'matrix' | 'ai-suite') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRunEcosystemPulse: () => void;
  onReset: () => void;
  activeAppsCount: number;
  onOpenSignature: () => void;
}

export function TopBar({
  currentView,
  onViewChange,
  soundEnabled,
  onToggleSound,
  onRunEcosystemPulse,
  onReset,
  activeAppsCount,
  onOpenSignature,
}: TopBarProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-8 shrink-0 z-30 select-none">
      {/* Zone 1: Single Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <span className="font-mono text-cyan-400 font-bold text-xs tracking-tighter">&lt;/&gt;</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-white tracking-tight font-mono">
            DevCore
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            المهندس مالك حريبات
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('circuit');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
            currentView === 'circuit'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          لوحة الدوائر الإلكترونية
        </button>
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('ai-suite');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
            currentView === 'ai-suite'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          برامج الذكاء الاصطناعي (8)
        </button>
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('workspace');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
            currentView === 'workspace'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          سطح المكتب المفتوح ({activeAppsCount})
        </button>
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('matrix');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
            currentView === 'matrix'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          المصفوفة المعمارية
        </button>
      </nav>

      {/* Zone 3: Primary Action + Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            sound.playClick(800);
            onOpenSignature();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all shadow-sm active:scale-95"
          title="معاينة بصمة وتوقيع المهندس مالك حريبات"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>بصمة المهندس مالك</span>
        </button>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors"
          aria-label="Toggle Audio"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={() => {
            sound.playClick(500);
            onReset();
          }}
          title="إعادة ضبط النوافذ"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors hidden sm:flex"
          aria-label="Reset Windows"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sound.playExecute();
            onRunEcosystemPulse();
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span className="hidden sm:inline">إطلاق نبضة تفاعلية</span>
        </button>
      </div>
    </header>
  );
}

