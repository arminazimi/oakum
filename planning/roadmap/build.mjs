// Builds the roadmap issue set from ROADMAP.md, validates it, and writes a local preview.
//
//   node planning/roadmap/build.mjs           # validate and write planning/roadmap/out/
//   node planning/roadmap/build.mjs --check   # validate only (used by `npm run check`)
//
// Output: planning/roadmap/out/{issues.json,labels.json,preview.md}. Nothing is sent to GitHub.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BUILTIN_LABELS, EPIC_AREAS, LABELS, LANES, SIZES, TRACKS, typeFor } from "./labels.mjs";
import { parseRoadmap } from "./parse.mjs";
import { DONE, TRANSFER_FROM } from "./status.mjs";

const AGENTS = 4; // parallel agents the preview plans for
const WEIGHT = { XS: 1, S: 3, M: 8 };

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

const ref = (key) => `{{ref:${key}}}`;
const marker = (key) => `<!-- oakum-roadmap-key: ${key} -->`;
const FOOTER_TASK =
  "<sub>Part of the Oakum roadmap. New here? Read `CONTRIBUTING.md` and `AGENTS.md`, then comment to claim this issue. One issue = one pull request. Tasks in the same wave can run in parallel.</sub>";
const FOOTER_EPIC = "<sub>Pick the lowest open wave whose dependencies are closed. Lane labels say who a task suits.</sub>";

const DEFAULT_DONT = [
  "Do not expand scope beyond this issue; open a follow-up instead.",
  "Do not edit files another open task owns (see its brief); shared contracts change only through their own issue.",
  "Do not change a versioned contract (`oakum.yaml`, `oakum.report`, `state-touch`) without updating its schema, spec, and changelog.",
  "Do not point `verify` at anything outside the Compose network.",
];

function defaultDone(task) {
  if (task.key.startsWith("proxy.") || task.key.startsWith("property.") || task.key.startsWith("analyzer.")) {
    return [
      "A bench case fails with the change and its control passes (no merge without a fixture).",
      "Conformance or golden tests cover the observable behavior.",
      "`make check` passes.",
    ];
  }
  if (task.lane === "maintainer") return ["The outcome is recorded in the issue (what was done, links, decisions)."];
  return ["The change does what the goal says.", "Tests cover the observable behavior.", "`make check` passes."];
}

/** Wave = depth in the dependency graph inside the task's phase (dependencies in earlier phases count as closed). */
export function computeWaves(tasks) {
  const byKey = new Map(tasks.map((t) => [t.key, t]));
  const wave = new Map();
  const visit = (key, seen = new Set()) => {
    if (wave.has(key)) return wave.get(key);
    if (seen.has(key)) return 1; // cycles are reported elsewhere
    seen.add(key);
    const task = byKey.get(key);
    let w = 1;
    for (const dep of task.deps) {
      const d = byKey.get(dep);
      if (d && d.phase === task.phase) w = Math.max(w, visit(dep, seen) + 1);
    }
    wave.set(key, w);
    return w;
  };
  for (const t of tasks) visit(t.key);
  return wave;
}

/** Reads planning/roadmap/briefs/<key>.md files. */
export function loadBriefs(dir = join(here, "briefs")) {
  const briefs = new Map();
  if (!existsSync(dir)) return briefs;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    briefs.set(basename(file, ".md"), readFileSync(join(dir, file), "utf8").trim());
  }
  return briefs;
}

/**
 * Turns parsed roadmap data into issues and validates everything.
 * `strict` also requires every EPIC_AREAS entry and every transferred issue to match the roadmap (off for partial test roadmaps).
 * @returns {{ issues: object[], labels: object[], phases: object[], errors: string[], stats: object }}
 */
