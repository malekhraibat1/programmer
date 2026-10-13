import { AppId } from '../../types/index.ts';
import { sound } from '../../utils/audio.ts';
import { 
  Terminal, 
  Code, 
  Database, 
  GitMerge, 
  ShieldCheck, 
  Cpu, 
  CheckCircle,
  Network,
  Fingerprint,
  Sparkles,
  FolderGit2
} from 'lucide-react';

interface PersonaAppProps {
  onOpenApp: (id: AppId) => void;
  onOpenSignature?: () => void;
}

export function PersonaApp({ onOpenApp, onOpenSignature }: PersonaAppProps) {
  const principles = [
    {
      title: 'البساطة قبل التعقيد',
      en: 'Simplicity over Cleverness',
      desc: 'الكود الجيد هو الكود الذي يمكن قراءته وصيانته بسهولة بعد عامين، وليس الكود المعقد للتفاخر.',
    },
    {
      title: 'الموثوقية المعمارية (Resilience)',
      en: 'Fault Tolerance & Self-Healing',
      desc: 'الأنظمة تصمم بافتراض أن الأعطال ستقع حتماً، مع توفير آليات ارتداد واسترداد ذاتي.',
    },
    {
      title: 'الأتمتة بدلاً من التكرار',
      en: 'Aggressive Automation',
      desc: 'أي مهمة يتم تكرارها أكثر من مرتين تستحق أن تُبنى لها أداة أو سكريبت أتمتة دائم.',
    },
    {
      title: 'الأمان بالتصميم (Security by Design)',
      en: 'Zero-Trust Architecture',
      desc: 'الحماية ليست خطوة لاحقة، بل ركيزة تبدأ من أصغر استعلام حتى بوابة السحابة.',
    },
  ];

  const skillBars = [
    { name: 'TypeScript & Node.js Ecosystem', level: 98, color: 'bg-cyan-500', target: 'ide' as AppId },
    { name: 'AI Engineering & LLM Orchestration', level: 96, color: 'bg-violet-500', target: 'ai' as AppId },
    { name: 'System Design & Microservices', level: 95, color: 'bg-sky-500', target: 'api' as AppId },
    { name: 'Distributed Databases & Redis', level: 92, color: 'bg-amber-500', target: 'database' as AppId },
    { name: 'Personal Code & Vault Architecture', level: 94, color: 'bg-rose-500', target: 'vault' as AppId },
    { name: 'CI/CD, Docker & Kubernetes', level: 90, color: 'bg-pink-500', target: 'pipeline' as AppId },
  ];

  return (
    <div className="flex flex-col h-full bg-[#080d17] text-slate-200 text-xs font-mono select-none overflow-y-auto">
      {/* Hero Header */}
      <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 p-[2px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Fingerprint className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white tracking-tight">
                المهندس مالك حريبات | Eng. Malek Hraibat
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                بصمة معمارية معتمدة
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              أنا البرنامج: عقل وبيئة مهندس البرمجيات مالك حريبات. لست مجرد شاشات منفصلة، بل شبكة
              عصبية وإلكترونية متكاملة من المنطق، والبيانات، والذكاء الاصطناعي، والأمان.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSignature && (
            <button
              onClick={() => {
                sound.playExecute();
                onOpenSignature();
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>فحص البصمة الرقمية</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playSuccess();
              onOpenApp('terminal');
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>الطرفية</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Principles & Skills Matrix */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4 Core Principles (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>المبادئ المعمارية الحاكمة (Guiding Axioms)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {principles.map((pr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100">{pr.title}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">0{idx + 1}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mb-2">{pr.en}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{pr.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Ecosystem Launcher */}
          <div className="pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 mb-3">
              تشغيل المكونات المرتبطة مباشرة:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenApp('ide');
                }}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 transition-colors text-right"
              >
                <Code className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">محرر الأكواد</div>
                <div className="text-[9px] text-slate-500">منطق الخوارزميات</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenApp('api');
                }}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 transition-colors text-right"
              >
                <Network className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">بوابة الـ API</div>
                <div className="text-[9px] text-slate-500">توجيه الشبكة</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenApp('database');
                }}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 transition-colors text-right"
              >
                <Database className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">قواعد البيانات</div>
                <div className="text-[9px] text-slate-500">التخزين والكاش</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenApp('pipeline');
                }}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 transition-colors text-right"
              >
                <GitMerge className="w-4 h-4 text-pink-400 mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">خط النشر</div>
                <div className="text-[9px] text-slate-500">CI/CD Pipeline</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Technical Stack Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>مصفوفة التمكّن التقني (Stack Proficiency)</span>
          </h3>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3.5">
            {skillBars.map((sk, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">{sk.name}</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenApp(sk.target);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] tabular-nums"
                  >
                    {sk.level}% • فحص
                  </button>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${sk.level}%` }}
                    className={`h-full rounded-full ${sk.color} transition-all duration-700`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">النمط المعماري:</span>
              <span className="text-cyan-400 font-bold">Event-Driven Microservices</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">درجة التغطية الاختبارية:</span>
              <span className="text-emerald-400 font-bold">96.8% Coverage</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">زمن استرداد الكوارث (RTO):</span>
              <span className="text-indigo-400 font-bold">&lt; 15 ثانية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
