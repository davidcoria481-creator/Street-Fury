// Last Street Warrior - servidor: sala, combate versus 2v2 (tag), especiales y súper en equipo. Uso: node server.js
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const {FD,BG,READY}=require('./data.js');
const PORT=+process.env.PORT||3000;
const lan=()=>{for(const l of Object.values(os.networkInterfaces()))for(const a of l)if(a.family==='IPv4'&&!a.internal)return a.address;return'localhost'};
const CODE=[...'ABCDEFGHJKMNPQRSTUVWXYZ'].sort(()=>Math.random()-.5).slice(0,4).join('');
const URLP=`http://${lan()}:${PORT}/play?c=${CODE}`;
const S={ph:'lobby',pl:{},tm:[],round:[0,0],rn:1,bg:'',t:120,cd:0,msg:'',endT:0,pause:false,diff:1,cine:null,proj:[],ev:[],now:0};
const clients=new Set(),CD={comisario_plomo:5.2,kira:5.9,tigre:5.6,rex:4.4},DUR={punch:.3,kick:.4,heavy:.45,palm:.5,sweep:.5};
const ps=()=>Object.values(S.pl).filter(p=>p.slot>=0).sort((a,b)=>a.slot-b.slot);
const vib=(t,p)=>{for(const c of clients)if(c.id&&c.id===t.pid)c.res.write(`event: vib\ndata: ${JSON.stringify(p)}\n\n`)};
const clamp=v=>Math.max(40,Math.min(960,v));
// teclas (bits): izq1 der2 arr4 aba8 A16 B32 C64 D128 SP256 L1 512 R1 1024 L2 2048 R2 4096
function startMatch(){const c=ps().find(p=>p.cpu),h=ps().find(p=>!p.cpu);if(c)c.picks=READY.filter(i=>!h.picks.includes(i)).sort(()=>Math.random()-.5).slice(0,2);
 const all=ps().flatMap(p=>p.picks),b=all.find(i=>BG[i]);S.bg=b?BG[b]:'05_comisaria';S.round=[0,0];S.rn=1;newRound()}
function newRound(){S.tm=ps().map((p,i)=>({i,pid:p.id,name:p.name,fs:p.picks.map(f=>({f,hp:100,pw:0,al:true})),a:0,x:i?720:280,z:0,vz:0,vx:0,st:'idle',sd:0,sT:0,face:i?-1:1,mv:0,swCd:0,k:0,pk:0,inv:0,air:0,fired:0}));S.proj=[];S.ev=[];S.cine=null;S.ph='match';S.cd=3;S.t=120;S.msg='';S.pause=false}
function endRound(w){if(S.ph!=='match')return;if(w>=0)S.round[w]++;S.ph='end';S.endT=4;S.msg=w<0?'EMPATE':S.round[w]>=2?'CAMPEÓN: '+S.tm[w].name:'GANA '+S.tm[w].name;S.tm.forEach((t,i)=>vib(t,w===i?[100,50,100]:[400]))}
function back(){S.ph='select';S.tm=[];S.cine=null;ps().forEach(p=>{p.ready=!!p.cpu;if(p.cpu)p.picks=[]})}
// daño de t sobre o
function dmg(t,o,v,o2={}){const f=t.fs[t.a],q=o.fs[o.a];if(o.inv>0||['down','knock','getup'].includes(o.st))return false;
 let d=v*(.7+FD[f.f].f*.12)*(1+Math.floor(f.pw/100)*.1);const g=o.st==='guard'&&o.face===-t.face&&!o2.pierce;if(g)d*=.2;
 q.hp-=d;f.pw=Math.min(300,f.pw+v*1.6);q.pw=Math.min(300,q.pw+4);o.x=clamp(o.x+t.face*(g?4:(o2.push??14)));
 S.ev.push({tm:o.i,sz:o2.sz||1,y:o2.y||330,t:S.now});
 if(q.hp<=0){q.hp=0;q.al=false;o.st='knock';o.sd=o.sT=.6;o.vx=t.face*320;o.inv=9;vib(o,[200,80,200,80,500]);if(!o.fs.some(z=>z.al))endRound(t.i);return true}
 if(!g){if(o2.kd){o.st='knock';o.sd=o.sT=.55;o.vx=t.face*300;o.inv=1.2;vib(o,[150,60,150])}else{o.st='hit';o.sd=o.sT=.3;vib(o,[70])}}else vib(o,[25]);return true}
