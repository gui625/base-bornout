import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import baseQuestions from '../utils/burnoutQuestions';
import { API_BASE } from "../services/api";   // ⬅️ IMPORTANTE

const OPTIONS = [
  { label: 'Sim, com frequência', value: 'sim_com_frequencia' },
  { label: 'Sim, porém com pouca frequência', value: 'sim_pouca_frequencia' },
  { label: 'Não tenho certeza', value: 'nao_tenho_certeza' },
  { label: 'Não', value: 'nao' },
];

const isPositive = (value: string | null) => {
  return value === 'sim_com_frequencia' || value === 'sim_pouca_frequencia';
};

const getProfile = () => {
  try {
    const raw = localStorage.getItem('authUser');
    const user = raw ? JSON.parse(raw) : null;
    const email = user?.username || '';
    const pRaw = email ? localStorage.getItem(`userProfile:${email}`) : null;
    return pRaw ? JSON.parse(pRaw) : null;
  } catch (e) {
    return null;
  }
};

const buildProfileQuestions = (profile: any) => {
  if (!profile) return [];
  const { profissao, idade, tempoTrabalho } = profile;
  const q: { question: string }[] = [];
  if (profissao) {
    q.push({ question: `Na sua área de ${profissao}, você sente pressão diária para atingir metas?` });
    q.push({ question: `Seu ambiente de ${profissao} dificulta pausas durante o expediente?` });
  }
  if (typeof idade === 'number' && idade > 0) {
    q.push({ question: `Com ${idade} anos, percebe alterações no sono relacionadas ao trabalho?` });
  }
  if (typeof tempoTrabalho === 'number' && tempoTrabalho > 0) {
    q.push({ question: `Trabalhando cerca de ${tempoTrabalho} horas por dia, você se sente exausto ao final?` });
  }
  return q;
};

const BurnoutQuiz: React.FC = () => {
  const profile = getProfile();
  const allQuestions = [...baseQuestions, ...buildProfileQuestions(profile)];

  const [answers, setAnswers] = useState<(string | null)[]>(Array(allQuestions.length).fill(null));
  const [clickedIndex, setClickedIndex] = useState<{ idx: number; value: string } | null>(null);
  const history = useHistory();

  const handleAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    setClickedIndex({ idx: index, value });
    setTimeout(() => setClickedIndex(null), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const score = answers.filter(a => isPositive(a)).length;

    let level = "baixo";
    if (score >= 10) level = "alto";
    else if (score >= 5) level = "moderado";

    // pega e-mail do usuário
    const user = JSON.parse(localStorage.getItem("authUser") || "{}");
    const email = user?.username || null;

    // salva no backend
    try {
      await fetch(`${API_BASE}/api/quiz-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email,
          email,
          score,
          level,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
    }

    // vai para tela final
    history.push('/results', { score, level });
  };

  return (
    <div className="quiz-container">
      <h2>Questionário de Burnout</h2>
      <form onSubmit={handleSubmit}>
        {allQuestions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <label>
              {idx + 1}. {q.question}
              <br />
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`button ${answers[idx] === opt.value ? 'selected' : ''} ${clickedIndex?.idx === idx && clickedIndex.value === opt.value ? 'clicked' : ''}`}
                  onClick={() => handleAnswer(idx, opt.value)}
                  style={{ marginRight: 8, marginTop: 8 }}
                >
                  {opt.label}
                </button>
              ))}
            </label>
          </div>
        ))}
        <button type="submit" className="start-btn" disabled={answers.includes(null)}>
          Ver Resultado
        </button>
      </form>
    </div>
  );
};

export default BurnoutQuiz;
