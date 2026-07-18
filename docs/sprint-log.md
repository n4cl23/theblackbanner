# Sprint log

## Sprint 4 — Kingdoms and map of Asterheim

- Branch: `sprint-04-kingdoms-map`
- Scope: world hub, kingdom index, three dynamic kingdom presentations, accessible SVG map, dynamic SEO, repository projections, tests, and documentation.
- Content: all geographic shapes and complementary presentation copy are explicitly provisional mocks; no official canon was established.
- Map: SVG renderer with bounded zoom, pointer pan, keyboard selection, region layer, tooltip/status, legend, future layer controls, and accessible list/mobile fallback.
- Persistence: no database, Prisma, migration, or CMS connection was created.
- Validation: formatting, lint, typecheck, 31 Vitest tests, 5 Playwright tests, and the production build passed on 2026-07-17.
- Deployment: no Preview or Production deployment was performed.

## Sprint 0 — Foundation and architecture

- Branch: `sprint-00-foundation`
- Scope: clean Next.js foundation, quality tooling, health endpoint, temporary page, CI, and architectural documentation.
- Persistence, CMS, authentication, official content, and Production deployment are explicitly excluded.
- Validation: clean install, formatting, lint, typecheck, 3 Vitest tests, 1 Playwright smoke test, and production build passed on 2026-07-17.
- Security: `npm audit` reported 0 vulnerabilities after compatible patch updates.
- Deployment: no Preview or Production deployment was performed.

## Sprint 3 — Editorial content model

- Branch: `sprint-03-content-model`
- Scope: 18 typed entities, Zod validation, explicit relationships, local mock dataset, integrity validation, repository abstraction, future source adapters, tests, and documentation.
- Dataset: 3 kingdoms, 4 characters, 4 creatures, 2 collections, 5 events, and 2 articles; all records are provisional mock content.
- Persistence: no database, Prisma, migration, or CMS connection was created.
- Validation: formatting, lint, typecheck, 25 Vitest tests, 3 Playwright smoke tests, and production build passed on 2026-07-17.
- Deployment: no Preview or Production deployment was performed.

## Sprint 2 — Cinematic Home

- Branch: `sprint-02-cinematic-home`
- Scope: cinematic hero, public navigation, eleven Home sections, typed mock content, responsive original imagery, SEO metadata, JSON-LD, tests, and documentation.
- Media: three original WebP environment artworks generated for this project; no V1 asset was reused.
- Client boundary: scroll/mobile header and critical-image fallback only.
- Persistence, newsletter integration, search, localization behavior, and official lore remain absent.
- Validation: visual browser inspection at desktop and mobile sizes, formatting, lint, typecheck, 16 Vitest tests, 3 Playwright smoke tests, and production build passed on 2026-07-17.
- Deployment: no Preview or Production deployment was performed.

## Sprint 1 — Asterheim design system

- Branch: `sprint-01-design-system`
- Scope: visual tokens, reusable primitives, accessible interactive components, authored Asterheim patterns, internal showcase, tests, and documentation.
- Content: all showcase words and marks are identified as mock examples; no official lore was created.
- Persistence and CMS remain absent.
- Validation: formatting, lint, typecheck, unit/component tests, responsive Playwright smoke tests, and production build passed on 2026-07-17.
- Deployment: no Preview or Production deployment was performed.
