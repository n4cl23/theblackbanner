import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { approvedCharacters } from '@/content/heroic-entities';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return approvedCharacters.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const character = approvedCharacters.find((record) => record.slug === slug);
  if (!character)
    return { title: 'Personagem não encontrado', robots: { index: false } };
  return {
    title: character.title,
    alternates: { canonical: `/personagens/${character.slug}` },
  };
}

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params;
  const character = approvedCharacters.find((record) => record.slug === slug);
  if (!character) notFound();
  return null;
}
