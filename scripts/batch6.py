# -*- coding: utf-8 -*-
"""تعديلات الدفعة ٦-٧ على dameen.html: المحفظة، الإعدادات، الإدارة، المتجر، المنتج، الرئيسية، الأسئلة الشائعة"""
import re, io, sys

PATH = '/home/z/my-project/download/dameen.html'
src = io.open(PATH, encoding='utf-8').read()
fails = []

def rep(old, new, label, count=1):
    global src
    n = src.count(old)
    if n != count:
        fails.append(f'[{label}] found {n} expected {count}')
        print(f'FAIL {label}: found {n}')
        return
    src = src.replace(old, new)
    print(f'OK   {label}')

# ---------- 1) المحفظة: (myLogi وKPI مُطبّقان مسبقاً في الملف مباشرة) ----------

# (KPI اللوجستي مُطبّق مسبقاً)
old_split = re.search(r'<div class="acard mt"><h3>⚙️ كيف ينقسم.*?</p></div>', src, re.S)
if not old_split:
    fails.append('wallet-split-card not found'); print('FAIL wallet-split-card')
else:
    new_split = ('<div class="acard mt"><h3>⚙️ كيف يتوزع كل مبلغ محرَّر؟ (توزيع ثلاثي لحظي)</h3>\n'
    '<div class="splitbar"><i class="net"></i><i class="comm"></i></div>\n'
    '<div class="splitrow"><span><b style="color:var(--grn)">■</b> صافي المتجر ٩٧٫٥٪ ← محفظتك مباشرة</span>'
    '<span><b style="color:var(--amb)">■</b> عمولة الإدارة ٢٫٥٪ ← حساب التطبيق</span>'
    '<span><b style="color:var(--navy)">■</b> رسوم الشحن ← حساب الشريك اللوجستي</span></div>\n'
    '<p class="hint mt" style="line-height:1.9">عند تحرير أي شحنة يتوزع المبلغ ثلاثياً لحظياً: <b>صافي حقك</b> يدخل رصيدك المتاح، و<b>عمولة ضمين ٢٫٥٪</b> تتحول لحساب التطبيق، و<b>رسوم الشحن</b> (ما دفعه العميل + ما تدعمه أنت من توصيل مجاني أو مناصفة أو سقف مجاني) تتحول لحساب الشريك اللوجستي (OTO/Torod) — ودعمك للشحن يُقتطع من صافيك فقط ولا يمس العمولة أبداً.</p></div>')
    src = src[:old_split.start()] + new_split + src[old_split.end():]
    print('OK   wallet-split-card')

rep('<h3>🔓 سجل التحريرات (كل تحرير بشطره: صافيك + عمولة الإدارة)</h3>',
    '<h3>🔓 سجل التحريرات (كل تحرير بتوزيعه: صافيك + العمولة + الشحن)</h3>',
    'wallet-log-h3')

m = re.search(r'<div class="hint" style="color:var\(--amb2\)">− \$\{money\(g\.payout\.comm\)\} عمولة الإدارة [^<]*</div>', src)
if not m:
    fails.append('wallet-ship-row not found'); print('FAIL wallet-ship-row')
else:
    ship_line = ('\n${g.payout.ship&&(g.payout.ship.charge||g.payout.ship.merchant)?`<div class="hint" style="color:var(--navy)">🚚 شحن: ${money(g.payout.ship.charge||0)} من العميل${g.payout.ship.merchant?\' + \'+money(g.payout.ship.merchant)+\' دعمك\':\'\'} ← اللوجستي</div>`:\'\'}')
    src = src[:m.end()] + ship_line + src[m.end():]
    print('OK   wallet-ship-row')

