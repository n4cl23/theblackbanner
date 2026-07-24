import Link from 'next/link';

export function WorldHeader() {
  return (
    <header className="bg-coal-950/95 sticky top-0 z-50 border-b border-stone-600/30 backdrop-blur-md">
      <div className="mx-auto flex min-h-18 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link className="font-display tracking-[0.18em] uppercase" href="/">
          The Black Banner
        </Link>
        <nav aria-label="Navegação do mundo">
          <ul className="text-parchment-200/70 flex items-center gap-5 text-xs tracking-widest uppercase sm:gap-8">
            <li>
              <Link className="hover:text-aged-gold-500" href="/world">
                Mundo
              </Link>
            </li>
            <li>
              <Link className="hover:text-aged-gold-500" href="/world/kingdoms">
                Reinos
              </Link>
            </li>
            <li>
              <Link className="hover:text-aged-gold-500" href="/world/map">
                Mapa
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
