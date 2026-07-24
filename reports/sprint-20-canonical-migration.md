# Sprint 20 — migração do cânone

Data: 2026-07-24

## Resultado

- 65 registros `MIGRAR_COM_CORREÇÃO` foram extraídos da V1 e normalizados.
- 50 registros ficaram em `review`.
- 15 registros incompletos ficaram em `draft`.
- 94 registros `REVISÃO_HUMANA` permaneceram bloqueados e não foram importados.
- 1 referência de mídia foi verificada; URLs não verificadas não são publicadas.
- 0 relações foram inferidas com segurança entre os registros aprovados.
- 0 valores `undefined` foram serializados.
- Locale de todos os registros importados: `pt-BR`.
- Nenhum registro foi marcado como `published`.

## Proveniência

Cada registro conserva URL da V1, slug e tipo anteriores, data da migração,
decisão da matriz e observações editoriais. O artefato gerado está em
`src/content/asterheim-canonical.generated.json`.

## Limite editorial

Personagens, criaturas, Guardiões, Coroas e Reinos da matriz estão classificados
como `REVISÃO_HUMANA`. Eles não foram promovidos por inferência. Suas superfícies
públicas agora informam a indisponibilidade editorial em vez de exibir demos.

