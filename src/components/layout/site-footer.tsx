import Link from 'next/link';

import { Container, OrnamentalDivider } from '@/components/ui/primitives';
import type { Locale } from '@/config/i18n';
import { getPublicNavigation } from '@/config/navigation';
import { LanguageSwitcher } from '@/features/i18n/components/language-switcher';

export function SiteFooter({ locale = 'pt-br' }: { locale?: Locale }) {
  const publicNavigation = getPublicNavigation(locale);
  const t = {
    'pt-br': {
      body: 'Um códice vivo de reinos, juramentos, criaturas e miniaturas nascidas sob a mesma bandeira.',
      nav: 'Navegação do rodapé',
      newsletter: 'Mensagens além da muralha',
      newsletterBody:
        'Newsletter em preparação. Nenhum dado é enviado nesta versão.',
      soon: 'Em breve',
      credit: 'Projeto autoral',
    },
    en: {
      body: 'A living codex of kingdoms, oaths, creatures, and miniatures born beneath the same banner.',
      nav: 'Footer navigation',
      newsletter: 'Messages beyond the wall',
      newsletterBody:
        'Newsletter in preparation. No data is submitted in this version.',
      soon: 'Coming soon',
      credit: 'Original project',
    },
    es: {
      body: 'Un códice vivo de reinos, juramentos, criaturas y miniaturas nacidas bajo el mismo estandarte.',
      nav: 'Navegación del pie',
      newsletter: 'Mensajes más allá de la muralla',
      newsletterBody:
        'Newsletter en preparación. No se envían datos en esta versión.',
      soon: 'Próximamente',
      credit: 'Proyecto original',
    },
  }[locale];
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
              {t.body}
            </p>
          </div>
          <nav aria-label={t.nav}>
            <ul className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-parchment-200/70 hover:text-aged-gold-500 font-semibold uppercase"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
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
              {t.newsletter}
            </p>
            <p className="text-parchment-200/55 mt-4 text-sm">
              {t.newsletterBody}
            </p>
            <div className="mt-5 flex border-b border-stone-600/40">
              <span className="text-parchment-200/45 flex min-h-11 flex-1 items-center text-xs">
                contato@theblackbanner
              </span>
              <span className="text-aged-gold-500 grid min-h-11 place-items-center px-3 text-xs uppercase">
                {t.soon}
              </span>
            </div>
            <div className="mt-6 text-xs uppercase">
              <LanguageSwitcher compact locale={locale} />
            </div>
          </section>
        </div>
        <OrnamentalDivider className="my-10" />
        <p className="text-parchment-200/30 text-center text-[0.65rem] tracking-wider uppercase">
          © 2026 The Black Banner · Chronicles of Asterheim · {t.credit}
        </p>
      </Container>
    </footer>
  );
}
