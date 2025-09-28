import React from 'react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const handleStart = () => {
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