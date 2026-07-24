# ADR 0010 — Locale-first routing and explicit editorial availability

- Status: accepted
- Date: 2026-07-18

## Context

The public experience needs Portuguese, English, and Spanish URLs with genuinely localized interface, content, slugs, metadata, accessibility labels, dates, numbers, and SEO. A CMS implementation was not introduced in any received sprint, but its future multilingual contract must be defined.

## Decision

Use `pt-br`, `en`, and `es` as URL locale identifiers. A semantic route registry maps equivalent translated slugs so the language selector preserves the current page.

Keep interface dictionaries separate from editorial variants. Each editorial document records its original locale and linked per-locale variants with independent status, incompleteness, alt text, slug, body, and preview availability.

The interface always localizes. An unavailable editorial variant renders a localized unavailable state and never substitutes Portuguese silently. Draft and review variants are visibly labeled.

Each localized route emits its own canonical, hreflang entries, `x-default`, localized Open Graph metadata, and locale-specific sitemap entry.

## Consequences

- Equivalent routes remain deterministic without runtime machine translation.
- Editorial teams can preview incomplete variants without representing them as approved.
- Adding a route requires adding all three semantic mappings and localized metadata.
- A future CMS adapter must implement these contracts; this sprint creates no database, CMS service, or migration.
