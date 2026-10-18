# Roadmap: 12 months (2026-10-19 → 2027-10-17)

> **wt** (working name) · *Changes flow. State holds.*
>
> Agent-native verification of application state. `wt scan` tells an agent which database, cache, and broker paths its change touched and
> which have no property; `wt verify` runs those properties through command-aware protocol proxies and returns a verdict with a replay.
> Free and open source. Every phase also feeds a research track, so the work stays publishable if the product does not take off.

## North star

By month 12, any coding agent that changes code touching a database, cache, or broker runs `wt` before pushing, and StateBench is how agents
are measured on state correctness.

**Floor:** whatever happens to the product, a public real-bug dataset (StateBugs), an empirical study, and a pre-registered agent experiment.

## Why wt

Research on 2026-10-18 and an external review the same day found:

- Antithesis already lets agents infer properties and inject mutants, for distributed databases on its own platform. That loop is not new.
- RedFI (last push 2020) already injects per-command Redis faults. Protocol-aware fault injection is not new.
- No tool found holds one connection's command until a named event without blocking other connections, which is what reproduces cache
  stale repopulation without instrumenting the app.
- No public, reproducible corpus of real application-level state bugs was found.

So wt's bet is a local, CI-native workflow for application state, with two assets that are hard to copy: **StateBugs/StateBench** and a
library of **validated property packs**. Design: [docs/superpowers/specs/2026-10-18-wt-design.md](docs/superpowers/specs/2026-10-18-wt-design.md).

## Product principles

1. **Verdicts come from execution.** Static analysis selects; only a run can fail.
2. **Agents write, wt judges, humans promote.** Humans review a property's meaning, not just its sensitivity.
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
| G3 Real bugs | one accepted upstream fix from a wt finding | 3 | none |
| G4 Retention | three outside teams keep `wt verify` in CI 30+ days | 7 | 1.0 announcement |
| G5 Standard | an independent tool passes the conformance suite | 12 | Spec 2.0 |

**Stop or pivot after Phase 1** if C does not beat B by the margin, stale repopulation reproduces < 9/10, or a property takes longer to write
than the equivalent Go test. Then Phase 2 runs `E-pivot` instead of `E-product`. The research track continues in every case.

## Phases

| Phase | Dates | Focus | Release |
|---|---|---|---|
| Phase 0 | 2026-10-19 → 2026-10-25 | Foundations, pre-registration, name, research setup | none |
| Phase 1 | 2026-10-26 → 2026-12-06 | **Falsification experiment** (6 weeks): Redis, stale repopulation, A/B/C | `0.0.1` (experiment build) |
| Phase 2 | 2026-12-07 → 2027-01-10 | Product core: Event pack, Go analyzer, scan, agent surface; R1 | `0.1.0` |
| Phase 3 | 2027-01-11 → 2027-02-07 | Concurrency, PG wire, TypeScript and Python | `0.2.0` |
| Phase 4 | 2027-02-08 → 2027-03-07 | Projection, Kafka, AMQP, Workflow, MySQL, docs site | `0.3.0` |
| Phase 5 | 2027-03-08 → 2027-04-04 | Recovery, multi-service, advanced properties, JVM | `0.4.0` |
| Phase 6 | 2027-04-05 → 2027-05-02 | Open spec and conformance, Rust and .NET, CI systems | `0.5.0` + Spec 1.0-rc |
| Phase 7 | 2027-05-03 → 2027-05-30 | Stability, governance, launch | **`1.0.0`** + Spec 1.0 |
| Phase 8 | 2027-05-31 → 2027-06-27 | StateBench 1.0 and leaderboard | StateBench 1.0 |
| Phase 9 | 2027-06-28 → 2027-07-25 | Trace-based property suggestion | `1.1.0` |
| Phase 10 | 2027-07-26 → 2027-08-22 | Protocol and language breadth | `1.2.0` |
| Phase 11 | 2027-08-23 → 2027-09-19 | Kubernetes, cross-repository contracts, shadow verify, IDE | `1.3.0` |
| Phase 12 | 2027-09-20 → 2027-10-17 | Spec 2, team edition, twelve-month review | `2.0.0` + Spec 2.0 |

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

## Labels

