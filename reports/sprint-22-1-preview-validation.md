# Sprint 22.1 — Validação do Preview

Data: 24 de julho de 2026  
Branch: `sprint-22-1-editorial-curation`  
Commit funcional validado: `3be5f3c2bbbf8eed7b0724323787d101117e564c`  
Pull Request: https://github.com/n4cl23/theblackbanner/pull/9  
Preview: https://the-black-banner-v2-kg0pzubcx-jandersons-projects-bbd4737f.vercel.app

## Escopo publicado no Preview

- 14 miniaturas aprovadas e publicadas.
- 174 registros mantidos como `draft`.
- 4 registros mantidos em `review`.
- Nenhuma promoção automática na Home.
- Nenhum arquivo STL, GLB ou caminho local exposto.
- Nenhuma alteração em Production.

## Validação HTTP autenticada

A proteção de acesso do Preview foi mantida. Os códigos HTTP reais foram
verificados com `vercel curl`, sem desativar a proteção do deployment.

- Páginas aprovadas: 14/14 com HTTP 200.
- Mídias únicas associadas: 17/17 com HTTP 200.
- Mídias com erro: 0.
- Vídeos associados ao lote: 0; validação não aplicável.
- Links para ativos privados: 0.
- `demon-fogo`: HTTP 404.
- `kraken-caller`: HTTP 404.
- `kraken-caller-32mm`: HTTP 404.
- `the-last-dragon-slayer`: HTTP 404.
- `the-last-dragon-slayer-32mm`: HTTP 404.

## Experiência validada

- Catálogo inicial renderizado no servidor com 14 registros.
- Busca por título funcional.
- Filtro por coleção funcional.
- Menu mobile abre por teclado e fecha com `Escape`.
- Catálogo e detalhe verificados em desktop e viewport mobile.
- Metadata, canonical, imagens e estado de locale verificados.
- Console do navegador sem erros na navegação validada.
- Rotas em idiomas sem conteúdo aprovado exibem indisponibilidade explícita.

## Gates locais

- `npm ci`: aprovado.
- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run test`: 103/103 testes aprovados.
- `npx playwright test`: 23/23 testes aprovados.
- `npm run build`: aprovado.

## Segurança e dependências

- Instalação completa: 5 vulnerabilidades altas e 4 moderadas reportadas pelo
  audit do npm.
- Dependências de runtime: 3 vulnerabilidades altas e 3 moderadas reportadas.
- Nenhuma correção forçada, downgrade ou mudança de escopo foi aplicada.
- O lote não adiciona exposição de arquivos privados nem nova superfície de
  execução para essas ocorrências; o risco permanece registrado para
  tratamento dedicado.

## Resultado

O lote editorial aprovado está pronto para revisão humana no Preview. O PR
permanece em modo draft. Merge e publicação em Production não foram
executados.

Status: `SPRINT_22_1_PREVIEW_READY`
