## Goal
Parse and validate `oakum.yaml` v0, the file that declares the environment and properties.

## Agent brief

**Files** (owned by this task)
- `internal/config/` (new)
- `schema/oakum.yaml.v0.json` (new)
- `cmd/oakum/validate.go` (new: `oakum validate [file]`)
- `testdata/config/` (new)

**Steps**
1. Types for the format in the spec section 7: `version`, `env` (`compose`, `app`, `seed`, optional `allow_secrets`), `properties[]` (`id`, `type`, `covers`, type-specific fields kept as `map[string]any`, `tolerates`, `status` = draft|active|deprecated).
2. `Load(path) (*Config, error)` with errors that name the field and line (use `gopkg.in/yaml.v3` nodes for line numbers).
3. Validation: unique ids, known status values, `version: 0`, compose file exists relative to the config file. Unknown property `type` is an error only when `property.Lookup` is populated; for now warn.
4. `$fresh` expansion helper: `ExpandFresh(v any, fresh func() string) any` replacing the exact string `$fresh` anywhere in a value tree.
5. JSON Schema mirroring the types; a test checks every file in `testdata/config/valid` passes both the Go loader and the schema, and every file in `invalid` fails both.
6. `oakum validate`: exit 0 and print `ok` on success; exit 2 with the errors otherwise.

**Do not**
- Do not run anything or touch Docker.
- Do not edit `internal/outcome` or `internal/property`.

**Run**
```bash
make check
```

## Done when
- [ ] Valid and invalid fixtures cover every rule above.
- [ ] `oakum validate testdata/config/valid/minimal.yaml` prints `ok`.
