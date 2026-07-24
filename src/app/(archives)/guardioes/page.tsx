import type { Metadata } from 'next';
import { CanonicalArchive } from '@/components/shared/canonical-archive';
import { getCanonicalContentByType } from '@/content/canonical-content';

export const metadata: Metadata = {
  title: 'Guardiões de Asterheim',
  description: 'Arquivo monumental dos Guardiões.',
  alternates: { canonical: '/guardioes' },
};

export default function GuardiansPage() {
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
      <header className="max-w-5xl py-16">
        <p className="text-aged-gold-500 text-xs tracking-[.4em] uppercase">
          Ordem rara
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,12vw,9rem)] uppercase">
          Guardiões
        </h1>
      </header>
      <CanonicalArchive
        records={getCanonicalContentByType('guardian')}
        emptyMessage="Os Guardiões aguardam revisão humana antes da publicação."
      />
    </main>
  );
}
