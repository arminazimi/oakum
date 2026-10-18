## Goal
The `oakum.report/v0` JSON report: a stable format agents and CI can rely on.

## Agent brief

**Files** (owned by this task)
- `internal/report/` (new)
- `schema/oakum.report.v0.json` (new)
- `testdata/reports/` (new golden files)

**Steps**
1. Report shape: `{schema: "oakum.report/v0", tool: {name, version}, run: {id, started, finished, commit}, results: [outcome.Result], summary: {pass, fail, unknown, not_tested}}`.
2. `Write(w, Report)` with deterministic key order and stable sorting of results by property id.
3. JSON Schema where `status: pass` requires `runs >= 1` (use `if/then`).
4. Golden tests: one report per status and one mixed; the schema validates all of them; a hand-edited pass with `runs: 0` fails the schema.
5. Validate every report through `outcome.Result.Validate` before writing; refuse to write an invalid one.

**Do not**
- Do not add SARIF or Markdown output; those are Phase 2.

**Run**
```bash
make check
```

## Done when
- [ ] Golden files are byte-for-byte stable across runs.
- [ ] The schema rejects a zero-run pass.
