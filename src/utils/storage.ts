/**
 * Persistent Storage Engine with Auto-Save
 * DevCore Systems - Eng. Malek Hraibat
 */

import { ComplexFloor, DepartmentConfig } from '../components/Building3DView.tsx';

export interface StoredAuthState {
  isLoggedIn: boolean;
  username: string;
  role: string;
  loginTime: string;
  sessionToken: string;
}

export interface CctvCameraConfig {
  id: string;
  name: string;
  nameEn: string;
  brand: 'hik-connect' | 'icsee' | 'yoosee';
  location: string;
  resolution: string;
  fps: number;
  bitrate: string;
  ptzSupported: boolean;
  nightVision: 'normal' | 'infrared' | 'color' | 'thermal';
  status: 'online' | 'recording' | 'motion' | 'offline';
  floorNum: number;
  ipAddress: string;
  port: number;
  isFavorite?: boolean;
}

export interface DesignerElement {
  id: string;
  type: 'heading' | 'paragraph' | 'button' | 'card' | 'input' | 'badge' | 'metric' | 'table' | 'camera_feed' | 'ai_chat';
  title: string;
  content: string;
  style: {
    theme: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';
    variant: 'neon' | 'glass' | 'solid' | 'outline';
    size: 'sm' | 'md' | 'lg' | 'xl';
    width: 'full' | 'half' | 'third';
  };
}

export interface DesignerProject {
  id: string;
  title: string;
  description: string;
  targetFramework: 'React + Tailwind' | 'HTML/CSS' | 'Next.js App';
  elements: DesignerElement[];
  updatedAt: string;
}

export interface AiFusionRecord {
  id: string;
  prompt: string;
  selectedModels: ('chatgpt' | 'deepseek' | 'claude' | 'gemini')[];
  timestamp: string;
  masterSolution: string;
  modelOutputs: Record<string, string>;
}

const KEYS = {
  AUTH: 'devcore_auth_session_v1',
  FLOORS: 'devcore_complex_floors_v2',
  CAMERAS: 'devcore_cctv_cameras_v2',
  DESIGNER: 'devcore_designer_projects_v1',
  AI_FUSION: 'devcore_ai_fusion_history_v1',
  SETTINGS: 'devcore_system_settings_v1',
};

