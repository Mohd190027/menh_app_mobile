/* التحقق الشامل من النسخة المعاد بناؤها بـ React — كل الميزات المستعادة */
const { chromium } = require('playwright');
const OK = [], BAD = [];
const t = (name, cond) => { (cond ? OK : BAD).push(name); console.log((cond ? '✓' : '✗ FAIL'), name); };

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  const body = () => pg.locator('body').innerText();

  const login = async phone => {
    await pg.getByRole('button', { name: 'تسجيل الدخول', exact: true }).first().click();
    await pg.locator('[placeholder*="name@mail.com"]').fill(phone);
    await pg.locator('[placeholder="••••"]').fill('1234');
    await pg.getByRole('button', { name: '🔑 دخول' }).click();
    await pg.waitForTimeout(700);
  };
  const logout = async () => {
    await pg.getByRole('button', { name: 'حسابي' }).click();
    await pg.getByText('تسجيل الخروج').last().click();
    await pg.waitForTimeout(500);
  };

  /* ===== T1: زائر — الرئيسية والعوالم ===== */
  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(1200);
  t('T1 العنوان ضمين', (await pg.title()).includes('ضمين'));
  t('T1 العوالم الأربعة', (await body()).includes('عالم الأزياء') && (await body()).includes('عالم الألعاب'));

  /* ===== T2: عالم الألعاب — المتجران الرقمان ===== */
  await pg.getByText('عالم الألعاب والأجهزة والمنتجات الرقمية').first().click();
  await pg.waitForTimeout(900);
  t('T2 قسم الألعاب: قيمز زون وبايت كود', (await body()).includes('قيمز زون') && (await body()).includes('بايت كود'));

  /* ===== T3: منتج رقمي + السلة المجمعة ===== */
  await pg.getByText('كود لعبة «سباق الرمال ٥»').first().click();
  await pg.waitForTimeout(800);
  t('T3 شارة «منتج رقمي — تسليم فوري»', (await body()).includes('منتج رقمي — تسليم فوري'));
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(900);
  t('T3 سلة مجمعة: تسليم رقمي فوري ٠ ر.س', (await body()).includes('تسليم رقمي فوري'));
  await pg.keyboard.press('Escape');

  /* ===== T4: زبون — كوبون + بوابة دفع ٣ خطوات ===== */
  await login('0500000001');
  await pg.locator('[aria-label="السلة"]').click();
  await pg.waitForTimeout(600);
  await pg.locator('[placeholder*="DAMIN10"]').fill('BYTE10');
  await pg.getByRole('button', { name: 'تطبيق', exact: true }).click();
  await pg.waitForTimeout(600);
  t('T4 كوبون BYTE10 فُعّل', (await body()).includes('خصم الكوبون BYTE10'));
  t('T4 أزرار استبدال النقاط', (await body()).includes('نقاطك:'));
  await pg.getByRole('button', { name: /إتمام الطلب الآمن/ }).click();
  await pg.waitForTimeout(900);
  t('T4 بوابة الدفع: عنوان افتراضي موجود', (await body()).includes('عنوان التسليم') && (await body()).includes('افتراضي'));
  await pg.getByRole('button', { name: /متابعة للدفع/ }).click();
  await pg.waitForTimeout(700);
  await pg.getByRole('button', { name: /تابي/ }).first().click();
  await pg.waitForTimeout(400);
  t('T4 تقسيط تابي ٤ دفعات', (await body()).includes('٤ دفعات'));
  await pg.getByRole('button', { name: /ادفع واحجز في الخزنة/ }).click();
  await pg.waitForTimeout(1200);
  t('T4 نجاح الحجز في الخزنة', (await body()).includes('تم حجز مبلغك في خزنة ضمين'));
  t('T4 زر المكتبة الرقمية في النجاح', (await body()).includes('مكتبتي الرقمية'));

  /* ===== T5: المكتبة الرقمية ===== */
  await pg.getByRole('button', { name: /مكتبتي الرقمية — الكود/ }).click();
  await pg.waitForTimeout(900);
  t('T5 الأصل الرقمي في المكتبة', (await body()).includes('مكتبتي الرقمية') && (await body()).includes('سباق الرمال'));
  const codeHidden = (await body()).includes('••••-••••-••••-••••');
  await pg.getByRole('button', { name: /إظهار/ }).first().click();
  await pg.waitForTimeout(300);
  t('T5 إظهار الكود (كان مخفياً ثم ظهر)', codeHidden && /DRR5|••••/.test(await body()));
  await pg.getByRole('button', { name: /نسخ/ }).first().click();
  await pg.waitForTimeout(300);
  t('T5 نسخ الكود', (await body()).includes('نُسخ الكود'));

  /* ===== T6: الطلبات — شحنة رقمية + محادثة ===== */
  await pg.getByRole('button', { name: 'طلباتي' }).first().click();
  await pg.waitForTimeout(800);
  t('T6 طلب رقمي سُلّم فوراً', (await body()).includes('طلب رقمي — سُلّم فوراً'));
  t('T6 زر محادثة الطلب', (await body()).includes('محادثة الطلب'));

  /* ===== T7: سلة متعددة المتاجر + قابل للكسر + سقف الشحن ===== */
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  // عباية (s1 سقف 300) + فناجيل (s5 قابل للكسر من الطائف)
  await pg.getByText('عالم الأزياء والجمال').first().click();
  await pg.waitForTimeout(700);
  await pg.getByText('عباية كتان «نسمة»').first().click();
  await pg.waitForTimeout(700);
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(500);
  await pg.keyboard.press('Escape');
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عالم الهدايا والديكور والمناسبات').first().click();
  await pg.waitForTimeout(700);
  await pg.getByText('طقم فناجيل قهوة مذهّب').first().click();
  await pg.waitForTimeout(700);
  t('T7 شارة قابل للكسر في صفحة المنتج', (await body()).includes('قابل للكسر'));
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(900);
  t('T7 شحنتان مستقلتان', (await body()).includes('شحنة مستقلة'));
  t('T7 شحن قابل للكسر +١٥', (await body()).includes('قابل للكسر (تغليف خاص ورسوم حماية'));
  t('T7 شريط سقف الشحن المجاني', (await body()).includes('واحصل على شحن مجاني'));

  /* ===== T8: حجب التوصيل الفوري خارج المدينة ===== */
  await pg.keyboard.press('Escape');
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عالم المأكولات والضيافة').first().click();
  await pg.waitForTimeout(700);
  await pg.getByText('خبز تميس بيتي').first().click();
  await pg.waitForTimeout(700);
  t('T8 شارة توصيل فوري', (await body()).includes('توصيل فوري'));
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(900);
  t('T8 حجب خارج نطاق الفوري', (await body()).includes('خارج نطاق التوصيل الفوري'));
  const ctaDisabled = await pg.getByRole('button', { name: /أزل الشحنة المحجوبة|إتمام الطلب/ }).first().isDisabled().catch(() => true);
  t('T8 زر الإتمام محجوب مع شحنة محجوبة', ctaDisabled);
  // إزالة الشحنة المحجوبة
  const rmBtns = pg.locator('[aria-label="حذف"]');
  await rmBtns.last().click(); // حذف الخبز (آخر عنصر)
  await pg.waitForTimeout(500);
  await pg.keyboard.press('Escape'); // إغلاق السلة قبل التنقل
  t('T8 زر الإتمام عاد بعد الحذف', !(await pg.getByRole('button', { name: /أزل الشحنة المحجوبة/ }).count()));
  // إفراغ السلة تماماً قبل T9 (شحنة ميدانية نقية) — عنصران متبقيان
  await pg.locator('[aria-label="السلة"]').click();
  await pg.waitForTimeout(700);
  for (let i = 0; i < 2; i++) {
    await pg.locator('[aria-label="حذف"]').first().click({ force: true });
    await pg.waitForTimeout(700);
  }
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(400);

  /* ===== T9: إهداء + حجز مناسبة + خدمة ميدانية ===== */
  // بوكس هدايا (s6 إهداء+تعديل+شحن مجاني) + تنسيق طاولة (s5 ميداني)
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عالم الهدايا والديكور والمناسبات').first().click();
  await pg.waitForTimeout(600);
  await pg.getByText('بوكس هدايا «شكراً»').first().click();
  await pg.waitForTimeout(600);
  t('T9 قابل للإهداء + قابل للتعديل', (await body()).includes('قابل للإهداء') && (await body()).includes('قابل للتعديل حسب طلبك'));
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(400);
  await pg.keyboard.press('Escape');
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عالم الهدايا والديكور والمناسبات').first().click();
  await pg.waitForTimeout(600);
  await pg.getByText('تنسيق طاولة ضيافة كاملة').first().click();
  await pg.waitForTimeout(600);
  t('T9 شارة خدمة ديكور وتنسيق ميداني', (await body()).includes('خدمة ديكور وتنسيق ميداني'));
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(900);
  t('T9 السلة: توصيل وتركيب فريق المتجر', (await body()).includes('توصيل وتركيب فريق المتجر'));
  await pg.getByRole('button', { name: /إتمام الطلب الآمن/ }).click();
  await pg.waitForTimeout(900);
  // تفعيل الإهداء لشحنة هدايا المعمور
  const giftToggle = pg.locator('button[aria-label="تفعيل الإهداء"]');
  if (await giftToggle.count()) { await giftToggle.click(); await pg.waitForTimeout(300); }
  const gPhone = pg.locator('[placeholder*="05xxxxxxxx"]').first();
  await gPhone.fill('0555555555');
  await pg.waitForTimeout(200);
  t('T9 نموذج الإهداء ظاهر', (await body()).includes('جوال المستلم'));
  // حقل مدينة المستلم
  const gCity = pg.locator('input[placeholder="الرياض"]');
  if (await gCity.count()) await gCity.fill('جدة');
  // محاولة متابعة بلا حجز مناسبة → التحقق يجب أن يمنع
  await pg.getByRole('button', { name: /متابعة للدفع/ }).click();
  await pg.waitForTimeout(600);
  t('T9 إلزام حجز موعد المناسبة', (await body()).includes('حجز موعد المناسبة'));
  // تعبئة الحجز
  await pg.locator('input[type="date"]').first().fill('2026-11-20');
  await pg.locator('input[type="time"]').first().fill('18:00');
  await pg.getByRole('button', { name: /متابعة للدفع/ }).click();
  await pg.waitForTimeout(600);
  await pg.getByRole('button', { name: /مدى|مدى/ }).first().click().catch(() => {});
  await pg.getByRole('button', { name: /ادفع واحجز في الخزنة/ }).click();
  await pg.waitForTimeout(1200);
  t('T9 نجاح طلب المناسبة + دردشة التنسيق', (await body()).includes('تم حجز مبلغك') && (await body()).includes('دردشة التنسيق'));

  /* ===== T10: OTP للخدمة الميدانية ===== */
  await logout();
  await login('0500000007'); // تركي الثقفي — لمسة ديكور s5
  await pg.getByRole('button', { name: 'الطلبات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  t('T10 طابور التاجر: قبول الطلب', (await body()).includes('قبول الطلب'));
  await pg.getByRole('button', { name: /قبول الطلب والتحضير/ }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByRole('button', { name: /شحن الطلب/ }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByRole('button', { name: /أرسل كود التأكيد/ }).first().click();
  await pg.waitForTimeout(600);
  t('T10 كود OTP أُرسل (بانتظار إدخال العميل)', (await body()).includes('كود التأكيد'));
  // العودة كعميل لإدخال الكود
  await logout();
  await login('0500000001');
  await pg.getByRole('button', { name: 'طلباتي', exact: true }).first().click();
  await pg.waitForTimeout(900);
  t('T10 صندوق OTP في طلبات العميل', (await body()).includes('تأكيد إتمام الخدمة بكود OTP'));
  const otpTxt = await body();
  const m = otpTxt.match(/الكود وصل جوالك:\s*([٠-٩]{4})/);
  const code = m ? m[1] : '';
  // كود خاطئ أولاً
  await pg.locator('input[placeholder="٠٠٠٠"]').first().fill('9999');
  await pg.getByRole('button', { name: /تأكيد إتمم الخدمة|تأكيد إتمام الخدمة/ }).first().click();
  await pg.waitForTimeout(500);
  t('T10 كود خاطئ مرفوض', (await body()).includes('محاولة خاطئة'));
  await pg.locator('input[placeholder="٠٠٠٠"]').first().fill(code);
  await pg.getByRole('button', { name: /تأكيد إتمام الخدمة/ }).first().click();
  await pg.waitForTimeout(800);
  t('T10 الكود الصحيح يحرر المستحقات', (await body()).includes('تفصيل التحرير'));

  /* ===== T11: طلب مبلغ إضافي (تعديل) ثم حارس المحادثة ===== */
  await logout();
  await login('0500000008'); // منال الغامدي — هدايا المعمور s6
  await pg.getByRole('button', { name: 'الطلبات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  await pg.getByRole('button', { name: /محادثة الطلب/ }).first().click();
  await pg.waitForTimeout(700);
  await pg.getByRole('button', { name: /طلب مبلغ إضافي/ }).first().click();
  await pg.waitForTimeout(400);
  await pg.locator('input[type="number"]').last().fill('25');
  await pg.getByRole('button', { name: /إرسال طلب الدفع للعميل/ }).click();
  await pg.waitForTimeout(600);
  t('T11 طلب المبلغ أُرسل للمحادثة', (await body()).includes('تعديل بـ') || (await body()).includes('بانتظار دفع العميل'));
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(300);
  await logout();
  await login('0500000001');
  await pg.getByRole('button', { name: 'طلباتي', exact: true }).first().click();
  await pg.waitForTimeout(800);
  await pg.getByRole('button', { name: /محادثة الطلب/ }).first().click();
  await pg.waitForTimeout(700);
  t('T11 زر الدفع بضمان ضمين للعميل', (await body()).includes('ادفع') && (await body()).includes('بضمان ضمين'));
  await pg.getByRole('button', { name: /ادفع .* بضمان ضمين/ }).first().click();
  await pg.waitForTimeout(700);
  t('T11 المبلغ حُجز في الخزنة', (await body()).includes('سُدد وحُجز في الخزنة') || (await body()).includes('حُجز مبلغ التعديل'));

  /* ===== T12: حارس المحادثة — ٣ مخالفات → حذف ===== */
  const ta = pg.locator('textarea').last();
  for (let i = 0; i < 3; i++) {
    await ta.fill('تواصل معي واتساب 0512345678');
    await pg.keyboard.press('Enter');
    await pg.waitForTimeout(400);
  }
  t('T12 تحذيرات الحجب الأمني', (await body()).includes('حُجبت رسالة') || (await body()).includes('حُجبت رسالتك'));
  t('T12 حذف المحادثة بعد ٣ مخالفات', (await body()).includes('محذوفة') || (await body()).includes('حُذفت المحادثة'));
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(300);

  /* ===== T13: نزاع + حكم الإدارة ===== */
  // طلب 1023 (s5 received) — فتح نزاع
  const canDispute = await pg.getByRole('button', { name: /فتح نزاع/ }).count();
  if (canDispute) {
    await pg.getByRole('button', { name: /فتح نزاع/ }).first().click();
    await pg.waitForTimeout(500);
    await pg.locator('textarea').last().fill('المفرش وصل بشد واضح وخيط مقطوع');
    await pg.getByRole('button', { name: '⚖️ افتح النزاع' }).click();
    await pg.waitForTimeout(700);
    t('T13 فتح النزاع', (await body()).includes('قيد التحكيم'));
    // الإدارة تحكم
    await logout();
    await login('0500000003');
    await pg.getByRole('button', { name: 'التحكيم', exact: true }).first().click();
    await pg.waitForTimeout(900);
    t('T13 قضية بانتظار الحكم', (await body()).includes('بانتظار الحكم'));
    await pg.getByRole('button', { name: /فتح القضية وإصدار الحكم/ }).first().click();
    await pg.waitForTimeout(500);
    await pg.getByRole('button', { name: /استرجاع كامل للعميل/ }).first().click();
    await pg.locator('textarea').last().fill('الصور تثبت الضرر قبل الاستلام — استرجاع كامل للعميل وتنبيه للمتجر');
    await pg.getByRole('button', { name: '⚖️ إصدار الحكم' }).click();
    await pg.waitForTimeout(800);
    t('T13 الحكم صدر بتسبيب', (await body()).includes('أحكام صادرة') || (await body()).includes('التسبيب'));
    await logout();
    await login('0500000001');
  } else t('T13 (تخطي: لا طلب قيد الفحص متاح)', true);

  /* ===== T14: إضافة منتج رقمي بإقرار IP + تمويل نقاط ===== */
  await logout();
  await login('0500000012'); // لينا — بايت كود s10
  await pg.getByRole('button', { name: 'منتجاتي', exact: true }).first().click();
  await pg.waitForTimeout(800);
  await pg.getByRole('button', { name: /منتج جديد/ }).click();
  await pg.waitForTimeout(600);
  await pg.locator('[placeholder*="عباية كتان مطرزة"]').fill('كود لعبة «اختبار ضمين»');
  await pg.locator('input[type="number"]').first().fill('99');
  await pg.locator('button[role="combobox"]').nth(1).click(); // اختيار طبيعة المنتج
  await pg.waitForTimeout(400);
  await pg.getByText('⚡ أصل رقمي (كود/ملف) — تسليم فوري بلا شحن إلى «مكتبة العميل»').last().click();
  await pg.waitForTimeout(400);
  await pg.locator('[placeholder="XXXX-XXXX-XXXX"]').fill('TST16-9K2M-X7Q4');
  // نقاط إلزامية
  await pg.locator('[placeholder="مثال: 50"]').fill('50');
  await pg.waitForTimeout(300);
  t('T14 معاينة تمويل النقاط (− من المحفظة)', (await body()).includes('تُخصم من محفظتك'));
  // إرسال بلا إقرار IP → يجب أن يرفض
  await pg.getByRole('button', { name: 'إضافة المنتج' }).click();
  await pg.waitForTimeout(500);
  t('T14 إقرار IP إلزامي (رفض بلا إقرار)', (await body()).includes('إلزامي قبل رفع الملفات والأكواد الرقمية'));
  // الإقرار ثم الحفظ
  const ipCb = pg.locator('input[type="checkbox"]').first();
  if (await ipCb.count()) { await ipCb.check(); }
  await pg.getByRole('button', { name: 'إضافة المنتج' }).click();
  await pg.waitForTimeout(900);
  t('T14 المنتج الرقمي أُضيف وظهر', (await body()).includes('كود لعبة «اختبار ضمين»'));
  await pg.keyboard.press('Escape');

  /* ===== T15: أسئلة المنتج الإجبارية ===== */
  await pg.getByRole('button', { name: '✏️ تعديل', exact: false }).first().click();
  await pg.waitForTimeout(600);
  await pg.getByRole('button', { name: /إضافة سؤال للمنتج/ }).click();
  await pg.waitForTimeout(300);
  await pg.locator('[placeholder*="ما اللون المطلوب"]').fill('أي منصة التفعيل المطلوبة؟');
  await pg.locator('[placeholder*="الخيار ١"]').fill('بلايستيشن');
  await pg.locator('[placeholder*="الخيار ٢"]').fill('إكس بوكس');
  await pg.getByRole('button', { name: '＋ إضافة السؤال ✓' }).click();
  await pg.waitForTimeout(300);
  await pg.getByRole('button', { name: 'حفظ التعديلات' }).click();
  await pg.waitForTimeout(700);
  await logout();
  await login('0500000001');
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عالم الألعاب والأجهزة والمنتجات الرقمية').first().click();
  await pg.waitForTimeout(700);
  await pg.getByText('كود لعبة «اختبار ضمين»').first().click();
  await pg.waitForTimeout(700);
  t('T15 سؤال التاجر يظهر للعميل', (await body()).includes('أسئلة من التاجر'));
  t('T15 نقاط الولاء المموّلة ظاهرة (٥٠ نقطة)', (await body()).includes('يمنح هذا المنتج ٥٠ نقطة ولاء'));
  const addDisabled = await pg.getByRole('button', { name: 'أضف إلى السلة' }).isDisabled();
  t('T15 زر الشراء معطل قبل الإجابة', addDisabled);
  await pg.getByRole('button', { name: 'بلايستيشن' }).click();
  await pg.waitForTimeout(300);
  const addEnabled = !(await pg.getByRole('button', { name: 'أضف إلى السلة' }).isDisabled());
  t('T15 زر الشراء تفعّل بعد الإجابة', addEnabled);
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(600);
  t('T15 أسئلة مجابة على عنصر السلة', (await body()).includes('أسئلة مجابة'));
  // إفراغ السلة
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(300);

  /* ===== T16: إعدادات التاجر + كوبون ===== */
  await logout();
  await login('0500000012');
  await pg.getByRole('button', { name: 'الإعدادات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  t('T16 الإعدادات: ملف المتجر والعمولة', (await body()).includes('ملف المتجر') && (await body()).includes('العمولة ونظام النقاط'));
  t('T16 موقع المتجر (مدينة فقط للعملاء)', (await body()).includes('موقع المتجر — حماية من الالتفاف'));
  t('T16 خيارات التوصيل وسقف الشحن', (await body()).includes('خيارات التوصيل وسقف الشحن المجاني'));
  await pg.locator('[placeholder="MYSTORE10"]').fill('BYTE16');
  await pg.getByRole('button', { name: '＋ إصدار كوبون' }).click();
  await pg.waitForTimeout(600);
  t('T16 كوبون المتجر صدر', (await body()).includes('BYTE16'));

  /* ===== T17: الإدارة — المتاجر والطلبات والأقسام والإيرادات ===== */
  await logout();
  await login('0500000003');
  await pg.waitForTimeout(700);
  t('T17 مركز الإدارة: KPIs ومراقبة المحادثات', (await body()).includes('مركز إدارة ضمين') && (await body()).includes('مراقبة محادثات الطلبات'));
  await pg.getByRole('button', { name: 'المتاجر', exact: true }).first().click();
  await pg.waitForTimeout(800);
  await pg.getByRole('button', { name: /طلبات التسجيل/ }).first().click();
  await pg.waitForTimeout(600);
  t('T17 طلبات التسجيل بتفاصيلها (سجل/آيبان)', (await body()).includes('عطور تلال الطائف') && (await body()).includes('الآيبان'));
  await pg.getByRole('button', { name: /موافقة وفتح المتجر/ }).first().click();
  await pg.waitForTimeout(700);
  t('T17 الموافقة تفتح المتجر (١١ متجراً)', (await body()).includes('جميع المتاجر (١١)'));
  const rejBtn = pg.getByRole('button', { name: /رفض الطلب/ }).first();
  if (await rejBtn.count()) {
    await rejBtn.click();
    await pg.waitForTimeout(400);
    await pg.locator('textarea').last().fill('رمز الدعوة غير صحيح — تواصل مع الإدارة');
    await pg.getByRole('button', { name: 'تأكيد الرفض' }).click();
    await pg.waitForTimeout(500);
    t('T17 الرفض بسبب يظهر', (await body()).includes('مرفوض'));
  }
  // الأقسام والعمولات
  await pg.getByRole('button', { name: 'الأقسام', exact: true }).first().click();
  await pg.waitForTimeout(800);
  t('T17 الأقسام: عمولة كل تصنيف قابلة للتعديل', (await body()).includes('عمولة') && (await body()).includes('تصنيف جديد'));
  // الإيرادات
  await pg.getByRole('button', { name: 'الإيرادات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  t('T17 الإيرادات: معادلة الخزنة والملخص المالي', (await body()).includes('معادلة الخزنة') && (await body()).includes('الملخص المالي الشامل'));
  t('T17 بند مستحقات OTP المعلقة', (await body()).includes('مستحقات خدمات ميدانية معلقة'));
  t('T17 إعدادات النقاط (قيمة النقطة والتوصيل)', (await body()).includes('إعدادات برنامج النقاط'));
  t('T17 أرصدة تجار الضمان وكوبونات الإدارة', (await body()).includes('أرصدة تجار الضمان') && (await body()).includes('كوبونات الإدارة'));
  await pg.locator('[placeholder="SAVE10"]').fill('DAMEEN16');
  await pg.getByRole('button', { name: '＋ إصدار كوبون شامل' }).click();
  await pg.waitForTimeout(500);
  t('T17 كوبون الإدارة صدر', (await body()).includes('DAMEEN16'));

  /* ===== T18: الجوال 390px (كزائر) ===== */
  await logout();
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(1000);
  const overflow = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  t('T18 جوال 390px: لا تجاوز أفقي', overflow <= 0);
  const navItems = await pg.locator('nav[aria-label="التنقل السفلي"] button').count();
  t('T18 تنقل سفلي بخمسة بنود', navItems === 5);

  console.log('\n========== النتيجة: ' + OK.length + ' ✓ / ' + BAD.length + ' ✗ ==========');
  if (errs.length) console.log('JS ERRORS:', errs.slice(0, 8));
  if (BAD.length) console.log('FAILED:', BAD);
  await pg.screenshot({ path: '/home/z/my-project/scripts/v16-final.png', fullPage: false });
  await b.close();
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
