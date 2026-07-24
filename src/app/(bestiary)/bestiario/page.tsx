import type { Metadata } from 'next';
import { CanonicalArchive } from '@/components/shared/canonical-archive';
import { getCanonicalContentByType } from '@/content/canonical-content';

export const metadata: Metadata = {
  title: 'Bestiário de Asterheim',
  description: 'Códice vivo das criaturas de Asterheim.',
  alternates: { canonical: '/bestiario' },
};

export default function BestiaryPage() {
  return (
    <main
      className="entity-archive mx-auto max-w-[90rem] px-5 py-16 sm:px-8"
      id="main-content"
    >
      <header className="cinematic-page-header max-w-5xl py-12">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Codex Bestiarum
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,9rem)] uppercase">
          Aquilo que observa de volta
        </h1>
      </header>
      <CanonicalArchive
        records={getCanonicalContentByType('creature')}
        emptyMessage="As criaturas aguardam revisão humana antes da publicação."
      />
    </main>
  );
}
