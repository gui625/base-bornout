# Rotas e Navegação

## Rotas Públicas
- `/` → Home
- `/quiz` → BurnoutQuiz (questionário)
- `/results` → Results (exibe score e recomendação)
- `/profile-setup` → ProfileSetup (configuração de perfil)

## Rotas Protegidas
- `/statistics` → Statistics (visão administrativa)
  - Protegida por `PrivateRoute`: exige autenticação
  - Pode exigir `AdminRoute`: papel `admin`

## Proteções de Rota
- `PrivateRoute`: bloqueia acesso quando usuário não autenticado;
  - Redireciona para login ou outra tela definida (conforme implementação)
- `AdminRoute`: valida que o usuário tem o papel `admin` antes de renderizar

## Comportamento de Navegação
- `Header` sempre disponível com link para Home
- Após envio do quiz, navega para `Results` com score calculado
- Botão para acessar chatbot e explorar suporte adicional