import { useState, useMemo } from 'react';
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
  UserCheck,
  Zap,
  ExternalLink,
  Layers,
  BrainCircuit,
  FolderGit2,
  Fingerprint
} from 'lucide-react';

interface CircuitBoardProps {
  nodes: AppNode[];
  connections: CircuitConnection[];
  activeApps: AppId[];
  onOpenApp: (id: AppId) => void;
  flowFilter: 'all' | 'data' | 'deploy' | 'auth' | 'telemetry';
  onFilterChange: (filter: 'all' | 'data' | 'deploy' | 'auth' | 'telemetry') => void;
  pulseMultiplier: number;
}

export function CircuitBoard({
  nodes,
  connections,
  activeApps,
  onOpenApp,
  flowFilter,
  onFilterChange,
  pulseMultiplier,
}: CircuitBoardProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<AppId | null>(null);
  const [showRandomLines, setShowRandomLines] = useState(true);

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

        // Create PCB-style 45-degree or orthogonal route
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
          strokeColor = 'rgba(236, 72, 153, 0.35)';
          glowColor = '#ec4899';
        } else if (conn.flowType === 'auth') {
          strokeColor = 'rgba(99, 102, 241, 0.35)';
          glowColor = '#6366f1';
        } else if (conn.flowType === 'telemetry') {
          strokeColor = 'rgba(20, 184, 166, 0.35)';
          glowColor = '#14b8a6';
        }

        const duration = Math.max(0.6, conn.pulseSpeed / (pulseMultiplier || 1));

        return {
          ...conn,
          d,
          midX,
          midY,
          isHighlighted,
          strokeColor,
          glowColor,
          duration,
        };
      })
      .filter(Boolean);
  }, [connections, flowFilter, nodeCoords, hoveredNodeId, activeApps, pulseMultiplier]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#070b14] overflow-hidden select-none">
      {/* Top Filter Bar */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-950/60 z-20 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5">مسار البيانات:</span>
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              flowFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => onFilterChange('data')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              flowFilter === 'data'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نقل البيانات
          </button>
          <button
            onClick={() => onFilterChange('deploy')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              flowFilter === 'deploy'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            دورة النشر (CI/CD)
          </button>
          <button
            onClick={() => onFilterChange('auth')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              flowFilter === 'auth'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            الأمان والمصادقة
          </button>
          <button
            onClick={() => onFilterChange('telemetry')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              flowFilter === 'telemetry'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المراقبة الحية
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            onClick={() => {
              sound.playClick(600);
              setShowRandomLines(!showRandomLines);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border flex items-center gap-1.5 ${
              showRandomLines
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showRandomLines ? 'bg-cyan-400' : 'bg-slate-500'}`} />
            <span>الخطوط العشوائية: {showRandomLines ? 'مفعلة' : 'معطلة'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-300">الترابط:</span>
            <span className="text-cyan-400 font-semibold">{connections.length} مسار</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Circuit Canvas */}
      <div className="relative flex-1 w-full h-full circuit-grid-bg overflow-hidden cursor-crosshair">
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
                <path
                  d={cp.d}
                  fill="none"
                  stroke={cp.isHighlighted ? cp.strokeColor : 'rgba(51, 65, 85, 0.25)'}
                  strokeWidth={cp.isHighlighted ? '2.5' : '1.5'}
                  strokeDasharray={cp.isHighlighted ? 'none' : '4 4'}
                  strokeLinecap="round"
                />

                {/* Animated Pulsing Electron Light Packet */}
                <path
                  d={cp.d}
                  fill="none"
                  stroke={cp.glowColor}
                  strokeWidth={cp.isHighlighted ? '3.5' : '2'}
                  strokeDasharray="12 40"
                  strokeLinecap="round"
                  style={{
                    animation: `circuitFlow ${cp.duration}s linear infinite`,
                    filter: 'drop-shadow(0 0 4px currentColor)',
                    opacity: cp.isHighlighted ? 0.95 : 0.6,
                  }}
                />

                {/* Node connection solder vias (small dots at endpoints) */}
                <circle
                  cx={nodeCoords[cp.from]?.x}
                  cy={nodeCoords[cp.from]?.y}
                  r="3.5"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <circle
                  cx={nodeCoords[cp.to]?.x}
                  cy={nodeCoords[cp.to]?.y}
                  r="3.5"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive App Nodes (Electronic Microchips) */}
        {nodes.map((node) => {
          const isRunning = activeApps.includes(node.id);
          const isHovered = hoveredNodeId === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => {
                setHoveredNodeId(node.id);
                sound.playClick(850, 0.02);
              }}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => {
                sound.playPacketPulse();
                onOpenApp(node.id);
              }}
              className={`absolute group z-10 transition-transform duration-200 cursor-pointer ${
                isHovered ? 'scale-105 z-20' : 'scale-100'
              }`}
            >
              {/* Outer Microchip Pin Simulation */}
              <div
                className={`relative px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-300 min-w-[200px] max-w-[240px] ${
                  isRunning
                    ? 'bg-slate-900/90 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : isHovered
                    ? 'bg-slate-900/90 border border-slate-600 shadow-xl'
                    : 'bg-slate-950/80 border border-slate-800/90 shadow-lg'
                }`}
              >
                {/* Microchip Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
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

                  {/* Active / Running Indicator Badge */}
                  <div className="flex items-center gap-1">
                    {isRunning && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isRunning
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {isRunning ? 'RUNNING' : 'STANDBY'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {node.description}
                </p>

                {/* Microchip Telemetry Indicators */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  {node.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="text-slate-500">{stat.label}:</span>
                      <span className="text-slate-200 tabular-nums font-semibold">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                  <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    <span className="text-[10px]">تشغيل</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
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
            العمارة: معمارية برمجية متصلة كلوحة دوائر إلكترونية متطورة
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">⚡ معالجة غير متزامنة (Async Event Mesh)</span>
        </div>
      </div>
    </div>
  );
}
