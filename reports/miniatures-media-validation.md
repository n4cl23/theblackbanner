# Validação de mídia das miniaturas — Sprint 14

## Resultado

- 4/4 registros possuem `cover`, `banner`, alt text e dimensões válidas.
- 3 caminhos WebP referenciados existem em `public/images/home`.
- Caminhos são relativos ao domínio, sem espaços, acentos ou diferença de case.
- Nenhuma extensão incorreta ou referência externa foi encontrada.
- Vídeos integrados: 0, pois nenhum vídeo foi vinculado às miniaturas existentes.
- GLBs integrados: 0, pois nenhum GLB válido foi fornecido.
- STLs públicos: 0. O schema proíbe `privateFileUrl` e o componente de download não contém link.
- Manifesto central: `miniature-media-manifest.ts`, restrito a caminhos públicos e ausências explícitas para vídeo/GLB.

## Verificação automatizada

- Vitest: 79/79 testes aprovados.
- Playwright Sprint 14: 4/4 fluxos desktop aprovados isoladamente.
- Playwright mobile: 2/2 smoke tests aprovados isoladamente.
- Regressão ampla: 22/25 na última execução paralela; três cenários preexistentes de i18n/Clerk oscilaram fora do escopo e estão registrados como risco, sem mascarar o resultado.

## Estado editorial

As imagens são recursos provisórios compartilhados com as coleções. Não foram sobrescritas nem apresentadas como renders oficiais das miniaturas.
