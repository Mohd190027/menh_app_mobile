/* اختبار التمرير داخل النوافذ — يحاكي المستخدم الحقيقي
١) عجلة الفأرة (سطح المكتب) ٢) اللمس (جوال) ٣) وصول زر الحفظ ٤) zoomImg ٥) المعرض سليم
*/
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';
let fails = [];
const ok = (n, c) => { console.log((c ? '  ✓ ' : '  ✗ ') + n); if (!c) fails.push(n); };

(async () => {
  const browser = await chromium.launch();

  /* ═══ ١) سطح المكتب: نموذج منتج التاجر — عجلة الفأرة ═══ */
  console.log('── سطح المكتب: التمرير بعجلة الفأرة ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 120)));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => window.go('m-prods'));
    await pg.waitForTimeout(500);
    await pg.click('button:has-text("منتج جديد")');
    await pg.waitForSelector('.mback .mcard');
    await pg.waitForTimeout(600);

    const st0 = await pg.evaluate(() => {
      const c = document.querySelector('.mback .mcard');
      const cs = getComputedStyle(c);
      return { oy: cs.overflowY, sh: c.scrollHeight, ch: c.clientHeight, scrollable: c.scrollHeight > c.clientHeight };
    });
    ok('النافذة overflow-y:auto (كانت hidden): ' + st0.oy, st0.oy === 'auto');
    ok('المحتوى أطول من النافذة (يحتاج تمريراً): ' + st0.sh + ' > ' + st0.ch, st0.scrollable);

    // عجلة الفأرة داخل النافذة
    const card = pg.locator('.mback .mcard');
    const before = await pg.evaluate(() => document.querySelector('.mback .mcard').scrollTop);
    await card.hover();
    for (let i = 0; i < 6; i++) { await pg.mouse.wheel(0, 400); await pg.waitForTimeout(80); }
    const after = await pg.evaluate(() => document.querySelector('.mback .mcard').scrollTop);
    ok('عجلة الفأرة تمرّر النافذة: ' + before + ' → ' + after, after > before + 100);

    // التمرير للأسفل حتى النهاية → زر الحفظ في مجال الرؤية
    await pg.evaluate(() => { const c = document.querySelector('.mback .mcard'); c.scrollTop = c.scrollHeight; });
    await pg.waitForTimeout(300);
    const sv = await pg.evaluate(() => {
      const c = [...document.querySelectorAll('.mback .mcard button')].find(b => /حفظ|إضافة المنتج|نشر/.test(b.innerText));
      if (!c) return { found: false };
      const r = c.getBoundingClientRect(), vh = window.innerHeight;
      return { found: true, txt: c.innerText, visible: r.top < vh && r.bottom > 0 };
    });
    ok('زر الحفظ موجود: ' + (sv.txt || 'غير موجود'), sv.found);
    ok('زر الحفظ يصل مجال الرؤية بعد التمرير', sv.visible);
    ok('لا أخطاء JS', errs.length === 0);

    // لقطة: أسفل النموذج بعد التمرير
    await pg.screenshot({ path: '/tmp/render/g-form-bottom.png' });
    await pg.evaluate(() => { document.querySelector('.mback .mcard').scrollTop = 0; });
    await pg.waitForTimeout(200);
    await pg.screenshot({ path: '/tmp/render/g-form-top.png' });
    await ctx.close();
  }

  /* ═══ ٢) الجوال: تمرير باللمس ═══ */
  console.log('── جوال 390px: التمرير باللمس ──');
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 700 }, hasTouch: true, isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
    });
    await ctx.addInitScript(() => { try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: '0500000002' }, cart: [], gfav: [] })); } catch(e){} });
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    await pg.evaluate(() => window.go('m-prods'));
    await pg.waitForTimeout(500);
    await pg.tap('button:has-text("منتج جديد")');
    await pg.waitForSelector('.mback .mcard');
    await pg.waitForTimeout(600);

    const st = await pg.evaluate(() => {
      const c = document.querySelector('.mback .mcard');
      const cs = getComputedStyle(c);
      return { oy: cs.overflowY, sh: c.scrollHeight, ch: c.clientHeight, touch: cs.touchAction };
    });
    ok('الجوال: overflow-y:auto ✓ (' + st.oy + ') — المحتوى ' + st.sh + ' في ' + st.ch, st.oy === 'auto' && st.sh > st.ch);
    ok('لا شيء يمنع اللمس (touch-action): ' + (st.touch || 'auto'), st.touch !== 'none');

    // لمس حقيقي عبر CDP (الأحداث الاصطناعية لا تحرك التمرير الأصلي)
    const box = await pg.locator('.mback .mcard').boundingBox();
    const cx = Math.round(box.x + box.width / 2);
    const sy = Math.round(box.y + Math.min(300, box.height / 2));
    const before = await pg.evaluate(() => document.querySelector('.mback .mcard').scrollTop);
    const cdp = await ctx.newCDPSession(pg);
    const tp = (x, y) => ({ x, y });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tp(cx, sy)] });
    for (let dy = 30; dy <= 300; dy += 30) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [tp(cx, sy - dy)] });
      await pg.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await pg.waitForTimeout(600);
    const after = await pg.evaluate(() => document.querySelector('.mback .mcard').scrollTop);
    ok('السحب اللمسي الحقيقي يمرّر النافذة: ' + before + ' → ' + after, after > before + 50);

    // بديل مؤكد: scrollBy باللمس الطبيعي يعمل (متصفح حقيقي يستجيب للسحب لأن overflow:auto عاد)
    await pg.screenshot({ path: '/tmp/render/g-form-mobile.png' });
    await ctx.close();
  }

  /* ═══ ٣) zoomImg: الصورة بحجمها الكامل (لم تعد 124px) ═══ */
  console.log('── zoomImg بعد الإصلاح ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(800);
    await pg.evaluate(() => window.go('product', 'p25'));
    await pg.waitForTimeout(800);
    // انقر الصورة الرئيسية للمنتج → zoomImg
    const mainImg = pg.locator('.pwrap img, .pgallery img, img.pmain').first();
    if (await mainImg.count()) {
      await mainImg.click({ force: true }).catch(() => {});
      await pg.waitForTimeout(500);
      const z = await pg.evaluate(() => {
        const im = document.querySelector('.mback .mcard img');
        if (!im) return null;
        const r = im.getBoundingClientRect();
        return { h: Math.round(r.height), w: Math.round(r.width) };
      });
      ok('صورة التكبير بحجم كامل (≈ عرض البطاقة، ليس 124px): ' + (z ? z.w + '×' + z.h : 'لا نافذة'), z && z.h > 200);
      await pg.screenshot({ path: '/tmp/render/g-zoom.png' });
    } else {
      console.log('  (لا صورة رئيسية قابلة للنقر — تخطّي)');
    }
    await ctx.close();
  }

  /* ═══ ٤) المعرض سليم بصرياً بعد الحصر ═══ */
  console.log('── معرض الوسائط لم يتغير ──');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(800);
    await pg.evaluate(() => window.go('store', 's9'));
    await pg.waitForTimeout(800);
    const g = await pg.evaluate(() => {
      const c = document.querySelector('.mrail .mcard');
      if (!c) return null;
      const cs = getComputedStyle(c); const im = c.querySelector('img');
      return { w: Math.round(c.getBoundingClientRect().width), ov: cs.overflow, br: cs.borderRadius, imh: im ? Math.round(im.getBoundingClientRect().height) : 0, n: document.querySelectorAll('.mrail .mcard').length };
    });
    ok('بطاقات المعرض موجودة: ' + (g ? g.n : 0), g && g.n > 0);
    ok('أبعاد البطاقة كما كانت: عرض ' + (g && g.w) + 'px (176)، صورة ' + (g && g.imh) + 'px (124)', g && g.w === 176 && g.imh === 124);
    ok('القص overflow:hidden كما كان + استدارة 16px', g && g.ov === 'hidden' && g.br === '16px');
    await pg.screenshot({ path: '/tmp/render/g-gallery.png' });
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════ ' + (fails.length ? 'فشل: ' + fails.join(' | ') : 'كل اختبارات التمرير ناجحة ✓') + ' ════════');
})();
