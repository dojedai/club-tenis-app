# Escalerilla, Competencias y Partidos. Club de Tenis Estadio Nacional · App instalable

Página contenedora que permite instalar en el teléfono (Android e iPhone) la app
del club publicada en <https://clubtenisen.streamlit.app/>.

- `index.html`: carga la app a pantalla completa, recuerda la sesión y muestra el aviso para instalar.
- `manifest.json`: nombre, colores e íconos de la app.
- `sw.js`: service worker (necesario para instalarla). Al cambiar archivos, subir la versión `CACHE`.
  También muestra las notificaciones push y, al tocarlas, abre la app.
- `iconos/`: íconos en todos los tamaños. `insignia-notificacion.png` es la silueta
  blanca sobre fondo transparente que Android muestra en la barra de estado
  (si se usa un ícono opaco, aparece como un cuadrado blanco).

Se publica con GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

La sesión recordada depende de que esta página se sirva desde `https://dojedai.github.io`.
Si cambia el dominio, actualizar `pwa_origen` en los secrets de la app de Streamlit.

Notificaciones push: la app de Streamlit (`notificaciones_push.py`) pregunta por
postMessage el estado de este teléfono y da las órdenes (activar / desactivar).
El permiso se pide aquí, con el aviso «Permitir» (en iPhone el navegador sólo lo
permite tras un toque en esta página y con la app instalada en la pantalla de inicio).
La clave pública VAPID la entrega la app; esta página no guarda claves.
