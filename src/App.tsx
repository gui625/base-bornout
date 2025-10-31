// Importação do React para criação de componentes
import React from 'react';
// Importações do React Router para navegação e roteamento
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// Importações das páginas da aplicação
import Home from './pages/Home';
import Results from './pages/Results';
import Chatbot from './pages/Chatbot';
import FinalScreen from './pages/FinalScreen';
import Login from './pages/Login';
import Statistics from './pages/Statistics';
import ProfileSetup from './pages/ProfileSetup';

// Importações dos componentes reutilizáveis
import Header from './components/Header';
import BurnoutQuiz from './components/BurnoutQuiz';

// Importação dos estilos principais da aplicação
import './styles/main.css';

// Componente de rota privada - requer autenticação para acesso
// Verifica se o usuário está autenticado antes de permitir acesso à rota
const PrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      // Verificar se o usuário está autenticado no localStorage
      localStorage.getItem('isAuthenticated') === 'true' ? (
        // Se autenticado, renderizar o componente solicitado
        <Component {...props} />
      ) : (
        // Se não autenticado, redirecionar para a página de login
        <Redirect to="/login" />
      )
    }
  />
);

// Componente de rota administrativa - requer autenticação e permissão de admin
// Verifica se o usuário está autenticado E tem papel de administrador
const AdminRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      // Verificar se está autenticado E tem papel de admin
      localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('authRole') === 'admin' ? (
        // Se autorizado, renderizar o componente solicitado
        <Component {...props} />
      ) : (
        // Se não autorizado, redirecionar para a página de login
        <Redirect to="/login" />
      )
    }
  />
);

// Componente principal da aplicação - define estrutura e roteamento
const App: React.FC = () => {
  return (
    {/* Router principal que gerencia toda a navegação da aplicação */}
    <Router>
      <div>
        {/* Cabeçalho fixo presente em todas as páginas */}
        <Header />
        
        {/* Switch garante que apenas uma rota seja renderizada por vez */}
        <Switch>
          {/* Rota raiz - redireciona automaticamente para login */}
          <Route path="/" exact render={() => <Redirect to="/login" />} />
          
          {/* Rota privada para configuração de perfil - requer autenticação */}
          <PrivateRoute path="/profile-setup" component={ProfileSetup} />
          
          {/* Rota pública para o questionário de burnout */}
          <Route path="/quiz" component={BurnoutQuiz} />
          
          {/* Rota pública para exibição dos resultados do questionário */}
          <Route path="/results" component={Results} />
          
          {/* Rota pública para o chatbot de assistência */}
          <Route path="/chatbot" component={Chatbot} />
          
          {/* Rota pública para a tela final de agradecimento */}
          <Route path="/final" component={FinalScreen} />
          
          {/* Rota pública para login de usuários */}
          <Route path="/login" component={Login} />
          
          {/* Rota administrativa para estatísticas - requer autenticação e papel de admin */}
          <AdminRoute path="/statistics" component={Statistics} />
        </Switch>
      </div>
    </Router>
  );
};

// Exportar o componente principal para uso no index.tsx
export default App;