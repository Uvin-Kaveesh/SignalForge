# Signal Path

**A design record and interactive frequency response lab for the IE2034 Analog Electronics Group 03 assignment.**

This repository presents a dot-board analog signal conditioner intended for a basic AM radio audio output. It pairs the reported hardware design with a browser-based, first-order RC model. The model is intentionally identified as theoretical; it does not reproduce measured oscilloscope traces or simulate the BJT transistor.

## Explore

Open `index.html` in a modern browser. No installation or build step is required. For local development, any static HTTP server will work. Run `npm test` to check the transfer-function math; Node.js 18 or later is recommended.

## Signal chain

```text
Input → 820 Ω / 100 nF high pass → 2N3904 common-emitter amplifier → 11 kΩ / 1.2 nF low pass → Output
             ≈ 1.94 kHz                 9 V supply; ≥60× target                 ≈ 12.06 kHz
```

The assignment targets a 2 kHz high-pass edge, a mid-band gain of at least 60, a 12 kHz low-pass edge and a 9 V supply. The report describes a dot-board prototype and observations at several test frequencies. Details and source inconsistencies are recorded in [engineering notes](docs/engineering-notes.md).

## What is in this repository

| Path | Purpose |
| --- | --- |
| `index.html` | Editorial project page and interactive lab |
| `src/model.js` | Dependency-free RC calculations |
| `src/app.js` | Canvas visualization and controls |
| `src/model.test.js` | Numerical checks using Node's test runner |
| `docs/engineering-notes.md` | Component record, calculations and open verification items |

## Model boundaries

The chart multiplies ideal first-order high-pass and low-pass magnitudes by a selectable, constant gain. It omits loading, coupling-capacitor response, BJT bias and small-signal behaviour, supply-limited clipping, component tolerances and measurement uncertainty. Its curves are useful for exploring the intended band, not for validating the assembled hardware.

## Provenance

Based on the supplied **IE2034 Final Assignment** brief and **Group No. 03 Analog Electronics Final Report** (2026). The original PDFs are not redistributed here. Hardware photographs, circuit CAD files and oscilloscope captures can be added after permission and original files are supplied.

## Project team

Group 03, IE2034 Analog Electronics (2026). Individual credits can be added with the team's approval.
