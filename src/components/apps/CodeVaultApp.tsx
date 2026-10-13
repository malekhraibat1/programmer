import { useState, useEffect } from 'react';
import { SavedSnippet } from '../../types/index.ts';
import { INITIAL_SAVED_SNIPPETS } from '../../data/initialData.ts';
import { sound } from '../../utils/audio.ts';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Code, 
  Sparkles, 
  Tag, 
  Calendar,
  FileCode,
  CheckCircle2
} from 'lucide-react';

interface CodeVaultAppProps {
  onSendToIde?: (code: string, filename: string) => void;
  onAskAiWithCode?: (code: string) => void;
}

const STORAGE_KEY = 'malek_hraibat_code_vault_v1';

export function CodeVaultApp({ onSendToIde, onAskAiWithCode }: CodeVaultAppProps) {
  const [snippets, setSnippets] = useState<SavedSnippet[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_SAVED_SNIPPETS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(snippets[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New Snippet Form State
  const [formTitle, setFormTitle] = useState('');
  const [formFilename, setFormFilename] = useState('');
  const [formLanguage, setFormLanguage] = useState('typescript');
  const [formCategory, setFormCategory] = useState<SavedSnippet['category']>('backend');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formCode, setFormCode] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    } catch {
      // ignore
    }
  }, [snippets]);

  const selectedSnippet = snippets.find((s) => s.id === selectedSnippetId) || snippets[0];

  const handleOpenCreate = () => {
    sound.playClick(600);
    setFormTitle('');
    setFormFilename('new-module.ts');
    setFormLanguage('typescript');
    setFormCategory('backend');
    setFormDescription('');
    setFormTags('Malek, Architecture, Core');
    setFormCode('// بصمة المهندس مالك حريبات\nexport function customEngine() {\n  console.log("Eng. Malek Hraibat System Active");\n}');
    setIsCreating(true);
  };

  const handleSaveNew = () => {
    if (!formTitle.trim() || !formCode.trim()) return;

    sound.playSuccess();
    const newSnippet: SavedSnippet = {
      id: `snip-${Date.now()}`,
      title: formTitle,
      filename: formFilename || 'untitled.ts',
      language: formLanguage,
      category: formCategory,
      description: formDescription || 'كود مخصص مسجل في مستودع المهندس مالك حريبات.',
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      code: formCode,
      author: 'المهندس مالك حريبات',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    setSelectedSnippetId(newSnippet.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    sound.playClick(300);
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    if (selectedSnippetId === id && updated.length > 0) {
      setSelectedSnippetId(updated[0].id);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    sound.playClick(600);
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (snippet: SavedSnippet) => {
    sound.playExecute();
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = snippet.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSnippets = snippets.filter((snip) => {
    const matchesCategory = categoryFilter === 'all' || snip.category === categoryFilter;
    const matchesSearch =
      snip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snip.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snip.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#080d17] text-slate-200 text-xs font-mono select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>سجل ومستودع الأكواد (Eng. Malek Hraibat Vault)</span>
              <span className="text-[10px] text-rose-400 font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                {snippets.length} ملفات محفوظة
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              المستودع الشخصي لحفظ الشفرات والخوارزميات للمهندس مالك حريبات
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-all text-xs shadow-md shadow-rose-600/30 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة كود / ملف جديد</span>
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 ml-1">التصنيف:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'backend', label: 'الخدمات (Backend)' },
            { id: 'algorithms', label: 'الخوارزميات' },
            { id: 'database', label: 'قواعد البيانات' },
            { id: 'security', label: 'الأمان' },
            { id: 'infrastructure', label: 'البنية السحابية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick(600);
                setCategoryFilter(cat.id);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap border ${
                categoryFilter === cat.id
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="بحث في سجل الأكواد والوسوم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-slate-200 w-44"
          />
        </div>
      </div>

      {/* Main Split: Left Snippet List vs Right Code Preview */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Snippets Sidebar (4 cols) */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-l border-slate-800/80 bg-slate-950/30 overflow-y-auto p-2 space-y-1.5">
          {filteredSnippets.map((snip) => {
            const isSelected = snip.id === selectedSnippetId;
            return (
              <div
                key={snip.id}
                onClick={() => {
                  sound.playClick(700);
                  setSelectedSnippetId(snip.id);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 border-rose-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate">
                    <FileCode className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{snip.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {snip.language}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span className="text-cyan-400 truncate max-w-[140px]">{snip.filename}</span>
                  <span className="tabular-nums">{snip.createdAt}</span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {snip.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-1">
                  {snip.tags.slice(0, 3).map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSnippets.length === 0 && (
            <div className="text-center p-6 text-slate-500 text-xs">
              لا توجد أكواد مطابقة لبحثك.
            </div>
          )}
        </div>

        {/* Right Preview Viewport (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#070b14] overflow-hidden">
          {selectedSnippet ? (
            <>
              {/* Snippet Header and Actions */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">
                      {selectedSnippet.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedSnippet.filename}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedSnippet.description}
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(selectedSnippet.code, selectedSnippet.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                    title="نسخ الكود"
                  >
                    {copiedId === selectedSnippet.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === selectedSnippet.id ? 'تم النسخ' : 'نسخ'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(selectedSnippet)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                    title="تحميل الملف البرمجي"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل</span>
                  </button>

                  {onSendToIde && (
                    <button
                      onClick={() => onSendToIde(selectedSnippet.code, selectedSnippet.filename)}
                      className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 rounded transition-colors text-[11px] flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>فتح في المحرر</span>
                    </button>
                  )}

                  {onAskAiWithCode && (
                    <button
                      onClick={() => onAskAiWithCode(selectedSnippet.code)}
                      className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/40 rounded transition-colors text-[11px] flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تحليل بالذكاء الاصطناعي</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(selectedSnippet.id)}
                    className="p-1.5 rounded hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                    title="حذف من السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Viewer */}
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-cyan-100 text-[11px] leading-relaxed font-mono select-all whitespace-pre-wrap">
                  {selectedSnippet.code}
                </pre>
              </div>

              {/* Meta Footer */}
              <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/80 text-[10px] text-slate-500 flex items-center justify-between">
                <span>المؤلف: {selectedSnippet.author}</span>
                <span>آخر تحديث: {selectedSnippet.updatedAt}</span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-xs">
              اختر ملفاً من السجل أو أضف كوداً جديداً
            </div>
          )}
        </div>
      </div>

      {/* Create New Snippet Modal */}
      {isCreating && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-rose-400" />
              <span>حفظ كود أو ملف جديد في سجل المهندس مالك حريبات</span>
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">عنوان الشفرة:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: خوارزمية ضغط البيانات"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">اسم الملف البرمجي:</label>
                  <input
                    type="text"
                    value={formFilename}
                    onChange={(e) => setFormFilename(e.target.value)}
                    placeholder="compressor.ts"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">التصنيف:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SavedSnippet['category'])}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500"
                  >
                    <option value="backend">خدمات خلفية (Backend)</option>
                    <option value="algorithms">خوارزميات (Algorithms)</option>
                    <option value="database">قواعد بيانات (Database)</option>
                    <option value="security">أمان وحماية (Security)</option>
                    <option value="infrastructure">بنية تحتية (Infrastructure)</option>
                    <option value="frontend">واجهات (Frontend)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">الوسوم (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="TypeScript, Redis, Performance"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">الوصف:</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="وصف مختصر للوظيفة البرمجية..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">الشفرة البرمجية (Code Content):</label>
                <textarea
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full h-36 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-cyan-200 outline-none resize-none font-mono focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800 mt-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveNew}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs shadow-md shadow-rose-600/30"
              >
                حفظ في السجل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
