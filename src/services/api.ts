// src/services/api.ts

function getApiBase(): string {
  const origin = window.location.origin;

  // --- Detecta Codespaces ---
  if (origin.includes("app.github.dev")) {
    // Se o front está no 3000, troca por 3001
    return origin
      .replace("-3000.", "-3001.")
      .replace("-5173.", "-3001.");
  }

  // --- Ambiente local ---
  if (origin.includes("localhost")) {
    return "http://localhost:3001";
  }

  // --- Fallback ---
  return origin;
}

export const API_BASE = getApiBase();
