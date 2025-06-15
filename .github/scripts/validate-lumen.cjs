const fs = require('fs');
const path = require('path');

// Pfad zur pending-Datei
const pendingPath = path.join('data', 'pending-lumen.json');

// Emoji-Symbole
const error = '⛔️';
const info = 'ℹ️';

// Prüfen, ob Datei existiert
if (!fs.existsSync(pendingPath)) {
  console.error(`${error} Datei nicht gefunden: ${pendingPath}`);
  process.exit(1);
}

// Einlesen und Parsen
let raw, entry;

try {
  raw = fs.readFileSync(pendingPath, 'utf-8');
  entry = JSON.parse(raw);
} catch (e) {
  console.error(`${error} JSON-Parsing fehlgeschlagen:\n${e.message}`);
  process.exit(1);
}

// Pflichtfelder prüfen
const requiredFields = ['filename', 'content', 'timestamp'];
let valid = true;

for (const field of requiredFields) {
  if (!entry[field]) {
    console.error(`${error} Fehlendes Feld: '${field}'`);
    valid = false;
  }
}

// Zeitformat prüfen (rudimentär ISO 8601)
if (entry.timestamp && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(entry.timestamp)) {
  console.error(`${error} Ungültiges Zeitformat: '${entry.timestamp}' (erwartet: YYYY-MM-DDTHH:MM:SSZ)`);
  valid = false;
}

// Grobe HTML-Validierung (nur Marker prüfen)
if (entry.content && !entry.content.trim().startsWith('<!DOCTYPE html>')) {
  console.error(`${error} HTML-Inhalt scheint nicht mit <!DOCTYPE html> zu beginnen.`);
  valid = false;
}

if (!valid) {
  console.error(`${error} Validierung fehlgeschlagen.`);
  process.exit(1);
}

console.log(`${info} Validierung erfolgreich. Alle Pflichtfelder sind vorhanden und formal korrekt.`);
process.exit(0);
