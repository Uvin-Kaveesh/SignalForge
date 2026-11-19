import { response, db, design } from './model.js';

const chart = document.querySelector('#responseChart');
const hero = document.querySelector('#heroCanvas');
const frequencyInput = document.querySelector('#frequency');
const gainInput = document.querySelector('#gain');
const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

function fit(canvas) {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: bounds.width, height: bounds.height };
}

function drawHero() {
  const { context: ctx, width: w, height: h } = fit(hero);
  ctx.clearRect(0, 0, w, h);
  for (let line = 0; line < 9; line++) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const envelope = Math.pow(Math.max(0, 1 - Math.abs(x / w - .52) * 1.55), 2);
      const y = h * (.5 + (line - 4) * .065) + Math.sin(x * .025 + line * .38) * envelope * h * .14;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = `rgba(182,240,118,${.11 + (8 - Math.abs(line - 4)) * .055})`;
    ctx.lineWidth = line === 4 ? 2 : 1;
    ctx.stroke();
  }
}

function drawChart() {
  const { context: ctx, width: w, height: h } = fit(chart);
  const pad = { l: 48, r: 15, t: 15, b: 35 };
  const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
  const yMin = -35, yMax = 45;
  const xPos = f => pad.l + (Math.log10(f) - 2) / 3 * pw;
  const yPos = value => pad.t + (yMax - value) / (yMax - yMin) * ph;
  ctx.clearRect(0, 0, w, h);
  ctx.font = '10px DM Mono, monospace';
  ctx.textAlign = 'right';
  for (let value = -30; value <= 40; value += 10) {
    const y = yPos(value);
    ctx.strokeStyle = '#334158'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
    ctx.fillStyle = '#8494a9'; ctx.fillText(`${value}`, pad.l - 9, y + 3);
  }
  ctx.textAlign = 'center';
  for (const [f, label] of [[100, '100 Hz'], [1000, '1 kHz'], [10000, '10 kHz'], [100000, '100 kHz']]) {
    const x = xPos(f);
    ctx.strokeStyle = '#2a394f'; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke();
    ctx.fillStyle = '#8494a9'; ctx.fillText(label, x, h - 10);
  }
  const gain = Number(gainInput.value);
  for (const [key, color] of [['hp', '#54d9c9'], ['output', '#b6f076'], ['lp', '#a497e7']]) {
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const f = 10 ** (2 + i / 400 * 3);
      const x = xPos(f), y = yPos(db(response(f, gain)[key]));
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = key === 'output' ? 2.5 : 1.8; ctx.stroke();
  }
  const f = 10 ** Number(frequencyInput.value), x = xPos(f);
  ctx.setLineDash([4, 4]); ctx.strokeStyle = '#ffffff88'; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke(); ctx.setLineDash([]);
  const y = yPos(db(response(f, gain).output));
  ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fillStyle = '#b6f076'; ctx.fill();
  const r = response(f, gain);
  document.querySelector('#frequencyValue').textContent = f < 1000 ? `${Math.round(f)} Hz` : `${fmt.format(f / 1000)} kHz`;
  document.querySelector('#gainValue').textContent = `${gain}×`;
  document.querySelector('#hpValue').textContent = `${fmt.format(db(r.hp))} dB`;
  document.querySelector('#ampValue').textContent = `${fmt.format(db(r.amplifier))} dB`;
  document.querySelector('#outValue').textContent = `${fmt.format(db(r.output))} dB`;
}

frequencyInput.addEventListener('input', drawChart);
gainInput.addEventListener('input', drawChart);
window.addEventListener('resize', () => { drawHero(); drawChart(); });
drawHero(); drawChart();
