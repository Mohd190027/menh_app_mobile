/* المسارات المشتركة بين حصانة المطابقة وأداة التشخيص */
module.exports = [

  // زائر
  { id: 'guest-home', ses: null, page: 'home' },
  { id: 'guest-search', ses: null, page: 'search', arg: 'عباية' },
  { id: 'guest-section', ses: null, page: 'section', arg: 'fashion' },
  { id: 'guest-store', ses: null, page: 'store', arg: 's1' },
  { id: 'guest-product', ses: null, page: 'product', arg: 'p1' },
  { id: 'guest-cart', ses: null, page: 'cart' },
  { id: 'guest-favs', ses: null, page: 'favs' },
  { id: 'guest-disputes', ses: null, page: 'disputes' },
  { id: 'guest-account', ses: null, page: 'account' },
  { id: 'guest-dlib', ses: null, page: 'dlib' },
  { id: 'guest-orders', ses: null, page: 'orders' },
  // عميلة
  { id: 'cust-home', ses: { phone: '0500000001' }, page: 'home' },
  { id: 'cust-section', ses: { phone: '0500000001' }, page: 'section', arg: 'gaming' },
  { id: 'cust-store', ses: { phone: '0500000001' }, page: 'store', arg: 's6' },
  { id: 'cust-product', ses: { phone: '0500000001' }, page: 'product', arg: 'p19' },
  { id: 'cust-orders', ses: { phone: '0500000001' }, page: 'orders' },
  { id: 'cust-account', ses: { phone: '0500000001' }, page: 'account' },
  { id: 'cust-favs', ses: { phone: '0500000001' }, page: 'favs' },
  { id: 'cust-disputes', ses: { phone: '0500000001' }, page: 'disputes' },
  { id: 'cust-dlib', ses: { phone: '0500000001' }, page: 'dlib' },
  // تاجرة
  { id: 'mer-home', ses: { phone: '0500000002' }, page: 'home' },
  { id: 'mer-dash', ses: { phone: '0500000002' }, page: 'm-dash' },
  { id: 'mer-prods', ses: { phone: '0500000002' }, page: 'm-prods' },
  { id: 'mer-media', ses: { phone: '0500000002' }, page: 'm-media' },
  { id: 'mer-orders', ses: { phone: '0500000002' }, page: 'm-orders' },
  { id: 'mer-wallet', ses: { phone: '0500000002' }, page: 'm-wallet' },
  { id: 'mer-disputes', ses: { phone: '0500000002' }, page: 'm-disputes' },
  { id: 'mer-set', ses: { phone: '0500000002' }, page: 'm-set' },
  // الإدارة العليا
  { id: 'adm-hub', ses: { phone: '0500000003' }, page: 'a-hub' },
  { id: 'adm-stores', ses: { phone: '0500000003' }, page: 'a-stores', arg: 'stores' },
  { id: 'adm-reqs', ses: { phone: '0500000003' }, page: 'a-stores', arg: 'reqs' },
  { id: 'adm-disputes', ses: { phone: '0500000003' }, page: 'a-disputes' },
  { id: 'adm-cats', ses: { phone: '0500000003' }, page: 'a-cats' },
  { id: 'adm-rev', ses: { phone: '0500000003' }, page: 'a-rev' },
  // موظف الإدارة
  { id: 'stf-hub', ses: { phone: '0500000013' }, page: 'e-hub' },
  { id: 'stf-stores', ses: { phone: '0500000013' }, page: 'e-stores' },
  { id: 'stf-disputes', ses: { phone: '0500000013' }, page: 'e-disputes' },
];
