/* بيانات ضمين — مولّدة آلياً من التطبيق الأصلي (extract-data.js + gen-data.js)
 * العوالم الأربعة + ١٠ متاجر + 32 منتجاً + حسابات التجربة + طلبات البذور */
export interface World { id: string; name: string; icon: string; color: string; winMin: number; win: string; desc: string; img: string; }
export interface Store { id: string; name: string; sec: string; owner: string; ownerName: string; color: string; cover: string; desc: string; rt: number; sales: number; susp: boolean; city: string; freeMin: number; }
export interface Product { id: string; store: string; name: string; cat: string; price: number; off: number; stock: number; sold: number; rt: number; rc: number; imgs: string[]; desc: string; digi: boolean; ptype: string; giftOk: boolean; }
export interface RegRequest { id: string; kind: 'store' | 'admin'; own: string; store: string; email: string; phone: string; cr: string; sec: string; status: 'pending' | 'approved' | 'rejected'; reason?: string; }
export interface Account { phone: string; name: string; role: 'customer' | 'merchant' | 'admin'; store: string | null; pts: number; bal: number; email: string; }
export interface SeedItem { pid: string; qty: number; }
export interface SeedOrder { id: string; customer: string; customerName: string; store: string; items: SeedItem[]; status: 'new' | 'shipped' | 'protected' | 'released' | 'refunded' | 'disputed'; atMin: number; receivedMin?: number; }
export interface CatInfo { n: string; comm: number; }

export const WORLDS: World[] = [
 {
  "id": "fashion",
  "name": "عالم الأزياء والجمال",
  "icon": "👗",
  "color": "#7A3B44",
  "winMin": 120,
  "win": "ساعتان",
  "desc": "عبايات وأزياء وعطور وعناية بلمسة محلية",
  "img": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f94d1cccea3.jpg"
 },
 {
  "id": "family",
  "name": "عالم المأكولات والضيافة",
  "icon": "🏡",
  "color": "#556636",
  "winMin": 30,
  "win": "٣٠ دقيقة",
  "desc": "عسل وتمور وأطباق مطابخ وحلويات طازجة",
  "img": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b2f1f08ffc64.png"
 },
 {
  "id": "deco",
  "name": "عالم الهدايا والديكور والمناسبات",
  "icon": "🎁",
  "color": "#A45A3A",
  "winMin": 1440,
  "win": "٢٤ ساعة",
  "desc": "هدايا وديكور وتنسيق مناسبات ميداني",
  "img": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0dcd6b176ac1.jpg"
 },
 {
  "id": "gaming",
  "name": "عالم الألعاب والأجهزة والمنتجات الرقمية",
  "icon": "🎮",
  "color": "#50489E",
  "winMin": 180,
  "win": "٣ ساعات",
  "desc": "أجهزة ألعاب وملحقات وأصول رقمية بتسليم فوري",
  "img": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/68dae69f3198.webp"
 }
];

export const CATS: Record<string, CatInfo[]> = {
 "fashion": [
  {
   "n": "عبايات",
   "comm": 2.5
  },
  {
   "n": "أزياء",
   "comm": 2.5
  },
  {
   "n": "حقائب وعطور",
   "comm": 2.5
  },
  {
   "n": "العناية والجمال",
   "comm": 2.5
  }
 ],
 "family": [
  {
   "n": "عسل وتمور",
   "comm": 2.5
  },
  {
   "n": "ألبان ومخبوزات",
   "comm": 2.5
  },
  {
   "n": "حلويات وأطباق",
   "comm": 2.5
  },
  {
   "n": "سدو وحرف",
   "comm": 2.5
  }
 ],
 "deco": [
  {
   "n": "ديكور",
   "comm": 2.5
  },
  {
   "n": "هدايا",
   "comm": 2.5
  },
  {
   "n": "قهوة وضيافة",
   "comm": 2.5
  },
  {
   "n": "تنسيق مناسبات",
   "comm": 2.5
  }
 ],
 "gaming": [
  {
   "n": "أجهزة وملحقات",
   "comm": 3
  },
  {
   "n": "ألعاب رقمية وأكواد",
   "comm": 1.5
  },
  {
   "n": "اشتراكات رقمية",
   "comm": 1.5
  },
  {
   "n": "كتب وثيمات رقمية",
   "comm": 1
  }
 ]
};

