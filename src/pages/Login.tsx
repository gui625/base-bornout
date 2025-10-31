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

  // Função que valida se os campos estão vazios antes do envio
  // Exibe uma mensagem de erro se tentar enviar sem preencher nada
  const handlePreSubmit = () => {
    // Verifica se ambos os campos estão vazios (sem contar espaços)
    if (username.trim() === '' && password.trim() === '') {
      // Define mensagem de erro para orientar o usuário
      setError('Por favor, preencha e-mail e senha antes de enviar.');
    } else {
      // Remove a mensagem de erro se pelo menos um campo foi preenchido
      setError(null);
    }
  };

  // Função principal que processa o login quando o formulário é enviado
  const handleSubmit = (e: React.FormEvent) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();
    
    // Verifica se as credenciais correspondem ao administrador
    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Salva dados de autenticação do admin no localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'admin');
      // Remove qualquer mensagem de erro
      setError(null);
      // Redireciona admin para a página de estatísticas
      history.push('/statistics');
    } else {
      // Para usuários normais: autentica e decide rota baseado no perfil
      // Salva dados de autenticação do usuário comum no localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ username }));
      localStorage.setItem('authRole', 'user');
      // Remove qualquer mensagem de erro
      setError(null);

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
      {/* Card/cartão que contém o formulário de login */}
      <div className="login-card">
        {/* Título principal da página */}
        <h1>Login</h1>
        {/* Subtítulo explicativo */}
        <p>Entre para acessar recursos protegidos e estatísticas.</p>

        {/* Formulário de login - chama handleSubmit quando enviado */}
        <form onSubmit={handleSubmit}>
          {/* Grupo do campo de e-mail */}
          <div className="form-group">
            {/* Rótulo do campo de e-mail */}
            <label htmlFor="username">E-mail</label>
            {/* Campo de entrada para e-mail do usuário */}
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {/* Grupo do campo de senha */}
          <div className="form-group">
            {/* Rótulo do campo de senha */}
            <label htmlFor="password">Senha</label>
            {/* Campo de entrada para senha do usuário - tipo password oculta o texto */}
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Mensagem de erro - só aparece quando há erro */}
          {error && <p className="error-message">{error}</p>}

          {/* Botão de envio do formulário - executa validação antes do envio */}
          <button type="submit">Entrar</button>
        </form>

        {/* Seção de ajuda - mostra credenciais do admin para teste */}
        <div className="help-section">
          <small>Use admin/admin123 para acesso administrativo.</small>
        </div>
      </div>
    </div>
  );
};

export default Login;