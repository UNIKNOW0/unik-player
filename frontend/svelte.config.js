import adapter from '@sveltejs/adapter-static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html', // для SPA-роутинга
      pages: path.resolve(__dirname, '../tray/unikPlayer/resources'),
      assets: path.resolve(__dirname, '../tray/unikPlayer/resources'),
    }),
    prerender: {
      entries: ['*']
    }
  }
};

export default config;