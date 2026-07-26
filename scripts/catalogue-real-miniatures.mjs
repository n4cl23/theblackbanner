import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.join(
  process.cwd(),
  'src',
  'features',
  'collections',
  'data',
  'real-miniatures.generated.json',
);
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

for (const miniature of catalog.miniatures) {
  if (miniature.status === 'published' || miniature.status === 'review') {
    continue;
  }

  const canBeCatalogued = Boolean(
    miniature.title?.trim() &&
      miniature.slug?.trim() &&
      miniature.cover?.src &&
      miniature.collectionSlug?.trim(),
  );
  miniature.status = canBeCatalogued ? 'catalogued' : 'draft';
}

for (const collection of catalog.collections) {
  const canBeCatalogued = Boolean(
    collection.title?.trim() &&
      collection.slug?.trim() &&
      collection.cover?.src,
  );
  collection.status = canBeCatalogued ? 'catalogued' : 'draft';
}

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

const countByStatus = (records) =>
  Object.fromEntries(
    [...new Set(records.map(({ status }) => status))]
      .sort()
      .map((status) => [
        status,
        records.filter((record) => record.status === status).length,
      ]),
  );

console.log(
  JSON.stringify(
    {
      miniatures: countByStatus(catalog.miniatures),
      collections: countByStatus(catalog.collections),
    },
    null,
    2,
  ),
);
