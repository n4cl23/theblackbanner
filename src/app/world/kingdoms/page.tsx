import type { Metadata } from 'next';
import Link from 'next/link';
import { getContentRepository } from '@/features/content/repository/repository';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';

export const metadata: Metadata = {
  title: 'Reinos de Asterheim',
  description: 'Arquivo editorial provisório dos reinos de Asterheim.',
  alternates: { canonical: '/world/kingdoms' },
};

export default async function KingdomsPage() {
  const kingdoms = await (await getContentRepository()).getKingdoms();
  return (
    <main className="pb-24">
      <header className="mx-auto max-w-[90rem] px-5 pt-24 pb-14 sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className="text-parchment-200/45 text-xs uppercase"
        >
          <Link href="/world">Mundo</Link> / Reinos
        </nav>
        <p className="text-aged-gold-500 mt-14 text-xs tracking-[.3em] uppercase">
          Cartografia política · arquivo mock
        </p>
        <h1 className="font-display mt-4 max-w-5xl text-[clamp(3rem,8vw,7rem)] leading-[.92] uppercase">
          Três reinos. Três formas de sobreviver.
        </h1>
      </header>
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 sm:px-8">
        {kingdoms.map((kingdom, index) => {
          const visual = getKingdomPresentation(kingdom.slug);
          const reverse = index === 1;
          return (
            <article
              className={`grid min-h-[34rem] overflow-hidden border border-stone-600/25 ${reverse ? 'lg:grid-cols-[.8fr_1.2fr]' : 'lg:grid-cols-[1.25fr_.75fr]'}`}
              key={kingdom.id}
            >
              <div
                className={`relative min-h-80 ${reverse ? 'lg:order-2' : ''}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale-[30%]"
                  style={{
                    backgroundImage: `linear-gradient(90deg,transparent,rgba(5,5,5,.5)),url('${visual?.landscape}')`,
                  }}
                />
                <span className="text-aged-gold-500 absolute top-8 left-8 text-5xl">
                  {kingdom.sigil}
                </span>
              </div>
              <div
                className={`bg-coal-900 flex flex-col justify-center p-8 sm:p-12 ${reverse ? 'lg:order-1' : ''}`}
              >
                <span className="text-aged-gold-500 font-display text-5xl opacity-35">
                  {visual?.numeral}
                </span>
                <h2 className="font-display mt-5 text-4xl uppercase sm:text-5xl">
                  {kingdom.title}
                </h2>
                <p className="text-parchment-200/65 mt-5 leading-relaxed">
                  {visual?.culture}
                </p>
                <dl className="mt-8 grid gap-4 border-t border-stone-600/25 pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-aged-gold-500 text-xs uppercase">
                      Clima
                    </dt>
                    <dd className="text-parchment-200/60 mt-2 text-sm">
                      {visual?.climate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-aged-gold-500 text-xs uppercase">
                      Ameaças
                    </dt>
                    <dd className="text-parchment-200/60 mt-2 text-sm">
                      {visual?.threats.join(' · ')}
                    </dd>
                  </div>
                </dl>
                <Link
                  className="border-aged-gold-500 mt-9 self-start border-b pb-2 text-xs tracking-widest uppercase"
                  href={`/world/kingdoms/${kingdom.slug}`}
                >
                  Abrir crônica territorial →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
