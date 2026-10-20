// id, nombre, color, jefe(1/0), fuerza, velocidad
const FL=[['rex','REX','#e53935',0,5,2],['kira','KIRA','#8e24aa',0,3,5],['tigre','TIGRE','#fb8c00',0,4,4],['bruno','BRUNO','#1e88e5',0,5,2],['luna','LUNA','#43a047',0,3,4],['zeta','ZETA','#fdd835',0,2,5],['chispa','CHISPA','#00bcd4',0,4,3],['don_fierro','DON FIERRO','#ffa000',0,4,2],['titan','TITÁN','#ffd600',0,5,2],['ramos','RAMOS','#3949ab',0,3,3],['lobo','LOBO','#6b8e23',0,4,3],['vega','VEGA','#5c6bc0',0,3,4],['venus','VENUS','#ec407a',0,3,4],
['tony','TONY','#c62828',1,5,2],['maestro_dragon','M. DRAGÓN','#d32f2f',1,4,4],['capitan_rata','C. RATA','#ffb300',1,3,4],['maquinista','MAQUINISTA','#fbc02d',1,4,3],['comisario_plomo','C. PLOMO','#1976d2',1,4,3],['mole_3000','MOLE-3000','#ff6d00',1,5,2],['gran_pipo','GRAN PIPO','#e53935',1,3,4],['reina_cobra','R. COBRA','#2e7d32',1,3,5],['baron','BARÓN','#7e57c2',1,4,3],['don_cuervo','DON CUERVO','#d50000',1,5,4]];
const FD={};FL.forEach(a=>FD[a[0]]={id:a[0],n:a[1],c:a[2],b:a[3],f:a[4],v:a[5]});
// fondo de cada jefe: assets/niveles/<nombre>.png
const BG={tony:'01_barrio',maestro_dragon:'02_barrio_chino',capitan_rata:'03_muelle',maquinista:'04_subte',comisario_plomo:'05_comisaria',mole_3000:'06_fabrica',gran_pipo:'07_circo',reina_cobra:'08_azotea',baron:'09_mansion',don_cuervo:'11_torre'};
if(typeof module!=='undefined')module.exports={FD,FL,BG};
