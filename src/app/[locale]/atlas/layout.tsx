import { PublicShell } from '@/components/layout/public-shell';
export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell area="atlas">{children}</PublicShell>;
}
