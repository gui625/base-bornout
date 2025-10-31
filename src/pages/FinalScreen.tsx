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
  return (
    {/* Container principal da tela final */}
    <div className="final-screen-container">
      {/* Conteúdo centralizado da tela final */}
      <div className="final-content">
        {/* Título principal indicando fim do atendimento */}
        <h1>Atendimento Finalizado</h1>
        
        {/* Seção de agradecimento ao usuário */}
        <div className="thank-you-message">
          {/* Mensagem de agradecimento */}
          <p>Obrigado por utilizar nosso assistente virtual de burnout!</p>
          {/* Mensagem sobre a esperança de ter ajudado */}
          <p>Esperamos ter ajudado com suas dúvidas e fornecido informações úteis sobre saúde mental no trabalho.</p>
        </div>
        
        {/* Seção com lembrete importante sobre saúde mental */}
        <div className="final-message">
          {/* Subtítulo da seção de lembrete */}
          <h2>Lembre-se</h2>
          {/* Mensagem sobre importância da saúde mental */}
          <p>O cuidado com a saúde mental é essencial para uma vida equilibrada e produtiva.</p>
          {/* Recomendação para buscar ajuda profissional */}
          <p>Se você está enfrentando sintomas de burnout, considere buscar ajuda profissional.</p>
        </div>
        
        {/* Seção com recursos e dicas adicionais */}
        <div className="resources">
          {/* Título da seção de recursos */}
          <h3>Recursos Adicionais</h3>
          
          {/* Lista de recomendações para cuidados com saúde mental */}
          <ul>
            {/* Recomendação para consultar profissional */}
            <li>Consulte um profissional de saúde mental</li>
            {/* Dica sobre técnicas de gerenciamento de estresse */}
            <li>Pratique técnicas de gerenciamento de estresse</li>
            {/* Conselho sobre equilíbrio trabalho-vida */}
            <li>Estabeleça limites saudáveis entre trabalho e vida pessoal</li>
            {/* Importância de relacionamentos de apoio */}
            <li>Cultive relacionamentos de apoio</li>
          </ul>
        </div>
        
        {/* Botão para retornar à página inicial */}
        <button className="return-button" onClick={handleReturnHome}>
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;