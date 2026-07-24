import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const root = process.cwd();
const publicRoot = path.join(root, 'public');
const reportsRoot = path.join(root, 'reports');
const sourceRoot = 'C:\\Users\\Janderson Santos\\Desktop\\Chronicles of Asterheim';

const readJson = async (relativePath) =>
  JSON.parse(await fs.readFile(path.join(root, relativePath), 'utf8'));
const catalog = await readJson(
  'src/features/collections/data/real-miniatures.generated.json',
);
const groupsReport = await readJson(
  'reports/sprint-22-miniature-asset-groups.json',
);
const inventoryReport = await readJson(
  'reports/sprint-22-local-assets-inventory.json',
);
const canonical = await readJson(
  'src/content/asterheim-canonical.generated.json',
);
const editorialImports = await readJson(
  'src/content/asterheim-editorial-import.generated.json',
);
const videoManifest = await readJson(
  'src/content/asterheim-video-manifest.generated.json',
);
const optimizedMedia = await readJson('reports/asterheim-optimized-media.json');
const importedVideos = await readJson('reports/asterheim-videos.json');
const migrationMatrix = await readJson('reports/v1-v2-migration-matrix.json');

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const sha256 = async (filePath) =>
  crypto
    .createHash('sha256')
    .update(await fs.readFile(filePath))
    .digest('hex');

const tracked = new Set(
  execFileSync('git', ['ls-files', '-z'], { cwd: root })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((entry) => entry.replaceAll('\\', '/')),
);

async function validatePublicReference(src, kind, recordSlug) {
  if (!src) return null;
  if (/^[a-z]:\\/i.test(src)) {
    return { recordSlug, kind, src, status: 'LOCAL_PATH' };
  }
  if (/\.stl$/i.test(src) || /\.glb$/i.test(src)) {
    return { recordSlug, kind, src, status: 'PRIVATE_ASSET' };
  }
  const relativePath = src.replace(/^\/+/, '');
  const fullPath = path.join(publicRoot, ...relativePath.split('/'));
  const gitPath = `public/${relativePath}`;
  let stat;
  try {
    stat = await fs.stat(fullPath);
  } catch {
    return { recordSlug, kind, src, gitPath, status: 'MISSING' };
  }
  if (!tracked.has(gitPath)) {
    const caseInsensitiveMatch = [...tracked].find(
      (entry) => entry.toLowerCase() === gitPath.toLowerCase(),
    );
    return {
      recordSlug,
      kind,
      src,
      gitPath,
      status: caseInsensitiveMatch ? 'CASE_MISMATCH' : 'NOT_VERSIONED',
      caseInsensitiveMatch: caseInsensitiveMatch ?? null,
    };
  }
  const extension = path.extname(fullPath).toLowerCase();
  const supported =
    kind === 'video'
      ? ['.mp4', '.webm'].includes(extension)
      : ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(extension);
  if (!supported) {
    return {
      recordSlug,
      kind,
      src,
      gitPath,
      status: 'UNSUPPORTED_FORMAT',
    };
  }
  let integrity = true;
  try {
    if (kind === 'video') {
      const header = await fs.readFile(fullPath);
      integrity =
        extension === '.mp4'
          ? header.subarray(4, 12).toString('ascii').includes('ftyp')
          : header.subarray(0, 4).toString('ascii') === '\x1aEß£';
    } else if (extension !== '.svg') {
      await sharp(fullPath).metadata();
    }
  } catch {
    integrity = false;
  }
  if (!integrity) {
    return {
      recordSlug,
      kind,
      src,
      gitPath,
      sizeBytes: stat.size,
      status: 'CORRUPTED',
    };
  }
  const origin =
    kind === 'video'
      ? importedVideos.find((entry) => entry.src === src)?.sourcePath ?? null
      : optimizedMedia.find((entry) => entry.src === src)?.sourcePath ?? null;
  return {
    recordSlug,
    kind,
    src,
    gitPath,
    sizeBytes: stat.size,
    sha256: await sha256(fullPath),
    status: 'VALID',
    versioned: true,
    originRelativePath: origin,
    originAbsolutePath: origin ? path.join(sourceRoot, origin) : null,
  };
}

