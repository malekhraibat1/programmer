import { AppNode, CircuitConnection, ApiEndpoint, DatabaseTable, SavedSnippet, AiProgram, AiModelConfig } from '../types/index.ts';

export const INITIAL_APP_NODES: AppNode[] = [
  {
    id: 'persona',
    name: 'بصمة المهندس مالك حريبات',
    nameEn: 'Eng. Malek Hraibat Persona',
    category: 'الهوية والمعمارية',
    description: 'بصمة المهندس مالك حريبات، الفلسفة المعمارية، وتوقيع النظم الرقمية.',
    iconName: 'UserCheck',
    x: 50,
    y: 16,
    status: 'active',
    accentColor: '#38bdf8', // sky-400
    connectedTo: ['ide', 'ai', 'vault', 'telemetry', 'security'],
    stats: [
      { label: 'المهندس', value: 'مالك حريبات' },
      { label: 'المعمارية', value: 'Lead Architect' },
    ],
  },
  {
    id: 'ai',
    name: 'المساعد الذكي (Gemini AI)',
    nameEn: 'AI Neural Copilot',
    category: 'الذكاء الاصطناعي',
    description: 'محرك الذكاء الاصطناعي لتحليل الكود وتوليد الخوارزميات والمعماريات المتقدمة.',
    iconName: 'BrainCircuit',
    x: 32,
    y: 28,
    status: 'active',
    accentColor: '#8b5cf6', // violet-500
    connectedTo: ['persona', 'ide', 'vault'],
    stats: [
      { label: 'المحرك', value: 'Gemini 3.8 Flash' },
      { label: 'الحالة', value: 'Online' },
    ],
  },
  {
    id: 'vault',
    name: 'سجل الأكواد والملفات',
    nameEn: 'Personal Code Vault',
    category: 'المستودع الشخصي',
    description: 'سجل لحفظ وتوثيق الأكواد والملفات البرمجية الخاصة بالمهندس مالك حريبات.',
    iconName: 'FolderGit2',
    x: 68,
    y: 28,
    status: 'active',
    accentColor: '#f43f5e', // rose-500
    connectedTo: ['persona', 'ide', 'ai', 'database'],
    stats: [
      { label: 'الملفات', value: 'محفوظة محلياً' },
      { label: 'التصنيف', value: '6 تصنيفات' },
    ],
  },
  {
    id: 'ide',
    name: 'محرر الأكواد والمنطق',
    nameEn: 'Code Studio IDE',
    category: 'التطوير والتنفيذ',
    description: 'بيئة كتابة الشفرة البرمجية واختبار الخوارزميات وتنفيذ المنطق التفاعلي.',
    iconName: 'Code',
    x: 20,
    y: 35,
    status: 'active',
    accentColor: '#06b6d4', // cyan-500
    connectedTo: ['persona', 'api', 'pipeline', 'terminal'],
    stats: [
      { label: 'الملف النشط', value: 'engine.ts' },
      { label: 'الأداء', value: '60 FPS' },
    ],
  },
  {
    id: 'api',
    name: 'بوابة الـ API والشبكات',
    nameEn: 'API Gateway & Mesh',
    category: 'الاتصال والخدمات',
    description: 'إدارة مسارات REST و GraphQL وتوجيه الطلبات عبر الشبكة بدقة.',
    iconName: 'Network',
    x: 22,
    y: 70,
    status: 'active',
    accentColor: '#10b981', // emerald-500
    connectedTo: ['ide', 'database', 'security'],
    stats: [
      { label: 'المعدل', value: '1.2k req/s' },
      { label: 'الزمن', value: '18ms' },
    ],
  },
  {
    id: 'database',
    name: 'قاعدة البيانات والذاكرة',
    nameEn: 'Database & Cache Vault',
    category: 'التخزين والاستعلام',
    description: 'مستودع البيانات العلائقية ومخزن الكاش اللحظي عالي السرعة.',
    iconName: 'Database',
    x: 50,
    y: 82,
    status: 'active',
    accentColor: '#f59e0b', // amber-500
    connectedTo: ['api', 'telemetry', 'security'],
    stats: [
      { label: 'الجداول', value: '14 جداول' },
      { label: 'Hit Rate', value: '98.4%' },
    ],
  },
  {
    id: 'pipeline',
    name: 'خط النشر والعمليات (CI/CD)',
    nameEn: 'DevOps & Pipeline',
    category: 'الأتمتة والنشر',
    description: 'دورات الفحص، بناء الحاويات، الاختبارات التلقائية والنشر السحابي.',
    iconName: 'GitMerge',
    x: 80,
    y: 35,
    status: 'idle',
    accentColor: '#ec4899', // pink-500
    connectedTo: ['ide', 'telemetry', 'terminal'],
    stats: [
      { label: 'Build Status', value: 'Passed' },
      { label: 'Tests', value: '142 / 142' },
    ],
  },
  {
    id: 'security',
    name: 'درع الأمان والتوثيق',
    nameEn: 'Security & Auth Shield',
    category: 'الحماية والمصادقة',
    description: 'تحليل رموز JWT، جدار الحماية، تشفير الحزم، وصلاحيات الـ RBAC.',
    iconName: 'ShieldCheck',
    x: 50,
    y: 50,
    status: 'active',
    accentColor: '#6366f1', // indigo-500
    connectedTo: ['persona', 'api', 'database'],
    stats: [
      { label: 'التشفير', value: 'AES-256' },
      { label: 'Zero-Trust', value: 'مفعل' },
    ],
  },
  {
    id: 'telemetry',
    name: 'مرصد الأداء والتحليل',
    nameEn: 'Metrics & Telemetry',
    category: 'المراقبة والصحة',
    description: 'متابعة استهلاك المعالج، الذاكرة، اختناقات الـ Event Loop والأعطال.',
    iconName: 'Activity',
    x: 78,
    y: 70,
    status: 'active',
    accentColor: '#14b8a6', // teal-500
    connectedTo: ['persona', 'pipeline', 'database'],
    stats: [
      { label: 'CPU Load', value: '14%' },
      { label: 'Event Loop', value: '0.8ms' },
    ],
  },
  {
    id: 'terminal',
    name: 'طرفية المهندس (CLI)',
    nameEn: 'Interactive Terminal',
    category: 'التحكم والأوامر',
    description: 'واجهة سطر أوامر تفاعلية للتحكم في المنظومة واستدعاء الدوال والأدوات.',
    iconName: 'Terminal',
    x: 50,
    y: 96,
    status: 'active',
    accentColor: '#a855f7', // purple-500
    connectedTo: ['ide', 'pipeline'],
    stats: [
      { label: 'Shell', value: 'zsh / core-v2' },
      { label: 'الأوامر', value: 'متاحة' },
    ],
  },
];

