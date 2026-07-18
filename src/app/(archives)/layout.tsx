import type { ReactNode } from 'react';
import { CharacterHeader } from '@/features/characters/components/character-header';
export default function ArchivesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CharacterHeader />
      {children}
    </>
  );
}
