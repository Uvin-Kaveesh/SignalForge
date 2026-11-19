import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { response, db } from '../src/model.js';

const width = 980;
const height = 390;
const left = 78;
const right = 32;
const top = 70;
const bottom = 52;
const plotWidth = width - left - right;
const plotHeight = height - top - bottom;
const x = frequency => left + (Math.log10(frequency) - 2) / 3 * plotWidth;
const y = decibels => top + (45 - decibels) / 80 * plotHeight;
const grid = [];

for (const value of [-30, -20, -10, 0, 10, 20, 30, 40]) {
  const yy = y(value).toFixed(1);
  grid.push(`<line x1="${left}" y1="${yy}" x2="${width - right}" y2="${yy}" stroke="#34445c" stroke-width="1"/>`);
  grid.push(`<text x="${left - 16}" y="${Number(yy) + 4}" text-anchor="end" class="tick">${value}</text>`);
}
for (const [frequency, label] of [[100, '100 Hz'], [1000, '1 kHz'], [10000, '10 kHz'], [100000, '100 kHz']]) {
  const xx = x(frequency).toFixed(1);
  grid.push(`<line x1="${xx}" y1="${top}" x2="${xx}" y2="${height - bottom}" stroke="#2b3a50" stroke-width="1"/>`);
  grid.push(`<text x="${xx}" y="${height - 21}" text-anchor="middle" class="tick">${label}</text>`);
}

function curve(key, gain = 61) {
  const points = [];
  for (let step = 0; step <= 360; step++) {
    const frequency = 10 ** (2 + step / 120);
    points.push(`${step ? 'L' : 'M'}${x(frequency).toFixed(1)},${y(db(response(frequency, gain)[key])).toFixed(1)}`);
  }
  return points.join(' ');
}

const markers = [2000, 12000].map((frequency, index) => {
  const xx = x(frequency).toFixed(1);
  const label = index === 0 ? '2 kHz target' : '12 kHz target';
  return `<line x1="${xx}" y1="${top}" x2="${xx}" y2="${height - bottom}" stroke="#7f96a8" stroke-dasharray="5 5" opacity=".85"/><text x="${Number(xx) + 7}" y="${top + 17}" class="marker">${label}</text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Calculated response of the three-stage signal conditioner</title>
<desc id="desc">Ideal first-order high-pass and low-pass magnitude curves, and their product with an illustrative gain of 61, from 100 Hz to 100 kHz. The calculated pass band lies approximately between 2 kHz and 12 kHz. These are not measurements.</desc>
<style>.title{font:700 25px Arial,sans-serif;fill:#edf4f4}.sub{font:13px Arial,sans-serif;fill:#9fb1c3}.tick,.marker,.legend{font:12px Arial,sans-serif;fill:#b5c3d0}.marker{fill:#ccdfae}.note{font:11px Arial,sans-serif;fill:#8da0b2}</style>
<rect width="100%" height="100%" rx="14" fill="#111b2b"/>
<text x="${left}" y="34" class="title">Calculated frequency response</text>
<text x="${left}" y="54" class="sub">RC filters + illustrative 61× gain · logarithmic frequency · dB</text>
${grid.join('')}${markers}
<path d="${curve('hp')}" fill="none" stroke="#54d9c9" stroke-width="2.4"/>
<path d="${curve('lp')}" fill="none" stroke="#a497e7" stroke-width="2.4"/>
<path d="${curve('output')}" fill="none" stroke="#b6f076" stroke-width="3.2"/>
<line x1="610" y1="35" x2="634" y2="35" stroke="#54d9c9" stroke-width="3"/><text x="641" y="39" class="legend">High pass</text>
<line x1="721" y1="35" x2="745" y2="35" stroke="#a497e7" stroke-width="3"/><text x="752" y="39" class="legend">Low pass</text>
<line x1="813" y1="35" x2="837" y2="35" stroke="#b6f076" stroke-width="3"/><text x="844" y="39" class="legend">Combined</text>
<text x="${left}" y="${height - 7}" class="note">THEORETICAL MODEL ONLY · transistor response, loading and clipping excluded</text>
</svg>\n`;

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/assets/theoretical-response.svg');
writeFileSync(output, svg, 'utf8');
console.log(`Wrote ${output}`);
