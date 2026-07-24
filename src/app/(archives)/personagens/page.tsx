import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import { CharacterExplorer } from '@/features/characters/components/character-explorer';
import { getCharacterPresentation } from '@/features/characters/data/character-presentation.mock';

export const metadata: Metadata = {
  title: 'Personagens de Asterheim',
  description: 'Arquivo editorial provisório de personagens de Asterheim.',
  alternates: { canonical: '/personagens' },
};
export default async function CharactersPage() {
  const repository = await getContentRepository();
  const [characters, kingdoms, factions] = await Promise.all([
    repository.getCharacters(),
    repository.getKingdoms(),
    repository.getFactions(),
  ]);
  const items = characters.flatMap((character) => {
    const presentation = getCharacterPresentation(character.slug);
    return presentation ? [{ ...character, ...presentation }] : [];
  });
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
      <header className="max-w-5xl py-12">
        <p className="text-aged-gold-500 text-xs tracking-[.3em] uppercase">
          Arquivo de identidades · conteúdo mock
        </p>
        <h1 className="font-display mt-4 text-[clamp(3.5rem,9vw,8rem)] leading-[.88] uppercase">
          Aqueles que caminham sob o estandarte
        </h1>
        <p className="text-parchment-200/60 mt-7 max-w-2xl text-lg">
          Busque, filtre e percorra registros provisórios organizados sem
          transformar Asterheim em um dashboard.
        </p>
      </header>
      <Suspense fallback={<p>Preparando o arquivo…</p>}>
        <CharacterExplorer
          characters={items}
          kingdoms={kingdoms.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
          factions={factions.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
        />
      </Suspense>
    </main>
  );
}