export const STORES: Store[] = [
 {
  "id": "s1",
  "name": "دَفى العبايات",
  "sec": "fashion",
  "owner": "0500000002",
  "ownerName": "ريم الدوسري",
  "color": "#7A3B44",
  "cover": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=760&auto=format&fit=crop",
  "desc": "عبايات كتان وخامات فاخرة بخياطة سعودية متقنة",
  "rt": 4.8,
  "sales": 342,
  "susp": false,
  "city": "الرياض",
  "freeMin": 300
 },
 {
  "id": "s2",
  "name": "خيوط الغندورة",
  "sec": "fashion",
  "owner": "0500000004",
  "ownerName": "سارة الحربي",
  "color": "#96505E",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b79232a91370.jpg",
  "desc": "طرق بيتية وأزياء مطرزة يدوياً بخيوط ملونة",
  "rt": 4.6,
  "sales": 198,
  "susp": false,
  "city": "جدة",
  "freeMin": 350
 },
 {
  "id": "s3",
  "name": "مزرعة الواحة",
  "sec": "family",
  "owner": "0500000005",
  "ownerName": "ماجد القحطاني",
  "color": "#556636",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2626d093c49.jpg",
  "desc": "عسل سدر وتمور خلاص من مزارعنا مباشرة",
  "rt": 4.9,
  "sales": 521,
  "susp": false,
  "city": "الأحساء",
  "freeMin": 250
 },
 {
  "id": "s4",
  "name": "بيت السدو",
  "sec": "family",
  "owner": "0500000006",
  "ownerName": "حصة الشمري",
  "color": "#6B7A3F",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cfe35a802f4f.jpg",
  "desc": "منتجات سدو أصيلة منسوجة على النول التقليدي",
  "rt": 4.7,
  "sales": 87,
  "susp": false,
  "city": "بريدة",
  "freeMin": 0
 },
 {
  "id": "s5",
  "name": "لمسة ديكور",
  "sec": "deco",
  "owner": "0500000007",
  "ownerName": "عبدالله الزهراني",
  "color": "#A45A3A",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/11c491ea9778.jpg",
  "desc": "شموع ومباخر ومستلزمات منزل بأناقة هادئة",
  "rt": 4.5,
  "sales": 264,
  "susp": false,
  "city": "الطائف",
  "freeMin": 400
 },
 {
  "id": "s6",
  "name": "هدايا المعمور",
  "sec": "deco",
  "owner": "0500000008",
  "ownerName": "منال الغامدي",
  "color": "#B26640",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/98a1ab5d2183.jpg",
  "desc": "بوكسات هدايا مغلفة بفخامة تناسب كل مناسبة",
  "rt": 4.8,
  "sales": 173,
  "susp": false,
  "city": "الرياض",
  "freeMin": 0
 },
 {
  "id": "s7",
  "name": "فخار الطائف",
  "sec": "deco",
  "owner": "0500000009",
  "ownerName": "تركي الثقفي",
  "color": "#8F5B36",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9a3a0638140e.jpg",
  "desc": "فخاريات مدوّرة يدوياً من طين الطائف",
  "rt": 4.4,
  "sales": 12,
  "susp": false,
  "city": "الطائف",
  "freeMin": 0
 },
 {
  "id": "s8",
  "name": "مطبخ أم خالد",
  "sec": "family",
  "owner": "0500000010",
  "ownerName": "أم خالد السالم",
  "color": "#7C5A3A",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1c2383e2b42c.jpg",
  "desc": "طبخ بيتي سعودي — كيك مناسبات وورق عنب على أصولها",
  "rt": 4.7,
  "sales": 156,
  "susp": false,
  "city": "الرياض",
  "freeMin": 150
 },
 {
  "id": "s9",
  "name": "قيمز زون",
  "sec": "gaming",
  "owner": "0500000011",
  "ownerName": "فيصل الحربي",
  "color": "#50489E",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/28b3519cc57c.jpg",
  "desc": "أجهزة ألعاب وملحقات تقنية أصلية بضمان الوكيل — تغليف حماية خاص للأجهزة القابلة للكسر",
  "rt": 4.7,
  "sales": 214,
  "susp": false,
  "city": "الرياض",
  "freeMin": 500
 },
 {
  "id": "s10",
  "name": "بايت كود",
  "sec": "gaming",
  "owner": "0500000012",
  "ownerName": "لينا العسيري",
  "color": "#3D7B8C",
  "cover": "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8eac332529c2.png",
  "desc": "أكواد ألعاب واشتراكات رقمية وكتب إلكترونية وثيمات — تسليم فوري لحظة الدفع بلا شحن",
  "rt": 4.8,
  "sales": 342,
  "susp": false,
  "city": "جدة",
  "freeMin": 0
 }
];

