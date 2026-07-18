'use client';

import { ImageWithFallback } from '@/components/ui/interactive';

export function EditorialMedia({
  image,
  alt,
  caption,
  credit,
  video,
}: {
  image: string;
  alt: string;
  caption: string;
  credit: string;
  video?: string;
}) {
  return (
    <figure className="overflow-hidden border border-stone-600/30">
      {video ? (
        <video
          className="aspect-video w-full object-cover"
          controls
          poster={image}
          preload="metadata"
        >
          <source
            src={video}
            type={video.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          />
          <track kind="captions" label="Português" srcLang="pt" />
          Seu navegador não suporta vídeo.
        </video>
      ) : (
        <div className="relative aspect-video">
          <ImageWithFallback
            alt={alt}
            className="object-cover"
            fallback={<span>Mídia indisponível</span>}
            fill
            sizes="(min-width:1024px) 70vw, 100vw"
            src={image}
          />
        </div>
      )}
      <figcaption className="bg-coal-900 flex flex-wrap justify-between gap-3 p-4 text-xs">
        <span>{caption}</span>
        <span className="text-parchment-200/45">Crédito: {credit}</span>
      </figcaption>
    </figure>
  );
}
