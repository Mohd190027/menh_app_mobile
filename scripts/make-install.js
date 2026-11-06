#!/usr/bin/env node
/* توليد src/dameen/install.ts من dameen.js (٣٠٧٨-٣١٠١) حرفياً:
 * APPICONS + المانيفست + beforeinstallprompt + appMode + installApp + appinstalled
 * instChip سُقطت (زرها حُذف في المهمة ١٧ — كود ميت) */
const fs = require('fs');
const lines = fs.readFileSync('/home/z/my-project/public/dameen/dameen.js', 'utf8').split('\n');
const verbatim = (a, b, transform) => {
  const out = [];
  for (let n = a; n <= b; n++) out.push(transform ? transform(lines[n - 1], n) : lines[n - 1]);
  return out;
};
const out = [];
out.push("'use client';");
out.push('/* ضمين — install.ts: أيقونات + مانيفست + تثبيت التطبيق — حرفياً من dameen.js (٣٠٧٨-٣١٠١) */');
out.push("import { toast } from './core';");
out.push("import { renderTop } from './store';");
out.push('');
out.push('/* APPICONS + المانيفست الديناميكي (٣٠٧٨-٣١٠٠) — يُنفَّذ مرة عند الإقلاع */');
out.push('export function initInstall(){');
out.push("if(typeof document==='undefined')return;");
out.push(...verbatim(3078, 3090));
out.push('}');
out.push('');
out.push(...verbatim(3091, 3093).map(l =>
  l.replace(/^let DPROMPT/, 'export let DPROMPT').replace(/^function appMode/, 'export function appMode').replace('window.navigator.standalone','(window.navigator as any).standalone')));
out.push(...verbatim(3095, 3100).map((l, i) => i === 0 ? l.replace(/^async function installApp/, 'export async function installApp') : l));
out.push('');
out.push(...verbatim(3101, 3101));
fs.writeFileSync('/home/z/my-project/src/dameen/install.ts', out.join('\n') + '\n');

// فحص
const t = fs.readFileSync('/home/z/my-project/src/dameen/install.ts', 'utf8');
const checks = ['APPICONS', 'manifest', 'beforeinstallprompt', 'export let DPROMPT', 'export function appMode', 'export async function installApp', 'appinstalled'];
console.log('missing:', checks.filter(c => !t.includes(c)) .length ? checks.filter(c => !t.includes(c)) : 'NONE ✓');
console.log('lines:', t.split('\n').length);
