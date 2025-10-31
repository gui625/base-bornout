import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/login.css';

const ADMIN_EMAIL = 'gm59250944@gmail.com';
const ADMIN_PASSWORD = 'gui123';

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Exibe uma mensagem de erro se tentar enviar sem preencher nada
  const handlePreSubmit = () => {
    if (username.trim() === '' && password.trim() === '') {
      setError('Por favor, preencha e-mail e senha antes de enviar.');
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'admin');
      setError(null);
      history.push('/statistics');
    } else {
      // Usuário normal: autentica e decide para onde vai conforme perfil
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'user');
      setError(null);

      const completedKey = `userProfileCompleted:${username}`;
      const alreadyCompleted = localStorage.getItem(completedKey) === 'true';
      if (alreadyCompleted) {
        history.push('/quiz');
      } else {
        history.push('/profile-setup');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p className="login-subtitle">Acesse o app</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">E-mail</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu e-mail"
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
          <button type="submit" className="login-button" onClick={handlePreSubmit}>Entrar</button>
        </form>
        <div className="login-help">
          <small>Admin: <strong>{ADMIN_EMAIL}</strong> | Senha: <strong>{ADMIN_PASSWORD}</strong></small>
        </div>
      </div>
    </div>
  );
};

export default Login;