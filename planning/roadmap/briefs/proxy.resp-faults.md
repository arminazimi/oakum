## Goal
Apply `faultplan.Plan` rules inside the RESP proxy: drop one command, delay, rewrite the key, and hold a command until a signal fires, without blocking other connections.

## Agent brief

**Files** (owned by this task)
- `proxy/resp/faults.go`, `proxy/resp/faults_test.go` (new)
- `proxy/signals/` (new: in-memory `faultplan.Signals`)

**Steps**
1. Implement the proxy's `Hook` from a `faultplan.Plan`: first matching rule wins; `Match.Command` case-insensitive, `Match.Target` glob on the first key, `Nth` counts matches per rule.
2. `drop`: do not forward; synthesize the reply Redis would give for success (DEL/UNLINK → integer 1, SET → OK, EXPIRE → 1); log the action.
3. `delay`: forward after `Delay` on that connection only.
4. `rewrite`: replace the first key with `RewriteTarget`.
5. `hold`: park the command (and later commands on that same connection, to keep its order) until `Until` fires; other connections continue. Release on signal; on timeout, release and log `hold_timeout`.
6. `emit`: fire the rule's signal after the command's reply has been returned to the client.
7. Tests: two connections, hold a SET on one, DEL on the other proceeds, release, check final order in the event log; drop DEL leaves the key; rewrite hits the other key.

**Do not**
- Do not change `faultplan` types; propose changes in a decision issue.
- Do not edit `server.go`/`conn.go` beyond what the hook needs; coordinate with `proxy.resp-core` if it is still open.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] The two-connection hold test passes 100/100 under `-race`.
- [ ] Every fault action appears in the event log.
