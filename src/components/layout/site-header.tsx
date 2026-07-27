'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/config/i18n';
import { getPublicNavigation } from '@/config/navigation';
import { LanguageSwitcher } from '@/features/i18n/components/language-switcher';
import { localizedPath } from '@/features/i18n/data/route-registry';
import { cn } from '@/lib/cn';

export function SiteHeader({
  locale = 'pt-br',
  position = 'fixed',
}: {
  locale?: Locale;
  position?: 'fixed' | 'sticky';
}) {
  const [solid, setSolid] = useState(position === 'sticky');
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? '/';
  const publicNavigation = getPublicNavigation(locale);
  const labels = {
    'pt-br': {
      home: 'Início',
      main: 'Navegação principal',
      mobile: 'Navegação móvel',
      open: 'Abrir navegação',
      close: 'Fechar navegação',
      overview: 'Visão geral',
      search: 'Busca',
    },
    en: {
      home: 'Home',
      main: 'Main navigation',
      mobile: 'Mobile navigation',
      open: 'Open navigation',
      close: 'Close navigation',
      overview: 'Overview',
      search: 'Search',
    },
    es: {
      home: 'Inicio',
      main: 'Navegación principal',
      mobile: 'Navegación móvil',
      open: 'Abrir navegación',
      close: 'Cerrar navegación',
      overview: 'Vista general',
      search: 'Buscar',
    },
  }[locale];

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    if (href === '/') return pathname === '/';
    const path = href.split('#')[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
      <div className="relative mx-auto flex min-h-24 w-full max-w-[100rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <span
          aria-hidden="true"
          className="from-aged-gold-500/0 via-aged-gold-500/60 to-aged-gold-500/0 absolute inset-x-8 bottom-0 h-px bg-gradient-to-r"
        />
        <Link
          aria-label={`The Black Banner V2 — ${labels.home}`}
          className="group flex min-w-max items-center gap-3"
          href={localizedPath(locale)}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-10"
            height={40}
            priority
            src="/icons/black-banner-mark.svg"
            width={40}
          />
          <span>
            <strong className="font-display text-ivory-100 block text-sm tracking-[0.2em] uppercase sm:text-base">
              The Black Banner
            </strong>
            <span className="text-aged-gold-500/70 hidden text-[0.55rem] tracking-[0.28em] uppercase sm:block">
              Chronicles of Asterheim
            </span>
          </span>
        </Link>
        <nav aria-label={labels.main} className="hidden xl:block">
          <ul className="flex items-center gap-4">
            {publicNavigation.map((item) => (
              <li
                className="group relative"
                key={item.href}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    (event.currentTarget as HTMLElement).blur();
                    event.currentTarget
                      .querySelectorAll<HTMLElement>('a')
                      .forEach((link) => link.blur());
                  }
                }}
              >
                <Link
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'text-parchment-200/70 hover:text-aged-gold-500 focus-visible:text-aged-gold-500 relative flex min-h-11 items-center text-xs font-semibold tracking-[0.12em] uppercase',
                    isActive(item.href) &&
                      'text-ivory-100 after:bg-aged-gold-500 after:absolute after:inset-x-0 after:bottom-1 after:h-px',
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="bg-coal-950 invisible absolute top-full left-1/2 min-w-52 -translate-x-1/2 border border-stone-600/35 p-2 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        aria-current={isActive(child.href) ? 'page' : undefined}
                        className={cn(
                          'text-parchment-200/65 hover:bg-iron-800 hover:text-aged-gold-500 focus-visible:bg-iron-800 block min-h-11 border-l-2 border-transparent px-4 py-3 text-xs tracking-wider uppercase',
                          isActive(child.href) &&
                            'border-aged-gold-500 bg-iron-800 text-ivory-100',
                        )}
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
          <div className="border-l border-stone-600/30 px-3 text-[0.65rem] font-semibold tracking-wider uppercase">
            <LanguageSwitcher compact locale={locale} />
          </div>
          <Link
            aria-label={labels.search}
            className="text-parchment-200/70 hover:text-aged-gold-500 grid size-11 place-items-center text-lg"
            href={`${localizedPath(locale, 'lore')}#search`}
          >
            <span aria-hidden="true">⌕</span>
          </Link>
        </div>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? labels.close : labels.open}
          className="border-aged-gold-500/35 grid size-11 place-items-center border text-xl xl:hidden"
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
            <nav aria-label={labels.mobile} id="mobile-navigation">
              <ul className="grid gap-2">
                {publicNavigation.map((item) => (
                  <li
                    className="border-b border-stone-600/25 pb-2"
                    key={item.href}
                  >
                    {item.children?.length ? (
                      <details className="group/mobile">
                        <summary
                          className={cn(
                            'text-ivory-100 flex min-h-12 cursor-pointer list-none items-center justify-between border-l-2 border-transparent px-3 text-sm font-semibold tracking-wider uppercase marker:content-none',
                            isActive(item.href) &&
                              'border-aged-gold-500 bg-iron-800/70',
                          )}
                        >
                          {item.label}
                          <span
                            aria-hidden="true"
                            className="text-aged-gold-500 transition-transform group-open/mobile:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <ul className="grid grid-cols-2 gap-1 pb-2">
                          <li>
                            <Link
                              aria-current={
                                isActive(item.href) ? 'page' : undefined
                              }
                              className={cn(
                                'text-parchment-200/60 flex min-h-11 items-center border-l border-transparent px-3 text-xs uppercase',
                                isActive(item.href) &&
                                  'border-aged-gold-500 text-ivory-100',
                              )}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                            >
                              {labels.overview}
                            </Link>
                          </li>
                          {item.children.map((child) => (
                            <li key={`${child.href}-${child.label}`}>
                              <Link
                                aria-current={
                                  isActive(child.href) ? 'page' : undefined
                                }
                                className={cn(
                                  'text-parchment-200/60 flex min-h-11 items-center border-l border-transparent px-3 text-xs uppercase',
                                  isActive(child.href) &&
                                    'border-aged-gold-500 text-ivory-100',
                                )}
                                href={child.href}
                                onClick={() => setMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={cn(
                          'text-ivory-100 flex min-h-12 items-center border-l-2 border-transparent px-3 text-sm font-semibold tracking-wider uppercase',
                          isActive(item.href) &&
                            'border-aged-gold-500 bg-iron-800/70',
                        )}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 flex items-center justify-between gap-5 text-xs uppercase">
              <LanguageSwitcher
                locale={locale}
                onNavigate={() => setMenuOpen(false)}
              />
              <Link
                href={`${localizedPath(locale, 'lore')}#search`}
                onClick={() => setMenuOpen(false)}
              >
                {labels.search}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
