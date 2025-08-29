// projBuild/loader.js  (ESM) — опционально
import path from 'path';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// строим URL на backend/index.js рядом с projBuild
const entryPath = path.join(__dirname, '../backend/index.js');
const entryUrl = pathToFileURL(entryPath).href;

try {
  await import(entryUrl);
} catch (err) {
  console.error('Failed to dynamically import ESM entry:', err);
  process.exit(1);
}
