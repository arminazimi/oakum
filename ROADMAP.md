# Roadmap: 12 months (2026-10-19 → 2027-10-17)

> **wt** (working name) · *Changes flow. State holds.*
>
> Agent-native verification of application state. `wt scan` tells an agent which database, cache, and broker paths its change touched and
> which have no property; `wt verify` runs those properties through protocol proxies that inject real faults, and returns a verdict with a
> replay. Free and open source.

## North star

By month 12, any coding agent that changes code touching a database, cache, or broker runs `wt` before pushing, and StateBench is how agents
are measured on state correctness.

## Why wt

Research on 2026-10-18 found no open-source tool that reproduces cache stale-repopulation races deterministically, and no tool that closes the
loop "agent writes an invariant, a tool proves the invariant can catch a fault, execution decides". Envoy's Redis filter injects only delay
and error, and its delays block every later command. Agent property-testing benchmarks (PBT-Bench, 2026) and mutation-guided test generation
exist for single libraries, not for state across services. wt adds:

1. **Protocol proxies with command-aware faults**: drop `DEL`, hold one `SET`, redeliver a message, cut after statement N. Language-independent.
2. **Mutation-validated properties**: a property is active only after it is shown to fail under its matching fault.
3. **Zero-config scan**: type-resolved detection of state touches, joined with the diff, in under two seconds.
4. **StateBench**: a public benchmark for agents on state correctness.

Design: [docs/superpowers/specs/2026-10-18-wt-design.md](docs/superpowers/specs/2026-10-18-wt-design.md).

## Product principles

1. **Verdicts come from execution.** Static analysis selects; only a run can fail.
2. **Agents write, wt judges, humans promote.** Properties are drafted by agents, validated by mutation, promoted in review.
3. **Never claim more than ran.** `pass` carries scope and runs; `unknown` is never a pass.
4. **Silent unless useful.** `scan` reports only diff-touched symbols and never fails a push by default.
5. **Isolated only.** No target outside the Compose or cluster network, and no bypass flag.
6. **Properties first, protocols as adapters.** The eight packs share property types; a new pack is mostly a proxy.
7. **No merge without a fixture.** Every detector, proxy fault, and property type lands with a `wt-bench` case and a conformance test.

## Gates

Gates never block building. They decide what is promoted, marked stable, and announced.

| Gate | Evidence | Phase |
|---|---|---|
| G1 Detection | 12/12 seeded bugs fail, 0/12 controls fail, every fail replays | 1 |
| G2 Agent value | arm C beats arm B on pre-registered metrics, same model and budget | 1 |
| G3 Real bugs | at least one accepted upstream issue or PR from a wt finding | 2 |
| G4 Retention | three outside teams keep `wt verify` in CI for 30+ days | 6 |
| G5 Standard | an independent tool passes the conformance suite | 12 |

If G2 fails, Phase 2 switches to the pivot epic (`E-pivot`): ship the proxies as a Go library and Testcontainers module.

## Phases

| Phase | Dates | Focus | Release |
|---|---|---|---|
| Phase 0 | 2026-10-19 → 2026-10-25 | Foundations, pre-registration, name | none |
| Phase 1 | 2026-10-26 → 2026-11-22 | Core: Cache and Event packs, scan, agent surface, evidence | `0.1.0` |
| Phase 2 | 2026-11-23 → 2026-12-20 | Concurrency, PG wire, TypeScript and Python | `0.2.0` |
| Phase 3 | 2026-12-21 → 2027-01-24 | Projection, Kafka, AMQP, Workflow, MySQL, docs site | `0.3.0` |
| Phase 4 | 2027-01-25 → 2027-02-21 | Recovery, multi-service, outbox, tenants, migrations, JVM | `0.4.0` |
| Phase 5 | 2027-02-22 → 2027-03-21 | Open spec and conformance, Rust and .NET, more CI systems | `0.5.0` + Spec 1.0-rc |
| Phase 6 | 2027-03-22 → 2027-04-18 | Stability, governance, launch | **`1.0.0`** + Spec 1.0 |
| Phase 7 | 2027-04-19 → 2027-05-16 | StateBench 1.0 and leaderboard | StateBench 1.0 |
| Phase 8 | 2027-05-17 → 2027-06-13 | Trace-based property suggestion | `1.1.0` |
| Phase 9 | 2027-06-14 → 2027-07-11 | Protocol and language breadth | `1.2.0` |
| Phase 10 | 2027-07-12 → 2027-08-08 | Kubernetes and cross-repository contracts | `1.3.0` |
| Phase 11 | 2027-08-09 → 2027-09-05 | Shadow verify in staging, IDE | `1.4.0` |
| Phase 12 | 2027-09-06 → 2027-10-17 | Spec 2, team edition, H2 review | `2.0.0` + Spec 2.0 |

