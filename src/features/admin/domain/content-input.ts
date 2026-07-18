import { z } from 'zod';
import {
  ContentLocale,
  ContentType,
  EditorialStatus,
} from '@/generated/prisma/client';
export const contentInputSchema = z.object({
  type: z.enum(ContentType),
  locale: z.enum(ContentLocale),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(160),
  subtitle: z.string().trim().max(240).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});
export const editorialTransitionSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  status: z.enum(EditorialStatus),
  reason: z.string().max(300).optional(),
});
export type ContentInput = z.infer<typeof contentInputSchema>;
