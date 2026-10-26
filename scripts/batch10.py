#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الدفعة ١٠ — عالم الألعاب والأجهزة والمنتجات الرقمية + لوجستيات الشحن الخاصة + كوبونات + OTP الميداني + المكتبة الرقمية + دردشة التعديلات والموقع
١) قسم رابع: أجهزة ملموسة (قياسي/قابل للكسر) وأصول رقمية (كود/ملف) بتسليم فوري
٢) ديكورات المناسبات: خيار بلا توصيل (استلام من المقر) + فتح دردشة بعد الدفع + مشاركة الموقع
٣) الهدايا: تعديلات حسب طلب العميل + طلب مبالغ إضافية من التاجر + إهداء بجوال ومدينة فقط
٤) لوجستيات: قابل للكسر (+١٥ ر.س ومنقول لشركة الشحن) · حار وطازج (نطاق داخل المدينة فقط) · مبرد (مندوب حافظة/بين المدن)
٥) كوبونات: لكل تاجر + كوبون شامل من الإدارة
٦) OTP لإتمام الخدمات الميدانية قبل صرف المستحقات + إقرار الملكية الفكرية للرقميات
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

GSEC='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/68dae69f3198.webp'
S9='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/28b3519cc57c.jpg'
S10='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8eac332529c2.png'
P25='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/308769bd3796.jpg'
P25b='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f9d9fe61140.jpg'
P26='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e861dc8f6341.png'
P26b='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5bd6ab3c9322.png'
P27='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/04fd480125c5.jpg'
P27b='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ddc9c999a9d.jpg'
P28='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e28496a66dff.jpg'
P28b='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4e591ed2c48b.png'
P29='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2fb50ac6678a.jpg'
P30='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/160a70aabe91.jpg'
P31='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/06fdd0b9a622.jpg'
P32='https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1f1482a46bbb.jpg'

print('== A. البيانات: القسم الرابع + المتاجر + المنتجات ==')

# A1: SECTIONS — القسم الرابع
rep("""{id:'deco',name:'عالم الهدايا والديكور والمناسبات',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'هدايا وديكور وتنسيق مناسبات ميداني',img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0dcd6b176ac1.jpg'}];""",
"""{id:'deco',name:'عالم الهدايا والديكور والمناسبات',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'هدايا وديكور وتنسيق مناسبات ميداني',img:'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0dcd6b176ac1.jpg'},
{id:'gaming',name:'عالم الألعاب والأجهزة والمنتجات الرقمية',icon:'🎮',color:'#50489E',winMin:180,win:'٣ ساعات',desc:'أجهزة ألعاب وملحقات وأصول رقمية بتسليم فوري',img:'"""+GSEC+"""'}];""",
'SECTIONS: إضافة عالم الألعاب والأجهزة والرقميات')

# A2: CATS
rep("deco:[{n:'ديكور',comm:2.5},{n:'هدايا',comm:2.5},{n:'قهوة وضيافة',comm:2.5},{n:'تنسيق مناسبات',comm:2.5}]};",
"deco:[{n:'ديكور',comm:2.5},{n:'هدايا',comm:2.5},{n:'قهوة وضيافة',comm:2.5},{n:'تنسيق مناسبات',comm:2.5}],gaming:[{n:'أجهزة وملحقات',comm:3},{n:'ألعاب رقمية وأكواد',comm:1.5},{n:'اشتراكات رقمية',comm:1.5},{n:'كتب وثيمات رقمية',comm:1}]};",
'CATS: تصنيفات عالم الألعاب بعمولاتها')

# A3: STORES — متجرا القسم الجديد
rep("""qs:['هل لديك حساسية من أي مكسرات؟','الكريمة أم التمر على الكيكة؟','وقت التسليم المفضل لديك؟']}];""",
"""qs:['هل لديك حساسية من أي مكسرات؟','الكريمة أم التمر على الكيكة؟','وقت التسليم المفضل لديك؟']},
{id:'s9',name:'قيمز زون',sec:'gaming',owner:'0500000011',color:'#50489E',cover:'"""+S9+"""',desc:'أجهزة ألعاب وملحقات تقنية أصلية بضمان الوكيل — تغليف حماية خاص للأجهزة القابلة للكسر',rt:4.7,sales:214,approved:true,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:500},
{id:'s10',name:'بايت كود',sec:'gaming',owner:'0500000012',color:'#3D7B8C',cover:'"""+S10+"""',desc:'أكواد ألعاب واشتراكات رقمية وكتب إلكترونية وثيمات — تسليم فوري لحظة الدفع بلا شحن',rt:4.8,sales:342,approved:true,susp:false,open:true,city:'جدة',dlMode:'free',freeMin:0}];""",
'STORES: متجرا قيمز زون وبايت كود')

# A4: USERS — مالكا المتجرين الجديدين
rep("'0500000010':{name:'أم خالد السالم',role:'merchant',pass:'1234',store:'s8',since:NOW-864e5*90}};",
"""'0500000010':{name:'أم خالد السالم',role:'merchant',pass:'1234',store:'s8',since:NOW-864e5*90},
'0500000011':{name:'فيصل الحربي',role:'merchant',pass:'1234',store:'s9',since:NOW-864e5*120,notif:{ord:true,dis:true}},
'0500000012':{name:'لينا العسيري',role:'merchant',pass:'1234',store:'s10',since:NOW-864e5*100,notif:{ord:true,dis:true}}};""",
'USERS: تاجرا القسم الجديد')

# A5: محافظ المتجرين الجديدين
rep("storeWallets:{s1:4820.5,s2:2160,s3:9130.25,s4:1540,s5:3310,s6:2980,s7:0},",
"storeWallets:{s1:4820.5,s2:2160,s3:9130.25,s4:1540,s5:3310,s6:2980,s7:0,s9:2760,s10:4180},",
'WALLETS: s9/s10')

# A6: الكوبونات — بنية موسعة (متجر محدد أو شامل + حد أدنى + استخدامات)
rep("coupons:{DAMIN10:{type:'pct',v:10,max:50},SAVE20:{type:'pct',v:20,max:80}},",
"coupons:{DAMIN10:{type:'pct',v:10,max:50,store:'all',min:0,uses:0},SAVE20:{type:'pct',v:20,max:80,store:'all',min:200,uses:14},DAFI15:{type:'pct',v:15,max:60,store:'s1',min:150,uses:37},BYTE10:{type:'pct',v:10,max:30,store:'s10',min:30,uses:9}},",
'COUPONS: بنية كوبونات موسعة (شامل + متاجر)')

# A7: p18 فناجيل مذهبة — قابل للكسر
rep("{id:'p18',store:'s5',name:'طقم فناجيل قهوة مذهّب (٦)',cat:'قهوة وضيافة',price:195,",
"{id:'p18',store:'s5',name:'طقم فناجيل قهوة مذهّب (٦)',cat:'قهوة وضيافة',fragile:true,price:195,",
'p18: قابل للكسر')

# A8: p19 بوكس شكراً — يقبل التعديل
rep("{id:'p19',store:'s6',name:'بوكس هدايا «شكراً» مخمل',cat:'هدايا',ptype:'ship',giftOk:true,price:240,",
"{id:'p19',store:'s6',name:'بوكس هدايا «شكراً» مخمل',cat:'هدايا',ptype:'ship',giftOk:true,customOk:true,price:240,",
'p19: يقبل التعديل حسب الطلب')

# A9: p21 مزهرية فخار — قابل للكسر
rep("{id:'p21',store:'s7',name:'مزهرية فخار مزججة',cat:'ديكور',price:110,",
"{id:'p21',store:'s7',name:'مزهرية فخار مزججة',cat:'ديكور',fragile:true,price:110,",
'p21: قابل للكسر')

# A10: منتجات القسم الرابع (ملموسة قياسية/قابلة للكسر + رقمية)
rep("""specs:{'الخدمة':'تركيب + فك','المدة':'حتى ٦ ساعات','الحجز':'موعد مسبق إلزامي'},ratings:[]}
];""",
"""specs:{'الخدمة':'تركيب + فك','المدة':'حتى ٦ ساعات','الحجز':'موعد مسبق إلزامي'},ratings:[]},
{id:'p25',store:'s9',name:'سماعة ألعاب لاسلكية «صقر برو»',cat:'أجهزة وملحقات',ptype:'std',fragile:true,price:349,off:10,stock:14,sold:167,rt:4.8,rc:38,imgs:['"""+P25+"""','"""+P25b+"""'],
desc:'سماعة ألعاب لاسلكية بتقنية صوت محيطي ٧٫١ افتراضي وبطارية تدوم ٤٠ ساعة متواصلة، مع مايك عازل للضوضاء بإلغاء بيئي وإضاءة RGB قابلة للتخصيص من التطبيق. تُشحن بتغليف حماية خاص لأنها من الأجهزة القابلة للكسر، وتشمل وسادتين احتياطيتين وحمّال مغناطيسي.',
specs:{'الاتصال':'لاسلكي ٢٫٤ جيجا + بلوتوث ٥٫٣','البطارية':'٤٠ ساعة','الصوت':'محيطي ٧٫١ افتراضي','الوزن':'٣١٢ جم'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'خفيفة على الرأس والصوت غامر، وصلت بتغليف حماية ممتاز.',at:Date.now()-864e5*3}]},
{id:'p26',store:'s9',name:'ذراع تحكم احترافي «نمر»',cat:'أجهزة وملحقات',ptype:'std',price:189,off:0,stock:26,sold:241,rt:4.7,rc:52,imgs:['"""+P26+"""','"""+P26b+"""'],
desc:'ذراع تحكم احترافي بأزرار ميكانيكية قابلة للبرمجة وعصا مقاومة للانحراف بدقة عالية، مع أذرع خلفية قابلة للتبديل ووضعيات إعدادات محفوظة لثلاث ألعاب. مناسب لمنصات PC والأندرويد، ويأتي بحافظة صلبة تناسب السفر.',
specs:{'التوافق':'PC / أندرويد','الأزرار':'٨ ميكانيكية قابلة للبرمجة','البطارية':'٢٠ ساعة'},ratings:[]},
{id:'p27',store:'s9',name:'جهاز ألعاب محمول «وهج X»',cat:'أجهزة وملحقات',ptype:'std',fragile:true,price:1499,off:5,stock:6,sold:87,rt:4.9,rc:24,imgs:['"""+P27+"""','"""+P27b+"""'],
desc:'جهاز ألعاب محمول بشاشة أموليد ٧ بوصة بمعدل تحديث ١٤٤ هرتز ومعالج ثماني النوى مخصص للألعاب، يشغّل مكتبتك الرقمية بالكامل مع دعم البث السحابي. يُشحن بصندوق مقوّى بعلامة قابل للكسر وتغليف ممتص للصدمات + تأمين شحن إضافي.',
specs:{'الشاشة':'أموليد ٧ بوصة / ١٤٤ هرتز','التخزين':'٥١٢ جيجابايت','البطارية':'حتى ٨ ساعات لعب'},ratings:[]},
{id:'p28',store:'s9',name:'لوحة مفاتيح ميكانيكية RGB «قوس»',cat:'أجهزة وملحقات',ptype:'std',price:279,off:0,stock:18,sold:198,rt:4.6,rc:41,imgs:['"""+P28+"""','"""+P28b+"""'],
desc:'لوحة مفاتيح ميكانيكية بمفاتيح حمراء قابلة للتبديل الساخن وإضاءة RGB لكل مفتاح مع ٢٢ نمط إضاءة جاهز، وهيكل ألمنيوم مختوم مقاوم للغبار. تدعم الاتصال السلكي ولاسلكي مع ثلاث أجهزة في آن واحد، وتشمل مسند معصم مغناطيسي.',
specs:{'المفاتيح':'حمراء قابلة للتبديل','الاتصال':'سلكي + ٢٫٤ جيجا + بلوتوث','الإضاءة':'RGB لكل مفتاح'},ratings:[]},
{id:'p29',store:'s10',name:'كود لعبة «سباق الرمال ٥» الرقمي',cat:'ألعاب رقمية وأكواد',ptype:'digital',digi:{kind:'code',val:'DRR5-9K2M-X7Q4-88FV'},price:149,off:15,stock:99,sold:512,rt:4.8,rc:117,imgs:['"""+P29+"""'],
desc:'كود رقمي أصلي للعبة سباق الرمال ٥ كاملة الإصدار القياسي، يُسلّم فور إتمام الدفع في مكتبتك الرقمية دون أي شحن أو انتظار. الكود صالح للتفعيل مرة واحدة على حسابك، ويعمل بكل اللغات بما فيها العربية.',
specs:{'النوع':'كود تفعيل رقمي','التسليم':'فوري بعد الدفع','الصلاحية':'تفعيل واحد'},ratings:[]},
{id:'p30',store:'s10',name:'اشتراك ١٢ شهراً بلس جيمنج',cat:'اشتراكات رقمية',ptype:'digital',digi:{kind:'code',val:'PSN-4T8B-22LD-QW90'},price:235,off:0,stock:99,sold:368,rt:4.9,rc:88,imgs:['"""+P30+"""'],
desc:'كود اشتراك ١٢ شهراً كاملة في خدمة بلس جيمنج مع ألعاب شهرية مجانية وخصومات حصرية على المتجر الرقمي. يصل الكود لحظة الدفع في مكتبتك الرقمية عبر رابط مؤقت آمن، ويفعّل على حسابك بثلاث خطوات دون بطاقة.',
specs:{'المدة':'١٢ شهراً','المنطقة':'السعودية والخليج','التسليم':'فوري بعد الدفع'},ratings:[]},
{id:'p31',store:'s10',name:'كتاب إلكتروني «احترف صناعة الألعاب» PDF',cat:'كتب وثيمات رقمية',ptype:'digital',digi:{kind:'file',val:'game-dev-master-ar.pdf',size:'٤٫٢ م.ب'},price:45,off:0,stock:99,sold:156,rt:4.7,rc:33,imgs:['"""+P31+"""'],
desc:'كتاب إلكتروني عربي شامل من ٣٢٠ صفحة يأخذك من أساسيات محركات الألعاب إلى نشر أول لعبة لك على المتاجر، مع أمثلة كود قابلة للتنزيل ومشاريع عملية موزعة على كل فصل. يُسلّم فور الدفع عبر رابط مؤقت آمن، وتبقى نسخته دائمة في مكتبتك.',
specs:{'الصيغة':'PDF','الصفحات':'٣٢٠ صفحة','اللغة':'العربية'},ratings:[]},
{id:'p32',store:'s10',name:'حزمة ثيمات «نيون نايت» (١٢ واجهة)',cat:'كتب وثيمات رقمية',ptype:'digital',digi:{kind:'file',val:'neon-night-themes.zip',size:'١٨ م.ب'},price:25,off:0,stock:99,sold:203,rt:4.6,rc:47,imgs:['"""+P32+"""'],
desc:'حزمة من ١٢ ثيم واجهة نيون بتدرجات ليلية متناسقة للأجهزة وسطح المكتب، تشمل خلفيات وأيقونات مؤشرات وأصوات تنبيه مطابقة. ملف واحد مضغوط يُسلّم فوراً بعد الدفع، مع دليل تركيب مصور بالعربية داخل الحزمة.',
specs:{'المحتوى':'١٢ ثيم متكامل','الصيغة':'ZIP','التوافق':'ويندوز / ماك / أندرويد'},ratings:[]}];""",
'PRODUCTS: ٨ منتجات لعالم الألعاب (٤ ملموسة + ٤ رقمية)')

