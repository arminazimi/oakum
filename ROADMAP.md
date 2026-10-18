# Roadmap: 12 months (2026-10-19 → 2027-10-17)

> **Oakum** · *Changes flow. State holds.*
>
> Agent-native verification of application state. `oakum scan` tells an agent which database, cache, and broker paths its change touched
> and which have no property; `oakum verify` runs those properties through command-aware protocol proxies and returns a verdict with a
> replay. Free and open source. Every phase also feeds a research track, so the work stays publishable if the product does not take off.
>
> *Oakum is the tarred fibre caulkers drive into a hull's seams to make it watertight. Seaworthy inspects the ship, Slipway builds it,
> Oakum seals the seams between database, cache, and broker.*

## North star

By month 12, any coding agent that changes code touching a database, cache, or broker runs `oakum` before pushing, and StateBench is how
agents are measured on state correctness.

**Floor:** whatever happens to the product, a public real-bug dataset (StateBugs), an empirical study, and a pre-registered agent experiment.

## Why Oakum

Research on 2026-10-18 and an external review the same day found:

- Antithesis already lets agents infer properties and inject mutants, for distributed databases on its own platform. That loop is not new.
- RedFI (last push 2020) already injects per-command Redis faults. Protocol-aware fault injection is not new.
- No tool found holds one connection's command until a named event without blocking other connections, which is what reproduces cache
  stale repopulation without instrumenting the app.
- No public, reproducible corpus of real application-level state bugs was found.

So Oakum's bet is a local, CI-native workflow for application state, with two assets that are hard to copy: **StateBugs/StateBench** and a
library of **validated property packs**. Design: [docs/superpowers/specs/2026-10-18-oakum-design.md](docs/superpowers/specs/2026-10-18-oakum-design.md).

## Product principles

1. **Verdicts come from execution.** Static analysis selects; only a run can fail.
2. **Agents write, Oakum judges, humans promote.** Humans review a property's meaning, not just its sensitivity.
3. **Sensitivity and resilience are different questions.** Separate commands, separate reports.
4. **Never claim more than ran.** `pass` needs runs and scope; `unknown` is never a pass; replay is fault-plan replay.
5. **Silent unless useful.** `scan` reports only diff-touched symbols and never fails a push by default.
6. **Isolated only.** Compose lint, no targets outside the Compose network, no bypass flag, no real credentials.
7. **Experiment before breadth.** No new protocol, language, or pack before G2.
8. **No merge without a fixture.** Every detector, fault, and property type lands with a bench case and a conformance test.
9. **Research-grade evidence.** Pre-registered, held-out, reproducible, archived with a DOI.

## Gates

| Gate | Evidence | Phase | Blocks |
|---|---|---|---|
| G1 Detection | 3/3 seeded bugs fail (incl. stale repopulation ≥ 9/10), 0/5 controls fail, every fail replays | 1 | G2 run |
| G2 Agent value | arm C beats arm B on the pre-registered metric and margin, held-out cases included | 1 | all breadth (Phases 3–6, 9–11) |
| R1 Dataset | ≥ 30 real state bugs, reproducible, double-labelled with kappa | 2 | papers P1–P2 |
| G3 Real bugs | one accepted upstream fix from an Oakum finding | 3 | none |
| G4 Retention | three outside teams keep `oakum verify` in CI 30+ days | 7 | 1.0 announcement |
| G5 Standard | an independent tool passes the conformance suite | 12 | Spec 2.0 |

**Stop or pivot after Phase 1** if C does not beat B by the margin, stale repopulation reproduces < 9/10, or a property takes longer to write
than the equivalent Go test. Then Phase 2 runs `E-pivot` instead of the product epics. The research track continues in every case.

## Phases

| Phase | Dates | Focus | Release |
|---|---|---|---|
| Phase 0 | 2026-10-19 → 2026-10-25 | Foundations, pre-registration, research setup | none |
| Phase 1 | 2026-10-26 → 2026-12-06 | Falsification experiment: Redis, stale repopulation, A/B/C | `0.0.1` (experiment build) |
| Phase 2 | 2026-12-07 → 2027-01-10 | Product core: Event pack, Go analyzer, scan, agent surface; R1 | `0.1.0` |
| Phase 3 | 2027-01-11 → 2027-02-07 | Concurrency, PG wire, TypeScript and Python | `0.2.0` |
| Phase 4 | 2027-02-08 → 2027-03-07 | Projection, Kafka, AMQP, Workflow, MySQL, docs site | `0.3.0` |
| Phase 5 | 2027-03-08 → 2027-04-04 | Recovery, multi-service, advanced properties, JVM | `0.4.0` |
| Phase 6 | 2027-04-05 → 2027-05-02 | Open spec and conformance, Rust and .NET, CI systems, month-6 checkpoint | `0.5.0` + Spec 1.0-rc |
| Phase 7 | 2027-05-03 → 2027-05-30 | Stability, governance, launch | **`1.0.0`** + Spec 1.0 |
| Phase 8 | 2027-05-31 → 2027-06-27 | StateBench 1.0 and leaderboard (provisional) | StateBench 1.0 |
| Phase 9 | 2027-06-28 → 2027-07-25 | Trace-based property suggestion (provisional) | `1.1.0` |
| Phase 10 | 2027-07-26 → 2027-08-22 | Protocol and language breadth (provisional) | `1.2.0` |
| Phase 11 | 2027-08-23 → 2027-09-19 | Kubernetes, cross-repository contracts, shadow verify, IDE (provisional) | `1.3.0` |
| Phase 12 | 2027-09-20 → 2027-10-17 | Spec 2, team edition, twelve-month review (provisional) | `2.0.0` + Spec 2.0 |

