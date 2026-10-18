## Goal
A small, realistic Go shop service that the experiment, the bench, and the baseline tests all use. It must be easy to break in three specific ways later.

## Agent brief

**Files** (owned by this task)
- `bench/shop/` (new Go module `github.com/arminazimi/oakum/bench/shop`, its own `go.mod`)
- `bench/shop/compose.yaml`, `bench/shop/seed.sql`, `bench/shop/Makefile`
- `bench/shop/materialize.sh`, `bench/shop/variants/README.md`

**Steps**
1. HTTP API with `net/http`: `GET /products/{id}`, `PATCH /products/{id}` (name, price), `POST /orders` (decrements stock). Postgres via `pgx`, Redis via `go-redis/v9`.
2. Cache-aside on `GET /products/{id}`: read Redis key `product:{id}`; on miss read Postgres, then `SET` with a 60 s TTL. `PATCH` updates Postgres then `DEL product:{id}`.
3. Put the read-miss-then-SET and the update-then-DEL code in one small file each (`cache_read.go`, `cache_write.go`) so variants are short patches.
4. Read Redis and Postgres addresses only from `REDIS_ADDR` and `DATABASE_URL`, so Oakum can route Redis through its proxy.
5. `compose.yaml`: `app`, `postgres`, `redis`, health checks, no host mounts, no privileged settings. `seed.sql` creates 100 deterministic products.
6. Variant mechanism: `variants/<id>.patch` applied by `materialize.sh <id> <outdir>`, which copies `bench/shop` to a standalone directory, applies the patch, runs `git init`, and commits, leaving no trace of the variant name. `variants/README.md` lists the variant ids and owners (`bug-*`: bench.bugs, `ok-*` and `eventual-*`: bench.controls).
7. Unit tests for handlers with an in-memory fake; one `integration`-tagged test that starts Compose and does PATCH then GET.

**Do not**
- Do not add a variant patch; those are separate tasks.
- Do not import anything from the main `oakum` module; the service must stand alone.
- Do not write comments that hint at bugs or variants.

**Run**
```bash
make check
go test -tags integration ./...   # needs Docker
```

## Done when
- [ ] `make -C bench/shop up` starts the stack in under 60 s on a laptop.
- [ ] `materialize.sh` produces a repository whose git history and files do not mention the variant.
- [ ] The integration test passes.
