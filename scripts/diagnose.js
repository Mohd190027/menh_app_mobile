/* تشخيص شامل: التقاط كل أخطاء الكونسول + لقطات لكل الصفحات المعدلة */
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const SHOTS = '/tmp/render';
fs.mkdirSync(SHOTS, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const log = (s) => console.log(s);

  /* ═══ 1) الزائر: الرئيسية كاملة (العدّاد) ═══ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [], cons = [];
    pg.on('pageerror', e => errs.push('PAGEERROR: ' + String(e)));
    pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') cons.push(m.type().toUpperCase() + ': ' + m.text()); });
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(800);
    log('── الزائر / الرئيسية ──');
    log('أخطاء صفحة: ' + (errs.length ? errs.join(' | ') : 'لا شيء'));
    log('كونسول: ' + (cons.length ? cons.slice(0,5).join(' | ') : 'نظيف'));
    await pg.screenshot({ path: SHOTS + '/d-home-top.png', clip: { x: 0, y: 0, width: 1280, height: 560 } });
    await pg.screenshot({ path: SHOTS + '/d-home-full.png', fullPage: true });
    // جوال
    const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mp = await mob.newPage();
    await mp.goto(BASE, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(600);
    await mp.screenshot({ path: SHOTS + '/d-mobile-home.png', fullPage: false });
    await mob.close();
    await ctx.close();
  }

  /* ═══ 2) التاجر: نموذج المنتج + استوديو الوسائط ═══ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push('PAGEERROR: ' + String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.evaluate(() => { localStorage.setItem('dameen_session', JSON.stringify({ phone: '0500000002', role: 'merchant' })); location.reload(); });
    await pg.waitForTimeout(1200);
    // فتح نموذج منتج جديد من لوحة التاجر
    await pg.evaluate(() => { if (window.go) window.go('m-products'); });
    await pg.waitForTimeout(600);
    const addBtn = pg.locator('button:has-text("إضافة منتج"), button:has-text("منتج جديد")').first();
    if (await addBtn.count()) { await addBtn.click(); await pg.waitForTimeout(700); }
    await pg.screenshot({ path: SHOTS + '/d-merchant-form-top.png', fullPage: false });
    await pg.screenshot({ path: SHOTS + '/d-merchant-form-full.png', fullPage: true });
    log('── التاجر / نموذج المنتج ──');
    log('أخطاء: ' + (errs.length ? errs.join(' | ') : 'لا شيء'));
    // عدد النوافذ المفتوحة المتراكبة
    const modals = await pg.locator('.modal, .mcard, [class*="overlay"]').count();
    log('عناصر نوافذ: ' + modals);
    await ctx.close();
  }

  /* ═══ 3) الموظف: مركزه + المتاجر + النزاعات ═══ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push('PAGEERROR: ' + String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.evaluate(() => { localStorage.setItem('dameen_session', JSON.stringify({ phone: '0500000013', role: 'staff' })); location.reload(); });
    await pg.waitForTimeout(1200);
    await pg.screenshot({ path: SHOTS + '/d-staff-hub.png', fullPage: true });
    await pg.evaluate(() => { if (window.go) window.go('e-stores'); });
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: SHOTS + '/d-staff-stores.png', fullPage: true });
    await pg.evaluate(() => { if (window.go) window.go('e-disputes'); });
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: SHOTS + '/d-staff-disputes.png', fullPage: false });
    log('── الموظف ──');
    log('أخطاء: ' + (errs.length ? errs.join(' | ') : 'لا شيء'));
    await ctx.close();
  }

  /* ═══ 4) الإدارة ═══ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 940 } });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push('PAGEERROR: ' + String(e)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.evaluate(() => { localStorage.setItem('dameen_session', JSON.stringify({ phone: '0500000003', role: 'admin' })); location.reload(); });
    await pg.waitForTimeout(1200);
    await pg.screenshot({ path: SHOTS + '/d-admin-hub.png', fullPage: true });
    log('── الإدارة ──');
    log('أخطاء: ' + (errs.length ? errs.join(' | ') : 'لا شيء'));
    await ctx.close();
  }

  await browser.close();
  console.log('\nDONE — لقطات في ' + SHOTS);
})();
