import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { AdminLogout } from '@/features/admin/components/admin-logout';
const links = [
  'dashboard',
  'characters',
  'creatures',
  'kingdoms',
  'collections',
  'timeline',
  'lore',
  'media',
];
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <div className="text-parchment-200 min-h-screen bg-[#0b0c0d]">
      <header className="border-b border-stone-600/30">
        <div className="mx-auto flex min-h-16 max-w-[100rem] items-center gap-5 px-5">
          <Link
            className="font-display text-xl uppercase"
            href="/admin/dashboard"
          >
            Black Banner CMS
          </Link>
          <nav aria-label="Administração" className="ml-auto hidden lg:block">
            <ul className="flex gap-4 text-xs uppercase">
              {links.map((link) => (
                <li key={link}>
                  <Link href={`/admin/${link}`}>{link}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {configured ? (
            <>
              <AdminLogout />
              <UserButton />
            </>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}