# ---------- 2) إعدادات التاجر: بطاقات الموقع + الشحن + الأسئلة ----------
CARDS = '''<div class="acard"><h3>📍 موقع المتجر — حماية من الالتفاف</h3>
<div class="fld"><label>مدينة النشاط (الوحيدة الظاهرة للعملاء)</label>
<select class="inp" id="ms-city">${CITIES.map(c=>`<option ${s.city===c?'selected':''}>${c}</option>`).join('')}</select></div>
<div class="fld mt"><label>الحي والشارع (محجوب دائماً عن العملاء)</label><input class="inp" id="ms-area" value="${esc(s.area||'')}" placeholder="مثال: حي الياسمين، شارع الأمير سلطان"></div>
<p class="hint mt" style="line-height:1.8">🔒 ما يراه العميل: <b>📍 ${esc(s.city)}</b> فقط — العنوان التفصيلي يُنقل داخل السيرفر إلى شريك الشحن لإصدار البوليصة دون أن يظهر في أي واجهة، ولا يوجد استلام شخصي «يد بيد» في ضمين، والتتبع بالحالات فقط.</p>
<button class="btn mt sm" onclick="mSaveLoc()">حفظ الموقع</button>
</div>
<div class="acard"><h3>🚚 خيارات التوصيل وسقف الشحن المجاني</h3>
<div class="fld"><label>من يتحمل رسوم التوصيل؟</label>
<select class="inp" id="ms-dlm">
<option value="customer" ${s.dlMode==='customer'?'selected':''}>توصيل على العميل (١٠٠٪)</option>
<option value="half" ${s.dlMode==='half'?'selected':''}>توصيل مناصفة (٥٠٪ عليك / ٥٠٪ على العميل)</option>
<option value="free" ${s.dlMode==='free'?'selected':''}>توصيل مجاني (١٠٠٪ عليك)</option>
</select></div>
<div class="fld mt"><label>سقف الشحن المجاني — أدنى قيمة طلب (ر.س، 0 = معطَّل)</label><input class="inp" id="ms-fmin" type="number" min="0" value="${s.freeMin||0}"></div>
<p class="hint mt" style="line-height:1.8">⚖️ ما تتحمله من رسوم الشحن يُقتطع من <b>صافيك فقط</b> لحظة التحرير — ولا يمس عمولة المنصة (٢٫٥٪) أبداً، ويُحوَّل كاملاً لحساب الشريك اللوجستي. ويرى العميل شريط تقدم في سلة التسوق يشجعه على بلوغ سقفك.</p>
<button class="btn mt sm" onclick="mSaveShip()">حفظ خيارات التوصيل</button>
</div>
${sec.id==='family'?`<div class="acard"><h3>❓ أسئلة متجري عند الطلب</h3>
<p class="hint mb" style="line-height:1.8">أضف أسئلة تناسب مطبخك — تظهر للعميل عند إتمام الطلب وتصلك إجاباته مع الشحنة (متاحة لقسم المأكولات والضيافة).</p>
${(s.qs||[]).map((q,i)=>`<div class="setrow"><div class="ic">❓</div><div class="tx"><b>${esc(q)}</b><span>سؤال رقم ${ar(i+1)} — يظهر للعميل عند الطلب</span></div><button class="btn gray xs" onclick="mDelQ(${i})">حذف</button></div>`).join('')||'<div class="hint mb">لا أسئلة بعد</div>'}
<div class="fld mt"><label>سؤال جديد</label><input class="inp" id="ms-q" placeholder="مثال: هل تريد الكيكة بالكريمة أم بالتمر؟"></div>
<button class="btn soft sm mt" onclick="mAddQ()">＋ إضافة السؤال</button>
</div>`:''}'''

anchor_ms = "onclick=\"go('m-wallet')\">السجل</button></div>\n</div>\n</div>\n</div>`;"
rep(anchor_ms,
    "onclick=\"go('m-wallet')\">السجل</button></div>\n</div>\n" + CARDS + "</div>\n</div>`;",
    'mset-cards')