# A11: ZPOOL توسيع
rep(",'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0dcd6b176ac1.jpg'];",
",'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0dcd6b176ac1.jpg','"+P26+"','"+P28+"','"+S9+"','"+P25b+"','"+P27b+"','"+P30+"'];",
'ZPOOL: صور إضافية للمنتجات الجديدة')

# A12: CSS إضافات
rep(".giftrow{display:flex;gap:9px;align-items:center;background:#B07E2B12;border:1px dashed #B07E2B66;border-radius:12px;padding:8px 12px;font-size:11.5px;font-weight:700;margin-top:7px}",
""".giftrow{display:flex;gap:9px;align-items:center;background:#B07E2B12;border:1px dashed #B07E2B66;border-radius:12px;padding:8px 12px;font-size:11.5px;font-weight:700;margin-top:7px}
.otpbox{background:#1D44320a;border:1.5px dashed #1D443255;border-radius:14px;padding:11px 13px;margin-top:9px}
.chatbar{display:flex;gap:7px;padding:8px 13px;border-bottom:1px solid var(--line);background:var(--card2);flex-wrap:wrap}
.locpin{display:inline-flex;gap:6px;align-items:center;background:#1D44321f;border-radius:9px;padding:4px 9px;font-weight:800;font-size:12px}
.payreq{background:#FFFCF2;border:1.5px dashed var(--amb);border-radius:12px;padding:9px 11px;display:flex;flex-direction:column;gap:6px;align-items:flex-start;font-size:12px}
.payreq b{font-size:12.5px}
.dlgcard{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:.25s;display:flex;flex-direction:column}
.dlgcard:hover{transform:translateY(-3px);box-shadow:0 10px 22px rgba(0,0,0,.09)}
.dlgcard .ph{height:118px;overflow:hidden;border-bottom:1px solid var(--line)}
.dlgcard .ph img{width:100%;height:100%;object-fit:cover;display:block}
.dlgcard .pb{padding:10px 11px;flex:1}
.dcode{font-family:monospace;letter-spacing:2px;background:#1D44320d;border:1px dashed #1D443255;border-radius:10px;padding:7px 11px;direction:ltr;text-align:center;font-weight:800;font-size:12.5px}""",
'CSS: otpbox/chatbar/locpin/payreq/dlgcard/dcode')

# A13: نصوص العوالم الثلاثة -> الأربعة
rep("<div class=\"secthead\"><h2>عوالم ضمين الثلاثة</h2><div class=\"ln\"></div><span class=\"hint\">اختر عالمك وابدأ بضمان</span></div>",
"<div class=\"secthead\"><h2>عوالم ضمين الأربعة</h2><div class=\"ln\"></div><span class=\"hint\">اختر عالمك وابدأ بضمان</span></div>",
'نص: عوالم ضمين الأربعة')
rep("تجوّل بين الأقسام الثلاثة واختر ما يعجبك — الدفع محمي بضمان ضمين",
"تجوّل بين عوالم ضمين الأربعة واختر ما يعجبك — الدفع محمي بضمان ضمين",
'نص: سلة فارغة — أربعة عوالم')
rep("أضف وعدّل واحذف تصنيفات العوالم الثلاثة، وحدد عمولة كل تصنيف بنفسك",
"أضف وعدّل واحذف تصنيفات العوالم الأربعة، وحدد عمولة كل تصنيف بنفسك",
'نص: إدارة التصنيفات — أربعة عوالم')

# A14: شريحة ثقة الرئيسية — تسليم رقمي فوري
rep("<span class=\"tchip\"><i>💳</i> مدى وApple Pay وتقسيط تابي وتمارا</span></div>",
"<span class=\"tchip\"><i>💳</i> مدى وApple Pay وتقسيط تابي وتمارا</span><span class=\"tchip\"><i>⚡</i> تسليم رقمي فوري</span></div>",
'الرئيسية: شريحة التسليم الرقمي')

print('== B. محرك اللوجستيات والسلة وبوابة الطلب ==')

# B1: shipQuote — رقمي/قابل للكسر/نطاق فوري/مبرد حسب المدينة
rep("""function shipQuote(items,st,city,fd){
const ptypes=items.map(x=>x.p.ptype||'std');
const gsub=r2(items.reduce((a,x)=>a+eff(x.p)*x.qty,0));
let mode='std',cost=CITY_DL(st.city||'الرياض',city),label='شحن سريع عبر شركاء ضمين (OTO/Torod)';
if(ptypes.every(t=>t==='field')){mode='field';cost=0;label='توصيل وتركيب فريق المتجر'}
else if(ptypes.includes('chilled')){mode='chilled';cost=r2(cost+8);label='توصيل مبرد مجدول (حساس للحرارة)'}
else if(ptypes.includes('instant')){mode='instant';cost=10;label='مندوب فوري — ٤٥ دقيقة تقريباً'}
let charge=cost,subsidy=0,source='customer',why='';
if(mode==='field'){charge=0;source='merchant';why='خدمة ميدانية بفريق المتجر'}
else if(st.dlMode==='free'){charge=0;subsidy=cost;source='merchant';why='توصيل مجاني من المتجر'}
else if((st.freeMin||0)>0&&gsub>=st.freeMin){charge=0;subsidy=cost;source='merchant';why='تخطيت سقف الشحن المجاني'}
else if(st.dlMode==='half'){charge=r2(cost/2);subsidy=r2(cost/2);source='merchant';why='مناصفة مع المتجر'}
if(fd&&mode!=='field'&&charge>0){charge=0;subsidy=cost;source='pts';why='استبدال نقاط الولاء'}
return{mode,cost,charge,subsidy,source,why,label,gsub};
}""",
"""function shipQuote(items,st,city,fd){
const ptypes=items.map(x=>x.p.ptype||'std');
const gsub=r2(items.reduce((a,x)=>a+eff(x.p)*x.qty,0));
let mode='std',cost=CITY_DL(st.city||'الرياض',city),label='شحن سريع عبر شركاء ضمين (OTO/Torod)',fragile=false,blocked=null;
if(ptypes.every(t=>t==='digital')){mode='digital';cost=0;label='تسليم رقمي فوري — ٠ ر.س شحن'}
else if(ptypes.every(t=>t==='field')){mode='field';cost=0;label='توصيل وتركيب فريق المتجر'}
else if(ptypes.includes('instant')){
if((st.city||'الرياض')!==city){mode='instant';cost=0;label='توصيل فوري محلي';blocked='خارج نطاق التوصيل الفوري — «'+st.name+'» يوصل داخل مدينة '+st.city+' فقط (نطاق '+ar(st.rangeKm||20)+' كم) حفاظاً على حرارة الوجبة'}
else{mode='instant';cost=10;label='مندوب فوري — ٤٥ دقيقة تقريباً داخل '+city}}
else if(ptypes.includes('chilled')){
mode='chilled';const same=(st.city||'الرياض')===city;cost=r2(cost+8);
label=same?'توصيل مبرد بمندوب مجهز بحافظة برودة (Cooling Box) داخل المدينة':'شحن مبرد بين المدن عبر شركات مبردة متعاقدة (OTO/Torod)'}
if(mode==='std'&&items.some(x=>x.p.fragile)){fragile=true;cost=r2(cost+15);label='شحن سريع + قابل للكسر (تغليف خاص ورسوم حماية ١٥ ر.س)'}
let charge=cost,subsidy=0,source='customer',why='';
if(mode==='field'||mode==='digital'){charge=0;subsidy=cost;source='merchant';why=mode==='field'?'خدمة ميدانية بفريق المتجر':'تسليم رقمي فوري'}
else if(st.dlMode==='free'){charge=0;subsidy=cost;source='merchant';why='توصيل مجاني من المتجر'}
else if((st.freeMin||0)>0&&gsub>=st.freeMin){charge=0;subsidy=cost;source='merchant';why='تخطيت سقف الشحن المجاني'}
else if(st.dlMode==='half'){charge=r2(cost/2);subsidy=r2(cost/2);source='merchant';why='مناصفة مع المتجر'}
if(fd&&mode!=='field'&&mode!=='digital'&&charge>0){charge=0;subsidy=cost;source='pts';why='استبدال نقاط الولاء'}
return{mode,cost,charge,subsidy,source,why,label,gsub,fragile,blocked};
}""",
'shipQuote: رقمي + قابل للكسر + نطاق الفوري + مبرد حسب المدينة')

# B2: PTI شارة رقمية
rep("const PTI=p=>({chilled:'🧊 توصيل مبرد',instant:'🛵 توصيل فوري',field:'🎪 خدمة ميدانية'}[p.ptype]||'');",
"const PTI=p=>({chilled:'🧊 توصيل مبرد',instant:'🛵 توصيل فوري',field:'🎪 خدمة ميدانية',digital:'⚡ رقمي فوري'}[p.ptype]||'');",
'PTI: شارة الرقمي الفوري')

# B3: cartCalc — كوبون بمطابقة متجر/حد أدنى/استخدامات
rep("let cpn=0;if(CPN&&DB.coupons[CPN]){const c=DB.coupons[CPN];cpn=r2(Math.min(c.type==='pct'?sub*c.v/100:c.v,c.max))}",
"""let cpn=0,cpnBad='';
if(CPN&&DB.coupons[CPN]){const cc=DB.coupons[CPN];
const csub=cc.store==='all'?sub:Object.entries(groups).reduce((a,[sid,its])=>sid===cc.store?a+r2(its.reduce((x,y)=>x+eff(y.p)*y.qty,0)):a,0);
if(cc.store!=='all'&&!Object.keys(groups).includes(cc.store))cpnBad='كوبون «'+CPN+'» خاص بمتجر «'+ST(cc.store).name+'» وليس ضمن سلتك';
else if(sub<(cc.min||0))cpnBad='كوبون «'+CPN+'» يشترط طلباً بقيمة '+money(cc.min)+' على الأقل';
else if(cc.maxUses&&(cc.uses||0)>=cc.maxUses)cpnBad='كوبون «'+CPN+'» استُنفد ('+ar(cc.maxUses)+' استخدام)';
else cpn=r2(Math.min(cc.type==='pct'?csub*cc.v/100:cc.v,cc.max||csub,csub));}""",
'cartCalc: تحقق الكوبون (متجر/حد أدنى/استخدامات)')

rep("return{items,groups,sub,city,dlCharge,dlCost,quotes,fd,fdN:fdPts(),cpn,ptsMax,ptsUse,ptsAmt,net,tax,total};",
"return{items,groups,sub,city,dlCharge,dlCost,quotes,fd,fdN:fdPts(),cpn,cpnBad,ptsMax,ptsUse,ptsAmt,net,tax,total};",
'cartCalc: إرجاع cpnBad')

# B4: applyCoupon
rep("""function applyCoupon(){const v=($('#cpnin').value||'').trim().toUpperCase();
if(!v){CPN=null;render();return}
if(!DB.coupons[v]){toast('كود غير صالح','err');CPN=null;render();return}
CPN=v;toast('تم تطبيق الخصم 🎉','ok');render()}""",
"""function applyCoupon(){const v=($('#cpnin').value||'').trim().toUpperCase();
if(!v){CPN=null;render();return}
if(!DB.coupons[v]){toast('كود غير صالح','err');CPN=null;render();return}
CPN=v;const c=DB.coupons[v];const cart=cartCalc();
if(cart.cpnBad){toast(cart.cpnBad,'err');CPN=null;render();return}
toast('فُعّل كوبون «'+v+'» 🎉 '+(c.store==='all'?'— خصم شامل من الإدارة على كل المتاجر':'— خصم من متجر '+ST(c.store).name),'ok');render()}""",
'applyCoupon: رسائل مطابقة دقيقة')

# B5: بطاقة السلة — شارات العناصر (قابل للكسر/تعديل) + سطر الشحنة المحجوبة
rep("""<div class="hint">${esc(s.name)}${p.off?` · <span style="color:var(--red);font-weight:700">خصم ${ar(p.off)}٪</span>`:''}${PTI(p)?` · <span style="font-weight:700">${PTI(p)}</span>`:''}${p.giftOk?' · 🎁 قابل للإهداء':''}</div>""",
"""<div class="hint">${esc(s.name)}${p.off?` · <span style="color:var(--red);font-weight:700">خصم ${ar(p.off)}٪</span>`:''}${PTI(p)?` · <span style="font-weight:700">${PTI(p)}</span>`:''}${p.giftOk?' · 🎁 قابل للإهداء':''}${p.fragile?' · <span style="color:#B3541E;font-weight:700">⚠️ قابل للكسر</span>':''}${p.customOk?' · ✏️ قابل للتعديل':''}</div>""",
'السلة: شارات قابل للكسر والتعديل')

rep("""<span class="hint">${q.mode==='field'?'🎪 توصيل وتركيب فريق المتجر':q.charge?`+ شحن ${money(q.charge)} · ${q.label}`:`+ شحن مجاني 🎉${q.why?' — '+q.why:''}`}</span>""",
"""<span class="hint">${q.mode==='field'?'🎪 توصيل وتركيب فريق المتجر':q.mode==='digital'?'⚡ تسليم رقمي فوري — ٠ ر.س شحن':q.charge?`+ شحن ${money(q.charge)} · ${q.label}`:`+ شحن مجاني 🎉${q.why?' — '+q.why:''}`}</span>
${q.blocked?`<div style="color:var(--red);font-weight:700;font-size:11px;margin-top:5px;line-height:1.7">⛔ ${esc(q.blocked)}</div>`:''}""",
'السلة: سطر الشحنة + إنذار خارج النطاق')

