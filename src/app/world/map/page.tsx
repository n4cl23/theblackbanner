import type { Metadata } from 'next';
import Link from 'next/link';
import { getContentRepository } from '@/features/content/repository/repository';
import { WorldMap } from '@/features/world/components/world-map';
import { kingdomPresentations } from '@/features/world/data/world-presentation.mock';

export const metadata: Metadata = {
  title: 'Mapa de Asterheim',
  description: 'Mapa SVG interativo e acessível dos reinos de Asterheim.',
  alternates: { canonical: '/world/map' },
};

export default async function MapPage() {
  const kingdoms = await (await getContentRepository()).getKingdoms();
  const mapped = kingdomPresentations.flatMap((presentation) => {
    const kingdom = kingdoms.find((item) => item.slug === presentation.slug);
    return kingdom
      ? [{ ...presentation, title: kingdom.title, sigil: kingdom.sigil }]
      : [];
  });
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-12">
      <nav
        aria-label="Breadcrumb"
        className="text-parchment-200/45 text-xs uppercase"
      >
        <Link href="/world">Mundo</Link> / Mapa
      </nav>
      <header className="mt-14 max-w-4xl">
        <p className="text-aged-gold-500 text-xs tracking-[.3em] uppercase">
          Atlas SVG · versão provisória
        </p>
        <h1 className="font-display mt-4 text-[clamp(3rem,8vw,6.5rem)] leading-none uppercase">
          Asterheim, sem véu
        </h1>
        <p className="text-parchment-200/65 mt-6 max-w-2xl">
          Use zoom, arraste o mapa ou percorra os territórios com Tab e as
          setas. Em telas pequenas, a lista é o mapa estático acessível.
        </p>
      </header>
      <div className="mt-12">
        <WorldMap kingdoms={mapped} />
      </div>
    </main>
  );
}