FUNCS = '''
function mSaveLoc(){const s=myStore();s.city=$('#ms-city').value;s.area=($('#ms-area').value||'').trim();toast('حُفظ الموقع — يظهر للعملاء مدينة النشاط فقط ✓','ok');render()}
function mSaveShip(){const s=myStore();s.dlMode=$('#ms-dlm').value;s.freeMin=Math.max(0,Math.round(+($('#ms-fmin').value||0)));toast('حُفظت خيارات التوصيل ✓','ok');render()}
function mAddQ(){const v=($('#ms-q').value||'').trim();if(v.length<3){toast('اكتب سؤالاً أوضح','err');return}const s=myStore();s.qs=s.qs||[];s.qs.push(v);toast('أُضيف السؤال — سيظهر للعملاء عند الطلب ✓','ok');render()}
function mDelQ(i){const s=myStore();s.qs.splice(i,1);toast('حُذف السؤال');render()}'''

rep("s.name=nm;s.desc=($('#ms-ds').value||'').trim();\ntoast('حُفظت بيانات متجرك ✓','ok');render()}",
    "s.name=nm;s.desc=($('#ms-ds').value||'').trim();\ntoast('حُفظت بيانات متجرك ✓','ok');render()}\n" + FUNCS,
    'mset-funcs')

# ---------- 3) الخزنة تشمل الشحن ----------
rep("const vaultNow=()=>r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g)=>x+g.sub+g.dl,0),0));",
    "const vaultNow=()=>r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g)=>x+g.sub+((g.ship&&g.ship.charge)||(g.dl||0)),0),0));",
    'vault-now')

# ---------- 4) الإدارة: مراقبة المحادثات ----------
MONITOR = '''<div class="acard mt"><h3>💬 مراقبة محادثات الطلبات <span id="vtot"></span></h3>
<p class="hint mb">محادثات العميل × التاجر مرتبطة بالطلب — تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً، وتُحذف المحادثة بعد ٣ مخالفات مع تنبيه فوري للإدارة.</p>
<div class="rows" id="chatmon"></div></div>
<script>/*fill*/</script>'''
# ندمج بطاقة المراقبة عبر دالة JS داخل pgAOver نفسها بدل سكربت منفصل
MONITOR_JS = '''<div class="acard mt"><h3>💬 مراقبة محادثات الطلبات ${vTot?`<span class="tag red">${ar(vTot)} مخالفة محجوبة</span>`:'<span class="tag grn">بلا مخالفات</span>'}</h3>
<p class="hint mb">محادثات العميل × التاجر مرتبطة بالطلب — تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً، وتُحذف المحادثة بعد ٣ مخالفات مع تنبيه فوري للإدارة.</p>
<div class="rows">${chats.slice(0,5).map(({o,g,gi})=>{const last=[...(g.chat||[])].reverse().find(m=>m.r!=='sys');
return `<div class="row" style="cursor:pointer" onclick="openOChat(${o.id},${gi})">
<div style="flex:1;min-width:0"><b>طلب #${ar(o.id)} · ${ST(g.store).name} × ${USERS[o.customer]?esc(USERS[o.customer].name.split(' ')[0]):'عميل'}</b>
<div class="hint">${last?esc(last.t.slice(0,60))+(last.t.length>60?'…':''):'—'} · ${ar((g.chat||[]).length)} رسالة${g.chatDeleted?' · ⛔ محذوفة لمخالفة':g.chatArchived?' · 🗄️ مؤرشفة':''}</div></div>
${(g.viol&&(g.viol.customer+g.viol.merchant))?`<span class="tag red">${ar(g.viol.customer+g.viol.merchant)} 🚫</span>`:'<span class="tag grn">سليمة</span>'}</div>`}).join('')||'<div class="hint">لا محادثات طلبات بعد</div>'}</div></div>'''

anchor_aover = "||'<div class=\"hint\">لا متاجر معلقة</div>'}\n</div></div>`;"
rep(anchor_aover,
    "||'<div class=\"hint\">لا متاجر معلقة</div>'}\n</div></div>\n" + MONITOR_JS + "`;",
    'aover-monitor')

# بيانات المراقبة أعلى الدالة
rep("function pgAOver(){\nconst open=DB.disputes.filter(d=>d.status==='open');",
    "function pgAOver(){\nconst open=DB.disputes.filter(d=>d.status==='open');\n"
    "const chats=[];DB.orders.forEach(o=>o.groups.forEach((g,gi)=>{if(g.chat&&g.chat.length)chats.push({o,g,gi})}));\n"
    "chats.sort((a,b)=>(((b.g.chat||[]).slice(-1)[0]||{}).at||0)-(((a.g.chat||[]).slice(-1)[0]||{}).at||0));\n"
    "const vTot=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g)=>x+(g.viol?g.viol.customer+g.viol.merchant:0),0),0);",
    'aover-data')

