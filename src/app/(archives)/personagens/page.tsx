import type { Metadata } from 'next';
import { Suspense } from 'react';
import { approvedCharacters } from '@/content/heroic-entities';
import { HeroicEntityExplorer } from '@/features/characters/components/heroic-entity-explorer';

export const metadata: Metadata = {
  title: 'Personagens de Asterheim',
  description:
    'Arquivo editorial de personagens validados individualmente em Asterheim.',
  alternates: { canonical: '/personagens' },
};

export default function CharactersPage() {
  return (
    <main
      className="entity-archive mx-auto max-w-[90rem] px-5 py-16 sm:px-8"
      id="main-content"
    >
      <header className="cinematic-page-header max-w-5xl py-12">
        <p className="text-aged-gold-500 text-xs tracking-[.3em] uppercase">
          Arquivo de identidades
        </p>
        <h1 className="font-display mt-4 text-[clamp(3.5rem,9vw,8rem)] leading-[.88] uppercase">
          Personagens de Asterheim
        </h1>
        <p className="text-parchment-200/60 mt-7 max-w-2xl text-lg">
          Somente registros aprovados individualmente podem atravessar este
          arquivo.
        </p>
      </header>
      <aside className="border-aged-gold-500/30 mb-8 border-l-2 px-6 py-5">
        <h2 className="font-display text-2xl uppercase">
          Revisão editorial necessária
        </h2>
        <p className="text-parchment-200/65 mt-3 max-w-3xl">
          Os 42 registros identificados na V1 ainda não possuem aprovação
          individual suficiente para publicação.
        </p>
      </aside>
      <Suspense fallback={<div className="min-h-40 border-y border-stone-700" />}>
        <HeroicEntityExplorer records={approvedCharacters} />
      </Suspense>
    </main>
  );
}
