const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1380, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto('file:///home/z/my-project/download/dameen.html');
  await page.waitForTimeout(1600);

  // ===== STATE 1: GUEST (before login) =====
  const guestNav = await page.locator('.topin .nav').count();
  const guestSearch = await page.locator('.topin .sbox input').count();
  const guestLogin = await page.locator('.topin .btn:has-text("تسجيل الدخول")').count();
  const guestBrand = await page.locator('.topin .brand').count();
  await page.screenshot({ path: '/home/z/my-project/scripts/shot-guest-top.png', clip: { x: 0, y: 0, width: 1380, height: 640 } });
  console.log('GUEST  => brand:', guestBrand, '| search:', guestSearch, '| loginBtn:', guestLogin, '| nav(should be 0):', guestNav);

  // ===== login as customer (button inside auth modal) =====
  await page.click('.topin .btn:has-text("تسجيل الدخول")');
  await page.waitForTimeout(500);
  await page.click('.mbody .btn:has-text("دخول")');
  await page.waitForTimeout(1200);

  // ===== STATE 2: LOGGED-IN CUSTOMER =====
  const userNav = await page.locator('.topin .nav .nlink').count();
  const userNavTxt = await page.locator('.topin .nav .nlink').allTextContents();
  const userSearch = await page.locator('.topin .sbox input').count();
  const userBell = await page.locator('.topin .iconbtn').count();
  const userAvatar = await page.locator('.topin .avat').count();
  const userDD = await page.locator('.topin .dd .ddmenu').count();
  await page.screenshot({ path: '/home/z/my-project/scripts/shot-user-top.png', clip: { x: 0, y: 0, width: 1380, height: 720 } });
  console.log('USER   => navLinks:', userNav, '| search:', userSearch, '| bell:', userBell, '| avatar:', userAvatar, '| roleDD:', userDD);
  console.log('USER nav items:', JSON.stringify(userNavTxt));

  // ===== search works in BOTH states: test logged-in search =====
  await page.fill('#sq', 'عباية');
  await page.press('#sq', 'Enter');
  await page.waitForTimeout(900);
  const srTitle = await page.locator('h1').first().textContent().catch(() => 'NONE');
  console.log('USER search result page title:', srTitle.trim());

  // ===== logout and test guest search =====
  await page.evaluate(() => logout());
  await page.waitForTimeout(900);
  const guestSearch2 = await page.locator('.topin .sbox input').count();
  await page.fill('#sq', 'عسل');
  await page.press('#sq', 'Enter');
  await page.waitForTimeout(900);
  const srTitle2 = await page.locator('h1').first().textContent().catch(() => 'NONE');
  console.log('GUEST search box present after logout:', guestSearch2, '| guest search title:', srTitle2.trim());

  console.log('ERRORS:', errors.length ? errors.join(' || ') : 'NONE ✔');
  await browser.close();
})();
