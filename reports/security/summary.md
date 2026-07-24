# Security audit

Date: 2026-07-18

- `npm audit`: 0 known vulnerabilities across production and development dependencies;
- production dependency audit: 0 known vulnerabilities;
- CSP includes restrictive defaults, `object-src 'none'`, and `frame-ancestors 'none'`;
- HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, COOP, and DNS-prefetch policy configured;
- admin responses use `private, no-store` and `X-Robots-Tag`;
- admin routes redirect to the unavailable sign-in boundary when Clerk is not configured;
- authorization, persistent rate limiting, Zod validation, audit sanitization, and unconfigured media rejection remain covered by the Sprint 9 tests;
- no Production environment variables or infrastructure were changed in this sprint.

The CSP permits `unsafe-inline` scripts/styles because Next.js metadata/hydration and the current Clerk integration do not yet use per-request nonces. `unsafe-eval` is enabled only when `NODE_ENV=development` for development tooling and is absent from production builds.
