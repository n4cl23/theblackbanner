import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export default function ArchivesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader position="sticky" />
      {children}
      <SiteFooter />
    </>
  );
}
