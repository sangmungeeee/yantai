const {chromium}=require(process.env.PW||'playwright');const fs=require('fs');
global.window={};require('/home/claude/yantai/data.js');const T=window.TRIP;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const DATES=["11/21 (토)","11/22 (일)","11/23 (월)","11/24 (화)"];
const tm=t=>String(t).padStart(5,"0");
function col(d){const ev=Object.values(T.events).filter(e=>e.day===d).sort((a,b)=>a.o-b.o);
 const title=(T.days["d"+d]?.title||"").replace(/->/g,"→");
 return `<section><header><span class="dn">${d+1}일차</span><span class="dt">${DATES[d]}</span></header><h2>${esc(title)}</h2><ol>`+
 ev.map(e=>{const mv=/이동$/.test(e.title);return `<li class="${mv?'mv':''}"><time>${esc(e.time)}${e.end?`<small>~${esc(e.end)}</small>`:""}</time><div><b>${esc(e.title)}</b>${e.zh?`<span class="zh">${esc(e.zh)}</span>`:""}${e.addr?`<p class="ad">${esc(e.addr).replace(/\n/g,"<br>")}</p>`:""}${e.memo?`<p class="me">${esc(e.memo).replace(/\n/g,"<br>")}</p>`:""}</div></li>`}).join("")+`</ol></section>`}
const css=`@font-face{font-family:P;src:url(file:///home/claude/yantai/fonts/Pretendard-SemiBold.woff);font-weight:600}
@font-face{font-family:P;src:url(file:///home/claude/yantai/fonts/Pretendard-Black.woff);font-weight:900}
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;height:297mm}
body{font-family:P,"Noto Sans CJK KR","Noto Sans CJK SC",sans-serif;color:#1f2a24;background:#fff;padding:11mm 10mm 9mm;font-size:var(--fs,9.5pt);line-height:1.38;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #1f6b47;padding-bottom:2.5mm;margin-bottom:4mm}
.top h1{font-weight:900;font-size:18pt;letter-spacing:-.5px}.top h1 i{color:#e0453a;font-style:normal}
.top span{font-size:9pt;color:#5d6b63}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm;height:calc(297mm - 11mm - 9mm - 14mm)}
section{border:1px solid #d6e3db;border-radius:3mm;padding:3.5mm 3.5mm 2mm;overflow:hidden;background:#fbfdfc}
header{display:flex;gap:2mm;align-items:baseline}
.dn{background:#1f6b47;color:#fff;font-weight:900;border-radius:1.5mm;padding:.4mm 2mm;font-size:1.05em}
.dt{color:#5d6b63;font-size:.95em}
h2{font-weight:900;font-size:1.12em;margin:1.8mm 0 2.2mm;line-height:1.3;color:#174f35}
ol{list-style:none}
li{display:grid;grid-template-columns:12.5mm 1fr;gap:1.6mm;padding:1.5mm 0;border-top:1px dashed #d6e3db}
li:first-child{border-top:0}
time{font-weight:900;color:#1f6b47;font-size:.98em}time small{display:block;font-weight:600;color:#8a988f;font-size:.82em}
b{font-weight:900;font-size:1em}
.zh{display:block;color:#1f6b47;font-size:.92em;font-family:"Noto Sans CJK SC",P,sans-serif}
.ad{color:#6e7a73;font-size:.84em;font-family:"Noto Sans CJK SC",P,sans-serif}
.me{color:#46524b;font-size:.86em}
li.mv b{font-weight:600;color:#5d6b63}li.mv time{color:#8a988f}`;
(async()=>{let b;try{b=await chromium.launch()}catch(e){b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'})}
for(const [a,c,name] of [[0,1,"연태_일정표_1-2일차.pdf"],[2,3,"연태_일정표_3-4일차.pdf"]]){
 const html=`<!doctype html><meta charset=utf-8><style>${css}</style><div class="top"><h1>I <i>♥</i> 烟台</h1><span>2026.11.21 (토) – 11.24 (화) · 3박 4일</span></div><div class="grid">${col(a)}${col(c)}</div>`;
 const p=await b.newPage();await p.setContent(html,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);
 // shrink font until every column fits
 const fs_=await p.evaluate(()=>{let f=10.5;const ok=()=>[...document.querySelectorAll('section')].every(s=>s.scrollHeight<=s.clientHeight+1);
  while(f>6.5){document.body.style.setProperty('--fs',f+'pt');if(ok())break;f-=0.25}return f});
 console.log(name,'font',fs_);
 await p.pdf({path:'/mnt/user-data/outputs/'+name,format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
 await p.screenshot({path:process.argv[2]+'/'+name+'.png',fullPage:true});await p.close()}
await b.close()})();
