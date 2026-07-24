import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inventory = JSON.parse(
  await fs.readFile('reports/asterheim-assets-inventory.json', 'utf8'),
);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg']);

function slug(value) {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 90) || 'asset'
  );
}

function shortHash(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 8);
}

const results = [];
for (const item of inventory) {
  if (
    !imageExtensions.has(item.extension) ||
    item.classification === 'DUPLICADO_EXATO'
  )
    continue;
  const entitySlug = slug(item.probableEntity);
  const base = slug(path.basename(item.fileName, item.extension));
  const fileName = `${base}-${shortHash(item.relativePath)}.webp`;
  const relativeOutput = path.posix.join(
    'media',
    'asterheim',
    'entities',
    entitySlug,
    fileName,
  );
  const absoluteOutput = path.resolve('public', relativeOutput);
  await fs.mkdir(path.dirname(absoluteOutput), { recursive: true });

  const animated = item.extension === '.gif';
  try {
    await fs.access(absoluteOutput);
  } catch {
    const pipeline = sharp(
      item.originalPath,
      animated
        ? { animated: true, limitInputPixels: false }
        : { limitInputPixels: false },
    )
      .rotate()
      .resize({
        width: animated ? 1600 : 2560,
        height: animated ? 1600 : 2560,
        fit: 'inside',
        withoutEnlargement: true,
      });
    await pipeline
      .webp({ quality: animated ? 78 : 84, effort: 5, smartSubsample: true })
      .toFile(absoluteOutput);
  }
  const metadata = await sharp(
    absoluteOutput,
    animated ? { animated: true } : {},
  ).metadata();
  const stat = await fs.stat(absoluteOutput);
  results.push({
    id: `media-${entitySlug}-${shortHash(item.relativePath)}`,
    sourcePath: item.relativePath,
    src: `/${relativeOutput}`,
    entityName: item.probableEntity,
    entitySlug,
    width: metadata.width ?? null,
    height: metadata.pageHeight ?? metadata.height ?? null,
    animated,
    originalBytes: item.sizeBytes,
    optimizedBytes: stat.size,
    status: 'review',
  });
}

await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/asterheim-optimized-media.json',
  `${JSON.stringify(results, null, 2)}\n`,
);
function inferEntityType(sourcePath) {
  const normalized = sourcePath.toLowerCase();
  if (normalized.includes('map')) return 'map';
  if (
    normalized.includes('beasts of asterheim') ||
    normalized.includes('atlas') ||
    normalized.includes('bestiary')
  )
    return 'creature';
  if (normalized.includes('six crowns')) return 'collection';
  if (normalized.includes('legends of the realm')) return 'guardian';
  return 'character';
}
const manifest = results.map((item) => ({
  id: item.id,
  type: item.animated ? 'animation' : 'image',
  src: item.src,
  poster: null,
  alt: `Visual de ${item.entityName} no arquivo de Asterheim`,
  caption: 'Mídia importada; descrição editorial pendente de revisão.',
  credit: 'The Black Banner — Chronicles of Asterheim',
  width: item.width,
  height: item.height,
  duration: null,
  locale: 'und',
  entityType: inferEntityType(item.sourcePath),
  entitySlug: item.entitySlug,
  usage:
    item.sourcePath.toLowerCase().includes('banner') ||
    item.sourcePath.toLowerCase().includes('hero')
      ? 'hero'
      : 'gallery',
  status: 'review',
}));
await fs.mkdir('src/content', { recursive: true });
await fs.writeFile(
  'src/content/asterheim-media-manifest.generated.json',
  `${JSON.stringify(manifest, null, 2)}\n`,
);
const original = results.reduce((sum, item) => sum + item.originalBytes, 0);
const optimized = results.reduce((sum, item) => sum + item.optimizedBytes, 0);
console.log(
  JSON.stringify({
    files: results.length,
    originalBytes: original,
    optimizedBytes: optimized,
    reductionPercent: Math.round((1 - optimized / original) * 100),
  }),
);