export const CIRCUIT_CONNECTIONS: CircuitConnection[] = [
  // Persona to Core logic and IDE & AI
  { from: 'persona', to: 'ide', label: 'توجيه المنطق والمعمارية', flowType: 'data', active: true, pulseSpeed: 2.2 },
  { from: 'persona', to: 'ai', label: 'تغذية الذكاء الاصطناعي بالمعايير', flowType: 'data', active: true, pulseSpeed: 1.5 },
  { from: 'persona', to: 'vault', label: 'أرشفة الأكواد الخاصة بالمهندس', flowType: 'data', active: true, pulseSpeed: 1.8 },
  { from: 'persona', to: 'security', label: 'قواعد الثقة والتحقق', flowType: 'auth', active: true, pulseSpeed: 2.5 },
  { from: 'persona', to: 'telemetry', label: 'مراقبة الرؤية البرمجية', flowType: 'telemetry', active: true, pulseSpeed: 3 },

  // AI connections
  { from: 'ai', to: 'ide', label: 'توليد واقتراح الشفرات البرمجية', flowType: 'data', active: true, pulseSpeed: 1.2 },
  { from: 'ai', to: 'vault', label: 'تحليل وتوثيق الملفات المحفوظة', flowType: 'data', active: true, pulseSpeed: 1.6 },

  // Vault connections
  { from: 'vault', to: 'ide', label: 'تحميل ملفات وسجلات المهندس', flowType: 'data', active: true, pulseSpeed: 1.7 },
  { from: 'vault', to: 'database', label: 'مزامنة السجلات البرمجية', flowType: 'data', active: true, pulseSpeed: 2.1 },

  // IDE to API & Pipeline
  { from: 'ide', to: 'api', label: 'تصدير نقاط النهاية', flowType: 'data', active: true, pulseSpeed: 1.8 },
  { from: 'ide', to: 'pipeline', label: 'Git Commit & Push', flowType: 'deploy', active: true, pulseSpeed: 2.8 },
  { from: 'ide', to: 'terminal', label: 'إشارات التصحيح (Stdout)', flowType: 'data', active: true, pulseSpeed: 3.5 },

  // Security center links
  { from: 'security', to: 'api', label: 'JWT & Rate Limiting', flowType: 'auth', active: true, pulseSpeed: 1.6 },
  { from: 'security', to: 'database', label: 'تشفير الاتصال والبيانات', flowType: 'auth', active: true, pulseSpeed: 2.0 },

  // API to Database
  { from: 'api', to: 'database', label: 'استعلامات SQL & Cache', flowType: 'data', active: true, pulseSpeed: 1.4 },

  // Database to Telemetry
  { from: 'database', to: 'telemetry', label: 'إحصائيات الاتصالات والـ I/O', flowType: 'telemetry', active: true, pulseSpeed: 2.4 },

  // Pipeline to Telemetry & Terminal
  { from: 'pipeline', to: 'telemetry', label: 'مؤشرات النشر الصحي', flowType: 'telemetry', active: true, pulseSpeed: 3.2 },
  { from: 'pipeline', to: 'terminal', label: 'سجلات البناء (Build Logs)', flowType: 'deploy', active: true, pulseSpeed: 2.6 },
];

