# ADR 0001: Project foundation

- Status: Accepted
- Date: 2026-07-17

## Context

The product needs an independent, maintainable foundation without inheriting V1 infrastructure or prematurely fixing persistence and editorial choices.

## Decision

Use Next.js App Router with strict TypeScript, React Server Components by default, Tailwind CSS, Vitest with React Testing Library, Playwright, ESLint, Prettier, and GitHub Actions. Use npm with a committed lockfile. Require Node.js 20.9 or newer and document Node 22 as the team runtime. Defer Prisma, PostgreSQL, CMS, authentication, and complete internationalization.

## Consequences

The project starts with enforceable quality gates and clear boundaries. Later sprints must explicitly model editorial and persistence concerns before adding infrastructure. The technical page and its copy are temporary, not final product design or lore.
