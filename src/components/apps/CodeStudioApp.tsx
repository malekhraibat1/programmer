import { useState, useEffect } from 'react';
import { SAMPLE_CODE_SNIPPETS } from '../../data/initialData.ts';
import { sound } from '../../utils/audio.ts';
import { Play, RotateCcw, GitCommit, Copy, Check, Terminal as TerminalIcon, Sparkles, FolderPlus } from 'lucide-react';

interface CodeStudioAppProps {
  onCommitTrigger?: (commitMsg: string) => void;
  onAskAiWithCode?: (code: string) => void;
  onSaveToVault?: (code: string, title: string) => void;
  externalCodeToLoad?: { code: string; filename: string } | null;
}

export function CodeStudioApp({
  onCommitTrigger,
  onAskAiWithCode,
  onSaveToVault,
  externalCodeToLoad,
}: CodeStudioAppProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [fileCodes, setFileCodes] = useState<string[]>(
    SAMPLE_CODE_SNIPPETS.map((s) => s.code)
  );

  useEffect(() => {
    if (externalCodeToLoad) {
      setFileCodes((prev) => {
        const next = [...prev];
        next[activeFileIndex] = externalCodeToLoad.code;
        return next;
      });
      setConsoleOutput((prev) => [
        ...prev,
        `✓ تم تحميل الملف [${externalCodeToLoad.filename}] بنجاح من سجل المهندس مالك حريبات.`,
      ]);
    }
  }, [externalCodeToLoad]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'جاهز لتنفيذ الشفرة البرمجية...',
    '[INIT] تم تحميل مصفوفة المتغيرات والمكتبات القياسية بنجاح.',
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commitMessage, setCommitMessage] = useState('feat: update algorithm logic');
  const [showCommitModal, setShowCommitModal] = useState(false);

  const activeSnippet = SAMPLE_CODE_SNIPPETS[activeFileIndex];
  const currentCode = fileCodes[activeFileIndex];

  const handleCodeChange = (newCode: string) => {
    const updated = [...fileCodes];
    updated[activeFileIndex] = newCode;
    setFileCodes(updated);
  };

  const handleRunCode = () => {
    sound.playExecute();
    setIsRunning(true);
    setConsoleOutput((prev) => [
      ...prev,
      `\n> جاري تنفيذ ${activeSnippet.filename}...`,
    ]);

    setTimeout(() => {
      let result = '';
      if (activeFileIndex === 0) {
        result = `[EXECUTION RESULT]:\n[SYSTEM] تشغيل المعالجة بحمل 35% -> الحالة: Optimal\n- العائد: { status: "Operational", efficiency: "99.8%" }\n- زمن الاستجابة: 1.42ms | الذاكرة: 12.4 MB`;
      } else if (activeFileIndex === 1) {
        result = `[EXECUTION RESULT]:\nتمت معالجة 3 سجلاً بنجاح عبر خط الأنابيب.\n- السجلات المُخرجة: 3 عناصر مهيكلة\n- استهلاك الـ Heap: +0.4 MB | النتيجة: نجاح`;
      } else {
        result = `[EXECUTION RESULT]:\n- المصادقة: Authorized (LeadEngineer)\n- الصلاحيات: ["read:cluster", "deploy:production", "mutate:database"]\n- الصلاحية: نشطة وموثقة`;
      }

      setConsoleOutput((prev) => [...prev, result, '✓ اكتمل التنفيذ بنجاح']);
      setIsRunning(false);
      sound.playSuccess();
    }, 600);
  };

  const handleResetCode = () => {
    sound.playClick(400);
    const updated = [...fileCodes];
    updated[activeFileIndex] = SAMPLE_CODE_SNIPPETS[activeFileIndex].code;
    setFileCodes(updated);
    setConsoleOutput((prev) => [...prev, `تمت استعادة الكود الافتراضي لملف ${activeSnippet.filename}`]);
  };

  const handleCopy = () => {
    sound.playClick(600);
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommit = () => {
    sound.playSuccess();
    if (onCommitTrigger) {
      onCommitTrigger(commitMessage);
    }
    setConsoleOutput((prev) => [
      ...prev,
      `[GIT COMMIT] ${commitMessage} -> تم دفع التحديث إلى الفرع الرئيسي (main)`,
      `⚡ تم إرسال إشارة التحديث إلى خط النشر CI/CD`,
    ]);
    setShowCommitModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-slate-200 text-xs font-mono select-none">
      {/* Top File Tabs & Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-3 py-1.5 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {SAMPLE_CODE_SNIPPETS.map((snippet, idx) => (
            <button
              key={snippet.filename}
              onClick={() => {
                sound.playClick(650);
                setActiveFileIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-2 ${
                activeFileIndex === idx
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] text-cyan-500 font-bold">TS</span>
              <span>{snippet.filename}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onAskAiWithCode && (
            <button
              onClick={() => {
                sound.playClick(800);
                onAskAiWithCode(currentCode);
              }}
              title="تحليل الكود واقتراح تحسينات بالذكاء الاصطناعي"
              className="flex items-center gap-1 px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 rounded text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحليل بالذكاء الاصطناعي</span>
            </button>
          )}

          {onSaveToVault && (
            <button
              onClick={() => {
                sound.playSuccess();
                onSaveToVault(currentCode, activeSnippet.filename);
                setConsoleOutput((prev) => [
                  ...prev,
                  `✓ تم حفظ نسخة من الملف [${activeSnippet.filename}] في سجل المهندس مالك حريبات.`,
                ]);
              }}
              title="حفظ الشفرة في سجل المهندس مالك حريبات"
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded text-xs transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">حفظ بالسجل</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="نسخ الشفرة"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleResetCode}
            title="استعادة الكود الأصلي"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowCommitModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors border border-slate-700"
          >
            <GitCommit className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Commit & Push</span>
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold transition-all shadow-sm shadow-cyan-600/30 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>{isRunning ? 'جاري التشغيل...' : 'تشغيل الكود'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Code Editor Area + Live Console */}
      <div className="flex-1 grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-12 overflow-hidden">
        {/* Code Editor */}
        <div className="row-span-2 sm:col-span-7 flex flex-col border-b sm:border-b-0 sm:border-l border-slate-800/80 bg-[#070b14] relative">
          <div className="flex items-center justify-between px-3 py-1 text-[10px] text-slate-500 bg-slate-950/60 border-b border-slate-900">
            <span>محرر النصوص التفاعلي (قابل للتعديل)</span>
            <span>TypeScript • UTF-8</span>
          </div>
          <div className="flex-1 relative flex overflow-hidden">
            {/* Line Numbers */}
            <div className="w-10 bg-slate-950/40 text-slate-600 py-3 text-right pr-2 select-none text-[11px] leading-5 font-mono">
              {Array.from({ length: Math.min(24, currentCode.split('\n').length + 2) }).map(
                (_, i) => (
                  <div key={i}>{i + 1}</div>
                )
              )}
            </div>
            {/* Textarea Code Input */}
            <textarea
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-cyan-100 p-3 outline-none resize-none font-mono text-[11px] leading-5 select-text selection:bg-cyan-500/30 overflow-auto"
            />
          </div>
        </div>

        {/* Live Output Console */}
        <div className="row-span-1 sm:col-span-5 flex flex-col bg-slate-950 text-slate-300">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-slate-400 bg-slate-900/60 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>مخرجات التنفيذ (Console Output)</span>
            </div>
            <button
              onClick={() => setConsoleOutput(['تم مسح المخرجات. جاهز للأوامر الجديدة.'])}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              مسح
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300 leading-relaxed select-text">
            {consoleOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.includes('[SYSTEM]')
                    ? 'text-cyan-400 font-semibold'
                    : line.includes('نجاح') || line.includes('✓')
                    ? 'text-emerald-400'
                    : line.includes('GIT')
                    ? 'text-pink-400'
                    : line.startsWith('>')
                    ? 'text-amber-300 font-bold'
                    : 'text-slate-300 whitespace-pre-wrap'
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commit Modal */}
      {showCommitModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-pink-400" />
              <span>تسجيل التغييرات (Git Commit & Push)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              سيتم دفع التعديلات عبر مسار النشر (CI/CD Pipeline) لاختبارها وبنائها تلقائياً.
            </p>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-cyan-500 mb-4 font-mono"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCommitModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleCommit}
                className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-pink-600/30"
              >
                دفع التعديل (Push)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
