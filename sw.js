// Service worker de la app instalable. Guarda sólo la página contenedora y los
// íconos para que abra rápido; la app de Streamlit (otro dominio) siempre se
// carga desde internet. Al cambiar index.html o los íconos, subir la versión.
const CACHE = "ctdn-pwa-v3";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./iconos/icono-192.png",
  "./iconos/icono-512.png",
  "./iconos/apple-touch-icon.png",
  "./iconos/favicon-32.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  if (peticion.method !== "GET" || new URL(peticion.url).origin !== self.location.origin) {
    return; // Streamlit y Supabase van directo a internet.
  }
  if (peticion.mode === "navigate") {
    // Página: primero internet (para tomar cambios), si no hay, la guardada.
    // "no-cache" obliga a revisar con el servidor aunque el navegador tenga
    // una copia reciente (GitHub Pages permite reutilizarla 10 minutos).
    evento.respondWith(
      fetch(peticion, { cache: "no-cache" })
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copia));
          return respuesta;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  evento.respondWith(caches.match(peticion).then((guardada) => guardada || fetch(peticion)));
});
