# -*- coding: utf-8 -*-
"""ترقية ضمين: الوسائط الترويجية + تصنيفات المتجر + خيارات المنتج + بيانات الشحن + شريط الدخول + العداد المجتمعي"""
import io, sys, re

P = '/home/z/my-project/download/dameen.html'
html = io.open(P, encoding='utf-8').read()
orig_len = len(html)
applied = []

def rep(old, new, label, count=1):
    global html
    n = html.count(old)
    if n != count:
        print('!! FAIL [%s]: found %d (expected %d)' % (label, n, count))
        sys.exit(1)
    html = html.replace(old, new)
    applied.append(label)

# ============ 1) CSS ============
CSS = '''
/* ===== 🎬 الوسائط الترويجية — معرض المتجر ومقاطع المنتج ===== */
.mshow{margin:14px 0 2px}
.mshow .hrow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin:0 2px 9px;flex-wrap:wrap}
.mshow h3{font-size:14.5px;font-weight:800}
.mrail{display:flex;gap:11px;overflow-x:auto;padding:2px 2px 12px;scroll-snap-type:x mandatory}
.mrail::-webkit-scrollbar{height:6px}
.mrail::-webkit-scrollbar-thumb{background:var(--line);border-radius:99px}
.mcard{position:relative;flex:0 0 176px;scroll-snap-align:start;border-radius:16px;overflow:hidden;cursor:pointer;background:var(--card2);border:1px solid var(--line);box-shadow:0 5px 14px rgba(29,68,50,.09);transition:transform .18s}
.mcard:hover{transform:translateY(-3px)}
.mcard img{width:100%;height:124px;object-fit:cover;display:block}
.mcard .mcap{position:absolute;inset-inline:0;bottom:0;padding:24px 10px 8px;background:linear-gradient(0deg,rgba(16,26,21,.88),rgba(16,26,21,0));color:#fff;display:flex;flex-direction:column;gap:1px}
.mcard .mcap b{font-size:11.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mcard .mcap small{font-size:10.5px;font-weight:700;color:#EBDCA8}
.mcard .play{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(16,26,21,.55);border:2px solid #fff;color:#fff;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.3)}
.mcard .vtag{position:absolute;top:8px;inset-inline-end:8px;background:rgba(16,26,21,.74);color:#fff;font-size:9.5px;font-weight:700;padding:2.5px 8px;border-radius:99px}
.pvids{margin-top:11px}
.pvids>b{display:block;font-size:12.5px;margin-bottom:7px}
.vrail{display:flex;gap:9px;overflow-x:auto;padding-bottom:9px}
.vrail::-webkit-scrollbar{height:5px}
.vrail::-webkit-scrollbar-thumb{background:var(--line);border-radius:99px}
.vrail .mcard{flex:0 0 134px}
.vrail .mcard img{height:94px}
.vmodal video{width:100%;max-height:60vh;border-radius:14px;background:#000;display:block}
.vmodal .vinfo{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:11px;flex-wrap:wrap}
.verr{background:#A63A2E12;border:1px dashed #A63A2E66;color:#A63A2E;border-radius:12px;padding:16px;text-align:center;font-weight:700;font-size:12px}
/* ===== 🌟 العدّاد المجتمعي الشفاف ===== */
.impwrap{position:relative;margin-top:16px;border-radius:22px;padding:21px 20px 17px;background:linear-gradient(135deg,#1D4432 0%,#2E6B4F 62%,#24573F 100%);color:#F6F2E9;overflow:hidden;box-shadow:0 12px 30px rgba(29,68,50,.28)}
.impwrap:before{content:'';position:absolute;inset-inline-start:-40px;top:-46px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,#C9A22733,transparent 70%)}
.impwrap:after{content:'';position:absolute;inset-inline-end:-34px;bottom:-56px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,#EBDCA826,transparent 70%)}
.implbl{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#EBDCA8;letter-spacing:.2px;position:relative;z-index:1}
.impnum{display:flex;align-items:baseline;gap:8px;margin:8px 0 5px;position:relative;z-index:1}
.impnum span{font-family:Alexandria,system-ui;font-size:46px;font-weight:800;line-height:1;text-shadow:0 2px 14px rgba(201,162,39,.4)}
.impnum small{font-size:14px;font-weight:700;color:#EBDCA8}
.improw{display:flex;gap:13px;flex-wrap:wrap;font-size:11.5px;font-weight:700;color:#E9E4D2;position:relative;z-index:1}
.improw b{color:#EBDCA8}
.impwrap p{position:relative;z-index:1;margin-top:9px;font-size:11px;line-height:1.85;color:#E4E9DD;opacity:.96;max-width:600px}
.imphero{margin-top:12px;border-radius:18px;padding:16px 16px 13px;background:linear-gradient(130deg,#C9A227 0%,#B08E22 55%,#1D4432 170%);color:#24221A;box-shadow:0 8px 20px rgba(201,162,39,.28)}
.imphero .tag.wht{background:#242B22d9;color:#F6F2E9}
.imphero .bignum{font-family:Alexandria,system-ui;font-size:38px;font-weight:800;line-height:1.05}
.imphero .hint{color:#3A3423;font-weight:600}
.impdone{margin-top:12px;border:1px dashed #C9A22788;background:#C9A22712;border-radius:14px;padding:11px 13px;font-size:12px;line-height:1.95;color:#6B5A1E;font-weight:600}
.impdone b{color:#8A6F14}
/* ===== 📋 بيانات الشحنة لشركة الشحن ===== */
.shipblk{margin-top:10px;border:1px solid var(--line);border-radius:14px;background:var(--card2);padding:11px 13px}
.shipblk .srow2{display:flex;justify-content:space-between;gap:10px;font-size:11.5px;padding:4px 0;border-bottom:1px dashed var(--line)}
.shipblk .srow2:last-child{border-bottom:0}
.shipblk .srow2>span{color:var(--mut);flex-shrink:0}
.shipblk .srow2>b{text-align:start;font-weight:700;line-height:1.7}
/* ===== مصغّرات صور المنتج في نموذج التاجر ===== */
.mpthumb{position:relative;width:64px;height:64px;border-radius:12px;overflow:hidden;border:1px solid var(--line);flex-shrink:0}
.mpthumb img{width:100%;height:100%;object-fit:cover;display:block}
.mpthumb button{position:absolute;top:3px;inset-inline-end:3px;width:19px;height:19px;border-radius:7px;border:0;background:rgba(20,30,25,.74);color:#fff;font-size:9.5px;cursor:pointer;display:grid;place-items:center;line-height:1}
.mpthumb .cover{position:absolute;bottom:0;inset-inline:0;background:#1D4432d9;color:#fff;font-size:8.5px;font-weight:800;text-align:center;padding:2px 0}
'''
rep('</style>', CSS + '</style>', 'CSS')

