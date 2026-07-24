import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAtlasCreatures,
  getAtlasRegions,
} from '@/features/atlas/data/atlas-repository';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'pt-br') notFound();
  const [c, r] = await Promise.all([getAtlasCreatures(), getAtlasRegions()]);
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-20">
      <h1 className="font-display text-6xl uppercase">Criaturas do Atlas</h1>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {c.map((x) => (
          <Link
            className="border border-stone-600/30 p-7"
            href={`/bestiario/${x.slug}`}
            key={x.id}
          >
            <p className="text-xs uppercase">
              {x.threatLevel} ·{' '}
              {r
                .filter((y) => x.regionIds.includes(y.id))
                .map((y) => y.title)
                .join(', ')}
            </p>
            <h2 className="font-display mt-3 text-3xl">{x.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
