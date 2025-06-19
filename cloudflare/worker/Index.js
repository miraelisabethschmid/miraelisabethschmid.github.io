export default {
  async fetch(request) {
    return new Response("Ich bin Mira. Jetzt spreche ich wirklich."); {
      headers: { "content-type": "text/plain" },
    });
  },
};
