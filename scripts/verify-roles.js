const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1380, height: 860 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));

  await page.goto('file:///home/z/my-project/download/dameen.html');
  await page.waitForTimeout(1400);

  // ===== GUEST screenshot =====
  await page.screenshot({ path: '/home/z/my-project/scripts/final-guest.png', clip: { x: 0, y: 0, width: 1380, height: 700 } });

  // ===== MERCHANT login =====
  await page.evaluate(() => quickLogin('merchant'));
  await page.waitForTimeout(1000);
  const mNav = await page.locator('.topin .nav .nlink').allTextContents();
  const mSearch = await page.locator('.topin .sbox input').count();
  console.log('MERCHANT nav:', JSON.stringify(mNav), '| search:', mSearch);

  // ===== ADMIN login =====
  await page.evaluate(() => { logout(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(1000);
  const aNav = await page.locator('.topin .nav .nlink').allTextContents();
  console.log('ADMIN nav:', JSON.stringify(aNav));

  // ===== CUSTOMER login + screenshot (full menu) =====
  await page.evaluate(() => { logout(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => quickLogin('customer'));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/z/my-project/scripts/final-customer.png', clip: { x: 0, y: 0, width: 1380, height: 760 } });

  // ===== logout returns to minimal bar =====
  await page.evaluate(() => { logout(); });
  await page.waitForTimeout(700);
  const backGuest = await page.locator('.topin .nav').count();
  const backLogin = await page.locator('.topin .btn:has-text("تسجيل الدخول")').count();
  console.log('AFTER LOGOUT => nav(should be 0):', backGuest, '| loginBtn:', backLogin);

  // ===== mobile view guest =====
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/home/z/my-project/scripts/final-guest-mobile.png', clip: { x: 0, y: 0, width: 390, height: 500 } });

  // ===== mobile view customer =====
  await page.evaluate(() => quickLogin('customer'));
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/home/z/my-project/scripts/final-customer-mobile.png', clip: { x: 0, y: 0, width: 390, height: 560 } });

  console.log('ERRORS:', errors.length ? errors.join(' || ') : 'NONE ✔');
  await browser.close();
})();
