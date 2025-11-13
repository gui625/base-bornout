// Importações necessárias do React para navegação
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/finalScreen.css';

// Componente da tela final - exibida após o usuário terminar o chat com o assistente virtual
const FinalScreen: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();

  // Função que redireciona o usuário para a página inicial
  const handleReturnHome = () => {
    // Navega para a página inicial do aplicativo
    history.push('/');
  };

  // Renderização da interface do usuário
  // Renderização da tela final
  return (
    <div className="final-screen-container">
      <div className="final-content">
        <h1>Obrigado por utilizar o Burnout Detector</h1>
        <section className="thanks-section">
          <p>Obrigado por se cuidar e buscar informações sobre burnout.</p>
          <p>Esperamos ter ajudado você a entender melhor seus sinais e opções.</p>
        </section>
        <section className="reminder-section">
          <h2>Lembre-se:</h2>
          <p>Saúde mental é tão importante quanto a saúde física.</p>
          <p>Se você está se sentindo sobrecarregado, procure ajuda profissional.</p>
        </section>
        <section className="resources-section">
          <h2>Recursos úteis</h2>
          <ul>
            <li>Consultar um psicólogo ou psiquiatra.</li>
            <li>Praticar técnicas de respiração e mindfulness.</li>
            <li>Definir limites e equilibrar trabalho e vida pessoal.</li>
            <li>Conversar com amigos e família.</li>
          </ul>
        </section>
        
        <button className="return-button" onClick={handleReturnHome}>Voltar para o Início</button>
      </div>
    </div>
  );
};

export default FinalScreen;