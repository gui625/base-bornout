// Importações necessárias do React para hooks e navegação
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/statistics.css';

// Interface que define a estrutura de um resultado de burnout
interface BurnoutResult {
  // Pontuação obtida no questionário
  score: number;
  // Data e hora quando o teste foi realizado
  timestamp: string;
}

// Componente da página de estatísticas - exclusiva para administradores
const Statistics: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Memo que carrega e processa os resultados do localStorage
  const results: BurnoutResult[] = useMemo(() => {
    try {
      // Recupera todos os resultados salvos no localStorage
      const raw = localStorage.getItem('burnoutResults');
      return raw ? JSON.parse(raw) : [];
    } catch {
      // Retorna array vazio em caso de erro
      return [];
    }
  }, []);

  // Cálculo do número total de testes realizados
  const totalTests = results.length;
  
  // Cálculo da média de pontuação de todos os testes
  const avgScore = totalTests > 0 ? (results.reduce((sum, r) => sum + r.score, 0) / totalTests) : 0;
  
  // Contagem de resultados com alto risco (pontuação > 15)
  const highRiskCount = results.filter(r => r.score > 15).length;
  
  // Contagem de resultados com sinal de alerta (pontuação entre 9-15)
  const alertCount = results.filter(r => r.score > 8 && r.score <= 15).length;
  
  // Contagem de resultados saudáveis (pontuação ≤ 8)
  const healthyCount = results.filter(r => r.score <= 8).length;

  // Função que realiza logout do administrador
  const handleLogout = () => {
    // Remove dados de autenticação do localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authUser');
    
    // Redireciona para a página de login
    history.push('/login');
  };

  // Renderização da interface do usuário
  return (
    {/* Container principal da página de estatísticas */}
    <div className="stats-container">
      {/* Barra superior com título e botão de logout */}
      <div className="stats-topbar">
        {/* Título da página de estatísticas */}
        <h2>Estatísticas do Usuário Final</h2>
        
        {/* Botão para fazer logout do sistema */}
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </div>
      
      {/* Renderização condicional: mostra mensagem se não há dados */}
      {totalTests === 0 ? (
        {/* Mensagem exibida quando não há dados de questionários */}
        <div className="no-data">Nenhum dado de questionário encontrado ainda.</div>
      ) : (
        {/* Container dos cards com estatísticas resumidas */}
        <div className="cards">
          {/* Card mostrando o total de testes realizados */}
          <div className="card">
            <h3>Total de testes</h3>
            <p className="big">{totalTests}</p>
          </div>
          
          {/* Card mostrando a média de respostas positivas */}
          <div className="card">
            <h3>Média de respostas positivas</h3>
            <p className="big">{avgScore.toFixed(1)}</p>
          </div>
          
          {/* Card mostrando quantidade de resultados de alto risco */}
          <div className="card">
            <h3>Alto risco (&gt; 15)</h3>
            <p className="big danger">{highRiskCount}</p>
          </div>
          
          {/* Card mostrando quantidade de resultados com sinal de alerta */}
          <div className="card">
            <h3>Sinal de alerta (9–15)</h3>
            <p className="big warning">{alertCount}</p>
          </div>
          
          {/* Card mostrando quantidade de resultados saudáveis */}
          <div className="card">
            <h3>Saudável (≤ 8)</h3>
            <p className="big safe">{healthyCount}</p>
          </div>
        </div>
      )}

      {/* Tabela detalhada - só aparece se há resultados */}
      {results.length > 0 && (
        {/* Container da tabela com scroll horizontal se necessário */}
        <div className="table-wrapper">
          {/* Tabela com histórico detalhado dos testes */}
          <table>
            {/* Cabeçalho da tabela */}
            <thead>
              <tr>
                {/* Coluna da data do teste */}
                <th>Data</th>
                {/* Coluna da pontuação obtida */}
                <th>Respostas positivas</th>
              </tr>
            </thead>
            
            {/* Corpo da tabela com os dados */}
            <tbody>
              {/* Mapeia os resultados em ordem reversa (mais recente primeiro) */}
              {results.slice().reverse().map((r, idx) => (
                {/* Linha da tabela para cada resultado */}
                <tr key={idx}>
                  {/* Célula com data formatada */}
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                  {/* Célula com a pontuação */}
                  <td>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Statistics;