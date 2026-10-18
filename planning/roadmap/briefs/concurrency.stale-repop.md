## Goal
A built-in schedule that reproduces cache stale repopulation deterministically, by holding the reader's `SET` until the writer's `DEL` has passed.

## Agent brief

**Files** (owned by this task)
- `internal/schedule/stalerepop/` (new)

**Steps**
1. Plan: rule A holds the first `SET` on the cache key until signal `writer-deleted`; rule B on `DEL` of the same key emits `writer-deleted`.
2. Driver: request 1 = read (cache miss, will SET old value, held); wait until the proxy logs the held SET; request 2 = write (DB update, DEL passes, fires signal); held SET is released with the old value; request 3 = read and compare with the written value.
3. Expose as a scenario of `read_after_write` (`scenario: stale_repopulation`) and as a defect fault for `check-property`.
4. Repeat N times; report `reproducible: k/n`.
5. Integration test on the bench: the stale-repopulation variant fails ≥ 9/10; the correct control passes 10/10.

**Do not**
- Do not instrument the app or add sleeps to it.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] G1's stale-repopulation criterion holds on the bench.
- [ ] The event log shows SET held, DEL, release, in that order.
