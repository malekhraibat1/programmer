import { useState } from 'react';
import { AppId, AppNode, WindowState } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { Minus, Square, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
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

  // Default desktop window positions offset
  const getWindowStyle = (index: number, isMaximized: boolean, zIndex: number) => {
    if (isMaximized) {
      return {
        left: '12px',
        right: '12px',
        top: '12px',
        bottom: '12px',
        zIndex,
      };
    }

    // Cascading layout for windows
    const offsetX = 24 + (index % 4) * 36;
    const offsetY = 20 + (index % 4) * 30;

    return {
      left: `${offsetX}px`,
      top: `${offsetY}px`,
      width: 'calc(100% - 80px)',
      maxWidth: '860px',
      height: 'calc(100% - 90px)',
      maxHeight: '620px',
      zIndex,
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
      {openWindows.map((win, idx) => {
        const node = nodeMap.get(win.appId);
        if (!node) return null;

        return (
          <div
            key={win.appId}
            style={getWindowStyle(idx, win.isMaximized, win.zIndex)}
            onMouseDown={() => onFocusWindow(win.appId)}
            className="absolute flex flex-col rounded-xl overflow-hidden bg-slate-950/95 border border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md pointer-events-auto transition-all duration-150"
          >
            {/* Window Titlebar */}
            <div
              className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-move select-none"
              style={{
                borderTop: `2px solid ${node.accentColor}`,
              }}
            >
              {/* Window Title & Icon */}
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
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
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
