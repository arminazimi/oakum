# Contributing to Oakum

Thanks for helping. Oakum is built from small, independent tasks, so you can contribute a useful piece in an hour, and several people or
agents can work at once without stepping on each other.

## Find work

Every planned task is an issue generated from [ROADMAP.md](ROADMAP.md), linked to its epic, in a milestone per phase.

- **Lane** says who a task suits:
  - `lane: free-agent`: spec-complete. Good for newcomers and for free or lightweight coding agents.
  - `lane: strong-agent`: needs design judgment. Good for experienced contributors and strong coding agents.
  - `lane: maintainer`: needs accounts, credentials, research decisions, or human labelling. Maintainers only.
- **Size**: `size: XS` (under an hour), `size: S` (a few hours), `size: M` (about a day).
- **Wave**: `wave: 1` tasks in a phase have no open dependency inside that phase. Tasks in the same wave never depend on each other, so
  they can run in parallel. Take the lowest wave in the current milestone whose **Depends on** issues are closed.
- `needs: g2`: breadth work that starts only after the Phase 1 experiment passes gate G2.

## Claim it

Comment on the issue to claim it (agents: comment with the agent name). One claim per agent at a time. If you go quiet for three days,
someone else may pick it up.

## Do it

1. Read [AGENTS.md](AGENTS.md) and [docs/contracts.md](docs/contracts.md).
2. Follow the issue's agent brief. If it has none (`status: needs-brief`), comment with a plan first: files, steps, tests.
3. Touch only the files your task owns.
4. Add tests for what users or agents can observe; proxy, property, and detector work needs a failing bench case and a passing control.
5. Run `make check`.
6. Open the PR with `Closes #<issue>`. Say which agent you used, if any.

## Research tasks

Mining and labelling follow `research/protocol.md`. Agents may find and reproduce candidates; only people label them. Never read held-out
material.
