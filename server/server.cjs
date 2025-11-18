// server/server.cjs — backend local do Gemini + Prisma (CommonJS)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// node-fetch compat (funciona no Node 18/20 e versões mais antigas)
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ---- Middlewares
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// ---- Healthcheck
app.get("/", (_req, res) => {
  res.send("MindCare API OK");
});

// ---- Chat: criar sessão
app.post("/api/chat/session", async (req, res) => {
  try {
    const { userId = null } = req.body ?? {};
    const session = await prisma.chatSession.create({
      data: userId ? { userId } : {},
    });
    return res.json({ sessionId: session.id });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha ao criar sessão" });
  }
});

// ---- Chat: salvar mensagem
app.post("/api/chat/message", async (req, res) => {
  try {
    const { sessionId, sender, text } = req.body ?? {};
    if (!sessionId || !sender || !text) {
      return res.status(400).json({ error: "sessionId, sender e text são obrigatórios" });
    }
    const msg = await prisma.chatMessage.create({
      data: { sessionId, sender, text },
    });
    return res.json({ id: msg.id });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha ao salvar mensagem" });
  }
});

// ---- Chat: listar mensagens da sessão
app.get("/api/chat/session/:id/messages", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const msgs = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });
    return res.json(msgs);
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha ao listar mensagens" });
  }
});

// ---- Quiz: salvar resultado
app.post("/api/quiz", async (req, res) => {
  try {
    const { score, total, answers, userId = null } = req.body ?? {};
    if (typeof score !== "number" || typeof total !== "number" || !answers) {
      return res.status(400).json({ error: "score, total e answers são obrigatórios" });
    }
    const result = await prisma.quizResult.create({
      data: {
        score,
        total,
        answersJson: JSON.stringify(answers),
        ...(userId ? { userId } : {}),
      },
    });
    return res.json({ id: result.id });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha ao salvar quiz" });
  }
});

// ---- Quiz: obter resultado por id
app.get("/api/quiz/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.quizResult.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Resultado não encontrado" });
    return res.json({
      id: result.id,
      createdAt: result.createdAt,
      score: result.score,
      total: result.total,
      answers: JSON.parse(result.answersJson),
      userId: result.userId ?? null,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha ao obter quiz" });
  }
});

// ---- IA (Gemini) com persistência opcional
app.post("/api/gemini", async (req, res) => {
  try {
    const { message = "", history = [], sessionId: bodySessionId = null } = req.body ?? {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // Aceita histórico em dois formatos:
    // 1) [{ role: "user" | "assistant", content: "..." }]
    // 2) [{ user: "...", ai: "..." }]
    const stitched =
      (Array.isArray(history) ? history : [])
        .map((h) => {
          if (h && typeof h === "object") {
            if ("role" in h && "content" in h) {
              if (h.role === "user") return `Usuário: ${h.content}`;
              if (h.role === "assistant") return `IA: ${h.content}`;
            } else if ("user" in h || "ai" in h) {
              const a = [];
              if (h.user) a.push(`Usuário: ${h.user}`);
              if (h.ai) a.push(`IA: ${h.ai}`);
              return a.join("\n");
            }
          }
          return "";
        })
        .filter(Boolean)
        .join("\n\n");

    const system = `Você é um assistente gentil e objetivo sobre prevenção de burnout.
- Fale em português do Brasil, com empatia e linguagem clara.
- Não dê diagnóstico médico. Inclua avisos de procurar um profissional quando necessário.
- Seja conciso (3–6 frases) e, quando útil, liste passos práticos.
- Se perguntarem sobre crises agudas (ideação suicida, autolesão), incentive buscar ajuda profissional e linhas de apoio locais.`;

    const prompt =
      system +
      (stitched ? `\n\n${stitched}` : "") +
      `\n\nUsuário: ${message}\nIA:`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY ausente no .env" });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    let data;
    try {
      data = await r.json();
    } catch {
      data = null;
    }

    if (!r.ok) {
      const errMsg = data?.error?.message || `Falha na API Gemini (status ${r.status})`;
      return res.status(502).json({ error: errMsg });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar resposta agora.";

    // Persistência opcional: cria sessão se não vier, salva pergunta e resposta
    let sessionId = bodySessionId;
    try {
      if (!sessionId) {
        const session = await prisma.chatSession.create({ data: {} });
        sessionId = session.id;
      }
      await prisma.chatMessage.create({ data: { sessionId, sender: "user", text: String(message) } });
      await prisma.chatMessage.create({ data: { sessionId, sender: "assistant", text: String(reply) } });
    } catch (persistErr) {
      // Não quebra a resposta da IA se falhar persistência
      console.warn("Falha ao persistir chat:", persistErr?.message);
    }

    return res.json({ reply, sessionId });
  } catch (e) {
    return res.status(500).json({ error: e?.message ?? "Falha na API Gemini" });
  }
});

// ---- Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API local em http://0.0.0.0:${PORT}`);
});

// Graceful shutdown do Prisma
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
