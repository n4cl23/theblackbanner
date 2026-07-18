# ADR 0002: Asterheim design system

- Status: Accepted
- Date: 2026-07-17

## Context

The public product needs a recognizable dark-fantasy interface language before page construction. A generic component library would prematurely impose SaaS conventions and dilute the authored visual direction.

## Decision

Build an internal design system with CSS custom-property tokens and Tailwind utilities. Use sharp geometry, restrained aged-gold emphasis, opaque high-contrast reading surfaces, and lightweight procedural texture. Keep static components server-rendered and isolate only necessary browser behavior in Client Components. Use native platform semantics such as `dialog` and `details` where they improve accessibility and reduce code.

The internal `/design-system` route is independent of persistence and can be disabled through `DESIGN_SYSTEM_ENABLED=false`. It is excluded from search indexing.

## Consequences

Product pages can compose consistent primitives without inheriting a generic dashboard aesthetic. The authored layer remains replaceable and testable. Final fonts, imagery, page transitions, and content remain future decisions, preventing mock material from becoming canon by accident.
