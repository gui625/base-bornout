import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/statistics.css';

interface BurnoutResult {
  score: number;
  timestamp: string;
}

const Statistics: React.FC = () => {
  const history = useHistory();
  const results: BurnoutResult[] = useMemo(() => {
    try {
      const raw = localStorage.getItem('burnoutResults');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const totalTests = results.length;
  const avgScore = totalTests > 0 ? (results.reduce((sum, r) => sum + r.score, 0) / totalTests) : 0;
  const highRiskCount = results.filter(r => r.score > 15).length;
  const alertCount = results.filter(r => r.score > 8 && r.score <= 15).length;
  const healthyCount = results.filter(r => r.score <= 8).length;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authUser');
    history.push('/login');
  };

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