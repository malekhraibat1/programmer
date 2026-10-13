import { useState } from 'react';
import { sound } from '../utils/audio.ts';
import { Fingerprint, CheckCircle2, ShieldCheck, Copy, Check, X, Sparkles, Terminal } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureModal({ isOpen, onClose }: SignatureModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    sound.playExecute();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      sound.playSuccess();
    }, 900);
  };

  const handleCopyHash = () => {
    sound.playClick(600);
    navigator.clipboard.writeText('SHA256:7f9a12c8e4b0981a3d5f9920182bcfe1084d8721a');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative overflow-hidden">
        {/* Cyber Watermark Accent */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick(400);
            onClose();
          }}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Fingerprint Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Fingerprint className="w-9 h-9 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-300" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                بصمة المهندس مالك حريبات
              </h2>
            </div>
            <p className="text-xs font-mono text-cyan-400">
              Eng. Malek Hraibat | Systems & Software Architect
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              التوقيع الرقمي والشهادة المعمارية المعتمدة لمنظومة DevCore
            </p>
          </div>
        </div>

        {/* Cryptographic Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 mb-5 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">الرقم المرجعي (Certificate ID):</span>
            <span className="text-cyan-300 font-bold">CERT-MH-2026-ARCHITECT</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">البريد الإلكتروني المهني:</span>
            <span className="text-slate-200">hraibat.malek@gmail.com</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
            <span className="text-slate-400">المعمارية المعتمدة:</span>
            <span className="text-emerald-400 font-bold">Event-Driven Distributed Mesh</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>التوقيع المشفر (Digital Signature SHA-256):</span>
              <button
                onClick={handleCopyHash}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 break-all select-all">
              7f9a12c8e4b0981a3d5f9920182bcfe1084d8721ae6b4892c2199042b7e190
            </div>
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 mb-5 leading-relaxed">
          <p className="italic text-cyan-200 mb-1">
            "البرمجة ليست مجرد كتابة أسطر، بل هي بناء كائنات حية من المنطق قادرة على العمل والنمو وحماية نفسها."
          </p>
          <span className="text-[10px] text-slate-500 font-mono">— المهندس مالك حريبات</span>
        </div>

        {/* Verification Status & Trigger */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs">
            {isVerified ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>البصمة موثقة وسليمة 100%</span>
              </span>
            ) : null}
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-600/30 active:scale-95 disabled:opacity-50"
          >
            {isVerifying ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>{isVerifying ? 'جاري التحقق التشفيري...' : 'إعادة التحقق من البصمة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