**Month-6 checkpoint (2027-04-18).** Phases 0–7 are the plan; Phases 8–12 are provisional. At the checkpoint, task `review.m6` rewrites
Phases 8–12 from the evidence so far: G1, G2, R1, G3, pilot feedback, maintenance cost per proxy and analyzer, and paper status. Any
phase may be dropped, reordered, or replaced.

### Research track (parallel)

| Output | Target | Depends on |
|---|---|---|
| OSF pre-registration of the A/B/C experiment | Phase 0 | none |
| P3 workshop paper: Phase 1 experiment as a pilot | Phase 2 | G2 result (either way) |
| StateBugs dataset v1 on Zenodo + P2 preprint | Phase 3 | R1 |
| P1 empirical study preprint | Phase 3 | R1 |
| P3 full study on StateBugs (≥ 30 bugs, 5 runs each) | Phase 5 | R1 |
| P4 tool paper (hold-until technique) | Phase 6 | G1 |
| Conference submissions (MSR, ICSE/FSE RR, ISSTA, ASE Tool) | Phases 4–12, by deadline | preprints |

## Working in parallel

The roadmap is built so four agents can work at once from day one.

- Every task has a **wave** label (`wave: 1`, `wave: 2`, ...): its depth in the dependency graph inside its phase. Tasks in the same wave of
  the same phase never depend on each other.
- Each task's brief lists the **files it owns**. Two open tasks never own the same file; shared contracts live in packages created by
  the initial commit (`docs/contracts.md`), so tasks build against them in parallel.
- Pick the lowest open wave in the current phase whose dependencies are closed. `planning/roadmap/out/preview.md` shows the plan for four
  agents per phase.

## Labels

Same system as Evergreen, Seaworthy, and Slipway: `roadmap`, `type: epic`/`task`, lanes (`strong-agent`, `free-agent`, `maintainer`),
sizes (`XS`, `S`, `M`), areas, and waves.

**Lanes.** `strong-agent`: protocol proxies, analyzers, core semantics, reproductions. `free-agent`: detectors, fixtures, docs, wrappers,
mining candidates. `maintainer`: naming, spec decisions, labelling, pre-registration, papers, outreach.

---

# Phase 0 — Foundations, pre-registration, research setup (2026-10-19 → 2026-10-25)

## Epic: Repository and contribution lanes
<!-- oakum-roadmap-key: E-foundation -->
> **Epic** · **Phase:** Phase 0

### Outcome
A Go repository four agents can contribute to on day one, with CI, lanes, waves, shared contracts, and the roadmap tooling from Seaworthy.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `foundation.layout` | Go module, package skeleton, and shared contracts in `docs/contracts.md` | strong-agent | S | none |
| `foundation.roadmap-sync` | Port `planning/roadmap/` from Slipway with key prefix `oakum-roadmap-key` and wave labels | free-agent | S | none |
| `foundation.agents-md` | `AGENTS.md` and `CLAUDE.md`, including no-fixture-no-merge, file ownership, and the held-out rule | strong-agent | S | none |
| `foundation.contributing` | `CONTRIBUTING.md` with lanes, sizes, waves, claim process | free-agent | XS | none |
| `foundation.ci` | CI: `go test -race ./...`, `golangci-lint`, `npm run check`, Docker available for integration tests | free-agent | S | `foundation.layout` |
| `foundation.license` | Confirm Apache-2.0 for code and CC BY 4.0 for datasets; add `NOTICE` | maintainer | XS | none |

### Exit criteria
- [ ] CI is green on the skeleton and runs the roadmap check.
- [ ] Four tasks in Phase 1 wave 1 can start with no open dependencies.

## Epic: Pre-registration
<!-- oakum-roadmap-key: E-prereg -->
> **Epic** · **Phase:** Phase 0

### Outcome
G1 and G2 are fixed publicly before detection code exists, so a negative result is as publishable as a positive one.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `prereg.g1` | Write G1: bugs, controls, pass and fail definitions, 9/10 reproduction rule | maintainer | S | none |
| `prereg.g2` | Write G2: arms A/B/C, model, prompt, time, tokens, guidance, attempts, primary metric and margin, statistical test | maintainer | S | none |
| `prereg.osf` | Register G1 and G2 on OSF; link from the repository | maintainer | XS | `prereg.g2` |
| `prereg.heldout` | Held-out cases built by a person or agent that never sees Oakum's code; sealed until the run | maintainer | S | `prereg.g2` |
| `prereg.competitors` | Written comparison: Antithesis and its skills, RedFI, Toxiproxy, Envoy, Shuttle and Loom, Schemathesis, Polaris, PBT-Bench | free-agent | S | none |

