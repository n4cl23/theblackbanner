import type { Metadata } from 'next';
import Link from 'next/link';
import { NarrativeRelations } from '@/features/lore/components/narrative-relations';
import { UnifiedSearch } from '@/features/lore/components/unified-search';
import { getLoreIndexData } from '@/features/lore/data/lore-repository';
export const metadata: Metadata = {
  title: 'Lore conectado',
  description:
    'Índice editorial e relações narrativas provisórias de Asterheim.',
  alternates: { canonical: '/lore' },
};
export default async function LorePage() {
  const { articles, searchRecords, relations } = await getLoreIndexData();
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16">
      <header className="max-w-5xl py-14">
        <p className="text-aged-gold-500 text-xs uppercase">
          Códice conectado · arquivo de lore
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          Nenhuma história existe sozinha
        </h1>
      </header>
      <UnifiedSearch records={searchRecords} />
      <section className="py-20">
        <h2 className="font-display text-5xl uppercase">Artigos de lore</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              className="group min-h-72 border border-stone-600/30 p-8"
              href={`/lore/${article.slug}`}
              key={article.id}
            >
              <p className="text-aged-gold-500 text-xs uppercase">
                Arquivo {String(article.order + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display group-hover:text-aged-gold-500 mt-5 text-4xl uppercase">
                {article.title}
              </h3>
              <p className="text-parchment-200/60 mt-5">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="py-20">
        <NarrativeRelations relations={relations} />
      </div>
    </main>
  );
}
