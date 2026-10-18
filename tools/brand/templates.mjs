// Social brand templates: social preview, avatar, and banner.
// Each function returns a complete SVG document. Presets list the PNG exports built from them.
// Same layouts as Seaworthy's, Slipway's, and Evergreen's, so the products look like one family.

import { markFragment, tokens } from "./mark.mjs";

const color = (name) => tokens.colors[name].value;

const SANS = "Inter Variable, Inter, Helvetica Neue, Arial, sans-serif";
const MONO = "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace";

export const THEMES = {
  dark: { bg: color("canvas"), mark: "dark", text: color("light"), accent: color("lilac"), muted: color("mist") },
  light: { bg: color("light"), mark: "light", text: color("canvas"), accent: color("inkLilac"), muted: color("inkLilac") },
};

const sans = (x, y, size, fill, spacing, content) => `<text x="${x}" y="${y}" fill="${fill}" font-family="${SANS}" font-size="${size}" font-weight="700" letter-spacing="${spacing}">${content}</text>`;
const mono = (x, y, size, fill, spacing, content) => `<text x="${x}" y="${y}" fill="${fill}" font-family="${MONO}" font-size="${size}" letter-spacing="${spacing}">${content}</text>`;

let counter = 0;
const place = (variant, x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale})">${markFragment(variant, `t${counter++}`)}</g>`;

function doc(w, h, title, body) {
  counter = 0;
  return [`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title">`, `<title id="title">${title}</title>`, ...body(), `</svg>`, ``].join("\n");
}

const TAGLINE = tokens.tagline.toUpperCase();
const TAGLINE_2 = tokens.taglineSecondary.toUpperCase();
const DESCRIPTOR = tokens.descriptor;

export const TEMPLATES = {
  "social-preview": (t) =>
    doc(1280, 640, "Oakum social preview", () => [
      `<rect width="1280" height="640" fill="${t.bg}"/>`,
      place(t.mark, 112, 192, 1),
      sans(420, 322, 82, t.text, 8, "OAKUM"),
      mono(424, 378, 24, t.accent, 2, TAGLINE),
      mono(112, 566, 20, t.muted, 0.5, DESCRIPTOR),
    ]),
  avatar: (t) => doc(512, 512, "Oakum avatar", () => [`<rect width="512" height="512" fill="${t.bg}"/>`, place(t.mark, 76.8, 76.8, 1.4)]),
  banner: (t) =>
    doc(1500, 500, "Oakum banner", () => [
      `<rect width="1500" height="500" fill="${t.bg}"/>`,
      place(t.mark, 150, 122, 1),
      sans(470, 250, 92, t.text, 10, "OAKUM"),
      mono(474, 308, 26, t.accent, 2, `${TAGLINE}  ${TAGLINE_2}`),
      mono(474, 388, 22, t.muted, 0.5, DESCRIPTOR),
    ]),
};

/** PNG exports. */
export const PRESETS = ["dark", "light"].flatMap((theme) => [
  { name: `social-preview-${theme}`, template: "social-preview", theme, width: 1280, height: 640, background: THEMES[theme].bg },
  { name: `avatar-${theme}`, template: "avatar", theme, width: 512, height: 512, background: THEMES[theme].bg },
  { name: `banner-${theme}`, template: "banner", theme, width: 1500, height: 500, background: THEMES[theme].bg },
]);

export const TEMPLATE_FILES = PRESETS.map((p) => ({ file: `templates/${p.name}.svg`, svg: TEMPLATES[p.template](THEMES[p.theme]) }));

export const EXPORT_PRESETS_JSON = {
  version: tokens.version,
  format: "png",
  note: "Exports are rendered from the SVG sources with headless Chrome. Run `npm run export:brand`.",
  presets: PRESETS.map((p) => ({ name: p.name, source: `templates/${p.name}.svg`, output: `exports/${p.name}.png`, width: p.width, height: p.height, background: p.background })),
};
