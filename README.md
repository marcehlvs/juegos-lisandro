# Pijamada Albiceleste (juegos-lisandro)

Juegos de la Selección Argentina para pasar por la TV en la pijamada. Pensada para 6 chicos de 8 a 9 años, en pantalla de 1920×1080.

## Juegos

1. Trivia de la Selección (37 preguntas, no se repiten durante la noche)
2. ¿Quién es? (pistas de a una; se escribe el nombre o se elige entre opciones)
3. Penales en pantalla
4. Bingo mundialista (6 cartones que se llenan solos)
5. Memoria de dorsales
6. Verdadero o falso
7. Banderas del mundo
8. Ruleta de la suerte
9. El rosco (21 letras, pasapalabra)
0. Retos del hincha

Además: modo por equipos (Celestes y Blancos), botón **Puntos** para corregir puntos, deshacer lo último o reiniciar, y podio con campeón.

## Cómo se usa

- Mouse o control remoto con puntero: tocar los botones.
- Teclado: `1` a `9` y `0` abren los juegos, `P` el podio. En las preguntas se responde con `A B C D` o `1 2 3 4`; en verdadero o falso con `V` y `F`; `Enter` pasa a lo siguiente.
- El botón "atrás" del navegador o del control vuelve al menú.
- Los nombres y puntos se guardan en el navegador. "Jugadores" permite cambiarlos.

## Desarrollo

```bash
npm install
npm run dev       # servidor local
npm run build     # genera la carpeta dist
```

## Publicar en GitHub Pages

1. Crear el repositorio `juegos-lisandro` y subir este proyecto a la rama `main`.
2. En GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Cada `push` a `main` publica solo (ver `.github/workflows/deploy.yml`).

La dirección queda `https://TU-USUARIO.github.io/juegos-lisandro/`. La app usa rutas relativas, así que funciona aunque cambie el nombre del repositorio.

## Dónde editar el contenido

- Preguntas: `src/data/questions.js`
- Jugadores de "¿Quién es?": `src/data/figures.js`
- Verdadero o falso: `src/data/vf.js`
- Rosco: `src/data/rosco.js`
- Retos: `src/data/retos.js`
- Bingo: `src/data/bingo.js`
- Banderas: `src/data/flags.jsx`


## Variantes de las actividades

- **Trivia** (3 trivias + mezcla): La Selección, Mundiales, Reglas y fútbol. Archivo: `src/data/questions.js`.
- **Verdadero o falso** (3 juegos + mezcla): La Selección, Reglas y cancha, Mundiales y países. Archivo: `src/data/vf.js`.
- **Rosco** (3): "Empieza con…", "Contiene la…" y "Mundiales y países" (mezcla ambos). Archivo: `src/data/rosco.js`.

Antes de arrancar se elige la variante (con el control o las teclas 1-4). Para agregar una más, sumá un objeto a la lista del archivo correspondiente.
- **¿Quién es?** (2 + mezcla): Campeones 2022 y Leyendas. Archivo: `src/data/figures.js` (`FIGURE_SETS`).
- **Banderas** (2 + mezcla): Sudamérica y Europa. Archivos: `src/data/flags.jsx` y `src/games/Banderas.jsx`.

## Puntos

El botón **Puntos** permite sumar o restar a mano, deshacer lo último, **reiniciar los puntos de un juego** (por ejemplo solo la trivia) o reiniciar todo a cero. Cada punto que se gana queda anotado con el juego donde se ganó.
