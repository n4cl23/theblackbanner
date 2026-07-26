'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ImageWithFallback } from '@/components/ui/interactive';
import type { MiniatureFilters } from '@/features/collections/data/miniature-repository';
import type { Miniature } from '@/features/collections/domain/miniature-schema';

export function MiniatureExplorer({
  records,
  filters,
  locale,
}: {
  records: readonly Miniature[];
  filters: MiniatureFilters;
  locale: string;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = params.get('q') ?? '';
  const collection = params.get('colecao') ?? '';
  const scale = params.get('escala') ?? '';
  const difficulty = params.get('dificuldade') ?? '';
  const type = params.get('tipo') ?? '';
  const status = params.get('disponibilidade') ?? '';
  const order = params.get('ordem') ?? 'collection';
  const visible = records
    .filter(
      (item) =>
        !query ||
        `${item.title} ${item.description ?? ''}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter((item) => !collection || item.collectionSlug === collection)
    .filter((item) => !scale || item.scale === scale)
    .filter((item) => !difficulty || item.difficulty === difficulty)
    .filter((item) => !type || item.entityType === type)
    .filter((item) => !status || item.status === status)
    .toSorted((a, b) =>
      order === 'title'
        ? a.title.localeCompare(b.title)
        : a.collectionTitle.localeCompare(b.collectionTitle),
    );

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }

  return (
    <section aria-labelledby="miniature-grid-title">
      <div className="grid gap-3 border-y border-stone-600/25 py-6 sm:grid-cols-2 lg:grid-cols-6">
        <label className="lg:col-span-2">
          <span className="sr-only">Buscar miniaturas</span>
          <input
            aria-label="Buscar miniaturas"
            className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-4"
            onChange={(event) => update('q', event.target.value)}
            placeholder="Buscar no arquivo"
            value={query}
          />
        </label>
        <Filter
          label="Coleção"
          onChange={(value) => update('colecao', value)}
          options={filters.collections}
          value={collection}
        />
        <Filter
          label="Escala"
          onChange={(value) => update('escala', value)}
          options={filters.scales}
          value={scale}
        />
        <Filter
          label="Dificuldade"
          onChange={(value) => update('dificuldade', value)}
          options={filters.difficulties}
          value={difficulty}
        />
        <Filter
          label="Tipo"
          onChange={(value) => update('tipo', value)}
          options={filters.entityTypes}
          value={type}
        />
        <Filter
          label="Disponibilidade"
          onChange={(value) => update('disponibilidade', value)}
          options={filters.statuses}
          value={status}
        />
        <Filter
          label="Ordenação"
          onChange={(value) => update('ordem', value)}
          options={['collection', 'title']}
          value={order}
        />
      </div>
      <h2 className="sr-only" id="miniature-grid-title">
        Miniaturas documentadas
      </h2>
      <p className="text-parchment-200/50 my-8 text-xs uppercase" role="status">
        {visible.length} miniaturas encontradas
      </p>
      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item, index) => (
            <Link
              className={`codex-card miniature-card group relative overflow-hidden ${index === 0 ? 'sm:col-span-2' : ''}`}
              href={`/${locale}/miniaturas/${item.slug}`}
              key={item.id}
            >
              <div className="relative aspect-[3/4]">
                <ImageWithFallback
                  alt={item.cover?.alt ?? item.title}
                  className="object-cover opacity-65 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-85 motion-reduce:transform-none"
                  fallback="Imagem indisponível"
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
                  src={item.cover?.src ?? '/images/home/asterheim-hero.webp'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-aged-gold-500 text-xs uppercase">
                  {item.entityType}
                  {item.scale ? ` · ${item.scale}` : ''}
                </p>
                <h3 className="font-display mt-3 text-3xl uppercase">
                  {item.title}
                </h3>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  {item.difficulty ? `${item.difficulty} · ` : ''}
                  {item.collectionTitle}
                </p>
                {item.description ? (
                  <p className="text-parchment-200/55 mt-3 line-clamp-2 text-sm">
                    {item.description}
                  </p>
                ) : null}
                {item.status === 'catalogued' ? (
                  <p className="text-aged-gold-500 mt-4 text-[.65rem] tracking-[.18em] uppercase">
                    Em desenvolvimento
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-stone-600/40 py-20 text-center">
          <h3 className="font-display text-3xl">Nenhum registro encontrado</h3>
          <p className="text-parchment-200/50 mt-3">
            Ajuste os filtros para explorar outra parte do acervo.
          </p>
        </div>
      )}
    </section>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-3"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{label}: todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
