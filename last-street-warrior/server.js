// Last Street Warrior - servidor: sala, lógica del versus 2v2 (tag) y SSE. Uso: node server.js
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const {FD,BG}=require('./data.js');
const PORT=+process.env.PORT||3000;
const lan=()=>{for(const l of Object.values(os.networkInterfaces()))for(const a of l)if(a.family==='IPv4'&&!a.internal)return a.address;return'localhost'};
const CODE=[...'ABCDEFGHJKMNPQRSTUVWXYZ'].sort(()=>Math.random()-.5).slice(0,4).join('');
const URLP=`http://${lan()}:${PORT}/play?c=${CODE}`;
const S={ph:'lobby',pl:{},tm:[],round:[0,0],rn:1,bg:'',t:120,cd:0,msg:'',endT:0,pause:false};
const clients=new Set();
const ps=()=>Object.values(S.pl).filter(p=>p.slot>=0).sort((a,b)=>a.slot-b.slot);
const vib=(t,p)=>{for(const c of clients)if(c.id&&c.id===t.pid)c.res.write(`event: vib\ndata: ${JSON.stringify(p)}\n\n`)};
// teclas (bits): izq1 der2 arr4 aba8 A16 B32 C64 D128 SP256 L1 512 R1 1024 L2 2048 R2 4096
function startMatch(){const all=ps().flatMap(p=>p.picks),b=all.find(i=>BG[i]);S.bg=b?BG[b]:Object.values(BG)[Math.random()*10|0];S.round=[0,0];S.rn=1;newRound()}
function newRound(){S.tm=ps().map((p,i)=>({i,pid:p.id,name:p.name,fs:p.picks.map(f=>({f,hp:100,pw:0,al:true})),a:0,x:i?680:320,z:0,vz:0,st:'idle',sT:0,face:i?-1:1,swCd:0,k:0,pk:0}));S.ph='match';S.cd=3;S.t=120;S.msg='';S.pause=false}
function endRound(w){if(S.ph!=='match')return;if(w>=0)S.round[w]++;S.ph='end';S.endT=3.5;S.msg=w<0?'EMPATE':S.round[w]>=2?'CAMPEÓN: '+S.tm[w].name:'GANA '+S.tm[w].name;S.tm.forEach((t,i)=>vib(t,w===i?[100,50,100]:[400]))}
function ko(o){const q=o.fs[o.a];q.hp=0;q.al=false;o.st='ko';o.sT=1.1;vib(o,[200,80,200,80,500]);if(!o.fs.some(f=>f.al))endRound(1-o.i)}
function hit(t,o,base,rng,kn){const f=t.fs[t.a],q=o.fs[o.a];if(o.st==='ko'||Math.abs(o.x-t.x)>rng||Math.abs(o.z-t.z)>90)return;
 let v=base*(.7+FD[f.f].f*.12)*(1+Math.floor(f.pw/100)*.15);const g=o.st==='guard'&&o.face===-t.face;if(g)v*=.2;
 q.hp-=v;f.pw=Math.min(300,f.pw+base*1.6);q.pw=Math.min(300,q.pw+4);o.x=Math.max(40,Math.min(960,o.x+t.face*(g?kn*.3:kn)));
 if(!g){o.st='hit';o.sT=.3}vib(o,[g?25:70]);if(q.hp<=0)ko(o)}
function unit(t,o,dt){const f=t.fs[t.a],d=FD[f.f],k=t.k,pr=k&~t.pk;t.pk=k;t.swCd=Math.max(0,t.swCd-dt);
 if(t.sT>0){t.sT-=dt;if(t.sT<=0){if(t.st==='ko'){const j=t.fs.findIndex(q=>q.al);if(j>=0){t.a=j;t.st='idle';t.z=0}}else t.st='idle'}}
 t.face=o.x>=t.x?1:-1;
 if(['idle','walk','guard'].includes(t.st)){
  const vx=((k&2?1:0)-(k&1?1:0))*(170+d.v*35)*(k&4096?1.6:1);
  if(k&2048)t.st='guard';else{t.x=Math.max(40,Math.min(960,t.x+vx*dt));t.st=vx?'walk':'idle'}
  if(pr&64&&t.z===0)t.vz=560;
  if(pr&1536){const j=1-t.a;if(t.swCd<=0&&t.fs[j].al&&t.z===0){t.a=j;t.swCd=1.5;t.st='idle'}}
  else if(pr&16){t.st='atk';t.sT=.28;hit(t,o,6,75,18)}
  else if(pr&32){t.st='kick';t.sT=.4;hit(t,o,9,90,30)}
  else if(pr&256&&f.pw>=300){f.pw=0;t.st='sp';t.sT=.7;hit(t,o,34,430,160)}}
 if(t.z>0||t.vz>0){t.z+=t.vz*dt;t.vz-=1600*dt;if(t.z<=0){t.z=0;t.vz=0}}}
