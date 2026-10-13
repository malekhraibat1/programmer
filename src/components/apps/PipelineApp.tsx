import { useState } from 'react';
import { sound } from '../../utils/audio.ts';
import { Play, CheckCircle2, RotateCw, AlertTriangle, ShieldCheck, Box, Server, Clock } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  duration?: string;
  icon: string;
}

const INITIAL_STAGES: Stage[] = [
  { id: 'lint', name: 'الفحص والتحقق النحوي (Lint & TypeCheck)', status: 'success', duration: '1.4s', icon: 'Code' },
  { id: 'test', name: 'مجموعة الاختبارات الآلية (Automated Tests)', status: 'success', duration: '3.8s', icon: 'CheckCircle2' },
  { id: 'security', name: 'الفحص الأمني وحزم الثغرات (Security Audit)', status: 'success', duration: '2.1s', icon: 'ShieldCheck' },
  { id: 'build', name: 'بناء وتجميع الحاوية (Container Docker Build)', status: 'success', duration: '5.2s', icon: 'Box' },
  { id: 'deploy', name: 'النشر السحابي التلقائي (Kubernetes Rollout)', status: 'success', duration: '4.6s', icon: 'Server' },
];

export function PipelineApp() {
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([
    '-- [CI/CD Pipeline Engine v2.4] --',
    '✓ Build #108 completed with zero errors.',
    'Cluster: production-europe-west1 • Replicas: 3 Healthy Pods',
  ]);

  const handleRunPipeline = () => {
    sound.playExecute();
    setIsBuilding(true);
    setBuildLogs(['> بدأ تشغيل دورة النشر الجديدة #109...']);

    // Reset stages to idle
    const resetStages = stages.map((s) => ({ ...s, status: 'idle' as const }));
    setStages(resetStages);

    let currentStageIndex = 0;

    const runNextStage = () => {
      if (currentStageIndex >= resetStages.length) {
        setIsBuilding(false);
        sound.playSuccess();
        setBuildLogs((prev) => [
          ...prev,
          '✓ نجح النشر بالكامل! التطبيق متاح بنسبة 100% بدون أي توقف (Zero-Downtime Rollout).',
        ]);
        return;
      }

      const stg = resetStages[currentStageIndex];
      // Mark as running
      setStages((prev) =>
        prev.map((s, idx) =>
          idx === currentStageIndex ? { ...s, status: 'running' } : s
        )
      );

      setBuildLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] جاري تنفيذ: ${stg.name}...`,
      ]);

      setTimeout(() => {
        // Mark as success
        setStages((prev) =>
          prev.map((s, idx) =>
            idx === currentStageIndex ? { ...s, status: 'success' } : s
          )
        );
        sound.playPacketPulse();
        currentStageIndex++;
        runNextStage();
      }, 700);
    };

    runNextStage();
  };

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'security': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'build': return <Box className="w-4 h-4 text-pink-400" />;
      case 'deploy': return <Server className="w-4 h-4 text-emerald-400" />;
      default: return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-200 text-xs font-mono select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-bold text-slate-100">DevCore CI/CD Pipeline</span>
          <span className="text-slate-500 text-[11px]">| GitOps Automated Workflow</span>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isBuilding}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-all shadow-md shadow-pink-600/30 active:scale-95 disabled:opacity-50"
        >
          {isBuilding ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isBuilding ? 'جاري بناء الحزمة...' : 'تشغيل دورة النشر'}</span>
        </button>
      </div>

      {/* Main Pipeline Stages Visualizer */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex-1 flex items-center gap-2">
              <div
                className={`flex-1 p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  stage.status === 'running'
                    ? 'bg-pink-950/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse'
                    : stage.status === 'success'
                    ? 'bg-slate-900/80 border-slate-700/80'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getStageIcon(stage.id)}
                    <span className="text-[10px] text-slate-400 font-bold">
                      مرحلة {idx + 1}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      stage.status === 'running'
                        ? 'bg-pink-500/20 text-pink-300 font-bold'
                        : stage.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {stage.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {stage.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{stage.duration || '--'}</span>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden md:block w-3 text-slate-600 text-center font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streaming Pipeline Logs Console */}
      <div className="flex-1 flex flex-col bg-[#060911] p-3 overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-slate-400 text-[11px]">
          <span>سجلات البناء والنشر المباشرة (Live Pipeline Logs):</span>
          <span className="text-pink-400">Environment: Production (Cloud Native)</span>
        </div>
        <div className="flex-1 overflow-auto pt-2 space-y-1 font-mono text-[11px] leading-relaxed text-slate-300 select-text">
          {buildLogs.map((log, idx) => (
            <div
              key={idx}
              className={
                log.includes('✓')
                  ? 'text-emerald-400'
                  : log.includes('error')
                  ? 'text-rose-400'
                  : log.startsWith('>')
                  ? 'text-pink-400 font-semibold'
                  : 'text-slate-300'
              }
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
