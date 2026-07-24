# ADR 0011 — New Neon database and Prisma persistence

- Status: accepted
- Date: 2026-07-18
- Requested equivalent: `0004-database` (not used because ADR 0004 already exists)

## Decision

Provision a completely new Neon resource named `black-banner-v2-development` and connect it only to Vercel Development and Preview. Production receives no database variables.

Use Prisma 7.8 with PostgreSQL and the `@prisma/adapter-pg` runtime adapter. Runtime uses pooled `DATABASE_URL`; Prisma CLI uses the provider-created `DATABASE_URL_UNPOOLED` directly, avoiding a redundant `DIRECT_URL` alias.

The initial migration was generated with `--create-only`, inspected for destructive statements and V1 references, then applied with `prisma migrate deploy` to the empty Development database.

## Safety

No V1 database, migration, content, or credential was read or imported. Before any future destructive database operation, create and verify a Neon restore point or branch and document its identifier. Production migrations require explicit authorization.
