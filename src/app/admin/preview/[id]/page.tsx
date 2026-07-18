import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/features/admin/auth/authorization';
import { PrismaCmsRepository } from '@/features/admin/persistence/cms-repository';
export const dynamic = 'force-dynamic';
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();
  const { id } = await params;
  const entity = await new PrismaCmsRepository().get(id);
  if (!entity) notFound();
  const content =
    entity.body && typeof entity.body === 'object' && 'content' in entity.body
      ? String(entity.body.content)
      : '';
  return (
    <main className="mx-auto max-w-[52rem] px-5 py-20">
      <p className="text-aged-gold-500 text-xs uppercase">
        Preview administrativo · {entity.locale} · {entity.status}
      </p>
      <h1 className="font-display mt-5 text-6xl uppercase">{entity.title}</h1>
      <p className="mt-8 text-lg leading-8 whitespace-pre-wrap">{content}</p>
    </main>
  );
}
