# Shared contracts and file ownership

Oakum is built by several agents at once. Two rules keep them from colliding:

1. **Shared contracts are fixed in the packages below.** Build against them. Change one only through its own issue, never as a side effect.
2. **Every task owns its files.** The brief lists them. Do not edit a file another open task owns; if you need a change there, comment on
   that issue or open a follow-up.

## Shared contracts (initial commit)

| Package | What it fixes | Changed only by |
|---|---|---|
| `internal/outcome` | `Status`, `Kind`, reason codes, `Result`, `Scope` | `core.outcomes` may add methods and tests; fields need an ADR |
| `proxy/faultplan` | `Action`, `Match`, `Rule`, `Plan`, `Signals` | an ADR in `docs/decisions/` |
| `proxy/eventlog` | `Event`, `Direction`, `Sink` | an ADR in `docs/decisions/` |
| `internal/property` | `Env`, `Type`, `Register`, `Lookup` | an ADR in `docs/decisions/` |
| `cmd/oakum/main.go` | the command registry: each command registers itself from its own file | nobody adds commands here |

## Package ownership (Phases 0–1)

| Path | Owner task |
|---|---|
| `.github/workflows/`, `.golangci.yml` | `foundation.ci` |
| `internal/config/`, `schema/oakum.yaml.v0.json`, `cmd/oakum/validate.go` | `core.config` |
| `internal/outcome/*` except `outcome.go` | `core.outcomes` |
| `internal/report/`, `schema/oakum.report.v0.json`, `testdata/reports/` | `core.report-json` |
| `internal/replay/`, `cmd/oakum/replay.go` | `core.replay` |
| `proxy/resp/` (except `faults.go`, `faults_test.go`, `conformance/`) | `proxy.resp-core` |
| `proxy/resp/faults.go`, `proxy/resp/faults_test.go`, `proxy/signals/` | `proxy.resp-faults` |
| `proxy/resp/conformance/` | `proxy.resp-conformance` |
| `internal/verify/compose/` | `verify.compose` |
| `internal/verify/lint/` | `verify.lint` |
| `internal/verify/isolation/` | `verify.isolation` |
| `internal/property/raw/` | `property.read-after-write` |
| `internal/schedule/stalerepop/` | `concurrency.stale-repop` |
| `internal/check/`, `cmd/oakum/check_property.go` | `check.sensitivity` |
| `bench/shop/` (service, Compose, seed, `materialize`) | `bench.service` |
| `bench/shop/variants/bug-*` | `bench.bugs` |
| `bench/shop/variants/ok-*`, `bench/shop/variants/eventual-*` | `bench.controls` |
| `bench/baseline/` | `bench.baseline-tests` |
| `bench/run/`, `bench/results/` | `bench.runner` |
| `skills/oakum/` | `agent.skill-min` |
| `experiment/` | `experiment.harness` |
| `research/mining/`, `research/candidates/` | `mining.search` |
| `research/repro/` | `mining.repro` |
| `docs/research/competitors.md` | `prereg.competitors` |
| `docs/research/venues.md` | `research.venues` |

## Conventions

- Go 1.24, standard library first. New dependencies need a line in the PR description saying why.
- `make check` must pass. It runs `go vet`, `go test -race ./...`, and the roadmap check.
- Integration tests that need Docker use the build tag `integration` and run in CI with `go test -tags integration ./...`.
- Errors that reach the user say what to do next.
