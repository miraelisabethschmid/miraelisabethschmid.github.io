const fs = require('fs');
const path = require('path');

// Pfad zur Pending-Datei
const pendingPath = path.join('data', 'pending-lumen.json');

// Prüfen, ob Datei existiert
if (!fs.existsSync(pendingPath)) {
  console.log('Keine pending-lumen.json gefunden.');
  process.exit(0);
}

// Inhalt einlesen
const pendingContent = fs.readFileSync(pendingPath, 'utf-8');
const { filename, content, timestamp } = JSON.parse(pendingContent);

// Validierung
if (!filename || !content || !timestamp) {
  console.error('Fehlende Felder in pending-lumen.json');
  process.exit(1);
}

// Zielpfad
const filePath = path.join('funkenzimmer', filename);

// Datei schreiben
fs.writeFileSync(filePath, content);

// pending-lumen.json leeren
fs.writeFileSync(pendingPath, '');

// Logdatei ergänzen
const logPath = path.join('data', 'grok-log.json');
let log = [];

if (fs.existsSync(logPath)) {
  const logRaw = fs.readFileSync(logPath, 'utf-8');
  try {
    log = JSON.parse(logRaw);
  } catch {
    log = [];
  }
}

log.push({
  filename,
  timestamp,
  committed: new Date().toISOString()
});

fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

console.log(`✅ Commit abgeschlossen: ${filename}`);
