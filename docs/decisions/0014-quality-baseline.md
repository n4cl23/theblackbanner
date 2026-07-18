# ADR 0014: Quality baseline

- Status: accepted
- Date: 2026-07-18

## Decision

Centralize the public origin and brand metadata, use App Router metadata files for robots and sitemap, expose RSS through a route handler, and enforce defensive response headers in `next.config.ts`. Keep structured data close to the page entity through a safe JSON-LD renderer.

Accessibility gates use axe on representative primary routes without suppressing contrast. Performance targets live in `performance-budget.json`; missing measurements must be reported as risks rather than converted into estimated scores.

## Consequences

Public pages become indexable and internal/admin surfaces remain excluded. Security policy is consistent across routes. CSP still requires inline script/style allowances until nonce-based rendering and Clerk are validated together. Lighthouse must be rerun on a clean Chrome host because the sprint workstation could not complete the trace.
