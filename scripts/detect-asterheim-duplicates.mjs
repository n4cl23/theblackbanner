import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const inventoryPath = path.resolve('reports/asterheim-assets-inventory.json');
const duplicatesPath = path.resolve('reports/asterheim-assets-duplicates.json');
const source = JSON.parse(
  (await fs.readFile(inventoryPath, 'utf8')).replace(/^\uFEFF/, ''),
);
const comparableExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
  '.mp4',
  '.webm',
  '.glb',
  '.pdf',
  '.stl',
  '.3mf',
]);

async function walk(directory) {
  const files = [];
  try {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const location = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await walk(location)));
      else if (
        comparableExtensions.has(path.extname(entry.name).toLowerCase())
      ) {
        const stat = await fs.stat(location);
        files.push({ path: location, sizeBytes: stat.size, origin: 'project' });
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return files;
}

function digest(location) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    createReadStream(location)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', () => resolve(hash.digest('hex')));
  });
}

const projectFiles = await walk(path.resolve('public'));
const sourceFiles = source.map((item) => ({
  path: item.originalPath,
  sizeBytes: item.sizeBytes,
  origin: 'source',
  item,
}));
const bySize = new Map();
for (const file of [...sourceFiles, ...projectFiles]) {
  const group = bySize.get(file.sizeBytes) ?? [];
  group.push(file);
  bySize.set(file.sizeBytes, group);
}

const exactGroups = [];
let hashedFiles = 0;
for (const group of bySize.values()) {
  const sourceCount = group.filter(({ origin }) => origin === 'source').length;
  if (group.length < 2 || sourceCount === 0) continue;
  const byHash = new Map();
  for (const file of group) {
    const sha256 = await digest(file.path);
    hashedFiles += 1;
    const matches = byHash.get(sha256) ?? [];
    matches.push({
      path: file.path,
      origin: file.origin,
      sizeBytes: file.sizeBytes,
    });
    byHash.set(sha256, matches);
  }
  for (const [sha256, matches] of byHash) {
    if (matches.length > 1)
      exactGroups.push({
        sha256,
        sizeBytes: matches[0].sizeBytes,
        files: matches,
      });
  }
}

const normalizedNameGroups = new Map();
for (const item of source) {
  const normalized = path.basename(item.recommendedDestination).toLowerCase();
  const group = normalizedNameGroups.get(normalized) ?? [];
  group.push(item);
  normalizedNameGroups.set(normalized, group);
}
const nameConflicts = [...normalizedNameGroups.entries()]
  .filter(([, items]) => items.length > 1)
  .map(([normalizedName, items]) => ({
    normalizedName,
    classification:
      items.every((item) => item.contentType === 'image') &&
      new Set(items.map((item) => `${item.width}x${item.height}`)).size > 1
        ? 'VARIACAO_VALIDA'
        : 'CONFLITO_DE_NOME',
    files: items.map((item) => ({
      path: item.originalPath,
      width: item.width,
      height: item.height,
      sizeBytes: item.sizeBytes,
    })),
  }));

const exactPaths = new Set(
  exactGroups.flatMap(({ files }) =>
    files
      .filter(({ origin }) => origin === 'source')
      .map(({ path: filePath }) => filePath),
  ),
);
const conflictByPath = new Map(
  nameConflicts.flatMap((group) =>
    group.files.map((file) => [file.path, group.classification]),
  ),
);
for (const item of source) {
  item.classification = exactPaths.has(item.originalPath)
    ? 'DUPLICADO_EXATO'
    : (conflictByPath.get(item.originalPath) ?? 'NOVO');
}

await fs.writeFile(
  inventoryPath,
  `${JSON.stringify(source, null, 2)}\n`,
  'utf8',
);
await fs.writeFile(
  duplicatesPath,
  `${JSON.stringify({ exactGroups, nameConflicts, hashedFiles, projectFilesCompared: projectFiles.length }, null, 2)}\n`,
  'utf8',
);
process.stdout.write(
  `${JSON.stringify({ exactGroups: exactGroups.length, exactFiles: exactPaths.size, nameConflicts: nameConflicts.length, hashedFiles, projectFilesCompared: projectFiles.length })}\n`,
);
