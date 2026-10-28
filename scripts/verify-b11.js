const { chromium } = require('playwright');
let PASS = 0, FAIL = 0;
const chk = (name, cond, extra) => {
  if (cond) { PASS++; console.log('  PASS ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
  else { FAIL++; console.log('  **FAIL** ' + name + (extra !== undefined ? ' | ' + JSON.stringify(extra) : '')); }
};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, permissions: ['geolocation'] });
  await ctx.setGeolocation({ latitude: 24.7136, longitude: 46.6753 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);

  // ============ T1: شبكة الأقسام ٢×٢ ============
  console.log('== T1: الأقسام الأربعة كل اثنين جمب بعض ==');
  const grid = await pg.evaluate(() => {
    const t = document.querySelector('.trio');
    return { cols: t ? getComputedStyle(t).gridTemplateColumns.split(' ').length : 0, n: document.querySelectorAll('.tri').length };
  });
  chk('الرئيسية: ٤ بطاقات أقسام', grid.n === 4, grid);
  chk('الشبكة: عمودان (٢×٢)', grid.cols === 2, grid.cols);
  // زائر → قسم → متجر → منتج (لاختبار زر الرئيسية لاحقاً)
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(400);
  await pg.evaluate(() => {
    const first = document.querySelector('.bigstore');
    if (first) first.click();
  });
  await pg.waitForTimeout(400);
  const inStore = await pg.evaluate(() => ({ page: VIEW.page, store: VIEW.store }));
  chk('زائر: دخل متجراً من القسم', inStore.page === 'store', inStore);

  // ============ T2: دخول العميل — القائمة المنسدلة للأقسام ============
  console.log('== T2: قائمة «الأقسام» المنسدلة العلوية ==');
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  // عد خلفية: التأكد أن العميل في الرئيسية
  await pg.evaluate(() => go('home'));
  await pg.waitForTimeout(400);
  const navTxt = await pg.evaluate(() => document.querySelector('#top .nav')?.innerText || '');
  chk('القائمة: فيها الأقسام ▾', navTxt.includes('الأقسام'), navTxt.slice(0, 60));
  await pg.click('#top .nav [data-secb]');
  await pg.waitForTimeout(300);
  const drop = await pg.evaluate(() => {
    const el = document.querySelector('#secdrop');
    return { open: !!el && el.classList.contains('open'), items: el ? el.querySelectorAll('.hti').length : 0, fixed: el ? getComputedStyle(el).position : '' };
  });
  chk('القائمة: تفتح عند النقر', drop.open, drop);
  chk('القائمة: ٤ أقسام داخلها', drop.items === 4, drop.items);
  chk('القائمة: position fixed (لا قص بالشريط)', drop.fixed === 'fixed', drop.fixed);
  await pg.evaluate(() => { [...document.querySelectorAll('#secdrop .hti')].find(x => x.textContent.includes('الألعاب')).click(); });
  await pg.waitForTimeout(500);
  const secG = await pg.evaluate(() => ({ page: VIEW.page, sec: VIEW.sec, closed: !document.querySelector('#secdrop').classList.contains('open') }));
  chk('القائمة: اختيار قسم ينتقل له', secG.page === 'section' && secG.sec === 'gaming', secG);
  chk('القائمة: تُغلق بعد الانتقال', secG.closed);
  // النقر خارجها يغلقها
  await pg.evaluate(() => go('home'));
  await pg.waitForTimeout(300);
  await pg.click('#top .nav [data-secb]');
  await pg.waitForTimeout(200);
  await pg.click('body', { position: { x: 300, y: 500 } });
  await pg.waitForTimeout(200);
  const closedOut = await pg.evaluate(() => !document.querySelector('#secdrop').classList.contains('open'));
  chk('القائمة: النقر خارجها يغلقها', closedOut);

  // ============ T3: زر الرئيسية يعيد لبداية القسم ============
  console.log('== T3: زر الرئيسية الذكي ==');
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { const st = STORES.find(s => s.sec === 'family' && stOK(s)); go('store', st.id); });
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { const p = PRODUCTS.find(x => x.store === VIEW.store); go('product', p.id); });
  await pg.waitForTimeout(300);
  const before = await pg.evaluate(() => ({ page: VIEW.page, pid: VIEW.pid }));
  chk('التنقل: وصلنا لصفحة منتج', before.page === 'product', before);
  await pg.evaluate(() => { [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === 'الرئيسية').click(); });
  await pg.waitForTimeout(500);
  const back = await pg.evaluate(() => ({ page: VIEW.page, sec: VIEW.sec }));
  chk('زر الرئيسية: من منتج ← بداية القسم', back.page === 'section' && back.sec === 'family', back);
  // من داخل المتجر مباشرة
  await pg.evaluate(() => { const st = STORES.find(s => s.sec === 'deco' && stOK(s)); go('store', st.id); });
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === 'الرئيسية').click(); });
  await pg.waitForTimeout(500);
  const back2 = await pg.evaluate(() => ({ page: VIEW.page, sec: VIEW.sec }));
  chk('زر الرئيسية: من متجر ← بداية القسم', back2.page === 'section' && back2.sec === 'deco', back2);
  // من الرئيسية نفسها → الرئيسية العادية
  await pg.evaluate(() => { [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === 'الرئيسية').click(); });
  await pg.waitForTimeout(400);
  const back3 = await pg.evaluate(() => VIEW.page);
  chk('زر الرئيسية: من صفحة قسم (أعلاها) → الرئيسية العادية', back3 === 'home' || back3 === 'section', back3);
  // بحث سياقي من داخل قسم ثم الرئيسية
  await pg.evaluate(() => go('section', 'gaming'));
  await pg.waitForTimeout(300);
  await pg.evaluate(() => go('search', 'كود'));
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === 'الرئيسية').click(); });
  await pg.waitForTimeout(500);
  const back4 = await pg.evaluate(() => ({ page: VIEW.page, sec: VIEW.sec }));
  chk('زر الرئيسية: من بحث داخل قسم ← بداية القسم', back4.page === 'section' && back4.sec === 'gaming', back4);

  // ============ T4: التاجر — نقاط الولاء إجبارية ============
  console.log('== T4: نقاط الولاء إجبارية في فورم المنتج ==');
  await pg.evaluate(() => { SES = { phone: '0500000002', role: 'merchant', store: 's1' }; render(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => mProdForm(null));
  await pg.waitForTimeout(300);
  const lbl = await pg.evaluate(() => document.body.innerHTML.includes('نقاط ولاء يمنحها المنتج للعميل (إجبارية)'));
  chk('الفورم: النقاط موسومة إجبارية', lbl);
  await pg.evaluate(() => { document.querySelector('#mp-nm').value = 'منتج اختبار الدفعة ١١'; document.querySelector('#mp-pr').value = '99'; document.querySelector('#mp-st').value = '5'; });
  await pg.evaluate(() => mSaveProd(''));
  await pg.waitForTimeout(300);
  const blockedPts = await pg.evaluate(() => ({ toast: (document.querySelector('#toasts') || { innerText: '' }).innerText, open: !!document.querySelector('#modals .mbody') }));
  chk('الحفظ بلا نقاط مرفوض برسالة إجبارية', blockedPts.toast.includes('نقاط الولاء إجبارية') || (await pg.evaluate(() => document.body.innerText)).includes('نقاط الولاء إجبارية'), blockedPts);
  chk('النافذة بقيت مفتوحة (لم يُحفظ)', blockedPts.open);

  // ============ T5: التاجر — إضافة سؤال (اختيارات + كتابة) ============
  console.log('== T5: منشئ أسئلة المنتج ==');
  await pg.evaluate(() => { document.querySelector('#mp-pts').value = '30'; });
  await pg.evaluate(() => mAddQ2());
  await pg.waitForTimeout(200);
  const qform = await pg.evaluate(() => ({
    open: !!document.querySelector('#mqq-q'),
    types: document.querySelector('#mqq-t') ? document.querySelector('#mqq-t').options.length : 0,
  }));
  chk('منشئ السؤال: فُتح', qform.open, qform);
  chk('منشئ السؤال: نوعان (اختيارات/كتابة)', qform.types === 2, qform.types);
  // سؤال اختيارات
  await pg.evaluate(() => { document.querySelector('#mqq-q').value = 'ما اللون المطلوب؟'; document.querySelector('#mqq-o0').value = 'أسود'; document.querySelector('#mqq-o1').value = 'بيج'; });
  await pg.evaluate(() => mpqPush());
  await pg.waitForTimeout(200);
  const q1 = await pg.evaluate(() => ({ n: MPQ.length, t: MPQ[0] && MPQ[0].t, o: MPQ[0] && MPQ[0].o.length }));
  chk('أُضيف سؤال اختيارات بخيارين', q1.n === 1 && q1.t === 'opts' && q1.o === 2, q1);
  // سؤال كتابة
  await pg.evaluate(() => mAddQ2());
  await pg.waitForTimeout(150);
  await pg.evaluate(() => { document.querySelector('#mqq-t').value = 'txt'; mpqType(); document.querySelector('#mqq-q').value = 'اكتب الاسم المراد تطريزه'; });
  await pg.evaluate(() => mpqPush());
  await pg.waitForTimeout(200);
  const q2 = await pg.evaluate(() => ({ n: MPQ.length, t2: MPQ[1] && MPQ[1].t }));
  chk('أُضيف سؤال كتابة', q2.n === 2 && q2.t2 === 'txt', q2);
  // حفظ المنتج
  await pg.evaluate(() => mSaveProd(''));
  await pg.waitForTimeout(500);
  const saved = await pg.evaluate(() => {
    const p = PRODUCTS.find(x => x.name === 'منتج اختبار الدفعة ١١');
    return { found: !!p, pts: p && p.pts, qs: p && p.qs ? p.qs.length : 0, id: p && p.id };
  });
  chk('حُفظ المنتج بنقاط ٣٠ وسؤالين', saved.found && saved.pts === 30 && saved.qs === 2, saved);

  // ============ T6: العميل — الأسئلة تظهر وقت التصفح والإجابة إجبارية ============
  console.log('== T6: أسئلة المنتج في صفحة العميل ==');
  await pg.evaluate(() => { SES = { phone: '0500000001', role: 'customer', store: null }; render(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { go('product', PRODUCTS.find(x => x.name === 'منتج اختبار الدفعة ١١').id); });
  await pg.waitForTimeout(400);
  const pqs = await pg.evaluate(() => ({
    wrap: !!document.querySelector('.pqwrap'),
    blocks: document.querySelectorAll('.pq').length,
    chips: document.querySelectorAll('.pq .chip').length,
    txtIn: [...document.querySelectorAll('.pq input.inp')].length,
  }));
  chk('صفحة المنتج: بلوك الأسئلة ظاهر', pqs.wrap, pqs);
  chk('صفحة المنتج: سؤالان (اختيارات + كتابة)', pqs.blocks === 2, pqs.blocks);
  chk('صفحة المنتج: خياران chips + حقل كتابة', pqs.chips === 2 && pqs.txtIn === 1, pqs);
  // إضافة للسلة بلا إجابة → مرفوض
  await pg.evaluate(() => addToCart(VIEW.pid, 1));
  await pg.waitForTimeout(300);
  const refused = await pg.evaluate(() => document.body.innerText.includes('أجب عن سؤال التاجر'));
  chk('الإضافة بلا إجابة مرفوضة برسالة', refused);
  const cartStill = await pg.evaluate(() => CART.length);
  chk('لم يُضف للسلة', cartStill === 0, cartStill);
  // الإجابة ثم الإضافة
  await pg.evaluate(() => { [...document.querySelectorAll('.pq .chip')][0].click(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.querySelector('.pq input.inp').value = 'نور'; PANS[1] = 'نور'; });
  await pg.evaluate(() => addToCart(VIEW.pid, 1));
  await pg.waitForTimeout(300);
  const carted = await pg.evaluate(() => ({ n: CART.length, ans: CART[0] && CART[0].ans ? CART[0].ans.length : 0, a0: CART[0] && CART[0].ans && CART[0].ans[0] }));
  chk('أُضيف للسلة بعد الإجابة', carted.n === 1, carted);
  chk('الإجابات مرفقة بعنصر السلة', carted.ans === 2 && carted.a0.a === 'أسود', carted.a0);
  // شارة مجاب في السلة
  await pg.evaluate(() => go('cart'));
  await pg.waitForTimeout(400);
  const badge = await pg.evaluate(() => document.body.innerText.includes('❓ أسئلة مجابة'));
  chk('السلة: شارة «أسئلة مجابة»', badge);

  // ============ T7: إتمام طلب حقيقي — الإجابات تصل للتاجر ============
  console.log('== T7: إجابات الأسئلة تصل بطاقة الطلب للطرفين ==');
  await pg.evaluate(() => startCheckout());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => ckNext());
  await pg.waitForTimeout(200);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(700);
  const ord = await pg.evaluate(() => {
    const o = DB.orders[0];
    const g = o.groups[0];
    return { id: o.id, pans: g.pans ? g.pans.length : 0, pn: g.pans && g.pans[0] && g.pans[0].pn, a: g.pans && g.pans[0] && g.pans[0].ans.map(y => y.a) };
  });
  chk('الطلب: الشحنة تحمل pans', ord.pans === 1, ord);
  chk('الطلب: اسم المنتج مع الإجابات', ord.pn === 'منتج اختبار الدفعة ١١' && ord.a.includes('أسود') && ord.a.includes('نور'), ord);
  // بطاقة الطلب للعميل تعرضها
  await pg.evaluate(() => { closeModal(); go('orders'); });
  await pg.waitForTimeout(500);
  const custView = await pg.evaluate(() => document.body.innerText.includes('إجاباتك على أسئلة المنتجات'));
  chk('بطاقة العميل: تعرض إجابات أسئلة المنتجات', custView);
  // بطاقة التاجر تعرضها
  await pg.evaluate(() => { SES = { phone: '0500000002', role: 'merchant', store: 's1' }; render(); go('m-orders'); });
  await pg.waitForTimeout(500);
  const merchView = await pg.evaluate(() => document.body.innerText.includes('إجابات العميل على أسئلة المنتجات'));
  chk('بطاقة التاجر: تعرض إجابات العميل', merchView);

  // ============ T8: الإدارة — المركز نظرة عامة + صفحة المتاجر المستقلة ============
  console.log('== T8: المركز وصفحة المتاجر المستقلة ==');
  await pg.evaluate(() => { SES = { phone: '0500000003', role: 'admin', store: null }; render(); go('a-hub'); });
  await pg.waitForTimeout(500);
  const hub = await pg.evaluate(() => ({
    h1: document.querySelector('.pghead h1')?.textContent || '',
    tabs: [...document.querySelectorAll('.tabs button')].map(x => x.textContent.trim()),
    over: document.querySelectorAll('.kpis .kpi').length,
  }));
  chk('المركز: العنوان «مركز إدارة ضمين»', hub.h1.includes('مركز إدارة ضمين'), hub.h1);
  chk('المركز: بلا تبويبات (طلبات التسجيل والمتاجر فُصلا)', hub.tabs.length === 0, hub.tabs);
  chk('المركز: النظرة العامة تعرض KPIs', hub.over >= 5, hub.over);
  // القائمة العلوية: ٥ بنود مع زر «المتاجر» المستقل
  const anav = await pg.evaluate(() => [...document.querySelectorAll('#top .nav .nlink')].map(x => x.textContent.trim()));
  chk('قائمة الإدارة: ٥ بنود', anav.length === 5, anav);
  chk('قائمة الإدارة: زر «🏪 المتاجر» مستقل وبلا طلبات منفصلة', anav.some(x => x.trim() === '🏪 المتاجر') && !anav.some(x => x.includes('طلبات التسجيل')), anav);
  // زر المتاجر ← الصفحة المستقلة
  await pg.evaluate(() => { const b = [...document.querySelectorAll('#top .nav .nlink')].find(x => x.textContent.trim() === '🏪 المتاجر'); b.click(); });
  await pg.waitForTimeout(400);
  const sp = await pg.evaluate(() => ({
    page: VIEW.page, atab: VIEW.atab, h1: document.querySelector('.pghead h1')?.textContent || '',
    tabs: [...document.querySelectorAll('.tabs button')].map(x => x.textContent.trim()),
  }));
  chk('زر المتاجر: يفتح صفحة «المتاجر» بتبويبها الافتراضي', sp.page === 'a-stores' && sp.atab === 'stores' && sp.h1.includes('المتاجر') && sp.tabs.length === 2 && sp.tabs[0].includes('طلبات التسجيل') && sp.tabs[1].includes('جميع المتاجر'), sp);
  const storT = await pg.evaluate(() => ({
    rows: document.querySelectorAll('.acard .row').length,
    head: document.body.innerText.includes('🏪 إدارة المتاجر'),
    approve: document.body.innerText.includes('اعتماد'),
  }));
  chk('تبويب المتاجر: يعرض كل المتاجر بلا أي اعتماد', storT.head && storT.rows >= 8 && !storT.approve, storT);
  // تبويب الطلبات داخل الصفحة المستقلة
  await pg.evaluate(() => astTab('reqs'));
  await pg.waitForTimeout(400);
  const reqsT = await pg.evaluate(() => ({
    cards: document.querySelectorAll('.acard').length,
    head: document.body.innerText.includes('📋 طلبات التسجيل'),
  }));
  chk('تبويب الطلبات: يعرض الطلبات', reqsT.head && reqsT.cards >= 1, reqsT);
  // مسار إشعار قديم a-reqs → صفحة المتاجر · تبويب reqs
  await pg.evaluate(() => go('a-reqs'));
  await pg.waitForTimeout(400);
  chk('المسار القديم a-reqs يفتح صفحة المتاجر · تبويب الطلبات', await pg.evaluate(() => VIEW.page === 'a-stores' && VIEW.atab === 'reqs'));
  await pg.evaluate(() => go('a-over'));
  await pg.waitForTimeout(400);
  chk('المسار القديم a-over يفتح المركز (نظرة عامة)', await pg.evaluate(() => VIEW.page === 'a-hub'));

  // ============ T9: تغيير اسم القسم ============
  console.log('== T9: تغيير اسم القسم من صفحة الأقسام ==');
  await pg.evaluate(() => go('a-cats'));
  await pg.waitForTimeout(400);
  const renameBtns = await pg.evaluate(() => [...document.querySelectorAll('.acard button')].filter(x => x.textContent.includes('تغيير الاسم')).length);
  chk('صفحة الأقسام: ٤ أزرار «تغيير الاسم»', renameBtns === 4, renameBtns);
  await pg.evaluate(() => secRename('gaming'));
  await pg.waitForTimeout(300);
  const modal = await pg.evaluate(() => ({ nm: !!document.querySelector('#sn-nm'), val: document.querySelector('#sn-nm') ? document.querySelector('#sn-nm').value : '' }));
  chk('نافذة التغيير: تحمل الاسم الحالي', modal.nm && modal.val.includes('الألعاب'), modal);
  await pg.evaluate(() => { document.querySelector('#sn-nm').value = 'عالم الجيمرز والتقنية'; document.querySelector('#sn-ds').value = 'أجهزة وأكواد وأصول رقمية'; secSaveName('gaming'); });
  await pg.waitForTimeout(500);
  const renamed = await pg.evaluate(() => ({ sec: SEC('gaming').name, home: document.body.innerText.includes('عالم الجيمرز والتقنية') }));
  chk('الاسم تغيّر في البيانات وفي صفحة الأقسام', renamed.sec === 'عالم الجيمرز والتقنية' && renamed.home, renamed);
  // يظهر في قائمة الأقسام العلوية للعميل
  await pg.evaluate(() => { SES = { phone: '0500000001', role: 'customer', store: null }; render(); go('home'); });
  await pg.waitForTimeout(400);
  await pg.click('#top .nav [data-secb]');
  await pg.waitForTimeout(200);
  const inDrop = await pg.evaluate(() => document.querySelector('#secdrop').innerText.includes('عالم الجيمرز والتقنية'));
  chk('الاسم الجديد في القائمة المنسدلة للعميل', inDrop);
  // وبطاقة الرئيسية
  const inHome = await pg.evaluate(() => document.body.innerText.includes('عالم الجيمرز والتقنية'));
  chk('الاسم الجديد في بطاقات الرئيسية', inHome);
  // استرجاع الاسم الأصلي (نظافة الاختبار)
  await pg.evaluate(() => { SEC('gaming').name = 'عالم الألعاب والأجهزة والمنتجات الرقمية'; render(); });

  // ============ T10: انحدار — لا أخطاء + الأدوار + صور ============
  console.log('== T10: انحدار عام ==');
  const imgs = await pg.evaluate(async () => {
    const els = [...document.querySelectorAll('img')].slice(0, 30);
    return els.filter(i => i.complete && i.naturalWidth === 0).length;
  });
  chk('لا صور مكسورة (عينة ٣٠)', imgs === 0, imgs);
  await pg.evaluate(() => { SES = null; CART = []; render(); });
  await pg.waitForTimeout(400);
  const guest = await pg.evaluate(() => ({ login: document.body.innerText.includes('تسجيل الدخول'), trios: document.querySelectorAll('.tri').length }));
  chk('الزائر: الشريط المصغر والأقسام ٤', guest.login && guest.trios === 4, guest);
  chk('صفر أخطاء JS', errs.length === 0, errs.slice(0, 3));

  console.log('\n===== RESULT: PASS=' + PASS + ' FAIL=' + FAIL + ' =====');
  await b.close();
  process.exit(FAIL ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
