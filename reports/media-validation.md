# Asterheim media validation

Validation date: 2026-07-18.

## Result

- 237 rasterized image/animation assets are registered.
- 26 MP4 assets have duration, width, and height metadata and are registered.
- 263 total manifest entries point to physical files.
- 0 broken media or poster references.
- 0 private print/model formats exposed in `public/`.
- Raster sources were reduced from 521,580,549 bytes to 43,211,038 bytes (92%).
- Aspect ratio was preserved and no automatic crop was applied.
- SVG sources were rasterized to WebP; no active SVG content is served.
- All imported assets remain in `review` until editorial approval.

The manifest is validated at module load with Zod. Machine-readable results are available in `reports/asterheim-import-validation.json`, `reports/broken-media-references.json`, and `reports/unused-assets.json`.

## Manual sample

A representative sample covering character artwork, creature miniatures, supporting characters, guardians, and environmental hero imagery was visually inspected. No corruption, unexpected crop, or failed transparency was observed.

## Deferred items

- GLB publication requires explicit commercial authorization.
- STL/3MF and printer jobs remain private.
- Editorial descriptions, captions, credits, and locales are conservative placeholders marked for review.
- Automated video transcoding was not performed because no approved transcoding runtime was available; the existing MP4 files passed metadata validation and remain below the Git hosting per-file limit.
