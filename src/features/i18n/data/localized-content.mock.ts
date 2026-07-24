import { localizedDocumentSchema } from '@/features/i18n/domain/localized-content-schema';

export const localizedDocuments = localizedDocumentSchema.array().parse([
  {
    id: 'localized-roads-article',
    originalLocale: 'pt-br',
    originalId: 'article-roads-and-ruins',
    previewableLocales: ['pt-br', 'en', 'es'],
    variants: [
      {
        locale: 'pt-br',
        status: 'published',
        slug: 'estradas-e-ruinas',
        title: 'Estradas e ruínas',
        body: [
          'As estradas de Asterheim não conectam apenas territórios. Algumas preservam juramentos, batalhas e nomes apagados dos mapas.',
        ],
        altText: 'Estrada em ruínas atravessando as cinzas de Asterheim',
        translationOf: null,
        incomplete: false,
      },
      {
        locale: 'en',
        status: 'draft',
        slug: 'roads-and-ruins',
        title: 'Roads and Ruins',
        body: [
          'The roads of Asterheim connect more than territories. Some preserve oaths, battles, and names erased from every map.',
        ],
        altText: 'A ruined road crossing the ashes of Asterheim',
        translationOf: 'article-roads-and-ruins',
        incomplete: true,
      },
      {
        locale: 'es',
        status: 'unavailable',
        slug: 'caminos-y-ruinas',
        title: null,
        body: [],
        altText: null,
        translationOf: 'article-roads-and-ruins',
        incomplete: true,
      },
    ],
  },
  {
    id: 'localized-black-road',
    originalLocale: 'pt-br',
    originalId: 'chronicle-black-road',
    previewableLocales: ['pt-br', 'en', 'es'],
    variants: [
      {
        locale: 'pt-br',
        status: 'published',
        slug: 'a-estrada-negra',
        title: 'A Estrada Negra',
        body: [
          'A estrada não aparecia nos mapas, mas deixava fuligem nas botas daqueles que sonhavam com ela.',
        ],
        altText: 'Viajantes diante de uma estrada negra entre a névoa',
        translationOf: null,
        incomplete: false,
      },
      {
        locale: 'en',
        status: 'review',
        slug: 'the-black-road',
        title: 'The Black Road',
        body: [
          'The road appeared on no map, yet left soot on the boots of those who dreamed of it.',
        ],
        altText: 'Travelers facing a black road through the mist',
        translationOf: 'chronicle-black-road',
        incomplete: true,
      },
      {
        locale: 'es',
        status: 'draft',
        slug: 'el-camino-negro',
        title: 'El Camino Negro',
        body: [
          'El camino no aparecía en los mapas, pero dejaba ceniza en las botas de quienes soñaban con él.',
        ],
        altText: 'Viajeros ante un camino negro entre la niebla',
        translationOf: 'chronicle-black-road',
        incomplete: true,
      },
    ],
  },
]);
export function getLocalizedVariant(
  documentId: string,
  locale: 'pt-br' | 'en' | 'es',
) {
  return (
    localizedDocuments
      .find((item) => item.id === documentId)
      ?.variants.find((item) => item.locale === locale) ?? null
  );
}
