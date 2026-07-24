import Link from 'next/link';

import { Container, OrnamentalDivider } from '@/components/ui/primitives';
import { publicNavigation } from '@/config/navigation';

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-600/25 bg-black py-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="font-display text-xl tracking-wider uppercase">
              The Black Banner V2
            </p>
            <p className="text-aged-gold-500 mt-2 text-xs tracking-[0.2em] uppercase">
              Chronicles of Asterheim
            </p>
            <p className="text-parchment-200/40 mt-5 max-w-md text-xs">
              Conteúdo editorial em desenvolvimento. Registros demonstrativos
              não constituem cânone oficial.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            <ul className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-parchment-200/70 hover:text-aged-gold-500 font-semibold uppercase"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                  {'children' in item ? (
                    <ul className="text-parchment-200/45 mt-2 space-y-1.5">
                      {item.children.map((child) => (
                        <li key={`${child.href}-${child.label}`}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <OrnamentalDivider className="my-10" />
        <p className="text-parchment-200/30 text-center text-[0.65rem] tracking-wider uppercase">
          © 2026 The Black Banner V2 · Ambiente de desenvolvimento
        </p>
      </Container>
    </footer>
  );
}
