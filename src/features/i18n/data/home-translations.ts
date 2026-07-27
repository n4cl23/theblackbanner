import type { Locale } from '@/config/i18n';

export type HomeMessages = {
  heroTagline: string;
  heroCta: string;
  scrollLabel: string;
  domainsEyebrow: string;
  domainsTitle: string;
  domainsBody: string;
  atlasCta: string;
  collectionsEyebrow: string;
  collectionsTitleFirst: string;
  collectionsTitleSecond: string;
  miniatureCount: string;
  collectionCta: string;
  collectionsOutro: string;
  allCollectionsCta: string;
  latestMiniatures: string;
  publicMiniatures: string;
  allMiniaturesCta: string;
  featuredGuardian: string;
  guardianCta: string;
  projectEyebrow: string;
  projectTitle: string;
  projectBody: string;
  projectCta: string;
  printingGuide: string;
  imageFallbackAlt: string;
};

export const homeMessages = {
  'pt-br': {
    heroTagline: 'Seis Coroas. Um mundo à beira da ruína.',
    heroCta: 'Explore Asterheim',
    scrollLabel: 'Explore',
    domainsEyebrow: 'Explore Asterheim',
    domainsTitle: 'Seis domínios. Um destino.',
    domainsBody:
      'Conheça os seis reinos ligados às Coroas e aos Guardiões de Asterheim.',
    atlasCta: 'Explorar o Atlas de Asterheim',
    collectionsEyebrow: 'Coleções em destaque',
    collectionsTitleFirst: 'Exércitos, tavernas',
    collectionsTitleSecond: 'e lendas',
    miniatureCount: 'miniaturas',
    collectionCta: 'Explorar coleção',
    collectionsOutro: 'Outros capítulos aguardam além do estandarte.',
    allCollectionsCta: 'Explorar todas as coleções',
    latestMiniatures: 'Miniaturas recentes',
    publicMiniatures: 'miniaturas públicas',
    allMiniaturesCta: 'Ver todas as miniaturas',
    featuredGuardian: 'Guardião em destaque',
    guardianCta: 'Conhecer Guardião',
    projectEyebrow: 'O Projeto',
    projectTitle: 'Construindo Asterheim',
    projectBody:
      'Da narrativa à miniatura: arte, impressão 3D e os bastidores de uma IP dark fantasy em expansão.',
    projectCta: 'Conhecer o projeto',
    printingGuide: 'Guia de impressão',
    imageFallbackAlt: 'Miniatura de Asterheim pronta para impressão',
  },
  en: {
    heroTagline: 'Six Crowns. A world on the brink of ruin.',
    heroCta: 'Explore Asterheim',
    scrollLabel: 'Explore',
    domainsEyebrow: 'Explore Asterheim',
    domainsTitle: 'Six Domains. One Destiny.',
    domainsBody:
      'Discover the six kingdoms bound to the Crowns and Guardians of Asterheim.',
    atlasCta: 'Explore the Atlas of Asterheim',
    collectionsEyebrow: 'Featured Collections',
    collectionsTitleFirst: 'Armies, Taverns',
    collectionsTitleSecond: 'and Legends',
    miniatureCount: 'miniatures',
    collectionCta: 'Explore Collection',
    collectionsOutro: 'Other chapters await beyond the banner.',
    allCollectionsCta: 'Explore All Collections',
    latestMiniatures: 'Latest Miniatures',
    publicMiniatures: 'public miniatures',
    allMiniaturesCta: 'View all miniatures',
    featuredGuardian: 'Featured Guardian',
    guardianCta: 'Meet the Guardian',
    projectEyebrow: 'The Project',
    projectTitle: 'Building Asterheim',
    projectBody:
      'From narrative to miniature: art, 3D printing, and the making of an expanding dark fantasy IP.',
    projectCta: 'Discover the Project',
    printingGuide: 'Printing Guide',
    imageFallbackAlt: 'Asterheim miniature ready for printing',
  },
  es: {
    heroTagline: 'Seis Coronas. Un mundo al borde de la ruina.',
    heroCta: 'Explora Asterheim',
    scrollLabel: 'Explora',
    domainsEyebrow: 'Explora Asterheim',
    domainsTitle: 'Seis dominios. Un destino.',
    domainsBody:
      'Descubre los seis reinos vinculados a las Coronas y los Guardianes de Asterheim.',
    atlasCta: 'Explorar el Atlas de Asterheim',
    collectionsEyebrow: 'Colecciones destacadas',
    collectionsTitleFirst: 'Ejércitos, tabernas',
    collectionsTitleSecond: 'y leyendas',
    miniatureCount: 'miniaturas',
    collectionCta: 'Explorar colección',
    collectionsOutro: 'Otros capítulos aguardan más allá del estandarte.',
    allCollectionsCta: 'Explorar todas las colecciones',
    latestMiniatures: 'Miniaturas recientes',
    publicMiniatures: 'miniaturas públicas',
    allMiniaturesCta: 'Ver todas las miniaturas',
    featuredGuardian: 'Guardián destacado',
    guardianCta: 'Conocer al Guardián',
    projectEyebrow: 'El Proyecto',
    projectTitle: 'Construyendo Asterheim',
    projectBody:
      'De la narrativa a la miniatura: arte, impresión 3D y el proceso de una IP dark fantasy en expansión.',
    projectCta: 'Conocer el proyecto',
    printingGuide: 'Guía de impresión',
    imageFallbackAlt: 'Miniatura de Asterheim lista para impresión',
  },
} as const satisfies Record<Locale, HomeMessages>;

export function getHomeMessages(locale: Locale): HomeMessages {
  return homeMessages[locale];
}
