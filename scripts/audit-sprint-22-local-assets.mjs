import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceRoot =
  process.env.ASTERHEIM_SOURCE ??
  'C:\\Users\\Janderson Santos\\Desktop\\Chronicles of Asterheim';
const repositoryRoot = process.cwd();
const reportsRoot = path.join(repositoryRoot, 'reports');
const generatedCatalogPath = path.join(
  repositoryRoot,
  'src/features/collections/data/real-miniatures.generated.json',
);
const visualExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
]);
const videoExtensions = new Set(['.mp4', '.webm']);
const modelExtensions = new Set(['.stl', '.glb', '.obj', '.3mf']);
const documentExtensions = new Set(['.pdf', '.doc', '.docx', '.txt']);
const collectionAliasEntries = [
  ['the black banner company', 'The Black Banner Company'],
  ['the broken mug tavern', 'The Broken Mug Tavern'],
  ['broken mug tavern', 'The Broken Mug Tavern'],
  ['iron tankard tavern', 'Iron Tankard Tavern'],
  ['legends of the realm', 'Legends of the Realm'],
  ['beasts of asterheim', 'Beasts of Asterheim'],
  ['the six crowns of asterheim', 'The Six Crowns of Asterheim'],
  ['a irmandade dos caçadores', 'Mercenários'],
  ['chefes secundários de asterheim', 'Boss Collection'],
  ['leão de escória', 'Boss Collection'],
];

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const collectionAliases = new Map(
  collectionAliasEntries.map(([key, value]) => [normalize(key), value]),
);
const slugify = (value) => normalize(value).replace(/\s+/g, '-');
const displayBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};
const relative = (fullPath) => path.relative(sourceRoot, fullPath);
const sha256 = async (fullPath) => {
  const content = await fs.readFile(fullPath);
  return crypto.createHash('sha256').update(content).digest('hex');
};
const safeJson = async (filePath, fallback = []) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const discoveredDirectories = new Set();
async function walk(directory) {
  if (directory !== sourceRoot) discoveredDirectories.add(directory);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return entry.isFile() ? [fullPath] : [];
    }),
  );
  return nested.flat();
}

function inferCollection(relativePath) {
  const [first = ''] = relativePath.split(path.sep);
  const normalized = normalize(first);
  return (
    collectionAliases.get(normalized) ??
    (normalized === 'documentos' || normalized === 'artbook'
      ? null
      : first || null)
  );
}

