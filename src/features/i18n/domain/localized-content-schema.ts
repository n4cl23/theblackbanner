import { z } from 'zod';
import { i18nConfig } from '@/config/i18n';

export const localeSchema = z.enum(i18nConfig.locales);
export const localizedStatusSchema = z.enum([
  'unavailable',
  'draft',
  'review',
  'published',
]);
export const localizedVariantSchema = z.object({
  locale: localeSchema,
  status: localizedStatusSchema,
  slug: z.string(),
  title: z.string().min(1).nullable(),
  body: z.array(z.string().min(1)),
  altText: z.string().min(1).nullable(),
  translationOf: z.string().min(1).nullable(),
  incomplete: z.boolean(),
});
export const localizedDocumentSchema = z.object({
  id: z.string().min(1),
  originalLocale: localeSchema,
  originalId: z.string().min(1),
  variants: z.array(localizedVariantSchema).length(3),
  previewableLocales: z.array(localeSchema),
});
export type Locale = z.infer<typeof localeSchema>;
export type LocalizedDocument = z.infer<typeof localizedDocumentSchema>;