const near=(t,o,r)=>Math.abs(o.x-t.x)<=r&&Math.abs(o.z-t.z)<220;
function setSt(t,s,d){t.st=s;t.sd=t.sT=d||0}
function special(t,o){const f=t.fs[t.a],lv=Math.floor(f.pw/100);if(lv<1)return;
 if(lv>=3&&t.fs[1-t.a].al&&!['down','knock'].includes(o.st)){f.pw-=300;S.cine={tm:t.i,f:f.f,t:0,dur:CD[f.f]||5};t.st='idle';vib(t,[100,50,100,50,300]);vib(o,[400])}
 else if(lv>=2){f.pw-=200;setSt(t,'sp2',1.1)}else{f.pw-=100;setSt(t,'sp1',.6);t.fired=0}}
function stateTick(t,o,pe,e){const hit=(a)=>pe<a&&e>=a;
 switch(t.st){
  case'punch':if(hit(.1)&&near(t,o,140))dmg(t,o,6,{push:16});break;
  case'kick':if(hit(.15)&&near(t,o,170))dmg(t,o,9,{push:24});break;
  case'heavy':if(hit(.18)&&near(t,o,150))dmg(t,o,11,{push:30});break;
  case'palm':if(hit(.18)&&near(t,o,130))dmg(t,o,12,{kd:1,y:420,push:30,sz:1.3});break;
  case'sweep':if(hit(.2)&&near(t,o,170))dmg(t,o,8,{kd:1,y:60,push:20});break;
  case'sp1':if(!t.fired&&e>=.25){t.fired=1;S.proj.push({tm:t.i,f:t.fs[t.a].f,x:t.x+t.face*70,v:t.face*700,life:1.4,hit:0,t0:S.now})}break;
  case'sp2':t.x=clamp(t.x+t.face*220*(1/60));[.3,.5,.7].forEach(a=>{if(hit(a)&&near(t,o,230))dmg(t,o,6,{push:8,sz:.9})});if(hit(.95)&&near(t,o,250))dmg(t,o,12,{kd:1,sz:1.6,y:380,push:40})}}
function endState(t){const f=t.fs[t.a];
 if(t.st==='knock'){t.st='down';t.sd=t.sT=f.al?.8:.9}
 else if(t.st==='down'){if(!f.al){const j=t.fs.findIndex(z=>z.al);if(j>=0){t.a=j;t.st='idle';t.z=0;t.inv=.8}}else{t.st='getup';t.sd=t.sT=.45}}
 else if(t.st==='getup'){t.st='idle';t.inv=.3}
 else if(!['jump','jk','ja'].includes(t.st))t.st='idle'}
function unit(t,o,dt,ctl){const f=t.fs[t.a],d=FD[f.f],k=ctl?t.k:0,pr=k&~t.pk;t.pk=k;t.swCd=Math.max(0,t.swCd-dt);t.inv=Math.max(0,t.inv-dt);t.face=o.x>=t.x?1:-1;
 if(t.vx){t.x=clamp(t.x+t.vx*dt);t.vx*=Math.pow(.02,dt)}
 if(t.z>0||t.vz>0){t.z+=t.vz*dt;t.vz-=2600*dt;if(t.z<=0){t.z=0;t.vz=0;t.air=0;if(['jump','jk','ja'].includes(t.st))t.st='idle'}}
 if(t.sT>0){const pe=t.sd-t.sT;t.sT-=dt;stateTick(t,o,pe,t.sd-Math.max(0,t.sT));if(t.sT<=0){t.sT=0;endState(t)}}
 if(!ctl||['punch','kick','heavy','palm','sweep','hit','knock','down','getup','sp1','sp2'].includes(t.st))return;
 const vx=((k&2?1:0)-(k&1?1:0))*(170+d.v*35),run=(k&4096)&&vx;
 if(t.z===0){
  if(k&2048){t.st='guard';t.mv=0}else if(k&8){t.st='crouch';t.mv=0}
  else{t.x=clamp(t.x+vx*(run?1.7:1)*dt);t.st=vx?(run?'dash':'walk'):'idle';t.mv=vx?(vx*t.face>0?1:-1):0}
  const at=n=>setSt(t,n,DUR[n]);
  if(pr&64){t.vz=1100;t.z=1;t.st='jump';t.air=0}
  else if(pr&16)at(k&4?'palm':'punch');else if(pr&32)at(k&8?'sweep':'kick');else if(pr&128)at('heavy');
  else if(pr&256)special(t,o);
  else if(pr&1536){const j=1-t.a;if(t.swCd<=0&&t.fs[j].al){t.a=j;t.swCd=1.5;t.st='idle';t.inv=.2}}
 }else{
  if(t.st==='jump')t.x=clamp(t.x+vx*.8*dt);
  if(!t.air&&(pr&48)){t.air=1;t.st=pr&16?'ja':'jk';if(near(t,o,pr&16?150:170))dmg(t,o,pr&16?8:10,{push:20,y:380})}}}