export const PRODUCTS: Product[] = [
 {
  "id": "p1",
  "store": "s1",
  "name": "عباية كتان «نسمة»",
  "cat": "عبايات",
  "price": 349,
  "off": 15,
  "stock": 12,
  "sold": 214,
  "rt": 4.9,
  "rc": 86,
  "imgs": [
   "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=760&auto=format&fit=crop",
   "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=760&auto=format&fit=crop",
   "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=760&auto=format&fit=crop"
  ],
  "desc": "عباية كتان بخامة مصرية مريحة وقَصّة واسعة تناسب يومك كامل. تطريز يدوي دقيق على الأكمام يمن",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p2",
  "store": "s1",
  "name": "عباية حرير مطرزة «ليان»",
  "cat": "عبايات",
  "price": 520,
  "off": 0,
  "stock": 7,
  "sold": 97,
  "rt": 4.7,
  "rc": 41,
  "imgs": [
   "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=760&auto=format&fit=crop",
   "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=760&auto=format&fit=crop"
  ],
  "desc": "عباية مناسبات من الحرير الطبيعي بتطريز لؤلؤي على الصدر والأكمام. مناسبة للمناسبات المسائية",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p3",
  "store": "s1",
  "name": "طرحة شيفون مزدوجة",
  "cat": "عبايات",
  "price": 95,
  "off": 20,
  "stock": 30,
  "sold": 186,
  "rt": 4.6,
  "rc": 52,
  "imgs": [
   "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=760&auto=format&fit=crop"
  ],
  "desc": "طرحة شيفون بطبقتين لا تكشف ولا تنزلق، بخياطة مزدوجة تحفظ شكلها بعد الغسيل. متوفرة بعدة ألو",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p4",
  "store": "s2",
  "name": "طقم بيت قطني مطرز «دفء»",
  "cat": "أزياء",
  "price": 189,
  "off": 0,
  "stock": 15,
  "sold": 143,
  "rt": 4.6,
  "rc": 33,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/53aef9882d40.jpg",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b79232a91370.jpg"
  ],
  "desc": "طقم بيت من القطن المشغول بتطريز يدوي على الصدر. مريح للاستخدام اليومي والاستقبالات العائلي",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p5",
  "store": "s2",
  "name": "فستان سواريه مخمل «سهرة»",
  "cat": "أزياء",
  "price": 640,
  "off": 10,
  "stock": 4,
  "sold": 58,
  "rt": 4.8,
  "rc": 19,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a2ad882f2382.jpg"
  ],
  "desc": "فستان مخمل بقَصّة A كلاسيكية وأزرار لؤلؤية ظهرية. مثالي لحفلات الزواج والمناسبات المسائية،",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p6",
  "store": "s2",
  "name": "حقيبة يد جلد طبيعي",
  "cat": "حقائب وعطور",
  "price": 280,
  "off": 0,
  "stock": 9,
  "sold": 121,
  "rt": 4.8,
  "rc": 22,
  "imgs": [
   "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=760&auto=format&fit=crop"
  ],
  "desc": "حقيبة يد من الجلد الطبيعي المدبوغ نباتياً، تصنع يدوياً وتأتي برائحة الجلد الأصيلة. تتسع لل",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p7",
  "store": "s2",
  "name": "عطر عود ملكي ٥٠ مل",
  "cat": "حقائب وعطور",
  "price": 220,
  "off": 0,
  "stock": 18,
  "sold": 167,
  "rt": 4.7,
  "rc": 44,
  "imgs": [
   "https://images.unsplash.com/photo-1541643600914-78a08a3003d8?q=80&w=760&auto=format&fit=crop"
  ],
  "desc": "عطر زيتي مركّز بمزيج العود الكمبودي والورد الطائفي، ثبات يمتد لأكثر من ثماني ساعات. يأتي ف",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p8",
  "store": "s3",
  "name": "عسل سدر جبلي ٥٠٠ جم",
  "cat": "عسل وتمور",
  "price": 185,
  "off": 0,
  "stock": 26,
  "sold": 412,
  "rt": 4.9,
  "rc": 154,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2626d093c49.jpg",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7bd7eee784a6.jpg"
  ],
  "desc": "عسل سدر جبلي خام غير مبستر، يُقطف من مناحلنا في مرتفعات الجنوب مرة واحدة في السنة. قوامه ك",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p9",
  "store": "s3",
  "name": "تمر خلاص فاخر ١ كجم",
  "cat": "عسل وتمور",
  "price": 65,
  "off": 10,
  "stock": 40,
  "sold": 380,
  "rt": 4.8,
  "rc": 96,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cce49520b1e4.jpeg"
  ],
  "desc": "تمر خلاص مفضل بدرجة أولى، حبة كبيرة لينة بحلاوة متوازنة. يُنتقى حبة حبة ويُعبأ في علبة أني",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p10",
  "store": "s3",
  "name": "دبس تمر بلدي",
  "cat": "عسل وتمور",
  "price": 45,
  "off": 0,
  "stock": 22,
  "sold": 154,
  "rt": 4.6,
  "rc": 38,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/271fff8e23ab.jpeg"
  ],
  "desc": "دبس تمر بلدي مطبوخ على الحطب دون أي إضافات أو سكريات. كثيف بلون العنبر، مثالي مع الفطور ال",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p11",
  "store": "s3",
  "name": "سلة الواحة (عسل + تمر + دبس)",
  "cat": "عسل وتمور",
  "price": 265,
  "off": 12,
  "stock": 14,
  "sold": 98,
  "rt": 4.9,
  "rc": 27,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/650709575035.jpg"
  ],
  "desc": "سلة خشبية تجمع عسل سدر ٢٥٠ جم وتمر خلاص ٥٠٠ جم ودبس بلدي، مغلفة بجبينة كتان وشريط. الهدية ",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p12",
  "store": "s4",
  "name": "مفرش سدو للطاولة",
  "cat": "سدو وحرف",
  "price": 420,
  "off": 0,
  "stock": 5,
  "sold": 64,
  "rt": 4.7,
  "rc": 29,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cfe35a802f4f.jpg"
  ],
  "desc": "مفرش منسوج على النول الأصلي بخيوط صوف ملونة بنقوش السدو النجدية. كل قطعة تستغرق أسبوعين من",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p13",
  "store": "s4",
  "name": "حزام سدو منسوج",
  "cat": "سدو وحرف",
  "price": 150,
  "off": 0,
  "stock": 8,
  "sold": 73,
  "rt": 4.5,
  "rc": 17,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/291826012a56.jpg"
  ],
  "desc": "حزام منسوج بخيوط السدو الملوّنة مع إبزيم نحاسي مصقول. قطعة تراثية عملية تلبس مع الثوب أو ك",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p14",
  "store": "s4",
  "name": "جبن قريش بلدي ٣٥٠ جم",
  "cat": "ألبان ومخبوزات",
  "price": 25,
  "off": 0,
  "stock": 20,
  "sold": 96,
  "rt": 4.6,
  "rc": 31,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ed876a628b49.jpg"
  ],
  "desc": "جبن قريش بلدي يُحضّر صباح كل يوم من حليب المزرعة، قوامه طري وملحه خفيف. يُسلّم مبرداً في ن",
  "digi": false,
  "ptype": "chilled",
  "giftOk": false
 },
 {
  "id": "p15",
  "store": "s4",
  "name": "خبز تميس بيتي (٤ حبات)",
  "cat": "ألبان ومخبوزات",
  "price": 12,
  "off": 0,
  "stock": 35,
  "sold": 640,
  "rt": 4.8,
  "rc": 203,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8792c1cd454c.jpg"
  ],
  "desc": "تميس بيتي يُخبز على التنور الحجري بعجين مخمّر ببطء. يخرج ساخناً مع الزبدة والعسل الأسود، و",
  "digi": false,
  "ptype": "instant",
  "giftOk": false
 },
 {
  "id": "p16",
  "store": "s5",
  "name": "شمعة ياسمين معطرة",
  "cat": "ديكور",
  "price": 65,
  "off": 0,
  "stock": 28,
  "sold": 231,
  "rt": 4.5,
  "rc": 47,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/11c491ea9778.jpg"
  ],
  "desc": "شمعة صويا معطرة برائحة الياسمين المسائي، فتيل قطني نظيف يحترق دون دخان. تعبئ المنزل بهدوء ",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p17",
  "store": "s5",
  "name": "مبخرة نحاسية مزخرفة",
  "cat": "ديكور",
  "price": 140,
  "off": 20,
  "stock": 11,
  "sold": 158,
  "rt": 4.7,
  "rc": 39,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/559a027cf1cb.jpg"
  ],
  "desc": "مبخرة نحاسية بنقش يدوي ومقبض حراري معزول. تأتي مع طبق فحم عازل وغطاء محفور يوزع الدخان بلط",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p18",
  "store": "s5",
  "name": "طقم فناجيل قهوة مذهّب (٦)",
  "cat": "قهوة وضيافة",
  "price": 195,
  "off": 0,
  "stock": 9,
  "sold": 129,
  "rt": 4.8,
  "rc": 26,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/285d08d3a5ca.jpg"
  ],
  "desc": "ستة فناجيل بورسلين بحافة مذهّبة مقاومة للاحتكاك، تصلح للقهوة والشاي. تصميم بقوارير رفيعة ي",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p19",
  "store": "s6",
  "name": "بوكس هدايا «شكراً» مخمل",
  "cat": "هدايا",
  "price": 240,
  "off": 0,
  "stock": 16,
  "sold": 174,
  "rt": 4.8,
  "rc": 31,
  "imgs": [
   "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=760&auto=format&fit=crop",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/98a1ab5d2183.jpg"
  ],
  "desc": "بوكس مخمل فارغ يضم ٤ علب داخلية و٣ بطاقات إهداء بألوان هادئة، يعاد تشكيله حسب المناسبة. ال",
  "digi": false,
  "ptype": "ship",
  "giftOk": true
 },
 {
  "id": "p20",
  "store": "s6",
  "name": "لوحة خط عربي مؤطرة «الفرج»",
  "cat": "هدايا",
  "price": 160,
  "off": 0,
  "stock": 7,
  "sold": 88,
  "rt": 4.6,
  "rc": 18,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ffebfbe70844.jpg"
  ],
  "desc": "لوحة خط ديواني بكلمة «الفرج» مرسومة يدوياً بالحبر الأسود على ورق مقوى عاجي، بإطار خشب طبيع",
  "digi": false,
  "ptype": "ship",
  "giftOk": true
 },
 {
  "id": "p21",
  "store": "s7",
  "name": "مزهرية فخار مزججة",
  "cat": "ديكور",
  "price": 110,
  "off": 0,
  "stock": 6,
  "sold": 12,
  "rt": 4.4,
  "rc": 5,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9a3a0638140e.jpg"
  ],
  "desc": "مزهرية فخارية مدوّرة على الدولاب ومزججة بطلاء لامع غير متكرر. كل قطعة فريدة بدرجة لونها، م",
  "digi": false,
  "ptype": "",
  "giftOk": false
 },
 {
  "id": "p22",
  "store": "s8",
  "name": "كيكة العيد بالكريمة (حساسة للحرارة)",
  "cat": "حلويات وأطباق",
  "price": 145,
  "off": 0,
  "stock": 6,
  "sold": 89,
  "rt": 4.8,
  "rc": 21,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1c2383e2b42c.jpg"
  ],
  "desc": "كيكة إسفنجية بطبقات الكريمة المخفوقة، تُخبز يوم الطلب وتُسلّم مبردة في صندوق حافظ للحرارة.",
  "digi": false,
  "ptype": "chilled",
  "giftOk": false
 },
 {
  "id": "p23",
  "store": "s8",
  "name": "صحن ورق عنب عائلي (طازج)",
  "cat": "حلويات وأطباق",
  "price": 55,
  "off": 0,
  "stock": 15,
  "sold": 132,
  "rt": 4.7,
  "rc": 30,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/991d8bb4c001.jpg"
  ],
  "desc": "ورق عنب بلدي ملفوف يدوياً ومطبوخ على أصوله مع لحم مفروم وأرز بسمتي. يُحضّر يوم الطلب ويُرس",
  "digi": false,
  "ptype": "instant",
  "giftOk": false
 },
 {
  "id": "p24",
  "store": "s5",
  "name": "تنسيق طاولة ضيافة كاملة (خدمة ميدانية)",
  "cat": "تنسيق مناسبات",
  "price": 850,
  "off": 0,
  "stock": 4,
  "sold": 23,
  "rt": 4.9,
  "rc": 9,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e44feac627da.jpg"
  ],
  "desc": "خدمة تنسيق ميداني لطاولة المناسبة: خلفية قماش، تنسيق ورد طبيعي، أدوات تقديم وإضاءة هادئة. ",
  "digi": false,
  "ptype": "field",
  "giftOk": false
 },
 {
  "id": "p25",
  "store": "s9",
  "name": "سماعة ألعاب لاسلكية «صقر برو»",
  "cat": "أجهزة وملحقات",
  "price": 349,
  "off": 10,
  "stock": 14,
  "sold": 167,
  "rt": 4.8,
  "rc": 38,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/308769bd3796.jpg",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2f9d9fe61140.jpg"
  ],
  "desc": "سماعة ألعاب لاسلكية بتقنية صوت محيطي ٧٫١ افتراضي وبطارية تدوم ٤٠ ساعة متواصلة، مع مايك عاز",
  "digi": false,
  "ptype": "std",
  "giftOk": false
 },
 {
  "id": "p26",
  "store": "s9",
  "name": "ذراع تحكم احترافي «نمر»",
  "cat": "أجهزة وملحقات",
  "price": 189,
  "off": 0,
  "stock": 26,
  "sold": 241,
  "rt": 4.7,
  "rc": 52,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e861dc8f6341.png",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5bd6ab3c9322.png"
  ],
  "desc": "ذراع تحكم احترافي بأزرار ميكانيكية قابلة للبرمجة وعصا مقاومة للانحراف بدقة عالية، مع أذرع ",
  "digi": false,
  "ptype": "std",
  "giftOk": false
 },
 {
  "id": "p27",
  "store": "s9",
  "name": "جهاز ألعاب محمول «وهج X»",
  "cat": "أجهزة وملحقات",
  "price": 1499,
  "off": 5,
  "stock": 6,
  "sold": 87,
  "rt": 4.9,
  "rc": 24,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/04fd480125c5.jpg",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ddc9c999a9d.jpg"
  ],
  "desc": "جهاز ألعاب محمول بشاشة أموليد ٧ بوصة بمعدل تحديث ١٤٤ هرتز ومعالج ثماني النوى مخصص للألعاب،",
  "digi": false,
  "ptype": "std",
  "giftOk": false
 },
 {
  "id": "p28",
  "store": "s9",
  "name": "لوحة مفاتيح ميكانيكية RGB «قوس»",
  "cat": "أجهزة وملحقات",
  "price": 279,
  "off": 0,
  "stock": 18,
  "sold": 198,
  "rt": 4.6,
  "rc": 41,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e28496a66dff.jpg",
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4e591ed2c48b.png"
  ],
  "desc": "لوحة مفاتيح ميكانيكية بمفاتيح حمراء قابلة للتبديل الساخن وإضاءة RGB لكل مفتاح مع ٢٢ نمط إض",
  "digi": false,
  "ptype": "std",
  "giftOk": false
 },
 {
  "id": "p29",
  "store": "s10",
  "name": "كود لعبة «سباق الرمال ٥» الرقمي",
  "cat": "ألعاب رقمية وأكواد",
  "price": 149,
  "off": 15,
  "stock": 99,
  "sold": 512,
  "rt": 4.8,
  "rc": 117,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2fb50ac6678a.jpg"
  ],
  "desc": "كود رقمي أصلي للعبة سباق الرمال ٥ كاملة الإصدار القياسي، يُسلّم فور إتمام الدفع في مكتبتك ",
  "digi": true,
  "ptype": "digital",
  "giftOk": false
 },
 {
  "id": "p30",
  "store": "s10",
  "name": "اشتراك ١٢ شهراً بلس جيمنج",
  "cat": "اشتراكات رقمية",
  "price": 235,
  "off": 0,
  "stock": 99,
  "sold": 368,
  "rt": 4.9,
  "rc": 88,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/160a70aabe91.jpg"
  ],
  "desc": "كود اشتراك ١٢ شهراً كاملة في خدمة بلس جيمنج مع ألعاب شهرية مجانية وخصومات حصرية على المتجر",
  "digi": true,
  "ptype": "digital",
  "giftOk": false
 },
 {
  "id": "p31",
  "store": "s10",
  "name": "كتاب إلكتروني «احترف صناعة الألعاب» PDF",
  "cat": "كتب وثيمات رقمية",
  "price": 45,
  "off": 0,
  "stock": 99,
  "sold": 156,
  "rt": 4.7,
  "rc": 33,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/06fdd0b9a622.jpg"
  ],
  "desc": "كتاب إلكتروني عربي شامل من ٣٢٠ صفحة يأخذك من أساسيات محركات الألعاب إلى نشر أول لعبة لك عل",
  "digi": true,
  "ptype": "digital",
  "giftOk": false
 },
 {
  "id": "p32",
  "store": "s10",
  "name": "حزمة ثيمات «نيون نايت» (١٢ واجهة)",
  "cat": "كتب وثيمات رقمية",
  "price": 25,
  "off": 0,
  "stock": 99,
  "sold": 203,
  "rt": 4.6,
  "rc": 47,
  "imgs": [
   "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1f1482a46bbb.jpg"
  ],
  "desc": "حزمة من ١٢ ثيم واجهة نيون بتدرجات ليلية متناسقة للأجهزة وسطح المكتب، تشمل خلفيات وأيقونات ",
  "digi": true,
  "ptype": "digital",
  "giftOk": false
 }
];

