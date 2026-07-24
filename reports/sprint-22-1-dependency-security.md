# Sprint 22.1 — auditoria de segurança das dependências

Comando: `npm audit --omit=dev`.

Resultado: **3 vulnerabilidades altas, 3 moderadas e 0 críticas**. Nenhuma
correção automática compatível está disponível. Não foi executado
`npm audit fix --force` nem downgrade.

## PostCSS 8.5.12 — alta

- Relação: transitiva pela cadeia do Next.js; a versão também está fixada em
  `overrides`.
- Advisory: `GHSA-r28c-9q8g-f849`.
- Vetor: carregamento de `sourceMappingURL` anterior pode permitir path
  traversal e leitura de arquivos `.map`.
- Código afetado: pipeline de build de CSS/Tailwind; o projeto não recebe CSS
  ou source maps de usuários em runtime.
- Explorabilidade real no Preview: baixa.
- Correção: PostCSS superior a 8.5.17, quando compatível com a cadeia do Next.
- Breaking change: atualização deve ser validada; não há `fixAvailable`
  automático no audit atual.
- Recomendação: acompanhar atualização compatível e manter builds restritos a
  fontes versionadas.

## Next.js 16.2.11 — alta

- Relação: dependência direta.
- Advisory efetivo: herdado exclusivamente do PostCSS no relatório atual.
- Vetor e código afetado: pipeline de build CSS, não uma falha adicional do
  runtime Next identificada pelo audit.
- Explorabilidade real no Preview: baixa com fontes de build confiáveis.
- Correção: nenhuma indicada pelo audit.
- Breaking change: não aplicável sem versão corretiva disponível.
- Recomendação: manter a versão estável e monitorar release compatível.

## @clerk/nextjs 7.5.20 — alta

- Relação: dependência direta.
- Advisory efetivo: herdado do Next.js/PostCSS.
- Código afetado: autenticação administrativa.
- Explorabilidade real no Preview: baixa; o proxy foi limitado a `/admin` e
  rotas públicas não invocam Clerk.
- Correção: nenhuma indicada pelo audit.
- Breaking change: não aplicável sem versão corretiva disponível.
- Recomendação: manter proteção administrativa e atualizar junto ao Next.

## Valibot ≤1.4.1 — moderada

- Relação: transitiva por `@prisma/dev`.
- Advisory: `GHSA-5qjj-4xww-7phc`.
- Vetor: caminhos com nomes herdados de `Object` podem fazer `flatten()` lançar
  exceção.
- Código afetado: tooling do Prisma; o projeto não chama Valibot diretamente.
- Explorabilidade real no Preview: muito baixa, sem entrada pública nessa
  cadeia.
- Correção: o audit sugere Prisma 6.19.3, um downgrade major.
- Breaking change: sim.
- Recomendação: não rebaixar; aguardar correção compatível do Prisma 7.

## @prisma/dev — moderada

- Relação: transitiva do Prisma.
- Advisory efetivo: herdado do Valibot.
- Código afetado: geração e tooling de desenvolvimento, não as páginas do
  catálogo.
- Explorabilidade real no Preview: muito baixa.
- Correção: somente downgrade major sugerido.
- Breaking change: sim.
- Recomendação: manter isolado do runtime público e monitorar.

## Prisma 7.9.0 — moderada

- Relação: dependência direta de desenvolvimento.
- Advisory efetivo: herdado de `@prisma/dev`/Valibot.
- Código afetado: comandos de geração e migração; nenhuma migration é executada
  nesta sprint.
- Explorabilidade real no Preview: muito baixa.
- Correção: downgrade para 6.19.3 sugerido pelo audit.
- Breaking change: sim.
- Recomendação: não realizar downgrade automático.

## Decisão

Os alertas devem permanecer registrados, mas não bloqueiam a preparação
editorial do lote para Preview: não há vulnerabilidade crítica, a exposição
aplicável está no build/tooling e existem mitigações operacionais. Uma futura
publicação continua condicionada aos gates e ao Preview.
