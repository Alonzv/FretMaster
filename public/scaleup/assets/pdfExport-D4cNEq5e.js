const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./jspdf.es.min-CLXC_m6q.js","./index-qXjXegeT.js","./index-DuMbSl20.css"])))=>i.map(i=>d[i]);
import{_ as H,f as P,a as T}from"./index-qXjXegeT.js";function f(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function M(o,r,n,i,l){const d=new Map;l.forEach(x=>d.set(x.wordIndex,x.chordName));const m=i.split(`
`);let a=0,e="";for(const x of m){const s=x.split(/\s+/).filter(Boolean);if(s.length===0){e+='<div style="height:10px"></div>';continue}e+='<div style="display:flex;flex-wrap:wrap;direction:rtl;gap:2px 10px;margin-bottom:6px;">';for(const g of s){const c=d.get(a);e+=`
        <div style="display:inline-flex;flex-direction:column;align-items:flex-end;">
          <span style="font-size:10px;font-weight:700;color:#C44900;min-height:14px;direction:ltr;display:block;">
            ${c?f(c):""}
          </span>
          <span style="font-size:13px;color:#111;">${f(g)}</span>
        </div>`,a++}e+="</div>"}const y=[r?`<div style="font-size:11px;color:#555;">Composer: ${f(r)}</div>`:"",n?`<div style="font-size:11px;color:#555;">Lyricist: ${f(n)}</div>`:""].filter(Boolean).join("");return`
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      padding: 28px 32px;
      width: 680px;
      background: #ffffff;
      color: #111;
      direction: rtl;
      box-sizing: border-box;
    ">
      <h1 style="font-size:20px;font-weight:800;margin:0 0 4px;color:#111;">
        ${f(o||"Song")}
      </h1>
      ${y}
      <div style="height:2px;background:#C44900;margin:12px 0 18px;"></div>
      ${e}
    </div>`}function k(o,r){const n=r.map((i,l)=>{const d=i.fretPositions.length>0?A(i.fretPositions):'<div style="height:70px;"></div>';return`
    <div style="
      display:inline-block;width:130px;vertical-align:top;
      background:#354a51;border-radius:8px;padding:10px 12px;
      margin:4px;text-align:center;
    ">
      <div style="font-size:11px;color:rgba(249,236,195,0.5);margin-bottom:3px;">${l+1}</div>
      <div style="font-size:18px;font-weight:800;color:#F9ECC3;">${f(P(i.chord.name))}</div>
      <div style="font-size:9px;color:rgba(249,236,195,0.55);margin-top:3px;">${f(i.chord.notes.join(" · "))}</div>
      ${d}
    </div>`}).join("");return`
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      padding: 28px 32px;
      width: 680px;
      background: #243238;
      color: #F9ECC3;
      box-sizing: border-box;
    ">
      <h1 style="font-size:20px;font-weight:800;margin:0 0 8px;">${f(o||"Chord Progression")}</h1>
      <div style="height:2px;background:#C44900;margin-bottom:20px;"></div>
      <div>${n}</div>
    </div>`}function A(o){const l=o.some(t=>t.fret===0),d=o.map(t=>t.fret).filter(t=>t>0),m=d.length>0?Math.min(...d):0,a=o.length>0?Math.max(...o.map(t=>t.fret)):0,e=l?0:Math.max(0,m-1),x=Math.max(a,e+4)-e,s=e===0?12:24,g=(200-s-8)/x,c=70/5,p=8,u=t=>t===0?s-g*.5:s+(t-e-.5)*g,b=t=>p+(5-t)*c;let h='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" width="200" height="90">';for(let t=0;t<=x;t++){const v=t===0&&e===0;h+=`<line x1="${s+t*g}" y1="${p}" x2="${s+t*g}" y2="${p+5*c}" stroke="${v?"#2E4A5A":"#CDBF96"}" stroke-width="${v?3:1}" opacity="${v?.7:1}"/>`}for(let t=0;t<6;t++)h+=`<line x1="${s}" y1="${b(t)}" x2="${s+x*g}" y2="${b(t)}" stroke="#629677" stroke-width="${.7+t*.18}" opacity="0.5"/>`;e>0&&(h+=`<text x="${s-4}" y="${p+5*c/2+4}" text-anchor="end" font-size="7" fill="rgba(46,74,90,0.58)">${e+1}fr</text>`);for(const t of o){const v=u(t.fret),F=b(t.string),z=T(t.string,t.fret);h+=`<circle cx="${v}" cy="${F}" r="7" fill="#C44900" stroke="#F7F0DC" stroke-width="1" opacity="0.92"/>`,h+=`<text x="${v}" y="${F+3}" text-anchor="middle" font-size="6" fill="#fff" font-weight="700">${z}</text>`}return h+="</svg>",h}const w=680,$=2,C=210,E=297,N=E*(w/C);async function _(o,r){const n=document.createElement("div");Object.assign(n.style,{position:"fixed",inset:"0",background:"rgba(0,0,0,0.78)",zIndex:"99999",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"15px",fontFamily:"sans-serif"}),n.textContent="Creating PDF…",document.body.appendChild(n);const i=document.createElement("div");Object.assign(i.style,{position:"fixed",top:"0",left:"0",width:`${w}px`,zIndex:"99998",pointerEvents:"none"}),i.innerHTML=o,document.body.appendChild(i);try{await document.fonts.ready;const l=i.firstElementChild??i,[{default:d},{jsPDF:m}]=await Promise.all([H(()=>import("./html2canvas.esm-DXEQVQnt.js"),[],import.meta.url),H(()=>import("./jspdf.es.min-CLXC_m6q.js").then(s=>s.j),__vite__mapDeps([0,1,2]),import.meta.url)]),a=await d(l,{scale:$,useCORS:!0,backgroundColor:"#ffffff",width:w,windowWidth:w}),e=new m({unit:"mm",format:"a4",orientation:"portrait"}),y=N*$,x=Math.ceil(a.height/y);for(let s=0;s<x;s++){s>0&&e.addPage();const g=s*y,c=Math.min(y,a.height-g),p=document.createElement("canvas");p.width=a.width,p.height=c;const u=p.getContext("2d");u.fillStyle="#ffffff",u.fillRect(0,0,p.width,p.height),u.drawImage(a,0,g,a.width,c,0,0,a.width,c);const b=p.toDataURL("image/jpeg",.93),h=c/$*(C/w);e.addImage(b,"JPEG",0,0,C,h)}e.save(r)}finally{document.body.removeChild(i),document.body.removeChild(n)}}function I(o,r,n,i){const l=(a,e,y)=>`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:3px;">
      <span style="width:14px;font-weight:700;font-size:13px;color:${y};flex-shrink:0;">${f(a)}</span>
      <span style="color:#888;font-size:13px;">|</span>
      <span style="font-size:13px;color:#222;letter-spacing:0.5px;">${f(e||"--")}</span>
    </div>`,d=r.map((a,e)=>l(a,n[e]||"","#2E4A5A")).join(""),m=r.map((a,e)=>l(a,i[e]||"","#629677")).join("");return`
    <div style="
      font-family: 'Courier New', Courier, monospace;
      padding: 36px 40px;
      width: 680px;
      background: #ffffff;
      color: #111;
      box-sizing: border-box;
    ">
      <div style="font-family:Arial,Helvetica,sans-serif;">
        <h1 style="font-size:22px;font-weight:800;margin:0 0 4px;color:#2E4A5A;">
          ScaleUp — Harmony Builder
        </h1>
        <div style="font-size:13px;color:#629677;font-weight:600;margin-bottom:14px;">
          Harmony type: ${f(o)}
        </div>
        <div style="height:2px;background:#C44900;margin-bottom:24px;"></div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;
          color:#888;letter-spacing:1px;margin-bottom:8px;">ORIGINAL RIFF</div>
        <div style="background:#F7F0DC;border-radius:8px;padding:14px 16px;border:1px solid #CDBF96;">
          ${d}
        </div>
      </div>

      <div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;
          color:#629677;letter-spacing:1px;margin-bottom:8px;">HARMONY</div>
        <div style="background:#F0F9F5;border-radius:8px;padding:14px 16px;border:1px solid #629677;">
          ${m}
        </div>
      </div>

      <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#aaa;margin-top:28px;">
        Generated by ScaleUp · scaleup.app
      </div>
    </div>`}async function S(o,r,n,i){const l=I(o,r,n,i);await _(l,"harmony.pdf")}async function D(o,r,n,i,l){const d=M(o,r,n,i,l),m=`${(o||"song").replace(/[^a-zA-Z0-9\u0590-\u05FF ]/g,"_")}.pdf`;await _(d,m)}async function L(o,r){const n=k(o,r),i=`${(o||"progression").replace(/[^a-zA-Z0-9\u0590-\u05FF ]/g,"_")}.pdf`;await _(n,i)}export{S as exportHarmonyPDF,D as exportLyricsPDF,L as exportProgressionPDF};
