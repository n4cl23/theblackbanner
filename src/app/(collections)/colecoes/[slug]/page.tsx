import { redirect } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyCollectionPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/pt-br/colecoes/${slug}`);
}
