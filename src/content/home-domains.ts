export const homeDomainArtwork = {
  'frost-kingdom': {
    image: '/images/kingdoms/key-arts/frost-kingdom.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[54%_center]',
    atmosphere: 'frost',
  },
  stormreach: {
    image: '/images/kingdoms/key-arts/stormreach.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[48%_center]',
    atmosphere: 'storm',
  },
  ironhold: {
    image: '/images/kingdoms/key-arts/ironhold.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[52%_center]',
    atmosphere: 'iron',
  },
  'elder-forest': {
    image: '/images/kingdoms/key-arts/elder-forest.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[50%_center]',
    atmosphere: 'forest',
  },
  'kingdom-of-the-abyss': {
    image: '/images/kingdoms/key-arts/abyss.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[50%_center]',
    atmosphere: 'abyss',
  },
  'scorched-wastes': {
    image: '/images/kingdoms/key-arts/scorched-wastes.webp',
    position: 'lg:object-[center_bottom]',
    mobilePosition: 'object-[48%_center]',
    atmosphere: 'scorched',
  },
} as const;

export const homeDomainOrder = [
  'frost-kingdom',
  'stormreach',
  'ironhold',
  'elder-forest',
  'kingdom-of-the-abyss',
  'scorched-wastes',
] as const;
