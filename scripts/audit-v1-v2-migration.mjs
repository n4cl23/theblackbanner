import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const SOURCES = {
  v1: 'https://theblackbanner.vercel.app',
  v2: 'https://the-black-banner-v2.vercel.app',
};
const DECISIONS = new Set([
  'MIGRAR',
  'MIGRAR_COM_CORREÇÃO',
  'CONSOLIDAR',
  'MANTER_V2',
  'DESCARTAR_MOCK',
  'ARQUIVAR',
  'REVISÃO_HUMANA',
]);

const decode = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
const stripHtml = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim();
const matches = (value, expression) =>
  [...value.matchAll(expression)].map((match) => match[1]).filter(Boolean);
const localeFromPath = (path) =>
  path.startsWith('/en') ? 'en' : path.startsWith('/es') ? 'es' : 'pt-br';
const slugFromPath = (path) => path.split('/').filter(Boolean).at(-1) ?? 'home';

function classify(path) {
  if (/\/(personagens|characters|personajes)\//.test(path)) return 'character';
  if (/\/(guardioes|guardians|guardianes)\//.test(path)) return 'guardian';
  if (/\/(coroas|crowns|coronas)\//.test(path)) return 'crown';
  if (/\/(reinos|realms)\//.test(path)) return 'kingdom';
  if (/\/(colecoes|collections|colecciones)\//.test(path)) return 'collection';
  if (/\/marketplaces\//.test(path)) return 'marketplace';
  if (/\/atlas\/creatures\//.test(path)) return 'creature';
  if (/\/atlas\/[^/]+\/[^/]+/.test(path)) return 'atlas-entry';
  if (/\/(lore)\//.test(path)) return 'lore';
  if (/\/(cronicas|chronicles)\//.test(path)) return 'chronicle';
  if (/\/atlas\/regioes\//.test(path)) return 'region';
  if (/\/atlas\/reinos\//.test(path)) return 'kingdom';
  return 'page';
}

function semanticKey(path) {
  const type = classify(path);
  const slug = slugFromPath(path);
  const pageAliases = {
    'pt-br': 'home',
    en: 'home',
    es: 'home',
    universo: 'universe',
    universe: 'universe',
    colecoes: 'collections',
    collections: 'collections',
    colecciones: 'collections',
    personagens: 'characters',
    characters: 'characters',
    personajes: 'characters',
    guardioes: 'guardians',
    guardians: 'guardians',
    guardianes: 'guardians',
    coroas: 'crowns',
    crowns: 'crowns',
    coronas: 'crowns',
    reinos: 'kingdoms',
    realms: 'kingdoms',
    'art-bible': 'art-bible',
    'impressao-3d': '3d-printing',
    '3d-printing': '3d-printing',
    'impresion-3d': '3d-printing',
    galeria: 'gallery',
    gallery: 'gallery',
    novidades: 'news',
    news: 'news',
    noticias: 'news',
    sobre: 'about',
    about: 'about',
    acerca: 'about',
    contato: 'contact',
    contact: 'contact',
    contacto: 'contact',
  };
  return `${type}:${pageAliases[slug] ?? slug}`;
}

async function sitemap(site) {
  const response = await fetch(`${site}/sitemap.xml`);
  if (!response.ok) throw new Error(`Sitemap ${site}: ${response.status}`);
  const xml = await response.text();
  return matches(xml, /<loc>([^<]+)<\/loc>/g).map(
    (url) => new URL(url).pathname,
  );
}

async function inspectPage(site, path) {
  try {
    const response = await fetch(`${site}${path}`, { redirect: 'follow' });
    const html = await response.text();
    const text = stripHtml(html);
    const title = decode(
      matches(html, /<title[^>]*>([\s\S]*?)<\/title>/gi)[0] ?? '',
    );
    const description = decode(
      matches(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/gi,
      )[0] ??
        matches(
          html,
          /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description/gi,
        )[0] ??
        '',
    );
    const images = [...new Set(matches(html, /<img[^>]+src=["']([^"']+)/gi))];
    const videos = [
      ...new Set(matches(html, /<(?:video|source)[^>]+src=["']([^"']+)/gi)),
    ];
    const links = [...new Set(matches(html, /<a[^>]+href=["']([^"'#]+)/gi))];
    const locale = localeFromPath(path);
    const quality = [];
    if (!response.ok) quality.push(`HTTP_${response.status}`);
    if (!title.trim()) quality.push('METADATA_TITLE_AUSENTE');
    if (!description.trim()) quality.push('METADATA_DESCRIPTION_AUSENTE');
    if (/\bundefined\b|\bnull\b/i.test(text))
      quality.push('VALOR_INVALIDO_VISÍVEL');
    if (
      /Ã(?:£|µ|§|¡|©|­|³|º|ª)|Â(?:·|»|«)|â(?:€|†|œ)|�/.test(text)
    )
      quality.push('ENCODING_SUSPEITO');
    if (
      locale === 'en' &&
      /\b(?:não|reino|personagens|coleções|guardiões|coroas|sobre|contato|saiba)\b|[ãõç]/i.test(
        text,
      )
    )
      quality.push('CONTEÚDO_PT_BR_EM_EN');
    if (
      locale === 'es' &&
      /\b(?:não|você|personagens|coleções|guardiões|coroas|sobre|saiba)\b|(?:ção|ções)\b/i.test(
        text,
      )
    )
      quality.push('CONTEÚDO_PT_BR_EM_ES');
    if (images.length === 0) quality.push('SEM_IMAGEM');
    if (text.length < 180) quality.push('CONTEÚDO_INCOMPLETO');
    return {
      path,
      locale,
      status: response.status,
      finalUrl: response.url,
      title,
      description,
      textLength: text.length,
      textHash: createHash('sha256')
        .update(text.toLocaleLowerCase(locale === 'pt-br' ? 'pt-BR' : locale))
        .digest('hex'),
      images,
      videos,
      internalLinks: links.filter(
        (link) => link.startsWith('/') || link.startsWith(site),
      ),
      externalLinks: links.filter(
        (link) => /^https?:/.test(link) && !link.startsWith(site),
      ),
      quality,
    };
  } catch (error) {
    return {
      path,
      locale: localeFromPath(path),
      status: 0,
      finalUrl: null,
      title: '',
      description: '',
      textLength: 0,
      textHash: null,
      images: [],
      videos: [],
      internalLinks: [],
      externalLinks: [],
      quality: [`FETCH_ERROR:${error.message}`],
    };
  }
}

async function inspectAll(site, paths, concurrency = 12) {
  const results = new Array(paths.length);
  let cursor = 0;
  async function worker() {
    while (cursor < paths.length) {
      const index = cursor++;
      results[index] = await inspectPage(site, paths[index]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function auditInternalTargets(site, routes) {
  const targets = [
    ...new Set(
      routes.flatMap((route) =>
        route.internalLinks.flatMap((link) => {
          try {
            const url = new URL(link, site);
            return url.origin === site ? [url.pathname] : [];
          } catch {
            return [];
          }
        }),
      ),
    ),
  ];
  const inspected = await inspectAll(site, targets, 12);
  return inspected
    .filter((route) => route.status < 200 || route.status >= 400)
    .map(({ path, status, finalUrl }) => ({ path, status, finalUrl }));
}

function groupRoutes(routes) {
  const groups = new Map();
  for (const route of routes) {
    const key = semanticKey(route.path);
    const group = groups.get(key) ?? [];
    group.push(route);
    groups.set(key, group);
  }
  return groups;
}

function migrationDecision(type, v2Match) {
  if (v2Match) return type === 'page' ? 'MANTER_V2' : 'CONSOLIDAR';
  if (type === 'marketplace') return 'ARQUIVAR';
  if (['character', 'guardian', 'crown', 'kingdom', 'creature'].includes(type))
    return 'REVISÃO_HUMANA';
  return 'MIGRAR_COM_CORREÇÃO';
}

function localMocks(source) {
  const ids = [...source.matchAll(/mockCore\('([^']+)'/g)].map(
    (match) => match[1],
  );
  return [...new Set(ids)].map((id) => ({
    entity: id,
    slugV1: null,
    slugV2: id,
    origin: 'V2 local mockContentDataset',
    destination: 'V2 editorial repository',
    decision: 'DESCARTAR_MOCK',
    media: id === 'asset-hero' ? 'self/media asset' : 'provisional or absent',
    relations: 'validated by content-integrity',
    locale: 'pt-br',
    priority: 'BAIXA',
    risk: 'Não remover até existir substituto canônico aprovado.',
  }));
}

const v1Paths = await sitemap(SOURCES.v1);
const v2Paths = await sitemap(SOURCES.v2);
const [
  v1Routes,
  v2Routes,
  mockSource,
  importedEditorial,
  importValidation,
  miniatureInventory,
] = await Promise.all([
  inspectAll(SOURCES.v1, v1Paths),
  inspectAll(SOURCES.v2, v2Paths),
  readFile('src/features/content/data/content.mock.ts', 'utf8'),
  readFile(
    'src/content/asterheim-editorial-import.generated.json',
    'utf8',
  ).then(JSON.parse),
  readFile('reports/asterheim-import-validation.json', 'utf8').then(JSON.parse),
  readFile('reports/miniatures-inventory.json', 'utf8').then(JSON.parse),
]);
const v1Groups = groupRoutes(v1Routes);
const v2Groups = groupRoutes(v2Routes);
const [v1BrokenInternalLinks, v2BrokenInternalLinks] = await Promise.all([
  auditInternalTargets(SOURCES.v1, v1Routes),
  auditInternalTargets(SOURCES.v2, v2Routes),
]);
const matrix = [];

for (const [key, variants] of v1Groups) {
  const representative =
    variants.find((route) => route.locale === 'pt-br') ?? variants[0];
  const type = classify(representative.path);
  const v2Match = v2Groups.get(key);
  const decision = migrationDecision(type, v2Match);
  matrix.push({
    entity: key,
    slugV1: slugFromPath(representative.path),
    slugV2: v2Match ? slugFromPath(v2Match[0].path) : null,
    origin: representative.path,
    destination: v2Match?.[0]?.path ?? `V2 ${type} repository (future)`,
    decision,
    media: `${variants.reduce((sum, item) => sum + item.images.length, 0)} images; ${variants.reduce((sum, item) => sum + item.videos.length, 0)} videos`,
    relations: `${variants.reduce((sum, item) => sum + item.internalLinks.length, 0)} internal links`,
    locale: variants.map((item) => item.locale).sort(),
    priority: [
      'character',
      'guardian',
      'crown',
      'kingdom',
      'collection',
    ].includes(type)
      ? 'ALTA'
      : type === 'page'
        ? 'MÉDIA'
        : 'BAIXA',
    risk:
      decision === 'REVISÃO_HUMANA'
        ? 'Canonicidade e relações exigem aprovação editorial.'
        : variants.flatMap((item) => item.quality).join(', ') || 'BAIXO',
  });
}
matrix.push(...localMocks(mockSource));

if (matrix.some((item) => !DECISIONS.has(item.decision)))
  throw new Error('Invalid migration decision.');

const identicalLocaleGroups = [...v1Groups.entries()]
  .filter(([, routes]) => routes.length > 1)
  .filter(
    ([, routes]) => new Set(routes.map((route) => route.textHash)).size === 1,
  )
  .map(([key]) => key);
const summary = {
  auditedAt: new Date().toISOString(),
  sources: SOURCES,
  v1: {
    sitemapRoutes: v1Routes.length,
    semanticEntities: v1Groups.size,
    statusFailures: v1Routes.filter((route) => route.status !== 200).length,
    encodingProblems: v1Routes.filter((route) =>
      route.quality.includes('ENCODING_SUSPEITO'),
    ).length,
    invalidVisibleValues: v1Routes.filter((route) =>
      route.quality.includes('VALOR_INVALIDO_VISÍVEL'),
    ).length,
    localeProblems: v1Routes.filter((route) =>
      route.quality.some((issue) => issue.startsWith('CONTEÚDO_PT_BR_EM_')),
    ).length,
    missingMetadata: v1Routes.filter((route) =>
      route.quality.some((issue) => issue.startsWith('METADATA_')),
    ).length,
    routesWithoutImages: v1Routes.filter((route) =>
      route.quality.includes('SEM_IMAGEM'),
    ).length,
    brokenInternalLinks: v1BrokenInternalLinks,
    identicalLocaleGroups,
  },
  v2: {
    sitemapRoutes: v2Routes.length,
    semanticEntities: v2Groups.size,
    statusFailures: v2Routes.filter((route) => route.status !== 200).length,
    encodingProblems: v2Routes.filter((route) =>
      route.quality.includes('ENCODING_SUSPEITO'),
    ).length,
    invalidVisibleValues: v2Routes.filter((route) =>
      route.quality.includes('VALOR_INVALIDO_VISÍVEL'),
    ).length,
    localeProblems: v2Routes.filter((route) =>
      route.quality.some((issue) => issue.startsWith('CONTEÚDO_PT_BR_EM_')),
    ).length,
    missingMetadata: v2Routes.filter((route) =>
      route.quality.some((issue) => issue.startsWith('METADATA_')),
    ).length,
    localEditorialRecords:
      localMocks(mockSource).length +
      importedEditorial.length +
      miniatureInventory.summary.total,
    mocks: localMocks(mockSource).length,
    userProvidedReviewRecords: importedEditorial.length,
    publishedCanonicalRecords: 0,
    mediaManifestEntries: importValidation.manifestEntries,
    mediaWithoutAssociationOrPrivate: importValidation.unusedOrPrivate,
    brokenMediaReferences: importValidation.brokenReferences,
    brokenInternalLinks: v2BrokenInternalLinks,
  },
  matrix: {
    records: matrix.length,
    decisions: Object.fromEntries(
      [...DECISIONS].map((decision) => [
        decision,
        matrix.filter((item) => item.decision === decision).length,
      ]),
    ),
  },
};

await writeFile(
  'reports/v1-v2-migration-matrix.json',
  `${JSON.stringify({ summary, routes: { v1: v1Routes, v2: v2Routes }, records: matrix }, null, 2)}\n`,
);

const rows = matrix
  .map(
    (item) =>
      `| ${item.entity} | ${item.slugV1 ?? '—'} | ${item.slugV2 ?? '—'} | ${item.decision} | ${item.locale.join?.(', ') ?? item.locale} | ${item.priority} | ${String(item.risk).replaceAll('|', '\\|')} |`,
  )
  .join('\n');
await writeFile(
  'reports/v1-v2-migration-matrix.md',
  `# Matriz de migração V1 → V2

Auditoria gerada em ${summary.auditedAt}. A V1 é referência editorial e funcional;
a V2 permanece como arquitetura oficial. Nenhum arquivo ou conteúdo foi migrado.

## Resumo

- Rotas V1 verificadas: ${summary.v1.sitemapRoutes}
- Registros semânticos V1: ${summary.v1.semanticEntities}
- Rotas V2 verificadas: ${summary.v2.sitemapRoutes}
- Registros semânticos V2 no sitemap: ${summary.v2.semanticEntities}
- Mocks locais V2 identificados: ${localMocks(mockSource).length}
- Registros editoriais locais V2: ${summary.v2.localEditorialRecords}
- Fontes finais fornecidas pelo usuário em revisão: ${summary.v2.userProvidedReviewRecords}
- Conteúdo local explicitamente publicado como canônico: ${summary.v2.publishedCanonicalRecords}
- Mídias sem associação ou privadas: ${summary.v2.mediaWithoutAssociationOrPrivate}
- Registros na matriz: ${summary.matrix.records}
- Falhas HTTP V1/V2: ${summary.v1.statusFailures}/${summary.v2.statusFailures}
- Home PT-BR inválida na V1: \`/pt-br/pt-br\`

## Decisões

${Object.entries(summary.matrix.decisions)
  .map(([decision, count]) => `- ${decision}: ${count}`)
  .join('\n')}

## Registros

| Entidade | Slug V1 | Slug V2 | Decisão | Locale | Prioridade | Risco |
| --- | --- | --- | --- | --- | --- | --- |
${rows}
`,
);

const gapRows = [
  [
    'Navegação',
    'Ampla, 17 áreas e três locales',
    'Hierarquia autoral consolidada',
    'CONSOLIDAR',
    'Mapear destinos sem importar estrutura V1',
  ],
  [
    'Busca',
    'Não comprovada como busca global no crawl',
    'Busca local tipada',
    'MANTER_V2',
    'Indexar conteúdo aprovado da V1',
  ],
  [
    'Filtros',
    'Presentes em arquivos editoriais específicos',
    'Filtros por domínio e URL',
    'MANTER_V2',
    'Migrar apenas taxonomias aprovadas',
  ],
  [
    'Atlas',
    '6 reinos, pontos e criaturas',
    '3 reinos mockados, mapa SVG acessível',
    'CONSOLIDAR',
    'Migrar conteúdo V1 para contratos V2',
  ],
  [
    'Mapa',
    'Atlas editorial por rotas',
    'SVG com zoom, pan, teclado e lista',
    'MANTER_V2',
    'V1 alimenta dados, não implementação',
  ],
  [
    'Personagens',
    'Arquivo editorial extenso',
    '4 mocks estruturais',
    'MIGRAR_COM_CORREÇÃO',
    'Revisão humana de canonicidade e relações',
  ],
  [
    'Coleções',
    '6 coleções',
    '2 mocks e 4 miniaturas',
    'MIGRAR_COM_CORREÇÃO',
    'Normalizar membros, escala e mídia',
  ],
  [
    'Miniaturas',
    'Misturadas a personagens/coleções',
    'Contrato técnico e STL privado',
    'MANTER_V2',
    'Criar registros sem expor arquivos',
  ],
  [
    'Coroas',
    '6 coroas dedicadas',
    'Modelo local parcial',
    'MIGRAR_COM_CORREÇÃO',
    'Preservar relações reino/Guardião',
  ],
  [
    'Guardiões',
    '6 Guardiões dedicados',
    '1 mock estrutural',
    'MIGRAR_COM_CORREÇÃO',
    'Validar duplicidade personagem/Guardião',
  ],
  [
    'Timeline',
    'Não declarada no sitemap',
    'Timeline conectada',
    'MANTER_V2',
    'Extrair eventos somente de fonte aprovada',
  ],
  [
    'Galeria',
    'Área dedicada',
    'Galerias por domínio',
    'CONSOLIDAR',
    'Deduplicar mídia antes da associação',
  ],
  [
    'Art Bible',
    'Área dedicada e localizada',
    'Ausente como rota pública',
    'MIGRAR_COM_CORREÇÃO',
    'Definir acesso e modelo editorial',
  ],
  [
    'Impressão 3D',
    'Área dedicada',
    'Guia e contratos técnicos',
    'CONSOLIDAR',
    'Normalizar escala e segurança',
  ],
  [
    'Idiomas',
    '507 URLs em três locales',
    'Fallback explícito e 40 URLs',
    'MANTER_V2',
    'Não reutilizar traduções idênticas sem revisão',
  ],
  [
    'CMS',
    'Não identificado publicamente',
    'CMS protegido e versionado',
    'MANTER_V2',
    'Importação futura via adapters',
  ],
  [
    'SEO',
    'Sitemap/hreflang com rota PT duplicada',
    'Canonical, hreflang e sitemap',
    'MANTER_V2',
    'Migrar metadata após revisão',
  ],
  [
    'Marketplaces',
    '5 páginas de destino',
    'Futuro marketplace fora do escopo',
    'ARQUIVAR',
    'Revalidar links e estratégia comercial',
  ],
  [
    'About/Contact',
    'Áreas localizadas',
    'Ausentes na navegação atual',
    'MIGRAR_COM_CORREÇÃO',
    'Revisar dados institucionais',
  ],
];
await writeFile(
  'reports/v1-v2-functional-gap.md',
  `# Gap funcional V1 → V2

| Área | V1 | V2 | Decisão | Ação segura |
| --- | --- | --- | --- | --- |
${gapRows.map((row) => `| ${row.join(' | ')} |`).join('\n')}

## Ordem de migração recomendada

1. estabilizar schemas e regras de publicação;
2. revisar e importar conteúdo base aprovado;
3. resolver relações contra IDs existentes;
4. deduplicar, otimizar e associar mídia;
5. criar redirects e rotas sem substituir a arquitetura V2;
6. adaptar componentes autorais existentes;
7. revisar cada locale sem fallback silencioso;
8. migrar metadata, canonical e hreflang;
9. executar integridade, unitários, acessibilidade e E2E;
10. publicar Preview e obter aprovação humana.

## Gates obrigatórios para a Sprint 20

- decisão editorial para todos os itens \`REVISÃO_HUMANA\`;
- mapa definitivo de slugs e redirects;
- verificação dos direitos e créditos de mídia;
- nenhuma referência quebrada;
- nenhuma tradução incompleta publicada;
- backup e plano de rollback antes de qualquer persistência.
`,
);

console.log(JSON.stringify(summary, null, 2));
