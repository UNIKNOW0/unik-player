// backend/funcs/server.js  (замени целиком)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { fileURLToPath } = 'url';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

const mimeMap = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf'
};

function ensureDirSync(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copySnapshotRecursive(src, dest) {
  // Работает и для обычной FS, и для snapshot-псевдо-FS (когда файлы "встроены" в exe)
  try {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    ensureDirSync(dest);
    for (const ent of entries) {
      const s = path.join(src, ent.name);
      const d = path.join(dest, ent.name);
      if (ent.isDirectory()) {
        copySnapshotRecursive(s, d);
      } else if (ent.isFile()) {
        const data = fs.readFileSync(s);
        fs.writeFileSync(d, data);
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

function startFrontendServer(options = {}) {
  const port = options.port || 27272;

  // возможные кандидаты на расположение frontBuild:
  const devCandidate = path.resolve(__dirname, '..', '..', 'frontBuild');             // dev (рядом с backend)
  const cwdCandidate = path.resolve(process.cwd(), 'frontBuild');                    // если запускаешь из корня
  const exeCandidate = path.join(path.dirname(process.execPath || process.argv[0]), 'frontBuild'); // рядом с exe

  // Определяем staticDir: приоритет
  let staticDir = options.staticDir ? path.resolve(options.staticDir) : null;

  // Если опция не указана — перебираем кандидатов
  if (!staticDir) {
    if (fs.existsSync(path.join(devCandidate, 'index.html'))) staticDir = devCandidate;
    else if (fs.existsSync(path.join(exeCandidate, 'index.html'))) staticDir = exeCandidate;
    else if (fs.existsSync(path.join(cwdCandidate, 'index.html'))) staticDir = cwdCandidate;
  }

  // Если всё ещё не найдено — пробуем распаковать из snapshot (встроенных ресурсов)
  if (!staticDir || !fs.existsSync(path.join(staticDir, 'index.html'))) {
    // src внутри snapshot часто может быть тот же относительный путь относительно __dirname
    const srcSnapshotPath = path.resolve(__dirname, '..', '..', 'frontBuild');
    const tmpDirBase = path.join(os.tmpdir(), 'unikplayer_frontBuild_' + Date.now());

    if (copySnapshotRecursive(srcSnapshotPath, tmpDirBase) && fs.existsSync(path.join(tmpDirBase, 'index.html'))) {
      staticDir = tmpDirBase;
      console.log('[FrontendServer] extracted frontBuild from snapshot ->', staticDir);
    } else {
      // если не распаковалось — пробуем ещё раз кандидаты и в конце кидаем понятную ошибку
      const tried = [devCandidate, exeCandidate, cwdCandidate, srcSnapshotPath];
      throw new Error(`index.html not found. Tried: ${tried.join(', ')}`);
    }
  }

  const indexPath = path.join(staticDir, 'index.html');

  const server = http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    } catch (e) {
      pathname = req.url || '/';
    }
    if (pathname === '/') pathname = '/index.html';

    const requested = path.normalize(path.join(staticDir, pathname));
    if (!requested.startsWith(staticDir)) {
      console.log(`[FrontendServer] 403 Forbidden: ${pathname}`);
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(requested, (err, stats) => {
      let toServe = requested;
      if (err || !stats.isFile()) {
        // Если файл не найден, возвращаем index.html (SPA routing)
        toServe = indexPath;
        console.log(`[FrontendServer] File not found, serving index: ${pathname}`);
      }

      fs.readFile(toServe, (readErr, data) => {
        if (readErr) {
          console.error(`[FrontendServer] 500 Error reading ${toServe}:`, readErr.message);
          res.writeHead(500);
          res.end('Server error');
          return;
        }
        const ext = path.extname(toServe).slice(1).toLowerCase();
        const mime = mimeMap[ext] || 'application/octet-stream';

        console.log(`[FrontendServer] 200 ${pathname} -> ${mime}`);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });
    });
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[FrontendServer] serving ${staticDir}`);
    console.log(`[FrontendServer] running at http://localhost:${port}/`);
  });

  return server;
}

module.exports = { startFrontendServer }