### Exit criteria
- [ ] The OSF registration timestamp precedes the first commit that adds fault logic under `proxy/`.

## Epic: Research setup
<!-- oakum-roadmap-key: E-research-setup -->
> **Epic** · **Phase:** Phase 0

### Outcome
The rules for mining and labelling real state bugs are written down, and the research has a co-author and a deadline calendar.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `research.protocol` | Mining and labelling protocol: what counts as a state bug, inclusion and exclusion rules, label schema | maintainer | S | none |
| `research.coauthor` | Find an academic co-author or an arXiv cs.SE endorser | maintainer | S | none |
| `research.venues` | Deadline calendar for MSR, ICSE/FSE Registered Reports, ISSTA, ASE, LLM4Code, AIware, FORGE | free-agent | XS | none |

### Exit criteria
- [ ] `research/protocol.md` is merged and referenced by the mining tasks.

## Epic: Name and brand
<!-- oakum-roadmap-key: E-brand -->
> **Epic** · **Phase:** Phase 0

### Outcome
Oakum has a name that is free where it matters, a mark in the family of Seaworthy and Evergreen, and a brand kit.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `brand.names` | Shortlist names; check GitHub, npm, PyPI, Homebrew, domains, and category collisions | free-agent | S | none |
| `brand.pick` | Choose the name and tagline | maintainer | XS | `brand.names` |
| `brand.mark` | Mark in the ring family of Seaworthy and Evergreen, in the fourth product color family | maintainer | M | `brand.pick` |
| `brand.kit` | Brand kit: four colorways, favicon set, badge, guide | free-agent | S | `brand.mark` |

### Exit criteria
- [ ] The mark and kit live in `brand/` and the README uses them.

---

# Phase 1 — Falsification experiment (2026-10-26 → 2026-12-06)

## Epic: Experiment service
<!-- oakum-roadmap-key: E-bench -->
> **Epic** · **Phase:** Phase 1

### Outcome
A small Go shop service with three seeded bugs and five controls, each a variant that materializes into a standalone repository, so agents in the experiment never see which variant they got.

### Scope
- Out of scope in Phase 1: NATS, analyzer, `scan`, MCP, npm and PyPI, SARIF, ecosystem scans, StateBench packaging.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `bench.service` | Go shop service in `bench/shop`: HTTP API, Postgres, Redis cache-aside with go-redis, Compose file, deterministic seed | strong-agent | M | none |
| `bench.bugs` | Seeded bug variants as patches: missing invalidation, wrong-key invalidation, stale repopulation | free-agent | S | `bench.service` |
| `bench.controls` | 3 correct controls and 2 permitted-eventual controls as variants | free-agent | S | `bench.service` |
| `bench.baseline-tests` | Hand-written Go integration tests for the 3 bugs; measures arm A setup cost | strong-agent | S | `bench.bugs` |
| `bench.runner` | `make bench` runs every variant through Oakum and writes a results table | free-agent | S | `bench.bugs`, `check.sensitivity` |

### Exit criteria
- [ ] All 8 variants materialize and start cleanly in under 60 seconds on a laptop.

## Epic: Core semantics and report
<!-- oakum-roadmap-key: E-core -->
> **Epic** · **Phase:** Phase 1

### Outcome
Property config, outcome semantics, and the `oakum.report/v0` schema, independent of any protocol.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `core.config` | `oakum.yaml` v0 parser and JSON Schema; `$fresh`; `tolerates` | strong-agent | S | `foundation.layout` |
| `core.outcomes` | `pass`/`fail`/`unknown`/`not_tested`; `kind`; `runs`, `scope`, `reproducible: k/n`; exit codes | strong-agent | S | `foundation.layout` |
| `core.report-json` | `oakum.report/v0` JSON Schema forbidding `pass` without `runs ≥ 1`; golden tests | free-agent | S | `core.outcomes` |
| `core.replay` | Fault-plan replay: same seed, fixtures, HTTP sequence, fault plan, hold-release order | strong-agent | M | `proxy.resp-faults`, `core.report-json` |

### Exit criteria
- [ ] Golden reports validate for every outcome.
- [ ] Replay of a recorded fail reproduces the same proxy event order.

## Epic: Cache pack and RESP proxy
<!-- oakum-roadmap-key: E-cache -->
> **Epic** · **Phase:** Phase 1

