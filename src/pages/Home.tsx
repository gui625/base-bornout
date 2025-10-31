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

  // Renderização da interface do usuário
  return (
    {/* Container principal da página inicial */}
    <main className="home-container">
      {/* Seção de introdução com informações sobre o app */}
      <section className="intro">
        {/* Título de boas-vindas */}
        <h2>Bem-vindo ao Burnout Detector</h2>
        
        {/* Parágrafo explicativo sobre o propósito do app */}
        <p>
          Responda a um breve questionário para avaliar possíveis sintomas de burnout.
          <br />
          {/* Aviso importante sobre limitações médicas */}
          <strong>Lembre-se:</strong> Este teste não substitui avaliação médica.
        </p>
        
        {/* Botão principal que inicia o questionário */}
        <button className="start-btn" onClick={handleStart}>
          Iniciar Questionário
        </button>
      </section>
    </main>
  );
};

export default Home;