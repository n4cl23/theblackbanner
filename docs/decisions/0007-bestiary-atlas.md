# ADR 0007 — Bestiary codex and territorial Atlas

- Status: accepted
- Date: 2026-07-17

## Context

Sprint 6 needs a living creature codex connected to world geography while all content remains local and provisional. Field evidence must be inspectable without introducing a heavy 3D runtime before a real GLB exists.

## Decision

- Resolve creature and Atlas pages through cached repository projections.
- Keep taxonomy, behavior, evidence, biome, migration, and legend presentation in typed mock records.
- Encode the eight codex filters in URL query parameters through one focused Client Component.
- Use distinct image composition and information hierarchy for burned lands, storm/iron, and ancestral forest/abyss biomes.
- Implement the field gallery as an accessible lightbox with focus entry, scroll lock, Escape, arrow navigation, explicit controls, zoom, captions, origin, and narrative date.
- Define a typed GLB-only model inspector contract without installing a 3D library.

## Consequences

The codex remains repository-driven and shareable. The Atlas can evolve with canonical distribution data later. A real viewer will only be selected after a representative GLB is available for performance and accessibility evaluation.
