import Link from 'next/link';

import { Container, OrnamentalDivider } from '@/components/ui/primitives';
import { publicNavigation } from '@/config/navigation';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-stone-600/25 bg-black py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(168,138,69,.12),transparent_25rem),linear-gradient(115deg,transparent,rgba(255,255,255,.018),transparent)]"
      />
      <Container>
        <div className="relative grid gap-12 xl:grid-cols-[1.1fr_2fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-wider uppercase">
              The Black Banner
            </p>
            <p className="text-aged-gold-500 mt-2 text-xs tracking-[0.2em] uppercase">
              Chronicles of Asterheim
            </p>
            <p className="text-parchment-200/40 mt-5 max-w-md text-xs">
              Um códice vivo de reinos, juramentos, criaturas e miniaturas
              nascidas sob a mesma bandeira.
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
          <section aria-labelledby="footer-newsletter">
            <p
              className="text-aged-gold-500 text-xs font-bold tracking-wider uppercase"
              id="footer-newsletter"
            >
              Mensagens além da muralha
            </p>
            <p className="text-parchment-200/55 mt-4 text-sm">
              Newsletter em preparação. Nenhum dado é enviado nesta versão.
            </p>
            <div className="mt-5 flex border-b border-stone-600/40">
              <span className="text-parchment-200/45 flex min-h-11 flex-1 items-center text-xs">
                contato@theblackbanner
              </span>
              <span className="text-aged-gold-500 grid min-h-11 place-items-center px-3 text-xs uppercase">
                Em breve
              </span>
            </div>
            <div className="mt-6 flex gap-4 text-xs uppercase">
              <Link href="/pt-br">PT</Link>
              <Link href="/en">EN</Link>
              <Link href="/es">ES</Link>
            </div>
          </section>
        </div>
        <OrnamentalDivider className="my-10" />
        <p className="text-parchment-200/30 text-center text-[0.65rem] tracking-wider uppercase">
          © 2026 The Black Banner · Chronicles of Asterheim · Projeto autoral
        </p>
      </Container>
    </footer>
  );
}
