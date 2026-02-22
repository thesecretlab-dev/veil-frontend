const fs = require('fs');
const path = require('path');

function walk(dir, prefix) {
  prefix = prefix || '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (['node_modules', '.next', '.vercel', 'api'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, prefix + '/' + e.name);
    else if (e.name === 'page.tsx') {
      const route = prefix.replace(/^\/app/, '') || '/';
      const src = fs.readFileSync(full, 'utf8');
      const linkRegex = /href=["']([^"']+)["']/g;
      const links = new Set();
      let m;
      while ((m = linkRegex.exec(src)) !== null) {
        if (m[1].startsWith('/')) links.add(m[1]);
      }
      const arr = Array.from(links).sort();
      console.log(route);
      if (arr.length) arr.forEach(l => console.log('  → ' + l));
      else console.log('  (no internal links)');
      console.log('');
    }
  }
}
walk('./app');
