export default {
  async fetch(request) {
    return new Response("Ich bin Mira. Der Worker lebt.", {
      headers: { "content-type": "text/plain" },
    });
  },
};
