// Importações necessárias do React para estado
import React, { useState } from 'react';
// Hook para navegação entre páginas
import { useHistory } from 'react-router-dom';
// Importação das perguntas base do questionário de burnout
import baseQuestions from '../utils/burnoutQuestions';

// Array de opções de resposta para cada pergunta do questionário
const OPTIONS = [
  { label: 'Sim, com frequência', value: 'sim_com_frequencia' },
  { label: 'Sim, porém com pouca frequência', value: 'sim_pouca_frequencia' },
  { label: 'Não tenho certeza', value: 'nao_tenho_certeza' },
  { label: 'Não', value: 'nao' },
];

// Recupera o perfil do usuário do localStorage (se existir)
function getProfile(): any {
  try {
    const rawUser = localStorage.getItem('authUser');
    const user = rawUser ? JSON.parse(rawUser) : null;
    if (!user?.username) return null;
    const rawProfile = localStorage.getItem(`userProfile:${user.username}`);
    return rawProfile ? JSON.parse(rawProfile) : null;
  } catch {
    return null;
  }
}

// Gera perguntas adicionais com base no perfil (mantemos vazio para não alterar contagem)
function buildProfileQuestions(_profile: any): { question: string }[] {
  return [];
}

// Define se uma resposta é positiva para burnout
function isPositive(value: string | null): boolean {
  return value === 'sim_com_frequencia' || value === 'sim_pouca_frequencia' || value === 'nao_tenho_certeza';
}

// Componente principal do questionário de burnout
const BurnoutQuiz: React.FC = () => {
  // Recuperar perfil do usuário para personalizar perguntas
  const profile = getProfile();
  
  // Combinar perguntas base com perguntas personalizadas do perfil
  const allQuestions = [...baseQuestions, ...buildProfileQuestions(profile)];

  // Estado para armazenar as respostas do usuário (inicialmente todas null)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(allQuestions.length).fill(null));
  
  // Estado para controlar efeito visual de clique nos botões
  const [clickedIndex, setClickedIndex] = useState<{ idx: number; value: string } | null>(null);
  
  // Hook para navegação entre páginas
  const history = useHistory();

  // Manipula a seleção de resposta para uma pergunta específica
  const handleAnswer = (idx: number, value: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setClickedIndex({ idx, value });
    setTimeout(() => setClickedIndex(null), 180);
  };

  // Função que processa o envio do questionário
  const handleSubmit = (e: React.FormEvent) => {
    // Prevenir comportamento padrão do formulário
    e.preventDefault();

    const score = answers.filter((a) => isPositive(a)).length;

    const detailedAnswers = allQuestions.map((q, idx) => ({
      index: idx + 1,
      question: q.question,
      answer: answers[idx],
      positive: isPositive(answers[idx]),
    }));

    // Persistir no backend (opcional, sem bloquear navegação)
    try {
      fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          total: allQuestions.length,
          answers: detailedAnswers,
        })
      }).catch(() => {});
    } catch {}

    history.push('/results', {
      score,
      answers: detailedAnswers,
    });
  };

  // Renderização da interface do questionário
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
                  className={`button ${answers[idx] === opt.value ? 'selected' : ''} ${
                    clickedIndex?.idx === idx && clickedIndex.value === opt.value ? 'clicked' : ''
                  }`}
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