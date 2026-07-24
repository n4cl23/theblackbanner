import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';

export default function BestiaryLayout({ children }: { children: ReactNode }) {
  return <PublicShell area="bestiary">{children}</PublicShell>;
}
