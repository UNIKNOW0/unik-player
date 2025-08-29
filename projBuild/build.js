// projBuild/build.nexe.mjs  (ESM)
import path from 'path';
import fs from 'fs';
import { build as esbuild } from 'esbuild';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND = path.join(__dirname, '../backend');
const FRONT = path.join(__dirname, '../frontBuild');
const OUT_DIR = path.join(__dirname, './dist');
const OUT_EXE = path.join(OUT_DIR, 'unikPlayer.exe');
const TMP_DIR = path.join(__dirname, '.tmp_bundle');
const TMP_BUNDLE = path.join(TMP_DIR, 'backend.bundle.cjs');

if (!fs.existsSync(BACKEND) || !fs.existsSync(FRONT)) {
  console.error('Ошибка: не найдены папки backend и frontBuild рядом с projBuild');
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

console.log('1) Bundling backend (ESM → CJS) via esbuild ->', TMP_BUNDLE);
await esbuild({
  entryPoints: [path.join(BACKEND, 'index.js')],
  bundle: true,
  platform: 'node',
  target: ['node20'],
  format: 'cjs',
  outfile: TMP_BUNDLE,
  sourcemap: false,
  logLevel: 'info',
  define: {
    'import.meta.url': '___import_meta_url___'
  },
  banner: {
    js:
      'const ___import_meta_url___ = (typeof __filename !== "undefined" ? require("url").pathToFileURL(__filename).href : require("url").pathToFileURL(process.execPath).href);\n'
  }
});

console.log('2) Trying to compile with nexe (prebuilt target first)');

let nexe;
try {
  nexe = await import('nexe'); // dynamic import - works for ESM or CommonJS nexe package
} catch (err) {
  console.warn('nexe import failed, will try CLI fallback. Error:', err && err.message);
}

const target = 'windows-x64-20.19.4'; // target Node version to embed; change if you want another
const resources = [
  path.join(FRONT, '**', '*'),
  path.join(BACKEND, '**', '*')
];

async function tryCompile(opts) {
  if (nexe && (nexe.compile || nexe.default?.compile)) {
    const compileFn = nexe.compile || nexe.default.compile || nexe.default || nexe;
    console.log('Using nexe API to compile — this may download or build Node depending on target');
    return compileFn(opts);
  } else {
    // CLI fallback: spawn npx nexe or ./node_modules/.bin/nexe if installed locally
    const { spawn } = await import('child_process');
    const bin = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'nexe.cmd' : 'nexe');
    const args = [
      TMP_BUNDLE,
      '--target', target,
      '--resource', `${FRONT}`,
      '--resource', `${BACKEND}`,
      '--output', OUT_EXE
    ];
    console.log('FALLBACK: running nexe CLI:', bin, args.join(' '));
    return new Promise((resolve, reject) => {
      const p = spawn(bin, args, { stdio: 'inherit' });
      p.on('close', code => code === 0 ? resolve() : reject(new Error('nexe CLI exit ' + code)));
      p.on('error', err => reject(err));
    });
  }
}

// First try: no build (use prebuilt). If it fails complaining about missing prebuilt for that target, retry with build:true
try {
  await tryCompile({
    input: TMP_BUNDLE,
    output: OUT_EXE,
    target,
    resources,
    build: false
  });
  console.log('✅ EXE built (prebuilt target used) ->', OUT_EXE);
} catch (err) {
  console.warn('Prebuilt compile failed (will retry with build:true). Error:', err && err.message);
  // Retry with build:true (this requires Windows build toolchain)
  try {
    await tryCompile({
      input: TMP_BUNDLE,
      output: OUT_EXE,
      target,
      resources,
      build: true,       // force building Node from source
      vcBuild: ['nosign', 'release', 'x64']
    });
    console.log('🔥 EXE built with build:true ->', OUT_EXE);
  } catch (err2) {
    console.error('Build with build:true failed — see error below:\n', err2);
    process.exit(1);
  }
} finally {
  // clean tmp
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}
}