### Outcome
`read_after_write` verified through a RESP proxy with drop, delay, rewrite, and non-blocking hold-until faults, including a deterministic
stale-repopulation schedule.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.resp-core` | RESP proxy on `tidwall/redcon`: single-node, RESP2 and RESP3, pipelining, no TLS; ordered event log | strong-agent | M | `foundation.layout` |
| `proxy.resp-faults` | Fault plans: drop one command, delay, rewrite key, hold-until a named event, non-blocking per connection | strong-agent | M | `proxy.resp-core` |
| `proxy.resp-conformance` | Conformance tests with go-redis and rueidis, including pipelines | free-agent | S | `proxy.resp-core` |
| `verify.compose` | Start the Compose env, route the app's Redis through the proxy, health checks, teardown | strong-agent | M | `core.config` |
| `verify.lint` | Compose lint (`privileged`, host mounts, host network or pid, `docker.sock`, `cap_add`, devices) → `unknown: unsafe_compose` | free-agent | S | `core.config` |
| `verify.isolation` | Non-Compose targets → `unknown: non_isolated_target`; secret-pattern check on env | strong-agent | S | `verify.compose` |
| `property.read-after-write` | `read_after_write` over HTTP write and read, JSONPath observe, `within_ms` | strong-agent | S | `verify.compose`, `core.outcomes` |
| `concurrency.stale-repop` | Built-in stale-repopulation schedule: hold the reader's `SET`, release after the writer's `DEL` | strong-agent | M | `proxy.resp-faults` |
| `check.sensitivity` | `oakum check-property`: code-defect faults for the type; `sensitive`/`insensitive`/`unknown` | strong-agent | S | `property.read-after-write`, `concurrency.stale-repop` |

### Exit criteria
- [ ] G1: 3/3 bugs fail, stale repopulation ≥ 9/10, 0/5 controls fail, every fail replays.

## Epic: Agent experiment
<!-- oakum-roadmap-key: E-experiment -->
> **Epic** · **Phase:** Phase 1

### Outcome
The pre-registered A/B/C experiment runs and its result, positive or negative, is published with a GO / PIVOT / STOP decision.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `agent.skill-min` | Minimal `SKILL.md` for arm C: when to run, property template, outcome meanings | strong-agent | S | `check.sensitivity` |
| `experiment.harness` | Harness running arms A/B/C per the registration, logging tokens, time, attempts | strong-agent | M | `prereg.g2` |
| `experiment.run` | Run on seeded and held-out cases, 5 runs per case per arm | maintainer | S | `experiment.harness`, `agent.skill-min`, `prereg.osf`, `prereg.heldout` |
| `experiment.report` | Publish results, data, and deviations from the registration, whatever they show | maintainer | S | `experiment.run` |
| `experiment.decide` | GO / PIVOT / STOP decision recorded in `docs/decisions/` | maintainer | XS | `experiment.report` |

### Exit criteria
- [ ] G1 and G2 are decided and published.

## Epic: Real-bug mining
<!-- oakum-roadmap-key: E-mining -->
> **Epic** · **Phase:** Phase 1

### Outcome
Candidate real state bugs from open-source history, each with a Docker reproduction, labelled by two people.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `mining.search` | Search commit history of open-source Go, TS, and Python services for state-bug fixes; write candidate records | free-agent | M | `research.protocol` |
| `mining.repro` | For each candidate: pinned commit pair, Docker reproduction, failing scenario | strong-agent | M | `mining.search` |
| `mining.label` | Two independent human labels per candidate; Cohen's kappa | maintainer | M | `mining.repro` |
| `mining.split` | Freeze train and held-out split before any Oakum tuning on real bugs | maintainer | XS | `mining.label` |

### Exit criteria
- [ ] At least 30 candidates have reproductions and two labels.

---

# Phase 2 — Product core (2026-12-07 → 2027-01-10)

## Epic: Event pack
<!-- oakum-roadmap-key: E-event -->
> **Epic** · **Phase:** Phase 2 · requires G2

### Outcome
`idempotent_effect` and `no_lost_event` verified through a NATS JetStream proxy.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.nats-core` | NATS pass-through with JetStream awareness and event log | strong-agent | M | `experiment.decide` |
| `proxy.nats-faults` | Redeliver, drop ack, drop publish, delay, hold-until | strong-agent | M | `proxy.nats-core` |
| `property.idempotent-effect` | `idempotent_effect` with SQL observe across two clean runs | strong-agent | M | `proxy.nats-faults` |
| `property.no-lost-event` | `no_lost_event` after a committed write | free-agent | S | `proxy.nats-faults` |
| `bench.bugs-event` | Seeded bugs: duplicate consumption, ack before commit; controls | free-agent | S | `proxy.nats-faults` |

### Exit criteria
- [ ] Both event bugs fail and all event controls pass.

## Epic: Go analyzer and scan
<!-- oakum-roadmap-key: E-scan -->
> **Epic** · **Phase:** Phase 2 · requires G2

