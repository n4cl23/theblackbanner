# Testing strategy

## Persistence and CMS

- Validate Prisma schema and migration status before build.
- Integration tests create isolated records in Development Neon, exercise CRUD, workflow, revisions, audit, and optimistic concurrency, then delete their data.
- Authorization and audit sanitization are tested without external identities.
- Playwright verifies anonymous route protection and the real Clerk login surface. Authenticated provider flows require a dedicated Clerk test identity and must never reuse a personal or Production account.

Vitest is the unit-test runner. React Testing Library verifies UI through accessible behavior. Playwright covers browser journeys.

## Test layers

- Unit: configuration, domain rules, parsing, and isolated utilities.
- Component: rendered behavior and accessibility contracts.
- Route handler: response status and public payload contract.
- End-to-end: critical user journeys in a real browser.

CI runs lint, typecheck, unit/component tests, and a production build. Browser tests are configured but remain a separate command until the first stable public journey requires them in CI.
