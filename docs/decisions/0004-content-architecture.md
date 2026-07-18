# ADR 0004: Content architecture before persistence

- Status: Accepted
- Date: 2026-07-17

## Context

The narrative universe needs consistent entities and relationships before selecting database tables, CMS fields, or migrations. Modelling persistence first would harden untested editorial assumptions.

## Decision

Define Zod as the runtime source of truth and infer TypeScript models from schemas. Keep a small versioned mock dataset behind a source adapter and expose a persistence-agnostic `ContentRepository`. Validate structural shape and referential integrity as separate concerns.

Use string IDs and polymorphic `{ type, id }` references at the editorial boundary. Treat dates as ISO strings because content remains serializable and source-independent. Do not install Prisma or connect to a database/CMS.

This ADR uses number 0004 because `0003-cinematic-home.md` already records the preceding decision; ADR numbers remain unique.

## Consequences

Future persistence and CMS implementations must satisfy existing repository and validation contracts. The model can evolve while data is cheap to change. The local dataset is explicitly mock provenance and cannot be interpreted as canonical lore.