### Outcome
Zero-config `oakum scan --diff` with type-resolved detection of state touches in Go, with published cold and warm timings.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `scan.state-touch-schema` | `state-touch/v0` JSON Schema (language-neutral) | strong-agent | S | `experiment.decide` |
| `analyzer.go-core` | `go/packages` + `go/types` loader with incremental cache; fast and deep modes | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.go-libs` | Detectors: go-redis, rueidis, database/sql, pgx, gorm, sqlc, ent, nats.go | free-agent | M | `analyzer.go-core` |
| `scan.diff` | Join touches with git diff; `COVERED`/`GAP`/`STALE`; `covers` validation | strong-agent | S | `analyzer.go-core` |
| `scan.perf` | Benchmark cold and warm on five large Go repos; publish numbers before claiming any target | free-agent | S | `scan.diff` |

### Exit criteria
- [ ] Zero false `GAP` on bench controls; timings published.

## Epic: Agent surface
<!-- oakum-roadmap-key: E-agent -->
> **Epic** · **Phase:** Phase 2 · requires G2

### Outcome
From a clean machine to the first useful `oakum` output in under 60 seconds, through any agent channel.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `agent.init` | `oakum init`: `oakum.yaml` stub, AGENTS.md line (default, diff shown, `--no-agents-md`), Skill, Action | strong-agent | S | `scan.diff` |
| `agent.skill` | Full `SKILL.md`: scan, two templates, outcome meanings, consent before verify on untrusted repos | strong-agent | S | `agent.skill-min` |
| `agent.action` | GitHub Action: `verify --affected`, PR comment, SARIF, `allow-unknown: false` | free-agent | S | `core.report-json` |
| `agent.mcp` | MCP server: `scan`, `check_property`, `explain` | strong-agent | S | `agent.skill` |
| `agent.install` | Go install, Homebrew tap, install script, npm and PyPI wrappers | free-agent | S | `foundation.ci` |
| `agent.feedback` | `oakum feedback` prefilled issue from a redacted report | free-agent | XS | `core.report-json` |
| `launch.demo` | 30-second recording of the stale-repopulation loop | maintainer | XS | `core.replay` |
| `launch.v0-1` | Release `0.1.0` | maintainer | XS | `agent.init`, `agent.mcp`, `agent.install`, `property.idempotent-effect` |

### Exit criteria
- [ ] `0.1.0` is installable through every channel in the table.

## Epic: Pivot
<!-- oakum-roadmap-key: E-pivot -->
> **Epic** · **Phase:** Phase 2 · only if G2 fails

### Outcome
If G2 fails, the proxies ship as a Go library and Testcontainers module, but only if they beat RedFI and Toxiproxy for hold-until.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `pivot.compare` | Show the library beats RedFI and Toxiproxy for hold-until; else stop product work | strong-agent | S | `experiment.decide` |
| `pivot.lib` | Proxies as a Go library with fault plans | strong-agent | M | `pivot.compare` |
| `pivot.testcontainers` | Testcontainers module wrapping the proxies | free-agent | S | `pivot.lib` |

### Exit criteria
- [ ] The comparison is published, and the library ships only if it wins.

## Epic: Research wave 1
<!-- oakum-roadmap-key: E-research1 -->
> **Epic** · **Phase:** Phase 2

### Outcome
The Phase 1 experiment is written up as a pilot paper, and R1 closes.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p3-pilot` | Workshop paper on the Phase 1 experiment (pilot, positive or negative) | maintainer | M | `experiment.report` |
| `mining.r1` | Close R1 | maintainer | S | `mining.split` |

### Exit criteria
- [ ] Pilot paper submitted; R1 met or its shortfall documented.

---

# Phase 3 — Concurrency, PG wire, TypeScript and Python (2027-01-11 → 2027-02-07)

## Epic: Concurrency pack
<!-- oakum-roadmap-key: E-concurrency -->
> **Epic** · **Phase:** Phase 3 · requires G2

### Outcome
General schedule plans across proxies, beyond the built-in stale-repopulation case.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `concurrency.schedule` | General schedule plans across proxies: ordered holds and releases by signal | strong-agent | M | `concurrency.stale-repop`, `experiment.decide` |
| `property.concurrent-invariant` | `concurrent_invariant` with SQL predicate | strong-agent | M | `concurrency.schedule` |
| `concurrency.exploration` | Bounded schedule exploration with seed and `reproducible: k/n` | strong-agent | M | `concurrency.schedule` |

### Exit criteria
- [ ] A seeded lost-update bug fails with a schedule replay.

## Epic: PG wire proxy, Replica and Transaction packs
<!-- oakum-roadmap-key: E-pg -->
> **Epic** · **Phase:** Phase 3 · requires G2

### Outcome
Postgres traffic passes through Oakum, which can delay replicas and interrupt transactions.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.pg-core` | Postgres wire pass-through (simple and extended query), event log | strong-agent | M | `experiment.decide` |
| `proxy.pg-faults` | Delay per connection, cut after statement N, hold commit | strong-agent | M | `proxy.pg-core` |
| `replica.bounded` | Replica pack: `bounded_staleness` on replica connections | free-agent | S | `proxy.pg-faults` |
| `property.atomic` | `atomic_under_interruption` with invariant predicate | strong-agent | M | `proxy.pg-faults` |
| `bench.bugs-pg` | Seeded replica and transaction bugs with controls | free-agent | S | `proxy.pg-faults` |

### Exit criteria
- [ ] Replica and transaction bugs fail; controls pass.

## Epic: TypeScript and Python analyzers
<!-- oakum-roadmap-key: E-lang-ts-py -->
> **Epic** · **Phase:** Phase 3 · requires G2

### Outcome
`oakum scan` works on TypeScript and Python services with the same `state-touch` format.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.ts-core` | TypeScript analyzer on the TS compiler API, emitting `state-touch/v0` | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.ts-libs` | ioredis, node-redis, Prisma, Drizzle, TypeORM, pg, nats.js, BullMQ | free-agent | M | `analyzer.ts-core` |
| `analyzer.py-core` | Python analyzer with type inference | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.py-libs` | redis-py, SQLAlchemy, Django ORM, psycopg, nats-py, Celery | free-agent | M | `analyzer.py-core` |
| `bench.ts-py` | Experiment service ports in TypeScript and Python | free-agent | M | `bench.service` |

