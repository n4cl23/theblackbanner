import type { Metadata } from 'next';
import Link from 'next/link';
import { guardians } from '@/content/heroic-entities';

export const metadata: Metadata = {
  title: 'Guardiões de Asterheim',
  description: 'Os seis Guardiões canônicos e seus vínculos com as Coroas.',
  alternates: { canonical: '/guardioes' },
};

export default function GuardiansPage() {
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
      <header className="max-w-5xl py-16">
        <p className="text-aged-gold-500 text-xs tracking-[.4em] uppercase">
          Seis juramentos · seis domínios
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,12vw,9rem)] uppercase">
          Guardiões
        </h1>
        <p className="text-parchment-200/65 mt-7 max-w-2xl text-lg">
          Registros reconstruídos a partir das entradas aprovadas do Atlas.
          Campos ausentes permanecem explicitamente não documentados.
        </p>
      </header>
      <ol className="divide-stone-700 divide-y border-y border-stone-700">
        {guardians.map((guardian, index) => (
          <li key={guardian.id}>
            <Link
              className="group grid gap-5 py-10 md:grid-cols-[6rem_1fr_18rem]"
              href={`/guardioes/${guardian.slug}`}
            >
              <span className="text-aged-gold-500 font-display text-5xl opacity-50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="font-display text-4xl uppercase">
                  {guardian.title}
                </h2>
                <p className="text-parchment-200/60 mt-3">
                  {guardian.description}
                </p>
              </div>
              <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
                {guardian.kingdom.title}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
