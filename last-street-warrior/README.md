# Last Street Warrior — Fase 2

Juego de pelea callejera para TV con celulares como mando. Esta versión ya usa las **ilustraciones reales** de 4 luchadores:
**Comisario Plomo, Kira, Rex y Tigre** (los otros 19 aparecen como "PRONTO" en la elección).

## Cómo probarlo
1. Necesitas Node.js (v16 o más) en una PC en el mismo wifi que los celulares.
2. En esta carpeta: `node server.js`
3. Abre `http://localhost:3000` en el navegador de la TV/PC (muestra el QR y el código de sala).
4. Cada jugador escanea el QR (celular en horizontal), pone su nombre, elige **2 luchadores** y toca LISTO.
   Si entra un solo jugador puede jugar **contra la máquina** (Fácil, Normal o Difícil).

## Reglas
- Versus por equipos de 2: cada jugador elige 2 luchadores y los cambia con **L1 / R1**. Vida y poder individuales; la vida no se recupera.
- Round de 120 s, mejor de 3. Si se acaba el tiempo gana quien tenga más vida sumada.
- **Poder** de cada luchador con 3 niveles (se carga golpeando y recibiendo golpes). **SPECIAL** usa el especial que corresponde:
  - 1 nivel: **Especial 1** (proyectil)
  - 2 niveles: **Especial 2** (ráfaga en movimiento)
  - 3 niveles: **Súper en equipo**, una escena ilustrada animada propia de cada luchador (si el compañero sigue vivo)

## Botones del mando
A golpe · B patada · D golpe pesado · C salto · SPECIAL especial · L1/R1 cambiar luchador · L2 guardia · R2 correr · STAR pausa · HOME volver a elegir.
Combinaciones: ↑+A golpe ascendente · ↓+B barrida · en el aire A o B = golpe/patada voladora · ↓ agacharse.

## Estructura
- `server.js` sala + combate (30 ticks/s) + SSE. `data.js` lista de luchadores (compartida).
- `tv.html` + `tv.js` pantalla de la TV: sprites, HUD, efectos y escenas de súper. `play.html` + `play.js` mando del celular.
- `assets/fighters/<id>/<pose>.webp` + `meta.json` (anclajes y escala) de cada luchador.
- `assets/faces/` retratos del HUD. `assets/supers/` escenas de los súper. `assets/mandos/` skins del mando. `assets/thumbs/` miniaturas.
- `assets/niveles/` fondos de nivel (WebP o PNG convertido a WebP): ahora solo `05_comisaria.webp`. Si falta el fondo de un nivel se usa la comisaría.

## Pendiente
Poses y súper de los otros 19 luchadores, escena del súper de Rex (ahora usa una versión sin escena), los otros 10 fondos, sonido y música, escenas de historia y modo historia (1 o 2 jugadores), Street Fight, y conexión con la app Android.
