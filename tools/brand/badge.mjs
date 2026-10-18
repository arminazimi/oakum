// The "checked with oakum" badge. Repositories whose state properties Oakum checks in CI may show it in their README.

import { markFragment, tokens } from "./mark.mjs";

const color = (name) => tokens.colors[name].value;

const FONT = "Inter, Verdana, Arial, sans-serif";
const CHAR_WIDTH = 7.4; // average advance at 12px bold; labels are short and ASCII
const HEIGHT = 28;
const PAD = 10;
const MARK = 18;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const textWidth = (s) => Math.round(s.length * CHAR_WIDTH);

/** The badge: a surface segment with the one-color mark and "checked with", and a lilac segment with "oakum". */
export function badgeSvg() {
  const label = "checked with";
  const value = "oakum";
  const leftW = PAD + MARK + 8 + textWidth(label) + PAD;
  const rightW = PAD + textWidth(value) + PAD;
  const w = leftW + rightW;
  const text = `${label} ${value}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${HEIGHT}" viewBox="0 0 ${w} ${HEIGHT}" role="img" aria-label="${esc(text)}">`,
    `<title>${esc(text)}</title>`,
    `<clipPath id="r"><rect width="${w}" height="${HEIGHT}" rx="6"/></clipPath>`,
    `<g clip-path="url(#r)">`,
    `<rect width="${leftW}" height="${HEIGHT}" fill="${color("surface")}"/>`,
    `<rect x="${leftW}" width="${rightW}" height="${HEIGHT}" fill="${color("lilac")}"/>`,
    `</g>`,
    `<g transform="translate(${PAD} ${(HEIGHT - MARK) / 2}) scale(${MARK / 256})">${markFragment("mono", "b")}</g>`,
    `<g font-family="${FONT}" font-size="12" font-weight="700" dominant-baseline="central">`,
    `<text x="${PAD + MARK + 8}" y="${HEIGHT / 2 + 0.5}" fill="${color("light")}">${label}</text>`,
    `<text x="${leftW + PAD}" y="${HEIGHT / 2 + 0.5}" fill="${color("canvas")}">${value}</text>`,
    `</g>`,
    `</svg>`,
    ``,
  ].join("\n");
}
