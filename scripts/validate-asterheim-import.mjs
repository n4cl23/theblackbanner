import fs from 'node:fs/promises';
import path from 'node:path';

const inventory = JSON.parse(
  await fs.readFile('reports/asterheim-assets-inventory.json', 'utf8'),
);
const images = JSON.parse(
  await fs.readFile(
    'src/content/asterheim-media-manifest.generated.json',
    'utf8',
  ),
);
const videos = JSON.parse(
  await fs.readFile(
    'src/content/asterheim-video-manifest.generated.json',
    'utf8',
  ),
);
const manifest = [...images, ...videos];
const broken = [];
for (const media of manifest) {
  try {
    await fs.access(path.resolve('public', media.src.replace(/^\//, '')));
    if (media.poster)
      await fs.access(path.resolve('public', media.poster.replace(/^\//, '')));
  } catch {
    broken.push({ id: media.id, src: media.src, poster: media.poster });
  }
}

const privateExtensions = new Set([
  '.stl',
  '.3mf',
  '.glb',
  '.cxdlpv4',
  '.exe',
  '.winmd',
  '.cfgx',
  '.zip',
]);
async function walk(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await walk(location)));
    else output.push(location);
  }
  return output;
}
const publicFiles = await walk('public');
const exposedPrivate = publicFiles.filter((file) =>
  privateExtensions.has(path.extname(file).toLowerCase()),
);
const importedSources = new Set(manifest.map((item) => item.src));
const unused = inventory
  .filter(
    (item) =>
      !['.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4'].includes(
        item.extension,
      ) || item.classification === 'DUPLICADO_EXATO',
  )
  .map((item) => ({
    relativePath: item.relativePath,
    extension: item.extension,
    reason: privateExtensions.has(item.extension)
      ? 'private-or-quarantined'
      : item.classification === 'DUPLICADO_EXATO'
        ? 'exact-duplicate'
        : 'unsupported-or-pending-review',
  }));

await fs.writeFile(
  'reports/broken-media-references.json',
  `${JSON.stringify(broken, null, 2)}\n`,
);
await fs.writeFile(
  'reports/unused-assets.json',
  `${JSON.stringify(unused, null, 2)}\n`,
);
const summary = {
  manifestEntries: manifest.length,
  referencedSources: importedSources.size,
  brokenReferences: broken.length,
  exposedPrivateFiles: exposedPrivate,
  unusedOrPrivate: unused.length,
};
await fs.writeFile(
  'reports/asterheim-import-validation.json',
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary));
if (broken.length || exposedPrivate.length) process.exitCode = 1;
