import type { ReactNode } from 'react';
import { WorldHeader } from '@/features/world/components/world-header';

export default function WorldLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WorldHeader />
      {children}
    </>
  );
}
