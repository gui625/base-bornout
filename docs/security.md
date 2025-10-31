# Guia de Segurança

Este guia resume boas práticas para proteger dados dos usuários e manter o app confiável.

## Princípios
- Mínima coleta: evite coletar dados pessoais sensíveis; armazene o mínimo necessário.
- Transparência: informe o usuário sobre uso de dados e limitações (não substitui avaliação médica).
- Defesa em camadas: proteções no frontend, backend e infraestrutura.

## Autenticação e Autorização
- Rotas protegidas (`PrivateRoute`) e administrativas (`AdminRoute`).
- Expirar sessões inativas e reforçar verificação de papel (`role`).
- Não armazenar tokens sensíveis em `localStorage` sem criptografia; preferir cookies `HttpOnly` (no backend).

## Proteção contra XSS/CSRF
- Sanitizar entradas de usuário antes de renderizar.
- Evitar `dangerouslySetInnerHTML`.
- Em backend, habilitar CSRF tokens em rotas sensíveis.

## Segurança de Dependências
- Manter dependências atualizadas (`npm audit`, `npm outdated`).
- Evitar pacotes sem manutenção ou com alertas conhecidos.

## Cabeçalhos de Segurança (backend)
- `Content-Security-Policy` (CSP) restritivo para scripts e estilos.
- `X-Frame-Options: DENY` para impedir clickjacking.
- `X-Content-Type-Options: nosniff` e `Referrer-Policy` apropriados.

## Armazenamento e Logs
- Evitar armazenar informações de saúde em client-side (localStorage) além do necessário.
- Logs não devem conter dados pessoais ou respostas do quiz.

## Transporte e Infra
- Sempre usar HTTPS em produção.
- Não expor chaves/segredos no repositório; usar variáveis de ambiente.

## Privacidade
- Deixar claro que o app é informativo e não diagnóstico.
- Oferecer meios para o usuário apagar dados (quando aplicável).

## Checklist Rápido
- [ ] Rotas protegidas revisadas
- [ ] Sem `dangerouslySetInnerHTML`
- [ ] Dependências auditadas
- [ ] CSP configurado (backend)
- [ ] Sem dados sensíveis em client storage
- [ ] HTTPS em produção