### Exit criteria
- [ ] Zero false `GAP` on the TS and Python bench controls.

## Epic: Evidence and research wave 2
<!-- oakum-roadmap-key: E-research2 -->
> **Epic** · **Phase:** Phase 3

### Outcome
StateBugs v1 and the empirical study are public; the first real upstream bugs and pilot teams arrive.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `evidence.scan-50` | `oakum scan` over 50 open-source Go services with Redis or NATS | free-agent | S | `scan.perf` |
| `evidence.upstream-5` | Properties for five projects; real bugs go upstream first (G3) | strong-agent | M | `evidence.scan-50` |
| `evidence.pilots` | Recruit five pilot teams | maintainer | S | `launch.v0-1` |
| `dataset.zenodo` | StateBugs v1 on Zenodo with DOI and datasheet | free-agent | S | `mining.r1` |
| `paper.p2` | P2 dataset preprint | maintainer | M | `dataset.zenodo` |
| `paper.p1` | P1 empirical study preprint | maintainer | M | `mining.r1` |

### Exit criteria
- [ ] StateBugs v1 has a DOI; P1 and P2 preprints are public.

---

# Phase 4 — Projection, Kafka, AMQP, Workflow, MySQL, docs (2027-02-08 → 2027-03-07)

## Epic: Projection pack
<!-- oakum-roadmap-key: E-projection -->
> **Epic** · **Phase:** Phase 4 · requires G2

### Outcome
Search indexes and read models are checked for convergence with their source.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.http-core` | HTTP proxy with fault plans by method and path | strong-agent | S | `experiment.decide` |
| `projection.search` | Elasticsearch, OpenSearch, Meilisearch adapters | free-agent | M | `proxy.http-core` |
| `property.convergence` | `convergence` with source and projection queries | strong-agent | M | `projection.search` |

### Exit criteria
- [ ] A seeded dropped-index-update bug fails; controls pass.

## Epic: Kafka and AMQP
<!-- oakum-roadmap-key: E-brokers -->
> **Epic** · **Phase:** Phase 4 · requires G2

### Outcome
The Event pack works over Kafka and RabbitMQ.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.kafka-core` | Kafka protocol pass-through (produce, fetch, offset commit) | strong-agent | M | `experiment.decide` |
| `proxy.kafka-faults` | Redeliver by offset reset, drop commit, delay | strong-agent | M | `proxy.kafka-core` |
| `proxy.amqp` | RabbitMQ AMQP 0-9-1 proxy: redeliver, drop ack | strong-agent | M | `experiment.decide` |
| `analyzer.brokers` | Kafka and AMQP detectors in Go, TS, Python | free-agent | M | `analyzer.go-core` |

### Exit criteria
- [ ] Event bench bugs fail on Kafka and RabbitMQ.

## Epic: Workflow pack and MySQL
<!-- oakum-roadmap-key: E-workflow -->
> **Epic** · **Phase:** Phase 4 · requires G2

### Outcome
Workflow steps are checked for idempotency under restarts, and MySQL joins Postgres.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `workflow.restart` | Container restart mid-step as a fault | strong-agent | S | `verify.compose` |
| `property.idempotent-step` | `idempotent_step` for Temporal, BullMQ, Celery | strong-agent | M | `workflow.restart` |
| `proxy.mysql` | MySQL wire proxy with the PG fault set | strong-agent | M | `proxy.pg-core` |

### Exit criteria
- [ ] A seeded double-applied workflow step fails.

## Epic: Docs site
<!-- oakum-roadmap-key: E-docs -->
> **Epic** · **Phase:** Phase 4

### Outcome
Docs organized by the pain people search for, verified by Seaworthy, with a public threat model.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `docs.site` | Docs organized by pain ("test cache invalidation", "test duplicate events") | free-agent | M | `launch.v0-1` |
| `docs.verified` | Docs site passes Seaworthy in CI | free-agent | XS | `docs.site` |
| `docs.recipes` | One recipe per pack per language | free-agent | M | `docs.site` |
| `docs.threat-model` | Public threat model and residual risks | strong-agent | S | `verify.lint`, `verify.isolation` |

### Exit criteria
- [ ] Every shipped pack has a recipe; the docs site passes Seaworthy.

---

# Phase 5 — Recovery, multi-service, advanced properties, JVM (2027-03-08 → 2027-04-04)

## Epic: Recovery pack
<!-- oakum-roadmap-key: E-recovery -->
> **Epic** · **Phase:** Phase 5 · requires G2

### Outcome
Systems are checked for returning to a permitted state within a window after kills and partitions.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `recovery.faults` | Container kill and network partition faults | strong-agent | M | `verify.compose` |
| `property.recovers-within` | `recovers_within` window property | strong-agent | S | `recovery.faults` |

### Exit criteria
- [ ] A seeded non-recovering service fails; a recovering control passes.

## Epic: Multi-service and advanced properties
<!-- oakum-roadmap-key: E-advanced -->
> **Epic** · **Phase:** Phase 5 · requires G2

