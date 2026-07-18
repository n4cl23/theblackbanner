export const i18nConfig = {
  defaultLocale: 'pt-BR',
  locales: ['pt-BR', 'en'] as const,
} as const;

export type Locale = (typeof i18nConfig.locales)[number];
