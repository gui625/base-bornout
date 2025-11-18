// server/server.cjs — backend local do Gemini (CommonJS)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// node-fetch compat (funciona no Node 18/20 e versões mais antigas)
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

// Banco SQLite
const db = require("./db.cjs");

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

// ---- IA (Gemini) - VERSÃO ORIGINAL
// ---- IA (Gemini)

// helper pra esperar entre os retries
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(prompt, apiKey, model, maxRetries = 3) {
  const baseUrl = "https://generativelanguage.googleapis.com/v1/models";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const url = `${baseUrl}/${model}:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    let data = null;
    try {
      data = await r.json();
    } catch {
      data = null;
    }

    console.log("STATUS GEMINI:", r.status);
    console.log("BODY GEMINI:", JSON.stringify(data, null, 2));

    // se estiver sobrecarregado ou com rate limit, tenta de novo
    if (r.status === 503 || r.status === 429) {
      console.warn(
        `Gemini indisponível (tentativa ${attempt}/${maxRetries}).`
      );
      if (attempt === maxRetries) {
        return {
          error:
            "O modelo de IA está indisponível no momento. Tente novamente em instantes.",
        };
      }
      await sleep(500 * attempt);
      continue;
    }

    // outros erros da API
    if (!r.ok || data?.error) {
      const errMsg =
        data?.error?.message || `Falha na API Gemini (status ${r.status})`;
      return { error: errMsg };
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível gerar resposta agora.";
    return { reply };
  }

  return {
    error: "Não foi possível obter resposta da IA. Tente novamente mais tarde.",
  };
}

app.post("/api/gemini", async (req, res) => {
  try {
    const { message = "", history = [] } = req.body ?? {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // Aceita histórico em 2 formatos
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
- Não dê diagnóstico médico. Inclua avisos de buscar um profissional quando necessário.
- Seja conciso (3–6 frases).`;

    const prompt =
      system +
      (stitched ? `\n\n${stitched}` : "") +
      `\n\nUsuário: ${message}\nIA:`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY ausente no .env" });
    }

    // 👇 modelo configurável via .env
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const result = await callGeminiWithRetry(prompt, apiKey, model, 3);

    if (result.error) {
      return res.status(502).json({ error: result.error });
    }

    return res.json({ reply: result.reply });
  } catch (e) {
    console.error("Erro /api/gemini:", e);
    return res
      .status(500)
      .json({ error: e?.message ?? "Falha na API Gemini" });
  }
});
function getLevelFromScore(score) {
  if (score <= 8) return "baixo";
  if (score <= 15) return "moderado";
  return "alto";
}

function getRiskProfile(score) {
  if (score <= 8) {
    return "No momento, você apresenta poucos sinais de burnout, mas é importante manter hábitos saudáveis.";
  }
  if (score <= 15) {
    return "Você apresenta sinais de alerta para burnout, principalmente em relação à sobrecarga e cansaço. É recomendado revisar sua rotina e, se possível, buscar orientação profissional.";
  }
  return "Você apresenta muitos sinais de burnout. O ideal é procurar um médico ou psicólogo para uma avaliação mais aprofundada e pensar em ajustes na carga de trabalho e autocuidado.";
}

// =============== ROTAS DO BANCO (QUIZ) ===============

// DEBUG DO BANCO
app.get("/api/quiz-results/debug", (req, res) => {
  try {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all();

    const row = db
      .prepare("SELECT COUNT(*) as total FROM quiz_results")
      .get();

    return res.json({
      ok: true,
      tables,
      totalRows: row.total,
    });
  } catch (err) {
    console.error("Erro em /api/quiz-results/debug:", err);
    return res.status(500).json({
      ok: false,
      error: String(err),
    });
  }
});

// ROTA DE TESTE DO BANCO
app.get("/api/quiz-results/test", (req, res) => {
  try {
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO quiz_results (name, email, score, level, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = insert.run(
      "Teste",
      "teste@example.com",
      10,
      "baixo",
      now
    );

    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM quiz_results
    `);
    const row = countStmt.get();

    return res.json({
      ok: true,
      insertedId: info.lastInsertRowid,
      totalRows: row.total,
    });
  } catch (err) {
    console.error("Erro em /api/quiz-results/test:", err);
    return res.status(500).json({
      ok: false,
      error: String(err),
    });
  }
});

// Salvar resultado do quiz (versão enriquecida)
app.post("/api/quiz-results", (req, res) => {
  try {
    const { name, email, score, level, answers } = req.body ?? {};

    if (typeof score !== "number") {
      return res
        .status(400)
        .json({ error: "Score (number) é obrigatório." });
    }

    const finalLevel = level || getLevelFromScore(score);
    const riskProfile = getRiskProfile(score);

    const answersJson = answers ? JSON.stringify(answers) : null;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO quiz_results (name, email, score, level, answers_json, risk_profile, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      name || null,
      email || null,
      score,
      finalLevel,
      answersJson,
      riskProfile,
      now
    );

    return res.status(201).json({
      id: info.lastInsertRowid,
      message: "Resultado salvo com sucesso.",
      level: finalLevel,
      risk_profile: riskProfile,
    });
  } catch (err) {
    console.error("Erro /api/quiz-results (POST):", err);
    return res.status(500).json({ error: "Erro ao salvar resultado do quiz." });
  }
});

// Listar resultados (ex.: tela de estatísticas)
app.get("/api/quiz-results", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT
        id,
        name,
        email,
        score,
        level,
        risk_profile,
        created_at
      FROM quiz_results
      ORDER BY created_at DESC
    `);

    const rows = stmt.all();
    return res.json(rows);
  } catch (err) {
    console.error("Erro /api/quiz-results (GET):", err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar resultados do quiz." });
  }
});


// ---- Server
const PORT = process.env.PORT || 3001;
// Bind 0.0.0.0 para Codespaces / containers
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API local em http://0.0.0.0:${PORT}`);
});
