import { Volume2, VolumeX, Play, RotateCcw, Video, BrainCircuit, Layout, Building2, LogOut, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export type AppViewMode = 'circuit' | 'workspace' | 'matrix' | 'ai-suite' | 'building' | 'cctv' | 'ai-fusion' | 'designer';

interface TopBarProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRunEcosystemPulse: () => void;
  onReset: () => void;
  activeAppsCount: number;
  onOpenSignature: () => void;
  radarVisible?: boolean;
  onToggleRadar?: () => void;
  username?: string;
  onLogout?: () => void;
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
  radarVisible = true,
  onToggleRadar,
  username = 'Malek',
  onLogout,
}: TopBarProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-4 shrink-0 z-30 select-none" dir="rtl">
      {/* Zone 1: Single Brand Wordmark & Logged-in User Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
            <span className="font-mono text-cyan-400 font-bold text-xs tracking-tighter">&lt;/&gt;</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight font-mono">
              DevCore
            </span>
            <span className="text-[11px] text-cyan-300 font-medium hidden sm:inline">
              المهندس مالك حريبات
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>مدير النظام: {username}</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
        {/* 3D Campus */}
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('building');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            currentView === 'building'
              ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>مجمّع البرمجيات 3D</span>
        </button>

        {/* CCTV Surveillance Page */}
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('cctv');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            currentView === 'cctv'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-red-400" />
          <span>مراقبة الكاميرات (Hik / ICSee / Yoosee)</span>
        </button>

        {/* Multi-AI Fusion */}
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('ai-fusion');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            currentView === 'ai-fusion'
              ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
          <span>دمج نماذج الذكاء (Multi-AI)</span>
        </button>

        {/* App Designer Studio */}
        <button
          onClick={() => {
            sound.playClick(700);
            onViewChange('designer');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            currentView === 'designer'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-emerald-400" />
          <span>استوديو تصميم البرامج والصفحات</span>
        </button>

        {/* Circuit Board */}
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
          الدوائر الإلكترونية
        </button>

        {/* Workspace desktop */}
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
          سطح المكتب ({activeAppsCount})
        </button>
      </nav>

      {/* Zone 3: Mobile dropdown / Actions + User Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile View Selector */}
        <div className="lg:hidden">
          <select
            value={currentView}
            onChange={(e) => {
              sound.playClick(600);
              onViewChange(e.target.value as AppViewMode);
            }}
            className="bg-slate-900 border border-slate-700 text-cyan-300 rounded-lg px-2 py-1 text-xs font-mono"
          >
            <option value="building">🏢 مجمّع البرمجيات 3D</option>
            <option value="cctv">📹 مراقبة الكاميرات CCTV</option>
            <option value="ai-fusion">🧠 دمج نماذج الذكاء</option>
            <option value="designer">🎨 استوديو التصميم</option>
            <option value="circuit">⚡ لوحة الدوائر</option>
            <option value="workspace">💻 سطح المكتب</option>
          </select>
        </div>

        {onToggleRadar && (
          <button
            onClick={() => {
              sound.playClick(650);
              onToggleRadar();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-sm active:scale-95 ${
              radarVisible
                ? 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
            title="إظهار / إخفاء رادار الأداء والموارد (Performance Radar)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="hidden sm:inline">رادار الأداء</span>
          </button>
        )}

        {/* Engineer Malek Signature */}
        <button
          onClick={() => {
            sound.playClick(800);
            onOpenSignature();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all shadow-sm active:scale-95"
          title="معاينة بصمة وتوقيع المهندس مالك حريبات"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="hidden sm:inline">بصمة المهندس</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors"
          aria-label="Toggle Audio"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Reset Windows */}
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

        {/* Ecosystem Pulse */}
        <button
          onClick={() => {
            sound.playExecute();
            onRunEcosystemPulse();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap shrink-0"
        >
          <Play className="w-3 h-3 fill-white" />
          <span className="hidden sm:inline">نبضة تفاعلية</span>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={() => {
              sound.playClick(400);
              onLogout();
            }}
            title="تسجيل الخروج وقفل المنظومة"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-mono transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        )}
      </div>
    </header>
  );
}
