export const homeDomainArtwork = {
  'frost-kingdom': {
    fit: 'contain',
    image: '/images/kingdoms/key-arts/frost-kingdom.webp',
    objectPosition: 'center 28%',
  },
  stormreach: {
    fit: 'cover',
    image: '/images/kingdoms/key-arts/stormreach.webp',
    objectPosition: 'center 45%',
  },
  ironhold: {
    fit: 'cover',
    image: '/images/kingdoms/key-arts/ironhold.webp',
    objectPosition: 'center 48%',
  },
  'elder-forest': {
    fit: 'cover',
    image: '/images/kingdoms/key-arts/elder-forest.webp',
    objectPosition: 'center 50%',
  },
  'kingdom-of-the-abyss': {
    fit: 'cover',
    image: '/images/kingdoms/key-arts/abyss.webp',
    objectPosition: 'center 45%',
  },
  'scorched-wastes': {
    fit: 'cover',
    image: '/images/kingdoms/key-arts/scorched-wastes.webp',
    objectPosition: 'center 48%',
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