function ai(t,o){const A=t.ai||(t.ai={n:0,k:0});if((A.n-=1/30)>0)return A.k;const D=S.diff;A.n=[.4,.22,.1][D]*(.6+Math.random()*.8);
 const f=t.fs[t.a],dx=o.x-t.x,ad=Math.abs(dx),dir=dx>0?2:1;let k=0;
 if(f.pw>=100&&ad<420&&Math.random()<[.25,.4,.6][D])k=256;
 else if(t.fs[1-t.a].al&&f.hp<25&&t.swCd<=0&&Math.random()<.5)k=512;
 else if(['punch','kick','heavy'].includes(o.st)&&ad<170&&Math.random()<[.2,.4,.65][D])k=2048;
 else if(ad>150)k=dir|(ad>420&&Math.random()<.4?4096:0);
 else{const r=Math.random();k=r<.3?16:r<.55?32:r<.7?128:r<.8?64:r<.9?(dir===2?1:2):0}
 A.k=k&~(16|32|64|128|256|512);return k}
function step(dt){S.now+=dt;S.ev=S.ev.filter(e=>S.now-e.t<.6);
 if(S.cine){S.cine.t+=dt;if(S.cine.t>=S.cine.dur){const c=S.cine,t=S.tm[c.tm],o=S.tm[1-c.tm];S.cine=null;o.inv=0;dmg(t,o,45,{kd:1,sz:2.4,pierce:1,push:60,y:330})}return}
 if(S.ph==='end'){S.endT-=dt;S.proj.length=0;S.tm.forEach((t,i)=>unit(t,S.tm[1-i],dt,false));if(S.endT<=0){if(S.round.some(r=>r>=2))back();else{S.rn++;newRound()}}return}
 if(S.ph!=='match'||S.pause)return;if(S.cd>0){S.cd-=dt;return}
 S.t-=dt;S.tm.forEach((t,i)=>{if(S.pl[t.pid]&&S.pl[t.pid].cpu)t.k=ai(t,S.tm[1-i])});
 S.tm.forEach((t,i)=>unit(t,S.tm[1-i],dt,true));
 for(const p of S.proj){p.x+=p.v*dt;p.life-=dt;const t=S.tm[p.tm],o=S.tm[1-p.tm];if(!p.hit&&Math.abs(o.x-p.x)<70&&o.z<160){p.hit=1;p.life=0;dmg(t,o,14,{kd:1,sz:1.4,push:50})}}
 S.proj=S.proj.filter(p=>p.life>0&&p.x>0&&p.x<1000);
 if(S.ph==='match'&&S.t<=0){const h=S.tm.map(t=>t.fs.reduce((s,f)=>s+Math.max(0,f.hp),0));endRound(h[0]===h[1]?-1:h[0]>h[1]?0:1)}}