rep("""${(s.freeMin||0)>0&&s.dlMode!=='free'&&q.mode!=='field'&&gsub<s.freeMin?`<div class="freeprog">""",
"""${(s.freeMin||0)>0&&s.dlMode!=='free'&&q.mode!=='field'&&q.mode!=='digital'&&!q.blocked&&gsub<s.freeMin?`<div class="freeprog">""",
'السالة: سقف الشحن لا ينطبق على الرقمي/المحجوب')

rep("""${c.cpn?`<div class="srow disc"><span>خصم الكوبون ${CPN}</span><b>− ${money(c.cpn)}</b></div>`:''}""",
"""${c.cpnBad?`<div class="srow" style="color:var(--red);font-weight:700;font-size:11.5px">🎟️ ${esc(c.cpnBad)}</div>`:''}
${c.cpn?`<div class="srow disc"><span>خصم الكوبون ${CPN}${DB.coupons[CPN]&&DB.coupons[CPN].store!=='all'?' — من متجر '+esc(ST(DB.coupons[CPN].store).name):' — شامل من الإدارة'}</span><b>− ${money(c.cpn)}</b></div>`:''}""",
'السلة: سطر الكوبون بمصدره')

# B6: startCheckout — منع الطلب أثناء وجود شحنة خارج النطاق
rep("""function startCheckout(){
if(!CART.length)return;
CK={step:SES?1:0,addr:me()&&me().addrs&&me().addrs.length?(me().addrs.findIndex(a=>a.def)>=0?me().addrs.findIndex(a=>a.def):0):-1,pay:'mada',geo:null,book:{},gift:{},ans:{}};
openModal(ckHTML(),'lg');}""",
"""function startCheckout(){
if(!CART.length)return;
const bl=Object.values(cartCalc().quotes).filter(q=>q.blocked);
if(bl.length){toast(bl[0].blocked,'err');return}
CK={step:SES?1:0,addr:me()&&me().addrs&&me().addrs.length?(me().addrs.findIndex(a=>a.def)>=0?me().addrs.findIndex(a=>a.def):0):-1,pay:'mada',geo:null,book:{},gift:{},ans:{},chatG:null};
openModal(ckHTML(),'lg');}""",
'startCheckout: حجز خارج النطاق يمنع الدفع')

# B7: بنية الإهداء — جوال + مدينة (الاسم اختياري)
rep("function ckSetGift(sid,k,v){(CK.gift[sid]=CK.gift[sid]||{on:false,name:'',phone:''});CK.gift[sid][k]=v}",
"function ckSetGift(sid,k,v){(CK.gift[sid]=CK.gift[sid]||{on:false,name:'',phone:'',city:''});CK.gift[sid][k]=v}",
'ckSetGift: حقل المدينة')
rep("function ckGiftTog(sid){const g=CK.gift[sid]||{on:false,name:'',phone:''};g.on=!g.on;CK.gift[sid]=g;ckRefresh()}",
"function ckGiftTog(sid){const g=CK.gift[sid]||{on:false,name:'',phone:'',city:''};g.on=!g.on;CK.gift[sid]=g;ckRefresh()}",
'ckGiftTog: حقل المدينة')

# B8: خيارات التسليم الخاصة — المبرد حسب المدينة + الفوري بالنطاق + رقمي + تعديلات + قابل للكسر
rep("""if(q.mode==='chilled')blocks.push(`<div class="hint" style="line-height:1.8">🧊 هذه الشحنة تضم منتجات حساسة للحرارة — سيُجدول النظام تلقائياً توصيلاً مبرداً مع أقرب شركة توصيل مبرد متعاقدة بعد تأكيد الطلب.</div>`);
if(q.mode==='instant')blocks.push(`<div class="hint" style="line-height:1.8">🛵 أطباق طازجة — سيبحث النظام عن مندوب فوري فور تأكيد طلبك، ووقت التوصيل المتوقع ٤٥ دقيقة.</div>`);""",
"""if(q.mode==='chilled')blocks.push(`<div class="hint" style="line-height:1.8">🧊 هذه الشحنة تضم منتجات حساسة للحرارة — ${c.city===(st.city||'')?'سيُرسل مندوب مجهز بحافظة برودة (Cooling Box) داخل المدينة نفسها':'ستُشحن مبردة بين المدن عبر شركات الشحن المبرد المتعاقدة عبر بوابة OTO/Torod'} بعد تأكيد الطلب.</div>`);
if(q.mode==='instant'&&!q.blocked)blocks.push(`<div class="hint" style="line-height:1.8">🛵 أطباق طازجة — سيبحث النظام عن مندوب فوري فور تأكيد طلبك داخل ${esc(c.city)} فقط (نطاق ${ar(st.rangeKm||20)} كم حول مدينة المتجر «${esc(st.city)}»)، ووقت التوصيل المتوقع ٤٥ دقيقة.</div>`);
if(q.blocked)blocks.push(`<div class="hint" style="line-height:1.8;color:var(--red);font-weight:700">⛔ ${esc(q.blocked)}</div>`);
if(q.mode==='digital')blocks.push(`<div class="hint" style="line-height:1.8">⚡ منتجات رقمية — يُسلّم الكود/الملف فور الدفع إلى «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق، بدون شحن وبدون انتظار.</div>`);
if(q.fragile)blocks.push(`<div class="hint" style="line-height:1.8">⚠️ شحنة قابلة للكسر — تُنقل العلامة آلياً لشركة الشحن (OTO/Torod) مع تنبيه تغليف خاص إلزامي في البوليصة، ورسوم حماية ١٥ ر.س مدرجة ضمن الشحن.</div>`);
if(its.some(x=>x.p.customOk))blocks.push(`<div class="hint" style="line-height:1.8">✏️ هذا المتجر يقبل التعديلات حسب طلبك — بعد الدفع تفتح دردشة التعديلات مباشرة مع التاجر، ويقدر يطلب مبلغاً إضافياً لأي إضافة (يُحجز بضمان ضمين).</div>`);""",
'ckExtras: مبرد/فوري/رقمي/كسر/تعديلات')

# B9: نموذج الإهداء — جوال + مدينة + اسم اختياري
rep("""if(sec.id==='deco'&&its.some(x=>x.p.giftOk)){
const g=CK.gift[sid]||{on:false,name:'',phone:''};
blocks.push(`<div class="spread"><b style="font-size:11.5px">🎁 إهداء لشخص آخر</b><button class="sw ${g.on?'on':''}" onclick="ckGiftTog('${sid}')"></button></div>
${g.on?`<div class="fgrid" style="margin-top:7px"><div class="fld"><label>اسم المستلم</label><input class="inp" style="font-size:12px" value="${esc(g.name||'')}" oninput="ckSetGift('${sid}','name',this.value)"></div><div class="fld"><label>جوال المستلم (١٠ أرقام)</label><input class="inp" style="font-size:12px" value="${esc(g.phone||'')}" oninput="ckSetGift('${sid}','phone',this.value)"></div></div><p class="hint" style="margin-top:5px">تصدر البوليصة باسم المستلم فتوصله الهدية مباشرة — بياناته تُستخدم للشحن فقط.</p>`:'<p class="hint" style="margin-top:4px">فعّل الخيار لإرسال هديتك لشخص غيرك باسم ورقم مستلم.</p>'}`);
}""",
"""if(sec.id==='deco'&&its.some(x=>x.p.giftOk)){
const g=CK.gift[sid]||{on:false,name:'',phone:'',city:''};
blocks.push(`<div class="spread"><b style="font-size:11.5px">🎁 إهداء لشخص آخر</b><button class="sw ${g.on?'on':''}" onclick="ckGiftTog('${sid}')"></button></div>
${g.on?`<div class="fgrid" style="margin-top:7px"><div class="fld"><label>جوال المستلم (١٠ أرقام يبدأ بـ 05)</label><input class="inp" style="font-size:12px" value="${esc(g.phone||'')}" oninput="ckSetGift('${sid}','phone',this.value)"></div><div class="fld"><label>مدينة المستلم</label><input class="inp" style="font-size:12px" placeholder="مثال: الرياض" value="${esc(g.city||'')}" oninput="ckSetGift('${sid}','city',this.value)"></div></div>
<div class="fld" style="margin-top:7px"><label>اسم المستلم (اختياري — يُطبع على بطاقة الإهداء)</label><input class="inp" style="font-size:12px" value="${esc(g.name||'')}" oninput="ckSetGift('${sid}','name',this.value)"></div>
<p class="hint" style="margin-top:5px">يكفي جوال المستلم ومدينته — تصدر البوليصة باسمه فتوصله الهدية مباشرة، وكل التواصل عبر ضمين فقط.</p>`:'<p class="hint" style="margin-top:4px">فعّل الخيار لإرسال هديتك لشخص غيرك — يُطلب جواله ومدينته فقط.</p>'}`);
}""",
'الإهداء: جوال + مدينة فقط')

# B10: حجز المناسبة — خيار التسليم (فريق المتجر أو استلام بلا توصيل)
rep("""blocks.push(`<b style="font-size:11.5px">🎪 حجز موعد المناسبة (إلزامي لخدمة التنسيق الميداني)</b>
<div class="fgrid" style="margin-top:7px">""",
"""blocks.push(`<b style="font-size:11.5px">🎪 حجز موعد المناسبة (إلزامي لخدمة التنسيق الميداني)</b>
<div class="fld" style="margin-top:7px"><label>🚚 طريقة تسليم المناسبة</label><select class="inp" style="font-size:12px" onchange="ckSetBook('${sid}','dl',this.value)">
<option value="field" ${(b.dl||'field')==='field'?'selected':''}>فريق المتجر يوصل ويركّب في موقع المناسبة</option>
<option value="pickup" ${b.dl==='pickup'?'selected':''}>استلام من مقر المتجر — بلا توصيل (التنسيق عبر دردشة ضمين بعد الدفع)</option></select></div>
<div class="fgrid" style="margin-top:7px">""",
'حجز المناسبة: فريق المتجر أو استلام من المقر')

print('== C. الطلب والمحادثة والمكتبة الرقمية ==')

