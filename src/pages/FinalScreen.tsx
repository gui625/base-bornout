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
<<<<<<< HEAD
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
=======
        {/* Título principal indicando fim do atendimento */}
        <h1>Obrigado por utilizar o Burnout Detector</h1>
        {/* Seção de agradecimento ao usuário */}
        <section className="thanks-section">
          {/* Mensagem de agradecimento */}
          <p>Obrigado por se cuidar e buscar informações sobre burnout.</p>
          {/* Mensagem sobre a esperança de ter ajudado */}
          <p>Esperamos ter ajudado você a entender melhor seus sinais e opções.</p>
        </section>
        
        {/* Seção com lembrete importante sobre saúde mental */}
        <section className="reminder-section">
          {/* Subtítulo da seção de lembrete */}
          <h2>Lembre-se:</h2>
          {/* Mensagem sobre importância da saúde mental */}
          <p>Saúde mental é tão importante quanto a saúde física.</p>
          {/* Recomendação para buscar ajuda profissional */}
          <p>Se você está se sentindo sobrecarregado, procure ajuda profissional.</p>
        </section>
        
        {/* Seção com recursos e dicas adicionais */}
        <section className="resources-section">
          {/* Título da seção de recursos */}
          <h2>Recursos úteis</h2>
          {/* Lista de recomendações para cuidados com saúde mental */}
          <ul>
            {/* Recomendação para consultar profissional */}
            <li>Consultar um psicólogo ou psiquiatra.</li>
            {/* Dica sobre técnicas de gerenciamento de estresse */}
            <li>Praticar técnicas de respiração e mindfulness.</li>
            {/* Conselho sobre equilíbrio trabalho-vida */}
            <li>Definir limites e equilibrar trabalho e vida pessoal.</li>
            {/* Importância de relacionamentos de apoio */}
            <li>Conversar com amigos e família.</li>
>>>>>>> b8778a83a6c1019437fee09e90eddfc070e76203
          </ul>
        </section>
        
<<<<<<< HEAD
        <button className="return-button" onClick={handleReturnHome}>
          Voltar para o Início
        </button>
=======
        {/* Botão para retornar à página inicial */}
        <button className="back-home" onClick={() => window.location.href = '/'}>Voltar para início</button>
>>>>>>> b8778a83a6c1019437fee09e90eddfc070e76203
      </div>
    </div>
  );
};

export default FinalScreen;