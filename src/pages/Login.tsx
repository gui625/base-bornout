import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/login.css';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'burnout123';

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      setError(null);
      history.push('/statistics');
    } else {
      setError('Usuário ou senha inválidos.');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authUser');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p className="login-subtitle">Acesse as estatísticas do app</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <div className="login-help">
          <small>Usuário: <strong>{VALID_USERNAME}</strong> | Senha: <strong>{VALID_PASSWORD}</strong></small>
        </div>
      </div>
    </div>
  );
};

export default Login;