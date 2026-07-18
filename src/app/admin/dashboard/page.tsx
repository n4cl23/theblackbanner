import { requireAdminUser } from '@/features/admin/auth/authorization';
import { getPrismaClient } from '@/features/admin/persistence/prisma';
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const admin = await requireAdminUser();
  const prisma = getPrismaClient();
  const [total, drafts, review, published, audit] = await Promise.all([
    prisma.contentEntity.count(),
    prisma.contentEntity.count({ where: { status: 'DRAFT' } }),
    prisma.contentEntity.count({ where: { status: 'REVIEW' } }),
    prisma.contentEntity.count({ where: { status: 'PUBLISHED' } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);
  return (
    <main className="mx-auto max-w-[100rem] px-5 py-14">
      <p className="text-aged-gold-500 text-xs uppercase">
        Sessão segura · {admin.role}
      </p>
      <h1 className="font-display mt-4 text-6xl uppercase">
        Dashboard editorial
      </h1>
      <dl className="mt-10 grid gap-px bg-stone-600/25 sm:grid-cols-4">
        {[
          ['Total', total],
          ['Rascunhos', drafts],
          ['Em revisão', review],
          ['Publicados', published],
        ].map(([label, value]) => (
          <div className="bg-coal-950 p-6" key={label}>
            <dt className="text-xs uppercase">{label}</dt>
            <dd className="font-display mt-3 text-4xl">{value}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-14">
        <h2 className="font-display text-3xl uppercase">Auditoria recente</h2>
        {audit.length ? (
          <ul className="mt-5 divide-y divide-stone-600/20">
            {audit.map((entry) => (
              <li
                className="grid gap-2 py-4 text-sm sm:grid-cols-4"
                key={entry.id}
              >
                <span>{entry.action}</span>
                <span>{entry.result}</span>
                <span>{entry.origin}</span>
                <time>{entry.createdAt.toLocaleString('pt-BR')}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-parchment-200/50 mt-5">Nenhuma ação registrada.</p>
        )}
      </section>
    </main>
  );
}
