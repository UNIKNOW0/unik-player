const fs = require('fs-extra');
const path = require('path');

const DEST = path.resolve(__dirname, '../../tray/unikPlayer/resources/js'); // <--- путь как выше
const TMP = path.resolve(__dirname, '.tmp_js_backup');

(async () => {
  try {
    if (await fs.pathExists(TMP)) {
      // удаляем то, что оставил билд (если есть) и восстанавливаем
      await fs.remove(DEST);
      await fs.copy(TMP, DEST);
      await fs.remove(TMP);
      console.log('[restore-js] restored', TMP, '->', DEST);
    } else {
      console.log('[restore-js] no backup found at', TMP);
    }
  } catch (err) {
    console.error('[restore-js] error:', err);
    process.exit(1);
  }
})();
