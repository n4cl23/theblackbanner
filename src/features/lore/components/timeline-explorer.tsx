'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface TimelineRecord {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  era: string;
  year: number;
  impact: string;
  conflict: string;
  kingdoms: readonly string[];
  characters: readonly string[];
  creatures: readonly string[];
  factions: readonly string[];
  related: readonly { id: string; title: string }[];
}
export function TimelineExplorer({
  records,
}: {
  records: readonly TimelineRecord[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = params.get('visao') ?? 'chronological';
  const filter = params.get('filtro') ?? '';
  const values =
    view === 'kingdom'
      ? records.flatMap((r) => r.kingdoms)
      : view === 'character'
        ? records.flatMap((r) => r.characters)
        : view === 'conflict'
          ? records.map((r) => r.conflict)
          : [];
  const options = [...new Set(values)].sort();
  const visible = filter
    ? records.filter((r) =>
        view === 'kingdom'
          ? r.kingdoms.includes(filter)
          : view === 'character'
            ? r.characters.includes(filter)
            : r.conflict === filter,
      )
    : records;
  function update(nextView: string, nextFilter = '') {
    const next = new URLSearchParams();
    if (nextView !== 'chronological') next.set('visao', nextView);
    if (nextFilter) next.set('filtro', nextFilter);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }
  return (
    <div>
      <div className="grid gap-4 border-y border-stone-600/30 py-6 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs uppercase">Visão</span>
          <select
            aria-label="Visão da timeline"
            className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-4"
            value={view}
            onChange={(e) => update(e.target.value)}
          >
            <option value="chronological">Cronológica</option>
            <option value="kingdom">Por reino</option>
            <option value="character">Por personagem</option>
            <option value="conflict">Por conflito</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs uppercase">Filtro</span>
          <select
            aria-label="Filtro da timeline"
            className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-4"
            disabled={!options.length}
            value={filter}
            onChange={(e) => update(view, e.target.value)}
          >
            <option value="">Todos</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="my-7 text-xs uppercase" role="status">
        {visible.length} eventos documentados
      </p>
      <ol className="border-aged-gold-500/35 border-l pl-7">
        {visible.map((r) => (
          <li className="relative mb-14" id={r.id} key={r.id}>
            <span className="bg-aged-gold-500 absolute top-1 -left-[2.15rem] size-3 rotate-45" />
            <p className="text-aged-gold-500 text-xs uppercase">
              {r.era} · ano {r.year} · impacto {r.impact}
            </p>
            <h2 className="font-display mt-3 text-4xl uppercase">{r.title}</h2>
            <p className="text-parchment-200/60 mt-3 max-w-2xl">{r.excerpt}</p>
            <p className="mt-4 text-xs uppercase">
              {r.kingdoms.join(' · ')} {r.characters.join(' · ')}{' '}
              {r.creatures.join(' · ')} {r.factions.join(' · ')}
            </p>
            {r.related.length ? (
              <div className="mt-5 flex gap-3 text-sm">
                Relacionados:{' '}
                {r.related.map((item) => (
                  <Link
                    className="underline"
                    href={`#${item.id}`}
                    key={item.id}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
