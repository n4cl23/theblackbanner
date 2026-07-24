import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

export type PublicArea =
  | 'archives'
  | 'atlas'
  | 'bestiary'
  | 'collections'
  | 'lore'
  | 'world';

export function PublicShell({
  area,
  children,
}: {
  area: PublicArea;
  children: ReactNode;
}) {
  return (
    <div className={cn('public-shell min-h-screen', `public-area-${area}`)}>
      <SkipLink />
      <SiteHeader position="sticky" />
      <div className="page-transition public-content">{children}</div>
      <SiteFooter />
    </div>
  );
}
