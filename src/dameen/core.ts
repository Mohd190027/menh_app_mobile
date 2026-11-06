/* ضمين — core.ts
 * البيانات والدوال النقية — منقولة حرفياً من dameen.js (السطور ٢-٣١٢) عبر scripts/make-core.js
 * مولَّد آلياً: لا تُحرَّر يدوياً. الاستثناءات المنقولة يدوياً: impInfo و playVid (shop.tsx) و custCity (store.ts).
 */
export const $=s=>document.querySelector(s);

export const ar=n=>String(n).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);

export const ard=n=>{let s=(+(+n).toFixed(2)).toLocaleString('en-US');return ar(s).replace(/,/g,'٬').replace(/\./g,'٫')};

export const money=n=>ard(n)+' ر.س';

export const pctf=n=>ard(n)+'٪';

export const r2=n=>Math.round(n*100)/100;

export const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export function hash(s){let h=0;s=String(s);for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0}return Math.abs(h)}

export function imgTag(src,cls,alt){src=src||'';const seed='d'+(hash(src+alt)%9973);return `<img src="${src}" class="${cls||''}" alt="${esc(alt||'صورة')}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${seed}/700/700'">`}

export const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

export function dt(ts){const d=new Date(ts);const h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');const t=(h%12||12)+':'+ar(m)+(h<12?' ص':' م');return ar(d.getDate())+' '+MONTHS[d.getMonth()]+'، '+t}

export function ago(ts){const s=(Date.now()-ts)/1000;if(s<60)return'قبل لحظات';if(s<3600)return'قبل '+ar(Math.floor(s/60))+' د';if(s<86400)return'قبل '+ar(Math.floor(s/3600))+' س';return'قبل '+ar(Math.floor(s/86400))+' يوم'}

export function clock(ms){if(ms<0)ms=0;const t=Math.floor(ms/1000);const h=String(Math.floor(t/3600)).padStart(2,'0'),m=String(Math.floor(t%3600/60)).padStart(2,'0'),s=String(t%60).padStart(2,'0');return ar(h+':'+m+':'+s)}

export function toast(msg,type?){const t=document.createElement('div');t.className='toast '+(type||'');t.innerHTML=(type==='ok'?'✓ ':type==='err'?'⚠ ':'◆ ')+msg;$('#toasts').appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(-10px)';setTimeout(()=>t.remove(),320)},3400)}

export const STARS=r=>{r=Math.round(r);return '<span class="stars">'+'★'.repeat(r)+'☆'.repeat(5-r)+'</span>'};

export const SECTIONS:any=[
{id:'fashion',name:'عالم الأزياء والجمال',icon:'👗',color:'#7A3B44',winMin:120,win:'ساعتان',desc:'عبايات وأزياء وعطور وعناية بلمسة محلية',img:'/dameen/img/6f94d1cccea3.jpg'},
{id:'family',name:'عالم المأكولات والضيافة',icon:'🏡',color:'#556636',winMin:30,win:'٣٠ دقيقة',desc:'عسل وتمور وأطباق مطابخ وحلويات طازجة',img:'/dameen/img/foodcat.jpg'},
{id:'deco',name:'عالم الهدايا والديكور والمناسبات',icon:'🎁',color:'#A45A3A',winMin:1440,win:'٢٤ ساعة',desc:'هدايا وديكور وتنسيق مناسبات ميداني',img:'/dameen/img/0dcd6b176ac1.jpg'},
{id:'gaming',name:'عالم الألعاب والأجهزة والمنتجات الرقمية',icon:'🎮',color:'#50489E',winMin:180,win:'٣ ساعات',desc:'أجهزة ألعاب وملحقات وأصول رقمية بتسليم فوري',img:'/dameen/img/68dae69f3198.webp'}];

export const CATS:any={fashion:[{n:'عبايات',comm:2.5},{n:'أزياء',comm:2.5},{n:'حقائب وعطور',comm:2.5},{n:'العناية والجمال',comm:2.5}],family:[{n:'عسل وتمور',comm:2.5},{n:'ألبان ومخبوزات',comm:2.5},{n:'حلويات وأطباق',comm:2.5},{n:'سدو وحرف',comm:2.5}],deco:[{n:'ديكور',comm:2.5},{n:'هدايا',comm:2.5},{n:'قهوة وضيافة',comm:2.5},{n:'تنسيق مناسبات',comm:2.5}],gaming:[{n:'أجهزة وملحقات',comm:3},{n:'ألعاب رقمية وأكواد',comm:1.5},{n:'اشتراكات رقمية',comm:1.5},{n:'كتب وثيمات رقمية',comm:1}]};

export const catComm=(sec,cat)=>{const c=(CATS[sec]||[]).find(x=>x.n===cat);return +((c?c.comm:2.5).toFixed(2))};

export const SEC=id=>SECTIONS.find(s=>s.id===id);

export const STORES:any=[
{id:'s1',name:'دَفى العبايات',sec:'fashion',owner:'0500000002',color:'#7A3B44',cover:'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=760&auto=format&fit=crop',desc:'عبايات كتان وخامات فاخرة بخياطة سعودية متقنة',rt:4.8,sales:342,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:300},
{id:'s2',name:'خيوط الغندورة',sec:'fashion',owner:'0500000004',color:'#96505E',cover:'/dameen/img/b79232a91370.jpg',desc:'طرق بيتية وأزياء مطرزة يدوياً بخيوط ملونة',rt:4.6,sales:198,susp:false,open:true,city:'جدة',dlMode:'customer',freeMin:350},
{id:'s3',name:'مزرعة الواحة',sec:'family',owner:'0500000005',color:'#556636',cover:'/dameen/img/c2626d093c49.jpg',desc:'عسل سدر وتمور خلاص من مزارعنا مباشرة',rt:4.9,sales:521,susp:false,open:true,city:'الأحساء',dlMode:'half',freeMin:250},
{id:'s4',name:'بيت السدو',sec:'family',owner:'0500000006',color:'#6B7A3F',cover:'/dameen/img/cfe35a802f4f.jpg',desc:'منتجات سدو أصيلة منسوجة على النول التقليدي',rt:4.7,sales:87,susp:false,open:true,city:'بريدة',dlMode:'customer',freeMin:0,qs:['هل لديك ملاحظة على درجة تمليح الجبن؟','التميس بالبر أم بالعسل الأسود؟']},
{id:'s5',name:'لمسة ديكور',sec:'deco',owner:'0500000007',color:'#A45A3A',cover:'/dameen/img/11c491ea9778.jpg',desc:'شموع ومباخر ومستلزمات منزل بأناقة هادئة',rt:4.5,sales:264,susp:false,open:true,city:'الطائف',dlMode:'customer',freeMin:400},
{id:'s6',name:'هدايا المعمور',sec:'deco',owner:'0500000008',color:'#B26640',cover:'/dameen/img/vgifts.jpg',desc:'بوكسات هدايا مغلفة بفخامة تناسب كل مناسبة',rt:4.8,sales:173,susp:false,open:true,city:'الرياض',dlMode:'free',freeMin:0},
{id:'s7',name:'فخار الطائف',sec:'deco',owner:'0500000009',color:'#8F5B36',cover:'/dameen/img/9a3a0638140e.jpg',desc:'فخاريات مدوّرة يدوياً من طين الطائف',rt:4.4,sales:12,susp:false,open:true,city:'الطائف',dlMode:'customer',freeMin:0},
{id:'s8',name:'مطبخ أم خالد',sec:'family',owner:'0500000010',color:'#7C5A3A',cover:'/dameen/img/1c2383e2b42c.jpg',desc:'طبخ بيتي سعودي — كيك مناسبات وورق عنب على أصولها',rt:4.7,sales:156,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:150,qs:['هل لديك حساسية من أي مكسرات؟','الكريمة أم التمر على الكيكة؟','وقت التسليم المفضل لديك؟']},
{id:'s9',name:'قيمز زون',sec:'gaming',owner:'0500000011',color:'#50489E',cover:'/dameen/img/gstore.jpg',desc:'أجهزة ألعاب وملحقات تقنية أصلية بضمان الوكيل — تغليف حماية خاص للأجهزة القابلة للكسر',rt:4.7,sales:214,susp:false,open:true,city:'الرياض',dlMode:'customer',freeMin:500},
{id:'s10',name:'بايت كود',sec:'gaming',owner:'0500000012',color:'#3D7B8C',cover:'/dameen/img/codes.jpg',desc:'أكواد ألعاب واشتراكات رقمية وكتب إلكترونية وثيمات — تسليم فوري لحظة الدفع بلا شحن',rt:4.8,sales:342,susp:false,open:true,city:'جدة',dlMode:'free',freeMin:0}];

export const ST=id=>STORES.find(s=>s.id===id);

export const U='https://images.unsplash.com/photo-';

export const IM=(id,s?)=>U+id+'?q=80&w=760&auto=format&fit=crop';

export const PICS=(s)=>'https://picsum.photos/seed/'+encodeURIComponent(s)+'/760/760';

export const ZPOOL=['/dameen/img/dates.jpg','/dameen/img/syrup.jpg','/dameen/img/cfe35a802f4f.jpg','/dameen/img/291826012a56.jpg','/dameen/img/ed876a628b49.jpg','/dameen/img/8792c1cd454c.jpg','/dameen/img/11c491ea9778.jpg','/dameen/img/basket.jpg','/dameen/img/cups.jpg','/dameen/img/burner.jpg','/dameen/img/enab.jpg','/dameen/img/ffebfbe70844.jpg','/dameen/img/9a3a0638140e.jpg','/dameen/img/1c2383e2b42c.jpg','/dameen/img/giftbox.jpg','/dameen/img/e44feac627da.jpg','/dameen/img/vgifts.jpg','/dameen/img/b79232a91370.jpg','/dameen/img/a2ad882f2382.jpg','/dameen/img/c2626d093c49.jpg','/dameen/img/7bd7eee784a6.jpg','/dameen/img/headset1.jpg','/dameen/img/6f94d1cccea3.jpg','/dameen/img/headset2.jpg','/dameen/img/0dcd6b176ac1.jpg','/dameen/img/controller1.jpg','/dameen/img/e28496a66dff.jpg','/dameen/img/controller2.jpg','/dameen/img/console.png','/dameen/img/keyboard.jpg','/dameen/img/gcode.jpg'];

export let PRODUCTS:any=[
{id:'p1',store:'s1',name:'عباية كتان «نسمة»',cat:'عبايات',price:349,off:15,stock:12,sold:214,rt:4.9,rc:86,imgs:[IM('1594633312681-425c7b97ccd1'),IM('1515372039744-b8f02a3ae446'),IM('1523381210434-271e8be1f52b')],vids:[{src:'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',dur:10}],qs:[{q:'لون التطريز على الأكمام؟',t:'opts',o:['ذهبي','فضي','بلا تطريز']},{q:'ملاحظتك على التغليف (تصل مع الطلب)',t:'txt'}],
desc:'عباية كتان بخامة مصرية مريحة وقَصّة واسعة تناسب يومك كامل. تطريز يدوي دقيق على الأكمام يمنحها لمسة أنيقة بعيدة عن المبالغة، مع سحّاب جانبي مخفي وجيوب داخلية عملية.',
specs:{'الخامة':'كتان مصري ١٠٠٪','اللون':'كحلي غامق','المقاسات':'S / M / L / XL','العناية':'غسيل بارد يدوي'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'الخامة ثقيلة وفخمة والخياطة نظيفة جداً، وصلت قبل الموعد.',at:Date.now()-864e5*5}]},
{id:'p2',store:'s1',name:'عباية حرير مطرزة «ليان»',cat:'عبايات',price:520,off:0,stock:7,sold:97,rt:4.7,rc:41,imgs:[IM('1515372039744-b8f02a3ae446'),IM('1594633312681-425c7b97ccd1')],
desc:'عباية مناسبات من الحرير الطبيعي بتطريز لؤلؤي على الصدر والأكمام. مناسبة للمناسبات المسائية والدعوات الخاصة، تأتي مع كيس حفظ مبطن بالقطن.',
specs:{'الخامة':'حرير طبيعي','التطريز':'لؤلؤ يدوي','الطول':'متوفر حتى ٦٠ سم','التغليف':'كيس حفظ مبطن'},ratings:[]},
{id:'p3',store:'s1',name:'طرحة شيفون مزدوجة',cat:'عبايات',price:95,off:20,stock:30,sold:186,rt:4.6,rc:52,imgs:[IM('1523381210434-271e8be1f52b')],
desc:'طرحة شيفون بطبقتين لا تكشف ولا تنزلق، بخياطة مزدوجة تحفظ شكلها بعد الغسيل. متوفرة بعدة ألوان هادئة تناسب العبايات اليومية.',
specs:{'الخامة':'شيفون مزدوج','المقاس':'١٨٠ × ٧٥ سم','الألوان':'أسود / كحلي / زيتي'},ratings:[]},
{id:'p4',store:'s2',name:'طقم بيت قطني مطرز «دفء»',cat:'أزياء',price:189,off:0,stock:15,sold:143,rt:4.6,rc:33,imgs:['/dameen/img/pajamas.jpg','/dameen/img/b79232a91370.jpg'],
desc:'طقم بيت من القطن المشغول بتطريز يدوي على الصدر. مريح للاستخدام اليومي والاستقبالات العائلية، خامة تتنفس ولا تسبب الحكة.',
specs:{'الخامة':'قطن مشغول','المقاسات':'M / L / XL','الألوان':'بيج / رمادي'},ratings:[]},
{id:'p5',store:'s2',name:'فستان سواريه مخمل «سهرة»',cat:'أزياء',price:640,off:10,stock:4,sold:58,rt:4.8,rc:19,imgs:['/dameen/img/a2ad882f2382.jpg'],
desc:'فستان مخمل بقَصّة A كلاسيكية وأزرار لؤلؤية ظهرية. مثالي لحفلات الزواج والمناسبات المسائية، مع حاشية داخلية ناعمة تمنع الالتصاق.',
specs:{'الخامة':'مخمل مستورد','الطول':'ميدي','التنظيف':'تنظيف جاف فقط'},ratings:[]},
{id:'p6',store:'s2',name:'حقيبة يد جلد طبيعي',cat:'حقائب وعطور',price:280,off:0,stock:9,sold:121,rt:4.8,rc:22,imgs:[IM('1548036328-c9fa89d128fa')],
desc:'حقيبة يد من الجلد الطبيعي المدبوغ نباتياً، تصنع يدوياً وتأتي برائحة الجلد الأصيلة. تتسع للجوال والمحفظة والأساسيات، بحزام كتف قابل للفك.',
specs:{'الخامة':'جلد طبيعي مدبوغ','الحجم':'٢٤ × ١٦ سم','الحزام':'قابل للفك والتعديل'},ratings:[]},
{id:'p7',store:'s2',name:'عطر عود ملكي ٥٠ مل',cat:'حقائب وعطور',price:220,off:0,stock:18,sold:167,rt:4.7,rc:44,imgs:[IM('1541643600914-78a08a3003d8')],
desc:'عطر زيتي مركّز بمزيج العود الكمبودي والورد الطائفي، ثبات يمتد لأكثر من ثماني ساعات. يأتي في علبة خشبية تصلح للإهداء.',
specs:{'النوع':'زيتي مركّز','الحجم':'٥٠ مل','الثبات':'٨+ ساعات','التغليف':'علبة خشب'},ratings:[]},
{id:'p8',store:'s3',name:'عسل سدر جبلي ٥٠٠ جم',cat:'عسل وتمور',price:185,off:0,stock:26,sold:412,rt:4.9,rc:154,imgs:['/dameen/img/c2626d093c49.jpg','/dameen/img/7bd7eee784a6.jpg'],vids:[{src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',dur:7}],
desc:'عسل سدر جبلي خام غير مبستر، يُقطف من مناحلنا في مرتفعات الجنوب مرة واحدة في السنة. قوامه كثيف وطعمه غني، ويأتي ببرطمان زجاجي محكم الغلق مع شهادة منشأ.',
specs:{'النوع':'سدر خام','الوزن':'٥٠٠ جم','المصدر':'مرتفعات الجنوب','التخزين':'بعيداً عن الشمس'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'طعمه ما يشبه عسل جدي الله يرحمه، أصلي وواضح.',at:Date.now()-864e5*2}]},
{id:'p9',store:'s3',name:'تمر خلاص فاخر ١ كجم',cat:'عسل وتمور',price:65,off:10,stock:40,sold:380,rt:4.8,rc:96,imgs:['/dameen/img/dates.jpg'],
desc:'تمر خلاص مفضل بدرجة أولى، حبة كبيرة لينة بحلاوة متوازنة. يُنتقى حبة حبة ويُعبأ في علبة أنيقة مناسبة للضيافة والإهداء.',
specs:{'النوع':'خلاص مفضل','الوزن':'١ كجم','الدرجة':'أولى'},ratings:[]},
{id:'p10',store:'s3',name:'دبس تمر بلدي',cat:'عسل وتمور',price:45,off:0,stock:22,sold:154,rt:4.6,rc:38,imgs:['/dameen/img/syrup.jpg'],
desc:'دبس تمر بلدي مطبوخ على الحطب دون أي إضافات أو سكريات. كثيف بلون العنبر، مثالي مع الفطور الشتوي والحلويات الشعبية.',
specs:{'الوزن':'٤٠٠ جم','المكوّنات':'تمر فقط'},ratings:[]},
{id:'p11',store:'s3',name:'سلة الواحة (عسل + تمر + دبس)',cat:'عسل وتمور',price:265,off:12,stock:14,sold:98,rt:4.9,rc:27,imgs:['/dameen/img/basket.jpg'],
desc:'سلة خشبية تجمع عسل سدر ٢٥٠ جم وتمر خلاص ٥٠٠ جم ودبس بلدي، مغلفة بجبينة كتان وشريط. الهدية المثالية للمناسبات وزيارات العزيمة.',
specs:{'المحتوى':'٣ منتجات','التغليف':'سلة خشب + كتان'},ratings:[]},
{id:'p12',store:'s4',name:'مفرش سدو للطاولة',cat:'سدو وحرف',price:420,off:0,stock:5,sold:64,rt:4.7,rc:29,imgs:['/dameen/img/cfe35a802f4f.jpg'],
desc:'مفرش منسوج على النول الأصلي بخيوط صوف ملونة بنقوش السدو النجدية. كل قطعة تستغرق أسبوعين من النسج اليدوي، ولا تتكرر بنفس توزيعة الألوان.',
specs:{'الخامة':'صوف طبيعي','المقاس':'١٤٠ × ٩٠ سم','الصناعة':'نول يدوي'},ratings:[]},
{id:'p13',store:'s4',name:'حزام سدو منسوج',cat:'سدو وحرف',price:150,off:0,stock:8,sold:73,rt:4.5,rc:17,imgs:['/dameen/img/291826012a56.jpg'],
desc:'حزام منسوج بخيوط السدو الملوّنة مع إبزيم نحاسي مصقول. قطعة تراثية عملية تلبس مع الثوب أو كإكسسوار عصري فوق المعطف.',
specs:{'العرض':'٤ سم','الإبزيم':'نحاس'},ratings:[]},
{id:'p14',store:'s4',name:'جبن قريش بلدي ٣٥٠ جم',cat:'ألبان ومخبوزات',ptype:'chilled',temp:'chilled',price:25,off:0,stock:20,sold:96,rt:4.6,rc:31,imgs:['/dameen/img/ed876a628b49.jpg'],
desc:'جبن قريش بلدي يُحضّر صباح كل يوم من حليب المزرعة، قوامه طري وملحه خفيف. يُسلّم مبرداً في نفس يوم صناعته.',
specs:{'الوزن':'٣٥٠ جم','الصلاحية':'٥ أيام مبردة'},ratings:[]},
{id:'p15',store:'s4',name:'خبز تميس بيتي (٤ حبات)',cat:'ألبان ومخبوزات',ptype:'instant',temp:'hot',price:12,off:0,stock:35,sold:640,rt:4.8,rc:203,imgs:['/dameen/img/8792c1cd454c.jpg'],
desc:'تميس بيتي يُخبز على التنور الحجري بعجين مخمّر ببطء. يخرج ساخناً مع الزبدة والعسل الأسود، ويُسلّم في أكياس حرارية تحفظ حرارته.',
specs:{'الكمية':'٤ حبات','التسليم':'ساخن يومياً'},ratings:[]},
{id:'p16',store:'s5',name:'شمعة ياسمين معطرة',cat:'ديكور',price:65,off:0,stock:28,sold:231,rt:4.5,rc:47,imgs:['/dameen/img/11c491ea9778.jpg'],
desc:'شمعة صويا معطرة برائحة الياسمين المسائي، فتيل قطني نظيف يحترق دون دخان. تعبئ المنزل بهدوء لأكثر من ٣٥ ساعة، في وعاء زجاجي يعاد استخدامه.',
specs:{'الشمعة':'شمع صويا','الرائحة':'ياسمين','مدة الاحتراق':'٣٥+ ساعة','الوزن':'٢٢٠ جم'},ratings:[]},
{id:'p17',store:'s5',name:'مبخرة نحاسية مزخرفة',cat:'ديكور',price:140,off:20,stock:11,sold:158,rt:4.7,rc:39,imgs:['/dameen/img/burner.jpg'],
desc:'مبخرة نحاسية بنقش يدوي ومقبض حراري معزول. تأتي مع طبق فحم عازل وغطاء محفور يوزع الدخان بلطف، قطعة تجمع بين الأصالة والاستخدام اليومي.',
specs:{'الخامة':'نحاس مطروق','التشطيب':'نقش يدوي','يشمل':'طبق فحم + غطاء'},ratings:[]},
{id:'p18',store:'s5',name:'طقم فناجيل قهوة مذهّب (٦)',cat:'قهوة وضيافة',fragile:true,price:195,off:0,stock:9,sold:129,rt:4.8,rc:26,imgs:['/dameen/img/cups.jpg'],
desc:'ستة فناجيل بورسلين بحافة مذهّبة مقاومة للاحتكاك، تصلح للقهوة والشاي. تصميم بقوارير رفيعة يليق بالمجالس، وتأتي في علبة مبطنة تصلح للإهداء.',
specs:{'العدد':'٦ فناجيل','الخامة':'بورسلين','الطلاء':'ذهبي ٢٤ قيراط'},ratings:[]},
{id:'p19',store:'s6',name:'بوكس هدايا «شكراً» مخمل',cat:'هدايا',ptype:'ship',giftOk:true,customOk:true,price:240,off:0,stock:16,sold:174,rt:4.8,rc:31,imgs:[IM('1549465220-1a8b9238cd48'),'/dameen/img/giftbox.jpg'],
desc:'بوكس مخمل فارغ يضم ٤ علب داخلية و٣ بطاقات إهداء بألوان هادئة، يعاد تشكيله حسب المناسبة. التغليف يشمل شريط ساتان وبطاقة يدوية بخط جميل.',
specs:{'المحتوى':'٤ علب + ٣ بطاقات','اللون':'أخضر زيتي / كحلي','التغليف':'ساتان + بطاقة'},ratings:[]},
{id:'p20',store:'s6',name:'لوحة خط عربي مؤطرة «الفرج»',cat:'هدايا',ptype:'ship',giftOk:true,price:160,off:0,stock:7,sold:88,rt:4.6,rc:18,imgs:['/dameen/img/ffebfbe70844.jpg'],
desc:'لوحة خط ديواني بكلمة «الفرج» مرسومة يدوياً بالحبر الأسود على ورق مقوى عاجي، بإطار خشب طبيعي وزجاج عاكس. توقيع الخطاط على الزاوية.',
specs:{'المقاس':'٤٠ × ٣٠ سم','الإطار':'خشب طبيعي','الخط':'ديواني حر'},ratings:[]},
{id:'p21',store:'s7',name:'مزهرية فخار مزججة',cat:'ديكور',fragile:true,price:110,off:0,stock:6,sold:12,rt:4.4,rc:5,imgs:['/dameen/img/9a3a0638140e.jpg'],
desc:'مزهرية فخارية مدوّرة على الدولاب ومزججة بطلاء لامع غير متكرر. كل قطعة فريدة بدرجة لونها، من طين الطائف الأحمر.',
specs:{'الارتفاع':'٢٤ سم','الخامة':'فخار مزجج'},ratings:[]},
{id:'p22',store:'s8',name:'كيكة العيد بالكريمة (حساسة للحرارة)',cat:'حلويات وأطباق',ptype:'chilled',temp:'chilled',price:145,off:0,stock:6,sold:89,rt:4.8,rc:21,imgs:['/dameen/img/1c2383e2b42c.jpg'],
desc:'كيكة إسفنجية بطبقات الكريمة المخفوقة، تُخبز يوم الطلب وتُسلّم مبردة في صندوق حافظ للحرارة. حساسة للحرارة — يُجدول لها النظام تلقائياً توصيلاً مبرداً مع أقرب شركة متعاقدة.',
specs:{'الحجم':'٨ أشخاص','الحفظ':'مبردة حتى التسليم','التحضير':'يوم الطلب'},ratings:[]},
{id:'p23',store:'s8',name:'صحن ورق عنب عائلي (طازج)',cat:'حلويات وأطباق',ptype:'instant',price:55,off:0,stock:15,sold:132,rt:4.7,rc:30,imgs:['/dameen/img/enab.jpg'],
desc:'ورق عنب بلدي ملفوف يدوياً ومطبوخ على أصوله مع لحم مفروم وأرز بسمتي. يُحضّر يوم الطلب ويُرسل فور تأكيده مع مندوب فوري — وقت التسليم المتوقع ٤٥ دقيقة.',
specs:{'الحجم':'صحن عائلي','التسليم':'فوري خلال ٤٥ دقيقة','التحضير':'يوم الطلب'},ratings:[]},
{id:'p24',store:'s5',name:'تنسيق طاولة ضيافة كاملة (خدمة ميدانية)',cat:'تنسيق مناسبات',ptype:'field',price:850,off:0,stock:4,sold:23,rt:4.9,rc:9,imgs:['/dameen/img/e44feac627da.jpg'],
desc:'خدمة تنسيق ميداني لطاولة المناسبة: خلفية قماش، تنسيق ورد طبيعي، أدوات تقديم وإضاءة هادئة. فريق المتجر يركّب قبل المناسبة ويفكّ بعدها — بلا بوليصة شحن تجاري، ومع حجز موعد مسبق ومشاركة موقع المناسبة.',
specs:{'الخدمة':'تركيب + فك','المدة':'حتى ٦ ساعات','الحجز':'موعد مسبق إلزامي'},ratings:[]},
{id:'p25',store:'s9',name:'سماعة ألعاب لاسلكية «صقر برو»',cat:'أجهزة وملحقات',ptype:'std',fragile:true,price:349,off:10,stock:14,sold:167,rt:4.8,rc:38,imgs:['/dameen/img/headset1.jpg','/dameen/img/headset2.jpg'],vids:[{src:'https://media.w3.org/2010/05/sintel/trailer.mp4',dur:52}],
desc:'سماعة ألعاب لاسلكية بتقنية صوت محيطي ٧٫١ افتراضي وبطارية تدوم ٤٠ ساعة متواصلة، مع مايك عازل للضوضاء بإلغاء بيئي وإضاءة RGB قابلة للتخصيص من التطبيق. تُشحن بتغليف حماية خاص لأنها من الأجهزة القابلة للكسر، وتشمل وسادتين احتياطيتين وحمّال مغناطيسي.',
specs:{'الاتصال':'لاسلكي ٢٫٤ جيجا + بلوتوث ٥٫٣','البطارية':'٤٠ ساعة','الصوت':'محيطي ٧٫١ افتراضي','الوزن':'٣١٢ جم'},ratings:[{by:'0500000001',name:'نورة',stars:5,txt:'خفيفة على الرأس والصوت غامر، وصلت بتغليف حماية ممتاز.',at:Date.now()-864e5*3}]},
{id:'p26',store:'s9',name:'ذراع تحكم احترافي «نمر»',cat:'أجهزة وملحقات',ptype:'std',price:189,off:0,stock:26,sold:241,rt:4.7,rc:52,imgs:['/dameen/img/controller1.jpg','/dameen/img/controller2.jpg'],
desc:'ذراع تحكم احترافي بأزرار ميكانيكية قابلة للبرمجة وعصا مقاومة للانحراف بدقة عالية، مع أذرع خلفية قابلة للتبديل ووضعيات إعدادات محفوظة لثلاث ألعاب. مناسب لمنصات PC والأندرويد، ويأتي بحافظة صلبة تناسب السفر.',
specs:{'التوافق':'PC / أندرويد','الأزرار':'٨ ميكانيكية قابلة للبرمجة','البطارية':'٢٠ ساعة'},ratings:[]},
{id:'p27',store:'s9',name:'جهاز ألعاب محمول «وهج X»',cat:'أجهزة وملحقات',ptype:'std',fragile:true,price:1499,off:5,stock:6,sold:87,rt:4.9,rc:24,imgs:['/dameen/img/04fd480125c5.jpg','/dameen/img/console.png'],
desc:'جهاز ألعاب محمول بشاشة أموليد ٧ بوصة بمعدل تحديث ١٤٤ هرتز ومعالج ثماني النوى مخصص للألعاب، يشغّل مكتبتك الرقمية بالكامل مع دعم البث السحابي. يُشحن بصندوق مقوّى بعلامة قابل للكسر وتغليف ممتص للصدمات + تأمين شحن إضافي.',
specs:{'الشاشة':'أموليد ٧ بوصة / ١٤٤ هرتز','التخزين':'٥١٢ جيجابايت','البطارية':'حتى ٨ ساعات لعب'},ratings:[]},
{id:'p28',store:'s9',name:'لوحة مفاتيح ميكانيكية RGB «قوس»',cat:'أجهزة وملحقات',ptype:'std',price:279,off:0,stock:18,sold:198,rt:4.6,rc:41,imgs:['/dameen/img/e28496a66dff.jpg','/dameen/img/keyboard.jpg'],
desc:'لوحة مفاتيح ميكانيكية بمفاتيح حمراء قابلة للتبديل الساخن وإضاءة RGB لكل مفتاح مع ٢٢ نمط إضاءة جاهز، وهيكل ألمنيوم مختوم مقاوم للغبار. تدعم الاتصال السلكي ولاسلكي مع ثلاث أجهزة في آن واحد، وتشمل مسند معصم مغناطيسي.',
specs:{'المفاتيح':'حمراء قابلة للتبديل','الاتصال':'سلكي + ٢٫٤ جيجا + بلوتوث','الإضاءة':'RGB لكل مفتاح'},ratings:[]},
{id:'p29',store:'s10',name:'كود لعبة «سباق الرمال ٥» الرقمي',cat:'ألعاب رقمية وأكواد',ptype:'digital',digi:{kind:'code',val:'DRR5-9K2M-X7Q4-88FV'},price:149,off:15,stock:99,sold:512,rt:4.8,rc:117,imgs:['/dameen/img/gcode.jpg'],
desc:'كود رقمي أصلي للعبة سباق الرمال ٥ كاملة الإصدار القياسي، يُسلّم فور إتمام الدفع في مكتبتك الرقمية دون أي شحن أو انتظار. الكود صالح للتفعيل مرة واحدة على حسابك، ويعمل بكل اللغات بما فيها العربية.',
specs:{'النوع':'كود تفعيل رقمي','التسليم':'فوري بعد الدفع','الصلاحية':'تفعيل واحد'},ratings:[]},
{id:'p30',store:'s10',name:'اشتراك ١٢ شهراً بلس جيمنج',cat:'اشتراكات رقمية',ptype:'digital',digi:{kind:'code',val:'PSN-4T8B-22LD-QW90'},price:235,off:0,stock:99,sold:368,rt:4.9,rc:88,imgs:['/dameen/img/gsub.jpg'],
desc:'كود اشتراك ١٢ شهراً كاملة في خدمة بلس جيمنج مع ألعاب شهرية مجانية وخصومات حصرية على المتجر الرقمي. يصل الكود لحظة الدفع في مكتبتك الرقمية عبر رابط مؤقت آمن، ويفعّل على حسابك بثلاث خطوات دون بطاقة.',
specs:{'المدة':'١٢ شهراً','المنطقة':'السعودية والخليج','التسليم':'فوري بعد الدفع'},ratings:[]},
{id:'p31',store:'s10',name:'كتاب إلكتروني «احترف صناعة الألعاب» PDF',cat:'كتب وثيمات رقمية',ptype:'digital',digi:{kind:'file',val:'game-dev-master-ar.pdf',size:'٤٫٢ م.ب'},price:45,off:0,stock:99,sold:156,rt:4.7,rc:33,imgs:['/dameen/img/gbook.jpg'],
desc:'كتاب إلكتروني عربي شامل من ٣٢٠ صفحة يأخذك من أساسيات محركات الألعاب إلى نشر أول لعبة لك على المتاجر، مع أمثلة كود قابلة للتنزيل ومشاريع عملية موزعة على كل فصل. يُسلّم فور الدفع عبر رابط مؤقت آمن، وتبقى نسخته دائمة في مكتبتك.',
specs:{'الصيغة':'PDF','الصفحات':'٣٢٠ صفحة','اللغة':'العربية'},ratings:[]},
{id:'p32',store:'s10',name:'حزمة ثيمات «نيون نايت» (١٢ واجهة)',cat:'كتب وثيمات رقمية',ptype:'digital',digi:{kind:'file',val:'neon-night-themes.zip',size:'١٨ م.ب'},price:25,off:0,stock:99,sold:203,rt:4.6,rc:47,imgs:['/dameen/img/1f1482a46bbb.jpg'],
desc:'حزمة من ١٢ ثيم واجهة نيون بتدرجات ليلية متناسقة للأجهزة وسطح المكتب، تشمل خلفيات وأيقونات مؤشرات وأصوات تنبيه مطابقة. ملف واحد مضغوط يُسلّم فوراً بعد الدفع، مع دليل تركيب مصور بالعربية داخل الحزمة.',
specs:{'المحتوى':'١٢ ثيم متكامل','الصيغة':'ZIP','التوافق':'ويندوز / ماك / أندرويد'},ratings:[]}];

export const NOW=Date.now();

export const USERS:any={
'0500000001':{name:'نورة العبدالله',role:'customer',pass:'1234',pts:340,bal:240,since:NOW-864e5*210,
ptsLog:[{t:'تحرير طلب #١٠٢١',v:29,at:NOW-864e5*6},{t:'تقييم تجربتك',v:10,at:NOW-864e5*6},{t:'استبدال في السلة',v:-100,at:NOW-864e5*9},{t:'تحرير طلب #١٠١٨',v:24,at:NOW-864e5*12}],
favs:['p1','p8'],addrs:[{t:'المنزل',a:'الرياض، حي الياسمين، شارع الأمير سلطان، مبنى ١٢',def:true},{t:'العمل',a:'الرياض، طريق الملك فهد، برج المملكة، الدور ١٤'}],
notif:{ord:true,off:true,dis:true,rev:true},hidePhone:false,email:'noura@mail.com'},
'0500000002':{name:'ريم الدوسري',role:'merchant',pass:'1234',store:'s1',since:NOW-864e5*400,notif:{ord:true,dis:true},email:'rima@dafi.sa'},
'0500000003':{name:'فهد العتيبي',role:'admin',pass:'1234',since:NOW-864e5*500,notif:{dis:true},email:'fahd@dameen.sa'},
'0500000004':{name:'سارة الحربي',role:'merchant',pass:'1234',store:'s2',since:NOW-864e5*300},
'0500000005':{name:'ماجد القحطاني',role:'merchant',pass:'1234',store:'s3',since:NOW-864e5*380},
'0500000006':{name:'حصة الشمري',role:'merchant',pass:'1234',store:'s4',since:NOW-864e5*250},
'0500000007':{name:'عبدالله الزهراني',role:'merchant',pass:'1234',store:'s5',since:NOW-864e5*180},
'0500000008':{name:'منال الغامدي',role:'merchant',pass:'1234',store:'s6',since:NOW-864e5*150},
'0500000009':{name:'تركي الثقفي',role:'merchant',pass:'1234',store:'s7',since:NOW-864e5*20},
'0500000010':{name:'أم خالد السالم',role:'merchant',pass:'1234',store:'s8',since:NOW-864e5*90},
'0500000011':{name:'فيصل الحربي',role:'merchant',pass:'1234',store:'s9',since:NOW-864e5*120,notif:{ord:true,dis:true}},
'0500000012':{name:'لينا العسيري',role:'merchant',pass:'1234',store:'s10',since:NOW-864e5*100,notif:{ord:true,dis:true}},
'0500000013':{name:'خالد المطيري',role:'staff',pass:'1234',since:NOW-864e5*30,notif:{ord:true,dis:true},email:'khaled.m@dameen.sa',staffTitle:'مشرف متاجر ونزاعات'}};

export const DB:any={
notifs:[
{to:'0500000001',ic:'🚚',t:'طلبك في الطريق',b:'مزرعة الواحة شحنت طلبك #١٠٢٢',at:NOW-36e5*5,read:false,go:['orders']},
{to:'0500000001',ic:'⏳',t:'نافذة الحماية بدأت',b:'بقي أقل من ٨ دقائق لتحرير تلقائي لطلب #١٠٢٣',at:NOW-6e5,read:false,go:['orders']},
{to:'0500000001',ic:'🎁',t:'عرض من قسم الأزياء',b:'خصومات تصل إلى ٢٠٪ على العبايات',at:NOW-864e5,read:true,go:['section','fashion']}],
aRevenue:1268.75,
revMonths:[{m:'يونيو',v:186},{m:'يوليو',v:212},{m:'أغسطس',v:254},{m:'سبتمبر',v:301},{m:'أكتوبر',v:316}],
storeWallets:{s1:4820.5,s2:2160,s3:9130.25,s4:1540,s5:3310,s6:2980,s7:0,s9:2760,s10:4180},
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
{r:'customer',t:'طلبت البوكس باللون الأخضر الزيتي كما في الصورة ووصل كحلي غامق تماماً، الفرق واضح جداً.',at:NOW-864e5*11+5e5,img:'/dameen/img/wbox.jpg'},
{r:'merchant',t:'نعتذر عن الخطأ، يبدو أنه التباس في اللون عند التغليف. مستعدون لاستبدالها أو استرجاع المبلغ حسب ما تقرر الإدارة.',at:NOW-864e5*11+9e5},
{r:'sys',t:'أصدرت الإدارة حكمها: استرجاع كامل المبلغ للعميلة + تحذير للمتجر بضبط مطابقة الألوان.',at:NOW-864e5*10}]},
{id:'d1',order:1024,store:'s4',customer:'0500000001',subject:'المنتج تالف',openedAt:NOW-864e5+36e5,status:'open',ruling:null,
messages:[
{r:'sys',t:'فتحت العميلة نزاعاً على الطلب #١٠٢٤ (متجر بيت السدو) بسبب: المنتج تالف',at:NOW-864e5+36e5},
{r:'customer',t:'المفرش وصل بشد واضح عند أحد الأطراف مع خيط مقطوع، الضرر ظاهر من أول نظرة. مرفق صور الوضع عند الوصول.',at:NOW-864e5+36e5+3e5,img:'/dameen/img/torn.jpg'},
{r:'merchant',t:'وعليكم السلام، نعتذر جداً عما وصلك. راجعنا تقرير الجودة قبل الشحن وكان سليماً، ويحتمل أن يكون الضرر من النقل. نرجو احتساب صور زاوية آخر للتأكد.',at:NOW-864e5+36e5+7e5}]}],
coupons:{DAMIN10:{type:'pct',v:10,max:50,store:'all',min:0,uses:0},SAVE20:{type:'pct',v:20,max:80,store:'all',min:200,uses:14},DAFI15:{type:'pct',v:15,max:60,store:'s1',min:150,uses:37},BYTE10:{type:'pct',v:10,max:30,store:'s10',min:30,uses:9}},
ptsVal:0.1,freeDlPts:250,aPtsWallet:0,ptsFunding:[],logiWallet:418.6,vat:527.4,
reqs:[
{id:'rq-101',kind:'store',own:'هند الشهري',store:'عطور تلال الطائف',email:'hind@talal.sa',phone:'0501122334',cr:'1010456789',iban:'SA0380000000608010167519',sec:'fashion',at:NOW-864e5*2,status:'pending'},
{id:'rq-102',kind:'admin',own:'خالد المطيري',email:'khaled.m@dameen.sa',phone:'0505544332',role:'مشرف تحكيم ونزاعات',code:'DMN-2026',at:NOW-36e5*30,status:'pending'}]};

