# Auditoria de miniaturas — Sprint 13

## Estado encontrado

- Dados: quatro miniaturas mock validadas por Zod em `collections.mock.ts`.
- Rotas: somente `/miniaturas/[slug]`; não existe `/miniaturas`.
- Origem: dados locais versionados, sem CMS, banco, STL privado ou URL direta.
- Relações: duas coleções, duas personagens e duas criaturas são referenciadas.
- Mídia: páginas usam os recursos públicos das coleções; não há GLB real.
- Navegação anterior: miniaturas eram alcançadas dentro de páginas de coleção, mas não pelo header da Home.

## Classificação

**Integração incompleta com índice órfão.** As páginas dinâmicas e os dados estão funcionais; a ausência é uma rota agregadora própria e a integração global. Não é problema de cache, deploy ou banco.

## Correção limitada da Sprint 13

O menu “Coleções > Miniaturas” leva à seção real `/colecoes#miniaturas`. Nenhuma galeria, miniatura, mídia ou página nova foi construída. A Sprint 14 permanece necessária para integração completa.

## Riscos

- O usuário não consegue pesquisar todas as miniaturas em um índice dedicado.
- Os quatro registros são demonstrativos e insuficientes para afirmar completude editorial.
- Não existe ativo GLB de teste nem visualizador 3D ativo.
