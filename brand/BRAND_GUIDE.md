# Oakum brand guide

Version `1.0.0` · English-only · Dark-first

This guide turns the Oakum identity into reusable rules for the repository, documentation, and social surfaces. Every SVG and PNG here is generated; see [Generated files](#generated-files). The decision behind the mark and the palette is [decision 0001](../docs/decisions/0001-brand-mark-and-palette.md).

Oakum is one of a family of products that share a visual language (rings on a 256 px canvas, dark-first, flat), each in its own color: Evergreen in green, Seaworthy in desert rose, Slipway in bronze, and Oakum in lilac.

## Core identity

**Product name:** Oakum  
**Tagline:** Changes flow. State holds.  
**Secondary line:** Seal every seam.  
**Descriptor:** Agent-native verification of application state.

Use the tagline everywhere a single line is needed. The secondary line is for banners and launch art; it never replaces the tagline. Use the descriptor when category clarity matters. Do not rename the product `Oakum AI`, `OakumDB`, or any other variant. In running text write "Oakum"; the command is `oakum`.

Oakum is the tarred fibre caulkers drive into the seams of a hull to make it watertight. The tool does the same for the seams between a database, a cache, and a broker.

## Logo system

The mark is two concentric rings with one gap cut through both at the top, at the same place.

- The **outer ring** (lilac) is the system a change enters.
- The **inner ring** (light) is the state it must reach.
- The **gap** passes through both rings at once: the layers stay aligned, and a change flows through the seam between them.

### Approved variants

| Context | Asset |
| --- | --- |
| Dark brand surface | `assets/oakum-mark-dark.svg` |
| Light brand surface | `assets/oakum-mark-light.svg` |
| One-color, dark surface | `assets/oakum-mark-mono.svg` |
| One-color, light surface | `assets/oakum-mark-mono-light.svg` |

Use SVG for anything scalable or editable. Use the PNG next to each SVG where a platform needs a raster image.

### Clear space

Keep clear space equal to one eighth of the mark width (12.5%) on every side. For a 256 px mark that is 32 px. No text, frame, crop, or unrelated graphic may enter that area.

### Minimum size

- Full-color mark: 32 px wide on screen, 8 mm in print.
- One-color mark: 24 px wide on screen, 6 mm in print.
- Wordmark lockup: 140 px wide on screen, 35 mm in print.
- Do not use the full mark below 24 px. Its thin rings do not hold at 16 px. Use the favicon mark (below) for 16 to 48 px.

### Favicon mark

For browser tabs, app icons, and anything between 16 and 48 px, use the simplified mark in [`favicon/`](favicon/): the same two rings, thicker, with a wider gap, on a canvas tile. Every stroke is at least 1.5 px and the gap at least 2 px at 16 px. Never shrink the full mark instead, and never use the favicon mark above 48 px where the full mark fits.

| File | Size | Use |
| --- | ---: | --- |
| `favicon.svg` | scalable | Browsers that support SVG icons (rounded tile) |
| `favicon.ico` | 16, 32, 48 | Browsers and tools that only read .ico |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | 16, 32, 48 | Fixed-size fallbacks |
| `apple-touch-icon.png` | 180 | iOS home screen (full-bleed; iOS rounds it) |
| `icon-192.png`, `icon-512.png` | 192, 512 | Web app manifest (full-bleed) |
| `icon-square.svg` | scalable | Source for the full-bleed icons |

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Correct use

- Preserve the exact geometry, proportions, and the position of the gap (at the top).
- Use an approved variant with enough contrast.
- Scale uniformly from the center.
- Use the mark alone for avatars, badges, and small UI. Use the lockup (mark, wordmark, tagline) for banners and headers.

### Incorrect use

- Do not rotate, skew, stretch, crop, outline, or add shadows or gradients.
- Do not close the gap, move it, offset it differently on the two rings, fill the rings, or remove a ring.
- Do not swap the two colors of the rings or recolor parts outside the approved variants.
- Do not animate the mark as a loading spinner.
- Do not place the color mark on photography, gradients, or low-contrast colors.
- Do not use a power-button, ship, anchor, wave, drop, or generic AI sparkle as an alternate Oakum symbol.

## Color

The canonical values are in [`tokens.json`](tokens.json), with CSS custom properties in [`tokens.css`](tokens.css). The palette is called lilac stone: cool, quiet, and easy on the eyes.

| Token | Value | Role |
| --- | --- | --- |
| Canvas | `#16151B` | Primary dark canvas |
| Surface | `#232130` | Elevated dark surface |
| Lilac | `#A39CBF` | Main accent on dark surfaces; the outer ring of the mark |
| Lilac Soft | `#7D7698` | Accent on light surfaces, for graphics and borders only |
| Ink Lilac | `#4E4766` | Text and thin lines on light surfaces |
| Tint | `#CFCBE0` | Soft highlight on dark surfaces |
| Light | `#F2F1F6` | Primary light canvas; the inner ring on dark surfaces |
| Text | `#E4E2EC` | Body text on dark surfaces |
| Mist | `#9893AC` | Secondary text on dark surfaces |

Oakum has no status colors of its own. Pass, fail, and unknown in reports use the terminal's or the host's colors, never a brand color, and always come with the word.

### Accessible color pairs

Ratios use WCAG relative luminance. Normal text needs 4.5:1; large text and meaningful graphics need 3:1. The dark pairs stay below pure white on black on purpose: they are easier on the eyes.

| Foreground | Background | Ratio | Approved use |
| --- | --- | ---: | --- |
| Text | Canvas | 14.16:1 | Text and UI |
| Text | Surface | 12.31:1 | Text and UI |
| Light | Canvas | 16.15:1 | Text and UI; the inner ring of the mark |
| Tint | Canvas | 11.47:1 | Text and UI |
| Lilac | Canvas | 6.97:1 | Text and UI; the outer ring of the mark |
| Lilac | Surface | 6.06:1 | Text and UI |
| Mist | Canvas | 6.14:1 | Secondary text |
| Mist | Surface | 5.33:1 | Secondary text |
| Canvas | Light | 16.15:1 | Text and UI; the mark on light surfaces |
| Ink Lilac | Light | 7.73:1 | Text and UI on light surfaces |
| Canvas | Lilac | 6.97:1 | Badge: the word oakum |

**Not approved for text:** Lilac Soft on Light (3.80:1, graphics and borders only), Lilac on Light (2.32:1), and Ink Lilac on Canvas (2.09:1). Use Ink Lilac on light surfaces and Lilac on dark ones.

## Typography

Use **Inter** (variable, weights 400 to 700) for the wordmark, headings, body copy, and brand UI. The wordmark is uppercase, weight 700, with about `0.1em` of positive tracking. Use **IBM Plex Mono** (weights 400 and 500) for commands, paths, and the tagline in brand art.

The generated sources use common fallbacks so they stay editable without bundled fonts. PNG exports are the rendered result on the machine that exported them; re-export on a machine with Inter and IBM Plex Mono installed for the final look.

## Checked-with badge

A repository whose state properties Oakum checks in CI may show a badge. It has a Surface left segment with the one-color mark and the words `checked with`, and a Lilac right segment with the word `oakum`. The words carry the meaning, not the color.

```markdown
![checked with oakum](https://raw.githubusercontent.com/arminazimi/oakum/main/brand/assets/badge-checked-with.svg)
```

The badge says that Oakum runs in the repository's CI. It does not say that every property passes: that is in the report. Do not show it on a repository that does not run Oakum.

## Voice

Plain, specific, and checkable. Say what a thing does and how to use it.

- Lead with the command or the result, not the pitch.
- Never claim more than ran: say what was checked, in what scope.
- No hype words: skip "AI-powered", "seamless", "unlock", "supercharge".
- Sentence case for headings and buttons. Uppercase only in the wordmark and brand-art taglines.

## Spacing and shape

Use the 4 px base scale from `tokens.json`; prefer 16, 24, 32, 48, and 64 px. Use 8 px radius for compact UI, 16 px for cards, and 24 px for presentation panels. The mark itself never gets a container shape unless a platform requires an avatar crop.

## Social assets and templates

Editable sources are in [`templates/`](templates/) and PNG exports are in [`exports/`](exports/), each in a dark and a light version. Dimensions and source mappings are in [`export-presets.json`](export-presets.json). They use the same layouts as the other products, so the family looks like one.

| Template | Dimensions | Purpose |
| --- | ---: | --- |
| Social preview | 1280 × 640 | GitHub repository and social sharing (the tagline and the descriptor) |
| Avatar | 512 × 512 | Organization, repository, and profile icon |
| Banner | 1500 × 500 | README, docs, and launch headers (the tagline and the secondary line) |

## Generated files

Do not edit these by hand. They come from `tools/brand/` and `tokens.json`.

| Output | Regenerate with |
| --- | --- |
| `assets/*.svg`, `favicon/*.svg`, `templates/*.svg`, `oakum-logo-sheet.svg`, `tokens.css`, `export-presets.json` | `npm run build:brand` |
| `assets/*.png`, `exports/*.png`, `favicon/*.png`, `favicon/favicon.ico`, `oakum-logo-sheet.png` | `npm run export:brand` (needs Chrome or Chromium) |

`npm run check` fails when the SVG sources are out of date or a PNG export is missing. The mark's geometry lives in `tools/brand/mark.mjs`.

## Asset rights

Oakum code is available under the Apache-2.0 license. That license does not grant any right to the project's name, logo, or other marks (Apache-2.0 section 6), so the name and brand assets are not licensed for use that suggests endorsement. The brand-use policy is in [USAGE_POLICY.md](USAGE_POLICY.md).
