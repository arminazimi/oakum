## Goal
Three seeded bug variants of the shop service for G1 and the experiment.

## Agent brief

**Files** (owned by this task)
- `bench/shop/variants/bug-missing-invalidation.patch`, `bug-wrong-key.patch`, `bug-stale-repop.patch` (new)
- `bench/shop/variants/bugs.md` (new: ground truth, never given to experiment agents)

**Steps**
1. `bug-missing-invalidation`: `PATCH` updates Postgres but no longer deletes the cache key.
2. `bug-wrong-key`: deletes `products:{id}` instead of `product:{id}`.
3. `bug-stale-repop`: the cache-aside read path is correct for single requests but writes the cache after a slow DB read with no version or delete-after-write protection (the classic race).
4. Patches must look like plausible code, not like planted bugs: no comments, no odd names.
5. `bugs.md`: per variant, the defect, the failing scenario, and the minimal correct fix.

**Do not**
- Do not change the base service.
- Do not add variants for controls.

**Run**
```bash
make check
```

## Done when
- [ ] Each variant materializes and starts.
- [ ] The hand-written baseline test for each bug (if `bench.baseline-tests` is done) fails on it.
