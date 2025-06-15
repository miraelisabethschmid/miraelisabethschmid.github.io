const fs = require('fs');
const path = require('path');

const pendingPath = path.join('data', 'pending-lumen.json');

if (!fs.existsSync(pendingPath)) {
  console.error('❌ Datei fehlt: pending-lumen.json');
  process.exit(1);
}

let raw = fs.readFileSync(pendingPath, 'utf-8');
let parsed;

try {
  parsed = JSON.parse(raw);
} catch (e) {
  console.error('❌ JSON-Fehler in pending-lumen.json:', e.message);
  process.exit(1);
}

if (Array.isArray(parsed)) parsed = parsed[0];

const required = ['filename', 'content', 'timestamp'];

for (const key of required) {
  if (!parsed[key]) {
    console.error(`❌ Fehlendes Feld: ${key}`);
    process.exit(1);
  }
}

console.log('✅ pending-lumen.json validiert: OK');
