// Importações necessárias do React para hooks e navegação
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/login.css';

// Credenciais fixas do administrador do sistema
const ADMIN_EMAIL = 'gm59250944@gmail.com';
const ADMIN_PASSWORD = 'gui123';

// Componente da página de Login - primeira tela do aplicativo
const Login: React.FC = () => {
  // Hook para navegação entre páginas
  const history = useHistory();
  
  // Estado para armazenar o e-mail digitado pelo usuário
  const [username, setUsername] = useState('');
  
  // Estado para armazenar a senha digitada pelo usuário
  const [password, setPassword] = useState('');
  
  // Estado para controlar mensagens de erro na tela
  const [error, setError] = useState<string | null>(null);

  // Função principal que processa o login quando o formulário é enviado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: verifica se os campos estão vazios
    if (username.trim() === '' || password.trim() === '') {
      setError('Por favor, preencha e-mail e senha antes de enviar.');
      return;
    }
    
    // Remove a mensagem de erro se a validação passar
    setError(null);
    
    // Verifica se as credenciais correspondem ao administrador
    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Salva dados de autenticação do admin no localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'admin');
      // Redireciona admin para a página de estatísticas
      history.push('/statistics');
    } else {
      // Para usuários normais: autentica e decide rota baseado no perfil
      // Salva dados de autenticação do usuário comum no localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'user');

      // Verifica se o usuário já completou o perfil anteriormente
      const completedKey = `userProfileCompleted:${username}`;
      const alreadyCompleted = localStorage.getItem(completedKey) === 'true';
      
      if (alreadyCompleted) {
        // Se perfil já foi preenchido, vai direto para o questionário
        history.push('/quiz');
      } else {
        // Se perfil não foi preenchido, vai para a tela de configuração
        history.push('/profile-setup');
      }
    }
  };

  // Renderização da interface do usuário
  // Renderização da página de login
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

          <button type="submit" className="login-button">Entrar</button>
        </form>

        <div className="login-help">
          <small>Admin: <strong>{ADMIN_EMAIL}</strong> | Senha: <strong>{ADMIN_PASSWORD}</strong></small>
        </div>
      </div>
    </div>
  );
};

export default Login;