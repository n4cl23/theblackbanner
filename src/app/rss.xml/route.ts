import { siteConfig } from '@/config/site';
import { getContentRepository } from '@/features/content/repository/repository';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const repository = await getContentRepository();
  const articles = (await repository.getLoreArticles()).filter(
    (article) => article.status === 'published',
  );
  const items = articles
    .map(
      (article) =>
        `<item><title>${escapeXml(article.title)}</title><link>${siteConfig.url}/lore/${article.slug}</link><guid isPermaLink="true">${siteConfig.url}/lore/${article.slug}</guid><description>${escapeXml(article.excerpt)}</description><pubDate>${new Date(article.updatedAt).toUTCString()}</pubDate></item>`,
    )
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${escapeXml(siteConfig.description)}</description><language>pt-BR</language>${items}</channel></rss>`,
    {
      headers: {
        'Cache-Control':
          'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    },
  );
}
