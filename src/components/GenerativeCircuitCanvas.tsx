import { useEffect, useRef, useState, useMemo } from 'react';
import { sound } from '../utils/audio.ts';
import { Shuffle, Zap, Eye, EyeOff } from 'lucide-react';

interface GenerativeCircuitCanvasProps {
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
  interactive?: boolean;
}

interface CircuitTrace {
  id: number;
  points: { x: number; y: number }[];
  color: string;
  glowColor: string;
  width: number;
  packetProgress: number;
  speed: number;
  length: number;
}

export function GenerativeCircuitCanvas({
  density = 'medium',
  opacity = 0.65,
  interactive = true,
}: GenerativeCircuitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(42);
  const [isPaused, setIsPaused] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -100, y: -100, active: false });

  // Generate randomized PCB lines with orthogonal & 45-deg angled branches
  const traces = useMemo(() => {
    const traceCount = density === 'low' ? 24 : density === 'medium' ? 42 : 68;
    const colors = [
      { stroke: 'rgba(6, 182, 212, 0.4)', glow: '#06b6d4' }, // cyan
      { stroke: 'rgba(56, 189, 248, 0.35)', glow: '#38bdf8' }, // sky
      { stroke: 'rgba(139, 92, 246, 0.35)', glow: '#8b5cf6' }, // violet
      { stroke: 'rgba(16, 185, 129, 0.35)', glow: '#10b981' }, // emerald
      { stroke: 'rgba(244, 63, 94, 0.3)', glow: '#f43f5e' }, // rose
    ];

    const result: CircuitTrace[] = [];
    // Pseudo random generator using seed
    let s = seed;
    const random = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    for (let i = 0; i < traceCount; i++) {
      const colorScheme = colors[Math.floor(random() * colors.length)];
      const startX = random() * 1000;
      const startY = random() * 700;

      const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
      let currentX = startX;
      let currentY = startY;

      // 3 to 6 segments per trace with 45° or 90° bends
      const segmentCount = 3 + Math.floor(random() * 4);
      for (let j = 0; j < segmentCount; j++) {
        const dir = Math.floor(random() * 6);
        const len = 40 + random() * 110;

        switch (dir) {
          case 0: // Right
            currentX += len;
            break;
          case 1: // Left
            currentX -= len;
            break;
          case 2: // Down
            currentY += len;
            break;
          case 3: // Up
            currentY -= len;
            break;
          case 4: // 45 deg Down-Right
            currentX += len * 0.707;
            currentY += len * 0.707;
            break;
          case 5: // 45 deg Up-Left
            currentX -= len * 0.707;
            currentY -= len * 0.707;
            break;
        }

        points.push({ x: currentX, y: currentY });
      }

      // Calculate total path length
      let totalLen = 0;
      for (let k = 0; k < points.length - 1; k++) {
        const dx = points[k + 1].x - points[k].x;
        const dy = points[k + 1].y - points[k].y;
        totalLen += Math.sqrt(dx * dx + dy * dy);
      }

      result.push({
        id: i,
        points,
        color: colorScheme.stroke,
        glowColor: colorScheme.glow,
        width: 1 + random() * 1.5,
        packetProgress: random(),
        speed: 0.002 + random() * 0.005,
        length: totalLen,
      });
    }

    return result;
  }, [seed, density]);

  // Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaleX = canvas.width / 1000;
      const scaleY = canvas.height / 700;

      // Draw all traces
      traces.forEach((tr) => {
        if (!isPaused) {
          tr.packetProgress += tr.speed;
          if (tr.packetProgress > 1) tr.packetProgress = 0;
        }

        ctx.beginPath();
        const start = tr.points[0];
        ctx.moveTo(start.x * scaleX, start.y * scaleY);

        for (let p = 1; p < tr.points.length; p++) {
          ctx.lineTo(tr.points[p].x * scaleX, tr.points[p].y * scaleY);
        }

        ctx.strokeStyle = tr.color;
        ctx.lineWidth = tr.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';
        ctx.stroke();

        // Terminal solder vias (start and end pads)
        const end = tr.points[tr.points.length - 1];
        ctx.fillStyle = tr.glowColor;
        ctx.beginPath();
        ctx.arc(start.x * scaleX, start.y * scaleY, 2.2, 0, Math.PI * 2);
        ctx.arc(end.x * scaleX, end.y * scaleY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Moving electron photon along the path
        const currentTargetDistance = tr.packetProgress * tr.length;
        let accumulated = 0;
        let packetX = start.x * scaleX;
        let packetY = start.y * scaleY;

        for (let sIdx = 0; sIdx < tr.points.length - 1; sIdx++) {
          const p1 = tr.points[sIdx];
          const p2 = tr.points[sIdx + 1];
          const segDist = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
          );

          if (accumulated + segDist >= currentTargetDistance) {
            const ratio = (currentTargetDistance - accumulated) / segDist;
            packetX = (p1.x + (p2.x - p1.x) * ratio) * scaleX;
            packetY = (p1.y + (p2.y - p1.y) * ratio) * scaleY;
            break;
          }
          accumulated += segDist;
        }

        // Draw glowing photon packet
        ctx.save();
        ctx.shadowColor = tr.glowColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = tr.glowColor;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [traces, isPaused]);

  // Resize canvas to parent
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.parentElement?.getBoundingClientRect();
      if (rect) {
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegenerate = () => {
    sound.playExecute();
    setSeed(Math.floor(Math.random() * 99999));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" style={{ opacity }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* Floating control to regenerate random lines */}
      <div className="absolute top-3 left-4 pointer-events-auto flex items-center gap-1.5 z-20">
        <button
          onClick={handleRegenerate}
          title="توليد شبكة مسارات عشوائية جديدة"
          className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-300 hover:text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <Shuffle className="w-3 h-3 text-cyan-400" />
          <span>توليد مسارات عشوائية</span>
        </button>
      </div>
    </div>
  );
}
