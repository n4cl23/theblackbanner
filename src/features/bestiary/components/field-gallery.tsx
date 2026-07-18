'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from '@/components/ui/interactive';
import type { FieldEvidence } from '@/features/bestiary/data/bestiary-presentation.mock';

export function FieldGallery({ items }: { items: readonly FieldEvidence[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight')
        setActive((value) =>
          value === null ? null : (value + 1) % items.length,
        );
      if (event.key === 'ArrowLeft')
        setActive((value) =>
          value === null ? null : (value - 1 + items.length) % items.length,
        );
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, items.length]);
  const selected = active === null ? null : items[active];
  const currentIndex = active ?? 0;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <button
            aria-label={`Abrir evidência: ${item.caption}`}
            className="group text-left"
            key={item.id}
            onClick={() => {
              setActive(index);
              setZoomed(false);
            }}
          >
            <span className="relative block aspect-[4/3] overflow-hidden border border-stone-600/30">
              <ImageWithFallback
                alt={item.caption}
                className="object-cover opacity-65 transition group-hover:scale-105 group-hover:opacity-90"
                fallback={<span>Evidência indisponível</span>}
                fill
                sizes="(min-width:768px) 35vw, 100vw"
                src={item.image}
              />
            </span>
            <span className="mt-3 block text-xs">
              <span className="text-aged-gold-500 uppercase">
                {item.category}
              </span>{' '}
              · {item.origin}
            </span>
          </button>
        ))}
      </div>
      {selected ? (
        <div
          aria-label="Visualizador de evidência"
          aria-modal="true"
          className="fixed inset-0 z-[80] grid place-items-center bg-black/95 p-4"
          role="dialog"
        >
          <button
            aria-label="Fechar galeria"
            className="absolute top-5 right-5 z-10 size-12 border border-stone-600/50 text-2xl"
            onClick={() => setActive(null)}
            ref={closeButtonRef}
          >
            ×
          </button>
          <button
            aria-label={zoomed ? 'Reduzir evidência' : 'Ampliar evidência'}
            className="relative h-[70vh] w-full max-w-6xl overflow-auto"
            onClick={() => setZoomed((value) => !value)}
          >
            <ImageWithFallback
              alt={selected.caption}
              className={`object-contain transition-transform ${zoomed ? 'scale-150' : 'scale-100'}`}
              fallback={<span>Evidência indisponível</span>}
              fill
              sizes="100vw"
              src={selected.image}
            />
          </button>
          <div className="max-w-3xl text-center">
            <p>{selected.caption}</p>
            <p className="text-parchment-200/45 mt-2 text-xs">
              {selected.category} · {selected.origin} · {selected.narrativeDate}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                aria-label="Evidência anterior"
                className="min-h-11 border border-stone-600/40 px-4"
                onClick={() =>
                  setActive((currentIndex - 1 + items.length) % items.length)
                }
              >
                ← Anterior
              </button>
              <button
                aria-label="Próxima evidência"
                className="min-h-11 border border-stone-600/40 px-4"
                onClick={() => setActive((currentIndex + 1) % items.length)}
              >
                Próxima →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
