# Brand

Oakum's name, mark, palette, badge, and launch art. **Tagline:** Changes flow. State holds.

![Oakum logo sheet](oakum-logo-sheet.png)

Start with [BRAND_GUIDE.md](BRAND_GUIDE.md).

| Path | What |
| --- | --- |
| [`BRAND_GUIDE.md`](BRAND_GUIDE.md) | Logo rules, color, type, badge, voice |
| [`USAGE_POLICY.md`](USAGE_POLICY.md) | When the name and logo may be used, and by whom |
| [`tokens.json`](tokens.json) · [`tokens.css`](tokens.css) | Colors, fonts, spacing: the source and its CSS |
| [`assets/`](assets/) | Mark in four variants (SVG and PNG) and the checked-with badge |
| [`favicon/`](favicon/) | Simplified mark for 16 to 48 px: SVG, .ico, PNGs, Apple touch icon, manifest icons |
| [`templates/`](templates/) | Editable SVG sources for avatar, social preview, and banner |
| [`exports/`](exports/) | PNG exports |
| [`export-presets.json`](export-presets.json) | Size and source for every export |

Everything except `tokens.json` and the guide is generated:

```bash
npm run build:brand     # SVGs, tokens.css, export presets
npm run export:brand    # PNGs (needs Chrome or Chromium)
```

`npm run check` fails when generated files drift from their source in `tools/brand/`.
