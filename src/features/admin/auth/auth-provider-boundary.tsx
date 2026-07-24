import { ClerkProvider } from '@clerk/nextjs';

export function AuthProviderBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return configured ? <ClerkProvider>{children}</ClerkProvider> : children;
}
