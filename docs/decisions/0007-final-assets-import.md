# ADR 0007: Final asset import boundary

- Status: accepted
- Date: 2026-07-18

## Context

The supplied archive contains web imagery and video alongside commercial model geometry, print sources, printer jobs, executable/system artifacts, and editorial PDFs. Publishing the directory wholesale would expose private assets and create an unmaintainable 30 GB repository.

## Decision

Use a reproducible, inventory-first import pipeline. Raster imagery is normalized to WebP without cropping. Valid MP4 files are copied with metadata and poster references. Extractable PDF text is versioned as editorial records in `review`, separate from published content. STL, 3MF, GLB, printer jobs, archives, executables, and system metadata remain outside `public/` and outside Git binary history.

All web media is addressed through one Zod-validated manifest. Original source paths remain only in audit/generated import metadata; application components consume stable public URLs and entity slugs.

## Consequences

- The repository receives 263 web-safe media assets instead of roughly 30 GB of mixed binaries.
- Model and print delivery requires a future authenticated storage decision and explicit license authorization.
- Editorial import is traceable by SHA-256 but is not silently published.
- The scripts can be rerun against the same source directory and preserve deterministic names.
