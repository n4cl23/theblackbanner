'use client';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import type { Chronicle } from '@/features/lore/domain/lore-schema';

export function ChronicleReader({ chronicle }: { chronicle: Chronicle }) {
  const storageKey = `asterheim:chronicle:${chronicle.slug}:chapter:v1`;
  const storageEvent = `${storageKey}:changed`;
  const chapter = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(storageEvent, onStoreChange);
      return () => window.removeEventListener(storageEvent, onStoreChange);
    },
    () => {
      const stored = Number(window.localStorage.getItem(storageKey));
      return Number.isInteger(stored) &&
        stored >= 0 &&
        stored < chronicle.chapters.length
        ? stored
        : 0;
    },
    () => 0,
  );
  function select(index: number) {
    window.localStorage.setItem(storageKey, String(index));
    window.dispatchEvent(new Event(storageEvent));
    document.getElementById('chapter-reading')?.focus();
  }
  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft' && chapter > 0) select(chapter - 1);
    if (event.key === 'ArrowRight' && chapter < chronicle.chapters.length - 1)
      select(chapter + 1);
  }
  const current = chronicle.chapters[chapter]!;
  return (
    <div
      aria-label="Leitor de crônica"
      className="focus-visible:outline-aged-gold-500 focus-visible:outline-2"
      onKeyDown={onKeyDown}
      role="region"
      tabIndex={0}
    >
      <div aria-label="Progresso de leitura" className="mb-10">
        <p className="text-xs uppercase">
          Capítulo {chapter + 1} de {chronicle.chapters.length}
        </p>
        <div aria-hidden className="mt-3 h-px bg-stone-600/40">
          <div
            className="bg-aged-gold-500 h-px transition-[width]"
            style={{
              width: `${((chapter + 1) / chronicle.chapters.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <article
        className="mx-auto max-w-[45rem]"
        id="chapter-reading"
        tabIndex={-1}
      >
        <p className="text-aged-gold-500 text-center text-xs uppercase">
          Leitura estimada · {chronicle.estimatedMinutes} min
        </p>
        <h2 className="font-display my-8 text-center text-5xl uppercase">
          {current.title}
        </h2>
        {current.body.map((paragraph) => (
          <p
            className="text-parchment-200/80 first-letter:font-display mb-7 text-lg leading-8 first-letter:text-5xl"
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </article>
      <nav
        aria-label="Capítulos da crônica"
        className="mx-auto mt-14 flex max-w-[45rem] justify-between border-t border-stone-600/30 pt-6"
      >
        <button
          className="min-h-12 px-4 disabled:opacity-30"
          disabled={chapter === 0}
          onClick={() => select(chapter - 1)}
        >
          ← Capítulo anterior
        </button>
        <button
          className="min-h-12 px-4 disabled:opacity-30"
          disabled={chapter === chronicle.chapters.length - 1}
          onClick={() => select(chapter + 1)}
        >
          Próximo capítulo →
        </button>
      </nav>
      <p className="text-parchment-200/45 mt-8 text-center text-xs">
        Use ← e → para navegar. O marcador fica salvo apenas neste dispositivo.
      </p>
      {chronicle.relatedArticleSlugs.length ? (
        <div className="mt-12 text-center">
          <Link
            className="underline"
            href={`/lore/${chronicle.relatedArticleSlugs[0]}`}
          >
            Abrir referência relacionada
          </Link>
        </div>
      ) : null}
    </div>
  );
}