export function buildIssues(markdown, briefs = new Map(), { done = DONE, strict = true } = {}) {
  const { phases, epics, tasks, errors } = parseRoadmap(markdown);
  const phaseById = new Map(phases.map((p) => [p.id, p]));
  const byKey = new Map();

  for (const item of [...epics, ...tasks]) {
    if (byKey.has(item.key)) errors.push(`duplicate key ${item.key}`);
    byKey.set(item.key, item);
  }
  for (const epic of epics) {
    if (!phaseById.has(epic.phase)) errors.push(`${epic.key}: phase ${epic.phase} is not in the phase table`);
    if (!EPIC_AREAS[epic.key]) errors.push(`${epic.key}: add its area labels to EPIC_AREAS in labels.mjs`);
    if (!epic.outcome) errors.push(`${epic.key}: missing ### Outcome`);
    if (!tasks.some((t) => t.epic === epic.key)) errors.push(`${epic.key}: has no tasks`);
  }
  for (const key of strict ? Object.keys(EPIC_AREAS) : []) {
    if (!epics.some((e) => e.key === key)) errors.push(`EPIC_AREAS lists ${key}, which is not an epic in ROADMAP.md`);
  }
  for (const task of tasks) {
    if (!LANES[task.lane]) errors.push(`${task.key}: unknown lane "${task.lane}"`);
    if (!SIZES[task.size]) errors.push(`${task.key}: size must be XS, S, or M (got "${task.size}")`);
    if (!task.epic) errors.push(`${task.key}: not inside an epic`);
    for (const dep of task.deps) {
      if (!byKey.has(dep)) errors.push(`${task.key}: unknown dependency ${dep}`);
      else if (byKey.get(dep).kind !== "task") errors.push(`${task.key}: depends on epic ${dep}; depend on a task instead`);
    }
  }
  for (const key of Object.keys(done)) {
    if (!byKey.has(key) || byKey.get(key).kind !== "task") errors.push(`status.mjs marks ${key} done, but it is not a task`);
  }
  for (const key of strict ? Object.keys(TRANSFER_FROM.issues) : []) {
    if (!byKey.has(key)) errors.push(`status.mjs transfers ${key} from Seaworthy, but it is not in ROADMAP.md`);
  }
  for (const key of briefs.keys()) {
    if (!byKey.has(key) || byKey.get(key).kind !== "task") errors.push(`briefs/${key}.md does not match a task key`);
  }

  // Dependency cycles.
  const state = new Map();
  const visit = (key, path) => {
    if (state.get(key) === "done") return;
    if (state.get(key) === "active") {
      errors.push(`dependency cycle: ${[...path, key].join(" → ")}`);
      return;
    }
    state.set(key, "active");
    for (const dep of byKey.get(key)?.deps ?? []) if (byKey.has(dep)) visit(dep, [...path, key]);
    state.set(key, "done");
  };
  for (const task of tasks) visit(task.key, []);

  const waves = computeWaves(tasks);
  const maxWave = Math.max(...LABELS.filter((l) => l.name.startsWith("wave: ")).map((l) => Number(l.name.slice(6))));
  for (const [key, w] of waves) if (w > maxWave) errors.push(`${key}: wave ${w} has no label; add "wave: ${w}" to labels.mjs`);
  const epicByKey = new Map(epics.map((e) => [e.key, e]));
  /** Epics whose header says "requires G2" or "only if G2 fails" wait on the Phase 1 decision. */
  const gatedByG2 = (task) => /G2/.test(epicByKey.get(task.epic)?.header ?? "");

  const phaseLine = (id) => {
    const p = phaseById.get(id);
    return p ? `${p.id} — ${p.title} (${p.start} → ${p.end})` : id;
  };

  function labelsFor(item) {
    const set = new Set(["roadmap"]);
    const epicKey = item.kind === "epic" ? item.key : item.epic;
    for (const area of EPIC_AREAS[epicKey] ?? []) set.add(area);
    if (item.track && TRACKS[item.track]) set.add(TRACKS[item.track].label);
    if (item.kind === "epic") {
      set.add("type: epic");
      return [...set];
    }
    set.add("type: task");
    if (gatedByG2(item)) set.add("needs: g2");
    set.add(`wave: ${waves.get(item.key)}`);
    const type = typeFor(item.key);
    if (type) set.add(type);
    if (LANES[item.lane]) set.add(LANES[item.lane].label);
    if (SIZES[item.size]) set.add(SIZES[item.size].label);
    if (!briefs.has(item.key) && item.lane !== "maintainer" && !done[item.key]) set.add("status: needs-brief");
    if (item.lane === "free-agent") {
      set.add("help wanted");
      if (item.size === "XS" && briefs.has(item.key)) set.add("good first issue");
    }
    return [...set];
  }

  function taskBody(task) {
    const lane = LANES[task.lane];
    const size = SIZES[task.size];
    const lines = [
      marker(task.key),
      `> **Epic:** ${ref(task.epic)} · **Phase:** ${phaseLine(task.phase)}`,
      `> **Lane:** \`${lane?.label ?? task.lane}\` — ${lane?.who ?? ""} · **Size:** ${task.size} (${size?.meaning ?? ""}) · **Wave:** ${waves.get(task.key)}`,
      ...(gatedByG2(task) ? ["> **Gate:** starts only after G2 passes (see `experiment.decide`)."] : []),
      "",
    ];
    const brief = briefs.get(task.key);
    if (brief) {
      lines.push(brief, "");
    } else {
      lines.push("## Goal", `${task.title.replace(/\.$/, "")}.`, "");
      lines.push("## Agent brief", "");
      if (task.lane !== "maintainer") {
        lines.push(
          "> [!NOTE]",
          "> This task has no detailed brief yet. Before opening a PR, comment with a short plan: the files you will touch, the steps, and how you will test it.",
          "",
        );
      }
      lines.push("**Do not**", ...DEFAULT_DONT.map((d) => `- ${d}`), "");
      if (task.lane !== "maintainer") lines.push("**Run**", "```bash", "make check", "```", "");
      lines.push("## Done when", ...defaultDone(task).map((d) => `- [ ] ${d}`), "");
    }
    if (task.deps.length) lines.push("## Depends on", ...task.deps.map((d) => `- ${ref(d)}`), "");
    lines.push("---", FOOTER_TASK);
    return lines.join("\n");
  }

  function epicBody(epic, children) {
    const extra = epic.header.replace(/^\*\*Epic\*\*\s*·\s*\*\*Phase:\*\*\s*[^·]+/, "").trim();
    const lines = [marker(epic.key), `> **Epic** · **Phase:** ${phaseLine(epic.phase)}${extra ? ` ${extra}` : ""}`, "", "## Outcome", epic.outcome, ""];
    if (epic.scope.length) lines.push("## Scope", ...epic.scope.map((s) => `- ${s}`), "");
    if (epic.nonGoals.length) lines.push("## Non-goals", ...epic.nonGoals.map((s) => `- ${s}`), "");
    lines.push("## Tasks", ...children.map((c) => `- [ ] ${ref(c.key)}`), "");
    if (epic.exit.length) lines.push("## Exit criteria", ...epic.exit.map((s) => `- [ ] ${s}`), "");
    lines.push("---", FOOTER_EPIC);
    return lines.join("\n");
  }

  const issues = [...epics, ...tasks].map((item) => {
    const children = tasks.filter((t) => t.epic === item.key);
    return {
      key: item.key,
      kind: item.kind,
      title: item.kind === "epic" ? `Epic: ${item.title}` : item.title,
      phase: item.phase,
      epic: item.kind === "task" ? item.epic : null,
      lane: item.lane ?? null,
      size: item.size ?? null,
      deps: item.deps ?? [],
      wave: item.kind === "task" ? waves.get(item.key) : null,
      done: item.kind === "task" ? Boolean(done[item.key]) : false,
      hasBrief: item.kind === "task" ? briefs.has(item.key) : null,
      labels: labelsFor(item),
      body: item.kind === "epic" ? epicBody(item, children) : taskBody(item),
    };
  });

  const known = new Set([...LABELS.map((l) => l.name), ...BUILTIN_LABELS]);
  for (const issue of issues) for (const l of issue.labels) if (!known.has(l)) errors.push(`${issue.key}: undefined label ${l}`);
  for (const issue of issues) for (const m of issue.body.matchAll(/\{\{ref:([^}]+)\}\}/g)) if (!byKey.has(m[1])) errors.push(`${issue.key}: unresolvable reference ${m[1]}`);

  const count = (pred) => issues.filter(pred).length;
  const stats = {
    epics: count((i) => i.kind === "epic"),
    tasks: count((i) => i.kind === "task"),
    withBrief: count((i) => i.hasBrief === true),
    byLane: Object.fromEntries(Object.keys(LANES).map((l) => [l, count((i) => i.lane === l)])),
    byPhase: Object.fromEntries(phases.map((p) => [p.id, { epics: count((i) => i.phase === p.id && i.kind === "epic"), tasks: count((i) => i.phase === p.id && i.kind === "task") }])),
  };

  return { issues, labels: LABELS, phases, errors, stats };
}

