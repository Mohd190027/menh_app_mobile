/* الدفعة ١٢ — تحقق: زر المتاجر ▾ في قائمة الإدارة + حذف حق الاعتماد نهائياً */
const { chromium } = require('playwright');
let PASS = 0, FAIL = 0;
const chk = (name, cond, extra) => {
  if (cond) { PASS++; console.log('  PASS ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
  else { FAIL++; console.log('  **FAIL** ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);

  // ============ T1: زر المتاجر ▾ في قائمة الإدارة العلوية ============
  console.log('== T1: زر «المتاجر ▾» بقائمة منسدلة ==');
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await pg.waitForTimeout(500);
  const btn = await pg.$('#top .nav [data-storesb]');
  chk('زر «🏪 المتاجر ▾» موجود في الشريط العلوي', !!btn);
  await pg.click('#top .nav [data-storesb]');
  await pg.waitForTimeout(250);
  const ddOpen = await pg.evaluate(() => {
    const el = document.querySelector('#storesdrop');
    return { open: el && el.classList.contains('open'), fixed: el && getComputedStyle(el).position === 'fixed', items: el ? [...el.querySelectorAll('.hti')].map(x => x.innerText.trim()) : [] };
  });
  chk('القائمة تفتح (position:fixed)', ddOpen.open && ddOpen.fixed, ddOpen);
  chk('القائمة فيها «طلبات التسجيل» و«جميع المتاجر»', ddOpen.items.length === 2 && ddOpen.items[0].includes('طلبات التسجيل') && ddOpen.items[1].includes('جميع المتاجر'), ddOpen.items);
  // اختيار «طلبات التسجيل» → تبويب reqs
  await pg.evaluate(() => [...document.querySelectorAll('#storesdrop .hti')].find(x => x.innerText.includes('طلبات التسجيل')).click());
  await pg.waitForTimeout(400);
  chk('اختيار «طلبات التسجيل» → تبويب الطلبات', await pg.evaluate(() => VIEW.page === 'a-hub' && VIEW.atab === 'reqs' && document.body.innerText.includes('📋 طلبات التسجيل')));
  // فتح واختيار «جميع المتاجر»
  await pg.click('#top .nav [data-storesb]');
  await pg.waitForTimeout(250);
  await pg.evaluate(() => [...document.querySelectorAll('#storesdrop .hti')].find(x => x.innerText.includes('جميع المتاجر')).click());
  await pg.waitForTimeout(400);
  chk('اختيار «جميع المتاجر» → تبويب المتاجر', await pg.evaluate(() => VIEW.page === 'a-hub' && VIEW.atab === 'stores' && document.body.innerText.includes('🏪 إدارة المتاجر')));
  // إغلاق بالنقر خارجها
  await pg.click('#top .nav [data-storesb]');
  await pg.waitForTimeout(200);
  await pg.click('.pghead h1');
  await pg.waitForTimeout(200);
  chk('النقر خارج القائمة يغلقها', await pg.evaluate(() => !document.querySelector('#storesdrop').classList.contains('open')));

  // ============ T2: حذف حق الاعتماد نهائياً ============
  console.log('== T2: حذف حق الاعتماد ==');
  const noApprove = await pg.evaluate(() => ({
    stOK: stOK(STORES[0]) === true,
    hasField: STORES.some(s => 'approved' in s),
    aApproveFn: typeof aApprove === 'undefined',
    hubTxt: document.body.innerText,
  }));
  chk('stOK تعمل بلا approved (المتاجر غير الموقوفة صالحة)', noApprove.stOK);
  chk('لا حقل approved في أي متجر', !noApprove.hasField);
  chk('دالة aApprove حُذفت', noApprove.aApproveFn);
  chk('المركز لا يذكر «اعتماد» إطلاقاً', !noApprove.hubTxt.includes('اعتماد'), noApprove.hubTxt.includes('اعتماد'));
  // KPI بلا «معلق»
  await pg.evaluate(() => { ahubTab('over'); });
  await pg.waitForTimeout(400);
  const kpi = await pg.evaluate(() => document.querySelector('.kpis').innerText);
  chk('KPI المتاجر: بلا عدد «معلق»', kpi.includes('متجر في ضمين') && !kpi.includes('معلق'), kpi.replace(/\n/g, ' | '));
  // بطاقة صحة المتاجر في النظرة العامة
  const health = await pg.evaluate(() => document.body.innerText.includes('صحة المتاجر'));
  chk('بطاقة «صحة المتاجر» بدل «بانتظار الاعتماد»', health);

  // تبويب المتاجر: أزرار إيقاف/إلغاء فقط
  await pg.evaluate(() => ahubTab('stores'));
  await pg.waitForTimeout(400);
  const storesTab = await pg.evaluate(() => ({
    rows: document.querySelectorAll('.acard .row').length,
    txt: document.body.innerText,
  }));
  chk('تبويب المتاجر: ١٠ متاجر وبلا أي «اعتماد»', storesTab.rows >= 10 && !storesTab.txt.includes('اعتماد'), storesTab.rows);
  chk('تبويب المتاجر: أزرار «إيقاف» و«يعمل»', storesTab.txt.includes('إيقاف') && storesTab.txt.includes('يعمل'));

  // ============ T3: كل المتاجر معروضة للعملاء (فخار الطائف) ============
  console.log('== T3: فخار الطائف ظاهر للعميل ==');
  await pg.evaluate(() => { SES = { phone: '0500000001', role: 'customer', store: null }; render(); go('section', 'deco'); });
  await pg.waitForTimeout(500);
  const deco = await pg.evaluate(() => ({
    txt: document.body.innerText,
    n: STORES.filter(s => s.sec === 'deco' && stOK(s)).length,
  }));
  chk('قسم الديكور: كل متاجره معروضة (٣ متاجر)', deco.n === 3, deco.n);
  chk('«فخار الطائف» ظاهر في القسم', deco.txt.includes('فخار الطائف'));
  // منتجها p21 متاح في متجرها
  await pg.evaluate(() => { const st = STORES.find(s => s.name === 'فخار الطائف'); go('store', st.id); });
  await pg.waitForTimeout(400);
  const s7page = await pg.evaluate(() => ({ txt: document.body.innerText, p: pubProds().filter(x => x.id === 'p21').length }));
  chk('مزهرية الفخار (p21) ظاهرة في متجرها', s7page.txt.includes('مزهرية فخار') && s7page.p === 1, s7page.p);
  // وزر الرئيسية يظل يعمل من المتجر
  await pg.evaluate(() => homeGo());
  await pg.waitForTimeout(400);
  chk('زر الرئيسية من متجر فخار الطائف → بداية قسم الديكور', await pg.evaluate(() => VIEW.page === 'section' && VIEW.sec === 'deco'));

  // ============ T4: إعدادات التاجر بلا حق الاعتماد ============
  console.log('== T4: إعدادات التاجر ==');
  await pg.evaluate(() => { SES = { phone: '0500000009', role: 'merchant', store: 's7' }; render(); go('m-set'); });
  await pg.waitForTimeout(500);
  const mset = await pg.evaluate(() => document.body.innerText);
  chk('إعدادات التاجر: بلا «بانتظار الاعتماد»', !mset.includes('اعتماد'));
  chk('إعدادات التاجر: حالة المتجر «سليم»', mset.includes('حالة المتجر') && mset.includes('سليم'));

  // ============ T5: طلبات التسجيل تعمل كالسابق (موافقة/رفض) ============
  console.log('== T5: طلبات التسجيل لم تتأثر ==');
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; go('a-reqs'); });
  await pg.waitForTimeout(400);
  const reqs = await pg.evaluate(() => ({
    page: VIEW.page, atab: VIEW.atab,
    n: DB.reqs.filter(r => r.status === 'pending').length,
    fn: typeof aApproveReq === 'function' && typeof aRejectReq === 'function',
  }));
  chk('a-reqs يفتح تبويب الطلبات', reqs.page === 'a-hub' && reqs.atab === 'reqs');
  chk('الموافقة/الرفض متاحان', reqs.fn, reqs);
  // موافقة تفتح متجراً جديداً بلا حقل approved ويظهر فوراً للعملاء
  await pg.evaluate(() => { DB.reqs.push({ id: 'rq12', kind: 'store', store: 'متجر اختبار ب١٢', sec: 'deco', own: 'سعد', phone: '05001112233', email: '', cr: 'CR-12', iban: 'SA12', at: Date.now(), status: 'pending' }); render(); });
  await pg.evaluate(() => aApproveReq('rq12'));
  await pg.waitForTimeout(400);
  const newStore = await pg.evaluate(() => {
    const s = STORES.find(x => x.name === 'متجر اختبار ب١٢');
    return { s, ok: s ? stOK(s) : false, hasApproved: s ? ('approved' in s) : true };
  });
  chk('المتجر الجديد فُتح بلا حقل approved وصالح فوراً', newStore.s && newStore.ok && !newStore.hasApproved, newStore);
  // نظافة
  await pg.evaluate(() => { STORES.splice(STORES.findIndex(x => x.name === 'متجر اختبار ب١٢'), 1); DB.reqs.splice(DB.reqs.findIndex(r => r.id === 'rq12'), 1); USERS['05001112233'] = undefined; render(); });

  // ============ T6: انحدار — لا أخطاء + التاجر والإدارة يعملان ============
  console.log('== T6: انحدار ==');
  const imgs = await pg.evaluate(() => [...document.querySelectorAll('img')].slice(0, 40).filter(i => i.complete && i.naturalWidth === 0).length);
  chk('لا صور مكسورة (عينة ٤٠)', imgs === 0, imgs);
  chk('صفر أخطاء JS', errs.length === 0, errs.slice(0, 3));

  console.log('\n===== RESULT: PASS=' + PASS + ' FAIL=' + FAIL + ' =====');
  await b.close();
  process.exit(FAIL ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
