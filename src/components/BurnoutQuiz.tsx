import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import questions from '../utils/burnoutQuestions';

const OPTIONS = [
  { label: 'Sim, com frequência', value: 'sim_com_frequencia' },
  { label: 'Sim, porém com pouca frequência', value: 'sim_pouca_frequencia' },
  { label: 'Não tenho certeza', value: 'nao_tenho_certeza' },
  { label: 'Não', value: 'nao' },
];

const isPositive = (value: string | null) => {
  return value === 'sim_com_frequencia' || value === 'sim_pouca_frequencia';
};

const BurnoutQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [clickedIndex, setClickedIndex] = useState<{ idx: number; value: string } | null>(null);
  const history = useHistory();

  const handleAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value; // garante apenas uma seleção por pergunta
    setAnswers(updated);
    setClickedIndex({ idx: index, value });
    setTimeout(() => setClickedIndex(null), 200); // Remove efeito após 200ms
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = answers.filter(a => isPositive(a)).length;
    history.push('/results', { score });
  };

  return (
    <div className="quiz-container">
      <h2>Questionário de Burnout</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
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