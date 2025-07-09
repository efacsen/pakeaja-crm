import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  role: string;
  fullName: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@test.com',
    password: 'Test123!',
    role: 'admin',
    fullName: 'Admin User'
  },
  manager: {
    email: 'manager@test.com',
    password: 'Test123!',
    role: 'manager',
    fullName: 'Manager User'
  },
  sales: {
    email: 'sales@test.com',
    password: 'Test123!',
    role: 'sales',
    fullName: 'Sales User'
  }
};

export async function login(page: Page, userType: keyof typeof TEST_USERS) {
  const user = TEST_USERS[userType];
  
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Verify user is logged in
  await expect(page.locator('text=' + user.fullName)).toBeVisible();
}

export async function logout(page: Page) {
  // Try to find and click user menu - different selectors
  const userMenuSelectors = [
    '[data-testid="user-menu-trigger"]',
    'button:has(svg.lucide-user)',
    'button[aria-haspopup="menu"]'
  ];
  
  let clicked = false;
  for (const selector of userMenuSelectors) {
    if (await page.locator(selector).isVisible()) {
      await page.click(selector);
      clicked = true;
      break;
    }
  }
  
  if (!clicked) {
    throw new Error('Could not find user menu trigger');
  }
  
  // Click logout
  await page.click('text=Logout');
  
  // Wait for redirect to login
  await page.waitForURL('**/login');
}

export async function navigateToSection(page: Page, sectionName: string) {
  // Click on the menu item
  await page.click(`nav >> text=${sectionName}`);
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
}

export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    const input = page.locator(`[name="${field}"], [placeholder*="${field}"]`).first();
    await input.fill(value);
  }
}

export async function selectFromDropdown(page: Page, triggerText: string, optionText: string) {
  // Click the dropdown trigger
  await page.click(`text=${triggerText}`);
  
  // Wait for dropdown to open
  await page.waitForTimeout(500);
  
  // Click the option
  await page.click(`[role="option"] >> text=${optionText}`);
}

export async function waitForToast(page: Page, message: string) {
  await expect(page.locator(`[role="alert"] >> text=${message}`)).toBeVisible();
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `tests/screenshots/${name}.png`,
    fullPage: true 
  });
}

export function generateTestData() {
  const timestamp = Date.now();
  
  return {
    company: {
      name: `Test Company ${timestamp}`,
      type: 'commercial',
      address: 'Jl. Test No. 123',
      city: 'Jakarta'
    },
    contact: {
      name: `Test Contact ${timestamp}`,
      position: 'Purchasing Manager',
      email: `contact${timestamp}@test.com`,
      phone: '081234567890'
    },
    lead: {
      title: `Test Lead ${timestamp}`,
      company: `Test Company ${timestamp}`,
      value: 1000000,
      notes: 'Test lead created by automated test'
    },
    material: {
      name: 'Epoxy Primer',
      quantity: 100,
      unit: 'liter'
    }
  };
}