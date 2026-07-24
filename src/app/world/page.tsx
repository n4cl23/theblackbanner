import type { Metadata } from 'next';
import Link from 'next/link';
import { getContentRepository } from '@/features/content/repository/repository';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';

export const metadata: Metadata = {
  title: 'Mundo de Asterheim',
  description: 'Explore os reinos e o mapa provisório de Asterheim.',
  alternates: { canonical: '/world' },
};

export default async function WorldPage() {
  const kingdoms = await (await getContentRepository()).getKingdoms();
  return (
    <main>
      <section className="relative grid min-h-[72vh] place-items-center overflow-hidden px-5 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,.2),#080808),url('/images/home/asterheim-hero.webp')] bg-cover bg-center" />
        <div className="max-w-4xl">
          <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
            Atlas provisório · Asterheim
          </p>
          <h1 className="font-display mt-5 text-[clamp(3.4rem,10vw,8rem)] leading-none uppercase">
            Um mundo sob o estandarte
          </h1>
          <p className="text-parchment-200/70 mx-auto mt-7 max-w-2xl text-lg">
            Três territórios emergem da cinza. Este arquivo visual utiliza
            conteúdo mockado e não estabelece cânone oficial.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              className="bg-aged-gold-500 text-coal-950 px-7 py-4 text-xs font-bold tracking-widest uppercase"
              href="/world/map"
            >
              Explorar o mapa
            </Link>
            <Link
              className="border-stone-600/60 px-7 py-4 text-xs tracking-widest uppercase"
              href="/world/kingdoms"
            >
              Conhecer os reinos
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
        <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
          Territórios catalogados
        </p>
        <div className="mt-8 grid gap-px bg-stone-600/30 lg:grid-cols-3">
          {kingdoms.map((kingdom) => {
            const visual = getKingdomPresentation(kingdom.slug);
            return (
              <Link
                className="bg-coal-950 group relative min-h-80 overflow-hidden p-8"
                href={`/world/kingdoms/${kingdom.slug}`}
                key={kingdom.id}
              >
                <div
                  className="absolute inset-0 opacity-25 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(to top,#080808,transparent),url('${visual?.landscape}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
                <div className="relative flex h-full flex-col justify-end">
                  <span className="text-aged-gold-500 text-3xl">
                    {kingdom.sigil}
                  </span>
                  <h2 className="font-display mt-4 text-3xl uppercase">
                    {kingdom.title}
                  </h2>
                  <p className="text-parchment-200/60 mt-3">
                    {visual?.climate}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
