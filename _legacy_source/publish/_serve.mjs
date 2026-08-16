import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg' };

http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent((req.url || '/').split('?')[0]) || '/index.html');
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(p === root ? path.join(root, 'index.html') : p, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(p).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8000, () => console.log('http://localhost:8000'));
