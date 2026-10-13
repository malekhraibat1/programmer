import { useState } from 'react';
import { sound } from '../../utils/audio.ts';
import { ShieldCheck, Lock, Unlock, Key, RefreshCw, Check } from 'lucide-react';

export function SecurityApp() {
  const [tokenInput, setTokenInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtZW5naW5lZXItMDA3Iiwicm9sZSI6IlNlbmlvckFyY2hpdGVjdCIsImlhdCI6MTc3NjIwODAwMCwiZXhwIjoxNzc2MjE1MjAwLCJwZXJtaXNzaW9ucyI6WyJyZWFkOmFsbCIsIndyaXRlOnN5c3RlbSIsImRlcGxveTpjbG91ZCJdfQ.sig_devcore_mock_valid'
  );

  const [wafActive, setWafActive] = useState(true);
  const [rateLimiterActive, setRateLimiterActive] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [copied, setCopied] = useState(false);

  // Decoded payload
  const decodedHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const decodedPayload = {
    sub: 'dev-engineer-007',
    role: 'SeniorArchitect',
    permissions: ['read:all', 'write:system', 'deploy:cloud'],
    iat: 1776208000,
    exp: 1776215200,
    meshVerified: true,
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, val: boolean) => {
    sound.playClick(val ? 400 : 700);
    setter(!val);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c16] text-slate-200 text-xs font-mono select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-100">DevCore Security & Auth Shield</span>
          <span className="text-slate-500 text-[11px]">| Zero-Trust Token Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono text-[11px]">● حماية الطبقة السحابية نشطة</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Security Controls & Matrix (4 cols) */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-l border-slate-800/80 p-4 space-y-4 bg-slate-950/40 overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>سياسات الحماية والجدار الناري</span>
            </h4>
            
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">جدار حماية WAF</div>
                  <div className="text-[10px] text-slate-400">حظر هجمات الحقن و DDoS</div>
                </div>
                <button
                  onClick={() => handleToggle(setWafActive, wafActive)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    wafActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {wafActive ? 'مفعل' : 'معطل'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">محدد المعدل (Rate Limiter)</div>
                  <div className="text-[10px] text-slate-400">100 req/sec لكل عنوان IP</div>
                </div>
                <button
                  onClick={() => handleToggle(setRateLimiterActive, rateLimiterActive)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    rateLimiterActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {rateLimiterActive ? 'مفعل' : 'معطل'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">المصادقة الثنائية (MFA)</div>
                  <div className="text-[10px] text-slate-400">إلزامية لكافة العمليات الحساسة</div>
                </div>
                <button
                  onClick={() => handleToggle(setMfaEnforced, mfaEnforced)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    mfaEnforced
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {mfaEnforced ? 'مفعل' : 'معطل'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <h5 className="text-[11px] font-bold text-slate-400 mb-2">مصفوفة الصلاحيات (RBAC):</h5>
            <div className="text-[10px] space-y-1 text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>SeniorArchitect</span>
                <span className="text-cyan-400 font-bold">Full Access</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>DevOps Operator</span>
                <span className="text-pink-400">Deploy & Telemetry</span>
              </div>
              <div className="flex justify-between py-1">
                <span>API Consumer</span>
                <span className="text-emerald-400">Read & Query</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: JWT Inspector & Token Parser (8 cols) */}
        <div className="md:col-span-8 flex flex-col p-4 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>محلل رموز الأمان المشفرة (JWT Token Inspector):</span>
              </span>
              <button
                onClick={() => {
                  sound.playSuccess();
                  navigator.clipboard.writeText(tokenInput);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                <span>{copied ? 'تم النسخ' : 'نسخ الرمز'}</span>
              </button>
            </div>
            <textarea
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-indigo-300 font-mono text-[11px] outline-none resize-none focus:border-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {/* Header */}
            <div className="bg-slate-950 border border-rose-950/60 rounded-lg p-3">
              <div className="text-rose-400 font-bold text-[11px] mb-2 border-b border-rose-950/60 pb-1">
                الترويسة (Header - Algorithm & Type)
              </div>
              <pre className="text-rose-200 text-[11px] font-mono leading-relaxed">
                {JSON.stringify(decodedHeader, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="bg-slate-950 border border-indigo-950/60 rounded-lg p-3">
              <div className="text-indigo-400 font-bold text-[11px] mb-2 border-b border-indigo-950/60 pb-1">
                الحمولة (Payload - Claims & Permissions)
              </div>
              <pre className="text-indigo-200 text-[11px] font-mono leading-relaxed">
                {JSON.stringify(decodedPayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
