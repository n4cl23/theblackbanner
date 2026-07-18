# Asterheim Preview validation

- Date: 2026-07-18
- Source commit validated: `9531585`
- Pull request: <https://github.com/n4cl23/theblackbanner/pull/1>
- Canonical Preview: <https://the-black-banner-v2-git-con-362f65-jandersons-projects-bbd4737f.vercel.app>
- Target: Preview only

## Result

- Vercel deployment `the-black-banner-v2`: Ready.
- Preview Home loaded with the expected title, hero, and Asterheim content.
- GitHub Actions `quality`: success.
- Credential-free CI: 71 tests passed and the PostgreSQL integration case was explicitly skipped.
- Local database-enabled suite: 72 tests passed.
- Local Playwright suite: 30 tests passed.
- Next.js production build: passed.
- Lint, typecheck, formatting, and import validation: passed.
- Broken public media references: 0.
- Private model/print formats exposed: 0.

The Preview is protected by Vercel Authentication. Anonymous access to `/api/health` returns the protection login page; protection was not disabled. The health route passed its unit test and is present in the successful build.

## Production

Production was not deployed, promoted, aliased, or otherwise changed. Promotion requires explicit approval after review of this Preview and Pull Request.
