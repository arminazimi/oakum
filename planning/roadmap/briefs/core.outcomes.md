## Goal
Give the shared outcome types their rules: validation, aggregation over runs, and exit codes, so no code path can report a pass that did not happen.

## Agent brief

**Files** (owned by this task)
- `internal/outcome/validate.go`, `internal/outcome/aggregate.go`, `internal/outcome/exit.go` and their tests (new). Do not change field names in `outcome.go`.

**Steps**
1. `(Result) Validate() error`: `pass` needs `Runs >= 1`, `Failed == 0`, non-empty `Scope.Scenario`; `fail` needs `Kind`, `Failed >= 1`, `ReplayID`; `unknown` needs a known `Reason`; `not_tested` needs `Runs == 0`.
2. `Aggregate(runs []Result) Result` for repeated runs of one property: any fail → fail with `Failed` counted; any unknown and no fail → unknown; all pass → pass with `Runs = len`.
3. `(Result) Reproducible() string` → `"k/n"`.
4. `ExitCode(results []Result, affected bool) int`: 1 if any fail; else 2 if any unknown, or any not_tested when `affected`; else 0.
5. Table-driven tests for every branch, including an attempt to build a pass with zero runs.

**Do not**
- Do not add fields to `Result` or `Scope`; open an ADR issue if one is needed.

**Run**
```bash
make check
```

## Done when
- [ ] Validation rejects every inconsistent combination in the tests.
- [ ] Exit codes match the spec table in section 8.
