#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١١ — تعديلات العميل والتاجر والإدارة:
١) العميل: الأقسام الأربعة كل اثنين جمب بعض (شبكة ٢×٢) + قائمة منسدلة صحيحة لكلمة «الأقسام» (كانت تُقص بـ overflow الشريط) + زر الرئيسية يعيد لبداية القسم الحالي
٢) التاجر: نقاط الولاء إجبارية + «إضافة سؤال» لكل منتج (اختيارات أو كتابة) يظهر للعميل وقت التصفح وتُرفق إجابته بالسلة والطلب
٣) الإدارة: دمج نظرة عامة + طلبات التسجيل + المتاجر في «مركز إدارة ضمين» بتبويبات + تغيير اسم أي قسم من صفحة الأقسام
كل التعديلات على الملف المدمج مباشرة: download/dameen.html"""
import io, sys

F = '/home/z/my-project/download/dameen.html'
s = io.open(F, encoding='utf-8').read()
orig = len(s)
n_edits = 0

def rep(old, new, name, count=1):
    global s, n_edits
    c = s.count(old)
    if c != count:
        print('  FAIL [%s] anchor found %d times (expected %d)' % (name, c, count))
        sys.exit(1)
    s = s.replace(old, new)
    n_edits += 1
    print('  OK %s' % name)

print('== A. العميل: شبكة الأقسام ٢×٢ ==')
rep('.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:4px}',
    '.trio{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:4px;max-width:940px;margin-inline:auto}',
    'A1 trio شبكة ٢×٢')

print('== B. العميل: CSS القائمة المنسدلة الثابتة + أسئلة المنتج ==')
rep('.ddmenu .hti span{font-size:10px;color:var(--mut)}',
    '.ddmenu .hti span{font-size:10px;color:var(--mut)}\n'
    '.ddmenu.secs{position:fixed;inset-inline-end:16px;display:none;min-width:268px;max-width:calc(100vw - 24px);z-index:130}\n'
    '.ddmenu.secs.open{display:block;animation:pop .18s}\n'
    '.ddmenu.secs .hti{padding:10px 12px}\n'
    '.ddmenu.secs .sechd{padding:8px 12px 4px;font-size:10.5px;color:var(--mut);font-weight:800}\n'
    '.pqwrap{background:var(--card2);border:1px dashed var(--line);border-radius:14px;padding:11px 13px;margin:11px 0}\n'
    '.pq{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:9px 12px;margin-top:8px}\n'
    '.pq label{font-size:12px;font-weight:800;display:block}',
    'B1 CSSsecs+pqs')

print('== C. العميل: متغيرات عامة ==')
rep("let SES=null,VIEW={page:'home'},CART=[],GFav=[],CK={step:0,addr:0,pay:'mada'},CPN=null,PTS=0,RATE={stars:0},COMP={sub:'damaged'},EVP=[],FREE_DL=false;\nconst me=()=>",
    "let SES=null,VIEW={page:'home'},CART=[],GFav=[],CK={step:0,addr:0,pay:'mada'},CPN=null,PTS=0,RATE={stars:0},COMP={sub:'damaged'},EVP=[],FREE_DL=false;\nlet LASTSEC=null,AHUBT='over';\nconst me=()=>",
    'C1 متغيرات LASTSEC/AHUBT')

print('== D. التنقل: go يسجل القسم الحالي + مسارات مركز الإدارة ==')
rep("""function go(page,arg){
if(page==='section'){VIEW={page:'section',sec:arg,cat:'الكل',q:''}}
else if(page==='store')VIEW={page:'store',store:arg,q:''};
else if(page==='product')VIEW={page:'product',pid:arg,gi:0,q:''};
else if(page==='search')VIEW={page:'search',q:arg};
else VIEW={page};""",
    """function go(page,arg){
if(page==='section'){VIEW={page:'section',sec:arg,cat:'الكل',q:''};LASTSEC=arg}
else if(page==='store')VIEW={page:'store',store:arg,q:''};
else if(page==='product')VIEW={page:'product',pid:arg,gi:0,q:''};
else if(page==='search')VIEW={page:'search',q:arg};
else if(page==='a-hub')VIEW={page:'a-hub',atab:arg||AHUBT||'over'};
else if(page==='a-over'){VIEW={page:'a-hub',atab:'over'};AHUBT='over'}
else if(page==='a-reqs'){VIEW={page:'a-hub',atab:'reqs'};AHUBT='reqs'}
else if(page==='a-stores'){VIEW={page:'a-hub',atab:'stores'};AHUBT='stores'}
else{VIEW={page};if(page==='home')LASTSEC=null}""",
    'D1 go مسارات جديدة')

print('== E. العميل: زر الرئيسية ذكي ==')
rep("function searchGo(){const q=($('#sq')||{}).value||'';if(q.trim())go('search',q.trim())}",
    """function searchGo(){const q=($('#sq')||{}).value||'';if(q.trim())go('search',q.trim())}
/* زر الرئيسية: داخل قسم (منتج/متجر/بحث سياقي) يعيدك بداية القسم نفسه — وإلا الصفحة الرئيسية */
function homeGo(){
const pg=VIEW.page;
if(pg==='product'){const p=P(VIEW.pid);const st=p?ST(p.store):null;if(st&&st.sec){go('section',st.sec);return}}
if(pg==='store'){const st=ST(VIEW.store);if(st&&st.sec){go('section',st.sec);return}}
if(pg==='search'&&LASTSEC){go('section',LASTSEC);return}
go('home');
}""",
    'E1 homeGo')

print('== F. القائمة العلوية: زر رئيسية ذكي + قائمة أقسام ثابتة + مركز الإدارة ==')
rep("${mnav('home','الرئيسية')}",
    "<button class=\"nlink ${VIEW.page==='home'?'on':''}\" onclick=\"homeGo()\">الرئيسية</button>",
    'F1 زر الرئيسية')

rep("""<div class="dd" onclick="event.stopPropagation();this.classList.toggle('open')">
<button class="nlink ${['section','store','product'].includes(VIEW.page)?'on':''}">🗂️ الأقسام ▾</button>
<div class="ddmenu">${SECTIONS.map(s=>`<div class="hti" onclick="go('section','${s.id}')"><b><span style="color:${s.color}">●</span> ${s.name}</b><span>${s.desc}</span></div>`).join('')}</div>
</div>""",
    """<button class="nlink ${['section','store','product'].includes(VIEW.page)?'on':''}" data-secb onclick="secDD(event,this)">🗂️ الأقسام ▾</button>
<div class="ddmenu secs" id="secdrop"><div class="sechd">عوالم ضمين — اختر قسماً</div>${SECTIONS.map(s=>`<div class="hti" onclick="go('section','${s.id}')"><b><span style="color:${s.color}">●</span> ${s.name}</b><span>${s.desc}</span></div>`).join('')}</div>""",
    'F2 قائمة الأقسام الثابتة')

rep("${mnav('a-over','📊 نظرة عامة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-reqs','📋 طلبات التسجيل')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}",
    "${mnav('a-hub','📊 مركز الإدارة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-cats','🗂️ الأقسام')}${mnav('a-rev','📈 الإيرادات')}",
    'F3 قائمة الإدارة المدمجة')

rep("""const mnav=(p,l)=>`<button class="nlink ${VIEW.page===p?'on':''}" onclick="go('${p}')">${l}</button>`;""",
    """const mnav=(p,l)=>`<button class="nlink ${VIEW.page===p?'on':''}" onclick="go('${p}')">${l}</button>`;
/* قائمة الأقسام المنسدلة — لوحة ثابتة (fixed) لا تُقص بحركة الشريط */
function secDD(e,btn){
e.stopPropagation();
const el=$('#secdrop');if(!el)return;
if(el.classList.contains('open')){el.classList.remove('open');return}
const r=btn.getBoundingClientRect();
el.style.top=(r.bottom+8)+'px';
el.style.insetInlineEnd=Math.max(10,window.innerWidth-r.right)+'px';
el.classList.add('open');
}
if(!window.__secInit){window.__secInit=1;
document.addEventListener('click',e=>{const el=$('#secdrop');
if(el&&el.classList.contains('open')&&!el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-secb]')))el.classList.remove('open')});
window.addEventListener('scroll',()=>{const el=$('#secdrop');if(el)el.classList.remove('open')},true)}""",
    'F4 secDD + إغلاق خارجي')

print('== G. خريطة الصفحات: a-hub ==')
rep("'a-over':pgAOver,'a-disputes':pgADisputes,'a-stores':pgAStores,'a-reqs':pgAReqs,'a-cats':pgACats,'a-rev':pgARev};",
    "'a-hub':pgAHub,'a-disputes':pgADisputes,'a-cats':pgACats,'a-rev':pgARev};",
    'G1 خريطة R')

print('== H. المنتج: الأسئلة المخصصة ==')
rep("if(VIEW._pid!==VIEW.pid){VIEW._pid=VIEW.pid;QTY=1;VIEW.tab='desc';RATE={stars:0}}",
    "if(VIEW._pid!==VIEW.pid){VIEW._pid=VIEW.pid;QTY=1;VIEW.tab='desc';RATE={stars:0};PANS={}}",
    'H1 تصفير الإجابات')

rep("""${dlBadge(p)}
<div class="hint mb">يبيعه متجر""",
    """${dlBadge(p)}
${p.qs&&p.qs.length?`<div class="pqwrap"><b style="font-size:12.5px">❓ أسئلة من التاجر — أجب عنها قبل الإضافة للسلة</b>${p.qs.map((q,i)=>qBlock(q,i,sec.color)).join('')}</div>`:''}
<div class="hint mb">يبيعه متجر""",
    'H2 بلوك الأسئلة في صفحة المنتج')

rep("""function qStep(d){const p=P(VIEW.pid);QTY=Math.min(Math.max(1,QTY+d),Math.max(1,p.stock||1));$('#qv').textContent=ar(QTY)}""",
    """function qStep(d){const p=P(VIEW.pid);QTY=Math.min(Math.max(1,QTY+d),Math.max(1,p.stock||1));$('#qv').textContent=ar(QTY)}
/* أسئلة التاجر المخصصة — الإجابة إجبارية قبل الإضافة للسلة */
let PANS={};
function qBlock(q,i,color){
if(q.t==='opts')return `<div class="pq"><label>${esc(q.q)}</label><div class="chiprow" style="margin-top:7px">${q.o.map(o=>`<button class="chip ${(PANS[i]||'')===o?'on':''}" style="--acc:${color}" onclick="panChip(this,${i})" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`;
return `<div class="pq"><label>${esc(q.q)}</label><input class="inp" style="font-size:12.5px;margin-top:7px" value="${esc(PANS[i]||'')}" oninput="PANS[${i}]=this.value" placeholder="اكتب جوابك هنا…"></div>`;
}
function panChip(el,i){PANS[i]=el.dataset.v;render()}""",
    'H3 دوال qBlock/PANS')

print('== I. السلة: إجبار الإجابة + إرفاقها بالعنصر ==')
rep("""function addToCart(pid,qty,buy){
const p=P(pid);if(!p.stock){toast('نفدت الكمية حالياً','err');return}
const ex=CART.find(c=>c.pid===pid);
if(ex)ex.qty=Math.min(ex.qty+qty,p.stock);else CART.push({pid,qty:Math.min(qty,p.stock)});
toast('أُضيف «'+esc(p.name)+'» إلى السلة','ok');
if(buy)go('cart');else{renderTop();renderFab()}
}""",
    """function addToCart(pid,qty,buy){
const p=P(pid);if(!p.stock){toast('نفدت الكمية حالياً','err');return}
const qs=p.qs||[];
if(qs.length){const miss=qs.findIndex((q,i)=>!String(PANS[i]||'').trim());
if(miss>=0){toast('أجب عن سؤال التاجر «'+qs[miss].q+'» أولاً — يظهر فوق زر الشراء','err');const el=document.querySelector('.pqwrap');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});return}}
const ans=qs.length?qs.map((q,i)=>({q:q.q,a:String(PANS[i]||'').trim()})):[];
const ex=CART.find(c=>c.pid===pid);
if(ex){ex.qty=Math.min(ex.qty+qty,p.stock);if(ans.length)ex.ans=ans}
else CART.push({pid,qty:Math.min(qty,p.stock),ans});
toast('أُضيف «'+esc(p.name)+'» إلى السلة','ok');
if(buy)go('cart');else{renderTop();renderFab()}
}""",
    'I1 addToCart بالأسئلة')

rep("${p.giftOk?' · 🎁 قابل للإهداء':''}${p.fragile?' · <span style=\"color:#B3541E;font-weight:700\">⚠️ قابل للكسر</span>':''}${p.customOk?' · ✏️ قابل للتعديل':''}</div>",
    "${p.giftOk?' · 🎁 قابل للإهداء':''}${p.fragile?' · <span style=\"color:#B3541E;font-weight:700\">⚠️ قابل للكسر</span>':''}${p.customOk?' · ✏️ قابل للتعديل':''}${x.ans&&x.ans.length?' · <span style=\"color:var(--grn);font-weight:800\">❓ أسئلة مجابة</span>':''}</div>",
    'I2 شارة مجاب في السلة')

print('== J. placeOrder: نقل إجابات الأسئلة إلى الشحنة ==')
rep("""const grp={store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),""",
    """const pans=[];its.forEach(x=>{if(x.ans&&x.ans.length)pans.push({pn:x.p.name,ans:x.ans.map(y=>({q:y.q,a:y.a}))})});
const grp={store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),""",
    'J1 جمع pans')

rep("if(st.qs&&st.qs.length)grp.ans=st.qs.map((qq,i)=>({q:qq,a:(((CK.ans[sid]||[])[i])||'').trim()})).filter(x=>x.a);",
    "if(st.qs&&st.qs.length)grp.ans=st.qs.map((qq,i)=>({q:qq,a:(((CK.ans[sid]||[])[i])||'').trim()})).filter(x=>x.a);\nif(pans.length)grp.pans=pans;",
    'J2 grp.pans')

print('== K. بطاقتا الطلب: عرض إجابات أسئلة المنتجات ==')
rep("${g.ans&&g.ans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجاباتك للمتجر: ${g.ans.map(x=>esc(x.q)+' ← <b>'+esc(x.a)+'</b>').join(' · ')}</div>`:''}",
    "${g.ans&&g.ans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجاباتك للمتجر: ${g.ans.map(x=>esc(x.q)+' ← <b>'+esc(x.a)+'</b>').join(' · ')}</div>`:''}\n"
    "${g.pans&&g.pans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجاباتك على أسئلة المنتجات: ${g.pans.map(x=>esc(x.pn)+' — '+x.ans.map(y=>esc(y.q)+' ← <b>'+esc(y.a)+'</b>').join(' · ')).join(' · ')}</div>`:''}",
    'K1 بطاقة العميل')

rep("${g.ans&&g.ans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجابات العميل على أسئلتك: ${g.ans.map(x=>esc(x.q)+' ← <b>'+esc(x.a)+'</b>').join(' · ')}</div>`:''}",
    "${g.ans&&g.ans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجابات العميل على أسئلتك: ${g.ans.map(x=>esc(x.q)+' ← <b>'+esc(x.a)+'</b>').join(' · ')}</div>`:''}\n"
    "${g.pans&&g.pans.length?`<div class=\"hint\" style=\"margin-top:6px\">❓ إجابات العميل على أسئلة المنتجات: ${g.pans.map(x=>esc(x.pn)+' — '+x.ans.map(y=>esc(y.q)+' ← <b>'+esc(y.a)+'</b>').join(' · ')).join(' · ')}</div>`:''}",
    'K2 بطاقة التاجر')

print('== L. التاجر: نقاط الولاء إجبارية ==')
rep('<div class="fld mt"><label>🌟 نقاط ولاء يمنحها المنتج للعميل (اختياري)</label>',
    '<div class="fld mt"><label>🌟 نقاط ولاء يمنحها المنتج للعميل (إجبارية)</label>',
    'L1 التسمية')
rep("if(!np&&!old){el.innerHTML='بلا نقاط — المنتج يبقى دون تمويل إضافي، ويمكنك إضافتها لاحقاً';return}",
    "if(!np&&!old){el.innerHTML='أدخل نقاطاً (١ فأكثر) — إجبارية لحفظ المنتج وتُمنح للعميل عند تحرير طلبه';return}",
    'L2 المعاينة')
rep("""const pts=Math.max(0,Math.min(500,Math.round(+($('#mp-pts').value||0)||0)));
const pv=ptsVal();""",
    """const pts=Math.max(0,Math.min(500,Math.round(+($('#mp-pts').value||0)||0)));
if(!(pts>=1)){toast('🌟 نقاط الولاء إجبارية — حدد نقاطاً (١ فأكثر) يمنحها المنتج للعميل عند التحرير','err');$('#mp-pts').focus();return}
const pv=ptsVal();""",
    'L3 التحقق الإجباري')

print('== M. التاجر: منشئ أسئلة المنتج في الفورم ==')
rep("let MPID=null;",
    "let MPID=null,MPQ=[],MPQOPEN=false;",
    'M1 المتغيرات')
rep("""const p=pid?P(pid):null;
openModal(`<div class="mhead"><b>${p?'تعديل منتج':'منتج جديد'}</b>""",
    """const p=pid?P(pid):null;
MPQ=p&&p.qs?JSON.parse(JSON.stringify(p.qs)):[];
MPQOPEN=false;
openModal(`<div class="mhead"><b>${p?'تعديل منتج':'منتج جديد'}</b>""",
    'M2 تهيئة MPQ')
rep("""<div class="fld mt"><label>المواصفات (كل سطر: المفتاح: القيمة)</label><textarea class="inp" id="mp-sp" style="min-height:60px" placeholder="الخامة: كتان&#10;اللون: كحلي">${p?esc(Object.entries(p.specs).map(([k,v])=>k+': '+v).join('\\n')):''}</textarea></div>
<div class="mt" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">""",
    """<div class="fld mt"><label>المواصفات (كل سطر: المفتاح: القيمة)</label><textarea class="inp" id="mp-sp" style="min-height:60px" placeholder="الخامة: كتان&#10;اللون: كحلي">${p?esc(Object.entries(p.specs).map(([k,v])=>k+': '+v).join('\\n')):''}</textarea></div>
<div class="fld mt"><label>❓ أسئلة تظهر للعميل وقت تصفح المنتج (اختيارية)</label>
<div class="hint" style="margin:2px 0 7px">سؤال باختيارات جاهزة أو سؤال يكتب العميل جوابه — الإجابة إجبارية قبل الإضافة للسلة وتصلك مع الطلب.</div>
<div id="mpqbox">${mpqHTML()}</div>
<button class="btn soft sm mt" onclick="mAddQ2()">＋ إضافة سؤال للمنتج</button>
</div>
<div class="mt" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">""",
    'M3 قسم الأسئلة في الفورم')

rep("""function mAutoImg(){MIMG=ZPOOL[Math.floor(Math.random()*ZPOOL.length)];const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('اختيرت صورة تلقائية','ok')}""",
    """function mAutoImg(){MIMG=ZPOOL[Math.floor(Math.random()*ZPOOL.length)];const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('اختيرت صورة تلقائية','ok')}
/* منشئ أسئلة المنتج — اختيارات أو كتابة حرة */
function mpqHTML(){
let h='';
if(MPQ.length)h=`<div class="rows" style="margin-bottom:${MPQOPEN?'8px':'0'}">${MPQ.map((q,i)=>`<div class="row" style="flex-wrap:wrap;gap:8px"><div style="flex:1;min-width:150px"><b style="font-size:12px">${esc(q.q)}</b><div class="hint">${q.t==='opts'?'اختيارات: '+q.o.map(x=>esc(x)).join(' · '):'العميل يكتب جوابه'}</div></div><button class="btn gray xs" onclick="mpqDel(${i})">🗑 حذف</button></div>`).join('')}</div>`;
if(MPQOPEN){h+=`<div class="acard" style="padding:12px;margin-top:8px;background:#1D443208">
<div class="fld"><label>نوع السؤال</label><select class="inp" id="mqq-t" style="font-size:12px" onchange="mpqType()"><option value="opts">اختيارات — العميل يختار جواباً جاهزاً</option><option value="txt">كتابة — العميل يكتب جوابه بنفسه</option></select></div>
<div class="fld mt"><label>نص السؤال</label><input class="inp" id="mqq-q" style="font-size:12px" placeholder="مثال: ما اللون المطلوب للتطريز؟"></div>
<div id="mqq-opts">${mpqOpts()}</div>
<div class="spread mt"><button class="btn gray xs" onclick="MPQOPEN=false;mpqRefresh()">إلغاء</button><button class="btn sm" onclick="mpqPush()">＋ إضافة السؤال ✓</button></div></div>`}
if(!MPQ.length&&!MPQOPEN)h=`<div class="hint" style="padding:2px 0 4px">لا أسئلة بعد — أضف سؤالاً (لون، مقاس، اسم تطريز، ملاحظة تغليف…).</div>`;
return h}
function mpqOpts(){const t=($('#mqq-t')||{value:'opts'}).value;
if(t!=='opts')return `<div class="hint" style="margin-top:4px">سيظهر للعميل حقل كتابة حرّة يجيب فيه بنفسه.</div>`;
return `<div class="fgrid mt"><div class="fld"><label>الخيار ١ (إلزامي)</label><input class="inp" id="mqq-o0" style="font-size:12px" placeholder="أسود"></div><div class="fld"><label>الخيار ٢ (إلزامي)</label><input class="inp" id="mqq-o1" style="font-size:12px" placeholder="بيج"></div></div>
<div class="fgrid mt"><div class="fld"><label>الخيار ٣ (اختياري)</label><input class="inp" id="mqq-o2" style="font-size:12px"></div><div class="fld"><label>الخيار ٤ (اختياري)</label><input class="inp" id="mqq-o3" style="font-size:12px"></div></div>`}
function mpqType(){const el=$('#mqq-opts');if(el)el.innerHTML=mpqOpts()}
function mAddQ2(){MPQOPEN=true;mpqRefresh()}
function mpqRefresh(){const el=$('#mpqbox');if(el)el.innerHTML=mpqHTML()}
function mpqDel(i){MPQ.splice(i,1);mpqRefresh()}
function mpqPush(){
const t=($('#mqq-t')||{value:'opts'}).value;
const q=($('#mqq-q').value||'').trim();
if(q.length<3){toast('اكتب نص السؤال (٣ أحرف فأكثر)','err');return}
let o=[];
if(t==='opts'){o=[0,1,2,3].map(i=>(($('#mqq-o'+i)||{}).value||'').trim()).filter(Boolean);
if(o.length<2){toast('للأسئلة الاختيارية أدخل خيارين على الأقل','err');return}
if(new Set(o).size!==o.length){toast('لا تكرر نفس الخيار','err');return}}
MPQ.push({q,t,o});MPQOPEN=false;mpqRefresh();toast('أُضيف السؤال — سيظهر للعميل في صفحة المنتج ✓','ok')}""",
    'M4 دوال المنشئ')

print('== N. التاجر: حفظ الأسئلة مع المنتج ==')
rep("if(pid){const p=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs,pts,ptype:ptypeVal||p.ptype||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:!!p.giftOk,fragile,customOk});",
    "if(pid){const p=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs,pts,ptype:ptypeVal||p.ptype||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:!!p.giftOk,fragile,customOk,qs:MPQ.map(x=>({...x}))});",
    'N1 حفظ التعديل')
rep("else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,pts,ptype:ptypeVal||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,ipOK,sold:0,rt:0,rc:0,imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[]});",
    "else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,pts,ptype:ptypeVal||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,ipOK,sold:0,rt:0,rc:0,imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[],qs:MPQ.map(x=>({...x}))});",
    'N2 حفظ الجديد')

print('== O. الإدارة: مركز الإدارة المدمج ==')
rep("""/* ================= صفحات الإدارة ================= */
const vaultNow=""",
    """/* ================= صفحات الإدارة ================= */
/* مركز الإدارة: نظرة عامة + طلبات التسجيل + المتاجر في صفحة واحدة بتبويبات */
function pgAHub(){
const t=['over','reqs','stores'].includes(VIEW.atab)?VIEW.atab:'over';AHUBT=t;
const pends=DB.reqs.filter(r=>r.status==='pending').length;
const tab=(k,l,n)=>`<button class="${t===k?'on':''}" onclick="ahubTab('${k}')">${l}${n?` (${ar(n)})`:''}</button>`;
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
<div class="tabs" style="margin-top:8px">${tab('over','📊 نظرة عامة')}${tab('reqs','📋 طلبات التسجيل',pends)}${tab('stores','🏪 المتاجر',STORES.length)}</div>
${t==='over'?pgAOver():t==='reqs'?pgAReqs():pgAStores()}`;
}
function ahubTab(t){VIEW.atab=t;render()}
const vaultNow=""",
    'O1 pgAHub')

rep("""const pends=DB.reqs.filter(r=>r.status==='pending');
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
<div class="kpis">""",
    """const pends=DB.reqs.filter(r=>r.status==='pending');
return `<div class="kpis">""",
    'O2 رأس النظرة العامة')

rep("""return `<div class="pghead"><h1>📋 طلبات التسجيل</h1><span class="tag ${pend.length?'amb':'grn'}">${ar(pend.length)} بانتظار البت · ${ar(done.length)} منتهي</span></div>""",
    """return `<div class="spread" style="margin:2px 0 12px"><b class="fx" style="font-size:14.5px">📋 طلبات التسجيل</b><span class="tag ${pend.length?'amb':'grn'}">${ar(pend.length)} بانتظار البت · ${ar(done.length)} منتهي</span></div>""",
    'O3 رأس الطلبات')

rep("""return `<div class="pghead"><h1>🏪 إدارة المتاجر</h1></div>""",
    """return `<div class="spread" style="margin:2px 0 12px"><b class="fx" style="font-size:14.5px">🏪 إدارة المتاجر</b><span class="tag gry">${ar(STORES.length)} متجر مسجل</span></div>""",
    'O4 رأس المتاجر')

print('== P. الإدارة: تغيير اسم القسم ==')
rep("""<p class="hint mb" style="line-height:1.8">أضف وعدّل واحذف تصنيفات العوالم الأربعة، وحدد عمولة كل تصنيف بنفسك""",
    """<p class="hint mb" style="line-height:1.8">أضف وعدّل واحذف تصنيفات العوالم الأربعة، وغيّر اسم أي قسم بزر ✏️، وحدد عمولة كل تصنيف بنفسك""",
    'P1 التمهيد')
rep("""<div class="spread"><h3 style="color:${sec.color}">${sec.icon} ${sec.name}</h3><span class="tag" style="background:${sec.color}18;color:${sec.color}">${ar(CATS[sec.id].length)} تصنيف</span></div>""",
    """<div class="spread"><h3 style="color:${sec.color}">${sec.icon} ${sec.name}</h3><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="tag" style="background:${sec.color}18;color:${sec.color}">${ar(CATS[sec.id].length)} تصنيف</span><button class="btn gray xs" onclick="secRename('${sec.id}')">✏️ تغيير الاسم</button></div></div>""",
    'P2 زر التغيير')
rep("""CATS[sec].push({n:nm,comm:+cm.toFixed(2)});
toast('أُضيف التصنيف «'+nm+'» بعمولة '+ard(cm)+'٪ ✓','ok');render();
}""",
    """CATS[sec].push({n:nm,comm:+cm.toFixed(2)});
toast('أُضيف التصنيف «'+nm+'» بعمولة '+ard(cm)+'٪ ✓','ok');render();
}
/* تغيير اسم القسم (العالم) — يُطبَّق فوراً في كل ضمين */
function secRename(sid){
const sec=SEC(sid);
openModal(`<div class="mhead"><b>✏️ تغيير اسم القسم</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="demo mb"><b style="font-size:12px">الاسم الجديد يُطبَّق فوراً في كل ضمين</b>
<p class="hint" style="margin-top:3px">القائمة العلوية، بطاقات الرئيسية، صفحات القسم، اختيار عالم التاجر الجديد، وبطاقات الطلبات — كلها تقرأ الاسم من هنا.</p></div>
<div class="fld"><label>اسم القسم</label><input class="inp" id="sn-nm" value="${esc(sec.name)}"></div>
<div class="fld mt"><label>الوصف المختصر (يظهر تحت الاسم)</label><input class="inp" id="sn-ds" value="${esc(sec.desc)}"></div>
<div class="spread mt"><button class="btn gray sm" onclick="closeModal()">تراجع</button><button class="btn" onclick="secSaveName('${sid}')">حفظ الاسم</button></div></div>`);
}
function secSaveName(sid){
const sec=SEC(sid);
const nm=($('#sn-nm').value||'').trim(),ds=($('#sn-ds').value||'').trim();
if(nm.length<4){toast('اسم القسم قصير جداً (٤ أحرف فأكثر)','err');return}
const old=sec.name;
sec.name=nm;if(ds)sec.desc=ds;
closeModal();toast('حُفظ اسم القسم: «'+old+'» ← «'+nm+'» ✓','ok');render();
}""",
    'P3 دوال secRename/secSaveName')

print('== إجمالي: %d تعديلاً — الحجم %d → %d بايت ==' % (n_edits, orig, len(s)))
io.open(F, 'w', encoding='utf-8').write(s)
print('BATCH11 DONE')