export const SAMPLE_CODE_SNIPPETS = [
  {
    filename: 'engineer-core.ts',
    language: 'typescript',
    code: `// DevCore: جوهر المنظومة البرمجية
interface SoftwareEngineer {
  name: string;
  mindset: "ProblemSolver" | "SystemsArchitect";
  principles: string[];
  cleanCode: boolean;
}

export class DigitalArchitect implements SoftwareEngineer {
  name = "المهندس الرقمي";
  mindset = "SystemsArchitect" as const;
  principles = [
    "البساطة قبل التعقيد",
    "المرونة المعمارية والموثوقية",
    "الأتمتة بدلاً من التكرار",
    "الأمان بالتصميم (Security by Design)"
  ];
  cleanCode = true;

  public async orchestrateSystem(load: number): Promise<{ status: string; efficiency: string }> {
    const memoryCheck = load < 85 ? "Optimal" : "Scaling Required";
    console.log(\`[SYSTEM] تشغيل المعالجة بحمل \${load}% -> الحالة: \${memoryCheck}\`);
    return {
      status: "Operational",
      efficiency: "99.8%"
    };
  }
}

// تنفيذ المحاكاة الآن:
const core = new DigitalArchitect();
core.orchestrateSystem(35);`,
  },
  {
    filename: 'data-pipeline.ts',
    language: 'typescript',
    code: `// تدفق معالجة البيانات غير المتزامنة
export async function streamDataPipeline(records: any[]) {
  const transformed = records.map((record) => ({
    id: record.id,
    processedAt: new Date().toISOString(),
    status: "PROCESSED",
    hash: Math.random().toString(36).substring(2, 9)
  }));

  console.log(\`تمت معالجة \${transformed.length} سجلاً بنجاح عبر خط الأنابيب.\`);
  return transformed;
}

streamDataPipeline([{ id: 101 }, { id: 102 }, { id: 103 }]);`,
  },
  {
    filename: 'security-token.ts',
    language: 'typescript',
    code: `// التحقق من صلاحيات الدخول
export function verifyToken(payload: { role: string; exp: number }) {
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error("Expired Token / الرمز منتهي الصلاحية");
  }
  return {
    authorized: payload.role === "LeadEngineer",
    scope: ["read:cluster", "deploy:production", "mutate:database"]
  };
}

console.log(verifyToken({ role: "LeadEngineer", exp: Math.floor(Date.now() / 1000) + 3600 }));`,
  },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'ep-1',
    method: 'GET',
    path: '/api/v1/engineer/profile',
    name: 'معلومات هوية المهندس',
    description: 'استرجاع الهوية المعمارية، المهارات الأساسية، والمشاريع النشطة.',
    response: {
      status: 200,
      timeMs: 14,
      body: {
        role: "Senior Full-Stack & Systems Engineer",
        philosophy: "Architecting resilient, self-healing digital engines.",
        stack: ["TypeScript", "Go", "React", "PostgreSQL", "Docker", "Kubernetes"],
        availability: "Active & Solving Problems",
        timestamp: "2026-10-13T14:35:00Z"
      }
    }
  },
  {
    id: 'ep-2',
    method: 'POST',
    path: '/api/v1/cluster/deploy',
    name: 'طلب نشر تحديث برمجي',
    description: 'إطلاق حزمة التحديث البرمجية الجديدة عبر خط الأنابيب السحابي.',
    defaultPayload: JSON.stringify({
      version: "v2.4.0",
      targetEnv: "production",
      replicas: 3,
      healthCheckPath: "/healthz"
    }, null, 2),
    response: {
      status: 201,
      timeMs: 42,
      body: {
        deploymentId: "dep_9a87f2c1",
        status: "ROLLING_UPDATE_STARTED",
        podsCreated: 3,
        estimatedTime: "24 seconds",
        zeroDowntime: true
      }
    }
  },
  {
    id: 'ep-3',
    method: 'GET',
    path: '/api/v1/telemetry/health',
    name: 'فحص صحة المنظومة والذاكرة',
    description: 'استعلام نبضات الخوادم، الذاكرة المتاحة، وزمن استجابة الشبكة.',
    response: {
      status: 200,
      timeMs: 9,
      body: {
        status: "HEALTHY",
        uptime: "99.994%",
        latencyP99: "22ms",
        memoryHeapUsedMb: 342,
        activeConnections: 1840
      }
    }
  },
  {
    id: 'ep-4',
    method: 'POST',
    path: '/api/v1/security/auth',
    name: 'مصادقة الهوية الرقمية',
    description: 'توليد مفتاح جلسة آمن ومحمي ضد هجمات إعادة الإرسال.',
    defaultPayload: JSON.stringify({
      clientId: "devcore-mesh-client",
      scope: "read:all write:production"
    }, null, 2),
    response: {
      status: 200,
      timeMs: 28,
      body: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.s5...[PROTECTED]",
        tokenType: "Bearer",
        expiresIn: 7200,
        mfaVerified: true
      }
    }
  }
];

