import test from 'node:test';
import assert from 'node:assert/strict';
import { cutoffHz, highPassMagnitude, lowPassMagnitude, response, design } from './model.js';

test('reported high-pass parts yield 1.94 kHz, not exactly 2 kHz', () => {
  assert.ok(Math.abs(cutoffHz(820, 100e-9) - 1940.9) < 1);
});
test('11 kΩ and 1.2 nF yield about 12.06 kHz', () => {
  assert.ok(Math.abs(cutoffHz(11000, 1.2e-9) - 12057.6) < 1);
});
test('each first-order filter is minus 3 dB at its own cutoff', () => {
  assert.ok(Math.abs(highPassMagnitude(2000, 2000) - Math.SQRT1_2) < 1e-12);
  assert.ok(Math.abs(lowPassMagnitude(12000, 12000) - Math.SQRT1_2) < 1e-12);
});
test('the model attenuates both sides of its pass band', () => {
  assert.ok(response(7000).output > response(1000).output);
  assert.ok(response(7000).output > response(24000).output);
});
test('reported amplitude ratio differs from reported overall gain', () => {
  assert.ok(Math.abs(design.amplifier.reportedOutputV / design.amplifier.inputV - 65.4) < 1e-10);
});
