
// tray.js (ESM)
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Systray = require('systray');

const systrayMod = require('systray'); // гарантированно загрузит CJS модуль если он такой


function systemTray(){

// для отладки — посмотри, что реально экспортирует пакет (удали после)
console.log('systray export keys:', Object.keys(systrayMod));
console.dir(systrayMod, { depth: 1 });

// выбираем конструктор
const SystrayCtor = systrayMod.Systray || systrayMod.SysTray || systrayMod.default || systrayMod;

if (typeof SystrayCtor !== 'function') {
  throw new Error('Не удалось найти конструктор Systray/SysTray в пакете systray. Смотри лог выше.');
}

// === Настройки ===
const SITE_URL = 'http://localhost:27272';
const ICON_PATH = path.resolve('./static/trayIcon.ico');
const KILL_TARGET_BY_NAME = 'myapp.exe';

let iconBase64 = '';
try {
  const buf = fs.readFileSync(ICON_PATH);
  iconBase64 = buf.toString('base64');
} catch (err) {
  console.warn('Icon not found, tray may show default icon.');
}

// создаём
const systray = new SystrayCtor({
  menu: {
    icon: iconBase64,            // глобально — base64 .ico/.png
    title: 'MyTray',
    tooltip: 'MyTray tooltip',
    items: [
      { title: 'Open site',    tooltip: 'Открыть сайт',    enabled: true },
      { title: 'Quit',         tooltip: 'Выйти',          enabled: true }
    ]
  }
});


systray.onClick(({ seq_id }) => {
  switch (seq_id) {
    
    case 0: { // Open site
      const cmd = process.platform === 'win32'
        ? `start "" "${SITE_URL}"`
        : process.platform === 'darwin'
          ? `open "${SITE_URL}"`
          : `xdg-open "${SITE_URL}"`;
      exec(cmd, err => err && console.error('open url error', err));
      break;
    }

    case 1: { // Quit
      systray.kill(() => process.exit(0));
      break;
    }

    default:
      console.warn('Unknown tray action', seq_id);
  }
});


}

module.exports = { systemTray }