import type { CanonicalContentRecord } from '@/content/canonical-content-schema';

type CanonicalArchiveProps = {
  records: readonly CanonicalContentRecord[];
  emptyMessage: string;
};

export function CanonicalArchive({
  records,
  emptyMessage,
}: CanonicalArchiveProps) {
  if (records.length === 0) {
    return (
      <section className="border-stone-700 border-y py-12" aria-live="polite">
        <p className="text-parchment-200/70 max-w-2xl">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <ol className="divide-stone-700 border-stone-700 divide-y border-y">
      {records.map((record, index) => (
        <li
          className="grid gap-5 py-9 md:grid-cols-[5rem_1fr_12rem]"
          key={record.id}
        >
          <span className="text-aged-gold-500 font-display text-3xl">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h2 className="font-display text-3xl uppercase">{record.title}</h2>
            <p className="text-parchment-200/65 mt-3 max-w-3xl">
              {record.description}
            </p>
          </div>
          <p className="text-stone-400 text-xs tracking-[.2em] uppercase">
            {record.status === 'draft' ? 'Rascunho' : 'Em revisão'}
          </p>
        </li>
      ))}
    </ol>
  );
}
