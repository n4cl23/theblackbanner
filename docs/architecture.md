# Architecture

## Quality boundary

`src/config/site.ts` is the canonical public-origin and brand source for metadata, structured data, sitemap, robots, and RSS. Public SEO uses App Router metadata APIs; JSON-LD is serialized through the shared escaped renderer. Global defensive headers live in `next.config.ts`, while authentication and authorization remain enforced at the proxy and server-action boundaries.

The Black Banner V2 is a new Next.js application. It has no technical dependency on V1.

## Principles

- App Router and React Server Components are the default.
- Client Components require a concrete browser API or interaction need.
- Features own domain behavior; `components` contains presentation and composition.
- Persistence must remain behind domain-facing interfaces when introduced.
- `@/*` absolute imports resolve from `src`.
- Environment access is centralized in `src/config`; required values must be validated before use.
- Expected failures use typed application errors; UI boundaries will be added with the features that need them.
- Logs contain operational context only and redact credential-like keys.

## Directory boundaries

- `app`: routes, layouts, metadata, and route handlers.
- `components`: `ui` primitives, `layout` composition, and shared presentation.
- `features`: domain-oriented vertical slices.
- `lib`: framework-independent technical helpers.
- `config`: typed application configuration.
- `content`: mock or static content, explicitly labelled until approved.
- `types`: cross-cutting public types only.
- `tests`: shared setup and end-to-end tests.

## Policies

- Images: use `next/image`, explicit dimensions or `fill` with `sizes`, modern formats, descriptive alt text, and no unapproved remote hosts.
- Fonts: use deterministic system fallbacks in the temporary foundation. Once final font files or families are approved, load them with `next/font`, limit families and weights, and retain robust fallbacks.
- Motion: prefer transform and opacity, respect reduced motion, and never block reading or navigation.
- Accessibility: semantic HTML, keyboard operability, visible focus, sufficient contrast, labelled controls, and automated plus manual checks.
- Internationalization: locale identifiers and boundaries exist now; routing and translation libraries are deferred until editorial requirements are stable.

## Design-system boundary

Visual primitives live in `src/components/ui`; Asterheim-authored compositions live in `src/components/shared`. Static components remain Server Components. Interactive behavior is isolated in `interactive.tsx`, keeping client JavaScript out of editorial composition by default. The internal `/design-system` showcase reads no CMS or database data and can be disabled with `DESIGN_SYSTEM_ENABLED=false`.

## Home composition

The cinematic Home is server-rendered from typed mock records in `src/content/home.mock.ts`. The public page contains no persistence calls. Only `SiteHeader` and `ImageWithFallback` cross the client boundary. The local WebP hero is the only preloaded image; all below-fold images are lazy and provide responsive `sizes`.

## Editorial content boundary

Editorial contracts live under `src/features/content/domain`. Zod schemas are the runtime source of truth and TypeScript types are inferred from them. `ContentRepository` is independent from `ContentSourceAdapter`; the current local adapter and future database/CMS adapters share the same dataset boundary. Referential integrity is validated before a repository is exposed. No adapter in Sprint 3 creates an external connection.

## World exploration

- `/world` routes are Server Components; only the interactive SVG map is a Client Component.
- Kingdom pages use static route parameters and dynamic metadata derived from the repository.
- Related regions, factions, characters, creatures, events, and gallery records are resolved in a cached world projection.
- The SVG map has an equivalent list model for accessibility and mobile fallback.
- Geographic layers beyond kingdom regions remain future extension points.

## Character archives

- Character and Guardian detail projections resolve repository records and related entities in parallel and are cached per request.
- Discovery filtering is the only client boundary; filter state is encoded in URL query parameters.
- Typed presentation mocks provide non-canonical biography, personality, treatment, and media framing.
- Current media uses the shared image fallback; video and 3D remain explicit empty extension slots.

## Bestiary and Atlas

- Creature and kingdom-biome projections read only from `ContentRepository` and resolve related records in parallel.
- Codex filters are a client boundary with shareable URL state; pages and metadata remain server-rendered.
- Field evidence uses the shared optimized-image fallback inside a keyboard-operable lightbox.
- The 3D boundary is a typed GLB contract with no viewer dependency until a real test asset exists.

## Collections and miniatures

- Collection and miniature routes are Server Components backed by cached projections over `ContentRepository` and local Zod-validated technical mocks.
- Collection discovery is a small client boundary with shareable URL state; the locked-download explanation is the only other feature-local client state.
- The technical model stores public descriptors and version history, never private file URLs, checkout state, payment state, or storage credentials.
- The existing GLB contract receives a null asset because no approved test model exists; no heavy 3D dependency is installed.
- All planned collection families are represented by a closed category enum. Records are created only where consistent provisional content exists.

## Connected lore

- Core events and articles remain in `ContentRepository`; Zod-validated presentation records add eras, impacts, conflicts, relations, and chronicle chapters without changing persistence.
- Timeline and lore routes are server-rendered. URL filters, deferred local search, and chronicle progress are the only Client Component boundaries.
- Narrative relationships are semantic, navigable editorial records; no graph engine, canvas renderer, or graph database is installed.
- Unified search operates only over serialized local repository records and includes characters, creatures, kingdoms, events, articles, and collections.
- Chronicle markers use versioned, per-story local-storage keys. They contain only a chapter index and no user identity.

## Internationalization

- Locale-first public routes use `pt-br`, `en`, and `es`; a semantic route registry maps translated slugs and preserves destinations during language changes.
- Interface dictionaries, editorial variants, route slugs, metadata, alt text, dates, and numbers have independent localization boundaries.
- The root document uses `lang="und"`; each localized application boundary declares the precise language because the root layout cannot derive a static locale safely.
- Missing editorial translations render an explicit localized unavailable state. Draft and review variants carry visible status and never masquerade as approved content.
- Localized routes emit canonical, hreflang, `x-default`, Open Graph locale data, and sitemap entries without middleware or runtime translation services.
- CMS multilingual support is a Zod contract only; no CMS connection or persistence was introduced.

## Administrative persistence and CMS

- Prisma owns the new PostgreSQL schema and versioned migrations; runtime access uses a pooled Neon URL while migrations use the provider's unpooled URL.
- Clerk protects `/admin`; database roles authorize capabilities independently of identity-provider sessions.
- CMS mutations are Server Actions with Zod validation, persistent rate limiting, role checks, optimistic concurrency, revision snapshots, and sanitized audit records.
- `ContentEntity` persists the common editorial core for characters, creatures, kingdoms, collections, timeline events, and lore articles.
- Media persistence stores descriptors and provider keys only. The storage abstraction rejects binary uploads until a dedicated provider is configured.
- Public repository adapters remain independent from Prisma during this sprint; no automatic import of local mocks occurs.
# Asset import boundary

Final Asterheim media is consumed through `src/content/asterheim-media-manifest.ts`. Generated records are validated with Zod and remain independent of UI components. Editorial PDF extraction is stored separately in `review`; it does not bypass repositories or publication workflow. Private geometry and print artifacts are metadata-only and must use authenticated storage in a future delivery phase. See ADR 0007.
