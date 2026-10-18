## Goal
A Redis protocol proxy that passes traffic through unchanged and records every command in order. Faults come in the next task.

## Agent brief

**Files** (owned by this task)
- `proxy/resp/` (new): `server.go`, `conn.go`, `parse.go`, `log.go` and tests. Not `faults.go`.

**Steps**
1. Accept client connections with `github.com/tidwall/redcon` (or a minimal RESP reader if redcon cannot pass RESP3 `HELLO`; record the choice in the PR).
2. For each client connection open one upstream connection to the real Redis and forward commands and replies in order. Support pipelining: many commands before replies.
3. Support RESP2 and RESP3 (`HELLO 3`), `AUTH`, `SELECT`, `MULTI/EXEC`, and pub/sub pass-through. No TLS, no cluster: refuse `CLUSTER` redirects with a clear error.
4. Record an `eventlog.Event` per command and reply: strictly increasing `Seq` across all connections (single atomic counter), `Command` upper-case, `Target` = first key when the command has one.
5. Expose `New(listen, upstream string, sink eventlog.Sink) *Proxy`, `Start()`, `Close()`, and a hook point `type Hook func(conn uint64, cmd [][]byte) Decision` that the faults task will implement (default: forward).
6. Integration tests (tag `integration`) with real Redis in Docker and go-redis: GET/SET/DEL, pipeline of 100, MULTI/EXEC, RESP3.

**Do not**
- Do not implement faults.
- Do not buffer whole connections; stream.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] go-redis works through the proxy for all the commands above.
- [ ] The event log order matches what Redis executed.