# ============ 2) نواة MED/IMP قبل ptsVal ============
CORE = '''/* ================= 🎬 حدود الوسائط الترويجية و🌟 العدّاد المجتمعي الشفاف ================= */
let MED={imgs:6,vids:2,secs:60,stores:{}};
const medOf=s=>Object.assign({},MED,MED.stores[s.id]||{});
let IMP={total:0,n:0,users:{},stores:{}};
const IMP_STEP=0.5;
const durTxt=s=>{s=Math.max(0,Math.round(s||0));return ar(Math.floor(s/60))+':'+ar(String(s%60).padStart(2,'0'))};
const tempTxt=p=>p.temp==='chilled'?'🧊 مبرد':p.temp==='hot'?'🔥 يُسلَّم ساخناً':'🌡️ عادي';
function impSeed(){let n=0;const users={},stores={};
DB.orders.forEach(o=>{const ok=o.groups.filter(g=>g.status!=='refunded');
if(ok.length){n++;users[o.customer]=r2((users[o.customer]||0)+IMP_STEP);
ok.forEach(g=>{stores[g.store]=r2((stores[g.store]||0)+IMP_STEP)})}});
IMP={total:r2(n*IMP_STEP),n,users,stores};}
function impAdd(o){IMP.total=r2(IMP.total+IMP_STEP);IMP.n++;
IMP.users[o.customer]=r2((IMP.users[o.customer]||0)+IMP_STEP);
o.groups.forEach(g=>{if(g.status!=='refunded')IMP.stores[g.store]=r2((IMP.stores[g.store]||0)+IMP_STEP)});
appSave();}
function impRefund(o,g){IMP.stores[g.store]=r2(Math.max(0,(IMP.stores[g.store]||0)-IMP_STEP));
if(o.groups.every(x=>x.status==='refunded')){IMP.total=r2(Math.max(0,IMP.total-IMP_STEP));IMP.n=Math.max(0,IMP.n-1);IMP.users[o.customer]=r2(Math.max(0,(IMP.users[o.customer]||0)-IMP_STEP))}
appSave();}
function impAnim(){const el=$('#impnum');if(!el)return;const target=IMP.total||0;const t0=performance.now();
const stepFn=t=>{const k=Math.min(1,(t-t0)/1400);el.textContent=ard(r2(target*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(stepFn)};
requestAnimationFrame(stepFn);}
function impactBlock(){return `<div class="impwrap">
<span class="implbl">🌟 العدّاد المجتمعي الشفاف — أثر ضمين</span>
<div class="impnum"><span id="impnum">${ard(IMP.total)}</span><small>ريال سعودي</small></div>
<div class="improw"><span>من <b>${ar(IMP.n)}</b> عملية شراء ناجحة عبر ضمين</span><span>·</span><span><b>٠٫٥٠ ر.س</b> عن كل عملية</span></div>
<p>مع كل عملية شراء ناجحة تقتطع ضمين ٠٫٥٠ ريال من <b>حصة أرباح المنصة</b> — لا من جيب العميل ولا من التاجر — وتعتمدها لأعمال الخير. العدّاد يتحدّث لحظياً مع كل عملية، والشفافية كاملة أمام جميع الأطراف.</p>
</div>`;}
function impHero(){return `<div class="imphero">
<div class="spread"><b style="font-size:13.5px">🌟 مساهماتي الخيرية</b><span class="tag wht">من أرباح ضمين — لا من مالك</span></div>
<div style="display:flex;align-items:baseline;gap:8px;margin-top:6px"><span class="bignum">${ard(IMP.users[SES.phone]||0)}</span><span style="font-size:12px;font-weight:800">ر.س</span></div>
<div class="hint" style="margin-top:2px">اقتطعت ضمين ٠٫٥٠ ريال من أرباحها مع كل عملية شراء ناجحة لك${(IMP.users[SES.phone]||0)>0?' — مجموع أثرك الخيري باسمك':': أول عملية شراء لك تضيف أول ٠٫٥٠ ر.س ✨'}</div>
</div>`;}
function vidFail(v){try{v.style.display='none';v.insertAdjacentHTML('afterend','<div class="verr">🎬 تعذّر تشغيل المقطع من مصدره — تأكد من الرابط أو جرّب مقطعاً آخر</div>')}catch(e){}}
function playVid(pid,src,dur){const p=P(pid);if(!p)return;const s=ST(p.store);
openModal(`<div class="mhead"><b>🎬 ${esc(p.name)}</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody vmodal">
<video src="${esc(src)}" poster="${p.imgs[0]||''}" controls autoplay playsinline preload="metadata" onerror="vidFail(this)"></video>
<div class="vinfo"><span class="hint">${dur?('⏱️ المدة '+durTxt(dur)+' · '):''}من متجر <a style="color:${s.color};font-weight:800;cursor:pointer" onclick="closeModal();go('product','${p.id}')">${esc(s.name)}</a> · ${money(eff(p))}</span>
<button class="btn sm" onclick="closeModal();go('product','${p.id}')">🛒 صفحة المنتج</button></div>
</div>`,'lg');}
function pvidsBlock(p){if(!p.vids||!p.vids.length)return '';
return `<div class="pvids"><b>🎬 مقاطع ترويجية من المتجر</b>
<div class="vrail">${p.vids.map((v,vi)=>`<div class="mcard" onclick="playVid('${p.id}','${esc(v.src)}',${+v.dur||0})">${imgTag(p.imgs[0],'',p.name)}<span class="play">▶</span><span class="vtag">🎬 ${v.dur?durTxt(v.dur):'مقطع '+ar(vi+1)}</span><div class="mcap"><b>مقطع ${ar(vi+1)}</b><small>${money(eff(p))}</small></div></div>`).join('')}</div></div>`;}
const ptsVal=()=>DB.ptsVal||0.1;'''
rep('const ptsVal=()=>DB.ptsVal||0.1;', CORE, 'CORE MED/IMP')

