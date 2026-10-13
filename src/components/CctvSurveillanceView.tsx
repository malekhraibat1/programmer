import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio.ts';
import { 
  getStoredCameras, 
  saveStoredCameras, 
  CctvCameraConfig, 
  DEFAULT_CCTV_CAMERAS 
} from '../utils/storage.ts';
import { 
  Video, 
  Grid, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Mic, 
  AlertTriangle, 
  Camera, 
  Radio, 
  Moon, 
  Sun, 
  Eye, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Check, 
  X, 
  Download,
  Activity,
  Cpu,
  Wifi,
  Sliders,
  Play,
  Square
} from 'lucide-react';

interface CctvSurveillanceViewProps {
  onBackToComplex?: () => void;
}

export function CctvSurveillanceView({ onBackToComplex }: CctvSurveillanceViewProps) {
  const [cameras, setCameras] = useState<CctvCameraConfig[]>(getStoredCameras);
  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[0]?.id || 'cam-hik-01');
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '3x3'>('2x2');
  const [brandFilter, setBrandFilter] = useState<'all' | 'hik-connect' | 'icsee' | 'yoosee'>('all');
  const [activeNightVision, setActiveNightVision] = useState<Record<string, 'normal' | 'infrared' | 'color' | 'thermal'>>({});
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [ptzState, setPtzState] = useState<{ pan: number; tilt: number; zoom: number }>({ pan: 0, tilt: 0, zoom: 1 });
  const [snapshots, setSnapshots] = useState<{ id: string; camName: string; time: string; dataUrl: string }[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCam, setNewCam] = useState({
    name: '',
    brand: 'hik-connect' as 'hik-connect' | 'icsee' | 'yoosee',
    location: '',
    floorNum: 1,
    ipAddress: '192.168.1.150',
    port: 8000,
    resolution: '3840x2160 (4K)',
    fps: 30,
    bitrate: '4096 Kbps',
  });

  // Ticking time for OSD
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const ms = now.getMilliseconds().toString().padStart(3, '0');
      setCurrentTimeStr(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${ms}`
      );
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Filtered list
  const filteredCameras = cameras.filter((c) => {
    if (brandFilter === 'all') return true;
    return c.brand === brandFilter;
  });

  const activeCamera = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  // Auto-save cameras whenever modified
  const updateAndSaveCameras = (updated: CctvCameraConfig[]) => {
    setCameras(updated);
    saveStoredCameras(updated);
  };

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCam.name.trim()) return;

    sound.playClick(750);
    const created: CctvCameraConfig = {
      id: `cam-${newCam.brand}-${Date.now().toString(36)}`,
      name: newCam.name,
      nameEn: `${newCam.brand.toUpperCase()} Camera - ${newCam.location}`,
      brand: newCam.brand,
      location: newCam.location || 'قاعة داخلية بالمجمع',
      resolution: newCam.resolution,
      fps: newCam.fps,
      bitrate: newCam.bitrate,
      ptzSupported: true,
      nightVision: 'infrared',
      status: 'online',
      floorNum: Number(newCam.floorNum),
      ipAddress: newCam.ipAddress,
      port: Number(newCam.port),
    };

    const nextList = [created, ...cameras];
    updateAndSaveCameras(nextList);
    setSelectedCameraId(created.id);
    setIsAddModalOpen(false);
    setNewCam({
      name: '',
      brand: 'hik-connect',
      location: '',
      floorNum: 1,
      ipAddress: '192.168.1.150',
      port: 8000,
      resolution: '3840x2160 (4K)',
      fps: 30,
      bitrate: '4096 Kbps',
    });
  };

  const handleDeleteCamera = (id: string) => {
    if (cameras.length <= 1) return;
    sound.playClick(400);
    const updated = cameras.filter((c) => c.id !== id);
    updateAndSaveCameras(updated);
    if (selectedCameraId === id) {
      setSelectedCameraId(updated[0]?.id || '');
    }
  };

  const handleToggleNightVision = (camId: string, mode: 'normal' | 'infrared' | 'color' | 'thermal') => {
    sound.playClick(700);
    setActiveNightVision((prev) => ({ ...prev, [camId]: mode }));
  };

  const handleTriggerIntercom = () => {
    sound.playIntercom();
    setIsIntercomActive(!isIntercomActive);
  };

  const handleTriggerSiren = () => {
    sound.playSiren();
    setIsSirenActive(!isSirenActive);
  };

  // Capture simulated snapshot
  const handleTakeSnapshot = (cam: CctvCameraConfig) => {
    sound.playCameraClick();
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 360);
      // brand watermark
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`[${cam.brand.toUpperCase()}] ${cam.name}`, 20, 40);
      ctx.fillStyle = '#10b981';
      ctx.font = '14px monospace';
      ctx.fillText(`TIME: ${currentTimeStr}`, 20, 70);
      ctx.fillText(`LOC: ${cam.location}`, 20, 95);
      ctx.fillText(`DEVCORE ARCHITECTURAL SURVEILLANCE`, 20, 120);

      // grid lines
      ctx.strokeStyle = '#06b6d433';
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 360);
        ctx.stroke();
      }
      for (let y = 0; y < 360; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      const dataUrl = canvas.toDataURL('image/png');
      setSnapshots((prev) => [
        {
          id: Date.now().toString(),
          camName: cam.name,
          time: new Date().toLocaleTimeString('ar-EG'),
          dataUrl,
        },
        ...prev.slice(0, 8),
      ]);
    }
  };

  const handlePtzMove = (dir: 'up' | 'down' | 'left' | 'right' | 'in' | 'out' | 'reset') => {
    sound.playClick(600);
    setPtzState((prev) => {
      switch (dir) {
        case 'up': return { ...prev, tilt: Math.min(prev.tilt + 10, 40) };
        case 'down': return { ...prev, tilt: Math.max(prev.tilt - 10, -40) };
        case 'left': return { ...prev, pan: prev.pan - 15 };
        case 'right': return { ...prev, pan: prev.pan + 15 };
        case 'in': return { ...prev, zoom: Math.min(prev.zoom + 0.3, 3) };
        case 'out': return { ...prev, zoom: Math.max(prev.zoom - 0.3, 1) };
        case 'reset': return { pan: 0, tilt: 0, zoom: 1 };
      }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-cyan-500 selection:text-white" dir="rtl">
      {/* Top Banner / Command Center Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                مركز المراقبة الأمنية والكاميرات الذكية (CCTV Command Center)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 border border-red-500/40 text-red-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                LIVE REC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              مراقبة مباشرة متكاملة لكاميرات Hik-Connect و ICSee و Yoosee مع حفظ تلقائي للمعلومات
            </p>
          </div>
        </div>

        {/* Brand Filter Badges */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { sound.playClick(600); setBrandFilter('all'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              brandFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            جميع الكاميرات ({cameras.length})
          </button>
          <button
            onClick={() => { sound.playClick(600); setBrandFilter('hik-connect'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
              brandFilter === 'hik-connect' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Hik-Connect ({cameras.filter((c) => c.brand === 'hik-connect').length})
          </button>
          <button
            onClick={() => { sound.playClick(600); setBrandFilter('icsee'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
              brandFilter === 'icsee' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            ICSee ({cameras.filter((c) => c.brand === 'icsee').length})
          </button>
          <button
            onClick={() => { sound.playClick(600); setBrandFilter('yoosee'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
              brandFilter === 'yoosee' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Yoosee ({cameras.filter((c) => c.brand === 'yoosee').length})
          </button>
        </div>

        {/* Action Controls & Layout */}
        <div className="flex items-center gap-2">
          {/* Grid Layout Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { sound.playClick(600); setGridLayout('1x1'); }}
              className={`px-2 py-1 rounded-lg ${gridLayout === '1x1' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              title="شاشة فردية مكبرة 1x1"
            >
              1×1
            </button>
            <button
              onClick={() => { sound.playClick(600); setGridLayout('2x2'); }}
              className={`px-2 py-1 rounded-lg ${gridLayout === '2x2' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              title="تقسيم رباعي 2x2"
            >
              2×2
            </button>
            <button
              onClick={() => { sound.playClick(600); setGridLayout('3x3'); }}
              className={`px-2 py-1 rounded-lg ${gridLayout === '3x3' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              title="تقسيم 9 شاشات 3x3"
            >
              3×3
            </button>
          </div>

          {/* Add Camera Button */}
          <button
            onClick={() => { sound.playClick(700); setIsAddModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة كاميرا جديدة</span>
          </button>

          {/* Auto-Save Status Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>حفظ تلقائي فعّال</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Surveillance Feeds + Control Station */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left/Center Feeds Display */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
          {/* Grid Layout Container */}
          <div className={`grid gap-3 ${
            gridLayout === '1x1' 
              ? 'grid-cols-1' 
              : gridLayout === '2x2' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {(gridLayout === '1x1' ? [activeCamera] : filteredCameras.slice(0, gridLayout === '2x2' ? 4 : 9)).map((cam) => {
              const nightMode = activeNightVision[cam.id] || cam.nightVision;
              const isSelected = cam.id === selectedCameraId;

              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 bg-slate-900 cursor-pointer shadow-lg ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-cyan-950/60'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Procedural Simulated Camera Feed */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    {/* Simulated Camera Room Visual Graphic */}
                    <div 
                      className={`absolute inset-0 transition-transform duration-300 ${
                        nightMode === 'infrared' 
                          ? 'grayscale contrast-125 brightness-90' 
                          : nightMode === 'thermal' 
                          ? 'invert hue-rotate-180 contrast-200' 
                          : nightMode === 'color' 
                          ? 'brightness-110 saturate-150' 
                          : ''
                      }`}
                      style={{
                        transform: isSelected 
                          ? `scale(${ptzState.zoom}) translate(${ptzState.pan * 0.2}px, ${ptzState.tilt * 0.2}px)` 
                          : 'none'
                      }}
                    >
                      {/* Procedural Animated Background Canvas Simulating Server Racks / Atrium */}
                      <CameraSceneSimulation 
                        camId={cam.id} 
                        floorNum={cam.floorNum} 
                        brand={cam.brand}
                        nightMode={nightMode}
                      />
                    </div>

                    {/* Scan Lines Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
                        backgroundSize: '100% 2px',
                      }}
                    />

                    {/* Motion Bounding Box Simulation */}
                    {cam.status === 'motion' && (
                      <div className="absolute top-1/4 right-1/4 w-32 h-24 border-2 border-amber-400/80 rounded bg-amber-400/10 pointer-events-none flex flex-col justify-between p-1 animate-pulse">
                        <span className="text-[9px] font-mono text-amber-300 font-bold bg-amber-950/90 px-1 rounded w-fit">
                          [HUMANOID MOTION DETECTED]
                        </span>
                        <span className="text-[8px] font-mono text-amber-200 text-left">
                          AI MATCH: 98.2%
                        </span>
                      </div>
                    )}

                    {/* OSD Header Overlay */}
                    <div className="absolute top-2 inset-x-2 flex items-center justify-between text-[11px] font-mono pointer-events-none drop-shadow">
                      <div className="flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded-md border border-white/10 text-white">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="font-bold">REC</span>
                        <span className="text-slate-400">|</span>
                        <span>{cam.resolution.split(' ')[0]}</span>
                        <span className="text-slate-400">|</span>
                        <span>{cam.fps} FPS</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded-md border border-white/10 text-cyan-300 font-bold">
                        <span>{cam.brand.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* OSD Footer Overlay (Time + Camera Location) */}
                    <div className="absolute bottom-2 inset-x-2 flex items-end justify-between text-[10px] sm:text-[11px] font-mono pointer-events-none drop-shadow">
                      <div className="bg-black/80 px-2 py-1 rounded-md border border-white/10">
                        <div className="text-white font-bold">{cam.name}</div>
                        <div className="text-cyan-300 text-[10px]">{cam.location}</div>
                      </div>

                      <div className="bg-black/80 px-2 py-1 rounded-md border border-white/10 text-emerald-400 font-bold text-left">
                        <div>{currentTimeStr}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {cam.bitrate} • IP: {cam.ipAddress}
                        </div>
                      </div>
                    </div>

                    {/* Camera Action Hover Bar */}
                    <div className="absolute inset-x-0 bottom-12 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTakeSnapshot(cam);
                        }}
                        className="p-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs flex items-center gap-1 shadow"
                        title="التقاط صورة Snapshot"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>لقطة</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleNightVision(
                            cam.id,
                            nightMode === 'infrared' ? 'color' : nightMode === 'color' ? 'normal' : 'infrared'
                          );
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 text-xs flex items-center gap-1 shadow"
                        title="تبديل وضع الرؤية الليلية"
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>{nightMode === 'infrared' ? 'أشعة IR' : nightMode === 'color' ? 'ألوان ليلية' : 'نهاري'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCameraId(cam.id);
                          setGridLayout('1x1');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs flex items-center gap-1 shadow"
                        title="تكبير الشاشة 1x1"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Info Bar */}
                  <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        cam.status === 'recording' ? 'bg-emerald-400' : cam.status === 'motion' ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'
                      }`} />
                      <span className="font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                        {cam.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        طابق {cam.floorNum}
                      </span>
                      {cameras.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCamera(cam.id);
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                          title="حذف الكاميرا"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Snapshots Gallery Bar */}
          {snapshots.length > 0 && (
            <div className="mt-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  معرض اللقطات المحفوظة (Snapshots Gallery)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">حفظ تلقائي في الذاكرة</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {snapshots.map((s) => (
                  <div key={s.id} className="relative group shrink-0 w-32 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                    <img src={s.dataUrl} alt={s.camName} className="w-full h-18 object-cover" />
                    <div className="p-1 text-[9px] font-mono text-slate-300 truncate bg-slate-900/90">
                      {s.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Station: PTZ Joystick & Diagnostics Panel */}
        <div className="w-full lg:w-80 bg-slate-900/95 border-t lg:border-t-0 lg:border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
          {/* Active Camera Header */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              الكاميرا المحددة حالياً (Active Feed)
            </span>
            <div className="text-sm font-bold text-white truncate">{activeCamera?.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{activeCamera?.location}</div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-500 block">البروتوكول:</span>
                <span className="font-bold text-cyan-300">{activeCamera?.brand.toUpperCase()} P2P</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-500 block">عنوان IP:</span>
                <span className="font-bold text-emerald-400">{activeCamera?.ipAddress}:{activeCamera?.port}</span>
              </div>
            </div>
          </div>

          {/* PTZ Joystick Control Station */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                تحكم التوجيه والتقريب PTZ
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Z: {ptzState.zoom.toFixed(1)}x
              </span>
            </div>

            {/* Directional Pad */}
            <div className="relative w-36 h-36 mx-auto rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center p-2 shadow-inner">
              {/* Up */}
              <button
                onClick={() => handlePtzMove('up')}
                className="absolute top-1 p-2 rounded-full hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 active:scale-90 transition-all"
                title="إمالة لأعلى Tilt Up"
              >
                ▲
              </button>
              {/* Down */}
              <button
                onClick={() => handlePtzMove('down')}
                className="absolute bottom-1 p-2 rounded-full hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 active:scale-90 transition-all"
                title="إمالة لأسفل Tilt Down"
              >
                ▼
              </button>
              {/* Left */}
              <button
                onClick={() => handlePtzMove('left')}
                className="absolute right-1 p-2 rounded-full hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 active:scale-90 transition-all"
                title="تحريك لليمين Pan Right"
              >
                ►
              </button>
              {/* Right */}
              <button
                onClick={() => handlePtzMove('right')}
                className="absolute left-1 p-2 rounded-full hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 active:scale-90 transition-all"
                title="تحريك لليسار Pan Left"
              >
                ◄
              </button>

              {/* Center Reset */}
              <button
                onClick={() => handlePtzMove('reset')}
                className="w-10 h-10 rounded-full bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 flex items-center justify-center transition-all active:scale-95"
                title="إعادة ضبط التمركز"
              >
                RESET
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePtzMove('in')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 active:scale-95 transition-all text-center"
              >
                تقريب + Zoom In
              </button>
              <button
                onClick={() => handlePtzMove('out')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 active:scale-95 transition-all text-center"
              >
                تبعيد - Zoom Out
              </button>
            </div>
          </div>

          {/* Interactive Tools: Intercom & Siren */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block mb-1">
              وظائف الاستجابة والتواصل الذكي
            </span>

            {/* Two-Way Intercom */}
            <button
              onClick={handleTriggerIntercom}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isIntercomActive
                  ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-emerald-300'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isIntercomActive ? 'الميكروفون مفتوح (جاري التحدث...)' : 'تحدث عبر إنتركم الكاميرا (Intercom)'}</span>
            </button>

            {/* Siren Alarm */}
            <button
              onClick={handleTriggerSiren}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isSirenActive
                  ? 'bg-red-600 border-red-400 text-white animate-bounce'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-red-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSirenActive ? 'صفارة الإنذار نشطة (إيقاف)' : 'إطلاق صفارة إنذار أمنية (Siren Alert)'}</span>
            </button>
          </div>

          {/* Brand Features Details */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
            <span className="text-xs font-bold text-slate-200 block mb-1">
              مواصفات المنظومات المتصلة:
            </span>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
              <div>
                <strong className="text-rose-300">Hik-Connect:</strong> دعم NVR متعدد القنوات، 4K DarkFighter، كشف المركبات والأفراد AcuSense.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 mt-1 shrink-0" />
              <div>
                <strong className="text-sky-300">ICSee:</strong> عدسات مزدوجة، إضاءة ليلية ملونة Dual-Light LED، تتبع ذكي بالحركة Humanoid AI.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
              <div>
                <strong className="text-amber-300">Yoosee:</strong> رؤية بانورامية 360°، إنتركم صوتي ثنائي الاتجاه، حساسات PIR بالأشعة تحت الحمراء.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Camera Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                <span>إضافة كاميرا جديدة للمنظومة</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  اسم الكاميرا:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كاميرا ممر التشفير والسيرفرات"
                  value={newCam.name}
                  onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    البروتوكول / النظام:
                  </label>
                  <select
                    value={newCam.brand}
                    onChange={(e) => setNewCam({ ...newCam, brand: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="hik-connect">Hik-Connect</option>
                    <option value="icsee">ICSee</option>
                    <option value="yoosee">Yoosee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    الطابق بالمجمع:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCam.floorNum}
                    onChange={(e) => setNewCam({ ...newCam, floorNum: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  الموقع والمكان:
                </label>
                <input
                  type="text"
                  placeholder="مثال: الطابق 7 - جناح إدارة التشفير"
                  value={newCam.location}
                  onChange={(e) => setNewCam({ ...newCam, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    عنوان IP / Serial:
                  </label>
                  <input
                    type="text"
                    value={newCam.ipAddress}
                    onChange={(e) => setNewCam({ ...newCam, ipAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    المنفذ RTSP Port:
                  </label>
                  <input
                    type="number"
                    value={newCam.port}
                    onChange={(e) => setNewCam({ ...newCam, port: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  حفظ وإضافة الكاميرا تلقائياً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Procedural Dynamic Canvas simulation for camera scene
function CameraSceneSimulation({ 
  camId, 
  floorNum, 
  brand, 
  nightMode 
}: { 
  camId: string; 
  floorNum: number; 
  brand: string; 
  nightMode: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (nightMode === 'infrared') {
        bgGrad.addColorStop(0, '#0a0a0a');
        bgGrad.addColorStop(1, '#1a1a1a');
      } else {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(1, '#0b1329');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw Room Architecture perspective
      // Floor lines
      ctx.strokeStyle = nightMode === 'infrared' ? '#ffffff22' : '#06b6d433';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, h * 0.6);
        ctx.lineTo(i * 1.5 - w * 0.25, h);
        ctx.stroke();
      }

      // Draw Server Racks or Architectural Blocks
      const rackWidth = 24;
      const rackCount = 7;
      for (let r = 0; r < rackCount; r++) {
        const rx = 30 + r * 45;
        const ry = h * 0.35;
        const rw = rackWidth;
        const rh = h * 0.45;

        // Rack Chassis
        ctx.fillStyle = nightMode === 'infrared' ? '#222' : '#0f172a';
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = nightMode === 'infrared' ? '#444' : '#1e293b';
        ctx.strokeRect(rx, ry, rw, rh);

        // Blinking Server LEDs
        for (let led = 0; led < 6; led++) {
          const ledY = ry + 8 + led * 12;
          const isBlinking = (frame + r * 5 + led * 7) % 30 > 15;
          ctx.fillStyle = isBlinking
            ? (nightMode === 'infrared' ? '#ffffff' : (led % 2 === 0 ? '#10b981' : '#06b6d4'))
            : (nightMode === 'infrared' ? '#333333' : '#064e3b');
          ctx.beginPath();
          ctx.arc(rx + rw * 0.3, ledY, 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = (frame + r * 3) % 40 > 20
            ? (nightMode === 'infrared' ? '#ffffff' : '#38bdf8')
            : '#083344';
          ctx.beginPath();
          ctx.arc(rx + rw * 0.7, ledY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Floating particles / simulated sensor dust
      ctx.fillStyle = nightMode === 'infrared' ? 'rgba(255,255,255,0.4)' : 'rgba(6,182,212,0.5)';
      for (let p = 0; p < 8; p++) {
        const px = ((frame * 0.8 + p * 60) % w);
        const py = ((frame * 0.4 + p * 40) % h);
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [camId, floorNum, brand, nightMode]);

  return (
    <canvas 
      ref={canvasRef} 
      width={480} 
      height={270} 
      className="w-full h-full object-cover"
    />
  );
}
