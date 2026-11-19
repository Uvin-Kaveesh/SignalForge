export const design = Object.freeze({
  supplyV: 9,
  highPass: { resistanceOhm: 820, capacitanceF: 100e-9 },
  lowPass: { resistanceOhm: 11000, capacitanceF: 1.2e-9 },
  amplifier: { reportedGain: 61, inputV: 0.05, reportedOutputV: 3.27 }
});

export function cutoffHz(resistanceOhm, capacitanceF) {
  if (!(resistanceOhm > 0 && capacitanceF > 0)) throw new RangeError('R and C must be positive');
  return 1 / (2 * Math.PI * resistanceOhm * capacitanceF);
}

export function highPassMagnitude(frequencyHz, cutoff) {
  if (frequencyHz < 0 || cutoff <= 0) throw new RangeError('Invalid frequency');
  return frequencyHz / Math.hypot(frequencyHz, cutoff);
}

export function lowPassMagnitude(frequencyHz, cutoff) {
  if (frequencyHz < 0 || cutoff <= 0) throw new RangeError('Invalid frequency');
  return cutoff / Math.hypot(frequencyHz, cutoff);
}

export function response(frequencyHz, gain = design.amplifier.reportedGain) {
  const hpCutoff = cutoffHz(design.highPass.resistanceOhm, design.highPass.capacitanceF);
  const lpCutoff = cutoffHz(design.lowPass.resistanceOhm, design.lowPass.capacitanceF);
  const hp = highPassMagnitude(frequencyHz, hpCutoff);
  const lp = lowPassMagnitude(frequencyHz, lpCutoff);
  return { hp, amplifier: hp * gain, output: hp * gain * lp, lp, hpCutoff, lpCutoff };
}

export function db(magnitude) { return 20 * Math.log10(magnitude); }