/**
 * A plan for AGENTS parallel agents: per phase and wave, open agent tasks are packed onto the least-loaded agent
 * by size weight. Maintainer tasks and tasks already done are listed separately. Advisory only.
 */
export function parallelPlan(issues, phases) {
  const out = [`## Plan for ${AGENTS} parallel agents`, "", "Tasks in one wave never depend on each other. Agents take the next wave when its dependencies close.", ""];
  for (const p of phases) {
    const tasks = issues.filter((i) => i.kind === "task" && i.phase === p.id);
    if (!tasks.length) continue;
    out.push(`### ${p.id} — ${p.title}`, "", `| Wave | ${Array.from({ length: AGENTS }, (_, i) => `Agent ${i + 1}`).join(" | ")} | Maintainer |`, `|---|${"---|".repeat(AGENTS + 1)}`);
    const waves = [...new Set(tasks.map((t) => t.wave))].sort((a, b) => a - b);
    for (const w of waves) {
      const inWave = tasks.filter((t) => t.wave === w);
      const load = Array(AGENTS).fill(0);
      const slots = Array.from({ length: AGENTS }, () => []);
      const agentTasks = inWave.filter((t) => t.lane !== "maintainer" && !t.done).sort((a, b) => WEIGHT[b.size] - WEIGHT[a.size]);
      for (const t of agentTasks) {
        const i = load.indexOf(Math.min(...load));
        slots[i].push(`\`${t.key}\` (${t.size})`);
        load[i] += WEIGHT[t.size];
      }
      const maint = inWave.filter((t) => t.lane === "maintainer" && !t.done).map((t) => `\`${t.key}\``);
      const cell = (xs) => xs.join("<br>") || "·";
      out.push(`| ${w} | ${slots.map(cell).join(" | ")} | ${cell(maint)} |`);
    }
    const done = tasks.filter((t) => t.done).map((t) => `\`${t.key}\``);
    if (done.length) out.push("", `Already done (closed on creation): ${done.join(", ")}`);
    out.push("");
  }
  return out;
}

