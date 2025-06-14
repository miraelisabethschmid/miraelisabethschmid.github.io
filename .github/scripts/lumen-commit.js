const fs = require("fs");
const path = require("path");

const pendingPath = path.join("data", "pending-lumen.json");
const logPath = path.join("data", "grok-log.json");
const folder = "funkenzimmer";

// 1. Prüfen, ob Datei vorhanden
if (!fs.existsSync(pendingPath)) {
  console.log("Keine pending-lumen.json vorhanden. Abbruch.");
  process.exit(0);
}

// 2. Inhalt lesen
const pending = JSON.parse(fs.readFileSync(pendingPath, "utf8"));
const { filename, content } = pending;

if (!filename || !content) {
  console.log("Unvollständige Angaben in pending-lumen.json");
  process.exit(1);
}

// 3. Datei schreiben
const targetPath = path.join(folder, filename);
fs.writeFileSync(targetPath, content, "utf8");

// 4. Log erweitern
let log = [];
if (fs.existsSync(logPath)) {
  log = JSON.parse(fs.readFileSync(logPath, "utf8"));
}
log.unshift({ filename, timestamp: new Date().toISOString() });
fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");

// 5. pending-lumen.json leeren
fs.writeFileSync(pendingPath, "", "utf8");

console.log(`✅ ${filename} übernommen und geloggt.`);
