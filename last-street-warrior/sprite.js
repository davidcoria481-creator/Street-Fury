// Pixel art de los 23 luchadores, dibujado con código. Cada luchador es una "ficha" (LOOK) + una función de dibujo con poses.
const LOOK={
rex:{s:'#b87848',h:'#161616',hs:'short',b:'#c62828',sh:'#f5f5f5',g:'#d32f2f',a:['chain','sash:#ffd23f'],w:1.1},
kira:{s:'#e2ac80',h:'#141414',hs:'pony',t:'#2a2438',b:'#1c1c26',sh:'#111',g:'#6a1b9a',sl:1,a:['scarf:#7e3ff2','sash:#8e24aa'],w:.95},
tigre:{s:'#d8a06a',h:'#141414',hs:'spike',b:'#1c1c1c',sh:'#222',g:'#eee',a:['band:#fb8c00','sash:#fb8c00']},
bruno:{s:'#b88858',hs:'mask:#1e5fd0',b:'#2a5ad0',sh:'#c0c8d0',g:'#2a5ad0',a:['sash:#c0c8d0'],w:1.15},
luna:{s:'#b87a4c',h:'#2a1a12',hs:'long',t:'#2e8b4f',b:'#f2f2f2',g:'#222',a:[],w:.95},
zeta:{s:'#d9a272',h:'#5a3a22',hs:'beanie:#fdd835',t:'#f0c419',b:'#2b3a55',sh:'#eee',g:'#222',sl:1,a:[],w:.9},
chispa:{s:'#c88e5c',h:'#1c1410',hs:'spike',t:'#151515',b:'#19b6d6',sh:'#222',g:'#222',a:['goggles','bolt']},
don_fierro:{s:'#d8a47c',h:'#a8a8a8',hs:'short',t:'#7a4a2a',b:'#6a3f22',sh:'#333',g:'#555',sl:1,a:['mustache:#aaa'],w:1.2},
titan:{s:'#e0a468',h:'#e8d06a',hs:'short',t:'#141414',b:'#e0b020',sh:'#eee',g:'#222',a:['shades','belt:#5a3a1a'],w:1.25},
ramos:{s:'#c8905f',h:'#161616',hs:'cap:#1f2a5a',t:'#26346e',b:'#1c2547',sh:'#111',g:'#111',sl:1,a:['badge','vest:#15151a'],w:1.05},
lobo:{s:'#c68a5a',h:'#2a1c12',hs:'bandana:#5a6e2a',t:'#161616',b:'#5f6b2e',sh:'#1a1a1a',g:'#1a1a1a',a:['beard:#2a1c12'],w:1.1},
vega:{s:'#d39c6c',h:'#1a1210',hs:'capony:#1f2a5a',t:'#26346e',b:'#1c2547',sh:'#111',g:'#111',sl:1,a:['badge','vest:#15151a'],w:.95},
venus:{s:'#d9a070',h:'#a8532a',hs:'long',t:'#e8447e',b:'#161616',sh:'#161616',g:'#e8447e',sl:1,a:['shades','hoops']},
tony:{s:'#c98a60',hs:'bald',t:'#e8e8e0',b:'#1c1c1c',sh:'#111',g:'#c98a60',a:['chain'],w:1.35},
maestro_dragon:{s:'#c89a70',h:'#b8b8b8',hs:'long',t:'#c62828',b:'#1c1c1c',sh:'#111',g:'#eee',sl:1,a:['beard:#bbb','sash:#d4a017','trim:#d4a017'],w:1.05},
capitan_rata:{s:'#d8a47a',h:'#161616',hs:'tricorn:#1c1c22',t:'#33333c',b:'#46464e',sh:'#3a2a1a',g:'#222',sl:1,a:['mustache:#111','band:#c62828','coat']},
maquinista:{s:'#c88c62',h:'#161616',hs:'cap:#2a3a7a',t:'#2a3a7a',b:'#242c4a',sh:'#111',g:'#222',sl:1,a:['beard:#161616','goggles'],w:1.2},
comisario_plomo:{s:'#c8905f',h:'#161616',hs:'cap:#14203f',t:'#14203f',b:'#14203f',sh:'#111',g:'#111',sl:1,a:['shades','mustache:#111','badge'],w:1.25},
mole_3000:{s:'#8a8f96',hs:'robot',t:'#6f747a',b:'#55595e',sh:'#2a2a2a',g:'#ff6d00',a:['trim:#ff6d00','belt:#ff6d00'],w:1.35},
gran_pipo:{s:'#f2f2f2',h:'#2aa14a',hs:'curly',t:'#d32f2f',b:'#7a2a9a',sh:'#d32f2f',g:'#fff',sl:1,a:['nose','tophat:#d32f2f','tie:#fdd835']},
reina_cobra:{s:'#d29a70',h:'#141414',hs:'hood:#1f7a3a',t:'#14452a',b:'#0f2a1a',sh:'#111',g:'#1f7a3a',sl:1,a:['belt:#1f7a3a'],w:.95},
baron:{s:'#e8d4c0',h:'#c8c8d0',hs:'slick',t:'#16101c',b:'#16101c',sh:'#111',g:'#111',sl:1,a:['mustache:#888','monocle','cape:#5a2a8a','tie:#e8e8f0'],w:1.05},
don_cuervo:{s:'#c89a72',h:'#101010',hs:'slick',t:'#101014',b:'#101014',sh:'#111',g:'#111',sl:1,a:['beard:#101010','tie:#d50000','feathers'],w:1.15}};
const shd=(c,d)=>{const n=parseInt(c.slice(1),16),f=v=>Math.max(0,Math.min(255,v+d));return'#'+((1<<24)|(f(n>>16)<<16)|(f((n>>8)&255)<<8)|f(n&255)).toString(16).slice(1)};
// x: contexto (origen = pies, +x = frente), L: ficha, st: estado (idle walk atk kick guard hit sp ko), T: tiempo en s
function drawSprite(x,L,st,T){
 const u=4,P=[],p=(a,b,w,h,c,n)=>P.push([a,b,w,h,c,n]),ac=L.a||[],ap=n=>{const q=ac.find(v=>v.split(':')[0]===n);return q?(q.split(':')[1]||'#ddd'):0};
 const[hs,hc]=(L.hs||'').split(':'),H=L.h,sk=L.s,top=L.t||sk,bot=L.b,hurt=st==='hit',sh=L.sh||sk,gl=L.g||sk,A=L.sl?top:sk,
  bob=st==='idle'?Math.round(Math.sin(T*4)*.7):0,w=st==='walk'?Math.round(Math.sin(T*14)*3):0,lx=st==='atk'?1:st==='kick'?-1:hurt?-2:0,y0=-44+bob;
 if(ap('cape'))p(-11,-33,5,26,ap('cape'));
 if(hs==='long')p(-8,y0,4,18,H);if(hs==='pony'||hs==='capony')p(-9,y0,4,10,H);
 p(-6+w,-17,5,14,bot);p(-7+w,-3,6,3,sh);
 if(st==='kick'){p(2,-15,20,5,bot);p(21,-16,5,7,sh)}else{p(1-w,-17,5,14,bot);p(1-w,-3,6,3,sh)}
 if(ap('coat'))p(-7+lx,-17,14,10,top);
 p(-10+lx,-32+bob,4,14,A);p(-10+lx,-19+bob,4,4,gl);
 p(-7+lx,-33+bob,14,16,top);
 if(!L.t){p(-1+lx,-31+bob,2,9,'#00000033',0);p(-6+lx,-26+bob,12,1,'#00000022',0)}
 const vs=ap('vest');if(vs){p(-7+lx,-33+bob,4,16,vs);p(3+lx,-33+bob,4,16,vs)}
 if(ap('belt'))p(-7+lx,-19,14,2,ap('belt'));if(ap('sash')){p(-7+lx,-19,14,3,ap('sash'));p(-9+lx,-19,3,8,ap('sash'))}
 if(ap('trim'))p(-1+lx,-33+bob,2,16,ap('trim'));if(ap('tie'))p(-1+lx,-33+bob,2,9,ap('tie'));if(ap('badge'))p(2+lx,-30+bob,3,3,'#e0b040');
 if(ap('chain')){p(-3+lx,-33+bob,6,1,'#ffd23f');p(-2+lx,-32+bob,4,1,'#ffd23f')}
 if(ap('feathers')){p(-9+lx,-34+bob,5,5,'#2a2a34');p(4+lx,-34+bob,5,5,'#2a2a34')}
 if(ap('bolt'))p(2+lx,-30+bob,3,4,'#ffd23f');
 p(-5+lx,y0,10,10,sk);
 if(['short','spike','capony','cap','slick','pony','bandana'].includes(hs)&&H){p(-5+lx,y0-2,10,4,H);p(-6+lx,y0,2,5,H)}
 if(hs==='spike'){p(-4+lx,y0-5,2,3,H);p(-1+lx,y0-6,2,4,H);p(2+lx,y0-5,2,3,H)}
 if(hs==='long'||hs==='curly')p(-7+lx,y0-2,12,4,H);
 if(hs==='curly')[[-7,-4],[-2,-6],[3,-4],[-8,0]].forEach(([a,b])=>p(a+lx,y0+b,5,5,H));
 if(hs==='cap'||hs==='capony'){p(-6+lx,y0-4,12,5,hc);p(4+lx,y0-1,8,2,'#111')}
 if(hs==='beanie')p(-6+lx,y0-3,12,5,hc);
 if(hs==='bandana'){p(-5+lx,y0,10,3,hc);p(-9+lx,y0+1,4,2,hc)}
 if(hs==='mask'){p(-5+lx,y0-1,10,11,hc);p(1+lx,y0+3,4,2,sk);p(-1+lx,y0,3,3,'#c0c8d0')}
 if(hs==='hood'){p(-6+lx,y0-4,12,5,hc);p(-6+lx,y0,3,10,hc)}
 if(hs==='tricorn'){p(-8+lx,y0-4,16,4,hc);p(-4+lx,y0-8,8,4,hc);p(-1+lx,y0-6,2,2,'#eee')}
 if(ap('tophat')){p(-5+lx,y0-9,10,8,ap('tophat'));p(-7+lx,y0-2,14,2,ap('tophat'))}
 const bd=ap('beard');if(bd)p(-4+lx,y0+6,9,4,bd);const ms=ap('mustache');if(ms)p(lx,y0+5,6,2,ms);
 if(ap('shades'))p(lx,y0+3,7,2,'#111');if(ap('goggles'))p(-4+lx,y0-3,9,3,'#8ac');if(ap('scarf'))p(-5+lx,y0+6,10,4,ap('scarf'));
 const bn=ap('band');if(bn){p(-5+lx,y0+1,10,2,bn);p(-9+lx,y0+2,4,2,bn)}
 if(ap('monocle'))p(2+lx,y0+3,3,3,'#d4a017');if(ap('nose'))p(5+lx,y0+5,3,3,'#e53935');if(ap('hoops'))p(-6+lx,y0+6,2,3,'#d4a017');
 if(hs==='robot'){p(1+lx,y0+3,3,3,'#ff3b1d',0);p(1+lx,y0+7,5,2,'#222',0)}else if(!ap('shades'))p(2+lx,y0+3,2,2,hurt?'#d00':'#111',0);
 if(st==='atk'||st==='sp'){const l=st==='sp'?20:16;p(4+lx,-31,l,4,A);p(4+l+lx,-32,6,6,gl);if(st==='sp'){p(4+lx,-26,18,4,A);p(22+lx,-27,6,6,gl)}}
 else if(st==='guard'){p(3+lx,-40+bob,4,14,A);p(3+lx,-44+bob,5,5,gl)}
 else{p(5+lx,-32+bob,4,6,A);p(7+lx,-38+bob,4,8,A);p(7+lx,-42+bob,5,5,gl)}
 for(const[a,b,w2,h,c]of P){x.fillStyle='#0c0c12';x.fillRect((a-1)*u,(b-1)*u,(w2+2)*u,(h+2)*u)}
 for(const[a,b,w2,h,c,n]of P){x.fillStyle=n===0?c:hurt?shd(c,80):c;x.fillRect(a*u,b*u,w2*u,h*u);if(n!==0&&w2>3){x.fillStyle=shd(c,-35);x.fillRect((a+w2-1)*u,b*u,u,h*u)}}}