# ============ 3) بيانات تجريبية: فيديوهات وخيارات وحرارة ============
rep("imgs:[IM('1594633312681-425c7b97ccd1'),IM('1515372039744-b8f02a3ae446'),IM('1523381210434-271e8be1f52b')],",
    "imgs:[IM('1594633312681-425c7b97ccd1'),IM('1515372039744-b8f02a3ae446'),IM('1523381210434-271e8be1f52b')],vids:[{src:'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',dur:10}],qs:[{q:'لون التطريز على الأكمام؟',t:'opts',o:['ذهبي','فضي','بلا تطريز']},{q:'ملاحظتك على التغليف (تصل مع الطلب)',t:'txt'}],",
    'seed p1 vids+qs')
rep("imgs:['https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2626d093c49.jpg','https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7bd7eee784a6.jpg'],",
    "imgs:['https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2626d093c49.jpg','https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7bd7eee784a6.jpg'],vids:[{src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',dur:7}],",
    'seed p8 vids')
rep("imgs:['https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/308769bd3796.jpg','https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f9d9fe61140.jpg'],",
    "imgs:['https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/308769bd3796.jpg','https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f9d9fe61140.jpg'],vids:[{src:'https://media.w3.org/2010/05/sintel/trailer.mp4',dur:52}],",
    'seed p25 vids')
rep("cat:'ألبان ومخبوزات',ptype:'chilled',price:25,", "cat:'ألبان ومخبوزات',ptype:'chilled',temp:'chilled',price:25,", 'seed p14 temp')
rep("cat:'ألبان ومخبوزات',ptype:'instant',price:12,", "cat:'ألبان ومخبوزات',ptype:'instant',temp:'hot',price:12,", 'seed p15 temp')
rep("cat:'حلويات وأطباق',ptype:'chilled',price:145,", "cat:'حلويات وأطباق',ptype:'chilled',temp:'chilled',price:145,", 'seed p22 temp')

# ============ 4) go('store') + render + شريط علوي ============
rep("else if(page==='store')VIEW={page:'store',store:arg,q:''};",
    "else if(page==='store')VIEW={page:'store',store:arg,q:'',scat:'الكل'};", 'go store scat')
rep("renderTop();renderFab();appSave();",
    "renderTop();renderFab();appSave();\nif(VIEW.page==='home')setTimeout(impAnim,60);", 'render impAnim')
rep('h=`<div class="topin">${brand}${sb}<button class="btn" onclick="openAuth()">تسجيل الدخول</button>${instChip()}</div>`;',
    'h=`<div class="topin">${brand}${sb}<button class="btn" onclick="openAuth()">تسجيل الدخول</button></div>`;',
    'top: remove appchip')

# ============ 5) الرئيسية: عداد الأثر ============
rep('''<div class="howc"><div class="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div>`;''',
    '''<div class="howc"><div class="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div>
${impactBlock()}`;''', 'home impact block')

# ============ 6) صفحة المتجر: تصنيفات + معرض وسائط (استبدال كامل) ============
M1 = '/* ================= صفحة المتجر ================= */'
M2 = '/* ================= صفحة المنتج ================= */'
i1 = html.index(M1); i2 = html.index(M2)
NEW_STORE = '''/* ================= صفحة المتجر ================= */
function pgStore(){
const s=ST(VIEW.store);
if(!s)return pgHome();
const sec=SEC(s.sec);
const all=PRODUCTS.filter(p=>p.store===s.id);
const cats=['الكل',...[...new Set(all.map(p=>p.cat))]];
const scat=VIEW.scat||'الكل';
const ps=scat==='الكل'?all:all.filter(p=>p.cat===scat);
return `<div class="pghead"><button class="backb" onclick="go('section','${sec.id}')">→</button><h1>${esc(s.name)}</h1><span class="tag" style="background:${s.color}18;color:${s.color}">${sec.name}</span></div>
<div class="storeban" style="--c:${s.color};${s.cover?`background-image:linear-gradient(100deg,${s.color}F2,${s.color}C4),url('${s.cover}');background-size:cover;background-position:center`:''}">
<div class="lg">${s.logo?`<img src="${s.logo}" style="width:100%;height:100%;object-fit:cover">`:s.name[0]}</div>
<div style="flex:1"><h1>${esc(s.name)}</h1><p>${esc(s.desc)}</p>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:7px;font-size:11.5px;opacity:.95">
<span>📍 ${esc(s.city||'—')}</span><span>·</span><span>★ ${ard(s.rt)} تقييم المتجر</span><span>·</span><span>${ars(s.sales)} طلباً مكتمل البيع</span><span>·</span><span>🛡️ نافذة حماية ${sec.win}</span></div></div>
${s.open?'':'<span class="tag wht">مغلق مؤقتاً</span>'}
</div>
${storeMedia(s)}
<div class="secthead"><h2>🗂️ تصنيفات المتجر (${ars(cats.length-1)})</h2><div class="ln"></div></div>
<div class="chiprow">${cats.map(c=>`<button class="chip ${scat===c?'on':''}" style="--acc:${s.color}" onclick="VIEW.scat='${esc(c)}';render()">${esc(c)}</button>`).join('')}</div>
<div class="secthead"><h2>${scat==='الكل'?'منتجات المتجر':'منتجات «'+esc(scat)+'»'} (${ars(ps.length)})</h2><div class="ln"></div></div>
${ps.length?`<div class="pgrid">${ps.map(pcard).join('')}</div>`:`<div class="empty"><div class="em">🧺</div><b>لا منتجات في هذا التصنيف حالياً</b><span>جرّب تصنيفاً آخر من تصنيفات المتجر</span></div>`}`;
}
/* معرض الوسائط الترويجية للمتجر — صور ومقاطع منتجاته ضمن حدود تحددها الإدارة */
function storeMedia(s){
const cards=[];
PRODUCTS.filter(p=>p.store===s.id).forEach(p=>{
(p.vids||[]).forEach(v=>cards.push({p,type:'v',src:v.src,dur:+v.dur||0}));
(p.imgs||[]).slice(1).forEach((im,i)=>cards.push({p,type:'i',im,i}));
});
if(!cards.length)return '';
return `<div class="mshow">
<div class="hrow"><h3>🎬 معرض ${esc(s.name)} الترويجي</h3><span class="hint">${ar(cards.length)} وسائط من منتجات المتجر — انقر أي وسائط</span></div>
<div class="mrail">${cards.slice(0,16).map(c=>c.type==='v'
?`<div class="mcard" onclick="playVid('${c.p.id}','${esc(c.src)}',${c.dur})">${imgTag(c.p.imgs[0],'',c.p.name)}<span class="play">▶</span><span class="vtag">🎬 ${c.dur?durTxt(c.dur):'مقطع'}</span><div class="mcap"><b>${esc(c.p.name)}</b><small>${money(eff(c.p))}</small></div></div>`
:`<div class="mcard" onclick="go('product','${c.p.id}')">${imgTag(c.im,'',c.p.name)}<div class="mcap"><b>${esc(c.p.name)}</b><small>${money(eff(c.p))} · صورة ${ar(c.i+2)}</small></div></div>`
).join('')}</div></div>`;
}
'''
html = html[:i1] + NEW_STORE + html[i2:]
applied.append('pgStore full replace')