## Labels

Same system as Evergreen, Seaworthy, and Slipway: `roadmap`, `type: epic`/`task`, lanes (`strong-agent`, `free-agent`, `maintainer`),
sizes (`XS`, `S`, `M`), and areas (`analyzer`, `proxy`, `verify`, `scan`, `report`, `agent`, `bench`, `docs`, `brand`, `spec`).

**Lanes.** `strong-agent`: protocol proxies, analyzers, core semantics. `free-agent`: detectors, fixtures, docs, wrappers. `maintainer`:
naming, spec decisions, outreach, anything published under the project's name.

---

# Phase 0 — Foundations, pre-registration, name (2026-10-19 → 2026-10-25)

## Epic: Repository and contribution lanes
<!-- wt-roadmap-key: E-foundation -->
> **Epic** · **Phase:** Phase 0

### Outcome
A Go repository agents can contribute to on day one, with CI, lanes, and the roadmap tooling from Seaworthy.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `foundation.layout` | Go module layout: `cmd/wt`, `internal/core`, `analyzer/go`, `proxy/resp`, `proxy/nats`, `verify`, `report` | strong-agent | S | none |
| `foundation.ci` | CI: `go test ./...`, `golangci-lint`, race detector, Docker available for integration tests | free-agent | S | `foundation.layout` |
| `foundation.agents-md` | `AGENTS.md` and `CLAUDE.md` for working on wt itself, including the no-fixture-no-merge rule | strong-agent | S | `foundation.layout` |
| `foundation.contributing` | `CONTRIBUTING.md` with lanes, sizes, claim process | free-agent | XS | `foundation.agents-md` |
| `foundation.roadmap-sync` | Port `planning/roadmap/` from Seaworthy with key prefix `wt-roadmap-key` | free-agent | S | none |
| `foundation.license` | License decision (Apache-2.0 recommended for patent grant) and `NOTICE` | maintainer | XS | none |

### Exit criteria
- CI green on an empty skeleton; roadmap sync dry-run produces this file's epics and tasks.

## Epic: Pre-registration
<!-- wt-roadmap-key: E-prereg -->
> **Epic** · **Phase:** Phase 0

### Outcome
Gate G1 and G2 metrics are fixed in the repository before any detection code exists.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `prereg.g1` | Write G1: bug list, control list, pass and fail definitions, flake budget | maintainer | S | none |
| `prereg.g2` | Write G2: arms A/B/C, model, token and time budget, primary metric (correct fix without regression), secondary metrics | maintainer | S | none |
| `prereg.baseline-tests` | Hand-written Go integration tests for the 12 seeded bugs, used as the arm A reference and setup-cost baseline | strong-agent | M | `bench.service` |
| `prereg.competitors` | Deeper overlap check: Toxiproxy, Antithesis, Shuttle and Loom, Schemathesis, Testcontainers modules, Polaris; written comparison | free-agent | S | none |

### Exit criteria
- `docs/prereg/` committed and tagged before `E-cache` merges.

## Epic: Name and brand
<!-- wt-roadmap-key: E-brand -->
> **Epic** · **Phase:** Phase 0 (name), Phase 6 (kit)

