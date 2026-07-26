import catalogSource from './real-miniatures.generated.json';

const publicStatuses = new Set(['published', 'catalogued']);

export const publicMiniatureSlugs = catalogSource.miniatures
  .filter(
    (miniature) =>
      miniature.locale === 'pt-br' &&
      publicStatuses.has(miniature.status) &&
      Boolean(
        miniature.title &&
          miniature.slug &&
          miniature.cover &&
          miniature.collectionSlug,
      ),
  )
  .map(({ slug }) => slug);

export const publicMiniatureSlugSet = new Set(publicMiniatureSlugs);
