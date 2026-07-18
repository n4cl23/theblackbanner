# The Black Banner V2

**Chronicles of Asterheim** is a new premium dark-fantasy digital experience combining cinematic worldbuilding, reusable editorial foundations, and a future-ready platform architecture.

The project is under active development. Current narrative entries marked as mock or demonstrative are not official canon.

## Stack

- Next.js 16 with App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Vitest and React Testing Library
- Playwright
- ESLint and Prettier
- GitHub Actions
- Vercel-ready configuration, without an active Production deployment workflow

Prisma, PostgreSQL, CMS, authentication, and marketplace infrastructure have not been introduced yet.

## Requirements

- Node.js 22 recommended; Next.js requires Node.js 20.9 or newer
- npm
- Chromium installed through Playwright for end-to-end tests

## Installation

```bash
npm install
```

Copy `.env.example` only when environment-specific configuration is needed. Never commit real environment files or credentials.

## Local development

```bash
npm run dev
```

Open `http://localhost:3000` for the cinematic Home. The internal component showcase is available at `http://localhost:3000/design-system` unless `DESIGN_SYSTEM_ENABLED=false`.

## Validation

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright test
npm run build
```

## Project structure

```text
src/
  app/          Routes, layouts, metadata, and route handlers
  components/   UI primitives, layout, and authored compositions
  config/       Typed application configuration
  content/      Explicitly identified mock content
  features/     Future domain-oriented vertical slices
  lib/          Shared technical utilities
  styles/       Global tokens, motion, and visual foundations
  tests/        Shared setup and end-to-end tests
  types/        Cross-cutting public types
public/         Optimized project media
docs/           Architecture, standards, ADRs, and sprint history
```

## Sprint status

- Sprint 0 — Foundation and architecture: complete
- Sprint 1 — Asterheim design system: complete
- Sprint 2 — Cinematic Home: complete and ready for review
- Sprint 3 — Not started

See [docs/sprint-log.md](docs/sprint-log.md) for validation evidence and [docs/decisions](docs/decisions) for architecture decisions.

## Development status

This repository contains a development build. No database, CMS, authentication, Production deployment, or official editorial catalogue is included at this stage.
