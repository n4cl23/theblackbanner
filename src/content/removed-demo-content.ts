export const removedDemoSlugs = new Set([
  'kingdom-ashen-reach',
  'kingdom-iron-march',
  'kingdom-veiled-crown',
  'character-far-watcher',
  'character-banner-bearer',
  'creature-bone-below',
  'creature-fog-stalker',
  'collection-vanguard',
  'far-watcher-32mm',
  'banner-bearer-75mm',
  'fog-stalker-54mm',
]);

export function isRemovedDemoSlug(slug: string) {
  return removedDemoSlugs.has(slug);
}
