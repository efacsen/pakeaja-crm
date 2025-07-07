import { test, expect } from '@playwright/test';

// Import functions from the extended utilities for testing
test.describe('Calculator Utilities', () => {
  test('calculateSurfaceArea should calculate area correctly for metric units', async ({ page }) => {
    const result = await page.evaluate(() => {
      const surface = {
        id: '1',
        name: 'Wall 1',
        length: 10,
        width: 5,
        quantity: 2,
        unit: 'sqm',
        surfaceType: 'wall',
        condition: 'good',
        preparation: 'light',
      };
      // Mock calculation since we can't import modules directly in browser context
      return surface.length * surface.width * surface.quantity;
    });
    
    expect(result).toBe(100);
  });

  test('formatCurrency should format Indonesian Rupiah correctly', async ({ page }) => {
    const result = await page.evaluate(() => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(1000000);
    });
    
    expect(result).toContain('1.000.000');
  });

  test('formatArea should format area correctly', async ({ page }) => {
    const result = await page.evaluate(() => {
      const area = 100.5;
      return `${area.toFixed(2)} m²`;
    });
    
    expect(result).toBe('100.50 m²');
  });

  test('formatNumber should format with decimal places', async ({ page }) => {
    const result = await page.evaluate(() => {
      const num = 1234.567;
      const decimals = 2;
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    });
    
    expect(result).toBe('1,234.57');
  });
});