import Link from 'next/link';
export default function LoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-stone-600/25">
        <div className="mx-auto flex min-h-16 max-w-[90rem] items-center justify-between px-5">
          <Link className="font-display text-xl uppercase" href="/">
            The Black Banner
          </Link>
          <nav aria-label="Navegação de lore">
            <ul className="flex gap-5 text-xs uppercase">
              <li>
                <Link href="/lore">Lore</Link>
              </li>
              <li>
                <Link href="/timeline">Timeline</Link>
              </li>
              <li>
                <Link href="/chronicles">Chronicles</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
