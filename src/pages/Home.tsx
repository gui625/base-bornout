// Importações necessárias do React para navegação
import React from 'react';
import { useHistory } from 'react-router-dom';

// Componente da página inicial - tela de boas-vindas do aplicativo
const Home: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();

  // Função que redireciona o usuário para o questionário
  const handleStart = () => {
    // Navega para a página do questionário de burnout
    history.push('/quiz');
  };

  return (
    <main className="home-container">
      <section className="intro">
        <h2>Bem-vindo ao Burnout Detector</h2>
        
        <p>
          Responda a um breve questionário para avaliar possíveis sintomas de burnout.
          <br />
          <strong>Lembre-se:</strong> Este teste não substitui avaliação médica.
        </p>
        
        <button className="start-btn" onClick={handleStart}>
          Iniciar Questionário
        </button>
      </section>
    </main>
  );
};

export default Home;