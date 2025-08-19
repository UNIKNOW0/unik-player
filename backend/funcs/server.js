// backend/funcs/server.js
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeMap = {
  html: 'text/html; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  webp: 'image/webp'
};

export function startFrontendServer(options = {}) {
  const port = options.port || 27272;

  // путь к tray/unikPlayer/resources
  const defaultStatic = path.resolve(
    __dirname,
    '..',
    '..',
    'tray',
    'unikPlayer',
    'resources'
  );

  const staticDir = options.staticDir ? path.resolve(options.staticDir) : defaultStatic;
  const indexPath = path.join(staticDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found at ${indexPath}`);
  }

  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (pathname === '/') pathname = '/index.html';

    const requested = path.normalize(path.join(staticDir, pathname));
    if (!requested.startsWith(staticDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(requested, (err, stats) => {
      let toServe = requested;
      if (err || !stats.isFile()) {
        toServe = indexPath;
      }

      fs.readFile(toServe, (readErr, data) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Server error');
          return;
        }
        const ext = path.extname(toServe).slice(1).toLowerCase();
        const mime = mimeMap[ext] || 'application/octet-stream';
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
