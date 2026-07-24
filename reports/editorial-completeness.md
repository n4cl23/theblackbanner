# Completude editorial — Sprint 17

Data da auditoria: 24 de julho de 2026.

## Resultado

- 43 entidades do dataset editorial local auditadas.
- 4 miniaturas e 2 crônicas incluídas nas validações complementares.
- 0 slugs duplicados.
- 0 referências quebradas.
- 0 personagens sem reino ou facção.
- 0 criaturas sem região.
- 0 eventos com menos de dois participantes.
- 43 entidades permanecem em `draft`, com proveniência `mock`.
- 0 registros provisórios foram promovidos ou apresentados como conteúdo oficial.

## Cobertura

Foram verificados personagens, criaturas, reinos, regiões, coleções, armas,
coroas, Guardião, eventos, artigos, galeria, mídia, perfis de impressão,
facções, locais, relações, tags e categorias. A busca unificada inclui também
miniaturas e crônicas e entrega tipo, título, resumo, imagem, rota e locale.

## Prontidão para publicação

Integridade referencial e prontidão editorial são gates distintos. Um rascunho
pode ser estruturalmente válido sem estar pronto para publicação. A partir desta
sprint, o CMS bloqueia `PUBLISHED` quando título, slug, resumo ou corpo estão
ausentes. O dataset versionado também possui política verificável para impedir
que entidades publicadas omitam descrição, SEO ou mídia obrigatória.

## Lacunas editoriais assumidas

Capas individuais e traduções editoriais completas ainda dependem de material
oficial. Essas lacunas não foram preenchidas com lore inventado. Enquanto isso,
os registros continuam como mocks explicitamente marcados e `noIndex`.
