import { useState, useEffect } from 'react';
import { sound } from '../../utils/audio.ts';
import { Activity, Cpu, HardDrive, Wifi, Zap } from 'lucide-react';

interface TelemetryAppProps {
  onStressTrigger?: () => void;
}

export function TelemetryApp({ onStressTrigger }: TelemetryAppProps) {
  const [cpuLoad, setCpuLoad] = useState(14);
  const [memoryMb, setMemoryMb] = useState(342);
  const [eventLoopLag, setEventLoopLag] = useState(0.8);
  const [reqPerSec, setReqPerSec] = useState(1240);
  const [history, setHistory] = useState<number[]>([12, 14, 15, 13, 14, 16, 14, 15, 14]);

  // Periodic heartbeat update
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuLoad((prev) => Math.max(8, Math.min(85, prev + (Math.random() * 4 - 2))));
      setMemoryMb((prev) => Math.max(300, Math.min(500, prev + (Math.random() * 2 - 1))));
      setEventLoopLag((prev) => +(Math.max(0.4, Math.min(3.2, prev + (Math.random() * 0.2 - 0.1))).toFixed(2)));
      setReqPerSec((prev) => Math.max(900, Math.min(2400, Math.round(prev + (Math.random() * 40 - 20)))));

      setHistory((prev) => {
        const next = [...prev.slice(1), Math.round(cpuLoad)];
        return next;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [cpuLoad]);

  const handleSimulateLoadSpike = () => {
    sound.playExecute();
    setCpuLoad(78);
    setMemoryMb(486);
    setEventLoopLag(2.84);
    setReqPerSec(3800);
    if (onStressTrigger) {
      onStressTrigger();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d16] text-slate-200 text-xs font-mono select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-100">DevCore Telemetry & Runtime Observer</span>
          <span className="text-slate-500 text-[11px]">| Node.js / V8 Profiler</span>
        </div>

        <button
          onClick={handleSimulateLoadSpike}
          className="flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-xs transition-colors"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>محاكاة ضغط تشغيلي (Stress Spike)</span>
        </button>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">حمل المعالج (CPU)</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {cpuLoad.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">4 Cores Active</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">ذاكرة الـ Heap (RAM)</span>
            <HardDrive className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {memoryMb.toFixed(0)} MB
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Max: 1024 MB</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">تأخير الـ Event Loop</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {eventLoopLag} ms
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">✓ تأخير مثالي (&lt;5ms)</div>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">حجم الطلبات (Throughput)</span>
            <Wifi className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {reqPerSec.toLocaleString()} <span className="text-xs font-normal">req/s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">P99 Latency: 18ms</div>
        </div>
      </div>

      {/* SVG Wave / Bar Visualization */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-slate-400 text-xs">
          <span>المخطط الزمني لاستقرار النظام (Realtime Load Graph):</span>
          <span className="font-mono text-teal-400">Sample Frequency: 1.5s</span>
        </div>

        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-end gap-3 justify-between">
          {history.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                {val}%
              </span>
              <div
                style={{ height: `${Math.max(10, Math.min(100, val * 1.2))}%` }}
                className={`w-full rounded-t transition-all duration-500 ${
                  val > 60
                    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : val > 30
                    ? 'bg-amber-500'
                    : 'bg-teal-500/80 shadow-[0_0_8px_rgba(20,184,166,0.3)]'
                }`}
              />
              <span className="text-[9px] text-slate-600 font-mono">T-{history.length - idx}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
