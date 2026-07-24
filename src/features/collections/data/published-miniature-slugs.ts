export const publishedMiniatureSlugs = [
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
] as const;

export const publishedMiniatureSlugSet = new Set<string>(
  publishedMiniatureSlugs,
);
