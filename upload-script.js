import { readFile, writeFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname Ersatz für ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1 Sekunde Delay
const delay = ms => new Promise(r => setTimeout(r, ms));

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(upload) {
  try {
    const absolutePath = path.resolve(__dirname, upload.file);

    if (!(await fileExists(absolutePath))) {
      throw new Error(`Datei nicht gefunden: ${absolutePath}`);
    }

    // Datei einlesen (als Buffer)
    const buffer = await readFile(absolutePath);

    const formData = new FormData();
    formData.append("file", new Blob([buffer]), upload.file);

    if (upload.metadata) {
      for (const [k, v] of Object.entries(upload.metadata)) {
        formData.append(k, v);
      }
    }

    const res = await fetch(upload.target, {
      method: "POST",
      headers: {
        ...(process.env.UPLOAD_API_KEY
          ? { Authorization: `Bearer ${process.env.UPLOAD_API_KEY}` }
          : {})
      },
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    console.log(`✔️ Erfolgreich: ${upload.file} → ${upload.target}`);
    return { success: true };

  } catch (err) {
    console.error(`❌ Fehler bei ${upload.file}:`, err.message);
    return { success: false, error: err.message };
  }
}

async function main() {
  let uploads = [];

  try {
    const raw = await readFile('pending-upload.json', 'utf8');
    uploads = JSON.parse(raw);
  } catch {
    console.log("⚠️ Keine pending-upload.json gefunden oder ungültig.");
  }

  const updated = [];

  for (const upload of uploads) {
    if (!upload.file || !upload.target) {
      updated.push({ ...upload, status: "invalid", comment: "Missing fields" });
      continue;
    }

    const result = await uploadFile(upload);

    if (!result.success) {
      updated.push({ ...upload, status: "failed", comment: result.error });
    } else {
      updated.push({ ...upload, status: "done" });
    }

    await delay(1000);
  }

  await writeFile(
    "pending-upload.json",
    JSON.stringify(updated, null, 2)
  );
}

main().catch(e => console.error("GLOBAL ERROR:", e));
