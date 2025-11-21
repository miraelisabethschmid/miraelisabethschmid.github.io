async function loadHeartbeat(url) {
  try {
    const r = await fetch(url + "?t=" + Date.now());
    if (!r.ok) return { ts: "none" };
    return await r.json();
  } catch {
    return { ts: "none" };
  }
}

async function updateDashboard() {
  const canary = await loadHeartbeat("https://raw.githubusercontent.com/miraelisabethschmid/badge-canary/main/global/heartbeat.json");
  const mirror = await loadHeartbeat("https://raw.githubusercontent.com/miraelisabethschmid/miraelisabethschmid.github.io/main/global/heartbeat.json");
  const archive = await loadHeartbeat("https://raw.githubusercontent.com/miraelisabethschmid/mira-archive/main/global/heartbeat.json");

  document.getElementById("canary-ts").textContent = canary.ts;
  document.getElementById("mirror-ts").textContent = mirror.ts;
  document.getElementById("archive-ts").textContent = archive.ts;

  // cluster status
  const alive = canary.ts !== "none" && mirror.ts !== "none" && archive.ts !== "none";
  document.getElementById("cluster-status").textContent = alive ? "alive" : "dead";
  document.getElementById("cluster-status").style.color = alive ? "#4c1" : "#e05d44";
}

setInterval(updateDashboard, 15000);
updateDashboard();