function cleanEntityName(value) {
  return value
    .replace(
      /\b(?:banner|thumbnail|thumb|cover|capa|render|hero|poster|external|internal|front|back|side|3x4|4x3|v\d+|\d{3,4}p)\b/gi,
      ' ',
    )
    .replace(/\s*[-–—_]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferEntity(fullPath) {
  const rel = relative(fullPath);
  const parts = rel.split(path.sep);
  const extension = path.extname(fullPath);
  const base = path.basename(fullPath, extension);
  const parent = parts.at(-2) ?? '';
  const parentNormalized = normalize(parent);
  const topNormalized = normalize(parts[0] ?? '');
  if (topNormalized === 'documentos' || topNormalized === 'artbook') {
    return cleanEntityName(base);
  }
  if (
    parent &&
    ![
      'documentos',
      'artbook',
      'arte visual',
      ...collectionAliases.keys(),
      'abyss',
      'elder forest',
      'frost kingdom',
      'ironhold',
      'scorched wastes',
      'stormreach',
    ].includes(parentNormalized)
  ) {
    return parent;
  }
  return cleanEntityName(base);
}

function classifyVisual(width, height, fileName) {
  const normalized = normalize(fileName);
  if (normalized.includes('logo')) return 'logo';
  if (normalized.includes('symbol') || normalized.includes('simbolo'))
    return 'símbolo';
  if (normalized.includes('texture') || normalized.includes('textura'))
    return 'textura';
  if (!width || !height) return 'não identificado';
  const ratio = width / height;
  if (ratio >= 1.7) return 'hero panorâmico';
  if (ratio >= 1.25 && ratio <= 1.42) return 'banner 4:3';
  if (ratio >= 0.7 && ratio <= 0.82) return 'capa 3:4';
  if (width <= 640 && height <= 640) return 'thumbnail';
  if (normalized.includes('banner')) return 'banner';
  if (normalized.includes('cover') || normalized.includes('capa')) return 'capa';
  return 'render';
}

async function imageMetadata(fullPath, extension) {
  if (!visualExtensions.has(extension) || extension === '.svg') return null;
  try {
    const metadata = await sharp(fullPath).metadata();
    const width = metadata.width ?? null;
    const height = metadata.height ?? null;
    return {
      width,
      height,
      aspectRatio:
        width && height ? Number((width / height).toFixed(4)) : null,
      format: metadata.format ?? extension.slice(1),
      hasAlpha: metadata.hasAlpha ?? false,
      orientation:
        width && height
          ? width > height
            ? 'landscape'
            : width < height
              ? 'portrait'
              : 'square'
          : 'unknown',
    };
  } catch {
    return null;
  }
}

async function glbMetadata(fullPath) {
  try {
    const buffer = await fs.readFile(fullPath);
    if (buffer.length < 20 || buffer.toString('utf8', 0, 4) !== 'glTF')
      return null;
    const version = buffer.readUInt32LE(4);
    const jsonLength = buffer.readUInt32LE(12);
    const jsonType = buffer.toString('utf8', 16, 20);
    if (jsonType !== 'JSON') return { version };
    const document = JSON.parse(
      buffer.toString('utf8', 20, 20 + jsonLength).replace(/\0+$/g, ''),
    );
    const positions = (document.meshes ?? []).flatMap((mesh) =>
      (mesh.primitives ?? [])
        .map((primitive) => document.accessors?.[primitive.attributes?.POSITION])
        .filter(Boolean),
    );
    const mins = positions.map((accessor) => accessor.min).filter(Boolean);
    const maxs = positions.map((accessor) => accessor.max).filter(Boolean);
    const bounds =
      mins.length && maxs.length
        ? {
            min: [0, 1, 2].map((axis) =>
              Math.min(...mins.map((value) => value[axis])),
            ),
            max: [0, 1, 2].map((axis) =>
              Math.max(...maxs.map((value) => value[axis])),
            ),
          }
        : null;
    return {
      version,
      meshes: document.meshes?.length ?? 0,
      materials: document.materials?.length ?? 0,
      textures: document.textures?.length ?? 0,
      animations: document.animations?.length ?? 0,
      bounds,
    };
  } catch {
    return null;
  }
}

function riskFor(extension) {
  if (extension === '.stl') return 'ALTO — arquivo privado';
  if (['.exe', '.zip', '.cxdlpv4', '.winmd', '.cfgx'].includes(extension))
    return 'ALTO — arquivo técnico não publicável';
  if (modelExtensions.has(extension)) return 'MÉDIO — validar modelo 3D';
  return 'BAIXO';
}

function recommendedAction(extension) {
  if (extension === '.stl') return 'MANTER_PRIVADO';
  if (['.exe', '.zip', '.cxdlpv4', '.winmd', '.cfgx'].includes(extension))
    return 'REVISÃO_HUMANA';
  if (visualExtensions.has(extension) || videoExtensions.has(extension))
    return 'AVALIAR_CÓPIA_CONTROLADA';
  if (extension === '.glb') return 'AVALIAR_GLTF';
  return 'USAR_COMO_FONTE';
}

const files = await walk(sourceRoot);
const inventory = [];
for (const fullPath of files.toSorted()) {
  const stat = await fs.stat(fullPath);
  const extension = path.extname(fullPath).toLowerCase();
  const image = await imageMetadata(fullPath, extension);
  const glb = extension === '.glb' ? await glbMetadata(fullPath) : null;
  const entity = inferEntity(fullPath);
  const collection = inferCollection(relative(fullPath));
  inventory.push({
    originalAbsolutePath: fullPath,
    relativePath: relative(fullPath),
    sourceFolder: path.dirname(relative(fullPath)),
    originalName: path.basename(fullPath),
    baseName: path.basename(fullPath, path.extname(fullPath)),
    extension: extension || null,
    sizeBytes: stat.size,
    readableSize: displayBytes(stat.size),
    modifiedAt: stat.mtime.toISOString(),
    sha256: await sha256(fullPath),
    probableCategory: visualExtensions.has(extension)
      ? 'image'
      : videoExtensions.has(extension)
        ? 'video'
        : modelExtensions.has(extension)
          ? 'model-3d'
          : documentExtensions.has(extension)
            ? 'document'
            : 'technical',
    probableEntity: entity || null,
    probableCollection: collection,
    probableVisualFormat: image
      ? classifyVisual(image.width, image.height, path.basename(fullPath))
      : null,
    image,
    glb,
    analysisStatus: entity ? 'IDENTIFICADO' : 'SEM_IDENTIFICAÇÃO',
    risk: riskFor(extension),
    recommendedAction: recommendedAction(extension),
  });
}

const duplicateHashGroups = Object.values(
  Object.groupBy(inventory, (item) => item.sha256),
).filter((group) => group.length > 1);
const duplicatePaths = new Set(
  duplicateHashGroups.flatMap((group) => group.map((item) => item.relativePath)),
);

const grouped = Object.values(
  Object.groupBy(
    inventory.filter(
      (item) =>
        item.probableEntity &&
        item.probableCategory !== 'technical' &&
        !['Documentos', 'Artbook'].includes(item.sourceFolder.split(path.sep)[0]),
    ),
    (item) =>
      `${slugify(item.probableCollection ?? 'unassigned')}::${slugify(item.probableEntity)}`,
  ),
).filter(
  (associatedFiles) =>
    associatedFiles.some((item) => item.probableCategory === 'model-3d') ||
    associatedFiles.some(
      (item) => item.sourceFolder.split(path.sep).filter(Boolean).length >= 2,
    ),
);

const canonical = await safeJson(
  path.join(repositoryRoot, 'src/content/asterheim-canonical.generated.json'),
);
const editorial = await safeJson(
  path.join(
    repositoryRoot,
    'src/content/asterheim-editorial-import.generated.json',
  ),
);
const media = await safeJson(
  path.join(
    repositoryRoot,
    'src/content/asterheim-media-manifest.generated.json',
  ),
);
const videos = await safeJson(
  path.join(
    repositoryRoot,
    'src/content/asterheim-video-manifest.generated.json',
  ),
);
const repositorySearch = [
  ...canonical.map((item) => item.slug),
  ...editorial.map((item) => item.slug),
  ...media.map((item) => item.entitySlug),
  ...videos.map((item) => item.entitySlug),
].filter(Boolean);

const groups = grouped
  .map((associatedFiles) => {
    const first = associatedFiles[0];
    const entityName = first.probableEntity;
    const entitySlug = slugify(entityName);
    const collection = first.probableCollection;
    const images = associatedFiles.filter((item) => item.probableCategory === 'image');
    const models = associatedFiles.filter((item) => item.probableCategory === 'model-3d');
    const documents = associatedFiles.filter((item) => item.probableCategory === 'document');
    const groupVideos = associatedFiles.filter((item) => item.probableCategory === 'video');
    const stls = models.filter((item) => item.extension === '.stl');
    const glbs = models.filter((item) => item.extension === '.glb');
    const normalizedEntity = normalize(entityName);
    const repoMatches = repositorySearch.filter((slug) => {
      const normalizedSlug = normalize(slug);
      return (
        normalizedSlug === normalizedEntity ||
        normalizedSlug.includes(normalizedEntity) ||
        normalizedEntity.includes(normalizedSlug)
      );
    });
    const integrationStatus =
      repoMatches.length && images.length && (stls.length || glbs.length)
        ? 'PARCIALMENTE_INTEGRADA'
        : repoMatches.length
          ? 'PARCIALMENTE_INTEGRADA'
          : images.length && !models.length
            ? 'SOMENTE_MÍDIA'
            : models.length && !images.length
              ? 'SOMENTE_MODELO_3D'
              : documents.length && !images.length && !models.length
                ? 'SOMENTE_DOCUMENTAÇÃO'
                : 'NÃO_INTEGRADA';
    const confidence =
      (images.length > 0 && models.length > 0) ||
      (models.length > 1 && entityName === path.basename(path.dirname(first.originalAbsolutePath)))
        ? 'ALTA'
        : associatedFiles.length >= 2
          ? 'MÉDIA'
          : entityName
            ? 'BAIXA'
            : 'NÃO IDENTIFICADO';
    const primaryImage =
      images.find((item) => item.probableVisualFormat === 'capa 3:4') ??
      images.find((item) => item.probableVisualFormat === 'render') ??
      images[0] ??
      null;
    const banner =
      images.find((item) =>
        ['banner 4:3', 'hero panorâmico', 'banner'].includes(
          item.probableVisualFormat,
        ),
      ) ?? null;
    const sourceDescription =
      editorial.find((item) => normalize(item.title).includes(normalizedEntity)) ??
      canonical.find((item) => normalize(item.title).includes(normalizedEntity)) ??
      null;
    const approvedStatus = sourceDescription?.status === 'published';
    const publishable =
      Boolean(
        entityName &&
          primaryImage &&
          collection &&
          sourceDescription &&
          approvedStatus,
      ) && stls.every((item) => !item.relativePath.startsWith('public'));
    const missingTechnical = [];
    if (!documents.length) missingTechnical.push('documentação');
    missingTechnical.push('dimensões', 'número de peças', 'base');
    if (!glbs.length) missingTechnical.push('GLB');
    return {
      identifiedName: entityName,
      suggestedSlug: entitySlug,
      assetSlug: entitySlug,
      files: associatedFiles.map((item) => item.relativePath),
      hasStl: stls.length > 0,
      hasGlb: glbs.length > 0,
      hasImages: images.length > 0,
      hasVideo: groupVideos.length > 0,
      hasPdf: documents.some((item) => item.extension === '.pdf'),
      probableCollection: collection,
      probableEntity: entityName,
      confidence,
      readyForIntegration: Boolean(primaryImage && collection),
      pending: [
        ...(sourceDescription ? [] : ['associação editorial']),
        ...(approvedStatus ? [] : ['aprovação editorial']),
        ...missingTechnical,
      ],
      integrationStatus,
      repositoryMatches: [...new Set(repoMatches)],
      exactDuplicateFiles: associatedFiles
        .filter((item) => duplicatePaths.has(item.relativePath))
        .map((item) => item.relativePath),
      matrix: {
        editorialName: entityName,
        suggestedSlug: entitySlug,
        collection,
        entityType:
          normalize(collection ?? '').includes('beast') ? 'creature' : 'character',
        relatedEntity: repoMatches[0] ?? null,
        primaryImage: primaryImage?.relativePath ?? null,
        banner: banner?.relativePath ?? null,
        gallery: images.map((item) => item.relativePath),
        video: groupVideos[0]?.relativePath ?? null,
        glb: glbs[0]?.relativePath ?? null,
        privateStl: stls[0]?.relativePath ?? null,
        pdf:
          documents.find((item) => item.extension === '.pdf')?.relativePath ??
          null,
        printGuide:
          documents.find((item) =>
            normalize(item.originalName).includes('print guide'),
          )?.relativePath ?? null,
        technicalDataFound: [
          ...(glbs.length ? ['modelo GLB'] : []),
          ...(stls.length ? ['modelo STL privado'] : []),
          ...(documents.length ? ['documentação'] : []),
        ],
        technicalDataMissing: missingTechnical,
        recommendedEditorialStatus: publishable ? 'published' : 'draft',
        proposedAction: publishable
          ? 'INTEGRAR_PUBLICADO'
          : primaryImage && collection
            ? 'INTEGRAR_DRAFT'
            : sourceDescription
              ? 'AGUARDAR_DADOS'
              : 'REVISÃO_HUMANA',
      },
    };
  })
  .toSorted((a, b) =>
    `${a.probableCollection}/${a.identifiedName}`.localeCompare(
      `${b.probableCollection}/${b.identifiedName}`,
    ),
  );

const slugCollisions = Object.values(
  Object.groupBy(groups, (group) => group.suggestedSlug),
).filter((entries) => entries.length > 1);
for (const entries of slugCollisions) {
  for (const group of entries) {
    const qualifiedSlug = `${group.suggestedSlug}-${slugify(
      group.probableCollection ?? 'unassigned',
    )}`;
    group.suggestedSlug = qualifiedSlug;
    group.matrix.suggestedSlug = qualifiedSlug;
    group.matrix.proposedAction = 'REVISÃO_HUMANA';
    group.integrationStatus = 'CONFLITO_COM_REGISTRO_EXISTENTE';
    group.pending = [
      'resolver identidade entre coleções',
      ...group.pending,
    ];
  }
}

const collectionGroups = Object.entries(
  Object.groupBy(groups, (group) => group.probableCollection ?? 'Não identificada'),
)
  .map(([name, entries]) => ({
    name,
    files: entries.reduce((total, entry) => total + entry.files.length, 0),
    entities: entries.map((entry) => entry.identifiedName),
    banners: entries.filter((entry) => entry.matrix.banner).length,
    covers: entries.filter((entry) => entry.matrix.primaryImage).length,
    videos: entries.filter((entry) => entry.hasVideo).length,
    models: entries.filter((entry) => entry.hasGlb || entry.hasStl).length,
    documentation: entries.filter((entry) => entry.hasPdf).length,
    completeness:
      entries.length &&
      entries.every((entry) => entry.readyForIntegration)
        ? 'ALTA'
        : entries.some((entry) => entry.readyForIntegration)
          ? 'PARCIAL'
          : 'BAIXA',
    recommendedStatus: 'draft',
  }))
  .toSorted((a, b) => a.name.localeCompare(b.name));

const byExtension = Object.entries(
  Object.groupBy(inventory, (item) => item.extension ?? '[sem extensão]'),
)
  .map(([extension, entries]) => ({ extension, count: entries.length }))
  .toSorted((a, b) => b.count - a.count);
const summary = {
  sourceRoot,
  totalFiles: inventory.length,
  totalFolders: discoveredDirectories.size,
  byExtension,
  images: inventory.filter((item) => item.probableCategory === 'image').length,
  videos: inventory.filter((item) => item.probableCategory === 'video').length,
  glbs: inventory.filter((item) => item.extension === '.glb').length,
  stls: inventory.filter((item) => item.extension === '.stl').length,
  pdfs: inventory.filter((item) => item.extension === '.pdf').length,
  other: inventory.filter(
    (item) =>
      item.probableCategory !== 'image' &&
      item.probableCategory !== 'video' &&
      item.extension !== '.glb' &&
      item.extension !== '.stl' &&
      item.extension !== '.pdf',
  ).length,
  miniatureGroups: groups.length,
  confidence: Object.fromEntries(
    Object.entries(Object.groupBy(groups, (group) => group.confidence)).map(
      ([key, entries]) => [key, entries.length],
    ),
  ),
  integration: Object.fromEntries(
    Object.entries(
      Object.groupBy(groups, (group) => group.integrationStatus),
    ).map(([key, entries]) => [key, entries.length]),
  ),
  publishable: groups.filter(
    (group) => group.matrix.proposedAction === 'INTEGRAR_PUBLICADO',
  ).length,
  drafts: groups.filter(
    (group) => group.matrix.proposedAction === 'INTEGRAR_DRAFT',
  ).length,
  humanReview: groups.filter(
    (group) => group.matrix.proposedAction === 'REVISÃO_HUMANA',
  ).length,
  exactDuplicateGroups: duplicateHashGroups.length,
  exactDuplicateFiles: duplicateHashGroups.reduce(
    (total, entries) => total + entries.length,
    0,
  ),
  privateFiles: inventory.filter((item) => item.extension === '.stl').length,
  conflicts: slugCollisions.reduce(
    (total, entries) => total + entries.length,
    0,
  ),
};

const publicMediaBySlug = Object.groupBy(
  media.filter((item) => item.entitySlug && item.src),
  (item) => item.entitySlug,
);
const publicVideosBySlug = Object.groupBy(
  videos.filter((item) => item.entitySlug && item.src),
  (item) => item.entitySlug,
);
const safeCatalogRecords = groups.map((group) => {
  const assets = publicMediaBySlug[group.assetSlug] ?? [];
  const groupVideo = (publicVideosBySlug[group.assetSlug] ?? [])[0] ?? null;
  const primary =
    assets.find((item) => item.usage === 'hero') ?? assets[0] ?? null;
  const sourceFingerprints = inventory
    .filter((item) => group.files.includes(item.relativePath))
    .map((item) => item.sha256);
  return {
    id: `miniature-${group.suggestedSlug}`,
    slug: group.suggestedSlug,
    title: group.identifiedName,
    locale: 'pt-br',
    status: 'draft',
    collectionSlug: slugify(group.probableCollection ?? 'unassigned'),
    collectionTitle: group.probableCollection,
    entityType: group.matrix.entityType,
    entitySlug: group.repositoryMatches[0] ?? group.suggestedSlug,
    description: null,
    scale: null,
    dimensionsMm: null,
    pieceCount: null,
    base: null,
    support: null,
    difficulty: null,
    material: null,
    cover: primary
      ? {
          src: primary.src,
          alt: primary.alt,
          width: primary.width,
          height: primary.height,
        }
      : null,
    gallery: assets.map((asset) => ({
      src: asset.src,
      alt: asset.alt,
      width: asset.width,
      height: asset.height,
    })),
    video: groupVideo
      ? { src: groupVideo.src, poster: groupVideo.poster ?? null }
      : null,
    model3d: null,
    privateStlAvailable: group.hasStl,
    privateGlbAvailable: group.hasGlb,
    hasSourcePdf: group.hasPdf,
    confidence: group.confidence,
    sourceFingerprint: crypto
      .createHash('sha256')
      .update(sourceFingerprints.toSorted().join(':'))
      .digest('hex'),
    editorialPending: group.pending,
  };
});
const safeCollectionRecords = Object.entries(
  Object.groupBy(safeCatalogRecords, (record) => record.collectionSlug),
)
  .map(([slug, records]) => {
    const canonicalCollection = canonical.find(
      (item) => item.entityType === 'collection' && item.slug === slug,
    );
    const cover = records.find((record) => record.cover)?.cover ?? null;
    return {
      id: `collection-${slug}`,
      slug,
      title: records[0].collectionTitle,
      locale: 'pt-br',
      status: canonicalCollection?.status ?? 'draft',
      description: canonicalCollection?.description ?? null,
      history: canonicalCollection?.body ?? [],
      cover,
      itemSlugs: records.map((record) => record.slug),
      editorialPending: canonicalCollection
        ? ['aprovação editorial final']
        : ['descrição editorial', 'aprovação editorial final'],
    };
  })
  .toSorted((a, b) => a.title.localeCompare(b.title));

await fs.mkdir(reportsRoot, { recursive: true });
await fs.mkdir(path.dirname(generatedCatalogPath), { recursive: true });
await fs.writeFile(
  generatedCatalogPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: 'local-audit-sanitized',
      summary: {
        miniatures: safeCatalogRecords.length,
        collections: safeCollectionRecords.length,
        published: 0,
        drafts: safeCatalogRecords.length,
      },
      collections: safeCollectionRecords,
      miniatures: safeCatalogRecords,
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-local-assets-inventory.json'),
  `${JSON.stringify({ summary, records: inventory }, null, 2)}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-miniature-asset-groups.json'),
  `${JSON.stringify({ summary, groups }, null, 2)}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-local-duplicates.json'),
  `${JSON.stringify(
    {
      summary: {
        groups: duplicateHashGroups.length,
        files: summary.exactDuplicateFiles,
      },
      groups: duplicateHashGroups.map((entries) => ({
        sha256: entries[0].sha256,
        classification: 'duplicado exato',
        files: entries.map((item) => ({
          path: item.relativePath,
          name: item.originalName,
          extension: item.extension,
          sizeBytes: item.sizeBytes,
        })),
      })),
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-real-miniatures-matrix.json'),
  `${JSON.stringify(
    { summary, records: groups.map((group) => group.matrix) },
    null,
    2,
  )}\n`,
);

const inventoryMarkdown = `# Sprint 22 — inventário de assets locais

Fonte: \`${sourceRoot}\`

## Resumo

- Arquivos: **${summary.totalFiles}**
- Pastas com arquivos: **${summary.totalFolders}**
- Imagens: **${summary.images}**
- Vídeos: **${summary.videos}**
- GLBs: **${summary.glbs}**
- STLs privados: **${summary.stls}**
- PDFs: **${summary.pdfs}**
- Outros: **${summary.other}**

## Extensões

| Extensão | Quantidade |
| --- | ---: |
${byExtension.map((item) => `| \`${item.extension}\` | ${item.count} |`).join('\n')}

O inventário completo, com caminho absoluto original, dimensões, hashes e classificação, está em \`sprint-22-local-assets-inventory.json\`.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-local-assets-inventory.md'),
  inventoryMarkdown,
);

const groupMarkdown = `# Sprint 22 — grupos de assets de miniaturas

Foram identificados **${groups.length}** grupos por coocorrência em pastas, nomes e tipos de arquivo.

| Coleção provável | Miniatura | Confiança | STL | GLB | Imagem | Vídeo | PDF | Integração |
| --- | --- | --- | :---: | :---: | :---: | :---: | :---: | --- |
${groups
  .map(
    (group) =>
      `| ${group.probableCollection ?? '—'} | ${group.identifiedName} | ${group.confidence} | ${group.hasStl ? 'sim' : 'não'} | ${group.hasGlb ? 'sim' : 'não'} | ${group.hasImages ? 'sim' : 'não'} | ${group.hasVideo ? 'sim' : 'não'} | ${group.hasPdf ? 'sim' : 'não'} | ${group.integrationStatus} |`,
  )
  .join('\n')}
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-miniature-asset-groups.md'),
  groupMarkdown,
);

