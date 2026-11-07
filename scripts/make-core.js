#!/usr/bin/env node
/* ضمين — توليد src/dameen/core.ts من public/dameen/dameen.js حرفياً.
 * يستخدم acorn لتحديد التصريحات العليا فقط (الدوال/الثوابت) فيس Prefixed بـ export.
 * الاستثناءات المستبعدة (تُنقل يدوياً): impInfo, playVid (تفتحان نوافذ React) و custCity (تستخدم CK/me).
 * vidFail تبقى هنا (DOM خالص) — أُعيد إدراجها يدوياً بعد playVid المحذوف.
 */
const fs = require('fs');
const acorn = require('acorn');

const SRC = '/home/z/my-project/public/dameen/dameen.js';
const OUT = '/home/z/my-project/src/dameen/core.ts';
const src = fs.readFileSync(SRC, 'utf8');
const lines = src.split('\n');
const lineStart = []; // offset بداية كل سطر
for (let i = 0, off = 0; i < lines.length; i++) { lineStart.push(off); off += lines[i].length + 1; }
const lineAt = off => { // رقم السطر (1-based) الذي يقع فيه offset
  let lo = 0, hi = lineStart.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStart[mid] <= off) lo = mid; else hi = mid - 1; }
  return lo + 1;
};

const SKIP_NAMES = new Set(['impInfo', 'playVid', 'custCity', 'impAdd', 'impRefund', 'impHero']);

const WIDEN = new Set(['DB', 'USERS', 'PRODUCTS', 'STORES', 'SECTIONS', 'CATS', 'MED', 'IMP']);

const ast = acorn.parse(src, { ecmaVersion: 'latest' });
const edits = []; // {start, end, name, kind}
for (const node of ast.body) {
  const startLine = lineAt(node.start);
  if (startLine < 2 || startLine > 312) continue; // نطاق الاستخراج
  let name = null, kind = null;
  if (node.type === 'FunctionDeclaration') { name = node.id.name; kind = 'function'; }
  else if (node.type === 'VariableDeclaration') { kind = 'var'; name = node.declarations.map(d => d.id.name || (d.id.properties && d.id.properties[0] && d.id.properties[0].key && d.id.properties[0].key.name) || '...').join(','); }
  else continue; // التصريحات فقط في هذا النطاق
  edits.push({ start: node.start, end: node.end, name, kind, startLine });
}

let out = `/* ضمين — core.ts
 * البيانات والدوال النقية — منقولة حرفياً من dameen.js (السطور ٢-٣١٢) عبر scripts/make-core.js
 * مولَّد آلياً: لا تُحرَّر يدوياً. الاستثناءات المنقولة يدوياً: impInfo و playVid (shop.tsx) و custCity (store.ts).
 */
`;

const keep = [];
for (const e of edits) {
  const firstName = e.name.split(',')[0];
  if (SKIP_NAMES.has(firstName)) continue;
  let text = src.slice(e.start, e.end);
  if (e.kind === 'var') {
    const kw = text.startsWith('let') ? 'let' : 'const';
    if (WIDEN.has(firstName)) {
      // توسيع النوع (بلا regex): بيانات حرفية تتجاوز تضييق TS
      const rest = text.slice(kw.length).replace(/^[ ]+/, '');
      const nm = rest.split('=')[0].replace(/[ ]+$/, '');
      text = kw + ' ' + nm + ':any' + rest.slice(nm.length);
    } else if (firstName === 'IM') {
      text = text.replace('(id,s)=>', '(id,s?)=>');
    }
  } else if (firstName === 'toast') {
    text = text.replace('function toast(msg,type)', 'function toast(msg,type?)').replace('t.style.opacity=0;', "t.style.opacity='0';");
  } else if (firstName === 'impSeed') {
    text = text.split('appSave()').join('DSAVE.fn()');
  }
  keep.push(text);
}
out += keep.map(t => 'export ' + t).join('\n\n');
out += `

/* مطاوعات MED/IMP — إعادة الإسناد تحدث داخل core فقط (روابط الاستيراد للقراءة) */
export function setMED(v){MED=v}
export function setIMP(v){IMP=v}
export const getMED=()=>MED
export const getIMP=()=>IMP

/* دالة حفظ تُضبط من store — impAdd/impRefund في الأصل تستدعيان appSave المعرفة لاحقاً */
export const DSAVE={fn:()=>{}}
`;

fs.writeFileSync(OUT, out);

// فحوصات
const must = ['SECTIONS','CATS','STORES','PRODUCTS','USERS','DB','MED','IMP','shipQuote','mkLogi','chatGuard','hash','toast','impAnim','impactBlock','pvidsBlock','imgTag','STARS','medOf','ptsVal','fdPts','PTI','CITIES','CITY_DL','durTxt','tempTxt','impSeed','BYPASS_WORDS','COURIERS','secOf','storeOwner','eff','catComm','SEC','ST','vidFail','DSAVE'];
const missing = must.filter(m => !out.includes(m));
const banned = ['export function impInfo','export function playVid','export function custCity','export function impHero','export function impAdd','export function impRefund','export const SES','export let SES','export const VIEW','export function go(','export function render('];
const leaked = banned.filter(b => out.includes(b));
console.log('nodes in range:', edits.length, '| kept:', keep.length);
console.log('missing:', missing.length ? missing : 'NONE ✓');
console.log('leaked:', leaked.length ? leaked : 'NONE ✓');
console.log('lines:', out.split('\n').length);
process.exit((missing.length || leaked.length) ? 1 : 0);
