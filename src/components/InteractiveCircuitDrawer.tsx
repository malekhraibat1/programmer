import { useState, useRef, useEffect, useMemo } from 'react';
import { DrawnTrace } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { PenTool, Trash2, Palette, Sparkles, Check, Undo2 } from 'lucide-react';

interface InteractiveCircuitDrawerProps {
  onTraceDrawn?: (trace: DrawnTrace) => void;
}

const COLOR_OPTIONS = [
  { id: 'cyan', stroke: '#06b6d4', glow: '#22d3ee', name: 'أزرق ليزري' },
  { id: 'violet', stroke: '#8b5cf6', glow: '#a855f7', name: 'بنفسجي نيون' },
  { id: 'emerald', stroke: '#10b981', glow: '#34d399', name: 'أخضر زمردي' },
  { id: 'amber', stroke: '#f59e0b', glow: '#fbbf24', name: 'أصفر بلازما' },
  { id: 'rose', stroke: '#f43f5e', glow: '#fb7185', name: 'وردي متوهج' },
];

export function InteractiveCircuitDrawer({ onTraceDrawn }: InteractiveCircuitDrawerProps) {
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawStyle, setDrawStyle] = useState<'pcb' | 'laser'>('pcb');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [traces, setTraces] = useState<DrawnTrace[]>([]);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedColor = COLOR_OPTIONS[selectedColorIdx];

  // Mouse / Touch drawing handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isDrawMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPoints([{ x, y }]);
    sound.playClick(800, 0.03);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawMode || !isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    setCurrentPoints((prev) => {
      if (prev.length === 0) return [{ x, y }];
      const lastPoint = prev[prev.length - 1];

      // If PCB mode, enforce 45° or 90° segments when distant enough
      if (drawStyle === 'pcb' && prev.length > 0) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Only add point if moved at least 25 pixels
        if (dist < 22) return prev;

        // Snap to nearest 45 degree angle
        const angle = Math.atan2(dy, dx);
        const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        x = lastPoint.x + Math.cos(snappedAngle) * dist;
        y = lastPoint.y + Math.sin(snappedAngle) * dist;
      } else {
        // Laser smooth curve: add point if moved at least 10 pixels
        const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
        if (dist < 12) return prev;
      }

      sound.playClick(650 + Math.min(400, prev.length * 15), 0.02);
      return [...prev, { x, y }];
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 1) {
      sound.playSuccess();
      const newTrace: DrawnTrace = {
        id: `drawn-${Date.now()}`,
        points: currentPoints,
        color: selectedColor.stroke,
        glowColor: selectedColor.glow,
        createdAt: Date.now(),
      };

      setTraces((prev) => [...prev, newTrace]);
      if (onTraceDrawn) onTraceDrawn(newTrace);
    }
    setCurrentPoints([]);
  };

  const handleClear = () => {
    sound.playClick(400);
    setTraces([]);
    setCurrentPoints([]);
  };

  const handleUndo = () => {
    sound.playClick(500);
    setTraces((prev) => prev.slice(0, -1));
  };

  // Convert points array to SVG path string
  const pointsToPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.1} ${pts[0].y + 0.1}`;

    if (drawStyle === 'pcb') {
      return pts.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
    } else {
      // Smooth curve
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
      }
      d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
      return d;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 z-20 ${
        isDrawMode ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* SVG Layer for Drawing & Persistence */}
      <svg className="w-full h-full absolute inset-0 overflow-visible">
        <defs>
          <filter id="draw-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Existing Persisted Drawn Traces */}
        {traces.map((trace) => {
          const d = pointsToPath(trace.points);
          return (
            <g key={trace.id}>
              {/* Outer Glow Path */}
              <path
                d={d}
                fill="none"
                stroke={trace.glowColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
                style={{ filter: 'blur(3px)' }}
              />

              {/* Core Neon Wire */}
              <path
                d={d}
                fill="none"
                stroke={trace.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Moving Pulsing Electron on the user's custom line */}
              <path
                d={d}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeDasharray="8 36"
                strokeLinecap="round"
                style={{
                  animation: 'circuitFlow 2s linear infinite',
                  filter: `drop-shadow(0 0 6px ${trace.glowColor})`,
                }}
              />

              {/* Terminal solder pads at start and end */}
              {trace.points.length > 0 && (
                <>
                  <circle
                    cx={trace.points[0].x}
                    cy={trace.points[0].y}
                    r="4.5"
                    fill={trace.glowColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={trace.points[trace.points.length - 1].x}
                    cy={trace.points[trace.points.length - 1].y}
                    r="4.5"
                    fill={trace.glowColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Currently Active Drawing Line */}
        {currentPoints.length > 1 && (
          <g>
            <path
              d={pointsToPath(currentPoints)}
              fill="none"
              stroke={selectedColor.glow}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
              style={{ filter: 'blur(4px)' }}
            />
            <path
              d={pointsToPath(currentPoints)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {currentPoints.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill={selectedColor.glow}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Floating Modern Drawing Controls Toolbar */}
      <div className="absolute top-3 right-4 pointer-events-auto flex items-center gap-2 z-30 select-none">
        {/* Draw Mode Switch */}
        <button
          onClick={() => {
            sound.playClick(isDrawMode ? 400 : 750);
            setIsDrawMode(!isDrawMode);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md border ${
            isDrawMode
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white border-cyan-400 shadow-cyan-500/25 ring-2 ring-cyan-500/30'
              : 'bg-slate-900/85 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
          }`}
          title="تفعيل وضع رسم المسارات الإلكترونية بالفأرة"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{isDrawMode ? 'وضع الرسم نشط (انقر واسحب)' : 'رسم خطوط بالفأرة'}</span>
        </button>

        {/* Detailed Drawing Controls when active */}
        {isDrawMode && (
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-top-1">
            {/* Style Switcher: PCB vs Laser */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-md border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setDrawStyle('pcb')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  drawStyle === 'pcb' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
                title="مسارات بزوايا هندسية 45° و 90° كلوحات الدوائر الإلكترونية"
              >
                دوائر PCB
              </button>
              <button
                onClick={() => setDrawStyle('laser')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  drawStyle === 'laser' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
                title="أشعة ليزرية حرة وانسيابية"
              >
                أشعة ليزر
              </button>
            </div>

            {/* Color Palette Dots */}
            <div className="flex items-center gap-1 px-1">
              {COLOR_OPTIONS.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playClick(600);
                    setSelectedColorIdx(idx);
                  }}
                  title={c.name}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    selectedColorIdx === idx ? 'scale-125 ring-2 ring-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.stroke }}
                />
              ))}
            </div>

            {/* Undo & Clear */}
            {traces.length > 0 && (
              <>
                <button
                  onClick={handleUndo}
                  title="تراجع عن آخر مسار"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClear}
                  title="مسح كافة المسارات المرسومة"
                  className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
