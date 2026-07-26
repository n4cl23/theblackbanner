import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

type Tone = 'gold' | 'blood' | 'iron';
type Size = 'sm' | 'md' | 'lg';

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 border font-semibold tracking-[0.12em] uppercase transition-[color,background-color,border-color,transform] duration-200 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-40';
const buttonTone: Record<Tone, string> = {
  gold: 'border-aged-gold-500/70 bg-aged-gold-500 text-coal-950 hover:bg-parchment-200',
  blood: 'border-blood-700 bg-blood-700 text-ivory-100 hover:bg-ember-600',
  iron: 'border-stone-600/50 bg-iron-800 text-ivory-100 hover:border-aged-gold-500/60',
};
const buttonSize: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export function Button({
  className,
  tone = 'iron',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; size?: Size }) {
  return (
    <button
      className={cn(buttonBase, buttonTone[tone], buttonSize[size], className)}
      {...props}
    />
  );
}

export function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'bg-iron-800 text-ivory-100 hover:border-aged-gold-500/70 hover:text-aged-gold-500 inline-grid size-11 place-items-center border border-stone-600/50 transition-colors',
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  tone = 'iron',
  size = 'md',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  tone?: Tone;
  size?: Size;
}) {
  return (
    <Link
      className={cn(buttonBase, buttonTone[tone], buttonSize[size], className)}
      {...props}
    />
  );
}

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-aged-gold-500 text-xs font-bold tracking-[0.28em] uppercase',
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <header
      className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-ivory-100 mt-3 text-3xl leading-tight tracking-wide sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-parchment-200/70 mt-5 max-w-2xl text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <hr className={cn('border-0 border-t border-stone-600/30', className)} />
  );
}

export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn('text-aged-gold-500/70 flex items-center gap-4', className)}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
      <span className="size-2 rotate-45 border border-current" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12',
        className,
      )}
      {...props}
    />
  );
}

export function FullBleedSection({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden py-20 sm:py-28',
        className,
      )}
      {...props}
    />
  );
}

export function Surface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-coal-900/90 border border-stone-600/25 p-6 shadow-2xl',
        className,
      )}
      {...props}
    />
  );
}

export function LorePanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="border-aged-gold-500/60 bg-coal-900/75 border-l-2 p-6 shadow-2xl">
      <Eyebrow>{title}</Eyebrow>
      <div className="text-parchment-200/80 mt-4 text-sm">{children}</div>
    </aside>
  );
}

export function QuoteBlock({ quote, cite }: { quote: string; cite: string }) {
  return (
    <figure className="border-y border-stone-600/30 py-8">
      <blockquote className="font-subtitle text-parchment-200 text-2xl leading-relaxed italic">
        “{quote}”
      </blockquote>
      <figcaption className="text-aged-gold-500 mt-5 text-xs tracking-[0.2em] uppercase">
        — {cite}
      </figcaption>
    </figure>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="text-parchment-200/75 border border-stone-600/40 px-3 py-1 text-xs tracking-wide">
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = 'gold',
}: {
  children: ReactNode;
  tone?: 'gold' | 'blood';
}) {
  return (
    <span
      className={cn(
        'px-2.5 py-1 text-[0.68rem] font-bold tracking-wider uppercase',
        tone === 'gold'
          ? 'bg-aged-gold-500 text-coal-950'
          : 'bg-blood-700 text-ivory-100',
      )}
    >
      {children}
    </span>
  );
}

export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-parchment-200/60 flex flex-wrap items-center gap-2 text-xs tracking-wider uppercase">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={item.label}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link className="hover:text-aged-gold-500" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="bg-coal-950 text-ivory-100 pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-max max-w-52 -translate-x-1/2 border border-stone-600/50 px-3 py-2 text-xs opacity-0 shadow-xl transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export function Accordion({
  items,
}: {
  items: Array<{ title: string; content: ReactNode }>;
}) {
  return (
    <div className="divide-y divide-stone-600/30 border-y border-stone-600/30">
      {items.map((item) => (
        <details className="group py-1" key={item.title}>
          <summary className="text-ivory-100 flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold marker:content-none">
            {item.title}
            <span
              aria-hidden="true"
              className="text-aged-gold-500 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-parchment-200/70 pb-5 text-sm">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}

export function MediaFrame({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="border border-stone-600/30 bg-black p-2 shadow-2xl">
      <div className="relative overflow-hidden border border-stone-600/20">
        {children}
      </div>
      {caption ? (
        <figcaption className="text-parchment-200/55 px-2 pt-3 text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function VideoFrame({
  title,
  src,
  captionsSrc,
}: {
  title: string;
  src?: string;
  captionsSrc?: string;
}) {
  return (
    <MediaFrame caption={title}>
      {src ? (
        <video
          className="aspect-video w-full bg-black"
          controls
          preload="metadata"
          src={src}
        >
          {captionsSrc ? (
            <track
              default
              kind="captions"
              label="English"
              src={captionsSrc}
              srcLang="en"
            />
          ) : null}
        </video>
      ) : (
        <div className="from-iron-800 text-parchment-200/50 grid aspect-video place-items-center bg-gradient-to-br to-black text-sm">
          Video placeholder
        </div>
      )}
    </MediaFrame>
  );
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="text-parchment-200/70 flex min-h-28 items-center justify-center gap-3 text-sm"
      role="status"
    >
      <span
        className="border-aged-gold-500 size-3 rotate-45 border motion-safe:animate-pulse"
        aria-hidden="true"
      />
      {label}
      <span className="sr-only">…</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-stone-600/40 p-8 text-center">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="text-parchment-200/60 mt-2 text-sm">{description}</p>
    </div>
  );
}

export function ErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="border-blood-700 bg-blood-700/10 border-l-2 p-6"
      role="alert"
    >
      <h3 className="text-ivory-100 font-semibold">{title}</h3>
      <p className="text-parchment-200/70 mt-2 text-sm">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-iron-800 block h-4 animate-pulse motion-reduce:animate-none',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SkipLink({
  href = '#main-content',
  label = 'Skip to content',
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a
      className="bg-aged-gold-500 text-coal-950 fixed top-3 left-3 z-[100] -translate-y-20 px-4 py-3 font-bold transition-transform focus:translate-y-0"
      href={href}
    >
      {label}
    </a>
  );
}