Same system as Evergreen, Seaworthy, and Slipway: `roadmap`, `type: epic`/`task`, lanes (`strong-agent`, `free-agent`, `maintainer`),
sizes (`XS`, `S`, `M`), and areas (`analyzer`, `proxy`, `verify`, `scan`, `report`, `agent`, `bench`, `research`, `docs`, `brand`, `spec`).

**Lanes.** `strong-agent`: protocol proxies, analyzers, core semantics, reproductions. `free-agent`: detectors, fixtures, docs, wrappers,
mining candidates. `maintainer`: naming, spec decisions, labelling, pre-registration, papers, outreach.

---

# Phase 0 — Foundations, pre-registration, name, research setup (2026-10-19 → 2026-10-25)

## Epic: Repository and contribution lanes
<!-- wt-roadmap-key: E-foundation -->
> **Epic** · **Phase:** Phase 0

### Outcome
A Go repository agents can contribute to on day one, with CI, lanes, and the roadmap tooling from Seaworthy.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `foundation.layout` | Go module layout: `cmd/wt`, `internal/core`, `proxy/resp`, `verify`, `report`; later `analyzer/go`, `proxy/nats` | strong-agent | S | none |
| `foundation.ci` | CI: `go test ./...`, `golangci-lint`, race detector, Docker for integration tests | free-agent | S | `foundation.layout` |
| `foundation.agents-md` | `AGENTS.md` and `CLAUDE.md` for working on wt, including no-fixture-no-merge and the held-out rule | strong-agent | S | `foundation.layout` |
| `foundation.contributing` | `CONTRIBUTING.md` with lanes, sizes, claim process | free-agent | XS | `foundation.agents-md` |
| `foundation.roadmap-sync` | Port `planning/roadmap/` from Seaworthy with key prefix `wt-roadmap-key` | free-agent | S | none |
| `foundation.license` | License decision (Apache-2.0 recommended) and `NOTICE`; data license for datasets (CC BY 4.0) | maintainer | XS | none |

### Exit criteria
- CI green on the skeleton; roadmap sync dry-run reproduces this file.

## Epic: Pre-registration
<!-- wt-roadmap-key: E-prereg -->
> **Epic** · **Phase:** Phase 0

### Outcome
G1 and G2 are fixed publicly before detection code exists.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `prereg.g1` | G1: bugs, controls, pass and fail definitions, 9/10 reproduction rule | maintainer | S | none |
| `prereg.g2` | G2: arms A/B/C, model, prompt, time, tokens, guidance, attempts, primary metric and margin, statistical test | maintainer | S | none |
| `prereg.osf` | Register G1/G2 on OSF; link from the repository | maintainer | XS | `prereg.g2` |
| `prereg.heldout` | Held-out cases built by a person or agent that never sees wt's code; sealed until the run | maintainer | S | `prereg.g2` |
| `prereg.competitors` | Written comparison: Antithesis and its skills, RedFI, Toxiproxy, Envoy, Shuttle/Loom, Schemathesis, Polaris, PBT-Bench | free-agent | S | none |

### Exit criteria
- OSF registration timestamp precedes the first commit under `proxy/`.

## Epic: Research setup
<!-- wt-roadmap-key: E-research-setup -->
> **Epic** · **Phase:** Phase 0

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `research.protocol` | Mining and labelling protocol: what counts as a state bug, inclusion and exclusion rules, label schema | maintainer | S | none |
| `research.coauthor` | Find an academic co-author or an arXiv cs.SE endorser | maintainer | S | none |
| `research.venues` | Deadline calendar for MSR, ICSE/FSE Registered Reports, ISSTA, ASE, LLM4Code, AIware, FORGE | free-agent | XS | none |

## Epic: Name and brand
<!-- wt-roadmap-key: E-brand -->
> **Epic** · **Phase:** Phase 0 (name), Phase 7 (kit)

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `brand.names` | Shortlist 15 names; check GitHub, npm, PyPI, Go module path, Homebrew, domains, category collisions | free-agent | S | none |
| `brand.pick` | Choose the name and tagline | maintainer | XS | `brand.names` |
| `brand.rename` | Rename binary, module path, docs | free-agent | XS | `brand.pick` |
| `brand.mark` | Mark in the ring family of Seaworthy and Evergreen, in the fourth product color family | maintainer | M | `brand.pick` |
| `brand.kit` | Brand kit: four colorways, favicon set, badge, guide | free-agent | S | `brand.mark` |

### Exit criteria
- Name chosen before the first public commit.

---

