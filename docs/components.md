# Componentes Principais

## Header
- Cabeçalho simples com link para Home.

## BurnoutQuiz
- Apresenta perguntas e coleta respostas.
- `handleSubmit` calcula score e navega para `Results`.
- Gera perguntas com base no perfil quando necessário.

## Recommendation
- Recebe `score` e retorna recomendações:
  - Alto risco: procurar profissional
  - Risco moderado: observar e ajustar rotina
  - Baixo risco: hábitos saudáveis

## Results
- Exibe score e recomendação.
- Botão para acessar o chatbot.

## Home
- Landing page com CTA para iniciar quiz.

## ProfileSetup
- Formulário para configurar dados básicos do usuário.

## Statistics (admin)
- Cards com métricas agregadas.
- Tabela com detalhes e visual claro.

## Chatbot
- Interface de mensagens (usuário/bot).
- Componente de input e indicador de digitação.