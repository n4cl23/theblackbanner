'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export type HeroicExplorerRecord = {
  id: string;
  slug: string;
  title: string;
  collection: string | null;
  kingdom: string;
  faction: string | null;
  role: string | null;
  type: string;
  scale: string | null;
  status: 'draft' | 'review';
};

const filters = [
  ['colecao', 'Coleção'],
  ['reino', 'Reino'],
  ['faccao', 'Facção'],
  ['funcao', 'Função'],
  ['tipo', 'Tipo'],
  ['escala', 'Escala'],
  ['status', 'Status'],
] as const;

const propertyByParam = {
  colecao: 'collection',
  reino: 'kingdom',
  faccao: 'faction',
  funcao: 'role',
  tipo: 'type',
  escala: 'scale',
  status: 'status',
} as const satisfies Record<
  (typeof filters)[number][0],
  keyof HeroicExplorerRecord
>;

export function HeroicEntityExplorer({
  records,
}: {
  records: readonly HeroicExplorerRecord[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const order = params.get('ordem') ?? 'editorial';

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }

  const visibleRecords = useMemo(() => {
    return records
      .filter((record) => {
        if (!record.title.toLowerCase().includes(query.toLowerCase()))
          return false;
        return filters.every(([key]) => {
          const selected = params.get(key);
          if (!selected) return true;
          return record[propertyByParam[key]] === selected;
        });
      })
      .toSorted((a, b) =>
        order === 'nome' ? a.title.localeCompare(b.title) : 0,
      );
  }, [order, params, query, records]);

  return (
    <section>
      <div className="bg-coal-900 grid gap-3 border-y border-stone-600/30 p-5 md:grid-cols-3 xl:grid-cols-5">
        <label className="md:col-span-2">
          <span className="sr-only">Buscar personagens</span>
          <input
            aria-label="Buscar personagens"
            className="min-h-12 w-full border border-stone-600/40 bg-black/30 px-4"
            onChange={(event) => update('q', event.target.value)}
            placeholder="Buscar personagens aprovados"
            type="search"
            value={query}
          />
        </label>
        {filters.map(([key, label]) => {
          const property = propertyByParam[key];
          const values = [
            ...new Set(
              records
                .map((record) => record[property])
                .filter((value): value is string => typeof value === 'string'),
            ),
          ];
          return (
            <label key={key}>
              <span className="sr-only">{label}</span>
              <select
                aria-label={label}
                className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-3"
                onChange={(event) => update(key, event.target.value)}
                value={params.get(key) ?? ''}
              >
                <option value="">{label}: todos</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
        <label>
          <span className="sr-only">Ordenação</span>
          <select
            aria-label="Ordenação"
            className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-3"
            onChange={(event) => update('ordem', event.target.value)}
            value={order}
          >
            <option value="editorial">Ordem editorial</option>
            <option value="nome">Nome</option>
          </select>
        </label>
      </div>
      <p className="my-7 text-xs tracking-widest uppercase" role="status">
        {visibleRecords.length} registros aprovados
      </p>
      {visibleRecords.length ? (
        <ol className="divide-stone-700 divide-y border-y border-stone-700">
          {visibleRecords.map((record) => (
            <li className="py-8" key={record.id}>
              <Link
                className="font-display text-3xl uppercase"
                href={`/personagens/${record.slug}`}
              >
                {record.title}
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="border-y border-stone-700 py-14">
          <h2 className="font-display text-3xl uppercase">
            Revisão editorial necessária
          </h2>
          <p className="text-parchment-200/65 mt-4 max-w-2xl">
            Os 42 registros identificados na V1 ainda não possuem aprovação
            individual suficiente para publicação.
          </p>
        </div>
      )}
    </section>
  );
}
