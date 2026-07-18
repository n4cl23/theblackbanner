# Coding standards

- TypeScript runs in strict mode with unchecked indexed access enabled.
- Prefer Server Components and immutable data.
- Keep modules cohesive; organize business behavior by feature.
- Avoid barrel files in performance-sensitive paths; import modules directly.
- Validate all untrusted input at system boundaries.
- Never log secrets, tokens, cookies, personal data, or full request payloads.
- Tests describe observable behavior and avoid implementation details.
- Use semantic names and comments only for non-obvious intent.
- Run format, lint, typecheck, tests, and build before completing a sprint.
