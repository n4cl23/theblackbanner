import { z } from 'zod';

import generatedManifest from '@/content/asterheim-media-manifest.generated.json';
import generatedVideoManifest from '@/content/asterheim-video-manifest.generated.json';

export const asterheimMediaSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['image', 'animation', 'video', 'model']),
  src: z.string().startsWith('/media/asterheim/'),
  poster: z.string().nullable(),
  alt: z.string().min(1),
  caption: z.string().min(1),
  credit: z.string().min(1),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  duration: z.number().nonnegative().nullable(),
  locale: z.enum(['pt-BR', 'en', 'es', 'und']),
  entityType: z.enum([
    'character',
    'creature',
    'guardian',
    'collection',
    'map',
  ]),
  entitySlug: z.string().min(1),
  usage: z.enum(['hero', 'gallery', 'thumbnail', 'poster', 'reference']),
  status: z.enum(['draft', 'review', 'published', 'archived']),
});

export type AsterheimMedia = z.infer<typeof asterheimMediaSchema>;

export const asterheimMediaManifest = z
  .array(asterheimMediaSchema)
  .parse([
    ...generatedManifest,
    ...generatedVideoManifest,
  ]) as readonly AsterheimMedia[];

export function getAsterheimMedia(entitySlug: string) {
  return asterheimMediaManifest.filter(
    (media) => media.entitySlug === entitySlug,
  );
}