export const ACCOUNTS: Account[] = [
 {
  "phone": "0500000001",
  "name": "نورة العبدالله",
  "role": "customer",
  "store": null,
  "pts": 340,
  "bal": 240,
  "email": "noura@mail.com"
 },
 {
  "phone": "0500000002",
  "name": "ريم الدوسري",
  "role": "merchant",
  "store": "s1",
  "pts": 0,
  "bal": 0,
  "email": "rima@dafi.sa"
 },
 {
  "phone": "0500000003",
  "name": "فهد العتيبي",
  "role": "admin",
  "store": null,
  "pts": 0,
  "bal": 0,
  "email": "fahd@dameen.sa"
 }
];

export const DEMO_LOGINS = [
  { phone: '0500000001', label: '🛍️ تجربة كعميل', name: 'نورة العبدالله' },
  { phone: '0500000002', label: '🏪 تجربة كتاجر', name: 'ريم الدوسري' },
  { phone: '0500000003', label: '🛡️ تجربة كإدارة', name: 'فهد العتيبي' },
];

export const REQUESTS: RegRequest[] = [
 {
  "id": "rq-101",
  "kind": "store",
  "own": "هند الشهري",
  "store": "عطور تلال الطائف",
  "email": "hind@talal.sa",
  "phone": "0501122334",
  "cr": "1010456789",
  "sec": "fashion",
  "status": "pending"
 },
 {
  "id": "rq-102",
  "kind": "admin",
  "own": "خالد المطيري",
  "store": "",
  "email": "khaled.m@dameen.sa",
  "phone": "0505544332",
  "cr": "",
  "sec": "",
  "status": "pending"
 }
];

