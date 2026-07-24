import Image from 'next/image';
import type { HTMLAttributes, ReactNode } from 'react';

import {
  Container,
  Eyebrow,
  OrnamentalDivider,
} from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

export function RuneMarker({
  symbol = 'ᚨ',
  label,
}: {
  symbol?: string;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className="border-aged-gold-500/55 bg-coal-950 inline-grid size-12 rotate-45 place-items-center border shadow-lg"
    >
      <span
        aria-hidden="true"
        className="font-display text-aged-gold-500 -rotate-45 text-xl"
      >
        {symbol}
      </span>
    </span>
  );
}

export function KingdomSigil({
  name,
  mark = '✦',
}: {
  name: string;
  mark?: string;
}) {
  return (
    <figure className="inline-flex flex-col items-center gap-3">
      <div
        className="border-aged-gold-500/45 text-aged-gold-500 grid size-20 place-items-center border bg-[var(--texture-metal)] text-3xl shadow-2xl"
        aria-hidden="true"
      >
        {mark}
      </div>
      <figcaption className="text-parchment-200/65 text-xs tracking-[0.2em] uppercase">
        {name}
      </figcaption>
    </figure>
  );
}

export function LoreChapterHeading({
  chapter,
  title,
}: {
  chapter: string;
  title: string;
}) {
  return (
    <header className="max-w-3xl">
      <Eyebrow>{chapter}</Eyebrow>
      <div className="mt-4 flex items-center gap-5">
        <RuneMarker label="Chapter rune" />
        <h2 className="font-display text-3xl leading-tight sm:text-5xl">
          {title}
        </h2>
      </div>
      <OrnamentalDivider className="mt-7 max-w-xl" />
    </header>
  );
}

export function CinematicSection({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'bg-coal-900 relative isolate min-h-[32rem] overflow-hidden border-y border-stone-600/20 py-24',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_35%,rgba(168,61,31,0.18),transparent_28%),linear-gradient(115deg,rgba(5,5,5,0.3),rgba(5,5,5,0.94))]"
      />
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
            {title}
          </h2>
          <div className="text-parchment-200/70 mt-7">{children}</div>
        </div>
      </Container>
    </section>
  );
}

export function FramedArtwork({
  children,
  caption,
}: {
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className="border-aged-gold-500/35 relative border bg-black p-3 shadow-[var(--shadow-deep)] before:pointer-events-none before:absolute before:inset-1 before:border before:border-stone-600/25">
      <div className="relative min-h-56 overflow-hidden border border-stone-600/30">
        {children}
      </div>
      <figcaption className="text-parchment-200/55 px-2 pt-4 text-center text-xs tracking-wider uppercase">
        {caption}
      </figcaption>
    </figure>
  );
}

export function ParchmentBlock({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-parchment-200 text-coal-950 before:border-bronze-600/30 relative p-7 shadow-2xl before:pointer-events-none before:absolute before:inset-2 before:border',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MetallicNavigation({
  items,
}: {
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <nav
      aria-label="Metallic navigation"
      className="bg-iron-800/80 border-y border-stone-600/35 bg-[var(--texture-metal)]"
    >
      <ul className="flex flex-wrap items-center justify-center">
        {items.map((item) => (
          <li key={item.label}>
            <a
              className="text-parchment-200/70 hover:bg-coal-950 hover:text-aged-gold-500 flex min-h-12 items-center border-x border-stone-600/20 px-6 text-xs font-bold tracking-[0.18em] uppercase transition-colors"
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BannerTitleTreatment({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="before:bg-aged-gold-500/50 relative py-14 text-center before:absolute before:top-0 before:left-1/2 before:h-10 before:w-px">
      <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
      <h1 className="font-display text-ivory-100 mt-5 text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.88] tracking-[0.06em] uppercase text-shadow-lg">
        {title}
      </h1>
      <OrnamentalDivider className="mx-auto mt-8 max-w-xl" />
      <p className="font-subtitle text-parchment-200/65 mt-6 text-xl italic">
        {subtitle}
      </p>
    </header>
  );
}

export function CinematicHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  tone = 'ash',
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  tone?: 'ash' | 'forest' | 'iron' | 'storm' | 'void';
}) {
  return (
    <section
      className={`cinematic-hero cinematic-hero-${tone} relative isolate min-h-[clamp(32rem,72vh,52rem)] overflow-hidden`}
    >
      {image ? (
        <Image
          alt={imageAlt ?? ''}
          className="cinematic-hero-media object-cover"
          fill
          priority
          sizes="100vw"
          src={image}
        />
      ) : null}
      <div aria-hidden="true" className="cinematic-hero-atmosphere" />
      <Container className="relative flex min-h-[clamp(32rem,72vh,52rem)] items-end py-16 sm:py-24">
        <header className="max-w-5xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="cinematic-title font-display text-ivory-100 mt-5 max-w-[13ch] text-[clamp(3.25rem,9vw,8rem)] leading-[0.86] uppercase">
            {title}
          </h1>
          <p className="text-parchment-200/75 mt-7 max-w-[64ch] text-lg sm:text-xl">
            {description}
          </p>
        </header>
      </Container>
    </section>
  );
}
