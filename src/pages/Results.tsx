import React from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  score: number;
}

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
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

  return (
    <div className="results-container">
      <h2>Resultado</h2>
      <p>Respostas positivas: {score}</p>
      <p className="recommendation">{renderMessage()}</p>
    </div>
  );
};

export default Results;