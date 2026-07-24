import { z } from 'zod';

import generatedEditorialImport from '@/content/asterheim-editorial-import.generated.json';

export const importedEditorialRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(['pt-BR', 'en', 'es', 'und']),
  status: z.literal('review'),
  sourceType: z.literal('pdf'),
  sourcePath: z.string().min(1),
  pageCount: z.number().int().positive(),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  body: z.string().min(1),
  provenance: z.literal('user-provided-final-source'),
});

export const asterheimEditorialImport = z
  .array(importedEditorialRecordSchema)
  .parse(generatedEditorialImport);
