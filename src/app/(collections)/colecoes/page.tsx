import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import { CollectionExplorer } from '@/features/collections/components/collection-explorer';
import {
  collectionCategories,
  getCollectionPresentation,
} from '@/features/collections/data/collections.mock';
export const metadata: Metadata = {
  title: 'Coleções e miniaturas',
  description:
    'Coleções editoriais provisórias e estudos de miniaturas de Asterheim.',
  alternates: { canonical: '/colecoes' },
};
export default async function CollectionsPage() {
  const collections = await (await getContentRepository()).getCollections();
  const records = collections.flatMap((collection) => {
    const presentation = getCollectionPresentation(collection.slug);
    return presentation
      ? [
          {
            id: collection.id,
            slug: collection.slug,
            title: collection.title,
            category: presentation.category,
            banner: presentation.banner,
            identity: presentation.identity,
            itemCount: collection.itemRefs.length,
          },
        ]
      : [];
  });
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
      <header className="max-w-5xl py-14">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Arquivo de formas · conteúdo mock
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          Coleções moldadas para a mesa
        </h1>
        <p className="text-parchment-200/60 mt-8 max-w-2xl text-lg">
          Estudos editoriais e técnicos que preparam Asterheim para impressão 3D
          — sem venda ou distribuição nesta etapa.
        </p>
      </header>
      <Suspense fallback={<p>Organizando coleções…</p>}>
        <CollectionExplorer
          categories={collectionCategories}
          records={records}
        />
      </Suspense>
    </main>
  );
}