# C1: placeOrder — رقمي فوري + كسر + إهداء جوال/مدينة + كوبون + دردشة بعد الدفع
rep("""function placeOrder(){
const u=me();const c=cartCalc();
if(CK.addr<0||!u.addrs[CK.addr]){toast('حدد عنوان التسليم أولاً','err');CK.step=1;ckRefresh();return}
if(CK.pay==='bal'&&u.bal<c.total){toast('رصيد المحفظة لا يكفي','err');return}
for(const [sid,its] of Object.entries(c.groups)){
const q=c.quotes[sid];
if(q.mode==='field'){const b=CK.book[sid]||{};if(!b.date||!b.setup){toast('أكمل حجز موعد المناسبة (التاريخ ووقت التركيب) لشحنة '+ST(sid).name,'err');CK.step=1;ckRefresh();return}}
const gft=CK.gift[sid];
if(gft&&gft.on&&((gft.name||'').trim().length<2||!/^(05)?\\d{9}$|^05\\d{8}$/.test((gft.phone||'').replace(/\\s/g,'')))){toast('أكمل بيانات المستلم للإهداء (الاسم وجوال ١٠ أرقام يبدأ بـ 05)','err');CK.step=1;ckRefresh();return}
}
CK.addrTxt=u.addrs[CK.addr].a;
CK.step=3;CK.oid=OID;CK.gcount=Object.keys(c.groups).length;CK.wb=0;
const o={id:OID++,customer:SES.phone,at:Date.now(),pay:CK.pay,addr:CK.addrTxt,city:c.city,
coupon:{code:CPN,amt:c.cpn},ptsUsed:c.ptsUse,ptsAmt:c.ptsAmt,freeDl:c.fd,net:c.net,tax:c.tax,total:c.total,
groups:Object.entries(c.groups).map(([sid,its])=>{const st=ST(sid),q=c.quotes[sid];
const grp={store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),
sub:r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0)),dl:q.charge,status:'pending',
ship:{mode:q.mode,cost:q.cost,charge:q.charge,subsidy:q.subsidy,source:q.source,why:q.why,label:q.label},
logi:q.mode==='field'?{wb:null,courier:'توصيل وتركيب فريق المتجر',mode:'field',events:[{t:'خدمة ميدانية — بلا بوليصة آلية، الحجز بموعد المناسبة',at:Date.now()}]}:mkLogi(q.mode,sid+OID),
chat:[{r:'sys',t:'فُتحت محادثة الطلب — للتفاصيل والطلبات الخاصة فقط. ممنوع تبادل الأرقام أو الروابط أو أي وسيلة تواصل خارج ضمين (الإدارة تُتابع تلقائياً وحجب المخالف فوري).',at:Date.now()}],
viol:{customer:0,merchant:0}};
if(q.mode==='field')grp.booking=CK.book[sid];
if(CK.gift[sid]&&CK.gift[sid].on)grp.gift={name:(CK.gift[sid].name||'').trim(),phone:(CK.gift[sid].phone||'').trim()};
if(st.qs&&st.qs.length)grp.ans=st.qs.map((qq,i)=>({q:qq,a:(((CK.ans[sid]||[])[i])||'').trim()})).filter(x=>x.a);
if(q.mode!=='field')CK.wb++;
return grp})};
if(c.fd)o.freeDl=true;
if(CK.pay==='bal'){u.bal=r2((u.bal||0)-c.total);o.paidBy='محفظة ضمين'}
if(CK.pay==='tabby')o.inst={by:'تابي',n:4,each:r2(c.total/4)};
if(CK.pay==='tamara')o.inst={by:'تمارا',n:3,each:r2(c.total/3)};
DB.vat=r2((DB.vat||0)+c.tax);
if(c.fd){u.pts=(u.pts||0)-c.fdN;u.ptsLog.unshift({t:'استبدال نقاط بتوصيل مجاني في الطلب #'+(OID-1),v:-c.fdN,at:Date.now()})}
if(c.ptsUse){u.pts=(u.pts||0)-c.ptsUse;u.ptsLog.unshift({t:'استبدال نقاط في الطلب #'+(OID-1),v:-c.ptsUse,at:Date.now()})}
DB.orders.unshift(o);
Object.keys(c.groups).forEach(sid=>{const own=ST(sid).owner;
if(own&&USERS[own])pushNotif(own,'📦','طلب جديد بانتظار قبولك','عميل جديد أرسل طلباً بقيمة '+money(o.groups.find(g=>g.store===sid).sub),['m-orders'])});
pushNotif(SES.phone,'🔒','تم حجز مبلغ طلبك','مبلغ '+money(c.total)+' محجوز بأمان في خزنة ضمين',['orders']);
CART=[];CPN=null;PTS=0;FREE_DL=false;
ckRefresh();
}""",
"""function placeOrder(){
const u=me();const c=cartCalc();
if(CK.addr<0||!u.addrs[CK.addr]){toast('حدد عنوان التسليم أولاً','err');CK.step=1;ckRefresh();return}
if(CK.pay==='bal'&&u.bal<c.total){toast('رصيد المحفظة لا يكفي','err');return}
for(const [sid,its] of Object.entries(c.groups)){
const q=c.quotes[sid];
if(q.blocked){toast(q.blocked,'err');CK.step=1;ckRefresh();return}
if(q.mode==='field'){const b=CK.book[sid]||{};if(!b.date||!b.setup){toast('أكمل حجز موعد المناسبة (التاريخ ووقت التركيب) لشحنة '+ST(sid).name,'err');CK.step=1;ckRefresh();return}}
const gft=CK.gift[sid];
if(gft&&gft.on&&(!/^05\\d{8}$/.test((gft.phone||'').replace(/\\s/g,''))||!((gft.city||'').trim()))){toast('أكمل بيانات الإهداء — جوال مستلم يبدأ بـ 05 + مدينته','err');CK.step=1;ckRefresh();return}
}
CK.addrTxt=u.addrs[CK.addr].a;
CK.step=3;CK.oid=OID;CK.gcount=Object.keys(c.groups).length;CK.wb=0;
const o={id:OID++,customer:SES.phone,at:Date.now(),pay:CK.pay,addr:CK.addrTxt,city:c.city,
coupon:{code:CPN,amt:c.cpn},ptsUsed:c.ptsUse,ptsAmt:c.ptsAmt,freeDl:c.fd,net:c.net,tax:c.tax,total:c.total,
groups:Object.entries(c.groups).map(([sid,its])=>{const st=ST(sid),q=c.quotes[sid];
const bk=CK.book[sid]||{};
const grp={store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),
sub:r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0)),dl:q.charge,status:'pending',
ship:{mode:q.mode,cost:q.cost,charge:q.charge,subsidy:q.subsidy,source:q.source,why:q.why,label:q.label,fragile:q.fragile},
logi:q.mode==='field'?{wb:null,courier:bk.dl==='pickup'?'استلام من مقر المتجر — بلا توصيل':'توصيل وتركيب فريق المتجر',mode:'field',events:[{t:bk.dl==='pickup'?'استلام من المقر — بلا بوليصة شحن، والتنسيق عبر دردشة ضمين بعد الدفع':'خدمة ميدانية — بلا بوليصة آلية، الحجز بموعد المناسبة',at:Date.now()}]}:
q.mode==='digital'?{wb:null,courier:'تسليم رقمي فوري (ضمين ديجيتال)',mode:'digital',events:[{t:'سُلّم المحتوى الرقمي فور الدفع إلى مكتبة العميل — عبر رابط مؤقت موقّع (S3 Signed URL)',at:Date.now()}]}:
mkLogi(q.mode,sid+OID),
chat:[{r:'sys',t:'فُتحت محادثة الطلب — للتفاصيل والطلبات الخاصة فقط. ممنوع تبادل الأرقام أو الروابط أو أي وسيلة تواصل خارج ضمين (الإدارة تُتابع تلقائياً وحجب المخالف فوري).',at:Date.now()}],
viol:{customer:0,merchant:0}};
if(q.fragile&&grp.logi)grp.logi.events.unshift({t:'⚠️ علامة «قابل للكسر» نُقلت آلياً لشركة الشحن ('+grp.logi.courier+') — تغليف خاص إلزامي في البوليصة + رسوم حماية ١٥ ر.س ضمن الشحن',at:Date.now()});
if(q.mode==='field')grp.booking=CK.book[sid];
if(q.mode==='digital'){
grp.status='received';grp.digi=true;grp.complaintUntil=Date.now()+secOf(sid).winMin*60e3;
grp.chat.push({r:'sys',t:'⚡ سُلّم المحتوى الرقمي فوراً — الكود/الملف في «مكتبتك الرقمية»، ومبلغك محجوز بضمان ضمين حتى نهاية نافذة الحماية.',at:Date.now()});
u.dlib=u.dlib||[];
its.filter(x=>x.p.ptype==='digital'&&x.p.digi).forEach(x=>u.dlib.unshift({pid:x.p.id,name:x.p.name,store:sid,kind:x.p.digi.kind,val:x.p.digi.val,size:x.p.digi.size||'',at:Date.now(),oid:OID-1}));}
if(its.some(x=>x.p.customOk)){grp.custom=true;grp.chat.push({r:'sys',t:'✏️ دردشة التعديلات مفتوحة — حدد طلبك بدقة، ويقدر التاجر يطلب مبلغاً إضافياً لأي تعديل يتفقان عليه (يُحجز بضمان ضمين حتى الاستلام).',at:Date.now()})}
if(CK.gift[sid]&&CK.gift[sid].on)grp.gift={name:(CK.gift[sid].name||'').trim(),phone:(CK.gift[sid].phone||'').trim(),city:(CK.gift[sid].city||'').trim()};
if(st.qs&&st.qs.length)grp.ans=st.qs.map((qq,i)=>({q:qq,a:(((CK.ans[sid]||[])[i])||'').trim()})).filter(x=>x.a);
if(q.mode!=='field'&&q.mode!=='digital')CK.wb++;
return grp})};
if(c.fd)o.freeDl=true;
if(CK.pay==='bal'){u.bal=r2((u.bal||0)-c.total);o.paidBy='محفظة ضمين'}
if(CK.pay==='tabby')o.inst={by:'تابي',n:4,each:r2(c.total/4)};
if(CK.pay==='tamara')o.inst={by:'تمارا',n:3,each:r2(c.total/3)};
DB.vat=r2((DB.vat||0)+c.tax);
if(CPN&&DB.coupons[CPN])DB.coupons[CPN].uses=(DB.coupons[CPN].uses||0)+1;
if(c.fd){u.pts=(u.pts||0)-c.fdN;u.ptsLog.unshift({t:'استبدال نقاط بتوصيل مجاني في الطلب #'+(OID-1),v:-c.fdN,at:Date.now()})}
if(c.ptsUse){u.pts=(u.pts||0)-c.ptsUse;u.ptsLog.unshift({t:'استبدال نقاط في الطلب #'+(OID-1),v:-c.ptsUse,at:Date.now()})}
DB.orders.unshift(o);
let chatG=-1;
o.groups.forEach((g,gi)=>{const own=ST(g.store).owner;
if(own&&USERS[own])pushNotif(own,g.digi?'⚡':'📦','طلب جديد'+(g.digi?' رقمي — سُلّم فوراً للعميل':' بانتظار قبولك'),'عميل جديد أرسل طلباً بقيمة '+money(g.sub),['m-orders']);
if(chatG<0&&(g.custom||(g.ship&&g.ship.mode==='field')))chatG=gi});
pushNotif(SES.phone,'🔒','تم حجز مبلغ طلبك','مبلغ '+money(c.total)+' محجوز بأمان في خزنة ضمين',['orders']);
if(o.groups.some(g=>g.digi))pushNotif(SES.phone,'⚡','مشترياتك الرقمية جاهزة','الكود/الملف في «مكتبتك الرقمية» — تسليم فوري بضمان ضمين',['dlib']);
if(chatG>=0){CK.chatG=chatG;const g=o.groups[chatG];
pushNotif(SES.phone,'💬','فُتحت دردشة مع '+ST(g.store).name,'شارك تفاصيلك وموقعك عبر الدردشة — التواصل داخل ضمين فقط',['orders']);
toast('💬 فُتحت دردشة التنسيق/التعديلات مع '+esc(ST(g.store).name),'ok')}
CART=[];CPN=null;PTS=0;FREE_DL=false;
ckRefresh();
if(chatG>=0)setTimeout(()=>{if($('#ckbody')&&$('#modals').innerHTML)openOChat(CK.oid,chatG)},1500);
}""",
'placeOrder: رقمي فوري + كسر + إهداء + كوبون + فتح دردشة بعد الدفع')

# C2: شاشة النجاح — زر الدردشة + سطر الرقمي
rep("""return `<div style="text-align:center;padding:8px 4px">
<div class="bigok">✅</div>
<b class="fx" style="font-size:17px">تم حجز مبلغك في خزنة ضمين!</b>
<p class="hint mt" style="line-height:1.9">رقم طلبك <b style="color:var(--grn)">#${ar(CK.oid)}</b><br>أُرسلت طلباتك إلى ${ar(CK.gcount)} متجر — كل شحنة ببوليصة مستقلة.<br>📄 أُصدرت ${ar(CK.wb||0)} بوليصة شحن آلية وأُرسلت طلبات الاستلام للمناديب · فُتحت محادثة الطلب مع كل متجر (بلا أرقام ولا روابط).<br>💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>
<button class="btn wide mt" onclick="closeModal();go('orders')">📦 تتبع طلبي</button>
<button class="btn gray wide mt" onclick="closeModal();go('home')">مواصلة التسوق</button></div>`;""",
"""const og=DB.orders.find(x=>x.id===CK.oid);const g0=(og&&CK.chatG!=null)?og.groups[CK.chatG]:null;
return `<div style="text-align:center;padding:8px 4px">
<div class="bigok">✅</div>
<b class="fx" style="font-size:17px">تم حجز مبلغك في خزنة ضمين!</b>
<p class="hint mt" style="line-height:1.9">رقم طلبك <b style="color:var(--grn)">#${ar(CK.oid)}</b><br>أُرسلت طلباتك إلى ${ar(CK.gcount)} متجر — كل شحنة ببوليصة مستقلة.<br>📄 أُصدرت ${ar(CK.wb||0)} بوليصة شحن آلية وأُرسلت طلبات الاستلام للمناديب · فُتحت محادثة الطلب مع كل متجر (بلا أرقام ولا روابط).${og&&og.groups.some(g=>g.digi)?'<br>⚡ مشترياتك الرقمية سُلّمت فوراً إلى «مكتبتك الرقمية».':''}<br>💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>
${g0?`<button class="btn wide mt" onclick="closeModal();openOChat(${CK.oid},${CK.chatG})">💬 دردشة التنسيق/التعديلات مع ${esc(ST(g0.store).name)}</button>`:''}
${og&&og.groups.some(g=>g.digi)?`<button class="btn wide mt" onclick="closeModal();go('dlib')">📚 مكتبتي الرقمية — الكود/الملف جاهز</button>`:''}
<button class="btn wide mt" onclick="closeModal();go('orders')">📦 تتبع طلبي</button>
<button class="btn gray wide mt" onclick="closeModal();go('home')">مواصلة التسوق</button></div>`;""",
'شاشة النجاح: أزرار الدردشة والمكتبة الرقمية')

# C3: بطاقة طلب العميل — الإهداء جوال/مدينة + شارات رقمي/تعديل + استلام من المقر
rep("""${g.gift?`<div class="giftrow">🎁 إهداء إلى: <b>${esc(g.gift.name)}</b> — صدرت البوليصة باسم المستلم فتوصله الهدية مباشرة</div>`:''}""",
"""${g.gift?`<div class="giftrow">🎁 إهداء إلى: <b>${esc(g.gift.name||'مستلم')}</b> · ${ar(g.gift.phone)} · ${esc(g.gift.city||'—')} — صدرت البوليصة باسم المستلم فتوصله الهدية مباشرة</div>`:''}
${g.digi?`<div class="giftrow" style="background:#50489E12;border-color:#50489E66">⚡ طلب رقمي — سُلّم فوراً إلى <a style="color:#50489E;font-weight:800;cursor:pointer" onclick="go('dlib')">مكتبتك الرقمية</a> والكود/الملف جاهز للعرض والتحميل</div>`:''}
${g.custom?`<div class="giftrow" style="background:#A45A3A12;border-color:#A45A3A66">✏️ طلب قابل للتعديل — راسل متجرك عبر محادثة الطلب بأي تعديل (أي مبلغ إضافي يُحجز بضمان ضمين حتى الاستلام)</div>`:''}
${g.extra?`<div class="giftrow" style="background:#1D44320d;border-color:#1D443255">💰 أُضيف للشحنة مبلغ تعديلات محجوز بالخزنة: <b>${money(g.extra)}</b></div>`:''}""",
'بطاقة الطلب: إهداء + شارات رقمي/تعديل/مبالغ إضافية')

rep("""🎪 <b>حجز مناسبتك:</b> ${esc(g.booking.date)} · التركيب ${esc(g.booking.setup)}${g.booking.tear?' · الفك '+esc(g.booking.tear):''}${g.booking.geo?' · 📍 موقع المناسبة محدد لفريق التنسيق':''}${g.booking.note?' · '+esc(g.booking.note):''}</div>`:''}""",
"""🎪 <b>حجز مناسبتك:</b> ${esc(g.booking.date)} · التركيب ${esc(g.booking.setup)}${g.booking.tear?' · الفك '+esc(g.booking.tear):''}${g.booking.dl==='pickup'?' · 🚶 استلام من مقر المتجر بلا توصيل':' · 🚚 فريق المتجر يوصل ويركّب'}${g.booking.geo?' · 📍 موقع المناسبة محدد لفريق التنسيق':''}${g.booking.note?' · '+esc(g.booking.note):''}</div>`:''}""",
'بطاقة الطلب: تفصيل طريقة تسليم المناسبة')

# C4: الخدمات الميدانية — تأكيد الاستلام يصبح إدخال كود OTP
rep("""${st==='shipped'?`<button class="btn sm mt" onclick="confirmReceive(${o.id},${gi})">📦 استلمت الشحنة — ابدأ الفحص</button>`:''}""",
"""${st==='shipped'?(g.ship&&g.ship.mode==='field'?otpBox(o,g,gi):`<button class="btn sm mt" onclick="confirmReceive(${o.id},${gi})">📦 استلمت الشحنة — ابدأ الفحص</button>`):''}""",
'بطاقة الطلب: OTP للخدمات الميدانية بدل زر الاستلام')