### Outcome
A final name that is free on GitHub, npm, PyPI, Homebrew, and a domain, fits the nautical family, and does not collide in this category.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `brand.names` | Shortlist 15 names; check GitHub, npm, PyPI, Go module path, Homebrew, domains, and category collisions | free-agent | S | none |
| `brand.pick` | Choose the name and tagline | maintainer | XS | `brand.names` |
| `brand.rename` | Rename binary, module path, docs | free-agent | XS | `brand.pick` |
| `brand.mark` | Mark in the ring family of Seaworthy and Evergreen, in the fourth product color family | maintainer | M | `brand.pick` |
| `brand.kit` | Brand kit: four colorways, favicon set, badge, guide | free-agent | S | `brand.mark` |

### Exit criteria
- Name chosen before the first public commit.

---

# Phase 1 — Core (2026-10-26 → 2026-11-22) · `0.1.0`

## Epic: wt-bench service
<!-- wt-roadmap-key: E-bench -->
> **Epic** · **Phase:** Phase 1

### Outcome
A public Go shop service with 12 seeded bugs and 12 controls, each a git tag, runnable with one command.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `bench.service` | Shop service: HTTP API, Postgres, Redis cache-aside, NATS JetStream inventory consumer, Compose file, seed | strong-agent | M | `foundation.layout` |
| `bench.bugs-cache` | Seeded bugs: missing invalidation, wrong-key invalidation, wrong TTL, stale repopulation | free-agent | S | `bench.service` |
| `bench.bugs-event` | Seeded bugs: duplicate consumption, ack before commit | free-agent | S | `bench.service` |
| `bench.controls` | 6 correct controls and 6 permitted-eventual controls | free-agent | S | `bench.service` |
| `bench.runner` | `make bench` runs every tag and writes a results table | free-agent | S | `bench.bugs-cache` |

### Exit criteria
- 24 tags, each starts cleanly in under 60 seconds on a laptop.

## Epic: Core semantics and report
<!-- wt-roadmap-key: E-core -->
> **Epic** · **Phase:** Phase 1

### Outcome
Property lifecycle, outcome semantics, and the `wt.report/v0` schema, independent of any protocol.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `core.config` | `wt.yaml` v0 parser and JSON Schema; `$fresh` values | strong-agent | S | `foundation.layout` |
| `core.outcomes` | `pass`/`fail`/`unknown`/`not_tested` with scope, runs, reproducibility; exit codes | strong-agent | S | `core.config` |
| `core.report-json` | `wt.report/v0` JSON Schema, stable IDs, golden tests | strong-agent | S | `core.outcomes` |
| `core.report-sarif` | SARIF output | free-agent | S | `core.report-json` |
| `core.report-md` | Markdown PR summary | free-agent | XS | `core.report-json` |
| `core.replay` | `wt replay <run-id>` from recorded proxy logs | strong-agent | M | `proxy.resp-core` |

### Exit criteria
- Schema-validated golden reports for every outcome; replay reproduces a recorded fail byte for byte in its event log.

## Epic: Cache pack (RESP proxy)
<!-- wt-roadmap-key: E-cache -->
> **Epic** · **Phase:** Phase 1

### Outcome
`read_after_write` and `bounded_staleness` verified through a RESP proxy with drop, delay, and hold faults.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.resp-core` | RESP2/RESP3 pass-through proxy with ordered event log | strong-agent | M | `foundation.layout` |
| `proxy.resp-faults` | Fault plans: drop, delay, hold-until by command and key glob; per-connection, non-blocking | strong-agent | M | `proxy.resp-core` |
| `verify.compose` | Start Compose env, rewire the app's Redis address through the proxy, health checks, teardown | strong-agent | M | `core.config` |
| `verify.isolation` | Reject targets outside the Compose network as `unknown: non_isolated_target` | strong-agent | S | `verify.compose` |
| `property.read-after-write` | `read_after_write` over HTTP write and read with JSONPath observe | strong-agent | S | `verify.compose` |
| `property.bounded-staleness` | `bounded_staleness` with `within_ms` polling | free-agent | S | `property.read-after-write` |
| `check.mutation-cache` | Default mutation: drop matching `DEL`/`UNLINK`; `check-property` runs clean vs mutated | strong-agent | S | `proxy.resp-faults` |

### Exit criteria
- All four cache bugs except stale repopulation fail; all cache controls pass.

## Epic: Event pack (NATS proxy)
<!-- wt-roadmap-key: E-event -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.nats-core` | NATS protocol pass-through with JetStream awareness and event log | strong-agent | M | `foundation.layout` |
| `proxy.nats-faults` | Redeliver, drop ack, drop publish, delay | strong-agent | M | `proxy.nats-core` |
| `property.idempotent-effect` | `idempotent_effect` with SQL observe and `same_as_single_delivery` across two clean runs | strong-agent | M | `proxy.nats-faults` |
| `property.no-lost-event` | `no_lost_event` after a committed write | free-agent | S | `proxy.nats-faults` |
| `check.mutation-event` | Default mutation: redeliver | free-agent | XS | `property.idempotent-effect` |