const duplicateMarkdown = `# Sprint 22 — duplicidades locais

- Grupos de hash SHA-256 repetido: **${duplicateHashGroups.length}**
- Arquivos participantes: **${summary.exactDuplicateFiles}**
- Nenhum arquivo foi apagado.

${duplicateHashGroups
  .map(
    (entries) =>
      `## ${entries[0].sha256}\n\n${entries.map((item) => `- \`${item.relativePath}\``).join('\n')}`,
  )
  .join('\n\n')}
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-local-duplicates.md'),
  duplicateMarkdown,
);

const crosscheckMarkdown = `# Sprint 22 — cruzamento pasta local × repositório

| Status | Quantidade |
| --- | ---: |
${Object.entries(summary.integration)
  .map(([status, count]) => `| ${status} | ${count} |`)
  .join('\n')}

## Grupos

${groups
  .map(
    (group) =>
      `- **${group.identifiedName}** — ${group.integrationStatus}; correspondências: ${group.repositoryMatches.join(', ') || 'nenhuma'}.`,
  )
  .join('\n')}
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-local-repository-crosscheck.md'),
  crosscheckMarkdown,
);

const matrixMarkdown = `# Sprint 22 — matriz real de miniaturas

- Aptas para publicação: **${summary.publishable}**
- Destinadas a draft: **${summary.drafts}**
- Revisão humana: **${summary.humanReview}**

