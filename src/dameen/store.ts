'use client';
/* ضمين — store.ts
 * الحالة العالمية + الراووتر + النوافذ + الحفظ — منقولة حرفياً من dameen.js
 * (السطور ٣١٤-٣١٨، ٣٢٠-٣٤٥، ٦٤٥-٦٤٦، ٦٢٨-٦٣٢، ٣١٠٤-٣١١٧) مع استبدال إعادة البناء عبر innerHTML
 * بنظام تزامن (ticks) يُعيد React بناء الواجهة عند كل تغيير — نفس دلالات الأصل تماماً:
 * كل استدعاء render() = إعادة بناء كاملة (remount) كما يفعل innerHTML في الأصل.
 */
import { useSyncExternalStore } from 'react';
import { $, USERS, STORES, P, ST, DB, toast, impSeed, setMED, setIMP, getMED, getIMP, r2, IMP, IMP_STEP } from './core';
import { openAuth } from './auth';

/* ================= الحالة العالمية (حرفياً من السطر ٣١٤) — بتعليق any لتفادي ضوضاء تضييق الأنواع ================= */
export let SES:any=null,VIEW:any={page:'home'},CART:any=[],GFav:any=[],CK:any={step:0,addr:0,pay:'mada'},CPN:any=null,PTS:any=0,RATE:any={stars:0},COMP:any={sub:'damaged'},EVP:any=[],FREE_DL:any=false;
export let LASTSEC:any=null,ASTT:any='stores';
/* متغيرات مبعثرة في الأصل (٧٩٢، ٨٧٥، ١٥٩٩، ١٦٨٦، ٢١٥٣، ٢٢٨٥، ٢٢٧٤) */
export let QTY:any=1,PANS:any={},OCHAT:any=null,ORATE:any={stars:0,gi:0,oid:0},MSPID:any=null,MIMGS:any=[],MVIDS:any=[],MPID:any=null,MPQ:any=[],MPQOPEN:any=false;
/* السطر ٤٥٣ + ١٧٤٦ */
export let AUTH:any={tab:'login',reg:'customer',sec:null,gname:'',gemail:''},REQDOC:any=null,REJ:any=null,CATDEL:any=null;
export const COMPS={damaged:'المنتج وصل تالفاً',notmatch:'لا يطابق الوصف',missing:'عناصر ناقصة',late:'تأخر شديد في الوصول',other:'سبب آخر'};

export const me=()=>SES?USERS[SES.phone]:null;
/* روابط الاستيراد للقراءة فقط — والأصل يعيد إسناد هذه المتغيرات من دواله المنتشرة،
 * لذا توفر store مطاوعات setX() لكل إسناد خارجي (نفس أثر X=... في الأصل). */
export function setSES(v){SES=v}
export function setVIEW(v){VIEW=v}
export function setCART(v){CART=v}
export function setGFav(v){GFav=v}
export function setCK(v){CK=v}
export function setCPN(v){CPN=v}
export function setPTS(v){PTS=v}
export function setQTY(v){QTY=v}
export function setPANS(v){PANS=v}
export function setRATE(v){RATE=v}
export function setCOMP(v){COMP=v}
export function setEVP(v){EVP=v}
export function setFREE_DL(v){FREE_DL=v}
export function setOCHAT(v){OCHAT=v}
export function setORATE(v){ORATE=v}
export function setMSPID(v){MSPID=v}
export function setMIMGS(v){MIMGS=v}
export function setMVIDS(v){MVIDS=v}
export function setMPID(v){MPID=v}
export function setMPQ(v){MPQ=v}
export function setMPQOPEN(v){MPQOPEN=v}
export function setREQDOC(v){REQDOC=v}
export function setAUTH(v){AUTH=v}
export function setREJ(v){REJ=v}
export function setCATDEL(v){CATDEL=v}
export function setASTT(v){ASTT=v}
export function setLASTSEC(v){LASTSEC=v}
export const isFav=pid=>{if(!SES)return GFav.includes(pid);const u=me();return u&&u.favs&&u.favs.includes(pid)};
export const cartCount=()=>CART.reduce((a,c)=>a+c.qty,0);
/* custCity — السطر ٢٧٢ حرفياً */
export const custCity=()=>{const u=me();if(u&&u.addrs&&u.addrs.length){let i=(CK.addr>=0&&u.addrs[CK.addr])?CK.addr:u.addrs.findIndex(a=>a.def);if(i<0)i=0;return(u.addrs[i].a.split('،')[0]||'').trim()||'الرياض'}return 'الرياض'};
/* myStore — السطر ٢٠٨٩ حرفياً */
export const myStore=()=>ST(SES.store);

