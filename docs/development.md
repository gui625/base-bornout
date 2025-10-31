# Guia de Desenvolvimento

## Pré-requisitos
- Node.js LTS
- npm 8+

## Setup
```bash
npm install
npm start
```

- Em alguns ambientes é necessário o `NODE_OPTIONS=--openssl-legacy-provider` para compatibilidade.
- A porta padrão é `3000`; pode ser alterada via `PORT`.

## Scripts
- `npm start` — inicia o servidor de desenvolvimento
- `npm run build` — gera build de produção (se configurado)
- `npm test` — executa testes (quando adicionados)

## Ambiente
- Variáveis úteis:
  - `PORT` — porta do dev server
  - `NODE_OPTIONS=--openssl-legacy-provider` — compatibilidade OpenSSL

## Convenções de Código
- TypeScript com componentes funcionais.
- Comentários explicativos em componentes, páginas e estilos.
- Pastas distintas para `components`, `pages`, `styles`, `utils`.

## Fluxo de Trabalho
1. Criar/editar componente/página.
2. Adicionar estilos em `styles/` se necessário.
3. Navegar e testar no dev server.
4. Documentar mudanças (comentários e docs quando aplicável).