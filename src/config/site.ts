export const siteConfig = {
  name: 'The Black Banner V2',
  alternateName: 'Chronicles of Asterheim',
  description:
    'Explore Asterheim through its kingdoms, characters, creatures, collections, and connected chronicles.',
  url:
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://the-black-banner-v2.vercel.app',
  locale: 'pt_BR',
  creator: 'The Black Banner',
  socialImage: '/images/home/asterheim-hero.webp',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
