#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""نقل استوديو الوسائط من نموذج المنتج إلى صفحة مستقلة في قسم التاجر (m-media)
- الفورم: بطاقة توجيه بدل الاستوديو + انتقال تلقائي بعد إضافة منتج جديد
- صفحة جديدة: مختار منتج + نفس الاستوديو (صور/مقاطع/حدود) بحفظ فوري
- تعديل حفظ المنتج: لا يمس الوسائط عند التعديل، غلاف تلقائي عند الإنشاء
"""
import io

SRC = '/home/z/my-project/download/dameen.html'
html = io.open(SRC, encoding='utf-8').read()
orig = html

def rep(old, new, label):
    global html
    assert html.count(old) == 1, f'[{label}] تكرار/غياب: count={html.count(old)}'
    html = html.replace(old, new)
    print(f'  ✓ {label}')

# ═══ ١) إزالة تهيئة MIMGS/MVIDS و med من نموذج المنتج ═══
rep("""MPQOPEN=false;
MIMGS=p&&p.imgs?p.imgs.slice():[];
MVIDS=p&&p.vids?JSON.parse(JSON.stringify(p.vids)):[];
const med=medOf(s);
openModal(`<div class="mhead"><b>${p?'تعديل منتج':'منتج جديد'}</b>""",
"""MPQOPEN=false;
openModal(`<div class="mhead"><b>${p?'تعديل منتج':'منتج جديد'}</b>""", 'إزالة تهيئة الوسائط من الفورم')

# ═══ ٢) استبدال كتلة الاستوديو داخل الفورم ببطاقة توجيه ═══
rep("""<div class="mstudio mt">
<div class="mshead">
<div class="msttl"><span class="msic">🎬</span><div><b>استوديو الوسائط الترويجية</b><small>صور ومقاطع منتجك تظهر للعملاء في معرض متجرك وصفحة المنتج</small></div></div>
<div class="mschips" id="mschips">${msChipsHTML(med)}</div>
</div>
<div class="msbody">
<div id="mpimgs">${msImgsSec(med)}</div>
<div id="mpvids">${msVidsSec(med)}</div>
</div>
</div>
<button class="btn wide mt" onclick="mSaveProd('${pid||''}')">${p?'حفظ التعديلات':'إضافة المنتج'}</button>""",
"""<div class="acard mt" style="padding:12px 14px;display:flex;gap:11px;align-items:center;flex-wrap:wrap;background:#C9A2270D;border:1px dashed #C9A22755">
<span style="font-size:22px">🎬</span>
<div style="flex:1;min-width:180px"><b style="font-size:12.5px">صور ومقاطع المنتج الترويجية</b>
<div class="hint" style="margin-top:2px">${pid?`لديه ${ar((p.imgs||[]).length)} صورة و${ar((p.vids||[]).length)} مقطع — تُدار الآن من صفحة «استوديو الوسائط»`:'بعد إضافة المنتج ستنتقل تلقائياً إلى استوديو الوسائط لإضافة صوره ومقاطعه'}</div></div>
${pid?`<button class="btn sm" onclick="mStudioOpen('${pid}')">🎬 فتح الاستوديو</button>`:''}
</div>
<button class="btn wide mt" onclick="mSaveProd('${pid||''}')">${p?'حفظ التعديلات':'إضافة المنتج'}</button>""", 'بطاقة توجيه داخل الفورم')

# ═══ ٣) خريطة المسارات + رابط التنقل ═══
rep("'m-dash':pgMDash,'m-prods':pgMProds,'m-orders':pgMOrders,",
    "'m-dash':pgMDash,'m-prods':pgMProds,'m-media':pgMMedia,'m-orders':pgMOrders,", 'خريطة المسارات')
rep("${mnav('m-dash','📊 لوحة التحكم')}${mnav('m-prods','🧺 المنتجات')}",
    "${mnav('m-dash','📊 لوحة التحكم')}${mnav('m-prods','🧺 المنتجات')}${mnav('m-media','🎬 الوسائط')}", 'رابط التنقل')

# ═══ ٤) الصفحة الجديدة قبل mProdForm ═══
NEWPAGE = """/* ===== 🎬 استوديو الوسائط — صفحة مستقلة في قسم التاجر ===== */
let MSPID=null;
function mStudioOpen(pid){MSPID=pid||null;closeModal();go('m-media')}
function msSel(pid){MSPID=pid;render()}
function msSave(){
const p=MSPID?P(MSPID):null;if(!p)return;
const med=medOf(myStore());
p.imgs=MIMGS.slice(0,med.imgs);
p.vids=MVIDS.filter(v=>!v.bad).map(v=>({src:v.src,dur:Math.round(v.dur||0)}));
appSave();
}
function pgMMedia(){
const s=myStore(),med=medOf(s);
const ps=PRODUCTS.filter(p=>p.store===s.id);
if(!ps.length)return `<div class="pghead"><h1>🎬 استوديو الوسائط الترويجية</h1><button class="btn sm" onclick="mProdForm()">＋ منتج جديد</button></div>
<div class="empty"><div class="em">🎬</div><b>لا منتجات بعد في متجرك</b><span>أنشئ منتجك الأول من صفحة «المنتجات» ثم عُد هنا لإضافة صوره ومقاطعه الترويجية</span><button class="btn mt" onclick="go('m-prods')">🧺 الذهاب للمنتجات</button></div>`;
if(!MSPID||!P(MSPID)||P(MSPID).store!==s.id)MSPID=ps[0].id;
const cur=P(MSPID);
MIMGS=(cur.imgs||[]).slice();
MVIDS=(cur.vids||[]).map(v=>({src:v.src,dur:+v.dur||0,bad:false}));
const tImgs=ps.reduce((a,p)=>a+(p.imgs||[]).length,0),tVids=ps.reduce((a,p)=>a+(p.vids||[]).length,0),noV=ps.filter(p=>!(p.vids||[]).length).length;
return `<div class="pghead"><h1>🎬 استوديو الوسائط الترويجية</h1><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn gray sm" onclick="go('m-prods')">🧺 منتجاتي</button><button class="btn sm" onclick="mProdForm()">＋ منتج جديد</button></div></div>
<div class="kpis mb">
<div class="kpi grn"><i>🖼️</i><b>${ar(tImgs)}</b><span>صورة في متجرك</span></div>
<div class="kpi nvy"><i>🎬</i><b>${ar(tVids)}</b><span>مقطع ترويجي</span></div>
<div class="kpi amb"><i>🎛️</i><b>${ar(med.imgs)} · ${ar(med.vids)}</b><span>حدود الإدارة (صور · مقاطع)</span></div>
<div class="kpi red"><i>⏱️</i><b>${ar(med.secs)} ث</b><span>أقصى مدة للمقطع</span></div>
</div>
<div class="acard" style="display:flex;gap:11px;align-items:flex-end;flex-wrap:wrap;margin-bottom:14px">
<div class="fld" style="flex:1;min-width:230px;margin:0"><label>📦 اختر المنتج الذي تريد إدارة وسائطه</label>
<select class="inp" onchange="msSel(this.value)">
${ps.map(p=>`<option value="${p.id}" ${p.id===MSPID?'selected':''}>${esc(p.name)} — ${ar((p.imgs||[]).length)} صور · ${ar((p.vids||[]).length)} مقاطع</option>`).join('')}
</select></div>
<div class="hint" style="padding-bottom:9px">💾 كل إضافة أو حذف تُحفظ فورياً في «${esc(cur.name)}» — لا تحتاج زر حفظ</div>
</div>
<div class="mstudio">
<div class="mshead">
<div class="msttl"><span class="msic">🎬</span><div><b>وسائط «${esc(cur.name)}»</b><small>صور ومقاطع المنتج تظهر للعملاء في معرض متجرك وصفحة المنتج</small></div></div>
<div class="mschips" id="mschips">${msChipsHTML(med)}</div>
</div>
<div class="msbody">
<div id="mpimgs">${msImgsSec(med)}</div>
<div id="mpvids">${msVidsSec(med)}</div>
</div>
</div>
<p class="hint" style="margin-top:10px">🖼️ أول صورة هي الغلاف الرئيسي أمام العملاء · 🎬 المقطع الذي تتجاوز مدته حد الإدارة لا يُنشر للعملاء حتى تختصره أو تحذفه · 🎛️ الحدود تُحدَّث لحظياً من إعدادات الإدارة لمتجرك</p>`;
}
"""
rep("function mProdForm(pid){", NEWPAGE + "function mProdForm(pid){", 'إدراج صفحة الاستوديو')

# ═══ ٥) الحفظ الفوري في دوال التحرير ═══
rep("function mImgDel(i){MIMGS.splice(i,1);mpImgsRefresh(medOf(myStore()))}",
    "function mImgDel(i){MIMGS.splice(i,1);msSave();mpImgsRefresh(medOf(myStore()))}", 'حذف صورة يحفظ فورياً')
rep("MIMGS.push(rd.result);mpImgsRefresh(med);toast('أُضيفت الصورة ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')",
    "MIMGS.push(rd.result);msSave();mpImgsRefresh(med);toast('أُضيفت الصورة ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')", 'رفع صورة يحفظ فورياً')
rep("MIMGS.push(ZPOOL[Math.floor(Math.random()*ZPOOL.length)]);mpImgsRefresh(med);toast('أُضيفت صورة تلقائية ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')}",
    "MIMGS.push(ZPOOL[Math.floor(Math.random()*ZPOOL.length)]);msSave();mpImgsRefresh(med);toast('أُضيفت صورة تلقائية ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')}", 'صورة تلقائية يحفظ فورياً')
rep("function mVidDel(i){MVIDS.splice(i,1);mpVidsRefresh(medOf(myStore()))}",
    "function mVidDel(i){MVIDS.splice(i,1);msSave();mpVidsRefresh(medOf(myStore()))}", 'حذف مقطع يحفظ فورياً')
rep("""MVIDS.push({src:src.trim(),dur:0,bad:false});
mpVidsRefresh(med);
mVidProbe(MVIDS.length-1);""",
"""MVIDS.push({src:src.trim(),dur:0,bad:false});
msSave();
mpVidsRefresh(med);
mVidProbe(MVIDS.length-1);""", 'إضافة مقطع يحفظ فورياً')
rep("if(secs==null){v.dur=0;v.bad=false;mpVidsRefresh(med);toast('تعذّر قراءة المدة تلقائياً — تأكد من رابط MP4 مباشر، ويُسمح بالحفظ وتبقى المدة غير محددة','amb');return}",
    "if(secs==null){v.dur=0;v.bad=false;msSave();mpVidsRefresh(med);toast('تعذّر قراءة المدة تلقائياً — تأكد من رابط MP4 مباشر، ويُسمح بالحفظ وتبقى المدة غير محددة','amb');return}", 'كشف مدة (تعذّر) يحفظ')
rep("if(secs>med.secs+0.5){v.bad=true;mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' تتجاوز حد الإدارة '+ar(med.secs)+' ثانية — اختصر المقطع أو احذفه','err');return}",
    "if(secs>med.secs+0.5){v.bad=true;msSave();mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' تتجاوز حد الإدارة '+ar(med.secs)+' ثانية — اختصر المقطع أو احذفه','err');return}", 'كشف مدة (تجاوز) يحفظ')
rep("v.bad=false;mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' — ضمن الحد ✓','ok');",
    "v.bad=false;msSave();mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' — ضمن الحد ✓','ok');", 'كشف مدة (سليم) يحفظ')

# ═══ ٦) mSaveProd: لا يمس الوسائط عند التعديل ═══
rep("""const tempv=$('#mp-temp')?$('#mp-temp').value:'std';
const med=medOf(s);
if(MVIDS.length>med.vids){toast('عدد المقاطع ('+ar(MVIDS.length)+') يتجاوز حد الإدارة '+ar(med.vids)+' — احذف الزائد','err');return}
if(MVIDS.some(v=>v.bad)){toast('في مقاطع تتجاوز مدتها حد الإدارة '+ar(med.secs)+' ثانية — اختصرها أو احذفها','err');return}
let imgs=MIMGS.slice(0,med.imgs);
if(!imgs.length)imgs=[ZPOOL[Math.floor(Math.random()*ZPOOL.length)]];
if(dPts!==0){""",
"""const tempv=$('#mp-temp')?$('#mp-temp').value:'std';
if(dPts!==0){""", 'حفظ المنتج: إزالة فحوص الوسائط')
rep("""p.imgs=imgs;p.vids=MVIDS.map(v=>({src:v.src,dur:Math.round(v.dur||0)}));
toast('حُفظ تعديل المنتج ✓'""",
"""toast('حُفظ تعديل المنتج ✓'""", 'تعديل المنتج لا يمس وسائطه')
rep("rc:0,imgs:imgs,vids:MVIDS.map(v=>({src:v.src,dur:Math.round(v.dur||0)})),temp:tempv,",
    "rc:0,imgs:[ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],vids:[],temp:tempv,", 'منتج جديد: غلاف تلقائي وبلا مقاطع')
rep("toast('أُضيف المنتج لمتجرك ✓'+(pts?` — خُصمت ${money(cost)} تمويل ${ar(pts)} نقطة`:''),'ok')}",
    "toast('أُضيف المنتج لمتجرك ✓ — أضف صوره ومقاطعه من استوديو الوسائط 🎬'+(pts?` — خُصمت ${money(cost)} تمويل ${ar(pts)} نقطة`:''),'ok')}", 'رسالة إضافة تشير للاستوديو')
rep("""MPID=null;closeModal();render();
}
/* ===== العروض بنسبة حرة ===== */""",
"""MPID=null;
if(pid){closeModal();render()}
else{MSPID=PRODUCTS[0].id;closeModal();go('m-media')}
}
/* ===== العروض بنسبة حرة ===== */""", 'منتج جديد ينتقل تلقائياً للاستوديو')

# ═══ ٧) صفحة المنتجات: زر استوديو في الرأس + زر وسائط لكل بطاقة ═══
rep("""<div class="pghead"><h1>🧺 منتجاتي (${ar(ps.length)})</h1><button class="btn sm" onclick="mProdForm()">＋ منتج جديد</button></div>""",
"""<div class="pghead"><h1>🧺 منتجاتي (${ar(ps.length)})</h1><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn soft sm" onclick="mStudioOpen()">🎬 استوديو الوسائط</button><button class="btn sm" onclick="mProdForm()">＋ منتج جديد</button></div></div>""", 'زر الاستوديو في رأس صفحة المنتجات')
rep("<button class=\"btn gray xs\" onclick=\"mProdForm('${p.id}')\">✏️ تعديل</button>",
    "<button class=\"btn gray xs\" onclick=\"mStudioOpen('${p.id}')\">🎬 وسائط</button><button class=\"btn gray xs\" onclick=\"mProdForm('${p.id}')\">✏️ تعديل</button>", 'زر وسائط على بطاقة كل منتج')

io.open(SRC, 'w', encoding='utf-8').write(html)
print(f'════ تم: {len(orig)} → {len(html)} بايت (+{len(html)-len(orig)})')
