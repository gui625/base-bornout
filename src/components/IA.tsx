import React, { useState } from "react";
import { chatGemini, ChatTurn } from "../utils/api";

export default function IA() {
  const [msgs, setMsgs] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Oi! Posso te dar dicas rápidas para reduzir estresse e prevenir burnout. Como posso te apoiar hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMsgs = [...msgs, { role: "user", content: text }];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await chatGemini(text, nextMsgs);
      setMsgs([...nextMsgs, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err?.message || "Falha ao consultar a IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "auto", padding: 16 }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          height: 360,
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                background: m.role === "user" ? "#0078ff" : "#e0e0e0",
                color: m.role === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: 12,
                display: "inline-block",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={onSend}
        style={{ display: "flex", marginTop: 12, gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