# Phase 1 — Falsification experiment (2026-10-26 → 2026-12-06) · `0.0.1`

Only what G1 and G2 need. Out of scope here: NATS, analyzer, `scan`, MCP, npm/PyPI, SARIF, ecosystem scans, StateBench packaging.

## Epic: Experiment service
<!-- wt-roadmap-key: E-bench -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `bench.service` | Go service: HTTP API, Postgres, Redis cache-aside with go-redis, Compose file, deterministic seed | strong-agent | M | `foundation.layout` |
| `bench.bugs` | Seeded bugs as git tags: missing invalidation, wrong-key invalidation, stale repopulation | free-agent | S | `bench.service` |
| `bench.controls` | 3 correct controls and 2 permitted-eventual controls as git tags | free-agent | S | `bench.service` |
| `bench.baseline-tests` | Hand-written Go integration tests for the 3 bugs; measures arm A setup cost | strong-agent | S | `bench.bugs` |
| `bench.runner` | `make bench` runs every tag and writes a results table | free-agent | S | `bench.bugs` |

## Epic: Core semantics and report
<!-- wt-roadmap-key: E-core -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `core.config` | `wt.yaml` v0 parser and JSON Schema; `$fresh`; `tolerates` | strong-agent | S | `foundation.layout` |
| `core.outcomes` | `pass`/`fail`/`unknown`/`not_tested`; `kind: regression\|resilience`; `runs`, `scope`, `reproducible: k/n`; exit codes | strong-agent | S | `core.config` |
| `core.report-json` | `wt.report/v0` JSON Schema forbidding `pass` without `runs ≥ 1`; golden tests | strong-agent | S | `core.outcomes` |
| `core.replay` | Fault-plan replay: same seed, fixtures, HTTP sequence, fault plan, hold-release order | strong-agent | M | `proxy.resp-faults` |

## Epic: Cache pack and RESP proxy
<!-- wt-roadmap-key: E-cache -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.resp-core` | RESP proxy on `tidwall/redcon`: single-node, RESP2/RESP3, pipelining, no TLS; ordered event log | strong-agent | M | `foundation.layout` |
| `proxy.resp-faults` | Fault plans: drop one command, delay, rewrite key, `hold-until` named event, non-blocking per connection | strong-agent | M | `proxy.resp-core` |
| `proxy.resp-conformance` | Conformance tests with go-redis and rueidis, including pipelines | free-agent | S | `proxy.resp-core` |
| `verify.compose` | Start Compose env, route the app's Redis through the proxy, health checks, teardown | strong-agent | M | `core.config` |
| `verify.lint` | Compose lint (`privileged`, host mounts, host network or pid, `docker.sock`, `cap_add`, devices) → `unknown: unsafe_compose` | strong-agent | S | `verify.compose` |
| `verify.isolation` | Non-Compose targets → `unknown: non_isolated_target`; secret-pattern check on env | strong-agent | S | `verify.compose` |
| `property.read-after-write` | `read_after_write` over HTTP write and read, JSONPath observe, `within_ms` | strong-agent | S | `verify.compose` |
| `concurrency.stale-repop` | Built-in stale-repopulation schedule: hold reader's `SET`, release after writer's `DEL` | strong-agent | M | `proxy.resp-faults` |
| `check.sensitivity` | `check-property`: code-defect faults for the type; `sensitive`/`insensitive`/`unknown` | strong-agent | S | `concurrency.stale-repop` |

### Exit criteria
- G1: 3/3 bugs fail, stale repopulation ≥ 9/10, 0/5 controls fail, every fail replays.

## Epic: Agent experiment
<!-- wt-roadmap-key: E-experiment -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `agent.skill-min` | Minimal `SKILL.md` for arm C: when to run, property template, outcome meanings | strong-agent | S | `check.sensitivity` |
| `experiment.harness` | Harness running arms A/B/C per the OSF registration, logging tokens, time, attempts | strong-agent | M | `prereg.osf` |
| `experiment.run` | Run on seeded and held-out cases, 5 runs per case per arm | maintainer | S | `experiment.harness` |
| `experiment.report` | Publish results, data, and deviations from the registration, whatever they show | maintainer | S | `experiment.run` |
| `experiment.decide` | GO / PIVOT / STOP decision recorded in `docs/decisions/` | maintainer | XS | `experiment.report` |

### Exit criteria
- G1 and G2 decided and published.

## Epic: Real-bug mining (research)
<!-- wt-roadmap-key: E-mining -->
> **Epic** · **Phase:** Phase 1 → Phase 2

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `mining.search` | Search commit history of open-source Go, TS, Python services for state-bug fixes (cache, events, projections, transactions) | free-agent | M | `research.protocol` |
| `mining.repro` | For each candidate: pinned commit pair, Docker reproduction, failing scenario | strong-agent | M | `mining.search` |
| `mining.label` | Two independent human labels per candidate; Cohen's kappa | maintainer | M | `mining.repro` |
| `mining.split` | Freeze train and held-out split before any wt tuning | maintainer | XS | `mining.label` |

### Exit criteria
- R1: ≥ 30 reproducible, double-labelled bugs.

---

# Phase 2 — Product core (2026-12-07 → 2027-01-10) · `0.1.0`

Runs `E-product` epics if G2 passed, `E-pivot` if it failed. Research epics run either way.

## Epic: Event pack
<!-- wt-roadmap-key: E-event -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.nats-core` | NATS pass-through with JetStream awareness and event log | strong-agent | M | `experiment.decide` |
| `proxy.nats-faults` | Redeliver, drop ack, drop publish, delay, hold-until | strong-agent | M | `proxy.nats-core` |
| `property.idempotent-effect` | `idempotent_effect` with SQL observe across two clean runs | strong-agent | M | `proxy.nats-faults` |
| `property.no-lost-event` | `no_lost_event` after a committed write | free-agent | S | `proxy.nats-faults` |
| `bench.bugs-event` | Seeded bugs: duplicate consumption, ack before commit; controls | free-agent | S | `proxy.nats-faults` |

