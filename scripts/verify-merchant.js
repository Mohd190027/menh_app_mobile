/* اختبار وظيفي شامل — تعديلات قسم التاجر الخمسة على dameen.html */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FILE = 'file:///home/z/my-project/download/dameen.html';
const SHOT = '/home/z/my-project/scripts/shots';
if (!fs.existsSync(SHOT)) fs.mkdirSync(SHOT, { recursive: true });

// PNG صغيرة 1x1 لاختبار رفع اللوقو
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync('/tmp/logo-test.png', PNG1);

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ FAIL: ' + name); } };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto(FILE);
  await page.waitForTimeout(600);

  /* ===== دخول التاجر ===== */
  await page.evaluate(() => quickLogin('merchant'));
  await page.waitForTimeout(400);
  console.log('\n== [1] صفحة المنتجات ==');
  await page.evaluate(() => go('m-prods'));
  await page.waitForTimeout(300);
  ok(await page.locator('.mpgrid .mpcard').count() >= 3, 'شبكة بطاقات المنتجات الجديدة (mpgrid/mpcard)');
  ok(await page.locator('.mpstat').count() >= 3, 'إحصائيات على البطاقة (مخزون/بيع/تقييم)');
  await page.screenshot({ path: SHOT + '/m-prods.png' });

  // عارض التقييمات: p1 لديه تقييم واحد نصي
  await page.evaluate(() => mProdRevs('p1'));
  await page.waitForTimeout(250);
  const revModal = await page.locator('.mcard').innerHTML();
  ok(revModal.includes('تقييمات «عباية كتان «نسمة»」') || revModal.includes('تقييمات'), 'نافذة تقييمات المنتج تفتح');
  ok(revModal.includes('الخامة ثقيلة وفخمة'), 'تعليق العميلة نورة يظهر للتاجر');
  ok(revModal.includes('عرض تقييم') || revModal.includes('تقييم'), 'ملخص التقييمات (المتوسط والتوزيع)');
  await page.evaluate(() => closeModal());

  // العروض الحرة: نسبة مخصصة 17%
  await page.evaluate(() => mOfferForm('p2'));
  await page.waitForTimeout(250);
  await page.fill('#mp-off2', '17');
  await page.evaluate(() => offPrev());
  await page.waitForTimeout(150);
  const prevTxt = await page.locator('#offprev').innerText();
  ok(prevTxt.includes('وفّر') || prevTxt.includes('بعد الخصم'), 'معاينة حية للسعر بعد الخصم');
  await page.evaluate(() => mOfferSet2());
  await page.waitForTimeout(250);
  const off17 = await page.evaluate(() => P('p2').off);
  ok(off17 === 17, 'نسبة حرة ١٧٪ حُفظت (كانت 0)');
  const price17 = await page.evaluate(() => eff(P('p2')));
  ok(Math.abs(price17 - 520 * 0.83) < 0.6, 'السعر للعميل = ٤٣١٫٦ بعد الخصم');
  await page.screenshot({ path: SHOT + '/m-offer.png' });

  /* ===== [5أ] النقاط في نموذج المنتج ===== */
  console.log('\n== [5أ] نقاط المنتج — التاجر يموّل من محفظته ==');
  const w0 = await page.evaluate(() => DB.storeWallets.s1);
  const ap0 = await page.evaluate(() => DB.aPtsWallet);
  await page.evaluate(() => mProdForm('p3'));
  await page.waitForTimeout(300);
  await page.fill('#mp-pts', '80');
  await page.evaluate(() => ptsCostPrev());
  await page.waitForTimeout(150);
  const costTxt = await page.locator('#ptscost').innerText();
  ok(costTxt.includes('٨') && costTxt.includes('ر.س'), 'معاينة التكلفة الحية (٨٠ × ٠٫١ = ٨ ر.س)');
  await page.screenshot({ path: SHOT + '/m-prodform-pts.png' });
  await page.evaluate(() => mSaveProd('p3'));
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({ w: DB.storeWallets.s1, ap: DB.aPtsWallet, p: P('p3').pts, f: DB.ptsFunding.length }));
  ok(after.p === 80, 'المنتج p3 صار يمنح ٨٠ نقطة');
  ok(Math.abs((w0 - after.w) - 8) < 0.01, 'خُصمت ٨ ر.س من محفظة المتجر (' + w0 + ' → ' + after.w + ')');
  ok(Math.abs((after.ap - ap0) - 8) < 0.01, 'حُوّلت ٨ ر.س إلى محفظة الإدارة (' + ap0 + ' → ' + after.ap + ')');
  ok(after.f === 1, 'سجل التمويل ptsFunding سجّل العملية');

  /* ===== [2] صفحة الطلبات — الإحصائيات والفلاتر ===== */
  console.log('\n== [2] صفحة طلبات التاجر ==');
  await page.evaluate(() => go('m-orders'));
  await page.waitForTimeout(300);
  const ordHTML = await page.locator('#app').innerHTML();
  ok(ordHTML.includes('إجمالي الطلبات') && ordHTML.includes('لم تُستلم بعد') && ordHTML.includes('استلمها العميل'), 'بطاقات الإحصائيات الكاملة');
  ok(ordHTML.includes('قيمة الشحنات المحررة'), 'قيمة الشحنات المحررة');
  const statCounts = await page.evaluate(() => {
    const gs = myGroups();
    return {
      all: gs.length,
      nr: gs.filter(x => ['pending', 'preparing', 'shipped'].includes(x.g.status)).length,
      rcv: gs.filter(x => ['received', 'released'].includes(x.g.status)).length,
      bad: gs.filter(x => ['disputed', 'refunded'].includes(x.g.status)).length,
      shown: document.querySelectorAll('.ocard').length
    };
  });
  ok(statCounts.shown === statCounts.all, 'فلتر «الكل» يعرض ' + statCounts.all + ' طلبات');
  await page.evaluate(() => { VIEW.mof = 'rcv'; render(); });
  await page.waitForTimeout(200);
  const rcvShown = await page.locator('.ocard').count();
  ok(rcvShown === statCounts.rcv, 'فلتر «تم استلامها» يعرض ' + rcvShown + ' من أصل ' + statCounts.all);
  await page.evaluate(() => { VIEW.mof = 'nr'; render(); });
  await page.waitForTimeout(200);
  const nrShown = await page.locator('.ocard').count();
  ok(nrShown === statCounts.nr, 'فلتر «لم تُستلم بعد» يعرض ' + nrShown);
  await page.evaluate(() => { VIEW.mof = 'bad'; render(); });
  await page.waitForTimeout(200);
  const badShown = await page.locator('.ocard').count();
  ok(badShown === statCounts.bad, 'فلتر «نزاعات واسترجاعات» يعرض ' + badShown + ' (متطابق مع الإحصاء)');
  await page.evaluate(() => { VIEW.mof = 'all'; render(); });
  await page.screenshot({ path: SHOT + '/m-orders.png' });

  /* ===== [3] المحفظة — انقسام كل تحرير ===== */
  console.log('\n== [3] محفظة التاجر ==');
  await page.evaluate(() => go('m-wallet'));
  await page.waitForTimeout(300);
  const wHTML = await page.locator('#app').innerHTML();
  ok(wHTML.includes('كيف ينقسم كل مبلغ'), 'بطاقة شرح الانقسام');
  ok(await page.locator('.splitbar').count() === 1, 'شريط الانقسام المرئي ٩٧٫٥/٢٫٥');
  ok(wHTML.includes('صافي المتجر ٩٧٫٥٪') && wHTML.includes('عمولة الإدارة ٢٫٥٪'), 'التسميتان على الشريط');
  ok(wHTML.includes('+ ' + '٣٦٣') || wHTML.includes('٣٦٣٫٣٣'), 'صافي تحرير الطلب #١٠٢١ (٣٦٣٫٣٣) يظهر');
  ok(wHTML.includes('عمولة الإدارة ← مباشرة'), 'كل سطر تحرير يُظهر شطرَيه: صافيك + عمولة الإدارة');
  ok(wHTML.includes('تمويلات نقاط الولاء'), 'قسم تمويلات النقاط في المحفظة');
  ok(wHTML.includes('تمويل ٨٠ نقطة'), 'سجل تمويل ٨٠ نقطة ظاهر');
  await page.screenshot({ path: SHOT + '/m-wallet.png' });

  /* ===== [4] الإعدادات — البيانات الكاملة + اللوقو والغلاف ===== */
  console.log('\n== [4] إعدادات المتجر ==');
  await page.evaluate(() => go('m-set'));
  await page.waitForTimeout(300);
  const sHTML = await page.locator('#app').innerHTML();
  const ownerOK = await page.evaluate(() => {
    const h = document.querySelector('#app').innerHTML;
    return h.includes('ريم الدوسري') && h.includes(ar('0500000002'));
  });
  ok(sHTML.includes('ملف المتجر الكامل'), 'بطاقة الملف الكامل');
  ok(ownerOK, 'اسم المالك (ريم الدوسري) وجواله يظهران');
  ok(sHTML.includes('معرّف المتجر') && sHTML.includes('S1'), 'معرّف المتجر');
  ok(sHTML.includes('عملية بيع مكتملة'), 'التقييم وعدد العمليات');
  ok(sHTML.includes('هوية المتجر'), 'بطاقة الهوية (اللوقو والغلاف)');
  ok(await page.locator('.storeid .big').count() === 1, 'معاينة اللوقو موجودة');
  await page.screenshot({ path: SHOT + '/m-set.png' });

  // رفع لوقو فعلي: تفعيل المُلتقط أولاً ثم اختيار الملف
  await page.evaluate(() => pickStoreImg('logo'));
  await page.setInputFiles('#fup', { name: 'logo.png', mimeType: 'image/png', buffer: PNG1 });
  await page.waitForTimeout(500);
  const logoSet = await page.evaluate(() => !!ST('s1').logo && ST('s1').logo.startsWith('data:image/png'));
  ok(logoSet, 'رُفع اللوقو وحُفظ في بيانات المتجر');
  const bigHasImg = await page.evaluate(() => !!document.querySelector('.storeid .big img'));
  ok(bigHasImg, 'معاينة اللوقو تظهر في الإعدادات');

  // اللوقو يظهر لصفحة المتجر للعملاء
  const storeLogo = await page.evaluate(() => { go('store', 's1'); return new Promise(r => setTimeout(() => r(!!document.querySelector('.storeban .lg img')), 250)); });
  ok(storeLogo, 'اللوقو يظهر في بانر صفحة المتجر');

  /* ===== [5ب] إعدادات الإدارة للنقاط ===== */
  console.log('\n== [5ب] إدارة النقاط (الإدارة) ==');
  await page.evaluate(() => quickLogin('admin'));
  await page.waitForTimeout(300);
  await page.evaluate(() => go('a-rev'));
  await page.waitForTimeout(300);
  const aHTML = await page.locator('#app').innerHTML();
  ok(aHTML.includes('إعدادات برنامج النقاط'), 'بطاقة إعدادات النقاط للإدارة');
  ok(aHTML.includes('محفظة الإدارة من النقاط') && aHTML.includes('٨'), 'محفظة إدارة النقاط تعرض ٨ ر.س');
  await page.evaluate(() => setPtsVal('0.15'));
  await page.waitForTimeout(200);
  const pv15 = await page.evaluate(() => ptsVal());
  ok(Math.abs(pv15 - 0.15) < 1e-9, 'الإدارة غيّرت قيمة النقطة إلى ٠٫١٥');
  await page.evaluate(() => setFreeDlPts('150'));
  await page.waitForTimeout(200);
  ok((await page.evaluate(() => fdPts())) === 150, 'الإدارة غيّرت نقاط التوصيل المجاني إلى ١٥٠');
  await page.screenshot({ path: SHOT + '/a-rev-pts.png' });
  await page.evaluate(() => setPtsVal('0.1')); // إعادة القيمة
  await page.evaluate(() => setFreeDlPts('250'));
  await page.waitForTimeout(200);

  /* ===== [5ج] العميل: نقاط الهدية + التوصيل المجاني ===== */
  console.log('\n== [5ج] العميل — هدية النقاط والتوصيل المجاني ==');
  await page.evaluate(() => quickLogin('customer'));
  await page.waitForTimeout(300);
  // بطاقة المنتج تعرض شارة النقاط
  await page.evaluate(() => go('product', 'p3'));
  await page.waitForTimeout(300);
  const pHTML = await page.locator('#app').innerHTML();
  ok(pHTML.includes('يمنح هذا المنتج ٨٠ نقطة'), 'صفحة المنتج تعلن عن ٨٠ نقطة هدية');
  await page.evaluate(() => go('section', 'fashion'));
  await page.waitForTimeout(400);
  const ptsbOnCard = await page.evaluate(() => {
    const card = [...document.querySelectorAll('.pcard')].find(c => c.textContent.includes('طرحة شيفون'));
    return card ? !!card.querySelector('.ptsb') : false;
  });
  ok(ptsbOnCard, 'شارة 🌟 ٨٠ نقطة على بطاقة المنتج في القسم');

  // التوصيل المجاني من السلة: منتج p3 (٧٦ ر.س < ٢٠٠ → شحن ١٢) + رصيد ٣٤٠ نقطة + ٨٠ نقطة هدية
  const pts0 = await page.evaluate(() => me().pts);
  ok(pts0 >= 250, 'رصيد العميلة ' + pts0 + ' نقطة يكفي للاستبدال (250)');
  await page.evaluate(() => { addToCart('p3', 1); go('cart'); });
  await page.waitForTimeout(300);
  const cartHTML = await page.locator('#app').innerHTML();
  ok(cartHTML.includes('توصيل مجاني؟'), 'زر استبدال التوصيل المجاني ظاهر في السلة');
  const totalBefore = await page.evaluate(() => cartCalc().total);
  await page.evaluate(() => { FREE_DL = true; render(); });
  await page.waitForTimeout(250);
  const cAfter = await page.evaluate(() => cartCalc());
  ok(cAfter.dl === 0 && cAfter.fd === true, 'الشحن صار مجانياً بعد الاستبدال');
  ok(Math.abs((totalBefore - cAfter.total) - 12) < 0.01, 'الإجمالي انخفض بمقدار الشحن ١٢ ر.س');
  await page.screenshot({ path: SHOT + '/cart-freedl.png' });

  // إتمام الطلب: خزنة → عنوان → دفع
  await page.evaluate(() => startCheckout());
  await page.waitForTimeout(300);
  await page.evaluate(() => { CK.step = 1; CK.addr = 0; ckRefresh(); });
  await page.waitForTimeout(200);
  await page.evaluate(() => { CK.step = 2; ckRefresh(); });
  await page.waitForTimeout(200);
  await page.evaluate(() => placeOrder());
  await page.waitForTimeout(400);
  const newOrder = await page.evaluate(() => {
    const o = DB.orders.find(x => x.freeDl === true);
    return o ? { id: o.id, pts: USERS[o.customer].pts, gdl: o.groups[0].dl } : null;
  });
  ok(!!newOrder, 'الطلب الجديد موسوم بتوصيل مجاني (نقاط)');
  ok(newOrder && newOrder.gdl === 0, 'شحن الطلب = ٠ في بيانات الطلب');
  ok(newOrder && (pts0 - newOrder.pts) === 250, 'خُصمت ٢٥٠ نقطة من رصيد العميلة (' + pts0 + ' → ' + (newOrder && newOrder.pts) + ')');
  const ptsLogHasFd = await page.evaluate(() => me().ptsLog.some(l => l.t.includes('توصيل مجاني')));
  ok(ptsLogHasFd, 'سجل النقاط يسجّل «استبدال نقاط بتوصيل مجاني»');

  // دورة كاملة: قبول → شحن → استلام → تقييم = نقاط هدية 80
  const oid = newOrder.id;
  await page.evaluate(o => {
    const ord = DB.orders.find(x => x.id === o);
    ord.groups[0].status = 'received';
    ord.groups[0].complaintUntil = Date.now() + 3600e3;
  }, oid);
  await page.evaluate(() => go('orders'));
  await page.waitForTimeout(300);
  const rateBtn = await page.locator('button:has-text("قيّم وحرر فوراً")').count();
  ok(rateBtn >= 1, 'زر التقييم والتحرير الفوري ظاهر');
  await page.evaluate(o => openRate(o, 0), oid);
  await page.waitForTimeout(250);
  await page.evaluate(() => oStarPick(5));
  await page.fill('#ortxt', 'تجربة ممتازة والنقاط الهدية لمسة جميلة');
  await page.evaluate(() => submitOrderRate());
  await page.waitForTimeout(400);
  const giftLog = await page.evaluate(() => me().ptsLog.find(l => l.t.includes('نقاط هدية')));
  ok(!!giftLog && giftLog.v === 80, 'العميلة استلمت ٨٠ نقطة هدية عند التحرير (ممولة من التاجر)');
  const ordReleased = await page.evaluate(o => DB.orders.find(x => x.id === o).groups[0].status, oid);
  ok(ordReleased === 'released', 'الشحنة حُررت');

  // محفظة التاجر بعد التحرير: صافي + عمولة
  console.log('\n== [3ب] تحقق تحويل الشطرين بعد التحرير ==');
  await page.evaluate(() => quickLogin('merchant'));
  await page.waitForTimeout(300);
  await page.evaluate(() => go('m-wallet'));
  await page.waitForTimeout(300);
  const payout = await page.evaluate(o => { const ord = DB.orders.find(x => x.id === o); return ord.groups[0].payout; }, oid);
  ok(!!payout && payout.comm > 0 && payout.net > 0, 'التحرير انقسم: صافي ' + (payout && payout.net) + ' + عمولة إدارة ' + (payout && payout.comm));
  ok(await page.evaluate(() => document.querySelector('#app').textContent.includes('عمولة الإدارة ← مباشرة')), 'محفظة التاجر تعرض شطري كل تحرير');
  await page.screenshot({ path: SHOT + '/m-wallet-final.png' });

  /* ===== لقطات جوال ===== */
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(FILE);
  await mob.waitForTimeout(400);
  await mob.evaluate(() => quickLogin('merchant'));
  await mob.waitForTimeout(300);
  await mob.evaluate(() => go('m-prods'));
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: SHOT + '/mob-m-prods.png' });
  await mob.evaluate(() => go('m-orders'));
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: SHOT + '/mob-m-orders.png' });

  console.log('\n=========================================');
  console.log('PASS: ' + pass + '  FAIL: ' + fail);
  if (errors.length) { console.log('\nJS ERRORS (' + errors.length + '):'); errors.slice(0, 8).forEach(e => console.log('  ' + e)); }
  else console.log('NO JS ERRERS — صفر أخطاء جافاسكربت');
  await browser.close();
  process.exit(fail || errors.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASH:', e); process.exit(1); });
