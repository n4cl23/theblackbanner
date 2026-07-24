import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAtlasKingdoms } from '@/features/atlas/data/atlas-repository';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'pt-br') notFound();
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-20">
      <h1 className="font-display text-6xl uppercase">Reinos do Atlas</h1>
      <div className="mt-12 grid gap-4">
        {(await getAtlasKingdoms()).map((k) => (
          <Link
            className="border border-stone-600/30 p-7 text-3xl"
            href={`/${locale}/atlas/reinos/${k.slug}`}
            key={k.id}
          >
            {k.sigil} {k.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
