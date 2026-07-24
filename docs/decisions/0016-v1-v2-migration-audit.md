# ADR 0016 — V1 como fonte, V2 como arquitetura

Status: Accepted  
Date: 2026-07-24

## Context

A V1 contém um inventário editorial e funcional maior, mas também apresenta
rotas, locales, valores e encoding que não podem ser copiados sem revisão. A V2
possui contratos tipados, acessibilidade, segurança e separação arquitetural que
devem permanecer oficiais.

## Decision

- A V1 será usada somente como fonte editorial e funcional.
- A V2 continuará sendo a arquitetura de destino.
- Cada registro V1 receberá uma decisão explícita na matriz versionada.
- Nenhum conteúdo classificado como mock, inválido ou de canonicidade incerta
  será importado automaticamente.
- A Sprint 20 só poderá começar após revisão humana dos itens marcados
  `REVISÃO_HUMANA`.

## Consequences

- Slugs, relações, mídia e traduções serão normalizados antes da persistência.
- Implementações V1 não substituirão componentes, repositories ou schemas V2.
- A ausência de confirmação editorial permanece visível como risco, não como
  conteúdo oficial.
