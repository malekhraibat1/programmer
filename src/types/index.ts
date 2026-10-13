export type AppId = 
  | 'ide' 
  | 'api' 
  | 'database' 
  | 'pipeline' 
  | 'security' 
  | 'telemetry' 
  | 'terminal' 
  | 'persona'
  | 'ai'
  | 'vault';

export type AppStatus = 'active' | 'processing' | 'idle' | 'warning';

export interface AppNode {
  id: AppId;
  name: string;
  nameEn: string;
  category: string;
  description: string;
  iconName: string;
  x: number; // percentage in circuit grid 0-100
  y: number; // percentage in circuit grid 0-100
  status: AppStatus;
  accentColor: string; // e.g. '#06b6d4', '#10b981', '#8b5cf6'
  connectedTo: AppId[];
  stats: { label: string; value: string }[];
}

export interface CircuitConnection {
  from: AppId;
  to: AppId;
  label: string;
  flowType: 'data' | 'deploy' | 'auth' | 'telemetry';
  active: boolean;
  pulseSpeed: number; // seconds
}

export interface WindowState {
  appId: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
}

export type AiModelId = 'chatgpt' | 'deepseek' | 'claude' | 'gemini';

export interface AiModelConfig {
  id: AiModelId;
  name: string;
  provider: string;
  version: string;
  badge: string;
  color: string;
  accentBg: string;
  borderColor: string;
  description: string;
  specialty: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  source: string;
  level: 'info' | 'success' | 'warn' | 'error';
  text: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  name: string;
  description: string;
  defaultPayload?: string;
  response: {
    status: number;
    timeMs: number;
    body: Record<string, unknown> | Array<unknown>;
  };
}

export interface DatabaseTable {
  name: string;
  rowCount: number;
  columns: string[];
  records: Record<string, unknown>[];
}

export interface SavedSnippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  category: 'algorithms' | 'backend' | 'security' | 'database' | 'infrastructure' | 'frontend';
  description: string;
  code: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface DrawnTrace {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  glowColor: string;
  createdAt: number;
}

export interface AiProgram {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  description: string;
  iconName: string;
  accentColor: string;
  defaultPrompt: string;
  sampleInput: string;
  badge: string;
}


