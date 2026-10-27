const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
  const pg = await ctx.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(1200);
  // 1) الرئيسية — شبكة ٢×٢
  await pg.screenshot({ path: 'scripts/shots/b11-home.png' });
  // 2) دخول عميل + القائمة المنسدلة مفتوحة
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(600);
  await pg.evaluate(() => { go('home'); });
  await pg.waitForTimeout(400);
  await pg.click('#top .nav [data-secb]');
  await pg.waitForTimeout(400);
  await pg.screenshot({ path: 'scripts/shots/b11-drop.png' });
  // 3) صفحة منتج بأسئلة التاجر (زرع أسئلة مؤقتة على منتج هدايا للعرض)
  await pg.evaluate(() => { const p = P('p19'); p.qs = [{ q: 'ما لون التغليف المطلوب؟', t: 'opts', o: ['ذهبي', 'فضي', 'وردي'] }, { q: 'اكتب رسالة الكارت المرفق', t: 'txt', o: [] }]; go('product', p.id); });
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: 'scripts/shots/b11-pqs.png' });
  // 4) مركز الإدارة — تبويب المتاجر
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); ahubTab('stores'); });
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: 'scripts/shots/b11-hub.png' });
  // 5) جوال — الرئيسية
  const m = await b.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto('file:///home/z/my-project/download/dameen.html');
  await mp.waitForTimeout(1200);
  await mp.screenshot({ path: 'scripts/shots/b11-mobile.png' });
  // تجاوز أفقي على الجوال؟
  const ovf = await mp.evaluate(() => {
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > 392 && r.width < 390 * 3 && !['BUBTRACK', 'NAV', 'CHIPROW'].includes(el.tagName) && !el.closest('.bubwrap')) bad.push(el.className.toString().slice(0, 30) + '|' + Math.round(r.right));
    });
    return { scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 5) };
  });
  console.log('MOBILE overflow:', JSON.stringify(ovf));
  await b.close();
  console.log('SHOTS DONE');
})().catch(e => { console.error('FATAL', e); process.exit(2); });