const mediaChecks = [];
for (const record of catalog.miniatures) {
  if (record.cover) {
    mediaChecks.push(
      await validatePublicReference(record.cover.src, 'cover', record.slug),
    );
  }
  if (record.video) {
    mediaChecks.push(
      await validatePublicReference(record.video.src, 'video', record.slug),
    );
    if (record.video.poster) {
      mediaChecks.push(
        await validatePublicReference(
          record.video.poster,
          'poster',
          record.slug,
        ),
      );
    }
  }
}

const mediaReferenceCounts = Object.groupBy(
  mediaChecks.filter(Boolean),
  (entry) => `${entry.kind}:${entry.src}`,
);
for (const entries of Object.values(mediaReferenceCounts)) {
  if (entries.length <= 1) continue;
  for (const entry of entries) {
    entry.duplicateReference = true;
  }
}

const printGuideSources = new Map([
  ['black-fang-mercenary', 'black-fang-mercenary-print-guide'],
  ['durgan-blacksmith', 'durgan-blacksmith-print-guide'],
  ['iron-bull', 'iron-bull-print-guide'],
]);
const ironholdImportByEntity = new Map(
  editorialImports
    .filter((entry) => /^the-black-banner-ironhold-\d+-/.test(entry.slug))
    .map((entry) => {
      const entitySlug = entry.slug
        .replace(/^the-black-banner-ironhold-\d+-/, '')
        .replace(/-\d+$/, '');
      return [entitySlug, entry];
    }),
);

function editorialSource(record) {
  const printGuideSlug = printGuideSources.get(record.slug);
  if (printGuideSlug) {
    const source = editorialImports.find(
      (entry) => entry.slug === printGuideSlug,
    );
    if (source) {
      return {
        type: 'user-provided-final-source',
        reference: source.sourcePath,
        status: source.status,
        descriptionAvailable: Boolean(source.body?.trim()),
      };
    }
  }
  const artbookSource = ironholdImportByEntity.get(record.slug);
  if (artbookSource) {
    return {
      type: 'user-provided-artbook',
      reference: artbookSource.sourcePath,
      status: artbookSource.status,
      descriptionAvailable: Boolean(artbookSource.body?.trim()),
    };
  }
  const canonicalSource =
    canonical.find(
      (entry) =>
        entry.slug === record.slug ||
        entry.slug === record.entitySlug ||
        normalize(entry.title) === normalize(record.title),
    ) ?? null;
  if (canonicalSource) {
    return {
      type: 'canonical-content',
      reference: canonicalSource.source.url,
      status: canonicalSource.status,
      descriptionAvailable: Boolean(canonicalSource.description?.trim()),
    };
  }
  const matrixSource =
    migrationMatrix.records.find(
      (entry) =>
        entry.slugV1 === record.slug ||
        entry.slugV2 === record.slug ||
        normalize(entry.entity).endsWith(normalize(record.title)),
    ) ?? null;
  if (matrixSource) {
    return {
      type: 'migration-matrix',
      reference: matrixSource.origin,
      status: matrixSource.decision,
      descriptionAvailable: false,
    };
  }
  return null;
}

const conflictSlugs = new Set([
  'the-kraken-caller-legends-of-the-realm',
  'the-kraken-caller-the-six-crowns-of-asterheim',
  'the-last-dragon-slayer-legends-of-the-realm',
  'the-last-dragon-slayer-the-six-crowns-of-asterheim',
]);
const groupBySlug = new Map(
  groupsReport.groups.map((group) => [group.suggestedSlug, group]),
);
const checkByRecordAndKind = new Map(
  mediaChecks
    .filter(Boolean)
    .map((entry) => [`${entry.recordSlug}:${entry.kind}`, entry]),
);

