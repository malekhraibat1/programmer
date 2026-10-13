import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Assistant Route for Engineer Malek Hraibat
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, contextCode, taskType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'يرجى تقديم الاستفسار أو المهمة المطلوبة.' });
    }

    const systemInstruction = `أنت المساعد الذكي الهندسي لمنظومة المهندس مالك حريبات (Eng. Malek Hraibat - DevCore).
أنت مهندس برمجيات محترف وخبير في المعمارية البرمجية وهندسة النظم (Senior Systems & Software Architect).
تتحدث باللغة العربية بأسلوب تقني راقٍ ومباشر مع الحفاظ على المصطلحات التقنية الإنجليزية عند الحاجة.
مهمتك:
- تحليل الأكواد البرمجية وتحسينها
- اقتراح المعماريات وتطوير الخوارزميات
- حل المشكلات البرمجية والتصحيح
- صياغة شفرات برمجية نظيفة وقابلة للصيانة تليق بمعايير المهندس مالك حريبات.
اجعل إجاباتك محددة وعملية ومرفقة بأمثلة كود جاهزة ونظيفة عند الطلب.`;

    let userContent = prompt;
    if (contextCode) {
      userContent = `[كود المهندس مالك حريبات المرجعي]:\n\`\`\`typescript\n${contextCode}\n\`\`\`\n\n[المهمة المطلوبة]:\n${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'لم يتمكن المحرك الذكي من توليد إجابة.';
    return res.json({ reply, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: 'تعذر الاتصال بمحرك الذكاء الاصطناعي حالياً.',
      details: error?.message || 'خطأ غير متوقع',
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
