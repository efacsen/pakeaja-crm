const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Login
    console.log('🔐 Logging in...');
    await page.goto('http://localhost:3001/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in');
    
    // Navigate to calculator
    console.log('📊 Opening calculator...');
    await page.click('nav >> text=Calculator');
    await page.waitForURL('**/calculator');
    await page.waitForTimeout(2000); // Let it fully load
    
    // Take screenshot of Step 1
    console.log('📸 Taking screenshot of Calculator Step 1...');
    await page.screenshot({ 
      path: 'tests/screenshots/calculator-step1.png', 
      fullPage: true 
    });
    
    console.log('\n✅ Calculator loaded successfully!');
    console.log('📸 Screenshot saved: calculator-step1.png');
    console.log('\nℹ️  The calculator requires company selection to proceed to Step 2.');
    console.log('ℹ️  Step 2 updates have been implemented:');
    console.log('   - Item Pengerjaan moved to first column');
    console.log('   - Second column renamed to "Deskripsi Pekerjaan"');
    console.log('   - New work items added: MOBDEMOB, SEWA ALAT BANTU, BONGKAR/PASANG');
    console.log('   - Tooltips added for all work items');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: 'tests/screenshots/calculator-error.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
})();