# ============ 7) صفحة المنتج: مقاطع + شارات ============
rep("<span class=\"hint\">· ${p.stock>0?'متوفر ('+ar(p.stock)+')':'نفدت الكمية'}</span>",
    "<span class=\"hint\">· ${p.stock>0?'متوفر ('+ar(p.stock)+')':'نفدت الكمية'}</span>${p.fragile?`<span class=\"hint\" style=\"color:#B3541E;font-weight:800\">· ⚠️ قابل للكسر</span>`:''}${p.temp&&p.temp!=='std'?`<span class=\"hint\" style=\"font-weight:800\">· ${tempTxt(p)}</span>`:''}",
    'product badges')
thumbs = "${p.imgs.length>1?`<div class=\"thumbs\">${p.imgs.map((im,i)=>`<img src=\"${im}\" class=\"${i===(VIEW.gi||0)?'on':''}\" onclick=\"VIEW.gi=${i};render()\" onerror=\"this.onerror=null;this.src='https://picsum.photos/seed/d${hash(im)%997}/200/200'\">`).join('')}</div>`:''}"
rep(thumbs, thumbs + "\n${pvidsBlock(p)}", 'product vids rail')

# ============ 8) السلة: إظهار الإجابات والحرارة ============
rep("${x.ans&&x.ans.length?' · <span style=\"color:var(--grn);font-weight:800\">❓ أسئلة مجابة</span>':''}",
    "${x.ans&&x.ans.length?' · <span style=\"color:var(--grn);font-weight:800\">❓ '+x.ans.map(y=>esc(y.q)+': '+esc(y.a)).join(' · ')+'</span>':''}${p.temp&&p.temp!=='std'?' · <b>'+tempTxt(p)+'</b>':''}",
    'cart ans detail')

# ============ 9) placeOrder: عداد الأثر ============
rep("DB.orders.unshift(o);", "DB.orders.unshift(o);\nimpAdd(o);", 'placeOrder impAdd')

# ============ 10) شكر ما بعد الدفع ============
rep("💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>",
    '''💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>
<div class="impdone">🌟 <b>شكراً لك!</b> باسم طلبك هذا اقتطعت ضمين <b>٠٫٥٠ ر.س من أرباحها</b> — لا من مبلغك ولا من التاجر — واعتمدتها لأعمال الخير.<br><small>إجمالي مساهماتك الخيرية عبر طلباتك بلغ <b>${money(IMP.users[SES.phone]||0)}</b> — تابعها في «حسابي» 🌱</small></div>''',
    'postpay impact msg')

