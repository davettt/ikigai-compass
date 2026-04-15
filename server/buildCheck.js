import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function newestMtime(dir) {
  let newest = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        newest = Math.max(newest, newestMtime(full));
      } else {
        newest = Math.max(newest, fs.statSync(full).mtimeMs);
      }
    }
  } catch {
    /* directory doesn't exist */
  }
  return newest;
}

let _stale = false;

try {
  const markerPath = path.join(ROOT, '.last-build');
  const buildTime = parseInt(fs.readFileSync(markerPath, 'utf8'), 10);
  const srcTime = Math.max(
    newestMtime(path.join(ROOT, 'src')),
    newestMtime(path.join(ROOT, 'server'))
  );
  _stale = srcTime > buildTime;
  if (_stale) {
    console.warn(
      '⚠ Build is stale — source files changed since last build. Run: npm run restart:pm2'
    );
  }
} catch {
  _stale = false;
}

export const buildStale = _stale;
