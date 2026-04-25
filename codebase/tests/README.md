# Strat Test Suite

This folder contains professional testing scripts for the Strat application.

## Structure

- **`unit/`**: Vitest unit tests for components, hooks, and services.
- **`e2e/`**: Playwright end-to-end tests for critical user flows.
- **`setup.ts`**: Global test configuration and infrastructure mocks.

## Running Tests

From the `app-code` directory:

### Unit Tests
\`\`\`bash
pnpm run test:unit
\`\`\`

### E2E Tests
\`\`\`bash
pnpm run test:e2e
\`\`\`

## Note on Infrastructure
Tests are configured to use a `happy-dom` environment for unit tests and local dev server for E2E. Firebase and Gemini are mocked in `setup.ts` to ensure tests are fast, reliable, and do not incur costs.
