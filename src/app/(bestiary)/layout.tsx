import type { ReactNode } from 'react';
import Link from 'next/link';
export default function BestiaryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-coal-950/95 sticky top-0 z-50 border-b border-stone-600/30 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-[90rem] items-center justify-between px-5 sm:px-8">
          <Link className="font-display tracking-[.16em] uppercase" href="/">
            The Black Banner
          </Link>
          <nav aria-label="Navegação do bestiário">
            <ul className="flex gap-5 text-xs tracking-widest uppercase sm:gap-8">
              <li>
                <Link href="/bestiario">Bestiário</Link>
              </li>
              <li>
                <Link href="/atlas">Atlas</Link>
              </li>
              <li>
                <Link href="/world">Mundo</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
