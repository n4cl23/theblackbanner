export const i18nConfig = {
  defaultLocale: 'pt-br',
  locales: ['pt-br', 'en', 'es'] as const,
} as const;

export type Locale = (typeof i18nConfig.locales)[number];
