# ADR 0012 — Clerk administrative authentication

- Status: accepted
- Date: 2026-07-18
- Requested equivalent: `0005-admin-auth` (not used because ADR 0005 already exists)

## Decision

Provision a new Clerk application through the Vercel Marketplace for Development and Preview only. Protect `/admin` through Next.js 16 `proxy.ts` and Clerk secure sessions. `/admin/sign-in` remains public.

Persist authorization roles independently as `ADMIN`, `EDITOR`, and `REVIEWER`. The first authenticated administrative identity in the empty database is bootstrapped as admin; subsequent identities default to editor and require explicit role changes.

Clerk owns login rate limiting, credential handling, secure cookies, CSRF protections, logout, and session rotation. CMS mutations additionally use a persisted per-actor rate-limit bucket and Server Actions with same-origin checks. Login bootstrap and administrative mutations create sanitized audit records.

## Consequences

Production has no Clerk variables and no enabled administrative session. Secrets are never written to audit values or committed files.
