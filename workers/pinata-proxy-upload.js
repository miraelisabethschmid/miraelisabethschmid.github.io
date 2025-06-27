export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Nur POST erlaubt", { status: 405 });
    }

    const { filename, content } = await request.json();

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.PINATA_SECRET_JWT}`
      },
      body: createFormData(filename, content)
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  }
};

function createFormData(filename, contentBase64) {
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  const payload = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/octet-stream\r\n\r\n${atob(contentBase64)}\r\n--${boundary}--`;

  return new Blob([payload], { type: `multipart/form-data; boundary=${boundary}` });
}