export let MED:any={imgs:6,vids:2,secs:60,stores:{}};

export const medOf=s=>Object.assign({},MED,MED.stores[s.id]||{});

export let IMP:any={total:0,n:0,users:{},stores:{}};

export const IMP_STEP=0.5;

export const durTxt=s=>{s=Math.max(0,Math.round(s||0));return ar(Math.floor(s/60))+':'+ar(String(s%60).padStart(2,'0'))};

export const tempTxt=p=>p.temp==='chilled'?'🧊 مبرد':p.temp==='hot'?'🔥 يُسلَّم ساخناً':'🌡️ عادي';

export function impSeed(){let n=0;const users={},stores={};
DB.orders.forEach(o=>{const ok=o.groups.filter(g=>g.status!=='refunded');
if(ok.length){n++;users[o.customer]=r2((users[o.customer]||0)+IMP_STEP);
ok.forEach(g=>{stores[g.store]=r2((stores[g.store]||0)+IMP_STEP)})}});
IMP={total:r2(n*IMP_STEP),n,users,stores};}

export function impAnim(){const el=$('#impnum');if(!el)return;const target=IMP.total||0;const t0=performance.now();
const stepFn=t=>{const k=Math.min(1,(t-t0)/1400);el.textContent=ard(r2(target*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(stepFn)};
requestAnimationFrame(stepFn);}

export function impactBlock(){return `<button class="impbar" type="button" onclick="impInfo()" title="اضغط لعرض تفاصيل العدّاد المجتمعي">
<span class="impstar">🌟</span>
<span class="impmain"><span class="implb">🌟 العدّاد المجتمعي الشفاف — أثر ضمين</span>
<span class="impval"><b id="impnum">${ard(IMP.total)}</b><small>ر.س معتمدة لأعمال الخير</small></span></span>
<span class="impsep"></span>
<span class="impmeta"><span>من <b>${ar(IMP.n)}</b> عملية شراء ناجحة عبر ضمين</span><span>اقتطاع <b>٠٫٥٠ ر.س</b> عن كل عملية — لا من العميل ولا التاجر</span></span>
<span class="impq">؟</span>
</button>`;}

export function vidFail(v){try{v.style.display='none';v.insertAdjacentHTML('afterend','<div class="verr">🎬 تعذّر تشغيل المقطع من مصدره — تأكد من الرابط أو جرّب مقطعاً آخر</div>')}catch(e){}}

export function pvidsBlock(p){if(!p.vids||!p.vids.length)return '';
return `<div class="pvids"><b>🎬 مقاطع ترويجية من المتجر</b>
<div class="vrail">${p.vids.map((v,vi)=>`<div class="mcard" onclick="playVid('${p.id}','${esc(v.src)}',${+v.dur||0})">${imgTag(p.imgs[0],'',p.name)}<span class="play">▶</span><span class="vtag">🎬 ${v.dur?durTxt(v.dur):'مقطع '+ar(vi+1)}</span><div class="mcap"><b>مقطع ${ar(vi+1)}</b><small>${money(eff(p))}</small></div></div>`).join('')}</div></div>`;}

export const ptsVal=()=>DB.ptsVal||0.1;

export const fdPts=()=>DB.freeDlPts||250;

export const P=id=>PRODUCTS.find(p=>p.id===id);

export const eff=p=>p.off?r2(p.price*(1-p.off/100)):p.price;

export const stOK=s=>!s.susp;

export const storeOwner=id=>{const s=ST(id);return s?USERS[s.owner]:null};

export const secOf=id=>{const s=ST(id);return s?SEC(s.sec):SECTIONS[0]};

export const CITIES=['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الأحساء','الطائف','بريدة','أبها','تبوك'];

export const CITY_DL=(a,b)=>a===b?12:22;

export const PTI=p=>({chilled:'🧊 توصيل مبرد',instant:'🛵 توصيل فوري',field:'🎪 خدمة ميدانية',digital:'⚡ رقمي فوري'}[p.ptype]||'');

export function shipQuote(items,st,city,fd){
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
}

export const COURIERS={std:['OTO Express','Torod Shipping','سمسا عبر OTO'],chilled:['OTO Fresh — سلسلة التبريد','Torod Cooler المتعاقدة'],instant:['Torod Now — مندوب فوري','مرسول فوري']};

export function mkLogi(mode,seed){
const cs=COURIERS[mode]||COURIERS.std;
const courier=cs[hash(String(seed))%cs.length];
const wb='WB-'+(100000+hash('wb'+seed)%899999);
return{wb,courier,mode,events:[{t:'أُصدرت بوليصة الشحن آلياً عبر الربط اللوجستي ('+courier+')',at:Date.now()},{t:'أُرسل طلب استلام (Pickup Request) للمندوب',at:Date.now()+1}]}
}

export const BYPASS_WORDS=['واتساب','واتس اب','واتس','جوال','تحويل','حساب خارجي','رقمي','رقمك','رقم الهاتف','هاتفي','سناب','سناب شات','انستقرام','انستغرام','تويتر','تيليجرام','تليجرام','ايميل','بريد إلكتروني','stc pay','stcpay','حوالة','كاش خارجي'];

export function chatGuard(txt){
const t=String(txt||'');
if(/(https?:\/\/|www\.|\S+\.(com|net|org|io|me|co)(\s|$|\/))/i.test(t))return{ok:false,why:'رابط خارجي'};
const digits=t.replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[\s\-–—ـ.,_/]/g,'');
if(/(05\d{8}|9665\d{8}|009665\d{8}|\d{9,})/.test(digits))return{ok:false,why:'رقم جوال'};
const norm=t.replace(/[أإآ]/g,'ا').toLowerCase();
for(const w of BYPASS_WORDS){if(norm.includes(w.replace(/[أإآ]/g,'ا').toLowerCase()))return{ok:false,why:'مصطلح تواصل خارجي'}}
return{ok:true};
}

/* مطاوعات MED/IMP — إعادة الإسناد تحدث داخل core فقط (روابط الاستيراد للقراءة) */
export function setMED(v){MED=v}
export function setIMP(v){IMP=v}
export const getMED=()=>MED
export const getIMP=()=>IMP

/* دالة حفظ تُضبط من store — impAdd/impRefund في الأصل تستدعيان appSave المعرفة لاحقاً */
export const DSAVE={fn:()=>{}}
