## Goal
`make bench` runs Oakum against every variant and writes the G1 table.

## Agent brief

**Files** (owned by this task)
- `bench/run/` (new)
- `bench/results/` (generated, gitignored except `README.md`)
- `bench/Makefile` (new)

**Steps**
1. For each variant: materialize, write the bench `oakum.yaml`, run `oakum check-property` and `oakum verify` (10 runs for stale repopulation), collect reports.
2. Write `bench/results/g1.md`: variant, expected, observed, reproducible k/n, pass/fail of the G1 rule.
3. Exit non-zero if G1 does not hold.

**Do not**
- Do not tune properties per variant; one config for all.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] `make bench` prints the G1 table and its verdict.
