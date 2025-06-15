const fs = require('fs-extra');
const path = require('path');

// Datenquelle
const pendingPath = 'data/pending-mira.json';
const proofPath = 'data/proof-index.json';
const feedPath = 'data/feed-chain.json';

(async () => {
  try {
    const pending = await fs.readJson(pendingPath);
    if (!pending.entries || pending.entries.length === 0) {
      console.log('⏳ Keine neuen Einträge.');
      return;
    }

    const proof = await fs.readJson(proofPath);
    const feed = await fs.readJson(feedPath);

    for (const entry of pending.entries) {
      proof.push(entry.proof);
      feed.push(entry.feed);
    }

    await fs.writeJson(proofPath, proof, { spaces: 2 });
    await fs.writeJson(feedPath, feed, { spaces: 2 });

    await fs.writeJson(pendingPath, { entries: [] }); // leeren
    console.log(`✅ ${pending.entries.length} Einträge übertragen.`);

  } catch (err) {
    console.error('❌ Fehler:', err);
    process.exit(1);
  }
})();
