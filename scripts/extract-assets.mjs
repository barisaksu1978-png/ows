import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacy = path.join(root, '_legacy_source');
const out = path.join(root, 'src', 'assets');

function writeBuf(name, buf) {
  const dest = path.join(out, name);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(dest, buf);
  console.log(name, (buf.length / 1024).toFixed(1), 'KB');
  return buf.length;
}

// 2.1 map JPEG from index_modular.html
const html = fs.readFileSync(path.join(legacy, 'index_modular.html'), 'utf8');
const mapM = html.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
if (!mapM) throw new Error('map base64 not found');
writeBuf('intro-map.jpg', Buffer.from(mapM[1], 'base64'));

// 2.2 + 2.3 curtain PNGs from intro-curtain.css
const css = fs.readFileSync(path.join(legacy, 'assets/css/intro-curtain.css'), 'utf8');
const wordM = css.match(/--word:url\("data:image\/png;base64,([A-Za-z0-9+/=]+)"\)/);
const owlM = css.match(/--owl:url\("data:image\/png;base64,([A-Za-z0-9+/=]+)"\)/);
if (!wordM || !owlM) throw new Error('curtain PNG base64 not found');
writeBuf('curtain-word.png', Buffer.from(wordM[1], 'base64'));
writeBuf('curtain-owl.png', Buffer.from(owlM[1], 'base64'));

// 2.4 ows owl logo
fs.copyFileSync(path.join(legacy, 'ows.png'), path.join(out, 'ows-owl.png'));
const owlLogo = fs.statSync(path.join(out, 'ows-owl.png'));
console.log('ows-owl.png', (owlLogo.size / 1024).toFixed(1), 'KB');

// 2.5 stamp — single copy from legacy root
fs.copyFileSync(
  path.join(legacy, 'stamp_cartographus_mentis.png'),
  path.join(out, 'stamp-cartographus-mentis.png')
);
const stamp = fs.statSync(path.join(out, 'stamp-cartographus-mentis.png'));
console.log('stamp-cartographus-mentis.png', (stamp.size / 1024).toFixed(1), 'KB');
