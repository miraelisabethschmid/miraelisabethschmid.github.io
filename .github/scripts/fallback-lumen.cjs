const fs = require('fs');
const path = require('path');

const pendingPath = path.join('data', 'pending-lumen.json');
if (!fs.existsSync(pendingPath)) {
  console.log('❌ Keine pending-lumen.json vorhanden.');
  process.exit(0);
}

let raw = fs.readFileSync(pendingPath, 'utf-8');
let entry;

try {
  entry = JSON.parse(raw);
} catch (e) {
  console.error('❌ JSON-Parsing fehlgeschlagen:', e.message);
  process.exit(1);
}

const fallbackPath = path.join('fallback', entry.filename || `fallback-${Date.now()}.html`);
const fallbackLogPath = path.join('data', 'grok-log.json');

// Datei schreiben
fs.mkdirSync('fallback', { recursive: true });
fs.writeFileSync(fallbackPath, entry.content || 'Fehlender Inhalt');

// Log aktualisieren
let log = [];
if (fs.existsSync(fallbackLogPath)) {
  try {
    log = JSON.parse(fs.readFileSync(fallbackLogPath, 'utf-8'));
  } catch { log = []; }
}

log.push({
  fallback: true,
  filename: fallbackPath,
  original: entry.filename || null,
  timestamp: new Date().toISOString(),
  note: 'Fallback wurde aktiviert wegen Commit-Fehler.'
});

fs.writeFileSync(fallbackLogPath, JSON.stringify(log, null, 2));

// pending-lumen.json leeren
fs.writeFileSync(pendingPath, '');

console.log(`🟡 Fallback-Commit geschrieben: ${fallbackPath}`);