function step(dt){if(S.ph==='end'){S.endT-=dt;if(S.endT<=0){if(S.round.some(r=>r>=2)){S.ph='select';S.tm=[];ps().forEach(p=>p.ready=false)}else{S.rn++;newRound()}}return}
 if(S.ph!=='match'||S.pause)return;if(S.cd>0){S.cd-=dt;return}
 S.t-=dt;unit(S.tm[0],S.tm[1],dt);unit(S.tm[1],S.tm[0],dt);
 if(S.ph==='match'&&S.t<=0){const h=S.tm.map(t=>t.fs.reduce((s,f)=>s+Math.max(0,f.hp),0));endRound(h[0]===h[1]?-1:h[0]>h[1]?0:1)}}
function act(b){const p=S.pl[b.id];
 if(b.t==='join'){if(b.c!==CODE)return{err:'Código incorrecto'};const id=Math.random().toString(36).slice(2,8),u=ps().map(q=>q.slot),s=[0,1].find(n=>!u.includes(n));
  S.pl[id]={id,name:String(b.n||'Jugador').slice(0,12),slot:s===undefined?-1:s,picks:[],ready:false};if(S.ph==='lobby'&&ps().length>=2)S.ph='select';return{id,slot:S.pl[id].slot}}
 if(!p)return{err:'sin sesión'};
 if(b.t==='in'){if(p.slot>=0&&S.tm[p.slot])S.tm[p.slot].k=b.k|0}
 else if(b.t==='pick'&&S.ph==='select'&&p.slot>=0){const a=(b.f||[]).filter((x,i,r)=>FD[x]&&r.indexOf(x)===i).slice(0,2),o=ps().find(q=>q!==p);if(o&&a.some(x=>o.picks.includes(x)))return{err:'ocupado'};p.picks=a;p.ready=false}
 else if(b.t==='ready'&&S.ph==='select'&&p.picks.length===2){p.ready=true;if(ps().length===2&&ps().every(q=>q.ready))startMatch()}
 else if(b.t==='star'&&S.ph==='match')S.pause=!S.pause;
 else if(b.t==='home'&&(S.ph==='match'||S.ph==='end')){S.ph='select';S.tm=[];ps().forEach(q=>q.ready=false)}
 return{ok:1}}
const pv=id=>{const p=S.pl[id];if(!p)return{ph:'none'};const o=ps().find(q=>q.id!==id),l=(S.ph==='match'||S.ph==='end')&&p.slot>=0&&S.tm[p.slot];
 return{ph:S.ph,slot:p.slot,name:p.name,picks:p.picks,ready:p.ready,act:l?S.tm[p.slot].fs[S.tm[p.slot].a].f:p.picks[0]||null,opp:o?o.name:'',taken:o?o.picks:[]}};
const tv=()=>({ph:S.ph,code:CODE,url:URLP,pl:Object.values(S.pl).map(p=>({n:p.name,s:p.slot,pk:p.picks,r:p.ready})),bg:S.bg,round:S.round,rn:S.rn,t:Math.max(0,Math.ceil(S.t)),cd:Math.ceil(S.cd),msg:S.msg,pause:S.pause,
 tm:S.tm.map(t=>({n:t.name,a:t.a,x:Math.round(t.x),z:Math.round(t.z),st:t.st,face:t.face,fs:t.fs.map(f=>({f:f.f,hp:Math.round(f.hp),pw:Math.round(f.pw),al:f.al}))}))});
const MIME={'.html':'text/html;charset=utf-8','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
http.createServer((q,r)=>{const u=new URL(q.url,'http://x');
 if(u.pathname==='/events'){r.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});const c={res:r,id:u.searchParams.get('id'),last:''};clients.add(c);q.on('close',()=>clients.delete(c));return}
 if(u.pathname==='/act'&&q.method==='POST'){let s='';q.on('data',d=>s+=d);q.on('end',()=>{let o;try{o=act(JSON.parse(s))}catch(e){o={err:'x'}}r.writeHead(200,{'Content-Type':'application/json'});r.end(JSON.stringify(o))});return}
 if(u.pathname==='/state'){r.writeHead(200,{'Content-Type':'application/json'});return r.end(JSON.stringify(tv()))}
 let f=u.pathname==='/'?'/tv.html':u.pathname==='/play'?'/play.html':u.pathname;f=path.join(__dirname,path.normalize(f));
 if(!f.startsWith(__dirname)||/server\.js$/.test(f)){r.writeHead(403);return r.end()}
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('no')}r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'max-age=60'});r.end(d)})
}).listen(PORT,()=>console.log(`TV: http://localhost:${PORT}\nCelulares (QR en la TV): ${URLP}`));
setInterval(()=>{step(1/30);const m=JSON.stringify(tv());for(const c of clients){if(!c.id)c.res.write(`event: tv\ndata: ${m}\n\n`);else{const v=JSON.stringify(pv(c.id));if(v!==c.last){c.last=v;c.res.write(`event: st\ndata: ${v}\n\n`)}}}},33);
