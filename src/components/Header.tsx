import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="header">
    <nav>
      <Link to="/" className="logo">MindCare</Link>
    </nav>
  </header>
);

export default Header;