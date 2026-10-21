const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);

  // 1. three logins
  for (const [id, role] of [['0500000001', 'customer'], ['0500000002', 'merchant'], ['0500000003', 'admin']]) {
    const r = await pg.evaluate(([id]) => {
      openAuth(); document.querySelector('#lg-id').value = id; document.querySelector('#lg-pw').value = '1234'; doLogin();
      return { role: SES.role, page: VIEW.page };
    }, [id]);
    await pg.waitForTimeout(300);
    console.log('LOGIN', role, '=>', JSON.stringify(r));
    await pg.evaluate(() => logout());
  }

  // 2. merchant auto-image + add product
  await pg.evaluate(() => { openAuth('merchant'); document.querySelector('#lg-id').value = '0500000002'; document.querySelector('#lg-pw').value = '1234'; doLogin(); go('m-prods'); });
  await pg.waitForTimeout(500);
  const auto = await pg.evaluate(() => { mProdForm(null); mAutoImg(); return { mimg: MIMG ? MIMG.slice(-24) : null, inPool: typeof ZPOOL !== 'undefined' && ZPOOL.includes(MIMG), previewShown: document.querySelector('#mp-prev').style.display !== 'none' }; });
  console.log('MERCHANT AUTO IMG:', JSON.stringify(auto));

  // 3. guest browse: section → store → product chain
  await pg.evaluate(() => { logout(); go('section', 'deco'); });
  await pg.waitForTimeout(400);
  const chain = await pg.evaluate(() => {
    const first = document.querySelector('.bigstore'); if (first) first.click();
    return { page: VIEW.page, store: VIEW.store };
  });
  await pg.waitForTimeout(400);
  const chain2 = await pg.evaluate(() => { const c = document.querySelector('.pcard') || document.querySelector('.pgrid > div'); if (c) c.click(); return { page: VIEW.page, pid: VIEW.pid }; });
  console.log('GUEST CHAIN:', JSON.stringify(chain), JSON.stringify(chain2));

  // 4. search from section page works
  await pg.evaluate(() => go('section', 'family'));
  await pg.waitForTimeout(300);
  await pg.fill('#sq', 'عسل');
  await pg.press('#sq', 'Enter');
  await pg.waitForTimeout(400);
  const search = await pg.evaluate(() => ({ page: VIEW.page, q: VIEW.q, results: document.querySelectorAll('.pgrid .pcard, .pgrid > div').length }));
  console.log('SEARCH:', JSON.stringify(search));

  console.log('ERRORS:', errs.length ? '\n' + errs.join('\n') : 'none');
  await b.close();
})();
