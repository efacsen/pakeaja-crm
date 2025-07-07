import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Tests', () => {
  test('application should start and redirect to login', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Welcome back');
  });

  test('register page should be accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h2')).toContainText('Create your account');
  });

  test('login form should have all required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Check form fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    const rememberMeCheckbox = page.locator('#rememberMe');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(rememberMeCheckbox).toBeVisible();
    
    // Check placeholders
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
  });

  test('register form should have all required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // Check form fields
    const fullNameInput = page.locator('input[name="fullName"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    const acceptTermsCheckbox = page.locator('#acceptTerms');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(fullNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
    await expect(acceptTermsCheckbox).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('navigation between login and register should work', async ({ page }) => {
    // Start at login
    await page.goto('http://localhost:3000/login');
    
    // Click link to register
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/.*register/);
    
    // Click link back to login
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/.*login/);
  });
});