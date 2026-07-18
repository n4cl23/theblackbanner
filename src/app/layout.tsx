import type { Metadata } from 'next';

import '@/styles/globals.css';

export const metadata: Metadata = {
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
