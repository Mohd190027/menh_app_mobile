#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ٨ — واجهة المتجر قبل/بعد الدخول:
 1) حذف البحث من أعلى الصفحة الرئيسية (يظهر داخل الأقسام)
 2) شريط دائري احترافي بصور منتجات حقيقية يتحرك بلا نهاية
 3) بطاقات الأقسام أكبر بتصميم فاخر + صورة حقيقية لكل قسم
 4) حذف «الأكثر مبيعاً في ضمين» والمنتجات تحتها
 5) بطاقات متاجر كبيرة وجميلة في صفحة القسم (نفسها قبل وبعد الدخول)
 6) صور حقيقية لكل المنتجات والأدلة
كل التعديلات على الملف المدمج مباشرة: download/dameen.html — لا ملف جديد"""
import io, sys, json

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

M = json.load(open('/home/z/my-project/scripts/img/map.json'))
U = lambda k, i=0: (M[k][i] if i < len(M[k]) else M[k][0])

# ============================================================ E1: CSS الشريط الدائري الجديد
rep(r'''.bubzone{margin:16px 0 2px}
.bubzone .lbl{display:flex;align-items:center;gap:9px;font-size:11.5px;font-weight:700;color:var(--mut);margin-bottom:8px}
.bubzone .lbl::after{content:'';flex:1;height:1px;background:var(--line)}
.bubzone .lbl .dot{width:7px;height:7px;border-radius:50%;background:var(--amb);animation:pulse 1.6s infinite}
.bubzone .lbl .sw{margin-inline-start:auto;display:flex;gap:5px}
.bubzone .lbl .sw i{width:6px;height:6px;border-radius:50%;background:var(--line);transition:.3s}
.bubzone .lbl .sw i.on{background:var(--amb);width:18px;border-radius:9px}''',
r'''.bubzone{margin:20px 0 4px}
.bubzone .lbl{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:800;color:var(--mut);margin-bottom:10px}
.bubzone .lbl::after{content:'';flex:1;height:1px;background:var(--line)}
.bubzone .lbl .dot{width:8px;height:8px;border-radius:50%;background:var(--amb);box-shadow:0 0 0 4px #B07E2B26;animation:pulse 1.6s infinite}''',
'CSS: تسمية الشريط الدائري')

rep(r'''.bubwrap{overflow:hidden;padding:7px 0 5px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.bubtrack{display:flex;gap:26px;width:max-content;animation:bmove 48s linear infinite}
.bubwrap:hover .bubtrack{animation-play-state:paused}
@keyframes bmove{to{transform:translateX(50%)}}
.bub{display:flex;flex-direction:column;align-items:center;gap:7px;width:94px;cursor:pointer}
.bub .ring{width:82px;height:82px;border-radius:50%;padding:3px;background:var(--c,#1D4432);transition:.25s;box-shadow:0 5px 14px rgba(0,0,0,.12)}
.bub:hover .ring{transform:scale(1.08) translateY(-2px)}
.bub .ring>div{width:100%;height:100%;border-radius:50%;overflow:hidden;border:2.5px solid #fff}
.bub img{width:100%;height:100%;object-fit:cover}
.bub b{font-size:10.5px;font-weight:600;line-height:1.35;text-align:center;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;max-width:94px}
.bub span{font-size:10.5px;font-weight:800;color:var(--grn);font-family:Alexandria}''',
r'''.bubwrap{overflow:hidden;padding:18px 0 8px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.bubtrack{display:flex;gap:36px;width:max-content;animation:bmove 58s linear infinite}
.bubwrap:hover .bubtrack{animation-play-state:paused}
@keyframes bmove{to{transform:translateX(50%)}}
.bub{display:flex;flex-direction:column;align-items:center;gap:9px;width:126px;cursor:pointer}
.bub .ring{width:112px;height:112px;border-radius:50%;padding:4px;background:conic-gradient(from 210deg,var(--c,#1D4432) 0%,#B07E2B 28%,var(--c,#1D4432) 52%,#E8D5A8 76%,var(--c,#1D4432) 100%);transition:.3s;box-shadow:0 10px 26px rgba(0,0,0,.15)}
.bub:hover .ring{transform:scale(1.09) translateY(-3px);box-shadow:0 18px 38px rgba(0,0,0,.22)}
.bub .ring>div{width:100%;height:100%;border-radius:50%;overflow:hidden;border:3px solid #fff;background:#F6F2E9;animation:bfloat 5.4s ease-in-out infinite;animation-delay:var(--d,0s)}
.bub img{width:100%;height:100%;object-fit:cover;transition:.45s}
.bub:hover img{transform:scale(1.1)}
.bub b{font-size:11.5px;font-weight:700;line-height:1.4;text-align:center;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;max-width:126px}
.bub span{font-size:12px;font-weight:800;color:var(--grn);font-family:Alexandria;background:#1D44320F;padding:2.5px 11px;border-radius:99px}
@keyframes bfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}''',
'CSS: فقاعات دائرية فاخرة بحركة طفو')

# ============================================================ E2: CSS بطاقات الأقسام الكبيرة بالصور
rep(r'''.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.tri{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 14px;cursor:pointer;transition:.22s;position:relative;overflow:hidden}
.tri::before{content:'';position:absolute;inset-inline-start:0;top:0;bottom:0;width:4px;background:var(--c)}
.tri:hover{transform:translateY(-3px);box-shadow:var(--sh);border-color:var(--c)}
.tri .ic{width:46px;height:46px;border-radius:14px;background:var(--c);display:grid;place-items:center;font-size:21px;flex-shrink:0;color:#fff}
.tri .tx b{display:block;font-family:Alexandria;font-size:14px;font-weight:700;line-height:1.4}
.tri .tx span{font-size:10.5px;color:var(--mut);display:block;line-height:1.5}
.tri .win{margin-inline-start:auto;flex-shrink:0;text-align:center;background:var(--c)14;border:1px dashed var(--c)88;padding:5px 10px;border-radius:11px}
.tri .win i{display:block;font-style:normal;font-size:9px;color:var(--mut);line-height:1.3}
.tri .win b{font-size:11px;color:var(--c);font-family:Alexandria;font-weight:700}''',
r'''.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:4px}
.tri{position:relative;height:252px;border-radius:22px;overflow:hidden;cursor:pointer;box-shadow:var(--sh);transition:.3s;background:#EDE7DA}
.tri .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:.65s}
.tri:hover .bg{transform:scale(1.09)}
.tri .shade{position:absolute;inset:0;background:linear-gradient(180deg,#0000001A 0%,#00000024 38%,#000000A6 72%,#000000C4 100%);transition:.3s}
.tri:hover .shade{background:linear-gradient(180deg,#00000026 0%,#00000030 38%,#000000B4 72%,#000000D2 100%)}
.tri .win{position:absolute;top:14px;inset-inline-end:14px;background:#FFFFFFE8;backdrop-filter:blur(6px);border:1px solid #FFFFFFAA;border-radius:12px;padding:5px 12px;text-align:center}
.tri .win i{display:block;font-style:normal;font-size:9.5px;color:var(--mut);line-height:1.4}
.tri .win b{font-size:12.5px;color:var(--c);font-family:Alexandria;font-weight:800}
.tri .body{position:absolute;inset-inline:0;bottom:0;padding:16px 17px;color:#fff;display:flex;align-items:flex-end;gap:12px}
.tri .ic{width:52px;height:52px;border-radius:16px;background:#FFFFFF2B;backdrop-filter:blur(9px);display:grid;place-items:center;font-size:25px;border:1px solid #FFFFFF55;flex-shrink:0}
.tri .tx b{display:block;font-family:Alexandria;font-size:17.5px;font-weight:800;line-height:1.35;text-shadow:0 2px 14px #0007}
.tri .tx span{font-size:11.5px;opacity:.95;display:block;line-height:1.6;margin-top:4px;text-shadow:0 1px 8px #0006}
.tri .tx .stx{display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-top:8px}
.tri .tx .stx em{font-style:normal;font-size:10.5px;font-weight:800;background:#FFFFFF2B;border:1px solid #FFFFFF40;padding:3px 10px;border-radius:99px;backdrop-filter:blur(6px)}
.tri:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(0,0,0,.2)}''',
'CSS: بطاقات أقسام كبيرة بصور')

# ============================================================ E3: CSS بطاقات المتاجر الكبيرة + محاذاة الشريط العلوي
rep(r'''.topin{max-width:1180px;margin:auto;display:flex;align-items:center;gap:11px;padding:10px 20px}''',
r'''.topin{max-width:1180px;margin:auto;display:flex;align-items:center;gap:11px;padding:10px 20px}
#top .nav{margin-inline-start:auto}
#top .topin>.btn{margin-inline-start:auto}''',
'CSS: دفع القائمة/الزر لليمين بلا بحث')

rep(r'''.mstore .mr{font-size:10px;color:var(--mut);display:flex;gap:7px;align-items:center;white-space:nowrap}''',
r'''.mstore .mr{font-size:10px;color:var(--mut);display:flex;gap:7px;align-items:center;white-space:nowrap}

/* ===== بطاقات المتاجر الكبيرة ===== */
.storegrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(252px,1fr));gap:15px}
.bigstore{position:relative;border-radius:20px;overflow:hidden;background:var(--card);border:1px solid var(--line);cursor:pointer;transition:.28s}
.bigstore:hover{transform:translateY(-5px);box-shadow:0 18px 42px rgba(0,0,0,.14);border-color:var(--c)}
.bigstore .cov{height:132px;position:relative;overflow:hidden;background:#EDE7DA}
.bigstore .cov img{width:100%;height:100%;object-fit:cover;transition:.55s}
.bigstore:hover .cov img{transform:scale(1.08)}
.bigstore .cov .tint{position:absolute;inset:0;background:linear-gradient(180deg,#00000000 35%,var(--c)D9 100%)}
.bigstore .winb{position:absolute;top:11px;inset-inline-end:11px;background:#FFFFFFEB;backdrop-filter:blur(6px);border:1px solid var(--c)30;border-radius:99px;padding:4px 11px;font-size:10px;font-weight:800;color:var(--c)}
.bigstore .info{padding:0 15px 15px}
.bigstore .lg{width:56px;height:56px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-family:Alexandria;font-weight:800;font-size:21px;border:3.5px solid #fff;margin-top:-31px;position:relative;box-shadow:0 7px 18px rgba(0,0,0,.2);overflow:hidden}
.bigstore h3{font-family:Alexandria;font-size:15px;font-weight:800;margin:9px 0 3px}
.bigstore .desc{font-size:11px;color:var(--mut);line-height:1.65;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px}
.bigstore .meta{display:flex;flex-wrap:wrap;gap:4px 13px;font-size:10.5px;color:var(--mut);margin:9px 0 12px}
.bigstore .meta b{color:var(--amb2);font-family:Alexandria}
.bigstore .vst{display:flex;align-items:center;justify-content:center;gap:7px;padding:9.5px;border-radius:12px;background:var(--c)12;color:var(--c);font-weight:800;font-size:12.5px;transition:.22s}
.bigstore:hover .vst{background:var(--c);color:#fff}''',
'CSS: بطاقات المتاجر الكبيرة')

# ============================================================ E4: CSS الجوال
rep(r'''.trio{grid-template-columns:1fr;gap:9px}.how{grid-template-columns:1fr;gap:9px}''',
r'''.trio{grid-template-columns:1fr;gap:13px}.tri{height:212px}.how{grid-template-columns:1fr;gap:9px}.storegrid{grid-template-columns:1fr 1fr;gap:11px}''',
'CSS جوال 940: أقسام ومتاجر')

rep(r'''.wrap{padding:14px 14px 110px}''',
r'''.wrap{padding:14px 14px 110px}
.storegrid{grid-template-columns:1fr}
.bub{width:106px}.bub .ring{width:94px;height:94px}.bubtrack{gap:26px}''',
'CSS جوال 640: متاجر وفقاعات')

# ============================================================ E5: البحث السياقي في الشريط العلوي
rep(r'''const sbox=`<div class="sbox"><input id="sq" placeholder="ابحث عن منتج أو متجر…" value="${esc(VIEW.q||'')}" onkeydown="if(event.key==='Enter')searchGo()"><span class="si">🔎</span></div>`;''',
r'''const sbox=`<div class="sbox"><input id="sq" placeholder="ابحث عن منتج أو متجر…" value="${esc(VIEW.q||'')}" onkeydown="if(event.key==='Enter')searchGo()"><span class="si">🔎</span></div>`;
const sb=VIEW.page==='home'?'':sbox;''',
'renderTop: متغير البحث السياقي')

rep(r'''if(!SES){ /* زائر: الاسم + البحث + الدخول فقط */
h=`<div class="topin">${brand}${sbox}<button class="btn" onclick="openAuth()">تسجيل الدخول</button></div>`;''',
r'''if(!SES){ /* زائر: الرئيسية نظيفة بلا بحث — البحث يظهر داخل الأقسام والمتاجر */
h=`<div class="topin">${brand}${sb}<button class="btn" onclick="openAuth()">تسجيل الدخول</button></div>`;''',
'renderTop: زائر بلا بحث بالرئيسية')

rep(r'''<div class="topin">${brand}${sbox}<nav class="nav">''',
r'''<div class="topin">${brand}${sb}<nav class="nav">''',
'renderTop: تاجر/إدارة/عميل — بحث سياقي', count=3)

# ============================================================ E6: صور الأقسام الحقيقية
rep(r'''{id:'fashion',name:'عالم الأزياء والجمال',icon:'👗',color:'#7A3B44',winMin:120,win:'ساعتان',desc:'عبايات وأزياء وعطور وعناية بلمسة محلية'},''',
r'''{id:'fashion',name:'عالم الأزياء والجمال',icon:'👗',color:'#7A3B44',winMin:120,win:'ساعتان',desc:'عبايات وأزياء وعطور وعناية بلمسة محلية',img:'%s'},''' % U('secfash'),
'قسم الأزياء: صورة حقيقية')

rep(r'''{id:'family',name:'عالم المأكولات والضيافة',icon:'🏡',color:'#556636',winMin:30,win:'٣٠ دقيقة',desc:'عسل وتمور وأطباق مطابخ وحلويات طازجة'},''',
r'''{id:'family',name:'عالم المأكولات والضيافة',icon:'🏡',color:'#556636',winMin:30,win:'٣٠ دقيقة',desc:'عسل وتمور وأطباق مطابخ وحلويات طازجة',img:'%s'},''' % U('secfood'),
'قسم المأكولات: صورة حقيقية')

rep(r'''{id:'deco',name:'عالم الهدايا والديكور والمناسبات',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'هدايا وديكور وتنسيق مناسبات ميداني'}];''',
r'''{id:'deco',name:'عالم الهدايا والديكور والمناسبات',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'هدايا وديكور وتنسيق مناسبات ميداني',img:'%s'}];''' % U('secgift'),
'قسم الهدايا والديكور: صورة حقيقية')

# ============================================================ E7: أغلفة المتاجر الحقيقية
COVERS = {
 's1': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=760&auto=format&fit=crop',
 's2': U('p4b'), 's3': U('p8a'), 's4': U('p12'), 's5': U('p16'),
 's6': U('p19a'), 's7': U('p21'), 's8': U('p22'),
}
OWN = {'s1': "owner:'0500000002',color:'#7A3B44'", 's2': "owner:'0500000004',color:'#96505E'",
       's3': "owner:'0500000005',color:'#556636'", 's4': "owner:'0500000006',color:'#6B7A3F'",
       's5': "owner:'0500000007',color:'#A45A3A'", 's6': "owner:'0500000008',color:'#B26640'",
       's7': "owner:'0500000009',color:'#8F5B36'", 's8': "owner:'0500000010',color:'#7C5A3A'"}
for sid in ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']:
    rep(OWN[sid], OWN[sid] + ",cover:'%s'" % COVERS[sid], 'غلاف حقيقي: ' + sid)

# ============================================================ E8: صور المنتجات الحقيقية (إحلال PICS)
PICS_MAP = {
 'طقم-بيتي': U('p4a'), 'قطن-مطرز': U('p4b'), 'فستان-سهرة': U('p5'),
 'عسل-سدر': U('p8a'), 'برطمان-عسل': U('p8b'), 'تمر-خلاص': U('p9'),
 'دبس-تمر': U('p10'), 'سلة-هدايا-عسل': U('p11'), 'سدو-مفرش': U('p12'),
 'حزام-سدو': U('p13'), 'جبن-قريش': U('p14'), 'خبز-تميس': U('p15'),
 'شمعة-ياسمين': U('p16'), 'مبخرة-نحاس': U('p17'), 'فناجيل-قهوة': U('p18'),
 'بوكس-هدايا': U('p19a'), 'لوحة-خط': U('p20'), 'مزهرية-فخار': U('p21'),
 'كيكة-العيد': U('p22'), 'ورق-عنب': U('p23'), 'تنسيق-طاولة': U('p24'),
 'دليل-لون': U('p19b'), 'دليل-سدو': U('p12', 1),
}
for k, v in sorted(PICS_MAP.items()):
    rep("PICS('%s')" % k, "'%s'" % v, 'صورة حقيقية: ' + k)

# ============================================================ E9: مجمّع صور حقيقي للمنتجات الجديدة
rep(r'''const PICS=(s)=>'https://picsum.photos/seed/'+encodeURIComponent(s)+'/760/760';''',
r'''const PICS=(s)=>'https://picsum.photos/seed/'+encodeURIComponent(s)+'/760/760';
const ZPOOL=[%s];''' % ','.join("'%s'" % U(k) for k in sorted(M.keys())),
'ZPOOL: مجمّع الصور الحقيقية')

rep(r'''function mAutoImg(){MIMG=PICS('منتج-'+Math.floor(Math.random()*99));''',
r'''function mAutoImg(){MIMG=ZPOOL[Math.floor(Math.random()*ZPOOL.length)];''',
'mAutoImg: صورة تلقائية حقيقية')

rep(r'''imgs:[MIMG||PICS('منتج-'+pr)]''',
r'''imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]]''',
'منتج جديد: صورة احتياطية حقيقية')

# ============================================================ E10: pgHome — شريط دائري + أقسام كبيرة + حذف الأكثر مبيعاً
rep(r'''const bubs=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,12);
const best=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,8);
const track=bubs.map(p=>{const sec=secOf(p.store);
return `<div class="bub" style="--c:${sec.color}" onclick="go('product','${p.id}')">
<div class="ring"><div>${imgTag(p.imgs[0],'','')}</div></div><b>${esc(p.name)}</b><span>${ard(eff(p))} ر.س</span></div>`}).join('');''',
r'''const bubs=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,12);
let fi=0;
const track=bubs.map(p=>{const sec=secOf(p.store);
return `<div class="bub" style="--c:${sec.color}" onclick="go('product','${p.id}')">
<div class="ring"><div style="--d:${(fi++*0.55).toFixed(2)}s">${imgTag(p.imgs[0],'','')}</div></div><b>${esc(p.name)}</b><span>${ard(eff(p))} ر.س</span></div>`}).join('');''',
'pgHome: فقاعات بتتابع طفو متدرج')

rep(r'''<div class="bubzone"><div class="lbl"><span class="dot"></span> يتحرك الآن بين المتاجر — انقر أي منتج${''} <span class="sw"><i class="on"></i><i></i><i></i></span></div>
<div class="bubwrap"><div class="bubtrack">${track}${track}</div></div></div>''',
r'''<div class="bubzone"><div class="lbl"><span class="dot"></span> يتجدّد الآن بين متاجر ضمين — انقر أي منتج لتفاصيله</div>
<div class="bubwrap"><div class="bubtrack">${track}${track}</div></div></div>''',
'pgHome: تسمية الشريط الجديدة')

rep(r'''<div class="secthead"><h2>الأقسام الثلاثة</h2><div class="ln"></div><span class="hint">اختر قسمك وابدأ بضمان</span></div>
<div class="trio">${SECTIONS.map(s=>{
const sts=STORES.filter(x=>x.sec===s.id&&stOK(x)).length;
const prs=PRODUCTS.filter(p=>SEC(ST(p.store).sec).id===s.id&&stOK(ST(p.store))).length;
return `<div class="tri" style="--c:${s.color}" onclick="go('section','${s.id}')">
<div class="ic">${s.icon}</div>
<div class="tx"><b>${s.name}</b><span>${ars(sts)} متاجر · ${ars(prs)} منتج</span></div>
<div class="win"><i>نافذة الحماية</i><b>${s.win}</b></div></div>`}).join('')}</div>''',
r'''<div class="secthead"><h2>عوالم ضمين الثلاثة</h2><div class="ln"></div><span class="hint">اختر عالمك وابدأ بضمان</span></div>
<div class="trio">${SECTIONS.map(s=>{
const sts=STORES.filter(x=>x.sec===s.id&&stOK(x)).length;
const prs=PRODUCTS.filter(p=>SEC(ST(p.store).sec).id===s.id&&stOK(ST(p.store))).length;
return `<div class="tri" style="--c:${s.color}" onclick="go('section','${s.id}')">
<img class="bg" src="${s.img}" alt="${esc(s.name)}" loading="lazy" onerror="this.style.display='none'">
<div class="shade"></div>
<div class="win"><i>🛡️ نافذة الحماية</i><b>${s.win}</b></div>
<div class="body"><div class="ic">${s.icon}</div><div class="tx"><b>${s.name}</b><span>${s.desc}</span><div class="stx"><em>${ars(sts)} متاجر</em><em>${ars(prs)} منتج</em><em>تسوّق الآن ←</em></div></div></div></div>`}).join('')}</div>''',
'pgHome: بطاقات أقسام كبيرة بالصور')

rep(r'''<div class="secthead"><h2>الأكثر مبيعاً في ضمين</h2><div class="ln"></div><span class="more" onclick="go('section','${best[0]?secOf(best[0].store).id:'fashion'}')">تصفّح الأقسام ←</span></div>
<div class="pgrid">${best.map(pcard).join('')}</div>

''',
'',
'pgHome: حذف الأكثر مبيعاً')

# ============================================================ E11: صفحة القسم — متاجر كبيرة + خلفية العنوان
rep(r'''<div class="sechero" style="--acc:${sec.color}">
<div class="ic">${sec.icon}</div>
<div style="flex:1"><h1>${sec.name}</h1><p>${sec.desc} — ${ars(stores.length)} متاجر موثوقة بنفس القسم</p></div>
<div class="winb">🛡️ نافذة الحماية: ${sec.win}</div>
</div>
<div class="secthead"><h2>متاجر القسم</h2><div class="ln"></div></div>
<div class="ministores">${stores.map(mstore).join('')}</div>''',
r'''<div class="sechero" style="--acc:${sec.color};background-image:linear-gradient(115deg,${sec.color}F2 0%,${sec.color}C9 55%,${sec.color}9C 100%),url('${sec.img}');background-size:cover;background-position:center">
<div class="ic">${sec.icon}</div>
<div style="flex:1"><h1>${sec.name}</h1><p>${sec.desc} — ${ars(stores.length)} متاجر موثوقة بنفس القسم</p></div>
<div class="winb">🛡️ نافذة الحماية: ${sec.win}</div>
</div>
<div class="secthead"><h2>متاجر القسم</h2><div class="ln"></div></div>
<div class="storegrid">${stores.map(bigstore).join('')}</div>''',
'pgSection: خلفية بالصورة + متاجر كبيرة')

# ============================================================ E12: دالة بطاقة المتجر الكبيرة
rep(r'''function mstore(s){
const n=PRODUCTS.filter(p=>p.store===s.id).length;
return `<div class="mstore" style="--c:${s.color}" onclick="go('store','${s.id}')">
<div class="lg">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:s.name[0]}</div>
<div><b>${esc(s.name)}</b><span class="mr">★ ${ard(s.rt)} · 📍 ${esc(s.city||'')} · ${ar(n)} منتج${n>4?'':' جديد'}</span></div></div>`;
}''',
r'''function mstore(s){
const n=PRODUCTS.filter(p=>p.store===s.id).length;
return `<div class="mstore" style="--c:${s.color}" onclick="go('store','${s.id}')">
<div class="lg">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:s.name[0]}</div>
<div><b>${esc(s.name)}</b><span class="mr">★ ${ard(s.rt)} · 📍 ${esc(s.city||'')} · ${ar(n)} منتج${n>4?'':' جديد'}</span></div></div>`;
}
function bigstore(s){
const sec=SEC(s.sec);const n=PRODUCTS.filter(p=>p.store===s.id).length;
return `<div class="bigstore" style="--c:${s.color}" onclick="go('store','${s.id}')">
<div class="cov"><img src="${s.cover||sec.img}" alt="${esc(s.name)}" loading="lazy" onerror="this.onerror=null;this.src='${sec.img}'"><div class="tint"></div><span class="winb">🛡️ حماية ${sec.win}</span></div>
<div class="info">
<div class="lg">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:s.name[0]}</div>
<h3>${esc(s.name)}</h3>
<div class="desc">${esc(s.desc)}</div>
<div class="meta"><span>★ <b>${ard(s.rt)}</b> تقييم</span><span>📍 ${esc(s.city||'—')}</span><span>🧺 <b>${ar(n)}</b> منتج</span><span>🛒 ${ars(s.sales)} طلباً</span></div>
<div class="vst">🚪 زيارة المتجر</div>
</div></div>`;
}''',
'bigstore: بطاقة المتجر الكبيرة')

# ============================================================ حفظ
io.open(F, 'w', encoding='utf-8').write(s)
print('\n✅ الدفعة ٨: %d تعديلاً — %d → %d حرفاً' % (n_edits, orig, len(s)))
