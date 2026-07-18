# ADR 0003: Cinematic Home composition

- Status: Accepted
- Date: 2026-07-17

## Context

The Home must introduce Asterheim through atmosphere and scale without turning mock content into canon or making character portraits the dominant visual device.

## Decision

Build the Home as a Server Component composition with typed mock content stored separately from presentation. Hydrate only the scroll-aware navigation and image fallback. Use three original, project-local WebP environment artworks generated for this sprint; preload only the hero and lazy-load media below the fold.

Characters remain secondary silhouettes or distant figures. Environmental artwork reserves negative space for interface and uses opaque overlays to preserve contrast. No autoplay carousel or mobile background video is used.

Metadata includes provisional canonical, Open Graph, Twitter, WebSite JSON-LD, and CreativeWork JSON-LD. `NEXT_PUBLIC_APP_URL` replaces the localhost canonical per environment when configured.

## Consequences

The page carries minimal client JavaScript and deterministic local media. Editorial names and descriptions are explicitly mock data and must be replaced only after official content approval. A future video hero can be introduced without changing the content model, provided it retains an image poster and reduced-motion fallback.
