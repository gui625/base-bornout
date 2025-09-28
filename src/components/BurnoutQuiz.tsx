import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import questions from '../utils/burnoutQuestions';

const BurnoutQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const [clickedIndex, setClickedIndex] = useState<{ idx: number; value: boolean } | null>(null);
  const history = useHistory();

  const handleAnswer = (index: number, value: boolean) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    setClickedIndex({ idx: index, value });
    setTimeout(() => setClickedIndex(null), 200); // Remove efeito após 200ms
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = answers.filter(a => a).length;
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
              <button
                type="button"
                className={`button sim-btn ${answers[idx] === true ? 'selected' : ''} ${clickedIndex?.idx === idx && clickedIndex.value ? 'clicked' : ''}`}
                onClick={() => handleAnswer(idx, true)}
                style={{ marginRight: 8 }}
              >
                Sim
              </button>
              <button
                type="button"
                className={`button nao-btn ${answers[idx] === false ? 'selected' : ''} ${clickedIndex?.idx === idx && clickedIndex.value === false ? 'clicked' : ''}`}
                onClick={() => handleAnswer(idx, false)}
              >
                Não
              </button>
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