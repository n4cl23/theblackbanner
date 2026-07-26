import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getContentRepository } from '@/features/content/repository/repository';
import { getBiomePresentation } from '@/features/bestiary/data/bestiary-presentation.mock';
export const metadata: Metadata = {
  title: 'Atlas de Asterheim',
  description:
    'Biomas, riscos e distribuição provisória das espécies de Asterheim.',
  alternates: { canonical: '/atlas' },
};
export default async function AtlasPage() {
  const kingdoms = await (await getContentRepository()).getKingdoms();
  return (
    <main>
      <header className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
        <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
          Atlas Faunae · arquivo editorial
        </p>
        <h1 className="font-display mt-5 max-w-5xl text-[clamp(4rem,10vw,8rem)] leading-[.86] uppercase">
          Biomas que moldam aquilo que vive
        </h1>
      </header>
      <section className="mx-auto grid max-w-[90rem] gap-7 px-5 pb-24 sm:px-8">
        {kingdoms.map((kingdom, index) => {
          const biome = getBiomePresentation(kingdom.slug);
          if (!biome) return null;
          return (
            <Link
              className={`group grid min-h-[30rem] overflow-hidden border border-stone-600/30 lg:grid-cols-2 ${index === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
              href={`/atlas/${kingdom.slug}`}
              key={kingdom.id}
            >
              <div className="relative min-h-72">
                <Image
                  alt={`Bioma provisório de ${kingdom.title}`}
                  className="object-cover opacity-55 grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  src={biome.image}
                />
              </div>
              <div className="bg-coal-900 flex flex-col justify-end p-8 sm:p-12">
                <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
                  {kingdom.title}
                </p>
                <h2 className="font-display mt-4 text-4xl uppercase sm:text-5xl">
                  {biome.biome}
                </h2>
                <p className="text-parchment-200/60 mt-5 max-w-xl">
                  {biome.atmosphere}
                </p>
                <span className="mt-8 text-xs tracking-widest uppercase">
                  Abrir atlas territorial →
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