### Outcome
Properties span services and cover outbox integrity, tenant isolation, migrations, and projection monotonicity.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `multi.services` | Properties spanning several services in one Compose env | strong-agent | M | `verify.compose` |
| `property.outbox` | Outbox integrity under crash | strong-agent | M | `recovery.faults` |
| `property.tenant` | Tenant isolation: no key or row visible across tenants | strong-agent | M | `property.read-after-write` |
| `property.migration` | Migration invariant across old and new versions | strong-agent | M | `multi.services` |
| `property.monotonic` | Projection monotonicity | free-agent | S | `property.convergence` |

### Exit criteria
- [ ] Each property type has a seeded bug and a control in the bench.

## Epic: JVM analyzer and distribution
<!-- oakum-roadmap-key: E-lang-jvm -->
> **Epic** · **Phase:** Phase 5

### Outcome
`oakum scan` covers Java and Kotlin, and Oakum is listed where its users look.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.jvm` | Java and Kotlin: Spring Data, Jedis, Lettuce, Kafka, JDBC | strong-agent | M | `scan.state-touch-schema` |
| `dist.lists` | awesome-go, CNCF landscape, MCP registries, Skill directories | maintainer | S | `launch.v0-1` |
| `dist.upstream-docs` | Testing examples for go-redis, nats.go, ioredis docs | free-agent | S | `docs.recipes` |

### Exit criteria
- [ ] JVM bench controls show zero false `GAP`.

## Epic: Research wave 3
<!-- oakum-roadmap-key: E-research3 -->
> **Epic** · **Phase:** Phase 5

### Outcome
The full agent study runs on the StateBugs held-out split.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p3-full` | Full agent study on StateBugs held-out split, re-registered on OSF | maintainer | M | `dataset.zenodo` |

### Exit criteria
- [ ] The study is submitted to a registered-report or main-track venue.

---

# Phase 6 — Open spec and breadth (2027-04-05 → 2027-05-02)

## Epic: Open spec and conformance
<!-- oakum-roadmap-key: E-spec -->
> **Epic** · **Phase:** Phase 6

### Outcome
Spec 1.0-rc for `state-touch`, `property`, and `report`, with a conformance suite another tool can pass.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.formats` | Spec 1.0-rc for `state-touch`, `property`, `report` | maintainer | M | `core.report-json`, `scan.state-touch-schema` |
| `spec.conformance` | Conformance suite for analyzers, proxies, report producers | strong-agent | M | `spec.formats` |
| `spec.invite` | Invite one independent implementer | maintainer | S | `spec.conformance` |

### Exit criteria
- [ ] Oakum passes its own conformance suite.

## Epic: Rust, .NET, CI systems
<!-- oakum-roadmap-key: E-breadth1 -->
> **Epic** · **Phase:** Phase 6 · requires G2

### Outcome
Analyzers for Rust and .NET, and Oakum runs in GitLab CI, pre-commit, and dependency-bot PRs.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.rust` | redis-rs, sqlx, diesel, async-nats, rdkafka | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.dotnet` | StackExchange.Redis, EF Core, MassTransit | strong-agent | M | `scan.state-touch-schema` |
| `ci.gitlab` | GitLab CI template | free-agent | S | `agent.action` |
| `ci.precommit` | pre-commit hook (scan only) | free-agent | XS | `scan.diff` |
| `ci.deps` | Verify on Renovate and Dependabot PRs that bump DB, cache, or broker clients | free-agent | S | `agent.action` |

### Exit criteria
- [ ] Each analyzer passes the conformance suite.

## Epic: Research wave 4 and month-6 checkpoint
<!-- oakum-roadmap-key: E-research4 -->
> **Epic** · **Phase:** Phase 6

### Outcome
The tool paper is written, and the second half of the year is rewritten from evidence.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p4` | Tool paper on non-blocking command-level hold | maintainer | M | `concurrency.schedule` |
| `review.m6` | Month-6 checkpoint: review gates, usage, maintenance cost, papers; rewrite Phases 8–12 | maintainer | S | `experiment.decide` |

### Exit criteria
- [ ] Phases 8–12 of this file are rewritten and no longer marked provisional.

---

# Phase 7 — Stability, governance, launch (2027-05-03 → 2027-05-30)

## Epic: 1.0
<!-- oakum-roadmap-key: E-v1 -->
> **Epic** · **Phase:** Phase 7

### Outcome
Oakum 1.0 with frozen contracts, governance, a security review, and evidence that outside teams keep it in CI.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `v1.freeze` | Freeze CLI flags, exit codes, schemas; deprecation policy | maintainer | S | `spec.conformance` |
| `v1.governance` | `GOVERNANCE.md`, `MAINTAINERS.md`, per-ecosystem maintainers | maintainer | S | none |
| `v1.security` | Sandbox review, `SECURITY.md` | strong-agent | M | `docs.threat-model` |
| `v1.g4` | G4 write-up with permission | maintainer | S | `evidence.pilots` |
| `v1.launch` | Release, posts, Show HN, demo, StateBench preview | maintainer | S | `v1.freeze`, `v1.g4` |

### Exit criteria
- [ ] `1.0.0` is released and G4 is met.

---

# Phase 8 — StateBench 1.0 (2027-05-31 → 2027-06-27)

