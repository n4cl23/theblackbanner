# Lighthouse audit

Date: 2026-07-18

Three local Lighthouse runs were attempted against the optimized `next start` build: Playwright Chromium, Google Chrome, and the desktop preset. Each runner stalled until the execution timeout because the Windows host exhausted local connection buffers (`ENOBUFS`) while a large existing Chrome process tree was active.

No Lighthouse score is reported. Scores were not inferred from other tools.

Verified build facts:

- optimized Next.js build: passed, 46 generated routes;
- generated static JavaScript: 35 files, 1,015,995 bytes across all route chunks (not a per-route transfer measurement);
- generated CSS: 1 file, 69,683 bytes;
- local optimized images: 3 WebP files, 376,598 bytes;
- Playwright browser regression: 30/30 passed;
- axe: 0 serious or critical violations across the five audited primary pages.

Budget status:

- CSS repository budget (120 KB): met;
- local image repository budget (2.5 MB total transfer proxy): met;
- per-route JavaScript, LCP, CLS, TBT, and Lighthouse category targets: not verified by Lighthouse on this host and remain an explicit risk.

Re-run Lighthouse in CI or a clean Chrome host before release promotion. Do not treat this report as evidence of a 90+ Performance score.
