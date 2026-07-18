import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedAdminRoute = createRouteMatcher(['/admin((?!/sign-in).*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedAdminRoute(request)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