/* ================= نظام التزامن (ticks) ================= */
let appTick=0,topTick=0,modalTick=0;
const appSubs=new Set<()=>void>(),topSubs=new Set<()=>void>(),modalSubs=new Set<()=>void>();
const uiTicks:any={},uiSubs:any={};
const sub=(set,fn)=>{set.add(fn);return()=>{set.delete(fn)}};
export function useAppTick(){return useSyncExternalStore(fn=>sub(appSubs,fn),()=>appTick,()=>0)}
export function useTopTick(){return useSyncExternalStore(fn=>sub(topSubs,fn),()=>topTick,()=>0)}
export function useModalTick(){return useSyncExternalStore(fn=>sub(modalSubs,fn),()=>modalTick,()=>0)}
export function useUI(name){return useSyncExternalStore(fn=>{const s=(uiSubs[name]=uiSubs[name]||new Set());s.add(fn);return()=>{s.delete(fn)}},()=>uiTicks[name]||0,()=>0)}
export function bumpUI(name){uiTicks[name]=(uiTicks[name]||0)+1;const s=uiSubs[name];if(s)s.forEach(f=>f())}
function commitApp(){appTick++;appSubs.forEach(f=>f())}
function commitTop(){topTick++;topSubs.forEach(f=>f())}

/* ================= التنقل (السطر ٣٢٠ حرفياً) ================= */
export function go(page:any,arg?:any){
if(page==='section'){VIEW={page:'section',sec:arg,cat:'الكل',q:''};LASTSEC=arg}
else if(page==='store')VIEW={page:'store',store:arg,q:'',scat:'الكل'};
else if(page==='product')VIEW={page:'product',pid:arg,gi:0,q:''};
else if(page==='search')VIEW={page:'search',q:arg};
else if(page==='a-hub')VIEW={page:'a-hub'};
else if(page==='a-over')VIEW={page:'a-hub'};
else if(page==='a-reqs'){VIEW={page:'a-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='a-stores')VIEW={page:'a-stores',atab:arg||ASTT||'stores'}
else if(page==='e-reqs'){VIEW={page:'e-stores',atab:'reqs'};ASTT='reqs'}
else if(page==='e-stores')VIEW={page:'e-stores',atab:arg||ASTT||'stores'}
else{VIEW={page};if(page==='home')LASTSEC=null}
if(VIEW.page.startsWith('m-')&&(!SES||SES.role!=='merchant')){toast('سجّل دخولك بحساب تاجر أولاً','err');openAuth('merchant');return}
if(VIEW.page.startsWith('a-')&&(!SES||SES.role!=='admin')){toast('هذه الصفحة مخصصة للإدارة العليا','err');openAuth('admin');return}
if(VIEW.page.startsWith('e-')&&(!SES||SES.role!=='staff')){toast('هذه الصفحة مخصصة لموظفي الإدارة','err');openAuth('staff');return}
closeModal();render();window.scrollTo({top:0,behavior:'smooth'});
}
/* render (السطر ٣٣٧) — في الأصل يعيد بناء #app و#top ويحفظ؛ هنا: تزامن كامل */
export function render(){commitApp();commitTop();appSave()}
/* renderTop (السطر ٣٦٢) — الأصل يعيد بناء الشريط فقط */
export function renderTop(){commitTop()}

/* ================= الإشعارات (السطر ٦٢٨ حرفياً) ================= */

/* impAdd/impRefund (السطران ٢١٥-٢٢١ حرفياً — استدعاء appSave محلي هنا) */
export function impAdd(o){IMP.total=r2(IMP.total+IMP_STEP);IMP.n++;
IMP.users[o.customer]=r2((IMP.users[o.customer]||0)+IMP_STEP);
o.groups.forEach(g=>{if(g.status!=='refunded')IMP.stores[g.store]=r2((IMP.stores[g.store]||0)+IMP_STEP)});
appSave();}
export function impRefund(o,g){IMP.stores[g.store]=r2(Math.max(0,(IMP.stores[g.store]||0)-IMP_STEP));
if(o.groups.every(x=>x.status==='refunded')){IMP.total=r2(Math.max(0,IMP.total-IMP_STEP));IMP.n=Math.max(0,IMP.n-1);IMP.users[o.customer]=r2(Math.max(0,(IMP.users[o.customer]||0)-IMP_STEP))}
appSave();}
export function pushNotif(to,ic,t,b,goArgs){
DB.notifs.unshift({to,ic,t,b,at:Date.now(),read:false,go:goArgs||null});
if(SES&&SES.phone===to)toast(ic+' '+t);
renderTop();
}

/* ================= النوافذ (السطر ٦٤٥) ================= */
/* openModal في الأصل يحقن HTML داخل #modals — هنا يخزّن عقدة JSX ويعيد ModalHost بناءها.
 * node يُمرّر كعنصر مكوّن (مثل <AuthModal/>) ليعيد قراءة الحالة عند كل refresh. */
let modalNode=null,modalCls='';
export function openModal(node:any,cls?:any){modalNode=node;modalCls=cls||'';document.body.style.overflow='hidden';modalTick++;modalSubs.forEach(f=>f())}
export function closeModal(){modalNode=null;modalCls='';if(document.body)document.body.style.overflow='';modalTick++;modalSubs.forEach(f=>f())}
export function getModal(){return {node:modalNode,cls:modalCls}}

/* تشخيص مؤقت */
export function __dbg(){return {appTick,topTick,appSubs:appSubs.size,topSubs:topSubs.size,page:VIEW.page}}

/* ================= الحفظ والاستعادة (السطران ٣١٠٤-٣١١٧ حرفياً) ================= */
export function appSave(){try{localStorage.setItem('dameen_v1',JSON.stringify({ses:SES,cart:CART,gfav:GFav,med:getMED(),imp:getIMP()}))}catch(e){}}
export function appRestore(){try{
const d=JSON.parse(localStorage.getItem('dameen_v1')||'null');
if(d){
if(d.ses&&d.ses.phone&&USERS[d.ses.phone]&&!USERS[d.ses.phone].pend&&!USERS[d.ses.phone].rejected){
const u=USERS[d.ses.phone];SES={phone:d.ses.phone,role:u.role,store:u.store||null};
if(SES.role==='merchant'){const own=STORES.find(x=>x.owner===SES.phone);SES.store=own?own.id:SES.store}}
CART=(d.cart||[]).filter(c=>c&&P(c.pid)&&c.qty>0).map(c=>({pid:c.pid,qty:Math.min(c.qty,P(c.pid).stock),ans:c.ans||[]}));
GFav=(d.gfav||[]).filter(x=>x&&P(x));
if(d.med)setMED(Object.assign({imgs:6,vids:2,secs:60,stores:{}},d.med));
if(d.imp)setIMP(Object.assign({total:0,n:0,users:{},stores:{}},d.imp));
}
if(!d||!d.imp)impSeed();
}catch(e){}}