## Epic: Go analyzer and scan
<!-- wt-roadmap-key: E-scan -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `scan.state-touch-schema` | `state-touch/v0` JSON Schema (language-neutral) | strong-agent | S | `experiment.decide` |
| `analyzer.go-core` | `go/packages` + `go/types` loader with incremental cache; fast and deep modes | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.go-libs` | Detectors: go-redis, rueidis, database/sql, pgx, gorm, sqlc, ent, nats.go | free-agent | M | `analyzer.go-core` |
| `scan.diff` | Join touches with git diff; `COVERED`/`GAP`/`STALE`; `covers` validation | strong-agent | S | `analyzer.go-core` |
| `scan.perf` | Benchmark cold and warm on five large Go repos; publish numbers before claiming any target | free-agent | S | `scan.diff` |

## Epic: Agent surface
<!-- wt-roadmap-key: E-agent -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `agent.init` | `wt init`: `wt.yaml` stub, AGENTS.md line (default, diff shown, `--no-agents-md`), Skill, Action | strong-agent | S | `scan.diff` |
| `agent.skill` | Full `SKILL.md`: scan, two templates, outcome meanings, consent before verify on untrusted repos | strong-agent | S | `agent.skill-min` |
| `agent.action` | GitHub Action: `verify --affected`, PR comment, SARIF, `allow-unknown: false` | free-agent | S | `core.report-json` |
| `agent.mcp` | MCP server: `scan`, `check_property`, `explain` | strong-agent | S | `agent.skill` |
| `agent.install` | Go install, Homebrew tap, install script, npm and PyPI wrappers | free-agent | S | `foundation.ci` |
| `agent.feedback` | `wt feedback` prefilled issue from a redacted report | free-agent | XS | `core.report-json` |
| `launch.demo` | 30-second recording of the stale-repopulation loop | maintainer | XS | `core.replay` |
| `launch.v0-1` | Release `0.1.0` | maintainer | XS | Phase 2 product epics |

## Epic: Pivot (only if G2 fails)
<!-- wt-roadmap-key: E-pivot -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `pivot.compare` | Show the library beats RedFI and Toxiproxy for hold-until; else stop product work | strong-agent | S | `experiment.decide` |
| `pivot.lib` | Proxies as a Go library with fault plans | strong-agent | M | `pivot.compare` |
| `pivot.testcontainers` | Testcontainers module wrapping the proxies | free-agent | S | `pivot.lib` |

## Epic: Research wave 1
<!-- wt-roadmap-key: E-research1 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p3-pilot` | Workshop paper on the Phase 1 experiment (pilot, positive or negative) | maintainer | M | `experiment.report` |
| `mining.r1` | Close R1 | maintainer | S | `mining.split` |

