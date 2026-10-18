## Goal
Five control variants that a correct checker must never flag.

## Agent brief

**Files** (owned by this task)
- `bench/shop/variants/ok-*.patch`, `bench/shop/variants/eventual-*.patch` (new)
- `bench/shop/variants/controls.md` (new)

**Steps**
1. Three correct variants: delete-after-write, write-through, and versioned keys.
2. Two permitted-eventual variants: invalidation via a short TTL (documented bound, e.g. 300 ms) and async invalidation through a goroutine with a bounded delay. Document the bound each one promises.
3. `controls.md`: what each guarantees and the `within_ms` a correct property should use.

**Do not**
- Do not change the base service.

**Run**
```bash
make check
```

## Done when
- [ ] Each control materializes and starts.
- [ ] Each documented bound is stated in milliseconds.
