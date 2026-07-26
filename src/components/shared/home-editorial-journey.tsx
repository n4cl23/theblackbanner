'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type KingdomJourneyItem = {
  artwork: string;
  description: string;
  position: string;
  signature: string;
  slug: string;
  title: string;
};

const chapters = [
  { id: 'chapter-banner', number: '01', title: 'The Black Banner' },
  { id: 'asterheim', number: '02', title: 'Asterheim' },
  { id: 'chapter-collections', number: '03', title: 'Collections' },
  { id: 'chapter-miniatures', number: '04', title: 'Miniatures' },
  { id: 'chapter-atlas-lore', number: '05', title: 'Atlas and Lore' },
  { id: 'chapter-forge', number: '06', title: 'The Forge' },
] as const;

export function HomeChapterProgress() {
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const elements = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const index = chapters.findIndex(
          (chapter) => chapter.id === visible.target.id,
        );
        if (index >= 0) setActiveChapter(index);
      },
      { rootMargin: '-35% 0px -45%', threshold: [0, 0.1, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const chapter = chapters[activeChapter] ?? chapters[0];

  return (
    <nav
      aria-label="Capítulos da página inicial"
      className="home-chapter-progress"
    >
      <span className="home-chapter-progress__number">{chapter.number}</span>
      <span aria-hidden="true" className="home-chapter-progress__rule" />
      <span className="home-chapter-progress__total">06</span>
      <span className="sr-only">{chapter.title}</span>
    </nav>
  );
}

export function KingdomEditorialJourney({
  kingdoms,
}: {
  kingdoms: readonly KingdomJourneyItem[];
}) {
  const [activeKingdom, setActiveKingdom] = useState(0);
  const checkpoints = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isFinite(index)) setActiveKingdom(index);
      },
      { rootMargin: '-42% 0px -42%', threshold: [0, 0.25, 0.6] },
    );

    checkpoints.current.forEach((checkpoint) => {
      if (checkpoint) observer.observe(checkpoint);
    });

    return () => observer.disconnect();
  }, []);

  const active = kingdoms[activeKingdom] ?? kingdoms[0];
  if (!active) return null;

  return (
    <>
      <div className="kingdom-journey">
        <div className="kingdom-journey__sticky">
          <div
            aria-live="polite"
            className="kingdom-journey__copy"
            key={`copy-${active.slug}`}
          >
            <p className="kingdom-journey__count">
              {String(activeKingdom + 1).padStart(2, '0')} / 06
            </p>
            <h3 className="sr-only">{active.title}</h3>
            <p className="sr-only">{active.signature}</p>
            <p className="kingdom-journey__description">
              {active.description}
            </p>
            <Link
              className="kingdom-journey__cta"
              href={`/pt-br/atlas/reinos/${active.slug}`}
            >
              Explorar Reino <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            className="kingdom-journey__art"
            key={`art-${active.slug}`}
          >
            <Image
              alt={`Key art oficial de ${active.title}: ${active.signature}`}
              className={active.position}
              fill
              priority={activeKingdom === 0}
              sizes="(max-width: 1023px) 100vw, 60vw"
              src={active.artwork}
            />
          </div>

          <div
            aria-label="Selecionar reino"
            className="kingdom-journey__index"
            role="group"
          >
            {kingdoms.map((kingdom, index) => (
              <button
                aria-label={`Ir para ${kingdom.title}`}
                aria-pressed={index === activeKingdom}
                className="kingdom-journey__index-button"
                key={kingdom.slug}
                onClick={() =>
                  checkpoints.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }
                type="button"
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="kingdom-journey__checkpoints">
          {kingdoms.map((kingdom, index) => (
            <div
              className="kingdom-journey__checkpoint"
              data-index={index}
              key={kingdom.slug}
              ref={(element) => {
                checkpoints.current[index] = element;
              }}
            />
          ))}
        </div>
      </div>

      <div className="kingdom-journey-mobile">
        {kingdoms.map((kingdom, index) => (
          <article className="kingdom-journey-mobile__item" key={kingdom.slug}>
            <p className="kingdom-journey__count">
              {String(index + 1).padStart(2, '0')} / 06
            </p>
            <div className="kingdom-journey-mobile__art">
              <Image
                alt={`Key art oficial de ${kingdom.title}: ${kingdom.signature}`}
                className={kingdom.position}
                fill
                sizes="100vw"
                src={kingdom.artwork}
              />
            </div>
            <h3 className="sr-only">{kingdom.title}</h3>
            <p className="sr-only">{kingdom.signature}</p>
            <p className="kingdom-journey-mobile__description">
              {kingdom.description}
            </p>
            <Link
              className="kingdom-journey__cta"
              href={`/pt-br/atlas/reinos/${kingdom.slug}`}
            >
              Explorar Reino <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
