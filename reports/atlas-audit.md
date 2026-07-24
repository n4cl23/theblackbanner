# Auditoria do Atlas — Sprint 13

## Estado encontrado

- Rotas `/atlas` e `/atlas/[kingdom]` existem e resolvem três reinos.
- O índice consulta o repositório de conteúdo e combina cada reino com apresentação de bioma mock.
- As páginas territoriais exibem bioma, distribuição, espécies dominantes, risco, endemismo, migrações, lendas e criaturas relacionadas.
- Metadados e `not-found` dinâmicos estão implementados.
- Testes unitários e E2E anteriores já cobrem resolução, reino inválido, relações e mobile.

## Classificação

**Funcional, porém oculto pela navegação e editorialmente parcial.** A falha principal era de descoberta: o header da Home não apontava para `/atlas`. Não há evidência de falha de deploy, cache ou roteamento.

## Correção limitada da Sprint 13

O Atlas passou a integrar “Bestiário > Atlas” na fonte global, desktop, mobile e rodapé. Nenhum mapa, bioma, criatura ou mídia foi criado. A Sprint 15 permanece necessária para o atlas editorial completo.

## Riscos

- Biomas e textos ainda são mock/provisórios.
- A cobertura está limitada aos três reinos versionados.
- O mapa geográfico SVG e o Atlas biológico são superfícies separadas, ainda sem navegação contextual profunda.