function preview({ issues, phases, stats }) {
  const lanes = Object.keys(LANES);
  const rows = phases.map((p) => {
    const s = stats.byPhase[p.id];
    const lane = (l) => issues.filter((i) => i.phase === p.id && i.lane === l).length;
    return `| ${p.id} | ${p.start} → ${p.end} | ${s.epics} | ${s.tasks} | ${lanes.map(lane).join(" | ")} |`;
  });
  const sampleKeys = ["E-cache", "proxy.resp-faults", "concurrency.stale-repop", "bench.service"];
  return [
    "# Oakum roadmap — issue preview",
    "",
    "Generated locally by `planning/roadmap/build.mjs` from `ROADMAP.md`. Nothing has been sent to GitHub.",
    "",
    `- Issues: **${issues.length}** (${stats.epics} epics, ${stats.tasks} tasks)`,
    `- Tasks with a detailed brief: **${stats.withBrief}** of ${stats.tasks} (the rest are labeled \`status: needs-brief\`, except maintainer tasks)`,
    `- Milestones: one per phase (${phases.length})`,
    "",
    `| Phase | Dates | Epics | Tasks | ${lanes.join(" | ")} |`,
    `|---|---|---|---|${lanes.map(() => "---").join("|")}|`,
    ...rows,
    "",
    ...parallelPlan(issues, phases.slice(0, 3)),
    "## Sample bodies",
    "",
    ...sampleKeys.flatMap((k) => {
      const issue = issues.find((i) => i.key === k);
      return issue ? [`### ${issue.title}`, "", `Labels: ${issue.labels.map((l) => `\`${l}\``).join(", ")}`, "", "````markdown", issue.body, "````", ""] : [];
    }),
  ].join("\n");
}

function main() {
  const check = process.argv.includes("--check");
  const markdown = readFileSync(join(root, "ROADMAP.md"), "utf8");
  const result = buildIssues(markdown, loadBriefs());
  if (result.errors.length) {
    console.error(result.errors.map((e) => `roadmap: ${e}`).join("\n"));
    process.exit(1);
  }
  const { stats } = result;
  const summary = `OK: roadmap (${result.phases.length} phases, ${stats.epics} epics, ${stats.tasks} tasks, ${stats.withBrief} with briefs)`;
  if (check) {
    console.log(summary);
    return;
  }
  const out = join(here, "out");
  mkdirSync(out, { recursive: true });
  const phases = result.phases.map((p) => ({ ...p, dueOn: `${p.end}T23:59:59Z`, description: `${p.title} (${p.start} → ${p.end}). Release: ${p.release}.` }));
  writeFileSync(join(out, "issues.json"), JSON.stringify({ phases, issues: result.issues }, null, 2) + "\n");
  writeFileSync(join(out, "labels.json"), JSON.stringify(result.labels, null, 2) + "\n");
  writeFileSync(join(out, "preview.md"), preview(result) + "\n");
  console.log(summary);
  console.log(`Wrote ${join("planning", "roadmap", "out")}/{issues.json,labels.json,preview.md}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