---

# Phase 3 — Concurrency, PG wire, TypeScript and Python (2027-01-11 → 2027-02-07) · `0.2.0`

Requires G2.

## Epic: Concurrency pack
<!-- wt-roadmap-key: E-concurrency -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `concurrency.schedule` | General schedule plans across proxies: ordered holds and releases by signal | strong-agent | M | `concurrency.stale-repop` |
| `property.concurrent-invariant` | `concurrent_invariant` with SQL predicate | strong-agent | M | `concurrency.schedule` |
| `concurrency.exploration` | Bounded schedule exploration with seed and `reproducible: k/n` | strong-agent | M | `concurrency.schedule` |

## Epic: PG wire proxy, Replica and Transaction packs
<!-- wt-roadmap-key: E-pg -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.pg-core` | Postgres wire pass-through (simple and extended query), event log | strong-agent | M | `experiment.decide` |
| `proxy.pg-faults` | Delay per connection, cut after statement N, hold commit | strong-agent | M | `proxy.pg-core` |
| `replica.bounded` | Replica pack: `bounded_staleness` on replica connections | free-agent | S | `proxy.pg-faults` |
| `property.atomic` | `atomic_under_interruption` with invariant predicate | strong-agent | M | `proxy.pg-faults` |
| `bench.bugs-pg` | Seeded replica and transaction bugs with controls | free-agent | S | `proxy.pg-faults` |

## Epic: TypeScript and Python analyzers
<!-- wt-roadmap-key: E-lang-ts-py -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.ts-core` | TypeScript analyzer on the TS compiler API, emitting `state-touch/v0` | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.ts-libs` | ioredis, node-redis, Prisma, Drizzle, TypeORM, pg, nats.js, BullMQ | free-agent | M | `analyzer.ts-core` |
| `analyzer.py-core` | Python analyzer with type inference | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.py-libs` | redis-py, SQLAlchemy, Django ORM, psycopg, nats-py, Celery | free-agent | M | `analyzer.py-core` |
| `bench.ts-py` | Experiment service ports in TypeScript and Python | free-agent | M | `bench.service` |

## Epic: Evidence and research wave 2
<!-- wt-roadmap-key: E-research2 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `evidence.scan-50` | `wt scan` over 50 open-source Go services with Redis or NATS | free-agent | S | `scan.perf` |
| `evidence.upstream-5` | Properties for five projects; real bugs go upstream first (G3) | strong-agent | M | `evidence.scan-50` |
| `evidence.pilots` | Recruit five pilot teams | maintainer | S | `launch.v0-1` |
| `dataset.zenodo` | StateBugs v1 on Zenodo with DOI and datasheet | free-agent | S | `mining.r1` |
| `paper.p2` | P2 dataset preprint | maintainer | M | `dataset.zenodo` |
| `paper.p1` | P1 empirical study preprint | maintainer | M | `mining.r1` |

---

# Phase 4 — Projection, Kafka, AMQP, Workflow, MySQL, docs (2027-02-08 → 2027-03-07) · `0.3.0`

## Epic: Projection pack
<!-- wt-roadmap-key: E-projection -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.http-core` | HTTP proxy with fault plans by method and path | strong-agent | S | `experiment.decide` |
| `projection.search` | Elasticsearch, OpenSearch, Meilisearch adapters | free-agent | M | `proxy.http-core` |
| `property.convergence` | `convergence` with source and projection queries | strong-agent | M | `projection.search` |

## Epic: Kafka and AMQP
<!-- wt-roadmap-key: E-brokers -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.kafka-core` | Kafka protocol pass-through (produce, fetch, offset commit) | strong-agent | M | `experiment.decide` |
| `proxy.kafka-faults` | Redeliver by offset reset, drop commit, delay | strong-agent | M | `proxy.kafka-core` |
| `proxy.amqp` | RabbitMQ AMQP 0-9-1 proxy: redeliver, drop ack | strong-agent | M | `experiment.decide` |
| `analyzer.brokers` | Kafka and AMQP detectors in Go, TS, Python | free-agent | M | `analyzer.go-core` |

## Epic: Workflow pack and MySQL
<!-- wt-roadmap-key: E-workflow -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `workflow.restart` | Container restart mid-step as a fault | strong-agent | S | `verify.compose` |
| `property.idempotent-step` | `idempotent_step` for Temporal, BullMQ, Celery | strong-agent | M | `workflow.restart` |
| `proxy.mysql` | MySQL wire proxy with the PG fault set | strong-agent | M | `proxy.pg-core` |

