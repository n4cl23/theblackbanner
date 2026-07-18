# ADR 0005 — SVG world exploration

- Status: accepted
- Date: 2026-07-17

## Context

Sprint 4 needs geographic exploration without a database, map service, canvas renderer, or definitive cartography. Pages must consume the content repository and remain accessible when the visual map is unavailable.

## Decision

- Use Server Components for world indexes and kingdom detail pages.
- Read editorial entities exclusively through `ContentRepository`.
- Keep provisional visual presentation data in a typed, explicitly mocked world feature file.
- Render the interactive map as semantic SVG inside one focused Client Component.
- Provide pointer pan, bounded zoom, keyboard territory selection, a live description, and an equivalent list.
- Hide the interactive SVG on small screens and retain the list as the mobile fallback.
- Represent future layers as disabled controls rather than implementing their data model early.
- Generate kingdom routes, metadata, Open Graph data, breadcrumbs, and `Place` JSON-LD from repository records.

## Consequences

SVG territories remain inspectable, styleable, and keyboard reachable. The map can later gain borders, locations, and routes without replacing the renderer. Shapes and presentation copy are provisional and must be replaced when canonical cartography and lore are supplied.