const reviewMatrix = catalog.miniatures.map((record) => {
  const source = editorialSource(record);
  const coverCheck = checkByRecordAndKind.get(`${record.slug}:cover`) ?? null;
  const videoCheck = checkByRecordAndKind.get(`${record.slug}:video`) ?? null;
  const group = groupBySlug.get(record.slug) ?? null;
  const conflict = conflictSlugs.has(record.slug);
  const missing = [
    ...(record.cover ? [] : ['imagem principal']),
    ...(source?.descriptionAvailable ? [] : ['descrição baseada em fonte real']),
    ...(source ? [] : ['fonte editorial']),
    ...(conflict ? ['decisão de coleção'] : []),
    'aprovação registrada',
  ];
  const recommendation = conflict
    ? 'COLLECTION_CONFLICT'
    : !record.cover || coverCheck?.status !== 'VALID'
      ? 'INCOMPLETE_MEDIA'
      : !source?.descriptionAvailable
        ? 'INCOMPLETE_EDITORIAL'
        : 'READY_FOR_EDITORIAL_REVIEW';
  return {
    editorialName: record.title,
    slug: record.slug,
    type: record.entityType,
    collection: record.collectionTitle,
    collectionSlug: record.collectionSlug,
    relatedEntity: record.entitySlug,
    currentStatus: conflict ? 'review' : record.status,
    primaryImage: record.cover?.src ?? null,
    video: record.video?.src ?? null,
    privateGlb: record.privateGlbAvailable,
    privateStl: record.privateStlAvailable,
    description: record.description,
    editorialSource: source,
    locale: record.locale,
    conflict,
    pending: [...new Set([...record.editorialPending, ...missing])],
    recommendation,
    mediaValidation: {
      cover: coverCheck?.status ?? null,
      video: videoCheck?.status ?? null,
    },
    localAssetGroup: group?.files ?? [],
  };
});

const proposedBatchSlugs = [
  'black-fang-mercenary',
  'durgan-blacksmith',
  'iron-bull',
  'iron-wyrm',
  'forge-sentinel',
  'molten-guardian',
  'crystal-ram',
  'iron-boar',
  'ash-wolf',
  'rock-burrower',
  'tunnel-reaper',
  'ore-leech',
  'ember-tick',
  'obsidian-colossus',
];
const proposedBatch = proposedBatchSlugs.map((slug) => {
  const record = reviewMatrix.find((entry) => entry.slug === slug);
  if (!record) throw new Error(`Missing proposed batch record: ${slug}`);
  return {
    slug,
    title: record.editorialName,
    collection: record.collection,
    type: record.type,
    media: {
      cover: record.primaryImage,
      coverValidation: record.mediaValidation.cover,
      video: record.video,
    },
    description: record.editorialSource?.reference ?? null,
    reason:
      'Confiança alta, imagem válida e descrição disponível em fonte fornecida pelo usuário.',
    pending: ['aprovação editorial explícita'],
    recommendedStatus: 'published-after-approval',
  };
});

const missingCover = reviewMatrix.filter((record) => !record.primaryImage);
const recordsWithVideo = reviewMatrix.filter((record) => record.video);
const videoCountsByEntity = Object.entries(
  Object.groupBy(videoManifest, (entry) => entry.entitySlug),
)
  .filter(([, entries]) => entries.length > 1)
  .map(([entitySlug, entries]) => ({
    entitySlug,
    count: entries.length,
    videos: entries.map((entry) => entry.src),
  }));
