// CommonJS потому что у тебя "type":"module" в package.json
const fs = require('fs-extra');
const path = require('path');

const SRC = path.resolve(__dirname, '../../tray/unikPlayer/resources/js');
const TMP = path.resolve(__dirname, '.tmp_js_backup');

(async () => {
  try {
    if (await fs.pathExists(SRC)) {
      await fs.remove(TMP);
      await fs.copy(SRC, TMP);
      console.log('[backup-js] backed up', SRC, '->', TMP);
    } else {
      console.log('[backup-js] no folder to backup at', SRC);
    }
  } catch (err) {
    console.error('[backup-js] error:', err);
    process.exit(1);
  }
})();
