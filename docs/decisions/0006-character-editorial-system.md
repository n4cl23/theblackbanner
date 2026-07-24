# ADR 0006 — Character editorial system

- Status: accepted
- Date: 2026-07-17

## Context

Character discovery needs filtering and search without turning the public experience into a dashboard. Character and Guardian records remain local, provisional, and independent from a CMS.

## Decision

- Keep list and detail data behind `ContentRepository` projections.
- Use Server Components for all editorial pages and one Client Component for URL-synchronized discovery.
- Encode search, kingdom, faction, role, and order in query parameters through App Router navigation.
- Use an asymmetric progressive grid with typed visual treatments instead of one uniform card template.
- Keep personality in seven explicit editorial dimensions.
- Render current image media with fallback, caption, and credit while reserving semantic slots for video/WebM/GIF and future 3D models.
- Give Guardians separate routes, navigation, scale, language, and monumental composition.
- Treat all biographies, personality traits, oaths, relics, and visual assignments as mock presentation data, not canon.

## Consequences

Filter URLs are shareable and browser-readable. CMS or database adoption can replace the source without changing page contracts. Presentation records must be reviewed or replaced when official character material is supplied.
