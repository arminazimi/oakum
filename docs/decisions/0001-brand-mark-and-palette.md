# 0001. Brand: the aligned-layers mark and the lilac stone palette

**Status:** Accepted (2026-10-18)

## Context

Oakum belongs to a family of products that share one visual language: a mark built from concentric rings on a 256 px canvas, a dark-first palette, and a calm, flat style. Evergreen (three rings with staggered notches), Seaworthy (rings and a waterline), and Slipway (rings cut by a slip) already follow it. Each product has its own color family: Evergreen green, Seaworthy desert rose, a third product blue, Slipway bronze.

The maintainer's brief for Oakum's mark: in the ring family, simple and minimal, built on the letter O, and showing the technical idea.

## Name

Eighteen nautical names were checked on npm, PyPI, Homebrew, GitHub, and domains on 2026-10-18. Most were taken. `watertight` is an active npm package in the same category (reports that fail the build when claims are ungrounded), and `tightship` is a Claude Code plugin for agent workflows, so both would be confused with Oakum. `oakum` was free on all three package registries, and `oakum.sh` was free as a domain. Oakum is the tarred fibre caulkers drive into a hull's seams to make it watertight, which is what the tool does for the seams between a database, a cache, and a broker.

## Options

**Palette.** Lilac stone was kept aside during Slipway's palette choice for the next project. Harbor blue was the other candidate, for the blue slot reserved for a third product. Lilac stone was chosen: cool, quiet, rarely used in software brands, and clear of green, rose, blue, and bronze.

**Mark.** Four rounds of sketches. The first three concepts (a caulked seam, a twisted strand, a sealed gap) were not chosen. The second round (five ideas in the ring family) was rejected as too close to existing marks. The third round (seven minimal O-based ideas) produced "aligned layers", chosen by the maintainer. A fourth round varied the gap position (top, right, diagonal), the family weights (radii 88 and 58, stroke 16), which ring is lilac, and the gap width. Version 8 was chosen: family weights, gap at the top, outer ring lilac, inner ring light.

## Decision

### The mark

Two concentric rings with one gap cut through both at the top, at the same place. The outer ring is the system a change enters, the inner ring is the state it must reach, and the shared gap says the layers stay aligned. The master file is `brand/assets/oakum-mark-dark.svg`.

| Property | Value |
| --- | --- |
| Canvas | 256 × 256, the same as the other products |
| Rings | centered at (128, 128); radii 88 and 58; stroke 16, the same as Seaworthy and Slipway |
| Gap | 22 px wide, at 12 o'clock, cut through both rings by one mask |
| Outer ring | lilac `#A39CBF` on dark |
| Inner ring | light `#F2F1F6` on dark |
| Light surfaces | outer `#7D7698`, inner `#16151B` |

The mark resembles a power symbol at first glance. It is kept because the gap here is cut through two rings and no stroke enters it, and the guide forbids using the mark as a power or loading icon.

At 16 px the full mark's strokes are too thin, so the favicon mark uses radii 96 and 44, stroke 28, and a 40 px gap (about 1.75 px, 2.5 px with antialiasing, at 16 px). It was checked in Chrome on a dark tile.

### The palette: lilac stone

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#16151B` | page background, dark-first |
| `surface` | `#232130` | cards and raised areas |
| `lilac-soft` | `#7D7698` | accent on light backgrounds (graphics only), borders |
| `lilac` | `#A39CBF` | main accent on dark backgrounds |
| `ink-lilac` | `#4E4766` | text and thin lines on light backgrounds |
| `tint` | `#CFCBE0` | soft highlight |
| `light` | `#F2F1F6` | light background and the inner ring on dark |
| `text` | `#E4E2EC` | body text on dark |
| `mist` | `#9893AC` | secondary text on dark |

Contrast is computed from the hex values and tested in `tools/brand/brand.test.mjs`. `mist` and `ink-lilac` were adjusted from the first draft to reach 4.5:1 on their surfaces. Lilac soft on light is 3.80:1, for graphics and borders only.

### Words

Tagline: **Changes flow. State holds.** Secondary line: **Seal every seam.** Descriptor: **Agent-native verification of application state.**

## Consequences

- Brand assets are generated from `tools/brand/mark.mjs` and `brand/tokens.json`, and `npm run check` fails when they drift.
- The social template set has no template-thumbnail (Slipway's gallery art); Oakum is not distributed through template galleries.
- The badge says "checked with oakum". It does not claim that properties pass.
- Merchandise stays with the maintainer (see `brand/USAGE_POLICY.md`).