### Exit criteria
- Both event bugs fail; event controls pass. G1 evaluated except stale repopulation (moves to Phase 2).

## Epic: Go analyzer and scan
<!-- wt-roadmap-key: E-scan -->
> **Epic** · **Phase:** Phase 1

### Outcome
Zero-config `wt scan --diff` in under two seconds on a 100k-line Go service.

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `scan.state-touch-schema` | `state-touch/v0` JSON Schema (language-neutral) | strong-agent | S | none |
| `analyzer.go-core` | `go/packages` + `go/types` loader with incremental cache | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.go-redis` | Detectors: go-redis, rueidis | free-agent | S | `analyzer.go-core` |
| `analyzer.go-sql` | Detectors: database/sql, pgx, gorm, sqlc, ent writes | free-agent | M | `analyzer.go-core` |
| `analyzer.go-nats` | Detectors: nats.go publish and consume | free-agent | S | `analyzer.go-core` |
| `scan.diff` | Join touches with git diff; `COVERED`/`GAP`/`STALE`; `covers` symbol validation | strong-agent | S | `analyzer.go-core` |
| `scan.perf` | Benchmark on five large Go repos; budget 2s warm | free-agent | S | `scan.diff` |

### Exit criteria
- Zero false `GAP` on `wt-bench` controls; under 2s warm on the benchmark set.

## Epic: Agent surface
<!-- wt-roadmap-key: E-agent -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `agent.init` | `wt init`: writes `wt.yaml` stub, AGENTS.md line (default, shows diff, `--no-agents-md`), Skill, Action | strong-agent | S | `scan.diff` |
| `agent.skill` | `SKILL.md`: when to scan, two property templates, outcome meanings, ask before verify on untrusted repos | strong-agent | S | `core.outcomes` |
| `agent.check-property` | `wt check-property <id>` and the `draft → active` proposal | strong-agent | S | `check.mutation-cache` |
| `agent.action` | GitHub Action: `verify --affected`, PR comment, SARIF upload | free-agent | S | `core.report-md` |
| `agent.mcp` | MCP server: `scan`, `check_property`, `explain` | strong-agent | S | `agent.check-property` |
| `agent.install` | Go install, Homebrew tap, install script, npm and PyPI wrappers | free-agent | S | `foundation.ci` |
| `agent.feedback` | `wt feedback` opens a prefilled issue from a redacted report | free-agent | XS | `core.report-json` |

### Exit criteria
- From clean machine to first `scan` output in under 60 seconds.

## Epic: Evidence wave 1
<!-- wt-roadmap-key: E-evidence1 -->
> **Epic** · **Phase:** Phase 1

### Tasks
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `evidence.abc-harness` | Agent A/B/C harness per `prereg.g2` | strong-agent | M | `prereg.g2` |
| `evidence.abc-run` | Run and publish results, whatever they show | maintainer | S | `evidence.abc-harness` |
| `evidence.scan-50` | `wt scan` over 50 open-source Go services with Redis or NATS | free-agent | S | `scan.perf` |
| `evidence.report-go` | "State of cache invalidation in Go" report | maintainer | S | `evidence.scan-50` |
| `evidence.upstream-5` | Properties for five projects; real bugs go upstream before publication | strong-agent | M | `evidence.scan-50` |
| `statebench.seed` | StateBench v0: wt-bench cases packaged as agent tasks with a held-out split | strong-agent | S | `bench.runner` |
| `launch.demo` | 30-second recording: edit, race found, replay, fix | maintainer | XS | `core.replay` |
| `launch.v0-1` | Release `0.1.0` | maintainer | XS | all Phase 1 epics |

### Exit criteria
- G1 and G2 decided and published.

---

# Phase 2 — Concurrency, PG wire, TypeScript and Python (2026-11-23 → 2026-12-20) · `0.2.0`

## Epic: Concurrency pack
<!-- wt-roadmap-key: E-concurrency -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `concurrency.schedule` | Schedule plans across proxies: ordered holds and releases by signal | strong-agent | M | `proxy.resp-faults` |
| `concurrency.stale-repop` | Stale-repopulation scenario as a built-in schedule for `read_after_write` | strong-agent | M | `concurrency.schedule` |
| `property.concurrent-invariant` | `concurrent_invariant` with SQL predicate | strong-agent | M | `concurrency.schedule` |
| `concurrency.exploration` | Bounded schedule exploration with seed and reproducibility fraction | strong-agent | M | `concurrency.schedule` |

**Exit:** stale-repopulation bug fails deterministically 10/10; G1 complete at 12/12.

## Epic: PG wire proxy, Replica and Transaction packs
<!-- wt-roadmap-key: E-pg -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.pg-core` | Postgres wire protocol pass-through (simple and extended query) with event log | strong-agent | M | `foundation.layout` |
| `proxy.pg-faults` | Delay per connection, cut after statement N, hold commit | strong-agent | M | `proxy.pg-core` |
| `replica.bounded` | Replica pack: `bounded_staleness` on replica connections | free-agent | S | `proxy.pg-faults` |
| `property.atomic` | `atomic_under_interruption` with invariant predicate | strong-agent | M | `proxy.pg-faults` |
| `bench.bugs-pg` | Seeded replica and transaction bugs with controls | free-agent | S | `proxy.pg-faults` |

