import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { AppId, AppNode } from '../types/index.ts';
import { sound } from '../utils/audio.ts';
import { getStoredFloors, saveStoredFloors } from '../utils/storage.ts';
import { 
  Building2, 
  Layers, 
  ExternalLink, 
  RotateCw, 
  Compass, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Maximize2,
  ZoomIn,
  ZoomOut,
  DoorOpen,
  MapPin,
  Box,
  SplitSquareVertical,
  Activity,
  Cpu,
  Database,
  Code,
  Shield,
  FolderGit2,
  Terminal,
  Radio,
  Sliders,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  Power,
  AlertOctagon,
  Wrench,
  Settings,
  X
} from 'lucide-react';

interface Building3DViewProps {
  nodes: AppNode[];
  activeApps: AppId[];
  onOpenApp: (id: AppId) => void;
}

export interface DepartmentConfig {
  id: string;
  name: string;
  nameEn: string;
  appId: AppId;
  wing: 'central' | 'east' | 'west';
  color: string;
  roomOffset: { x: number; z: number }; // Relative position inside the floor
  size: { width: number; depth: number };
  description: string;
  subFeature: string;
  iconName: string;
}

export interface ComplexFloor {
  floorNum: number;
  label: string;
  wing: 'central' | 'east' | 'west';
  name: string;
  nameEn: string;
  primaryAppId: AppId;
  accentColor: string;
  description: string;
  heightOffset: number; // base Y position multiplier
  departments: DepartmentConfig[];
}

