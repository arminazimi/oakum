// Label definitions, lanes, sizes, waves, and how roadmap items map to labels.

export const LANES = {
  "strong-agent": { label: "lane: strong-agent", who: "a strong coding agent or an experienced contributor" },
  "free-agent": { label: "lane: free-agent", who: "free or lightweight agents, and newcomers" },
  maintainer: { label: "lane: maintainer", who: "a maintainer (accounts, credentials, research decisions, or labelling)" },
};

export const SIZES = {
  XS: { label: "size: XS", meaning: "under an hour" },
  S: { label: "size: S", meaning: "a few hours" },
  M: { label: "size: M", meaning: "about a day" },
};

export const TRACKS = {};

/** Area labels per epic. Every epic in ROADMAP.md must appear here. */
export const EPIC_AREAS = {
  "E-foundation": ["area: core", "area: devops"],
  "E-prereg": ["area: research"],
  "E-research-setup": ["area: research"],
  "E-brand": ["area: brand"],
  "E-bench": ["area: bench"],
  "E-core": ["area: core", "area: report"],
  "E-cache": ["area: proxy", "area: verify"],
  "E-experiment": ["area: research", "area: agent"],
  "E-mining": ["area: research", "area: bench"],
  "E-event": ["area: proxy", "area: verify"],
  "E-scan": ["area: scan"],
  "E-agent": ["area: agent"],
  "E-pivot": ["area: proxy"],
  "E-research1": ["area: research"],
  "E-concurrency": ["area: proxy", "area: verify"],
  "E-pg": ["area: proxy", "area: verify"],
  "E-lang-ts-py": ["area: scan"],
  "E-research2": ["area: research", "area: community"],
  "E-projection": ["area: proxy", "area: verify"],
  "E-brokers": ["area: proxy", "area: scan"],
  "E-workflow": ["area: proxy", "area: verify"],
  "E-docs": ["area: docs"],
  "E-recovery": ["area: verify"],
  "E-advanced": ["area: verify"],
  "E-lang-jvm": ["area: scan", "area: community"],
  "E-research3": ["area: research"],
  "E-spec": ["area: spec"],
  "E-breadth1": ["area: scan", "area: devops"],
  "E-research4": ["area: research"],
  "E-v1": ["area: core", "area: community"],
  "E-statebench": ["area: bench", "area: research"],
  "E-trace": ["area: scan", "area: verify"],
  "E-breadth2": ["area: proxy", "area: scan"],
  "E-platform": ["area: verify", "area: agent"],
  "E-standard": ["area: spec", "area: community"],
};

/** Type label from a task key prefix. First match wins. */
export const TYPE_BY_PREFIX = [
  ["proxy.", "type: proxy"],
  ["property.", "type: property"],
  ["analyzer.", "type: analyzer"],
  ["bench.", "type: bench"],
  ["statebench.", "type: bench"],
  ["prereg.", "type: research"],
  ["research.", "type: research"],
  ["mining.", "type: research"],
  ["experiment.", "type: research"],
  ["paper.", "type: research"],
  ["dataset.", "type: research"],
  ["docs.", "type: docs"],
];

const L = (name, color, description) => ({ name, color, description });

export const LABELS = [
  L("roadmap", "0e8a16", "Work committed in the public roadmap"),
  L("type: epic", "3e4b9e", "Tracking issue that groups small tasks"),
  L("type: task", "c5def5", "One small, independently mergeable change"),
  L("type: proxy", "1d76db", "Protocol proxy or fault plan"),
  L("type: property", "1d76db", "Property type and its oracle"),
  L("type: analyzer", "1d76db", "Static analyzer or detector"),
  L("type: bench", "1d76db", "Bench service, seeded bugs, controls, StateBench"),
  L("type: research", "1d76db", "Pre-registration, mining, experiments, papers, datasets"),
  L("type: docs", "1d76db", "Documentation"),
  L("lane: strong-agent", "5319e7", "Needs a strong coding agent or experienced contributor"),
  L("lane: free-agent", "7057ff", "Spec-complete: suitable for free agents and new contributors"),
  L("lane: maintainer", "b60205", "Requires maintainer accounts, credentials, research decisions, or labelling"),
  L("size: XS", "ededed", "Expected effort: under 1 hour"),
  L("size: S", "d4c5f9", "Expected effort: a few hours"),
  L("size: M", "bfd4f2", "Expected effort: about a day"),
  L("wave: 1", "fef2c0", "No open dependency inside its phase: can start in parallel"),
  L("wave: 2", "fef2c0", "Starts when its wave 1 dependencies close"),
  L("wave: 3", "fef2c0", "Starts when its wave 2 dependencies close"),
  L("wave: 4", "fef2c0", "Starts when its wave 3 dependencies close"),
  L("wave: 5", "fef2c0", "Starts when its wave 4 dependencies close"),
  L("wave: 6", "fef2c0", "Starts when its wave 5 dependencies close"),
  L("wave: 7", "fef2c0", "Starts when its wave 6 dependencies close"),
  L("wave: 8", "fef2c0", "Starts when its wave 7 dependencies close"),
  L("needs: g2", "c2e0c6", "Breadth work: starts only after gate G2 passes (or, for E-pivot, fails)"),
  L("status: needs-brief", "fbca04", "No agent brief yet: comment with a plan before opening a PR"),
  L("area: core", "006b75", "CLI, config, outcomes, architecture"),
  L("area: report", "006b75", "Report schema, SARIF, replay"),
  L("area: proxy", "006b75", "Protocol proxies and fault plans"),
  L("area: verify", "006b75", "Execution, isolation, properties"),
  L("area: scan", "006b75", "Static analyzers and scan"),
  L("area: agent", "006b75", "Skills, MCP, Action, init"),
  L("area: bench", "006b75", "Bench service, StateBugs, StateBench"),
  L("area: research", "006b75", "Pre-registration, mining, experiments, papers"),
  L("area: docs", "006b75", "Documentation site and recipes"),
  L("area: spec", "006b75", "Open formats and conformance"),
  L("area: devops", "006b75", "CI and repository automation"),
  L("area: brand", "006b75", "Name, logo, and launch assets"),
  L("area: community", "006b75", "Contributors, pilots, launches, outreach"),
];

/** Labels GitHub creates by default and the generator may also use. */
export const BUILTIN_LABELS = ["good first issue", "help wanted", "bug", "documentation", "enhancement"];

export function typeFor(key) {
  return TYPE_BY_PREFIX.find(([prefix]) => key.startsWith(prefix))?.[1] ?? null;
}