## Epic: TypeScript and Python analyzers
<!-- wt-roadmap-key: E-lang-ts-py -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.ts-core` | TypeScript analyzer using the TS compiler API, emitting `state-touch/v0` | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.ts-libs` | ioredis, node-redis, Prisma, Drizzle, TypeORM, pg, nats.js, BullMQ | free-agent | M | `analyzer.ts-core` |
| `analyzer.py-core` | Python analyzer with type inference (pyright or similar) | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.py-libs` | redis-py, SQLAlchemy, Django ORM, psycopg, nats-py, Celery | free-agent | M | `analyzer.py-core` |
| `bench.ts-py` | wt-bench ports in TypeScript and Python | free-agent | M | `bench.service` |

## Epic: Evidence wave 2
<!-- wt-roadmap-key: E-evidence2 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `evidence.scan-ts-py` | Scan 50 TS and 50 Python services; reports | free-agent | S | `analyzer.ts-libs` |
| `evidence.pilots` | Recruit five pilot teams | maintainer | S | `launch.v0-1` |
| `evidence.g3` | First accepted upstream fix (G3) | maintainer | S | `evidence.upstream-5` |

## Epic: Pivot (only if G2 fails)
<!-- wt-roadmap-key: E-pivot -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `pivot.lib` | Proxies as a Go library with fault plans | strong-agent | M | `evidence.abc-run` |
| `pivot.testcontainers` | Testcontainers module wrapping the proxies | free-agent | S | `pivot.lib` |

---

# Phase 3 — Projection, Kafka, AMQP, Workflow, MySQL, docs (2026-12-21 → 2027-01-24) · `0.3.0`

## Epic: Projection pack
<!-- wt-roadmap-key: E-projection -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.http-core` | HTTP proxy with fault plans by method and path | strong-agent | S | `foundation.layout` |
| `projection.search` | Elasticsearch, OpenSearch, Meilisearch adapters | free-agent | M | `proxy.http-core` |
| `property.convergence` | `convergence` with source query and projection query | strong-agent | M | `projection.search` |

