const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(800);
  const info = await pg.evaluate(() => {
    const t = o => Object.prototype.toString.call(o).slice(8, -1);
    return {
      USERS: t(USERS), USERS_sample: Array.isArray(USERS) ? USERS.slice(0, 4) : Object.entries(USERS).slice(0, 4),
      DBkeys: Object.keys(DB), reqs_t: t(DB.reqs), orders_t: t(DB.orders),
      orders_sample: Array.isArray(DB.orders) ? DB.orders.slice(0, 2).map(o => ({ id: o.id, customer: o.customer, total: o.total, status: o.status, at: o.at, groups: (o.groups || []).map(g => ({ store: g.store, status: g.status, sum: g.sum, items: (g.items || []).map(i => i.pid + 'x' + i.qty) })) })) : null,
    };
  });
  console.log(JSON.stringify(info, null, 1).slice(0, 2200));
  await b.close();
})();