# ---------- 5) إيرادات الإدارة: لوجستيات + ضريبة ----------
rep('<div class="kpi amb"><i>🌟</i><b>${money(DB.aPtsWallet||0)}</b><span>محفظة الإدارة من تمويل النقاط</span></div>\n</div>',
    '<div class="kpi amb"><i>🌟</i><b>${money(DB.aPtsWallet||0)}</b><span>محفظة الإدارة من تمويل النقاط</span></div>\n'
    '<div class="kpi nvy"><i>🚚</i><b>${money(DB.logiWallet||0)}</b><span>حساب الشريك اللوجستي (OTO/Torod)</span></div>\n'
    '<div class="kpi"><i>🧾</i><b>${money(DB.vat||0)}</b><span>ضريبة القيمة المضافة المحصلة (١٥٪)</span></div>\n</div>',
    'arev-kpis')

# ---------- 6) المدينة في واجهات المتجر والمنتج ----------
rep('<span>★ ${ard(s.rt)} تقييم المتجر</span><span>·</span>',
    '<span>📍 ${esc(s.city||\'—\')}</span><span>·</span><span>★ ${ard(s.rt)} تقييم المتجر</span><span>·</span>',
    'store-city')

rep("<span class=\"mr\">★ ${ard(s.rt)} · ${ar(n)} منتج",
    "<span class=\"mr\">★ ${ard(s.rt)} · 📍 ${esc(s.city||'')} · ${ar(n)} منتج",
    'mstore-city')

rep('★ ${ard(s.rt)} · شحنة ضمن ${sec.win} حماية</div>',
    '★ ${ard(s.rt)} · شحنة ضمن ${sec.win} حماية · يشحن من 📍 ${esc(s.city||\'—\')}</div>',
    'product-city')

# ---------- 7) شارة طريقة التوصيل في صفحة المنتج ----------
DLB = '''
function dlBadge(p){
const t=p.ptype||'std';
const M={chilled:{ic:'🧊',l:'توصيل مبرد — حساس للحرارة',d:'يُجدول النظام تلقائياً توصيلاً مبرداً مع أقرب شركة متعاقدة بعد تأكيد الطلب.'},
instant:{ic:'🛵',l:'توصيل فوري',d:'يبحث النظام عن مندوب فوري فور تأكيد الطلب — التسليم المتوقع خلال ٤٥ دقيقة.'},
field:{ic:'🎪',l:'خدمة ديكور وتنسيق ميداني',d:'توصيل وتركيب وفك بفريق المتجر — مع حجز موعد مناسبتك ومشاركة موقعها (GPS) عند الطلب.'},
ship:{ic:'📦',l:'قابل للشحن',d:'تُصدر له بوليصة آلية عبر شركاء ضمين اللوجستيين (OTO/Torod).'}};
const m=M[t];if(!m)return '';
return `<div style="display:flex;gap:10px;align-items:flex-start;background:var(--card2);border:1px dashed var(--line);border-radius:12px;padding:9px 12px;margin-bottom:9px"><span style="font-size:18px">${m.ic}</span><div><b style="font-size:12px">${m.l}</b><div class="hint">${m.d}</div>${p.giftOk?'<div class="hint" style="color:var(--amb2);font-weight:700">🎁 قابل للإهداء — أضف اسم المستلم وجواله عند إتمام الطلب</div>':''}</div></div>`;
}'''
rep('let QTY=1;', 'let QTY=1;' + DLB, 'dlbadge-func')

pts_line = "${p.pts?`<div class=\"hint\" style=\"color:var(--amb2);font-weight:700;margin-bottom:10px\">🌟 يمنح هذا المنتج ${ar(p.pts)} نقطة ولاء للعميل عند تحرير الطلب</div>`:'<div style=\"height:6px\"></div>'}"
rep(pts_line, pts_line + '\n${dlBadge(p)}', 'product-dlbadge')

