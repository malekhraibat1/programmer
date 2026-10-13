/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  AppId, 
  WindowState, 
  AppNode, 
  CircuitConnection,
  SavedSnippet
} from './types/index.ts';
import { 
  INITIAL_APP_NODES, 
  CIRCUIT_CONNECTIONS,
  INITIAL_SAVED_SNIPPETS
} from './data/initialData.ts';
import { sound } from './utils/audio.ts';
import { TopBar } from './components/TopBar.tsx';
import { CircuitBoard } from './components/CircuitBoard.tsx';
import { MatrixView } from './components/MatrixView.tsx';
import { WindowManager } from './components/WindowManager.tsx';
import { Taskbar } from './components/Taskbar.tsx';
import { SignatureModal } from './components/SignatureModal.tsx';
import { AiSuiteView } from './components/AiSuiteView.tsx';

const STORAGE_KEY = 'malek_hraibat_code_vault_v1';

export default function App() {
  const [nodes, setNodes] = useState<AppNode[]>(INITIAL_APP_NODES);
  const [connections, setConnections] = useState<CircuitConnection[]>(CIRCUIT_CONNECTIONS);
  const [currentView, setCurrentView] = useState<'circuit' | 'workspace' | 'matrix' | 'ai-suite'>('circuit');
  const [flowFilter, setFlowFilter] = useState<'all' | 'data' | 'deploy' | 'auth' | 'telemetry'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pulseMultiplier, setPulseMultiplier] = useState(1);
  const [highestZ, setHighestZ] = useState(12);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [ideCodeToLoad, setIdeCodeToLoad] = useState<{ code: string; filename: string } | null>(null);

  // Window states (Persona and AI available)
  const [windows, setWindows] = useState<WindowState[]>([
    { appId: 'persona', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 12 },
    { appId: 'ai', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 11 },
    { appId: 'vault', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
    { appId: 'ide', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 9 },
    { appId: 'api', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 8 },
    { appId: 'database', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 7 },
    { appId: 'pipeline', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 6 },
    { appId: 'security', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    { appId: 'telemetry', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 4 },
    { appId: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 3 },
  ]);

  // Open / Focus an app window
  const handleOpenApp = (appId: AppId) => {
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);

    setWindows((prev) =>
      prev.map((win) => {
        if (win.appId === appId) {
          return {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          };
        }
        return win;
      })
    );

    // Also mark the node as active in node list
    setNodes((prev) =>
      prev.map((n) => (n.id === appId ? { ...n, status: 'active' } : n))
    );
  };

  const handleCloseWindow = (appId: AppId) => {
    setWindows((prev) =>
      prev.map((win) => (win.appId === appId ? { ...win, isOpen: false } : win))
    );
  };

  const handleMinimizeWindow = (appId: AppId) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.appId === appId ? { ...win, isMinimized: true } : win
      )
    );
  };

  const handleMaximizeWindow = (appId: AppId) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.appId === appId ? { ...win, isMaximized: !win.isMaximized } : win
      )
    );
  };

  const handleFocusWindow = (appId: AppId) => {
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setWindows((prev) =>
      prev.map((win) => (win.appId === appId ? { ...win, zIndex: nextZ } : win))
    );
  };

  const handleToggleAppWindow = (appId: AppId) => {
    const win = windows.find((w) => w.appId === appId);
    if (!win) return;

    if (!win.isOpen) {
      handleOpenApp(appId);
    } else if (win.isMinimized) {
      handleOpenApp(appId);
    } else {
      handleMinimizeWindow(appId);
    }
  };

  const handleMinimizeAll = () => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
  };

  const handleResetWindows = () => {
    setWindows([
      { appId: 'persona', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 12 },
      { appId: 'ai', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 11 },
      { appId: 'vault', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
      { appId: 'ide', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 9 },
      { appId: 'api', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 8 },
      { appId: 'database', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 7 },
      { appId: 'pipeline', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 6 },
      { appId: 'security', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
      { appId: 'telemetry', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 4 },
      { appId: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 3 },
    ]);
    setHighestZ(13);
  };

  // Run ecosystem surge pulse
  const handleRunEcosystemPulse = () => {
    setPulseMultiplier(3);
    sound.playExecute();
    setTimeout(() => {
      setPulseMultiplier(1);
    }, 4000);
  };

  const handleCommitTrigger = (msg: string) => {
    handleRunEcosystemPulse();
    setTimeout(() => {
      handleOpenApp('pipeline');
    }, 800);
  };

  const handleRequestSent = (path: string) => {
    sound.playPacketPulse();
    setPulseMultiplier(2);
    setTimeout(() => {
      setPulseMultiplier(1);
    }, 2000);
  };

  const handleStressTrigger = () => {
    setPulseMultiplier(3.5);
    setTimeout(() => {
      setPulseMultiplier(1);
    }, 5000);
  };

  // Cross-app interactions
  const handleSendCodeToIde = (code: string, filename = 'custom.ts') => {
    sound.playSuccess();
    setIdeCodeToLoad({ code, filename });
    handleOpenApp('ide');
  };

  const handleAskAiWithCode = (code: string) => {
    sound.playPacketPulse();
    handleOpenApp('ai');
  };

  const handleSaveSnippetToVault = (code: string, title = 'شفرة محفوظة') => {
    sound.playSuccess();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing: SavedSnippet[] = stored ? JSON.parse(stored) : INITIAL_SAVED_SNIPPETS;
      const newSnippet: SavedSnippet = {
        id: `snip-${Date.now()}`,
        title,
        filename: 'exported-snippet.ts',
        language: 'typescript',
        category: 'backend',
        description: 'شفرة مضافة ومسجلة في مستودع المهندس مالك حريبات.',
        tags: ['Malek', 'Exported', 'Saved'],
        code,
        author: 'المهندس مالك حريبات',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newSnippet, ...existing]));
    } catch {
      // ignore
    }
  };

  const activeApps = windows
    .filter((w) => w.isOpen && !w.isMinimized)
    .map((w) => w.appId);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* Top Header */}
      <TopBar
        currentView={currentView}
        onViewChange={setCurrentView}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          sound.enabled = next;
          setSoundEnabled(next);
        }}
        onRunEcosystemPulse={handleRunEcosystemPulse}
        onReset={handleResetWindows}
        activeAppsCount={activeApps.length}
        onOpenSignature={() => setIsSignatureOpen(true)}
      />

      {/* Main Content Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Layer 1: Circuit Board Canvas with Random Generative Lines */}
        {currentView === 'circuit' && (
          <CircuitBoard
            nodes={nodes}
            connections={connections}
            activeApps={activeApps}
            onOpenApp={handleOpenApp}
            flowFilter={flowFilter}
            onFilterChange={setFlowFilter}
            pulseMultiplier={pulseMultiplier}
          />
        )}

        {/* Layer 2: Matrix Architectural View */}
        {currentView === 'matrix' && (
          <MatrixView nodes={nodes} onOpenApp={handleOpenApp} />
        )}

        {/* Layer 3: AI Suite Dedicated Programs View */}
        {currentView === 'ai-suite' && (
          <AiSuiteView
            onSendCodeToIde={handleSendCodeToIde}
            onSaveSnippetToVault={handleSaveSnippetToVault}
          />
        )}

        {/* Layer 3: Workspace View */}
        {currentView === 'workspace' && (
          <div className="w-full h-full circuit-grid-bg flex items-center justify-center p-8 select-none">
            {activeApps.length === 0 ? (
              <div className="max-w-md p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
                <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <span className="font-mono text-sm font-bold">&lt;/&gt;</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  سطح المكتب الهندسي فارغ حالياً
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  جميع النوافذ مصغرة أو مغلقة. يمكنك تشغيل أي تطبيق من شريط المهام بالأسفل أو معاينة بصمة المهندس مالك حريبات.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenApp('persona')}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                  >
                    فتح بصمة المهندس مالك
                  </button>
                  <button
                    onClick={() => handleOpenApp('ai')}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                  >
                    فتح المساعد الذكي
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Floating / Active Windows on top */}
        <WindowManager
          windows={windows}
          nodes={nodes}
          onCloseWindow={handleCloseWindow}
          onMinimizeWindow={handleMinimizeWindow}
          onMaximizeWindow={handleMaximizeWindow}
          onFocusWindow={handleFocusWindow}
          onOpenApp={handleOpenApp}
          onTriggerPulse={handleRunEcosystemPulse}
          onCommitTrigger={handleCommitTrigger}
          onRequestSent={handleRequestSent}
          onStressTrigger={handleStressTrigger}
          onSendCodeToIde={handleSendCodeToIde}
          onAskAiWithCode={handleAskAiWithCode}
          onSaveSnippetToVault={handleSaveSnippetToVault}
          onOpenSignature={() => setIsSignatureOpen(true)}
          ideCodeToLoad={ideCodeToLoad}
        />
      </div>

      {/* Bottom Taskbar */}
      <Taskbar
        nodes={nodes}
        activeApps={activeApps}
        onOpenApp={handleOpenApp}
        onMinimizeAll={handleMinimizeAll}
        onToggleAppWindow={handleToggleAppWindow}
        circuitViewActive={currentView === 'circuit'}
        onToggleCircuitView={() =>
          setCurrentView((prev) => (prev === 'circuit' ? 'workspace' : 'circuit'))
        }
      />

      {/* Eng. Malek Hraibat Cryptographic Signature Modal */}
      <SignatureModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
      />
    </div>
  );
}
