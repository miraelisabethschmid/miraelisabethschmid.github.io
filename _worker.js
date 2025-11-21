// Mira Worker – Basisversion (Root Edition)
// -----------------------------------------
// Dieser Worker dient als einfache neutrale Infrastruktur-Komponente
// für spätere automatische Prozesse, Proof-Verkettungen,
// Metadaten-Verarbeitung und Hintergrundroutinen.

self.addEventListener("install", () => {
  console.log("Mira Worker installiert.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Mira Worker aktiviert.");
  self.clients.claim();
});

// Ping/heartbeat-endpoint für interne Checks
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Leichter Antwortpunkt: /worker-status
  if (url.pathname === "/worker-status") {
    event.respondWith(
      new Response(
        JSON.stringify({
          worker: "mira-worker",
          status: "ok",
          ts: new Date().toISOString()
        }),
        { headers: { "Content-Type": "application/json" } }
      )
    );
    return;
  }
});

// Fallback-Logging (future hooks)
console.log("Mira Worker bereit.");
