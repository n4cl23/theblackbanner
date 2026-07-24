# Sprint 22.1 — primeiro lote publicado

Data da aprovação: **2026-07-24**

Lote: **sprint-22-1-batch-01**

Fonte da decisão: aprovação editorial explícita do usuário.

## Resultado

- Registros publicados: **14**
- Registros mantidos em draft: **174**
- Registros mantidos em review: **4**
- Coleções representadas: **Beasts of Asterheim** e **The Black Banner Company**
- Featured alterado: **não**
- STL público: **0**
- GLB público: **0**

## Registros publicados

1. Black Fang Mercenary
2. Durgan — Blacksmith
3. Iron Bull
4. Iron Wyrm
5. Forge Sentinel
6. Molten Guardian
7. Crystal Ram
8. Iron Boar
9. Ash Wolf
10. Rock Burrower
11. Tunnel Reaper
12. Ore Leech
13. Ember Tick
14. Obsidian Colossus

Cada registro preserva sua coleção, mídia pública validada, indicadores de
disponibilidade privada e a referência da fonte editorial. Dados técnicos
ausentes continuam nulos no catálogo e são omitidos das páginas públicas.

## Restrições preservadas

- `demon-fogo` permanece em draft e sem fallback genérico.
- Os dois registros de The Kraken Caller permanecem em review.
- Os dois registros de The Last Dragon Slayer permanecem em review.
- Nenhuma coleção principal foi escolhida para os conflitos.
- Nenhum registro fora da aprovação foi promovido.
- Nenhuma miniatura foi marcada como featured.
- Production não foi alterada.

## Mídia do lote

As 14 capas estão versionadas e passaram pelas verificações locais de
existência, formato, tamanho e casing. Três registros possuem galerias com duas
imagens. Nenhum dos 14 registros possui vídeo associado no inventário validado;
por isso nenhuma seção vazia de vídeo é renderizada.

## Segurança de dependências

O `npm audit --omit=dev` registrou **3 vulnerabilidades altas** e **3
moderadas**, herdadas por dependências de build/ferramentas. Não foi aplicado
`npm audit fix --force`, downgrade ou alteração automática incompatível. A
validação do Preview registrará novamente o risco efetivamente aplicável ao
runtime público.