# ============ 11) بيانات الشحنة لشركة الشحن (عميل) ============
rep("${g.logi?logiStrip(o,g):''}", "${g.logi?logiStrip(o,g):''}\n${shipBlock(o,g,gi)}", 'ogroup shipBlock')
SHIP = '''
/* ===== 📋 بيانات الشحنة — تُسلَّم لشركة الشحن ===== */
function shipBlock(o,g,gi){
if(!g.logi||!g.logi.mode||g.logi.mode==='field'||g.logi.mode==='digital')return '';
const cust=USERS[o.customer]||{};
const its=g.items.map(it=>({p:P(it.pid),qty:it.qty})).filter(x=>x.p);
const frag=its.filter(x=>x.p.fragile).map(x=>esc(x.p.name));
const cold=its.filter(x=>x.p.ptype==='chilled'||x.p.temp==='chilled').map(x=>esc(x.p.name));
const hot=its.filter(x=>x.p.ptype==='instant'||x.p.temp==='hot').map(x=>esc(x.p.name));
const sans=(g.ans||[]).map(x=>esc(x.q)+': '+esc(x.a)).join(' · ');
const pans=(g.pans||[]).map(x=>esc(x.pn)+' — '+x.ans.map(y=>esc(y.q)+': '+esc(y.a)).join('، ')).join(' · ');
return `<div class="shipblk">
<div class="spread" style="flex-wrap:wrap"><b style="font-size:12px">📋 بيانات الشحنة — لشركة الشحن (${esc(g.logi.courier)})</b>
<button class="btn gray xs" onclick="shipCopy(${o.id},${gi})">📋 نسخ للشحن</button></div>
<div class="srow2"><span>المستلم</span><b>${esc(cust.name||'عميل ضمين')}${cust.phone?' · '+ar(o.customer):''}</b></div>
<div class="srow2"><span>العنوان</span><b>${esc(o.addr||'—')}</b></div>
<div class="srow2"><span>المسار</span><b>من ${esc(ST(g.store).city||'—')} إلى ${esc(o.city||'—')}${g.logi.wb?' · بوليصة '+ar(g.logi.wb):''}</b></div>
<div class="srow2"><span>الطرود</span><b>${ar(g.items.reduce((a,x)=>a+x.qty,0))} قطعة · ${ar(its.length)} منتج</b></div>
${frag.length?`<div class="srow2"><span>تعليمات التداول</span><b style="color:#B3541E">⚠️ قابل للكسر: ${frag.join('، ')} — تغليف حماية إلزامي</b></div>`:''}
${cold.length?`<div class="srow2"><span>سلسلة التبريد</span><b style="color:#2E6B8A">🧊 مبرد: ${cold.join('، ')} — نقل مبرد إلزامي</b></div>`:''}
${hot.length?`<div class="srow2"><span>التسليم الحار</span><b style="color:#A45A3A">🔥 يُسلَّم ساخناً: ${hot.join('، ')} — حافظات حرارية</b></div>`:''}
${sans?`<div class="srow2"><span>إجابات أسئلة المتجر</span><b>${sans}</b></div>`:''}
${pans?`<div class="srow2"><span>اختيارات العميل للمنتجات</span><b>${pans}</b></div>`:''}
</div>`;
}
function shipCopy(oid,gi){
const o=DB.orders.find(x=>x.id===oid);if(!o)return;const g=o.groups[gi];if(!g||!g.logi)return;
const cust=USERS[o.customer]||{};
const its=g.items.map(it=>({p:P(it.pid),qty:it.qty})).filter(x=>x.p);
const frag=its.filter(x=>x.p.fragile).map(x=>x.p.name);
const cold=its.filter(x=>x.p.ptype==='chilled'||x.p.temp==='chilled').map(x=>x.p.name);
const hot=its.filter(x=>x.p.ptype==='instant'||x.p.temp==='hot').map(x=>x.p.name);
const txt=['بيانات شحنة ضمين — طلب #'+o.id,
'شركة الشحن: '+(g.logi.courier||'—')+(g.logi.wb?' · بوليصة '+g.logi.wb:''),
'المستلم: '+(cust.name||'عميل ضمين')+' · '+o.customer,
'العنوان: '+(o.addr||'—'),
'المسار: من '+(ST(g.store).city||'—')+' إلى '+(o.city||'—'),
'المحتويات: '+its.map(x=>x.qty+'× '+x.p.name).join('، '),
frag.length?'⚠️ قابل للكسر: '+frag.join('، ')+' — تغليف حماية إلزامي':'',
cold.length?'🧊 مبرد: '+cold.join('، ')+' — نقل مبرد إلزامي':'',
hot.length?'🔥 يُسلَّم ساخناً: '+hot.join('، ')+' — حافظات حرارية':'',
(g.ans||[]).map(x=>x.q+': '+x.a).join(' | '),
(g.pans||[]).map(x=>x.pn+' — '+x.ans.map(y=>y.q+': '+y.a).join('، ')).join(' | ')
].filter(Boolean).join('\\n');
const done=()=>toast('نُسخت بيانات الشحنة لتسليمها لشركة الشحن ✓','ok');
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,done);else done();
}
/* ===== شريط البوليصة والتتبع بالحالات ===== */'''
rep('/* ===== شريط البوليصة والتتبع بالحالات ===== */', SHIP, 'shipBlock funcs')

# ============ 12) الملف الشخصي: عداد المساهمات ============
rep('<div class="qtiles">', '${impHero()}\n<div class="qtiles">', 'account impact hero')

# ============ 13) لوحة التاجر: عداد الأثر ============
rep('<div class="kpi grn"><i>⭐</i><b>${ard(s.rt)}</b><span>تقييم المتجر (${ar(s.sales)} عملية)</span></div>',
    '''<div class="kpi grn"><i>⭐</i><b>${ard(s.rt)}</b><span>تقييم المتجر (${ar(s.sales)} عملية)</span></div>
<div class="kpi" style="cursor:pointer" onclick="toast('تقتطع ضمين ٠٫٥٠ ر.س من أرباحها مع كل عملية شراء ناجحة من متجرك — لا من العميل ولا منك','amb')"><i>🌟</i><b>${money(IMP.stores[s.id]||0)}</b><span>أثر مجتمعي من مبيعات متجرك</span></div>''',
    'merchant dash impact kpi')

# ============ 14) الإدارة: KPI + زر + تبويب الوسائط ============
rep('<div class="kpi"><i>👥</i><b>${ar(Object.keys(USERS).length)}</b><span>مستخدم مسجل</span></div>',
    '''<div class="kpi"><i>👥</i><b>${ar(Object.keys(USERS).length)}</b><span>مستخدم مسجل</span></div>
<div class="kpi" style="cursor:pointer" onclick="go('a-stores','media')"><i>🌟</i><b>${money(IMP.total)}</b><span>أثر مجتمعي شفاف (من أرباح ضمين)</span></div>''',
    'admin impact kpi')
rep("<button class=\"btn soft wide mt\" onclick=\"go('a-stores')\">فتح صفحة المتاجر وطلبات التسجيل ←</button>",
    "<button class=\"btn soft wide mt\" onclick=\"go('a-stores')\">فتح صفحة المتاجر وطلبات التسجيل ←</button>\n<button class=\"btn soft wide mt\" onclick=\"go('a-stores','media')\">🎛️ حدود الوسائط الترويجية للمتاجر ←</button>",
    'admin media btn')
rep("const t=['reqs','stores'].includes(VIEW.atab)?VIEW.atab:'stores';ASTT=t;",
    "const t=['reqs','stores','media'].includes(VIEW.atab)?VIEW.atab:'stores';ASTT=t;", 'a-stores tabs var')
rep("${tab('reqs','📋 طلبات التسجيل',pends)}${tab('stores','🏪 جميع المتاجر',STORES.length)}</div>",
    "${tab('reqs','📋 طلبات التسجيل',pends)}${tab('stores','🏪 جميع المتاجر',STORES.length)}${tab('media','🎛️ حدود الوسائط')}</div>",
    'a-stores tab btn')
