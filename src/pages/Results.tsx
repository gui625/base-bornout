// Importações necessárias do React para navegação e localização
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../styles/results.css';

// Interface que define a estrutura dos dados passados via navegação
interface LocationState {
  // Pontuação total do questionário de burnout
  score: number;
}

// Componente da página de resultados - mostra o resultado do questionário
const Results: React.FC = () => {
  // Hook para acessar dados passados na navegação
  const location = useLocation<LocationState>();
  
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Extrai a pontuação dos dados de navegação (padrão 0 se não existir)
  const score = location.state?.score ?? 0;

  // Salva o resultado no localStorage para estatísticas futuras
  try {
    // Recupera resultados anteriores do localStorage
    const raw = localStorage.getItem('burnoutResults');
    const list = raw ? JSON.parse(raw) : [];
    
    // Adiciona o novo resultado com timestamp
    list.push({ score, timestamp: new Date().toISOString() });
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem('burnoutResults', JSON.stringify(list));
  } catch (e) {
    // Ignora erros de salvamento silenciosamente
  }

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