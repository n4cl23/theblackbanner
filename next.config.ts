import type { NextConfig } from 'next';

const developmentScriptPolicy =
  process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' data:",
  "form-action 'self' https://*.clerk.accounts.dev",
  "frame-ancestors 'none'",
  "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "img-src 'self' blob: data: https:",
  "media-src 'self' blob:",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://*.clerk.accounts.dev https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.clerk.accounts.dev https://api.clerk.com",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: '/(.*)', headers: [...securityHeaders] },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/reinos', destination: '/world/kingdoms', permanent: true },
      { source: '/mapa', destination: '/world/map', permanent: true },
      { source: '/characters', destination: '/personagens', permanent: true },
      { source: '/creatures', destination: '/bestiario', permanent: true },
      { source: '/collections', destination: '/colecoes', permanent: true },
    ];
  },
};

export default nextConfig;
