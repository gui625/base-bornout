# Burnout Web App

## Visão Geral
O Burnout Web App foi desenvolvido para ajudar usuários a identificar possíveis sintomas de burnout por meio de um questionário interativo. Com base nas respostas, o aplicativo fornece recomendações sobre a necessidade de procurar um profissional de saúde.

## Funcionalidades
- Questionário interativo para avaliar sintomas de burnout
- Recomendações personalizadas baseadas nos resultados do questionário
- Interface amigável com navegação intuitiva

## Estrutura do Projeto
```
burnout-web-app
├── public
│   └── index.html          # Documento HTML principal
├── src
│   ├── components          # Componentes React
│   │   ├── BurnoutQuiz.tsx
│   │   ├── Recommendation.tsx
│   │   └── Header.tsx
│   ├── pages               # Páginas da aplicação
│   │   ├── Home.tsx
│   │   └── Results.tsx
│   ├── styles              # Estilos CSS
│   │   └── main.css
│   ├── utils               # Funções utilitárias e dados
│   │   └── burnoutQuestions.ts
│   └── App.tsx             # Componente principal da aplicação
├── package.json            # Configuração do npm
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Documentação do projeto
```

## Instalação
1. Clone o repositório:
   ```
   git clone <url-do-repositorio>
   ```
2. Acesse o diretório do projeto:
   ```
   cd burnout-web-app
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Uso
1. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```
2. Abra o navegador e acesse `http://localhost:3000` para utilizar o aplicativo.

## Contribuição
Contribuições são bem-vindas! Envie um pull request ou abra uma issue para sugestões ou melhorias.

## Licença
Este projeto está licenciado sob a Licença MIT.    