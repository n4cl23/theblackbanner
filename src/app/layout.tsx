import type { Metadata } from 'next';

import { getPublicEnvironment } from '@/config/env';
import { AuthProviderBoundary } from '@/features/admin/auth/auth-provider-boundary';

import '@/styles/globals.css';

const publicEnvironment = getPublicEnvironment();

export const metadata: Metadata = {
  metadataBase: new URL(publicEnvironment.appUrl ?? 'http://localhost:3000'),
  title: {
    default: 'The Black Banner V2',
    template: '%s | The Black Banner V2',
  },
  description: 'Chronicles of Asterheim — foundation environment.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="und">
      <body>
        <AuthProviderBoundary>{children}</AuthProviderBoundary>
      </body>
    </html>
  );
}
