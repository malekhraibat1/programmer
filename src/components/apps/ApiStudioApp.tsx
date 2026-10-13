import { useState } from 'react';
import { API_ENDPOINTS } from '../../data/initialData.ts';
import { ApiEndpoint } from '../../types/index.ts';
import { sound } from '../../utils/audio.ts';
import { Send, Check, Copy } from 'lucide-react';

interface ApiStudioAppProps {
  onRequestSent?: (endpoint: string) => void;
}

export function ApiStudioApp({ onRequestSent }: ApiStudioAppProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState(API_ENDPOINTS[0].path);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(API_ENDPOINTS[0].method);
  const [requestBody, setRequestBody] = useState(API_ENDPOINTS[0].defaultPayload || '');
  const [activeTab, setActiveTab] = useState<'params' | 'body' | 'headers'>('body');
  
  const [isLoading, setIsLoading] = useState(false);
  const [responseState, setResponseState] = useState<{
    status: number;
    timeMs: number;
    body: unknown;
    timestamp: string;
  } | null>({
    status: API_ENDPOINTS[0].response.status,
    timeMs: API_ENDPOINTS[0].response.timeMs,
    body: API_ENDPOINTS[0].response.body,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (ep: ApiEndpoint) => {
    sound.playClick(600);
    setSelectedEndpoint(ep);
    setCustomPath(ep.path);
    setMethod(ep.method);
    setRequestBody(ep.defaultPayload || '');
  };

  const handleSend = () => {
    sound.playExecute();
    setIsLoading(true);
    if (onRequestSent) {
      onRequestSent(customPath);
    }

    const start = performance.now();
    setTimeout(() => {
      const end = performance.now();
      const actualTime = Math.round(end - start) + Math.floor(Math.random() * 8 + 12);
      
      setResponseState({
        status: method === 'POST' ? 201 : 200,
        timeMs: actualTime,
        body: selectedEndpoint.response.body,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsLoading(false);
      sound.playSuccess();
    }, 450);
  };

  const handleCopyResponse = () => {
    if (!responseState) return;
    sound.playClick(600);
    navigator.clipboard.writeText(JSON.stringify(responseState.body, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'POST': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'PUT': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-200 text-xs font-mono select-none">
      {/* Top Request Composer */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/70 space-y-2.5 shrink-0">
        <div className="flex items-center gap-2">
          {/* Method Selector */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold font-mono outline-none bg-slate-900 cursor-pointer ${getMethodBadge(method)}`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          {/* URL Bar */}
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-cyan-500">
            <span className="text-slate-500 text-[11px] font-mono select-none pl-1">
              https://mesh.devcore.internal
            </span>
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 outline-none text-xs font-mono"
              placeholder="/api/v1/..."
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-md shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? 'جاري الإرسال...' : 'إرسال (Send)'}</span>
          </button>
        </div>

        {/* Quick Presets Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 shrink-0">المسارات الجاهزة:</span>
          {API_ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleSelectPreset(ep)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors border ${
                selectedEndpoint.id === ep.id
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              <span className="mr-1.5 font-bold opacity-75">{ep.method}</span>
              <span>{ep.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split: Request Specs vs Response Viewer */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: Request Config */}
        <div className="flex flex-col border-b md:border-b-0 md:border-l border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-1.5 bg-slate-950/80">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setActiveTab('body')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'body'
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                جسم الطلب (JSON Body)
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'headers'
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                الترويسات (Headers)
              </button>
            </div>
            <span className="text-[10px] text-slate-500">{selectedEndpoint.description}</span>
          </div>

          <div className="flex-1 p-3 flex flex-col overflow-hidden">
            {activeTab === 'body' ? (
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                className="w-full flex-1 bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-cyan-200 text-xs font-mono outline-none resize-none focus:border-cyan-500/50"
              />
            ) : (
              <div className="space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-300">Content-Type:</span>
                  <span className="text-cyan-400">application/json</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-300">Authorization:</span>
                  <span className="text-cyan-400">Bearer devcore_mesh_token_x9</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-300">X-DevCore-Engine:</span>
                  <span className="text-cyan-400">v2.4-Production</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Response */}
        <div className="flex flex-col bg-[#070b14]">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-1.5 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">استجابة الشبكة (HTTP Response):</span>
              {responseState && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tabular-nums">
                    {responseState.status} OK
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {responseState.timeMs}ms
                  </span>
                </div>
              )}
            </div>

            {responseState && (
              <button
                onClick={handleCopyResponse}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-3 overflow-auto">
            {responseState ? (
              <pre className="text-emerald-300 text-[11px] leading-relaxed select-text font-mono">
                {JSON.stringify(responseState.body, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                اضغط "إرسال" لرؤية استجابة الخادم اللحظية
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