export const SEED_ORDERS: SeedOrder[] = [
 {
  "id": "DM-1018",
  "customer": "0500000001",
  "customerName": "نورة العبدالله",
  "store": "s6",
  "items": [
   {
    "pid": "p19",
    "qty": 1
   }
  ],
  "status": "refunded",
  "atMin": 8640
 },
 {
  "id": "DM-1021",
  "customer": "0500000001",
  "customerName": "نورة العبدالله",
  "store": "s1",
  "items": [
   {
    "pid": "p1",
    "qty": 1
   },
   {
    "pid": "p3",
    "qty": 1
   }
  ],
  "status": "released",
  "atMin": 5760
 },
 {
  "id": "DM-1022",
  "customer": "0500000001",
  "customerName": "نورة العبدالله",
  "store": "s3",
  "items": [
   {
    "pid": "p8",
    "qty": 1
   },
   {
    "pid": "p9",
    "qty": 2
   }
  ],
  "status": "shipped",
  "atMin": 1440
 },
 {
  "id": "DM-1023",
  "customer": "0500000001",
  "customerName": "نورة العبدالله",
  "store": "s5",
  "items": [
   {
    "pid": "p16",
    "qty": 2
   }
  ],
  "status": "protected",
  "atMin": 35,
  "receivedMin": 25
 },
 {
  "id": "DM-1024",
  "customer": "0500000001",
  "customerName": "نورة العبدالله",
  "store": "s4",
  "items": [
   {
    "pid": "p12",
    "qty": 1
   }
  ],
  "status": "disputed",
  "atMin": 2880
 },
 {
  "id": "DM-1025",
  "customer": "مها القحطاني",
  "customerName": "مها القحطاني",
  "store": "s1",
  "items": [
   {
    "pid": "p2",
    "qty": 1
   }
  ],
  "status": "protected",
  "atMin": 55,
  "receivedMin": 40
 },
 {
  "id": "DM-1026",
  "customer": "الجوهرة السبيعي",
  "customerName": "الجوهرة السبيعي",
  "store": "s1",
  "items": [
   {
    "pid": "p1",
    "qty": 2
   }
  ],
  "status": "released",
  "atMin": 4320
 },
 {
  "id": "DM-1027",
  "customer": "رنا العتيبي",
  "customerName": "رنا العتيبي",
  "store": "s1",
  "items": [
   {
    "pid": "p3",
    "qty": 1
   },
   {
    "pid": "p2",
    "qty": 1
   }
  ],
  "status": "shipped",
  "atMin": 600
 },
 {
  "id": "DM-1028",
  "customer": "غادة المطيري",
  "customerName": "غادة المطيري",
  "store": "s8",
  "items": [
   {
    "pid": "p22",
    "qty": 1
   }
  ],
  "status": "new",
  "atMin": 90
 },
 {
  "id": "DM-1029",
  "customer": "سلطان الحربي",
  "customerName": "سلطان الحربي",
  "store": "s9",
  "items": [
   {
    "pid": "p27",
    "qty": 1
   }
  ],
  "status": "protected",
  "atMin": 240,
  "receivedMin": 200
 }
];

