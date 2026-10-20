const M=document.getElementById('m'),Q=new URLSearchParams(location.search),DBG=Q.get('debug')==='1';
let id=sessionStorage.lsw,st={ph:'none'},vibOn=localStorage.vib!=='0',k=0,sel=[],skin='',es=null;
const post=b=>fetch('/act',{method:'POST',body:JSON.stringify({id,...b}),keepalive:true}).then(r=>r.json()).catch(()=>({}));
function conn(){if(es)es.close();es=new EventSource('/events?id='+id);es.addEventListener('st',v=>{st=JSON.parse(v.data);draw()});
 es.addEventListener('vib',v=>{if(vibOn&&navigator.vibrate)navigator.vibrate(JSON.parse(v.data));const f=document.getElementById('fl');f.style.opacity=.5;setTimeout(()=>f.style.opacity=0,120)})}
document.oncontextmenu=e=>e.preventDefault();
function join(){skin='';M.innerHTML=`<h2>LAST STREET WARRIOR</h2><input id="n" placeholder="Tu nombre" value="${localStorage.n||''}">${Q.get('c')?'':'<input id="c" placeholder="Código de la sala">'}<button id="go">ENTRAR</button>`;
 document.getElementById('go').onclick=async()=>{const n=document.getElementById('n').value,c=Q.get('c')||document.getElementById('c').value.toUpperCase();localStorage.n=n;id=undefined;const r=await post({t:'join',c,n});if(r.err)return alert(r.err);id=r.id;sessionStorage.lsw=id;conn()}}
function draw(){
 if(st.ph==='none')return join();
 if(st.ph==='match'||st.ph==='end')return pad();skin='';
 if(st.slot<0)return M.innerHTML='<h2>Sala llena: eres espectador</h2>';
 if(st.ph==='lobby')return M.innerHTML='<h2>Esperando al otro jugador…</h2>';
 if(st.ready)return M.innerHTML='<h2>¡Listo! Esperando a '+(st.opp||'tu rival')+'…</h2>';pick()}
function pick(){if(!sel.length||sel.length>2)sel=st.picks.slice();
 M.innerHTML=`<div>Elige 2 luchadores (el 1.º sale primero): <b>${sel.map(f=>FD[f].n).join(' + ')}</b></div><div class="g">${Object.values(FD).map(d=>`<div data-f="${d.id}" class="${sel.includes(d.id)?'s':''} ${st.taken.includes(d.id)?'x':''}"><img src="assets/thumbs/${d.id}.webp"><b>${d.n}</b></div>`).join('')}</div><button id="ok" ${sel.length<2?'disabled':''}>LISTO</button>`;
 M.querySelectorAll('.g div').forEach(e=>e.onclick=()=>{const f=e.dataset.f;if(st.taken.includes(f))return;sel=sel.includes(f)?sel.filter(q=>q!==f):sel.length<2?[...sel,f]:[sel[1],f];pick()});
 document.getElementById('ok').onclick=async()=>{const r=await post({t:'pick',f:sel});if(r.err)return alert(r.err);post({t:'ready'})}}
// zonas táctiles sobre la skin: [centroX,centroY,ancho,alto,redondo] en píxeles de la imagen 1672x941
const TPL={dp:[220,565,380,380,1],A:[1315,450,125,125,1],B:[1440,560,125,125,1],C:[1312,685,125,125,1],D:[1192,562,125,125,1],SP:[1580,650,140,140,1],L2:[150,145,230,110],L1:[380,145,230,110],R1:[1298,145,230,110],R2:[1528,145,230,110],SEL:[422,800,180,100],VIB:[628,800,180,100],HOME:[833,785,190,190,1],STAR:[1037,800,180,100],MUS:[1240,800,180,100]};
const OV={tony:{dp:[210,590,380,380,1],A:[1340,490,125,125,1],B:[1460,600,125,125,1],C:[1342,718,125,125,1],D:[1222,598,125,125,1],SP:[1583,690,140,140,1]}}; // ajustes por skin (probar con ?debug=1)
const BIT={A:16,B:32,C:64,D:128,SP:256,L1:512,R1:1024,L2:2048,R2:4096};
function pad(){if(skin===st.act)return;skin=st.act;const T={...TPL,...(OV[st.act]||{})};
 let h=`<div class="cv" style="background-image:url(assets/mandos/${st.act}.webp);--c:${(FD[st.act]||{c:'#fff'}).c}">`;
 for(const[n,[cx,cy,w,hh,r]]of Object.entries(T))h+=`<div class="hs${r?' r':''}" data-b="${n}" style="left:${(cx-w/2)/16.72}%;top:${(cy-hh/2)/9.41}%;width:${w/16.72}%;height:${hh/9.41}%${DBG?';outline:2px solid lime':''}"><i></i></div>`;
 M.innerHTML=h+'</div>';wire()}
function setK(n){if(n!==k){k=n;post({t:'in',k})}}
function wire(){k=0;M.querySelectorAll('.hs').forEach(e=>{const b=e.dataset.b,on=v=>e.classList.toggle('on',v);
 if(b==='dp'){const f=ev=>{const r=e.getBoundingClientRect(),dx=ev.clientX-r.left-r.width/2,dy=ev.clientY-r.top-r.height/2,m=Math.hypot(dx,dy);let v=0;if(m>r.width*.12){if(Math.abs(dx)>m*.38)v|=dx>0?2:1;if(Math.abs(dy)>m*.38)v|=dy>0?8:4}setK((k&~15)|v);on(v)};
  e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);f(ev)};e.onpointermove=ev=>{if(e.hasPointerCapture(ev.pointerId))f(ev)};e.onpointerup=e.onpointercancel=()=>{setK(k&~15);on(0)}}
 else if(BIT[b]){e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);setK(k|BIT[b]);on(1)};e.onpointerup=e.onpointercancel=()=>{setK(k&~BIT[b]);on(0)}}
 else e.onpointerdown=()=>{on(1);setTimeout(()=>on(0),150);
  if(b==='VIB'){vibOn=!vibOn;localStorage.vib=vibOn?1:0;if(vibOn&&navigator.vibrate)navigator.vibrate(40)}else if(b==='STAR')post({t:'star'});else if(b==='HOME')post({t:'home'})}})}
if(id)conn();else draw();