rep("${t==='reqs'?pgAReqs():pgAStores()}", "${t==='reqs'?pgAReqs():t==='media'?pgAMedia():pgAStores()}", 'a-stores tab render')
rep("toast(s.susp?'أُوقف المتجر مؤقتاً':'أُعيد تشغيل المتجر','ok');render()}",
    '''toast(s.susp?'أُوقف المتجر مؤقتاً':'أُعيد تشغيل المتجر','ok');render()}
/* ===== 🎛️ حدود الوسائط الترويجية — تحددها الإدارة لكل متجر ===== */
function pgAMedia(){
return `<div class="spread" style="margin:2px 0 12px"><b class="fx" style="font-size:14.5px">🎛️ حدود الوسائط الترويجية</b><span class="tag gry">تُطبَّق على منتجات كل متجر</span></div>
<p class="hint mb" style="line-height:1.8">تحدد الإدارة لكل متجر عدد الصور الترويجية وعدد المقاطع المرئية وأقصى مدة لكل مقطع في كل منتج — يلتزم بها التاجر في نموذج إضافة وتعديل المنتجات، وتظهر الوسائط للعملاء داخل صفحة المتجر بشكل أنيق.</p>
<div class="acard"><h3>الحدود الافتراضية (لكل المتاجر)</h3>
<div class="fgrid">
<div class="fld"><label>🖼️ عدد الصور لكل منتج</label><input class="inp" id="amd-imgs" type="number" min="1" max="12" value="${MED.imgs}"></div>
<div class="fld"><label>🎬 عدد المقاطع لكل منتج</label><input class="inp" id="amd-vids" type="number" min="0" max="4" value="${MED.vids}"></div>
<div class="fld"><label>⏱️ أقصى مدة للمقطع (ثانية)</label><input class="inp" id="amd-secs" type="number" min="10" max="300" step="5" value="${MED.secs}"></div>
</div>
<button class="btn sm mt" onclick="aSaveMedDef()">حفظ الحدود الافتراضية</button></div>
<div class="acard mt"><h3>حدود خاصة بكل متجر</h3>
<p class="hint mb">عدّل الأرقام ثم اضغط حفظ — المتجر الذي لا تعدّله يتبع الافتراضي، و«إلغاء الخاص» يعيده للافتراضي.</p>
<div class="rows">
${STORES.map(s=>{const m=medOf(s);const own=!!MED.stores[s.id];
return `<div class="row" style="flex-wrap:wrap;gap:8px">
<div style="flex:1;min-width:140px;display:flex;gap:9px;align-items:center">
<div style="width:36px;height:36px;border-radius:11px;background:${s.color};color:#fff;display:grid;place-items:center;font-weight:800;flex-shrink:0">${s.name[0]}</div>
<div><b style="font-size:12.5px">${esc(s.name)}</b><div class="hint">${own?'حد خاص من الإدارة':'يتبع الافتراضي'}</div></div></div>
<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
<span class="hint">🖼️</span><input class="inp" style="width:62px;padding:8px;text-align:center" id="amd-i-${s.id}" type="number" min="1" max="12" value="${m.imgs}">
<span class="hint">🎬</span><input class="inp" style="width:62px;padding:8px;text-align:center" id="amd-v-${s.id}" type="number" min="0" max="4" value="${m.vids}">
<span class="hint">⏱️ث</span><input class="inp" style="width:70px;padding:8px;text-align:center" id="amd-s-${s.id}" type="number" min="10" max="300" step="5" value="${m.secs}">
${own?`<button class="btn gray xs" onclick="aMedReset('${s.id}')">إلغاء الخاص</button>`:''}
</div></div>`}).join('')}
</div>
<button class="btn sm mt" onclick="aSaveMedStores()">حفظ حدود المتاجر</button></div>`;
}
const medClamp=(v,a,b,d)=>Math.max(a,Math.min(b,Math.round(+v)||d));
function aSaveMedDef(){
MED.imgs=medClamp(($('#amd-imgs')||{}).value,1,12,6);
MED.vids=medClamp(($('#amd-vids')||{}).value,0,4,2);
MED.secs=medClamp(($('#amd-secs')||{}).value,10,300,60);
appSave();toast('حُفظت الحدود الافتراضية للوسائط لكل المتاجر ✓','ok');render();
}
function aSaveMedStores(){
STORES.forEach(s=>{
const vi=$('#amd-v-'+s.id);if(!vi)return;
MED.stores[s.id]={imgs:medClamp(($('#amd-i-'+s.id)||{}).value,1,12,MED.imgs),vids:medClamp(vi.value,0,4,MED.vids),secs:medClamp(($('#amd-s-'+s.id)||{}).value,10,300,MED.secs)};
});
appSave();toast('حُفظت حدود الوسائط الخاصة بكل متجر ✓','ok');render();
}
function aMedReset(sid){delete MED.stores[sid];appSave();toast('أُلغي الحد الخاص — المتجر يتبع الافتراضي الآن','ok');render()}''',
    'pgAMedia funcs')

# ============ 15) نموذج منتج التاجر: وسائط + قابل للكسر + حرارة ============
rep("MPQOPEN=false;\nopenModal(",
    "MPQOPEN=false;\nMIMGS=p&&p.imgs?p.imgs.slice():[];\nMVIDS=p&&p.vids?JSON.parse(JSON.stringify(p.vids)):[];\nconst med=medOf(s);\nopenModal(",
    'mProdForm init media')
rep('''<button class="btn soft sm mt" onclick="mAddQ2()">＋ إضافة سؤال للمنتج</button>
</div>''',
    '''<button class="btn soft sm mt" onclick="mAddQ2()">＋ إضافة سؤال للمنتج</button>
</div>
<div class="fgrid mt">
<div class="fld"><label>⚠️ هل المنتج قابل للكسر؟</label>
<select class="inp" id="mp-frag2">
<option value="0" ${!p||!p.fragile?'selected':''}>لا — تغليف عادي</option>
<option value="1" ${p&&p.fragile?'selected':''}>نعم — قابل للكسر: علامة آلية لشركة الشحن + تغليف حماية ورسوم ١٥ ر.س ضمن الشحن</option>
</select></div>
<div class="fld"><label>🌡️ الحالة الحرارية للمنتج</label>
<select class="inp" id="mp-temp">
<option value="std" ${!p||!p.temp||p.temp==='std'?'selected':''}>🌡️ عادي — بلا تحكم حراري</option>
<option value="chilled" ${p&&p.temp==='chilled'?'selected':''}>🧊 مبرد — سلسلة تبريد إلزامية للتوصيل</option>
<option value="hot" ${p&&p.temp==='hot'?'selected':''}>🔥 ساخن — يُجهَّز ويُسلَّم ساخناً بحافظات حرارية</option>
</select></div>
</div>
<div class="acard mt" style="padding:13px;background:#1D443206">
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
</div>''',
    'mProdForm media card')
