'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export interface BestiaryRecord {
  id: string;
  slug: string;
  title: string;
  classification: string;
  threatLevel: string;
  kingdomIds: readonly string[];
  habitatIds: readonly string[];
  category: string;
  size: string;
  behaviorType: string;
  rarity: string;
  documentationStatus: string;
  image: string;
}
interface Option {
  value: string;
  label: string;
}

const filterKeys = [
  'reino',
  'habitat',
  'categoria',
  'ameaca',
  'tamanho',
  'comportamento',
  'raridade',
  'documentacao',
] as const;

export function BestiaryExplorer({
  records,
  kingdoms,
  habitats,
}: {
  records: readonly BestiaryRecord[];
  kingdoms: readonly Option[];
  habitats: readonly Option[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
      scroll: false,
    });
  }
  const filtered = useMemo(
    () =>
      records.filter((item) => {
        const values: Record<
          (typeof filterKeys)[number],
          string | readonly string[]
        > = {
          reino: item.kingdomIds,
          habitat: item.habitatIds,
          categoria: item.category,
          ameaca: item.threatLevel,
          tamanho: item.size,
          comportamento: item.behaviorType,
          raridade: item.rarity,
          documentacao: item.documentationStatus,
        };
        return filterKeys.every((key) => {
          const selected = params.get(key);
          return (
            !selected ||
            (Array.isArray(values[key])
              ? values[key].includes(selected)
              : values[key] === selected)
          );
        });
      }),
    [params, records],
  );
  const unique = (key: keyof BestiaryRecord) =>
    [...new Set(records.map((item) => String(item[key])))].map((value) => ({
      value,
      label: value,
    }));
  return (
    <div>
      <div className="bg-coal-900 grid gap-3 border-y border-stone-600/30 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Reino"
          options={kingdoms}
          value={params.get('reino') ?? ''}
          onChange={(value) => update('reino', value)}
        />
        <Select
          label="Habitat"
          options={habitats}
          value={params.get('habitat') ?? ''}
          onChange={(value) => update('habitat', value)}
        />
        <Select
          label="Categoria"
          options={unique('category')}
          value={params.get('categoria') ?? ''}
          onChange={(value) => update('categoria', value)}
        />
        <Select
          label="Nível de ameaça"
          options={unique('threatLevel')}
          value={params.get('ameaca') ?? ''}
          onChange={(value) => update('ameaca', value)}
        />
        <Select
          label="Tamanho"
          options={unique('size')}
          value={params.get('tamanho') ?? ''}
          onChange={(value) => update('tamanho', value)}
        />
        <Select
          label="Comportamento"
          options={unique('behaviorType')}
          value={params.get('comportamento') ?? ''}
          onChange={(value) => update('comportamento', value)}
        />
        <Select
          label="Raridade"
          options={unique('rarity')}
          value={params.get('raridade') ?? ''}
          onChange={(value) => update('raridade', value)}
        />
        <Select
          label="Documentação"
          options={unique('documentationStatus')}
          value={params.get('documentacao') ?? ''}
          onChange={(value) => update('documentacao', value)}
        />
      </div>
      <p
        className="text-parchment-200/45 my-7 text-xs tracking-widest uppercase"
        role="status"
      >
        {filtered.length} espécies no códice
      </p>
      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <Link
              className={`group relative min-h-[30rem] overflow-hidden border border-stone-600/30 ${index === 0 ? 'md:col-span-2 xl:min-h-[38rem]' : ''}`}
              href={`/bestiario/${item.slug}`}
              key={item.id}
            >
              <Image
                alt={`Habitat provisório de ${item.title}`}
                className="object-cover opacity-45 grayscale-[40%] transition duration-700 group-hover:scale-105 group-hover:opacity-65"
                fill
                sizes="(min-width:1280px) 34vw, (min-width:768px) 50vw, 100vw"
                src={item.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="flex justify-between text-xs tracking-widest uppercase">
                  <span className="text-aged-gold-500">{item.category}</span>
                  <span>{item.documentationStatus}</span>
                </div>
                <h2 className="font-display mt-4 text-4xl uppercase">
                  {item.title}
                </h2>
                <p className="text-parchment-200/55 mt-3">
                  {item.classification} · ameaça {item.threatLevel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-stone-600/30 py-20 text-center">
          <h2 className="font-display text-3xl">Nenhuma evidência coincide</h2>
          <button
            className="text-aged-gold-500 mt-5 text-xs uppercase"
            onClick={() => router.replace(pathname)}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className="bg-coal-950 min-h-12 w-full border border-stone-600/40 px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{label}: todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
