# Oakum

**Changes flow. State holds.**

Oakum checks that a code change keeps application state consistent across your database, cache, and message broker. It runs your app
behind protocol-aware proxies that inject real faults, such as a lost cache invalidation or a redelivered event, and tells you, or your
coding agent, whether a property still holds, with a replay when it does not.

> **Status: planning.** Nothing is installable yet. Phase 1 (2026-10-26 → 2026-12-06) is a pre-registered experiment that decides whether
> Oakum is worth building further. See [ROADMAP.md](ROADMAP.md).

*Oakum is the tarred fibre caulkers drive into a hull's seams to make it watertight. [Seaworthy](https://github.com/arminazimi/seaworthy)
inspects the ship, [Slipway](https://github.com/arminazimi/slipway) builds it, Oakum seals the seams.*

## Planned use

```bash
oakum scan --diff HEAD          # which state paths did this change touch, and which have no property?
oakum check-property <id>       # can this property catch the defect it is meant to catch?
oakum verify --affected         # run the affected properties in an isolated Compose environment
```

- **Agents write properties, Oakum judges, people promote.** A property becomes active only after Oakum shows it fails under the code
  defect it targets, and a person approves its meaning.
- **Reproducible races.** The Redis proxy can hold one connection's `SET` until another connection's `DEL` has passed, which reproduces
  stale cache repopulation without touching your code.
- **Honest results.** `pass` says what ran; `unknown` is never a pass.

## What is not new

Antithesis lets agents infer properties and inject mutants on its platform; RedFI injects per-command Redis faults. Oakum's bet is a local,
CI-native workflow for application state, a public dataset of real state bugs (StateBugs), and a benchmark (StateBench). Details:
[the design](docs/superpowers/specs/2026-10-18-oakum-design.md).

## Research

Phase 1 is pre-registered on OSF before any detection code exists, and its result will be published whatever it shows.

## Contributing

Every planned task is a small issue with a lane, a size, and a wave; four agents can work at once. Start with
[CONTRIBUTING.md](CONTRIBUTING.md). Agents: read [AGENTS.md](AGENTS.md).

## License

Code: Apache-2.0. Datasets: CC BY 4.0 (planned).
