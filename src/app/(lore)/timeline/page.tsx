import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  TimelineExplorer,
  type TimelineRecord,
} from '@/features/lore/components/timeline-explorer';
import { getTimelineData } from '@/features/lore/data/lore-repository';
export const metadata: Metadata = {
  title: 'Timeline de Asterheim',
  description: 'Eras, conflitos e eventos provisórios conectados de Asterheim.',
  alternates: { canonical: '/timeline' },
};
export default async function TimelinePage() {
  const data = await getTimelineData();
  const title = new Map<string, string>(
    [
      ...data.kingdoms,
      ...data.characters,
      ...data.creatures,
      ...data.factions,
    ].map((item) => [item.id, item.title]),
  );
  const records: TimelineRecord[] = data.events.map(
    ({ event, presentation }) => ({
      id: event.id,
      title: event.title,
      excerpt: event.excerpt,
      dateLabel: event.dateLabel,
      era: presentation.era,
      year: presentation.year,
      impact: presentation.impact,
      conflict: presentation.conflict,
      kingdoms: presentation.kingdomIds.map((id) => title.get(id) ?? id),
      characters: presentation.characterIds.map((id) => title.get(id) ?? id),
      creatures: presentation.creatureIds.map((id) => title.get(id) ?? id),
      factions: presentation.factionIds.map((id) => title.get(id) ?? id),
      related: presentation.relatedEventIds.flatMap((id) => {
        const related = data.events.find((entry) => entry.event.id === id);
        return related ? [{ id, title: related.event.title }] : [];
      }),
    }),
  );
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16">
      <header className="max-w-5xl py-14">
        <p className="text-aged-gold-500 text-xs uppercase">
          Arquivo temporal · cronologia de Asterheim
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          As eras deixam cicatrizes
        </h1>
        <p className="text-parchment-200/60 mt-7 max-w-2xl text-lg">
          Uma cronologia navegável entre reinos, testemunhas, criaturas e
          conflitos.
        </p>
      </header>
      <Suspense fallback={<p>Ordenando os séculos…</p>}>
        <TimelineExplorer records={records} />
      </Suspense>
    </main>
  );
}
