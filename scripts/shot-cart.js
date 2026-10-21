/* لقطة نظيفة لسلة التوصيل المجاني بعد زوال الإشعارات العابرة */
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/z/my-project/download/dameen.html');
  await page.waitForTimeout(500);
  await page.evaluate(() => quickLogin('customer'));
  await page.waitForTimeout(400);
  await page.evaluate(() => { addToCart('p3', 1); go('cart'); });
  await page.waitForTimeout(4000); // انتظار زوال التوست
  await page.evaluate(() => { FREE_DL = true; render(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/home/z/my-project/scripts/shots/cart-freedl-clean.png', fullPage: true });
  // فحص هندسي: لا عنصر خارج حدود الصفحة أفقياً
  const overflow = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('#app *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.left < -2 || r.right > w + 2)) bad.push(el.className.toString().slice(0, 40) || el.tagName);
    });
    return [...new Set(bad)];
  });
  console.log('HORIZONTAL OVERFLOW ELEMENTS:', overflow.length ? overflow : 'NONE — لا شيء يتجاوز حدود الشاشة');
  await browser.close();
})();
