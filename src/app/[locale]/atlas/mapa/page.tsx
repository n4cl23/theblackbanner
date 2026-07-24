import { notFound } from 'next/navigation';
import { AtlasMap } from '@/features/atlas/components/atlas-map';
import {
  getAtlasKingdoms,
  getAtlasRegions,
} from '@/features/atlas/data/atlas-repository';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'pt-br') notFound();
  const [kingdomRecords, regions] = await Promise.all([
    getAtlasKingdoms(),
    getAtlasRegions(),
  ]);
  const kingdoms = kingdomRecords.map((k) => ({
    ...getKingdomPresentation(k.slug)!,
    title: k.title,
    sigil: k.sigil,
  }));
  return (
    <main className="mx-auto max-w-[90rem] px-5 py-20">
      <h1 className="font-display mb-10 text-6xl uppercase">
        Mapa de Asterheim
      </h1>
      <AtlasMap kingdoms={kingdoms} locale={locale} regions={regions} />
    </main>
  );
}
