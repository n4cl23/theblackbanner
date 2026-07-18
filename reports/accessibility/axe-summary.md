# Accessibility audit

Date: 2026-07-18

Automated axe audits ran in Chromium against `/`, `/pt-br`, `/world/kingdoms`, `/bestiario`, and `/lore` without suppressing the color-contrast rule.

- serious violations: 0;
- critical violations: 0;
- keyboard/SkipLink journey: passed;
- reduced-motion policy: passed;
- missing image alt attributes on Home: 0;
- mobile journeys remain covered by the full Playwright suite.

The first run found real contrast failures in subdued Home copy and kingdom numerals. The visual tokens were corrected and the five-page axe suite then passed. Automated checks do not replace manual screen-reader and 200% zoom testing.
