import React, { useEffect, useRef, useState } from "react";

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
        "Olá! Eu sou o Nout, sua assistente para prevenção de burnout. Como você está se sentindo hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // rola automaticamente pro fim sempre que o chat mudar
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setErrorMsg(null);

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data?.error) {
        const msg =
          data?.error ||
          "Não consegui falar com a Nout agora. Tente novamente em alguns instantes.";
        setErrorMsg(msg);
        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content:
              "Tive um probleminha ao responder agora, mas você pode tentar novamente em alguns instantes.",
          },
        ]);
        return;
      }

      const reply: string =
        data?.reply ||
        "Desculpe, não consegui responder agora. Tente novamente em instantes.";

      setMessages([
        ...nextMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Erro de conexão com o servidor. Verifique sua internet ou tente mais tarde."
      );
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
    <div
      style={{
        // tiramos o minHeight: "100vh" e o gradiente
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        padding: "24px 0 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,            // card mais largo
          backgroundColor: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #79e4ff, #007194)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            N
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Nout IA</h2>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#666",
              }}
            >
              Assistente para prevenção de burnout
            </p>
          </div>
        </header>

        {/* Área de mensagens */}
        <div
          style={{
            padding: "16px 20px",
            flex: 1,
            // dá uma altura mínima pro chat ficar mais "alto"
            minHeight: 260,
            maxHeight: "55vh",      // rolagem só aqui dentro
            overflowY: "auto",
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
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: 16,
                  backgroundColor:
                    msg.role === "user" ? "#1976d2" : "#e0e0e0",
                  color: msg.role === "user" ? "#fff" : "#000",
                  whiteSpace: "pre-wrap",
                  fontSize: 14,
                  lineHeight: 1.4,
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
                  padding: "8px 12px",
                  borderRadius: 16,
                  backgroundColor: "#e0e0e0",
                  fontSize: 12,
                  color: "#555",
                }}
              >
                Nout está digitando...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mensagem de erro */}
        {errorMsg && (
          <div
            style={{
              padding: "6px 20px",
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              fontSize: 12,
              borderTop: "1px solid #ffcdd2",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 8,
            backgroundColor: "#fff",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite como você está se sentindo..."
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ccc",
              fontSize: 14,
              outline: "none",
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              backgroundColor:
                loading || !input.trim() ? "#90caf9" : "#1976d2",
              color: "#fff",
              cursor: loading || !input.trim() ? "default" : "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default IA;
