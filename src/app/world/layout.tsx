import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';

export default function WorldLayout({ children }: { children: ReactNode }) {
  return <PublicShell area="world">{children}</PublicShell>;
}
