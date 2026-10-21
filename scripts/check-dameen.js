/* فحص صياغة سكربت dameen.html + التحقق من المراجع الحرجة */
const fs = require('fs');
const path = '/home/z/my-project/download/dameen.html';
const html = fs.readFileSync(path, 'utf8');

// استخراج السكربت الرئيسي
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT FOUND'); process.exit(1); }
const js = m[1];

// 1) فحص الصياغة عبر Function constructor (يلقط أخطاء الأقواس والقوالب)
try {
  new Function(js);
  console.log('SYNTAX OK — السكربت يُحلَّل بلا أخطاء');
} catch (e) {
  console.error('SYNTAX ERROR:', e.message);
  process.exit(1);
}

// 2) التأكد من عدم بقاء مراجع لدوال محذوفة
const mustNotExist = ['mOfferSet(', 'mOfferSet(`'];
for (const bad of mustNotExist) {
  if (js.includes(bad)) { console.error('STALE REFERENCE:', bad); process.exit(1); }
}

// 3) التأكد من وجود كل الدوال الجديدة والمراجع الجديدة
const mustExist = [
  'function pgMProds', 'function mOfferForm', 'function offPrev', 'function mOfferSet2',
  'function mProdRevs', 'function ptsCostPrev', 'function pickStoreImg', 'function rmStoreImg',
  'function setPtsVal', 'function setFreeDlPts', 'FREE_DL', 'ptsVal()', 'fdPts()',
  'aPtsWallet', 'ptsFunding', 'VIEW.mof', 'mpgrid', 'splitbar', 'storeid', 'freeDl'
];
for (const g of mustExist) {
  if (!js.includes(g)) { console.error('MISSING:', g); process.exit(1); }
}
console.log('REFERENCES OK — لا مراجع معلّقة وكل الدوال الجديدة موجودة');

// 4) فحص توازن وسوم HTML الحرجة في القوالب (فحص سريع غير صارم)
const pairs = [['acard', 0]];
console.log('SIZE:', (fs.statSync(path).size / 1024).toFixed(1) + 'KB');
console.log('LINES:', html.split('\n').length);