| Miniatura | Coleção | Imagem | GLB | STL privado | Status | Ação |
| --- | --- | :---: | :---: | :---: | --- | --- |
${groups
  .map(
    (group) =>
      `| ${group.identifiedName} | ${group.probableCollection ?? '—'} | ${group.matrix.primaryImage ? 'sim' : 'não'} | ${group.hasGlb ? 'sim' : 'não'} | ${group.hasStl ? 'sim' : 'não'} | ${group.matrix.recommendedEditorialStatus} | ${group.matrix.proposedAction} |`,
  )
  .join('\n')}

Nenhum STL deve ser copiado para \`public/\`. Campos técnicos ausentes permanecem nulos na integração.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-real-miniatures-matrix.md'),
  matrixMarkdown,
);

const collectionsMarkdown = `# Sprint 22 — coleções detectadas

| Coleção | Entidades | Arquivos | Capas | Banners | Vídeos | Modelos | PDFs | Completude | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
${collectionGroups
  .map(
    (collection) =>
      `| ${collection.name} | ${collection.entities.length} | ${collection.files} | ${collection.covers} | ${collection.banners} | ${collection.videos} | ${collection.models} | ${collection.documentation} | ${collection.completeness} | ${collection.recommendedStatus} |`,
  )
  .join('\n')}
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-collections-audit.md'),
  collectionsMarkdown,
);

console.log(JSON.stringify(summary, null, 2));
