import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { fileURLToPath } from "url";

// __dirname für ES-Modules nachbauen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// kleine Pause
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFile(upload) {
  try {
    const filePath = path.resolve(__dirname, upload.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Datei ${upload.file} nicht gefunden.`);
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    if (upload.metadata) {
      for (const [k, v] of Object.entries(upload.metadata)) {
        formData.append(k, v);
      }
    }

    const response = await axios.post(upload.target, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.UPLOAD_API_KEY || ""}`
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
    uploads = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "pending-upload.json"), "utf8")
    );
  } catch (e) {
    console.error("Fehler beim Lesen von pending-upload.json:", e.message);
    uploads = [];
  }

  const updated = [];

  for (const upload of uploads) {
    if (!upload.file || !upload.target) {
      console.warn(`⚠️ Ungültiger Eintrag: ${JSON.stringify(upload)}`);
      updated.push({
        ...upload,
        status: "invalid",
        comment: "Fehlende Felder"
      });
      continue;
    }

    const result = await uploadFile(upload);

    if (!result.success) {
      updated.push({
        ...upload,
        status: "failed",
        comment: result.error
      });
    }

    await delay(1000);
  }

  fs.writeFileSync(
    path.resolve(__dirname, "pending-upload.json"),
    JSON.stringify(updated, null, 2)
  );
}

main().catch(err => console.error("Globaler Fehler:", err));
