import { clerkMiddleware } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';

function isProtectedAdminRoute(request: NextRequest) {
  const path = request.nextUrl.pathname;
  return path.startsWith('/admin') && !path.startsWith('/admin/sign-in');
}

const protectedAdminProxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedAdminRoute(request)) await auth.protect();
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    if (isProtectedAdminRoute(request)) {
      return NextResponse.redirect(new URL('/admin/sign-in', request.url));
    }
    return NextResponse.next();
  }

  return protectedAdminProxy(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
