# Auditoria de rotas — Sprint 13

Data: 2026-07-18  
Base auditada: `6b0f7c7` (`content/asterheim-assets-import`)  
Branch de correção: `sprint-13-navigation-audit`

## Resultado executivo

- 30 padrões de página, um route handler público e nove superfícies administrativas foram encontrados no App Router.
- As áreas públicas estavam implementadas, mas separadas em cinco headers locais; a Home apontava apenas para âncoras internas.
- A navegação foi consolidada em `src/config/navigation.ts` e aplicada a World, Archives, Bestiary, Collections, Lore e Home.
- Não existe rota de índice `/miniaturas`; os quatro registros mock só possuem páginas dinâmicas e são descobertos por coleções.
- Não existe rota `/galeria`; a galeria existente é a seção `/#gallery` da Home.
- A internacionalização possui apenas Home, Lore, Timeline, Chronicles e páginas editoriais demonstrativas. Conteúdo ausente permanece explicitamente indisponível, sem fallback silencioso.

## Inventário

| Rota                            | Escopo             | Arquivos especiais | Dados                          | Estado funcional          | Navegação após correção     | Risco                              |
| ------------------------------- | ------------------ | ------------------ | ------------------------------ | ------------------------- | --------------------------- | ---------------------------------- |
| `/`                             | público            | page               | `home.mock`                    | funcional                 | global/Home/footer          | baixo                              |
| `/world`                        | público            | layout, page       | world repository               | funcional                 | Asterheim                   | baixo                              |
| `/world/kingdoms`               | público            | page               | repository                     | funcional                 | Asterheim > Reinos          | baixo                              |
| `/world/kingdoms/[slug]`        | público            | page, not-found    | repository                     | funcional                 | listagem/breadcrumb         | baixo                              |
| `/world/map`                    | público            | page               | world mock                     | funcional                 | Asterheim > Mapa            | médio: SVG provisório              |
| `/personagens`                  | público            | page               | character repository           | funcional                 | Personagens > Todos         | baixo                              |
| `/personagens/[slug]`           | público            | page, not-found    | repository                     | funcional                 | listagem/breadcrumb         | baixo                              |
| `/guardioes`                    | público            | page               | character repository           | funcional                 | Personagens > Guardiões     | baixo                              |
| `/guardioes/[slug]`             | público            | page, not-found    | repository                     | funcional                 | listagem/breadcrumb         | médio: poucos registros            |
| `/bestiario`                    | público            | layout, page       | bestiary repository            | funcional                 | Bestiário > Criaturas       | baixo                              |
| `/bestiario/[slug]`             | público            | page, not-found    | repository                     | funcional                 | listagem/breadcrumb         | baixo                              |
| `/atlas`                        | público            | page               | repository + biome mock        | funcional                 | Bestiário > Atlas           | médio: dados mock                  |
| `/atlas/[kingdom]`              | público            | page, not-found    | repository + biome mock        | funcional                 | Atlas/breadcrumb            | médio: cobertura limitada          |
| `/colecoes`                     | público            | layout, page       | repository + presentation mock | funcional                 | Coleções > Todas/Miniaturas | médio: âncora, sem índice dedicado |
| `/colecoes/[slug]`              | público            | page, not-found    | repository                     | funcional                 | listagem/breadcrumb         | baixo                              |
| `/miniaturas/[slug]`            | público            | page, not-found    | miniature mock                 | funcional                 | via coleções                | alto: sem índice próprio           |
| `/guia-de-impressao`            | público            | page               | local                          | funcional                 | Coleções > Guia             | baixo                              |
| `/timeline`                     | público            | layout, page       | lore repository                | funcional                 | Asterheim > Timeline        | baixo                              |
| `/lore`                         | público            | page               | lore repository                | funcional                 | Crônicas > Lore             | baixo                              |
| `/lore/[slug]`                  | público            | page, not-found    | lore repository                | funcional                 | índice/relações             | baixo                              |
| `/chronicles`                   | público            | page               | lore repository                | funcional                 | Crônicas > Histórias        | baixo                              |
| `/chronicles/[slug]`            | público            | page, not-found    | lore repository                | funcional                 | índice/controles            | baixo                              |
| `/[locale]/[[...path]]`         | público localizado | page               | localized mock/registry        | parcial explícito         | seletor e shell localizado  | alto: cobertura editorial parcial  |
| `/design-system`                | interno            | page               | local                          | condicionado por ambiente | não público                 | baixo                              |
| `/admin`                        | administrativo     | layout, page       | auth/CMS                       | redireciona               | shell admin                 | baixo                              |
| `/admin/sign-in/[[...sign-in]]` | administrativo     | page               | Clerk                          | condicionado por env      | login                       | médio                              |
| `/admin/dashboard`              | administrativo     | page               | CMS repository                 | condicionado por auth/env | admin                       | médio                              |
| `/admin/[section]`              | administrativo     | page               | CMS repository                 | condicionado por auth/env | admin                       | médio                              |
| `/admin/preview/[id]`           | administrativo     | page               | CMS repository                 | condicionado por auth/env | admin                       | médio                              |
| `/api/health`                   | sistema            | route              | ambiente                       | funcional                 | não aplicável               | baixo                              |

## Arquivos especiais ausentes

Não há `loading.tsx` ou `error.tsx` específicos nas rotas públicas. O `not-found.tsx` global cobre o fallback geral e páginas dinâmicas importantes possuem `not-found.tsx` local. A ausência de streaming/error boundaries específicos é dívida técnica, não quebra funcional nesta sprint.

## Links e breadcrumbs

- Nenhum destino da fonte global é vazio ou `#` isolado.
- Miniaturas aponta para `/colecoes#miniaturas`, uma âncora real e explicitamente integrada à coleção.
- Galeria aponta para `/#gallery`, pois não existe índice editorial próprio.
- Breadcrumbs existentes foram preservados; a navegação global fornece retorno consistente nas superfícies que não os possuem.
