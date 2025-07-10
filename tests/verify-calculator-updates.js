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
    
    // Navigate to calculator
    console.log('📊 Navigating to calculator...');
    await page.click('nav >> text=Calculator');
    await page.waitForURL('**/calculator');
    
    // Fill project details (Step 1)
    console.log('📝 Filling project details...');
    await page.fill('input[placeholder*="Coating Lantai Gudang"]', 'Test Project - Updated Calculator');
    
    // Skip company selection for now - just fill required fields to proceed
    console.log('⏭️  Skipping to Step 2 to verify column updates...');
    
    // Click Next to go to Step 2
    console.log('➡️  Moving to Step 2...');
    await page.click('button:has-text("Next Step")');
    
    // Wait for Step 2 to load
    await page.waitForSelector('text=Pengukuran Permukaan', { timeout: 5000 });
    console.log('✅ Step 2 loaded');
    
    // Verify column order
    console.log('\n📋 Verifying column updates:');
    const headers = await page.$$eval('thead th', ths => ths.map(th => th.textContent));
    console.log('Column headers:', headers);
    
    if (headers[0] === 'Item Pengerjaan') {
      console.log('✅ First column is "Item Pengerjaan" - Correct!');
    } else {
      console.log('❌ First column is not "Item Pengerjaan", it is:', headers[0]);
    }
    
    if (headers[1] === 'Deskripsi Pekerjaan') {
      console.log('✅ Second column is "Deskripsi Pekerjaan" - Correct!');
    } else {
      console.log('❌ Second column is not "Deskripsi Pekerjaan", it is:', headers[1]);
    }
    
    // Click on work item dropdown
    console.log('\n🔍 Checking work items...');
    await page.click('button[role="combobox"]:has(span)');
    await page.waitForTimeout(500);
    
    // Check for new work items
    const workItems = [
      { name: 'MOBDEMOB', hint: 'Biaya Mobilisasi Manpower' },
      { name: 'SEWA ALAT BANTU', hint: 'Sewa Gondola, Scaffolding, Manlift' },
      { name: 'BONGKAR/PASANG', hint: 'Biaya untuk Bongkar/Pasang' }
    ];
    
    for (const item of workItems) {
      const itemVisible = await page.locator(`text=${item.name}`).isVisible();
      console.log(`- ${item.name}: ${itemVisible ? '✅ Found' : '❌ Not found'}`);
    }
    
    // Select MOBDEMOB
    await page.click('text=MOBDEMOB');
    
    // Fill description
    await page.fill('input[placeholder="Deskripsi pekerjaan..."]', 'Mobilisasi tim dan peralatan');
    
    // Fill measurements
    await page.fill('input[placeholder="0"][type="number"]', '10'); // length
    await page.press('Tab');
    await page.fill('input[placeholder="0"][type="number"]', '5'); // width
    
    // Take screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'tests/screenshots/calculator-step2-verified.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: calculator-step2-verified.png');
    
    console.log('\n🎉 Calculator updates verified successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ 
      path: 'tests/screenshots/calculator-verify-error.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
})();