export const DATABASE_TABLES: DatabaseTable[] = [
  {
    name: 'projects_ecosystem',
    rowCount: 5,
    columns: ['id', 'title', 'architecture', 'status', 'deployments'],
    records: [
      { id: 1, title: 'DevCore Engine', architecture: 'Micro-Frontend & Mesh', status: 'Active', deployments: 84 },
      { id: 2, title: 'Cloud Pulse Analytics', architecture: 'Event-Driven (Kafka)', status: 'Active', deployments: 41 },
      { id: 3, title: 'Secure Vault Auth', architecture: 'Zero-Trust OAuth2', status: 'Active', deployments: 119 },
      { id: 4, title: 'Distributed Graph DB', architecture: 'Raft Consensus', status: 'Staging', deployments: 16 },
      { id: 5, title: 'AI Code Assistant Proxy', architecture: 'Serverless Edge', status: 'Active', deployments: 63 },
    ]
  },
  {
    name: 'system_commits',
    rowCount: 4,
    columns: ['hash', 'author', 'message', 'branch', 'verified'],
    records: [
      { hash: '7f9a12c', author: 'Software Engineer', message: 'feat: add reactive circuit bus lines', branch: 'main', verified: 'true' },
      { hash: 'e4b0981', author: 'Software Engineer', message: 'perf: optimize event loop latency to 0.8ms', branch: 'main', verified: 'true' },
      { hash: '88c12a0', author: 'Software Engineer', message: 'security: enforce strict JWT validation', branch: 'main', verified: 'true' },
      { hash: '2d3e4f5', author: 'Software Engineer', message: 'refactor: modularize API router endpoints', branch: 'feature/api', verified: 'true' },
    ]
  },
  {
    name: 'engineer_skills',
    rowCount: 6,
    columns: ['domain', 'skill', 'proficiency', 'years_experience'],
    records: [
      { domain: 'Core Languages', skill: 'TypeScript / Node.js', proficiency: '98%', years_experience: '7' },
      { domain: 'System Design', skill: 'Microservices & Distributed Systems', proficiency: '95%', years_experience: '6' },
      { domain: 'Database & Cache', skill: 'PostgreSQL / Redis / Drizzle', proficiency: '92%', years_experience: '6' },
      { domain: 'Cloud & DevOps', skill: 'Docker, Kubernetes, CI/CD pipelines', proficiency: '90%', years_experience: '5' },
      { domain: 'Security & Auth', skill: 'OAuth2, JWT, Zero-Trust Architecture', proficiency: '94%', years_experience: '5' },
      { domain: 'Frontend & UI', skill: 'React, Tailwind, Motion, Web Audio', proficiency: '96%', years_experience: '6' },
    ]
  }
];

