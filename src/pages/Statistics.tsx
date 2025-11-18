import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/statistics.css";
import { API_BASE } from "../services/api";

// Interface que define a estrutura de um resultado de burnout
interface BurnoutResult {
  id: number;
  name: string | null;
  email: string | null;
  score: number;
  level: string;
  created_at: string;
}

// Componente da página de estatísticas - exclusiva para administradores
const Statistics: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();

  const [results, setResults] = useState<BurnoutResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os resultados do backend (SQLite)
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/quiz-results`);
        if (!resp.ok) {
          throw new Error("Falha ao carregar resultados");
        }
        const data: BurnoutResult[] = await resp.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Cálculo do número total de testes realizados
  const totalTests = results.length;

  const avgScore = useMemo(() => {
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, r) => acc + r.score, 0);
    return sum / results.length;
  }, [results]);

  // Contagem por nível de risco (baseado no campo "level" salvo no backend)
  const highRiskCount = results.filter((r) => r.level === "alto").length;
  const alertCount = results.filter((r) => r.level === "moderado").length;
  const healthyCount = results.filter((r) => r.level === "baixo").length;

  // Função que realiza logout do administrador
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authUser");
    history.push("/login");
  };

  // Renderização da interface do usuário
  return (
    <div className="stats-container">
      <div className="stats-topbar">
        <h2>Estatísticas dos Questionários</h2>
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {loading && <div className="no-data">Carregando dados...</div>}

      {!loading && error && (
        <div className="no-data" style={{ color: "red" }}>
          {error}
        </div>
      )}

      {!loading && !error && totalTests === 0 && (
        <div className="no-data">
          Nenhum dado de questionário encontrado ainda.
        </div>
      )}

      {!loading && !error && totalTests > 0 && (
        <>
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
              <h3>Alto risco</h3>
              <p className="big danger">{highRiskCount}</p>
            </div>
            <div className="card">
              <h3>Sinal de alerta</h3>
              <p className="big warning">{alertCount}</p>
            </div>
            <div className="card">
              <h3>Saudável</h3>
              <p className="big safe">{healthyCount}</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Respostas positivas</th>
                  <th>Nível</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                    <td>{r.score}</td>
                    <td>{r.level}</td>
                    <td>{r.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
