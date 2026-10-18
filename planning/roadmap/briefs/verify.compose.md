## Goal
Run the app under test in its Compose environment with its Redis traffic routed through Oakum's proxy, and tear everything down afterwards.

## Agent brief

**Files** (owned by this task)
- `internal/verify/compose/` (new)

**Steps**
1. Use the `docker compose` CLI (not the Docker SDK) with a unique project name per run.
2. Start a RESP proxy in the Oakum process, listening on an address reachable from containers (the Compose network gateway or `host-gateway`); pass it to the app as `REDIS_ADDR` through a generated override file; the proxy's upstream is the `redis` service.
3. Wait for health checks with a timeout; on failure return `outcome.Unknown` with `ReasonAppDidNotStart` and the last 50 log lines.
4. Run the `env.seed` command after start; expose `Env` for properties: `AppURL`, an HTTP client, an SQL function against the `postgres` service, `Signals`, `Fresh`, `Seed`.
5. Always tear down (`down -v`) even on panic or timeout.
6. Integration test against `bench/shop` once it exists; until then a minimal Compose fixture in `testdata/compose/`.

**Do not**
- Do not lint the Compose file here (`verify.lint`) or check isolation (`verify.isolation`).
- Do not mount anything from the host into containers.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] The bench service starts, is seeded, and tears down cleanly.
- [ ] Redis commands from the app appear in the proxy event log.