export const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'تبوك', 'بريدة', 'حائل', 'جيزان'];

export const PAY_METHODS = [
  { id: 'mada', name: 'مدى', desc: 'خصم فوري آمن', badge: 'مدى' },
  { id: 'visa', name: 'فيزا', desc: 'بطاقات فيزا', badge: 'VISA' },
  { id: 'applepay', name: 'Apple Pay', desc: 'دفع بلمسة واحدة', badge: ' Pay' },
  { id: 'tabby', name: 'تابي', desc: 'قسّمها على ٤ دفعات بدون فوائد', badge: 'تابي' },
  { id: 'tamara', name: 'تمارا', desc: '٣ دفعات شهرية بدون فوائد', badge: 'تمارا' },
  { id: 'wallet', name: 'محفظة ضمين', desc: 'رصيدك المحفوظ لدى ضمين', badge: 'ضمين' },
];

export const FAQS = [
  { q: 'كيف تحمي ضمين أموالي؟', a: 'عند الطلب يُحجز مبلغك في خزنة ضمين المستقلة ولا يستلم التاجر شيئاً حتى تؤكد استلامك ورضاك، أو تنتهي نافذة الحماية تلقائياً.' },
  { q: 'متى يستلم التاجر مستحقاته؟', a: 'لحظة تأكيدك الاستلام أو انتهاء نافذة الحماية — يُحرر صافي المبلغ (٩٧٫٥٪) للتاجر وتذهب عمولة ضمين (٢٫٥٪) مباشرة للإدارة.' },
  { q: 'ماذا لو لم يعجبني المنتج؟', a: 'افتح نزاعاً خلال نافذة الحماية من صفحة طلباتك — فريق التحكيم الثلاثي يراجع الأدلة من الطرفين ويصدر حكمه بالاسترجاع أو التحرير.' },
  { q: 'هل الشحن مجاني؟', a: 'الشحن موحد ١٥ ر.س ويصبح مجانياً عندما يتجاوز طلبك ٢٠٠ ر.س، مع شحن آلي عبر شركاء OTO وTorod وتتبع لحظي لكل شحنة.' },
];

