// _worker.js – Mirror Stabilizer für miraelisabethschmid.github.io
// Direkte Root-Auslieferung ohne /docs-Struktur

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // Keine Worker-Verarbeitung für statische Assets
      if (
        url.pathname.startsWith('/assets/') ||
        url.pathname.endsWith('.xml') ||
        url.pathname.endsWith('.json') ||
        url.pathname.endsWith('.txt') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.mp3') ||
        url.pathname.endsWith('.mp4')
      ) {
        return fetch(request);
      }

      // Normalen Fetch versuchen
      const response = await fetch(request);

      // Wenn Antwort ok → zurückgeben
      if (response.status < 400) {
        return response;
      }

      // Fallback: Mirror auf IPFS
      const ipfsURL =
        'https://ipfs.io/ipfs/bafkreidrvntwd4oq66zr4nwfsg3wbxgmjnhbepg7bh6btfvd2yvwextaiq';

      return Response.redirect(ipfsURL, 302);
    } catch (err) {
      // Letzter Fallback-Notanker
      return new Response(
        JSON.stringify({
          error: 'Worker Failure',
          message: err.toString(),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
