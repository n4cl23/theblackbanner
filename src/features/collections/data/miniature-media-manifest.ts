export interface MiniatureMediaManifestEntry {
  cover: string;
  banner: string;
  gallery: readonly string[];
  video: null;
  model3d: null;
}

/** Central, public-only media manifest. Missing assets remain explicit nulls. */
export const miniatureMediaManifest: Readonly<
  Record<string, MiniatureMediaManifestEntry>
> = {
  'miniature-far-watcher': media('/images/home/asterheim-hero.webp'),
  'miniature-banner-bearer': media('/images/home/kingdoms-expanse.webp'),
  'miniature-fog-stalker': media('/images/home/bestiary-ruins.webp'),
  'miniature-ash-hound': media('/images/home/bestiary-ruins.webp'),
};

function media(src: string): MiniatureMediaManifestEntry {
  return {
    cover: src,
    banner: src,
    gallery: [src],
    video: null,
    model3d: null,
  };
}