# C5: شريط البوليصة — تنبيه قابل للكسر
rep("""${g.ship&&g.ship.charge?`<div class="hint">رسوم الشحن المدفوعة: ${money(g.ship.charge)} ← تُحوّل لحساب الشريك اللوجستي</div>`:(g.ship&&g.ship.source==='merchant'?'<div class="hint">الشحن على حساب المتجر 🎁 — وما يتحمله يُقتطع من صافيه ولا يمس العمولة</div>':'')}""",
"""${g.ship&&g.ship.charge?`<div class="hint">رسوم الشحن المدفوعة: ${money(g.ship.charge)} ← تُحوّل لحساب الشريك اللوجستي</div>`:(g.ship&&g.ship.source==='merchant'?'<div class="hint">الشحن على حساب المتجر 🎁 — وما يتحمله يُقتطع من صافيه ولا يمس العمولة</div>':'')}
${g.ship&&g.ship.fragile?`<div class="hint" style="color:#B3541E;font-weight:700">⚠️ قابل للكسر — العلامة منقولة آلياً لشركة الشحن: تغليف خاص إلزامي (رسوم حماية ١٥ ر.س ضمن الشحن)</div>`:''}""",
'شريط البوليصة: تنبيه قابل للكسر')

# C6: المحادثة — أزرار الموقع والمبلغ الإضافي + عرض رسائلهما
rep("""${g.chat.map(m=>omsgHTML(m,g)).join('')}""",
"""${g.chat.map((m,i)=>omsgHTML(m,g,i)).join('')}""",
'chatlog: تمرير فهرس الرسالة')

rep("""${canWrite?`<div class="composer">
<textarea id="omsg" placeholder="اكتب تفاصيل طلبك أو استفسارك… (محادثة مراقبة: تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً)"></textarea>
<button class="btn" onclick="sendOMsg()">إرسال ➤</button>
</div>`:`<div class="composer"><div class="hint" style="padding:8px;line-height:1.8">${g.chatDeleted?'🚫 حُذفت المحادثة نهائياً بعد رصد ٣ مخالفات لسياسة التواصل خارج التطبيق — للاعتراض راسل دعم ضمين.':archived?'🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض افتح نزاعاً خلال نافذة الحماية.':r==='admin'?'🛡️ أنت بوضع المراقبة — الإدارة تطلع ولا تشارك':'🔒 سجّل دخولك كأحد طرفي الطلب للمشاركة'}</div></div>`}""",
"""${canWrite?`<div class="chatbar">${r==='customer'?`<button class="btn soft xs" onclick="sendMyLoc()">📍 مشاركة موقعي مع المتجر</button>`:''}${r==='merchant'?`<button class="btn amb xs" onclick="mAskExtra()">💰 طلب مبلغ إضافي (تعديل)</button>`:''}</div>
<div class="composer">
<textarea id="omsg" placeholder="اكتب تفاصيل طلبك أو استفسارك… (محادثة مراقبة: تُحجب الأرقام والروابط ووسائل التواصل الخارجية تلقائياً)"></textarea>
<button class="btn" onclick="sendOMsg()">إرسال ➤</button>
</div>`:`<div class="composer"><div class="hint" style="padding:8px;line-height:1.8">${g.chatDeleted?'🚫 حُذفت المحادثة نهائياً بعد رصد ٣ مخالفات لسياسة التواصل خارج التطبيق — للاعتراض راسل دعم ضمين.':archived?'🗄️ أُرشفت المحادثة فور تسليم الشحنة — للاعتراض افتح نزاعاً خلال نافذة الحماية.':r==='admin'?'🛡️ أنت بوضع المراقبة — الإدارة تطلع ولا تشارك':'🔒 سجّل دخولك كأحد طرفي الطلب للمشاركة'}</div></div>`}""",
'composer: أزرار الموقع والمبلغ الإضافي')

rep("""function omsgHTML(m,g){
if(m.r==='sys')return `<div class="msg r-s">🔔 ${esc(m.t)}<div style="font-size:9px;margin-top:2px">${ago(m.at)}</div></div>`;
const o=DB.orders.find(x=>x.id===OCHAT.oid);
const who=m.r==='customer'?(USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'العميل'):ST(g.store).name;
const mine=SES&&((m.r==='customer'&&SES.role==='customer'&&o.customer===SES.phone)||(m.r==='merchant'&&SES.role==='merchant'&&g.store===SES.store));
return `<div class="msg ${mine?'me':'them'} ${m.r==='customer'?'r-c':'r-m'}" ${m.r==='merchant'?`style="--mc:${ST(g.store).color}"`:''}><span class="who">${m.r==='customer'?'👩 '+who:'🏪 '+who}</span>${esc(m.t)}<div style="font-size:9px;margin-top:3px;opacity:.7">${ago(m.at)}</div></div>`;
}""",
"""function omsgHTML(m,g,mi){
if(m.r==='sys')return `<div class="msg r-s">🔔 ${esc(m.t)}<div style="font-size:9px;margin-top:2px">${ago(m.at)}</div></div>`;
const o=DB.orders.find(x=>x.id===OCHAT.oid);
const who=m.r==='customer'?(USERS[o.customer]?USERS[o.customer].name.split(' ')[0]:'العميل'):ST(g.store).name;
const mine=SES&&((m.r==='customer'&&SES.role==='customer'&&o.customer===SES.phone)||(m.r==='merchant'&&SES.role==='merchant'&&g.store===SES.store));
const stamp=`<div style="font-size:9px;margin-top:3px;opacity:.7">${ago(m.at)}</div>`;
if(m.loc)return `<div class="msg ${mine?'me':'them'} ${m.r==='customer'?'r-c':'r-m'}" ${m.r==='merchant'?`style="--mc:${ST(g.store).color}"`:''}><span class="who">${m.r==='customer'?'👩 '+who:'🏪 '+who} · 📍 مشاركة موقع</span><span class="locpin">📍 ${esc(m.loc.txt)}${m.loc.geo?` (${ard(m.loc.geo.lat)}، ${ard(m.loc.geo.lng)})`:''}</span>${stamp}</div>`;
if(m.payreq){const custSide=SES&&SES.role==='customer';
return `<div class="msg ${mine?'me':'them'} ${m.r==='merchant'?'r-m':'r-c'}" ${m.r==='merchant'?`style="--mc:${ST(g.store).color}"`:''}><span class="who">${m.r==='merchant'?'🏪 '+who:'👩 '+who} · 💰 طلب مبلغ إضافي</span>
<div class="payreq"><b>تعديل بـ ${money(m.payreq.amt)}</b>${m.payreq.note?`<span class="hint">${esc(m.payreq.note)}</span>`:''}
${m.payreq.paid?`<span class="tag grn">✓ سُدد وحُجز في الخزنة — ${esc(m.payreq.via||'محفظة ضمين')}</span>`:custSide?`<button class="btn amb xs" onclick="payExtra(${o.id},${OCHAT.gi},${mi})">🔒 ادفع ${money(m.payreq.amt)} بضمان ضمين</button>`:`<span class="tag amb">بانتظار دفع العميل</span>`}
</div>${stamp}</div>`}
return `<div class="msg ${mine?'me':'them'} ${m.r==='customer'?'r-c':'r-m'}" ${m.r==='merchant'?`style="--mc:${ST(g.store).color}"`:''}><span class="who">${m.r==='customer'?'👩 '+who:'🏪 '+who}</span>${esc(m.t)}${stamp}</div>`;
}""",
'omsgHTML: رسائل الموقع وطلب المبلغ الإضافي')

print('== D. لوحة التاجر والإدارة والمكتبة الرقمية ==')

# D1: dlBadge — منتج رقمي + قابل للكسر + قابل للتعديل
rep("""const M={chilled:{ic:'🧊',l:'توصيل مبرد — حساس للحرارة',d:'يُجدول النظام تلقائياً توصيلاً مبرداً مع أقرب شركة متعاقدة بعد تأكيد الطلب.'},
instant:{ic:'🛵',l:'توصيل فوري',d:'يبحث النظام عن مندوب فوري فور تأكيد الطلب — التسليم المتوقع خلال ٤٥ دقيقة.'},
field:{ic:'🎪',l:'خدمة ديكور وتنسيق ميداني',d:'توصيل وتركيب وفك بفريق المتجر — مع حجز موعد مناسبتك ومشاركة موقعها (GPS) عند الطلب.'},
ship:{ic:'📦',l:'قابل للشحن',d:'تُصدر له بوليصة آلية عبر شركاء ضمين اللوجستيين (OTO/Torod).'}};
const m=M[t];if(!m)return '';
return `<div style="display:flex;gap:10px;align-items:flex-start;background:var(--card2);border:1px dashed var(--line);border-radius:12px;padding:9px 12px;margin-bottom:9px"><span style="font-size:18px">${m.ic}</span><div><b style="font-size:12px">${m.l}</b><div class="hint">${m.d}</div>${p.giftOk?'<div class="hint" style="color:var(--amb2);font-weight:700">🎁 قابل للإهداء — أضف اسم المستلم وجواله عند إتمام الطلب</div>':''}</div></div>`;""",
"""const M={chilled:{ic:'🧊',l:'توصيل مبرد — حساس للحرارة',d:'يُرسل مندوب مجهز بحافظة برودة (Cooling Box) داخل نفس المدينة، أو شحن مبرد بين المدن عبر شركات مبردة متعاقدة (OTO/Torod) حسب موقعك.'},
instant:{ic:'🛵',l:'توصيل فوري',d:'يبحث النظام عن مندوب فوري فور تأكيد الطلب داخل مدينة المتجر فقط — التسليم المتوقع خلال ٤٥ دقيقة حفاظاً على حرارة الطبق.'},
field:{ic:'🎪',l:'خدمة ديكور وتنسيق ميداني',d:'بلا شحن تجاري: فريق المتجر يوصل ويركّب في موقع المناسبة (أو تستلم من مقر المتجر)، مع حجز موعد مسبق ودردشة تنسيق بعد الدفع لإرسال موقعك.'},
digital:{ic:'⚡',l:'منتج رقمي — تسليم فوري',d:'الكود/الملف يوصلك لحظة الدفع في «مكتبتك الرقمية» عبر رابط مؤقت آمن (S3 Signed) صالح ١٠ دقائق — ٠ ر.س شحن ولا انتظار.'},
ship:{ic:'📦',l:'قابل للشحن',d:'تُصدر له بوليصة آلية عبر شركاء ضمين اللوجستيين (OTO/Torod).'}};
const m=M[t];if(!m)return '';
return `<div style="display:flex;gap:10px;align-items:flex-start;background:var(--card2);border:1px dashed var(--line);border-radius:12px;padding:9px 12px;margin-bottom:9px"><span style="font-size:18px">${m.ic}</span><div><b style="font-size:12px">${m.l}</b><div class="hint">${m.d}</div>${p.fragile?'<div class="hint" style="color:#B3541E;font-weight:700">⚠️ قابل للكسر — تنبيه تلقائي في بوليصة الشحن + رسوم حماية ١٥ ر.س تُضاف لسعر الشحن</div>':''}${p.customOk?'<div class="hint" style="color:var(--amb2);font-weight:700">✏️ قابل للتعديل حسب طلبك — بعد الدفع تفتح دردشة التعديلات مع التاجر (طلب أي مبلغ إضافي يكون بضمان ضمين)</div>':''}${p.giftOk?'<div class="hint" style="color:var(--amb2);font-weight:700">🎁 قابل للإهداء — يكفي جوال المستلم ومدينته عند إتمام الطلب</div>':''}</div></div>`;""",
'dlBadge: رقمي + قابل للكسر + قابل للتعديل + إهداء مبسط')

# D2: شارات بطاقات منتجات التاجر
rep("""${p.ptype==='chilled'?'<span class="mpstat" style="color:#2E6B8A">🧊 مبرد</span>':p.ptype==='instant'?'<span class="mpstat" style="color:var(--amb2)">🛵 فوري</span>':p.ptype==='field'?'<span class="mpstat" style="color:#A45A3A">🎪 ميداني</span>':p.ptype==='ship'?'<span class="mpstat">📦 شحن</span>':''}${p.giftOk?'<span class="mpstat" style="color:var(--red)">🎁 إهداء</span>':''}""",
"""${p.ptype==='chilled'?'<span class="mpstat" style="color:#2E6B8A">🧊 مبرد</span>':p.ptype==='instant'?'<span class="mpstat" style="color:var(--amb2)">🛵 فوري</span>':p.ptype==='field'?'<span class="mpstat" style="color:#A45A3A">🎪 ميداني</span>':p.ptype==='digital'?'<span class="mpstat" style="color:#50489E">⚡ رقمي فوري</span>':p.ptype==='ship'?'<span class="mpstat">📦 شحن</span>':''}${p.fragile?'<span class="mpstat" style="color:#B3541E">⚠️ قابل للكسر</span>':''}${p.customOk?'<span class="mpstat" style="color:#A45A3A">✏️ تعديلات</span>':''}${p.giftOk?'<span class="mpstat" style="color:var(--red)">🎁 إهداء</span>':''}""",
'mpstats: شارات رقمي/كسر/تعديلات')

