'use client';
import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import type { SearchRecord } from '@/features/lore/data/lore-repository';

export function UnifiedSearch({
  records,
}: {
  records: readonly SearchRecord[];
}) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query.trim().toLocaleLowerCase('pt-BR'));
  const results = deferred
    ? records.filter((item) =>
        `${item.title} ${item.type} ${item.excerpt}`
          .toLocaleLowerCase('pt-BR')
          .includes(deferred),
      )
    : [];
  return (
    <section aria-labelledby="unified-search">
      <h2 className="font-display text-4xl uppercase" id="unified-search">
        Busca nos arquivos
      </h2>
      <label className="mt-6 block">
        <span className="sr-only">Buscar em Asterheim</span>
        <input
          aria-label="Buscar em Asterheim"
          className="bg-coal-950 border-aged-gold-500/40 min-h-14 w-full border-b px-4 text-lg"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Personagens, criaturas, eventos…"
          type="search"
          value={query}
        />
      </label>
      <p className="my-4 text-xs uppercase" role="status">
        {deferred
          ? `${results.length} resultados`
          : 'Digite para atravessar os arquivos'}
      </p>
      {deferred ? (
        <ul className="grid gap-px bg-stone-600/25 sm:grid-cols-2">
          {results.map((item) => (
            <li className="bg-coal-950 p-5" key={item.id}>
              <Link href={item.href}>
                <span className="text-aged-gold-500 text-xs uppercase">
                  {item.type}
                </span>
                <strong className="font-display mt-2 block text-2xl uppercase">
                  {item.title}
                </strong>
                <span className="text-parchment-200/55 mt-2 block text-sm">
                  {item.excerpt}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
