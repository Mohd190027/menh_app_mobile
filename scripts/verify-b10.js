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

  // ============ T1: القسم الرابع في الرئيسية والقسم ============
  console.log('== T1: عالم الألعاب والأجهزة والمنتجات الرقمية ==');
  const home4 = await pg.evaluate(() => ({
    tri: document.querySelectorAll('.tri').length,
    four: document.body.innerText.includes('عوالم ضمين الأربعة'),
    chip: document.body.innerText.includes('تسليم رقمي فوري'),
  }));
  chk('الرئيسية: ٤ عوالم', home4.tri === 4, home4);
  chk('الرئيسية: نص الأربعة', home4.four);
  await pg.evaluate(() => go('section', 'gaming'));
  await pg.waitForTimeout(500);
  const sec = await pg.evaluate(() => ({
    stores: document.querySelectorAll('.bigstore').length,
    prods: document.querySelectorAll('.pgrid .pcard').length,
    hero: !!document.querySelector('.sechero'),
    name: document.querySelector('.pghead h1')?.textContent,
    chips: [...document.querySelectorAll('.chiprow .chip')].length,
  }));
  chk('القسم: متجران كبيران', sec.stores === 2, sec);
  chk('القسم: ٨ منتجات', sec.prods === 8, sec);
  chk('القسم: ٥ تصنيفات (الكل + ٤)', sec.chips === 5, sec);
  // بطاقة المتجر تعرض المتجرين
  const storeNames = await pg.evaluate(() => [...document.querySelectorAll('.bigstore h3')].map(x => x.textContent));
  chk('القسم: قيمز زون وبايت كود', storeNames.includes('قيمز زون') && storeNames.includes('بايت كود'), storeNames);

  // ============ T2: منتج رقمي — سلة ٠ شحن + مكتبة رقمية ============
  console.log('== T2: الأصول الرقمية والمكتبة الرقمية ==');
  const sq = await pg.evaluate(() => ({
    digi: shipQuote([{ p: P('p29'), qty: 1 }], ST('s10'), 'الرياض', false),
    frag: shipQuote([{ p: P('p25'), qty: 1 }], ST('s9'), 'الرياض', false),
    instFar: shipQuote([{ p: P('p15'), qty: 1 }], ST('s4'), 'الرياض', false),
    instNear: shipQuote([{ p: P('p23'), qty: 1 }], ST('s8'), 'الرياض', false),
    coldSame: shipQuote([{ p: P('p22'), qty: 1 }], ST('s8'), 'الرياض', false).label,
    coldFar: shipQuote([{ p: P('p14'), qty: 1 }], ST('s4'), 'الرياض', false).label,
  }));
  chk('shipQuote: رقمي = ٠ شحن', sq.digi.mode === 'digital' && sq.digi.charge === 0, { mode: sq.digi.mode, charge: sq.digi.charge });
  chk('shipQuote: قابل للكسر +١٥ (١٢+١٥=٢٧)', sq.frag.fragile === true && sq.frag.cost === 27 && sq.frag.charge === 27, sq.frag);
  chk('shipQuote: فوري خارج المدينة محجوب', !!sq.instFar.blocked && sq.instFar.blocked.includes('خارج نطاق التوصيل الفوري'), sq.instFar.blocked);
  chk('shipQuote: فوري داخل المدينة ١٠', !sq.instNear.blocked && sq.instNear.charge === 10, sq.instNear.charge);
  chk('shipQuote: مبرد نفس المدينة بحافظة', sq.coldSame.includes('حافظة برودة'), sq.coldSame);
  chk('shipQuote: مبرد بين المدن عبر OTO/Torod', sq.coldFar.includes('بين المدن') && sq.coldFar.includes('OTO/Torod'), sq.coldFar);

  // دخول العميل وشراء منتج رقمي
  await pg.evaluate(() => { openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { CART = []; addToCart('p29', 1); go('cart'); });
  await pg.waitForTimeout(400);
  const digiCart = await pg.evaluate(() => ({
    zero: document.body.innerText.includes('تسليم رقمي فوري — ٠ ر.س شحن'),
    badge: document.body.innerText.includes('رقمي فوري'),
    dlRow: document.body.innerText.includes('مجاني 🎉') || document.body.innerText.includes('٠ ر.س'),
  }));
  chk('السلة: تسليم رقمي فوري ٠ ر.س', digiCart.zero, digiCart);
  const navLib = await pg.evaluate(() => document.querySelector('#top .nav')?.innerText.includes('مكتبتي'));
  chk('القائمة: رابط 📚 مكتبتي للعميل', navLib);
  // شراء
  await pg.evaluate(() => startCheckout());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => ckNext());
  await pg.waitForTimeout(200);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(600);
  const succDigi = await pg.evaluate(() => ({
    libBtn: !![...document.querySelectorAll('#ckbody button')].find(x => x.textContent.includes('مكتبتي الرقمية')),
    digiLine: document.querySelector('#ckbody')?.innerText.includes('سُلّمت فوراً'),
    oid: CK.oid,
  }));
  chk('الدفع: شاشة النجاح تعرض زر المكتبة', succDigi.libBtn, succDigi);
  // المكتبة الرقمية
  await pg.evaluate(() => { closeModal(); go('dlib'); });
  await pg.waitForTimeout(400);
  const lib1 = await pg.evaluate(() => ({
    count: document.querySelectorAll('.dlgcard').length,
    masked: document.querySelector('.dcode')?.textContent,
    isCode: !!(me().dlib || []).find(x => x.pid === 'p29' && x.kind === 'code'),
  }));
  chk('المكتبة: أصل رقمي واحد', lib1.count === 1 && lib1.isCode, lib1);
  chk('المكتبة: الكود مخفي ••••', (lib1.masked || '').includes('••'), lib1.masked);
  await pg.evaluate(() => dReveal(0));
  await pg.waitForTimeout(200);
  const revealed = await pg.evaluate(() => document.querySelector('.dcode')?.textContent);
  chk('المكتبة: كشف الكود الصحيح', revealed === 'DRR5-9K2M-X7Q4-88FV', revealed);
  // الطلب الرقمي: مستلم فوراً بنافذة حماية
  const digiOrder = await pg.evaluate(() => {
    const o = DB.orders.find(x => x.id === CK.oid) || DB.orders.find(x => x.groups.some(g => g.digi));
    const g = o.groups[0];
    return { st: g.status, digi: !!g.digi, win: !!(g.complaintUntil > Date.now()), noWb: !g.logi.wb, courier: g.logi.courier };
  });
  chk('الطلب الرقمي: استُلم فوراً + نافذة حماية + بلا بوليصة', digiOrder.st === 'received' && digiOrder.digi && digiOrder.win && digiOrder.noWb, digiOrder);

  // ============ T3: قابل للكسر — رسوم حماية وبوليصة ============
  console.log('== T3: الشحن القابل للكسر ==');
  await pg.evaluate(() => { CART = []; addToCart('p25', 1); go('cart'); });
  await pg.waitForTimeout(400);
  const fragCart = await pg.evaluate(() => ({
    badge: document.body.innerText.includes('قابل للكسر'),
    ship: [...document.querySelectorAll('.cgroup')].map(c => c.innerText).find(t => t.includes('شحن')) || '',
  }));
  chk('السلة: شارة ⚠️ قابل للكسر', fragCart.badge);
  chk('السلة: الشحن ٢٧ ر.س (١٢ + ١٥ حماية)', fragCart.ship.includes('٢٧'), fragCart.ship.slice(0, 120));
  await pg.evaluate(() => startCheckout());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { ckNext(); });
  await pg.waitForTimeout(200);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(500);
  await pg.evaluate(() => { closeModal(); go('orders'); });
  await pg.waitForTimeout(400);
  const fragOrd = await pg.evaluate(() => {
    const o = DB.orders[0]; const g = o.groups.find(g => g.store === 's9');
    return {
      notice: g.logi.events.some(e => e.t.includes('قابل للكسر') && e.t.includes('شركة الشحن')),
      fee: g.ship.cost === 27,
      strip: document.body.innerText.includes('العلامة منقولة آلياً'),
      wb: !!g.logi.wb,
    };
  });
  chk('البوليصة: تنبيه قابل للكسر منقول لشركة الشحن', fragOrd.notice && fragOrd.strip, fragOrd);
  chk('الشحن: ٢٧ ضمن الشحن وبوليصة آلية', fragOrd.fee && fragOrd.wb, fragOrd);

  // ============ T4: نطاق التوصيل الفوري ============
  console.log('== T4: نطاق الفوري داخل المدينة فقط ==');
  await pg.evaluate(() => { CART = []; addToCart('p15', 2); go('cart'); });
  await pg.waitForTimeout(400);
  const blocked = await pg.evaluate(() => document.body.innerText.includes('خارج نطاق التوصيل الفوري'));
  chk('السلة: إنذار خارج النطاق لتميس بريدة', blocked);
  const noModal = await pg.evaluate(() => { startCheckout(); return !document.querySelector('#ckbody'); });
  chk('الحجز ممنوع خارج النطاق (لا تفتح البوابة)', noModal);
  await pg.evaluate(() => { CART = []; addToCart('p23', 1); go('cart'); });
  await pg.waitForTimeout(400);
  const nearOK = await pg.evaluate(() => {
    const q = cartCalc().quotes['s8'];
    return { ok: !q.blocked, charge: q.charge, label: q.label };
  });
  chk('الفوري داخل الرياض (أم خالد): ١٠ ر.س مندوب', nearOK.ok && nearOK.charge === 10, nearOK);

  // ============ T5: الخدمة الميدانية — استلام من المقر + دردشة + موقع + مبلغ إضافي + OTP ============
  console.log('== T5: المناسبات (بلا توصيل) + دردشة ما بعد الدفع + OTP ==');
  await pg.evaluate(() => { CART = []; addToCart('p24', 1); startCheckout(); });
  await pg.waitForTimeout(400);
  const bookUI = await pg.evaluate(() => ({
    dlSelect: !!document.querySelector('#ckbody select') && document.querySelector('#ckbody').innerText.includes('طريقة تسليم المناسبة'),
    pickupOpt: [...document.querySelectorAll('#ckbody option')].some(o => o.textContent.includes('استلام من مقر المتجر')),
    bookForm: document.querySelector('#ckbody').innerText.includes('حجز موعد المناسبة'),
  }));
  chk('البوابة: خيار طريقة تسليم المناسبة + استلام من المقر', bookUI.dlSelect && bookUI.pickupOpt && bookUI.bookForm, bookUI);
  await pg.evaluate(() => { CK.book['s5'] = { dl: 'pickup', date: '2026-11-05', setup: '18:00', tear: '23:00' }; ckRefresh(); ckNext(); });
  await pg.waitForTimeout(250);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(2300); // انتظار فتح الدردشة تلقائياً بعد الدفع
  const chatAuto = await pg.evaluate(() => ({
    open: !!document.querySelector('#chatlog'),
    chatBtnOnSuccess: CK.chatG !== null && CK.chatG >= 0,
    sysCustom: (DB.orders[0].groups.find(g => g.store === 's5') || {}).custom === undefined,
    pickup: DB.orders[0].groups.find(g => g.store === 's5').logi.courier.includes('استلام من مقر المتجر'),
  }));
  chk('بعد الدفع: فتحت دردشة التنسيق تلقائياً', chatAuto.open && chatAuto.chatBtnOnSuccess, chatAuto);
  chk('بعد الدفع: الشحنة بلا توصيل (استلام من المقر)', chatAuto.pickup, chatAuto);
  // العميل يشارك موقعه من الدردشة
  await pg.evaluate(() => sendMyLoc());
  await pg.waitForTimeout(800);
  const locMsg = await pg.evaluate(() => ({
    pin: !!document.querySelector('.locpin'),
    txt: document.querySelector('.locpin')?.textContent?.slice(0, 60),
    geoMsg: !!(DB.orders[0].groups.find(g => g.store === 's5').chat || []).find(m => m.loc),
  }));
  chk('الدردشة: العميل أرسل موقعه (📍)', locMsg.pin && locMsg.geoMsg, locMsg);
  await pg.evaluate(() => closeModal());

  // التاجر: قبول → تجهيز استلام → طلب مبلغ إضافي → كود OTP
  await pg.evaluate(() => { logout(); openAuth(); document.querySelector('#lg-id').value = '0500000007'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  const fOid = await pg.evaluate(() => DB.orders[0].id);
  await pg.evaluate(() => go('m-orders'));
  await pg.waitForTimeout(400);
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); const gi = o.groups.findIndex(g => g.store === 's5'); mAccept(oid, gi); }, fOid);
  await pg.waitForTimeout(300);
  const prepBtn = await pg.evaluate(() => document.body.innerText.includes('جهّز الطلب — العميل سيستلمه من مقرك'));
  chk('التاجر: زر «جهّز الطلب — استلام من المقر»', prepBtn);
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); const gi = o.groups.findIndex(g => g.store === 's5'); mShip(oid, gi); }, fOid);
  await pg.waitForTimeout(300);
  const otpBtn = await pg.evaluate(() => document.body.innerText.includes('أرسل كود التأكيد للعميل'));
  chk('التاجر: زر إرسال كود التأكيد OTP بعد التركيب', otpBtn);
  // طلب مبلغ إضافي من الدردشة
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); openOChat(oid, o.groups.findIndex(g => g.store === 's5')); }, fOid);
  await pg.waitForTimeout(300);
  const merchantBar = await pg.evaluate(() => ({
    extraBtn: !![...document.querySelectorAll('.chatbar button')].find(x => x.textContent.includes('مبلغ إضافي')),
    noLocBtn: ![...document.querySelectorAll('.chatbar button')].find(x => x.textContent.includes('موقعي')),
  }));
  chk('دردشة التاجر: زر طلب مبلغ إضافي (وبلا زر موقع)', merchantBar.extraBtn && merchantBar.noLocBtn, merchantBar);
  await pg.evaluate(() => mAskExtra());
  await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.querySelector('#ex-amt').value = '20'; document.querySelector('#ex-note').value = 'إضافة شموع للطاولة'; mAskExtraGo(); });
  await pg.waitForTimeout(400);
  const payreqSent = await pg.evaluate(oid => {
    const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(g => g.store === 's5');
    return { has: !!g.chat.find(m => m.payreq && !m.payreq.paid), rendered: !!document.querySelector('.payreq') };
  }, fOid);
  chk('الدردشة: طلب مبلغ إضافي ٢٠ ر.س ظهر للعميل', payreqSent.has, payreqSent);
  // إرسال كود OTP للعميل
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); mSendOTP(oid, o.groups.findIndex(g => g.store === 's5')); }, fOid);
  await pg.waitForTimeout(300);
  const otpState = await pg.evaluate(oid => {
    const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(g => g.store === 's5');
    return { code: g.otp, shown: document.body.innerText.includes('كود تأكيد إتمام الخدمة'), held: ['shipped'].includes(g.status) };
  }, fOid);
  chk('التاجر: كود OTP صادر ومحفوظ', /^\d{4}$/.test(otpState.code) && otpState.held, otpState);

  // العميل: يدفع المبلغ الإضافي ثم يدخل الكود
  await pg.evaluate(() => { closeModal(); logout(); openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  const balBefore = await pg.evaluate(() => me().bal);
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); openOChat(oid, o.groups.findIndex(g => g.store === 's5')); }, fOid);
  await pg.waitForTimeout(300);
  const custBar = await pg.evaluate(() => !![...document.querySelectorAll('.chatbar button')].find(x => x.textContent.includes('موقعي')));
  chk('دردشة العميل: زر مشاركة موقعي', custBar);
  const subBefore = await pg.evaluate(oid => DB.orders.find(x => x.id === oid).groups.find(g => g.store === 's5').sub, fOid);
  await pg.evaluate(() => { document.querySelector('.payreq button').click(); });
  await pg.waitForTimeout(400);
  const paidExtra = await pg.evaluate(oid => {
    const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(g => g.store === 's5');
    const m = g.chat.find(x => x.payreq);
    return { paid: m.payreq.paid, via: m.payreq.via, sub: g.sub, extra: g.extra, bal: me().bal };
  }, fOid);
  chk('العميل: دفع التعديل من المحفظة وحُجز بالخزنة', paidExtra.paid && paidExtra.via.includes('محفظة') && Math.abs(paidExtra.sub - subBefore - 20) < 0.01 && paidExtra.extra === 20, paidExtra);
  chk('العميل: خُصم ٢٠ من محفظته', Math.abs(balBefore - paidExtra.bal - 20) < 0.01, { before: balBefore, after: paidExtra.bal });
  await pg.evaluate(() => closeModal());
  // كود خاطئ ثم صحيح
  await pg.evaluate(() => go('orders'));
  await pg.waitForTimeout(400);
  const otpUI = await pg.evaluate(() => ({
    box: !!document.querySelector('.otpbox'),
    codeShown: document.querySelector('.otpbox')?.innerText.includes('الكود وصل جوالك'),
  }));
  chk('طلبات العميل: صندوق OTP مع الكود (محاكاة SMS)', otpUI.box && otpUI.codeShown, otpUI);
  await pg.evaluate(oid => { document.querySelector('#otpin-' + oid).value = '0000'; const o = DB.orders.find(x => x.id === oid); checkOTP(oid, o.groups.findIndex(g => g.store === 's5')); }, fOid);
  await pg.waitForTimeout(300);
  const wrongOtp = await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(g => g.store === 's5'); return { bad: g.otpBad === 1, still: g.status === 'shipped' }; }, fOid);
  chk('OTP خاطئ: رفض ومحاولة محسوبة والمستحقات محجوزة', wrongOtp.bad && wrongOtp.still, wrongOtp);
  await pg.evaluate(oid => { const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(x => x.store === 's5'); document.querySelector('#otpin-' + oid).value = g.otp; checkOTP(oid, o.groups.findIndex(x => x.store === 's5')); }, fOid);
  await pg.waitForTimeout(400);
  const rightOtp = await pg.evaluate(oid => {
    const o = DB.orders.find(x => x.id === oid); const g = o.groups.find(x => x.store === 's5');
    return { st: g.status, ok: !!g.otpOk, payout: !!g.payout, relBy: g.releasedBy, net: g.payout ? g.payout.net : 0 };
  }, fOid);
  chk('OTP صحيح: تحرير المستحقات فور التأكيد', rightOtp.st === 'released' && rightOtp.ok && rightOtp.payout && (rightOtp.relBy || '').includes('OTP'), rightOtp);
  chk('التعديل ٢٠ ضمن المحرر (العمولة على الإجمالي)', rightOtp.net > 0, rightOtp);

  // ============ T6: الإهداء — جوال + مدينة فقط ============
  console.log('== T6: الإهداء بجوال ومدينة ==');
  await pg.evaluate(() => { CART = []; addToCart('p19', 1); startCheckout(); });
  await pg.waitForTimeout(400);
  const giftUI = await pg.evaluate(() => ({
    tog: !![...document.querySelectorAll('#ckbody .sw')].length,
    form: document.querySelector('#ckbody').innerText.includes('إهداء لشخص آخر'),
    custom: document.querySelector('#ckbody').innerText.includes('يقبل التعديلات حسب طلبك'),
  }));
  chk('البوابة: نموذج الإهداء + تنبيه قابل للتعديل', giftUI.form && giftUI.custom, giftUI);
  await pg.evaluate(() => { ckGiftTog('s6'); });
  await pg.waitForTimeout(250);
  const giftFields = await pg.evaluate(() => ({
    phone: document.querySelector('#ckbody').innerText.includes('جوال المستلم'),
    city: document.querySelector('#ckbody').innerText.includes('مدينة المستلم'),
    nameOpt: document.querySelector('#ckbody').innerText.includes('اختياري'),
  }));
  chk('الإهداء: جوال + مدينة والاسم اختياري', giftFields.phone && giftFields.city && giftFields.nameOpt, giftFields);
  await pg.evaluate(() => { ckGiftTog('s6'); });
  await pg.waitForTimeout(200);
  await pg.evaluate(() => { ckGiftTog('s6'); ckSetGift('s6', 'phone', '0501112223'); ckSetGift('s6', 'city', 'جدة'); ckRefresh(); ckNext(); });
  await pg.waitForTimeout(250);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(600);
  const giftOrd = await pg.evaluate(() => {
    const o = DB.orders[0]; const g = o.groups.find(x => x.store === 's6');
    return { gift: g.gift, card: document.body.innerText.includes('إهداء إلى'), customFlag: g.custom === true, chatG: CK.chatG };
  });
  chk('الإهداء: طُلب جوال ومدينة فقط (بلا اسم إلزامي)', giftOrd.gift && giftOrd.gift.phone === '0501112223' && giftOrd.gift.city === 'جدة', giftOrd.gift);
  chk('طلب الهدايا: وسم قابل للتعديل + فتح الدردشة', giftOrd.customFlag && giftOrd.chatG !== null && giftOrd.chatG >= 0, { custom: giftOrd.customFlag, chatG: giftOrd.chatG });
  // دردشة التعديلات مفتوحة تلقائياً
  await pg.waitForTimeout(1600);
  const customChat = await pg.evaluate(() => !!document.querySelector('#chatlog'));
  chk('بعد دفع الهدايا: فتحت دردشة التعديلات تلقائياً', customChat);
  await pg.evaluate(() => closeModal());

  // ============ T7: الكوبونات ============
  console.log('== T7: الكوبونات (تاجر + إدارة) ==');
  // كوبون متجر داخل السلة الصحيحة
  await pg.evaluate(() => { CART = []; addToCart('p1', 1); go('cart'); });
  await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.querySelector('#cpnin').value = 'DAFI15'; applyCoupon(); });
  await pg.waitForTimeout(300);
  const cpnOK = await pg.evaluate(() => ({
    applied: CPN === 'DAFI15',
    line: document.body.innerText.includes('من متجر'),
    sub: cartCalc().sub, disc: cartCalc().cpn,
  }));
  chk('كوبون متجر s1: فُعّل على منتجاته', cpnOK.applied && cpnOK.line && cpnOK.disc > 0, cpnOK);
  // كوبون متجر خارج سلتها
  await pg.evaluate(() => { CART = []; addToCart('p8', 1); go('cart'); document.querySelector('#cpnin').value = 'DAFI15'; applyCoupon(); });
  await pg.waitForTimeout(300);
  const cpnBad = await pg.evaluate(() => ({ off: CPN === null, msg: document.body.innerText.includes('خاص بمتجر') }));
  chk('كوبون متجر خاطئ: مرفوض برسالة واضحة', cpnBad.off && cpnBad.msg, cpnBad);
  // كوبون شامل
  await pg.evaluate(() => { document.querySelector('#cpnin').value = 'DAMIN10'; applyCoupon(); });
  await pg.waitForTimeout(300);
  const cpnAll = await pg.evaluate(() => ({ on: CPN === 'DAMIN10', disc: cartCalc().cpn > 0 }));
  chk('كوبون شامل من الإدارة: يشتغل على أي متجر', cpnAll.on && cpnAll.disc, cpnAll);
  // الإدارة تصدر كوبوناً شاملاً
  await pg.evaluate(() => { CART = []; logout(); openAuth(); document.querySelector('#lg-id').value = '0500000003'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => go('a-rev'));
  await pg.waitForTimeout(400);
  const admRev = await pg.evaluate(() => ({
    otpRow: document.body.innerText.includes('مستحقات خدمات ميدانية معلقة'),
    cpnCard: document.body.innerText.includes('كوبونات الخصم — إدارة ضمين'),
    list: Object.keys(DB.coupons).length,
  }));
  chk('الإدارة: بند مستحقات OTP بالملخص المالي', admRev.otpRow, admRev);
  chk('الإدارة: بطاقة الكوبونات', admRev.cpnCard, admRev);
  await pg.evaluate(() => { document.querySelector('#ac-code').value = 'DMN20'; document.querySelector('#ac-v').value = '20'; document.querySelector('#ac-max').value = '60'; aAddCoupon(); });
  await pg.waitForTimeout(300);
  const admCpn = await pg.evaluate(() => ({ c: !!DB.coupons['DMN20'], store: (DB.coupons['DMN20'] || {}).store, listed: document.body.innerText.includes('DMN20') }));
  chk('الإدارة: أصدرت كوبون DMN20 الشامل', admCpn.c && admCpn.store === 'all' && admCpn.listed, admCpn);
  // التاجر يصدر كوبوناً لمتجره
  await pg.evaluate(() => { logout(); openAuth(); document.querySelector('#lg-id').value = '0500000002'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => go('m-set'));
  await pg.waitForTimeout(400);
  const mSetUI = await pg.evaluate(() => ({
    cpn: document.body.innerText.includes('كوبونات متجرك'),
    range: document.body.innerText.includes('نطاق التوصيل الفوري') === false,
  }));
  chk('إعدادات التاجر: بطاقة كوبونات المتجر', mSetUI.cpn, mSetUI);
  await pg.evaluate(() => { document.querySelector('#mc-code').value = 'DAFI5'; document.querySelector('#mc-type').value = 'amt'; document.querySelector('#mc-v').value = '5'; mAddCoupon(); });
  await pg.waitForTimeout(300);
  const mCpn = await pg.evaluate(() => ({ c: !!DB.coupons['DAFI5'], store: (DB.coupons['DAFI5'] || {}).store, listed: document.body.innerText.includes('DAFI5') }));
  chk('التاجر: أصدر كوبون DAFI5 لمتجره', mCpn.c && mCpn.store === 's1' && mCpn.listed, mCpn);
  // العميل يستخدم كوبون التاجر الجديد
  await pg.evaluate(() => { logout(); openAuth(); document.querySelector('#lg-id').value = '0500000001'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { CART = []; addToCart('p1', 1); go('cart'); document.querySelector('#cpnin').value = 'DAFI5'; applyCoupon(); });
  await pg.waitForTimeout(300);
  const useNew = await pg.evaluate(() => ({ on: CPN === 'DAFI5', disc: cartCalc().cpn === 5 }));
  chk('العميل: كوبون التاجر الجديد يعمل (٥ ر.س)', useNew.on && useNew.disc, useNew);
  // عداد الاستخدام يزيد بعد الطلب
  await pg.evaluate(() => { startCheckout(); });
  await pg.waitForTimeout(250);
  await pg.evaluate(() => { ckNext(); });
  await pg.waitForTimeout(200);
  await pg.evaluate(() => placeOrder());
  await pg.waitForTimeout(400);
  const cpnUses = await pg.evaluate(() => DB.coupons['DAFI5'].uses);
  chk('الكوبون: عداد الاستخدام زاد بعد الطلب', cpnUses === 1, cpnUses);
  await pg.evaluate(() => closeModal());

  // ============ T8: إقرار الملكية الفكرية لمنتجات الألعاب ============
  console.log('== T8: إقرار الملكية الفكرية + فورم الألعاب ==');
  await pg.evaluate(() => { logout(); openAuth(); document.querySelector('#lg-id').value = '0500000011'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  const s9dash = await pg.evaluate(() => ({ dash: document.body.innerText.includes('قيمز زون'), sec: myStore().sec }));
  chk('تاجر قيمز زون دخل للوحة متجره', s9dash.dash && s9dash.sec === 'gaming', s9dash);
  await pg.evaluate(() => go('m-prods'));
  await pg.waitForTimeout(400);
  const prods9 = await pg.evaluate(() => ({
    n: PRODUCTS.filter(p => p.store === 's9').length,
    badges: document.body.innerText.includes('رقمي فوري') === false,
  }));
  chk('قيمز زون: ٤ منتجات (٣ ملموسة + ١ قابلة للكسر)', prods9.n === 4, prods9);
  await pg.evaluate(() => mProdForm());
  await pg.waitForTimeout(300);
  const formG = await pg.evaluate(() => ({
    label: document.querySelector('#ckbody') === null,
    sel: !!document.querySelector('#mp-ptype'),
    opts: [...document.querySelectorAll('#mp-ptype option')].map(o => o.textContent.slice(0, 2)),
  }));
  chk('فورم الألعاب: قائمة طبيعة المنتج والشحن', formG.sel && formG.opts.length === 3, formG.opts);
  await pg.evaluate(() => { document.querySelector('#mp-ptype').value = 'digital'; mPtypePrev(); });
  await pg.waitForTimeout(250);
  const digiForm = await pg.evaluate(() => ({
    fields: !!document.querySelector('#mp-dval'),
    ip: !!document.querySelector('#mp-ip'),
    ipText: document.querySelector('#mp-ip')?.parentElement?.textContent?.includes('الملكية الفكرية'),
    upload: document.body.innerText.includes('رفع الملف بأمان'),
  }));
  chk('الرقمي: حقول الكود/الملف + رفع آمن + إقرار الملكية', digiForm.fields && digiForm.ip && digiForm.ipText && digiForm.upload, digiForm);
  await pg.evaluate(() => { document.querySelector('#mp-nm').value = 'كود اختبار رقمي'; document.querySelector('#mp-pr').value = '30'; document.querySelector('#mp-pts').value = '20'; document.querySelector('#mp-dval').value = 'TST-CODE-1234'; mSaveProd(); });
  await pg.waitForTimeout(300);
  const ipBlocked = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('.toast')].map(x => x.textContent).join(' ');
    return { blocked: t.includes('إقرار الملكية الفكرية إلزامي'), stillOpen: !!document.querySelector('#mp-dval') };
  });
  chk('الإقرار إلزامي: الحفظ مرفوض بدونه', ipBlocked.blocked && ipBlocked.stillOpen, ipBlocked);
  await pg.evaluate(() => { document.querySelector('#mp-ip').checked = true; mSaveProd(); });
  await pg.waitForTimeout(400);
  const savedDigi = await pg.evaluate(() => {
    const p = PRODUCTS.find(x => x.name === 'كود اختبار رقمي');
    return { found: !!p, ptype: p && p.ptype, digi: !!(p && p.digi), ipOK: !!(p && p.ipOK), card: document.body.innerText.includes('كود اختبار رقمي'), badge: document.body.innerText.includes('⚡ رقمي فوري') };
  });
  chk('بعد الإقرار: أُضيف المنتج الرقمي بوسمه', savedDigi.found && savedDigi.ptype === 'digital' && savedDigi.digi && savedDigi.ipOK && savedDigi.badge, savedDigi);
  // فورم الديكور: خيارات الكسر والتعديل — دخول تاجر s6
  await pg.evaluate(() => { closeModal(); logout(); openAuth(); document.querySelector('#lg-id').value = '0500000008'; document.querySelector('#lg-pw').value = '1234'; doLogin(); });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => go('m-prods'));
  await pg.waitForTimeout(300);
  await pg.evaluate(() => mProdForm('p19'));
  await pg.waitForTimeout(300);
  const decoForm = await pg.evaluate(() => ({
    frag: !!document.querySelector('#mp-frag') && document.querySelector('#mp-frag').checked,
    custom: !!document.querySelector('#mp-custom') && document.querySelector('#mp-custom').checked,
    gift: !!document.querySelector('#mp-gift') && document.querySelector('#mp-gift').checked,
  }));
  chk('فورم الديكور: خيارات الكسر + التعديل + الإهداء محفوظة', decoForm.frag === false && decoForm.custom && decoForm.gift, decoForm);
  await pg.evaluate(() => closeModal());

  // ============ T9: لقطات جوال + سلة رقمي ============
  console.log('== T9: لقطات ==');
  await pg.evaluate(() => { logout(); go('section', 'gaming'); });
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/b10-gaming.png', fullPage: false });
  const mob = await ctx.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto('file:///home/z/my-project/download/dameen.html');
  await mob.waitForTimeout(900);
  await mob.evaluate(() => { quickLogin('customer'); go('dlib'); });
  await mob.waitForTimeout(500);
  await mob.screenshot({ path: '/home/z/my-project/scripts/shots/b10-dlib-mobile.png' });
  const mobOk = await mob.evaluate(() => ({ lib: document.body.innerText.includes('مكتبتي الرقمية'), over: document.documentElement.scrollWidth <= 400 }));
  chk('الجوال: صفحة المكتبة بلا تجاوز أفقي', mobOk.lib && mobOk.over, mobOk);
  await mob.evaluate(() => go('section', 'gaming'));
  await mob.waitForTimeout(600);
  const mobSec = await mob.evaluate(() => ({ ok: document.body.innerText.includes('قيمز زون'), over: document.documentElement.scrollWidth <= 400 }));
  chk('الجوال: قسم الألعاب بلا تجاوز أفقي', mobSec.ok && mobSec.over, mobSec);
  await mob.screenshot({ path: '/home/z/my-project/scripts/shots/b10-gaming-mobile.png' });

  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  console.log('RESULT: PASS=' + PASS + ' FAIL=' + FAIL);
  await b.close();
  process.exit(FAIL > 0 ? 1 : 0);
})();
