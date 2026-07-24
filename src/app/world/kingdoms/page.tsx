import type { Metadata } from 'next';
import Link from 'next/link';
import { CanonicalArchive } from '@/components/shared/canonical-archive';
import { getCanonicalContentByType } from '@/content/canonical-content';

export const metadata: Metadata = {
  title: 'Reinos de Asterheim',
  description: 'Arquivo editorial dos reinos de Asterheim.',
  alternates: { canonical: '/world/kingdoms' },
};

export default function KingdomsPage() {
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
      <header className="max-w-5xl pb-14">
        <nav aria-label="Breadcrumb" className="text-xs uppercase">
          <Link href="/world">Mundo</Link> / Reinos
        </nav>
        <p className="text-aged-gold-500 mt-14 text-xs tracking-[.3em] uppercase">
          Cartografia política
        </p>
        <h1 className="font-display mt-4 text-[clamp(3rem,8vw,7rem)] uppercase">
          Reinos de Asterheim
        </h1>
      </header>
      <CanonicalArchive
        records={getCanonicalContentByType('kingdom')}
        emptyMessage="Os reinos aguardam revisão humana antes da publicação."
      />
    </main>
  );
}
