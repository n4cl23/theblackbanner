import { clerkMiddleware } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import { publishedMiniatureSlugSet } from '@/features/collections/data/published-miniature-slugs';

function isProtectedAdminRoute(request: NextRequest) {
  const path = request.nextUrl.pathname;
  return path.startsWith('/admin') && !path.startsWith('/admin/sign-in');
}

function isHiddenMiniatureRoute(request: NextRequest) {
  const match = request.nextUrl.pathname.match(
    /^\/(pt-br|en|es)\/miniaturas\/([^/]+)\/?$/,
  );
  if (!match) return false;
  const [, locale, slug] = match;
  if (!locale || !slug) return false;
  return locale !== 'pt-br' || !publishedMiniatureSlugSet.has(slug);
}

const protectedAdminProxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedAdminRoute(request)) await auth.protect();
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isHiddenMiniatureRoute(request)) {
    return new NextResponse('Miniatura não encontrada', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  if (!isProtectedAdminRoute(request)) {
    return NextResponse.next();
  }

  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return NextResponse.redirect(new URL('/admin/sign-in', request.url));
  }

  return protectedAdminProxy(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
