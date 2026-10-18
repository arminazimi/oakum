## Goal
Make sure a run can only reach services inside its own Compose network and carries no real credentials.

## Agent brief

**Files** (owned by this task)
- `internal/verify/isolation/` (new)

**Steps**
1. Before start: resolve every address the proxies and properties will use; any address outside the Compose project network → `unknown: non_isolated_target`.
2. Scan the environment passed to Compose for secret patterns (AWS keys, `*_TOKEN`, `*_SECRET`, `*PASSWORD*` with non-test values, private keys); unless listed in `env.allow_secrets` → `unknown: secret_in_env`.
3. During the run: the proxy upstream must be a Compose service name; assert it.
4. Tests with fake environments and addresses.

**Do not**
- Do not add any flag that disables these checks.

**Run**
```bash
make check
```

## Done when
- [ ] Pointing a proxy upstream at an external host is refused.
- [ ] A real-looking AWS key in the env is refused.
