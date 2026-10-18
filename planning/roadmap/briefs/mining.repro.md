## Goal
Turn candidates into reproductions: a pinned buggy commit, a fixed commit, and a scenario that fails on one and passes on the other.

## Agent brief

**Files** (owned by this task)
- `research/repro/<candidate-id>/` (new per candidate): `compose.yaml`, scenario script, `README.md`

**Steps**
1. Pick candidates in order of confidence. For each: pin the parent (buggy) and fix commits; build a Compose environment; write a scenario (HTTP or broker steps) that shows the bug.
2. Record: reproduces on buggy (k/10), passes on fixed (k/10), time spent, and blockers.
3. Give up after 2 hours on one candidate and record why.
4. Mark candidates that reproduce as `repro: yes` in their YAML.

**Do not**
- Do not modify upstream code beyond what the build needs; record any change.
- Do not decide the final label.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] At least 40 candidates attempted, with results recorded for each.
