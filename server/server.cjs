// server/server.cjs — backend local do Gemini (CommonJS)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// node-fetch compat (funciona no Node 18/20 e versões mais antigas)
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

dotenv.config();

const app = express();

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

// ---- IA (Gemini)
app.post("/api/gemini", async (req, res) => {
  try {
    const { message = "", history = [] } = req.body ?? {};
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
      // Importante: cada request cria um body novo (evita 'Body already read')
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // Trata erros de rede/Google
    let data;
    try {
      data = await r.json();
    } catch {
      data = null;
    }

    if (!r.ok) {
      const errMsg =
        data?.error?.message ||
        `Falha na API Gemini (status ${r.status})`;
      return res.status(502).json({ error: errMsg });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível gerar resposta agora.";
    return res.json({ reply });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e?.message ?? "Falha na API Gemini" });
  }
});

// ---- Server
const PORT = process.env.PORT || 3001;
// Bind 0.0.0.0 para Codespaces / containers
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API local em http://0.0.0.0:${PORT}`);
});
