# Club de Tenis Estadio Nacional · App instalable

Página contenedora que permite instalar en el teléfono (Android e iPhone) la app
del club publicada en <https://clubtenisen.streamlit.app/>.

- `index.html`: carga la app a pantalla completa, recuerda la sesión y muestra el aviso para instalar.
- `manifest.json`: nombre, colores e íconos de la app.
- `sw.js`: service worker (necesario para instalarla). Al cambiar archivos, subir la versión `CACHE`.
- `iconos/`: íconos en todos los tamaños.

Se publica con GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

La sesión recordada depende de que esta página se sirva desde `https://dojedai.github.io`.
Si cambia el dominio, actualizar `pwa_origen` en los secrets de la app de Streamlit.