## Epic: Docs site
<!-- wt-roadmap-key: E-docs -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `docs.site` | Docs organized by pain ("test cache invalidation", "test duplicate events") | free-agent | M | `launch.v0-1` |
| `docs.verified` | Docs site passes Seaworthy in CI | free-agent | XS | `docs.site` |
| `docs.recipes` | One recipe per pack per language | free-agent | M | `docs.site` |
| `docs.threat-model` | Public threat model and residual risks | strong-agent | S | `verify.lint` |

---

# Phase 5 — Recovery, multi-service, advanced properties, JVM (2027-03-08 → 2027-04-04) · `0.4.0`

## Epic: Recovery pack
<!-- wt-roadmap-key: E-recovery -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `recovery.faults` | Container kill and network partition faults | strong-agent | M | `verify.compose` |
| `property.recovers-within` | `recovers_within` window property | strong-agent | S | `recovery.faults` |

## Epic: Multi-service and advanced properties
<!-- wt-roadmap-key: E-advanced -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `multi.services` | Properties spanning several services in one Compose env | strong-agent | M | `verify.compose` |
| `property.outbox` | Outbox integrity under crash | strong-agent | M | `recovery.faults` |
| `property.tenant` | Tenant isolation: no key or row visible across tenants | strong-agent | M | `property.read-after-write` |
| `property.migration` | Migration invariant across old and new versions | strong-agent | M | `multi.services` |
| `property.monotonic` | Projection monotonicity | free-agent | S | `property.convergence` |

## Epic: JVM analyzer and distribution
<!-- wt-roadmap-key: E-lang-jvm -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.jvm` | Java and Kotlin: Spring Data, Jedis, Lettuce, Kafka, JDBC | strong-agent | M | `scan.state-touch-schema` |
| `dist.lists` | awesome-go, CNCF landscape, MCP registries, Skill directories | maintainer | S | `launch.v0-1` |
| `dist.upstream-docs` | Testing examples for go-redis, nats.go, ioredis docs | free-agent | S | `docs.recipes` |

## Epic: Research wave 3
<!-- wt-roadmap-key: E-research3 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p3-full` | Full agent study on StateBugs held-out split, re-registered on OSF | maintainer | M | `dataset.zenodo` |

---

# Phase 6 — Open spec and breadth (2027-04-05 → 2027-05-02) · `0.5.0` + Spec 1.0-rc

