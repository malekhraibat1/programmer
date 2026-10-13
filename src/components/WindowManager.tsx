import { useState, useRef, useEffect } from 'react';
import { AppId, AppNode, WindowState } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { Minus, X, Maximize2, Minimize2, Move, RefreshCw } from 'lucide-react';
import { CodeStudioApp } from './apps/CodeStudioApp.tsx';
import { ApiStudioApp } from './apps/ApiStudioApp.tsx';
import { DatabaseApp } from './apps/DatabaseApp.tsx';
import { PipelineApp } from './apps/PipelineApp.tsx';
import { SecurityApp } from './apps/SecurityApp.tsx';
import { TelemetryApp } from './apps/TelemetryApp.tsx';
import { TerminalApp } from './apps/TerminalApp.tsx';
import { PersonaApp } from './apps/PersonaApp.tsx';
import { AiCopilotApp } from './apps/AiCopilotApp.tsx';
import { CodeVaultApp } from './apps/CodeVaultApp.tsx';

interface WindowManagerProps {
  windows: WindowState[];
  nodes: AppNode[];
  onCloseWindow: (appId: AppId) => void;
  onMinimizeWindow: (appId: AppId) => void;
  onMaximizeWindow: (appId: AppId) => void;
  onFocusWindow: (appId: AppId) => void;
  onOpenApp: (appId: AppId) => void;
  onTriggerPulse: () => void;
  onCommitTrigger: (msg: string) => void;
  onRequestSent: (path: string) => void;
  onStressTrigger: () => void;
  onSendCodeToIde: (code: string, filename?: string) => void;
  onAskAiWithCode: (code: string) => void;
  onSaveSnippetToVault: (code: string, title: string) => void;
  onOpenSignature: () => void;
  ideCodeToLoad?: { code: string; filename: string } | null;
}

