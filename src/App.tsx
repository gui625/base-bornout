import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Header from './components/Header';
import BurnoutQuiz from './components/BurnoutQuiz';
import Chatbot from './pages/Chatbot';
import FinalScreen from './pages/FinalScreen';
import Login from './pages/Login';
import Statistics from './pages/Statistics';
import './styles/main.css';

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

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/login" />} />
          <Route path="/quiz" component={BurnoutQuiz} />
          <Route path="/results" component={Results} />
          <Route path="/chatbot" component={Chatbot} />
          <Route path="/final" component={FinalScreen} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/statistics" component={Statistics} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;