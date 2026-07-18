# ADR 0009 — Connected lore without a graph engine

- Status: accepted
- Date: 2026-07-18

## Context

Sprint 8 needs a connected narrative across events, entities, articles, and long-form chronicles. A graph database, visualization engine, remote search service, and persistence layer remain unnecessary for the current local dataset.

## Decision

Extend `ContentRepository` with lore article reads and keep core editorial entities authoritative. Store timeline facets, narrative relations, and chronicles in separate Zod-validated presentation records marked as provisional mocks.

Render routes and editorial composition as Server Components. Use narrow Client Components for URL-synchronized timeline views, deferred local search, and chronicle progress. Store the reading marker under a versioned, chronicle-specific local-storage key and expose previous/next plus arrow-key navigation.

Represent relations as semantic editorial entries with direct source and target links. Do not add a graph rendering or graph persistence dependency.

## Consequences

- Every narrative connection remains inspectable, keyboard-accessible, and inexpensive to render.
- Search covers the current local repository but is intentionally non-vectorial and non-persistent.
- Timeline facets and chronicle presentation can move behind future adapters without changing route components.
- Richer graph analysis or collaborative reading progress requires a future ADR and persistence model.
