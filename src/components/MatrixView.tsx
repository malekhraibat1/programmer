import { AppId, AppNode } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { 
  ArrowLeft, 
  ExternalLink, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Activity, 
  GitMerge, 
  Database, 
  Network, 
  Code,
  Terminal,
  UserCheck
} from 'lucide-react';

interface MatrixViewProps {
  nodes: AppNode[];
  onOpenApp: (id: AppId) => void;
}

export function MatrixView({ nodes, onOpenApp }: MatrixViewProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const architectureLayers = [
    {
      title: 'طبقة المنطق والذكاء الاصطناعي (Core Logic & AI Innovation)',
      desc: 'حيث تولد الخوارزميات وتتحول المتطلبات إلى كود نظيف وقابل للصيانة بمساعدة الذكاء الاصطناعي.',
      apps: ['persona', 'ide', 'ai'] as AppId[],
      color: 'from-cyan-950/40 to-slate-900/60 border-cyan-800/40',
      badgeColor: 'text-cyan-400 bg-cyan-950/50',
    },
    {
      title: 'طبقة التوزيع والشبكات (Networking & Gateway)',
      desc: 'بوابات الـ API، إدارة نقاط النهاية، وتوجيه الحزم بين الخدمات الدقيقة.',
      apps: ['api', 'security'] as AppId[],
      color: 'from-indigo-950/40 to-slate-900/60 border-indigo-800/40',
      badgeColor: 'text-indigo-400 bg-indigo-950/50',
    },
    {
      title: 'طبقة البيانات والمستودع البرمجي (Data & Code Vault)',
      desc: 'الجداول العلائقية، الكاش اللحظي، وسجل الأكواد والملفات المحفوظة للمهندس مالك حريبات.',
      apps: ['database', 'vault'] as AppId[],
      color: 'from-amber-950/40 to-slate-900/60 border-amber-800/40',
      badgeColor: 'text-amber-400 bg-amber-950/50',
    },
    {
      title: 'طبقة الأتمتة والمراقبة (DevOps & Telemetry)',
      desc: 'خطوط النشر التلقائي، رصد الأداء اللحظي، وواجهة الأوامر التفاعلية.',
      apps: ['pipeline', 'telemetry', 'terminal'] as AppId[],
      color: 'from-pink-950/40 to-slate-900/60 border-pink-800/40',
      badgeColor: 'text-pink-400 bg-pink-950/50',
    },
  ];

  return (
    <div className="flex-1 w-full h-full bg-[#070b14] p-6 overflow-y-auto select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Info */}
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-100">
                المصفوفة المعمارية: خارطة المنظومة الهندسية
              </span>
              <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                System Topology
              </span>
            </div>
            <p className="text-xs text-slate-400">
              توضيح ترابط البرامج والمكونات وفق تسلسل الطبقات المعمارية من الفكر البرمجي إلى الاستقرار السحابي.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-cyan-400">● 4 مستويات معمارية</span>
            <span>·</span>
            <span>8 تطبيقات متكاملة</span>
          </div>
        </div>

        {/* The 4 Architectural Layers */}
        <div className="space-y-4">
          {architectureLayers.map((layer, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border bg-gradient-to-r ${layer.color} backdrop-blur-sm space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      0{idx + 1}.
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{layer.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{layer.desc}</p>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-1 rounded self-start sm:self-auto border border-slate-700/60 ${layer.badgeColor}`}
                >
                  LAYER ACTIVE
                </span>
              </div>

              {/* Programs inside this layer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {layer.apps.map((appId) => {
                  const node = nodeMap.get(appId);
                  if (!node) return null;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        sound.playPacketPulse();
                        onOpenApp(node.id);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {node.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {node.nameEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                          {node.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="text-slate-400">{node.category}</span>
                        <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                          <span>فتح البرنامج</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
