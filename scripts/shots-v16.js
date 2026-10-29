/* لقطات الشاشة للمراجعة البصرية — v16 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const log = m => console.log('>>', m);
  const shot = async (name) => { log('shot ' + name); await pg.screenshot({ path: `/home/z/my-project/scripts/v16-${name}.png`, fullPage: false }); };

  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(1300);
  await shot('home');

  await pg.getByText('عالم الألعاب والأجهزة والمنتجات الرقمية').first().click();
  await pg.waitForTimeout(900);
  await shot('gaming');

  // دخول كعميل
  await pg.getByRole('button', { name: 'تسجيل الدخول', exact: true }).first().click();
  await pg.locator('[placeholder*="name@mail.com"]').fill('0500000001');
  await pg.locator('[placeholder="••••"]').fill('1234');
  await pg.getByRole('button', { name: '🔑 دخول' }).click();
  await pg.waitForTimeout(900);

  // سلة مجمعة بثلاث شحنات
  await pg.getByText('عالم المأكولات والضيافة').first().click();
  await pg.waitForTimeout(600);
  await pg.getByText('جبن قريش بلدي').first().click();
  await pg.waitForTimeout(600);
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(400);
  await pg.keyboard.press('Escape');
  await pg.getByRole('button', { name: 'الرئيسية', exact: true }).first().click();
  await pg.waitForTimeout(400);
  await pg.getByText('عالم الأزياء والجمال').first().click();
  await pg.waitForTimeout(500);
  await pg.getByText('عباية كتان «نسمة»').first().click();
  await pg.waitForTimeout(500);
  await pg.getByRole('button', { name: 'أضف إلى السلة' }).click();
  await pg.waitForTimeout(900);
  await shot('cart-groups');

  // بوابة الدفع خطوة 1
  await pg.getByRole('button', { name: /إتمام الطلب الآمن/ }).click();
  await pg.waitForTimeout(800);
  await shot('checkout');

  // إلغاء والطلبات
  await pg.keyboard.press('Escape');
  await pg.keyboard.press('Escape');
  await pg.getByRole('button', { name: 'طلباتي', exact: true }).first().click();
  await pg.waitForTimeout(900);
  await shot('orders');

  log('merchant logout');
  // لوحة التاجر
  await pg.waitForTimeout(4500); // انتفاء التوست
  await pg.getByRole('button', { name: 'حسابي' }).click();
  await pg.getByText('تسجيل الخروج').last().click();
  await pg.waitForTimeout(400);
  await pg.getByRole('button', { name: 'تسجيل الدخول', exact: true }).first().click();
  await pg.locator('[placeholder*="name@mail.com"]').fill('0500000007');
  await pg.locator('[placeholder="••••"]').fill('1234');
  await pg.getByRole('button', { name: '🔑 دخول' }).click();
  await pg.waitForTimeout(900);
  await pg.getByRole('button', { name: 'الإعدادات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  await pg.mouse.wheel(0, 600);
  await pg.waitForTimeout(400);
  await shot('merchant-settings');

  log('admin logout');
  // الإدارة — الإيرادات
  await pg.waitForTimeout(4500); // انتفاء التوست
  await pg.getByRole('button', { name: 'حسابي' }).click();
  await pg.getByText('تسجيل الخروج').last().click();
  await pg.waitForTimeout(400);
  await pg.getByRole('button', { name: 'تسجيل الدخول', exact: true }).first().click();
  await pg.locator('[placeholder*="name@mail.com"]').fill('0500000003');
  await pg.locator('[placeholder="••••"]').fill('1234');
  await pg.getByRole('button', { name: '🔑 دخول' }).click();
  await pg.waitForTimeout(900);
  await pg.getByRole('button', { name: 'الإيرادات', exact: true }).first().click();
  await pg.waitForTimeout(900);
  await shot('admin-revenue');

  log('mobile');
  // الجوال
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.waitForTimeout(4500); // انتفاء التوست
  await pg.evaluate(() => { document.querySelectorAll('[data-sonner-toast]').forEach(t => t.remove()); });
  await pg.getByRole('button', { name: 'حسابي' }).click({ force: true }).catch(() => {});
  await pg.waitForTimeout(400);
  await pg.getByText('تسجيل الخروج').last().click({ force: true }).catch(() => {});
  await pg.waitForTimeout(600);
  await pg.evaluate(() => { try { localStorage.removeItem('dameen-react-v2'); } catch (e) {} });
  await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(900);
  await shot('mobile-home');

  await b.close();
  console.log('shots saved: home, gaming, cart-groups, checkout, orders, merchant-settings, admin-revenue, mobile-home');
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
