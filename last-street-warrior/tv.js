const cv=document.getElementById('c'),x=cv.getContext('2d'),ov=document.getElementById('ov'),IM={};let S=null,last='';
const img=s=>(IM[s]||(IM[s]=Object.assign(new Image(),{src:s})));
new EventSource('/events').addEventListener('tv',e=>{S=JSON.parse(e.data);ui()});
function qr(t){const q=new __QR.QRCode(-1,__QR.ECL.M);q.addData(t);q.make();const n=q.getModuleCount(),m=4;let d='';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c+m},${r+m}h1v1h-1z`;return`<svg viewBox="0 0 ${n+8} ${n+8}" shape-rendering="crispEdges" style="background:#fff;border-radius:12px"><path d="${d}" fill="#000"/></svg>`}
function ui(){let h='';
 if(S.ph==='lobby')h=`<h1>LAST STREET WARRIOR</h1><div id="q">${qr(S.url)}</div><p>Escanea con tu celular · Sala <b>${S.code}</b></p><p>${S.pl.map(p=>p.n).join(' · ')||'Esperando jugadores…'}</p><p>Solo uno: juega contra la máquina desde tu celular</p>`;
 else if(S.ph==='select')h=`<h1>ELIGE TUS 2 LUCHADORES</h1><div class="pk">${[0,1].map(s=>{const p=S.pl.find(q=>q.s===s);return`<div class="pl"><p>${p?p.n+(p.r?' ✔ LISTO':''):'…'}</p>${(p?p.pk:[]).map(f=>`<img class="${p.r?'ok':''}" src="assets/thumbs/${f}.webp">`).join('')}</div>`}).join('')}</div><p>Cuando los dos estén listos empieza la pelea</p>`;
 if(h!==last){ov.innerHTML=h;last=h}ov.className=h?'':'h'}
const GY=610;
function bar(X,Y,W,H,fr,col,seg,rev){x.fillStyle='#111';x.fillRect(X-3,Y-3,W+6,H+6);const w=W*Math.max(0,Math.min(1,fr));x.fillStyle=col;x.fillRect(rev?X+W-w:X,Y,w,H);x.fillStyle='#000';for(let i=1;i<seg;i++)x.fillRect(X+W*i/seg-1,Y,3,H)}
function hud(i){const t=S.tm[i],f=t.fs[t.a],w=t.fs[1-t.a],rev=i===1,X=rev?780:40,hp=f.hp/100;
 x.textAlign=rev?'right':'left';x.fillStyle='#fff';x.font='26px Impact';x.fillText(FD[f.f].n+' · '+t.n,rev?X+460:X,34);
 bar(X,44,460,26,hp,hp>.66?'#43d13f':hp>.33?'#ffd23f':'#e53935',3,rev);
 for(let k=0;k<3;k++)bar(X+k*156,80,148,12,(f.pw-k*100)/100,f.pw>=300?'#ff9f1c':'#2e9bff',1,false);
 x.font='18px Impact';x.fillStyle=w.al?'#ccc':'#777';x.fillText(FD[w.f].n+(w.al?'':' ✖'),rev?X+460:X,118);bar(rev?X+240:X,124,220,10,w.hp/100,'#888',1,rev)}
function timer(){x.fillStyle='#b8860b';x.fillRect(574,10,132,92);x.fillStyle='#14112b';x.fillRect(580,16,120,80);x.textAlign='center';x.fillStyle='#fff';x.font='54px Impact';x.fillText(S.t,640,70);x.font='14px Impact';x.fillStyle='#ffd23f';x.fillText('TIEMPO',640,90);
 [0,1].forEach(s=>[0,1].forEach(k=>{x.fillStyle=S.round[s]>k?'#ffd23f':'#333';x.beginPath();x.arc(s?680+k*26:600-k*26,122,9,0,7);x.fill()}))}
function fighter(i){const t=S.tm[i],f=t.fs[t.a],L=LOOK[f.f],T=performance.now()/1000,px=t.x*1.28,py=GY-t.z*.6,s=L.w||1;
 x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(px,GY+6,46*s,10,0,0,7);x.fill();
 x.save();x.translate(px,py);x.scale(t.face*s,s);if(t.st==='ko'){x.rotate(-Math.PI/2);x.translate(0,-30)}
 drawSprite(x,L,t.st,T);
 if(t.st==='sp'){x.strokeStyle=FD[f.f].c;x.lineWidth=8;x.beginPath();x.arc(0,-90,90+Math.sin(T*30)*10,0,7);x.stroke()}x.restore()}
function big(s,y,c){x.textAlign='center';x.font='90px Impact';x.fillStyle='#000';x.fillText(s,644,y+4);x.fillStyle=c||'#ffd23f';x.fillText(s,640,y)}
(function R(){requestAnimationFrame(R);x.clearRect(0,0,1280,720);if(!S||!S.tm.length||(S.ph!=='match'&&S.ph!=='end'))return;
 const B=S.bg&&img(`assets/niveles/${S.bg}.png`);
 if(B&&B.complete&&B.naturalWidth)x.drawImage(B,0,0,1280,720);else{const g=x.createLinearGradient(0,0,0,720);g.addColorStop(0,'#2b1b5a');g.addColorStop(1,'#7a2a3a');x.fillStyle=g;x.fillRect(0,0,1280,720);x.fillStyle='#1a1230';x.fillRect(0,GY,1280,110)}
 [0,1].forEach(fighter);[0,1].forEach(hud);timer();
 if(S.ph==='end')big(S.msg,360);else if(S.pause)big('PAUSA',360);else if(S.cd>0)big('ROUND '+S.rn+' · '+S.cd,360);else if(S.t>117)big('¡PELEA!',360,'#e53935')})();
