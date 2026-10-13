import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  AppNode, 
  CircuitConnection, 
  AppId 
} from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { GenerativeCircuitCanvas } from './GenerativeCircuitCanvas.tsx';
import { InteractiveCircuitDrawer } from './InteractiveCircuitDrawer.tsx';
import { 
  Code, 
  Database, 
  Network, 
  ShieldCheck, 
  GitMerge, 
  Activity, 
  Terminal, 
  Zap, 
  ExternalLink, 
  Layers, 
  BrainCircuit, 
  FolderGit2, 
  Fingerprint,
  Move,
  RotateCcw
} from 'lucide-react';

interface CircuitBoardProps {
  nodes: AppNode[];
  connections: CircuitConnection[];
  activeApps: AppId[];
  onOpenApp: (id: AppId) => void;
  flowFilter: 'all' | 'data' | 'deploy' | 'auth' | 'telemetry';
  onFilterChange: (filter: 'all' | 'data' | 'deploy' | 'auth' | 'telemetry') => void;
  pulseMultiplier: number;
  onUpdateNodePosition?: (id: AppId, x: number, y: number) => void;
  onResetNodePositions?: () => void;
}

export function CircuitBoard({
  nodes,
  connections,
  activeApps,
  onOpenApp,
  flowFilter,
  onFilterChange,
  pulseMultiplier,
  onUpdateNodePosition,
  onResetNodePositions,
}: CircuitBoardProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<AppId | null>(null);
  const [showRandomLines, setShowRandomLines] = useState(true);
  const [isDragMode, setIsDragMode] = useState(true);
  const [draggingNodeId, setDraggingNodeId] = useState<AppId | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef<{ startClientX: number; startClientY: number; moved: boolean } | null>(null);

  // Map icons
  const getIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'Code': return <Code className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Network': return <Network className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'GitMerge': return <GitMerge className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'UserCheck': return <Fingerprint className={className} />;
      case 'BrainCircuit': return <BrainCircuit className={className} />;
      case 'FolderGit2': return <FolderGit2 className={className} />;
      default: return <Layers className={className} />;
    }
  };

  // Node position dictionary (percentage to SVG viewBox coordinate system 1000x600)
  const nodeCoords = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node) => {
      coords[node.id] = {
        x: (node.x / 100) * 1000,
        y: (node.y / 100) * 600,
      };
    });
    return coords;
  }, [nodes]);

  // Compute SVG orthogonal or segmented circuit paths
  const circuitPaths = useMemo(() => {
    return connections
      .filter((conn) => flowFilter === 'all' || conn.flowType === flowFilter)
      .map((conn) => {
        const p1 = nodeCoords[conn.from];
        const p2 = nodeCoords[conn.to];
        if (!p1 || !p2) return null;

        // Create PCB-style smooth arc
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const d = `M ${p1.x} ${p1.y} Q ${midX} ${midY - 20} ${p2.x} ${p2.y}`;

        const isHighlighted =
          hoveredNodeId === conn.from ||
          hoveredNodeId === conn.to ||
          activeApps.includes(conn.from) ||
          activeApps.includes(conn.to);

        let strokeColor = 'rgba(56, 189, 248, 0.25)'; // sky default
        let glowColor = '#38bdf8';
        if (conn.flowType === 'deploy') {
          strokeColor = 'rgba(236, 72, 153, 0.3)'; // pink
          glowColor = '#ec4899';
        } else if (conn.flowType === 'auth') {
          strokeColor = 'rgba(99, 102, 241, 0.3)'; // indigo
          glowColor = '#6366f1';
        } else if (conn.flowType === 'telemetry') {
          strokeColor = 'rgba(20, 184, 166, 0.3)'; // teal
          glowColor = '#14b8a6';
        }

        return {
          ...conn,
          d,
          p1,
          p2,
          isHighlighted,
          strokeColor,
          glowColor,
        };
      })
      .filter(Boolean);
  }, [connections, flowFilter, nodeCoords, hoveredNodeId, activeApps]);

  // Node Drag handling
  const handleStartNodeDrag = (nodeId: AppId, clientX: number, clientY: number) => {
    dragStartPosRef.current = {
      startClientX: clientX,
      startClientY: clientY,
      moved: false,
    };
    setDraggingNodeId(nodeId);
    sound.playClick(650, 0.03);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggingNodeId || !boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (dragStartPosRef.current) {
        const dx = Math.abs(clientX - dragStartPosRef.current.startClientX);
        const dy = Math.abs(clientY - dragStartPosRef.current.startClientY);
        if (dx > 4 || dy > 4) {
          dragStartPosRef.current.moved = true;
        }
      }

      // Convert clientX, clientY into percentage inside boardRef (6% to 94%)
      const pctX = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
      const pctY = Math.max(12, Math.min(88, ((clientY - rect.top) / rect.height) * 100));

      if (onUpdateNodePosition) {
        onUpdateNodePosition(draggingNodeId, Math.round(pctX * 10) / 10, Math.round(pctY * 10) / 10);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      if (draggingNodeId) {
        setDraggingNodeId(null);
        sound.playClick(500, 0.03);
      }
    };

    if (draggingNodeId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggingNodeId, onUpdateNodePosition]);

  return (
    <div className="flex flex-col h-full bg-[#070b14] relative select-none overflow-hidden">
      {/* Top Filter and PCB HUD Bar */}
      <div className="px-4 py-2 border-b border-slate-900 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur-md text-xs">
        {/* Flow Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-mono text-[11px] ml-1 shrink-0">مسار البيانات:</span>
          {[
            { id: 'all', label: 'كافة المسارات', color: 'text-cyan-400' },
            { id: 'data', label: 'نقل البيانات', color: 'text-sky-400' },
            { id: 'deploy', label: 'النشر CI/CD', color: 'text-pink-400' },
            { id: 'auth', label: 'الأمان والرموز', color: 'text-indigo-400' },
            { id: 'telemetry', label: 'المقاييس', color: 'text-teal-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick(600);
                onFilterChange(item.id as typeof flowFilter);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                flowFilter === item.id
                  ? 'bg-slate-800 border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Drag Mode & Reset Controls */}
        <div className="flex items-center gap-2">
          {onResetNodePositions && (
            <button
              onClick={() => {
                sound.playSuccess();
                onResetNodePositions();
              }}
              title="إعادة توزيع المربعات الافتراضية"
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>إعادة ضبط المربعات</span>
            </button>
          )}

          <div className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
            <Move className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">تحريك المربعات:</span>
            <span className="font-bold">متاح بالسحب</span>
          </div>

          <button
            onClick={() => {
              sound.playClick(400);
              setShowRandomLines(!showRandomLines);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border flex items-center gap-1.5 ${
              showRandomLines
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showRandomLines ? 'bg-cyan-400' : 'bg-slate-500'}`} />
            <span>الخطوط: {showRandomLines ? 'مفعلة' : 'معطلة'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit Canvas */}
      <div 
        ref={boardRef}
        className="relative flex-1 w-full h-full circuit-grid-bg overflow-hidden cursor-crosshair"
      >
        {/* Generative Random Electronic Lines */}
        {showRandomLines && <GenerativeCircuitCanvas opacity={0.65} density="medium" />}

        {/* Interactive Modern Mouse Circuit Drawing Layer */}
        <InteractiveCircuitDrawer />

        {/* SVG Electronic Circuit Traces */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow Filter */}
            <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <linearGradient id="bus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Static Circuit Base Tracks (PCB copper lines) */}
          {circuitPaths.map((cp) => {
            if (!cp) return null;
            return (
              <g key={`track-${cp.from}-${cp.to}`}>
                {/* Background copper path */}
                <path
                  d={cp.d}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.9)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Visible colored circuit trace */}
                <path
                  d={cp.d}
                  fill="none"
                  stroke={cp.strokeColor}
                  strokeWidth={cp.isHighlighted ? '2.5' : '1.5'}
                  strokeLinecap="round"
                  filter={cp.isHighlighted ? 'url(#circuit-glow)' : undefined}
                />

                {/* Animated Pulsing Signal Packet */}
                <path
                  d={cp.d}
                  fill="none"
                  stroke={cp.glowColor}
                  strokeWidth={cp.isHighlighted ? '3' : '2'}
                  strokeLinecap="round"
                  className={pulseMultiplier > 1 ? 'circuit-path-fast' : 'circuit-path'}
                  style={{
                    animationDuration: `${Math.max(0.6, (cp.pulseSpeed || 3) / pulseMultiplier)}s`,
                    opacity: cp.isHighlighted ? 1 : 0.7,
                  }}
                />

                {/* Solder Joints / Pin Pads at Connection Terminals */}
                <circle
                  cx={cp.p1.x}
                  cy={cp.p1.y}
                  r="3.5"
                  fill="#0f172a"
                  stroke={cp.glowColor}
                  strokeWidth="1.5"
                />
                <circle
                  cx={cp.p2.x}
                  cy={cp.p2.y}
                  r="3.5"
                  fill="#0f172a"
                  stroke={cp.glowColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive App Nodes (Electronic Microchips) - Draggable */}
        {nodes.map((node) => {
          const isRunning = activeApps.includes(node.id);
          const isHovered = hoveredNodeId === node.id;
          const isDraggingThis = draggingNodeId === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isDraggingThis ? 40 : isHovered ? 25 : 10,
              }}
              onMouseEnter={() => {
                if (!draggingNodeId) {
                  setHoveredNodeId(node.id);
                  sound.playClick(850, 0.02);
                }
              }}
              onMouseLeave={() => {
                if (!draggingNodeId) {
                  setHoveredNodeId(null);
                }
              }}
              className={`absolute group transition-transform duration-100 ${
                isDraggingThis ? 'scale-105 cursor-grabbing' : isHovered ? 'scale-102 cursor-grab' : 'scale-100'
              }`}
            >
              {/* Outer Microchip Pin Simulation */}
              <div
                className={`relative px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-200 min-w-[200px] max-w-[240px] select-none ${
                  isDraggingThis
                    ? 'bg-slate-900 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                    : isRunning
                    ? 'bg-slate-900/90 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : isHovered
                    ? 'bg-slate-900/90 border border-slate-600 shadow-xl'
                    : 'bg-slate-950/80 border border-slate-800/90 shadow-lg'
                }`}
              >
                {/* Drag Handle Top Bar */}
                <div
                  onMouseDown={(e) => {
                    handleStartNodeDrag(node.id, e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    if (e.touches.length === 1) {
                      handleStartNodeDrag(node.id, e.touches[0].clientX, e.touches[0].clientY);
                    }
                  }}
                  className="flex items-center justify-between gap-2 mb-2 cursor-grab active:cursor-grabbing pb-1 border-b border-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: `${node.accentColor}18`,
                        color: node.accentColor,
                        border: `1px solid ${node.accentColor}30`,
                      }}
                    >
                      {getIcon(node.iconName, 'w-4 h-4')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 leading-tight">
                        {node.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">
                        {node.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Move Icon & Coordinates */}
                  <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                    <Move className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                    <span>{Math.round(node.x)}%</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {node.description}
                </p>

                {/* Microchip Telemetry Indicators & Click-to-open */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    {isRunning && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    <span className={isRunning ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                      {isRunning ? 'RUNNING' : 'STANDBY'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!dragStartPosRef.current?.moved) {
                        sound.playPacketPulse();
                        onOpenApp(node.id);
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20"
                  >
                    <span>فتح التطبيق</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info HUD */}
      <div className="px-6 py-2 border-t border-slate-900 bg-slate-950/80 flex flex-wrap items-center justify-between text-xs text-slate-400 z-10 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="text-slate-300">النظام:</span> متزامن بالكامل
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            يمكنك سحب أي مربع وتحريكه بحرية في الشاشة مع تحديث مسارات الدوائر لحظياً
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">⚡ تحريك المربعات نشط (Movable Matrix)</span>
        </div>
      </div>
    </div>
  );
}
