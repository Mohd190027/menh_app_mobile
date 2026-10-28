/* استخراج بيانات ضمين الحقيقية من dameen.html — v3 (USERS كائن، طلبات كاملة) */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);
  const data = await pg.evaluate(() => JSON.parse(JSON.stringify({
    sections: SECTIONS,
    cats: CATS,
    stores: STORES.map(s => ({
      id: s.id, name: s.name, sec: s.sec, owner: s.owner, color: s.color, cover: s.cover,
      desc: s.desc, rt: s.rt, sales: s.sales, susp: !!s.susp, city: s.city, freeMin: s.freeMin || 0,
    })),
    products: PRODUCTS.map(p => ({
      id: p.id, store: p.store, name: p.name, cat: p.cat, price: p.price, off: p.off || 0,
      stock: p.stock, sold: p.sold, rt: p.rt, rc: p.rc || 0, imgs: (p.imgs || []).slice(0, 3),
      desc: (p.desc || '').slice(0, 90), digi: !!p.digi, ptype: p.ptype || '', giftOk: !!p.giftOk,
    })),
    users: Object.entries(USERS).map(([phone, u]) => ({ phone, name: u.name, role: u.role, store: u.store || null, pts: u.pts || 0, bal: u.bal || 0, email: u.email || '' })),
    reqs: (DB.reqs || []).map(r => ({ id: r.id, kind: r.kind || 'store', own: r.own, store: r.store || '', email: r.email, phone: r.phone, cr: r.cr || '', sec: r.sec || '', status: r.status })),
    orders: (DB.orders || []).slice(0, 14).map(o => ({
      id: o.id, customer: o.customer, at: o.at,
      groups: (o.groups || []).map(g => ({ store: g.store, status: g.status, items: (g.items || []).map(i => ({ pid: i.pid, qty: i.qty })) })),
    })),
    disputes: (DB.disputes || []).slice(0, 3).map(d => ({ id: d.id, oid: d.oid, store: d.store, by: d.by, t: d.t, reason: d.reason, status: d.status })),
  })));
  require('fs').writeFileSync('/home/z/my-project/scripts/dameen-data.json', JSON.stringify(data, null, 1));
  console.log('sections:', data.sections.length, '| stores:', data.stores.length, '| products:', data.products.length, '| users:', data.users.length, '| reqs:', data.reqs.length, '| orders:', data.orders.length, '| disputes:', data.disputes.length);
  await b.close();
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
