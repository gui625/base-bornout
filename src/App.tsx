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
const PrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('isAuthenticated') === 'true' ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

// Componente de rota administrativa - requer autenticação e permissão de admin
const AdminRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('authRole') === 'admin' ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

// Componente principal da aplicação - define estrutura e roteamento
const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/login" />} />
          <PrivateRoute path="/profile-setup" component={ProfileSetup} />
          <Route path="/quiz" component={BurnoutQuiz} />
          <Route path="/results" component={Results} />
          <Route path="/chatbot" component={Chatbot} />
          <Route path="/final" component={FinalScreen} />
          <Route path="/login" component={Login} />
          <AdminRoute path="/statistics" component={Statistics} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;