// Oakum mark geometry and brand tokens. Single source for every generated brand asset.
// The mark is two concentric rings with one gap cut through both at the same place: the layers stay aligned.
// It follows the ring family of Seaworthy, Slipway, and Evergreen on a 256 px canvas (docs/decisions/0001-brand-mark-and-palette.md).

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const BRAND_DIR = join(here, "..", "..", "brand");
export const tokens = JSON.parse(readFileSync(join(BRAND_DIR, "tokens.json"), "utf8"));

const c = (name) => tokens.colors[name].value;

/** Colorways. `outer` paints the outer ring, `inner` the inner one. */
export const VARIANTS = {
  dark: { outer: c("lilac"), inner: c("light"), label: "dark surface" },
  light: { outer: c("lilacSoft"), inner: c("canvas"), label: "light surface" },
  mono: { outer: c("light"), inner: c("light"), label: "one-color, dark surface" },
  "mono-light": { outer: c("canvas"), inner: c("canvas"), label: "one-color, light surface" },
};

const CENTER = 128;
/** radii: [outer, inner]; gap: width of the cut through both rings at the top (12 o'clock). */
export const MARK = { radii: [88, 58], width: 16, gap: 22 };
/** The favicon mark: thicker rings and a wider gap, so strokes stay at least 1.5 px and the gap at least 2 px at 16 px. */
export const FAVICON = { radii: [96, 44], width: 28, gap: 40 };

/** The cut: a vertical band from above the outer ring down to inside the inner ring's hole, centered on x = 128. */
function cutRect({ radii, width, gap }) {
  const top = CENTER - radii[0] - width; // clear of the outer ring's outer edge
  const bottom = CENTER - radii[1] + width; // past the inner ring's inner edge, still inside the hole
  return { x: CENTER - gap / 2, y: top, w: gap, h: bottom - top };
}

/**
 * SVG for the mark in a 256 × 256 box: a mask with the cut, then both rings. Embed with a transform to place and scale it.
 * `id` keeps mask ids unique when several marks share one document. The cut is a mask, so the gap shows whatever is behind the mark.
 */
export function markFragment(variant, id = "m", shape = MARK) {
  const v = VARIANTS[variant];
  if (!v) throw new Error(`unknown mark variant ${variant}`);
  const r = cutRect(shape);
  const [outer, inner] = shape.radii;
  return [
    `<defs><mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="white"/><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="black"/></mask></defs>`,
    `<g fill="none" stroke-width="${shape.width}" mask="url(#${id}-cut)">`,
    `<circle cx="${CENTER}" cy="${CENTER}" r="${outer}" stroke="${v.outer}"/>`,
    `<circle cx="${CENTER}" cy="${CENTER}" r="${inner}" stroke="${v.inner}"/>`,
    `</g>`,
  ].join("");
}

export function markSvg(variant) {
  const v = VARIANTS[variant];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-labelledby="title">`,
    `<title id="title">Oakum mark (${v.label})</title>`,
    markFragment(variant),
    `</svg>`,
    ``,
  ].join("\n");
}

/** The favicon: the thick mark on a dark tile. `rounded` is for browser tabs; the square one is full-bleed for system icons. */
export function faviconSvg({ rounded }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-labelledby="title">`,
    `<title id="title">Oakum</title>`,
    `<rect width="256" height="256"${rounded ? ' rx="56"' : ""} fill="${c("canvas")}"/>`,
    markFragment("dark", "f", FAVICON),
    `</svg>`,
    ``,
  ].join("\n");
}

export function tokensCss() {
  const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  const lines = [":root {"];
  for (const [name, { value }] of Object.entries(tokens.colors)) lines.push(`  --oakum-color-${kebab(name)}: ${value.toLowerCase()};`);
  lines.push("");
  lines.push(`  --oakum-font-sans: ${tokens.fonts.sans};`);
  lines.push(`  --oakum-font-mono: ${tokens.fonts.mono};`);
  lines.push("");
  for (const [k, v] of Object.entries(tokens.spacing)) lines.push(`  --oakum-space-${k}: ${v}px;`);
  lines.push("");
  for (const [k, v] of Object.entries(tokens.radius)) lines.push(`  --oakum-radius-${k}: ${v}px;`);
  lines.push("}", "");
  lines.push(
    `[data-oakum-theme="dark"] {`,
    `  --oakum-canvas: var(--oakum-color-canvas);`,
    `  --oakum-surface: var(--oakum-color-surface);`,
    `  --oakum-text: var(--oakum-color-text);`,
    `  --oakum-text-accent: var(--oakum-color-lilac);`,
    `  --oakum-text-muted: var(--oakum-color-mist);`,
    `  --oakum-line: var(--oakum-color-lilac);`,
    `}`,
    ``,
    `[data-oakum-theme="light"] {`,
    `  --oakum-canvas: var(--oakum-color-light);`,
    `  --oakum-surface: #fff;`,
    `  --oakum-text: var(--oakum-color-canvas);`,
    `  --oakum-text-accent: var(--oakum-color-ink-lilac);`,
    `  --oakum-text-muted: var(--oakum-color-ink-lilac);`,
    `  --oakum-line: var(--oakum-color-lilac-soft);`,
    `}`,
    ``,
  );
  return lines.join("\n");
}
