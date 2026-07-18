# Testing strategy

Vitest is the unit-test runner. React Testing Library verifies UI through accessible behavior. Playwright covers browser journeys.

## Test layers

- Unit: configuration, domain rules, parsing, and isolated utilities.
- Component: rendered behavior and accessibility contracts.
- Route handler: response status and public payload contract.
- End-to-end: critical user journeys in a real browser.

CI runs lint, typecheck, unit/component tests, and a production build. Browser tests are configured but remain a separate command until the first stable public journey requires them in CI.
