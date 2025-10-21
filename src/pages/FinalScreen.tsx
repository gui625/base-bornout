import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/finalScreen.css';

const FinalScreen: React.FC = () => {
  const history = useHistory();

  const handleReturnHome = () => {
    history.push('/');
  };

  return (
    <div className="final-screen-container">
      <div className="final-content">
        <h1>Atendimento Finalizado</h1>
        <div className="thank-you-message">
          <p>Obrigado por utilizar nosso assistente virtual de burnout!</p>
          <p>Esperamos ter ajudado com suas dúvidas e fornecido informações úteis sobre saúde mental no trabalho.</p>
        </div>
        
        <div className="final-message">
          <h2>Lembre-se</h2>
          <p>O cuidado com a saúde mental é essencial para uma vida equilibrada e produtiva.</p>
          <p>Se você está enfrentando sintomas de burnout, considere buscar ajuda profissional.</p>
        </div>
        
        <div className="resources">
          <h3>Recursos Adicionais</h3>
          <ul>
            <li>Consulte um profissional de saúde mental</li>
            <li>Pratique técnicas de gerenciamento de estresse</li>
            <li>Estabeleça limites saudáveis entre trabalho e vida pessoal</li>
            <li>Cultive relacionamentos de apoio</li>
          </ul>
        </div>
        
        <button className="return-button" onClick={handleReturnHome}>
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;