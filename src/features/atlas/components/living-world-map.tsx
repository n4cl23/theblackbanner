"use client";

import Link from "next/link";
import { useMemo, useState, type PointerEvent } from "react";

type LivingKingdom = {
  slug: string;
  name: string;
  signature: string;
  image: string;
  force: string;
};

type MapLayer = "kingdoms" | "creatures" | "characters" | "relics" | "chronicles";

type MapGeometry = {
  path: string;
  label: { x: number; y: number };
  visual: string;
};

const mapGeometry: Record<string, MapGeometry> = {
  "frost-kingdom": {
    path: "M170 120 L420 76 L557 177 L500 326 L282 348 L122 250 Z",
    label: { x: 332, y: 220 },
    visual: "frost",
  },
  stormreach: {
    path: "M557 177 L760 82 L1018 125 L1168 265 L1006 368 L753 326 L500 326 Z",
    label: { x: 834, y: 223 },
    visual: "storm",
  },
  ironhold: {
    path: "M122 250 L282 348 L500 326 L650 445 L555 603 L300 624 L111 486 Z",
    label: { x: 365, y: 472 },
    visual: "iron",
  },
  "elder-forest": {
    path: "M500 326 L753 326 L1006 368 L967 553 L755 627 L555 603 L650 445 Z",
    label: { x: 771, y: 470 },
    visual: "forest",
  },
  "kingdom-of-the-abyss": {
    path: "M300 624 L555 603 L755 627 L692 785 L431 818 L238 740 Z",
    label: { x: 489, y: 703 },
    visual: "abyss",
  },
  "scorched-wastes": {
    path: "M967 553 L1120 512 L1251 633 L1189 791 L925 821 L692 785 L755 627 Z",
    label: { x: 978, y: 691 },
    visual: "scorched",
  },
};

const layerLabels: Record<MapLayer, string> = {
  kingdoms: "Reinos",
  creatures: "Criaturas",
  characters: "Personagens",
  relics: "Relíquias",
  chronicles: "Crônicas",
};

const emptyPointsOfInterest: readonly {
  id: string;
  type: "capital" | "fortress" | "lighthouse" | "forest" | "pass" | "temple";
  x: number;
  y: number;
  kingdomSlug: string;
  label: string;
}[] = [];

