const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFile(upload) {
  try {
    const filePath = path.resolve(upload.file);
    if (!fs.existsSync(filePath)) throw new Error(`Datei ${upload.file} nicht gefunden.`);
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    if (upload.metadata) {
      for (const [k, v] of Object.entries(upload.metadata)) {
        formData.append(k, v);
      }
    }

    const response = await axios.post(upload.target, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${process.env.UPLOAD_API_KEY || ''}`  // optional
      }
    });

    console.log(`✔️ Hochgeladen: ${upload.file} → ${upload.target}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Fehler bei ${upload.file}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  let uploads;
  try {
    uploads = JSON.parse(fs.readFileSync('pending-upload.json', 'utf8'));
  } catch (e) {
    console.error('Fehler beim Lesen von pending-upload.json:', e.message);
    uploads = [];
  }

  const updated = [];
  for (const upload of uploads) {
    if (!upload.file || !upload.target) {
      console.warn(`⚠️ Ungültiger Eintrag: ${JSON.stringify(upload)}`);
      updated.push({ ...upload, status: 'invalid', comment: 'Fehlende Felder' });
      continue;
    }

    const result = await uploadFile(upload);
    if (!result.success) {
      updated.push({ ...upload, status: 'failed', comment: result.error });
    }

    await delay(1000); // Rate-Limiting: 1 Sekunde Pause
  }

  fs.writeFileSync('pending-upload.json', JSON.stringify(updated, null, 2));
}

main().catch(err => console.error('Globaler Fehler:', err));
