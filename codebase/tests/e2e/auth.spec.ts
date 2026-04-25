import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page by default when unauthenticated', async ({ page }) => {
    await page.goto('/');
    // Should redirect to /login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Strat');
  });

  test('should toggle between login and signup', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button', { hasText: 'Sign In' })).toBeVisible();
    
    await page.click('text=Create an account');
    await expect(page.locator('button', { hasText: 'Create Account' })).toBeVisible();
    
    await page.click('text=Sign in instead');
    await expect(page.locator('button', { hasText: 'Sign In' })).toBeVisible();
  });
});
