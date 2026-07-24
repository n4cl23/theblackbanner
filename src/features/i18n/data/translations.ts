import type { Locale } from '@/features/i18n/domain/localized-content-schema';

export const dictionaries = {
  'pt-br': {
    language: 'Português',
    navHome: 'Início',
    navLore: 'Lore',
    navTimeline: 'Linha do tempo',
    navChronicles: 'Crônicas',
    heroEyebrow: 'Crônicas de Asterheim',
    heroTitle: 'Toda bandeira lança uma sombra',
    heroBody:
      'Explore reinos em ruínas, testemunhas de guerras esquecidas e criaturas que habitam além da névoa.',
    heroCta: 'Entrar nos arquivos',
    unavailable: 'Conteúdo indisponível neste idioma',
    unavailableBody:
      'Esta tradução ainda não foi aprovada. O conteúdo original não será exibido silenciosamente.',
    draft: 'Tradução em rascunho',
    readMore: 'Ler registro',
    interfaceReady: 'Interface integralmente localizada',
  },
  en: {
    language: 'English',
    navHome: 'Home',
    navLore: 'Lore',
    navTimeline: 'Timeline',
    navChronicles: 'Chronicles',
    heroEyebrow: 'Chronicles of Asterheim',
    heroTitle: 'Every banner casts a shadow',
    heroBody:
      'Explore ruined kingdoms, witnesses of forgotten wars, and creatures dwelling beyond the mist.',
    heroCta: 'Enter the archives',
    unavailable: 'Content unavailable in this language',
    unavailableBody:
      'This translation has not been approved yet. Original-language content will not be shown silently.',
    draft: 'Draft translation',
    readMore: 'Read record',
    interfaceReady: 'Interface fully localized',
  },
  es: {
    language: 'Español',
    navHome: 'Inicio',
    navLore: 'Lore',
    navTimeline: 'Cronología',
    navChronicles: 'Crónicas',
    heroEyebrow: 'Crónicas de Asterheim',
    heroTitle: 'Toda bandera proyecta una sombra',
    heroBody:
      'Explora reinos en ruinas, testigos de guerras olvidadas y criaturas que habitan más allá de la niebla.',
    heroCta: 'Entrar en los archivos',
    unavailable: 'Contenido no disponible en este idioma',
    unavailableBody:
      'Esta traducción todavía no fue aprobada. El contenido original no se mostrará de forma silenciosa.',
    draft: 'Traducción en borrador',
    readMore: 'Leer registro',
    interfaceReady: 'Interfaz completamente localizada',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
