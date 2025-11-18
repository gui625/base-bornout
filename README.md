# base-bornout
base do projeto bornout 
# Burnout Web App

## Visão Geral
O Burnout Web App ajuda usuários a identificar possíveis sintomas de burnout por meio de um questionário interativo. Com base nas respostas, o aplicativo calcula um score e fornece recomendações claras, podendo direcionar o usuário para recursos adicionais como um chatbot de apoio.

## Funcionalidades
- Questionário interativo para avaliar sintomas de burnout
- Recomendações personalizadas baseadas no score
- Interface amigável com navegação intuitiva
- Rotas protegidas para estatísticas administrativas
- Design system documentado em `styles/main.css`

## Estrutura do Projeto
```
burnout-web-app
├── public
│   └── index.html          # Documento HTML principal
├── src
│   ├── App.tsx             # Roteamento principal e rotas protegidas
│   ├── index.tsx           # Ponto de entrada React
│   ├── components          # Componentes reutilizáveis
│   │   ├── BurnoutQuiz.tsx
│   │   ├── Recommendation.tsx
│   │   └── Header.tsx
│   ├── pages               # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Results.tsx
│   │   ├── Login.tsx
│   │   ├── Statistics.tsx
│   │   └── ProfileSetup.tsx
│   ├── styles              # Estilos CSS por área
│   │   ├── main.css
│   │   ├── login.css
│   │   ├── chatbot.css
│   │   ├── results.css
│   │   ├── statistics.css
│   │   └── profileSetup.css
│   ├── utils               # Funções utilitárias e dados
│   │   └── burnoutQuestions.ts
│   └── react-app-env.d.ts
├── docs                    # Documentação do projeto
│   ├── overview.md         # Visão geral
│   ├── architecture.md     # Arquitetura e stack
│   ├── routes.md           # Rotas e proteções
│   ├── components.md       # Componentes principais
│   ├── styles.md           # Design system e estilos
│   ├── development.md      # Guia de desenvolvimento
│   └── security.md         # Guia de segurança
├── package.json            # Configuração do npm
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Documentação do projeto
```

## Instalação
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd burnout-web-app
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Uso
1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
2. Acesse `http://localhost:3000` (ou a porta configurada em `PORT`).

## Documentação
- Visão Geral: `docs/overview.md`
- Arquitetura: `docs/architecture.md`
- Rotas: `docs/routes.md`
- Componentes: `docs/components.md`
- Estilos: `docs/styles.md`
- Desenvolvimento: `docs/development.md`
- Segurança: `docs/security.md`

## Contribuição
Contribuições são bem-vindas! Envie um pull request ou abra uma issue para sugestões ou melhorias.

## Licença
Este projeto está licenciado sob a Licença MIT.
