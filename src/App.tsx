import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Login from './pages/Login';
import Header from './components/Header';
import BurnoutQuiz from './components/BurnoutQuiz';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Home} />
          <Route path="/quiz" component={BurnoutQuiz} />
          <Route path="/results" component={Results} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;