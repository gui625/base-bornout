import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Recommendation from '../components/Recommendation';
import '../styles/results.css';

interface AnswerItem {
  index: number;
  question: string;
  answer: string | null;
  positive: boolean;
}

interface LocationState {
  // Pontuação total do questionário de burnout
  score: number;
  answers?: AnswerItem[];
}

function getLevelFromScore(score: number): 'baixo' | 'moderado' | 'alto' {
  if (score <= 8) return 'baixo';
  if (score <= 15) return 'moderado';
  return 'alto';
}

// Componente da página de resultados - mostra o resultado do questionário
const Results: React.FC = () => {
  // Hook para acessar dados passados na navegação
  const location = useLocation<LocationState>();
  
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Extrai a pontuação dos dados de navegação (padrão 0 se não existir)
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

  // Função que determina a mensagem de recomendação baseada na pontuação
  const renderMessage = () => {
    if (score > 15) {
      // Pontuação alta - risco elevado de burnout
      return "Recomendação: Procure um médico ou psicólogo. Seus sintomas indicam alto risco de burnout.";
    } else if (score > 8) {
      // Pontuação média - sinais de alerta
      return "Atenção: Você apresenta sinais de alerta para burnout. Considere buscar orientação profissional.";
    } else {
      // Pontuação baixa - sem sinais importantes
      return "Continue se cuidando! No momento, você não apresenta sinais importantes de burnout.";
    }
  };

  // Função que redireciona o usuário para o chatbot
  const handleChatbotRedirect = () => {
    // Navega para a página do assistente virtual
    history.push('/chatbot');
  };

  // Renderização da interface do usuário
  // Renderização da página de resultados
  return (
    <div className="results-container">
      <h2>Resultado</h2>
      <p>Respostas positivas: {score}</p>
      <p>Nível de risco: <strong>{level.toUpperCase()}</strong></p>
      <p className="recommendation">{renderMessage()}</p>

      <div className="chatbot-redirect">
        <p>Quer conversar com nosso assistente virtual para obter orientações?</p>
        <button onClick={handleChatbotRedirect} className="chatbot-button">
          Converse com a Nout, nossa assistente virtual
        </button>
      </div>
    </div>
  );
};

export default Results;

