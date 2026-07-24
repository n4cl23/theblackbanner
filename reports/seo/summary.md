# SEO audit

Date: 2026-07-18

Verified by Vitest, Playwright, and the production build:

- indexable root metadata with canonical URL;
- localized canonical, `hreflang`, and `x-default` entries;
- localized sitemap with priority and change frequency;
- `robots.txt` allowing the public site and excluding `/admin/` and `/design-system`;
- Open Graph and Twitter large-image metadata;
- WebSite, Organization, CreativeWork, CollectionPage, Article, BreadcrumbList, and ImageObject structured data;
- RSS 2.0 at `/rss.xml`;
- branded 404 returning HTTP 404;
- permanent legacy redirects returning HTTP 308;
- no broken internal Home links in the automated crawl.

VideoObject is intentionally absent because no canonical video asset exists yet.
