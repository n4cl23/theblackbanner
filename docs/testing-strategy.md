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

CI runs lint, typecheck, unit/component tests, a production build, and the Chromium Playwright suite. The browser gate includes representative axe scans, headers, metadata, crawl endpoints, status codes, internal links, keyboard focus, reduced motion, and image alternatives.

## Quality reports

- `reports/accessibility`: axe results and limitations.
- `reports/lighthouse`: measured build facts and Lighthouse execution status.
- `reports/seo`: crawl and structured-data coverage.
- `reports/security`: headers, administrative boundaries, and dependency audit.

Lighthouse category scores may only be documented when a run completes. A failed or blocked run is recorded as a risk, never estimated from bundle sizes or other tools.
