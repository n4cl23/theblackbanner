import type { Metadata, Viewport } from 'next';

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
  manifest: '/manifest.webmanifest',
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
  icons: {
    icon: [
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/black-banner-mark.svg', type: 'image/svg+xml' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/mask-icon.svg',
        color: '#b18c4f',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#080807',
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
