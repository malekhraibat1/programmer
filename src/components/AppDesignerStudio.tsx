import { useState } from 'react';
import { sound } from '../utils/audio.ts';
import { 
  getStoredDesignerProjects, 
  saveStoredDesignerProjects, 
  DesignerProject, 
  DesignerElement 
} from '../utils/storage.ts';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Code2, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Palette, 
  Layers, 
  Download, 
  Sparkles, 
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Cpu,
  Video,
  Bot,
  Gauge,
  Sliders,
  RotateCcw
} from 'lucide-react';

interface AppDesignerStudioProps {
  onSendCodeToIde?: (code: string, filename?: string) => void;
  onSaveSnippetToVault?: (code: string, title: string) => void;
}

const TEMPLATES: Omit<DesignerProject, 'id' | 'updatedAt'>[] = [
  {
    title: 'لوحة تحكم SaaS المتقدمة (Developer Dashboard)',
    description: 'واجهة متكاملة مع إحصائيات السيرفرات والشبكة ومحرك الذكاء الاصطناعي',
    targetFramework: 'React + Tailwind',
    elements: [
      {
        id: 't1-1',
        type: 'heading',
        title: 'شريط العنوان الرئيسي',
        content: 'DevCore Cloud Dashboard - النظم الموزعة',
        style: { theme: 'cyan', variant: 'neon', size: 'xl', width: 'full' },
      },
      {
        id: 't1-2',
        type: 'metric',
        title: 'معدل الطلبات في الثانية',
        content: '4,920 RPS • زمن الاستجابة: 0.8ms • الذاكرة: 14%',
        style: { theme: 'emerald', variant: 'glass', size: 'md', width: 'third' },
      },
      {
        id: 't1-3',
        type: 'camera_feed',
        title: 'كاميرا المراقبة الحية',
        content: 'Hik-Connect 4K Ultra HD • غرفة السيرفرات المركزية',
        style: { theme: 'cyan', variant: 'glass', size: 'md', width: 'third' },
      },
      {
        id: 't1-4',
        type: 'ai_chat',
        title: 'المساعد المعماري الذكي',
        content: 'DeepSeek R1 + Claude 4 متصلان وجاهزان لتوليد الأكواد',
        style: { theme: 'violet', variant: 'neon', size: 'md', width: 'third' },
      },
    ],
  },
  {
    title: 'صفحة هبوط تقنية حديثة (Modern Tech Landing)',
    description: 'واجهة عصرية بتصميم فضائي نيون للأنظمة البرمجية',
    targetFramework: 'React + Tailwind',
    elements: [
      {
        id: 't2-1',
        type: 'heading',
        title: 'العنوان الترويجي الرئيسي',
        content: 'الجيل القادم من هندسة النظم والبرمجيات الذكية',
        style: { theme: 'cyan', variant: 'neon', size: 'xl', width: 'full' },
      },
      {
        id: 't2-2',
        type: 'paragraph',
        title: 'وصف النظام',
        content: 'منظومة DevCore المصممة بإشراف المهندس مالك حريبات تدمج أحدث تقنيات المعمارية السحابية والذكاء الاصطناعي متعدد النماذج.',
        style: { theme: 'slate', variant: 'glass', size: 'md', width: 'full' },
      },
      {
        id: 't2-3',
        type: 'button',
        title: 'زر البدء الفوري',
        content: 'ابدأ استكشاف المجمع التقني 3D الآن',
        style: { theme: 'cyan', variant: 'neon', size: 'lg', width: 'half' },
      },
      {
        id: 't2-4',
        type: 'card',
        title: 'المزايا الفائقة',
        content: 'أداء فائق مع كود نظيف وتأمين شامل بشهادات AES-256 ومراقبة كاميرات CCTV مدمجة.',
        style: { theme: 'violet', variant: 'glass', size: 'md', width: 'half' },
      },
    ],
  },
];

