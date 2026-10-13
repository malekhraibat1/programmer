import { useState, useRef, useEffect } from 'react';
import { AppId } from '../../types/index.ts';
import { sound } from '../../utils/audio.ts';
import { Terminal as TerminalIcon, Send, Sparkles } from 'lucide-react';

interface TerminalAppProps {
  onOpenApp: (id: AppId) => void;
  onTriggerPulse: () => void;
}

interface CommandHistory {
  command: string;
  output: string | string[];
}

export function TerminalApp({ onOpenApp, onTriggerPulse }: TerminalAppProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'welcome',
      output: [
        'DevCore Shell [Version 2.4.0-linux-arm64]',
        'مرحباً بك في طرفية مهندس البرمجيات. اكتب "help" لعرض كافة الأوامر المتاحة.',
      ],
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    sound.playClick(600);
    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    let output: string | string[] = '';

    switch (mainCmd) {
      case 'help':
        output = [
          'الأوامر المتاحة في الطرفية:',
          '  open <app>      - فتح تطبيق معين (ide, api, database, pipeline, security, telemetry, persona)',
          '  status          - فحص الحالة العامة لمنظومة البرمجيات ومسارات الدوائر',
          '  whoami          - استعراض هوية وفلسفة مهندس البرمجيات',
          '  skills          - مصفوفة المهارات والتقنيات الأساسية',
          '  ping            - اختبار زمن الاستجابة والنبضات اللحظية عبر الشبكة',
          '  pulse           - إطلاق دفعة نبضية سريعة عبر لوحة الدوائر الإلكترونية',
          '  clear           - مسح سجل الطرفية',
        ];
        break;

      case 'open':
        if (!arg) {
          output = 'خطأ: حدد اسم التطبيق. مثال: open ide أو open api أو open pipeline';
        } else {
          const validApps: Record<string, AppId> = {
            ide: 'ide',
            code: 'ide',
            api: 'api',
            database: 'database',
            db: 'database',
            pipeline: 'pipeline',
            cicd: 'pipeline',
            security: 'security',
            auth: 'security',
            telemetry: 'telemetry',
            metrics: 'telemetry',
            persona: 'persona',
            me: 'persona',
          };

          const matched = validApps[arg];
          if (matched) {
            onOpenApp(matched);
            output = `✓ تم فتح تطبيق [${matched}] بنجاح على سطح المكتب`;
            sound.playSuccess();
          } else {
            output = `تطبيق غير معروف: "${arg}". الخيارات: ide, api, database, pipeline, security, telemetry, persona`;
          }
        }
        break;

      case 'whoami':
        output = [
          'أنا البرنامج: مهندس البرمجيات (Software Engineer)',
          '------------------------------------------------',
          'الفلسفة: بناء أنظمة معمارية متينة، ذاتية الشفاء، وقابلة للتوسع اللانهائي.',
          'النهج: الكود النظيف، الأتمتة الكاملة، الأمان بالتصميم، والتركيز على القيمة.',
        ];
        break;

      case 'skills':
        output = [
          'التقنيات الأساسية:',
          '  - اللغات: TypeScript, Node.js, Go, Python, SQL',
          '  - الواجهات: React, Tailwind CSS, Motion, Web Audio',
          '  - المعمارية: Event-Driven, Microservices, REST, GraphQL',
          '  - قواعد البيانات: PostgreSQL, Redis, Drizzle ORM',
          '  - السحابة: Docker, Kubernetes, CI/CD, GitOps',
        ];
        break;

      case 'status':
        output = [
          'الحالة العامة للمنظومة:',
          '  - عقد التطبيقات: 8 وحدات نشطة ومتصلة',
          '  - خطوط الدوائر الإلكترونية: 11 مساراً ناقلاً للبيانات',
          '  - زمن الاستجابة الشبكي (P99): 18ms',
          '  - استقرار الـ Event Loop: 99.98% ممتاز',
        ];
        break;

      case 'ping':
        output = [
          'PING mesh.devcore.internal (10.0.4.1): 56 data bytes',
          '64 bytes from 10.0.4.1: icmp_seq=0 ttl=64 time=1.42 ms',
          '64 bytes from 10.0.4.1: icmp_seq=1 ttl=64 time=1.28 ms',
          '✓ خطوط الاتصال الإلكتروني تعمل بأقصى سرعة',
        ];
        break;

      case 'pulse':
        onTriggerPulse();
        sound.playExecute();
        output = '⚡ تم إرسال نبضة إلكترونية عالية التردد عبر كافة مسارات الدوائر!';
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        output = `أمر غير معروف: "${trimmed}". اكتب "help" للحصول على المساعدة.`;
        break;
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
    setInput('');
  };

  const handleQuickCommand = (cmd: string) => {
    handleCommand(cmd);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14] text-slate-200 text-xs font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-bold text-slate-100">DevCore Interactive Terminal (CLI)</span>
        </div>

        <button
          onClick={() => setHistory([])}
          className="text-slate-500 hover:text-slate-300 text-[11px]"
        >
          مسح السجل
        </button>
      </div>

      {/* Quick Command Suggestions */}
      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 shrink-0">أوامر سريعة:</span>
        {['help', 'whoami', 'skills', 'open ide', 'open api', 'open pipeline', 'status', 'pulse'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 hover:bg-slate-800 whitespace-nowrap transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal History Display */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-[11px] select-text">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-slate-500 select-none">developer@devcore:~$</span>
              <span className="font-semibold">{item.command}</span>
            </div>
            <div className="text-slate-300 pl-4 whitespace-pre-wrap leading-relaxed">
              {Array.isArray(item.output)
                ? item.output.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className={
                        line.startsWith('✓')
                          ? 'text-emerald-400'
                          : line.startsWith('⚡')
                          ? 'text-cyan-300 font-bold'
                          : line.includes('خطأ')
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }
                    >
                      {line}
                    </div>
                  ))
                : item.output}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(input);
        }}
        className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center gap-2 shrink-0"
      >
        <span className="text-purple-400 font-mono font-bold select-none">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب أمراً هنا (مثال: open ide أو status أو help)..."
          className="flex-1 bg-transparent text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
          autoFocus
        />
        <button
          type="submit"
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-colors text-xs flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span>إرسال</span>
        </button>
      </form>
    </div>
  );
}
