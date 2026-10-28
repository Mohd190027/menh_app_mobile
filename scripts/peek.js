const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  const info = await pg.evaluate(() => {
    const t = o => Object.prototype.toString.call(o).slice(8, -1);
    return {
      CATS_type: t(CATS), CATS_keys: Object.keys(CATS),
      c_first: JSON.parse(JSON.stringify(Array.isArray(CATS) ? CATS[0] : CATS[Object.keys(CATS)[0]])),
      s0: JSON.parse(JSON.stringify(STORES[0])),
      p0: JSON.parse(JSON.stringify(PRODUCTS[0])),
      r0: JSON.parse(JSON.stringify((DB.reqs || [])[0] || null)),
      SESusers: typeof USERS !== 'undefined' ? USERS.length : 'n/a',
    };
  });
  console.log(JSON.stringify(info, null, 1).slice(0, 3000));
  await b.close();
})();