// --- AUTH STORAGE ---
export function getStoredAuth(): StoredAuthState {
  try {
    const raw = localStorage.getItem(KEYS.AUTH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isLoggedIn === 'boolean') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return {
    isLoggedIn: false,
    username: '',
    role: 'Guest Architect',
    loginTime: '',
    sessionToken: '',
  };
}

export function saveStoredAuth(auth: StoredAuthState): void {
  try {
    localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
  } catch (e) {
    console.error('Failed to auto-save auth session:', e);
  }
}

export function clearStoredAuth(): void {
  try {
    localStorage.removeItem(KEYS.AUTH);
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

// --- COMPLEX FLOORS & DEPARTMENTS AUTO-SAVE ---
export function getStoredFloors(): ComplexFloor[] | null {
  try {
    const raw = localStorage.getItem(KEYS.FLOORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export function saveStoredFloors(floors: ComplexFloor[]): void {
  try {
    localStorage.setItem(KEYS.FLOORS, JSON.stringify(floors));
  } catch (e) {
    console.error('Failed to auto-save complex floors:', e);
  }
}

// --- CCTV CAMERAS AUTO-SAVE ---
export const DEFAULT_CCTV_CAMERAS: CctvCameraConfig[] = [
  {
    id: 'cam-hik-01',
    name: 'كاميرا هيك-كونكت: غرفة السيرفرات المركزية',
    nameEn: 'Hik-Connect Main Server Room',
    brand: 'hik-connect',
    location: 'الطابق 8 - جناح السيرفرات المركزية',
    resolution: '3840x2160 (4K Ultra HD)',
    fps: 30,
    bitrate: '4096 Kbps (H.265+)',
    ptzSupported: true,
    nightVision: 'infrared',
    status: 'recording',
    floorNum: 8,
    ipAddress: '192.168.10.101',
    port: 8000,
  },
  {
    id: 'cam-icsee-02',
    name: 'كاميرا آي سي سي: بهو المجمع والمدخل الهندسي',
    nameEn: 'ICSee Campus Grand Atrium',
    brand: 'icsee',
    location: 'الطابق الأرضي 1 - مدخل المجمع الإلكتروني',
    resolution: '1920x1080 (1080P Full HD)',
    fps: 25,
    bitrate: '2048 Kbps (H.265)',
    ptzSupported: true,
    nightVision: 'color',
    status: 'online',
    floorNum: 1,
    ipAddress: '192.168.10.102',
    port: 34567,
  },
  {
    id: 'cam-yoosee-03',
    name: 'كاميرا يوسي: مهبط الطائرات ورادار السطح',
    nameEn: 'Yoosee Rooftop Helipad & Radar',
    brand: 'yoosee',
    location: 'السطح (Rooftop Helipad) - أعلى البرج',
    resolution: '2560x1440 (2K QHD)',
    fps: 30,
    bitrate: '3072 Kbps (Dual Stream)',
    ptzSupported: true,
    nightVision: 'infrared',
    status: 'online',
    floorNum: 10,
    ipAddress: '192.168.10.103',
    port: 554,
  },
  {
    id: 'cam-hik-04',
    name: 'كاميرا هيك-كونكت: قبو التشفير والمفاتيح HSM',
    nameEn: 'Hik-Connect HSM Cryptography Vault',
    brand: 'hik-connect',
    location: 'الطابق 7 - جناح التشفير والأمن السيبراني',
    resolution: '3840x2160 (4K DarkFighter)',
    fps: 30,
    bitrate: '4500 Kbps (H.265+ Secure)',
    ptzSupported: true,
    nightVision: 'infrared',
    status: 'recording',
    floorNum: 7,
    ipAddress: '192.168.10.104',
    port: 8000,
  },
  {
    id: 'cam-icsee-05',
    name: 'كاميرا آي سي سي: مختبر الذكاء الاصطناعي العصبي',
    nameEn: 'ICSee AI Neural R&D Lab',
    brand: 'icsee',
    location: 'الطابق 9 - مختبرات ChatGPT & DeepSeek',
    resolution: '2304x1296 (3MP HD)',
    fps: 30,
    bitrate: '2560 Kbps',
    ptzSupported: true,
    nightVision: 'color',
    status: 'motion',
    floorNum: 9,
    ipAddress: '192.168.10.105',
    port: 34567,
  },
  {
    id: 'cam-yoosee-06',
    name: 'كاميرا يوسي: ممر شبكات الفايبر والبيانات',
    nameEn: 'Yoosee Fiber Backbone & Power Grid',
    brand: 'yoosee',
    location: 'الطابق 2 - محطة الطاقة والشبكات السلكية',
    resolution: '1920x1080 (1080P)',
    fps: 25,
    bitrate: '1536 Kbps',
    ptzSupported: false,
    nightVision: 'infrared',
    status: 'online',
    floorNum: 2,
    ipAddress: '192.168.10.106',
    port: 554,
  },
];

export function getStoredCameras(): CctvCameraConfig[] {
  try {
    const raw = localStorage.getItem(KEYS.CAMERAS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_CCTV_CAMERAS;
}

export function saveStoredCameras(cameras: CctvCameraConfig[]): void {
  try {
    localStorage.setItem(KEYS.CAMERAS, JSON.stringify(cameras));
  } catch (e) {
    console.error('Failed to auto-save CCTV cameras:', e);
  }
}

// --- DESIGNER PROJECTS AUTO-SAVE ---
export function getStoredDesignerProjects(): DesignerProject[] {
  try {
    const raw = localStorage.getItem(KEYS.DESIGNER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return [
    {
      id: 'proj-1',
      title: 'بوابة النظم السحابية - DevCore Portal',
      description: 'لوحة تحكم تفاعلية مع إحصائيات السيرفرات وشاشات الكاميرات الحية',
      targetFramework: 'React + Tailwind',
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: 'el-1',
          type: 'heading',
          title: 'عنوان المنظومة الرئيسية',
          content: 'DevCore Systems Dashboard - المهندس مالك حريبات',
          style: { theme: 'cyan', variant: 'neon', size: 'xl', width: 'full' },
        },
        {
          id: 'el-2',
          type: 'metric',
          title: 'أداء السيرفرات الحية',
          content: 'RPS: 4,820 | CPU: 18% | Latency: 1.2ms',
          style: { theme: 'emerald', variant: 'glass', size: 'md', width: 'third' },
        },
        {
          id: 'el-3',
          type: 'card',
          title: 'مراقبة الكاميرات الذكية',
          content: 'بث حي متصل بكاميرات Hik-Connect و ICSee و Yoosee بنظام H.265+',
          style: { theme: 'cyan', variant: 'glass', size: 'md', width: 'third' },
        },
        {
          id: 'el-4',
          type: 'button',
          title: 'زر إطلاق النبضة التفاعلية',
          content: 'تنفيذ الإجراء السحابي الفوري',
          style: { theme: 'cyan', variant: 'neon', size: 'md', width: 'third' },
        },
      ],
    },
  ];
}

export function saveStoredDesignerProjects(projects: DesignerProject[]): void {
  try {
    localStorage.setItem(KEYS.DESIGNER, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to auto-save designer projects:', e);
  }
}

// --- AI FUSION AUTO-SAVE ---
export function getStoredAiFusion(): AiFusionRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.AI_FUSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveStoredAiFusion(records: AiFusionRecord[]): void {
  try {
    localStorage.setItem(KEYS.AI_FUSION, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to auto-save AI fusion:', e);
  }
}
