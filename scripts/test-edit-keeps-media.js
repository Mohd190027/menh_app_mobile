/* تعديل منتج قائم من الفورم يحافظ على صوره ومقاطعه */
const { chromium } = require('playwright');
let fails = [];
const ok = (n, c) => { console.log((c ? '  ✓ ' : '  ✗ ') + n); if (!c) fails.push(n); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
  const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await pg.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);
  const before = await pg.evaluate(() => { const p = PRODUCTS.find(x => x.id === 'p1'); return { imgs: p.imgs.length, vids: (p.vids || []).length, nm: p.name }; });
  console.log('قبل التعديل:', JSON.stringify(before));
  await pg.evaluate(() => mProdForm('p1'));
  await pg.waitForTimeout(500);
  await pg.fill('#mp-nm', before.nm + ' — نسخة محسّنة');
  await pg.fill('#mp-pts', '25');
  await pg.click('button:has-text("حفظ التعديلات")');
  await pg.waitForTimeout(600);
  const after = await pg.evaluate(() => { const p = PRODUCTS.find(x => x.id === 'p1'); return { imgs: p.imgs.length, vids: (p.vids || []).length, nm: p.name }; });
  console.log('بعد التعديل:', JSON.stringify(after));
  ok('الاسم تحدّث', after.nm.includes('نسخة محسّنة'));
  ok('الصور محفوظة كما كانت (' + after.imgs + ')', after.imgs === before.imgs);
  ok('المقاطع محفوظة كما كانت (' + after.vids + ')', after.vids === before.vids);
  ok('لا أخطاء JS', errs.length === 0);
  /* الصفحة العامة تعرض وسائط المنتج المعدل */
  await pg.evaluate(() => go('product', 'p1'));
  await pg.waitForTimeout(600);
  ok('صفحة المنتج العامة تعرض غلافه وصوره', await pg.locator('.main img, .thumbs img').count() >= 1);
  await browser.close();
  console.log('════ ' + (fails.length ? 'فشل: ' + fails.join(' | ') : 'كل الفحوص ناجحة ✓') + ' ════');
})();
