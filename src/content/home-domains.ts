export const homeDomainArtwork = {
  'frost-kingdom': {
    image:
      '/media/asterheim/entities/brynn-icefang-rastreadora-do-gelo/banner-57f13b75.webp',
    position: 'object-[66%_center] sm:object-[64%_center]',
    overlay: 'bg-sky-800/10',
  },
  stormreach: {
    image:
      '/media/asterheim/entities/darian-stormhook-lanceiro-das-tempestades/banner-5388dbdc.webp',
    position: 'object-[64%_center]',
    overlay: 'bg-slate-700/12',
  },
  ironhold: {
    image:
      '/media/asterheim/entities/king-aldric-keeper-of-the-iron-crown/fb83d5a7-ad19-491e-8c2b-f3b17576c597-f3e32acb.webp',
    position: 'object-[56%_center]',
    overlay: 'bg-orange-950/12',
  },
  'elder-forest': {
    image:
      '/media/asterheim/entities/sylva-mossarrow-arqueira-da-floresta/banner-a8cb0d8c.webp',
    position: 'object-[58%_center]',
    overlay: 'bg-lime-950/12',
  },
  'kingdom-of-the-abyss': {
    image:
      '/media/asterheim/entities/varek-deepharpoon-cacador-abissal/banner-8f11e113.webp',
    position: 'object-[54%_center]',
    overlay: 'bg-blue-950/16',
  },
  'scorched-wastes': {
    image:
      '/media/asterheim/entities/roderic-ashbane-cacador-das-cinzas/banner-614dbbe4.webp',
    position: 'object-[62%_center]',
    overlay: 'bg-amber-950/14',
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
