## Goal
A conformance suite that proves real Redis clients behave identically with and without the proxy.

## Agent brief

**Files** (owned by this task)
- `proxy/resp/conformance/` (new)

**Steps**
1. Table of scenarios run twice, direct to Redis and through the proxy, comparing replies: strings, hashes, lists, sets, sorted sets, expiry, pipelines of 1–500 commands, MULTI/EXEC, WATCH, pub/sub, Lua `EVAL`, `HELLO 3`.
2. Run with go-redis v9 and rueidis.
3. Report a diff per scenario on mismatch.
4. Document unsupported features (TLS, cluster, sentinel) in `proxy/resp/conformance/README.md`.

**Do not**
- Do not fix proxy bugs here; open issues on `proxy.resp-core` with the failing scenario.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] Every scenario passes with both clients, or has an open issue linked in the README.
