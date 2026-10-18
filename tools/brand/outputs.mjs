// What the PNG export produces: the mark in four colorways, the favicon set, and the logo sheet.

export const MARK_PNG_SIZE = 512;

/** Favicon PNGs, and the source SVG each is rendered from. */
export const FAVICON_PNGS = [
  { source: "favicon/favicon.svg", output: "favicon/favicon-16.png", size: 16 },
  { source: "favicon/favicon.svg", output: "favicon/favicon-32.png", size: 32 },
  { source: "favicon/favicon.svg", output: "favicon/favicon-48.png", size: 48 },
  { source: "favicon/icon-square.svg", output: "favicon/apple-touch-icon.png", size: 180 },
  { source: "favicon/icon-square.svg", output: "favicon/icon-192.png", size: 192 },
  { source: "favicon/icon-square.svg", output: "favicon/icon-512.png", size: 512 },
];
export const FAVICON_ICO = { output: "favicon/favicon.ico", sizes: [16, 32, 48] };

export const SHEET = { source: "oakum-logo-sheet.svg", output: "oakum-logo-sheet.png", width: 1600, height: 900, background: "#0E0D12" };

export const markPngs = (variants) => variants.map((v) => ({ source: `assets/oakum-mark-${v}.svg`, output: `assets/oakum-mark-${v}.png` }));
