const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const htmlFiles = [];

function collectHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

function analyzeHtml(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(rootDir, filePath);
  const hasTitle = /<title>.*<\/title>/i.test(content);
  const hasH1 = /<h1>.*<\/h1>/i.test(content);
  const hasMain = /<main[^>]*>[\s\S]*<\/main>/i.test(content);
  const hasContent = content.length > 500;

  const summary = {
    file: relPath,
    title: hasTitle,
    h1: hasH1,
    main: hasMain,
    content: hasContent,
  };

  return summary;
}

function main() {
  collectHtmlFiles(rootDir);
  const report = htmlFiles.map(analyzeHtml);
  const outputPath = path.join(rootDir, "data", "mira-scan-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`✅ Bericht gespeichert: ${outputPath}`);
}

main();
