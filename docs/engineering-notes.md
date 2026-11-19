# Engineering notes

This page separates assignment targets, reported implementation, calculated values and observations. It is not a substitute for the original report or a validated circuit schematic.

## Requirement to implementation

| Stage | Assignment target | Reported parts | Value calculated from parts |
| --- | --- | --- | --- |
| High-pass RC | 2 kHz | 820 Ω, 100 nF | 1 / (2πRC) = 1.941 kHz |
| BJT amplifier | Mid-band voltage gain ≥60; 9 V DC | 2N3904; 82 kΩ / 27 kΩ divider; 4.7 kΩ collector; 1 kΩ emitter; 100 µF bypass; two 10 µF coupling capacitors | A reliable gain or Q-point cannot be inferred from these values alone without transistor parameters, loading and verified wiring |
| Low-pass RC | 12 kHz | 11 kΩ, 1.2 nF in design calculation | 12.058 kHz |

For an isolated first-order high-pass, `|H_HP| = f / √(f² + fc²)`. For an isolated first-order low-pass, `|H_LP| = fc / √(f² + fc²)`. The interactive model uses `|H| = G × |H_HP| × |H_LP|`, where `G` is the illustrative constant gain selected in the UI. The pass band is not flat at either cutoff; each individual filter is 3.01 dB below its asymptotic level at its own cutoff.

## Reported observations

- The high-pass stage was observed at 1 kHz and 10 kHz; the report describes greater attenuation at 1 kHz.
- The amplifier was observed at 5 kHz, with an approximate gain of 70 stated for that stage.
- The low-pass stage was observed at 10 kHz and 20 kHz; the report describes greater attenuation at 20 kHz.
- The combined circuit was observed at 1, 7, 10 and 24 kHz, with an approximate overall gain of 61 stated.
- The report describes a dot-board build powered by 9 V.

These are qualitative observations and rounded claims from the supplied report. Selected oscilloscope screenshots are reproduced in `docs/assets/`, but this repository contains no original numerical sweep data or instrument exports.

## Items to verify against original hardware

1. The high-pass calculation page names **100 nF** but writes **4.7 nF** inside the substitution. The reported 820 Ω and ≈1.94 kHz are consistent with 100 nF.
2. The low-pass calculation uses **11 kΩ and 1.2 nF**, while a later component paragraph says **10 kΩ and 1.2 nF**. These correspond to ≈12.06 kHz and ≈13.26 kHz respectively. The lab uses 11 kΩ because it matches the calculation and target more closely.
3. One amplifier paragraph says **2N2304**; the component selection says **2N3904**. The repository labels 2N3904 provisionally.
4. A reported amplitude change from **50 mV to 3.27 V** implies a ratio of **65.4**, distinct from the reported ~70 amplifier gain and ~61 overall gain. The measurement nodes and whether the numbers are peak, RMS or peak-to-peak need confirmation.
5. The printed collector-voltage calculation on page 7 is incomplete. Do not treat the report's Q-point claim as numerically verified without measured `VB`, `VE`, `VC` and `VCE`.
6. Loading between stages and the output load may shift the actual filter corners. Verify the full wiring and component values before claiming an exact full-circuit transfer response.

## Useful additions when files become available

- Original circuit drawing or CAD source with all nets and component values.
- Higher-resolution dot-board photographs with component and test-point labels.
- Original oscilloscope captures or CSV exports tagged with frequency, amplitude definition, input/output nodes and instrument settings.
- A measurement table for supply voltage, bias voltages, gain and frequency sweep, including uncertainty.

## Source documents

- *IE2034 – Analog Electronics, Practical Assignment: Development of a Multi-Stage Analog Signal Conditioning Circuit Using BJT and RC Filters* (supplied brief).
- *Group No. 03 – Analog Electronics, Final Report* (supplied report, 2026).
