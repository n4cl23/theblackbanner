# Sprint log

## Sprint 9 — Administrative CMS and persistence

- Branch: `sprint-09-cms-persistence`
- Resources: new Neon `black-banner-v2-development` and Clerk `black-banner-v2-admin-auth`, connected only to Development and Preview.
- Database: Prisma 7.8 schema, reviewed additive initial migration, pooled runtime adapter, versioned revisions, audit, media metadata, roles, and rate-limit buckets.
- CMS: protected dashboard and archives for characters, creatures, kingdoms, collections, timeline, lore, and media; create, edit, draft, review, publish, archive, duplicate, preview, history, restore, filters, search, pagination, and concurrency feedback.
- Security: Clerk sessions, route proxy, role capabilities, persistent action throttling, Zod validation, sanitized audit values, and no committed secrets.
- ADR numbering: requested 0004/0005/0006 were already occupied; decisions were recorded as 0011/0012/0013 without overwriting history.
- Validation: Prisma schema and migration status, npm audit with 0 vulnerabilities, formatting, lint, typecheck, 65 Vitest tests (including real Neon integration), 21 Playwright tests, and the production build passed on 2026-07-18.
- Deployment: no Production deployment or Production integration was performed.

## Sprint 10 — Internationalization

- Branch: `sprint-10-internationalization`
- Scope: real Portuguese, English, and Spanish routes, translated semantic slugs, route-preserving selector, localized interface/editorial examples, explicit missing-translation state, localized formats, SEO, sitemap, tests, and documentation.
- CMS: multilingual Zod contracts cover locale status, original content, linked translation, incompleteness, and preview; no operational CMS or database was created because Sprint 9 was not provided.
- Content: English and Spanish translations remain clearly marked mock, draft, review, or unavailable as appropriate.
- SEO: localized canonical, hreflang, `x-default`, Open Graph locale, and sitemap entries are generated.
- Validation: formatting, lint, typecheck, 60 Vitest tests, 20 Playwright tests, and the production build passed on 2026-07-18.
- Deployment: no Preview or Production deployment was performed.

## Sprint 8 — Timeline and connected lore

- Branch: `sprint-08-timeline-lore`
- Scope: five-view connected timeline experience, semantic narrative relations, unified local search, two article pages, two long-form chronicles, keyboard reading, local progress, SEO, tests, and documentation.
- Content: eras, years, impacts, conflicts, relation notes, quotations, and chronicle prose are explicitly provisional mocks.
- Architecture: no graph engine, vector search, database, CMS, or remote search service was added.
- Privacy: the reading marker stores only a chapter index in a versioned local key.
- Validation: formatting, lint, typecheck, 53 Vitest tests, 17 Playwright tests, and the production build passed on 2026-07-18.
- Deployment: no Preview or Production deployment was performed.

## Sprint 7 — Collections and miniatures

- Branch: `sprint-07-collections-stl`
- Scope: collection archive, two rich collection pages, four technical miniature sheets, URL-synchronized category filtering, locked STL delivery demonstration, printing guide, SEO, tests, and documentation.
- Content: collection identities, technical specifications, recommendations, and changelogs are explicitly provisional mocks.
- STL and commerce: no private file, direct URL, checkout, payment, or entitlement flow was created.
- 3D: the existing GLB contract is rendered with no asset; no viewer dependency was installed.
- Persistence: no database, Prisma, migration, or CMS connection was created.
- Validation: formatting, lint, typecheck, 47 Vitest tests, 14 Playwright tests, and the production build passed on 2026-07-18.
- Deployment: no Preview or Production deployment was performed.

## Sprint 6 — Bestiary and Atlas of Asterheim

- Branch: `sprint-06-bestiary-atlas`
- Scope: filtered creature codex, four rich dynamic species pages, kingdom Atlas, three biome experiences, accessible field lightbox, 3D contract, SEO, tests, and documentation.
- Content: taxonomy, anatomy, behavior, evidence, biomes, migrations, and legends are explicitly provisional mocks.
- 3D: interface and GLB contract only; no renderer or heavy dependency was installed.
- Persistence: no database, Prisma, migration, or CMS connection was created.
- Validation: formatting, lint, typecheck, 41 Vitest tests, 11 Playwright tests, and the production build passed on 2026-07-18.
- Deployment: no Preview or Production deployment was performed.

## Sprint 5 — Characters and Guardians

- Branch: `sprint-05-characters-guardians`
- Scope: asymmetric character archive, URL-synchronized discovery, rich dynamic profiles, monumental Guardian archive, media framing, repository projections, SEO, tests, and documentation.
- Content: biographies, personality dimensions, epithets, motivations, oaths, relics, and visual assignments are explicitly provisional mocks.
- Media: optimized images include fallback, caption, and credit; video/WebM/GIF and 3D slots are prepared without inventing assets.
- Persistence: no database, Prisma, migration, or CMS connection was created.
- Validation: formatting, lint, typecheck, 36 Vitest tests, 8 Playwright tests, and the production build passed on 2026-07-17.
- Deployment: no Preview or Production deployment was performed.

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
