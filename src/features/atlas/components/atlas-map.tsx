'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { AtlasRegion } from '@/features/atlas/domain/atlas-schema';
import type { KingdomPresentation } from '@/features/world/data/world-presentation.mock';

interface AtlasKingdom extends KingdomPresentation {
  title: string;
  sigil: string;
}
const layerLabels = {
  borders: 'Fronteiras',
  kingdoms: 'Reinos',
  regions: 'Regiões',
  ruins: 'Ruínas',
  'danger-zones': 'Zonas de perigo',
  creatures: 'Criaturas',
  'historical-events': 'Eventos históricos',
} as const;
type Layer = keyof typeof layerLabels;

export function AtlasMap({
  kingdoms,
  regions,
  locale,
}: {
  kingdoms: readonly AtlasKingdom[];
  regions: readonly AtlasRegion[];
  locale: string;
}) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const selectedKingdom = search.get('reino') ?? kingdoms[0]?.slug ?? '';
  const selectedRegion = search.get('regiao') ?? '';
  const [layers, setLayers] = useState<Set<Layer>>(
    () =>
      new Set([
        'borders',
        'kingdoms',
        'regions',
        'ruins',
        'danger-zones',
        'creatures',
        'historical-events',
      ]),
  );
  function update(key: string, value: string) {
    const next = new URLSearchParams(search);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }
  function toggle(layer: Layer) {
    setLayers((current) => {
      const next = new Set(current);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }
  const visibleRegions = regions.filter(
    (r) => !selectedKingdom || r.kingdomSlug === selectedKingdom,
  );
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section
        aria-label="Mapa interativo do Atlas de Asterheim"
        className="relative hidden min-h-[42rem] overflow-hidden border border-stone-600/35 bg-black/40 sm:block"
      >
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Control
            label="Aumentar zoom"
            onClick={() => setScale((v) => Math.min(2, v + 0.2))}
          >
            +
          </Control>
          <Control
            label="Diminuir zoom"
            onClick={() => setScale((v) => Math.max(0.8, v - 0.2))}
          >
            −
          </Control>
          <Control
            label="Redefinir mapa"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            Reset
          </Control>
        </div>
        <svg
          aria-label="Territórios e regiões navegáveis de Asterheim"
          className="h-full min-h-[42rem] w-full"
          viewBox="0 0 740 570"
          onKeyDown={(e) => {
            if (e.key === '+' || e.key === '=')
              setScale((v) => Math.min(2, v + 0.2));
            if (e.key === '-') setScale((v) => Math.max(0.8, v - 0.2));
            if (e.key === 'ArrowRight')
              setOffset((v) => ({ ...v, x: v.x - 15 }));
            if (e.key === 'ArrowLeft')
              setOffset((v) => ({ ...v, x: v.x + 15 }));
            if (e.key === 'ArrowUp') setOffset((v) => ({ ...v, y: v.y + 15 }));
            if (e.key === 'ArrowDown')
              setOffset((v) => ({ ...v, y: v.y - 15 }));
          }}
          tabIndex={0}
        >
          <g
            transform={`translate(${offset.x} ${offset.y}) scale(${scale})`}
            className="transition-transform motion-reduce:transition-none"
          >
            {kingdoms.map((k) => (
              <path
                aria-label={`Selecionar reino ${k.title}`}
                className="cursor-pointer outline-none focus-visible:stroke-[5]"
                d={k.mapPath}
                fill={
                  selectedKingdom === k.slug
                    ? 'rgba(156,112,48,.42)'
                    : 'rgba(74,69,60,.35)'
                }
                key={k.slug}
                onClick={() => update('reino', k.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    update('reino', k.slug);
                  }
                }}
                role="button"
                stroke="#c6a85d"
                strokeWidth={layers.has('borders') ? 2 : 0}
                tabIndex={0}
              />
            ))}
          </g>
          {layers.has('regions')
            ? visibleRegions
                .filter((r) => r.mapCoordinates)
                .map((r) => (
                  <g
                    key={r.id}
                    transform={`translate(${(r.mapCoordinates?.x ?? 0) * 7} ${(r.mapCoordinates?.y ?? 0) * 5})`}
                  >
                    <circle
                      aria-label={`Selecionar região ${r.title}`}
                      className="cursor-pointer outline-none focus-visible:stroke-[4]"
                      fill={selectedRegion === r.slug ? '#c6a85d' : '#181511'}
                      onClick={() => update('regiao', r.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          update('regiao', r.slug);
                        }
                      }}
                      r="12"
                      role="button"
                      stroke="#e8dfca"
                      tabIndex={0}
                    />
                    <text aria-hidden="true" fill="#e8dfca" x="18" y="5">
                      {r.title}
                    </text>
                  </g>
                ))
            : null}
        </svg>
      </section>
      <aside>
        <fieldset className="border border-stone-600/30 p-5">
          <legend className="px-2 text-xs uppercase">Camadas publicadas</legend>
          {(Object.keys(layerLabels) as Layer[]).map((layer) => (
            <label className="flex min-h-11 items-center gap-3" key={layer}>
              <input
                checked={layers.has(layer)}
                onChange={() => toggle(layer)}
                type="checkbox"
              />
              {layerLabels[layer]}
            </label>
          ))}
        </fieldset>
        <h2 className="font-display mt-8 text-2xl uppercase">
          Alternativa acessível
        </h2>
        <ul className="mt-4 grid gap-2">
          {visibleRegions.map((r) => (
            <li key={r.id}>
              <button
                aria-pressed={selectedRegion === r.slug}
                className="min-h-14 w-full border border-stone-600/30 px-4 text-left"
                onClick={() => update('regiao', r.slug)}
              >
                {r.title} · {r.biome.title}
              </button>
              {selectedRegion === r.slug ? (
                <Link
                  className="text-aged-gold-500 mt-2 block"
                  href={`/${locale}/atlas/regioes/${r.slug}`}
                >
                  Abrir região →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
function Control({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="bg-coal-950 min-h-11 min-w-11 border border-stone-600/50 px-3"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
