'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { publicNavigation } from '@/config/navigation';
import { cn } from '@/lib/cn';

export function SiteHeader({
  position = 'fixed',
}: {
  position?: 'fixed' | 'sticky';
}) {
  const [solid, setSolid] = useState(position === 'sticky');
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position === 'sticky') return;
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [position]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        position === 'fixed' ? 'fixed' : 'sticky',
        'inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        solid || menuOpen
          ? 'bg-coal-950/95 border-stone-600/30 backdrop-blur-md'
          : 'border-transparent bg-gradient-to-b from-black/80 to-transparent',
      )}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-[90rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          aria-label="The Black Banner V2 — Início"
          className="font-display text-ivory-100 text-sm tracking-[0.2em] uppercase sm:text-base"
          href="/"
        >
          The Black Banner
        </Link>
        <nav aria-label="Main navigation" className="hidden xl:block">
          <ul className="flex items-center gap-5">
            {publicNavigation.map((item) => (
              <li className="group relative" key={item.href}>
                <Link
                  className="text-parchment-200/70 hover:text-aged-gold-500 focus-visible:text-aged-gold-500 flex min-h-11 items-center text-xs font-semibold tracking-[0.12em] uppercase"
                  href={item.href}
                >
                  {item.label}
                </Link>
                {'children' in item ? (
                  <div className="bg-coal-950 invisible absolute top-full left-1/2 min-w-52 -translate-x-1/2 border border-stone-600/35 p-2 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        className="text-parchment-200/65 hover:bg-iron-800 hover:text-aged-gold-500 focus-visible:bg-iron-800 block min-h-11 px-4 py-3 text-xs tracking-wider uppercase"
                        href={child.href}
                        key={`${child.href}-${child.label}`}
                        title={
                          'description' in child ? child.description : undefined
                        }
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <Link
            aria-label="Selecionar idioma"
            className="text-parchment-200/70 grid min-h-11 place-items-center border-l border-stone-600/30 px-4 text-xs uppercase"
            href="/pt-br"
          >
            PT
          </Link>
          <Link
            aria-label="Busca"
            className="text-parchment-200/70 hover:text-aged-gold-500 grid size-11 place-items-center text-lg"
            href="/lore#search"
          >
            <span aria-hidden="true">⌕</span>
          </Link>
        </div>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          className="grid size-11 place-items-center border border-stone-600/40 text-xl xl:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>
      {menuOpen ? (
        <div
          className="fixed inset-0 top-20 bg-black/70 xl:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMenuOpen(false);
          }}
        >
          <div
            className="bg-coal-950 ml-auto h-full w-full max-w-md overflow-y-auto border-l border-stone-600/30 px-5 py-5"
            ref={panelRef}
          >
            <nav aria-label="Mobile navigation" id="mobile-navigation">
              <ul className="grid gap-2">
                {publicNavigation.map((item) => (
                  <li
                    className="border-b border-stone-600/25 pb-2"
                    key={item.href}
                  >
                    <Link
                      className="text-ivory-100 flex min-h-12 items-center text-sm font-semibold tracking-wider uppercase"
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {'children' in item ? (
                      <ul className="grid grid-cols-2 gap-1 pb-2">
                        {item.children.map((child) => (
                          <li key={`${child.href}-${child.label}`}>
                            <Link
                              className="text-parchment-200/60 flex min-h-11 items-center px-2 text-xs uppercase"
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 flex gap-5 text-xs uppercase">
              <Link href="/pt-br" onClick={() => setMenuOpen(false)}>
                Idioma: PT
              </Link>
              <Link href="/lore#search" onClick={() => setMenuOpen(false)}>
                Busca
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
