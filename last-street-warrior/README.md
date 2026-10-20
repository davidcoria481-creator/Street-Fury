# Last Street Warrior

Juego de pelea callejera para TV con celulares como mando. Esta es la **Fase 1: modo Versus 2 contra 2 (tag)**.

## Cómo probarlo
1. Instala Node.js (v16 o más) en una PC conectada al mismo wifi que los celulares.
2. En esta carpeta: `node server.js`
3. Abre `http://localhost:3000` en el navegador de la TV/PC (muestra el QR y el código de sala).
4. Cada jugador escanea el QR con su celular (gira el celular en horizontal), pone su nombre, elige **2 luchadores** y toca LISTO.

## Reglas implementadas
- 2 jugadores, cada uno con 2 luchadores (de 23). Cambian con **L1 o R1** (espera de 1,5 s).
- Vida por luchador (3 partes), no se recupera. Poder por luchador (3 niveles); con las 3 llenas, **SPECIAL** hace el especial.
- Round de 120 s; mejor de 3. Si se acaba el tiempo gana quien tenga más vida sumada. Vida y poder se reinician cada round.
- Mando con la skin del luchador activo: los botones se iluminan al tocarlos, el celular vibra al recibir un golpe y vibra más al caer un luchador (Android).
- Un solo jugador puede jugar **contra la máquina** (Fácil, Normal o Difícil) desde la sala. Solo en versus; el modo historia será de 1 o 2 jugadores.

## Botones
A golpe · B patada · C salto · SPECIAL especial · L1/R1 cambiar luchador · L2 guardia · R2 correr · STAR pausa · HOME volver a elegir · VIB activar/apagar vibración.
(D, agarrar, y SELEC y MÚSICA todavía no hacen nada.)

## Estructura
- `server.js` sala + lógica del combate (30 ticks/s) + eventos SSE. `data.js` lista de luchadores (compartida).
- `tv.html` + `tv.js` pantalla de la TV (lobby, elección, pelea en canvas). `play.html` + `play.js` mando del celular.
- `sprite.js` pixel art de los 23 luchadores (ficha `LOOK` por luchador + poses). Abre `preview.html` en el navegador para verlos.
- `assets/mandos/<id>.webp` skins del mando. `assets/thumbs/<id>.webp` miniaturas. `qr.js` generador de QR (del juego UNO).
- `assets/niveles/` **aquí van los fondos** (PNG): `01_barrio.png`, `02_barrio_chino.png`, `03_muelle.png`, `04_subte.png`, `05_comisaria.png`, `06_fabrica.png`, `07_circo.png`, `08_azotea.png`, `09_mansion.png`, `11_torre.png`. Si falta, se usa un fondo de color.

## Ajustar los botones táctiles
Las zonas táctiles de `play.js` (`TPL` y `OV`) están medidas en pantalla de 1672x941 y son aproximadas. Abre el mando con `?debug=1` en la URL para verlas con borde verde y corregir las de cada skin en `OV`.

## Pendiente
Más poses (salto, caída, agarre) y animaciones, especiales propios, agarre (D), Street Fight (remate final), música y efectos, escenas de historia y modo historia/arcade, y conexión con la app Android (ahora solo corre en Node).
