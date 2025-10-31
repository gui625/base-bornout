// Importação do React para criação do componente
import React from 'react';
// Importação do Link para navegação entre páginas sem recarregar
import { Link } from 'react-router-dom';

// Componente de cabeçalho da aplicação - exibe o logo e navegação principal
const Header: React.FC = () => (
  {/* Elemento de cabeçalho principal da página */}
  <header className="header">
    {/* Elemento de navegação */}
    <nav>
      {/* Link para a página inicial com o nome da aplicação como logo */}
      <Link to="/" className="logo">Burnout Detector</Link>
    </nav>
  </header>
);

// Exportar o componente para uso em outras partes da aplicação
export default Header;