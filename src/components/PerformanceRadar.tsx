import { useState, useEffect, useRef } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { sound } from '../utils/audio.ts';
import { 
  Activity, 
  Zap, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Wifi, 
  Move, 
  Minus, 
  Maximize2, 
  RefreshCw,
  TrendingUp,
  X
} from 'lucide-react';

interface PerformanceRadarProps {
  onStressSpike?: () => void;
}

interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
  benchmark: number;
}

interface HistoryDataPoint {
  time: string;
  rps: number;
  cpu: number;
  memory: number;
}

export function PerformanceRadar({ onStressSpike }: PerformanceRadarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'radar' | 'stream'>('radar');
  const [position, setPosition] = useState({ x: 24, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Live telemetry state
  const [currentRps, setCurrentRps] = useState(2450);
  const [cpuPercent, setCpuPercent] = useState(24);
  const [memoryPercent, setMemoryPercent] = useState(42);
  const [latencyMs, setLatencyMs] = useState(3.4);
  const [securityScore, setSecurityScore] = useState(98);
  const [networkEfficiency, setNetworkEfficiency] = useState(94);

  // Time-series history for Recharts
  const [history, setHistory] = useState<HistoryDataPoint[]>([
    { time: '15:20:00', rps: 1800, cpu: 18, memory: 38 },
    { time: '15:20:05', rps: 2100, cpu: 22, memory: 40 },
    { time: '15:20:10', rps: 2450, cpu: 26, memory: 42 },
    { time: '15:20:15', rps: 2300, cpu: 24, memory: 41 },
    { time: '15:20:20', rps: 2600, cpu: 28, memory: 44 },
    { time: '15:20:25', rps: 2850, cpu: 31, memory: 46 },
    { time: '15:20:30', rps: 2700, cpu: 29, memory: 45 },
    { time: '15:20:35', rps: 2950, cpu: 32, memory: 47 },
    { time: '15:20:40', rps: 3100, cpu: 35, memory: 48 },
    { time: '15:20:45', rps: 2850, cpu: 30, memory: 46 },
  ]);

  // Periodic simulated live telemetry tick
  useEffect(() => {
    const timer = setInterval(() => {
      const deltaRps = Math.floor(Math.random() * 240 - 120);
      const nextRps = Math.max(1200, Math.min(5200, currentRps + deltaRps));
      const nextCpu = Math.max(10, Math.min(92, Math.round(nextRps / 85 + (Math.random() * 6 - 3))));
      const nextMem = Math.max(25, Math.min(88, Math.round(38 + nextRps / 160)));
      const nextLag = +(Math.max(1.2, Math.min(8.5, nextCpu / 14 + (Math.random() * 0.4 - 0.2))).toFixed(1));

      setCurrentRps(nextRps);
      setCpuPercent(nextCpu);
      setMemoryPercent(nextMem);
      setLatencyMs(nextLag);

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setHistory((prev) => {
        const next = [
          ...prev.slice(1),
          { time: nowStr, rps: nextRps, cpu: nextCpu, memory: nextMem }
        ];
        return next;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [currentRps]);

  // Radar multi-axis data
  const radarData: RadarDataPoint[] = [
    { subject: 'معدل RPS', value: Math.min(100, Math.round((currentRps / 5000) * 100)), fullMark: 100, benchmark: 85 },
    { subject: 'المعالج CPU', value: cpuPercent, fullMark: 100, benchmark: 60 },
    { subject: 'الذاكرة RAM', value: memoryPercent, fullMark: 100, benchmark: 50 },
    { subject: 'سرعة الاستجابة', value: Math.max(10, Math.round(100 - latencyMs * 10)), fullMark: 100, benchmark: 90 },
    { subject: 'الأمان WAF', value: securityScore, fullMark: 100, benchmark: 95 },
    { subject: 'كفاءة الشبكة', value: networkEfficiency, fullMark: 100, benchmark: 88 },
  ];

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    sound.playClick(650);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const nextX = Math.max(10, Math.min(window.innerWidth - 360, e.clientX - dragOffset.x));
      const nextY = Math.max(10, Math.min(window.innerHeight - 280, e.clientY - dragOffset.y));
      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        sound.playClick(450);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Simulate stress spike
  const handleTriggerSpike = () => {
    sound.playExecute();
    setCurrentRps(4850);
    setCpuPercent(82);
    setMemoryPercent(74);
    setLatencyMs(6.8);
    if (onStressSpike) onStressSpike();
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          sound.playSuccess();
        }}
        className="fixed top-20 right-4 z-40 px-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 shadow-xl backdrop-blur-md hover:scale-105 transition-all flex items-center gap-2 font-mono text-xs cursor-pointer"
        title="فتح رادار الأداء الحي (Performance Radar)"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <Activity className="w-4 h-4 text-cyan-400" />
        <span className="font-bold">Performance Radar</span>
        <span className="text-[10px] text-slate-400">({currentRps.toLocaleString()} RPS)</span>
      </button>
    );
  }

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      className={`fixed z-40 w-[380px] sm:w-[420px] rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden flex flex-col font-mono text-slate-200 select-none transition-shadow ${
        isDragging ? 'shadow-[0_25px_60px_rgba(6,182,212,0.35)] scale-[1.01]' : ''
      }`}
    >
      {/* Titlebar / Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="h-10 px-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-move"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-100">
            رادار الأداء والموارد (Performance Radar)
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            LIVE RECHARTS
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleTriggerSpike}
            title="محاكاة ضغط شبكي مفاجئ (Stress Spike)"
            className="p-1 rounded hover:bg-slate-800 text-amber-400 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            title="تصغير الرادار"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Top Strip */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/40 border-b border-slate-800/80 text-[11px]">
        {/* RPS Metric */}
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px]">الطلبات (RPS)</span>
            <Wifi className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-300 tabular-nums">
            {currentRps.toLocaleString()}
          </div>
          <div className="text-[9px] text-emerald-400 mt-0.5">● معدل تدفق نشط</div>
        </div>

        {/* CPU Metric */}
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px]">المعالج CPU</span>
            <Cpu className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-base font-bold text-slate-100 tabular-nums">
            {cpuPercent}%
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">4 Cores Engine</div>
        </div>

        {/* Memory Metric */}
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[10px]">الذاكرة RAM</span>
            <HardDrive className="w-3 h-3 text-teal-400" />
          </div>
          <div className="text-base font-bold text-slate-100 tabular-nums">
            {memoryPercent}%
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Heap: Optimal</div>
        </div>
      </div>

      {/* View Switcher: Radar vs Time-Series Stream */}
      <div className="px-3 pt-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              sound.playClick(600);
              setActiveTab('radar');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'radar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المخطط الراداري (Radar)
          </button>
          <button
            onClick={() => {
              sound.playClick(600);
              setActiveTab('stream');
            }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'stream'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مسار التدفق الحي (RPS Stream)
          </button>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Move className="w-3 h-3 text-cyan-400" />
          <span>قابل للنقل بالسحب</span>
        </div>
      </div>

      {/* Recharts Visualizer Area */}
      <div className="p-2 h-[220px] w-full flex items-center justify-center">
        {activeTab === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#475569', fontSize: 8 }} 
              />
              <Radar
                name="الأداء اللحظي"
                dataKey="value"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.35}
              />
              <Radar
                name="الحد القياسي"
                dataKey="benchmark"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.1}
                strokeDasharray="3 3"
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 9 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 9 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#1e293b', 
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="rps" 
                stroke="#06b6d4" 
                fillOpacity={1} 
                fill="url(#rpsGradient)" 
                name="معدل الطلبات (RPS)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Status */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>زمن الاستجابة: <strong className="text-cyan-300">{latencyMs}ms</strong></span>
        </span>
        <span className="text-slate-400">DevCore Realtime Telemetry</span>
      </div>
    </div>
  );
}
