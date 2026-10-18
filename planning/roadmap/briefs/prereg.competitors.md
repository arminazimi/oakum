## Goal
A written, sourced comparison of Oakum with the closest tools, so the pre-registration and README claim nothing that already exists.

## Agent brief

**Files** (owned by this task)
- `docs/research/competitors.md` (new)

**Steps**
1. For each tool, read primary sources (docs, repo, papers): Antithesis and `antithesishq/antithesis-skills` (incl. the 2026-09-25 mutation-testing post), RedFI, Toxiproxy (and its Testcontainers Go module), Envoy's Redis proxy fault filter, Shuttle and Loom, Schemathesis stateful testing, Meta Polaris, Jepsen/Elle, PBT-Bench.
2. For each: what it does, license, maintenance (last release or push), and a yes/no/partial for: command-level faults, drop of a single command, non-blocking hold-until, broker redelivery, agent-written properties, mutation validation, local/CI use without a platform.
3. Search for anything newer (2025–2026) that reproduces cache stale repopulation or checks application-level state for agents. Record the queries you ran.
4. End with: which Oakum claims survive, which must be dropped.

**Do not**
- Do not edit the README or spec; list required changes in the PR description instead.
- Do not quote more than one short sentence per source.

**Run**
```bash
make check
```

## Done when
- [ ] Every row cites a URL and a date checked.
- [ ] The 'claims that survive' section exists and is specific.
