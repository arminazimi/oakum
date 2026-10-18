## Goal
CI runs `make check` and the Docker integration tests on every push and pull request.

## Agent brief

**Files** (owned by this task)
- `.github/workflows/ci.yml` (new)
- `.golangci.yml` (new)

**Steps**
1. Job `check`: set up Go from `go.mod` and Node 22, then `npm ci --ignore-scripts` (no lockfile yet: use `npm install`) and `make check`.
2. Job `integration`: on `ubuntu-latest` (Docker available), run `go test -tags integration ./...` with a 15-minute timeout.
3. Add `golangci-lint` with a small config: `govet`, `staticcheck`, `errcheck`, `ineffassign`, `gofmt`. Run it in the `check` job.
4. Cache Go modules and the build cache.

**Do not**
- Do not add secrets or deploy steps.
- Do not change `Makefile` targets other than adding `lint` if needed; coordinate in the issue.

**Run**
```bash
make check
```

## Done when
- [ ] CI is green on `main` and on a test pull request.
- [ ] A deliberately unformatted file fails the `check` job.
