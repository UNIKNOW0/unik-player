import { SMTCListener } from './funcs/SMTC.js';
import { makingAppDataDir } from './funcs/folder.js'
import { startFrontendServer } from './funcs/server.js';

makingAppDataDir()
SMTCListener()
let frontendServer;
try {
  frontendServer = startFrontendServer({ port: 27272 });
} catch (e) {
  console.error('Не удалось поднять фронтенд:', e.message);
}