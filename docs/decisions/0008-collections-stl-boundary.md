# ADR 0008 — Collections and STL delivery boundary

- Status: accepted
- Date: 2026-07-18

## Context

Sprint 7 needs rich collection and miniature experiences while private STL delivery, commerce, persistence, and a production 3D asset remain outside scope.

## Decision

Keep collection and miniature presentation data local, typed, Zod-validated, and explicitly provisional. Resolve editorial entities through `ContentRepository`, then compose technical miniature records in a cached server-side projection.

The STL surface exposes descriptors and version history only. Its demonstration control is a button with no link, storage identifier, signed URL, checkout, or payment behavior. The schema rejects `privateFileUrl`.

Reuse the lightweight GLB viewer contract with a null asset. A rendering dependency may only be evaluated after an approved test GLB exists.

Collection categories are a closed enum that supports all planned editorial families. Empty categories remain visible as modeled extension points instead of receiving invented records.

## Consequences

- Public pages cannot leak private download locations because none are stored.
- Server Components own page composition; browser JavaScript is limited to URL filters and the explanatory locked-download state.
- Future delivery, entitlement, commerce, and persistence work requires a new security and architecture decision.
- A real 3D viewer remains deferred and adds no current bundle weight.
