## Goal
`oakum check-property <id>` answers: can this property catch the code defect it is meant to catch?

## Agent brief

**Files** (owned by this task)
- `internal/check/` (new)
- `cmd/oakum/check_property.go` (new)

**Steps**
1. Load the config, find the property, run it clean (no faults) 3 times: must pass; else report `unknown` with why (the property is not usable on this code).
2. Run it under each `DefectFaults` plan 3 times: `sensitive` if it fails under at least one plan in every run; `insensitive` if it never fails; otherwise `unknown` with the counts.
3. Print a short human summary and write the JSON report; for `sensitive`, print the line a person adds to promote it to `status: active`.
4. Never change `oakum.yaml` yourself.

**Do not**
- Do not run environment (resilience) faults here; only defect faults.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] On the bench, the shipped `read_after_write` property is `sensitive`; a property that observes an unrelated field is `insensitive`.
