'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { KingdomPresentation } from '@/features/world/data/world-presentation.mock';

interface MapKingdom extends KingdomPresentation {
  title: string;
  sigil: string;
}

export function WorldMap({ kingdoms }: { kingdoms: readonly MapKingdom[] }) {
  const [selected, setSelected] = useState(kingdoms[0]?.slug ?? '');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const active = kingdoms.find((kingdom) => kingdom.slug === selected);

  function selectByIndex(index: number) {
    const kingdom = kingdoms[(index + kingdoms.length) % kingdoms.length];
    if (kingdom) setSelected(kingdom.slug);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section
        aria-label="Mapa interativo de Asterheim"
        className="relative hidden min-h-[39rem] overflow-hidden border border-stone-600/35 bg-black/40 sm:block"
      >
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            aria-label="Aumentar zoom"
            className="bg-coal-950 size-11 border border-stone-600/50 text-xl"
            onClick={() => setScale((value) => Math.min(1.8, value + 0.2))}
          >
            +
          </button>
          <button
            aria-label="Diminuir zoom"
            className="bg-coal-950 size-11 border border-stone-600/50 text-xl"
            onClick={() => setScale((value) => Math.max(0.8, value - 0.2))}
          >
            −
          </button>
          <button
            className="bg-coal-950 min-h-11 border border-stone-600/50 px-3 text-xs uppercase"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            Redefinir
          </button>
        </div>
        <svg
          aria-label="Três territórios selecionáveis de Asterheim"
          className="h-full min-h-[39rem] w-full touch-none bg-[radial-gradient(circle_at_center,#26231f,transparent_60%)]"
          onPointerDown={(event) =>
            setDragStart({
              x: event.clientX - offset.x,
              y: event.clientY - offset.y,
            })
          }
          onPointerMove={(event) => {
            if (dragStart)
              setOffset({
                x: event.clientX - dragStart.x,
                y: event.clientY - dragStart.y,
              });
          }}
          onPointerUp={() => setDragStart(null)}
          onPointerLeave={() => setDragStart(null)}
          viewBox="0 0 740 570"
        >
          <defs>
            <filter id="map-glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g
            transform={`translate(${offset.x} ${offset.y}) scale(${scale})`}
            className="transition-transform duration-200"
          >
            <path
              d="M38 58 L700 35 L715 530 L28 548 Z"
              fill="none"
              stroke="rgba(198,177,134,.18)"
              strokeDasharray="4 9"
            />
            {kingdoms.map((kingdom, index) => (
              <g key={kingdom.slug}>
                <path
                  aria-label={`Selecionar ${kingdom.title}`}
                  className="cursor-pointer transition-[fill,stroke] outline-none focus-visible:stroke-[5]"
                  d={kingdom.mapPath}
                  fill={
                    selected === kingdom.slug
                      ? 'rgba(156,112,48,.42)'
                      : 'rgba(74,69,60,.42)'
                  }
                  filter={
                    selected === kingdom.slug ? 'url(#map-glow)' : undefined
                  }
                  onClick={() => setSelected(kingdom.slug)}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'ArrowRight' ||
                      event.key === 'ArrowDown'
                    ) {
                      event.preventDefault();
                      selectByIndex(index + 1);
                    }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                      event.preventDefault();
                      selectByIndex(index - 1);
                    }
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelected(kingdom.slug);
                    }
                  }}
                  role="button"
                  stroke={selected === kingdom.slug ? '#c6a85d' : '#777064'}
                  strokeWidth="2"
                  tabIndex={0}
                />
                <text
                  aria-hidden="true"
                  fill="#e8dfca"
                  fontSize="15"
                  letterSpacing="2"
                  textAnchor="middle"
                  x={kingdom.mapLabel.x}
                  y={kingdom.mapLabel.y}
                >
                  {kingdom.title.toUpperCase()}
                </text>
                <text
                  aria-hidden="true"
                  fill="#c6a85d"
                  fontSize="25"
                  textAnchor="middle"
                  x={kingdom.mapLabel.x}
                  y={kingdom.mapLabel.y - 27}
                >
                  {kingdom.sigil}
                </text>
              </g>
            ))}
          </g>
        </svg>
        <p
          className="bg-coal-950/90 text-parchment-200/70 absolute right-4 bottom-4 max-w-64 border border-stone-600/30 p-3 text-xs"
          role="status"
        >
          {active ? `${active.title}: ${active.climate}` : 'Selecione um reino'}
        </p>
      </section>

      <aside className="space-y-6">
        <div className="border border-stone-600/30 p-5">
          <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
            Camadas do mapa
          </p>
          <label className="mt-4 flex min-h-11 items-center gap-3">
            <input defaultChecked type="checkbox" /> Fronteiras e regiões
          </label>
          {['Cidades', 'Ruínas', 'Rotas', 'Batalhas', 'Criaturas'].map(
            (layer) => (
              <label
                className="text-parchment-200/35 flex min-h-11 items-center gap-3"
                key={layer}
              >
                <input disabled type="checkbox" /> {layer} — futura
              </label>
            ),
          )}
        </div>
        <div>
          <p className="text-aged-gold-500 mb-3 text-xs tracking-widest uppercase">
            Legenda e alternativa acessível
          </p>
          <ul className="grid gap-2">
            {kingdoms.map((kingdom, index) => (
              <li key={kingdom.slug}>
                <button
                  aria-label={`Selecionar na lista: ${kingdom.title}`}
                  aria-pressed={selected === kingdom.slug}
                  className="aria-pressed:border-aged-gold-500 aria-pressed:text-ivory-100 text-parchment-200/65 flex min-h-14 w-full items-center justify-between border border-stone-600/30 px-4 text-left"
                  onClick={() => setSelected(kingdom.slug)}
                >
                  <span>
                    <span className="text-aged-gold-500 mr-3">
                      {kingdom.numeral}
                    </span>
                    {kingdom.title}
                  </span>
                  <span aria-hidden="true">{index + 1}</span>
                </button>
              </li>
            ))}
          </ul>
          {active ? (
            <Link
              className="bg-aged-gold-500 text-coal-950 mt-4 flex min-h-12 items-center justify-center px-4 text-xs font-bold tracking-widest uppercase"
              href={`/world/kingdoms/${active.slug}`}
            >
              Abrir arquivo do reino
            </Link>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
