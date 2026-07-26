import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChronicleReader } from '@/features/lore/components/chronicle-reader';
import { chronicles } from '@/features/lore/data/lore-repository';
import { getChronicle } from '@/features/lore/data/lore.mock';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return chronicles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chronicle = getChronicle(slug);
  if (!chronicle)
    return { title: 'Crônica não encontrada', robots: { index: false } };
  return {
    title: chronicle.title,
    description: chronicle.excerpt,
    alternates: { canonical: `/chronicles/${slug}` },
  };
}
export default async function ChroniclePage({ params }: Props) {
  const { slug } = await params;
  const chronicle = getChronicle(slug);
  if (!chronicle) notFound();
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-16">
      <header className="mx-auto max-w-4xl py-16 text-center">
        <p className="text-aged-gold-500 text-xs uppercase">
          Chronicle · arquivo narrativo
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,9vw,8rem)] leading-[.86] uppercase">
          {chronicle.title}
        </h1>
        <p className="text-parchment-200/60 mt-6 text-xl">
          {chronicle.subtitle}
        </p>
      </header>
      <ChronicleReader chronicle={chronicle} />
    </main>
  );
}
