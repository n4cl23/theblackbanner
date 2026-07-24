import { writeFile } from 'node:fs/promises';

const V1 = 'https://theblackbanner.vercel.app';
const audit = JSON.parse(
  await (await import('node:fs/promises')).readFile(
    'reports/v1-v2-migration-matrix.json',
    'utf8',
  ),
);
const allowedDecisions = new Set(['MIGRAR', 'MIGRAR_COM_CORREÇÃO']);
const candidates = audit.records.filter(
  (record) => record.slugV1 && allowedDecisions.has(record.decision),
);

const replacements = new Map([
  ['Ã£', 'ã'],
  ['Ãµ', 'õ'],
  ['Ã§', 'ç'],
  ['Ã¡', 'á'],
  ['Ã©', 'é'],
  ['Ã­', 'í'],
  ['Ã³', 'ó'],
  ['Ãº', 'ú'],
  ['Ãª', 'ê'],
  ['Ã´', 'ô'],
  ['Ã¢', 'â'],
  ['Ã€', 'À'],
  ['Ã‰', 'É'],
  ['Â·', '·'],
  ['â€”', '—'],
  ['â€“', '–'],
  ['â€¦', '…'],
  ['â†’', '→'],
  ['â€œ', '“'],
  ['â€', '”'],
  ['â€™', '’'],
]);
const normalizeEncoding = (value) => {
  let result = value.normalize('NFC');
  for (const [broken, fixed] of replacements) result = result.replaceAll(broken, fixed);
  return result;
};
const decodeEntities = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
const stripHtml = (html) =>
  normalizeEncoding(
    decodeEntities(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' '),
    ).trim(),
  );
const capture = (value, expression) =>
  [...value.matchAll(expression)].map((match) => match[1]).filter(Boolean);
const normalizeSlug = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const entityType = (entity) => entity.split(':')[0];
const canonicalId = (record) =>
  `canonical-${entityType(record.entity)}-${normalizeSlug(record.slugV1)}`;
const normalizeMediaUrl = (src) => {
  try {
    const url = new URL(src, V1);
    if (url.pathname === '/_next/image' && url.searchParams.get('url'))
      return new URL(url.searchParams.get('url'), V1).href;
    return url.href;
  } catch {
    return null;
  }
};

async function fetchPage(record) {
  const response = await fetch(`${V1}${record.origin}`);
  if (!response.ok) throw new Error(`${record.origin}: HTTP ${response.status}`);
  const html = await response.text();
  const main = capture(html, /<main[^>]*>([\s\S]*?)<\/main>/gi)[0] ?? html;
  const text = stripHtml(main);
  const title = normalizeEncoding(
    decodeEntities(
      stripHtml(
        capture(main, /<h1[^>]*>([\s\S]*?)<\/h1>/gi)[0] ??
          capture(html, /<title[^>]*>([\s\S]*?)<\/title>/gi)[0] ??
          record.slugV1,
      ),
    ),
  )
    .replace(/\s*[|—-]\s*The Black Banner.*$/i, '')
    .trim();
  const description = normalizeEncoding(
    decodeEntities(
      capture(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/gi,
      )[0] ??
        capture(
          html,
          /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description/gi,
        )[0] ??
        '',
    ),
  ).trim();
  const sourceMedia = [
    ...new Set(
      capture(main, /<(?:img|video|source)[^>]+src=["']([^"']+)/gi)
        .map(normalizeMediaUrl)
        .filter(Boolean),
    ),
  ];
  const links = [
    ...new Set(capture(main, /<a[^>]+href=["']([^"'#]+)/gi)),
  ].flatMap((href) => {
    try {
      const url = new URL(href, V1);
      return url.origin === V1 ? [url.pathname] : [];
    } catch {
      return [];
    }
  });
  return { text, title, description, sourceMedia, links };
}

async function mapConcurrent(items, mapper, concurrency = 12) {
  const result = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      result[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return result;
}

const sourceRecords = await mapConcurrent(candidates, fetchPage);
const pathToId = new Map(
  candidates.map((record) => [record.origin, canonicalId(record)]),
);
const mediaUrls = [...new Set(sourceRecords.flatMap((record) => record.sourceMedia))];
const mediaStatus = new Map(
  await mapConcurrent(
    mediaUrls,
    async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return [url, response.ok];
      } catch {
        return [url, false];
      }
    },
    16,
  ),
);

const records = candidates.map((record, index) => {
  const source = sourceRecords[index];
  const relationships = source.links
    .map((path) => pathToId.get(path))
    .filter(Boolean);
  const kingdomSlugs = source.links
    .filter((path) => /\/(?:reinos|realms)\//.test(path))
    .map((path) => path.split('/').filter(Boolean).at(-1));
  const collectionSlugs = source.links
    .filter((path) => /\/(?:colecoes|collections|colecciones)\//.test(path))
    .map((path) => path.split('/').filter(Boolean).at(-1));
  const verifiedMedia = source.sourceMedia.filter((url) => mediaStatus.get(url));
  const hasInvalidValue = /\b(?:undefined|null)\b/i.test(source.text);
  const hasBrokenEncoding =
    /Ã(?:£|µ|§|¡|©|­|³|º|ª)|Â(?:·|»|«)|â(?:€|†|œ)|�/.test(source.text);
  const incomplete =
    source.text.length < 180 ||
    hasInvalidValue ||
    hasBrokenEncoding ||
    !source.title.trim() ||
    !source.description.trim();
  return {
    id: canonicalId(record),
    slug: normalizeSlug(record.slugV1),
    title: source.title,
    epithet: null,
    description: source.description || source.text.slice(0, 320),
    body: [source.text],
    entityType: entityType(record.entity),
    locale: 'pt-BR',
    status: incomplete ? 'draft' : 'review',
    featured: false,
    order: index,
    categories: [entityType(record.entity)],
    tags: [],
    scales: [],
    kingdomSlugs: [...new Set(kingdomSlugs)],
    collectionSlugs: [...new Set(collectionSlugs)],
    relationshipIds: [...new Set(relationships)],
    media: verifiedMedia.map((url) => ({
      url,
      source: 'V1',
      verified: true,
    })),
    source: {
      system: 'The Black Banner V1',
      url: `${V1}${record.origin}`,
      previousSlug: record.slugV1,
      previousEntity: record.entity,
    },
    migration: {
      migratedAt: '2026-07-24T00:00:00.000Z',
      decision: record.decision,
      notes:
        'Migrado após autorização humana; publicação depende de revisão editorial final.',
    },
  };
});

const ids = new Set(records.map((record) => record.id));
for (const record of records) {
  if (record.relationshipIds.some((id) => !ids.has(id)))
    throw new Error(`Broken relationship in ${record.id}`);
  if (JSON.stringify(record).includes('undefined'))
    throw new Error(`Serialized undefined in ${record.id}`);
}

await writeFile(
  'src/content/asterheim-canonical.generated.json',
  `${JSON.stringify(records, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      records: records.length,
      review: records.filter((record) => record.status === 'review').length,
      draft: records.filter((record) => record.status === 'draft').length,
      relationships: records.reduce(
        (sum, record) => sum + record.relationshipIds.length,
        0,
      ),
      verifiedMedia: records.reduce((sum, record) => sum + record.media.length, 0),
      rejectedMedia: mediaUrls.length - [...mediaStatus.values()].filter(Boolean).length,
    },
    null,
    2,
  ),
);
