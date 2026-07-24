import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentType, EditorialStatus } from '@/generated/prisma/client';
import {
  duplicateContent,
  restoreRevision,
  transitionContent,
} from '@/features/admin/actions/content-actions';
import { requireAdminUser } from '@/features/admin/auth/authorization';
import { EditorForm } from '@/features/admin/components/editor-form';
import { PrismaCmsRepository } from '@/features/admin/persistence/cms-repository';
import { getPrismaClient } from '@/features/admin/persistence/prisma';
export const dynamic = 'force-dynamic';
const sections = {
  characters: ContentType.CHARACTER,
  creatures: ContentType.CREATURE,
  kingdoms: ContentType.KINGDOM,
  collections: ContentType.COLLECTION,
  timeline: ContentType.TIMELINE_EVENT,
  lore: ContentType.LORE_ARTICLE,
} as const;
type Props = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    edit?: string;
  }>;
};
export default async function AdminSectionPage({
  params,
  searchParams,
}: Props) {
  await requireAdminUser();
  const { section } = await params;
  const query = await searchParams;
  if (section === 'media') return <MediaAdmin />;
  const type = sections[section as keyof typeof sections];
  if (!type) notFound();
  const status =
    query.status && query.status in EditorialStatus
      ? EditorialStatus[query.status as keyof typeof EditorialStatus]
      : undefined;
  const page = Math.max(1, Number(query.page) || 1);
  const repository = new PrismaCmsRepository();
  const [[records, total], editing] = await Promise.all([
    repository.list({ type, query: query.q, status, page, pageSize: 10 }),
    query.edit ? repository.get(query.edit) : Promise.resolve(null),
  ]);
  return (
    <main className="mx-auto max-w-[100rem] px-5 py-12">
      <header>
        <p className="text-aged-gold-500 text-xs uppercase">
          Conteúdo persistido · {type}
        </p>
        <h1 className="font-display mt-4 text-5xl uppercase">{section}</h1>
      </header>
      <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
        <input
          aria-label="Buscar"
          className="bg-coal-950 min-h-12 border px-3"
          defaultValue={query.q}
          name="q"
          placeholder="Buscar título ou slug"
        />
        <select
          aria-label="Status"
          className="bg-coal-950 border px-3"
          defaultValue={query.status ?? ''}
          name="status"
        >
          <option value="">Todos os status</option>
          {Object.values(EditorialStatus).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="border px-5 uppercase">Filtrar</button>
      </form>
      <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_.8fr]">
        <section>
          <p className="mb-5 text-xs uppercase">
            {total} registros · página {page}
          </p>
          <div className="space-y-4">
            {records.map((record) => (
              <article
                className="border border-stone-600/25 p-5"
                key={record.id}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="mr-auto">
                    <p className="text-xs uppercase">
                      {record.locale} · {record.status} · v{record.version}
                    </p>
                    <h2 className="font-display mt-2 text-2xl uppercase">
                      {record.title}
                    </h2>
                  </div>
                  <Link
                    className="border px-3 py-2 text-xs uppercase"
                    href={`/admin/${section}?edit=${record.id}`}
                  >
                    Editar
                  </Link>
                  <Link
                    className="border px-3 py-2 text-xs uppercase"
                    href={`/admin/preview/${record.id}`}
                  >
                    Preview
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusForm
                    id={record.id}
                    status="REVIEW"
                    version={record.version}
                    label="Enviar à revisão"
                  />
                  <StatusForm
                    id={record.id}
                    status="PUBLISHED"
                    version={record.version}
                    label="Publicar"
                  />
                  <StatusForm
                    id={record.id}
                    status="ARCHIVED"
                    version={record.version}
                    label="Arquivar"
                  />
                  <form action={duplicateContent}>
                    <input name="id" type="hidden" value={record.id} />
                    <button className="border px-3 py-2 text-xs uppercase">
                      Duplicar
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
          <nav aria-label="Paginação" className="mt-8 flex gap-4">
            {page > 1 ? (
              <Link href={`/admin/${section}?page=${page - 1}`}>
                ← Anterior
              </Link>
            ) : null}
            {page * 10 < total ? (
              <Link href={`/admin/${section}?page=${page + 1}`}>Próxima →</Link>
            ) : null}
          </nav>
        </section>
        <aside>
          <EditorForm entity={editing} type={type} />
          {editing?.revisions.length ? (
            <section className="mt-6 border p-5">
              <h2 className="font-display text-2xl uppercase">Histórico</h2>
              <ul className="mt-4 space-y-3">
                {editing.revisions.map((revision) => (
                  <li
                    className="flex items-center justify-between"
                    key={revision.id}
                  >
                    <span>
                      v{revision.version} · {revision.reason}
                    </span>
                    <form action={restoreRevision}>
                      <input
                        name="revisionId"
                        type="hidden"
                        value={revision.id}
                      />
                      <input
                        name="version"
                        type="hidden"
                        value={editing.version}
                      />
                      <button className="underline">Restaurar</button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
function StatusForm({
  id,
  version,
  status,
  label,
}: {
  id: string;
  version: number;
  status: string;
  label: string;
}) {
  return (
    <form action={transitionContent}>
      <input name="id" type="hidden" value={id} />
      <input name="version" type="hidden" value={version} />
      <input name="status" type="hidden" value={status} />
      <button className="border px-3 py-2 text-xs uppercase">{label}</button>
    </form>
  );
}
async function MediaAdmin() {
  const media = await getPrismaClient().mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
    take: 25,
  });
  return (
    <main className="mx-auto max-w-[100rem] px-5 py-12">
      <h1 className="font-display text-5xl uppercase">Mídia</h1>
      <p className="mt-5 max-w-2xl">
        Metadados ficam no banco; arquivos grandes dependem da abstração de
        storage futura e nunca são gravados no PostgreSQL.
      </p>
      {media.length ? (
        <ul>
          {media.map((item) => (
            <li key={item.id}>{item.storageKey}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 border p-8">Nenhuma mídia registrada.</p>
      )}
    </main>
  );
}