export const REVIEWS_POOL = [
  { name: 'نورة', stars: 5, txt: 'جودة ممتازة والتغليف كان أنيق جداً، وصل قبل الموعد المحدد. تجربة مريحة لأن مبلغي كان محجوزاً حتى استلمت.' },
  { name: 'عبدالعزيز', stars: 5, txt: 'تعامل سريع والمتجر متعاون عبر محادثة ضمين. أنصح بالتجربة.' },
  { name: 'الجوهرة', stars: 4, txt: 'المنتج مطابق للوصف تماماً. تأخر الشحن يوماً واحداً فقط لكن التتبع كان واضحاً.' },
  { name: 'ماجد', stars: 5, txt: 'أول مرة أشتري وأنا مطمئن — نظام الحجز يخلّيك تشتري بثقة والتحرير كان فورياً بعد التقييم.' },
  { name: 'أروى', stars: 4, txt: 'حلو ومرتب، والدفع بالتقسيط عبر تابي سهّل عليّ كثير.' },
  { name: 'فهد', stars: 5, txt: 'وصلني بحالة ممتازة والفاتورة مفصلة. ضمين فعلاً يحمي المشتري.' },
];

export const worldOf = (storeId: string): World => {
  const s = STORES.find(x => x.id === storeId);
  return WORLDS.find(w => w.id === (s ? s.sec : 'fashion')) || WORLDS[0];
};

/* أرقام عربية هندية */
export const ar = (n: number, frac = 0): string =>
  Number(n).toLocaleString('ar-EG', { maximumFractionDigits: frac === 0 ? 0 : 2 });
export const money = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return (Number.isInteger(v) ? ar(v) : ar(v, 2)) + ' ر.س';
};
