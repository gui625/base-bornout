import React, { useState } from "react";
import { API_BASE } from "../services/api"; // ⬅️ NOVO IMPORT

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

const IA: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Eu sou a MindCare, sua assistente para prevenção de burnout. Como você está se sentindo hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // adiciona mensagem do usuário na tela
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/api/gemini`, {   // ⬅️ AQUI TROCOU
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages,
        }),
      });

      const data = await resp.json();

      const reply: string =
        data?.reply ||
        "Desculpe, não consegui responder agora. Tente novamente em instantes.";

      setMessages([
        ...nextMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Tive um problema para falar com o servidor no momento. Tente de novo mais tarde.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>
      <h2 style={{ marginBottom: 16 }}>Assistente MindCare</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          height: "60vh",
          overflowY: "auto",
          marginBottom: 12,
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "8px 12px",
                borderRadius: 12,
                backgroundColor:
                  msg.role === "user" ? "#1976d2" : "#e0e0e0",
                color: msg.role === "user" ? "#fff" : "#000",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 4,
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                backgroundColor: "#e0e0e0",
                fontSize: 12,
              }}
            >
              MindCare está digitando...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        style={{ display: "flex", gap: 8, marginTop: 4 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite como você está se sentindo..."
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#1976d2",
            color: "#fff",
            cursor: loading ? "default" : "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default IA;
