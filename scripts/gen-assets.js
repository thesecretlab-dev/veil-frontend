const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const pub = path.join(__dirname, '..', 'public');

function veilSvg(size, padding = 0.2) {
  const p = size * padding;
  const cx = size / 2;
  const x1 = p, y1 = p;
  const x2 = size - p, y2 = p;
  const x3 = cx, y3 = size - p;
  const sw = Math.max(size * 0.06, 1.5);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" stroke="#10b981" stroke-width="${sw}" stroke-linejoin="round"/>
</svg>`);
}

function ogSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <polygon points="520,140 680,140 600,420" fill="none" stroke="#10b981" stroke-width="8" stroke-linejoin="round"/>
  <text x="600" y="500" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="64" fill="#ffffff" letter-spacing="12">VEIL</text>
  <text x="600" y="550" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="400" font-size="22" fill="#a1a1aa">Prediction Markets for Sovereign Agents</text>
</svg>`);
}

async function gen() {
  const sizes = [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
    ['favicon.ico', 32],
  ];

  for (const [name, size] of sizes) {
    await sharp(veilSvg(512)).resize(size, size).png().toFile(path.join(pub, name));
    console.log(`  ${name}`);
  }

  await sharp(ogSvg()).png().toFile(path.join(pub, 'og-image.png'));
  console.log('  og-image.png');

  // SVG favicon with spin animation
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a0a0a" rx="4"/>
  <g transform-origin="16 16">
    <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="4s" repeatCount="indefinite"/>
    <polygon points="6,6 26,6 16,26" fill="none" stroke="#10b981" stroke-width="2" stroke-linejoin="round"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(pub, 'icon.svg'), svgFavicon);
  console.log('  icon.svg (animated)');

  console.log('Done!');
}

gen().catch(e => console.error(e));