## Epic: Open spec and conformance
<!-- wt-roadmap-key: E-spec -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.formats` | Spec 1.0-rc for `state-touch`, `property`, `report` | maintainer | M | `core.report-json` |
| `spec.conformance` | Conformance suite for analyzers, proxies, report producers | strong-agent | M | `spec.formats` |
| `spec.invite` | Invite one independent implementer | maintainer | S | `spec.conformance` |

## Epic: Rust, .NET, CI systems
<!-- wt-roadmap-key: E-breadth1 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.rust` | redis-rs, sqlx, diesel, async-nats, rdkafka | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.dotnet` | StackExchange.Redis, EF Core, MassTransit | strong-agent | M | `scan.state-touch-schema` |
| `ci.gitlab` | GitLab CI template | free-agent | S | `agent.action` |
| `ci.precommit` | pre-commit hook (scan only) | free-agent | XS | `scan.diff` |
| `ci.deps` | Verify on Renovate and Dependabot PRs that bump DB, cache, or broker clients | free-agent | S | `agent.action` |

## Epic: Research wave 4
<!-- wt-roadmap-key: E-research4 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `paper.p4` | Tool paper on non-blocking command-level hold | maintainer | M | `concurrency.schedule` |

---

# Phase 7 — Stability, governance, launch (2027-05-03 → 2027-05-30) · `1.0.0` + Spec 1.0

## Epic: 1.0
<!-- wt-roadmap-key: E-v1 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `v1.freeze` | Freeze CLI flags, exit codes, schemas; deprecation policy | maintainer | S | `spec.conformance` |
| `v1.governance` | `GOVERNANCE.md`, `MAINTAINERS.md`, per-ecosystem maintainers | maintainer | S | none |
| `v1.security` | Sandbox review, `SECURITY.md` | strong-agent | M | `docs.threat-model` |
| `v1.g4` | G4 write-up with permission | maintainer | S | `evidence.pilots` |
| `v1.launch` | Release, posts, Show HN, demo, StateBench preview | maintainer | S | `v1.freeze` |

---

# Phase 8 — StateBench 1.0 (2027-05-31 → 2027-06-27)

## Epic: StateBench
<!-- wt-roadmap-key: E-statebench -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `statebench.cases` | StateBugs plus seeded cases across languages and packs, as agent tasks | free-agent | M | `dataset.zenodo` |
| `statebench.heldout` | Private held-out split with rotation policy | maintainer | S | `statebench.cases` |
| `statebench.harness` | Agent-agnostic harness and scoring | strong-agent | M | `statebench.cases` |
| `statebench.leaderboard` | Public leaderboard, only after held-out and scoring are defensible | free-agent | M | `statebench.harness` |
| `statebench.outreach` | Invite agent and model builders to report | maintainer | S | `statebench.leaderboard` |

---

# Phase 9 — Trace-based suggestion (2027-06-28 → 2027-07-25) · `1.1.0`

## Epic: Observed state graph
<!-- wt-roadmap-key: E-trace -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `trace.ingest` | OpenTelemetry traces and proxy logs into an observed graph (`OBSERVED` edges only) | strong-agent | M | `proxy.resp-core` |
| `trace.suggest` | Deterministic property drafts from write-then-read and publish-then-consume pairs | strong-agent | M | `trace.ingest` |
| `trace.affected` | Observed graph selects properties for `verify --affected` | strong-agent | S | `trace.ingest` |

---

# Phase 10 — Protocol and language breadth (2027-07-26 → 2027-08-22) · `1.2.0`

## Epic: Breadth 2
<!-- wt-roadmap-key: E-breadth2 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.mongo` | MongoDB wire proxy | strong-agent | M | `spec.conformance` |
| `proxy.memcached` | Memcached and Valkey coverage | free-agent | S | `proxy.resp-core` |
| `proxy.cloud` | SQS, SNS, Kinesis, DynamoDB local, S3 via LocalStack | strong-agent | M | `proxy.http-core` |
| `proxy.pulsar` | Pulsar proxy | strong-agent | M | `spec.conformance` |
| `proxy.grpc` | gRPC-aware HTTP/2 faults | strong-agent | M | `proxy.http-core` |
| `proxy.resp-cluster` | Redis TLS, Cluster, Sentinel support with conformance tests | strong-agent | M | `proxy.resp-conformance` |
| `analyzer.more` | Ruby, PHP, Elixir analyzers (community-led where possible) | free-agent | M | `spec.conformance` |

---

# Phase 11 — Kubernetes, cross-repository, shadow verify, IDE (2027-08-23 → 2027-09-19) · `1.3.0`

## Epic: Platform and daily use
<!-- wt-roadmap-key: E-platform -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `k8s.env` | Verify on kind or k3d with Helm charts | strong-agent | M | `verify.compose` |
| `k8s.sidecar` | Proxies as sidecars with the same isolation rule | strong-agent | M | `k8s.env` |
| `contracts.cross-repo` | Properties shared between repositories as versioned contracts | strong-agent | M | `multi.services` |
| `shadow.staging` | Read-only property checks against staging with recorded traffic; never production | strong-agent | M | `trace.ingest` |
| `ide.vscode` | VS Code extension: state coverage beside code | free-agent | M | `scan.diff` |
| `ide.goland` | GoLand plugin | free-agent | M | `scan.diff` |

---

# Phase 12 — Spec 2 and team edition (2027-09-20 → 2027-10-17) · `2.0.0` + Spec 2.0

## Epic: Standard, sustainability, review
<!-- wt-roadmap-key: E-standard -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.v2` | Spec 2.0 with outside implementers and governance members | maintainer | M | `spec.invite` |
| `spec.g5` | G5: independent implementation passes conformance | maintainer | S | `spec.v2` |
| `team.evidence` | Optional hosted evidence retention, policy gates, audit reports | strong-agent | M | `v1.freeze` |
| `team.badge` | "state-verified" badge for repositories | free-agent | S | `agent.action` |
| `dataset.v2` | StateBugs v2 with new languages and packs | free-agent | M | `statebench.cases` |
| `review.h2` | Twelve-month review: gates, usage, maintenance cost, papers, next year's plan | maintainer | S | all |
