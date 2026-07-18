# SQLite data source — integration notes

A local-SQLite backend that mirrors the InterMine data source's method surface, so
resolvers can serve (ported) queries from a SQLite mirror instead of InterMine XML.

## What was added (new, under `src/data-sources/sqlite/`)

- `model.ts` — loads/indexes the InterMine model (`service/model?format=json`).
- `physical-names.ts` — verified PG naming: table/attr/ref conventions, the
  reserved-word rename rule (`value`→`intermine_value`, `start`→`intermine_start`,
  …), the derived `INDIRECTION` map (49 m2m tables), `ABSENT_COLLECTIONS`, and
  synonym-table constants. NOTE: `INDIRECTION` was derived from a *glycinemine*
  pg_dump. That mine's model is structurally identical to minimine-genefunction's,
  so the m2m table names should carry over, but this is unverified against a real
  minimine dump — confirm when the mirror lands (unknown paths warn under
  `DEBUG_SQL=1`, they don't fail).
- `class-keys.ts` — parses `service/classkeys` into per-class attribute keys (LOOKUP).
- `path-resolver.ts` — path→SQL translator: ref/o2m/m2m joins with prefix dedup,
  the `X.ref.id`→FK-column optimization, LOOKUP (class keys + synonym), InterMine
  `constraintLogic` (codes + AND/OR/parens), and multi-path sort.
- `sqlite.server.ts` — `SqliteServer`: `pathQuery`/`pathQueryCount` over `bun:sqlite`,
  returning positional rows so the existing `response2*` transformers are reused.
- `api/search-genes.ts`, `api/search-gene-functions.ts` — ported functions (the
  latter exercises LOOKUP + constraint logic). Reuse the InterMine models verbatim.
- `api/index.ts` (`ApiMixin`) and `index.ts` (`SqliteAPI`) — mirror the InterMine mixin.
- `data/model.json`, `data/classkeys.json` — the mine's model + class keys (swap per
  mine). Currently **minimine-genefunction** (`service/model?format=json` and
  `service/classkeys` from that mine), matching the compat suite — see
  `test/compat/TESTING.md`.
- `schema/subset.schema.sql` — 77-table subset DDL (47 class + 30 indirection),
  excluding the ~300M-row bulk/superclass tables.

## What changed (existing files)

- `data-sources/index.ts` — adds optional `lisSqliteAPI` to `DataSources`, built
  only when `SQLITE_DB_PATH` is set. `SqliteAPI` is exported as a **type only**: a
  value import/re-export would load `bun:sqlite` at module load and defeat the
  dynamic import, breaking Node-only tooling (see "Shared instance" below).
- `tsconfig.json` — `types: ["node", "bun"]` (for `bun:sqlite`).
- `package.json` / `bun.lock` — adds `@types/bun` (devDependency).

## Using it

1. Build the SQLite mirror from a Postgres dump. Two converters have been used:
   [`pg2sqlite`](https://github.com/caiiiycuk/postgresql-to-sqlite) (from a `pg_dump`)
   and [`db-to-sqlite`](https://github.com/simonw/db-to-sqlite) (direct). Either
   copies the schema and rows.
   ```bash
   db-to-sqlite "postgresql://user@host/minimine" minimine.db --all
   ```
   `schema/subset.schema.sql` remains as the hand-rolled alternative: a 77-table
   subset for when a full dump is too large to be practical.
2. **Index the `synonym` table.** InterMine's Postgres indexes it but `pg2sqlite`
   did not carry those over, and every LOOKUP does a correlated lookup into
   `synonym` (millions of rows) — without an index those queries do a full scan
   per row and effectively hang. Build a composite on `(subjectid, intermine_value)`
   (~0.4s): `subjectid` is the leftmost column so it still serves plain
   subject joins, and because both columns the `EXISTS` subquery reads are in the
   index, SQLite answers it from a **covering index** without touching the table:
   ```bash
   sqlite3 minimine.db \
     "CREATE INDEX IF NOT EXISTS synonym__subjectid_value ON synonym(subjectid, intermine_value)"
   ```
   Check the dump generally: `sqlite3 minimine.db ".indexes synonym"`. InterMine
   creates hundreds of indexes; if whole tables came across bare, add what the
   ported queries join on.
3. Make sure the mirror has no `-wal` sidecar (see "Immutable open" below):
   ```bash
   sqlite3 minimine.db "PRAGMA wal_checkpoint(TRUNCATE); PRAGMA journal_mode=DELETE;"
   ```
4. Run with `SQLITE_DB_PATH=/path/to/minimine.db bun run serve`.
5. To serve a field from SQLite, point the relevant resolver's `sourceName` at
   `lisSqliteAPI` (that method must be ported first). Resolvers already take the
   source name as an argument — see `resolvers/index.ts`.

## Immutable open

`SqliteServer` opens the mirror read-only **and** immutable
(`file:…?immutable=1` + `SQLITE_OPEN_READONLY | SQLITE_OPEN_URI`). `immutable=1`
tells SQLite the file cannot change while open, so it skips locking and change
detection entirely — worth having when many concurrent requests read one file. It's
a URI parameter rather than a boolean option, which is why the filename is a
`file:` URI.

The catch: **`immutable=1` ignores the `-wal` sidecar.** Open a WAL-mode mirror with
unmerged content and SQLite reports no error — it just doesn't see that data, up to
and including reporting that the tables don't exist. `openImmutable()` therefore
refuses to open a database with a `-wal` file next to it and tells you how to fold
it in. WAL *mode* is fine once checkpointed; it's a live sidecar that bites.

## Shared instance

`contextFactory` builds fresh InterMine/microservices sources per request, but
`lisSqliteAPI` is a **process-wide singleton**, cached by DB path in
`data-sources/index.ts`. It's stateless and the mirror is opened immutable, so
there is nothing per-request about it. Rebuilding it per request cost ~0.7ms of
overhead (re-parsing the ~429KB `model.json`, rebuilding class keys + QueryBuilder)
versus ~0.02ms for a query on a warm connection, and discarded `bun:sqlite`'s
prepared-statement cache, which is per-connection.

Consequences worth knowing:

- The model/class-key JSON is read **once per process**. Editing `data/model.json`
  needs a restart to take effect.
- The connection is long-lived, so its page cache and statement cache stay warm.
  Any PRAGMA tuning belongs in `openImmutable()`, where it applies once.
- Construction failures are not cached — fix the cause (e.g. checkpoint a `-wal`)
  and the next request retries without a restart.

## Porting the remaining `api/*.ts`

Each becomes a thin caller: build `Constraint[]` (+ optional `constraintLogic`) and
call `this.pathQuery(root, viewAttrs, sort, constraints, logic, page)`, reusing the
same `intermine*Attributes`/`response2*` from the InterMine models. Add the method
to `api/index.ts`. If a path warns (set `DEBUG_SQL=1` or `NODE_ENV=development`),
it names the exact collection/field to fix — usually one `INDIRECTION` line or a
missing table in the subset.

## Known follow-ups

- `SequenceFeature.overlappingFeatures` isn't materialized in this mine (returns
  empty by design).
- Functions that select non-id attributes of `Location`/`Sequence` need those
  tables added to the subset (they're excluded by default for size; `X.ref.id`
  endpoints don't need them).