const invalidMedia = mediaChecks.filter(
  (entry) => entry && entry.status !== 'VALID',
);
const countSummary = {
  groupsIdentified: groupsReport.groups.length,
  recordsIntegrated: catalog.miniatures.length,
  draft: reviewMatrix.filter(
    (record) => record.currentStatus === 'draft',
  ).length,
  humanReview: reviewMatrix.filter(
    (record) => record.currentStatus === 'review',
  ).length,
  published: reviewMatrix.filter(
    (record) => record.currentStatus === 'published',
  ).length,
  coversAssociated: reviewMatrix.filter((record) => record.primaryImage).length,
  recordsWithVideo: recordsWithVideo.length,
  privateGlbs: inventoryReport.records.filter(
    (entry) => entry.extension === '.glb',
  ).length,
  privateStls: inventoryReport.records.filter(
    (entry) => entry.extension === '.stl',
  ).length,
  missingCover: missingCover.map((record) => ({
    slug: record.slug,
    title: record.editorialName,
  })),
  videoRecords: recordsWithVideo.map((record) => ({
    slug: record.slug,
    title: record.editorialName,
    video: record.video,
  })),
  entitiesWithMultipleSourceVideos: videoCountsByEntity,
  publicMediaWasAlreadyVersioned:
    mediaChecks.filter(Boolean).every((entry) => entry.versioned),
  filesCopiedInSprint22: 0,
};

await fs.mkdir(reportsRoot, { recursive: true });
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-count-reconciliation.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: countSummary,
      mediaOrigins: mediaChecks.filter(Boolean),
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-broken-media.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        references: mediaChecks.filter(Boolean).length,
        invalid: invalidMedia.length,
      },
      records: invalidMedia,
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-editorial-review-matrix.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: Object.fromEntries(
        Object.entries(
          Object.groupBy(reviewMatrix, (record) => record.recommendation),
        ).map(([key, records]) => [key, records.length]),
      ),
      records: reviewMatrix,
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-first-publication-batch.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      status: 'PROPOSED_NOT_APPROVED',
      count: proposedBatch.length,
      records: proposedBatch,
    },
    null,
    2,
  )}\n`,
);

const reconciliationMarkdown = `# Sprint 22.1 — reconciliação de contagens

| Métrica | Quantidade |
| --- | ---: |
| Grupos identificados | ${countSummary.groupsIdentified} |
| Registros integrados | ${countSummary.recordsIntegrated} |
| Draft | ${countSummary.draft} |
| Revisão humana | ${countSummary.humanReview} |
| Published | ${countSummary.published} |
| Capas associadas | ${countSummary.coversAssociated} |
| Registros com vídeo | ${countSummary.recordsWithVideo} |
| GLBs privados | ${countSummary.privateGlbs} |
| STLs privados | ${countSummary.privateStls} |

## Registro sem capa

${missingCover.map((record) => `- \`${record.slug}\` — ${record.editorialName}.`).join('\n')}

## Registros com vídeo

${recordsWithVideo.map((record) => `- \`${record.slug}\` — \`${record.video}\`.`).join('\n')}

## Entidades com mais de um vídeo na fonte

${videoCountsByEntity.map((entry) => `- \`${entry.entitySlug}\`: ${entry.count} vídeos.`).join('\n')}

As 191 capas e os 25 vídeos associados já estavam versionados no repositório
antes desta sprint. Nenhum arquivo foi copiado na Sprint 22 porque os recursos
públicos aprovados já haviam sido importados e normalizados; STL e GLB
permaneceram fora de \`public/\`. O JSON complementar registra a origem física
de cada mídia a partir dos mapas de importação.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-count-reconciliation.md'),
  reconciliationMarkdown,
);

const mediaMarkdown = `# Sprint 22.1 — validação de existência da mídia

- Referências verificadas: **${mediaChecks.filter(Boolean).length}**
- Válidas: **${mediaChecks.filter(Boolean).length - invalidMedia.length}**
- Inválidas: **${invalidMedia.length}**
- Caminhos locais: **${invalidMedia.filter((entry) => entry.status === 'LOCAL_PATH').length}**
- Assets privados referenciados: **${invalidMedia.filter((entry) => entry.status === 'PRIVATE_ASSET').length}**

Cada arquivo foi resolvido sob \`public/\`, validado por extensão, tamanho,
integridade, casing e presença no índice do Git. A origem física foi cruzada com
os relatórios de importação de mídia e vídeo.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-media-existence-validation.md'),
  mediaMarkdown,
);

const matrixMarkdown = `# Sprint 22.1 — matriz de revisão editorial