# D3: فورم منتج التاجر — قسم الديكور (كسر + تعديل) + قسم الألعاب (رقمي + إقرار الملكية)
rep("""${sec.id==='deco'?`<div class="fld mt"><label>🚚 نوع المنتج — يحدد مسار التسليم</label>
<select class="inp" id="mp-ptype">
<option value="ship" ${!p||!p.ptype||p.ptype==='ship'?'selected':''}>منتج قابل للشحن — بوليصة آلية (هدايا، شوكولاتة، ورد)</option>
<option value="field" ${p&&p.ptype==='field'?'selected':''}>خدمة ديكور وتنسيق ميداني — توصيل وتركيب فريقك + حجز مواعيد المناسبات</option>
</select>
<div class="mt"><label style="display:flex;gap:8px;align-items:center;font-size:11.5px;font-weight:700;cursor:pointer"><input type="checkbox" id="mp-gift" ${p&&p.giftOk?'checked':''} style="width:17px;height:17px"> 🎁 تفعيل «إهداء لشخص آخر» — يدخل العميل اسم المستلم وجواله عند الطلب</label></div></div>`:''}""",
"""${sec.id==='deco'?`<div class="fld mt"><label>🚚 طبيعة الشحن والاحتياجات الخاصة — تحدد مسار التسليم</label>
<select class="inp" id="mp-ptype">
<option value="ship" ${!p||!p.ptype||p.ptype==='ship'?'selected':''}>منتج قابل للشحن — بوليصة آلية (هدايا، شوكولاتة، ورد)</option>
<option value="field" ${p&&p.ptype==='field'?'selected':''}>خدمة ديكور وتنسيق ميداني — فريقك يوصل ويركّب (أو استلام من مقرك) + حجز مواعيد المناسبات</option>
</select>
<div class="mt" style="display:flex;flex-direction:column;gap:7px">
<label style="display:flex;gap:8px;align-items:center;font-size:11.5px;font-weight:700;cursor:pointer"><input type="checkbox" id="mp-gift" ${p&&p.giftOk?'checked':''} style="width:17px;height:17px"> 🎁 تفعيل «إهداء لشخص آخر» — يُطلب جوال المستلم ومدينته فقط عند الطلب</label>
<label style="display:flex;gap:8px;align-items:center;font-size:11.5px;font-weight:700;cursor:pointer"><input type="checkbox" id="mp-frag" ${p&&p.fragile?'checked':''} style="width:17px;height:17px"> ⚠️ قابل للكسر — تنبيه تلقائي في بوليصة الشحن + رسوم حماية ١٥ ر.س تُضاف لسعر الشحن</label>
<label style="display:flex;gap:8px;align-items:center;font-size:11.5px;font-weight:700;cursor:pointer"><input type="checkbox" id="mp-custom" ${p&&p.customOk?'checked':''} style="width:17px;height:17px"> ✏️ يقبل التعديل حسب طلب العميل — تفتح دردشة تعديلات بعد الدفع مع طلب مبالغ إضافية</label>
</div></div>`:''}
${sec.id==='gaming'?`<div class="fld mt"><label>🎮 طبيعة المنتج والشحن — تُبرمج آلية التسليم تلقائياً</label>
<select class="inp" id="mp-ptype" onchange="mPtypePrev()">
<option value="std" ${!p||((p.ptype||'std')==='std'&&!p.fragile)?'selected':''}>📦 جهاز أو ملحق ملموس — شحن قياسي عبر شركاء ضمين (OTO/Torod)</option>
<option value="fragile" ${p&&p.fragile?'selected':''}>⚠️ جهاز ملموس قابل للكسر — تغليف خاص إلزامي + رسوم حماية ١٥ ر.س تُضاف للشحن</option>
<option value="digital" ${p&&p.ptype==='digital'?'selected':''}>⚡ أصل رقمي (كود/ملف) — تسليم فوري بلا شحن إلى «مكتبة العميل الرقمية»</option>
</select></div>
<div id="mp-dextra"></div>`:''}""",
'فورم المنتج: طبيعة الشحن والاحتياجات الخاصة (ديكور + ألعاب)')

rep("""MIMG=p?p.imgs[0]:'';
ptsCostPrev();
}""",
"""MIMG=p?p.imgs[0]:'';
ptsCostPrev();
mPtypePrev();
}""",
'فورم المنتج: معاينة الحقول الرقمية عند الفتح')

# D4: mSaveProd — حفظ الشارات الجديدة + الرقمي + إقرار الملكية
rep("""function mSaveProd(pid){
const s=myStore(),sec=SEC(s.sec);
const nm=($('#mp-nm').value||'').trim(),pr=+($('#mp-pr').value||0),st=+($('#mp-st').value||0);
if(!nm||pr<1){toast('أكمل الاسم والسعر','err');return}
const specs={};($('#mp-sp').value||'').split('\\n').forEach(l=>{const i=l.indexOf(':');if(i>0)specs[l.slice(0,i).trim()]=l.slice(i+1).trim()});
const off=Math.min(90,Math.max(0,+($('#mp-off').value||0)));
const pts=Math.max(0,Math.min(500,Math.round(+($('#mp-pts').value||0)||0)));
const pv=ptsVal();const old=pid?(P(pid).pts||0):0;const dPts=pts-old;const cost=r2(dPts*pv);
if(cost>0&&(DB.storeWallets[s.id]||0)<cost){toast('محفظتك لا تكفي لتمويل '+ar(pts)+' نقطة ('+money(cost)+') — قلّل النقاط أو راجع محفظتك','err');return}
if(dPts!==0){DB.storeWallets[s.id]=r2((DB.storeWallets[s.id]||0)-cost);
DB.aPtsWallet=r2((DB.aPtsWallet||0)+cost);
DB.ptsFunding.unshift({store:s.id,amt:cost,pts:dPts,pname:nm,at:Date.now()})}
if(pid){const p=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs,pts,ptype:($('#mp-ptype')?$('#mp-ptype').value:(p.ptype||'std')),giftOk:$('#mp-gift')?$('#mp-gift').checked:!!p.giftOk});
if(MIMG)p.imgs=[MIMG,...p.imgs.slice(1)];
toast('حُفظ تعديل المنتج ✓'+(dPts?` — ${dPts>0?'خُصمت':'استُرجعت'} ${money(Math.abs(cost))} تمويل نقاط`:''),'ok')}
else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,pts,ptype:($('#mp-ptype')?$('#mp-ptype').value:'std'),giftOk:$('#mp-gift')?$('#mp-gift').checked:false,sold:0,rt:0,rc:0,imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[]});
toast('أُضيف المنتج لمتجرك ✓'+(pts?` — خُصمت ${money(cost)} تمويل ${ar(pts)} نقطة`:''),'ok')}
MPID=null;closeModal();render();
}""",
"""function mSaveProd(pid){
const s=myStore(),sec=SEC(s.sec);
const nm=($('#mp-nm').value||'').trim(),pr=+($('#mp-pr').value||0),st=+($('#mp-st').value||0);
if(!nm||pr<1){toast('أكمل الاسم والسعر','err');return}
const specs={};($('#mp-sp').value||'').split('\\n').forEach(l=>{const i=l.indexOf(':');if(i>0)specs[l.slice(0,i).trim()]=l.slice(i+1).trim()});
const off=Math.min(90,Math.max(0,+($('#mp-off').value||0)));
const pts=Math.max(0,Math.min(500,Math.round(+($('#mp-pts').value||0)||0)));
const pv=ptsVal();const old=pid?(P(pid).pts||0):0;const dPts=pts-old;const cost=r2(dPts*pv);
if(cost>0&&(DB.storeWallets[s.id]||0)<cost){toast('محفظتك لا تكفي لتمويل '+ar(pts)+' نقطة ('+money(cost)+') — قلّل النقاط أو راجع محفظتك','err');return}
let ptypeVal=(($('#mp-ptype')||{}).value)||'';
let fragile=false,customOk=false,digi=null,ipOK=false;
if(sec.id==='gaming'){
if(ptypeVal==='digital'){
ipOK=!!$('#mp-ip')&&$('#mp-ip').checked;
if(!ipOK){toast('⚖️ إقرار الملكية الفكرية إلزامي قبل رفع الملفات والأكواد الرقمية','err');return}
const dv=($('#mp-dval').value||'').trim();
if(dv.length<3){toast('أدخل قيمة الكود أو اسم الملف الرقمي','err');return}
digi={kind:$('#mp-dkind').value,val:dv,size:($('#df-hint')&&$('#df-hint').dataset.size)||''};}
fragile=(ptypeVal==='fragile');
ptypeVal=digi?'digital':'std';
}else if(sec.id==='deco'){
if(!['ship','field'].includes(ptypeVal))ptypeVal='ship';
fragile=!!$('#mp-frag')&&$('#mp-frag').checked;
customOk=!!$('#mp-custom')&&$('#mp-custom').checked;
}else{
if(!['chilled','instant'].includes(ptypeVal))ptypeVal='std';
}
if(dPts!==0){DB.storeWallets[s.id]=r2((DB.storeWallets[s.id]||0)-cost);
DB.aPtsWallet=r2((DB.aPtsWallet||0)+cost);
DB.ptsFunding.unshift({store:s.id,amt:cost,pts:dPts,pname:nm,at:Date.now()})}
if(pid){const p=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs,pts,ptype:ptypeVal||p.ptype||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:!!p.giftOk,fragile,customOk});
if(digi)p.digi=digi;if(ipOK)p.ipOK=true;
if(MIMG)p.imgs=[MIMG,...p.imgs.slice(1)];
toast('حُفظ تعديل المنتج ✓'+(dPts?` — ${dPts>0?'خُصمت':'استُرجعت'} ${money(Math.abs(cost))} تمويل نقاط`:''),'ok')}
else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,pts,ptype:ptypeVal||'std',giftOk:$('#mp-gift')?$('#mp-gift').checked:false,fragile,customOk,digi,sold:0,rt:0,rc:0,imgs:[MIMG||ZPOOL[Math.floor(Math.random()*ZPOOL.length)]],desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[]});
toast('أُضيف المنتج لمتجرك ✓'+(pts?` — خُصمت ${money(cost)} تمويل ${ar(pts)} نقطة`:''),'ok')}
MPID=null;closeModal();render();
}""",
'mSaveProd: حفظ الشارات + الرقمي + فرض الإقرار')

# D5: بطاقة طلب التاجر — الاستلام من المقر + OTP الميداني + شارات
rep("""${g.booking?`<div class="bkcard"><b style="font-size:11.5px">🎪 مناسبة العميل — حجز مؤكد</b>
<div class="hint" style="line-height:1.8;margin-top:4px">📅 ${esc(g.booking.date)} · التركيب ${esc(g.booking.setup)}${g.booking.tear?' · الفك '+esc(g.booking.tear):''}${g.booking.geo?' · 📍 موقع محدد ('+ard(g.booking.geo.lat)+'، '+ard(g.booking.geo.lng)+')':''}${g.booking.note?' · '+esc(g.booking.note):''}</div></div>`:''}""",
"""${g.booking?`<div class="bkcard"><b style="font-size:11.5px">🎪 مناسبة العميل — حجز مؤكد</b>
<div class="hint" style="line-height:1.8;margin-top:4px">📅 ${esc(g.booking.date)} · التركيب ${esc(g.booking.setup)}${g.booking.tear?' · الفك '+esc(g.booking.tear):''}${g.booking.dl==='pickup'?' · 🚶 يستلمها العميل من مقرك بلا توصيل':' · 🚚 فريقك يوصل ويركّب في الموقع'}${g.booking.geo?' · 📍 موقع محدد ('+ard(g.booking.geo.lat)+'، '+ard(g.booking.geo.lng)+')':''}${g.booking.note?' · '+esc(g.booking.note):''}</div></div>`:''}
${g.custom?`<div class="giftrow" style="background:#A45A3A12;border-color:#A45A3A66">✏️ طلب قابل للتعديل — ناقش العميل في المحادثة واطلب مبلغ أي إضافة من زر «طلب مبلغ إضافي» داخل الدردشة (يُحجز بضمان ضمين)</div>`:''}
${g.digi?`<div class="giftrow" style="background:#50489E12;border-color:#50489E66">⚡ طلب رقمي — سُلّم فوراً للعميل عند الدفع في مكتبته الرقمية، والمبلغ محجوز حتى نهاية نافذة الحماية (${secOf(g.store).win})</div>`:''}
${g.ship&&g.ship.fragile?`<div class="giftrow" style="background:#8A4B080f;border-color:#8A4B0866">⚠️ شحنة قابلة للكسر — نُقلت العلامة لشركة الشحن آلياً: تغليف خاص إلزامي + رسوم حماية ١٥ ر.س ضمن الشحن</div>`:''}""",
'بطاقة طلب التاجر: استلام المقر + شارات رقمي/تعديل/كسر')

rep("""${g.status==='preparing'?`<button class="btn amb sm mt" onclick="mShip(${o.id},${gi})">${g.logi&&g.logi.wb?'🚚 سلّم الشحنة للمندوب — بوليصة '+ar(g.logi.wb):'🚚 تم التركيب — انطلق الفريق'}</button>`:''}""",
"""${g.status==='preparing'?`<button class="btn amb sm mt" onclick="mShip(${o.id},${gi})">${g.logi&&g.logi.wb?'🚚 سلّم الشحنة للمندوب — بوليصة '+ar(g.logi.wb):(g.ship&&g.ship.mode==='field'?(g.booking&&g.booking.dl==='pickup'?'🚶 جهّز الطلب — العميل سيستلمه من مقرك':'🎪 انطلق الفريق إلى موقع المناسبة'):'🚚 حدّث حالة الشحن')}</button>`:''}
${g.status==='shipped'&&g.ship&&g.ship.mode==='field'?(g.otp?`<div class="bkcard" style="border-color:#1D443255;background:#1D44320a"><b style="font-size:11.5px">🎯 كود تأكيد إتمام الخدمة: <b class="fx" style="letter-spacing:3px;font-size:15px">${ar(g.otp)}</b></b><div class="hint" style="margin-top:4px;line-height:1.7">أظهره للعميل في موقع المناسبة — تُحرر مستحقاتك فور إدخاله من تطبيق العميل (لا تُصرف إلا بهذا الكود).</div></div>`:`<button class="btn amb sm mt" onclick="mSendOTP(${o.id},${gi})">🎯 اكتمل التركيب — أرسل كود التأكيد للعميل</button>`):''}""",
'بطاقة طلب التاجر: زر إرسال كود OTP بعد التركيب')

# D6: mShip — تفرع الاستلام من المقر
rep("""function mShip(oid,gi){const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='shipped';
if(g.logi&&g.logi.wb)g.logi.events.push({t:'استلم المندوب الشحنة من المتجر (Pickup مؤكد) — تحديث Webhook',at:Date.now()});
else if(g.logi)g.logi.events.push({t:'انطلق فريق المتجر للتركيب في موعد المناسبة',at:Date.now()});
pushNotif(o.customer,'🚚','طلبك في الطريق إليك',ST(g.store).name+' شحنت طلبك #'+ar(oid)+' — أكّد الاستلام عند وصوله',['orders']);
toast('سُجل الشحن 🚚','ok');render()}""",
"""function mShip(oid,gi){const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='shipped';
if(g.logi&&g.logi.wb)g.logi.events.push({t:'استلم المندوب الشحنة من المتجر (Pickup مؤكد) — تحديث Webhook',at:Date.now()});
else if(g.logi&&g.logi.mode==='field'&&g.booking&&g.booking.dl==='pickup')g.logi.events.push({t:'جُهّز الطلب لاستلام العميل من مقر المتجر — بلا توصيل',at:Date.now()});
else if(g.logi)g.logi.events.push({t:'انطلق فريق المتجر للتركيب في موعد المناسبة',at:Date.now()});
pushNotif(o.customer,'🚚','تحديث على طلبك',ST(g.store).name+' حدّثت طلبك #'+ar(oid)+(g.ship&&g.ship.mode==='field'?' — الفريق في موقع المناسبة، وبعد اكتمال التركيب يصلك كود التأكيد':' — أكّد الاستلام عند وصوله'),['orders']);
toast('سُجل التحديث 🚚','ok');render()}""",
'mShip: تفرعات الميداني والاستلام من المقر')

