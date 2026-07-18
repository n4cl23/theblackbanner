'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export interface ExplorerCharacter {
  id: string;
  slug: string;
  title: string;
  role: string;
  kingdomId: string;
  factionIds: readonly string[];
  epithet: string;
  treatment: string;
  image: string;
  order: number;
}
interface Option {
  value: string;
  label: string;
}

export function CharacterExplorer({
  characters,
  kingdoms,
  factions,
}: {
  characters: readonly ExplorerCharacter[];
  kingdoms: readonly Option[];
  factions: readonly Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [visible, setVisible] = useState(3);
  const query = params.get('q') ?? '';
  const kingdom = params.get('reino') ?? '';
  const faction = params.get('faccao') ?? '';
  const role = params.get('funcao') ?? '';
  const sort = params.get('ordem') ?? 'editorial';

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    setVisible(3);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }
  const filtered = useMemo(
    () =>
      characters
        .filter(
          (item) =>
            (!query ||
              `${item.title} ${item.epithet}`
                .toLowerCase()
                .includes(query.toLowerCase())) &&
            (!kingdom || item.kingdomId === kingdom) &&
            (!faction || item.factionIds.includes(faction)) &&
            (!role || item.role === role),
        )
        .toSorted((a, b) =>
          sort === 'nome'
            ? a.title.localeCompare(b.title)
            : sort === 'funcao'
              ? a.role.localeCompare(b.role)
              : a.order - b.order,
        ),
    [characters, faction, kingdom, query, role, sort],
  );
  const roles = [...new Set(characters.map((item) => item.role))];

  return (
    <div>
      <div className="bg-coal-900 grid gap-4 border-y border-stone-600/30 p-5 md:grid-cols-3 xl:grid-cols-6">
        <label className="md:col-span-2">
          <span className="sr-only">Buscar personagens</span>
          <input
            aria-label="Buscar personagens"
            className="min-h-12 w-full border border-stone-600/40 bg-black/30 px-4"
            onChange={(event) => update('q', event.target.value)}
            placeholder="Buscar por nome ou epíteto"
            type="search"
            value={query}
          />
        </label>
        <Filter
          label="Reino"
          onChange={(value) => update('reino', value)}
          options={kingdoms}
          value={kingdom}
        />
        <Filter
          label="Facção"
          onChange={(value) => update('faccao', value)}
          options={factions}
          value={faction}
        />
        <Filter
          label="Função"
          onChange={(value) => update('funcao', value)}
          options={roles.map((value) => ({ value, label: value }))}
          value={role}
        />
        <Filter
          label="Ordenação"
          onChange={(value) => update('ordem', value)}
          options={[
            { value: 'editorial', label: 'Destaque editorial' },
            { value: 'nome', label: 'Nome' },
            { value: 'funcao', label: 'Função' },
          ]}
          value={sort}
          includeAll={false}
        />
      </div>
      <p
        className="text-parchment-200/45 my-7 text-xs tracking-widest uppercase"
        role="status"
      >
        {filtered.length} registros encontrados
      </p>
      {filtered.length ? (
        <div className="grid auto-rows-[12rem] gap-4 md:grid-cols-2 xl:grid-cols-12">
          {filtered.slice(0, visible).map((item, index) => (
            <Link
              className={`group relative overflow-hidden border border-stone-600/30 ${index === 0 ? 'md:row-span-3 xl:col-span-7' : item.treatment === 'antagonista' ? 'md:row-span-2 xl:col-span-5' : 'md:row-span-2 xl:col-span-5'}`}
              href={`/personagens/${item.slug}`}
              key={item.id}
            >
              <Image
                alt={`Retrato ambiental provisório de ${item.title}`}
                className="object-cover opacity-55 grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                fill
                sizes="(min-width:1280px) 55vw, 100vw"
                src={item.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
                  {item.treatment} · {item.role}
                </p>
                <h2 className="font-display mt-2 text-3xl uppercase sm:text-4xl">
                  {item.title}
                </h2>
                <p className="text-parchment-200/60 mt-2 italic">
                  {item.epithet}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-stone-600/30 py-20 text-center">
          <h2 className="font-display text-3xl">Nenhum vestígio encontrado</h2>
          <button
            className="text-aged-gold-500 mt-5 text-xs uppercase"
            onClick={() => router.replace(pathname)}
          >
            Limpar filtros
          </button>
        </div>
      )}
      {visible < filtered.length ? (
        <button
          className="border-aged-gold-500 mx-auto mt-10 flex min-h-12 border px-8 py-3 text-xs tracking-widest uppercase"
          onClick={() => setVisible((count) => count + 3)}
        >
          Carregar mais registros
        </button>
      ) : null}
    </div>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
  includeAll = true,
}: {
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  includeAll?: boolean;
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
        {includeAll ? <option value="">{label}: todos</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
