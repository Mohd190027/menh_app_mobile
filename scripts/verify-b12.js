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

  // ============ T1: زر «المتاجر» المباشر ← صفحة مستقلة ============
  console.log('== T1: زر «المتاجر» ← صفحة مستقلة بتبويبين ==');
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await pg.waitForTimeout(500);
  const hasBtn = await pg.evaluate(() => [...document.querySelectorAll('#top .nav .nlink')].some(x => x.textContent.trim() === '🏪 المتاجر'));
  chk('زر «🏪 المتاجر» مباشر في الشريط العلوي', hasBtn);
  chk('لا قائمة منسدلة متبقية (storesdrop محذوفة)', await pg.evaluate(() => !document.querySelector('#storesdrop')));
  // المركز: نظرة عامة فقط بلا تبويبات
  const hub1 = await pg.evaluate(() => ({ tabs: document.querySelectorAll('.tabs button').length, h1: (document.querySelector('.pghead h1') || {}).textContent || '' }));
  chk('المركز: بلا تبويبات (نظرة عامة فقط)', hub1.tabs === 0 && hub1.h1.includes('مركز إدارة ضمين'), hub1);
  // زر المتاجر ← الصفحة المستقلة
  await pg.evaluate(() => { const b = [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === '🏪 المتاجر'); b.click(); });
  await pg.waitForTimeout(400);
  const sp = await pg.evaluate(() => ({ page: VIEW.page, atab: VIEW.atab, h1: (document.querySelector('.pghead h1') || {}).textContent || '', tabs: [...document.querySelectorAll('.tabs button')].map(x => x.textContent.trim()) }));
  chk('الزر يفتح صفحة «المتاجر» المستقلة', sp.page === 'a-stores' && sp.h1.includes('المتاجر'), sp);
  chk('التبويب الافتراضي «جميع المتاجر» + تبويبان', sp.atab === 'stores' && sp.tabs.length === 2 && sp.tabs[0].includes('طلبات التسجيل') && sp.tabs[1].includes('جميع المتاجر'), sp.tabs);
  // تحويل التبويب داخل الصفحة
  await pg.evaluate(() => astTab('reqs'));
  await pg.waitForTimeout(300);
  chk('astTab(reqs) يعرض الطلبات', await pg.evaluate(() => VIEW.atab === 'reqs' && document.body.innerText.includes('📋 طلبات التسجيل')));
  await pg.evaluate(() => astTab('stores'));
  await pg.waitForTimeout(300);
  chk('astTab(stores) يعرض إدارة المتاجر', await pg.evaluate(() => VIEW.atab === 'stores' && document.body.innerText.includes('🏪 إدارة المتاجر')));
  // ملخص المركز ينقل للصفحة
  await pg.evaluate(() => go('a-hub'));
  await pg.waitForTimeout(300);
  const sumGo = await pg.evaluate(() => document.body.innerText.includes('المتاجر وطلبات التسجيل') && document.body.innerText.includes('فتح صفحة المتاجر'));
  chk('المركز: بطاقة ملخص بزر «فتح صفحة المتاجر»', sumGo);
  const kpiClick = await pg.evaluate(() => { const k = [...document.querySelectorAll('.kpi')].find(x => x.textContent.includes('متجر في ضمين')); k.click(); return { page: VIEW.page, atab: VIEW.atab }; });
  chk('KPI المتاجر ينقل لصفحة المتاجر', kpiClick.page === 'a-stores' && kpiClick.atab === 'stores', kpiClick);

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
  await pg.evaluate(() => { go('a-hub'); });
  await pg.waitForTimeout(400);
  const kpi = await pg.evaluate(() => document.querySelector('.kpis').innerText);
  chk('KPI المتاجر: بلا عدد «معلق»', kpi.includes('متجر في ضمين') && !kpi.includes('معلق'), kpi.replace(/\n/g, ' | '));
  // بطاقة الملخص في النظرة العامة (بدل بطاقات الإدارة المنقولة)
  const health = await pg.evaluate(() => document.body.innerText.includes('المتاجر وطلبات التسجيل'));
  chk('بطاقة ملخص المتاجر والطلبات في المركز', health);

  // تبويب المتاجر: أزرار إيقاف/إلغاء فقط
  await pg.evaluate(() => go('a-stores'));
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
  chk('a-reqs يفتح صفحة المتاجر · تبويب الطلبات', reqs.page === 'a-stores' && reqs.atab === 'reqs');
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
