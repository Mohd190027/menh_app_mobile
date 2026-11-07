/* لقطة محدثة للاستوديو بعد تحسين بطاقة المقطع + لقطة جوال موسعة للشريط */
const { chromium } = require('playwright');
(async()=>{
const browser=await chromium.launch();
{
 const ctx=await browser.newContext({viewport:{width:1280,height:940}});
 const pg=await ctx.newPage();
 await pg.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await pg.click('button:has-text("تسجيل الدخول")');
 await pg.click('button:has-text("🏪 تاجر")');
 await pg.waitForSelector('h1:has-text("لوحة تحكم")');
 await pg.click('button:has-text("🧺 المنتجات")');
 await pg.click('button:has-text("＋ منتج جديد")');
 await pg.waitForSelector('.mstudio');
 await pg.click('button:has-text("🎲 صورة تلقائية")');
 await pg.click('button:has-text("🎲 صورة تلقائية")');
 await pg.fill('#mv-url','https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4');
 await pg.click('button:has-text("＋ إضافة المقطع")');
 await pg.waitForSelector('.msvcard');
 await pg.waitForTimeout(4200);
 const el=await pg.$('.mstudio');
 await el.screenshot({path:'/tmp/render/z-media-form2.png'});
 await ctx.close();
}
{
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const pg=await ctx.newPage();
 await pg.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await pg.waitForTimeout(1800);
 const bar=await pg.$('.impbar');
 await bar.screenshot({path:'/tmp/render/z-impact-mobile2.png'});
 await ctx.close();
}
console.log('SHOTS OK');
await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
