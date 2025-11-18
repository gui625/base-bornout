import React from "react";
import IA from "../components/IA";
import { useHistory } from "react-router-dom";

const Chatbot: React.FC = () => {
  const history = useHistory();

  const handleFinishChat = () => {
    history.push("/final");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {/* IA (card completo) */}
        <IA />

        {/* Botão centralizado embaixo do card */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <button
            onClick={handleFinishChat}
            style={{
              backgroundColor: "#ff4d4f",
              border: "none",
              padding: "12px 22px",
              color: "white",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Finalizar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
