const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  const info = await pg.evaluate(() => {
    const t = o => Object.prototype.toString.call(o).slice(8, -1);
    const names = Object.getOwnPropertyNames(window).filter(k => /^(SEC|WORLD|WORLDS)/.test(k));
    const secs = typeof SECS !== 'undefined' ? SECS : null;
    return { globals: names, secs: secs ? JSON.parse(JSON.stringify(secs)) : null, CATS: JSON.parse(JSON.stringify(CATS)) };
  });
  console.log(JSON.stringify(info, null, 1).slice(0, 2600));
  await b.close();
})();