## Epic: StateBench
<!-- oakum-roadmap-key: E-statebench -->
> **Epic** · **Phase:** Phase 8 · provisional

### Outcome
A public benchmark for agents on state correctness, built on StateBugs, with a held-out split and a leaderboard.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `statebench.cases` | StateBugs plus seeded cases across languages and packs, as agent tasks | free-agent | M | `dataset.zenodo` |
| `statebench.heldout` | Private held-out split with rotation policy | maintainer | S | `statebench.cases` |
| `statebench.harness` | Agent-agnostic harness and scoring | strong-agent | M | `statebench.cases` |
| `statebench.leaderboard` | Public leaderboard, only after held-out and scoring are defensible | free-agent | M | `statebench.harness`, `statebench.heldout` |
| `statebench.outreach` | Invite agent and model builders to report | maintainer | S | `statebench.leaderboard` |

### Exit criteria
- [ ] At least one outside agent or model builder reports a result.

---

# Phase 9 — Trace-based suggestion (2027-06-28 → 2027-07-25)

## Epic: Observed state graph
<!-- oakum-roadmap-key: E-trace -->
> **Epic** · **Phase:** Phase 9 · provisional

### Outcome
Property drafts and affected-property selection come from observed runtime traces, not static guesses.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `trace.ingest` | OpenTelemetry traces and proxy logs into an observed graph (`OBSERVED` edges only) | strong-agent | M | `proxy.resp-core` |
| `trace.suggest` | Deterministic property drafts from write-then-read and publish-then-consume pairs | strong-agent | M | `trace.ingest` |
| `trace.affected` | Observed graph selects properties for `verify --affected` | strong-agent | S | `trace.ingest` |

### Exit criteria
- [ ] Suggested drafts pass `check-property` on the bench at a published rate.

---

# Phase 10 — Protocol and language breadth (2027-07-26 → 2027-08-22)

## Epic: Breadth 2
<!-- oakum-roadmap-key: E-breadth2 -->
> **Epic** · **Phase:** Phase 10 · provisional

### Outcome
Oakum covers the common remaining backends and languages.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.mongo` | MongoDB wire proxy | strong-agent | M | `spec.conformance` |
| `proxy.memcached` | Memcached and Valkey coverage | free-agent | S | `proxy.resp-core` |
| `proxy.cloud` | SQS, SNS, Kinesis, DynamoDB local, S3 via LocalStack | strong-agent | M | `proxy.http-core` |
| `proxy.pulsar` | Pulsar proxy | strong-agent | M | `spec.conformance` |
| `proxy.grpc` | gRPC-aware HTTP/2 faults | strong-agent | M | `proxy.http-core` |
| `proxy.resp-cluster` | Redis TLS, Cluster, Sentinel support with conformance tests | strong-agent | M | `proxy.resp-conformance` |
| `analyzer.more` | Ruby, PHP, Elixir analyzers (community-led where possible) | free-agent | M | `spec.conformance` |

### Exit criteria
- [ ] Every new proxy and analyzer passes conformance.

---

# Phase 11 — Kubernetes, cross-repository, shadow verify, IDE (2027-08-23 → 2027-09-19)

## Epic: Platform and daily use
<!-- oakum-roadmap-key: E-platform -->
> **Epic** · **Phase:** Phase 11 · provisional

### Outcome
Oakum runs on Kubernetes, across repositories, against staging read-only, and inside the editor.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `k8s.env` | Verify on kind or k3d with Helm charts | strong-agent | M | `verify.compose` |
| `k8s.sidecar` | Proxies as sidecars with the same isolation rule | strong-agent | M | `k8s.env` |
| `contracts.cross-repo` | Properties shared between repositories as versioned contracts | strong-agent | M | `multi.services` |
| `shadow.staging` | Read-only property checks against staging with recorded traffic; never production | strong-agent | M | `trace.ingest` |
| `ide.vscode` | VS Code extension: state coverage beside code | free-agent | M | `scan.diff` |
| `ide.goland` | GoLand plugin | free-agent | M | `scan.diff` |

### Exit criteria
- [ ] The bench runs on kind with sidecar proxies.

---

# Phase 12 — Spec 2 and team edition (2027-09-20 → 2027-10-17)

## Epic: Standard, sustainability, review
<!-- oakum-roadmap-key: E-standard -->
> **Epic** · **Phase:** Phase 12 · provisional

### Outcome
An independent implementation of the spec, a sustainable team edition, and a plan for year two.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.v2` | Spec 2.0 with outside implementers and governance members | maintainer | M | `spec.invite` |
| `spec.g5` | G5: independent implementation passes conformance | maintainer | S | `spec.v2` |
| `team.evidence` | Optional hosted evidence retention, policy gates, audit reports | strong-agent | M | `v1.freeze` |
| `team.badge` | "state-verified" badge for repositories | free-agent | S | `agent.action` |
| `dataset.v2` | StateBugs v2 with new languages and packs | free-agent | M | `statebench.cases` |
| `review.h2` | Twelve-month review: gates, usage, maintenance cost, papers, next year's plan | maintainer | S | `review.m6` |

### Exit criteria
- [ ] Year-two roadmap is written from the review.
