const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(600);
  // open login modal
  await pg.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => (x.textContent||'').includes('دخول')); if (b) b.click(); });
  await pg.waitForTimeout(500);
  const snapshot = await pg.evaluate(() => {
    const m = document.querySelector('#modal, .modal');
    return { modalExists: !!m, html: m ? m.outerHTML.slice(0, 600) : 'NO MODAL', inputs: [...document.querySelectorAll('.modal input, .modal button')].map(i => i.tagName + ':' + (i.id||i.className||'') + ':' + (i.textContent||i.placeholder||'').slice(0,25)) };
  });
  console.log('SNAPSHOT:', JSON.stringify(snapshot, null, 1));
  // try login with known demo accounts
  const demos = [
    ['0555000101', '1234'], // maybe customer phone
    ['0555000202', '1234'],
    ['sara@example.com', '1234'],
    ['0500000001', '1234'],
  ];
  for (const [id, pw] of demos) {
    const r = await pg.evaluate(([id, pw]) => {
      try {
        const inp = document.querySelector('#modal input[id*=lg], #modal input');
        return { ok: true, hasInput: !!inp };
      } catch (e) { return { ok: false, err: e.message }; }
    }, [id, pw]);
    break; // just check structure first
  }
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await pg.screenshot({ path: '/home/z/my-project/scripts/shots/diag-modal.png' });
  await b.close();
})();
