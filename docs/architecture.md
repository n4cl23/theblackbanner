# Architecture

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
