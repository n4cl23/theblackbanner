import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';

export default function CollectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicShell area="collections">{children}</PublicShell>;
}
