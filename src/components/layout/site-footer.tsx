import Link from 'next/link';

import { Container, OrnamentalDivider } from '@/components/ui/primitives';
import type { Locale } from '@/config/i18n';
import { LanguageSwitcher } from '@/features/i18n/components/language-switcher';
import { localizedPath } from '@/features/i18n/data/route-registry';

export function SiteFooter({ locale = 'pt-br' }: { locale?: Locale }) {
  const home = localizedPath(locale);
  const t = {
    'pt-br': {
      quote: 'As crônicas nunca terminam. Apenas o estandarte permanece.',
      body: 'Um códice vivo de reinos, juramentos, criaturas e miniaturas nascidas sob a mesma bandeira.',
      explore: 'Explorar',
      resources: 'Recursos',
      navigation: 'Navegação do rodapé',
      home: 'Início',
      characters: 'Personagens',
      bestiary: 'Bestiário',
      collections: 'Coleções',
      chronicles: 'Crônicas',
      gallery: 'Galeria',
      printingGuide: 'Guia de impressão',
      project: 'Projeto',
      newsletter: 'Mensagens além da muralha',
      newsletterBody:
        'Receba novas crônicas, diários de desenvolvimento e futuras coleções.',
      soon: 'Em breve',
      language: 'Idioma',
      epilogue: 'O estandarte permanece.',
      credit: 'Projeto autoral',
    },
    en: {
      quote: 'The chronicles are never finished. Only the banner remains.',
      body: 'A living codex of kingdoms, oaths, creatures, and miniatures born beneath the same banner.',
      explore: 'Explore',
      resources: 'Resources',
      navigation: 'Footer navigation',
      home: 'Home',
      characters: 'Characters',
      bestiary: 'Bestiary',
      collections: 'Collections',
      chronicles: 'Chronicles',
      gallery: 'Gallery',
      printingGuide: 'Printing Guide',
      project: 'Project',
      newsletter: 'Messages beyond the wall',
      newsletterBody:
        'Receive new chronicles, development journals, and future collections.',
      soon: 'Coming soon',
      language: 'Language',
      epilogue: 'The banner remains.',
      credit: 'Original project',
    },
    es: {
      quote: 'Las crónicas nunca terminan. Solo permanece el estandarte.',
      body: 'Un códice vivo de reinos, juramentos, criaturas y miniaturas nacidas bajo el mismo estandarte.',
      explore: 'Explorar',
      resources: 'Recursos',
      navigation: 'Navegación del pie',
      home: 'Inicio',
      characters: 'Personajes',
      bestiary: 'Bestiario',
      collections: 'Colecciones',
      chronicles: 'Crónicas',
      gallery: 'Galería',
      printingGuide: 'Guía de impresión',
      project: 'Proyecto',
      newsletter: 'Mensajes más allá de la muralla',
      newsletterBody:
        'Recibe nuevas crónicas, diarios de desarrollo y futuras colecciones.',
      soon: 'Próximamente',
      language: 'Idioma',
      epilogue: 'El estandarte permanece.',
      credit: 'Proyecto original',
    },
  }[locale];

  const exploreLinks = [
    { href: home, label: t.home },
    { href: localizedPath(locale, 'atlas'), label: 'Asterheim' },
    { href: localizedPath(locale, 'personagens'), label: t.characters },
    { href: localizedPath(locale, 'bestiario'), label: t.bestiary },
    { href: localizedPath(locale, 'colecoes'), label: t.collections },
    { href: localizedPath(locale, 'chronicles'), label: t.chronicles },
  ];
  const resourceLinks = [
    { href: `${home}#gallery`, label: t.gallery },
    { href: '/design-system', label: 'Art Bible' },
    { href: '/guia-de-impressao', label: t.printingGuide },
    { href: `${home}#editorial`, label: t.project },
  ];

  return (
    <footer className="premium-footer">
      <Container className="relative max-w-[97.5rem]">
        <div className="premium-footer__grid">
          <section
            aria-labelledby="footer-brand"
            className="premium-footer__brand"
          >
            <h2
              className="font-display text-ivory-100 text-2xl tracking-[0.14em] uppercase sm:text-3xl"
              id="footer-brand"
            >
              The Black Banner
            </h2>
            <p className="text-aged-gold-500 mt-2 text-[0.6rem] tracking-[0.28em] uppercase">
              Chronicles of Asterheim
            </p>
            <blockquote className="font-subtitle text-parchment-200/76 mt-6 max-w-sm text-base leading-7 italic">
              “{t.quote}”
            </blockquote>
            <p className="text-parchment-200/45 mt-4 max-w-md text-xs leading-6">
              {t.body}
            </p>
          </section>

          <nav aria-label={t.navigation} className="premium-footer__navigation">
            <FooterLinkGroup links={exploreLinks} title={t.explore} />
            <FooterLinkGroup links={resourceLinks} title={t.resources} />
          </nav>

          <section
            aria-labelledby="footer-newsletter"
            className="premium-footer__newsletter"
          >
            <p className="premium-footer__heading" id="footer-newsletter">
              {t.newsletter}
            </p>
            <p className="text-parchment-200/58 mt-4 max-w-xs text-sm leading-6">
              {t.newsletterBody}
            </p>
            <p className="premium-footer__coming-soon">{t.soon}</p>
            <div className="premium-footer__language">
              <p>{t.language}</p>
              <LanguageSwitcher
                className="footer-language-switcher"
                compact
                locale={locale}
              />
            </div>
          </section>
        </div>

        <div className="premium-footer__epilogue">
          <OrnamentalDivider className="premium-footer__divider" />
          <p className="font-subtitle text-parchment-200/52 text-sm italic">
            {t.epilogue}
          </p>
          <p className="text-parchment-200/30 mt-4 text-[0.6rem] tracking-[0.18em] uppercase">
            © 2026 The Black Banner · Chronicles of Asterheim · {t.credit} · V2
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterLinkGroup({
  links,
  title,
}: {
  links: readonly { href: string; label: string }[];
  title: string;
}) {
  return (
    <section>
      <h2 className="premium-footer__heading">{title}</h2>
      <ul className="premium-footer__links">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
