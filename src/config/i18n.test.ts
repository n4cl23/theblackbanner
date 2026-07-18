import { i18nConfig } from '@/config/i18n';

describe('i18n foundation config', () => {
  it('keeps the default locale in the supported locale list', () => {
    expect(i18nConfig.locales).toContain(i18nConfig.defaultLocale);
  });
});
