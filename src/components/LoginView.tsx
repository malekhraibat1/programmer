import { useState } from 'react';
import { sound } from '../utils/audio.ts';
import { saveStoredAuth, StoredAuthState } from '../utils/storage.ts';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (auth: StoredAuthState) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleQuickFill = () => {
    sound.playClick(650);
    setUsername('Malek');
    setPassword('Kk1235');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Verify credentials: Malek / Kk1235
    if (trimmedUser.toLowerCase() === 'malek' && trimmedPass === 'Kk1235') {
      setIsScanning(true);
      sound.playBiometricScan();

      setTimeout(() => {
        setIsScanning(false);
        setSuccessAnimation(true);
        sound.playSecurityAccess();

        const authData: StoredAuthState = {
          isLoggedIn: true,
          username: 'Malek',
          role: 'المهندس المعماري الرئيسي (Lead Systems Architect & Super Admin)',
          loginTime: new Date().toISOString(),
          sessionToken: `DEVCORE-MALEK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        };

        // Auto-save to localStorage
        saveStoredAuth(authData);

        setTimeout(() => {
          onLoginSuccess(authData);
        }, 800);
      }, 1000);
    } else {
      sound.playClick(250);
      setErrorMessage('بيانات الدخول غير صحيحة. يرجى استخدام اسم المستخدم: Malek وكلمة المرور المحددة.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 overflow-hidden selection:bg-cyan-500 selection:text-white" dir="rtl">
      {/* Dynamic Cyber Grid & Neon Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6,182,212,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6,182,212,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Cyberpunk Glow Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Portal Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="relative bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 transition-all duration-300">
          {/* Top Tech Glow Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                  منظومة DevCore الذكية
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  بوابة دخول المهندس مالك حريبات
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                التحقق الأمني الذكي
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">AES-256-GCM</span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  اسم المستخدم (Architect ID)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Malek</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم (مثال: Malek)"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  كلمة المرور (Access Key)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Kk1235</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all pr-4 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Biometric Scan Simulation */}
            <div className="pt-2">
              <div 
                onClick={handleQuickFill}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 cursor-pointer flex items-center justify-between transition-all group"
                title="انقر لتعبئة بيانات المهندس مالك تلقائياً"
              >
                <div className="flex items-center gap-2 text-xs text-cyan-300">
                  <Fingerprint className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>تعبئة سريعة تلقائية لحساب المهندس مالك</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Malek / Kk1235
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isScanning || successAnimation}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                successAnimation
                  ? 'bg-emerald-600 shadow-emerald-500/30'
                  : isScanning
                  ? 'bg-cyan-700 animate-pulse'
                  : 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-[0.98]'
              }`}
            >
              {successAnimation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>تم التحقق بنجاح! جاري فتح المنظومة...</span>
                </>
              ) : isScanning ? (
                <>
                  <Fingerprint className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>جاري فحص البصمة والتوقيع الرقمي...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>تسجيل الدخول للمنظومة الهندسية</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Info & Auto-Save Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              حفظ تلقائي فعّال (Auto-Save Active)
            </span>
            <span className="text-slate-500">v3.5 - 2026 DevCore</span>
          </div>
        </div>

        {/* Quick Capabilities Highlights */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-mono">
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
            🏢 مجمّع 3D وطوابق مقسمة
          </div>
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
            📹 مراقبة Hik, ICSee, Yoosee
          </div>
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
            🧠 دمج نماذج الذكاء (Multi-AI)
          </div>
        </div>
      </div>
    </div>
  );
}