function act(b){const p=S.pl[b.id];
 if(b.t==='join'){if(b.c!==CODE)return{err:'Código incorrecto'};const id=Math.random().toString(36).slice(2,8),u=ps().map(q=>q.slot),s=[0,1].find(n=>!u.includes(n));
  S.pl[id]={id,name:String(b.n||'Jugador').slice(0,12),slot:s===undefined?-1:s,picks:[],ready:false};if(S.ph==='lobby'&&ps().length>=2)S.ph='select';return{id,slot:S.pl[id].slot}}
 if(!p)return{err:'sin sesión'};
 if(b.t==='cpu'){if(S.ph==='lobby'&&ps().length===1){S.diff=Math.max(0,Math.min(2,b.d|0));S.pl.cpu={id:'cpu',name:'MÁQUINA',slot:1,picks:[],ready:true,cpu:true};S.ph='select'}return{ok:1}}
 if(b.t==='in'){if(p.slot>=0&&S.tm[p.slot])S.tm[p.slot].k=b.k|0}
 else if(b.t==='pick'&&S.ph==='select'&&p.slot>=0){const a=(b.f||[]).filter((x,i,r)=>FD[x]&&READY.includes(x)&&r.indexOf(x)===i).slice(0,2),o=ps().find(q=>q!==p);if(o&&a.some(x=>o.picks.includes(x)))return{err:'ocupado'};p.picks=a;p.ready=false}
 else if(b.t==='ready'&&S.ph==='select'&&p.picks.length===2){p.ready=true;if(ps().length===2&&ps().every(q=>q.ready))startMatch()}
 else if(b.t==='star'&&S.ph==='match')S.pause=!S.pause;
 else if(b.t==='home'&&(S.ph==='match'||S.ph==='end'))back();
 return{ok:1}}
const pv=id=>{const p=S.pl[id];if(!p)return{ph:'none'};const o=ps().find(q=>q.id!==id),l=(S.ph==='match'||S.ph==='end')&&p.slot>=0&&S.tm[p.slot];
 return{ph:S.ph,slot:p.slot,name:p.name,picks:p.picks,ready:p.ready,act:l?S.tm[p.slot].fs[S.tm[p.slot].a].f:p.picks[0]||null,opp:o?o.name:'',taken:o?o.picks:[]}};
const tv=()=>({ph:S.ph,code:CODE,url:URLP,pl:Object.values(S.pl).map(p=>({n:p.name,s:p.slot,pk:p.picks,r:p.ready})),bg:S.bg,round:S.round,rn:S.rn,t:Math.max(0,Math.ceil(S.t)),cd:Math.ceil(S.cd),msg:S.msg,pause:S.pause,now:+S.now.toFixed(3),ev:S.ev,
 proj:S.proj.map(p=>({tm:p.tm,f:p.f,x:Math.round(p.x),t:+(S.now-p.t0).toFixed(2)})),cine:S.cine?{tm:S.cine.tm,f:S.cine.f,t:+S.cine.t.toFixed(2),dur:S.cine.dur}:null,
 tm:S.tm.map(t=>({n:t.name,a:t.a,x:Math.round(t.x),z:Math.round(t.z),st:t.st,u:t.sd?+(1-t.sT/t.sd).toFixed(2):0,face:t.face,mv:t.mv,fs:t.fs.map(f=>({f:f.f,hp:Math.round(f.hp),pw:Math.round(f.pw),al:f.al}))}))});
const MIME={'.html':'text/html;charset=utf-8','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
http.createServer((q,r)=>{const u=new URL(q.url,'http://x');
 if(u.pathname==='/events'){r.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});const c={res:r,id:u.searchParams.get('id'),last:''};clients.add(c);q.on('close',()=>clients.delete(c));return}
 if(u.pathname==='/act'&&q.method==='POST'){let s='';q.on('data',d=>s+=d);q.on('end',()=>{let o;try{o=act(JSON.parse(s))}catch(e){o={err:'x'}}r.writeHead(200,{'Content-Type':'application/json'});r.end(JSON.stringify(o))});return}
 if(u.pathname==='/state'){r.writeHead(200,{'Content-Type':'application/json'});return r.end(JSON.stringify(tv()))}
 if(process.env.DEBUG&&u.pathname==='/dbg'){S.tm.forEach(t=>t.fs.forEach(f=>f.pw=+u.searchParams.get('pw')));r.writeHead(200);return r.end('ok')}
 let f=u.pathname==='/'?'/tv.html':u.pathname==='/play'?'/play.html':u.pathname;f=path.join(__dirname,path.normalize(f));
 if(!f.startsWith(__dirname)||/server\.js$/.test(f)){r.writeHead(403);return r.end()}
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('no')}r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'max-age=60'});r.end(d)})
}).listen(PORT,()=>console.log(`TV: http://localhost:${PORT}\nCelulares (QR en la TV): ${URLP}`));
setInterval(()=>{step(1/30);const m=JSON.stringify(tv());for(const c of clients){if(!c.id)c.res.write(`event: tv\ndata: ${m}\n\n`);else{const v=JSON.stringify(pv(c.id));if(v!==c.last){c.last=v;c.res.write(`event: st\ndata: ${v}\n\n`)}}}},33);
