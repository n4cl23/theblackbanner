# Deployment

## Sprint 9 environments

- Neon `black-banner-v2-development` and Clerk `black-banner-v2-admin-auth` are connected only to Development and Preview.
- Production has no database or Clerk variables and was not deployed or mutated.
- `DATABASE_URL` is pooled runtime connectivity. `DATABASE_URL_UNPOOLED` is used only by Prisma CLI migrations; no redundant `DIRECT_URL` exists.
- Apply migrations to Development/Preview with `npm run db:migrate:deploy` only after SQL review.
- Before a destructive migration, create and verify a Neon branch/restore point. Record its identifier in the sprint log. Production migration requires explicit authorization and a verified backup.
- Environment files remain ignored. `.env.example` contains names only.

Vercel is the intended hosting platform. Sprint 0 performs no deployment and changes no Production environment.

## Guardrails

- Production changes require explicit authorization.
- Secrets belong in the hosting provider, never in Git.
- `.env.example` documents names only.
- Pull requests must pass the validation workflow before merge.
- Preview deployments may be introduced in a future authorized sprint.
- Production promotion and rollback procedures will be defined before first release.
# Imported asset deployment

Preview may include only files registered in the validated public media manifest. STL, 3MF, GLB, printer jobs, archives, executables, and system artifacts are prohibited from `public/`. Production promotion remains a separate explicit approval after Preview validation.
