import type { Metadata } from 'next';
import Link from 'next/link';
import { chronicles } from '@/features/lore/data/lore-repository';
export const metadata: Metadata = {
  title: 'Chronicles',
  description: 'Crônicas longas provisórias organizadas por capítulos.',
  alternates: { canonical: '/chronicles' },
};
export default function ChroniclesPage() {
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-16">
      <header className="max-w-5xl py-14">
        <p className="text-aged-gold-500 text-xs uppercase">
          Histórias longas · crônicas de Asterheim
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
          Crônicas para depois da fogueira
        </h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {chronicles.map((chronicle, index) => (
          <Link
            className={`border border-stone-600/30 p-8 ${index === 0 ? 'min-h-[32rem]' : 'min-h-[26rem] lg:mt-20'}`}
            href={`/chronicles/${chronicle.slug}`}
            key={chronicle.id}
          >
            <p className="text-aged-gold-500 text-xs uppercase">
              {chronicle.chapters.length} capítulos ·{' '}
              {chronicle.estimatedMinutes} min
            </p>
            <h2 className="font-display mt-5 text-5xl uppercase">
              {chronicle.title}
            </h2>
            <p className="text-parchment-200/60 mt-5 max-w-xl">
              {chronicle.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