export const DEFAULT_COMPLEX_FLOORS: ComplexFloor[] = [
    {
      floorNum: 10,
      label: 'PH (بنتهاوس البرج المركزي)',
      wing: 'central',
      name: 'مجمّع القيادة المعمارية والتنفيذية',
      nameEn: 'Executive Architecture & Persona Complex',
      primaryAppId: 'persona',
      accentColor: '#38bdf8',
      heightOffset: 9,
      description: 'قمة المجمع المعماري: إدارة المنظومة الشاملة، الفلسفة الهندسية، والتوقيع الرقمي للمهندس مالك حريبات.',
      departments: [
        {
          id: 'dept-10-1',
          name: 'جناح هوية وفلسفة المهندس مالك',
          nameEn: 'Lead Architect Persona Suite',
          appId: 'persona',
          wing: 'central',
          color: '#38bdf8',
          roomOffset: { x: -1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'مقر القيادة المعمارية والمبادئ الحاكمة لنظم DevCore البرمجية.',
          subFeature: 'الفلسفة الهندسية ومصفوفة التمكن',
          iconName: 'Cpu',
        },
        {
          id: 'dept-10-2',
          name: 'قاعة التوقيع الرقمي والمفاتيح التشفيرية',
          nameEn: 'Cryptographic Key Vault',
          appId: 'persona',
          wing: 'central',
          color: '#06b6d4',
          roomOffset: { x: 1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'فحص التوقيع الرقمي المعتمد والمفاتيح التشفيرية والبصمة الإلكترونية.',
          subFeature: 'فحص البصمة الرقمية الموثقة',
          iconName: 'Radio',
        },
      ],
    },
    {
      floorNum: 9,
      label: 'الطابق 9 (البرج المركزي)',
      wing: 'central',
      name: 'مجمّع الذكاء الاصطناعي متعدد النماذج',
      nameEn: 'Multi-Model AI Neural Complex',
      primaryAppId: 'ai',
      accentColor: '#a855f7',
      heightOffset: 8,
      description: 'طابق الذكاء الاصطناعي فائق التطور مقسم إلى 4 أجنحة مستقلة لكل نموذج ذكاء (ChatGPT, DeepSeek, Claude, Gemini).',
      departments: [
        {
          id: 'dept-9-1',
          name: 'مختبر ChatGPT 4o Enterprise',
          nameEn: 'OpenAI GPT-4o Lab',
          appId: 'ai',
          wing: 'central',
          color: '#10a37f',
          roomOffset: { x: -1.5, z: -1.2 },
          size: { width: 2.0, depth: 1.8 },
          description: 'جناح النماذج التوليدية التفاعلية والحلول المعمارية المباشرة.',
          subFeature: 'OpenAI GPT-4o Flagship',
          iconName: 'Sparkles',
        },
        {
          id: 'dept-9-2',
          name: 'جناح الاستدلال العميق DeepSeek R1',
          nameEn: 'DeepSeek R1 Reasoner Chamber',
          appId: 'ai',
          wing: 'central',
          color: '#0ea5e9',
          roomOffset: { x: 1.5, z: -1.2 },
          size: { width: 2.0, depth: 1.8 },
          description: 'مختبر التفكير المنطقي المتسلسل وسلسلة التحليل الخوارزمي المعقد.',
          subFeature: 'DeepSeek R1 Chain-of-Thought',
          iconName: 'Cpu',
        },
        {
          id: 'dept-9-3',
          name: 'صالون الكود النظيف Claude 4 Sonnet',
          nameEn: 'Anthropic Claude 4 Clean Room',
          appId: 'ai',
          wing: 'central',
          color: '#ea580c',
          roomOffset: { x: -1.5, z: 1.2 },
          size: { width: 2.0, depth: 1.8 },
          description: 'جناح البرمجة الدفاعية الصارمة والمعمارية الهندسية فائقة الدقة.',
          subFeature: 'Anthropic Claude 4 Architecture',
          iconName: 'Code',
        },
        {
          id: 'dept-9-4',
          name: 'مركز السحابة Google Gemini & Gemma',
          nameEn: 'Google Gemini Neural Core',
          appId: 'ai',
          wing: 'central',
          color: '#8b5cf6',
          roomOffset: { x: 1.5, z: 1.2 },
          size: { width: 2.0, depth: 1.8 },
          description: 'مركز استيعاب السياق المليوني والربط السحابي الموزع فائق السرعة.',
          subFeature: 'Google Gemini Pro 2.5 Hub',
          iconName: 'Activity',
        },
      ],
    },
    {
      floorNum: 8,
      label: 'الطابق 8 (البرج المركزي)',
      wing: 'central',
      name: 'مجمّع مستودع وخزائن الأكواد المحصنة',
      nameEn: 'Code Vault & Secure Repos Complex',
      primaryAppId: 'vault',
      accentColor: '#f43f5e',
      heightOffset: 7,
      description: 'المستودع الشخصي المحصن لحفظ الشفرات والمكتبات والخوارزميات الخاصة بالمهندس مالك حريبات.',
      departments: [
        {
          id: 'dept-8-1',
          name: 'خزينة شفرات النظم ومعالجة الـ Backend',
          nameEn: 'Backend Algorithms Vault',
          appId: 'vault',
          wing: 'central',
          color: '#f43f5e',
          roomOffset: { x: -1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'أرشيف الخدمات الموزعة، المتحكمات، وخوارزميات المعالجة الخلفية.',
          subFeature: 'مستودع الـ Backend',
          iconName: 'FolderGit2',
        },
        {
          id: 'dept-8-2',
          name: 'مكتبة الخوارزميات والمعمارية المتقدمة',
          nameEn: 'Advanced Algorithms Archive',
          appId: 'vault',
          wing: 'central',
          color: '#e11d48',
          roomOffset: { x: 1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'توثيق الأنماط التصميمية وبنى البيانات المخصصة عالية الأداء.',
          subFeature: 'مكتبة الخوارزميات',
          iconName: 'Code',
        },
      ],
    },
    {
      floorNum: 7,
      label: 'الطابق 7 (الجناح الغربي)',
      wing: 'west',
      name: 'مجمّع استوديو البرمجة ومحرر الأكواد IDE',
      nameEn: 'Code Studio & Logic IDE Complex',
      primaryAppId: 'ide',
      accentColor: '#06b6d4',
      heightOffset: 6,
      description: 'استوديوهات كتابة الشفرات، الاختبار اللحظي، وتصحيح الأخطاء وإدارة النسخ البرمجية.',
      departments: [
        {
          id: 'dept-7-1',
          name: 'استوديو كتابة الشفرات والـ TypeScript',
          nameEn: 'TypeScript & Node.js Studio',
          appId: 'ide',
          wing: 'west',
          color: '#06b6d4',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'بيئة كتابة الشفرات البرمجية مع التنفيذ اللحظي في بيئة التشغيل.',
          subFeature: 'محرر الشفرة التفاعلي',
          iconName: 'Code',
        },
        {
          id: 'dept-7-2',
          name: 'وحدة الـ Git Commit والإرسال للإنتاج',
          nameEn: 'Git Commit & Version Hub',
          appId: 'ide',
          wing: 'west',
          color: '#ec4899',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'إدارة الفروع، تسجيل الـ Commits، وتفعيل دورات الـ CI/CD التلقائية.',
          subFeature: 'Git Versioning Hub',
          iconName: 'FolderGit2',
        },
      ],
    },
    {
      floorNum: 6,
      label: 'الطابق 6 (البرج المركزي)',
      wing: 'central',
      name: 'مجمّع بوابات واجهات الـ API والخدمات المصغرة',
      nameEn: 'API Gateway & Microservices Complex',
      primaryAppId: 'api',
      accentColor: '#10b981',
      heightOffset: 5,
      description: 'طابق إدارة بوابات الاتصال الشبكي، محاكاة الطلبات والردود، والتحقق من العقود البرمجية.',
      departments: [
        {
          id: 'dept-6-1',
          name: 'بوابة توجيه وتوزيع المسارات (API Router)',
          nameEn: 'HTTP & REST Endpoint Hub',
          appId: 'api',
          wing: 'central',
          color: '#10b981',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'فحص وتوجيه مسارات GET, POST, PUT, DELETE مع قياس زمن الاستجابة.',
          subFeature: 'محلل المسارات الشبكية',
          iconName: 'Radio',
        },
        {
          id: 'dept-6-2',
          name: 'محاكي الحمولات والعقود (Contract Lab)',
          nameEn: 'Payload & Headers Testing Suite',
          appId: 'api',
          wing: 'central',
          color: '#059669',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'اختبار حمولات الـ JSON وترويسات الأمان والتوثيق المرجعي للواجهات.',
          subFeature: 'مختبر الحمولات والعقود',
          iconName: 'Code',
        },
      ],
    },
    {
      floorNum: 5,
      label: 'الطابق 5 (الجناح الشرقي - جسر معلق)',
      wing: 'east',
      name: 'مجمّع قواعد البيانات والذاكرة الموزعة',
      nameEn: 'Database & In-Memory Cache Complex',
      primaryAppId: 'database',
      accentColor: '#f59e0b',
      heightOffset: 4,
      description: 'خوادم التخزين العلائقي PostgreSQL ومصفوفات الذاكرة التخزينية فائقة السرعة Redis.',
      departments: [
        {
          id: 'dept-5-1',
          name: 'قاعة خوادم PostgreSQL العلائقية',
          nameEn: 'PostgreSQL 16 Engine Room',
          appId: 'database',
          wing: 'east',
          color: '#f59e0b',
          roomOffset: { x: -1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'الجداول الموزعة، الفهارس المتقدمة، ومحرر استعلامات الـ SQL.',
          subFeature: 'PostgreSQL Tables & Query',
          iconName: 'Database',
        },
        {
          id: 'dept-5-2',
          name: 'مصفوفة الكاش فائق السرعة Redis Vault',
          nameEn: 'Redis Key-Value Cluster',
          appId: 'database',
          wing: 'east',
          color: '#d97706',
          roomOffset: { x: 1.4, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: 'إدارة مفاتيح الجلسات، التخزين المؤقت، ومحددات المعدل الموزعة.',
          subFeature: 'Redis In-Memory Engine',
          iconName: 'Cpu',
        },
      ],
    },
    {
      floorNum: 4,
      label: 'الطابق 4 (الجناح الغربي - جسر معلق)',
      wing: 'west',
      name: 'مجمّع خطوط النشر والأتمتة السحابية CI/CD',
      nameEn: 'CI/CD Pipeline & Automated GitOps Complex',
      primaryAppId: 'pipeline',
      accentColor: '#ec4899',
      heightOffset: 3,
      description: 'أتمتة الفحص النحوي، تجميع الحاويات Docker، والنشر اللحظي بدون أي توقف (Zero-Downtime).',
      departments: [
        {
          id: 'dept-4-1',
          name: 'وحدة الفحص النحوي والاختبارات الآلية',
          nameEn: 'Lint & Automated Test Rig',
          appId: 'pipeline',
          wing: 'west',
          color: '#ec4899',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'التحقق الصارم من الكود واجتياز مراحل الاختبار قبل النشر.',
          subFeature: 'Automated Testing',
          iconName: 'Activity',
        },
        {
          id: 'dept-4-2',
          name: 'مدرج بناء الحاويات والنشر السحابي K8s',
          nameEn: 'Container & Kubernetes Rollout Deck',
          appId: 'pipeline',
          wing: 'west',
          color: '#db2777',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'بناء حزم Docker وتوزيع الحاويات عبر بيئة السحابة الحية.',
          subFeature: 'Kubernetes Rollout',
          iconName: 'Box',
        },
        {
          id: 'dept-4-3',
          name: 'قسم إدارة السيرفرات والبنية التحتية',
          nameEn: 'Server Infrastructure & Cluster Deck',
          appId: 'pipeline',
          wing: 'west',
          color: '#38bdf8',
          roomOffset: { x: 0, z: 1.4 },
          size: { width: 2.1, depth: 2.2 },
          description: 'إدارة وتنسيق مصفوفات السيرفرات والمتحكمات وموازنات الحمل والـ Clusters.',
          subFeature: 'Server Clusters & Orchestration',
          iconName: 'Cpu',
        },
      ],
    },
    {
      floorNum: 3,
      label: 'الطابق 3 (البرج المركزي)',
      wing: 'central',
      name: 'مجمّع الحصن الأمني وجدار التشفير WAF',
      nameEn: 'Security Fortress & Zero-Trust Complex',
      primaryAppId: 'security',
      accentColor: '#6366f1',
      heightOffset: 2,
      description: 'منظومة الحماية الشاملة، جدار حماية WAF، فحص رموز الأمان JWT، وإدارة صلاحيات الـ RBAC.',
      departments: [
        {
          id: 'dept-3-1',
          name: 'جدار الحماية السحابي WAF & Rate Limiter',
          nameEn: 'WAF & DDoS Mitigation Suite',
          appId: 'security',
          wing: 'central',
          color: '#6366f1',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'حظر الهجمات وحقن البيانات وحماية الخدمات من الإغراق.',
          subFeature: 'WAF Shield',
          iconName: 'Shield',
        },
        {
          id: 'dept-3-2',
          name: 'مختبر فحص رموز الأمان المشفرة JWT Inspector',
          nameEn: 'JWT Token & RBAC Inspection Lab',
          appId: 'security',
          wing: 'central',
          color: '#4f46e5',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'فك وتدقيق ترويسات وحمولات رموز الأمان والمصادقة.',
          subFeature: 'Token & Auth Inspector',
          iconName: 'Shield',
        },
        {
          id: 'dept-3-3',
          name: 'قسم التشفير والمفاتيح الأمنية HSM',
          nameEn: 'Hardware Cryptography & Key Vault',
          appId: 'security',
          wing: 'central',
          color: '#818cf8',
          roomOffset: { x: 0, z: 1.4 },
          size: { width: 2.1, depth: 2.2 },
          description: 'تشفير AES-256 ودوران المفاتيح الرقمية وحماية بروتوكولات الاتصال الآمن.',
          subFeature: 'HSM Cryptography Core',
          iconName: 'Shield',
        },
      ],
    },
    {
      floorNum: 2,
      label: 'الطابق 2 (الجناح الشرقي - جسر معلق)',
      wing: 'east',
      name: 'مجمّع المراقبة ورادار الأداء اللحظي Live',
      nameEn: 'Telemetry & Realtime Radar Complex',
      primaryAppId: 'telemetry',
      accentColor: '#14b8a6',
      heightOffset: 1,
      description: 'رادار الأداء المباشر Recharts، مراقبة استهلاك الـ CPU والـ Heap، وتأخير الـ Event Loop.',
      departments: [
        {
          id: 'dept-2-1',
          name: 'مركز مراقبة مؤشرات V8 والـ CPU والذاكرة',
          nameEn: 'Node.js V8 Runtime Profiler',
          appId: 'telemetry',
          wing: 'east',
          color: '#14b8a6',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'تحليل دقيق لأداء المعالج واستهلاك الذاكرة ومعدل التدفق.',
          subFeature: 'Runtime Telemetry',
          iconName: 'Activity',
        },
        {
          id: 'dept-2-2',
          name: 'شاشة رادار الأداء المباشر (Performance Radar)',
          nameEn: 'Live Recharts Telemetry Radar',
          appId: 'telemetry',
          wing: 'east',
          color: '#06b6d4',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'رادار خماسي المحاور لرصد استقرار النظم والمقاييس اللحظية.',
          subFeature: 'Live Radar Visualizer',
          iconName: 'Radio',
        },
      ],
    },
    {
      floorNum: 1,
      label: 'الطابق 1 (البهو الأرضي للمجمّع Atrium)',
      wing: 'central',
      name: 'بهو المجمّع والطرفية المركزية CLI',
      nameEn: 'Command Atrium & Shell CLI Complex',
      primaryAppId: 'terminal',
      accentColor: '#a855f7',
      heightOffset: 0,
      description: 'بهو الاستقبال المركزي للمجمع، فحص حالة العقد، والطرفية التفاعلية لتنفيذ أوامر المهندس.',
      departments: [
        {
          id: 'dept-1-1',
          name: 'منصة الطرفية التفاعلية المركزية (CLI Terminal)',
          nameEn: 'DevCore Shell Command Rig',
          appId: 'terminal',
          wing: 'central',
          color: '#a855f7',
          roomOffset: { x: -1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'تنفيذ الأوامر البرمجية المباشرة واستعراض الحالة العامة للمنظومة.',
          subFeature: 'Interactive Shell',
          iconName: 'Terminal',
        },
        {
          id: 'dept-1-2',
          name: 'شاشة فحص نبض الشبكة وترابط العقد',
          nameEn: 'Ecosystem Pulse & Network Status',
          appId: 'terminal',
          wing: 'central',
          color: 'cyan',
          roomOffset: { x: 1.3, z: 0 },
          size: { width: 2.1, depth: 3.0 },
          description: 'فحص خطوط الربط الـ 11 وحالة التطبيقات العشرة الحية.',
          subFeature: 'Network Health Check',
          iconName: 'Activity',
        },
      ],
    },
  ];

export function Building3DView({ nodes, activeApps, onOpenApp }: Building3DViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Dynamic Complex Floors with Auto-Save
  const [floors, setFloors] = useState<ComplexFloor[]>(() => {
    const saved = getStoredFloors();
    if (saved && saved.length > 0) return saved;
    return DEFAULT_COMPLEX_FLOORS;
  });

  // States
  const [selectedFloorNum, setSelectedFloorNum] = useState<number | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [hoveredFloorNum, setHoveredFloorNum] = useState<number | null>(null);
  const [hoveredDeptId, setHoveredDeptId] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState<'all' | 'central' | 'east' | 'west'>('all');
  const [viewMode, setViewMode] = useState<'3d-complex' | 'blueprint'>('3d-complex');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [expandedFloorList, setExpandedFloorList] = useState<Record<number, boolean>>({ 10: true, 9: true, 5: true, 4: true, 3: true });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Management State
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [managementTab, setManagementTab] = useState<'floors' | 'departments' | 'telemetry'>('floors');
  const [isLockdownActive, setIsLockdownActive] = useState(false);

  // New floor form state
  const [newFloorInput, setNewFloorInput] = useState({
    floorNum: 11,
    label: 'الطابق 11 (البرج المركزي)',
    wing: 'central' as 'central' | 'east' | 'west',
    name: 'مجمّع الحوسبة الفائقة والذكاء التوليدي',
    nameEn: 'Quantum Supercomputing & Generative R&D',
    primaryAppId: 'ai' as AppId,
    accentColor: '#38bdf8',
    description: 'طابق هندسي إضافي للحوسبة الفائقة ومعالجة البيانات المتوازية.',
  });

  // New department form state
  const [newDeptInput, setNewDeptInput] = useState({
    floorNum: 4,
    name: 'قسم إدارة السيرفرات السحابية',
    nameEn: 'Cloud Server Orchestration Suite',
    appId: 'pipeline' as AppId,
    wing: 'west' as 'central' | 'east' | 'west',
    color: '#06b6d4',
    subFeature: 'Cluster Node Manager',
    description: 'مراقبة وإدارة مجموعات السيرفرات وتوزيع الأحمال بالتوازي.',
  });

  // Floor & Department management helpers with auto-save
  const updateAndSaveFloors = (updated: ComplexFloor[]) => {
    setFloors(updated);
    saveStoredFloors(updated);
  };

  const handleAddNewFloor = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick(750);
    const maxOffset = Math.max(...floors.map(f => f.heightOffset), 0) + 1;
    const createdFloor: ComplexFloor = {
      floorNum: Number(newFloorInput.floorNum),
      label: newFloorInput.label,
      wing: newFloorInput.wing,
      name: newFloorInput.name,
      nameEn: newFloorInput.nameEn,
      primaryAppId: newFloorInput.primaryAppId,
      accentColor: newFloorInput.accentColor,
      heightOffset: maxOffset,
      description: newFloorInput.description,
      departments: [
        {
          id: `dept-${newFloorInput.floorNum}-1`,
          name: `جناح ${newFloorInput.name}`,
          nameEn: `${newFloorInput.nameEn} Suite`,
          appId: newFloorInput.primaryAppId,
          wing: newFloorInput.wing,
          color: newFloorInput.accentColor,
          roomOffset: { x: 0, z: 0 },
          size: { width: 2.2, depth: 3.2 },
          description: newFloorInput.description,
          subFeature: 'وحدة برمجية متخصصة',
          iconName: 'Cpu',
        }
      ]
    };
    const updated = [createdFloor, ...floors];
    updateAndSaveFloors(updated);
    setSelectedFloorNum(createdFloor.floorNum);
    sound.playSuccess();
    setNewFloorInput(prev => ({ ...prev, floorNum: prev.floorNum + 1 }));
  };

  const handleAddNewDept = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick(750);
    const targetFloor = floors.find(f => f.floorNum === Number(newDeptInput.floorNum));
    if (!targetFloor) return;

    const newDept: DepartmentConfig = {
      id: `dept-${targetFloor.floorNum}-${Date.now().toString(36)}`,
      name: newDeptInput.name,
      nameEn: newDeptInput.nameEn,
      appId: newDeptInput.appId,
      wing: newDeptInput.wing,
      color: newDeptInput.color,
      roomOffset: { x: (targetFloor.departments.length % 2 === 0 ? -1.3 : 1.3), z: 0 },
      size: { width: 2.1, depth: 3.0 },
      description: newDeptInput.description,
      subFeature: newDeptInput.subFeature,
      iconName: 'Cpu',
    };

    const updated = floors.map(fl => {
      if (fl.floorNum === targetFloor.floorNum) {
        return {
          ...fl,
          departments: [...fl.departments, newDept]
        };
      }
      return fl;
    });

    updateAndSaveFloors(updated);
    setSelectedFloorNum(targetFloor.floorNum);
    setSelectedDeptId(newDept.id);
    sound.playSuccess();
  };

  const handleDeleteFloor = (floorNum: number) => {
    if (floors.length <= 1) return;
    sound.playClick(400);
    const updated = floors.filter(f => f.floorNum !== floorNum);
    updateAndSaveFloors(updated);
  };

  const handleDeleteDepartment = (floorNum: number, deptId: string) => {
    sound.playClick(400);
    const updated = floors.map(fl => {
      if (fl.floorNum === floorNum) {
        return {
          ...fl,
          departments: fl.departments.filter(d => d.id !== deptId)
        };
      }
      return fl;
    });
    updateAndSaveFloors(updated);
  };

  const handleResetToDefaultFloors = () => {
    sound.playClick(500);
    updateAndSaveFloors(DEFAULT_COMPLEX_FLOORS);
  };

  // Filtered floors based on Wing and Search
  const filteredFloors = useMemo(() => {
    return floors.filter((fl) => {
      if (selectedWing !== 'all' && fl.wing !== selectedWing) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchFloor = fl.name.toLowerCase().includes(q) || fl.label.toLowerCase().includes(q);
      const matchDept = fl.departments.some(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.nameEn.toLowerCase().includes(q) ||
          d.subFeature.toLowerCase().includes(q)
      );
      return matchFloor || matchDept;
    });
  }, [floors, selectedWing, searchQuery]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const campusGroupRef = useRef<THREE.Group | null>(null);
  const floorGroupsMapRef = useRef<Map<number, THREE.Group>>(new Map());
  const skybridgeGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Camera glide targets
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 10, 30));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 7.5, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 7.5, 0));

  // User Orbit & Navigation Controls
  const isOrbitingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const orbitAngleYRef = useRef(0.2);
  const orbitAngleXRef = useRef(0.15);

  // Zoom in/out via buttons
  const handleZoom = (delta: number) => {
    sound.playClick(600);
    if (!cameraRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    targetCameraPosRef.current.addScaledVector(dir, delta * 3);
  };

  // Enter a department directly with smooth 3D glide
  const handleEnterDepartment = (dept: DepartmentConfig, floorNum: number) => {
    sound.playElevator();
    setSelectedFloorNum(floorNum);
    setSelectedDeptId(dept.id);
    setIsEntering(true);

    const fl = floors.find((f) => f.floorNum === floorNum);
    const baseY = (fl ? fl.heightOffset : 0) * 1.55 + 0.6;
    const explodedY = baseY + (fl ? fl.heightOffset : 0) * (explodeFactor * 1.2);

    // Camera targets right into this department's doorway
    const wingOffsetX = dept.wing === 'east' ? 5.2 : dept.wing === 'west' ? -5.2 : 0;
    targetCameraPosRef.current.set(
      wingOffsetX + dept.roomOffset.x * 1.8 + Math.sin(orbitAngleYRef.current) * 5,
      explodedY + 0.5,
      dept.roomOffset.z * 1.8 + Math.cos(orbitAngleYRef.current) * 5
    );
    targetLookAtRef.current.set(wingOffsetX + dept.roomOffset.x, explodedY, dept.roomOffset.z);
    setCameraZoomed(true);

    setTimeout(() => {
      sound.playDoorOpen();
      setIsEntering(false);
      onOpenApp(dept.appId);
    }, 700);
  };

  // Reset to Complex Overview
  const handleResetOverview = () => {
    sound.playClick(600);
    setSelectedFloorNum(null);
    setSelectedDeptId(null);
    setCameraZoomed(false);
    targetCameraPosRef.current.set(0, 10, 30);
    targetLookAtRef.current.set(0, 7.5, 0);
  };

  const toggleFloorExpand = (floorNum: number) => {
    sound.playClick(500);
    setExpandedFloorList((prev) => ({
      ...prev,
      [floorNum]: !prev[floorNum],
    }));
  };

  // Update Floor Explode separation dynamically
  useEffect(() => {
    floorGroupsMapRef.current.forEach((group, floorNum) => {
      const fl = floors.find((f) => f.floorNum === floorNum);
      if (fl) {
        const baseY = fl.heightOffset * 1.55;
        const explodedY = baseY + fl.heightOffset * (explodeFactor * 1.2);
        group.position.y = explodedY;
      }
    });
  }, [explodeFactor, floors]);

  // Three.js 3D Multi-Wing Complex Canvas Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmospheric cyber background fog
    scene.fog = new THREE.FogExp2(0x050813, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 30);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Architectural Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
    sunLight.position.set(20, 35, 25);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Wing accent rim lights
    const cyanRim = new THREE.PointLight(0x06b6d4, 5, 45);
    cyanRim.position.set(-14, 8, 12);
    scene.add(cyanRim);

    const violetRim = new THREE.PointLight(0xa855f7, 5, 45);
    violetRim.position.set(14, 12, 12);
    scene.add(violetRim);

    // Grand Podium Campus Plaza Base (الساحة المركزية)
    const plazaGeo = new THREE.CylinderGeometry(15, 16.5, 0.8, 48);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      roughness: 0.25,
      metalness: 0.85,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = -0.4;
    scene.add(plaza);

    // Perimeter Glowing Cyber Tracks
    const trackGeo = new THREE.RingGeometry(14.2, 15.1, 48);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
    const trackRing = new THREE.Mesh(trackGeo, trackMat);
    trackRing.rotation.x = -Math.PI / 2;
    trackRing.position.y = 0.02;
    scene.add(trackRing);

    // Inner Glowing Ring
    const innerTrackGeo = new THREE.RingGeometry(9.5, 10.2, 48);
    const innerTrackMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide });
    const innerRing = new THREE.Mesh(innerTrackGeo, innerTrackMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.03;
    scene.add(innerRing);

    // Main Campus Group containing All Wings, Bridges, and Towers
    const campusGroup = new THREE.Group();
    campusGroupRef.current = campusGroup;
    scene.add(campusGroup);

    floorGroupsMapRef.current.clear();

    // Reusable Materials
    const darkSlabMat = new THREE.MeshStandardMaterial({
      color: 0x0a101d,
      roughness: 0.35,
      metalness: 0.85,
    });

    const interiorFloorMat = new THREE.MeshStandardMaterial({
      color: 0x0d1527,
      roughness: 0.4,
      metalness: 0.7,
    });

    const dividerGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      roughness: 0.05,
      transmission: 0.75,
      clearcoat: 1.0,
    });

    // BUILD THE 10 FLOORS WITH PARTITIONED ROOMS (الأقسام داخل الطوابق)
    floors.forEach((fl) => {
      const floorGroup = new THREE.Group();
      const baseY = fl.heightOffset * 1.55;
      floorGroup.position.y = baseY;
      floorGroup.userData = { floorNum: fl.floorNum, floorConfig: fl };

      floorGroupsMapRef.current.set(fl.floorNum, floorGroup);

      const floorColor = new THREE.Color(fl.accentColor);
      const isRunning = activeApps.includes(fl.primaryAppId);

      // Determine Wing Placement Offset
      // Central Tower: x = 0
      // East Wing: x = 5.2
      // West Wing: x = -5.2
      const wingOffsetX = fl.wing === 'east' ? 5.2 : fl.wing === 'west' ? -5.2 : 0;
      floorGroup.position.x = wingOffsetX;

      const slabWidth = fl.wing === 'central' ? 5.4 : 4.6;
      const slabDepth = 4.6;

      // 1. Lower Floor Slab (قاعدة الطابق)
      const slabGeo = new THREE.BoxGeometry(slabWidth, 0.2, slabDepth);
      const slab = new THREE.Mesh(slabGeo, darkSlabMat);
      floorGroup.add(slab);

      // Floor Perimeter Neon Strip (شريط الإضاءة المحيطي للطابق)
      const edgeGeo = new THREE.BoxGeometry(slabWidth + 0.05, 0.05, slabDepth + 0.05);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: floorColor,
      });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.position.y = 0.1;
      floorGroup.add(edge);

      // 2. Interior Floor Surface Plate
      const interiorPlateGeo = new THREE.BoxGeometry(slabWidth - 0.2, 0.04, slabDepth - 0.2);
      const interiorPlate = new THREE.Mesh(interiorPlateGeo, interiorFloorMat);
      interiorPlate.position.y = 0.12;
      floorGroup.add(interiorPlate);

      // 3. Central Structural Lift Core / Elevator Column
      const coreGeo = new THREE.BoxGeometry(1.2, 1.3, 1.2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x040812,
        metalness: 0.95,
        roughness: 0.2,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.75;
      floorGroup.add(core);

      // 4. Exterior Glass Curtain Wall with Architectural Columns
      const glassGeo = new THREE.BoxGeometry(slabWidth - 0.15, 1.3, slabDepth - 0.15);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: isRunning ? floorColor : 0x1e293b,
        emissive: isRunning ? floorColor : 0x050914,
        emissiveIntensity: isRunning ? 0.35 : 0.06,
        transparent: true,
        opacity: 0.55,
        roughness: 0.08,
        metalness: 0.9,
        transmission: 0.75,
        clearcoat: 1.0,
      });
      const glassWall = new THREE.Mesh(glassGeo, glassMat);
      glassWall.position.y = 0.75;
      floorGroup.add(glassWall);

      // 5. Four Corner Architectural Mullions (الأعمدة الهندسية الزاوية)
      const colGeo = new THREE.BoxGeometry(0.12, 1.3, 0.12);
      const colMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      [
        [-slabWidth / 2 + 0.1, -slabDepth / 2 + 0.1],
        [slabWidth / 2 - 0.1, -slabDepth / 2 + 0.1],
        [-slabWidth / 2 + 0.1, slabDepth / 2 - 0.1],
        [slabWidth / 2 - 0.1, slabDepth / 2 - 0.1],
      ].forEach(([cx, cz]) => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(cx, 0.75, cz);
        floorGroup.add(col);
      });

      // 6. BUILD INDIVIDUAL INTERNAL PARTITIONS & DEPARTMENTS (الأقسام والغرف داخل الطابق)
      fl.departments.forEach((dept) => {
        const deptRoomGroup = new THREE.Group();
        deptRoomGroup.position.set(dept.roomOffset.x, 0.75, dept.roomOffset.z);
        deptRoomGroup.userData = { deptId: dept.id, deptConfig: dept, floorNum: fl.floorNum };

        const deptColor = new THREE.Color(dept.color);

        // Department Glowing Floor Pad (أرضية القسم المضيئة)
        const padGeo = new THREE.BoxGeometry(dept.size.width * 0.85, 0.04, dept.size.depth * 0.85);
        const padMat = new THREE.MeshStandardMaterial({
          color: 0x080f1d,
          emissive: deptColor,
          emissiveIntensity: 0.45,
          roughness: 0.2,
        });
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.y = -0.58;
        deptRoomGroup.add(pad);

        // Glass Partition Dividing Walls (الحواجز الزجاجية الفاصلة بين الأقسام)
        const wallGeo = new THREE.BoxGeometry(0.06, 1.1, dept.size.depth * 0.9);
        const wall = new THREE.Mesh(wallGeo, dividerGlassMat);
        wall.position.x = dept.roomOffset.x < 0 ? dept.size.width * 0.45 : -dept.size.width * 0.45;
        deptRoomGroup.add(wall);

        // Front Glass Doorway Partition with opening
        const doorWallGeo = new THREE.BoxGeometry(dept.size.width * 0.75, 1.1, 0.06);
        const doorWall = new THREE.Mesh(doorWallGeo, dividerGlassMat);
        doorWall.position.z = dept.roomOffset.z < 0 ? dept.size.depth * 0.45 : -dept.size.depth * 0.45;
        deptRoomGroup.add(doorWall);

        // Department Tech Console / Command Desk (محطة العمل التقنية للقسم)
        const deskGeo = new THREE.BoxGeometry(0.65, 0.45, 0.4);
        const deskMat = new THREE.MeshStandardMaterial({
          color: 0x050c18,
          metalness: 0.85,
          roughness: 0.25,
        });
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.set(0, -0.35, 0);
        deptRoomGroup.add(desk);

        // Holographic Terminal Pod on top of desk (شاشة ثلاثية الأبعاد مضيئة)
        const holoPodGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 16);
        const holoPodMat = new THREE.MeshStandardMaterial({
          color: 0x020617,
          emissive: deptColor,
          emissiveIntensity: 0.9,
          metalness: 0.9,
        });
        const holoPod = new THREE.Mesh(holoPodGeo, holoPodMat);
        holoPod.position.set(0, -0.05, 0);
        deptRoomGroup.add(holoPod);

        // Holographic Ring on top
        const holoRingGeo = new THREE.RingGeometry(0.12, 0.32, 16);
        const holoRingMat = new THREE.MeshBasicMaterial({ color: deptColor, side: THREE.DoubleSide });
        const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
        holoRing.rotation.x = -Math.PI / 2;
        holoRing.position.set(0, 0.15, 0);
        deptRoomGroup.add(holoRing);

        // Server Rack in the corner of this department
        const rackGeo = new THREE.BoxGeometry(0.3, 0.85, 0.3);
        const rackMat = new THREE.MeshStandardMaterial({
          color: 0x090e17,
          emissive: deptColor,
          emissiveIntensity: 0.25,
          metalness: 0.85,
        });
        const rack = new THREE.Mesh(rackGeo, rackMat);
        rack.position.set(dept.roomOffset.x < 0 ? -0.55 : 0.55, -0.15, 0.5);
        deptRoomGroup.add(rack);

        // Glowing Beacon / Room Entrance Identifier Sphere
        const roomSignGeo = new THREE.SphereGeometry(0.09, 12, 12);
        const roomSignMat = new THREE.MeshBasicMaterial({ color: deptColor });
        const roomSign = new THREE.Mesh(roomSignGeo, roomSignMat);
        roomSign.position.set(0, 0.5, 0.7);
        deptRoomGroup.add(roomSign);

        floorGroup.add(deptRoomGroup);
      });

      campusGroup.add(floorGroup);
    });

    // 7. SUSPENDED CONNECTING SKYBRIDGES (جسور زجاجية هوائية رابطة بين الأجنحة)
    const skybridgeGroup = new THREE.Group();
    skybridgeGroupRef.current = skybridgeGroup;
    campusGroup.add(skybridgeGroup);

    // Connecting Skybridges at Floor 2, Floor 4, Floor 5
    const bridgeLevels = [
      { y: 1 * 1.55 + 0.75, length: 2.8, east: true, west: false },
      { y: 3 * 1.55 + 0.75, length: 2.8, east: false, west: true },
      { y: 4 * 1.55 + 0.75, length: 2.8, east: true, west: true },
    ];

    bridgeLevels.forEach((bridge) => {
      // East Bridge
      if (bridge.east) {
        const bGeo = new THREE.BoxGeometry(2.4, 0.9, 1.2);
        const bMat = new THREE.MeshPhysicalMaterial({
          color: 0x0284c7,
          emissive: 0x0369a1,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
          metalness: 0.8,
          transmission: 0.7,
        });
        const eastBridge = new THREE.Mesh(bGeo, bMat);
        eastBridge.position.set(2.6, bridge.y, 0);
        skybridgeGroup.add(eastBridge);

        // Glowing fiber beam inside bridge
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.rotation.z = Math.PI / 2;
        beam.position.set(2.6, bridge.y, 0);
        skybridgeGroup.add(beam);
      }

      // West Bridge
      if (bridge.west) {
        const bGeo = new THREE.BoxGeometry(2.4, 0.9, 1.2);
        const bMat = new THREE.MeshPhysicalMaterial({
          color: 0xec4899,
          emissive: 0xbe185d,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
          metalness: 0.8,
          transmission: 0.7,
        });
        const westBridge = new THREE.Mesh(bGeo, bMat);
        westBridge.position.set(-2.6, bridge.y, 0);
        skybridgeGroup.add(westBridge);

        // Glowing fiber beam inside west bridge
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.rotation.z = Math.PI / 2;
        beam.position.set(-2.6, bridge.y, 0);
        skybridgeGroup.add(beam);
      }
    });

    // 8. ROOFTOP HELIPAD & ANTENNA SPIRE ON CENTRAL TOWER (مهبط الطائرات والهوائيات)
    const centralTopY = 9 * 1.55 + 1.2;
    const helipadGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.4, 24);
    const helipadMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      metalness: 0.85,
      roughness: 0.3,
    });
    const helipad = new THREE.Mesh(helipadGeo, helipadMat);
    helipad.position.set(0, centralTopY, 0);
    campusGroup.add(helipad);

    // Helipad "H" Marking ring
    const hRingGeo = new THREE.RingGeometry(1.4, 1.6, 24);
    const hRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const hRing = new THREE.Mesh(hRingGeo, hRingMat);
    hRing.rotation.x = -Math.PI / 2;
    hRing.position.set(0, centralTopY + 0.22, 0);
    campusGroup.add(hRing);

    // Spire Telecom Antenna
    const spireGeo = new THREE.CylinderGeometry(0.06, 0.22, 3.8, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, centralTopY + 2.3, 0);
    campusGroup.add(spire);

    // Glowing Beacon at Antenna Tip
    const beaconGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, centralTopY + 4.3, 0);
    campusGroup.add(beacon);

    // East Wing Roof Garden / Terraces (سطح الجناح الشرقي)
    const eastTopY = 4 * 1.55 + 1.1;
    const eastRoofGeo = new THREE.BoxGeometry(4.4, 0.25, 4.4);
    const eastRoofMat = new THREE.MeshStandardMaterial({ color: 0x042f2e, roughness: 0.5 });
    const eastRoof = new THREE.Mesh(eastRoofGeo, eastRoofMat);
    eastRoof.position.set(5.2, eastTopY, 0);
    campusGroup.add(eastRoof);

    // West Wing Roof Solar Array / Antenna (سطح الجناح الغربي)
    const westTopY = 6 * 1.55 + 1.1;
    const westRoofGeo = new THREE.BoxGeometry(4.4, 0.25, 4.4);
    const westRoofMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 });
    const westRoof = new THREE.Mesh(westRoofGeo, westRoofMat);
    westRoof.position.set(-5.2, westTopY, 0);
    campusGroup.add(westRoof);

    // Animation Render Loop
    let animId: number;
    const animate = () => {
      camera.position.lerp(targetCameraPosRef.current, 0.05);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.05);
      camera.lookAt(currentLookAtRef.current);

      if (!isOrbitingRef.current && isAutoRotating && !cameraZoomed) {
        campusGroup.rotation.y += 0.002;
      }

      // Beacon pulsating beacon glow
      const time = Date.now() * 0.005;
      beacon.scale.setScalar(1 + Math.sin(time) * 0.3);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [floors, activeApps, cameraZoomed, isAutoRotating]);

  // Orbit Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, [role="slider"]')) return;
    isOrbitingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOrbitingRef.current || !campusGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    orbitAngleYRef.current += deltaX * 0.007;
    orbitAngleXRef.current = Math.max(-0.4, Math.min(0.6, orbitAngleXRef.current + deltaY * 0.004));

    campusGroupRef.current.rotation.y = orbitAngleYRef.current;
    campusGroupRef.current.rotation.x = orbitAngleXRef.current;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isOrbitingRef.current = false;
  };

  // Raycasting on 3D Campus to detect clicked Department or Floor
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;

      while (obj && !obj.userData?.deptConfig && !obj.userData?.floorConfig) {
        obj = obj.parent;
      }

      if (obj?.userData?.deptConfig) {
        const dept = obj.userData.deptConfig as DepartmentConfig;
        const floorNum = obj.userData.floorNum as number;
        handleEnterDepartment(dept, floorNum);
        return;
      }

      if (obj?.userData?.floorConfig) {
        const floor = obj.userData.floorConfig as ComplexFloor;
        if (floor.departments.length > 0) {
          handleEnterDepartment(floor.departments[0], floor.floorNum);
        }
        return;
      }
    }
  };

  // Active Floor & Active Department
  const activeFloor = floors.find((f) => f.floorNum === (selectedFloorNum || hoveredFloorNum)) || floors[0];
  const activeDept =
    activeFloor?.departments.find((d) => d.id === (selectedDeptId || hoveredDeptId)) ||
    activeFloor?.departments[0];

  return (
    <div className="relative w-full h-full bg-[#040711] flex flex-col overflow-hidden select-none">
      {/* Top Architectural Campus Bar */}
      <div className="px-6 py-3 border-b border-slate-900 bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                مجمّع المنظومة الهندسية المقسم (DevCore Modular Tech Campus 3D)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                10 طوابق مقسمة · 24 قسماً وغرفة برمجية
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              مجمّع معماري هندسي متكامل: طوابق مقسمة تضم أجنحة البرمجة، والذكاء الاصطناعي، وقواعد البيانات، والحصن الأمني.
            </p>
          </div>
        </div>

        {/* View Controls & Floor Explode Controller */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher: 3D Complex vs Floor Blueprint */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => {
                sound.playClick(650);
                setViewMode('3d-complex');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === '3d-complex'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>مجسم المجمّع 3D</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(650);
                setViewMode('blueprint');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === 'blueprint'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>المخطط المعماري للأقسام (Blueprint)</span>
            </button>
          </div>

          {/* Explode Floors Slider (تفكيك الطوابق) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] whitespace-nowrap">تفكيك الطوابق:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodeFactor}
              onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
              title="تفكيك الطوابق واستعراض الأقسام الداخلية"
            />
            <span className="text-[10px] text-cyan-400 font-mono w-7">
              {Math.round(explodeFactor * 100)}%
            </span>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleZoom(1)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
              title="تقريب (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
              title="إبعاد (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => {
              sound.playClick(550);
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isAutoRotating
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="تشغيل / إيقاف الدوران التلقائي"
          >
            دوران 360°
          </button>

          {/* Complex Management Modal Button */}
          <button
            onClick={() => {
              sound.playClick(750);
              setIsManagementOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-sky-600/30 hover:from-cyan-600/50 hover:to-sky-600/50 text-cyan-200 border border-cyan-500/50 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-500/10 active:scale-95"
            title="إدارة المجمع: إضافة طوابق جديدة وأقسام تقنية وتوزيع الطاقة"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>إدارة المجمع التقني (إضافة طوابق وأقسام)</span>
          </button>

          {/* Overview Reset Button */}
          {cameraZoomed && (
            <button
              onClick={handleResetOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono transition-all shadow-md active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>معاينة شاملة</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Complex Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* VIEW 1: 3D THREE.JS CAMPUS VIEW */}
        <div
          ref={mountRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          className={`w-full h-full cursor-grab active:cursor-grabbing ${
            viewMode === '3d-complex' ? 'block' : 'hidden'
          }`}
        />

        {/* VIEW 2: ARCHITECTURAL BLUEPRINT & FLOOR PARTITION PLAN (المخطط الهندسي المقسم) */}
        {viewMode === 'blueprint' && (
          <div className="w-full h-full bg-[#050814] circuit-grid-bg p-8 flex flex-col justify-start items-center overflow-y-auto font-mono text-xs z-10">
            <div className="max-w-4xl w-full bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <SplitSquareVertical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      المخطط المعماري الهندسي للأقسام (Architectural Floor Plan)
                    </h3>
                    <p className="text-xs text-slate-400">
                      استعراض التقسيمات الهندسية والغرف البرمجية داخل {activeFloor.label} ({activeFloor.name})
                    </p>
                  </div>
                </div>

                {/* Floor Switcher Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {floors.map((fl) => (
                    <button
                      key={fl.floorNum}
                      onClick={() => {
                        sound.playClick(600);
                        setSelectedFloorNum(fl.floorNum);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                        activeFloor.floorNum === fl.floorNum
                          ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                          : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      ط{fl.floorNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floor Plan Blueprint Grid */}
              <div className="relative border-2 border-dashed border-cyan-500/30 rounded-xl p-8 bg-slate-950/80 mb-6">
                <div className="absolute top-2 left-3 text-[10px] text-cyan-400/60 uppercase">
                  CAD BLUEPRINT LEVEL {activeFloor.floorNum} · {activeFloor.wing.toUpperCase()} WING
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeFloor.departments.map((dept, idx) => (
                    <div
                      key={dept.id}
                      onClick={() => handleEnterDepartment(dept, activeFloor.floorNum)}
                      style={{ borderColor: `${dept.color}60` }}
                      className="border rounded-xl p-4 bg-slate-900/40 hover:bg-slate-900/80 transition-all cursor-pointer group shadow-lg hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="font-bold text-slate-100 text-xs">
                            {dept.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          غرفة 0{activeFloor.floorNum}-{idx + 1}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                        {dept.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-cyan-300">{dept.subFeature}</span>
                        <div className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-[-2px] transition-transform">
                          <span>دخول القسم</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>انقر على أي غرفة برمجية للدخول المباشر وتشغيل البرنامج</span>
                <button
                  onClick={() => setViewMode('3d-complex')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all"
                >
                  العودة للمنظور المجسم 3D
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Left Side: Modular Tech Campus Directory (الدليل المعماري لأقسام المجمع) */}
        <div className="absolute top-6 left-6 z-20 w-80 max-h-[calc(100%-48px)] flex flex-col bg-slate-950/92 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden font-mono text-xs">
          {/* Directory Header with Wing Tabs */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>دليل أقسام المجمّع المعماري</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">10 طوابق</span>
            </div>

            {/* Wing Filter Buttons */}
            <div className="flex items-center gap-1 text-[10px]">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'central', label: 'البرج الرئيسي' },
                { id: 'east', label: 'الجناح الشرقي' },
                { id: 'west', label: 'الجناح الغربي' },
              ].map((wingTab) => (
                <button
                  key={wingTab.id}
                  onClick={() => {
                    sound.playClick(500);
                    setSelectedWing(wingTab.id as 'all' | 'central' | 'east' | 'west');
                  }}
                  className={`flex-1 py-1 px-1.5 rounded text-center transition-all ${
                    selectedWing === wingTab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {wingTab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2 right-2.5" />
              <input
                type="text"
                placeholder="ابحث عن قسم أو نموذج أو أداة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono"
              />
            </div>
          </div>

          {/* Scrollable Floor & Partitioned Departments Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredFloors.map((fl) => {
              const isFloorExpanded = !!expandedFloorList[fl.floorNum];
              const isFloorActive = selectedFloorNum === fl.floorNum;

              return (
                <div
                  key={fl.floorNum}
                  className="rounded-xl border border-slate-800/60 bg-slate-900/30 overflow-hidden"
                >
                  {/* Floor Header Bar */}
                  <button
                    onClick={() => toggleFloorExpand(fl.floorNum)}
                    onMouseEnter={() => setHoveredFloorNum(fl.floorNum)}
                    onMouseLeave={() => setHoveredFloorNum(null)}
                    style={{
                      borderRight: `3px solid ${fl.accentColor}`,
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-right transition-colors ${
                      isFloorActive
                        ? 'bg-slate-850 text-white font-bold'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: fl.accentColor }}
                      />
                      <div className="truncate">
                        <div className="text-[11px] font-semibold text-slate-100 truncate">
                          {fl.name}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">{fl.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {fl.departments.length} أقسام
                      </span>
                      {isFloorExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Partitioned Departments List Inside this Floor (الأقسام داخل الطابق) */}
                  {isFloorExpanded && (
                    <div className="p-1.5 space-y-1 bg-slate-950/60 border-t border-slate-900">
                      {fl.departments.map((dept) => {
                        const isDeptSelected = selectedDeptId === dept.id;

                        return (
                          <button
                            key={dept.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnterDepartment(dept, fl.floorNum);
                            }}
                            onMouseEnter={() => {
                              setHoveredFloorNum(fl.floorNum);
                              setHoveredDeptId(dept.id);
                            }}
                            onMouseLeave={() => setHoveredDeptId(null)}
                            style={{
                              borderColor: isDeptSelected ? dept.color : undefined,
                              backgroundColor: isDeptSelected ? `${dept.color}20` : undefined,
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-right transition-all flex items-center justify-between border cursor-pointer ${
                              isDeptSelected
                                ? 'border-cyan-500/60 shadow-sm text-cyan-200'
                                : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/80 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <DoorOpen className="w-3 h-3 text-cyan-400 shrink-0" />
                              <div className="truncate">
                                <div className="text-[10px] font-medium text-slate-200 truncate">
                                  {dept.name}
                                </div>
                                <div className="text-[8px] text-slate-500 font-mono">
                                  {dept.subFeature}
                                </div>
                              </div>
                            </div>

                            <ExternalLink className="w-3 h-3 text-slate-500 hover:text-cyan-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Bottom: Active Department Holographic Inspection Card */}
        {activeDept && activeFloor && (
          <div
            className="absolute bottom-6 right-6 z-20 max-w-sm w-full bg-slate-950/95 border rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fade-in font-mono"
            style={{ borderColor: `${activeDept.color}80` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: activeDept.color }}
                />
                <span className="text-xs font-bold text-white truncate">
                  {activeFloor.label} · {activeDept.name}
                </span>
              </div>
              <span
                className="text-[9px] px-2 py-0.5 rounded font-mono shrink-0"
                style={{
                  backgroundColor: `${activeDept.color}20`,
                  color: activeDept.color,
                  border: `1px solid ${activeDept.color}40`,
                }}
              >
                غرفة برمجية مستقلة
              </span>
            </div>

            {/* Department Specs */}
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              {activeDept.description}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 space-y-1 mb-3">
              <div className="flex justify-between">
                <span>المجمّع:</span>
                <span className="text-slate-200 font-semibold">{activeFloor.name}</span>
              </div>
              <div className="flex justify-between">
                <span>الجناح:</span>
                <span className="text-cyan-400">
                  {activeFloor.wing === 'central'
                    ? 'البرج المركزي'
                    : activeFloor.wing === 'east'
                    ? 'الجناح الشرقي'
                    : 'الجناح الغربي'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>الميزة التخصصية:</span>
                <span className="text-cyan-300">{activeDept.subFeature}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-900">
              <span className="text-[9px] text-slate-500 font-mono truncate">
                {activeDept.nameEn}
              </span>
              <button
                onClick={() => handleEnterDepartment(activeDept, activeFloor.floorNum)}
                disabled={isEntering}
                style={{ backgroundColor: activeDept.color }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <span>{isEntering ? 'جاري الدخول...' : 'دخول القسم الآن'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Enter Department Flash Overlay */}
        {isEntering && (
          <div className="absolute inset-0 bg-cyan-950/50 backdrop-blur-sm z-30 flex items-center justify-center animate-pulse pointer-events-none">
            <div className="p-6 rounded-2xl bg-slate-950/95 border border-cyan-400 shadow-2xl text-center font-mono space-y-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block animate-ping" />
              <div className="text-sm font-bold text-cyan-300">
                الدخول الفيزيائي المباشر إلى {activeDept?.name}...
              </div>
              <p className="text-xs text-slate-400">
                تهيئة الجناح البرمجي وفتح شاشة التطبيق
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-6 py-2.5 border-t border-slate-900 bg-slate-950/90 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono z-20">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">🏢 مجمّع المنظومة البرمجية:</span>
          <span>10 طوابق مقسمة تضم أجنحة وغرفاً برمجية مستقلة لكل أداة وخدمة</span>
        </div>
        <div className="text-slate-500 text-[11px] flex items-center gap-3">
          <span>اسحب بالماوس للتدوير 360° أو استخدم شريط تفكيك الطوابق لكشف الأقسام</span>
          <span className="text-cyan-400">· انقر على أي قسم للدخول الفوري</span>
        </div>
      </div>

      {/* Campus Management & Floor/Department Editor Modal */}
      {isManagementOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl my-auto text-slate-100 font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    إدارة مجمّع البرمجيات الذكي (Campus Operations Center)
                  </h3>
                  <p className="text-xs text-slate-400">
                    إضافة طوابق جديدة، تخصيص الأقسام البرمجية، وإدارة شبكات الخوادم والتشفير
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManagementOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Management Tabs */}
            <div className="mt-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => { sound.playClick(600); setManagementTab('floors'); }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  managementTab === 'floors'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>إضافة وإدارة الطوابق ({floors.length})</span>
              </button>
              <button
                onClick={() => { sound.playClick(600); setManagementTab('departments'); }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  managementTab === 'departments'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>إضافة أقسام تقنية (سيرفرات / تشفير)</span>
              </button>
              <button
                onClick={() => { sound.playClick(600); setManagementTab('telemetry'); }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  managementTab === 'telemetry'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>الطاقة والتبريد والعزل الأمني</span>
              </button>
            </div>

            {/* Tab 1: Floors Manager */}
            {managementTab === 'floors' && (
              <div className="mt-4 space-y-4">
                <form onSubmit={handleAddNewFloor} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-cyan-300 block">
                    إضافة طابق هندسي جديد للمجمّع:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">رقم الطابق:</label>
                      <input
                        type="number"
                        min="1"
                        value={newFloorInput.floorNum}
                        onChange={(e) => setNewFloorInput({ ...newFloorInput, floorNum: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">اسم الطابق بالعربية:</label>
                      <input
                        type="text"
                        placeholder="مجمّع الحوسبة الفائقة"
                        value={newFloorInput.name}
                        onChange={(e) => setNewFloorInput({ ...newFloorInput, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">الجناح المعماري:</label>
                      <select
                        value={newFloorInput.wing}
                        onChange={(e) => setNewFloorInput({ ...newFloorInput, wing: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="central">البرج المركزي</option>
                        <option value="east">الجناح الشرقي</option>
                        <option value="west">الجناح الغربي</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">التسمية بالإنجليزية:</label>
                      <input
                        type="text"
                        value={newFloorInput.nameEn}
                        onChange={(e) => setNewFloorInput({ ...newFloorInput, nameEn: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">اللون المميز للمجسم:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newFloorInput.accentColor}
                          onChange={(e) => setNewFloorInput({ ...newFloorInput, accentColor: e.target.value })}
                          className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newFloorInput.accentColor}
                          onChange={(e) => setNewFloorInput({ ...newFloorInput, accentColor: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-emerald-400">
                      ✓ يتم الحفظ التلقائي وتحديث المجسم ثلاثي الأبعاد فوراً
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة الطابق الآن</span>
                    </button>
                  </div>
                </form>

                {/* Existing floors list */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <span className="text-xs text-slate-400 block mb-1">الطوابق الحالية بالمجمع:</span>
                  {floors.map((fl) => (
                    <div
                      key={fl.floorNum}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fl.accentColor }} />
                        <span className="font-bold text-white">ط{fl.floorNum}: {fl.name}</span>
                        <span className="text-slate-500 text-[10px]">({fl.departments.length} أقسام)</span>
                      </div>
                      {floors.length > 1 && (
                        <button
                          onClick={() => handleDeleteFloor(fl.floorNum)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded"
                          title="حذف الطابق"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Departments Manager */}
            {managementTab === 'departments' && (
              <div className="mt-4 space-y-4">
                {/* Quick Presets for requested departments */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-2">
                    أقسام تقنية مقترحة مسبقاً (انقر للتعبئة السريعة):
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setNewDeptInput({
                          floorNum: 4,
                          name: 'قسم إدارة السيرفرات والبنية التحتية',
                          nameEn: 'Server Infrastructure & Cluster Deck',
                          appId: 'pipeline',
                          wing: 'west',
                          color: '#38bdf8',
                          subFeature: 'Server Clusters & Orchestration',
                          description: 'إدارة وتنسيق مصفوفات السيرفرات والمتحكمات وموازنات الحمل والـ Clusters.',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60"
                    >
                      🖥️ قسم إدارة السيرفرات
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setNewDeptInput({
                          floorNum: 3,
                          name: 'قسم التشفير والمفاتيح الأمنية HSM',
                          nameEn: 'Hardware Cryptography & Key Vault',
                          appId: 'security',
                          wing: 'central',
                          color: '#818cf8',
                          subFeature: 'HSM Cryptography Core',
                          description: 'تشفير AES-256 ودوران المفاتيح الرقمية وحماية بروتوكولات الاتصال الآمن.',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60"
                    >
                      🔐 قسم التشفير
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(600);
                        setNewDeptInput({
                          floorNum: 9,
                          name: 'قسم الذكاء الاصطناعي العصبي R&D',
                          nameEn: 'Neural AI R&D Laboratory',
                          appId: 'ai',
                          wing: 'central',
                          color: '#a855f7',
                          subFeature: 'Multi-Model Neural Core',
                          description: 'مختبرات تدريب ونشر نماذج الذكاء التوليدي والاستدلالي.',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-violet-950/60 border border-violet-500/40 text-violet-300 hover:bg-violet-900/60"
                    >
                      🧠 قسم الذكاء الاصطناعي
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddNewDept} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-cyan-300 block">
                    نموذج إضافة قسم تقني جديد:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">اختر الطابق المستهدف:</label>
                      <select
                        value={newDeptInput.floorNum}
                        onChange={(e) => setNewDeptInput({ ...newDeptInput, floorNum: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        {floors.map((fl) => (
                          <option key={fl.floorNum} value={fl.floorNum}>
                            ط{fl.floorNum}: {fl.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">اسم القسم بالعربية:</label>
                      <input
                        type="text"
                        value={newDeptInput.name}
                        onChange={(e) => setNewDeptInput({ ...newDeptInput, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">الجناح المعماري:</label>
                      <select
                        value={newDeptInput.wing}
                        onChange={(e) => setNewDeptInput({ ...newDeptInput, wing: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="central">البرج المركزي</option>
                        <option value="east">الجناح الشرقي</option>
                        <option value="west">الجناح الغربي</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">الميزة التخصصية:</label>
                      <input
                        type="text"
                        value={newDeptInput.subFeature}
                        onChange={(e) => setNewDeptInput({ ...newDeptInput, subFeature: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">اللون المميز للقسم:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newDeptInput.color}
                          onChange={(e) => setNewDeptInput({ ...newDeptInput, color: e.target.value })}
                          className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newDeptInput.color}
                          onChange={(e) => setNewDeptInput({ ...newDeptInput, color: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة وتثبيت القسم في الطابق</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Telemetry & Power Controls */}
            {managementTab === 'telemetry' && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-1">شبكة الطاقة المركزية</div>
                    <div className="text-base font-bold text-cyan-300 font-mono">100% Active</div>
                    <div className="text-[9px] text-slate-500 mt-1">توزيع مستقر لجميع الأجنحة</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-1">حرارة تبريد السيرفرات</div>
                    <div className="text-base font-bold text-emerald-400 font-mono">18.2°C Optimal</div>
                    <div className="text-[9px] text-slate-500 mt-1">تبريد مائي سحابي مستمر</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-1">التشفير والأمان HSM</div>
                    <div className="text-base font-bold text-indigo-400 font-mono">AES-256 Armed</div>
                    <div className="text-[9px] text-slate-500 mt-1">دوران المفاتيح كل 24 ساعة</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">العزل الأمني الشامل (Emergency Lockdown)</div>
                    <div className="text-[10px] text-slate-400">إغلاق جميع الممرات الرقمية وتفعيل نمط الحماية الفائقة</div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playSiren();
                      setIsLockdownActive(!isLockdownActive);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isLockdownActive
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isLockdownActive ? 'العزل الأمني مُفعّل' : 'تفعيل العزل الأمني'}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleResetToDefaultFloors}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    إعادة ضبط المجمع للطوابق الافتراضية
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