rep('''<div class="mt" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
<button class="btn soft sm" onclick="mPickImg()">📷 رفع صورة من جهازي</button>
<button class="btn gray sm" onclick="mAutoImg()">🎲 صورة تلقائية</button>
<img id="mp-prev" src="${p?p.imgs[0]:''}" style="width:54px;height:54px;border-radius:12px;object-fit:cover;border:1px solid var(--line);${p?'':'display:none'}">
</div>
''', '', 'remove old picker')
rep("MIMG=p?p.imgs[0]:'';\nptsCostPrev();", "ptsCostPrev();", 'remove MIMG init')

# دوال الوسائط الجديدة بدل القديمة
OLD_IMG = '''let MIMG='';
function mPickImg(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{MIMG=rd.result;$('#fup').value='';
const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('جهزت الصورة ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click();}
function mAutoImg(){MIMG=ZPOOL[Math.floor(Math.random()*ZPOOL.length)];const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('اختيرت صورة تلقائية','ok')}'''
NEW_IMG = '''let MIMGS=[],MVIDS=[];
function mpImgsHTML(med){
if(!MIMGS.length)return '<div class="hint" style="padding:3px 0 5px">لا صور بعد — أول صورة ترفعها تكون الغلاف الرئيسي للمنتج.</div>';
return `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:6px">${MIMGS.map((im,i)=>`<div class="mpthumb">${i===0?'<span class="cover">غلاف</span>':''}<img src="${im}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/dmg${i}/200/200'"><button onclick="mImgDel(${i})" title="حذف">✕</button></div>`).join('')}</div>`;
}
function mpImgsRefresh(med){const el=$('#mpimgs');if(el)el.innerHTML=mpImgsHTML(med||medOf(myStore()))}
function mImgDel(i){MIMGS.splice(i,1);mpImgsRefresh(medOf(myStore()))}
function mImgPick(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{$('#fup').value='';
const med=medOf(myStore());
if(MIMGS.length>=med.imgs){toast('بلغت حد '+ar(med.imgs)+' صور المحدد من الإدارة','err');return}
MIMGS.push(rd.result);mpImgsRefresh(med);toast('أُضيفت الصورة ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click();}
function mImgAuto(){const med=medOf(myStore());
if(MIMGS.length>=med.imgs){toast('بلغت حد '+ar(med.imgs)+' صور المحدد من الإدارة','err');return}
MIMGS.push(ZPOOL[Math.floor(Math.random()*ZPOOL.length)]);mpImgsRefresh(med);toast('أُضيفت صورة تلقائية ('+ar(MIMGS.length)+'/'+ar(med.imgs)+') ✓','ok')}
function mpVidsHTML(med){
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
function mpVidsRefresh(med){const el=$('#mpvids');if(el)el.innerHTML=mpVidsHTML(med||medOf(myStore()))}
function mVidDel(i){MVIDS.splice(i,1);mpVidsRefresh(medOf(myStore()))}
function mVidAdd(){
const med=medOf(myStore());
if(MVIDS.length>=med.vids){toast('بلغت حد '+ar(med.vids)+' مقاطع المحدد من الإدارة','err');return}
const src=($('#mv-url')||{}).value||'';
if(!/^https?:\\/\\/.+/i.test(src.trim())){toast('ألصق رابط مقطع صحيحاً يبدأ بـ http','err');return}
if(MVIDS.some(v=>v.src===src.trim())){toast('هذا المقطع مضاف مسبقاً','err');return}
MVIDS.push({src:src.trim(),dur:0,bad:false});
mpVidsRefresh(med);
mVidProbe(MVIDS.length-1);
}
function mVidProbe(i){
const v=MVIDS[i];if(!v)return;const med=medOf(myStore());
toast('جارٍ فحص المقطع من مصدره…','amb');
probeVid(v.src,secs=>{
if(secs==null){v.dur=0;v.bad=false;mpVidsRefresh(med);toast('تعذّر قراءة المدة تلقائياً — تأكد من رابط MP4 مباشر، ويُسمح بالحفظ وتبقى المدة غير محددة','amb');return}
v.dur=Math.round(secs);
if(secs>med.secs+0.5){v.bad=true;mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' تتجاوز حد الإدارة '+ar(med.secs)+' ثانية — اختصر المقطع أو احذفه','err');return}
v.bad=false;mpVidsRefresh(med);toast('مدة المقطع '+durTxt(secs)+' — ضمن الحد ✓','ok');
});
}
function probeVid(url,cb){
let done=false;const fin=v=>{if(done)return;done=true;cb(v)};
try{const v=document.createElement('video');v.preload='metadata';
v.onloadedmetadata=()=>fin(v.duration||null);
v.onerror=()=>fin(null);
v.src=url;setTimeout(()=>fin(v.duration||null),3500);
}catch(e){fin(null)}
}'''
rep(OLD_IMG, NEW_IMG, 'media functions')

# mSaveProd: قراءة الحقول الجديدة والتحقق
rep("if(!['chilled','instant'].includes(ptypeVal))ptypeVal='std';\n}",
    '''if(!['chilled','instant'].includes(ptypeVal))ptypeVal='std';
}
fragile=fragile||($('#mp-frag2')&&$('#mp-frag2').value==='1');
const tempv=$('#mp-temp')?$('#mp-temp').value:'std';
const med=medOf(s);
if(MVIDS.length>med.vids){toast('عدد المقاطع ('+ar(MVIDS.length)+') يتجاوز حد الإدارة '+ar(med.vids)+' — احذف الزائد','err');return}
if(MVIDS.some(v=>v.bad)){toast('في مقاطع تتجاوز مدتها حد الإدارة '+ar(med.secs)+' ثانية — اختصرها أو احذفها','err');return}
let imgs=MIMGS.slice(0,med.imgs);
if(!imgs.length)imgs=[ZPOOL[Math.floor(Math.random()*ZPOOL.length)]];''',
    'mSaveProd universal fields')
