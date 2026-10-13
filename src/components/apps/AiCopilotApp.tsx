import { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio.ts';
import { AiModelId } from '../../types/index.ts';
import { AI_MODELS } from '../../data/initialData.ts';
import { 
  Sparkles, 
  Send, 
  Code, 
  Copy, 
  Check, 
  FolderPlus,
  RefreshCw,
  Cpu,
  BrainCircuit,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';

interface AiCopilotAppProps {
  onSendCodeToIde?: (code: string) => void;
  onSaveSnippetToVault?: (code: string, title: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  code?: string;
  thoughtChain?: string;
  modelId?: AiModelId;
  latencyMs?: number;
  timestamp: string;
}

export function AiCopilotApp({ onSendCodeToIde, onSaveSnippetToVault }: AiCopilotAppProps) {
  const [selectedModel, setSelectedModel] = useState<AiModelId>('chatgpt');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'أهلاً بك يا باشمهندس مالك حريبات. أنا المحرك الذكي المساعد المدمج في منظومة DevCore. يمكنك التبديل بين نماذج الذكاء الاصطناعي الأقوى عالمياً (ChatGPT 4o, DeepSeek R1, Claude 4, Gemini) لتحليل الأكواد وهندسة النظم بدقة فائقة.',
      modelId: 'chatgpt',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeModelConfig = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    sound.playClick(700);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, model: selectedModel }),
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بمحرك الذكاء الاصطناعي');
      }

      const data = await res.json();
      const replyText = data.reply || 'تمت معالجة الطلب بنجاح.';

      // Extract reasoning/thought chain if present (e.g. from DeepSeek)
      let extractedThoughts: string | undefined;
      let cleanText = replyText;

      const thinkMatch = replyText.match(/🧠\s*\*\*تفكير تحليلي متقدم[^:]*\*\*:\s*([\s\S]*?)(?=(?:\n\n###|\n\n```|\n\n[أ-ي]|$))/);
      if (thinkMatch) {
        extractedThoughts = thinkMatch[1].trim();
        cleanText = replyText.replace(thinkMatch[0], '').trim();
      }

      // Extract code block if present
      const codeMatch = cleanText.match(/```(?:typescript|javascript|sql|json|python)?([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1].trim() : undefined;
      const textWithoutCode = cleanText.replace(/```(?:typescript|javascript|sql|json|python)?([\s\S]*?)```/g, '').trim();

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: textWithoutCode || 'إليك الشفرة البرمجية المطلوبة وفق المعايير المعمارية:',
        code: extractedCode,
        thoughtChain: extractedThoughts,
        modelId: selectedModel,
        latencyMs: data.latencyMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (extractedThoughts) {
        setExpandedThoughts((prev) => ({ ...prev, [aiMsgId]: true }));
      }
      sound.playSuccess();
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `عذراً، حدث خطأ أثناء الاتصال: ${err.message || 'خطأ في الشبكة'}. يمكنك إعادة المحاولة.`,
          modelId: selectedModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    sound.playClick(600);
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendToIde = (code: string) => {
    sound.playSuccess();
    if (onSendCodeToIde) {
      onSendCodeToIde(code);
    }
  };

  const handleSaveToVault = (code: string) => {
    sound.playSuccess();
    if (onSaveSnippetToVault) {
      onSaveSnippetToVault(code, `شفرة مولدة عبر ${activeModelConfig.name}`);
    }
  };

  const toggleThoughts = (id: string) => {
    sound.playClick(500);
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Quick suggestions based on selected model
  const getQuickPrompts = () => {
    switch (selectedModel) {
      case 'deepseek':
        return [
          'حلل التعقيد الزمني والمكاني O(N) لخوارزمية LRU Cache متزامنة',
          'اكتشف ثغرة تسريب الذاكرة في هذا المخطط غير المتزامن',
          'صمم خوارزمية توزيع حمل Consistent Hashing مع مصفوفة عقد',
        ];
      case 'claude':
        return [
          'اكتب كود Clean Code دفاعي لمعالجة مدفوعات مع Rollback Transaction',
          'صمم معمارية Domain-Driven Design لنظام Microservices متعدد النطاقات',
          'راجع كود TypeScript هذا واقترح تحسينات قوية للأنواع الصارمة Strict Types',
        ];
      case 'chatgpt':
        return [
          'اكتب معمارية RESTful API سريعة مع Zod Validation ومصادقة JWT',
          'كيف نربط Redis Pub/Sub مع WebSocket لمزامنة البيانات اللحظية؟',
          'صمم خط أنابيب CI/CD متعدد المراحل مع Zero-Downtime Deployment',
        ];
      case 'gemini':
      default:
        return [
          'حلل لي أفضل طريقة لربط خادم Node.js مع Google Cloud وKubernetes',
          'اكتب خوارزمية سريعة لمعالجة أحداث السلسلة الموزعة Event Mesh',
          'كيف أضمن أعلى معايير الأداء والـ Throughput في V8 Engine؟',
        ];
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080c16] text-slate-200 text-xs font-mono select-none">
      {/* Top Multi-Model Selector Bar */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <span className="text-slate-500 text-[11px] font-mono mr-1 shrink-0">النموذج الذكي:</span>
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
                  borderColor: isSelected ? model.borderColor : undefined,
                  backgroundColor: isSelected ? model.accentBg : undefined,
                  color: isSelected ? model.color : undefined,
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                  isSelected
                    ? 'shadow-md scale-102'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: model.color }}
                />
                <span>{model.name}</span>
                <span className="text-[9px] opacity-75 font-normal hidden sm:inline">
                  ({model.provider})
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-900 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>محادثة جديدة</span>
        </button>
      </div>

      {/* Model Active Profile Banner */}
      <div 
        className="px-3 py-1.5 border-b border-slate-800/60 flex items-center justify-between text-[11px]"
        style={{ backgroundColor: `${activeModelConfig.color}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold" style={{ color: activeModelConfig.color }}>
            {activeModelConfig.version}:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            {activeModelConfig.description}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{activeModelConfig.specialty}</span>
        </div>
      </div>

      {/* Suggested Quick Questions for Active Model */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
        <span className="text-slate-500 shrink-0">مقترحات {activeModelConfig.badge}:</span>
        {getQuickPrompts().map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            style={{
              borderColor: `${activeModelConfig.color}35`,
            }}
            className="px-2.5 py-1 rounded-md bg-slate-900 border text-slate-300 hover:bg-slate-800 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span style={{ color: activeModelConfig.color }}>✦</span>
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono select-text">
        {messages.map((msg) => {
          const msgModelConfig = msg.modelId 
            ? AI_MODELS.find((m) => m.id === msg.modelId) || activeModelConfig 
            : activeModelConfig;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                <span>
                  {msg.sender === 'user' ? 'المهندس مالك حريبات' : `${msgModelConfig.name} (${msgModelConfig.provider})`}
                </span>
                <span>·</span>
                <span className="tabular-nums">{msg.timestamp}</span>
                {msg.latencyMs && (
                  <span className="text-cyan-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{msg.latencyMs}ms</span>
                  </span>
                )}
              </div>

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 space-y-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/10'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                }`}
                style={
                  msg.sender !== 'user'
                    ? {
                        borderLeft: `3px solid ${msgModelConfig.color}`,
                      }
                    : undefined
                }
              >
                {/* DeepSeek R1 Thought Chain Collapsible */}
                {msg.thoughtChain && (
                  <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 overflow-hidden mb-2">
                    <button
                      onClick={() => toggleThoughts(msg.id)}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-sky-300 font-bold text-[11px] bg-sky-950/40 hover:bg-sky-950/60 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-sky-400" />
                        <span>سلسلة التفكير والاستدلال العميق (DeepSeek R1 Reasoning)</span>
                      </div>
                      {expandedThoughts[msg.id] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedThoughts[msg.id] && (
                      <div className="p-3 text-[11px] text-sky-200/90 bg-slate-950/60 whitespace-pre-wrap leading-relaxed border-t border-sky-500/20">
                        {msg.thoughtChain}
                      </div>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Extracted Code Snippet */}
                {msg.code && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-[#060910]">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800/80">
                      <span className="text-[10px] text-cyan-400 font-mono">
                        TypeScript / Clean Architecture
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyCode(msg.code!, msg.id)}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ'}</span>
                        </button>

                        <button
                          onClick={() => handleSendToIde(msg.code!)}
                          className="px-2 py-0.5 rounded text-[10px] bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 transition-colors"
                        >
                          <Code className="w-3 h-3" />
                          <span>إرسال إلى IDE</span>
                        </button>

                        <button
                          onClick={() => handleSaveToVault(msg.code!)}
                          className="px-2 py-0.5 rounded text-[10px] bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center gap-1 transition-colors"
                        >
                          <FolderPlus className="w-3 h-3" />
                          <span>حفظ بالسجل</span>
                        </button>
                      </div>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                      <code>{msg.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <span 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeModelConfig.color }}
            />
            <span style={{ color: activeModelConfig.color }}>
              جاري المعالجة والاستدلال عبر {activeModelConfig.name}...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Composer Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-cyan-500/60 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`اسأل ${activeModelConfig.name} عن الخوارزميات، المعمارية، حل المشاكل...`}
              disabled={isLoading}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              backgroundColor: activeModelConfig.color,
            }}
            className="px-4 py-2 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
}
