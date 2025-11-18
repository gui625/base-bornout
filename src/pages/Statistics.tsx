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
       const list = raw ? JSON.parse(raw) : [];
       return Array.isArray(list) ? list : [];
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
    <div className="stats-container">
      <div className="stats-topbar">
        <h2>Estatísticas do Usuário Final</h2>
        
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </div>
      
      {totalTests === 0 ? (
        <div className="no-data">Nenhum dado de questionário encontrado ainda.</div>
      ) : (
        <div className="cards">
          <div className="card">
            <h3>Total de testes</h3>
            <p className="big">{totalTests}</p>
          </div>
          
          <div className="card">
            <h3>Média de respostas positivas</h3>
            <p className="big">{avgScore.toFixed(1)}</p>
          </div>
          
          <div className="card">
            <h3>Alto risco (&gt; 15)</h3>
            <p className="big danger">{highRiskCount}</p>
          </div>
          
          <div className="card">
            <h3>Sinal de alerta (9–15)</h3>
            <p className="big warning">{alertCount}</p>
          </div>
          
          <div className="card">
            <h3>Saudável (≤ 8)</h3>
            <p className="big safe">{healthyCount}</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Respostas positivas</th>
              </tr>
            </thead>
            
            <tbody>
              {results.slice().reverse().map((r, idx) => (
                <tr key={idx}>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
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