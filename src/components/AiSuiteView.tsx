import { useState } from 'react';
import { AiProgram, AiModelId } from '../types/index.ts';
import { AI_PROGRAMS, AI_MODELS } from '../data/initialData.ts';
import { sound } from '../utils/audio.ts';
import { 
  Sparkles, 
  Cpu, 
  SearchCode, 
  ShieldAlert, 
  CheckCheck, 
  Database, 
  Network, 
  Zap, 
  Layout, 
  Play, 
  Send, 
  Copy, 
  Check, 
  Code, 
  FolderPlus, 
  X,
  ExternalLink,
  BrainCircuit,
  Clock
} from 'lucide-react';

interface AiSuiteViewProps {
  onSendCodeToIde?: (code: string) => void;
  onSaveSnippetToVault?: (code: string, title: string) => void;
}

export function AiSuiteView({ onSendCodeToIde, onSaveSnippetToVault }: AiSuiteViewProps) {
  const [selectedModel, setSelectedModel] = useState<AiModelId>('chatgpt');
  const [selectedProgram, setSelectedProgram] = useState<AiProgram | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultOutput, setResultOutput] = useState<string | null>(null);
  const [extractedCode, setExtractedCode] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activeModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  const getProgramIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Cpu': return <Cpu className={className} />;
      case 'SearchCode': return <SearchCode className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'CheckCheck': return <CheckCheck className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Layout': return <Layout className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleOpenProgram = (prog: AiProgram) => {
    sound.playPacketPulse();
    setSelectedProgram(prog);
    setPromptInput(prog.sampleInput);
    setResultOutput(null);
    setExtractedCode(null);
  };

  const handleExecuteAi = async () => {
    if (!selectedProgram || !promptInput.trim() || isLoading) return;

    sound.playExecute();
    setIsLoading(true);
    setResultOutput(null);
    setExtractedCode(null);

    try {
      const fullPrompt = `${selectedProgram.defaultPrompt}\n\n[المدخلات أو المشكلة]:\n${promptInput}`;

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, model: selectedModel }),
      });

      if (!res.ok) throw new Error('فشل استجابة المحرك الذكي');

      const data = await res.json();
      const reply = data.reply || '';
      setLatencyMs(data.latencyMs || null);

      // Extract code block
      const codeMatch = reply.match(/```(?:typescript|javascript|sql|json|python)?([\s\S]*?)```/);
      if (codeMatch) {
        setExtractedCode(codeMatch[1].trim());
      }

      setResultOutput(reply);
      sound.playSuccess();
    } catch (err: any) {
      setResultOutput(`خطأ في المعالجة: ${err.message || 'تعذر الاتصال'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    sound.playClick(600);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-full bg-[#070b14] p-6 overflow-y-auto select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-100">
                منظومة برامج الذكاء الاصطناعي للمهندس مالك حريبات
              </span>
              <span className="text-xs font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/30">
                8 برامج ذكية متخصصة
              </span>
            </div>
            <p className="text-xs text-slate-400">
              اختر المحرك الذكي المفضل لتشغيل البرامج التحليلية (ChatGPT, DeepSeek R1, Claude 4, Gemini).
            </p>
          </div>

          {/* Model Switcher Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
            {AI_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    sound.playClick(650);
                    setSelectedModel(model.id);
                  }}
                  style={{
                    backgroundColor: isSelected ? model.accentBg : undefined,
                    borderColor: isSelected ? model.borderColor : 'transparent',
                    color: isSelected ? model.color : undefined,
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <span>{model.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 AI Program Cards / Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_PROGRAMS.map((prog) => (
            <div
              key={prog.id}
              onClick={() => handleOpenProgram(prog)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      backgroundColor: `${prog.accentColor}18`,
                      color: prog.accentColor,
                      border: `1px solid ${prog.accentColor}35`,
                    }}
                  >
                    {getProgramIcon(prog.iconName, 'w-5 h-5')}
                  </div>

                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${prog.accentColor}12`,
                      color: prog.accentColor,
                      borderColor: `${prog.accentColor}30`,
                    }}
                  >
                    {prog.badge}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-1">
                  {prog.name}
                </h3>
                <p className="text-[10px] font-mono text-slate-500 mb-2">
                  {prog.nameEn}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {prog.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-500">
                  {prog.category}
                </span>
                <span className="text-violet-400 group-hover:text-cyan-300 flex items-center gap-1 font-semibold group-hover:translate-x-[-2px] transition-transform text-[11px]">
                  <span>فتح وتشغيل</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Workspace Modal when an AI box is clicked */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-violet-500/40 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    backgroundColor: `${selectedProgram.accentColor}20`,
                    color: selectedProgram.accentColor,
                    border: `1px solid ${selectedProgram.accentColor}40`,
                  }}
                >
                  {getProgramIcon(selectedProgram.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedProgram.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedProgram.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Composer */}
            <div className="space-y-2 mb-4 shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>المدخلات أو المسألة البرمجية:</span>
                <button
                  onClick={() => setPromptInput(selectedProgram.sampleInput)}
                  className="text-violet-400 hover:text-violet-300 text-[11px]"
                >
                  تحميل نموذج تجريبي
                </button>
              </div>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="صف المسألة أو الصق الكود المراد معالجته هنا..."
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none resize-none focus:border-violet-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleExecuteAi}
                  disabled={isLoading || !promptInput.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-violet-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white" />
                  )}
                  <span>{isLoading ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'تشغيل التحليل والتوليد'}</span>
                </button>
              </div>
            </div>

            {/* Result Viewport */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 shrink-0">
                <span>نتائج التنفيذ البرمجي (AI Output):</span>

                {resultOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(extractedCode || resultOutput)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'تم النسخ' : 'نسخ النتيجة'}</span>
                    </button>

                    {extractedCode && onSendCodeToIde && (
                      <button
                        onClick={() => {
                          onSendCodeToIde(extractedCode);
                          setSelectedProgram(null);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                      >
                        <Code className="w-3 h-3" />
                        <span>فتح في المحرر</span>
                      </button>
                    )}

                    {extractedCode && onSaveSnippetToVault && (
                      <button
                        onClick={() => {
                          onSaveSnippetToVault(extractedCode, selectedProgram.name);
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                      >
                        <FolderPlus className="w-3 h-3" />
                        <span>حفظ بالسجل</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed select-text">
                {resultOutput ? (
                  <div className="whitespace-pre-wrap">{resultOutput}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                    اضغط "تشغيل التحليل والتوليد" لبدء معالجة المسألة عبر {selectedProgram.nameEn}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