rep("customOk,qs:MPQ.map(x=>({...x}))});", "customOk,temp:tempv,qs:MPQ.map(x=>({...x}))});", 'mSaveProd assign temp')
rep("if(MIMG)p.imgs=[MIMG,...p.imgs.slice(1)];",
    "p.imgs=imgs;p.vids=MVIDS.map(v=>({src:v.src,dur:Math.round(v.dur||0)}));",
    'mSaveProd imgs/vids')
rep("imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],desc:",
    "imgs:imgs,vids:MVIDS.map(v=>({src:v.src,dur:Math.round(v.dur||0)})),temp:tempv,desc:",
    'mSaveProd new product')

# ============ 16) بطاقات منتجات التاجر: شارات جديدة ============
rep("${p.fragile?'<span class=\"mpstat\" style=\"color:#B3541E\">⚠️ قابل للكسر</span>':''}${p.customOk?'<span class=\"mpstat\" style=\"color:#A45A3A\">✏️ تعديلات</span>':''}",
    "${p.fragile?'<span class=\"mpstat\" style=\"color:#B3541E\">⚠️ قابل للكسر</span>':''}${p.temp==='chilled'?'<span class=\"mpstat\" style=\"color:#2E6B8A\">🧊 مبرد</span>':p.temp==='hot'?'<span class=\"mpstat\" style=\"color:#A45A3A\">🔥 ساخن</span>':''}${p.vids&&p.vids.length?'<span class=\"mpstat\" style=\"color:#50489E\">🎬 '+ar(p.vids.length)+'</span>':''}${p.customOk?'<span class=\"mpstat\" style=\"color:#A45A3A\">✏️ تعديلات</span>':''}",
    'mpstats badges')

# ============ 17) طلبات التاجر: بيانات الشحن ============
rep("' — بلا بوليصة (خدمة ميدانية)'} · من ${esc(ST(g.store).city||'—')} إلى ${esc(o.city||'—')}</div>`:''}",
    "' — بلا بوليصة (خدمة ميدانية)'} · من ${esc(ST(g.store).city||'—')} إلى ${esc(o.city||'—')}</div>`:''}\n${shipBlock(o,g,gi)}",
    'merchant orders shipBlock')

# ============ 18) إعدادات المتجر: عرض الحدود ============
rep("const own=USERS[s.owner];", "const own=USERS[s.owner];\nconst med=medOf(s);", 'mset med var')
rep('<div class="setrow"><div class="ic">💰</div><div class="tx"><b>المحفظة</b>',
    '''<div class="setrow"><div class="ic">🎬</div><div class="tx"><b>الوسائط الترويجية — حدود الإدارة لمتجرك</b><span>حتى ${ar(med.imgs)} صور و${ar(med.vids)} مقاطع بمدة ${ar(med.secs)} ثانية للمقطع، لكل منتج</span></div><span class="tag gry">من الإدارة</span></div>
<div class="setrow"><div class="ic">💰</div><div class="tx"><b>المحفظة</b>''',
    'mset media row')

# ============ 19) الاسترجاع: خصم العداد ============
rep("const own=ST(g.store).owner;if(own)pushNotif(own,'↩️','استرجاع مبلغ شحنة','حكم التحكيم لطلب #'+ar(o.id)+': استرجاع كامل المبلغ للعميل',['m-disputes']);\n}",
    "const own=ST(g.store).owner;if(own)pushNotif(own,'↩️','استرجاع مبلغ شحنة','حكم التحكيم لطلب #'+ar(o.id)+': استرجاع كامل المبلغ للعميل',['m-disputes']);\nimpRefund(o,g);\n}",
    'doRefund impRefund')

# ============ 20) الحفظ والاستعادة ============
rep('''function appSave(){try{localStorage.setItem('dameen_v1',JSON.stringify({ses:SES,cart:CART,gfav:GFav}))}catch(e){}}
function appRestore(){try{
const d=JSON.parse(localStorage.getItem('dameen_v1')||'null');if(!d)return;
if(d.ses&&d.ses.phone&&USERS[d.ses.phone]&&!USERS[d.ses.phone].pend&&!USERS[d.ses.phone].rejected){
const u=USERS[d.ses.phone];SES={phone:d.ses.phone,role:u.role,store:u.store||null};
if(SES.role==='merchant'){const own=STORES.find(x=>x.owner===SES.phone);SES.store=own?own.id:SES.store}}
CART=(d.cart||[]).filter(c=>c&&P(c.pid)&&c.qty>0).map(c=>({pid:c.pid,qty:Math.min(c.qty,P(c.pid).stock)}));
GFav=(d.gfav||[]).filter(x=>x&&P(x));
}catch(e){}}''',
    '''function appSave(){try{localStorage.setItem('dameen_v1',JSON.stringify({ses:SES,cart:CART,gfav:GFav,med:MED,imp:IMP}))}catch(e){}}
function appRestore(){try{
const d=JSON.parse(localStorage.getItem('dameen_v1')||'null');
if(d){
if(d.ses&&d.ses.phone&&USERS[d.ses.phone]&&!USERS[d.ses.phone].pend&&!USERS[d.ses.phone].rejected){
const u=USERS[d.ses.phone];SES={phone:d.ses.phone,role:u.role,store:u.store||null};
if(SES.role==='merchant'){const own=STORES.find(x=>x.owner===SES.phone);SES.store=own?own.id:SES.store}}
CART=(d.cart||[]).filter(c=>c&&P(c.pid)&&c.qty>0).map(c=>({pid:c.pid,qty:Math.min(c.qty,P(c.pid).stock),ans:c.ans||[]}));
GFav=(d.gfav||[]).filter(x=>x&&P(x));
if(d.med)MED=Object.assign({imgs:6,vids:2,secs:60,stores:{}},d.med);
if(d.imp)IMP=Object.assign({total:0,n:0,users:{},stores:{}},d.imp);
}
if(!d||!d.imp)impSeed();
}catch(e){}}''',
    'appSave/appRestore')

io.open(P, 'w', encoding='utf-8').write(html)
print('OK — %d edits applied, size %d -> %d bytes' % (len(applied), orig_len, len(html)))
for a in applied: print(' ✓', a)
