# Arquitetura e Tecnologias

## Stack
- React + TypeScript
- `react-router-dom` para roteamento
- CSS modular por página (em `src/styles`)

## Estrutura
```
src/
├── App.tsx                # Roteador principal e rotas protegidas
├── index.tsx              # Ponto de entrada React
├── components/            # Componentes reutilizáveis
├── pages/                 # Páginas da aplicação
├── styles/                # CSS organizado por área
└── utils/                 # Dados e utilitários
```

## Roteamento
- Rotas públicas: `Home`, `Quiz`, `Results`, `ProfileSetup`
- Rotas protegidas: `Statistics` (via `PrivateRoute`)
- Rotas com restrição de papel: `AdminRoute` (apenas admin)

## Autenticação e Autorização
- `PrivateRoute`: apenas usuários autenticados.
- `AdminRoute`: exige papel `admin` para acesso.
- A fonte real de autenticação pode variar (mock/localStorage/API). O componente está pronto para integrar.

## Estado e Dados
- Estado local em componentes (ex.: quiz, recomendação).
- Dados do questionário em `utils/burnoutQuestions.ts`.
- Tipos/Interfaces definidos diretamente nos componentes quando necessário.

## Estilos
- Design system em `styles/main.css` com variáveis CSS (cores, espaçamento, sombras).
- Estilos por página: `login.css`, `chatbot.css`, `results.css`, `statistics.css`, `profileSetup.css`.

## Navegação e UX
- `Header` com link para Home.
- Fluxos simples e lineares para quiz e resultados.

## Extensibilidade
- Fácil adicionar novas perguntas, páginas e módulos.
- Componentes com responsabilidades claras e documentação inline.