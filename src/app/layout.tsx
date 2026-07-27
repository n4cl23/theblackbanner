import type { Metadata } from 'next';

import { getPublicEnvironment } from '@/config/env';
import { siteConfig } from '@/config/site';
import { AuthProviderBoundary } from '@/features/admin/auth/auth-provider-boundary';

import '@/styles/globals.css';

const publicEnvironment = getPublicEnvironment();

export const metadata: Metadata = {
  metadataBase: new URL(publicEnvironment.appUrl ?? siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  category: 'dark fantasy',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
    images: [
      {
        url: siteConfig.socialImage,
        width: 1920,
        height: 818,
        alt: 'Asterheim beyond a valley covered in ash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{const locale=location.pathname.split('/')[1];document.documentElement.lang=locale==='en'?'en':locale==='es'?'es':'pt-BR'})()",
          }}
        />
      </head>
      <body>
        <AuthProviderBoundary>{children}</AuthProviderBoundary>
      </body>
    </html>
  );
}
