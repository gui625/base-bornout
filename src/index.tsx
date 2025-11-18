/* eslint-disable */
import process from 'process'
// Importação da biblioteca React para criação de componentes
import React from 'react';
// Importação do ReactDOM para renderização da aplicação no DOM
import ReactDOM from 'react-dom';
// Importação do componente principal da aplicação
import App from './App';

// @ts-ignore
if (!('process' in window)) {
  // @ts-ignore
  window['process'] = (window['process'] || process);
}

// Renderização da aplicação React no elemento HTML com id 'root'
ReactDOM.render(
  // StrictMode é um wrapper que ajuda a identificar problemas potenciais na aplicação
  // Ativa verificações adicionais e avisos para componentes descendentes
  <React.StrictMode>
    {/* Componente principal da aplicação que contém toda a estrutura e roteamento */}
    <App />
  </React.StrictMode>,
  // Elemento do DOM onde a aplicação será montada (definido em public/index.html)
  document.getElementById('root')
);