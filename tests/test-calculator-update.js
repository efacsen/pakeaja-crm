const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in successfully');
    
    // Navigate to calculator
    await page.click('text=Calculator');
    await page.waitForURL('**/calculator');
    console.log('✅ Navigated to calculator');
    
    // Wait for calculator to load
    await page.waitForSelector('text=Calculator', { timeout: 10000 });
    console.log('✅ Calculator loaded');
    
    // Fill project details (Step 1)
    await page.fill('input[placeholder*="project name"]', 'Test Project');
    await page.fill('textarea', 'Testing the updated calculator');
    
    // Click Next to go to Step 2
    await page.click('button:has-text("Next Step")');
    
    // Wait for Step 2 to load
    await page.waitForSelector('text=Pengukuran Permukaan');
    console.log('✅ Step 2 loaded - Surface Measurements');
    
    // Check if Item Pengerjaan is in first column
    const firstHeader = await page.locator('thead th').first().textContent();
    console.log(`First column header: ${firstHeader}`);
    
    if (firstHeader === 'Item Pengerjaan') {
      console.log('✅ Column order updated correctly!');
    } else {
      console.log('❌ Column order not updated. First column is:', firstHeader);
    }
    
    // Check if second column is renamed
    const secondHeader = await page.locator('thead th').nth(1).textContent();
    console.log(`Second column header: ${secondHeader}`);
    
    if (secondHeader === 'Deskripsi Pekerjaan') {
      console.log('✅ Second column renamed correctly!');
    } else {
      console.log('❌ Second column not renamed. It is:', secondHeader);
    }
    
    // Click on the work item dropdown
    await page.click('.w-\\[250px\\]');
    
    // Check if new items are available
    const mobdemob = await page.locator('text=MOBDEMOB').isVisible();
    const sewaAlatBantu = await page.locator('text=SEWA ALAT BANTU').isVisible();
    const bongkarPasang = await page.locator('text=BONGKAR/PASANG').first().isVisible();
    
    console.log('New work items check:');
    console.log(`- MOBDEMOB: ${mobdemob ? '✅' : '❌'}`);
    console.log(`- SEWA ALAT BANTU: ${sewaAlatBantu ? '✅' : '❌'}`);
    console.log(`- BONGKAR/PASANG: ${bongkarPasang ? '✅' : '❌'}`);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/calculator-step2-updated.png', fullPage: true });
    console.log('📸 Screenshot saved: calculator-step2-updated.png');
    
  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'tests/screenshots/calculator-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();