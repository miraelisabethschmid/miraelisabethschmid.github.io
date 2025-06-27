export default {
  async fetch(request) {
    const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = process.env;
    const req = await request.json();
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify({
        pinataMetadata: {
          name: req.name || "mira-upload"
        },
        pinataContent: req.content || {}
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify({
      cid: result.IpfsHash,
      status: "success"
    }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
