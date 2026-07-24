import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';

export default function ArchivesLayout({ children }: { children: ReactNode }) {
  return <PublicShell area="archives">{children}</PublicShell>;
}
