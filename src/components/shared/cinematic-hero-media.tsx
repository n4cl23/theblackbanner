'use client';

import { useState } from 'react';

import { ImageWithFallback } from '@/components/ui/interactive';

type MediaPhase = 'poster' | 'poster-out' | 'video';

const poster =
  '/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp';
const video =
  '/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-35aad744.mp4';

export function CinematicHeroMedia() {
  const [phase, setPhase] = useState<MediaPhase>('poster');

  return (
    <div className="hero-parallax-back absolute inset-[-3%] -z-30 overflow-hidden bg-black">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          phase === 'poster' ? 'opacity-100' : 'opacity-0'
        } ${phase === 'video' ? 'invisible' : 'visible'}`}
        onTransitionEnd={() => {
          if (phase === 'poster-out') setPhase('video');
        }}
      >
        <ImageWithFallback
          alt="Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental"
          className="object-cover object-[62%_center] sm:object-[65%_center] lg:object-[68%_center]"
          fallback="A paisagem de Asterheim não pôde ser carregada"
          fill
          priority
          sizes="100vw"
          src={poster}
        />
      </div>

      <video
        aria-hidden="true"
        autoPlay
        className={`absolute inset-0 size-full object-cover object-[62%_center] transition-opacity duration-700 ease-out sm:object-[65%_center] lg:object-[68%_center] ${
          phase === 'video' ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        loop
        muted
        onCanPlay={() => {
          if (phase === 'poster') setPhase('poster-out');
        }}
        onError={() => setPhase('poster')}
        playsInline
        poster={poster}
        preload="auto"
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}
