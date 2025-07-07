import { test, expect } from '@playwright/test';

test.describe('Dashboard Features (Without Auth)', () => {
  test('should redirect to login when accessing dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Welcome back');
  });

  test('all dashboard routes should be protected', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/calculator',
      '/dashboard/customers',
      '/dashboard/calculations',
      '/dashboard/reports',
    ];

    for (const route of protectedRoutes) {
      await page.goto(`http://localhost:3000${route}`);
      await expect(page).toHaveURL(/.*login/);
    }
  });
});