export function LivingWorldMap({
  kingdoms,
  locale,
}: {
  kingdoms: readonly LivingKingdom[];
  locale: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [layers, setLayers] = useState<Set<MapLayer>>(
    () => new Set<MapLayer>(["kingdoms"]),
  );
  const activeSlug = hovered ?? selected;
  const activeKingdom = useMemo(
    () => kingdoms.find((kingdom) => kingdom.slug === activeSlug) ?? null,
    [activeSlug, kingdoms],
  );

  function toggleLayer(layer: MapLayer) {
    if (layer !== "kingdoms") return;
    setLayers((current) => {
      const next = new Set(current);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("a, button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    });
  }

  return (
    <section className="living-atlas" aria-labelledby="living-atlas-title">
      <header className="living-atlas__header">
        <p>Arquivo dos Cartógrafos Reais</p>
        <h1 id="living-atlas-title">Mapa Vivo de Asterheim</h1>
        <span>Fragmento continental recuperado · Registro VI</span>
      </header>

      <div
        className="living-atlas__viewport"
        onPointerDown={beginDrag}
        onPointerMove={(event) => {
          if (!dragStart) return;
          setOffset({
            x: event.clientX - dragStart.x,
            y: event.clientY - dragStart.y,
          });
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          setDragStart(null);
        }}
        onPointerCancel={() => setDragStart(null)}
      >
        <div className="living-atlas__coordinates" aria-hidden="true">
          <span>47° 12′ N</span>
          <span>ASTERHEIM · VI</span>
          <span>09° 38′ E</span>
        </div>

        <div
          className="living-atlas__world"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          <svg
            className="living-atlas__map"
            viewBox="0 0 1360 900"
            role="img"
            aria-label="Seis reinos navegáveis no mapa de Asterheim"
          >
            <defs>
              <filter id="living-map-grain">
                <feTurbulence
                  baseFrequency="0.72"
                  numOctaves="3"
                  seed="17"
                  type="fractalNoise"
                />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 0.1" />
                </feComponentTransfer>
              </filter>
              <filter id="living-map-light">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {kingdoms.map((kingdom) => (
                <pattern
                  id={`living-art-${kingdom.slug}`}
                  width="1"
                  height="1"
                  key={kingdom.slug}
                  patternContentUnits="objectBoundingBox"
                >
                  <image
                    href={kingdom.image}
                    width="1"
                    height="1"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              ))}
              <radialGradient id="living-fog" cx="50%" cy="45%" r="70%">
                <stop offset="0" stopColor="#b7ac92" stopOpacity="0.04" />
                <stop offset="0.62" stopColor="#0b0b09" stopOpacity="0.48" />
                <stop offset="1" stopColor="#040403" stopOpacity="0.92" />
              </radialGradient>
            </defs>

            <path
              className="living-atlas__charted-border"
              d="M72 71 L1288 48 L1317 841 L51 854 Z"
            />

            {kingdoms.map((kingdom, index) => {
              const geometry = mapGeometry[kingdom.slug];
              if (!geometry) return null;
              const isActive = activeSlug === kingdom.slug;
              const isMuted = Boolean(activeSlug && !isActive);

              return (
                <g
                  className="living-atlas__territory"
                  data-active={isActive || undefined}
                  data-muted={isMuted || undefined}
                  data-visual={geometry.visual}
                  key={kingdom.slug}
                  onBlur={() => setHovered(null)}
                  onFocus={() => setHovered(kingdom.slug)}
                  onMouseEnter={() => setHovered(kingdom.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(kingdom.slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(kingdom.slug);
                    }
                    if (event.key.startsWith("Arrow")) {
                      event.preventDefault();
                      const direction =
                        event.key === "ArrowRight" || event.key === "ArrowDown"
                          ? 1
                          : -1;
                      const next =
                        kingdoms[
                          (index + direction + kingdoms.length) % kingdoms.length
                        ];
                      setSelected(next?.slug ?? null);
                    }
                  }}
                  role="button"
                  tabIndex={layers.has("kingdoms") ? 0 : -1}
                  aria-label={`Explorar ${kingdom.name}`}
                >
                  <path
                    className="living-atlas__territory-art"
                    d={geometry.path}
                    fill={`url(#living-art-${kingdom.slug})`}
                  />
                  <path
                    className="living-atlas__territory-wash"
                    d={geometry.path}
                  />
                  <path
                    className="living-atlas__territory-fog"
                    d={geometry.path}
                  />
                  <text
                    className="living-atlas__territory-number"
                    x={geometry.label.x}
                    y={geometry.label.y - 31}
                    textAnchor="middle"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </text>
                  <text
                    className="living-atlas__territory-name"
                    x={geometry.label.x}
                    y={geometry.label.y}
                    textAnchor="middle"
                    aria-hidden="true"
                  >
                    {kingdom.name}
                  </text>
                </g>
              );
            })}

            <g className="living-atlas__routes" aria-hidden="true">
              <path d="M335 220 C490 268 618 206 834 223" />
              <path d="M365 472 C555 420 651 510 771 470" />
              <path d="M489 703 C663 652 820 724 978 691" />
            </g>

            {emptyPointsOfInterest.map((point) => (
              <g
                className="living-atlas__poi"
                key={point.id}
                transform={`translate(${point.x} ${point.y})`}
              >
                <circle r="5" />
                <text x="11" y="4">
                  {point.label}
                </text>
              </g>
            ))}

            <rect
              className="living-atlas__global-fog"
              width="1360"
              height="900"
              fill="url(#living-fog)"
              pointerEvents="none"
            />
            <rect
              width="1360"
              height="900"
              filter="url(#living-map-grain)"
              opacity="0.36"
              pointerEvents="none"
            />
          </svg>

          {kingdoms.map((kingdom) => {
            const geometry = mapGeometry[kingdom.slug];
            if (!geometry) return null;
            const isActive = activeSlug === kingdom.slug;

            return (
              <aside
                className="living-atlas__kingdom-note"
                data-visible={isActive || undefined}
                key={kingdom.slug}
                style={{
                  left: `${(geometry.label.x / 1360) * 100}%`,
                  top: `${(geometry.label.y / 900) * 100}%`,
                }}
                aria-live={isActive ? "polite" : "off"}
              >
                <p>{kingdom.signature}</p>
                <span>Força da Coroa · {kingdom.force}</span>
                <Link href={`/${locale}/atlas/reinos/${kingdom.slug}`}>
                  Entrar no Reino <span aria-hidden="true">→</span>
                </Link>
              </aside>
            );
          })}
        </div>

        <div className="living-atlas__compass" aria-hidden="true">
          <span>N</span>
          <i />
        </div>

        <div className="living-atlas__controls" aria-label="Controles do mapa">
          <button
            aria-label="Aumentar zoom"
            onClick={() => setScale((value) => Math.min(1.55, value + 0.1))}
          >
            +
          </button>
          <button
            aria-label="Diminuir zoom"
            onClick={() => setScale((value) => Math.max(0.88, value - 0.1))}
          >
            −
          </button>
          <button
            aria-label="Redefinir posição e zoom"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            ↺
          </button>
        </div>

        <fieldset className="living-atlas__layers">
          <legend>Camadas do Atlas</legend>
          {(Object.keys(layerLabels) as MapLayer[]).map((layer) => {
            const available = layer === "kingdoms";
            return (
              <label key={layer} data-available={available || undefined}>
                <input
                  type="checkbox"
                  checked={layers.has(layer)}
                  disabled={!available}
                  onChange={() => toggleLayer(layer)}
                />
                <span aria-hidden="true" />
                {layerLabels[layer]}
                {!available ? <small>Futura</small> : null}
              </label>
            );
          })}
        </fieldset>

        <p className="living-atlas__instruction">
          {activeKingdom
            ? `${activeKingdom.name} · ${activeKingdom.signature}`
            : "Mova o cursor ou use Tab para revelar os domínios"}
        </p>
      </div>
    </section>
  );
}