export function WindowManager({
  windows,
  nodes,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow,
  onOpenApp,
  onTriggerPulse,
  onCommitTrigger,
  onRequestSent,
  onStressTrigger,
  onSendCodeToIde,
  onAskAiWithCode,
  onSaveSnippetToVault,
  onOpenSignature,
  ideCodeToLoad,
}: WindowManagerProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Track custom dragged positions for each window
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [activeDraggingApp, setActiveDraggingApp] = useState<AppId | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Compute or get position for a window
  const getWindowPosition = (appId: AppId, index: number) => {
    if (windowPositions[appId]) {
      return windowPositions[appId];
    }
    // Default cascading position
    const offsetX = 30 + (index % 4) * 36;
    const offsetY = 25 + (index % 4) * 32;
    return { x: offsetX, y: offsetY };
  };

  const handleStartDrag = (appId: AppId, clientX: number, clientY: number, idx: number) => {
    onFocusWindow(appId);
    setActiveDraggingApp(appId);
    sound.playClick(700, 0.03);

    const currentPos = getWindowPosition(appId, idx);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initX: currentPos.x,
      initY: currentPos.y,
    };
  };

  // Global mouse / touch move & up listeners
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!activeDraggingApp || !dragStartRef.current) return;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.initX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, dragStartRef.current.initY + deltaY));

      setWindowPositions((prev) => ({
        ...prev,
        [activeDraggingApp]: { x: newX, y: newY },
      }));
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
      if (activeDraggingApp) {
        sound.playClick(450, 0.03);
        setActiveDraggingApp(null);
        dragStartRef.current = null;
      }
    };

    if (activeDraggingApp) {
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
  }, [activeDraggingApp]);

  // Reset all windows to tidy cascading arrangement
  const handleResetPositions = () => {
    sound.playSuccess();
    setWindowPositions({});
  };

  const getWindowStyle = (appId: AppId, index: number, isMaximized: boolean, zIndex: number) => {
    if (isMaximized) {
      return {
        left: '12px',
        right: '12px',
        top: '12px',
        bottom: '12px',
        zIndex,
      };
    }

    const pos = getWindowPosition(appId, index);

    return {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: 'calc(100% - 90px)',
      maxWidth: '860px',
      height: 'calc(100% - 100px)',
      maxHeight: '620px',
      zIndex: activeDraggingApp === appId ? zIndex + 20 : zIndex,
    };
  };

  const renderAppContent = (appId: AppId) => {
    switch (appId) {
      case 'ide':
        return (
          <CodeStudioApp
            onCommitTrigger={onCommitTrigger}
            onAskAiWithCode={onAskAiWithCode}
            onSaveToVault={onSaveSnippetToVault}
            externalCodeToLoad={ideCodeToLoad}
          />
        );
      case 'ai':
        return (
          <AiCopilotApp
            onSendCodeToIde={onSendCodeToIde}
            onSaveSnippetToVault={onSaveSnippetToVault}
          />
        );
      case 'vault':
        return (
          <CodeVaultApp
            onSendToIde={onSendCodeToIde}
            onAskAiWithCode={onAskAiWithCode}
          />
        );
      case 'api':
        return <ApiStudioApp onRequestSent={onRequestSent} />;
      case 'database':
        return <DatabaseApp />;
      case 'pipeline':
        return <PipelineApp />;
      case 'security':
        return <SecurityApp />;
      case 'telemetry':
        return <TelemetryApp onStressTrigger={onStressTrigger} />;
      case 'terminal':
        return <TerminalApp onOpenApp={onOpenApp} onTriggerPulse={onTriggerPulse} />;
      case 'persona':
        return <PersonaApp onOpenApp={onOpenApp} onOpenSignature={onOpenSignature} />;
      default:
        return null;
    }
  };

  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized);

  if (openWindows.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-3 overflow-hidden select-none">
      {/* Active Draggable Windows */}
      {openWindows.map((win, idx) => {
        const node = nodeMap.get(win.appId);
        if (!node) return null;
        const isDraggingThis = activeDraggingApp === win.appId;
        const pos = getWindowPosition(win.appId, idx);

        return (
          <div
            key={win.appId}
            style={getWindowStyle(win.appId, idx, win.isMaximized, win.zIndex)}
            onMouseDown={() => onFocusWindow(win.appId)}
            className={`absolute flex flex-col rounded-xl overflow-hidden bg-slate-950/95 border backdrop-blur-md pointer-events-auto transition-shadow ${
              isDraggingThis
                ? 'border-cyan-400 shadow-[0_25px_60px_rgba(6,182,212,0.35)] scale-[1.01]'
                : 'border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
            }`}
          >
            {/* Window Titlebar with Smooth Drag Handle */}
            <div
              onMouseDown={(e) => {
                if (!win.isMaximized) {
                  handleStartDrag(win.appId, e.clientX, e.clientY, idx);
                }
              }}
              onTouchStart={(e) => {
                if (!win.isMaximized && e.touches.length === 1) {
                  handleStartDrag(win.appId, e.touches[0].clientX, e.touches[0].clientY, idx);
                }
              }}
              onDoubleClick={() => onMaximizeWindow(win.appId)}
              className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-move select-none group"
              style={{
                borderTop: `2px solid ${node.accentColor}`,
              }}
            >
              {/* Window Title, Icon & Drag Coordinates Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: node.accentColor }}
                />
                <span className="text-xs font-bold text-slate-100 font-mono">
                  {node.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  [{node.nameEn}]
                </span>

                {/* Move Hint / Coordinates */}
                <div className="hidden md:flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] text-slate-400 font-mono">
                  <Move className="w-2.5 h-2.5 text-cyan-400" />
                  {isDraggingThis ? (
                    <span className="text-cyan-300 font-bold">
                      X: {Math.round(pos.x)} Y: {Math.round(pos.y)}
                    </span>
                  ) : (
                    <span>اسحب لتحريك النافذة</span>
                  )}
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
                {/* Reset Position Button */}
                {windowPositions[win.appId] && !win.isMaximized && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick(400);
                      setWindowPositions((prev) => {
                        const copy = { ...prev };
                        delete copy[win.appId];
                        return copy;
                      });
                    }}
                    title="إعادة ضبط موضع النافذة"
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}

                {/* Minimize Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick(400);
                    onMinimizeWindow(win.appId);
                  }}
                  title="تصغير"
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Maximize / Restore Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick(600);
                    onMaximizeWindow(win.appId);
                  }}
                  title={win.isMaximized ? 'استعادة الحجم' : 'تكبير النافذة'}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  {win.isMaximized ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick(300);
                    onCloseWindow(win.appId);
                  }}
                  title="إغلاق النافذة"
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-rose-200 hover:bg-rose-900/40 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content Viewport */}
            <div className="flex-1 overflow-hidden relative">
              {renderAppContent(win.appId)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