# ---------- 8) شارات النوع في بطاقات منتجات التاجر ----------
rep('<span class="mpstat" style="color:var(--amb2)">★ ${ard(p.rt)}</span>\n</div>',
    '<span class="mpstat" style="color:var(--amb2)">★ ${ard(p.rt)}</span>\n'
    "${p.ptype==='chilled'?'<span class=\"mpstat\" style=\"color:#2E6B8A\">🧊 مبرد</span>':p.ptype==='instant'?'<span class=\"mpstat\" style=\"color:var(--amb2)\">🛵 فوري</span>':p.ptype==='field'?'<span class=\"mpstat\" style=\"color:#A45A3A\">🎪 ميداني</span>':p.ptype==='ship'?'<span class=\"mpstat\">📦 شحن</span>':''}${p.giftOk?'<span class=\"mpstat\" style=\"color:var(--red)\">🎁 إهداء</span>':''}\n</div>",
    'mprods-badges')

# ---------- 9) شرائح الثقة في الرئيسية ----------
rep('تحكيم ثلاثي الأطراف</span></div>',
    'تحكيم ثلاثي الأطراف</span><span class="tchip"><i>🚚</i> شحن آلي عبر OTO وTorod</span><span class="tchip"><i>💳</i> مدى وApple Pay وتقسيط تابي وتمارا</span></div>',
    'home-chips')

# ---------- 10) الأسئلة الشائعة ----------
FAQ_NEW = """['كيف تُحسب رسوم الشحن؟','ديناميكياً من مدينة كل متجر إلى مدينتك عبر شركاء ضمين اللوجستيين (OTO/Torod) — ولكل متجر خياراته: توصيل على العميل أو مناصفة أو مجاني، مع سقف شحن مجاني لكل متجر يظهر كشريط تقدم في السلة.'],
['هل يوجد استلام شخصي «يد بيد» من المتجر؟','لا — ملغي كلياً في ضمين: كل شحنة تُصدر لها بوليصة آلية ويُتابع الطلب بالحالات فقط (بلا خريطة مباشرة) حفاظاً على خصوصية الطرفين.'],
['لماذا أرى مدينة المتجر فقط دون حيّه؟','حمايةً من التواصل خارج التطبيق: يظهر للمتاجر مدينة نشاطها فقط، والعنوان التفصيلي يبقى في السيرفر ويُرسل للشريك اللوجستي لإصدار البوليصة دون أن يظهر لك.'],
['كيف أراسل المتجر؟','من صفحة طلباتي — محادثة مرتبطة بالطلب تخضع لفلترة أمنية: أي رقم جوال أو رابط أو وسيلة تواصل خارجية (واتساب/سناب/انستقرام…) تُحجب فوراً مع تنبيه الطرفين والإدارة، وتُحذف المحادثة بعد ٣ مخالفات.'],
['ما طرق الدفع والتقسيط؟','مدى وApple Pay والفيزا/ماستركارد عبر بوابات معتمدة (Moyasar/HyperPay)، والتقسيط عبر تابي (٤ دفعات) وتمارا (٣ دفعات) على إجمالي الفاتورة: المنتجات + الشحن + الضريبة ١٥٪.']];"""
rep("['هل يمكن الدفع من المحفظة؟','نعم — مبالغ الاسترجاع تضاف لمحفظة ضمين وتستخدمها كوسيلة دفع مباشرة.']];",
    "['هل يمكن الدفع من المحفظة؟','نعم — مبالغ الاسترجاع تضاف لمحفظة ضمين وتستخدمها كوسيلة دفع مباشرة.']," + "\n" + FAQ_NEW,
    'faq-add')

if fails:
    print('\n===== FAILURES =====')
    for f in fails: print(f)
    sys.exit(1)
io.open(PATH, 'w', encoding='utf-8').write(src)
print('\nALL EDITS APPLIED:', len(src), 'chars')
