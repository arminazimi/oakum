## Goal
Refuse to run Compose files that could reach outside their sandbox.

## Agent brief

**Files** (owned by this task)
- `internal/verify/lint/` (new)
- `testdata/compose-lint/` (new)

**Steps**
1. Parse the Compose file and any override files (YAML, no Docker needed).
2. Reject with `outcome.ReasonUnsafeCompose` and the service and key: `privileged: true`, bind mounts whose source is outside the repository root, any mount of `/var/run/docker.sock`, `network_mode: host`, `pid: host`, `ipc: host`, `cap_add`, `devices`, `security_opt` that disables confinement, `userns_mode: host`.
3. Return all problems at once, sorted.
4. Fixtures: one safe file, one per rule.

**Do not**
- Do not start containers.

**Run**
```bash
make check
```

## Done when
- [ ] Each rule has a failing fixture, and the safe fixture passes.
