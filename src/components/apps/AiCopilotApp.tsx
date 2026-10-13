import { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio.ts';
import { 
  Sparkles, 
  Send, 
  Code, 
  ShieldCheck, 
  Layers, 
  Copy, 
  Check, 
  FolderPlus,
  RefreshCw,
  Terminal
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
  timestamp: string;
}

export function AiCopilotApp({ onSendCodeToIde, onSaveSnippetToVault }: AiCopilotAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'أهلاً بك يا باشمهندس مالك حريبات. أنا المحرك الذكي المساعد المدمج في منظومة DevCore. جاهز لتحليل الأكواد، اقتراح المعماريات الموزعة، تدقيق الأمان، وكتابة الخوارزميات بكفاءة عالية.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بمحرك الذكاء الاصطناعي');
      }

      const data = await res.json();
      const replyText = data.reply || 'تمت معالجة الطلب بنجاح.';

      // Extract code block if present
      const codeMatch = replyText.match(/```(?:typescript|javascript|sql|json|python)?([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1].trim() : undefined;

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText.replace(/```(?:typescript|javascript|sql|json|python)?([\s\S]*?)```/g, '').trim() || 'إليك الكود المطلوب:',
        code: extractedCode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      sound.playSuccess();
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `عذراً، حدث خطأ أثناء الاتصال: ${err.message || 'خطأ في الشبكة'}. يمكنك إعادة المحاولة.`,
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
      onSaveSnippetToVault(code, 'شفرة مولدة عبر الذكاء الاصطناعي');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080c16] text-slate-200 text-xs font-mono select-none">
      {/* App Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>المساعد الذكي (DevCore AI Neural Copilot)</span>
              <span className="text-[10px] text-violet-400 font-mono px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                Gemini 3.8 Flash
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              مخصص لمعايير وهندسة المهندس مالك حريبات
            </span>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>محادثة جديدة</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
        <span className="text-slate-500 shrink-0">مهام سريعة:</span>
        {[
          'اكتب خوارزمية لمعالجة مهام غير متزامنة مع حماية الذاكرة',
          'ما هي أفضل ممارسة لمعمارية Microservices مرنة؟',
          'كيف أضمن Zero-Downtime في نشر الحاويات السحابية؟',
          'حلل لي أفضل طريقة لربط Redis مع PostgreSQL',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-violet-300 hover:bg-slate-800 hover:border-violet-500/40 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono select-text">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
              <span>{msg.sender === 'user' ? 'المهندس مالك حريبات' : 'DevCore AI Copilot'}</span>
              <span>·</span>
              <span className="tabular-nums">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/10'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.code && (
                <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
                    <span>الكود المقترح:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(msg.code!, msg.id)}
                        className="hover:text-slate-200 flex items-center gap-1"
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
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Code className="w-3 h-3" />
                        <span>فتح في المحرر</span>
                      </button>
                      <button
                        onClick={() => handleSaveToVault(msg.code!)}
                        className="text-pink-400 hover:text-pink-300 flex items-center gap-1"
                      >
                        <FolderPlus className="w-3 h-3" />
                        <span>حفظ بالسجل</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 text-cyan-200 text-[11px] leading-5 font-mono overflow-x-auto select-all">
                    {msg.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-3">
            <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
            <span>الذكاء الاصطناعي يقوم بالتفكير والصياغة البرمجية...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اسأل المساعد الذكي أو اطلب كتابة كود مخصص..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none text-xs font-mono focus:border-violet-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>إرسال</span>
        </button>
      </form>
    </div>
  );
}
