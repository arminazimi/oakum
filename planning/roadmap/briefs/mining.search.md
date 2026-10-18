## Goal
Find candidate real state bugs in open-source history, following `research/protocol.md`.

## Agent brief

**Files** (owned by this task)
- `research/mining/` (new: search scripts)
- `research/candidates/*.yaml` (new: one file per candidate)

**Steps**
1. Search GitHub commits, PRs, and issues of open-source Go, TypeScript, and Python services for fixes of: stale cache, missing or wrong invalidation, cache repopulation race, duplicate event processing, ack before commit, lost event, read-your-writes on a replica, non-converging projection.
2. Use the inclusion rules in the protocol (service code, not libraries; fix commit identifiable; reproducible in principle).
3. For each candidate write `research/candidates/<repo>-<sha>.yaml`: repo, fix commit, parent commit, links, category guess, why it qualifies, and confidence.
4. Record every query you ran in `research/mining/queries.md`, including ones with no results.
5. Target: at least 80 candidates, so that 30 survive reproduction and labelling.

**Do not**
- Do not label candidates as confirmed; only people label.
- Do not open issues or comment on upstream projects.

**Run**
```bash
make check
```

## Done when
- [ ] ≥ 80 candidate files that follow the protocol schema.
- [ ] Queries are logged.
