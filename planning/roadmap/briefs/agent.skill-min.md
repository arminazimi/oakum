## Goal
The minimal Agent Skill arm C gets in the experiment: when to run Oakum, how to write a property, and what results mean.

## Agent brief

**Files** (owned by this task)
- `skills/oakum/SKILL.md` (new)
- `skills/oakum/templates/read_after_write.yaml` (new)

**Steps**
1. Front matter: name `oakum`, a description that says when to use it (changes to code that writes a database and a cache).
2. Body: run `oakum check-property` on a new property and `oakum verify` after a change; outcome meanings (`unknown` is never a pass); ask the user before running on a repository they did not write.
3. One template for `read_after_write` with comments explaining each field.
4. Keep it under 150 lines; agents read it whole.

**Do not**
- Do not mention the bench variants or their bugs.
- Do not describe features that do not exist yet (scan, MCP).

**Run**
```bash
make check
```

## Done when
- [ ] An agent given only the Skill and the shop repo can write a valid property (check with `oakum validate`).
