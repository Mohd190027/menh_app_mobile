/* استخراج بيانات ضمين الكاملة من dameen.html — v4 (كل الحقول بلا اختصار) */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///home/z/my-project/download/dameen.html');
  await pg.waitForTimeout(900);
  const data = await pg.evaluate(() => {
    const now = Date.now();
    const rel = v => (v == null ? null : Math.round((now - v) / 60000)); // دقائق مضت
    return JSON.parse(JSON.stringify({
      sections: SECTIONS,
      cats: CATS,
      stores: STORES.map(s => ({
        id: s.id, name: s.name, sec: s.sec, owner: s.owner, color: s.color, cover: s.cover || '',
        logo: s.logo || '', desc: s.desc, rt: s.rt, sales: s.sales, susp: !!s.susp,
        open: s.open !== false, city: s.city || 'الرياض', area: s.area || '',
        dlMode: s.dlMode || 'customer', freeMin: s.freeMin || 0, rangeKm: s.rangeKm || 20,
        qs: s.qs || [], cr: s.cr || '', iban: s.iban || '',
      })),
      products: PRODUCTS.map(p => ({
        id: p.id, store: p.store, name: p.name, cat: p.cat, price: p.price, off: p.off || 0,
        stock: p.stock, sold: p.sold, rt: p.rt, rc: p.rc || 0, imgs: (p.imgs || []).slice(0, 3),
        desc: String(p.desc || ''), fragile: !!p.fragile, ptype: p.ptype || 'std',
        giftOk: !!p.giftOk, customOk: !!p.customOk, pts: p.pts || 0,
        digi: p.digi ? { kind: p.digi.kind, val: p.digi.val, size: p.digi.size || '' } : null,
        qs: (p.qs || []).map(q => ({ t: q.t, q: q.q, o: q.o || [] })),
        specs: p.specs || {},
        ratings: (p.ratings || []).slice(0, 6).map(r => ({ by: r.by, name: r.name, stars: r.stars, txt: String(r.txt || '').slice(0, 140), atMin: rel(r.at) })),
      })),
      users: Object.entries(USERS).map(([phone, u]) => ({
        phone, name: u.name, role: u.role, store: u.store || null, pts: u.pts || 0, bal: u.bal || 0,
        email: u.email || '', addrs: u.addrs || [], favs: u.favs || [],
        dlib: (u.dlib || []).slice(0, 8).map(d => ({ pid: d.pid, name: d.name, store: d.store, kind: d.kind, val: d.val, size: d.size || '', atMin: rel(d.at), oid: d.oid })),
        ptsLog: (u.ptsLog || []).slice(0, 8).map(l => ({ t: l.t, v: l.v, atMin: rel(l.at) })),
      })),
      reqs: (DB.reqs || []).map(r => ({
        id: r.id, kind: r.kind || 'store', own: r.own, store: r.store || '', email: r.email || '',
        phone: r.phone, cr: r.cr || '', sec: r.sec || '', iban: r.iban || '',
        code: r.code || '', role: r.role || '', status: r.status, why: r.why || '', atMin: rel(r.at),
      })),
      orders: (DB.orders || []).map(o => ({
        id: o.id, customer: o.customer, atMin: rel(o.at), pay: o.pay, addr: o.addr, city: o.city,
        coupon: o.coupon ? { code: o.coupon.code, amt: o.coupon.amt } : null,
        ptsUsed: o.ptsUsed || 0, ptsAmt: o.ptsAmt || 0, freeDl: !!o.freeDl,
        net: o.net, tax: o.tax, total: o.total,
        groups: (o.groups || []).map(g => ({
          store: g.store, status: g.status, sub: g.sub, dl: g.dl || 0, extra: g.extra || 0,
          digi: !!g.digi, custom: !!g.custom, gift: g.gift || null,
          booking: g.booking ? { dl: g.booking.dl || 'field', date: g.booking.date || '', setup: g.booking.setup || '', tear: g.booking.tear || '', note: g.booking.note || '', geo: g.booking.geo || null } : null,
          items: (g.items || []).map(i => ({ pid: i.pid, qty: i.qty })),
          ship: g.ship || null,
          payout: g.payout ? { sub: g.payout.sub, comm: g.payout.comm, net: g.payout.net } : null,
          rated: g.rated ? { stars: g.rated.stars } : null,
          chatN: (g.chat || []).length,
        })),
      })),
      disputes: (DB.disputes || []).map(d => ({
        id: d.id, order: d.order, store: d.store, customer: d.customer, subject: d.subject,
        status: d.status, openedAtMin: rel(d.openedAt),
        ruling: d.ruling ? { act: d.ruling.act, text: d.ruling.text } : null,
        messages: (d.messages || []).map(m => ({ r: m.r, t: String(m.t).slice(0, 200), atMin: rel(m.at), img: m.img || null })),
      })),
      db: {
        coupons: DB.coupons, ptsVal: DB.ptsVal || 0.1, freeDlPts: DB.freeDlPts || 250,
        aPtsWallet: DB.aPtsWallet || 0, logiWallet: DB.logiWallet || 0, vat: DB.vat || 0,
        aRevenue: DB.aRevenue || 0, revMonths: DB.revMonths || [],
        storeWallets: DB.storeWallets || {},
        ptsFunding: (DB.ptsFunding || []).map(f => ({ store: f.store, pname: f.pname, pts: f.pts, amt: f.amt, atMin: rel(f.at) })),
        notifs: (DB.notifs || []).slice(0, 8).map(n => ({ to: n.to, ic: n.ic, t: n.t, b: n.b, atMin: rel(n.at), read: !!n.read, go: n.go || '' })),
      },
    }));
  });
  require('fs').writeFileSync('/home/z/my-project/scripts/dameen-data.json', JSON.stringify(data, null, 1));
  console.log('sections:', data.sections.length, '| stores:', data.stores.length, '| products:', data.products.length,
    '| users:', data.users.length, '| reqs:', data.reqs.length, '| orders:', data.orders.length,
    '| disputes:', data.disputes.length, '| coupons:', Object.keys(data.db.coupons).length);
  await b.close();
})().catch(e => { console.error('EXC:', e.message); process.exit(1); });
