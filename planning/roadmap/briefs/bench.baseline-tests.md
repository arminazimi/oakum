## Goal
Hand-written Go integration tests that catch the three bugs without Oakum, to measure what arm A costs and to check the variants are real.

## Agent brief

**Files** (owned by this task)
- `bench/baseline/` (new)

**Steps**
1. Use only `testing`, Testcontainers Go, and go-redis/pgx.
2. One test per bug; the stale-repopulation test may use Toxiproxy (as arm B would) and must report how often it reproduces in 10 runs.
3. Record in `bench/baseline/COST.md`: lines of test code, time to write, and reproduction rate per bug.

**Do not**
- Do not import Oakum.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] Each test fails on its bug variant and passes on all controls.
- [ ] `COST.md` exists with the numbers.