export function AppDesignerStudio({
  onSendCodeToIde,
  onSaveSnippetToVault,
}: AppDesignerStudioProps) {
  const [projects, setProjects] = useState<DesignerProject[]>(getStoredDesignerProjects);
  const [currentProject, setCurrentProject] = useState<DesignerProject>(
    projects[0] || {
      id: 'proj-new',
      title: 'مشروع تصميم جديد',
      description: 'تصميم صفحة ويب تفاعلية',
      targetFramework: 'React + Tailwind',
      updatedAt: new Date().toISOString(),
      elements: [],
    }
  );
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Auto-save whenever current project changes
  const updateAndSaveProject = (updated: DesignerProject) => {
    setCurrentProject(updated);
    const updatedList = projects.map((p) => (p.id === updated.id ? updated : p));
    if (!updatedList.some((p) => p.id === updated.id)) {
      updatedList.unshift(updated);
    }
    setProjects(updatedList);
    saveStoredDesignerProjects(updatedList);
  };

  const handleAddElement = (type: DesignerElement['type']) => {
    sound.playClick(700);
    const newEl: DesignerElement = {
      id: `el-${Date.now().toString(36)}`,
      type,
      title: type === 'heading' ? 'عنوان رئيسي جديد' : type === 'button' ? 'زر إجراء تفاعلي' : type === 'card' ? 'بطاقة برمجية ذكية' : type === 'metric' ? 'مؤشر أداء حي' : type === 'camera_feed' ? 'نافذة بث كاميرا CCTV' : type === 'ai_chat' ? 'صندوق محادثة الذكاء الاصطناعي' : 'فقرة نصية جديدة',
      content: type === 'heading' ? 'عنوان التطبيق العصري' : type === 'button' ? 'تنفيذ الإجراء الفوري' : type === 'card' ? 'محتوى البطاقة البرمجية الحديثة' : type === 'metric' ? 'CPU: 12% • RPS: 3,450' : type === 'camera_feed' ? 'Hik-Connect / ICSee Feed' : type === 'ai_chat' ? 'اسأل المساعد الذكي' : 'نص توضيحي وشرح للخدمة المعمارية.',
      style: {
        theme: 'cyan',
        variant: 'neon',
        size: 'md',
        width: type === 'heading' || type === 'paragraph' ? 'full' : 'half',
      },
    };

    const updated = {
      ...currentProject,
      elements: [...currentProject.elements, newEl],
      updatedAt: new Date().toISOString(),
    };
    updateAndSaveProject(updated);
    setSelectedElementId(newEl.id);
  };

  const handleRemoveElement = (id: string) => {
    sound.playClick(400);
    const updated = {
      ...currentProject,
      elements: currentProject.elements.filter((el) => el.id !== id),
      updatedAt: new Date().toISOString(),
    };
    updateAndSaveProject(updated);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleMoveElement = (index: number, dir: 'up' | 'down') => {
    sound.playClick(500);
    const items = [...currentProject.elements];
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    updateAndSaveProject({ ...currentProject, elements: items });
  };

  const handleLoadTemplate = (t: typeof TEMPLATES[0]) => {
    sound.playClick(800);
    const newProj: DesignerProject = {
      id: `proj-${Date.now()}`,
      title: t.title,
      description: t.description,
      targetFramework: t.targetFramework,
      elements: JSON.parse(JSON.stringify(t.elements)),
      updatedAt: new Date().toISOString(),
    };
    updateAndSaveProject(newProj);
  };

  // Generate Real Production React + Tailwind Code
  const generatedReactCode = `/**
 * Generated by DevCore App Designer Studio
 * Project: ${currentProject.title}
 * Architect: Eng. Malek Hraibat
 */
import React, { useState } from 'react';

export default function ${currentProject.title.replace(/[^a-zA-Z0-9]/g, '') || 'DevCoreApp'}() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-6 selection:bg-cyan-500 selection:text-white" dir="rtl">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-4">
${currentProject.elements.map((el) => {
  const widthClass = el.style.width === 'full' ? 'w-full' : el.style.width === 'half' ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full md:w-[calc(33.33%-0.7rem)]';
  if (el.type === 'heading') {
    return `          {/* Heading */}
          <div className="${widthClass} p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent">
              ${el.content}
            </h1>
          </div>`;
  }
  if (el.type === 'paragraph') {
    return `          {/* Paragraph */}
          <div className="${widthClass} p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            <p>${el.content}</p>
          </div>`;
  }
  if (el.type === 'button') {
    return `          {/* Action Button */}
          <div className="${widthClass}">
            <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
              ${el.content}
            </button>
          </div>`;
  }
  if (el.type === 'metric') {
    return `          {/* Metric Gauge */}
          <div className="${widthClass} p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur">
            <div className="text-xs text-emerald-400 font-mono mb-1">${el.title}</div>
            <div className="text-lg font-bold text-white font-mono">${el.content}</div>
          </div>`;
  }
  if (el.type === 'camera_feed') {
    return `          {/* Camera Feed Widget */}
          <div className="${widthClass} p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40">
            <div className="text-xs text-cyan-300 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>${el.title}</span>
            </div>
            <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-slate-800 text-xs font-mono text-cyan-400">
              [LIVE CCTV STREAM - H.265+]
            </div>
          </div>`;
  }
  return `          {/* Card */}
          <div className="${widthClass} p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">${el.title}</h3>
            <p className="text-xs text-slate-300">${el.content}</p>
          </div>`;
}).join('\n')}
        </div>
      </main>
    </div>
  );
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedReactCode);
    sound.playClick(900);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToIde = () => {
    sound.playDoorOpen();
    if (onSendCodeToIde) {
      onSendCodeToIde(generatedReactCode, `${currentProject.title.toLowerCase().replace(/\s+/g, '_')}.tsx`);
    }
  };

  const handleDownloadCode = () => {
    sound.playClick(800);
    const blob = new Blob([generatedReactCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DevCoreDesignedApp.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-cyan-500 selection:text-white" dir="rtl">
      {/* Studio Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layout className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                استوديو تصميم التطبيقات والصفحات (DevCore App Studio)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Visual Builder
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              كل ما يلزم لتصميم وهندسة الواجهات والتطبيقات البرمجية مع توليد كود React وتصدير مباشر وحفظ تلقائي
            </p>
          </div>
        </div>

        {/* Viewport switchers & Tab modes */}
        <div className="flex items-center gap-2">
          {/* Viewport Width */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { sound.playClick(600); setViewport('desktop'); }}
              className={`p-1.5 rounded-lg ${viewport === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              title="سطح المكتب (Desktop 100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => { sound.playClick(600); setViewport('tablet'); }}
              className={`p-1.5 rounded-lg ${viewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              title="جهاز لوحي (Tablet 768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => { sound.playClick(600); setViewport('mobile'); }}
              className={`p-1.5 rounded-lg ${viewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              title="هاتف ذكي (Mobile 380px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Mode: Visual Canvas vs Generated Code */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { sound.playClick(600); setActiveTab('visual'); }}
              className={`px-3 py-1 rounded-lg ${activeTab === 'visual' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              المعاينة المرئية
            </button>
            <button
              onClick={() => { sound.playClick(600); setActiveTab('code'); }}
              className={`px-3 py-1 rounded-lg ${activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              كود React + Tailwind
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
            title="نسخ الكود"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {onSendCodeToIde && (
            <button
              onClick={handleSendToIde}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>إرسال للـ IDE</span>
            </button>
          )}

          <button
            onClick={handleDownloadCode}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
            title="تحميل كملف .tsx"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Component Toolbox Sidebar */}
        <div className="w-full lg:w-72 bg-slate-900/95 border-b lg:border-b-0 lg:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
          <div>
            <span className="text-xs font-bold text-slate-200 block mb-2">
              قوالب جاهزة للتحميل الفوري:
            </span>
            <div className="space-y-1.5">
              {TEMPLATES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadTemplate(t)}
                  className="w-full text-right p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs transition-all block"
                >
                  <div className="font-bold text-cyan-300">{t.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-200 block mb-2">
              مكتبة المكونات البرمجية (أضف بنقرة):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => handleAddElement('heading')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>عنوان Header</span>
              </button>
              <button
                onClick={() => handleAddElement('paragraph')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>فقرة Text</span>
              </button>
              <button
                onClick={() => handleAddElement('button')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>زر Button</span>
              </button>
              <button
                onClick={() => handleAddElement('card')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>بطاقة Card</span>
              </button>
              <button
                onClick={() => handleAddElement('metric')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>مؤشر Metric</span>
              </button>
              <button
                onClick={() => handleAddElement('camera_feed')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all active:scale-95"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>كاميرا CCTV</span>
              </button>
              <button
                onClick={() => handleAddElement('ai_chat')}
                className="col-span-2 p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 text-violet-400" />
                <span>صندوق ذكاء اصطناعي AI Chat Widget</span>
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>عدد المكونات:</span>
              <span className="text-cyan-300 font-bold">{currentProject.elements.length}</span>
            </div>
            <div className="flex justify-between">
              <span>الحفظ التلقائي:</span>
              <span className="text-emerald-400 font-bold">نشط في الذاكرة</span>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950/60 flex items-start justify-center">
          <div 
            className={`w-full transition-all duration-300 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md ${
              viewport === 'mobile' 
                ? 'max-w-sm' 
                : viewport === 'tablet' 
                ? 'max-w-2xl' 
                : 'max-w-5xl'
            }`}
          >
            {activeTab === 'visual' ? (
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-cyan-400" />
                    <span>معاينة حية للمشروع: {currentProject.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    عرض: {viewport === 'mobile' ? '380px' : viewport === 'tablet' ? '768px' : '100%'}
                  </span>
                </div>

                {currentProject.elements.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-800 rounded-xl">
                    انقر على أي مكون من القائمة لإضافته إلى التصميم.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {currentProject.elements.map((el, index) => {
                      const isSelected = selectedElementId === el.id;
                      const widthClass = el.style.width === 'full' ? 'w-full' : el.style.width === 'half' ? 'w-full md:w-[calc(50%-0.5rem)]' : 'w-full md:w-[calc(33.33%-0.7rem)]';

                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`relative group rounded-xl p-4 transition-all duration-150 cursor-pointer border ${widthClass} ${
                            isSelected
                              ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-slate-900 shadow-lg'
                              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                          }`}
                        >
                          {/* Element Controls Hover Bar */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 p-1 rounded-lg border border-slate-700 z-10">
                            {index > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveElement(index, 'up'); }}
                                className="p-1 hover:text-cyan-300"
                                title="تحريك لأعلى"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {index < currentProject.elements.length - 1 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveElement(index, 'down'); }}
                                className="p-1 hover:text-cyan-300"
                                title="تحريك لأسفل"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveElement(el.id); }}
                              className="p-1 hover:text-red-400"
                              title="حذف المكون"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Element Content Render */}
                          {el.type === 'heading' && (
                            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                              {el.content}
                            </h2>
                          )}

                          {el.type === 'paragraph' && (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {el.content}
                            </p>
                          )}

                          {el.type === 'button' && (
                            <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-bold text-xs shadow-md">
                              {el.content}
                            </button>
                          )}

                          {el.type === 'metric' && (
                            <div>
                              <div className="text-[10px] text-emerald-400 font-mono mb-1">{el.title}</div>
                              <div className="text-sm font-bold text-white font-mono">{el.content}</div>
                            </div>
                          )}

                          {el.type === 'camera_feed' && (
                            <div className="space-y-1">
                              <div className="text-[10px] text-cyan-300 font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <span>{el.title}</span>
                              </div>
                              <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-slate-800 text-[11px] font-mono text-cyan-400">
                                📹 {el.content}
                              </div>
                            </div>
                          )}

                          {el.type === 'ai_chat' && (
                            <div className="space-y-2">
                              <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                                <Bot className="w-3.5 h-3.5 text-violet-400" />
                                <span>{el.title}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                                {el.content}
                              </div>
                            </div>
                          )}

                          {el.type === 'card' && (
                            <div>
                              <div className="text-sm font-bold text-white mb-1">{el.title}</div>
                              <div className="text-xs text-slate-400">{el.content}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Generated Code View */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    React + TypeScript + Tailwind CSS Component Code:
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[600px] leading-relaxed">
                  {generatedReactCode}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
