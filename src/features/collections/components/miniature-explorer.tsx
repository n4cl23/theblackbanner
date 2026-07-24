'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { Miniature } from '@/features/collections/domain/miniature-schema';
import type { MiniatureFilters } from '@/features/collections/data/miniature-repository';
import { ImageWithFallback } from '@/components/ui/interactive';

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
  const kingdom = params.get('reino') ?? '';
  const availability = params.get('disponibilidade') ?? '';
  const order = params.get('ordem') ?? 'featured';
  const visible = records
    .filter(
      (item) =>
        !query ||
        `${item.title} ${item.subtitle}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter((item) => !collection || item.collectionSlug === collection)
    .filter((item) => !scale || item.scale === scale)
    .filter((item) => !difficulty || item.printDifficulty === difficulty)
    .filter((item) => !type || item.entityType === type)
    .filter((item) => !kingdom || item.kingdomSlug === kingdom)
    .filter((item) => !availability || item.availability === availability)
    .toSorted((a, b) =>
      order === 'title'
        ? a.title.localeCompare(b.title)
        : Number(b.featured) - Number(a.featured),
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
            onChange={(e) => update('q', e.target.value)}
            placeholder="Buscar no arquivo"
            value={query}
          />
        </label>
        <Filter
          label="Coleção"
          value={collection}
          options={filters.collections}
          onChange={(v) => update('colecao', v)}
        />
        <Filter
          label="Escala"
          value={scale}
          options={filters.scales}
          onChange={(v) => update('escala', v)}
        />
        <Filter
          label="Dificuldade"
          value={difficulty}
          options={filters.difficulties}
          onChange={(v) => update('dificuldade', v)}
        />
        <Filter
          label="Tipo"
          value={type}
          options={filters.entityTypes}
          onChange={(v) => update('tipo', v)}
        />
        <Filter
          label="Reino"
          value={kingdom}
          options={filters.kingdoms}
          onChange={(v) => update('reino', v)}
        />
        <Filter
          label="Disponibilidade"
          value={availability}
          options={filters.availabilities}
          onChange={(v) => update('disponibilidade', v)}
        />
        <Filter
          label="Ordenação"
          value={order}
          options={['featured', 'title']}
          onChange={(v) => update('ordem', v)}
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
              className={`group relative overflow-hidden border border-stone-600/30 ${index === 0 && item.featured ? 'sm:col-span-2' : ''}`}
              href={`/${locale}/miniaturas/${item.slug}`}
              key={item.id}
            >
              <div className="relative aspect-[3/4]">
                <ImageWithFallback
                  alt={item.cover.alt}
                  className="object-cover opacity-65 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-85 motion-reduce:transform-none"
                  fallback="Imagem provisória indisponível"
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
                  src={item.cover.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-aged-gold-500 text-xs uppercase">
                  {item.entityType} · {item.scale}
                </p>
                <h3 className="font-display mt-3 text-3xl uppercase">
                  {item.title}
                </h3>
                <p className="text-parchment-200/60 mt-2 text-sm">
                  {item.printDifficulty} · {item.collectionSlug}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-stone-600/40 py-20 text-center">
          <h3 className="font-display text-3xl">Nenhum registro encontrado</h3>
          <p className="text-parchment-200/50 mt-3">
            Remova filtros para consultar outras formas.
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
        onChange={(e) => onChange(e.target.value)}
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
