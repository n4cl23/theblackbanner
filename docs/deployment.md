# Deployment

Vercel is the intended hosting platform. Sprint 0 performs no deployment and changes no Production environment.

## Guardrails

- Production changes require explicit authorization.
- Secrets belong in the hosting provider, never in Git.
- `.env.example` documents names only.
- Pull requests must pass the validation workflow before merge.
- Preview deployments may be introduced in a future authorized sprint.
- Production promotion and rollback procedures will be defined before first release.
