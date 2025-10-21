import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../styles/results.css';

interface LocationState {
  score: number;
}

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const score = location.state?.score ?? 0;

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
      <p className="recommendation">{renderMessage()}</p>
      
      <div className="chatbot-redirect">
        <p>Tem dúvidas sobre burnout ou saúde mental?</p>
        <button onClick={handleChatbotRedirect} className="chatbot-button">
          Converse com nosso Assistente Virtual
        </button>
      </div>
    </div>
  );
};

export default Results;