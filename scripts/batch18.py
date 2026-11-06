#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""التعديلان ١ و٢ (طلب 2026-11-06):
١) إعادة تصميم فورم المقاطع والصور الترويجية للمنتج (استوديو وسائط أنيق)
٢) تصغير بطاقة العدّاد المجتمعي في الرئيسية وتحويلها لشريط مضغوط أنيق + نافذة تفاصيل
"""
import io

SRC = '/home/z/my-project/download/dameen.html'
h = io.open(SRC, encoding='utf-8').read()
orig_len = len(h)

def rep(old, new, label):
    global h
    c = h.count(old)
    assert c == 1, 'FAIL [%s]: count=%d' % (label, c)
    h = h.replace(old, new)
    print('OK  ' + label)

# ═══════════ ١) بطاقة العدّاد المجتمعي — CSS مضغوط ═══════════
rep("""/* ===== 🌟 العدّاد المجتمعي الشفاف ===== */
.impwrap{position:relative;margin-top:16px;border-radius:22px;padding:21px 20px 17px;background:linear-gradient(135deg,#1D4432 0%,#2E6B4F 62%,#24573F 100%);color:#F6F2E9;overflow:hidden;box-shadow:0 12px 30px rgba(29,68,50,.28)}
.impwrap:before{content:'';position:absolute;inset-inline-start:-40px;top:-46px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,#C9A22733,transparent 70%)}
.impwrap:after{content:'';position:absolute;inset-inline-end:-34px;bottom:-56px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,#EBDCA826,transparent 70%)}
.implbl{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#EBDCA8;letter-spacing:.2px;position:relative;z-index:1}
.impnum{display:flex;align-items:baseline;gap:8px;margin:8px 0 5px;position:relative;z-index:1}
.impnum span{font-family:Alexandria,system-ui;font-size:46px;font-weight:800;line-height:1;text-shadow:0 2px 14px rgba(201,162,39,.4)}
.impnum small{font-size:14px;font-weight:700;color:#EBDCA8}
.improw{display:flex;gap:13px;flex-wrap:wrap;font-size:11.5px;font-weight:700;color:#E9E4D2;position:relative;z-index:1}
.improw b{color:#EBDCA8}
.impwrap p{position:relative;z-index:1;margin-top:9px;font-size:11px;line-height:1.85;color:#E4E9DD;opacity:.96;max-width:600px}""",
"""/* ===== 🌟 العدّاد المجتمعي الشفاف — شريط مضغوط أنيق ===== */
.impbar{display:flex;align-items:center;gap:12px;width:100%;margin-top:14px;border:0;border-radius:16px;padding:10px 14px;background:linear-gradient(135deg,#1D4432 0%,#2E6B4F 62%,#24573F 100%);color:#F6F2E9;cursor:pointer;box-shadow:0 8px 20px rgba(29,68,50,.22);overflow:hidden;position:relative;text-align:start;font:inherit;transition:transform .18s,box-shadow .18s}
.impbar:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(29,68,50,.3)}
.impbar:before{content:'';position:absolute;inset-inline-end:-30px;top:-44px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#C9A2272e,transparent 70%)}
.impbar:after{content:'';position:absolute;inset-inline-start:-34px;bottom:-54px;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,#EBDCA820,transparent 70%)}
.impstar{width:34px;height:34px;border-radius:11px;background:#C9A2271f;border:1px solid #C9A2274d;display:grid;place-items:center;font-size:15px;flex-shrink:0;position:relative;z-index:1}
.impmain{display:flex;flex-direction:column;gap:2px;position:relative;z-index:1}
.implb{font-size:9.5px;font-weight:800;color:#EBDCA8;letter-spacing:.3px}
.impval{display:flex;align-items:baseline;gap:6px}
.impval b{font-family:Alexandria,system-ui;font-size:25px;font-weight:800;line-height:1;text-shadow:0 2px 10px rgba(201,162,39,.35)}
.impval small{font-size:9.5px;font-weight:700;color:#E4E9DD}
.impsep{width:1px;height:32px;background:#F6F2E94d;flex-shrink:0;position:relative;z-index:1}
.impmeta{display:flex;flex-direction:column;gap:2px;font-size:10.5px;font-weight:700;color:#E4E9DD;position:relative;z-index:1;min-width:0;text-align:start}
.impmeta b{color:#EBDCA8}
.impq{margin-inline-start:auto;width:21px;height:21px;border-radius:50%;background:#F6F2E91c;border:1px solid #F6F2E940;color:#EBDCA8;font-size:10.5px;font-weight:800;display:grid;place-items:center;flex-shrink:0;position:relative;z-index:1}
@media(max-width:640px){.impbar{gap:9px;padding:9px 11px}.impmeta span:last-child{display:none}}
/* نافذة تفاصيل العدّاد */
.impbig{display:flex;flex-direction:column;align-items:center;gap:5px;padding:18px 14px 15px;border-radius:18px;background:linear-gradient(135deg,#1D4432 0%,#2E6B4F 62%,#24573F 100%);color:#F6F2E9;text-align:center}
.impbig .n{font-family:Alexandria,system-ui;font-size:40px;font-weight:800;line-height:1;text-shadow:0 2px 14px rgba(201,162,39,.4)}
.impbig small{font-size:11.5px;font-weight:700;color:#EBDCA8}
.impbig .tag.wht{background:#C9A22726;border:1px solid #C9A22755;color:#EBDCA8}
.impsteps{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.ipstep{display:flex;gap:10px;align-items:flex-start;border:1px dashed #1D443230;border-radius:13px;padding:10px 12px;background:#1D443205}
.ipstep i{width:34px;height:34px;border-radius:11px;background:#1D44320f;display:grid;place-items:center;font-size:16px;font-style:normal;flex-shrink:0}
.ipstep b{display:block;font-size:12px;margin-bottom:2px}
.ipstep span{font-size:10.5px;color:var(--mut);font-weight:600;line-height:1.7}""", 'impact CSS')

# ═══════════ ١-ب) impactBlock مضغوط + impInfo ═══════════
rep("""function impactBlock(){return `<div class="impwrap">
<span class="implbl">🌟 العدّاد المجتمعي الشفاف — أثر ضمين</span>
<div class="impnum"><span id="impnum">${ard(IMP.total)}</span><small>ريال سعودي</small></div>
<div class="improw"><span>من <b>${ar(IMP.n)}</b> عملية شراء ناجحة عبر ضمين</span><span>·</span><span><b>٠٫٥٠ ر.س</b> عن كل عملية</span></div>
<p>مع كل عملية شراء ناجحة تقتطع ضمين ٠٫٥٠ ريال من <b>حصة أرباح المنصة</b> — لا من جيب العميل ولا من التاجر — وتعتمدها لأعمال الخير. العدّاد يتحدّث لحظياً مع كل عملية، والشفافية كاملة أمام جميع الأطراف.</p>
</div>`;}""",
"""function impactBlock(){return `<button class="impbar" type="button" onclick="impInfo()" title="اضغط لعرض تفاصيل العدّاد المجتمعي">
<span class="impstar">🌟</span>
<span class="impmain"><span class="implb">🌟 العدّاد المجتمعي الشفاف — أثر ضمين</span>
<span class="impval"><b id="impnum">${ard(IMP.total)}</b><small>ر.س معتمدة لأعمال الخير</small></span></span>
<span class="impsep"></span>
<span class="impmeta"><span>من <b>${ar(IMP.n)}</b> عملية شراء ناجحة عبر ضمين</span><span>اقتطاع <b>٠٫٥٠ ر.س</b> عن كل عملية — لا من العميل ولا التاجر</span></span>
<span class="impq">؟</span>
</button>`;}
function impInfo(){openModal(`<div class="mhead"><b>🌟 العدّاد المجتمعي الشفاف</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="impbig"><span class="n">${ard(IMP.total)}</span><small>ريال سعودي معتمدة لأعمال الخير</small><span class="tag wht">من ${ar(IMP.n)} عملية شراء ناجحة</span></div>
<p class="hint" style="line-height:2;margin-top:11px">مع كل عملية شراء ناجحة تقتطع ضمين <b>٠٫٥٠ ريال من حصة أرباح المنصة</b> — لا من جيب العميل ولا من التاجر — وتعتمدها لأعمال الخير. العدّاد يتحدّث لحظياً مع كل عملية، والشفافية كاملة أمام جميع الأطراف.</p>
<div class="impsteps">
<div class="ipstep"><i>🛒</i><div><b>عملية شراء ناجحة</b><span>يُحجز مبلغ العميل في الخزنة المستقلة حتى استلامه وتقييمه</span></div></div>
<div class="ipstep"><i>💎</i><div><b>اقتطاع ٠٫٥٠ ريال</b><span>من عمولة ضمين على الصفقة — لا يزيد سعر المنتج أمام العميل أبداً</span></div></div>
<div class="ipstep"><i>🤲</i><div><b>اعتماد لأعمال الخير</b><span>يتحدّث العدّاد لحظياً ويظهر بشفافية للعميل والتاجر والإدارة معاً</span></div></div>
</div>
<button class="btn wide mt" onclick="closeModal()">فهمت، شكراً 💚</button>
</div>`);}""", 'impactBlock() + impInfo()')

# ═══════════ ٢) CSS استوديو الوسائط (يستبدل مصغّرات mpthumb القديمة) ═══════════
rep("""/* ===== مصغّرات صور المنتج في نموذج التاجر ===== */
.mpthumb{position:relative;width:64px;height:64px;border-radius:12px;overflow:hidden;border:1px solid var(--line);flex-shrink:0}
.mpthumb img{width:100%;height:100%;object-fit:cover;display:block}
.mpthumb button{position:absolute;top:3px;inset-inline-end:3px;width:19px;height:19px;border-radius:7px;border:0;background:rgba(20,30,25,.74);color:#fff;font-size:9.5px;cursor:pointer;display:grid;place-items:center;line-height:1}
.mpthumb .cover{position:absolute;bottom:0;inset-inline:0;background:#1D4432d9;color:#fff;font-size:8.5px;font-weight:800;text-align:center;padding:2px 0}""",
"""/* ===== 🎬 استوديو الوسائط الترويجية (نموذج التاجر) ===== */
.mstudio{margin-top:14px;border:1px solid #1D443226;border-radius:18px;overflow:hidden;background:var(--card2);box-shadow:0 6px 18px rgba(29,68,50,.07)}
.mshead{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:13px 15px;background:linear-gradient(135deg,#1D4432 0%,#2E6B4F 100%);color:#F6F2E9}
.msttl{display:flex;gap:10px;align-items:center}
.msttl .msic{width:38px;height:38px;border-radius:12px;background:#C9A22722;border:1px solid #C9A22744;display:grid;place-items:center;font-size:17px;flex-shrink:0}
.msttl b{display:block;font-size:13.5px}
.msttl small{display:block;font-size:10px;color:#E4E9DD;font-weight:600;margin-top:2px}
.mschips{display:flex;gap:6px;flex-wrap:wrap}
.mschip{background:#242B22a0;border:1px solid #C9A22755;color:#EBDCA8;font-size:10.5px;font-weight:800;border-radius:99px;padding:4px 10px;white-space:nowrap}
.mschip.full{background:#A63A2E33;border-color:#A63A2E88;color:#F3D7CE}
.msbody{padding:12px 14px 14px;display:flex;flex-direction:column;gap:11px}
.mssec{border:1.5px dashed #1D443230;border-radius:14px;padding:11px 12px 12px;background:#1D443204}
.mssechd{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:9px}
.mssechd b{font-size:12.5px;color:#1D4432;display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.mssechd>span{font-size:10px;color:var(--mut);font-weight:700}
.mscount{font-size:9.5px;font-weight:800;border-radius:99px;padding:2.5px 8px;background:#5566361c;color:#3E5427;white-space:nowrap}
.mscount.full{background:#A63A2E1c;color:#A63A2E}
.msgrid{display:flex;gap:8px;flex-wrap:wrap}
.msth{position:relative;width:66px;height:66px;border-radius:12px;overflow:hidden;border:1.5px solid #1D44321f;flex-shrink:0;transition:transform .18s,box-shadow .18s}
.msth:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(29,68,50,.18)}
.msth img{width:100%;height:100%;object-fit:cover;display:block}
.msth .cover{position:absolute;bottom:0;inset-inline:0;background:#1D4432e6;color:#fff;font-size:8px;font-weight:800;text-align:center;padding:2.5px 0;letter-spacing:.2px}
.msth .cover.gold{background:linear-gradient(135deg,#C9A227,#B08E22);color:#24221A}
.msth .del{position:absolute;top:4px;inset-inline-end:4px;width:20px;height:20px;border-radius:8px;border:0;background:rgba(20,30,25,.78);color:#fff;font-size:10px;cursor:pointer;display:grid;place-items:center;line-height:1;opacity:0;transition:opacity .15s}
.msth:hover .del{opacity:1}
.msacts{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
.msempty{border:1.5px dashed #1D44322e;border-radius:12px;padding:13px;text-align:center;font-size:11px;font-weight:700;color:var(--mut);background:#1D443203;line-height:1.8}
.msvlist{display:flex;gap:9px;flex-wrap:wrap}
.msvcard{flex:1;min-width:185px;max-width:260px;border:1.5px solid #1D443220;border-radius:13px;overflow:hidden;background:#fff}
.msvcard.bad{border-color:#A63A2E66;background:#A63A2E0a}
.msvtop{height:56px;background:linear-gradient(135deg,#1D4432,#2E6B4F);display:grid;place-items:center;position:relative}
.msvcard.bad .msvtop{background:linear-gradient(135deg,#7A2E24,#A63A2E)}
.msvtop .vic{width:32px;height:32px;border-radius:50%;background:#C9A22726;border:1.5px solid #C9A22766;display:grid;place-items:center;font-size:12px;color:#EBDCA8}
.msvtop .vnum{position:absolute;top:7px;inset-inline-start:8px;font-size:9px;font-weight:800;background:#242B22cc;color:#F6F2E9;border-radius:8px;padding:2px 7px}
.msvbody{padding:8px 9px 9px;display:flex;flex-direction:column;gap:7px}
.msvurl{font-size:9.5px;word-break:break-all;line-height:1.6;display:block;background:#1D443208;border-radius:8px;padding:5px 8px;font-weight:700;color:var(--mut)}
.msvmeta{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap}
.msdur{font-size:10.5px;font-weight:800;border-radius:99px;padding:3px 9px;white-space:nowrap}
.msdur.ok{background:#55663622;color:#3E5427}
.msdur.bad{background:#A63A2E1c;color:#A63A2E}
.msdur.wait{background:#C9A22722;color:#8A6F14}
.msvbody .hint{font-size:9.5px}
.msvacts{display:flex;gap:6px;flex-wrap:wrap}
.msadd{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
.msadd .inp{flex:1;min-width:190px;font-size:12px}""", 'mstudio CSS')

# ═══════════ ٢-ب) قسم الوسائط في نموذج المنتج ═══════════
rep("""<div class="acard mt" style="padding:13px;background:#1D443206">
<b style="font-size:12.5px">🖼️🎬 الوسائط الترويجية للمنتج</b>
<p class="hint" style="margin-top:3px">تظهر للعملاء في معرض صفحة متجرك وفي صفحة المنتج — حدودك المحددة من الإدارة: حتى <b>${ar(med.imgs)} صور</b> و<b>${ar(med.vids)} ${med.vids===1?'مقطع':'مقاطع'}</b> بمدة أقصاها <b>${ar(med.secs)} ثانية</b> للمقطع.</p>
<b style="font-size:11.5px;display:block;margin-top:10px">🖼️ صور المنتج (${MIMGS.length}/${ar(med.imgs)}) — الأولى هي الغلاف</b>
<div id="mpimgs">${mpImgsHTML(med)}</div>
<div class="mt" style="display:flex;gap:7px;flex-wrap:wrap">
<button class="btn soft xs" onclick="mImgPick()">📷 رفع صورة من جهازي</button>
<button class="btn gray xs" onclick="mImgAuto()">🎲 صورة تلقائية</button>
</div>
<b style="font-size:11.5px;display:block;margin-top:13px">🎬 مقاطع ترويجية (${MVIDS.length}/${ar(med.vids)})</b>
<div id="mpvids">${mpVidsHTML(med)}</div>
${med.vids>0?`<div class="hint" style="margin-top:8px">أضف رابط مقطع (MP4 مباشر) ثم اضغط «كشف المدة» — يُرفض المقطع إن تجاوز مدته ${ar(med.secs)} ثانية.</div>`:'<div class="hint" style="margin-top:8px">الإدارة لم تفعّل المقاطع الترويجية لمتجرك حالياً</div>'}
</div>""",
"""<div class="mstudio mt">
<div class="mshead">
<div class="msttl"><span class="msic">🎬</span><div><b>استوديو الوسائط الترويجية</b><small>صور ومقاطع منتجك تظهر للعملاء في معرض متجرك وصفحة المنتج</small></div></div>
<div class="mschips" id="mschips">${msChipsHTML(med)}</div>
</div>
<div class="msbody">
<div id="mpimgs">${msImgsSec(med)}</div>
<div id="mpvids">${msVidsSec(med)}</div>
</div>
</div>""", 'media form section')

# ═══════════ ٢-ج) دوال الصور الجديدة ═══════════
rep("""function mpImgsHTML(med){
if(!MIMGS.length)return '<div class="hint" style="padding:3px 0 5px">لا صور بعد — أول صورة ترفعها تكون الغلاف الرئيسي للمنتج.</div>';
return `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:6px">${MIMGS.map((im,i)=>`<div class="mpthumb">${i===0?'<span class="cover">غلاف</span>':''}<img src="${im}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/dmg${i}/200/200'"><button onclick="mImgDel(${i})" title="حذف">✕</button></div>`).join('')}</div>`;
}
function mpImgsRefresh(med){const el=$('#mpimgs');if(el)el.innerHTML=mpImgsHTML(med||medOf(myStore()))}""",
"""function msChipsHTML(med){return `<span class="mschip ${MIMGS.length>=med.imgs?'full':''}">🖼️ ${ar(MIMGS.length)}/${ar(med.imgs)} صور</span><span class="mschip ${MVIDS.length>=med.vids?'full':''}">🎬 ${ar(MVIDS.length)}/${ar(med.vids)} ${med.vids===1?'مقطع':'مقاطع'}</span><span class="mschip">⏱️ حتى ${ar(med.secs)} ثانية</span>`}
function msImgsSec(med){return `<div class="mssec">
<div class="mssechd"><b>🖼️ صور المنتج <span class="mscount ${MIMGS.length>=med.imgs?'full':''}">${MIMGS.length>=med.imgs?'اكتملت ('+ar(med.imgs)+'/'+ar(med.imgs)+')':'متبقٍ '+ar(med.imgs-MIMGS.length)}</span></b><span>أول صورة هي الغلاف الرئيسي أمام العملاء</span></div>
${mpImgsHTML(med)}
<div class="msacts">
<button class="btn sm" onclick="mImgPick()">📷 رفع صورة من جهازي</button>
<button class="btn soft sm" onclick="mImgAuto()">🎲 صورة تلقائية من مكتبة ضمين</button>
</div></div>`}
function mpImgsHTML(med){
if(!MIMGS.length)return '<div class="msempty">🖼️ لا صور بعد — أول صورة ترفعها تصبح الغلاف الرئيسي للمنتج.</div>';
return `<div class="msgrid">${MIMGS.map((im,i)=>`<div class="msth"><img src="${im}" alt="صورة ${ar(i+1)}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/dmg${i}/200/200'"><span class="cover ${i===0?'gold':''}">${i===0?'★ الغلاف':'صورة '+ar(i+1)}</span><button class="del" onclick="mImgDel(${i})" title="حذف الصورة">✕</button></div>`).join('')}</div>`;
}
function mpImgsRefresh(med){med=med||medOf(myStore());const el=$('#mpimgs');if(el)el.innerHTML=msImgsSec(med);const c=$('#mschips');if(c)c.innerHTML=msChipsHTML(med)}""", 'imgs functions')

# ═══════════ ٢-د) دوال المقاطع الجديدة ═══════════
rep("""function mpVidsHTML(med){
let h='';
if(MVIDS.length)h+=`<div class="rows" style="margin-top:6px">${MVIDS.map((v,i)=>`<div class="row" style="flex-wrap:wrap;gap:7px">
<span style="font-size:16px">🎬</span>
<div style="flex:1;min-width:150px"><b style="font-size:11.5px;word-break:break-all">${esc(String(v.src).slice(0,48))}${String(v.src).length>48?'…':''}</b>
<div class="hint">المدة: ${v.dur?('<b style="color:'+(v.bad?'var(--red)':'var(--grn)')+'">'+durTxt(v.dur)+'</b>'+(v.bad?' — تتجاوز الحد!':'')):'غير محددة — اضغط «كشف المدة»'} · الحد ${ar(med.secs)} ث</div></div>
<button class="btn gray xs" onclick="mVidProbe(${i})">⏱️ كشف المدة</button>
<button class="btn red xs" onclick="mVidDel(${i})">🗑 حذف</button>
</div>`).join('')}</div>`;
else h+='<div class="hint" style="padding:3px 0 5px">لا مقاطع بعد — أضف رابط مقطع MP4 مباشر بالأسفل.</div>';
if(MVIDS.length<med.vids)h+=`<div class="mt" style="display:flex;gap:7px;flex-wrap:wrap"><input class="inp" id="mv-url" style="flex:1;min-width:200px;font-size:12px" placeholder="رابط المقطع (MP4 مباشر — https://…)" onkeydown="if(event.key==='Enter')mVidAdd()"><button class="btn sm" onclick="mVidAdd()">＋ إضافة المقطع</button></div>`;
return h;
}
function mpVidsRefresh(med){const el=$('#mpvids');if(el)el.innerHTML=mpVidsHTML(med||medOf(myStore()))}""",
"""function msVidsSec(med){
let h=`<div class="mssec">
<div class="mssechd"><b>🎬 مقاطع ترويجية <span class="mscount ${MVIDS.length>=med.vids?'full':''}">${MVIDS.length>=med.vids?'اكتملت ('+ar(med.vids)+'/'+ar(med.vids)+')':'متبقٍ '+ar(med.vids-MVIDS.length)}</span></b><span>MP4 مباشر بمدة أقصاها ${ar(med.secs)} ثانية — تُفحص آلياً من مصدرها</span></div>`;
if(MVIDS.length)h+=`<div class="msvlist">${MVIDS.map((v,i)=>{
const st=v.bad?{c:'bad',ic:'⛔',t:'تتجاوز الحد — استبدلها'}:v.dur?{c:'ok',ic:'✓',t:'ضمن الحد'}:{c:'wait',ic:'⏱️',t:'اضغط «كشف المدة»'};
return `<div class="msvcard ${v.bad?'bad':''}">
<div class="msvtop"><span class="vnum">مقطع ${ar(i+1)}</span><span class="vic">▶</span></div>
<div class="msvbody">
<b class="msvurl">${esc(String(v.src).slice(0,46))}${String(v.src).length>46?'…':''}</b>
<div class="msvmeta"><span class="msdur ${st.c}">${st.ic} ${v.dur?durTxt(v.dur):'—'}</span><span class="hint">الحد ${ar(med.secs)} ث · ${st.t}</span></div>
<div class="msvacts"><button class="btn gray xs" onclick="mVidProbe(${i})">⏱️ كشف المدة</button><button class="btn red xs" onclick="mVidDel(${i})">🗑 حذف</button></div>
</div></div>`}).join('')}</div>`;
else h+=med.vids>0?'<div class="msempty">🎬 لا مقاطع بعد — ألصق رابط مقطع MP4 مباشر بالأسفل ثم اضغط «إضافة المقطع».</div>':'<div class="msempty">🎛️ الإدارة لم تفعّل المقاطع الترويجية لمتجرك حالياً — راجعها لتوسيع حدودك الترويجية</div>';
if(med.vids>0&&MVIDS.length<med.vids)h+=`<div class="msadd"><input class="inp" id="mv-url" placeholder="رابط المقطع (MP4 مباشر — https://…)" onkeydown="if(event.key==='Enter')mVidAdd()"><button class="btn sm" onclick="mVidAdd()">＋ إضافة المقطع</button></div>`;
return h+'</div>';
}
function mpVidsRefresh(med){med=med||medOf(myStore());const el=$('#mpvids');if(el)el.innerHTML=msVidsSec(med);const c=$('#mschips');if(c)c.innerHTML=msChipsHTML(med)}""", 'vids functions')

io.open(SRC, 'w', encoding='utf-8').write(h)
print('SAVED: %d -> %d bytes (%+d)' % (orig_len, len(h), len(h) - orig_len))
