import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    // Simulação de autenticação bem-sucedida
    // Em um caso real, você faria uma chamada à API aqui
    console.log('Login realizado com:', { email, password });
    
    // Redirecionar para a página inicial após login
    history.push('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Bem-vindo(a)</h2>
        <p className="login-subtitle">Faça login para continuar</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          
          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>
          
          <button type="submit" className="login-button">Entrar</button>
        </form>
        
        <div className="register-link">
          Não tem uma conta? <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};

export default Login;