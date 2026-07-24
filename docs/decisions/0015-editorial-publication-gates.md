# ADR 0015 — Integridade e gates de publicação editorial

Status: Accepted  
Date: 2026-07-24

## Context

Integridade de schema não significa que um registro provisório está
editorialmente pronto para publicação.

## Decision

Manter dois gates independentes: integridade estrutural para todos os estados e
completude mínima adicional ao publicar. O CMS rejeita `PUBLISHED` sem título,
slug, resumo e corpo. O dataset verifica descrição, SEO e mídia para entidades
publicadas.

Traduções incompletas permanecem em `draft`, `review` ou `unavailable`; fallback
editorial silencioso entre locales não é permitido.

## Consequences

- Registros incompletos continuam editáveis sem contaminar o conteúdo público.
- A publicação falha de forma explícita e testável.
- Ausências de material oficial são reportadas, nunca preenchidas com lore
  inventado.
