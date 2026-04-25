# Strat Test Suite

This folder contains professional testing scripts for the Strat application.

## Structure

- **`unit/`**: Vitest unit tests for components, hooks, and services.
- **`e2e/`**: Playwright end-to-end tests for critical user flows.
- **`setup.ts`**: Global test configuration and infrastructure mocks.

## Test Coverage

### Unit Tests (`unit/`)

| Test File | What It Tests |
|---|---|
| `aiService.test.ts` | Mastery detection regex parsing — verifies `[MASTERY: X]` extraction and null returns for non-matching responses |
| `Button.test.tsx` | Button component rendering, click events, disabled state, and variant/size props |

### E2E Tests (`e2e/`)

| Test File | What It Tests |
|---|---|
| `auth.spec.ts` | Login page rendering, redirect for unauthenticated users, toggle between sign-in/sign-up modes |

## Running Tests

From the `app-code` directory:

### Unit Tests
```bash
pnpm run test:unit
```

### E2E Tests
```bash
# Start the dev server first
pnpm run dev

# In another terminal
pnpm run test:e2e
```

## Test Infrastructure

- **Unit Tests**: Use `happy-dom` environment for fast DOM simulation without a real browser.
- **E2E Tests**: Use Playwright with Chromium for real browser testing against the local dev server.
- **Mocks** (`setup.ts`): Firebase Auth, Firestore, and Gemini SDK are mocked globally to ensure tests are:
  - Fast (no network calls)
  - Reliable (deterministic results)
  - Free (no API costs)

## Adding New Tests

### Unit Test
```typescript
// tests/unit/myFeature.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/services/myService';

describe('My Feature', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### E2E Test
```typescript
// tests/e2e/myFlow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Flow', () => {
  test('should navigate correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/expected/);
  });
});
```