# D7: إعدادات التاجر — نطاق التوصيل الفوري + بطاقة الكوبونات
rep("""<div class="fld mt"><label>سقف الشحن المجاني — أدنى قيمة طلب (ر.س، 0 = معطَّل)</label><input class="inp" id="ms-fmin" type="number" min="0" value="${s.freeMin||0}"></div>""",
"""<div class="fld mt"><label>سقف الشحن المجاني — أدنى قيمة طلب (ر.س، 0 = معطَّل)</label><input class="inp" id="ms-fmin" type="number" min="0" value="${s.freeMin||0}"></div>
${sec.id==='family'?`<div class="fld mt"><label>🛵 نطاق التوصيل الفوري (كم داخل «${esc(s.city)}» فقط)</label><input class="inp" id="ms-range" type="number" min="1" max="60" value="${s.rangeKm||20}">
<p class="hint" style="margin-top:5px;line-height:1.8">الأطباق الطازجة تُوصل بمناديب فوريين داخل مدينتك فقط — يُمنع أي طلب من خارج النطاق تلقائياً حفاظاً على حرارة الوجبة (مثال: داخل الرياض أو على بعد ٢٠ كم).</p></div>`:''}""",
'إعدادات المتجر: نطاق التوصيل الفوري')

rep("""function mSaveShip(){const s=myStore();s.dlMode=$('#ms-dlm').value;s.freeMin=Math.max(0,Math.round(+($('#ms-fmin').value||0)));toast('حُفظت خيارات التوصيل ✓','ok');render()}""",
"""function mSaveShip(){const s=myStore();s.dlMode=$('#ms-dlm').value;s.freeMin=Math.max(0,Math.round(+($('#ms-fmin').value||0)));if($('#ms-range'))s.rangeKm=Math.min(60,Math.max(1,Math.round(+($('#ms-range').value||20))));toast('حُفظت خيارات التوصيل ✓','ok');render()}""",
'mSaveShip: حفظ النطاق')

rep("""<p class="hint mt" style="line-height:1.8">تظهر هوية متجرك لكل عملاء ضمين: اللوقو في بطاقات المتجر والبحث والأقسام، والغلاف كبانر لصفحة متجرك.</p>
</div>
</div>
<div>""",
"""<p class="hint mt" style="line-height:1.8">تظهر هوية متجرك لكل عملاء ضمين: اللوقو في بطاقات المتجر والبحث والأقسام، والغلاف كبانر لصفحة متجرك.</p>
</div>
${mcouponCard()}
</div>
<div>""",
'إعدادات المتجر: بطاقة كوبونات المتجر')

# D8: الإدارة — مستحقات OTP المعلقة + بطاقة الكوبونات الشاملة
rep("""const held=vaultNow();""",
"""const held=vaultNow();
const otpHeld=r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>g.ship&&g.ship.mode==='field'&&g.status==='shipped').reduce((x,g)=>x+g.sub,0),0));""",
'pgARev: حساب مستحقات OTP المعلقة')

rep("""['🔒 المحجوز في خزنة الضمان الآن (حماية المشترين)',money(held)],""",
"""['🔒 المحجوز في خزنة الضمان الآن (حماية المشترين)',money(held)],
['🎪 مستحقات خدمات ميدانية معلقة بانتظار كود تأكيد العميل (OTP)',money(otpHeld)],""",
'pgARev: بند مستحقات OTP')

rep("""<b class="fx" style="color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</b></div>`).join('')}</div></div>`;
}""",
"""<b class="fx" style="color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</b></div>`).join('')}</div></div>`+aCouponCard();
}""",
'pgARev: بطاقة كوبونات الإدارة')

