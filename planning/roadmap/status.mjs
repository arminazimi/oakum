// Tasks already finished before their issues existed. apply.mjs creates these issues and closes them with a note.
export const DONE = {
  "foundation.layout": "Done in the initial commit: Go module, package skeleton, and shared contracts in docs/contracts.md.",
  "foundation.roadmap-sync": "Done in the initial commit: planning/roadmap/ is ported from Slipway, with wave labels and a parallel plan.",
  "foundation.agents-md": "Done in the initial commit: AGENTS.md and CLAUDE.md.",
  "foundation.contributing": "Done in the initial commit: CONTRIBUTING.md with lanes, sizes, waves, and the claim process.",
  "brand.names": "Done on 2026-10-18: 18 nautical names checked on npm, PyPI, Homebrew, GitHub, and domains; see the spec header.",
  "brand.pick": "Done on 2026-10-18: Oakum, the fibre that makes a hull's seams watertight.",
};

/** No issues move in from another repository for Oakum. Kept for apply.mjs compatibility. */
export const TRANSFER_FROM = { repo: "none", issues: {} };
