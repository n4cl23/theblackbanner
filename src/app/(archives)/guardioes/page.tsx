import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getContentRepository } from '@/features/content/repository/repository';
import { guardianPresentation } from '@/features/characters/data/character-presentation.mock';
export const metadata: Metadata = {
  title: 'Guardiões de Asterheim',
  description: 'Arquivo monumental provisório dos Guardiões.',
  alternates: { canonical: '/guardioes' },
};
export default async function GuardiansPage() {
  const guardians = await (await getContentRepository()).getGuardians();
  return (
    <main>
      <section className="relative grid min-h-[72vh] place-items-center overflow-hidden px-5 text-center">
        <Image
          alt="Fortaleza monumental associada aos Guardiões"
          className="object-cover opacity-35"
          fill
          priority
          sizes="100vw"
          src={guardianPresentation.image}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,#050505_75%)]" />
        <div className="relative max-w-5xl">
          <span className="text-aged-gold-500 text-6xl">
            {guardianPresentation.symbol}
          </span>
          <p className="text-aged-gold-500 mt-7 text-xs tracking-[.4em] uppercase">
            Ordem rara · arquivo mock
          </p>
          <h1 className="font-display mt-5 text-[clamp(4rem,12vw,9rem)] leading-none uppercase">
            Guardiões
          </h1>
          <p className="text-parchment-200/60 mx-auto mt-7 max-w-2xl text-xl">
            Não são heróis catalogados. São funções antigas que ainda possuem um
            nome.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
        {guardians.map((guardian) => (
          <Link
            className="border-aged-gold-500/30 bg-coal-900 grid min-h-80 border p-8 sm:grid-cols-[.35fr_1.65fr] sm:p-12"
            href={`/guardioes/${guardian.slug}`}
            key={guardian.id}
          >
            <div className="text-aged-gold-500 font-display text-7xl opacity-40">
              I
            </div>
            <div className="self-end">
              <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
                {guardianPresentation.domain}
              </p>
              <h2 className="font-display mt-4 text-5xl uppercase">
                {guardian.title}
              </h2>
              <p className="text-parchment-200/60 mt-5 max-w-xl italic">
                “{guardianPresentation.oath}”
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
