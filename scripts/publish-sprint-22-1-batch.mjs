import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(
  root,
  'src/features/collections/data/real-miniatures.generated.json',
);
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));

const approvedAt = '2026-07-24T00:00:00.000-03:00';
const publicationBatch = 'sprint-22-1-batch-01';
const approvalSource = 'explicit-user-approval:sprint-22.1';

const approved = new Map([
  [
    'black-fang-mercenary',
    {
      description:
        'Mercenário veterano conhecido como Black Fang, retratado enquanto inspeciona sua espada ao lado de uma mesa de troféus. A miniatura combina armadura detalhada, manto pesado de pele e base cênica.',
      source:
        'The Black Banner Company\\Black Fang Mercenary\\Black_Fang_Mercenary_Print_Guide.pdf',
      sourceLanguage: 'en',
    },
  ],
  [
    'durgan-blacksmith',
    {
      description:
        'Durgan é um lendário ferreiro minotauro que forja armas dignas de reis e caçadores de dragões. A miniatura apresenta o mestre artesão junto à bigorna, cercado pelos detalhes de sua forja.',
      source:
        'The Black Banner Company\\Durgan — Blacksmith\\Durgan_Blacksmith_Print_Guide.pdf',
      sourceLanguage: 'en',
    },
  ],
  [
    'iron-bull',
    {
      description:
        'Uma figura de fantasia concebida para colecionadores, pintores e mesas de RPG, com superfícies detalhadas e uma presença monumental preservada na escultura.',
      source: 'The Black Banner Company\\Iron Bull\\Iron_Bull_Print_Guide.pdf',
      sourceLanguage: 'en',
    },
  ],
  [
    'iron-wyrm',
    {
      description:
        'Predador de emboscada e escavador das minas profundas de Ironhold. Sem asas, o Iron Wyrm atravessa rocha, minério e antigas galerias com mandíbulas de esmagamento e membros anteriores extremamente fortes.',
      source: 'Artbook\\The_Black_Banner_Ironhold_07_Iron_Wyrm.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'forge-sentinel',
    {
      description:
        'Guardião ancestral das Grandes Forjas, criado para proteger complexos industriais antigos e patrulhar corredores, pontes e câmaras de fundição. Sua silhueta transmite autoridade e resistência.',
      source: 'Artbook\\The_Black_Banner_Ironhold_08_Forge_Sentinel.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'molten-guardian',
    {
      description:
        'Colosso ancestral alimentado pelo núcleo magmático de Ironhold. Permanece adormecido por séculos e desperta apenas quando as antigas forjas ou o coração da montanha são ameaçados.',
      source: 'Artbook\\The_Black_Banner_Ironhold_09_Molten_Guardian (1).pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'crystal-ram',
    {
      description:
        'Herbívoro territorial das montanhas de Ironhold que percorre penhascos e depósitos minerais. Seus chifres cristalinos servem tanto às disputas territoriais quanto à defesa contra predadores.',
      source: 'Artbook\\The_Black_Banner_Ironhold_10_Crystal_Ram.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'iron-boar',
    {
      description:
        'Onívoro territorial extremamente agressivo que revolve o solo em busca de raízes minerais, fungos subterrâneos e pequenos animais. Suas investidas remodelam trilhas e antigas galerias.',
      source: 'Artbook\\The_Black_Banner_Ironhold_11_Iron_Boar.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'ash-wolf',
    {
      description:
        'Predador social de Ironhold que caça em matilhas altamente organizadas, usando o terreno vulcânico e antigas galerias para cercar suas presas.',
      source: 'Artbook\\The_Black_Banner_Ironhold_12_Ash_Wolf.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'rock-burrower',
    {
      description:
        'Predador subterrâneo especializado em emboscadas. Ocupa galerias estreitas inacessíveis aos gigantes e controla a fauna menor ao caçar pequenos animais, parasitas minerais e filhotes desprotegidos.',
      source: 'Artbook\\The_Black_Banner_Ironhold_13_Rock_Burrower.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'tunnel-reaper',
    {
      description:
        'Superpredador das galerias profundas de Ironhold. Permanece imóvel nas paredes e tetos das minas até que a presa entre em alcance, comportamento associado ao desaparecimento de expedições inteiras.',
      source: 'Artbook\\The_Black_Banner_Ironhold_14_Tunnel_Reaper.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'ore-leech',
    {
      description:
        'Parasita mineral que se alimenta de depósitos ricos em ferro e cristais energizados. Também se fixa em criaturas feridas para absorver minerais presentes em seu sangue e carapaça.',
      source: 'Artbook\\The_Black_Banner_Ironhold_15_Ore_Leech.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'ember-tick',
    {
      description:
        'Pequeno parasita geotérmico que vive em colônias próximas às fissuras vulcânicas de Ironhold. Enxames podem enfraquecer grandes predadores ao absorver calor e minerais.',
      source: 'Artbook\\The_Black_Banner_Ironhold_16_Ember_Tick.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
  [
    'obsidian-colossus',
    {
      description:
        'Titã primordial que representa a vontade ancestral das montanhas vulcânicas de Ironhold. Seu despertar anuncia mudanças geológicas capazes de remodelar regiões inteiras.',
      source: 'Artbook\\The_Black_Banner_Ironhold_17_Obsidian_Colossus.pdf',
      sourceLanguage: 'pt-br',
    },
  ],
]);

const conflicts = new Set([
  'the-kraken-caller-legends-of-the-realm',
  'the-kraken-caller-the-six-crowns-of-asterheim',
  'the-last-dragon-slayer-legends-of-the-realm',
  'the-last-dragon-slayer-the-six-crowns-of-asterheim',
]);

for (const record of catalog.miniatures) {
  const approval = approved.get(record.slug);
  record.status = approval
    ? 'published'
    : conflicts.has(record.slug)
      ? 'review'
      : 'draft';
  record.approvedAt = approval ? approvedAt : null;
  record.approvalSource = approval ? approvalSource : null;
  record.publicationBatch = approval ? publicationBatch : null;
  record.editorialSource = approval
    ? {
        type: 'user-provided-final-source',
        reference: approval.source,
        sourceLanguage: approval.sourceLanguage,
      }
    : null;

  if (approval) {
    record.description = approval.description;
    record.editorialPending = record.editorialPending.filter(
      (item) => item !== 'aprovação editorial',
    );
  }
}

const counts = Object.fromEntries(
  Object.entries(
    Object.groupBy(catalog.miniatures, (record) => record.status),
  ).map(([status, records]) => [status, records.length]),
);
if (
  counts.published !== 14 ||
  counts.review !== 4 ||
  counts.draft !== 174 ||
  catalog.miniatures.length !== 192
) {
  throw new Error(`Unexpected publication counts: ${JSON.stringify(counts)}`);
}
if (
  catalog.miniatures.find((record) => record.slug === 'demon-fogo')?.status !==
  'draft'
) {
  throw new Error('demon-fogo must remain draft');
}

catalog.generatedAt = new Date().toISOString();
catalog.summary = {
  ...catalog.summary,
  records: catalog.miniatures.length,
  draft: counts.draft,
  review: counts.review,
  published: counts.published,
  publicationBatch,
  approvedAt,
};

await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(JSON.stringify({ counts, publicationBatch, approvedAt }, null, 2));