# D9: صفحة المكتبة الرقمية + الدوال الجديدة (موقع/مبلغ إضافي/OTP/كوبونات/رقمي)
rep("""/* ================= السلة ================= */
function cartCalc(){""",
"""/* ================= المكتبة الرقمية ================= */
function pgDLib(){
if(!SES)return `<div class="pghead"><h1>📚 مكتبتي الرقمية</h1></div><div class="empty"><div class="em">🔐</div><b>سجّل دخولك لعرض مكتبتك</b><span>كل أصل رقمي تشتريه في ضمين يُسلَّم فوراً هنا</span><button class="btn mt" onclick="openAuth()">تسجيل الدخول</button></div>`;
const u=me();const lib=u.dlib||[];
return `<div class="pghead"><h1>📚 مكتبتي الرقمية</h1><span class="tag grn">${ar(lib.length)} أصل رقمي</span></div>
<p class="hint mb" style="line-height:1.8">⚡ كل لعبة رقمية أو كود اشتراك أو كتاب إلكتروني تشتريه يُسلَّم هنا فور الدفع — الأكواد تُعرض مباشرة، والملفات عبر روابط مؤقتة آمنة موقّعة (S3 Signed) صالحة ١٠ دقائق لكل عملية، وتبقى مشترياتك محفوظة دائماً ويمكن توليد رابط جديد في أي وقت.</p>
${lib.length?`<div class="pgrid">${lib.map((it,i)=>{const p=P(it.pid);const s=ST(it.store);
return `<div class="dlgcard" style="--c:${s.color}">
<div class="ph">${p?imgTag(p.imgs[0],'',''):''}</div>
<div class="pb">
<b style="font-size:12.5px;display:block;line-height:1.5">${esc(it.name)}</b>
<div class="hint" style="margin:3px 0 8px">${esc(s.name)} · طلب #${ar(it.oid)} · ${dt(it.at)}</div>
${it.kind==='code'?`<div class="dcode" id="dcode-${i}">••••-••••-••••-••••</div>
<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
<button class="btn soft xs" onclick="dReveal(${i})">👁️ إظهار الكود</button>
<button class="btn gray xs" onclick="dCopy(${i})">📋 نسخ</button></div>`
:`<div class="hint" style="margin-bottom:6px">📁 ${esc(it.val)}${it.size?' · '+esc(it.size):''}</div>
<button class="btn soft xs" onclick="dLink(${i})">🔗 تحميل عبر رابط مؤقت آمن</button>`}
</div></div>`}).join('')}</div>
<div class="hint mt" style="text-align:center">🔒 الروابط المؤقتة موقّعة رقمياً وتنتهي بعد ١٠ دقائق — والمحتوى محفوظ في مكتبتك دائماً.</div>`
:`<div class="empty"><div class="em">⚡</div><b>لا مشتريات رقمية بعد</b><span>تصفح «عالم الألعاب والأجهزة والمنتجات الرقمية» — التسليم فوري بعد الدفع بضمان ضمين</span><button class="btn mt" onclick="go('section','gaming')">🛒 تسوّق الرقميات</button></div>`}`;
}
function dReveal(i){const it=(me().dlib||[])[i];if(!it)return;const el=$('#dcode-'+i);if(!el)return;
if(el.dataset.on){el.textContent='••••-••••-••••-••••';delete el.dataset.on;return}
el.dataset.on='1';el.textContent=it.val;toast('الكود ظاهر الآن — انسخه واحتفظ به بأمان 🔒','ok')}
function dCopy(i){const it=(me().dlib||[])[i];if(!it)return;
const done=()=>toast('نُسخ الكود إلى الحافظة ✓','ok');
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(it.val).then(done,done);else done()}
let DLN=null;
function dLink(i){const it=(me().dlib||[])[i];if(!it)return;
const tok=Math.random().toString(36).slice(2,10).toUpperCase();
DLN={i,exp:Date.now()+600000};
openModal(`<div class="mhead"><b>🔗 رابط مؤقت آمن (S3 Signed URL)</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="demo mb"><b style="font-size:12px">${esc(it.val)}</b>
<p class="hint" style="margin-top:5px;word-break:break-all;direction:ltr;text-align:left;font-family:monospace;font-size:10.5px">https://files.dameen.sa/${encodeURIComponent(it.val)}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DMN%2F2026%2Fme-central-1%2Fs3%2Faws4_request&X-Amz-Expires=600&token=${tok}</p></div>
<div class="srow"><span>⏳ صلاحية الرابط</span><b class="cd" data-cd="${DLN.exp}" style="border:0;background:none;padding:0">${clock(DLN.exp-Date.now())}</b></div>
<div class="srow"><span>📁 الملف</span><b>${esc(it.val)}${it.size?' · '+esc(it.size):''}</b></div>
<button class="btn amb wide mt" onclick="dDownload()">⬇️ تنزيل الملف الآن</button>
<p class="hint mt" style="text-align:center">ينتهي الرابط تلقائياً بعد ١٠ دقائق — ويمكنك توليد رابط جديد من مكتبتك وقت الحاجة.</p>
</div>`)}
function dDownload(){
const it=((me().dlib||[])[(DLN||{}).i]);if(!it)return;
const txt='ضمين — تسليم رقمي آمن\\n====================\\nالمنتج: '+it.name+'\\nالمتجر: '+ST(it.store).name+'\\nرقم الطلب: #'+it.oid+'\\nالملف: '+it.val+'\\nالتاريخ: '+dt(it.at)+'\\n\\nرابط مؤقت موقع رقمياً (S3 Signed URL) صالح ١٠ دقائق.\\nشكراً لتسوقك بضمان ضمين 💚';
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\\ufeff'+txt],{type:'text/plain;charset=utf-8'}));
a.download=String(it.val).replace(/\\.[^.]+$/,'')+'-dameen.txt';
document.body.appendChild(a);a.click();a.remove();
toast('بدأ التنزيل عبر الرابط المؤقت ✓','ok')}
/* ===== كود تأكيد الخدمات الميدانية (OTP) ===== */
function otpBox(o,g,gi){
return `<div class="otpbox">
<div class="spread" style="flex-wrap:wrap"><b style="font-size:12px">🎯 تأكيد إتمام الخدمة بكود OTP</b>
${g.otp?`<span class="tag grn">الكود وصل جوالك: <b style="letter-spacing:2px">${ar(g.otp)}</b></span>`:'<span class="tag amb">بانتظار كود فريق التنسيق بعد التركيب</span>'}</div>
<p class="hint" style="margin:6px 0 9px;line-height:1.8">لا تُحرر مستحقات متجر الديكور والفعاليات إلا بإدخال كود التأكيد منك عند اكتمال التركيب في موقع المناسبة — حماية للطرفين، وبقية مبلغك محجوز بالخزنة حتى ذلك الحين.</p>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
<input class="inp" id="otpin-${o.id}" style="width:120px;text-align:center;letter-spacing:4px;font-weight:800" maxlength="4" placeholder="٠٠٠٠">
<button class="btn sm" onclick="checkOTP(${o.id},${gi})">✅ تأكيد إتمام الخدمة</button>
${g.otpBad?`<span class="tag red">${ar(g.otpBad)} محاولة خاطئة</span>`:''}
</div></div>`}
function mSendOTP(oid,gi){
const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.otp=String(Math.floor(1000+Math.random()*9000));
g.otpAt=Date.now();
if(g.chat&&!g.chatDeleted)g.chat.push({r:'sys',t:'🎯 أرسل فريق التنسيق كود تأكيد إتمام الخدمة — أدخله بعد اكتمال التركيب ليُحرر مستحق المتجر.',at:Date.now()});
pushNotif(o.customer,'🎯','كود تأكيد إتمام الخدمة','كودك لطلب #'+ar(oid)+': '+g.otp+' — أدخله في التطبيق بعد اكتمال التركيب في موقع المناسبة',['orders']);
toast('أُرسل كود التأكيد للعميل (محاكاة SMS) ✓','ok');render();
}
function checkOTP(oid,gi){
const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
const raw=(($('#otpin-'+oid)||{value:''}).value)||'';
const norm=String(raw).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).trim();
if(!g.otp){toast('لم يرسل المتجر كود التأكيد بعد','amb');return}
if(norm!==g.otp){g.otpBad=(g.otpBad||0)+1;toast('الكود غير صحيح — تأكد منه مع فريق التنسيق ('+ar(g.otpBad)+' محاولات)','err');render();return}
g.otpOk=true;g.status='received';g.complaintUntil=Date.now();
doRelease(o,g,'كود تأكيد العميل (OTP)',false);
toast('تم تأكيد إتمام الخدمة وحُرر مستحق المتجر 🎯','ok');render();
}
/* ===== مشاركة الموقع وطلب المبالغ الإضافية في محادثة الطلب ===== */
function sendMyLoc(){
if(!OCHAT)return;
const o=DB.orders.find(x=>x.id===OCHAT.oid);const g=o.groups[OCHAT.gi];
const u=me();
const done=(geo,txt)=>{
g.chat.push({r:'customer',loc:{geo,txt},at:Date.now()});
pushNotif(ST(g.store).owner,'📍','العميل شارك موقعه','وصل موقع العميل في محادثة طلب #'+ar(o.id)+' — لتوجيه الفريق بدقة',['m-orders']);
toast(geo?'شاركت موقعك الحالي مع المتجر ✓':'شاركت عنوانك المحفوظ كرسالة موقع (تعذر GPS)','ok');
ochatRefresh()};
const fallback=()=>{const a=(u.addrs||[]).find(x=>x.def)||(u.addrs||[])[0];done(null,(a&&a.a)?a.a:'موقعي')};
if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>done({lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)},'موقعي الحالي'),fallback,{timeout:8000});
else fallback();
}
function mAskExtra(){
if(!OCHAT)return;
openModal(`<div class="mhead"><b>💰 طلب مبلغ إضافي (تعديل)</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="demo mb"><b style="font-size:12px">سعّر التعديل الذي اتفقت عليه مع العميل</b><p class="hint" style="margin-top:3px;line-height:1.8">يُرسل طلب الدفع داخل المحادثة — يدفع العميل بضمان ضمين، ويُحجز المبلغ مع بقية قيمة الطلب في الخزنة حتى الاستلام والتحرير.</p></div>
<div class="fgrid"><div class="fld"><label>المبلغ (ر.س)</label><input class="inp" id="ex-amt" type="number" min="1" value="25"></div>
<div class="fld"><label>السبب (يظهر للعميل)</label><input class="inp" id="ex-note" placeholder="مثال: إضافة اسم مطرز على البوكس"></div></div>
<button class="btn amb wide mt" onclick="mAskExtraGo()">إرسال طلب الدفع للعميل</button>
</div>`)}
function mAskExtraGo(){
if(!OCHAT)return closeModal();
const o=DB.orders.find(x=>x.id===OCHAT.oid);const g=o.groups[OCHAT.gi];
const amt=Math.max(1,+((($('#ex-amt')||{value:0}).value)||0));
const note=(($('#ex-note')||{value:''}).value||'').trim();
g.chat.push({r:'merchant',payreq:{amt,note,paid:false},at:Date.now()});
pushNotif(o.customer,'💰','طلب التاجر مبلغاً إضافياً','قدّم متجر '+ST(g.store).name+' تعديلاً بـ'+money(amt)+' على طلبك #'+ar(o.id)+' — راجعه في محادثة الطلب',['orders']);
closeModal();toast('أُرسل طلب الدفع إلى العميل ✓','ok');ochatRefresh();
}
function payExtra(oid,gi,mi){
const o=DB.orders.find(x=>x.id===oid);if(!o)return;const g=o.groups[gi];const m=g.chat[mi];
if(!m||!m.payreq||m.payreq.paid)return;
const u=me();const amt=m.payreq.amt;
if((u.bal||0)>=amt){u.bal=r2((u.bal||0)-amt);m.payreq.via='محفظة ضمين'}
else{m.payreq.via='بطاقة مدى (Moyasar)'}
m.payreq.paid=true;
g.sub=r2(g.sub+amt);g.extra=r2((g.extra||0)+amt);
g.chat.push({r:'sys',t:'💰 حُجز مبلغ التعديل '+money(amt)+' في خزنة ضمين — إجمالي قيمة الشحنة الآن '+money(r2(g.sub+(g.dl||0)))+'، والمبلغ كله ضمن الحماية حتى الاستلام.',at:Date.now()});
pushNotif(ST(g.store).owner,'💰','دفع العميل مبلغ التعديل','حُجز '+money(amt)+' إضافية في طلب #'+ar(oid)+' — ضمن حماية ضمين حتى التحرير',['m-orders']);
toast('حُجز مبلغ التعديل في الخزنة بضمان ضمين ✓','ok');ochatRefresh();render();
}
/* ===== كوبونات المتجر والإدارة ===== */
function mcouponCard(){
const s=myStore();
const mine=Object.entries(DB.coupons).filter(([k,c])=>c.store===s.id);
return `<div class="acard"><h3>🎟️ كوبونات متجرك</h3>
<p class="hint mb" style="line-height:1.8">أصدر كوبونات خاصة بعملاء متجرك — يُطبق الكوبون عند الطلب على قيمة منتجاتك في السلة، والعمولة تُحسب بعد الخصم، ولا يمس الخصم رسوم الشحن.</p>
${mine.length?`<div class="rows mb">${mine.map(([k,c])=>`<div class="row" style="flex-wrap:wrap;gap:6px">
<div style="flex:1;min-width:130px"><b class="fx" style="letter-spacing:1px">${esc(k)}</b><div class="hint">${c.type==='pct'?ar(c.v)+'٪ بحد أقصى '+money(c.max||c.v):'خصم ثابت '+money(c.v)} · حد أدنى ${money(c.min||0)}${c.maxUses?' · حتى '+ar(c.maxUses)+' استخدام':''}</div></div>
<span class="tag grn">استُخدم ${ar(c.uses||0)} مرة</span>
<button class="btn red xs" onclick="mDelCoupon('${esc(k)}')">🗑</button></div>`).join('')}</div>`:'<div class="hint mb">لا كوبونات صادرة لمتجرك بعد — الكوبونات تزيد مبيعاتك وتجذب العملاء الجدد.</div>'}
<div class="fgrid">
<div class="fld"><label>الكود (أحرف إنجليزية)</label><input class="inp" id="mc-code" placeholder="مثال: ${s.id.toUpperCase()}-15" style="text-transform:uppercase"></div>
<div class="fld"><label>النوع</label><select class="inp" id="mc-type"><option value="pct">نسبة ٪</option><option value="amt">مبلغ ثابت (ر.س)</option></select></div>
</div>
<div class="fgrid mt">
<div class="fld"><label>القيمة</label><input class="inp" id="mc-v" type="number" min="1" value="10"></div>
<div class="fld"><label>أقصى خصم للنسبة (ر.س)</label><input class="inp" id="mc-max" type="number" min="1" value="50"></div>
<div class="fld"><label>أدنى قيمة طلب (ر.س)</label><input class="inp" id="mc-min" type="number" min="0" value="0"></div>
<div class="fld"><label>حد الاستخدام (٠ = بلا حد)</label><input class="inp" id="mc-uses" type="number" min="0" value="0"></div>
</div>
<button class="btn sm mt" onclick="mAddCoupon()">＋ إصدار كوبون لمتجرك</button>
</div>`}
function mAddCoupon(){
const s=myStore();
const code=(($('#mc-code')||{value:''}).value||'').trim().toUpperCase();
const type=($('#mc-type')||{value:'pct'}).value;
const v=+((($('#mc-v')||{value:0}).value)||0);
const mx=+((($('#mc-max')||{value:0}).value)||0);
const mn=+((($('#mc-min')||{value:0}).value)||0);
const us=+((($('#mc-uses')||{value:0}).value)||0);
if(!/^[A-Z0-9-]{3,15}$/.test(code)){toast('اكتب كوداً إنجليزياً من ٣ إلى ١٥ خانة (أحرف وأرقام و-)','err');return}
if(DB.coupons[code]){toast('هذا الكود مستخدم مسبقاً في ضمين','err');return}
if(v<1||(type==='pct'&&v>90)){toast('قيمة الكوبون بين ١ و٩٠٪ (أو مبلغ من ١ ر.س)','err');return}
if(type==='pct'&&!mx){toast('حدد أقصى مبلغ للخصم عند النسبة','err');return}
DB.coupons[code]={type,v,max:type==='pct'?mx:v,store:s.id,min:mn,uses:0,maxUses:us||0};
toast('صدر كوبون «'+code+'» لمتجرك ✓','ok');render();
}
function mDelCoupon(k){delete DB.coupons[k];toast('حُذف الكوبون «'+k+'»');render()}
function aCouponCard(){
const all=Object.entries(DB.coupons);
return `<div class="acard mt"><h3>🎟️ كوبونات الخصم — إدارة ضمين</h3>
<p class="hint mb" style="line-height:1.8">أصدر كوبونات شاملة لكل متاجر ضمين أو خاصة بمتجر بعينه، وتابع كوبونات التجار واستخداماتها — يُطبق الكوبون على قيمة المنتجات عند الطلب فقط.</p>
<div class="rows mb">${all.map(([k,c])=>`<div class="row" style="flex-wrap:wrap;gap:6px">
<div style="flex:1;min-width:140px"><b class="fx" style="letter-spacing:1px">${esc(k)}</b><div class="hint">${c.type==='pct'?ar(c.v)+'٪ بحد أقصى '+money(c.max||c.v):'خصم ثابت '+money(c.v)} · حد أدنى ${money(c.min||0)}</div></div>
<span class="tag ${c.store==='all'?'nvy':'gry'}">${c.store==='all'?'شامل لكل المتاجر':'متجر '+esc(ST(c.store).name)}</span>
<span class="tag grn">استُخدم ${ar(c.uses||0)}${c.maxUses?' / '+ar(c.maxUses):''}</span>
<button class="btn red xs" onclick="aDelCoupon('${esc(k)}')">🗑</button></div>`).join('')||'<div class="hint mb">لا كوبونات في المنصة بعد</div>'}</div>
<div class="fgrid">
<div class="fld"><label>الكود</label><input class="inp" id="ac-code" placeholder="مثال: DMN25" style="text-transform:uppercase"></div>
<div class="fld"><label>النطاق</label><select class="inp" id="ac-store"><option value="all">شامل لكل المتاجر</option>${STORES.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div>
</div>
<div class="fgrid mt">
<div class="fld"><label>النوع</label><select class="inp" id="ac-type"><option value="pct">نسبة ٪</option><option value="amt">مبلغ ثابت (ر.س)</option></select></div>
<div class="fld"><label>القيمة</label><input class="inp" id="ac-v" type="number" min="1" value="10"></div>
<div class="fld"><label>أقصى خصم للنسبة (ر.س)</label><input class="inp" id="ac-max" type="number" min="1" value="60"></div>
<div class="fld"><label>أدنى قيمة طلب (ر.س)</label><input class="inp" id="ac-min" type="number" min="0" value="0"></div>
</div>
<button class="btn sm mt" onclick="aAddCoupon()">＋ إصدار كوبون</button>
</div>`}
function aAddCoupon(){
const code=(($('#ac-code')||{value:''}).value||'').trim().toUpperCase();
const store=($('#ac-store')||{value:'all'}).value;
const type=($('#ac-type')||{value:'pct'}).value;
const v=+((($('#ac-v')||{value:0}).value)||0);
const mx=+((($('#ac-max')||{value:0}).value)||0);
const mn=+((($('#ac-min')||{value:0}).value)||0);
if(!/^[A-Z0-9-]{3,15}$/.test(code)){toast('اكتب كوداً إنجليزياً من ٣ إلى ١٥ خانة','err');return}
if(DB.coupons[code]){toast('هذا الكود مستخدم مسبقاً','err');return}
if(v<1||(type==='pct'&&v>90)){toast('قيمة الكوبون بين ١ و٩٠٪ (أو مبلغ من ١ ر.س)','err');return}
if(type==='pct'&&!mx){toast('حدد أقصى مبلغ للخصم عند النسبة','err');return}
DB.coupons[code]={type,v,max:type==='pct'?mx:v,store,min:mn,uses:0,maxUses:0};
toast('صدر كوبون «'+code+'» '+(store==='all'?'الشامل لكل المتاجر ✓':'لمتجر '+ST(store).name+' ✓'),'ok');render();
}
function aDelCoupon(k){delete DB.coupons[k];toast('حُذف الكوبون «'+k+'» من المنصة');render()}
/* ===== حقول المنتجات الرقمية في فورم التاجر ===== */
function mPtypePrev(){
const el=$('#mp-dextra');if(!el)return;
const v=($('#mp-ptype')||{value:'std'}).value;
const p=MPID?P(MPID):null;
if(v!=='digital'){el.innerHTML='';return}
el.innerHTML=`<div class="acard mt" style="padding:11px;border-color:#50489E55">
<b style="font-size:12px;color:#50489E">⚡ بيانات التسليم الرقمي</b>
<div class="fgrid mt">
<div class="fld"><label>نوع المحتوى</label><select class="inp" id="mp-dkind">
<option value="code" ${p&&p.digi&&p.digi.kind==='code'?'selected':''}>كود / مفتاح رقمي</option>
<option value="file" ${p&&p.digi&&p.digi.kind==='file'?'selected':''}>ملف (PDF / ZIP / حزمة ثيمات)</option></select></div>
<div class="fld"><label>القيمة أو اسم الملف</label><input class="inp" id="mp-dval" value="${p&&p.digi?esc(p.digi.val):''}" placeholder="مثال: GAME-XXXX-XXXX أو book.pdf"></div>
</div>
<div class="mt" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
<button class="btn soft sm" onclick="pickDigiFile()">📎 رفع الملف بأمان (تخزين مؤقت موقّع S3)</button>
<span class="hint" id="df-hint">يُسلّم للعميل عبر رابط مؤقت صالح ١٠ دقائق لكل عملية تحميل</span></div>
<div class="hr" style="margin:10px 0"></div>
<label style="display:flex;gap:8px;align-items:flex-start;font-size:11px;font-weight:700;cursor:pointer;background:#8A4B080a;border:1.5px dashed #8A4B0877;border-radius:11px;padding:9px 11px;line-height:1.7"><input type="checkbox" id="mp-ip" ${p&&p.ipOK?'checked':''} style="width:17px;height:17px;margin-top:2px"><span>⚖️ <b>إقرار الملكية الفكرية (إلزامي):</b> أتعهد أنني أملك كامل حقوق الملكية الفكرية للملفات والأكواد المرفوعة أو أنني موزّع معتمد مرخّص، وأتحمل كامل المسؤولية القانونية عن أي مخالفة، وأوافق على أن تحذف الإدارة أي محتوى مخالف وتوقف حسابي.</span></label>
</div>`}
function pickDigiFile(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const nm=f.name;$('#fup').value='';
const dv=$('#mp-dval');if(dv)dv.value=nm;
const dk=$('#mp-dkind');if(dk&&/\\.(zip|pdf|png|jpg|rar|7z)$/i.test(nm))dk.value='file';
const h=$('#df-hint');if(h){h.textContent='✓ رُفع «'+nm+'» ('+ar(Math.max(1,Math.round(f.size/1024)))+' كب) إلى التخزين المؤقت الموقّع';h.dataset.size=ar(Math.max(1,Math.round(f.size/1024)))+' كب'}
toast('رُفع الملف بأمان إلى التخزين المؤقت الموقّع (S3) ✓','ok')};
$('#fup').click()}

/* ================= السلة ================= */
function cartCalc(){""",
'دوال جديدة: مكتبة + OTP + موقع + مبلغ إضافي + كوبونات + رقمي')

# D10: تسجيل صفحة المكتبة في المسارات والقائمة
rep("orders:pgOrders,disputes:pgDisputes,account:pgAccount,favs:pgFavs,",
"orders:pgOrders,dlib:pgDLib,disputes:pgDisputes,account:pgAccount,favs:pgFavs,",
'خرائط الصفحات: dlib')
rep("""${mnav('orders','🧾 طلباتي')}
${mnav('disputes','⚖️ نزاعاتي')}""",
"""${mnav('orders','🧾 طلباتي')}
${mnav('dlib','📚 مكتبتي')}
${mnav('disputes','⚖️ نزاعاتي')}""",
'قائمة العميل: رابط المكتبة الرقمية')

io.open(F,'w',encoding='utf-8').write(s)
print('')
print('DONE: %d edits — %s KB -> %s KB' % (n_edits, orig//1024, len(s)//1024))
