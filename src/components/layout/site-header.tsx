'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';

const navigation = [
  { label: 'Asterheim', href: '#asterheim' },
  { label: 'Reinos', href: '#kingdoms' },
  { label: 'Personagens', href: '#characters' },
  { label: 'Bestiário', href: '#bestiary' },
  { label: 'Coleções', href: '#collections' },
] as const;

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        solid || menuOpen
          ? 'bg-coal-950/95 border-stone-600/30 backdrop-blur-md'
          : 'border-transparent bg-gradient-to-b from-black/80 to-transparent',
      )}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link
          aria-label="The Black Banner V2 — Home"
          className="font-display text-ivory-100 text-sm tracking-[0.2em] uppercase sm:text-base"
          href="/"
        >
          The Black Banner
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-parchment-200/70 hover:text-aged-gold-500 text-xs font-semibold tracking-[0.14em] uppercase transition-colors"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            aria-label="Language selector — prepared for future localization"
            className="text-parchment-200/70 min-h-11 border-l border-stone-600/30 px-4 text-xs tracking-wider uppercase"
            type="button"
          >
            PT <span aria-hidden="true">⌄</span>
          </button>
          <Link
            aria-label="Search — coming in a future sprint"
            className="text-parchment-200/70 hover:text-aged-gold-500 grid size-11 place-items-center text-lg"
            href="#editorial"
          >
            ⌕
          </Link>
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          className="grid size-11 place-items-center border border-stone-600/40 text-xl lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="bg-coal-950 border-t border-stone-600/30 px-5 py-6 lg:hidden"
          id="mobile-navigation"
        >
          <ul className="grid gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-parchment-200/80 flex min-h-12 items-center border-b border-stone-600/20 text-sm tracking-wider uppercase"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="text-parchment-200/60 mt-5 flex items-center justify-between text-xs tracking-wider uppercase">
            <span>Idioma: PT</span>
            <Link href="#editorial" onClick={() => setMenuOpen(false)}>
              Busca futura
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
