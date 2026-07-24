import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';

export default function LoreLayout({ children }: { children: ReactNode }) {
  return <PublicShell area="lore">{children}</PublicShell>;
}
