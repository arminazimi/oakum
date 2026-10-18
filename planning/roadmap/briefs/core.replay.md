## Goal
`oakum replay <run-id>` re-runs a failed run with the same seed, fixtures, HTTP sequence, and fault plan, including the order in which held commands were released. This is fault-plan replay, not deterministic execution replay.

## Agent brief

**Files** (owned by this task)
- `internal/replay/` (new)
- `cmd/oakum/replay.go` (new)

**Steps**
1. Define the run record saved for every fail under `.oakum/runs/<run-id>/`: config snapshot, seed, fault plan, ordered HTTP steps, proxy event log (`eventlog.Event` JSON lines), signal fire order.
2. Replay reconstructs the plan and drives the same HTTP steps; signals fire in the recorded order.
3. Compare the replayed event log with the recorded one on (Command, Target, Rule, Action, Signal) order, ignoring timestamps and connection ids; report `match` or the first divergence.
4. Run N times with `--runs N` and report `reproducible: k/n`.

**Do not**
- Do not claim deterministic scheduling in output or docs.
- Do not edit proxy code; use its public API and the event log.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] Replaying a recorded stale-repopulation fail matches 10/10 on the bench.
- [ ] A divergence prints the first differing event.