export const INITIAL_SAVED_SNIPPETS: SavedSnippet[] = [
  {
    id: 'snip-1',
    title: 'خوارزمية محدد المعدل الموزع (Token Bucket)',
    filename: 'rate-limiter.ts',
    language: 'typescript',
    category: 'backend',
    description: 'تطبيق موزع لخوارزمية Token Bucket لحماية واجهات الـ API من الضغط العالي مع دعم Redis.',
    tags: ['Redis', 'RateLimit', 'TypeScript', 'Security'],
    author: 'المهندس مالك حريبات',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-13',
    code: `// بصمة المهندس مالك حريبات (Malek Hraibat)
// Distributed Token Bucket Rate Limiter with Redis
export class TokenBucketRateLimiter {
  private capacity: number;
  private refillRatePerSec: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
  }

  public async acquire(clientId: string, tokensRequested: number = 1): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    // حساب التوكن المتاح بناء على الفاصل الزمني
    console.log(\`[Malek Engine] فحص العميل \${clientId} لطلب \${tokensRequested} توكن\`);
    return {
      allowed: true,
      remaining: this.capacity - tokensRequested
    };
  }
}`,
  },
  {
    id: 'snip-2',
    title: 'نظام إعادة المحاولة مع التراجع الأسي (Resilient Retry)',
    filename: 'resilient-retry.ts',
    language: 'typescript',
    category: 'algorithms',
    description: 'دالة إعادة محاولة ذكية تدعم التراجع الأسي (Exponential Backoff) مع عامل اهتزاز عشوائي (Jitter).',
    tags: ['Resilience', 'Async', 'FaultTolerance'],
    author: 'المهندس مالك حريبات',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-12',
    code: `// بصمة المهندس مالك حريبات (Malek Hraibat)
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 200
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const jitter = Math.random() * 100;
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      console.warn(\`[Retry \${attempt}/\${maxRetries}] انتظار \${Math.round(delay)}ms...\`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("تجاوز الحد الأقصى للمحاولات.");
}`,
  },
  {
    id: 'snip-3',
    title: 'مخطط البيانات الأساسي وأنماط الأداء',
    filename: 'schema-architecture.sql',
    language: 'sql',
    category: 'database',
    description: 'مخطط PostgreSQL متكامل يتضمن فهارس B-Tree والتقسيم الزمني للجداول الضخمة.',
    tags: ['PostgreSQL', 'SQL', 'Indexes', 'Schema'],
    author: 'المهندس مالك حريبات',
    createdAt: '2026-09-25',
    updatedAt: '2026-10-11',
    code: `-- بصمة المهندس مالك حريبات (Malek Hraibat)
-- Optimized PostgreSQL Schema
CREATE TABLE IF NOT EXISTS malek_systems_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(64) NOT NULL,
  event_type VARCHAR(32) NOT NULL,
  latency_ms NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء فهرس عالي السرعة للبحث الزمني
CREATE INDEX IF NOT EXISTS idx_audit_service_time 
ON malek_systems_audit(service_name, created_at DESC);`,
  },
  {
    id: 'snip-4',
    title: 'تكوين بيئة الحاويات الآمنة (Docker Multi-Stage)',
    filename: 'Dockerfile.optimized',
    language: 'dockerfile',
    category: 'infrastructure',
    description: 'ملف بناء حاوية إنتاجي متعدد المراحل مبني على Alpine بأصغر حجم وحماية كاملة.',
    tags: ['Docker', 'DevOps', 'Security', 'Alpine'],
    author: 'المهندس مالك حريبات',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-13',
    code: `# بصمة المهندس مالك حريبات (Malek Hraibat)
# Production Multi-Stage Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
USER node
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
  },
];

export const AI_PROGRAMS: AiProgram[] = [
  {
    id: 'gemini-architect',
    name: 'معماري الأنظمة والحلول (Systems Architect)',
    nameEn: 'Systems Architect AI',
    category: 'المعمارية والتصميم',
    description: 'توليد وتخطيط معماريات Microservices الموزعة، تدفق الرسائل، وتصميم الأنظمة القابلة للتوسع اللانهائي.',
    iconName: 'Cpu',
    accentColor: '#38bdf8', // sky-400
    badge: 'معمارية النظم',
    defaultPrompt: 'قم بتصميم معمارية نظام موزع عالي الأداء يعالج 10,000 طلب/ثانية مع تفصيل المكونات ونقاط الربط.',
    sampleInput: 'نظام إدارة مدفوعات وتحويلات مالية لحظية مع كفالة عدم تكرار الخصم (Idempotency).',
  },
  {
    id: 'code-auditor',
    name: 'مدقق ومراجع الشفرات (Deep Code Auditor)',
    nameEn: 'Deep Code Auditor AI',
    category: 'التدقيق والتحسين',
    description: 'فحص جودة الشفرات البرمجية، تحليل التعقيد الزمني والمكاني O(n)، واكتشاف الأخطاء الصامتة.',
    iconName: 'SearchCode',
    accentColor: '#06b6d4', // cyan-500
    badge: 'فحص وتحليل',
    defaultPrompt: 'راجع هذا الكود البرمجي واقترح تحسينات للأداء وتقليل استهلاك الذاكرة وتبسيط القراءة:',
    sampleInput: `async function processQueue(items) {
  for (let i = 0; i < items.length; i++) {
    await db.query("INSERT INTO logs VALUES (" + items[i].id + ")");
  }
}`,
  },
  {
    id: 'security-scanner',
    name: 'فاحص الأمان والثغرات (Zero-Trust Security AI)',
    nameEn: 'Security & Vulnerability AI',
    category: 'الأمان السيبراني',
    description: 'تدقيق الأمان البرمجي، التحقق من ثغرات الحقن (Injection, XSS, CSRF)، وفحص صلاحيات الرموز المشفرة.',
    iconName: 'ShieldAlert',
    accentColor: '#6366f1', // indigo-500
    badge: 'أمان سيبراني',
    defaultPrompt: 'افحص هذا المكون واكتشف أي ثغرات أمنية محتملة مع تقديم الحل الأمني المعتمد:',
    sampleInput: `app.post('/api/login', (req, res) => {
  const { user, pass } = req.body;
  const token = jwt.sign({ user }, "secret123");
  res.json({ token });
});`,
  },
  {
    id: 'test-generator',
    name: 'مُولد الاختبارات التلقائية (Test Suite Synthesizer)',
    nameEn: 'Automated Test Synthesizer',
    category: 'ضمان الجودة',
    description: 'توليد اختبارات الوحدة واختبارات التكامل وحالات الحافة (Edge Cases) الشاملة بدقة 100%.',
    iconName: 'CheckCheck',
    accentColor: '#10b981', // emerald-500
    badge: 'اختبارات آلية',
    defaultPrompt: 'اكتب مجموعة اختبارات شاملة (Unit & Edge Cases Tests) باستخدام Jest / Vitest لهذه الدالة:',
    sampleInput: `export function calculateRateLimitWindow(requests, windowMs) {
  const valid = requests.filter(r => Date.now() - r.timestamp < windowMs);
  return valid.length <= 100;
}`,
  },
  {
    id: 'sql-optimizer',
    name: 'مُركّب ومُحسّن استعلامات SQL (SQL & Schema AI)',
    nameEn: 'SQL & Index Optimizer AI',
    category: 'قواعد البيانات',
    description: 'صياغة استعلامات SQL معقدة، تصميم الفهارس B-Tree، وتحسين خطط الاستعلام (Explain Analyze).',
    iconName: 'Database',
    accentColor: '#f59e0b', // amber-500
    badge: 'قواعد البيانات',
    defaultPrompt: 'صمم استعلام SQL عالي السرعة مع استراتيجية الفهرسة المناسبة للجدول التالي:',
    sampleInput: 'جدول يحتوي على 5 ملايين سجل، ونريد استرجاع أحدث 20 حركة لكل مستخدم مع زمن استجابة أقل من 5ms.',
  },
  {
    id: 'api-synthesizer',
    name: 'مُنشئ وموثق واجهات الـ API (API Contract AI)',
    nameEn: 'API Contract & Mock AI',
    category: 'الشبكات والخدمات',
    description: 'توليد مواصفات OpenAPI / Swagger، نماذج البيانات Zod، ومحاكي بيانات الاختبار Mock Payloads.',
    iconName: 'Network',
    accentColor: '#14b8a6', // teal-500
    badge: 'واجهات API',
    defaultPrompt: 'قم بإنشاء مواصفات REST API كاملة مع TypeScript Interfaces ومخطط التحقق Zod Schema لخدمة:',
    sampleInput: 'خدمة إدارة الجلسات ومصادقة المستخدمين مع دعم صلاحيات الـ RBAC وتجديد الرموز.',
  },
  {
    id: 'performance-profiler',
    name: 'محلل الأداء والذاكرة (Performance Profiler AI)',
    nameEn: 'Memory & Event Loop Profiler',
    category: 'الأداء والتشغيل',
    description: 'حل اختناقات الـ Event Loop، منع تسريب الذاكرة (Memory Leaks)، وتحسين زمن الاستجابة P99.',
    iconName: 'Zap',
    accentColor: '#ec4899', // pink-500
    badge: 'تسريع الأداء',
    defaultPrompt: 'حلل مشكلة بطء الأداء هذه واقترح حلولاً ملموسة لتقليل زمن الاستجابة إلى أقل من 20ms:',
    sampleInput: 'خدمة Node.js تسجل Event Loop Lag يصل إلى 45ms عند معالجة دفعات JSON ضخمة.',
  },
  {
    id: 'ui-synthesizer',
    name: 'مُصمم ومُولد مكونات الواجهة (UI & Tailwind Synthesizer)',
    nameEn: 'Component Synthesizer AI',
    category: 'واجهات المستخدم',
    description: 'توليد مكونات React نظيفة مع تنسيق Tailwind CSS متقن، ودعم كامل للوصولية (A11y) والوضع الداكن.',
    iconName: 'Layout',
    accentColor: '#8b5cf6', // violet-500
    badge: 'واجهات عصرية',
    defaultPrompt: 'اكتب مكون React كامل مع Tailwind CSS يتميز بالأناقة وسلاسة التفاعل والحركات الخفيفة:',
    sampleInput: 'شاشة مراقبة لحظية لمؤشرات الأداء مع مؤشرات دائرية وأزرار تحكم سريعة.',
  },
];

export const AI_MODELS: AiModelConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT 4o',
    provider: 'OpenAI',
    version: 'GPT-4o Enterprise',
    badge: 'GPT-4o',
    color: '#10a37f',
    accentBg: 'rgba(16, 163, 127, 0.15)',
    borderColor: 'rgba(16, 163, 127, 0.4)',
    description: 'نموذج ChatGPT 4o الرائد من OpenAI — سرعة فائقة في كتابة الكود وحلول المعمارية المتكاملة.',
    specialty: 'معمارية النظم & إعادة هيكلة الكود & تكامل الخدمات',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    version: 'V3 / R1 Reasoner',
    badge: 'DeepSeek R1',
    color: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.15)',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    description: 'محرك الاستدلال والتفكير العميق DeepSeek R1 — متخصص في الخوارزميات المعقدة والتحليل الرياضي.',
    specialty: 'تفكير متسلسل & خوارزميات مكثفة & تدقيق عميق للثغرات',
  },
  {
    id: 'claude',
    name: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    version: 'Claude 3.5 / 4',
    badge: 'Claude 4',
    color: '#ea580c',
    accentBg: 'rgba(234, 88, 12, 0.15)',
    borderColor: 'rgba(234, 88, 12, 0.4)',
    description: 'نموذج Claude المتقدم من Anthropic — شفرات برمجية فائقة الأناقة، فكر دفاعي وتوثيق نقي.',
    specialty: 'كود نظيف Clean Code & هندسة البرمجيات الدفاعية & توثيق دقيق',
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    provider: 'Google DeepMind',
    version: 'Gemini / Gemma',
    badge: 'Gemini',
    color: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    description: 'محرك الذكاء الاصطناعي من Google — سياق واسع وسرعة استجابة فائقة مدمجة في DevCore.',
    specialty: 'معالجة فورية & سياق عملاق & حوسبة سحابية موزعة',
  },
];


