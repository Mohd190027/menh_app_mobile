
/* ================= الأدوات ================= */
const $=s=>document.querySelector(s);
const ar=n=>String(n).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ard=n=>{let s=(+(+n).toFixed(2)).toLocaleString('en-US');return ar(s).replace(/,/g,'٬').replace(/\./g,'٫')};
const money=n=>ard(n)+' ر.س';
const pctf=n=>ard(n)+'٪';
const r2=n=>Math.round(n*100)/100;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
function hash(s){let h=0;s=String(s);for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0}return Math.abs(h)}
function imgTag(src,cls,alt){src=src||'';const seed='d'+(hash(src+alt)%9973);return `<img src="${src}" class="${cls||''}" alt="${esc(alt||'صورة')}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${seed}/700/700'">`}
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function dt(ts){const d=new Date(ts);const h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');const t=(h%12||12)+':'+ar(m)+(h<12?' ص':' م');return ar(d.getDate())+' '+MONTHS[d.getMonth()]+'، '+t}
function ago(ts){const s=(Date.now()-ts)/1000;if(s<60)return'قبل لحظات';if(s<3600)return'قبل '+ar(Math.floor(s/60))+' د';if(s<86400)return'قبل '+ar(Math.floor(s/3600))+' س';return'قبل '+ar(Math.floor(s/86400))+' يوم'}
function clock(ms){if(ms<0)ms=0;const t=Math.floor(ms/1000);const h=String(Math.floor(t/3600)).padStart(2,'0'),m=String(Math.floor(t%3600/60)).padStart(2,'0'),s=String(t%60).padStart(2,'0');return ar(h+':'+m+':'+s)}
function toast(msg,type){const t=document.createElement('div');t.className='toast '+(type||'');t.innerHTML=(type==='ok'?'✓ ':type==='err'?'⚠ ':'◆ ')+msg;$('#toasts').appendChild(t);setTimeout(()=>{t.style.opacity=0;t.style.transform='translateY(-10px)';setTimeout(()=>t.remove(),320)},3400)}
const STARS=r=>{r=Math.round(r);return '<span class="stars">'+'★'.repeat(r)+'☆'.repeat(5-r)+'</span>'};

/* ================= الأقسام ================= */
const SECTIONS=[
{id:'fashion',name:'الأزياء',icon:'👗',color:'#7A3B44',winMin:120,win:'ساعتان',desc:'عبايات وأزياء وحقائب بلمسات محلية'},
{id:'family',name:'الأسرة المنتجة',icon:'🏡',color:'#556636',winMin:30,win:'٣٠ دقيقة',desc:'عسل وتمور ومنتجات بيتية طازجة'},
{id:'deco',name:'الديكور والهدايا',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'لمسات ديكور وهدايا تليق بذوقك'}];
const CATS={fashion:['عبايات','أزياء','حقائب وعطور'],family:['عسل وتمور','ألبان ومخبوزات','سدو وحرف'],deco:['ديكور','هدايا','قهوة وضيافة']};
const SEC=id=>SECTIONS.find(s=>s.id===id);

/* ================= المتاجر ================= */
const STORES=[
{id:'s1',name:'دَفى العبايات',sec:'fashion',owner:'0500000002',color:'#7A3B44',desc:'عبايات كتان وخامات فاخرة بخياطة سعودية متقنة',rt:4.8,sales:342,approved:true,susp:false,open:true},
{id:'s2',name:'خيوط الغندورة',sec:'fashion',owner:'0500000004',color:'#96505E',desc:'طرق بيتية وأزياء مطرزة يدوياً بخيوط ملونة',rt:4.6,sales:198,approved:true,susp:false,open:true},
{id:'s3',name:'مزرعة الواحة',sec:'family',owner:'0500000005',color:'#556636',desc:'عسل سدر وتمور خلاص من مزارعنا مباشرة',rt:4.9,sales:521,approved:true,susp:false,open:true},
{id:'s4',name:'بيت السدو',sec:'family',owner:'0500000006',color:'#6B7A3F',desc:'منتجات سدو أصيلة منسوجة على النول التقليدي',rt:4.7,sales:87,approved:true,susp:false,open:true},
{id:'s5',name:'لمسة ديكور',sec:'deco',owner:'0500000007',color:'#A45A3A',desc:'شموع ومباخر ومستلزمات منزل بأناقة هادئة',rt:4.5,sales:264,approved:true,susp:false,open:true},
{id:'s6',name:'هدايا المعمور',sec:'deco',owner:'0500000008',color:'#B26640',desc:'بوكسات هدايا مغلفة بفخامة تناسب كل مناسبة',rt:4.8,sales:173,approved:true,susp:false,open:true},
{id:'s7',name:'فخار الطائف',sec:'deco',owner:'0500000009',color:'#8F5B36',desc:'فخاريات مدوّرة يدوياً من طين الطائف',rt:4.4,sales:12,approved:false,susp:false,open:true}];
const ST=id=>STORES.find(s=>s.id===id);
const U='https://images.unsplash.com/photo-';
const IM=(id,s)=>U+id+'?q=80&w=760&auto=format&fit=crop';
const PICS=(s)=>'https://picsum.photos/seed/'+encodeURIComponent(s)+'/760/760';

/* ================= المنتجات ================= */
let PRODUCTS=[
{id:'p1',store:'s1',name:'عباية كتان «نسمة»',cat:'عبايات',price:349,off:15,stock:12,sold:214,rt:4.9,rc:86,imgs:[IM('1594633312681-425c7b97ccd1'),IM('1515372039744-b8f02a3ae446'),IM('1523381210434-271e8be1f52b')],
desc:'عباية كتان بخامة مصرية مريحة وقَصّة واسعة تناسب يومك كامل. تطريز يدوي دقيق على الأكمام يمنحها لمسة أنيقة بعيدة عن المبالغة، مع سحّاب جانبي مخفي وجيوب داخلية عملية.',
specs:{'الخامة':'كتان مصري ١٠٠٪','اللون':'كحلي غامق','المقاسات':'S / M / L / XL','العناية':'غسيل بارد يدوي'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'الخامة ثقيلة وفخمة والخياطة نظيفة جداً، وصلت قبل الموعد.',at:Date.now()-864e5*5}]},
{id:'p2',store:'s1',name:'عباية حرير مطرزة «ليان»',cat:'عبايات',price:520,off:0,stock:7,sold:97,rt:4.7,rc:41,imgs:[IM('1515372039744-b8f02a3ae446'),IM('1594633312681-425c7b97ccd1')],
desc:'عباية مناسبات من الحرير الطبيعي بتطريز لؤلؤي على الصدر والأكمام. مناسبة للمناسبات المسائية والدعوات الخاصة، تأتي مع كيس حفظ مبطن بالقطن.',
specs:{'الخامة':'حرير طبيعي','التطريز':'لؤلؤ يدوي','الطول':'متوفر حتى ٦٠ سم','التغليف':'كيس حفظ مبطن'},ratings:[]},
{id:'p3',store:'s1',name:'طرحة شيفون مزدوجة',cat:'عبايات',price:95,off:20,stock:30,sold:186,rt:4.6,rc:52,imgs:[IM('1523381210434-271e8be1f52b')],
desc:'طرحة شيفون بطبقتين لا تكشف ولا تنزلق، بخياطة مزدوجة تحفظ شكلها بعد الغسيل. متوفرة بعدة ألوان هادئة تناسب العبايات اليومية.',
specs:{'الخامة':'شيفون مزدوج','المقاس':'١٨٠ × ٧٥ سم','الألوان':'أسود / كحلي / زيتي'},ratings:[]},
{id:'p4',store:'s2',name:'طقم بيت قطني مطرز «دفء»',cat:'أزياء',price:189,off:0,stock:15,sold:143,rt:4.6,rc:33,imgs:[PICS('طقم-بيتي'),PICS('قطن-مطرز')],
desc:'طقم بيت من القطن المشغول بتطريز يدوي على الصدر. مريح للاستخدام اليومي والاستقبالات العائلية، خامة تتنفس ولا تسبب الحكة.',
specs:{'الخامة':'قطن مشغول','المقاسات':'M / L / XL','الألوان':'بيج / رمادي'},ratings:[]},
{id:'p5',store:'s2',name:'فستان سواريه مخمل «سهرة»',cat:'أزياء',price:640,off:10,stock:4,sold:58,rt:4.8,rc:19,imgs:[PICS('فستان-سهرة')],
desc:'فستان مخمل بقَصّة A كلاسيكية وأزرار لؤلؤية ظهرية. مثالي لحفلات الزواج والمناسبات المسائية، مع حاشية داخلية ناعمة تمنع الالتصاق.',
specs:{'الخامة':'مخمل مستورد','الطول':'ميدي','التنظيف':'تنظيف جاف فقط'},ratings:[]},
{id:'p6',store:'s2',name:'حقيبة يد جلد طبيعي',cat:'حقائب وعطور',price:280,off:0,stock:9,sold:121,rt:4.8,rc:22,imgs:[IM('1548036328-c9fa89d128fa')],
desc:'حقيبة يد من الجلد الطبيعي المدبوغ نباتياً، تصنع يدوياً وتأتي برائحة الجلد الأصيلة. تتسع للجوال والمحفظة والأساسيات، بحزام كتف قابل للفك.',
specs:{'الخامة':'جلد طبيعي مدبوغ','الحجم':'٢٤ × ١٦ سم','الحزام':'قابل للفك والتعديل'},ratings:[]},
{id:'p7',store:'s2',name:'عطر عود ملكي ٥٠ مل',cat:'حقائب وعطور',price:220,off:0,stock:18,sold:167,rt:4.7,rc:44,imgs:[IM('1541643600914-78a08a3003d8')],
desc:'عطر زيتي مركّز بمزيج العود الكمبودي والورد الطائفي، ثبات يمتد لأكثر من ثماني ساعات. يأتي في علبة خشبية تصلح للإهداء.',
specs:{'النوع':'زيتي مركّز','الحجم':'٥٠ مل','الثبات':'٨+ ساعات','التغليف':'علبة خشب'},ratings:[]},
{id:'p8',store:'s3',name:'عسل سدر جبلي ٥٠٠ جم',cat:'عسل وتمور',price:185,off:0,stock:26,sold:412,rt:4.9,rc:154,imgs:[PICS('عسل-سدر'),PICS('برطمان-عسل')],
desc:'عسل سدر جبلي خام غير مبستر، يُقطف من مناحلنا في مرتفعات الجنوب مرة واحدة في السنة. قوامه كثيف وطعمه غني، ويأتي ببرطمان زجاجي محكم الغلق مع شهادة منشأ.',
specs:{'النوع':'سدر خام','الوزن':'٥٠٠ جم','المصدر':'مرتفعات الجنوب','التخزين':'بعيداً عن الشمس'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'طعمه ما يشبه عسل جدي الله يرحمه، أصلي وواضح.',at:Date.now()-864e5*2}]},
{id:'p9',store:'s3',name:'تمر خلاص فاخر ١ كجم',cat:'عسل وتمور',price:65,off:10,stock:40,sold:380,rt:4.8,rc:96,imgs:[PICS('تمر-خلاص')],
desc:'تمر خلاص مفضل بدرجة أولى، حبة كبيرة لينة بحلاوة متوازنة. يُنتقى حبة حبة ويُعبأ في علبة أنيقة مناسبة للضيافة والإهداء.',
specs:{'النوع':'خلاص مفضل','الوزن':'١ كجم','الدرجة':'أولى'},ratings:[]},
{id:'p10',store:'s3',name:'دبس تمر بلدي',cat:'عسل وتمور',price:45,off:0,stock:22,sold:154,rt:4.6,rc:38,imgs:[PICS('دبس-تمر')],
desc:'دبس تمر بلدي مطبوخ على الحطب دون أي إضافات أو سكريات. كثيف بلون العنبر، مثالي مع الفطور الشتوي والحلويات الشعبية.',
specs:{'الوزن':'٤٠٠ جم','المكوّنات':'تمر فقط'},ratings:[]},
{id:'p11',store:'s3',name:'سلة الواحة (عسل + تمر + دبس)',cat:'عسل وتمور',price:265,off:12,stock:14,sold:98,rt:4.9,rc:27,imgs:[PICS('سلة-هدايا-عسل')],
desc:'سلة خشبية تجمع عسل سدر ٢٥٠ جم وتمر خلاص ٥٠٠ جم ودبس بلدي، مغلفة بجبينة كتان وشريط. الهدية المثالية للمناسبات وزيارات العزيمة.',
specs:{'المحتوى':'٣ منتجات','التغليف':'سلة خشب + كتان'},ratings:[]},
{id:'p12',store:'s4',name:'مفرش سدو للطاولة',cat:'سدو وحرف',price:420,off:0,stock:5,sold:64,rt:4.7,rc:29,imgs:[PICS('سدو-مفرش')],
desc:'مفرش منسوج على النول الأصلي بخيوط صوف ملونة بنقوش السدو النجدية. كل قطعة تستغرق أسبوعين من النسج اليدوي، ولا تتكرر بنفس توزيعة الألوان.',
specs:{'الخامة':'صوف طبيعي','المقاس':'١٤٠ × ٩٠ سم','الصناعة':'نول يدوي'},ratings:[]},
{id:'p13',store:'s4',name:'حزام سدو منسوج',cat:'سدو وحرف',price:150,off:0,stock:8,sold:73,rt:4.5,rc:17,imgs:[PICS('حزام-سدو')],
desc:'حزام منسوج بخيوط السدو الملوّنة مع إبزيم نحاسي مصقول. قطعة تراثية عملية تلبس مع الثوب أو كإكسسوار عصري فوق المعطف.',
specs:{'العرض':'٤ سم','الإبزيم':'نحاس'},ratings:[]},
{id:'p14',store:'s4',name:'جبن قريش بلدي ٣٥٠ جم',cat:'ألبان ومخبوزات',price:25,off:0,stock:20,sold:96,rt:4.6,rc:31,imgs:[PICS('جبن-قريش')],
desc:'جبن قريش بلدي يُحضّر صباح كل يوم من حليب المزرعة، قوامه طري وملحه خفيف. يُسلّم مبرداً في نفس يوم صناعته.',
specs:{'الوزن':'٣٥٠ جم','الصلاحية':'٥ أيام مبردة'},ratings:[]},
{id:'p15',store:'s4',name:'خبز تميس بيتي (٤ حبات)',cat:'ألبان ومخبوزات',price:12,off:0,stock:35,sold:640,rt:4.8,rc:203,imgs:[PICS('خبز-تميس')],
desc:'تميس بيتي يُخبز على التنور الحجري بعجين مخمّر ببطء. يخرج ساخناً مع الزبدة والعسل الأسود، ويُسلّم في أكياس حرارية تحفظ حرارته.',
specs:{'الكمية':'٤ حبات','التسليم':'ساخن يومياً'},ratings:[]},
{id:'p16',store:'s5',name:'شمعة ياسمين معطرة',cat:'ديكور',price:65,off:0,stock:28,sold:231,rt:4.5,rc:47,imgs:[PICS('شمعة-ياسمين')],
desc:'شمعة صويا معطرة برائحة الياسمين المسائي، فتيل قطني نظيف يحترق دون دخان. تعبئ المنزل بهدوء لأكثر من ٣٥ ساعة، في وعاء زجاجي يعاد استخدامه.',
specs:{'الشمعة':'شمع صويا','الرائحة':'ياسمين','مدة الاحتراق':'٣٥+ ساعة','الوزن':'٢٢٠ جم'},ratings:[]},
{id:'p17',store:'s5',name:'مبخرة نحاسية مزخرفة',cat:'ديكور',price:140,off:20,stock:11,sold:158,rt:4.7,rc:39,imgs:[PICS('مبخرة-نحاس')],
desc:'مبخرة نحاسية بنقش يدوي ومقبض حراري معزول. تأتي مع طبق فحم عازل وغطاء محفور يوزع الدخان بلطف، قطعة تجمع بين الأصالة والاستخدام اليومي.',
specs:{'الخامة':'نحاس مطروق','التشطيب':'نقش يدوي','يشمل':'طبق فحم + غطاء'},ratings:[]},
{id:'p18',store:'s5',name:'طقم فناجيل قهوة مذهّب (٦)',cat:'قهوة وضيافة',price:195,off:0,stock:9,sold:129,rt:4.8,rc:26,imgs:[PICS('فناجيل-قهوة')],
desc:'ستة فناجيل بورسلين بحافة مذهّبة مقاومة للاحتكاك، تصلح للقهوة والشاي. تصميم بقوارير رفيعة يليق بالمجالس، وتأتي في علبة مبطنة تصلح للإهداء.',
specs:{'العدد':'٦ فناجيل','الخامة':'بورسلين','الطلاء':'ذهبي ٢٤ قيراط'},ratings:[]},
{id:'p19',store:'s6',name:'بوكس هدايا «شكراً» مخمل',cat:'هدايا',price:240,off:0,stock:16,sold:174,rt:4.8,rc:31,imgs:[IM('1549465220-1a8b9238cd48'),PICS('بوكس-هدايا')],
desc:'بوكس مخمل فارغ يضم ٤ علب داخلية و٣ بطاقات إهداء بألوان هادئة، يعاد تشكيله حسب المناسبة. التغليف يشمل شريط ساتان وبطاقة يدوية بخط جميل.',
specs:{'المحتوى':'٤ علب + ٣ بطاقات','اللون':'أخضر زيتي / كحلي','التغليف':'ساتان + بطاقة'},ratings:[]},
{id:'p20',store:'s6',name:'لوحة خط عربي مؤطرة «الفرج»',cat:'هدايا',price:160,off:0,stock:7,sold:88,rt:4.6,rc:18,imgs:[PICS('لوحة-خط')],
desc:'لوحة خط ديواني بكلمة «الفرج» مرسومة يدوياً بالحبر الأسود على ورق مقوى عاجي، بإطار خشب طبيعي وزجاج عاكس. توقيع الخطاط على الزاوية.',
specs:{'المقاس':'٤٠ × ٣٠ سم','الإطار':'خشب طبيعي','الخط':'ديواني حر'},ratings:[]},
{id:'p21',store:'s7',name:'مزهرية فخار مزججة',cat:'ديكور',price:110,off:0,stock:6,sold:12,rt:4.4,rc:5,imgs:[PICS('مزهرية-فخار')],
desc:'مزهرية فخارية مدوّرة على الدولاب ومزججة بطلاء لامع غير متكرر. كل قطعة فريدة بدرجة لونها، من طين الطائف الأحمر.',
specs:{'الارتفاع':'٢٤ سم','الخامة':'فخار مزجج'},ratings:[]}
];

