import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../styles/results.css';

interface AnswerItem {
  index: number;
  question: string;
  answer: string | null;
  positive: boolean;
}

interface LocationState {
  score: number;
  answers?: AnswerItem[];
}

function getLevelFromScore(score: number): 'baixo' | 'moderado' | 'alto' {
  if (score <= 8) return 'baixo';
  if (score <= 15) return 'moderado';
  return 'alto';
}

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const score = location.state?.score ?? 0;
  const answers = location.state?.answers ?? [];

  const level = getLevelFromScore(score);

  // Persistir resultado para estatísticas locais + enviar para o backend
  useEffect(() => {
    try {
      // LocalStorage (se quiser manter a tela Statistics atual)
      const raw = localStorage.getItem('burnoutResults');
      const list = raw ? JSON.parse(raw) : [];
      list.push({ score, timestamp: new Date().toISOString() });
      localStorage.setItem('burnoutResults', JSON.stringify(list));
    } catch (e) {
      // falha silenciosa
    }

    // Enviar para o backend (API Nout)
    (async () => {
      try {
        // tenta pegar usuário/logado se você já tiver isso no projeto
        const authRaw = localStorage.getItem('authUser');
        let name: string | null = null;
        let email: string | null = null;

        if (authRaw) {
          const user = JSON.parse(authRaw);
          email = user?.username || null;
          name = user?.name || null;
        }

        await fetch('/api/quiz-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            score,
            level,
            answers,
          }),
        });
      } catch (err) {
        console.error('Erro ao enviar resultado para o backend:', err);
      }
    })();
  }, [score, level, answers]);

  const renderMessage = () => {
    if (score > 15) {
      return "Recomendação: Procure um médico ou psicólogo. Seus sintomas indicam alto risco de burnout.";
    } else if (score > 8) {
      return "Atenção: Você apresenta sinais de alerta para burnout. Considere buscar orientação profissional.";
    } else {
      return "Continue se cuidando! No momento, você não apresenta sinais importantes de burnout.";
    }
  };

  const handleChatbotRedirect = () => {
    history.push('/chatbot');
  };

  return (
    <div className="results-container">
      <h2>Resultado</h2>
      <p>Respostas positivas: {score}</p>
      <p>Nível de risco: <strong>{level.toUpperCase()}</strong></p>
      <p className="recommendation">{renderMessage()}</p>

      <div className="chatbot-redirect">
        <p>Tem dúvidas sobre burnout ou saúde mental?</p>
        <button onClick={handleChatbotRedirect} className="chatbot-button">
          Converse com a Nout, nossa assistente virtual
        </button>
      </div>
    </div>
  );
};

export default Results;

