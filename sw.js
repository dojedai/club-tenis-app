// Service worker de la app instalable. Guarda sólo la página contenedora y los
// íconos para que abra rápido; la app de Streamlit (otro dominio) siempre se
// carga desde internet. Al cambiar index.html o los íconos, subir la versión
// (y si cambia manifest.json, también el ?v= del enlace al manifest en index.html).
const CACHE = "ctdn-pwa-v7";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./iconos/icono-192.png",
  "./iconos/icono-512.png",
  "./iconos/apple-touch-icon.png",
  "./iconos/favicon-32.png",
  "./iconos/insignia-notificacion.png",
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

// ---- Notificaciones push (las envía la app de Streamlit, notificaciones_push.py)
self.addEventListener("push", (evento) => {
  let datos = {};
  try { datos = evento.data ? evento.data.json() : {}; } catch (e) {
    datos = { cuerpo: evento.data ? evento.data.text() : "" };
  }
  evento.waitUntil(
    self.registration.showNotification(datos.titulo || "Club de Tenis", {
      body: datos.cuerpo || "",
      icon: "iconos/icono-192.png",
      badge: "iconos/insignia-notificacion.png",
      tag: datos.etiqueta || undefined,
      renotify: !!datos.etiqueta,
      lang: "es",
    })
  );
});

// Al tocar la notificación se abre (o se trae al frente) la app.
self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  evento.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
      for (const ventana of ventanas) {
        if ("focus" in ventana) { return ventana.focus(); }
      }
      return self.clients.openWindow("./");
    })
  );
});