## Epic: Kafka and AMQP
<!-- wt-roadmap-key: E-brokers -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.kafka-core` | Kafka protocol pass-through (produce, fetch, offset commit) | strong-agent | M | `foundation.layout` |
| `proxy.kafka-faults` | Redeliver by offset reset, drop commit, delay | strong-agent | M | `proxy.kafka-core` |
| `proxy.amqp` | RabbitMQ AMQP 0-9-1 proxy with redeliver and drop ack | strong-agent | M | `foundation.layout` |
| `analyzer.brokers` | Detectors for Kafka and AMQP clients in Go, TS, Python | free-agent | M | `analyzer.go-core` |

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
| `docs.site` | Docs site organized by pain ("test cache invalidation", "test duplicate events") | free-agent | M | `launch.v0-1` |
| `docs.verified` | Docs site passes Seaworthy in CI | free-agent | XS | `docs.site` |
| `docs.recipes` | One recipe per pack per language | free-agent | M | `docs.site` |

---

# Phase 4 — Recovery, multi-service, advanced properties, JVM (2027-01-25 → 2027-02-21) · `0.4.0`

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
| `property.outbox` | Outbox integrity: committed write eventually emits, under crash | strong-agent | M | `recovery.faults` |
| `property.tenant` | Tenant isolation: no key or row visible across tenants | strong-agent | M | `property.read-after-write` |
| `property.migration` | Migration invariant: old and new versions agree on essential state | strong-agent | M | `multi.services` |
| `property.monotonic` | Projection monotonicity: older events never overwrite newer | free-agent | S | `property.convergence` |

## Epic: JVM analyzer
<!-- wt-roadmap-key: E-lang-jvm -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.jvm` | Java and Kotlin analyzer: Spring Data, Jedis, Lettuce, Kafka, JDBC | strong-agent | M | `scan.state-touch-schema` |

## Epic: Distribution wave
<!-- wt-roadmap-key: E-distribution -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `dist.lists` | Submissions: awesome-go, CNCF landscape, MCP registries, Skill directories | maintainer | S | `launch.v0-1` |
| `dist.upstream-docs` | Testing examples contributed to go-redis, nats.go, ioredis docs | free-agent | S | `docs.recipes` |

---

# Phase 5 — Open spec and breadth (2027-02-22 → 2027-03-21) · `0.5.0` + Spec 1.0-rc

