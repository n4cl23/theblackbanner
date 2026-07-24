# Sprint 22 — integração segura do catálogo real

## Resultado

- 639 arquivos locais auditados em 215 subpastas.
- 192 grupos reais de miniatura identificados com confiança alta.
- 192 registros sanitizados integrados à camada editorial.
- 13 coleções reais identificadas.
- 191 miniaturas possuem mídia pública já validada no repositório.
- 25 miniaturas possuem vídeo público já validado no repositório.
- 193 STL permanecem exclusivamente fora de `public/`.
- 145 GLB permanecem na origem local até autorização explícita de publicação.
- 188 miniaturas foram integradas como `draft`.
- 4 registros permanecem em revisão humana por colisão de identidade entre
  `Legends of the Realm` e `The Six Crowns of Asterheim`.
- 0 registros foram promovidos a `published`, pois nenhuma fonte possui aprovação
  editorial final.

## Decisão de segurança

A ausência de dimensões, contagem de peças, base ou ficha técnica não impediu o
inventário. Esses campos permanecem nulos. A aplicação carrega o catálogo real,
mas o repositório público retorna somente registros `published`; assim, nenhum
rascunho é exposto silenciosamente.

## Cópia controlada

Nenhum arquivo novo foi copiado. As imagens e os vídeos aprovados já estavam
normalizados em `public/media/asterheim`. Os GLBs não foram copiados porque ainda
não existe classificação explícita de uso público. Os STL continuam privados.

## Gates

- `npm ci`: aprovado.
- lint: aprovado.
- typecheck: aprovado.
- Vitest: 24 arquivos e 99 testes aprovados.
- Playwright: 20 testes aprovados.
- build: aprovado.
- STL em `public`: 0.
- GLB em `public`: 0.
- caminho absoluto da origem no bundle: 0.

## Risco conhecido

`npm audit --omit=dev` registra 6 avisos (3 altos e 3 moderados), sem correção
compatível automática: a cadeia do Next/PostCSS não oferece `fixAvailable`, e a
alternativa indicada para Prisma é downgrade major. Nenhum `audit fix --force`
foi executado nesta sprint.
