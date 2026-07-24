import type { Metadata } from 'next';
import { CanonicalArchive } from '@/components/shared/canonical-archive';
import { getCanonicalContentByType } from '@/content/canonical-content';

export const metadata: Metadata = {
  title: 'Personagens de Asterheim',
  description: 'Arquivo editorial de personagens de Asterheim.',
  alternates: { canonical: '/personagens' },
};

export default function CharactersPage() {
  const characters = getCanonicalContentByType('character');
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
          Aqueles que caminham sob o estandarte
        </h1>
        <p className="text-parchment-200/60 mt-7 max-w-2xl text-lg">
          Registros canônicos são publicados somente após validação editorial.
        </p>
      </header>
      <CanonicalArchive
        records={characters}
        emptyMessage="Os personagens da V1 aguardam revisão humana e não foram publicados como cânone."
      />
    </main>
  );
}
