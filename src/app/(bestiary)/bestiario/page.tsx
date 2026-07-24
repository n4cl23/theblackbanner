import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import { BestiaryExplorer } from '@/features/bestiary/components/bestiary-explorer';
import { getCreaturePresentation } from '@/features/bestiary/data/bestiary-presentation.mock';
export const metadata: Metadata = {
  title: 'Bestiário de Asterheim',
  description: 'Códice vivo provisório das criaturas de Asterheim.',
  alternates: { canonical: '/bestiario' },
};
export default async function BestiaryPage() {
  const repository = await getContentRepository();
  const [creatures, kingdoms, regions] = await Promise.all([
    repository.getCreatures(),
    repository.getKingdoms(),
    repository.getRegions(),
  ]);
  const records = creatures.flatMap((creature) => {
    const presentation = getCreaturePresentation(creature.slug);
    return presentation
      ? [
          {
            ...creature,
            ...presentation,
            kingdomIds: creature.kingdomBestiaryIds,
            habitatIds: creature.regionIds,
            image:
              presentation.evidence[0]?.image ??
              '/images/home/bestiary-ruins.webp',
          },
        ]
      : [];
  });
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
      <header className="max-w-5xl py-12">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Codex Bestiarum · registros mock
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,9rem)] leading-[.84] uppercase">
          Aquilo que observa de volta
        </h1>
        <p className="text-parchment-200/60 mt-8 max-w-2xl text-lg">
          Um códice de rastros, relatos e classificações incompletas — nunca um
          catálogo de mercadorias.
        </p>
      </header>
      <Suspense fallback={<p>Reunindo evidências…</p>}>
        <BestiaryExplorer
          records={records}
          kingdoms={kingdoms.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
          habitats={regions.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
        />
      </Suspense>
    </main>
  );
}
