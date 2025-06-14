const fs = require('fs');
const path = require('path');

// Pfad zur Pending-Datei
const pendingPath = path.join('data', 'pending-lumen.json');

// Prüfen, ob Datei existiert
if (!fs.existsSync(pendingPath)) {
  console.log('Keine pending-lumen.json gefunden. Vorgang abgebrochen.');
  process.exit(0);
}

// Inhalt einlesen
const { filename, content, timestamp } = JSON.parse(fs.readFileSync(pendingPath, 'utf-8'));

// Datei schreiben
fs.writeFileSync(filename, content);
console.log(`✅ Datei geschrieben: ${filename}`);

// Log-Datei pflegen
const logPath = path.join('data', 'grok-log.json');
let log = [];
if (fs.existsSync(logPath)) {
  log = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
}
log.push({
  filename,
  timestamp,
  committedAt: new Date().toISOString()
});
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(`📓 Log aktualisiert: ${logPath}`);

// Pending-Datei löschen
fs.unlinkSync(pendingPath);
console.log('🗑️ pending-lumen.json gelöscht.');
