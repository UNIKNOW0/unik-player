const { SMTCListener } = require('./funcs/SMTC.js');
const { makingAppDataDir } = require('./funcs/folder.js');
const { openSite } = require('./funcs/openLocalSite.js');
const { startFrontendServer } = require('./funcs/server.js');
const { systemTray } = require('./funcs/tray.js');

makingAppDataDir()
SMTCListener()
systemTray()

try {
  frontendServer = startFrontendServer({ port: 27272 });
  openSite()
} catch (e) {
  console.error('Не удалось поднять фронтенд:', e.message);
}