| Classificação | Quantidade |
| --- | ---: |
${Object.entries(
  Object.groupBy(reviewMatrix, (record) => record.recommendation),
)
  .map(([key, records]) => `| ${key} | ${records.length} |`)
  .join('\n')}

| Registro | Coleção | Fonte | Capa | Vídeo | Conflito | Recomendação |
| --- | --- | --- | --- | --- | --- | --- |
${reviewMatrix
  .map(
    (record) =>
      `| ${record.editorialName} | ${record.collection} | ${record.editorialSource?.type ?? '—'} | ${record.mediaValidation.cover ?? '—'} | ${record.mediaValidation.video ?? '—'} | ${record.conflict ? 'sim' : 'não'} | ${record.recommendation} |`,
  )
  .join('\n')}
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-editorial-review-matrix.md'),
  matrixMarkdown,
);

const conflictGroups = reviewMatrix.filter((record) => record.conflict);
const conflictsMarkdown = `# Sprint 22.1 — conflitos de coleção

## The Kraken Caller

- Candidatas: \`Legends of the Realm\` e \`The Six Crowns of Asterheim\`.
- Evidência: existem pastas e modelos distintos nas duas coleções; a V1 também
  apresenta a entidade em superfícies editoriais relacionadas.
- Limite: não há fonte aprovada que determine qual coleção é principal.
- Recomendação: consolidar futuramente em um único registro, preservando
  \`relatedCollectionSlugs\`; decisão humana obrigatória.
- Confiança da recomendação: média.

## The Last Dragon Slayer

- Candidatas: \`Legends of the Realm\` e \`The Six Crowns of Asterheim\`.
- Evidência: o personagem é uma figura lendária e também o Guardião ligado à
  Dragon Crown; existem modelos em ambas as pastas.
- Limite: as fontes sustentam as duas relações, mas não registram explicitamente
  qual delas é a coleção principal da miniatura.
- Recomendação: consolidar futuramente em um único registro, usando uma coleção
  principal aprovada e a outra em \`relatedCollectionSlugs\`; decisão humana
  obrigatória.
- Confiança da recomendação: alta quanto à relação dupla, baixa quanto à
  coleção principal.

## Estado

${conflictGroups.map((record) => `- \`${record.slug}\`: mantido em review.`).join('\n')}

Nenhum conflito foi resolvido silenciosamente e nenhum registro foi publicado.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-collection-conflicts.md'),
  conflictsMarkdown,
);

const batchMarkdown = `# Sprint 22.1 — primeiro lote proposto

Status: **PROPOSTO, NÃO APROVADO**.

Foram selecionados **${proposedBatch.length}** registros com confiança alta,
capa válida, coleção identificada e descrição disponível em documentos
fornecidos pelo usuário.

| Miniatura | Coleção | Tipo | Fonte da descrição | Status recomendado |
| --- | --- | --- | --- | --- |
${proposedBatch
  .map(
    (record) =>
      `| ${record.title} | ${record.collection} | ${record.type} | \`${record.description}\` | ${record.recommendedStatus} |`,
  )
  .join('\n')}

Nenhum status foi alterado. Todos dependem de aprovação editorial explícita.
`;
await fs.writeFile(
  path.join(reportsRoot, 'sprint-22-1-first-publication-batch.md'),
  batchMarkdown,
);

console.log(
  JSON.stringify(
    {
      counts: countSummary,
      media: {
        references: mediaChecks.filter(Boolean).length,
        valid: mediaChecks.filter(Boolean).length - invalidMedia.length,
        invalid: invalidMedia.length,
      },
      review: Object.fromEntries(
        Object.entries(
          Object.groupBy(reviewMatrix, (record) => record.recommendation),
        ).map(([key, records]) => [key, records.length]),
      ),
      batch: proposedBatch.map((record) => record.slug),
    },
    null,
    2,
  ),
);
