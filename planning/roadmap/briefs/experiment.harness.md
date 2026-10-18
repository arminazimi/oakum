## Goal
The harness that runs the pre-registered A/B/C experiment exactly as registered and logs everything the analysis needs.

## Agent brief

**Files** (owned by this task)
- `experiment/` (new): runner, arm definitions, logging, analysis script

**Steps**
1. Read the registration in `docs/prereg/g2.md` (from `prereg.g2`); encode model, prompt, time limit, token budget, attempts, and guidance as data in `experiment/arms.yaml`.
2. For each case and arm: materialize the variant into a fresh directory, give the agent the task prompt and only that arm's tools (A: tests; B: tests + Testcontainers + Toxiproxy; C: tests + Oakum + Skill), run it in a container with no network except model API and package mirrors.
3. Log tokens, wall time, tool calls, final diff, and whether the hidden ground-truth test passes and no control regression appears.
4. Analysis script implements the registered statistical test and writes `experiment/results/`.
5. Dry-run mode with a fake agent for tests.

**Do not**
- Do not look at or include `bench/heldout/`; the maintainer mounts it at run time.
- Do not change the registered metrics; deviations go in the report as deviations.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] A dry run over all bench variants and three arms completes and produces the analysis output.
