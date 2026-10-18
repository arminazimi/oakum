## Goal
The `read_after_write` property type: after a write through the app, the mapped read returns the written value within `within_ms`.

## Agent brief

**Files** (owned by this task)
- `internal/property/raw/` (new): implements `property.Type` and registers itself

**Steps**
1. Spec fields: `write` (`http` method and path, `body` with `$fresh`), `read` (`http`, `observe` JSONPath), `expect: equals_written`, `within_ms` (default 0 = immediate).
2. Run: do the write, then poll the read every 10 ms until it matches or `within_ms` passes; return pass with `Runs: 1` or fail `Kind: regression` with observed and expected values.
3. `DefectFaults`: one plan that drops `DEL`/`UNLINK` on the key pattern derived from the read path (configurable `cache_key` in spec), and one that rewrites the key.
4. Unit tests with an `httptest` server that simulates correct, stale, and eventually-correct behaviour.

**Do not**
- Do not start containers; use `Env`.
- Do not implement stale repopulation; that is `concurrency.stale-repop`.

**Run**
```bash
make check
```

## Done when
- [ ] Correct, stale, and eventual cases give pass, fail, and pass (within bound) respectively.