## Epic: Open spec and conformance
<!-- wt-roadmap-key: E-spec -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.formats` | Spec 1.0-rc for `state-touch`, `property`, `report`, independent of the wt implementation | maintainer | M | `core.report-json` |
| `spec.conformance` | Conformance suite for analyzers, proxies, and report producers | strong-agent | M | `spec.formats` |
| `spec.invite` | Invite one independent implementer | maintainer | S | `spec.conformance` |

## Epic: Rust, .NET, CI systems, dependency bots
<!-- wt-roadmap-key: E-breadth1 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `analyzer.rust` | Rust analyzer: redis-rs, sqlx, diesel, async-nats, rdkafka | strong-agent | M | `scan.state-touch-schema` |
| `analyzer.dotnet` | .NET analyzer: StackExchange.Redis, EF Core, MassTransit | strong-agent | M | `scan.state-touch-schema` |
| `ci.gitlab` | GitLab CI template | free-agent | S | `agent.action` |
| `ci.precommit` | pre-commit hook (scan only) | free-agent | XS | `scan.diff` |
| `ci.deps` | Verify on Renovate and Dependabot PRs that bump DB, cache, or broker clients | free-agent | S | `agent.action` |

---

# Phase 6 — Stability, governance, launch (2027-03-22 → 2027-04-18) · `1.0.0` + Spec 1.0

## Epic: 1.0
<!-- wt-roadmap-key: E-v1 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `v1.freeze` | Freeze CLI flags, exit codes, and schemas; deprecation policy | maintainer | S | `spec.conformance` |
| `v1.governance` | `GOVERNANCE.md`, `MAINTAINERS.md`, per-ecosystem maintainers | maintainer | S | none |
| `v1.security` | Threat model, sandbox review, `SECURITY.md` | strong-agent | M | none |
| `v1.g4` | G4: three teams with 30+ days in CI, written up with permission | maintainer | S | `evidence.pilots` |
| `v1.launch` | Launch: release, posts, Show HN, demo, StateBench preview | maintainer | S | `v1.freeze` |

---

# Phase 7 — StateBench 1.0 (2027-04-19 → 2027-05-16)

## Epic: StateBench
<!-- wt-roadmap-key: E-statebench -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `statebench.cases` | Hundreds of cases across Go, TS, Python, JVM and all packs | free-agent | M | `statebench.seed` |
| `statebench.heldout` | Private held-out split with rotation policy | maintainer | S | `statebench.cases` |
| `statebench.harness` | Agent-agnostic harness and scoring | strong-agent | M | `statebench.cases` |
| `statebench.leaderboard` | Public leaderboard site | free-agent | M | `statebench.harness` |
| `statebench.outreach` | Invite agent and model builders to report results | maintainer | S | `statebench.leaderboard` |

---

# Phase 8 — Trace-based suggestion (2027-05-17 → 2027-06-13) · `1.1.0`

## Epic: Observed state graph
<!-- wt-roadmap-key: E-trace -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `trace.ingest` | Ingest OpenTelemetry traces and proxy logs into an observed graph (`OBSERVED` edges only) | strong-agent | M | `proxy.resp-core` |
| `trace.suggest` | Deterministic property drafts from observed write-then-read and publish-then-consume pairs | strong-agent | M | `trace.ingest` |
| `trace.affected` | Use the observed graph to select properties for `verify --affected` | strong-agent | S | `trace.ingest` |

---

# Phase 9 — Protocol and language breadth (2027-06-14 → 2027-07-11) · `1.2.0`

## Epic: Breadth 2
<!-- wt-roadmap-key: E-breadth2 -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `proxy.mongo` | MongoDB wire proxy | strong-agent | M | `spec.conformance` |
| `proxy.memcached` | Memcached and Valkey coverage | free-agent | S | `proxy.resp-core` |
| `proxy.cloud` | SQS, SNS, Kinesis, DynamoDB local, S3 via LocalStack | strong-agent | M | `proxy.http-core` |
| `proxy.pulsar` | Pulsar proxy | strong-agent | M | `spec.conformance` |
| `proxy.grpc` | gRPC-aware HTTP/2 faults | strong-agent | M | `proxy.http-core` |
| `analyzer.more` | Ruby, PHP, Elixir analyzers (community-led where possible) | free-agent | M | `spec.conformance` |

---

# Phase 10 — Kubernetes and cross-repository (2027-07-12 → 2027-08-08) · `1.3.0`

## Epic: Kubernetes
<!-- wt-roadmap-key: E-k8s -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `k8s.env` | Verify on kind or k3d with Helm charts | strong-agent | M | `verify.compose` |
| `k8s.sidecar` | Proxies as sidecars with the same isolation rule | strong-agent | M | `k8s.env` |
| `contracts.cross-repo` | Properties shared between repositories as versioned contracts between teams | strong-agent | M | `multi.services` |

---

# Phase 11 — Shadow verify and IDE (2027-08-09 → 2027-09-05) · `1.4.0`

## Epic: Daily use
<!-- wt-roadmap-key: E-daily -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `shadow.staging` | Read-only property checks against staging with recorded traffic; never production | strong-agent | M | `trace.ingest` |
| `ide.vscode` | VS Code extension: state coverage beside code | free-agent | M | `scan.diff` |
| `ide.goland` | GoLand plugin | free-agent | M | `scan.diff` |

---

# Phase 12 — Spec 2 and team edition (2027-09-06 → 2027-10-17) · `2.0.0` + Spec 2.0

## Epic: Standard and sustainability
<!-- wt-roadmap-key: E-standard -->
| Key | Task | Lane | Size | Depends |
|---|---|---|---|---|
| `spec.v2` | Spec 2.0 with outside implementers and governance members | maintainer | M | `spec.invite` |
| `spec.g5` | G5: independent implementation passes conformance | maintainer | S | `spec.v2` |
| `team.evidence` | Optional hosted evidence retention, policy gates, audit reports | strong-agent | M | `v1.freeze` |
| `team.badge` | "state-verified" badge for repositories | free-agent | S | `agent.action` |
| `review.h2` | Twelve-month review: gates, usage, maintenance cost, next year's plan | maintainer | S | all |
