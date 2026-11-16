// Pantalla de la TV: sala, elección, combate con sprites ilustrados, HUD y escenas de súper animadas.
const cv=document.getElementById('c'),x=cv.getContext('2d'),ov=document.getElementById('ov');
let S=null,last='';const GY=1010,PX=1.92,IM={},META={};
const img=s=>{let o=IM[s];if(!o){o=IM[s]={i:new Image(),ok:0};o.i.onload=()=>o.ok=1;o.i.src=s}return o.ok?o.i:null};
const meta=f=>{if(META[f]===undefined){META[f]=null;fetch(`assets/fighters/${f}/meta.json`).then(r=>r.json()).then(m=>{META[f]=m;for(const k in m)if(k[0]!=='_')img(`assets/fighters/${f}/${k}.webp`)}).catch(()=>{})}return META[f]};
READY.forEach(meta);['comisario_plomo','kira','tigre'].forEach(f=>img(`assets/supers/${f}.webp`));READY.forEach(f=>img(`assets/faces/${f}.webp`));
new EventSource('/events').addEventListener('tv',e=>{S=JSON.parse(e.data);ui()});
function qr(t){const q=new __QR.QRCode(-1,__QR.ECL.M);q.addData(t);q.make();const n=q.getModuleCount(),m=4;let d='';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c+m},${r+m}h1v1h-1z`;return`<svg viewBox="0 0 ${n+8} ${n+8}" shape-rendering="crispEdges" style="background:#fff;border-radius:12px"><path d="${d}" fill="#000"/></svg>`}
function ui(){let h='';
 if(S.ph==='lobby')h=`<h1>LAST STREET WARRIOR</h1><div id="q">${qr(S.url)}</div><p>Escanea con tu celular · Sala <b>${S.code}</b></p><p>${S.pl.map(p=>p.n).join(' · ')||'Esperando jugadores…'}</p><p>Solo uno: juega contra la máquina desde tu celular</p>`;
 else if(S.ph==='select')h=`<h1>ELIGE TUS 2 LUCHADORES</h1><div class="pk">${[0,1].map(s=>{const p=S.pl.find(q=>q.s===s);return`<div class="pl"><p>${p?p.n+(p.r?' ✔ LISTO':''):'…'}</p>${(p?p.pk:[]).map(f=>`<img class="${p.r?'ok':''}" src="assets/thumbs/${f}.webp">`).join('')}</div>`}).join('')}</div><p>Cuando los dos estén listos empieza la pelea</p>`;
 if(h!==last){ov.innerHTML=h;last=h}ov.className=h?'':'h'}
// ---------- utilidades ----------
const rnd=(a,b)=>{const v=Math.sin(a*12.9898+b*78.233)*43758.5453;return v-Math.floor(v)},cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=u=>1-Math.pow(1-cl(u),3);
const NMF=f=>NM[f]||FD[f].n;
function glow(px,py,r,a,col){const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'#fff');g.addColorStop(.25,col);g.addColorStop(1,'rgba(255,120,0,0)');x.save();x.globalAlpha=cl(a);x.globalCompositeOperation='lighter';x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill();x.restore()}
function flash(a,col='#fff'){if(a>0){x.save();x.globalAlpha=cl(a);x.fillStyle=col;x.fillRect(0,0,1920,1080);x.restore()}}
function txt(t,X,Y,al,sz,col='#fff'){x.save();x.font=`italic 900 ${sz}px "Arial Black",Impact,sans-serif`;x.textAlign=al;x.lineJoin='round';x.lineWidth=sz/7;x.strokeStyle='#000';x.translate(X,Y);x.scale(.86,1);x.strokeText(t,0,0);x.fillStyle=col;x.fillText(t,0,0);x.restore()}
function rr(X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
// ---------- luchadores ----------
function poseOf(t,M){const T=performance.now()/1000,u=t.u;let p='idle';
 switch(t.st){case'walk':p=Math.floor(T*6)%2?'walk1':'walk2';break;case'dash':p='dash';break;case'crouch':p='crouch';break;case'guard':p='guard';break;case'jump':p='jump';break;case'jk':p='jumpkick';break;case'ja':p='jumpatk';break;
  case'punch':p=u<.15?'idle':u<.85?'punch':'idle';break;case'kick':p=u<.12?'idle':u<.85?'kick':'idle';break;case'heavy':p='backfist';break;case'palm':p=u<.1?'idle':'palm';break;case'sweep':p=u<.25?'crouch':'sweep';break;
  case'hit':p='hit';break;case'knock':p='ko_fly';break;case'down':p='ko_floor';break;case'getup':p='getup';break;case'sp1':p=u<.45?'sp1a':'sp1b';break;case'sp2':p=u<.6?'sp2a':'sp2b'}
 return M[p]?p:'idle'}
function drawF(i){const t=S.tm[i],fid=t.fs[t.a].f,M=meta(fid);if(!M)return;const p=poseOf(t,M),im=img(`assets/fighters/${fid}/${p}.webp`)||img(`assets/fighters/${fid}/idle.webp`);if(!im)return;
 const m=M[p],Sc=M._S,w=m.w*Sc,h=m.h*Sc,px=t.x*PX,T=performance.now()/1000;let dy=0,sy=1;
 if(t.st==='idle')sy=1+Math.sin(T*3+i)*.01;if(t.st==='walk')dy=-Math.abs(Math.sin(T*10))*7;if(t.st==='sp2'&&t.u>.6)dy-=Math.sin((t.u-.6)/.4*Math.PI)*160;
 x.save();x.globalAlpha=Math.max(.2,.4-t.z/600);x.fillStyle='#000';x.beginPath();x.ellipse(px,GY+8,Math.min(w,500)*.38,12,0,0,7);x.fill();x.restore();
 x.save();x.translate(px,GY-t.z+dy);x.scale(t.face,sy);if(t.st==='hit')x.filter='brightness(1.8) saturate(1.5)';x.drawImage(im,-m.ax*Sc,-h,w,h);x.restore()}
function burst(px,py,sz,age){const u=age/.35;x.save();x.globalAlpha=1-u*.6;x.translate(px,py);const s=sz*(.6+u)*100;glow(0,0,s,1,'#ffd23f');x.strokeStyle='#fff';x.lineWidth=5;for(let i=0;i<8;i++){const a=i*Math.PI/4+u;x.beginPath();x.moveTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);x.lineTo(Math.cos(a)*s*1.1,Math.sin(a)*s*1.1);x.stroke()}x.restore()}
function star(px,py,r,a,col){x.save();x.translate(px,py);x.rotate(a);x.fillStyle=col;x.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.35:r;const an=i*Math.PI/4;x.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}x.closePath();x.fill();x.restore()}
function drawProj(p){const d=S.tm[p.tm].face,px=p.x*PX,T=p.t;x.save();x.globalCompositeOperation='lighter';x.shadowBlur=30;
 if(p.f==='comisario_plomo'){x.shadowColor='#4aa8ff';x.lineJoin='round';for(const[c,w]of[['#4aa8ff',12],['#fff',4]]){x.strokeStyle=c;x.lineWidth=w;x.beginPath();for(let i=0;i<14;i++){const xx=px-d*i*26,yy=GY-20-Math.abs(Math.sin(i*2.1+T*40))*60*(i<2?.4:1);i?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke()}}
 else if(p.f==='kira'){x.shadowColor='#b46bff';for(const o of[-90,0,80])star(px-d*Math.abs(o)*.4,GY-330+o*.5+120,38,T*18,'#c58bff')}
 else if(p.f==='rex'){glow(px,GY-300,150,1,'#ff9a1f');for(let i=1;i<6;i++)glow(px-d*i*45,GY-300,110-i*14,.6,'#ff6a00')}
 else{x.shadowColor='#ff8a1f';for(let k=0;k<3;k++){x.strokeStyle='#ffb347';x.lineWidth=14;x.beginPath();x.arc(px-d*(k*30),GY-300+(k-1)*55,150,d>0?-.9:Math.PI-.9+.5,d>0?.9-.5+.5:Math.PI+.9,false);x.stroke();x.strokeStyle='#fff';x.lineWidth=4;x.stroke()}}
 x.restore()}
// ---------- HUD ----------
function metal(X,Y,W,H){const g=x.createLinearGradient(0,Y,0,Y+H);g.addColorStop(0,'#7a7a84');g.addColorStop(.35,'#3a3a42');g.addColorStop(1,'#14141a');x.fillStyle=g;x.strokeStyle='#000';x.lineWidth=2;rr(X,Y,W,H,5);x.fill();x.stroke()}
function bar(X,Y,W,H,pct,c0,c1,rev,seg){metal(X,Y,W,H);const ix=X+6,iw=W-12,iy=Y+6,ih=H-12;x.fillStyle='#0a0a0f';x.fillRect(ix,iy,iw,ih);const fw=iw*cl(pct),fx=rev?ix+iw-fw:ix,g=x.createLinearGradient(ix,0,ix+iw,0);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fillRect(fx,iy,fw,ih);
 const gl=x.createLinearGradient(0,iy,0,iy+ih);gl.addColorStop(0,'rgba(255,255,255,.5)');gl.addColorStop(1,'rgba(255,255,255,.02)');x.fillStyle=gl;x.fillRect(fx,iy,fw,ih/2);x.fillStyle='rgba(0,0,0,.55)';for(let i=1;i<seg;i++)x.fillRect(ix+iw*i/seg-1.5,iy,3,ih)}
function portrait(X,Y,s,fid){const g=x.createLinearGradient(X,Y,X+s,Y+s);g.addColorStop(0,'#f0cf86');g.addColorStop(.5,'#a8773a');g.addColorStop(1,'#5a3b1c');x.fillStyle=g;x.strokeStyle='#000';x.lineWidth=2;rr(X-6,Y-6,s+12,s+12,6);x.fill();x.stroke();const f=img(`assets/faces/${fid}.webp`);if(f)x.drawImage(f,X,Y,s,s);else{x.fillStyle=FD[fid].c;x.fillRect(X,Y,s,s)}}
function hud(){for(const i of[0,1]){const t=S.tm[i],f=t.fs[t.a],w=t.fs[1-t.a],rev=i===1,bx=rev?1075:205,hp=f.hp/100;
  portrait(rev?1730:40,24,150,f.f);txt(NMF(f.f),rev?1712:208,52,rev?'right':'left',40);
  bar(bx,60,640,46,hp,rev?'#e8321a':'#3fcf2a',rev?'#ff9a1f':'#f3d52a',rev,3);
  const pbx=rev?bx+640-360:bx;bar(pbx,116,360,24,f.pw/300,f.pw>=300?'#ffd23f':'#1457c9',f.pw>=300?'#ff9a1f':'#5ab4ff',rev,3);txt('PODER',rev?pbx-12:pbx+372,136,rev?'right':'left',19);
  portrait(rev?bx+640-52:bx,152,44,w.f);txt(NMF(w.f)+(w.al?'':' ✖'),rev?bx+640-64:bx+64,176,rev?'right':'left',17);bar(rev?bx+640-64-170:bx+64,182,170,14,w.hp/100,'#8f8f99','#c8c8d0',rev,1)}
 const g=x.createLinearGradient(850,40,1070,128);g.addColorStop(0,'#f0cf86');g.addColorStop(.5,'#a8773a');g.addColorStop(1,'#5a3b1c');
 for(const s of[-1,1]){metal(s<0?850:1015,40,55,88,5);x.fillStyle='rgba(0,0,0,.35)'}
 x.fillStyle=g;x.strokeStyle='#000';x.lineWidth=3;x.beginPath();x.arc(960,84,68,0,7);x.fill();x.stroke();x.fillStyle='#0a0705';x.beginPath();x.arc(960,84,58,0,7);x.fill();x.stroke();
 txt(String(S.t),960,106,'center',74);txt('TIEMPO',960,130,'center',15,'#e8c274');
 for(const[s,k]of[[0,0],[0,1],[1,0],[1,1]]){x.fillStyle=S.round[s]>k?'#ffd23f':'#222';x.strokeStyle='#a8773a';x.lineWidth=3;x.beginPath();x.arc(s?995+k*30:925-k*30,168,9,0,7);x.fill();x.stroke()}}
// ---------- escenas de súper ----------
function intro(c,t){const L=S.tm[c.tm],Lf=L.fs[L.a].f,Pf=L.fs[1-L.a].f;x.save();x.globalAlpha=.55*cl(t/.2);x.fillStyle='#000';x.fillRect(0,0,1920,1080);x.restore();const e=ease(t/.35);
 for(const[fid,sx,tx]of[[Lf,-340,140],[Pf,1920,1480]]){const X=sx+(tx-sx)*e;x.fillStyle='#111';x.strokeStyle='#d4a017';x.lineWidth=8;x.fillRect(X,380,300,340);x.strokeRect(X,380,300,340);const f=img(`assets/faces/${fid}.webp`);if(f)x.drawImage(f,X,380,300,288);txt(NMF(fid),X+150,712,'center',34)}
 txt('ESPECIAL EN EQUIPO',960,300,'center',110,'#ffd23f')}
function cPlomo(c,u){const a=img('assets/supers/comisario_plomo.webp');if(!a)return;const z=1+u*.03;x.save();x.translate(960+Math.sin(u*160)*5,540+Math.cos(u*130)*4);x.scale(z,z);x.drawImage(a,-960,-540,1920,1080);x.restore();
 glow(640,625,260*(.9+.25*rnd(u,5)),Math.floor(u*16)%2?.95:.3,'#ffe27a');const q=Math.floor(u*14);for(let i=0;i<3;i++)glow(1250+(rnd(q,i)-.5)*190,470+(rnd(q,i+9)-.5)*250,65,Math.floor(u*14+i)%3?1:.25,'#ffd23f');
 x.save();for(let i=0;i<18;i++){const ph=(u*2.2+i/18)%1;x.translate(560-ph*520+(i*37)%30,600-Math.sin(ph*Math.PI)*170+ph*240);x.rotate(ph*15+i*.5);x.globalAlpha=1-ph*.5;x.fillStyle='#e0b030';x.fillRect(-14,-5,28,10);x.setTransform(1,0,0,1,0,0)}x.restore()}
const KP=[[.3,.3,-700,690,2300,690,0,0],[1,.3,2400,500,-800,500,1,0],[1.7,.32,-700,330,2300,760,0,16],[2.4,.28,-700,590,2300,590,0,0]],KS=[[.6,.5],[1.3,-.5],[2,.2],[2.7,-.25]];
function cKira(c,u){const a=img('assets/supers/kira.webp');x.fillStyle='#000';x.fillRect(0,0,1920,1080);if(!a)return;const z=1+cl(u/3.5)*.16;let hd=9;KS.forEach(([ts])=>{const d=u-ts;if(d>=0&&d<.25)hd=d});
 const sk=hd<.2?(1-hd/.2)*14:0,sx=Math.sin(u*170)*sk,sy=Math.cos(u*140)*sk*.6;
 if(u<3.75){x.save();x.translate(960+sx,540+sy);x.scale(z,z);x.filter=(hd<.05?'invert(1) hue-rotate(180deg) ':'')+(u<2.7?'grayscale(.9) brightness(.5) contrast(1.25)':'saturate(1.25) brightness(1.05)');x.drawImage(a,-960,-540,1920,1080);x.restore()}
 else{const dirs=[[0,-1],[1,0],[0,1],[-1,0]],tri=[[0,0,1920,0],[1920,0,1920,1080],[1920,1080,0,1080],[0,1080,0,0]],e=cl((u-3.75)/1.1),d=40+260*e*e;for(let i=0;i<4;i++){x.save();x.globalAlpha=u<4.6?1:Math.max(0,1-(u-4.6)/.4);x.translate(dirs[i][0]*d,dirs[i][1]*d);x.beginPath();x.moveTo(960,540);x.lineTo(tri[i][0],tri[i][1]);x.lineTo(tri[i][2],tri[i][3]);x.closePath();x.clip();x.filter='saturate(1.3) brightness(1.1)';x.drawImage(a,0,0,1920,1080);x.restore()}}
 const dm=meta('kira'),di=img('assets/fighters/kira/dashslash.webp');
 if(di&&dm)for(const[t0,dur,x0,y0,x1,y1,fp,ang]of KP)if(u>=t0&&u<t0+dur){const q=(u-t0)/dur,W=1100,H=W*dm.dashslash.h/dm.dashslash.w;x.save();x.translate(x0+(x1-x0)*q,y0+(y1-y0)*q);x.rotate(ang*Math.PI/180);if(fp)x.scale(-1,1);const g=x.createLinearGradient(-1500,0,-300,0);g.addColorStop(0,'rgba(180,107,255,0)');g.addColorStop(1,'#b46bff');x.fillStyle=g;x.fillRect(-1500,-23,1200,46);x.shadowColor='#b46bff';x.shadowBlur=40;x.drawImage(di,-W/2,-H/2,W,H);x.restore()}
 KS.forEach(([ts,ang])=>{const d=u-ts;if(d>=0&&d<.25){const dx=Math.cos(ang),dy=Math.sin(ang),L=620;x.save();x.globalAlpha=1-d/.25;x.lineCap='round';x.shadowColor='#b46bff';x.shadowBlur=30;x.strokeStyle='#b46bff';x.lineWidth=18;x.beginPath();x.moveTo(1080-dx*L,540-dy*L);x.lineTo(1080+dx*L,540+dy*L);x.stroke();x.strokeStyle='#fff';x.lineWidth=6;x.stroke();x.restore()}});
 if(u>=3.5&&u<4.6){const p=cl((u-3.5)/.25),al=u<4.2?1:1-(u-4.2)/.4;x.save();x.globalAlpha=al;x.lineCap='round';x.shadowColor='#b46bff';x.shadowBlur=40;for(const[c,w]of[['#b46bff',22],['#fff',7]]){x.strokeStyle=c;x.lineWidth=w;x.beginPath();x.moveTo(0,0);x.lineTo(1920*p,1080*p);x.moveTo(1920,0);x.lineTo(1920-1920*p,1080*p);x.stroke()}x.restore();
  const xi=img('assets/fighters/kira/crossslash.webp'),m=dm&&dm.crossslash;if(xi&&m&&u>=3.55){const s=.7+.35*ease((u-3.55)/.2),W=800*s,H=W*m.h/m.w;x.save();x.globalAlpha=al;x.shadowColor='#b46bff';x.shadowBlur=40;x.drawImage(xi,960-W/2,540-H/2,W,H);x.restore()}}
 if(u>=2.7&&u<2.8)flash(1-(u-2.7)/.1);if(u>=3.75&&u<4.05)flash(.95*(1-(u-3.75)/.3));if(u>=4.7)flash((u-4.7)/.3)}
function cTigre(c,u){const a=img('assets/supers/tigre.webp');x.fillStyle='#000';x.fillRect(0,0,1920,1080);if(!a)return;x.save();x.beginPath();x.arc(150,970,cl(u/.55)*2600,0,7);x.clip();
 const cam=ease(u/2.3),s=1.9-.9*cam+(u>2.3?cl((u-2.3)/1.3)*.1:0),ox=270+690*cam,oy=260+280*cam;x.translate(ox,oy);x.scale(s,s);x.translate(-ox,-oy);x.filter=u<2.3?'sepia(.8) saturate(2.2) hue-rotate(-12deg) brightness(.75)':'saturate(1.2)';
 if(u>=3&&u<4){const amp=120*Math.sin(Math.PI*(u-3)),H=1080/8;for(let i=0;i<8;i++){x.save();x.beginPath();x.rect(0,i*H,1920,H+1);x.clip();x.drawImage(a,(i%2?1:-1)*amp,0,1920,1080);x.restore()}}else x.drawImage(a,0,0,1920,1080);x.restore();
 if(u>=2.4&&u<3.6){const p=cl((u-2.4)/.4),al=u<3.2?1:1-(u-3.2)/.4;x.save();x.globalAlpha=al;x.lineCap='round';x.shadowColor='#ff8a1f';x.shadowBlur=40;for(let k=0;k<3;k++){const o=(k-1)*110;for(const[c2,w]of[['#ff8a1f',24],['#fff',7]]){x.strokeStyle=c2;x.lineWidth=w;x.beginPath();x.moveTo(250,120+o);x.lineTo(250+1400*p,120+o+800*p);x.stroke()}}x.restore()}
 if(u>=3.4&&u<3.8){x.save();x.globalAlpha=.35*(1-(u-3.4)/.4);x.fillStyle='#4dff6a';x.fillRect(0,0,1920,1080);x.restore()}
 if(u>=.5&&u<.8)flash(.5*(.8-u)/.3,'#ff8a1f');if(u>=2.4&&u<2.6)flash(.6*(1-(u-2.4)/.2));if(u>=4.4)flash((u-4.4)/.3,'#ffb347')}
function cRex(c,u){x.save();x.fillStyle='rgba(0,0,0,.62)';x.fillRect(0,0,1920,1080);x.restore();const M=meta('rex');if(!M)return;const wind=u<1.4,pn=wind?'sup1':'sup2',im=img(`assets/fighters/rex/${pn}.webp`);
 if(wind)glow(560,700,200+u*160,.6,'#ffd23f');
 if(im){const m=M[pn],Sc=wind?1.5+u*.08:1.7,w=m.w*Sc,h=m.h*Sc,px=wind?620:760;x.save();x.translate(wind?0:Math.sin(u*150)*8,0);x.shadowColor='#ffb300';x.shadowBlur=60;x.drawImage(im,px-m.ax*Sc,1040-h,w,h);x.restore()}
 if(!wind){const e=u-1.4;for(let k=0;k<3;k++){const r=(e*900+k*220)%1100;x.save();x.globalAlpha=1-r/1100;x.strokeStyle='#ffd23f';x.lineWidth=18;x.shadowColor='#ffb300';x.shadowBlur=40;x.beginPath();x.arc(1420,620,r,0,7);x.stroke();x.restore()}
  x.save();x.strokeStyle='rgba(255,230,150,.6)';x.lineWidth=5;for(let i=0;i<26;i++){const an=i/26*Math.PI*2+e*.5,r0=260+rnd(i,3)*200;x.beginPath();x.moveTo(1420+Math.cos(an)*r0,620+Math.sin(an)*r0);x.lineTo(1420+Math.cos(an)*(r0+500),620+Math.sin(an)*(r0+500));x.stroke()}x.restore();txt('¡K.O. DEL CAMPEÓN!',960,200,'center',110,'#ffd23f')}
 if(u>=1.4&&u<1.7)flash(.9*(1-(u-1.4)/.3))}
function cGen(c,u){x.save();x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,0,1920,1080);x.restore();txt('¡COMBO EN EQUIPO!',960,540,'center',130,'#ffd23f')}
function cineDraw(c){const t=c.t;if(t<.9){intro(c,t);return}const u=t-.9;({comisario_plomo:cPlomo,kira:cKira,tigre:cTigre,rex:cRex}[c.f]||cGen)(c,u);if(u<.3)flash(1-u/.3);if(c.t>c.dur-.3)flash((c.t-(c.dur-.3))/.3)}
// ---------- bucle ----------
let bgFail={};
(function R(){requestAnimationFrame(R);x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,1920,1080);if(!S||!S.tm.length||(S.ph!=='match'&&S.ph!=='end'))return;
 const bg=img(`assets/niveles/${S.bg}.webp`)||img('assets/niveles/05_comisaria.webp');if(bg)x.drawImage(bg,0,0,1920,1080);else{const g=x.createLinearGradient(0,0,0,1080);g.addColorStop(0,'#2b1b5a');g.addColorStop(1,'#7a2a3a');x.fillStyle=g;x.fillRect(0,0,1920,1080)}
 const sh=(S.ev.filter(e=>S.now-e.t<.25).length?5:0);x.save();if(sh)x.translate(Math.sin(S.now*170)*sh,Math.cos(S.now*140)*sh);
 [0,1].forEach(drawF);S.proj.forEach(drawProj);for(const e of S.ev){const age=S.now-e.t;if(age>=0&&age<.35){const v=S.tm[e.tm];burst(v.x*PX+v.face*70,GY-e.y-v.z,e.sz,age)}}x.restore();
 hud();
 if(S.cine)cineDraw(S.cine);
 else if(S.ph==='end')txt(S.msg,960,520,'center',100,'#ffd23f');else if(S.pause)txt('PAUSA',960,520,'center',130,'#ffd23f');else if(S.cd>0)txt(`ROUND ${S.rn} · ${S.cd}`,960,520,'center',110,'#ffd23f');else if(S.t>117)txt('¡PELEA!',960,520,'center',140,'#e53935')})();
