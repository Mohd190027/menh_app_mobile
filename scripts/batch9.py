#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ٩ — تحويل الموقع إلى تطبيق (PWA في الملف الواحد):
 • أيقونات ضمين مدمجة (data URI) + وسم favicon و apple-touch-icon
 • Manifest ديناميكي (Blob) — تثبيت كامل الشاشة على أندرويد/سطح المكتب
 • وسوم iOS: إضافة للشاشة الرئيسية بملء الشاشة مع أيقونة واسم ضمين
 • زر «📲 التطبيق» للزائر + بند تثبيت بقائمة الحساب + إرشادات لكل منصة
 • وضع standalone: هوامش النوتش + رسالة ترحيب
 • حفظ الجلسة/السلة/المفضلة في localStorage — سلوك تطبيق حقيقي
كل التعديلات على الملف المدمج مباشرة: download/dameen.html — لا ملف جديد"""
import io, sys

F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()
orig = len(s)
n_edits = 0

def rep(old, new, name, count=1):
    global s, n_edits
    c = s.count(old)
    if c != count:
        print('  ✗ [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    n_edits += 1
    print('  ✓ %s' % name)

ICONS = '/home/z/my-project/scripts/img/icons'
b64 = lambda k: io.open(ICONS + '/' + k + '.b64', encoding='utf-8').read().strip()
I192, I512, IMASK, IAPPLE = b64('icon192'), b64('icon512'), b64('mask512'), b64('apple180')

# ============================================================ E1: رأس الصفحة — وسوم التطبيق والأيقونات
rep(r'''<meta name="viewport" content="width=device-width, initial-scale=1.0">''',
r'''<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#1D4432">
<meta name="application-name" content="ضمين">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ضمين">
<meta name="format-detection" content="telephone=no">
<link rel="icon" type="image/png" sizes="192x192" href="data:image/png;base64,%s">
<link rel="apple-touch-icon" href="data:image/png;base64,%s">''' % (I192, IAPPLE),
'الرأس: وسوم التطبيق + الأيقونات')

# ============================================================ E2: CSS وضع التطبيق
rep(r'''#top .topin>.btn{margin-inline-start:auto}''',
r'''#top .topin>.btn{margin-inline-start:auto}

/* ===== وضع التطبيق ===== */
.appchip{white-space:nowrap}
html{overscroll-behavior-y:contain;-webkit-tap-highlight-color:transparent}
button{touch-action:manipulation}
img{-webkit-touch-callout:none}
@media(display-mode:standalone){
#top .topin{padding-top:max(10px,env(safe-area-inset-top))}
#toasts{top:calc(14px + env(safe-area-inset-top))}
.wrap{padding-bottom:max(110px,calc(110px + env(safe-area-inset-bottom)))}
}''',
'CSS: وضع التطبيق وزر التثبيت')

# ============================================================ E3: زر التطبيق في شريط الزائر
rep(r'''h=`<div class="topin">${brand}${sb}<button class="btn" onclick="openAuth()">تسجيل الدخول</button></div>`;''',
r'''h=`<div class="topin">${brand}${sb}<button class="btn" onclick="openAuth()">تسجيل الدخول</button>${instChip()}</div>`;''',
'شريط الزائر: زر 📲 التطبيق')

# ============================================================ E4: بند التثبيت في قائمة الحساب
rep(r'''<div class="it" onclick="go('account')">⚙️ حسابي وإعداداتي</div>''',
r'''${appMode()?'':'<div class="it" onclick="installApp()">📲 ثبّت التطبيق</div>'}
<div class="it" onclick="go('account')">⚙️ حسابي وإعداداتي</div>''',
'قائمة الحساب: بند التثبيت')

# ============================================================ E5: حفظ الحالة عند كل رسم
rep(r'''app.innerHTML=(R[VIEW.page]||pgHome)();
renderTop();renderFab();''',
r'''app.innerHTML=(R[VIEW.page]||pgHome)();
renderTop();renderFab();appSave();''',
'render: حفظ حالة التطبيق')

# ============================================================ E6: طبقة PWA + الاستعادة قبل الإقلاع
rep(r'''/* ================= الإقلاع ================= */
document.addEventListener('click',()=>document.querySelectorAll('.dd.open').forEach(d=>d.classList.remove('open')));
render();''',
r'''/* ================= وضع التطبيق (PWA) ================= */
const APPICONS={i192:'data:image/png;base64,%s',i512:'data:image/png;base64,%s',mask:'data:image/png;base64,%s'};
(function(){try{
const mf={name:'ضمين — تسوّق مضمون بثقة',short_name:'ضمين',
description:'منصة التجارة الإلكترونية السعودية بضمان مالي — مالك محجوز في خزنة مستقلة حتى ترضى',
dir:'rtl',lang:'ar',start_url:location.href.split('#')[0],scope:location.href.split('#')[0],
display:'standalone',orientation:'any',background_color:'#F6F2E9',theme_color:'#1D4432',
icons:[{src:APPICONS.i192,sizes:'192x192',type:'image/png',purpose:'any'},
{src:APPICONS.i512,sizes:'512x512',type:'image/png',purpose:'any'},
{src:APPICONS.mask,sizes:'512x512',type:'image/png',purpose:'maskable'}]};
const l=document.createElement('link');l.rel='manifest';
l.href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));
document.head.appendChild(l);
}catch(e){}})();
let DPROMPT=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();DPROMPT=e;if(document.querySelector('#top'))renderTop()});
function appMode(){return matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
function instChip(){return appMode()?'':'<button class="btn soft sm appchip" onclick="installApp()" title="ثبّت ضمين على جوالك">📲 التطبيق</button>'}
async function installApp(){
if(DPROMPT){DPROMPT.prompt();const ch=await DPROMPT.userChoice.catch(()=>null);DPROMPT=null;try{renderTop()}catch(e){}
if(ch&&ch.outcome==='accepted')toast('تم تثبيت تطبيق ضمين 🎉','ok');return}
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
toast(ios?'للتثبيت على الآيفون: زر المشاركة ⬆️ ثم «إضافة إلى الشاشة الرئيسية»':'للتثبيت على أندرويد: قائمة المتصفح ⋮ ثم «تثبيت التطبيق»','amb');
}
window.addEventListener('appinstalled',()=>{DPROMPT=null;toast('أهلاً بتطبيق ضمين على جهازك 📲💚','ok');try{renderTop()}catch(e){}});

/* ===== حفظ الجلسة والسلة والمفضلة — تجربة تطبيق حقيقي ===== */
function appSave(){try{localStorage.setItem('dameen_v1',JSON.stringify({ses:SES,cart:CART,gfav:GFav}))}catch(e){}}
function appRestore(){try{
const d=JSON.parse(localStorage.getItem('dameen_v1')||'null');if(!d)return;
if(d.ses&&d.ses.phone&&USERS[d.ses.phone]&&!USERS[d.ses.phone].pend&&!USERS[d.ses.phone].rejected){
const u=USERS[d.ses.phone];SES={phone:d.ses.phone,role:u.role,store:u.store||null};
if(SES.role==='merchant'){const own=STORES.find(x=>x.owner===SES.phone);SES.store=own?own.id:SES.store}}
CART=(d.cart||[]).filter(c=>c&&P(c.pid)&&c.qty>0).map(c=>({pid:c.pid,qty:Math.min(c.qty,P(c.pid).stock)}));
GFav=(d.gfav||[]).filter(x=>x&&P(x));
}catch(e){}}
appRestore();

/* ================= الإقلاع ================= */
document.addEventListener('click',()=>document.querySelectorAll('.dd.open').forEach(d=>d.classList.remove('open')));
render();
if(appMode())setTimeout(()=>toast('أهلاً بك في تطبيق ضمين 👋','ok'),1200);
window.addEventListener('beforeunload',appSave);
document.addEventListener('visibilitychange',()=>{if(document.hidden)appSave()});''' % (I192, I512, IMASK),
'طبقة PWA + حفظ/استعادة الجلسة')

# ============================================================ حفظ
io.open(F, 'w', encoding='utf-8').write(s)
print('\n✅ الدفعة ٩: %d تعديلاً — %d → %d حرفاً (+%.0fKB)' % (n_edits, orig, len(s), (len(s) - orig) / 1024))
