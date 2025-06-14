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

// Zielpfad
const filePath = path.join('funkenzimmer', filename);

// Datei schreiben
fs.writeFileSync(filePath, content);

// Pending-Datei leeren
fs.writeFileSync(pendingPath, '');

// Log-Eintrag
console.log(`✅ Datei "${filename}" erfolgreich geschrieben mit Zeitstempel ${timestamp}.`);