/* ================= الحسابات ================= */
const NOW=Date.now();
const USERS={
'0500000001':{name:'نورة العبدالله',role:'customer',pass:'1234',pts:340,bal:240,since:NOW-864e5*210,
ptsLog:[{t:'تحرير طلب #١٠٢١',v:29,at:NOW-864e5*6},{t:'تقييم تجربتك',v:10,at:NOW-864e5*6},{t:'استبدال في السلة',v:-100,at:NOW-864e5*9},{t:'تحرير طلب #١٠١٨',v:24,at:NOW-864e5*12}],
favs:['p1','p8'],addrs:[{t:'المنزل',a:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',def:true},{t:'العمل',a:'الرياض، طريق الملك فهد، برج المملكة، الدور ١٤'}],
notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false,email:'noura@mail.com'},
'0500000002':{name:'ريم الدوسري',role:'merchant',pass:'1234',store:'s1',since:NOW-864e5*400,notif:{ord:true,dis:true}},
'0500000003':{name:'فهد العتيبي',role:'admin',pass:'1234',since:NOW-864e5*500,notif:{dis:true}},
'0500000004':{name:'سارة الحربي',role:'merchant',pass:'1234',store:'s2',since:NOW-864e5*300},
'0500000005':{name:'ماجد القحطاني',role:'merchant',pass:'1234',store:'s3',since:NOW-864e5*380},
'0500000006':{name:'حصة الشمري',role:'merchant',pass:'1234',store:'s4',since:NOW-864e5*250},
'0500000007':{name:'عبدالله الزهراني',role:'merchant',pass:'1234',store:'s5',since:NOW-864e5*180},
'0500000008':{name:'منال الغامدي',role:'merchant',pass:'1234',store:'s6',since:NOW-864e5*150},
'0500000009':{name:'تركي الثقفي',role:'merchant',pass:'1234',store:'s7',since:NOW-864e5*20}};

/* ================= قاعدة البيانات الحيّة ================= */
const DB={
notifs:[
{to:'0500000001',ic:'🚚',t:'طلبك في الطريق',b:'مزرعة الواحة شحنت طلبك #١٠٢٢',at:NOW-36e5*5,read:false,go:['orders']},
{to:'0500000001',ic:'⏳',t:'نافذة الحماية بدأت',b:'بقي أقل من ٨ دقائق لتحرير تلقائي لطلب #١٠٢٣',at:NOW-6e5,read:false,go:['orders']},
{to:'0500000001',ic:'🎁',t:'عرض من قسم الأزياء',b:'خصومات تصل إلى ٢٠٪ على العبايات',at:NOW-864e5,read:true,go:['section','fashion']}],
aRevenue:1268.75,
revMonths:[{m:'يونيو',v:186},{m:'يوليو',v:212},{m:'أغسطس',v:254},{m:'سبتمبر',v:301},{m:'أكتوبر',v:316}],
storeWallets:{s1:4820.5,s2:2160,s3:9130.25,s4:1540,s5:3310,s6:2980,s7:0},
orders:[
{id:1018,customer:'0500000001',at:NOW-864e5*12,pay:'mada',addr:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',
groups:[{store:'s6',items:[{pid:'p19',qty:1,price:240}],sub:240,dl:0,status:'refunded',payout:{sub:240,comm:0,net:0}}]},
{id:1021,customer:'0500000001',at:NOW-864e5*6,pay:'mada',addr:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',
groups:[{store:'s1',items:[{pid:'p1',qty:1,price:296.65},{pid:'p3',qty:1,price:76}],sub:372.65,dl:0,status:'released',rated:{stars:5,txt:'وصلت بسرعة والخامات فخمة'},payout:{sub:372.65,comm:9.32,net:363.33},releasedAt:NOW-864e5*5}]},
{id:1022,customer:'0500000001',at:NOW-864e5*2,pay:'visa',addr:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',
groups:[{store:'s3',items:[{pid:'p8',qty:1,price:185},{pid:'p9',qty:2,price:58.5}],sub:243.5,dl:0,status:'shipped'}]},
{id:1023,customer:'0500000001',at:NOW-36e5*7,pay:'bal',addr:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',
groups:[{store:'s5',items:[{pid:'p16',qty:2,price:130}],sub:130,dl:12,status:'received',complaintUntil:NOW+8*60e3}]},
{id:1024,customer:'0500000001',at:NOW-864e5,pay:'mada',addr:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',
groups:[{store:'s4',items:[{pid:'p12',qty:1,price:420}],sub:420,dl:0,status:'disputed',complaintUntil:NOW+864e5}]}],
disputes:[
{id:'d0',order:1018,store:'s6',customer:'0500000001',subject:'لا يطابق الوصف',openedAt:NOW-864e5*11,status:'resolved',
ruling:{act:'refund',by:'الإدارة',text:'بعد الاطلاع على الصور المرفقة ومقارنتها بوصف المنتج، تبيّن اختلاف درجة اللون بشكل جوهري. اعتُمد استرجاع كامل المبلغ إلى محفظة العميلة.',at:NOW-864e5*10},
messages:[
{r:'sys',t:'فتحت العميلة نزاعاً على الطلب #١٠١٨ (متجر هدايا المعمور) بسبب: لا يطابق الوصف',at:NOW-864e5*11},
{r:'customer',t:'طلبت البوكس باللون الأخضر الزيتي كما في الصورة ووصل كحلي غامق تماماً، الفرق واضح جداً.',at:NOW-864e5*11+5e5,img:PICS('دليل-لون')},
{r:'merchant',t:'نعتذر عن الخطأ، يبدو أنه التباس في اللون عند التغليف. مستعدون لاستبدالها أو استرجاع المبلغ حسب ما تقرر الإدارة.',at:NOW-864e5*11+9e5},
{r:'sys',t:'أصدرت الإدارة حكمها: استرجاع كامل المبلغ للعميلة + تحذير للمتجر بضبط مطابقة الألوان.',at:NOW-864e5*10}]},
{id:'d1',order:1024,store:'s4',customer:'0500000001',subject:'المنتج تالف',openedAt:NOW-864e5+36e5,status:'open',ruling:null,
messages:[
{r:'sys',t:'فتحت العميلة نزاعاً على الطلب #١٠٢٤ (متجر بيت السدو) بسبب: المنتج تالف',at:NOW-864e5+36e5},
{r:'customer',t:'المفرش وصل بشد واضح عند أحد الأطراف مع خيط مقطوع، الضرر ظاهر من أول نظرة. مرفق صور الوضع عند الوصول.',at:NOW-864e5+36e5+3e5,img:PICS('دليل-سدو')},
{r:'merchant',t:'وعليكم السلام، نعتذر جداً عما وصلك. راجعنا تقرير الجودة قبل الشحن وكان سليماً، ويحتمل أن يكون الضرر من النقل. نرجو احتساب صور زاوية آخر للتأكد.',at:NOW-864e5+36e5+7e5}]}],
coupons:{DAMIN10:{type:'pct',v:10,max:50},SAVE20:{type:'pct',v:20,max:80}}};
const P=id=>PRODUCTS.find(p=>p.id===id);
const eff=p=>p.off?r2(p.price*(1-p.off/100)):p.price;
const stOK=s=>s.approved&&!s.susp;
const storeOwner=id=>{const s=ST(id);return s?USERS[s.owner]:null};
const secOf=id=>{const s=ST(id);return s?SEC(s.sec):SECTIONS[0]};

/* ================= الحالة ================= */
let SES=null,VIEW={page:'home'},CART=[],GFav=[],CK={step:0,addr:0,pay:'mada'},CPN=null,PTS=0,RATE={stars:0},COMP={sub:'damaged'},EVP=[];
const me=()=>SES?USERS[SES.phone]:null;
const isFav=pid=>{if(!SES)return GFav.includes(pid);const u=me();return u&&u.favs&&u.favs.includes(pid)};
const cartCount=()=>CART.reduce((a,c)=>a+c.qty,0);
/* ================= التنقل ================= */
function go(page,arg){
if(page==='section'){VIEW={page:'section',sec:arg,cat:'الكل',q:''}}
else if(page==='store')VIEW={page:'store',store:arg,q:''};
else if(page==='product')VIEW={page:'product',pid:arg,gi:0,q:''};
else if(page==='search')VIEW={page:'search',q:arg};
else VIEW={page};
if(VIEW.page.startsWith('m-')&&(!SES||SES.role!=='merchant')){toast('سجّل دخولك بحساب تاجر أولاً','err');openAuth('merchant');return}
if(VIEW.page.startsWith('a-')&&(!SES||SES.role!=='admin')){toast('هذه الصفحة مخصصة للإدارة','err');openAuth('admin');return}
closeModal();render();window.scrollTo({top:0,behavior:'smooth'});
}
function render(){
const app=$('#app');
const R={home:pgHome,search:pgSearch,section:pgSection,store:pgStore,product:pgProduct,cart:pgCart,orders:pgOrders,disputes:pgDisputes,account:pgAccount,favs:pgFavs,
'm-dash':pgMDash,'m-prods':pgMProds,'m-orders':pgMOrders,'m-wallet':pgMWallet,'m-disputes':pgMDisputes,'m-set':pgMSet,
'a-over':pgAOver,'a-disputes':pgADisputes,'a-stores':pgAStores,'a-users':pgAUsers,'a-rev':pgARev};
app.innerHTML=(R[VIEW.page]||pgHome)();
renderTop();renderFab();
}
function renderFab(){
const f=$('#fab');const show=!SES&&cartCount()>0;
f.style.display=show?'grid':'none';
f.innerHTML='🛒'+(cartCount()?`<span class="bdg">${ar(cartCount())}</span>`:'');
}
function searchGo(){const q=($('#sq')||{}).value||'';if(q.trim())go('search',q.trim())}

/* ================= القائمة العلوية ================= */
function renderTop(){
const t=$('#top');
const sbox=`<div class="sbox"><input id="sq" placeholder="ابحث عن منتج أو متجر…" value="${esc(VIEW.q||'')}" onkeydown="if(event.key==='Enter')searchGo()"><span class="si">🔎</span></div>`;
const brand=`<div class="brand" onclick="go('home')"><div class="lg">ض</div><div class="bt"><b>ضمين</b><small>تسوّق مضمون بثقة</small></div></div>`;
let h='';
if(!SES){ /* زائر: الاسم + البحث + الدخول فقط */
h=`<div class="topin">${brand}${sbox}<button class="btn" onclick="openAuth()">تسجيل الدخول</button></div>`;
}else if(SES.role==='merchant'){
const st=ST(SES.store);
h=`<div class="topin">${brand}${sbox}<nav class="nav">
${mnav('m-dash','📊 لوحة التحكم')}${mnav('m-prods','🧺 المنتجات')}${mnav('m-orders','📦 الطلبات')}${mnav('m-wallet','💰 المحفظة')}${mnav('m-disputes','⚖️ النزاعات')}${mnav('m-set','⚙️ الإعدادات')}
</nav>${bellBtn()}${roleDD()}</div>`;
}else if(SES.role==='admin'){
h=`<div class="topin">${brand}${sbox}<nav class="nav">
${mnav('a-over','📊 نظرة عامة')}${mnav('a-disputes','⚖️ التحكيم')}${mnav('a-stores','🏪 المتاجر')}${mnav('a-users','👥 المستخدمون')}${mnav('a-rev','📈 الإيرادات')}
</nav>${bellBtn()}${roleDD()}</div>`;
}else{ /* عميل مسجّل: القائمة الكاملة */
const u=me();
h=`<div class="topin">${brand}${sbox}<nav class="nav">
${mnav('home','الرئيسية')}
<div class="dd" onclick="event.stopPropagation();this.classList.toggle('open')">
<button class="nlink ${['section','store','product'].includes(VIEW.page)?'on':''}">🗂️ الأقسام ▾</button>
<div class="ddmenu">${SECTIONS.map(s=>`<div class="hti" onclick="go('section','${s.id}')"><b><span style="color:${s.color}">●</span> ${s.name}</b><span>${s.desc}</span></div>`).join('')}</div>
</div>
${mnav('favs','❤️ المفضلة')}
${mnav('orders','🧾 طلباتي')}
${mnav('disputes','⚖️ نزاعاتي')}
<button class="nlink" onclick="go('cart')">🛒 السلة${cartCount()?`<span class="bdg">${ar(cartCount())}</span>`:''}</button>
${mnav('account','👤 حسابي')}
</nav>${bellBtn()}${roleDD()}</div>`;
}
t.innerHTML=h;
}
const mnav=(p,l)=>`<button class="nlink ${VIEW.page===p?'on':''}" onclick="go('${p}')">${l}</button>`;
function bellBtn(){const n=DB.notifs.filter(x=>x.to===SES.phone&&!x.read).length;
return `<button class="iconbtn" onclick="openBell()" title="الإشعارات">🔔${n?`<span class="bdg">${ar(n)}</span>`:''}</button>`}
function roleDD(){const u=me();const roleTxt={customer:'عميل',merchant:'تاجر',admin:'الإدارة'}[SES.role];
return `<div class="dd" onclick="event.stopPropagation();this.classList.toggle('open')">
<div class="avat">${u.name[0]}</div>
<div class="ddmenu">
<div style="padding:9px 11px"><b style="font-size:13px">${esc(u.name)}</b><div class="hint">${ar(SES.phone)} · ${roleTxt}</div></div>
<div class="sep"></div>
${SES.role!=='customer'?`<div class="it" onclick="switchRole('customer')">🛍️ التسوق كعميل</div>`:''}
${SES.role!=='merchant'?`<div class="it" onclick="switchRole('merchant')">🏪 لوحة التاجر</div>`:''}
${SES.role!=='admin'&&u.role==='admin'?`<div class="it" onclick="switchRole('admin')">🛡️ مركز الإدارة</div>`:''}
<div class="it" onclick="go('account')">⚙️ حسابي وإعداداتي</div>
<div class="sep"></div>
<div class="it" style="color:var(--red)" onclick="logout()">⏻ تسجيل الخروج</div>
</div></div>`}

/* ================= الجلسة ================= */
function switchRole(r){
if(r==='customer'){SES.role='customer';go('home');return}
if(r==='merchant'){const own=STORES.find(s=>s.owner===SES.phone);
if(own){SES.role='merchant';SES.store=own.id;go('m-dash')}
else if(me().role==='admin'){SES.role='merchant';SES.store='s1';go('m-dash')}
else{toast('لا يوجد متجر مرتبط بحسابك — استخدم حساب التاجر التجريبي','amb');openAuth('merchant')}
return}
if(r==='admin'){if(me().role==='admin'){SES.role='admin';go('a-over')}else{toast('الإدارة تدخل بحساب المشرف العام فقط','err');openAuth('admin')}}
}
function logout(){SES=null;VIEW={page:'home'};go('home');toast('تم تسجيل الخروج، تجوّل بحرية 👋')}

/* ================= الدخول ================= */
let AUTH={tab:'login'};
function openAuth(hint){AUTH={tab:'login',hint:hint||''};openModal(authHTML());}
function authTab(t){AUTH.tab=t;$('#authbody').innerHTML=authBody()}
function authHTML(){return `<div class="mhead"><b>بوابة ضمين</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody" id="authbody">${authBody()}</div>`}
function authBody(){
if(AUTH.tab==='login')return `
<p class="hint mb">سجّل دخولك لإتمام الطلب ومتابعة نزاعاتك — التصفح والإضافة للسلة متاحان دون تسجيل.</p>
<div class="fld"><label>رقم الجوال</label><input class="inp" id="lg-ph" placeholder="05xxxxxxxx" value="0500000001"></div>
<div class="fld mt"><label>كلمة المرور</label><input class="inp" type="password" id="lg-pw" placeholder="••••" value="1234"></div>
<button class="btn wide mt" onclick="doLogin()">دخول</button>
<div class="hr"></div>
<p class="hint b7" style="text-align:center">دخول سريع تجريبي</p>
<div class="fgrid" style="grid-template-columns:1fr 1fr 1fr;gap:8px">
<button class="btn soft sm" onclick="quickLogin('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="quickLogin('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="quickLogin('admin')">🛡️ إدارة</button>
</div>
<p class="hint mt" style="text-align:center">ليس لديك حساب؟ <a style="color:var(--amb);font-weight:700;cursor:pointer" onclick="authTab('reg')">أنشئ حساباً جديداً</a></p>`;
return `
<p class="hint mb">حساب جديد في دقيقة — واحصل على ٥٠ نقطة ترحيبية قابلة للاستبدال.</p>
<div class="fld"><label>الاسم الكامل</label><input class="inp" id="rg-nm" placeholder="مثال: نورة العبدالله"></div>
<div class="fgrid mt">
<div class="fld"><label>رقم الجوال</label><input class="inp" id="rg-ph" placeholder="05xxxxxxxx"></div>
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="rg-pw" placeholder="٤ أرقام فأكثر"></div>
</div>
<button class="btn wide mt" onclick="doRegister()">إنشاء الحساب</button>
<p class="hint mt" style="text-align:center">لديك حساب؟ <a style="color:var(--amb);font-weight:700;cursor:pointer" onclick="authTab('login')">تسجيل الدخول</a></p>`;
}
function doLogin(){
const ph=($('#lg-ph').value||'').trim(),pw=($('#lg-pw').value||'').trim();
const u=USERS[ph];
if(!u||u.pass!==pw){toast('رقم الجوال أو كلمة المرور غير صحيحة','err');return}
SES={phone:ph,role:u.role,store:u.store||null};
closeModal();toast('أهلاً بك '+esc(u.name)+' 👋','ok');
if(u.role==='merchant')go('m-dash');else if(u.role==='admin')go('a-over');else{render()}
}
function doRegister(){
const nm=($('#rg-nm').value||'').trim(),ph=($('#rg-ph').value||'').trim(),pw=($('#rg-pw').value||'').trim();
if(!nm||ph.length<10||pw.length<4){toast('أكمل البيانات: الاسم، جوال ١٠ أرقام، كلمة مرور ٤ فأكثر','err');return}
if(USERS[ph]){toast('هذا الرقم مسجل مسبقاً — سجّل دخولك','amb');authTab('login');return}
USERS[ph]={name:nm,role:'customer',pass:pw,pts:50,bal:0,since:Date.now(),ptsLog:[{t:'هدية الترحيب بضمين',v:50,at:Date.now()}],favs:[...GFav],addrs:[],notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false};
GFav=[];
SES={phone:ph,role:'customer'};
closeModal();toast('تم إنشاء حسابك وأُضيفت ٥٠ نقطة ترحيبية 🎉','ok');render();
}
function quickLogin(r){
const map={customer:'0500000001',merchant:'0500000002',admin:'0500000003'};
const u=USERS[map[r]];SES={phone:map[r],role:u.role,store:u.store||null};
closeModal();toast('دخلت كـ'+esc(u.name)+' ('+({customer:'عميل',merchant:'تاجر',admin:'إدارة'}[r])+')','ok');
if(r==='merchant')go('m-dash');else if(r==='admin')go('a-over');else render();
}

/* ================= الإشعارات ================= */
function pushNotif(to,ic,t,b,goArgs){
DB.notifs.unshift({to,ic,t,b,at:Date.now(),read:false,go:goArgs||null});
if(SES&&SES.phone===to)toast(ic+' '+t);
renderTop();
}
function openBell(){
const list=DB.notifs.filter(n=>n.to===SES.phone);
list.forEach(n=>n.read=true);
openModal(`<div class="mhead"><b>🔔 الإشعارات</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody" style="padding:10px 14px">
${list.length?list.map(n=>`<div class="row" style="display:flex;gap:11px;padding:11px 4px;border-bottom:1px dashed #EAE3D0;align-items:flex-start;${n.go?'cursor:pointer':''}" ${n.go?`onclick="closeModal();go('${n.go[0]}${n.go[1]?",'"+n.go[1]+"'":""}')"`:''}>
<div style="font-size:20px">${n.ic}</div>
<div style="flex:1"><b style="font-size:13px">${esc(n.t)}</b><div class="hint">${esc(n.b)}</div></div>
<div class="hint" style="white-space:nowrap">${ago(n.at)}</div></div>`).join(''):`<div class="empty"><div class="em">🔕</div><b>لا إشعارات بعد</b><span>ستظهر هنا تحديثات طلباتك ونزاعاتك</span></div>`}
</div>`);
}

/* ================= النوافذ ================= */
function openModal(html,cls){$('#modals').innerHTML=`<div class="mback" onclick="if(event.target===this)closeModal()"><div class="mcard ${cls||''}">${html}</div></div>`;document.body.style.overflow='hidden'}
function closeModal(){$('#modals').innerHTML='';document.body.style.overflow=''}
function zoomImg(src){openModal(`<div class="mhead"><b>عرض الصورة</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody" style="text-align:center"><img src="${src}" style="width:100%;border-radius:16px;border:1px solid var(--line)"></div>`)}
/* ================= بطاقة المنتج ================= */
function pcard(p){
const s=ST(p.store),sec=SEC(s.sec),e=eff(p),fav=isFav(p.id);
return `<div class="pcard" onclick="go('product','${p.id}')">
<div class="ph">${p.off?`<span class="offb">خصم ${ar(p.off)}٪</span>`:''}<span class="secb" style="--c:${sec.color}">${sec.name}</span>
<button class="favh ${fav?'on':''}" onclick="event.stopPropagation();toggleFav('${p.id}')">${fav?'♥':'♡'}</button>
${imgTag(p.imgs[0],'','')} </div>
<div class="pb"><div class="nm">${esc(p.name)}</div>
<div class="st">${STARS(p.rt)} <span>${ar(p.rc)}</span><span>·</span><span>${esc(s.name)}</span></div>
<div class="pr"><b>${money(e)}</b>${p.off?`<s>${ard(p.price)}</s>`:''}</div></div></div>`;
}
const pubProds=()=>PRODUCTS.filter(p=>stOK(ST(p.store)));

/* ================= الرئيسية ================= */
function pgHome(){
const u=me();
const bubs=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,12);
const best=[...pubProds()].sort((a,b)=>b.sold-a.sold).slice(0,8);
const track=bubs.map(p=>{const sec=secOf(p.store);
return `<div class="bub" style="--c:${sec.color}" onclick="go('product','${p.id}')">
<div class="ring"><div>${imgTag(p.imgs[0],'','')}</div></div><b>${esc(p.name)}</b><span>${ard(eff(p))} ر.س</span></div>`}).join('');
return `
<div class="hero">
<h1>${u?'أهلاً بك يا '+esc(u.name.split(' ')[0])+' 👋':'تسوّق <em>بضمين</em>… مالك محجوز حتى ترضى'}</h1>
<p>نحجز مبلغك في خزنة مستقلة، ولا يستلم التاجر إلا بعد استلامك وتقييمك — والعمولة ٢٫٥٪ تذهب مباشرة للإدارة.</p>
<div class="trust"><span class="tchip"><i>🔒</i> خزنة ضمان مستقلة</span><span class="tchip"><i>⏱️</i> تحرير تلقائي بانتهاء نافذة الحماية</span><span class="tchip"><i>⚖️</i> تحكيم ثلاثي الأطراف</span></div>
</div>

<div class="bubzone"><div class="lbl"><span class="dot"></span> يتحرك الآن بين المتاجر — انقر أي منتج${''} <span class="sw"><i class="on"></i><i></i><i></i></span></div>
<div class="bubwrap"><div class="bubtrack">${track}${track}</div></div></div>

<div class="secthead"><h2>الأقسام الثلاثة</h2><div class="ln"></div><span class="hint">اختر قسمك وابدأ بضمان</span></div>
<div class="trio">${SECTIONS.map(s=>{
const sts=STORES.filter(x=>x.sec===s.id&&stOK(x)).length;
const prs=PRODUCTS.filter(p=>SEC(ST(p.store).sec).id===s.id&&stOK(ST(p.store))).length;
return `<div class="tri" style="--c:${s.color}" onclick="go('section','${s.id}')">
<div class="ic">${s.icon}</div>
<div class="tx"><b>${s.name}</b><span>${ars(sts)} متاجر · ${ars(prs)} منتج</span></div>
<div class="win"><i>نافذة الحماية</i><b>${s.win}</b></div></div>`}).join('')}</div>

<div class="secthead"><h2>الأكثر مبيعاً في ضمين</h2><div class="ln"></div><span class="more" onclick="go('section','${best[0]?secOf(best[0].store).id:'fashion'}')">تصفّح الأقسام ←</span></div>
<div class="pgrid">${best.map(pcard).join('')}</div>

<div class="secthead"><h2>كيف يعمل ضمين؟</h2><div class="ln"></div></div>
<div class="how">
<div class="howc"><div class="n">١</div><div><b>اطلب وادفع</b><span>يُحجز مبلغك في خزنة ضمين المستقلة — لا يلمسه التاجر.</span></div></div>
<div class="howc"><div class="n">٢</div><div><b>استلم وقيّم</b><span>خلال نافذة حماية القسم، افحص طلبك بكل راحة.</span></div></div>
<div class="howc"><div class="n">٣</div><div><b>نحرر المبلغ</b><span>بالرضا أو تلقائياً — صافي التاجر يحرر لحظتها، والعمولة للإدارة.</span></div></div>
</div>`;
}
function ars(n){return ar(n)}

/* ================= البحث ================= */
function pgSearch(){
const q=(VIEW.q||'').trim();
const ql=q.replace(/[أإآ]/g,'ا');
const hit=s=>s.replace(/[أإآ]/g,'ا').includes(ql);
const ps=pubProds().filter(p=>hit(p.name)||hit(p.cat)||hit(ST(p.store).name));
const ss=STORES.filter(s=>stOK(s)&&hit(s.name));
return `<div class="pghead"><button class="backb" onclick="go('home')">→</button><h1>نتائج البحث عن «${esc(q)}»</h1><span class="tag gry">${ar(ps.length+ss.length)} نتيجة</span></div>
${ss.length?`<div class="secthead"><h2>متاجر</h2><div class="ln"></div></div><div class="ministores">${ss.map(s=>mstore(s)).join('')}</div>`:''}
<div class="secthead"><h2>منتجات</h2><div class="ln"></div></div>
${ps.length?`<div class="pgrid">${ps.map(pcard).join('')}</div>`:`<div class="empty"><div class="em">🔍</div><b>لا نتائج مطابقة</b><span>جرّب كلمة أعم مثل «عباية» أو «عسل»</span></div>`}`;
}

/* ================= بطاقة المتجر المصغّرة ================= */
function mstore(s){
const n=PRODUCTS.filter(p=>p.store===s.id).length;
return `<div class="mstore" style="--c:${s.color}" onclick="go('store','${s.id}')">
<div class="lg">${s.name[0]}</div>
<div><b>${esc(s.name)}</b><span class="mr">★ ${ard(s.rt)} · ${ar(n)} منتج${n>4?'':' جديد'}</span></div></div>`;
}

/* ================= صفحة القسم ================= */
function pgSection(){
const sec=SEC(VIEW.sec)||SECTIONS[0];
const cats=['الكل',...CATS[sec.id]];
const stores=STORES.filter(s=>s.sec===sec.id&&stOK(s));
let ps=PRODUCTS.filter(p=>ST(p.store).sec===sec.id&&stOK(ST(p.store)));
if(VIEW.cat!=='الكل')ps=ps.filter(p=>p.cat===VIEW.cat);
return `<div class="pghead"><button class="backb" onclick="go('home')">→</button><h1>${sec.icon} ${sec.name}</h1></div>
<div class="sechero" style="--acc:${sec.color}">
<div class="ic">${sec.icon}</div>
<div style="flex:1"><h1>${sec.name}</h1><p>${sec.desc} — ${ars(stores.length)} متاجر موثوقة بنفس القسم</p></div>
<div class="winb">🛡️ نافذة الحماية: ${sec.win}</div>
</div>
<div class="secthead"><h2>متاجر القسم</h2><div class="ln"></div></div>
<div class="ministores">${stores.map(mstore).join('')}</div>
<div class="chiprow" style="margin-top:6px">${cats.map(c=>`<button class="chip ${VIEW.cat===c?'on':''}" style="--acc:${sec.color}" onclick="VIEW.cat='${c}';render()">${c}</button>`).join('')}</div>
<div class="secthead"><h2>${ars(ps.length)} منتجاً</h2><div class="ln"></div></div>
${ps.length?`<div class="pgrid">${ps.map(pcard).join('')}</div>`:`<div class="empty"><div class="em">🧺</div><b>لا منتجات في هذا التصنيف حالياً</b><span>تابع المتاجر قريباً</span></div>`}`;
}

/* ================= صفحة المتجر ================= */
function pgStore(){
const s=ST(VIEW.store);
if(!s)return pgHome();
const sec=SEC(s.sec);
const ps=PRODUCTS.filter(p=>p.store===s.id);
return `<div class="pghead"><button class="backb" onclick="go('section','${sec.id}')">→</button><h1>${esc(s.name)}</h1><span class="tag" style="background:${s.color}18;color:${s.color}">${sec.name}</span></div>
<div class="storeban" style="--c:${s.color}">
<div class="lg">${s.name[0]}</div>
<div style="flex:1"><h1>${esc(s.name)}</h1><p>${esc(s.desc)}</p>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:7px;font-size:11.5px;opacity:.95">
<span>★ ${ard(s.rt)} تقييم المتجر</span><span>·</span><span>${ars(s.sales)} طلباً مكتمل البيع</span><span>·</span><span>🛡️ نافذة حماية ${sec.win}</span></div></div>
${s.open?'':'<span class="tag wht">مغلق مؤقتاً</span>'}
</div>
<div class="secthead"><h2>منتجات المتجر (${ars(ps.length)})</h2><div class="ln"></div></div>
${ps.length?`<div class="pgrid">${ps.map(pcard).join('')}</div>`:`<div class="empty"><div class="em">🏪</div><b>لا منتجات معروضة الآن</b><span>المتجر يجهّز مفاجآته</span></div>`}`;
}
/* ================= صفحة المنتج ================= */
let QTY=1;
function pgProduct(){
const p=P(VIEW.pid);if(!p)return pgHome();
if(VIEW._pid!==VIEW.pid){VIEW._pid=VIEW.pid;QTY=1;VIEW.tab='desc';RATE={stars:0}}
const s=ST(p.store),sec=SEC(s.sec),e=eff(p),fav=isFav(p.id);
const similar=PRODUCTS.filter(x=>x.id!==p.id&&ST(x.store).sec===s.sec&&stOK(ST(x.store))).slice(0,4);
const gal=p.imgs.length>1?p.imgs:[p.imgs[0],p.imgs[0]];
const tab=VIEW.tab||'desc';
return `<div class="pghead"><button class="backb" onclick="go('store','${s.id}')">→</button><h1>${esc(p.name)}</h1><span class="tag" style="background:${sec.color}18;color:${sec.color}">${sec.name}</span></div>
<div class="ppage">
<div class="pgal">
<div class="main">${imgTag(gal[VIEW.gi||0],'','' )}</div>
${p.imgs.length>1?`<div class="thumbs">${p.imgs.map((im,i)=>`<img src="${im}" class="${i===(VIEW.gi||0)?'on':''}" onclick="VIEW.gi=${i};render()" onerror="this.onerror=null;this.src='https://picsum.photos/seed/d${hash(im)%997}/200/200'">`).join('')}</div>`:''}
<div class="gstrip"><span class="gi">🛡️</span><div><b>حماية ضمين مفعّلة على هذا المنتج</b><br>مبلغك يُحجز في خزنة مستقلة، ونافذة فحص القسم «${sec.name}» هي <b>${sec.win}</b> بعد الاستلام — للطلب أو الاسترجاع قبل التحرير.</div></div>
</div>
<div>
<div style="display:flex;gap:8px;align-items:flex-start">
<h2 style="font-size:18px;flex:1">${esc(p.name)}</h2>
<button class="iconbtn ${fav?'':''}" style="color:${fav?'var(--red)':'inherit'}" onclick="toggleFav('${p.id}')">${fav?'♥':'♡'}</button>
</div>
<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:4px 0 10px">
${STARS(p.rt)} <b style="font-size:12.5px">${ard(p.rt)}</b><span class="hint">(${ar(p.rc)} تقييم)</span>
<span class="hint">· بيع ${ar(p.sold)} مرة</span><span class="hint">· ${p.stock>0?'متوفر ('+ar(p.stock)+')':'نفدت الكمية'}</span>
</div>
<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px">
<span class="fx" style="font-size:26px;font-weight:800;color:var(--grn)">${money(e)}</span>
${p.off?`<s class="mut">${money(p.price)}</s><span class="tag red">وفّر ${ar(p.off)}٪</span>`:''}
</div>
<div class="hint mb">يبيعه متجر <a style="color:${s.color};font-weight:700;cursor:pointer" onclick="go('store','${s.id}')">${esc(s.name)}</a> ★ ${ard(s.rt)} · شحنة ضمن ${sec.win} حماية</div>
<div class="spread" style="gap:10px;flex-wrap:wrap">
<div class="qty"><button onclick="qStep(1)">＋</button><b id="qv">${ar(QTY)}</b><button onclick="qStep(-1)">−</button></div>
<button class="btn" style="flex:1" ${p.stock?'':'disabled'} onclick="addToCart('${p.id}',QTY)">🛒 أضف إلى السلة</button>
<button class="btn amb" ${p.stock?'':'disabled'} onclick="addToCart('${p.id}',QTY,true)">اشترِ الآن</button>
</div>
<div class="tabs">
<button class="${tab==='desc'?'on':''}" onclick="VIEW.tab='desc';render()">الوصف</button>
<button class="${tab==='specs'?'on':''}" onclick="VIEW.tab='specs';render()">المواصفات</button>
<button class="${tab==='revs'?'on':''}" onclick="VIEW.tab='revs';render()">التقييمات (${ar(p.rc)})</button>
</div>
${tab==='specs'?`<div>${Object.entries(p.specs).map(([k,v])=>`<div class="specrow"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>`:''}
${tab==='revs'?revBlock(p):''}
${tab==='desc'?`<p style="font-size:13.5px;line-height:1.95;color:#3d443a">${esc(p.desc)}</p>`:''}
</div></div>
<div class="secthead"><h2>منتجات مشابهة من قسم ${sec.name}</h2><div class="ln"></div></div>
<div class="pgrid">${similar.map(pcard).join('')}</div>`;
}
function revBlock(p){
const mine=p.ratings.some(r=>SES&&r.by===SES.phone);
return `<div style="margin-bottom:12px">
${mine||!SES?'':`<div class="acard" style="padding:14px"><b style="font-size:12.5px">أضف تقييمك للمنتج</b>
<div class="starin" id="rstars">${[1,2,3,4,5].map(i=>`<span onclick="starPick(${i})">★</span>`).join('')}</div>
<textarea class="inp" id="rtxt" placeholder="شاركي تجربتك بالتفصيل…" style="min-height:64px;margin-bottom:9px"></textarea>
<button class="btn sm" onclick="submitRating('${p.id}')">إرسال التقييم</button></div>`}
${p.ratings.length?p.ratings.slice().reverse().map(r=>`<div class="rev">
<div class="rh"><div class="av">👤</div><b>${esc(r.name||'عميل')}</b>${STARS(r.stars)}<span class="hint">${ago(r.at)}</span></div>
<p>${esc(r.txt)}</p></div>`).join(''):`<div class="empty" style="padding:26px"><div class="em">💬</div><b>لا تقييمات بعد</b><span>كن أول من يشارك تجربته</span></div>`}</div>`;
}
function starPick(n){RATE.stars=n;document.querySelectorAll('#rstars span').forEach((s,i)=>s.classList.toggle('on',i<n))}
function submitRating(pid){
if(!SES){toast('سجّل دخولك لتقييم المنتج','amb');openAuth();return}
const p=P(pid);if(!RATE.stars){toast('اختر عدد النجوم أولاً','err');return}
if(p.ratings.some(r=>r.by===SES.phone)){toast('قيّمت هذا المنتج مسبقاً','amb');return}
const txt=($('#rtxt')||{value:''}).value.trim();
p.ratings.push({by:SES.phone,name:me().name.split(' ')[0],stars:RATE.stars,txt,at:Date.now()});
p.rc++;p.rt=r2((p.rt*(p.rc-1)+RATE.stars)/p.rc);
toast('شكراً لتقييمك 💚','ok');render();
}
function qStep(d){const p=P(VIEW.pid);QTY=Math.min(Math.max(1,QTY+d),Math.max(1,p.stock||1));$('#qv').textContent=ar(QTY)}
function addToCart(pid,qty,buy){
const p=P(pid);if(!p.stock){toast('نفدت الكمية حالياً','err');return}
const ex=CART.find(c=>c.pid===pid);
if(ex)ex.qty=Math.min(ex.qty+qty,p.stock);else CART.push({pid,qty:Math.min(qty,p.stock)});
toast('أُضيف «'+esc(p.name)+'» إلى السلة','ok');
if(buy)go('cart');else{renderTop();renderFab()}
}
function toggleFav(pid){
if(!SES){GFav.includes(pid)?GFav=GFav.filter(x=>x!==pid):GFav.push(pid);toast(GFav.includes(pid)?'أُضيف للمفضلة (سيُحفظ عند التسجيل)':'أُزيل من المفضلة');render();return}
const u=me();u.favs=u.favs||[];
u.favs.includes(pid)?u.favs=u.favs.filter(x=>x!==pid):u.favs.push(pid);
toast(u.favs.includes(pid)?'❤️ أُضيف إلى مفضلتك':'أُزيل من المفضلة');render();
}
function pgFavs(){
const ids=SES?(me().favs||[]):GFav;
const ps=ids.map(P).filter(Boolean);
return `<div class="pghead"><h1>❤️ مفضلتي</h1><span class="tag amb">${ar(ps.length)} منتج</span></div>
${ps.length?`<div class="pgrid">${ps.map(pcard).join('')}</div>`:`<div class="empty"><div class="em">🤍</div><b>لا منتجات في مفضلتك بعد</b><span>اضغط ♡ على أي منتج يعجبك</span><button class="btn mt" onclick="go('home')">ابدأ التصفح</button></div>`}`;
}
/* ================= السلة ================= */
function cartCalc(){
const items=CART.map(c=>({...c,p:P(c.pid)})).filter(c=>c.p);
const groups={};items.forEach(c=>{(groups[c.p.store]=groups[c.p.store]||[]).push(c)});
const sub=r2(items.reduce((a,c)=>a+eff(c.p)*c.qty,0));
const dl=r2(Object.values(groups).reduce((a,g)=>a+(g.reduce((x,c)=>x+eff(c.p)*c.qty,0)>=200?0:12),0));
let cpn=0;if(CPN&&DB.coupons[CPN]){const c=DB.coupons[CPN];cpn=r2(Math.min(c.type==='pct'?sub*c.v/100:c.v,c.max))}
const ptsMax=SES?Math.floor(Math.min((me().pts||0))/100)*100:0;
let ptsUse=Math.min(PTS,Math.floor(Math.max(sub-cpn,0)/10)*100,ptsMax);ptsUse=Math.max(0,Math.floor(ptsUse/100)*100);
const ptsAmt=r2(ptsUse/10);
const total=r2(Math.max(0,sub+dl-cpn-ptsAmt));
return{items,groups,sub,dl,cpn,ptsMax,ptsUse,ptsAmt,total};
}
function pgCart(){
if(!CART.length)return `<div class="pghead"><h1>🛒 سلة التسوق</h1></div>
<div class="empty"><div class="em">🛒</div><b>سلتك فارغة</b><span>تجوّل بين الأقسام الثلاثة واختر ما يعجبك — الدفع محمي بضمان ضمين</span>
<button class="btn mt" onclick="go('home')">ابدأ التصفح</button></div>`;
const c=cartCalc();
return `<div class="pghead"><h1>🛒 سلة التسوق</h1><span class="tag grn">${ar(cartCount())} منتج · ${ar(Object.keys(c.groups).length)} شحنة</span></div>
<div class="cartgrid"><div>
${Object.entries(c.groups).map(([sid,its])=>{
const s=ST(sid),sec=SEC(s.sec),gsub=r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0));
return `<div class="cgroup">
<div class="cghead" style="--c:${s.color}"><div class="lg">${s.name[0]}</div>
<div style="flex:1"><b style="color:${s.color}">${esc(s.name)}</b><div class="hint">شحنة مستقلة · 🛡️ حماية ${sec.win} بعد الاستلام</div></div>
<span class="tag gry">${ar(its.length)} منتج</span></div>
${its.map(x=>{const p=x.p,e=eff(p);
return `<div class="citem" onclick="go('product','${p.id}')">
<div class="im">${imgTag(p.imgs[0],'','')}</div>
<div class="info">
<b style="font-size:13px">${esc(p.name)}</b>
<div class="hint">${esc(s.name)}${p.off?` · <span style="color:var(--red);font-weight:700">خصم ${ar(p.off)}٪</span>`:''}</div>
<div style="display:flex;gap:9px;align-items:center;margin-top:5px">
<div class="qty" onclick="event.stopPropagation()">
<button onclick="cartQty('${p.id}',1)">＋</button><b>${ar(x.qty)}</b><button onclick="cartQty('${p.id}',-1)">−</button>
</div>
<b class="fx" style="color:var(--grn)">${money(r2(e*x.qty))}</b>
</div></div>
<button class="iconbtn" style="width:33px;height:33px;font-size:12px" onclick="event.stopPropagation();rmCart('${p.id}')" title="إزالة">🗑️</button>
</div>`}).join('')}
<div class="cghead" style="border:0;border-top:1px solid var(--line);background:transparent">
<span>إجمالي الشحنة</span><b class="fx" style="margin-inline-start:auto">${money(gsub)}</b>
<span class="hint">+ شحن ${gsub>=200?'مجاني 🎉':money(12)}</span></div>
</div>`}).join('')}
</div>
<div class="sumbox">
<b class="fx" style="font-size:15px">ملخص الطلب</b>
<div class="hint mb" style="margin-top:2px">🔒 يُحجز المبلغ في خزنة ضمين ولا يُحرَّر للتاجر إلا بعد رضاك</div>
<div class="srow"><span>المجموع الفرعي (${ar(cartCount())} منتج)</span><b>${money(c.sub)}</b></div>
<div class="srow"><span>الشحن (${ar(Object.keys(c.groups).length)} شحنة)</span><b>${c.dl?money(c.dl):'مجاني'}</b></div>
<div class="hr" style="margin:8px 0"></div>
<div style="display:flex;gap:7px;margin-bottom:9px">
<input class="inp" id="cpnin" placeholder="كود الخصم (جرّب DAMIN10)" value="${CPN||''}" style="font-size:12px">
${CPN?`<button class="btn gray sm" onclick="CPN=null;render()">إلغاء</button>`:`<button class="btn sm" onclick="applyCoupon()">تطبيق</button>`}
</div>
${c.cpn?`<div class="srow disc"><span>خصم الكوبون ${CPN}</span><b>− ${money(c.cpn)}</b></div>`:''}
${SES?`
<div class="srow"><span>🌟 نقاطك: ${ar(me().pts||0)} نقطة</span>
<div style="display:flex;gap:5px">
${c.ptsMax>=100?`<button class="btn soft xs" onclick="ptsSet(${Math.min(100,c.ptsMax)})">+١٠٠</button>
${c.ptsMax>=300?`<button class="btn soft xs" onclick="ptsSet(${Math.min(300,c.ptsMax)})">+٣٠٠</button>`:''}
<button class="btn soft xs" onclick="ptsSet(${c.ptsMax})">الكل</button>`:''}
${PTS?`<button class="btn gray xs" onclick="ptsSet(0)">إلغاء ${ar(PTS)}</button>`:''}
</div></div>
${c.ptsUse?`<div class="srow disc"><span>خصم النقاط (${ar(c.ptsUse)} نقطة)</span><b>− ${money(c.ptsAmt)}</b></div>`:''}`
:`<div class="hint mb">🌟 سجّل دخولك لاستبدال نقاط الولاء (كل ١٠٠ نقطة = ١٠ ريال)</div>`}
<div class="srow tot"><span>الإجمالي</span><b>${money(c.total)}</b></div>
<button class="btn amb wide mt" onclick="startCheckout()">🔒 إتمام الطلب الآمن</button>
<p class="hint" style="text-align:center;margin-top:8px">عمولة ضمين ٢٫٥٪ تُحسم من التاجر — لا تُضاف عليك</p>
</div></div>`;
}
function cartQty(pid,d){const it=CART.find(c=>c.pid===pid);if(!it)return;
it.qty+=d;const p=P(pid);
if(it.qty>Math.max(1,p.stock||9)){it.qty=Math.max(1,p.stock||9);toast('الكمية المتاحة '+ar(p.stock||1),'amb')}
if(it.qty<=0)CART=CART.filter(c=>c.pid!==pid);
render()}
function rmCart(pid){CART=CART.filter(c=>c.pid!==pid);toast('أُزيل من السلة');render()}
function applyCoupon(){const v=($('#cpnin').value||'').trim().toUpperCase();
if(!v){CPN=null;render();return}
if(!DB.coupons[v]){toast('كود غير صالح','err');CPN=null;render();return}
CPN=v;toast('تم تطبيق الخصم 🎉','ok');render()}
function ptsSet(n){PTS=n;render()}

/* ================= بوابة الطلب ================= */
let OID=1025;
function startCheckout(){
if(!CART.length)return;
CK={step:SES?1:0,addr:me()&&me().addrs&&me().addrs.length?(me().addrs.findIndex(a=>a.def)>=0?me().addrs.findIndex(a=>a.def):0):-1,pay:'mada',geo:null};
openModal(ckHTML(),'lg');}
function ckHTML(){
const steps=['الحساب','الموقع','الدفع'];
const bars=steps.map((s,i)=>`<div class="ckstep ${CK.step===i?'on':(CK.step>i||((i===0)&&SES)?'done':'')}"><div class="b"></div>${s}</div>`).join('');
return `<div class="mhead"><b>🔒 بوابة الطلب الآمن</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody" id="ckbody">
<div class="cksteps">${bars}</div>${ckBody()}
</div>`;
}
function ckBody(){
if(CK.step===0)return `
<div class="demo mb"><b style="font-size:13px">🛡️ خطوة واحدة قبل الحجز</b>
<p class="hint" style="margin-top:3px">سلتك محفوظة كما هي — سجّل دخولك أو أنشئ حساباً لإكمال الحجز في خزنة ضمين.</p></div>
<div class="fld"><label>رقم الجوال</label><input class="inp" id="lg-ph" placeholder="05xxxxxxxx" value="0500000001"></div>
<div class="fgrid mt">
<div class="fld"><label>كلمة المرور</label><input class="inp" type="password" id="lg-pw" value="1234"></div>
<div class="fld" style="display:flex;align-items:flex-end"><button class="btn wide" onclick="ckLogin()">دخول ومتابعة</button></div>
</div>
<div class="hr"></div>
<p class="hint" style="text-align:center">أو جرب بحساب تجريبي:</p>
<div class="fgrid" style="grid-template-columns:1fr 1fr 1fr;gap:8px">
<button class="btn soft sm" onclick="ckQuick('customer')">🛍️ عميل</button>
<button class="btn soft sm" onclick="ckQuick('merchant')">🏪 تاجر</button>
<button class="btn soft sm" onclick="ckQuick('admin')">🛡️ إدارة</button></div>
<p class="hint mt" style="text-align:center">جديد على ضمين؟ <a style="color:var(--amb);font-weight:700;cursor:pointer" onclick="closeModal();openAuth()">أنشئ حساباً</a> ثم عُد لإتمام طلبك.</p>`;
if(CK.step===1){const u=me();
return `
<b style="font-size:13.5px" class="fx">📍 عنوان التسليم</b>
<div class="mt mb" style="display:flex;gap:8px;flex-wrap:wrap">
<button class="btn soft sm" onclick="useGeo()">🛰️ تحديد موقعي تلقائياً</button>
${CK.geo?`<span class="tag grn">✓ تم تحديد الموقع (٢٤٫٧١٣٦، ٤٦٫٦٧٥٣)</span>`:''}
</div>
${u.addrs&&u.addrs.length?u.addrs.map((a,i)=>`<div class="addrcard ${CK.addr===i?'on':''}" onclick="CK.addr=${i};ckRefresh()">
<div class="rd"></div><div style="flex:1"><b style="font-size:12.5px">${esc(a.t)} ${a.def?'<span class="tag grn" style="font-size:9px">افتراضي</span>':''}</b><div class="hint">${esc(a.a)}</div></div></div>`).join(''):`<p class="hint mb">لا عناوين محفوظة — أضف عنواناً واحداً على الأقل.</p>`}
<div class="acard" style="padding:13px;margin-top:10px">
<b style="font-size:12.5px">➕ عنوان جديد</b>
<div class="fgrid mt">
<div class="fld"><label>الاسم المختصر</label><input class="inp" id="na-t" placeholder="مثال: المنزل"></div>
<div class="fld"><label>المدينة</label><input class="inp" id="na-c" placeholder="الرياض"></div>
</div>
<div class="fld mt"><label>العنوان التفصيلي</label><input class="inp" id="na-a" placeholder="الحي، الشارع، رقم المبنى…"></div>
<button class="btn soft sm mt" onclick="ckSaveAddr()">حفظ العنوان</button>
</div>
<div class="spread mt">
<button class="btn gray sm" onclick="ckBack()">→ رجوع</button>
<button class="btn sm" onclick="ckNext()">متابعة للدفع ←</button>
</div>`;
}
if(CK.step===2){const c=cartCalc();const u=me();
return `
<b style="font-size:13.5px" class="fx">💳 طريقة الدفع</b>
<p class="hint mb">يُخصم المبلغ منك ويُحجز في خزنة ضمين المستقلة — لا يصل للتاجر مباشرة.</p>
<div class="pays">
${[['mada','💳','مدى'],['visa','🏦','بطاقة ائتمانية'],['apple','🍎','Apple Pay'],['bal','🌟','محفظة ضمين']].map(([k,i,n])=>`<button class="pay ${CK.pay===k?'on':''}" onclick="CK.pay='${k}';ckRefresh()"><i>${i}</i><b>${n}</b>${k==='bal'?`<span>رصيدك: ${ard(u.bal||0)} ر.س</span>`:''}</button>`).join('')}
</div>
${CK.pay==='bal'&&u.bal<c.total?`<p class="hint" style="color:var(--red);margin-top:8px">⚠️ رصيد محفظتك لا يكفي — اختر طريقة أخرى.</p>`:''}
${CK.pay==='visa'?`<div class="acard mt" style="padding:12px"><div class="fgrid"><div class="fld"><label>رقم البطاقة</label><input class="inp" placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢"></div><div class="fld"><label>تاريخ الانتهاء / CVC</label><input class="inp" placeholder="١٢/٢٨ · ١٢٣"></div></div></div>`:''}
<div class="hr"></div>
<div class="srow"><span>الإجمالي المحجوز</span><b>${money(c.total)}</b></div>
<div class="srow"><span>التسليم إلى</span><span style="font-size:11.5px">${esc(CK.addrTxt||addrTxt())}</span></div>
<div class="spread mt">
<button class="btn gray sm" onclick="ckBack()">→ رجوع</button>
<button class="btn amb" onclick="placeOrder()">🔒 ادفع واحجز في الخزنة</button>
</div>`;
}
return `<div style="text-align:center;padding:8px 4px">
<div class="bigok">✅</div>
<b class="fx" style="font-size:17px">تم حجز مبلغك في خزنة ضمين!</b>
<p class="hint mt" style="line-height:1.9">رقم طلبك <b style="color:var(--grn)">#${ar(CK.oid)}</b><br>أُرسلت طلباتك إلى ${ar(CK.gcount)} متجر — ستتابع كل شحنة على حدة.<br>💡 للعميل: يمكنك فتح نزاع خلال نافذة الحماية قبل التحرير التلقائي.</p>
<button class="btn wide mt" onclick="closeModal();go('orders')">📦 تتبع طلبي</button>
<button class="btn gray wide mt" onclick="closeModal();go('home')">مواصلة التسوق</button></div>`;
}
function ckRefresh(){const b=$('#ckbody');if(!b)return;const scroll=window.scrollY;b.innerHTML=`<div class="cksteps">${['الحساب','الموقع','الدفع'].map((s,i)=>`<div class="ckstep ${CK.step===i?'on':(CK.step>i||(i===0&&SES)?'done':'')}"><div class="b"></div>${s}</div>`).join('')}</div>`+ckBody()}
function ckLogin(){doLogin();if(SES&&SES.role==='customer'){CK.step=1;CK.addr=me().addrs&&me().addrs.length?0:-1;ckRefresh()}}
function ckQuick(r){quickLogin(r);if(SES&&SES.role==='customer'){CK.step=1;CK.addr=me().addrs&&me().addrs.length?0:-1;ckRefresh()}}
function ckNext(){if(CK.addr<0){toast('اختر عنواناً أو أضف عنواناً جديداً','err');return}CK.step=2;ckRefresh()}
function ckBack(){CK.step=Math.max(SES?1:0,CK.step-1);ckRefresh()}
function addrTxt(){const u=me();return u&&u.addrs&&u.addrs[CK.addr]?u.addrs[CK.addr].a:''}
function useGeo(){
if(!navigator.geolocation){toast('تحديد الموقع غير مدعوم — أضف العنوان يدوياً','amb');return}
toast('جارٍ تحديد موقعك…');
navigator.geolocation.getCurrentPosition(
p=>{CK.geo={lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)};toast('تم تحديد موقعك ✓','ok');ckRefresh()},
()=>toast('تعذر تحديد الموقع — أضف العنوان يدوياً','amb'),{timeout:8000});
}
function ckSaveAddr(){
const t=($('#na-t')||{value:''}).value.trim(),c=($('#na-c')||{value:''}).value.trim(),a=($('#na-a')||{value:''}).value.trim();
if(!t||!a){toast('اكتب الاسم المختصر والعنوان التفصيلي','err');return}
const u=me();u.addrs=u.addrs||[];u.addrs.push({t,a:(c?c+'، ':'')+a});
CK.addr=u.addrs.length-1;toast('حُفظ العنوان ✓','ok');ckRefresh();
}
function placeOrder(){
const u=me();const c=cartCalc();
if(CK.addr<0||!u.addrs[CK.addr]){toast('حدد عنوان التسليم أولاً','err');CK.step=1;ckRefresh();return}
if(CK.pay==='bal'&&u.bal<c.total){toast('رصيد المحفظة لا يكفي','err');return}
CK.addrTxt=u.addrs[CK.addr].a;
CK.step=3;CK.oid=OID;CK.gcount=Object.keys(c.groups).length;
const o={id:OID++,customer:SES.phone,at:Date.now(),pay:CK.pay,addr:CK.addrTxt,
coupon:{code:CPN,amt:c.cpn},ptsUsed:c.ptsUse,ptsAmt:c.ptsAmt,total:c.total,
groups:Object.entries(c.groups).map(([sid,its])=>({store:sid,
items:its.map(x=>({pid:x.pid,qty:x.qty,price:eff(x.p)})),
sub:r2(its.reduce((a,x)=>a+eff(x.p)*x.qty,0)),
dl:its.reduce((a,x)=>a+eff(x.p)*x.qty,0)>=200?0:12,status:'pending'}))};
if(CK.pay==='bal'){u.bal=r2((u.bal||0)-c.total);o.paidBy='محفظة ضمين'}
if(c.ptsUse){u.pts=(u.pts||0)-c.ptsUse;u.ptsLog.unshift({t:'استبدال نقاط في الطلب #'+(OID-1),v:-c.ptsUse,at:Date.now()})}
DB.orders.unshift(o);
Object.keys(c.groups).forEach(sid=>{const own=ST(sid).owner;
if(own&&USERS[own])pushNotif(own,'📦','طلب جديد بانتظار قبولك','عميل جديد أرسل طلباً بقيمة '+money(o.groups.find(g=>g.store===sid).sub),['m-orders'])});
pushNotif(SES.phone,'🔒','تم حجز مبلغ طلبك','مبلغ '+money(c.total)+' محجوز بأمان في خزنة ضمين',['orders']);
CART=[];CPN=null;PTS=0;
ckRefresh();
}
/* ================= الطلبات ================= */
const GLBL={pending:'بانتظار القبول',preparing:'قيد التحضير',shipped:'تم الشحن',received:'استُلم — قيد الفحص',released:'حُرر المبلغ',disputed:'قيد التحكيم',refunded:'استُرجع المبلغ'};
const GSTEPS=['القبول','التحضير','الشحن','الاستلام','التحرير'];
function gstep(g){return{pending:0,preparing:1,shipped:2,received:3,released:4}[g.status]}
function pgOrders(){
if(!SES)return `<div class="pghead"><h1>🧾 طلباتي</h1></div><div class="empty"><div class="em">🔐</div><b>سجّل دخولك لمتابعة طلباتك</b><span>ستجد هنا كل شحنة بحالتها وعدّاد الحماية</span><button class="btn mt" onclick="openAuth()">تسجيل الدخول</button></div>`;
const os=DB.orders.filter(o=>o.customer===SES.phone);
if(!os.length)return `<div class="pghead"><h1>🧾 طلباتي</h1></div><div class="empty"><div class="em">📦</div><b>لا طلبات بعد</b><span>أول طلب لك سيظهر هنا بحالاته المباشرة</span><button class="btn mt" onclick="go('home')">ابدأ التسوق</button></div>`;
return `<div class="pghead"><h1>🧾 طلباتي</h1><span class="tag grn">${ar(os.length)} طلبات</span></div>`+
os.map(o=>`<div class="ocard">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:14px">طلب #${ar(o.id)}</b><div class="hint">${dt(o.at)} · ${({mada:'مدى',visa:'بطاقة',apple:'Apple Pay',bal:'محفظة ضمين'}[o.pay])||'دفع إلكتروني'}${o.paidBy?' ('+o.paidBy+')':''}</div></div>
${o.coupon&&o.coupon.amt?`<span class="tag amb">كوبون −${money(o.coupon.amt)}</span>`:''}
${o.ptsUsed?`<span class="tag amb">نقاط −${money(o.ptsAmt)}</span>`:''}
</div>
<div class="hint">📍 ${esc(o.addr)}</div>
${o.groups.map((g,gi)=>ogroup(o,g,gi)).join('')}
</div>`).join('');
}
function ogroup(o,g,gi){
const s=ST(g.store),sec=SEC(s.sec);
const st=g.status;
const dis=DB.disputes.find(d=>d.order===o.id&&d.store===g.store);
return `<div class="ogroup">
<div class="spread" style="flex-wrap:wrap">
<div style="display:flex;align-items:center;gap:9px">
<div class="cghead" style="--c:${s.color};background:${s.color}14;border:0;padding:4px 12px 4px 9px;border-radius:11px"><div class="lg" style="width:24px;height:24px;font-size:11px">${s.name[0]}</div></div>
<div><b style="font-size:12.5px;color:${s.color}">${esc(s.name)}</b><div class="hint">شحنة مستقلة · حماية ${sec.win}</div></div>
</div>
${st==='disputed'?`<span class="tag red">⚖️ قيد التحكيم</span>`:st==='refunded'?`<span class="tag gry">💸 استُرجع المبلغ</span>`:`<span class="tag ${st==='released'?'grn':'amb'}">${GLBL[st]}</span>`}
</div>
<div class="oitems">${g.items.map(it=>{const p=P(it.pid);return `<span class="oitag" onclick="go('product','${it.pid}')">${p?imgTag(p.imgs[0],'',''):''} ${ar(it.qty)}× ${p?esc(p.name):'—'}</span>`}).join('')}</div>
${st!=='disputed'&&st!=='refunded'?`<div class="osteps">${GSTEPS.map((l,i)=>`<div class="st ${i<gstep(g)?'on':i===gstep(g)?(st==='received'?'cur on':'on'):''}"><i></i>${l}</div>`).join('')}</div>`:''}
${st==='received'?`<div class="spread mt" style="flex-wrap:wrap">
<span class="cd" data-cd="${g.complaintUntil}"><b>⏳ ${clock(g.complaintUntil-Date.now())}</b> متبقٍ من نافذة الحماية — بعدها يُحرر المبلغ تلقائياً</span></div>
<div class="spread mt" style="gap:8px;flex-wrap:wrap">
<button class="btn sm" onclick="openRate(${o.id},${gi})">⭐ قيّم وحرر فوراً</button>
<button class="btn red sm" onclick="openComplaint(${o.id},${gi})">⚠️ فتح نزاع</button>
</div>`:''}
${st==='shipped'?`<button class="btn sm mt" onclick="confirmReceive(${o.id},${gi})">📦 استلمت الشحنة — ابدأ الفحص</button>`:''}
${st==='pending'?`<div class="hint mt">بانتظار قبول المتجر للطلب…</div>`:''}
${st==='preparing'?`<div class="hint mt">🧵 المتجر يحضّر طلبك الآن</div>`:''}
${st==='disputed'&&dis?`<button class="btn red sm mt" onclick="openDispute('${dis.id}')">💬 متابعة النزاع والدردشة</button>`:''}
${st==='refunded'?`<div class="hint mt">💸 استُرجع كامل مبلغ الشحنة (${money(g.sub)}) إلى محفظة ضمين — استخدمه في طلبك القادم.</div>`:''}
${st==='released'&&g.payout?`<div class="mt" style="background:#1D443208;border:1px dashed #1D443233;border-radius:12px;padding:9px 13px;font-size:11.5px">
<b style="color:var(--grn)">🔓 تفصيل التحرير</b> — إجمالي الشحنة ${money(g.payout.sub)} · عمولة ضمين ٢٫٥٪: ${money(g.payout.comm)} · صافي التاجر: ${money(g.payout.net)}${g.rated?` · تقييمك: ${STARS(g.rated.stars)}`:''}</div>`:''}
<div class="hint" style="margin-top:7px">إجمالي الشحنة: <b>${money(r2(g.sub+g.dl))}</b>${g.dl?` (شحن ${money(g.dl)})`:''}</div>
</div>`;
}
function confirmReceive(oid,gi){
const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='received';g.complaintUntil=Date.now()+secOf(g.store).winMin*60e3;
pushNotif(o.customer,'🛡️','بدأت نافذة الحماية','افحص طلبك #'+ar(oid)+' — لديك '+secOf(g.store).win,['orders']);
const own=ST(g.store).owner;if(own)pushNotif(own,'📦','أكّد العميل الاستلام','بدأت نافذة حماية طلب #'+ar(oid)+' — يُحرر المبلغ تلقائياً بانتهائها',['m-orders']);
toast('بدأت نافذة الفحص — '+secOf(g.store).win+' 🛡️','ok');render();
}
/* تقييم + تحرير فوري */
let ORATE={stars:0,gi:0,oid:0};
function openRate(oid,gi){ORATE={stars:0,oid,gi};
openModal(`<div class="mhead"><b>⭐ التقييم والتحرير الفوري</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<p class="hint mb">تقييمك يحرر المبلغ للتاجر فوراً ويمنحك <b>+١٠ نقاط</b> إضافية — يمكنك أيضاً الانتظار حتى تنتهي نافذة الحماية تلقائياً.</p>
<div class="starin" id="ostars">${[1,2,3,4,5].map(i=>`<span onclick="oStarPick(${i})">★</span>`).join('')}</div>
<textarea class="inp" id="ortxt" placeholder="كيف كانت تجربتك مع المنتج والتغليف والسرعة؟" style="min-height:74px;margin:10px 0"></textarea>
<button class="btn amb wide" onclick="submitOrderRate()">🚀 أرسل التقييم وحرر المبلغ</button>
</div>`);}
function oStarPick(n){ORATE.stars=n;document.querySelectorAll('#ostars span').forEach((s,i)=>s.classList.toggle('on',i<n))}
function submitOrderRate(){
if(!ORATE.stars){toast('اختر النجوم أولاً','err');return}
const o=DB.orders.find(x=>x.id===ORATE.oid);const g=o.groups[ORATE.gi];
g.rated={stars:ORATE.stars,txt:($('#ortxt').value||'').trim()};
doRelease(o,g,'تقييم العميل',true);
closeModal();toast('شكراً! حُرر المبلغ للتاجر وكسبت نقاطك ⭐','ok');render();
}
/* ================= محرك ضمين ================= */
function doRelease(o,g,by,bonus){
if(g.status!=='received')return;
g.status='released';g.releasedAt=Date.now();g.releasedBy=by;
const comm=r2(g.sub*0.025),net=r2(g.sub-comm);
DB.aRevenue=r2(DB.aRevenue+comm);
const rm=DB.revMonths[DB.revMonths.length-1];rm.v=r2(rm.v+comm);
DB.storeWallets[g.store]=r2((DB.storeWallets[g.store]||0)+net);
g.payout={sub:g.sub,comm,net};
const u=USERS[o.customer];const pts=Math.floor(net/10)+(bonus?10:0);
if(u){u.pts=(u.pts||0)+pts;u.ptsLog.unshift({t:'تحرير طلب #'+o.id+(bonus?' + مكافأة تقييم':''),v:pts,at:Date.now()})}
pushNotif(o.customer,'🔓','تم تحرير مبلغ طلبك','صافي '+money(net)+' حُوِّل إلى '+ST(g.store).name+' — كسبت '+ar(pts)+' نقطة ولاء',['orders']);
const own=ST(g.store).owner;if(own)pushNotif(own,'💰','تحرير دفعة جديدة','استلمت '+money(net)+' صافي الطلب #'+ar(o.id)+' (عمولة ضمين '+money(comm)+')',['m-wallet']);
}
function doRefund(o,g,by){
g.status='refunded';g.refundedAt=Date.now();g.refundedBy=by;
const u=USERS[o.customer];if(u){u.bal=r2((u.bal||0)+g.sub)}
pushNotif(o.customer,'💸','استُرجع مبلغ طلبك','أُعيد '+money(g.sub)+' إلى محفظة ضمين الخاصة بك',['account']);
const own=ST(g.store).owner;if(own)pushNotif(own,'↩️','استرجاع مبلغ شحنة','حكم التحكيم لطلب #'+ar(o.id)+': استرجاع كامل المبلغ للعميل',['m-disputes']);
}
setInterval(()=>{
let changed=false;
DB.orders.forEach(o=>o.groups.forEach(g=>{
if(g.status==='received'&&g.complaintUntil&&Date.now()>=g.complaintUntil){doRelease(o,g,'انتهاء نافذة الحماية');changed=true}}));
document.querySelectorAll('[data-cd]').forEach(el=>{
const t=+el.dataset.cd-Date.now();const b=el.querySelector('b');
if(b)b.textContent='⏳ '+clock(t)+' ';else el.textContent='⏳ '+clock(t);
if(t<=0)changed=true});
if(changed)render();
},1000);
/* ================= نافذة الشكوى المتغيّرة ================= */
const COMPS={damaged:'المنتج وصل تالفاً',notmatch:'لا يطابق الوصف',missing:'عناصر ناقصة',late:'تأخر شديد في الوصول',other:'سبب آخر'};
function openComplaint(oid,gi){
COMP={sub:'damaged',img:null};COMP.oid=oid;COMP.gi=gi;
openModal(`<div class="mhead"><b>⚠️ فتح نزاع على الشحنة</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody" id="compbody">${compBody()}</div>`);}
function compBody(){
return `<div class="demo mb"><b style="font-size:12.5px">🛡️ لا تقلق — مبلغك ما زال محجوزاً</b>
<p class="hint" style="margin-top:2px">افتح النزاع خلال نافذة الحماية وسيبقى المبلغ معلقاً حتى تصدر الإدارة حكمها بدردشة ثلاثية الأطراف.</p></div>
<div class="fld"><label>سبب النزاع</label>
<select class="inp" onchange="COMP.sub=this.value;COMP.img=null;compRefresh()">
${Object.entries(COMPS).map(([k,v])=>`<option value="${k}" ${COMP.sub===k?'selected':''}>${v}</option>`).join('')}</select></div>
<div class="mt" id="compx">${compExtra()}</div>
<div class="spread mt">
<button class="btn gray sm" onclick="closeModal()">إلغاء</button>
<button class="btn red" onclick="submitComplaint()">⚖️ افتح النزاع</button>
</div>`;
}
function compExtra(){
if(COMP.sub==='damaged')return `
<div class="fld"><label>صف الضرر بدقة</label><textarea class="inp" id="cp-txt" style="min-height:64px" placeholder="مثال: شد واضح عند الطرف الأيسر مع خيط مقطوع…"></textarea></div>
<div class="mt"><button class="btn soft sm" onclick="pickCompImg()">📎 إرفاق صورة الضرر (مطلوبة)</button>
${COMP.img?`<span class="tag red" style="margin-inline-start:6px">✓ مرفقة</span>`:'<span class="hint"> — ستظهر كدليل في الدردشة</span>'}</div>`;
if(COMP.sub==='notmatch')return `
<div class="fgrid">
<div class="fld"><label>ماذا طلبت؟</label><input class="inp" id="cp-want" placeholder="مثال: بوكس أخضر زيتي"></div>
<div class="fld"><label>ماذا وصلك؟</label><input class="inp" id="cp-got" placeholder="مثال: كحلي غامق"></div>
</div>
<div class="fld mt"><label>تفاصيل إضافية</label><textarea class="inp" id="cp-txt" style="min-height:54px"></textarea></div>
<div class="mt"><button class="btn soft sm" onclick="pickCompImg()">📎 إرفاق صورة للمقارنة (اختياري)</button>
${COMP.img?`<span class="tag red" style="margin-inline-start:6px">✓ مرفقة</span>`:''}</div>`;
return `
<div class="fld"><label>اشرح ما حدث بدقة</label><textarea class="inp" id="cp-txt" style="min-height:74px" placeholder="كل التفاصيل تساعد الإدارة على الحكم العادل…"></textarea></div>
<div class="mt"><button class="btn soft sm" onclick="pickCompImg()">📎 إرفاق صورة (اختياري)</button>
${COMP.img?`<span class="tag red" style="margin-inline-start:6px">✓ مرفقة</span>`:''}</div>`;
}
function compRefresh(){const b=$('#compbody');if(b)b.innerHTML=compBody()}
function pickCompImg(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{COMP.img=rd.result;$('#fup').value='';compRefresh();toast('أُرفقت الصورة ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click();
}
function submitComplaint(){
const o=DB.orders.find(x=>x.id===COMP.oid);const g=o.groups[COMP.gi];
let txt='';
if(COMP.sub==='notmatch'){
const w=($('#cp-want')||{value:''}).value.trim(),gt=($('#cp-got')||{value:''}).value.trim();
if(!w||!gt){toast('أكمل حقلَي «ماذا طلبت / ماذا وصلك»','err');return}
txt='طلبت: '+w+' — لكن وصلني: '+gt+'. '+(($('#cp-txt')||{value:''}).value.trim());
}else{
txt=($('#cp-txt')||{value:''}).value.trim();
if(!txt){toast('اكتب شرحاً للسبب أولاً','err');return}
}
if(COMP.sub==='damaged'&&!COMP.img){toast('إرفاق صورة الضرر إلزامي لهذا السبب','err');return}
const d={id:'d'+(DB.disputes.length+10),order:o.id,store:g.store,customer:SES.phone,subject:COMPS[COMP.sub],openedAt:Date.now(),status:'open',ruling:null,
messages:[{r:'sys',t:'فتح العميل نزاعاً على الطلب #'+ar(o.id)+' ('+ST(g.store).name+') بسبب: '+COMPS[COMP.sub],at:Date.now()},
{r:'customer',t:txt,at:Date.now()+1000,img:COMP.img||undefined}]};
DB.disputes.unshift(d);
g.status='disputed';
const own=ST(g.store).owner;
if(own)pushNotif(own,'⚖️','نزاع جديد على طلبك','فتح العميل نزاعاً بسبب: '+COMPS[COMP.sub],['m-disputes']);
pushNotif('0500000003','⚖️','نزاع جديد بانتظار التحكيم',ST(g.store).name+' · '+COMPS[COMP.sub],['a-disputes']);
toast('فُتح النزاع — المبلغ معلق حتى الحكم ⚖️','ok');
closeModal();render();openDispute(d.id);
}
/* ================= النزاعات ================= */
function pgDisputes(){
if(!SES)return `<div class="pghead"><h1>⚖️ نزاعاتي</h1></div><div class="empty"><div class="em">⚖️</div><b>سجّل دخولك لمتابعة نزاعاتك</b><span>دردشة ثلاثية الأطراف مع المتجر والإدارة حتى يصدر الحكم</span><button class="btn mt" onclick="openAuth()">تسجيل الدخول</button></div>`;
const mine=DB.disputes.filter(d=>d.customer===SES.phone);
if(!mine.length)return `<div class="pghead"><h1>⚖️ نزاعاتي</h1></div><div class="empty"><div class="em">🕊️</div><b>لا نزاعات — وهذا ممتاز</b><span>عند وجود أي مشكلة مع شحنة، افتح النزاع من صفحة طلباتك خلال نافذة الحماية</span><button class="btn mt" onclick="go('orders')">ذهاب إلى طلباتي</button></div>`;
const open=mine.filter(d=>d.status==='open'),done=mine.filter(d=>d.status==='resolved');
const tab=VIEW.dtab||'open';
return `<div class="pghead"><h1>⚖️ نزاعاتي</h1>
<span class="tag ${open.length?'red':'grn'}">${ar(open.length)} جارٍ · ${ar(done.length)} منتهٍ</span></div>
<div class="chiprow"><button class="chip ${tab==='open'?'on':''}" onclick="VIEW.dtab='open';render()">⏳ النزاعات الجارية (${ar(open.length)})</button>
<button class="chip ${tab==='done'?'on':''}" style="--acc:var(--grn)" onclick="VIEW.dtab='done';render()">📁 النزاعات السابقة (${ar(done.length)})</button></div>
${ (tab==='open'?open:done).map(dispCard).join('') || `<div class="empty" style="padding:30px"><div class="em">${tab==='open'?'⏳':'📁'}</div><b>${tab==='open'?'لا نزاعات جارية':'لا نزاعات سابقة'}</b></div>` }`;
}
function dispCard(d){
const s=ST(d.store),o=DB.orders.find(x=>x.id===d.order);
const last=[...d.messages].reverse().find(m=>m.r!=='sys');
return `<div class="ocard" style="border-inline-start:4px solid ${d.status==='open'?'var(--red)':'var(--grn)'}">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:13.5px">⚖️ ${esc(d.subject)}</b>
<div class="hint">طلب #${ar(d.order)} · ${esc(s.name)} · فُتح ${ago(d.openedAt)}</div></div>
${d.status==='open'?`<span class="tag red">قيد التحكيم — المبلغ معلق</span>`:`<span class="tag grn">أُصدر الحكم</span>`}
</div>
${d.status==='resolved'&&d.ruling?`<div class="verd ${d.ruling.act==='release'?'rel':'ref'}" style="margin:10px 0 4px">
<h4>${d.ruling.act==='release'?'🔓 نتيجة النزاع: إفراج المبلغ للتاجر':'💸 نتيجة النزاع: استرجاع المبلغ لك'}</h4>
<div class="why">${esc(d.ruling.text)}</div>
<div class="hint" style="margin-top:5px">${esc(d.ruling.by)} · ${dt(d.ruling.at)}</div></div>`:''}
${last?`<div class="hint" style="margin-top:8px;background:var(--card2);border-radius:11px;padding:8px 12px">💬 آخر رسالة (${last.r==='customer'?'أنت':last.r==='merchant'?'المتجر':'الإدارة'}): ${esc(last.t.slice(0,90))}${last.t.length>90?'…':''}</div>`:''}
<div class="spread mt" style="gap:8px">
<button class="btn sm ${d.status==='open'?'red':''}" onclick="openDispute('${d.id}')">💬 ${d.status==='open'?'متابعة الدردشة وإضافة أدلة':'عرض المحادثة والحكم'}</button>
<span class="hint">${ar(d.messages.length)} رسالة</span>
</div></div>`;
}
let OPEN_DID=null;
function openDispute(id){
const d=DB.disputes.find(x=>x.id===id);if(!d)return;
OPEN_DID=id;EVP=[];
openModal(dispModalHTML(d),'lg');
setTimeout(()=>{const l=$('#chatlog');if(l)l.scrollTop=l.scrollHeight},50);
}
function dispModalHTML(d){
const s=ST(d.store),cust=USERS[d.customer],o=DB.orders.find(x=>x.id===d.order);
const g=o.groups.find(x=>x.store===d.store);
const canChat=SES&&((d.customer===SES.phone&&SES.role==='customer')||(d.store===SES.store&&SES.role==='merchant')||(SES.role==='admin'));
const isAdmin=SES&&SES.role==='admin'&&d.status==='open';
return `<div class="mhead"><b>⚖️ ${esc(d.subject)} — طلب #${ar(d.order)}</b>
${d.status==='open'?'<span class="tag red">قيد التحكيم</span>':'<span class="tag grn">منتهٍ</span>'}
<button class="x" onclick="OPEN_DID=null;closeModal()">✕</button></div>
<div class="parties">
<span class="party" style="--pc:var(--grn)"><i></i> 👩 ${esc(cust?cust.name:'العميل')}</span>
<span class="party" style="--pc:${s.color}"><i></i> 🏪 ${esc(s.name)}</span>
<span class="party" style="--pc:var(--navy)"><i></i> 🛡️ الإدارة (محكّم)</span>
<span class="party" style="--pc:var(--amb)"><i></i> 💰 معلق: ${money(g.sub)}</span>
</div>
<div class="cwrap" id="dispwrap">
<div class="chatlog" id="chatlog">
${d.ruling?verdCard(d):''}
${d.messages.map(m=>msgHTML(m,d)).join('')}
</div>
${EVP.length?`<div class="evpill">📎 ${EVP.map((e,i)=>`<img src="${e}" onclick="zoomImg('${e}')"><button class="btn gray xs" onclick="EVP.splice(${i},1);dispSelfRefresh()">✕</button>`).join('')}<span>صورة جاهزة للإرسال كدليل</span></div>`:''}
${d.status==='resolved'?'':canChat?`<div class="composer">
<textarea id="msgtxt" placeholder="اكتب حجتك أو ردك هنا… سيظهر للأطراف الثلاثة"></textarea>
<button class="iconbtn" onclick="attachEv()" title="إرفاق صورة دليل">📎</button>
<button class="btn" onclick="sendMsg('${d.id}')">إرسال ➤</button>
</div>`:`<div class="composer"><div class="hint" style="padding:8px">🔒 سجّل دخولك بحساب أحد الأطراف للمشاركة في الدردشة</div></div>`}
${isAdmin?`<div class="rulebar">
<b style="font-size:12px" class="fx">🛡️ إصدار الحكم — اقرأ الحجج ثم اكتب تسبيبك (يظهر للطرفين)</b>
<textarea id="ruletxt" placeholder="مثال: بعد الاطلاع على الصور وتقرير التغليف، تبيّن أن الضرر وقع أثناء الشحن…"></textarea>
<div class="spread" style="gap:8px">
<button class="btn sm" onclick="ruleAct('${d.id}','release')">🔓 حكم: إفراج للتاجر</button>
<button class="btn red sm" onclick="ruleAct('${d.id}','refund')">💸 حكم: استرجاع للعميل</button>
</div></div>`:''}
</div>`;
}
function msgHTML(m,d){
const cust=USERS[d.customer];
if(m.r==='sys')return `<div class="msg r-s">⚖️ ${esc(m.t)}<div style="font-size:9px;margin-top:2px">${ago(m.at)}</div></div>`;
const who={customer:cust?'👩 '+cust.name.split(' ')[0]:'العميل',merchant:'🏪 '+ST(d.store).name,admin:'🛡️ الإدارة'}[m.r];
const mine=SES&&((m.r==='customer'&&d.customer===SES.phone&&SES.role==='customer')||(m.r==='merchant'&&d.store===SES.store&&SES.role==='merchant')||(m.r==='admin'&&SES.role==='admin'));
const rcls=m.r==='customer'?'r-c':m.r==='merchant'?'r-m':'r-a';
const mst=m.r==='merchant'?`style="--mc:${ST(d.store).color}"`:'';
return `<div class="msg ${mine?'me':'them'} ${rcls}" ${mst}>
<span class="who">${who}</span>${esc(m.t)}
${m.img?`<img class="ev" src="${m.img}" onclick="zoomImg('${m.img}')">`:''}
<div style="font-size:9px;margin-top:3px;opacity:.7">${ago(m.at)}</div></div>`;
}
function verdCard(d){
const r=d.ruling,rel=r.act==='release';
return `<div class="verd ${rel?'rel':'ref'}">
<h4>${rel?'🔓 الحكم النهائي: إفراج المبلغ للتاجر':'💸 الحكم النهائي: استرجاع المبلغ للعميل'}</h4>
<div class="why">${esc(r.text)}</div>
<div class="hint" style="margin-top:5px">أصدره ${esc(r.by)} · ${dt(r.at)} — نُفذ تلقائياً على الشحنة</div></div>`;
}
function myRoleIn(d){
if(!SES)return null;
if(SES.role==='customer'&&d.customer===SES.phone)return 'customer';
if(SES.role==='merchant'&&d.store===SES.store)return 'merchant';
if(SES.role==='admin')return 'admin';
return null;
}
function sendMsg(id){
const d=DB.disputes.find(x=>x.id===id);
const r=myRoleIn(d);
if(!r){toast('سجّل دخولك كأحد الأطراف أولاً','amb');openAuth();return}
const txt=($('#msgtxt')||{value:''}).value.trim();
const img=EVP[0];
if(!txt&&!img){toast('اكتب رسالة أو أرفق صورة','err');return}
d.messages.push({r,t:txt||'(صورة دليل)',at:Date.now(),img});
if(r==='customer'){const own=ST(d.store).owner;if(own)pushNotif(own,'💬','رسالة جديدة في النزاع',custName(d)+' أضاف رداً/دلياً جديداً',['m-disputes']);pushNotif('0500000003','💬','رسالة جديدة في النزاع','نزاع طلب #'+ar(d.order)+' — '+custName(d),['a-disputes'])}
else if(r==='merchant'){pushNotif(d.customer,'💬','رد من المتجر على نزاعك',ST(d.store).name+' رد على نزاع طلب #'+ar(d.order),['disputes']);pushNotif('0500000003','💬','رسالة من التاجر في النزاع','نزاع طلب #'+ar(d.order)+' — '+ST(d.store).name,['a-disputes'])}
else{pushNotif(d.customer,'💬','مداخلة من الإدارة','الإدارة علّقت على نزاع طلب #'+ar(d.order),['disputes']);const own=ST(d.store).owner;if(own)pushNotif(own,'💬','مداخلة من الإدارة','الإدارة علّقت على نزاع طلب #'+ar(d.order),['m-disputes'])}
EVP=[];
dispSelfRefresh();render();
}
const custName=d=>{const u=USERS[d.customer];return u?u.name.split(' ')[0]:'العميل'};
function dispSelfRefresh(){
if(!OPEN_DID)return;
const d=DB.disputes.find(x=>x.id===OPEN_DID);if(!d)return;
$('.mcard').innerHTML=dispModalHTML(d);
const l=$('#chatlog');if(l)l.scrollTop=l.scrollHeight;
}
function attachEv(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{EVP.push(rd.result);$('#fup').value='';dispSelfRefresh();toast('أُرفقت الصورة — اضغط إرسال لتظهر كدليل','ok')};rd.readAsDataURL(f)};
$('#fup').click();
}
function ruleAct(id,act){
const d=DB.disputes.find(x=>x.id===id);
const txt=($('#ruletxt')||{value:''}).value.trim();
if(!txt){toast('اكتب تسبيب الحكم — يظهر للطرفين','err');return}
d.ruling={act,by:'الإدارة',text:txt,at:Date.now()};d.status='resolved';
d.messages.push({r:'sys',t:'أصدرت الإدارة حكمها: '+(act==='release'?'إفراج المبلغ للتاجر — التسبيب: ':'استرجاع المبلغ للعميلة — التسبيب: ')+txt,at:Date.now()});
const o=DB.orders.find(x=>x.id===d.order);const g=o.groups.find(x=>x.store===d.store);
if(act==='release')doRelease(o,g,'حكم التحكيم');else doRefund(o,g,'حكم التحكيم');
toast('أُصدر الحكم ونُفذ على الشحنة ⚖️','ok');
OPEN_DID=null;closeModal();render();
}
/* ================= حسابي + الإعدادات ================= */
function pgAccount(){
if(!SES)return `<div class="pghead"><h1>👤 حسابي</h1></div><div class="empty"><div class="em">👤</div><b>سجّل دخولك للوصول لحسابك</b><span>النقاط، العناوين، الإشعارات والإعدادات كلها هنا</span><button class="btn mt" onclick="openAuth()">تسجيل الدخول</button></div>`;
if(SES.role!=='customer')return `<div class="pghead"><h1>👤 حسابي</h1></div><div class="empty"><div class="em">🛍️</div><b>صفحة الحساب لعملاء ضمين</b><span>أنت الآن بدور ${SES.role==='merchant'?'التاجر':'الإدارة'}</span><button class="btn mt" onclick="switchRole('customer')">العودة للتسوق كعميل</button></div>`;
const u=me();
const ordersN=DB.orders.filter(o=>o.customer===SES.phone).length;
const disOpen=DB.disputes.filter(d=>d.customer===SES.phone&&d.status==='open').length;
const favN=(u.favs||[]).length;
const nextHund=(100-(u.pts%100))%100;
return `<div class="pghead"><h1>👤 حسابي وإعداداتي</h1></div>
<div class="accgrid">
<div>
<div class="acard" style="display:flex;gap:13px;align-items:center">
<div class="avat" style="width:54px;height:54px;border-radius:17px;font-size:21px">${u.name[0]}</div>
<div style="flex:1"><b class="fx" style="font-size:15px">${esc(u.name)}</b>
<div class="hint">${ar(SES.phone)}${u.email?' · '+esc(u.email):''}</div>
<div class="hint">عضو منذ ${MONTHS[new Date(u.since).getMonth()]} ${ar(new Date(u.since).getFullYear())}</div></div>
<button class="btn soft sm" onclick="profileForm()">تعديل</button>
</div>
<div class="ptshero">
<div class="spread"><b class="fx" style="font-size:14px">🌟 نقاط الولاء</b><span class="tag wht">كل ١٠٠ نقطة = ١٠ ر.س</span></div>
<div style="display:flex;align-items:baseline;gap:9px;margin-top:6px">
<span class="fx" style="font-size:34px;font-weight:800">${ar(u.pts||0)}</span><span style="font-size:12px;opacity:.9">نقطة</span></div>
<div class="pbar"><i style="width:${(u.pts%100)||100}%"></i></div>
<div style="font-size:10.5px;opacity:.92">${nextHund?`تبقّى ${ar(nextHund)} نقطة لخصم ١٠ ريال القادم`:'أنت عند حد خصم جاهز — استخدمه في السلة! 🎉'}</div>
<div class="hr" style="background:#ffffff30"></div>
<div style="font-size:10.5px;opacity:.95;line-height:1.9">✦ نقطة عن كل ١٠ ريال عند تحرير أي شحنة<br>✦ +١٠ نقاط مكافأة عند تقييمك للطلب<br>✦ استبدلها من ملخص السلة قبل الدفع</div>
${(u.ptsLog&&u.ptsLog.length)?`<div class="hr" style="background:#ffffff30"></div><b style="font-size:11px">سجل النقاط</b>
${u.ptsLog.slice(0,4).map(l=>`<div class="spread" style="font-size:10.5px;padding:2.5px 0"><span style="opacity:.92">${esc(l.t)}</span><b>${l.v>0?'+':''}${ar(l.v)}</b></div>`).join('')}`:''}
</div>
<div class="qtiles">
<div class="qtile" onclick="go('orders')"><i>🧾</i><b>طلباتي</b><span>${ar(ordersN)} طلبات</span></div>
<div class="qtile" onclick="go('disputes')"><i>⚖️</i><b>نزاعاتي</b><span>${ar(disOpen)} جارٍ</span></div>
<div class="qtile" onclick="go('favs')"><i>❤️</i><b>مفضلتي</b><span>${ar(favN)} منتج</span></div>
<div class="qtile" onclick="walletInfo()"><i>🌟</i><b>محفظة ضمين</b><span>${money(u.bal||0)}</span></div>
</div>
</div>
<div>
<div class="acard"><h3>👤 الملف الشخصي</h3>
<div class="setrow"><div class="ic">🏷️</div><div class="tx"><b>الاسم</b><span>${esc(u.name)}</span></div><button class="btn soft xs" onclick="profileForm()">تعديل</button></div>
<div class="setrow"><div class="ic">📱</div><div class="tx"><b>رقم الجوال (معرّف حسابك)</b><span>${ar(SES.phone)}</span></div><span class="tag grn">موثّق</span></div>
<div class="setrow"><div class="ic">✉️</div><div class="tx"><b>البريد الإلكتروني</b><span>${u.email?esc(u.email):'غير مضاف'}</span></div><button class="btn soft xs" onclick="emailForm()">${u.email?'تعديل':'إضافة'}</button></div>
</div>
<div class="acard"><h3>🔐 كلمة المرور والأمان</h3>
<div class="setrow"><div class="ic">🔑</div><div class="tx"><b>كلمة المرور</b><span>آخر تحديث غير محدد — ننصح بالتغيير الدوري</span></div><button class="btn soft xs" onclick="passForm()">تغيير</button></div>
<div class="setrow"><div class="ic">💻</div><div class="tx"><b>تسجيل الخروج من كل الأجهزة</b><span>إنهاء جميع الجلسات النشطة باستثناء الحالية</span></div><button class="btn soft xs" onclick="logoutAll()">تنفيذ</button></div>
</div>
<div class="acard"><h3>📍 عناويني المحفوظة</h3>
${(u.addrs||[]).map((a,i)=>`<div class="setrow"><div class="ic">🏠</div><div class="tx"><b>${esc(a.t)} ${a.def?'<span class="tag grn" style="font-size:9px">افتراضي</span>':''}</b><span>${esc(a.a)}</span></div>
<div style="display:flex;gap:5px">${a.def?'':`<button class="btn soft xs" onclick="setDefAddr(${i})">افتراضي</button>`}<button class="btn gray xs" onclick="delAddr(${i})">حذف</button></div></div>`).join('')}
<div class="setrow"><div class="ic">➕</div><div class="tx"><b>إضافة عنوان جديد</b><span>مع إمكانية تحديد موقعك تلقائياً</span></div><button class="btn soft xs" onclick="addrForm()">إضافة</button></div>
</div>
<div class="acard"><h3>🔔 الإشعارات</h3>
${[['ord','تحديثات الطلبات','قبول، شحن، استلام وتحرير المبلغ'],['off','العروض والخصومات','عروض الأقسام والكوبونات الجديدة'],['dis','النزاعات','ردود المتجر ومداخلات الإدارة'],['rev','التقييمات','تذكير بتقييم طلباتك المستلمة']].map(([k,t,s])=>`
<div class="setrow"><div class="ic">🔔</div><div class="tx"><b>${t}</b><span>${s}</span></div>
<button class="sw ${u.notif&&u.notif[k]?'on':''}" onclick="notifTog('${k}')"></button></div>`).join('')}
</div>
<div class="acard"><h3>🛡️ الخصوصية</h3>
<div class="setrow"><div class="ic">🙈</div><div class="tx"><b>إخفاء رقم جوالي عن التجار</b><span>يظهر للتاجر كـ«عميل ضمين موثّق» فقط</span></div>
<button class="sw ${u.hidePhone?'on':''}" onclick="privacyTog()"></button></div>
<div class="setrow"><div class="ic">📜</div><div class="tx"><b>شفافية استخدام البيانات</b><span>لا نشارك بياناتك مع طرف ثالث — تُستخدم للطلبات والنزاعات فقط</span></div><span class="tag grn">مفعّل دائماً</span></div>
</div>
<div class="acard"><h3>💬 الدعم والمساعدة</h3>
<div class="setrow"><div class="ic">🎧</div><div class="tx"><b>تواصل معنا</b><span>فريق ضمين يجيب خلال ساعات العمل</span></div><button class="btn soft xs" onclick="supportOpen()">مراسلة</button></div>
<div class="setrow"><div class="ic">❓</div><div class="tx"><b>الأسئلة الشائعة</b><span>كيف يعمل الحجز والتحرير والتحكيم؟</span></div><button class="btn soft xs" onclick="faqOpen()">عرض</button></div>
</div>
<div class="acard" style="border-color:#A63A2E44"><h3 style="color:var(--red)">⏻ منطقة الخروج</h3>
<div class="setrow"><div class="ic" style="background:#A63A2E10">🚪</div><div class="tx"><b>تسجيل الخروج</b><span>تبقى سلتك ومفضلتك محفوظة لجولتك القادمة</span></div><button class="btn red xs" onclick="logout()">خروج</button></div>
</div>
</div></div>`;
}
function notifTog(k){const u=me();u.notif=u.notif||{};u.notif[k]=!u.notif[k];toast(u.notif[k]?'✓ فُعّل الإشعار':'أُوقف الإشعار');render()}
function privacyTog(){const u=me();u.hidePhone=!u.hidePhone;toast(u.hidePhone?'رقمك مخفي عن التجار الآن ✓':'أُلغي إخفاء الرقم');render()}
function setDefAddr(i){const u=me();u.addrs.forEach((a,j)=>a.def=j===i);toast('صار «'+u.addrs[i].t+'» العنوان الافتراضي ✓','ok');render()}
function delAddr(i){const u=me();const t=u.addrs[i].t;u.addrs.splice(i,1);toast('حُذف عنوان «'+t+'»');render()}
function logoutAll(){toast('تم إنهاء الجلسات من كل الأجهزة ✓','ok')}
function walletInfo(){toast('رصيد محفظة ضمين: '+money(me().bal||0)+' — يُستخدم تلقائياً كوسيلة دفع','amb')}
function profileForm(){const u=me();
openModal(`<div class="mhead"><b>تعديل الملف الشخصي</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<div class="fld"><label>الاسم الكامل</label><input class="inp" id="pf-nm" value="${esc(u.name)}"></div>
<button class="btn wide mt" onclick="saveProfile()">حفظ التغييرات</button></div>`)}
function saveProfile(){const nm=($('#pf-nm').value||'').trim();
if(nm.length<3){toast('اكتب اسماً صحيحاً','err');return}
me().name=nm;closeModal();toast('حُفظ اسمك ✓','ok');render()}
function emailForm(){const u=me();
openModal(`<div class="mhead"><b>البريد الإلكتروني</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<div class="fld"><label>البريد (لإشعارات الفواتير والعروض)</label><input class="inp" id="pf-em" value="${esc(u.email||'')}" placeholder="name@mail.com"></div>
<button class="btn wide mt" onclick="saveEmail()">حفظ</button></div>`)}
function saveEmail(){const em=($('#pf-em').value||'').trim();
if(em&&!em.includes('@')){toast('صيغة بريد غير صحيحة','err');return}
me().email=em;closeModal();toast('حُفظ البريد ✓','ok');render()}
function passForm(){
openModal(`<div class="mhead"><b>🔑 تغيير كلمة المرور</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<div class="fld"><label>كلمة المرور الحالية</label><input class="inp" type="password" id="pw-o"></div>
<div class="fgrid mt">
<div class="fld"><label>الجديدة</label><input class="inp" type="password" id="pw-n"></div>
<div class="fld"><label>تأكيد الجديدة</label><input class="inp" type="password" id="pw-c"></div>
</div>
<button class="btn wide mt" onclick="savePass()">تحديث كلمة المرور</button></div>`)}
function savePass(){const u=me();
const o=$('#pw-o').value,n=$('#pw-n').value,c=$('#pw-c').value;
if(o!==u.pass){toast('كلمة المرور الحالية غير صحيحة','err');return}
if(n.length<4){toast('الجديدة ٤ محارف فأكثر','err');return}
if(n!==c){toast('التأكيد لاطابق الجديدة','err');return}
u.pass=n;closeModal();toast('حُدثت كلمة المرور ✓','ok')}
function addrForm(){
openModal(`<div class="mhead"><b>📍 عنوان جديد</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<button class="btn soft wide mb" onclick="useGeo()">🛰️ تحديد موقعي تلقائياً</button>
<div class="fgrid">
<div class="fld"><label>الاسم المختصر</label><input class="inp" id="ad-t" placeholder="المنزل / العمل / الاستراحة"></div>
<div class="fld"><label>المدينة</label><input class="inp" id="ad-c" placeholder="الرياض"></div>
</div>
<div class="fld mt"><label>العنوان التفصيلي</label><input class="inp" id="ad-a" placeholder="الحي، الشارع، رقم المبنى"></div>
<div class="fld mt"><label>ملاحظة للمندوب (اختياري)</label><input class="inp" id="ad-n" placeholder="مثال: الاتصال قبل الوصول"></div>
<button class="btn wide mt" onclick="saveAddr()">حفظ العنوان</button></div>`)}
function saveAddr(){
const t=($('#ad-t').value||'').trim(),c=($('#ad-c').value||'').trim(),a=($('#ad-a').value||'').trim(),n=($('#ad-n').value||'').trim();
if(!t||!a){toast('الاسم المختصر والعنوان التفصيلي مطلوبان','err');return}
const u=me();u.addrs=u.addrs||[];
u.addrs.push({t,a:(c?c+'، ':'')+a+(n?' — '+n:'')});
closeModal();toast('أُضيف العنوان ✓','ok');render()}
function supportOpen(){
openModal(`<div class="mhead"><b>🎧 تواصل معنا</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<div class="fld"><label>موضوع الرسالة</label><select class="inp" id="sp-s"><option>استفسار عن طلب</option><option>مشكلة في الدفع</option><option>اقتراح تحسين</option><option>شكوى على متجر</option></select></div>
<div class="fld mt"><label>نص الرسالة</label><textarea class="inp" id="sp-b" style="min-height:90px" placeholder="نحن نسمعك…"></textarea></div>
<button class="btn wide mt" onclick="(function(){if(!$('#sp-b').value.trim()){toast('اكتب رسالتك أولاً','err');return}closeModal();toast('وصلت رسالتك — سنرد خلال ٢٤ ساعة 🎧','ok')})()">إرسال</button>
<div class="hint mt" style="text-align:center">أو واتساب الدعم: ${ar('0590000000')} · من ٩ ص إلى ٩ م</div></div>`)}
function faqOpen(){
const F=[['متى يستلم التاجر المبلغ؟','عند استلامك وتقييمك، أو تلقائياً بانتهاء نافذة حماية القسم (من ٣٠ دقيقة حتى ٢٤ ساعة حسب القسم).'],
['ماذا لو كان المنتج تالفاً؟','افتح نزاعاً خلال نافذة الحماية — يبقى مبلغك معلقاً وتحكم الإدارة بعد دردشة ثلاثية مع الأدلة.'],
['كم عمولة ضمين؟','٢٫٥٪ فقط من قيمة الشحنة، تُحسم من التاجر ولا تُضاف على العميل أبداً.'],
['كيف أكسب النقاط؟','نقطة عن كل ١٠ ريال عند تحرير أي شحنة + ١٠ نقاط مع كل تقييم — وكل ١٠٠ نقطة تساوي ١٠ ريال خصم.'],
['هل يمكن الدفع من المحفظة؟','نعم — مبالغ الاسترجاع تضاف لمحفظة ضمين وتستخدمها كوسيلة دفع مباشرة.']];
openModal(`<div class="mhead"><b>❓ الأسئلة الشائعة</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
${F.map(([q,a])=>`<div style="border-bottom:1px dashed var(--line);padding:9px 2px"><b style="font-size:12.5px">${q}</b><p class="hint" style="margin-top:2px">${a}</p></div>`).join('')}</div>`)}
/* ================= صفحات التاجر ================= */
const myStore=()=>ST(SES.store);
function myGroups(){const out=[];
DB.orders.forEach(o=>o.groups.forEach((g,gi)=>{if(g.store===SES.store)out.push({o,g,gi})}));
return out.sort((a,b)=>b.o.at-a.o.at)}
function heldFor(sid){return r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>g.store===sid&&['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g)=>x+g.sub,0),0))}
function pgMDash(){
const s=myStore(),sec=SEC(s.sec);
const gs=myGroups();
const active=gs.filter(x=>['pending','preparing','shipped','received'].includes(x.g.status));
const held=heldFor(s.id);
const top=[...PRODUCTS.filter(p=>p.store===s.id)].sort((a,b)=>b.sold-a.sold).slice(0,5);
return `<div class="pghead"><h1>📊 لوحة تحكم ${esc(s.name)}</h1><span class="tag" style="background:${s.color}18;color:${s.color}">${sec.name} · 🛡️ حماية ${sec.win}</span></div>
<div class="kpis">
<div class="kpi grn"><i>💰</i><b>${money(DB.storeWallets[s.id]||0)}</b><span>صافي محرَّر (المحفظة)</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(held)}</b><span>مبالغ محجوزة لصالحك</span></div>
<div class="kpi nvy"><i>📦</i><b>${ar(active.length)}</b><span>طلبات نشطة الآن</span></div>
<div class="kpi"><i>🧺</i><b>${ar(PRODUCTS.filter(p=>p.store===s.id).length)}</b><span>منتجات معروضة</span></div>
<div class="kpi grn"><i>⭐</i><b>${ard(s.rt)}</b><span>تقييم المتجر (${ar(s.sales)} عملية)</span></div>
</div>
<div class="grid2 mt">
<div class="acard"><h3>🔥 الأكثر مبيعاً لديك</h3>
<div class="rows">${top.map(p=>`<div class="row" style="cursor:pointer" onclick="go('product','${p.id}')">
<div style="width:38px;height:38px;border-radius:11px;overflow:hidden;flex-shrink:0">${imgTag(p.imgs[0],'','')}</div>
<div style="flex:1"><b>${esc(p.name)}</b><div class="hint">${money(eff(p))} · مخزون ${ar(p.stock)}</div></div>
<b class="fx" style="color:var(--grn)">${ar(p.sold)}</b></div>`).join('')}</div></div>
<div class="acard"><h3>🕒 آخر الطلبات</h3>
<div class="rows">${active.slice(0,4).map(x=>`<div class="row">
<div style="flex:1"><b>طلب #${ar(x.o.id)}</b><div class="hint">${USERS[x.o.customer]?esc(USERS[x.o.customer].name.split(' ')[0]):'عميل'} · ${ago(x.o.at)}</div></div>
<span class="tag ${x.g.status==='pending'?'amb':'grn'}">${GLBL[x.g.status]}</span></div>`).join('')||'<div class="hint">لا طلبات نشطة</div>'}</div>
<button class="btn soft wide mt" onclick="go('m-orders')">إدارة كل الطلبات ←</button></div>
</div>`;
}
function pgMProds(){
const s=myStore(),sec=SEC(s.sec);
const ps=PRODUCTS.filter(p=>p.store===s.id);
return `<div class="pghead"><h1>🧺 منتجاتي (${ar(ps.length)})</h1><button class="btn sm" onclick="mProdForm()">＋ منتج جديد</button></div>
<div class="acard"><div class="rows">
${ps.map(p=>`<div class="row">
<div style="width:52px;height:52px;border-radius:13px;overflow:hidden;flex-shrink:0;position:relative">${imgTag(p.imgs[0],'','')}${p.off?`<span class="tag red" style="position:absolute;bottom:2px;inset-inline-start:2px;font-size:8px;padding:1px 6px">−${ar(p.off)}٪</span>`:''}</div>
<div style="flex:1;min-width:0"><b>${esc(p.name)}</b>
<div class="hint">${esc(p.cat)} · ${money(eff(p))}${p.off?` <s>${money(p.price)}</s>`:''} · مخزون ${ar(p.stock)} · بيع ${ar(p.sold)}</div></div>
<div style="display:flex;gap:5px;flex-wrap:wrap">
<div class="dd" onclick="event.stopPropagation();this.classList.toggle('open')">
<button class="btn soft xs">🏷️ عروض ▾</button>
<div class="ddmenu">${[10,20,30,40,0].map(v=>`<div class="it" onclick="mOfferSet('${p.id}',${v})">${v?'خصم '+ar(v)+'٪':'إلغاء العرض'}</div>`).join('')}</div></div>
<button class="btn gray xs" onclick="mProdForm('${p.id}')">تعديل</button>
<button class="btn red xs" onclick="mDelProd('${p.id}')">حذف</button>
</div></div>`).join('')||'<div class="empty" style="padding:26px"><div class="em">🧺</div><b>لا منتجات بعد</b><span>أضف منتجك الأول</span></div>'}
</div></div>`;
}
function mProdForm(pid){
const s=myStore(),sec=SEC(s.sec);
const p=pid?P(pid):null;
openModal(`<div class="mhead"><b>${p?'تعديل منتج':'منتج جديد'}</b><button class="x" onclick="closeModal()">✕</button></div>
<div class="mbody">
<div class="fld"><label>اسم المنتج</label><input class="inp" id="mp-nm" value="${p?esc(p.name):''}" placeholder="مثال: عباية كتان مطرزة"></div>
<div class="fgrid mt">
<div class="fld"><label>التصنيف</label><select class="inp" id="mp-cat">${CATS[sec.id].map(c=>`<option ${p&&p.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>
<div class="fld"><label>السعر (ر.س)</label><input class="inp" id="mp-pr" type="number" min="1" value="${p?p.price:''}"></div>
</div>
<div class="fgrid mt">
<div class="fld"><label>خصم ٪ (0 = بلا عرض)</label><input class="inp" id="mp-off" type="number" min="0" max="90" value="${p?p.off:0}"></div>
<div class="fld"><label>المخزون</label><input class="inp" id="mp-st" type="number" min="0" value="${p?p.stock:10}"></div>
</div>
<div class="fld mt"><label>الوصف</label><textarea class="inp" id="mp-ds" style="min-height:70px" placeholder="وصف تسويقي جاذب ب٣ أسطر…">${p?esc(p.desc):''}</textarea></div>
<div class="fld mt"><label>المواصفات (كل سطر: المفتاح: القيمة)</label><textarea class="inp" id="mp-sp" style="min-height:60px" placeholder="الخامة: كتان&#10;اللون: كحلي">${p?esc(Object.entries(p.specs).map(([k,v])=>k+': '+v).join('\n')):''}</textarea></div>
<div class="mt" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
<button class="btn soft sm" onclick="mPickImg()">📷 رفع صورة من جهازي</button>
<button class="btn gray sm" onclick="mAutoImg()">🎲 صورة تلقائية</button>
<img id="mp-prev" src="${p?p.imgs[0]:''}" style="width:54px;height:54px;border-radius:12px;object-fit:cover;border:1px solid var(--line);${p?'':'display:none'}">
</div>
<button class="btn wide mt" onclick="mSaveProd('${pid||''}')">${p?'حفظ التعديلات':'إضافة المنتج'}</button>
</div>`,'lg');
MIMG=p?p.imgs[0]:'';
}
let MIMG='';
function mPickImg(){
$('#fup').onchange=e=>{const f=e.target.files[0];if(!f)return;
const rd=new FileReader();rd.onload=()=>{MIMG=rd.result;$('#fup').value='';
const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('جهزت الصورة ✓','ok')};rd.readAsDataURL(f)};
$('#fup').click();}
function mAutoImg(){MIMG=PICS('منتج-'+Math.floor(Math.random()*99));const pv=$('#mp-prev');pv.src=MIMG;pv.style.display='block';toast('اختيرت صورة تلقائية','ok')}
function mSaveProd(pid){
const s=myStore(),sec=SEC(s.sec);
const nm=($('#mp-nm').value||'').trim(),pr=+($('#mp-pr').value||0),st=+($('#mp-st').value||0);
if(!nm||pr<1){toast('أكمل الاسم والسعر','err');return}
const specs={};($('#mp-sp').value||'').split('\n').forEach(l=>{const i=l.indexOf(':');if(i>0)specs[l.slice(0,i).trim()]=l.slice(i+1).trim()});
const off=Math.min(90,Math.max(0,+($('#mp-off').value||0)));
if(pid){const p=P(pid);Object.assign(p,{name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,desc:$('#mp-ds').value.trim(),specs});
if(MIMG)p.imgs=[MIMG,...p.imgs.slice(1)];
toast('حُفظ تعديل المنتج ✓','ok')}
else{PRODUCTS.unshift({id:'p'+(Date.now()%100000),store:s.id,name:nm,cat:$('#mp-cat').value,price:pr,off,stock:st,sold:0,rt:0,rc:0,imgs:[MIMG||PICS('منتج-'+pr)],desc:$('#mp-ds').value.trim()||nm,specs,specsFallback:{},ratings:[]});
toast('أُضيف المنتج لمتجرك ✓','ok')}
closeModal();render();
}
function mOfferSet(pid,off){P(pid).off=off;toast(off?'فُعّل خصم '+ar(off)+'٪ على «'+P(pid).name+'»':'أُلغي العرض');render()}
function mDelProd(pid){
openModal(`<div class="mhead"><b>حذف منتج</b><button class="x" onclick="closeModal()">✕</button></div><div class="mbody">
<p style="font-size:13.5px">هل تريد حذف «${esc(P(pid).name)}» من متجرك؟ لا يمكن التراجع.</p>
<div class="spread mt"><button class="btn gray" onclick="closeModal()">تراجع</button>
<button class="btn red" onclick="PRODUCTS=PRODUCTS.filter(p=>p.pid!=='${pid}'&&p.id!=='${pid}');closeModal();toast('حُذف المنتج');render()">تأكيد الحذف</button></div></div>`)}
function pgMOrders(){
const gs=myGroups();
return `<div class="pghead"><h1>📦 طلبات متجري (${ar(gs.length)})</h1></div>
${gs.map(({o,g,gi})=>{
const cust=USERS[o.customer];
const dis=DB.disputes.find(d=>d.order===o.id&&d.store===SES.store);
return `<div class="ocard">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:13.5px">طلب #${ar(o.id)}</b>
<div class="hint">${cust?esc(cust.name.split(' ')[0]):'عميل'} ${cust&&cust.hidePhone?'· رقمه مخفي بطلبه':'· '+ar(o.customer)} · ${dt(o.at)}</div></div>
<span class="tag ${g.status==='pending'?'amb':g.status==='released'?'grn':g.status==='disputed'?'red':'gry'}">${GLBL[g.status]}</span>
</div>
<div class="oitems">${g.items.map(it=>{const p=P(it.pid);return `<span class="oitag">${p?imgTag(p.imgs[0],'',''):''} ${ar(it.qty)}× ${p?esc(p.name):'—'}</span>`}).join('')}</div>
${['disputed','refunded'].includes(g.status)?'':`<div class="osteps">${GSTEPS.map((l,i)=>`<div class="st ${i<gstep(g)?'on':i===gstep(g)?'on':''}"><i></i>${l}</div>`).join('')}</div>`}
${g.status==='received'?`<div class="hint">⏳ العميل يفحص الشحنة — يُحرر المبلغ تلقائياً بعد <b class="cd" style="border:0;background:none;padding:0" data-cd="${g.complaintUntil}">${clock(g.complaintUntil-Date.now())}</b></div>`:''}
${g.status==='pending'?`<button class="btn sm mt" onclick="mAccept(${o.id},${gi})">✅ اقبل الطلب وابدأ التحضير</button>`:''}
${g.status==='preparing'?`<button class="btn amb sm mt" onclick="mShip(${o.id},${gi})">🚚 تم الشحن مع المندوب</button>`:''}
${g.status==='disputed'&&dis?`<button class="btn red sm mt" onclick="openDispute('${dis.id}')">⚖️ متابعة النزاع والرد على العميل</button>`:''}
${g.status==='released'&&g.payout?`<div class="hint mt" style="background:#1D443208;border-radius:10px;padding:7px 11px">🔓 حُرر ${money(g.payout.net)} صافياً (عمولة ضمين ${money(g.payout.comm)})${g.rated?' · تقييم العميل '+STARS(g.rated.stars):''}</div>`:''}
<div class="hint" style="margin-top:6px">قيمة الشحنة: <b>${money(g.sub)}</b> → صافيك بعد العمولة: <b style="color:var(--grn)">${money(r2(g.sub*0.975))}</b></div>
</div>`}).join('')||'<div class="empty"><div class="em">📦</div><b>لا طلبات بعد</b><span>ستظهر طلبات عملائك هنا لحظة وصولها</span></div>'}`;
}
function mAccept(oid,gi){const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='preparing';
pushNotif(o.customer,'🧵','متجرك بدأ التحضير',ST(g.store).name+' قبلت طلبك #'+ar(oid)+' وقيد التحضير الآن',['orders']);
toast('قُبل الطلب — بدأ التحضير ✅','ok');render()}
function mShip(oid,gi){const o=DB.orders.find(x=>x.id===oid);const g=o.groups[gi];
g.status='shipped';
pushNotif(o.customer,'🚚','طلبك في الطريق إليك',ST(g.store).name+' شحنت طلبك #'+ar(oid)+' — أكّد الاستلام عند وصوله',['orders']);
toast('سُجل الشحن 🚚','ok');render()}
function pgMWallet(){
const s=myStore();
const tx=[];DB.orders.forEach(o=>o.groups.forEach(g=>{if(g.store===s.id&&g.payout&&g.payout.net>0)tx.push({o,g})}));
tx.sort((a,b)=>b.g.releasedAt-a.g.releasedAt);
const totalIn=tx.reduce((a,x)=>a+x.g.payout.net,0);
return `<div class="pghead"><h1>💰 محفظة ${esc(s.name)}</h1></div>
<div class="kpis">
<div class="kpi grn"><i>💵</i><b>${money(DB.storeWallets[s.id]||0)}</b><span>الرصيد المتاح للسحب</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(heldFor(s.id))}</b><span>محجوز لحظة تحرير الطلبات</span></div>
<div class="kpi nvy"><i>📈</i><b>${money(totalIn)}</b><span>إجمالي صافي التحريرات</span></div>
<div class="kpi red"><i>🧾</i><b>${money(r2(totalIn*0.025/0.975))}</b><span>إجمالي عمولات ضمين المدفوعة</span></div>
</div>
<div class="acard mt"><h3>سجل التحريرات (صافي بعد خصم ٢٫٥٪)</h3>
<div class="rows">${tx.map(({o,g})=>`<div class="row" style="cursor:pointer" onclick="go('m-orders')">
<div style="flex:1"><b>طلب #${ar(o.id)} · ${USERS[o.customer]?esc(USERS[o.customer].name.split(' ')[0]):'عميل'}</b>
<div class="hint">${dt(g.releasedAt)} · بواسطة ${esc(g.releasedBy||'—')}</div></div>
<div style="text-align:left"><b class="fx" style="color:var(--grn)">+${money(g.payout.net)}</b><div class="hint">عمولة ${money(g.payout.comm)}</div></div></div>`).join('')||'<div class="hint">لا تحريرات بعد</div>'}</div></div>
<button class="btn amb wide" onclick="toast('أُرسل طلب السحب — يُحوَّل خلال ٢٤ ساعة 🏦','ok')">🏦 طلب سحب الرصيد المتاح</button>`;
}
function pgMDisputes(){
const ds=DB.disputes.filter(d=>d.store===SES.store);
return `<div class="pghead"><h1>⚖️ نزاعات متجري (${ar(ds.length)})</h1></div>
${ds.length?ds.map(d=>{const o=DB.orders.find(x=>x.id===d.order);
return `<div class="ocard" style="border-inline-start:4px solid ${d.status==='open'?'var(--red)':'var(--grn)'}">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:13px">⚖️ ${esc(d.subject)}</b><div class="hint">طلب #${ar(d.order)} · ${USERS[d.customer]?esc(USERS[d.customer].name.split(' ')[0]):'عميل'} · ${ago(d.openedAt)}</div></div>
${d.status==='open'?'<span class="tag red">بانتظار حكم الإدارة — المبلغ معلق</span>':`<span class="tag ${d.ruling.act==='release'?'grn':'gry'}">${d.ruling.act==='release'?'حُكم لصالحك':'استُرجع للعميل'}</span>`}</div>
${d.ruling?`<div class="verd ${d.ruling.act==='release'?'rel':'ref'}" style="margin:9px 0 2px"><h4>تسبيب الحكم</h4><div class="why">${esc(d.ruling.text)}</div></div>`:''}
<button class="btn sm ${d.status==='open'?'red':''} mt" onclick="openDispute('${d.id}')">💬 ${d.status==='open'?'الرد على العميل وإضافة أدلتك':'عرض المحادثة'}</button>
</div>`}).join(''):'<div class="empty"><div class="em">🕊️</div><b>لا نزاعات على متجرك</b><span>استمر في الجودة والسرعة 🌟</span></div>'}`;
}
function pgMSet(){
const s=myStore(),sec=SEC(s.sec);
return `<div class="pghead"><h1>⚙️ إعدادات المتجر</h1><span class="tag" style="background:${s.color}18;color:${s.color}">${sec.name}</span></div>
<div class="grid2">
<div class="acard"><h3>🏪 بيانات المتجر</h3>
<div class="fld"><label>اسم المتجر</label><input class="inp" id="ms-nm" value="${esc(s.name)}"></div>
<div class="fld mt"><label>وصف المتجر (يظهر لكل العملاء)</label><textarea class="inp" id="ms-ds" style="min-height:80px">${esc(s.desc)}</textarea></div>
<button class="btn mt" onclick="mSaveStore()">حفظ البيانات</button>
</div>
<div class="acard"><h3>🚦 حالة التشغيل</h3>
<div class="setrow"><div class="ic">${s.open?'🟢':'🔴'}</div><div class="tx"><b>استقبال الطلبات</b><span>${s.open?'متجرك مفتوح ويستقبل الطلبات':'مغلق مؤقتاً — منتجاتك تظهر دون زر شراء'}</span></div>
<button class="sw ${s.open?'on':''}" onclick="myStore().open=!myStore().open;render()"></button></div>
<div class="setrow"><div class="ic">🛡️</div><div class="tx"><b>نافذة حماية قسمك</b><span>${sec.name}: ${sec.win} بعد استلام العميل — ثابتة بسياسة ضمين</span></div><span class="tag grn">إلزامية</span></div>
<div class="setrow"><div class="ic">🧾</div><div class="tx"><b>عمولة ضمين</b><span>٢٫٥٪ من كل شحنة — تُقتطع لحظة التحرير فقط</span></div><span class="tag amb">٢٫٥٪</span></div>
</div>
</div>`;
}
function mSaveStore(){const s=myStore();
const nm=($('#ms-nm').value||'').trim();
if(nm.length<2){toast('اسم المتجر قصير','err');return}
s.name=nm;s.desc=($('#ms-ds').value||'').trim();
toast('حُفظت بيانات متجرك ✓','ok');render()}
/* ================= صفحات الإدارة ================= */
const vaultNow=()=>r2(DB.orders.reduce((a,o)=>a+o.groups.filter(g=>['pending','preparing','shipped','received','disputed'].includes(g.status)).reduce((x,g)=>x+g.sub+g.dl,0),0));
function pgAOver(){
const open=DB.disputes.filter(d=>d.status==='open');
const releasedTotal=DB.orders.reduce((a,o)=>a+o.groups.reduce((x,g)=>x+(g.payout?g.payout.sub:0),0),0);
return `<div class="pghead"><h1>🛡️ مركز إدارة ضمين</h1><span class="tag nvy">المشرف العام</span></div>
<div class="kpis">
<div class="kpi grn"><i>🧾</i><b>${money(DB.aRevenue)}</b><span>إجمالي عمولات ضمين (٢٫٥٪)</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(vaultNow())}</b><span>مبالغ محجوزة حالياً</span></div>
<div class="kpi nvy"><i>🔓</i><b>${money(releasedTotal)}</b><span>إجمالي الشحنات المحررة</span></div>
<div class="kpi red"><i>⚖️</i><b>${ar(open.length)}</b><span>نزاعات بانتظار حكمك</span></div>
<div class="kpi"><i>🏪</i><b>${ar(STORES.length)}</b><span>متجر (${ar(STORES.filter(s=>!s.approved).length)} معلق)</span></div>
<div class="kpi"><i>👥</i><b>${ar(Object.keys(USERS).length)}</b><span>مستخدم مسجل</span></div>
</div>
<div class="grid2 mt">
<div class="acard"><h3>⚖️ طابور التحكيم</h3>
${open.length?open.map(d=>`<div class="row" style="cursor:pointer" onclick="openDispute('${d.id}')">
<div style="flex:1"><b>${esc(d.subject)}</b><div class="hint">${ST(d.store).name} · طلب #${ar(d.order)} · ${ago(d.openedAt)}</div></div>
<span class="tag red">يحتاج حكماً</span></div>`).join(''):'<div class="hint mb">لا نزاعات معلقة — كل شيء تحت السيطرة 🕊️</div>'}
<button class="btn soft wide" onclick="go('a-disputes')">كل النزاعات ←</button></div>
<div class="acard"><h3>🚦 متاجر بانتظار الاعتماد</h3>
${STORES.filter(s=>!s.approved).map(s=>`<div class="row">
<div class="mstore" style="--c:${s.color};pointer-events:none"><div class="lg">${s.name[0]}</div><div><b>${esc(s.name)}</b><span class="mr">${SEC(s.sec).name} · ${USERS[s.owner]?esc(USERS[s.owner].name):''}</span></div></div>
<button class="btn sm" onclick="aApprove('${s.id}')">✓ اعتماد</button></div>`).join('')||'<div class="hint">لا متاجر معلقة</div>'}
</div></div>`;
}
function pgADisputes(){
const open=DB.disputes.filter(d=>d.status==='open');
const done=DB.disputes.filter(d=>d.status==='resolved');
return `<div class="pghead"><h1>⚖️ التحكيم</h1><span class="tag ${open.length?'red':'grn'}">${ar(open.length)} مفتوح · ${ar(done.length)} محسوم</span></div>
<b class="fx" style="font-size:14px;color:var(--red)">⏳ بانتظار الحكم — افتح الدردشة واطّلع على أدلة الطرفين</b>
${open.map(d=>{const o=DB.orders.find(x=>x.id===d.order);const g=o.groups.find(x=>x.store===d.store);
return `<div class="ocard" style="border-inline-start:4px solid var(--red)">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:13.5px">${esc(d.subject)}</b>
<div class="hint">${USERS[d.customer]?esc(USERS[d.customer].name):'عميل'} × ${ST(d.store).name} · طلب #${ar(d.order)} · ${money(g.sub)} معلقة</div></div>
<span class="tag red">مبلغ معلق ${money(g.sub)}</span></div>
<button class="btn red sm mt" onclick="openDispute('${d.id}')">🛡️ فتح القضية وإصدار الحكم</button></div>`}).join('')||'<div class="empty" style="padding:26px"><div class="em">🕊️</div><b>لا قضايا مفتوحة</b></div>'}
<div class="hr" style="margin:20px 0"></div>
<b class="fx" style="font-size:14px;color:var(--grn)">📁 أحكام صادرة</b>
${done.map(d=>`<div class="ocard" style="border-inline-start:4px solid var(--grn)">
<div class="spread" style="flex-wrap:wrap">
<div><b class="fx" style="font-size:13px">${esc(d.subject)} — طلب #${ar(d.order)}</b>
<div class="hint">${d.ruling.act==='release'?'إفراج للتاجر':'استرجاع للعميل'} · ${dt(d.ruling.at)}</div></div>
<button class="btn gray xs" onclick="openDispute('${d.id}')">عرض الملف</button></div>
<div class="verd ${d.ruling.act==='release'?'rel':'ref'}" style="margin:8px 0 0"><h4>التسبيب</h4><div class="why">${esc(d.ruling.text)}</div></div></div>`).join('')||'<div class="hint mt">لا أحكام سابقة</div>'}`;
}
function pgAStores(){
return `<div class="pghead"><h1>🏪 إدارة المتاجر</h1></div>
<div class="acard"><div class="rows">
${STORES.map(s=>`<div class="row">
<div style="width:44px;height:44px;border-radius:13px;background:${s.color};color:#fff;display:grid;place-items:center;font-family:Alexandria;font-weight:800;flex-shrink:0">${s.name[0]}</div>
<div style="flex:1;min-width:0"><b>${esc(s.name)}</b>
<div class="hint">${SEC(s.sec).name} · ${USERS[s.owner]?esc(USERS[s.owner].name):'—'} · ★ ${ard(s.rt)} · ${ar(s.sales)} عملية</div></div>
<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
<span class="fx" style="font-size:12.5px;color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</span>
${!s.approved?`<span class="tag amb">معلق</span><button class="btn sm" onclick="aApprove('${s.id}')">✓ اعتماد</button>`
:s.susp?`<span class="tag red">موقوف</span><button class="btn gray xs" onclick="aSusp('${s.id}')">إلغاء الإيقاف</button>`
:`<span class="tag grn">معتمد</span><button class="btn red xs" onclick="aSusp('${s.id}')">إيقاف</button>`}
</div></div>`).join('')}
</div></div>`;
}
function aApprove(sid){const s=ST(sid);s.approved=true;
pushNotif(s.owner,'🎉','تهانينا! اعتُمد متجرك','«'+s.name+'» صار ظاهراً للعملاء في قسم '+SEC(s.sec).name,['m-dash']);
toast('اعتُمد متجر «'+s.name+'» ✓','ok');render()}
function aSusp(sid){const s=ST(sid);s.susp=!s.susp;
pushNotif(s.owner,s.susp?'⛔':'✅',s.susp?'أُوقف متجرك مؤقتاً':'أُلغي إيقاف متجرك',s.susp?'راجع فريق الامتثال في ضمين':'عاد متجرك للعمل بشكل طبيعي',['m-set']);
toast(s.susp?'أُوقف المتجر مؤقتاً':'أُعيد تشغيل المتجر','ok');render()}
function pgAUsers(){
return `<div class="pghead"><h1>👥 المستخدمون (${ar(Object.keys(USERS).length)})</h1></div>
<div class="acard"><div class="rows">
${Object.entries(USERS).map(([ph,u])=>`<div class="row">
<div class="avat" style="width:38px;height:38px;border-radius:12px;font-size:14px">${u.name[0]}</div>
<div style="flex:1;min-width:0"><b>${esc(u.name)}</b><div class="hint">${ar(ph)}${u.store?' · '+ST(u.store).name:''}</div></div>
<span class="tag ${u.role==='customer'?'grn':u.role==='merchant'?'amb':'nvy'}">${{customer:'عميل',merchant:'تاجر',admin:'إدارة'}[u.role]}</span>
${u.role==='customer'?`<span class="hint">🌟 ${ar(u.pts||0)}</span><span class="hint">💰 ${money(u.bal||0)}</span>`:''}
<span class="hint">${ar(DB.orders.filter(o=>o.customer===ph).length)} طلب</span>
</div>`).join('')}
</div></div>`;
}
function pgARev(){
const mx=Math.max(...DB.revMonths.map(m=>m.v));
return `<div class="pghead"><h1>📈 إيرادات ضمين</h1><span class="tag grn">عمولة ٢٫٥٪ تُحوَّل للإدارة لحظة كل تحرير</span></div>
<div class="kpis mb">
<div class="kpi grn"><i>🧾</i><b>${money(DB.aRevenue)}</b><span>إجمالي العمولات حتى اليوم</span></div>
<div class="kpi amb"><i>🔒</i><b>${money(vaultNow())}</b><span>محجوز في الخزنة الآن</span></div>
<div class="kpi nvy"><i>🏪</i><b>${money(r2(Object.values(DB.storeWallets).reduce((a,b)=>a+b,0)))}</b><span>صافي أرصدة التجار</span></div>
</div>
<div class="acard"><h3>عمولات آخر ٥ أشهر (ألف ر.س)</h3>
<div class="rvbars">${DB.revMonths.map(m=>`<div class="rv"><span>${ard(m.v)}</span><i style="height:${Math.max(8,m.v/mx*100)}%"></i><b>${m.m}</b></div>`).join('')}</div>
</div>
<div class="acard mt"><h3>أرصدة تجار الضمان</h3>
<div class="rows">${STORES.map(s=>`<div class="row">
<div style="width:34px;height:34px;border-radius:10px;background:${s.color};color:#fff;display:grid;place-items:center;font-size:13px;font-family:Alexandria;font-weight:800">${s.name[0]}</div>
<div style="flex:1"><b>${esc(s.name)}</b><div class="hint">${SEC(s.sec).name} · محجوز لصالحه ${money(heldFor(s.id))}</div></div>
<b class="fx" style="color:var(--grn)">${money(DB.storeWallets[s.id]||0)}</b></div>`).join('')}</div></div>`;
}
/* ================= الإقلاع ================= */
document.addEventListener('click',()=>document.querySelectorAll('.dd.open').forEach(d=>d.classList.remove('open')));
render();

