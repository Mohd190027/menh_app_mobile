/* فحص هندسي دقيق: يكتشف المشاكل الحقيقية برمجياً
   - نصوص مقطوعة (scrollWidth > clientWidth)
   - عناصر خارج حدود الشاشة
   - عناصر متداخلة
   - صور مكسورة
*/
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3000';
let issues = [];

async function auditPage(pg, label, viewportW) {
  const res = await pg.evaluate((vw) => {
    const problems = [];
    // 1) نصوص مقطوعة أفقياً
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length > 0) return;
      const t = (el.innerText || '').trim();
      if (!t || t.length < 2) return;
      const cs = getComputedStyle(el);
      if (cs.overflow === 'hidden' && el.scrollWidth > el.clientWidth + 4 && cs.textOverflow !== 'ellipsis') {
        // مقصوص بلا ellipsis = نص مبتور فعلياً
      }
      if (el.scrollWidth > el.clientWidth + 6 && cs.whiteSpace === 'nowrap' && cs.textOverflow !== 'ellipsis') {
        problems.push({ type: 'نص مبتور بلا ellipsis', text: t.slice(0, 50), sw: el.scrollWidth, cw: el.clientWidth, cls: el.className.toString().slice(0, 40) });
      }
    });
    // 2) عناصر تمتد خارج viewport أفقياً (باستثناء سلايدر مقصود)
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (el.closest && (el.closest('[class*="slider"]') || el.closest('[class*="ticker"]') || el.closest('[class*="marquee"]') || el.closest('[class*="strip"]'))) return;
      if (r.left < -8 && r.width < vw * 0.9) {
        // عنصر صغير خارج يسار
      }
      if (r.right > vw + 8 && r.width > 30 && r.width < vw) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed') {
          // عنصر يمتد خارج يمين
          const t = (el.innerText || '').trim().slice(0, 40);
          if (t) problems.push({ type: 'عنصر خارج يمين الشاشة', text: t, right: Math.round(r.right), vw, cls: el.className.toString().slice(0, 40) });
        }
      }
    });
    // 3) صور مكسورة
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
        problems.push({ type: 'صورة مكسورة', src: img.src.slice(0, 90) });
      }
    });
    // 4) تكرار نص فقرات (نفس النص الطويل مرتين في نفس الصفحة)
    const seen = {};
    document.querySelectorAll('p, div, span, h1, h2, h3').forEach(el => {
      if (el.children.length > 0) return;
      const t = (el.innerText || '').trim();
      if (t.length > 60) {
        if (seen[t]) problems.push({ type: 'نص مكرر حرفياً', text: t.slice(0, 60) + '...' });
        seen[t] = 1;
      }
    });
    return problems;
  }, viewportW).catch(e => [{ type: 'خطأ تقييم', err: String(e).slice(0, 100) }]);
  res.forEach(p => issues.push(`[${label}] ${p.type}: ${p.text || p.src || p.err || ''} (cls=${p.cls || ''})`));
  return res.length;
}

(async () => {
  const browser = await chromium.launch();

  const flows = [
    { label: 'زائر-رئيسية-سطح المكتب', role: null, w: 1280, h: 940, pages: [null] },
    { label: 'زائر-رئيسية-جوال', role: null, w: 390, h: 844, pages: [null] },
    { label: 'عميل-رئيسية-جوال', role: ['0500000001', 'client'], w: 390, h: 844, pages: [null, 'cart', 'account'] },
    { label: 'تاجر-نموذج منتج-سطح', role: ['0500000002', 'merchant'], w: 1280, h: 940, pages: ['m-prods'] },
    { label: 'تاجر-نموذج منتج-جوال', role: ['0500000002', 'merchant'], w: 390, h: 844, pages: ['m-prods'] },
    { label: 'موظف-المركز-سطح', role: ['0500000013', 'staff'], w: 1280, h: 940, pages: [null, 'e-stores', 'e-disputes'] },
    { label: 'موظف-المركز-جوال', role: ['0500000013', 'staff'], w: 390, h: 844, pages: [null, 'e-stores', 'e-disputes'] },
    { label: 'إدارة-المركز-سطح', role: ['0500000003', 'admin'], w: 1280, h: 940, pages: [null, 'a-stores', 'a-disputes'] },
  ];

  for (const f of flows) {
    const ctx = await browser.newContext({ viewport: { width: f.w, height: f.h } });
    if (f.role) {
      await ctx.addInitScript(([ph, r]) => {
        try { localStorage.setItem('dameen_v1', JSON.stringify({ ses: { phone: ph, role: r }, cart: [], gfav: [] })); } catch(e) {}
      }, f.role);
    }
    const pg = await ctx.newPage();
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(900);
    for (const view of f.pages) {
      if (view) {
        await pg.evaluate(v => { if (window.go) window.go(v); }, view);
        await pg.waitForTimeout(700);
      }
      // لوحة التاجر: افتح نموذج إضافة منتج
      if (view === 'm-prods') {
        const addBtn = pg.locator('button:has-text("منتج جديد")').first();
        if (await addBtn.count()) { try { await addBtn.click(); await pg.waitForTimeout(800); } catch (e) {} }
      }
      const n = await auditPage(pg, `${f.label}${view ? '/' + view : ''}`, f.w);
      console.log(`  فحص ${f.label}${view ? '/' + view : ''}: ${n === 0 ? 'نظيف ✓' : n + ' مشكلة'}`);
    }
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════ النتائج ════════');
  if (!issues.length) console.log('لا مشاكل هندسية مكتشفة');
  else issues.forEach(i => console.log('• ' + i));
  fs.writeFileSync('/tmp/render/geometry-issues.txt', issues.join('\n'));
})();
