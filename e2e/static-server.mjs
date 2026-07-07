// Minimal static server for the prerendered browser build (serves hydration bundle too).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';

const ROOT = join(process.cwd(), process.env.ROOT || 'dist/playground/browser');
const ROOT_PREFIX = ROOT.endsWith(sep) ? ROOT : ROOT + sep;
const PORT = Number(process.env.PORT) || 4000;
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

http
  .createServer(async (req, res) => {
    try {
      const path = decodeURIComponent((req.url || '/').split('?')[0]);
      let file = normalize(join(ROOT, path));
      if (file !== ROOT && !file.startsWith(ROOT_PREFIX)) {
        res.writeHead(403);
        return res.end();
      }
      // prerendered route dirs (e.g. /demo -> /demo/index.html); SPA fallback to root index.html
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (path === '/' || !existsSync(file)) file = join(ROOT, 'index.html');
      if (file !== ROOT && !file.startsWith(ROOT_PREFIX) && file !== join(ROOT, 'index.html')) {
        res.writeHead(403);
        return res.end();
      }
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  })
  .listen(PORT, () => console.log(`static :${PORT}`));
