# InterMine ↔ SQLite compatibility tests

Assert the SQLite backend returns results identical to the InterMine backend for
the same GraphQL data-source calls. Comparison is at the data-source method level
(searchGenes, searchGeneFunctions, …) — the exact point where the two backends can
diverge; everything above (resolvers, transformers, schema) is shared.

## The mine

Cases target **minimine-genefunction**, and `src/data-sources/sqlite/data/{model,classkeys}.json`
are that mine's model and class keys:

```
https://mines.dev.lis.ncgr.org/minimine-genefunction/service
```

Case values are mine-specific by necessity (a LOOKUP needs an identifier that
exists). If you retarget to another mine, expect to re-pick them — see
"Vacuous cases" below.

## Run modes (`COMPAT_MODE`)

- `live`   — call InterMine and SQLite and diff directly. Requires `INTERMINE_URI`
  and `SQLITE_DB_PATH`. Best for initial validation and drift detection.
- `golden` — call SQLite and diff against recorded goldens. Requires `SQLITE_DB_PATH`
  and committed `golden/*.json`. Best for CI (no live InterMine needed).
- `auto` (default) — live if InterMine is configured, else golden if goldens exist,
  else the case skips.

```bash
export MINE=https://mines.dev.lis.ncgr.org/minimine-genefunction/service

# initial 1-to-1 validation against the live mine + your mirror
INTERMINE_URI=$MINE SQLITE_DB_PATH=./minimine.sqlite \
  COMPAT_MODE=live bun test test/compat

# record goldens once, then CI runs SQLite-vs-golden
INTERMINE_URI=$MINE bun run test:compat:record
SQLITE_DB_PATH=./minimine.sqlite COMPAT_MODE=golden bun test test/compat
```

## Vacuous cases — why `allowEmpty` exists

This suite compares two backends, so **a case whose reference returns zero rows
passes for the wrong reason**: both backends agree on nothing, and the case is
green while testing nothing. This is not hypothetical — when the cases were first
written against glycinemine and pointed at minimine-genefunction, 3 of 14 went
hollow (a gene id that no longer resolved, a symbol that didn't exist here, and a
`GeneFamily` table that is empty in this mine).

So `compat.test.ts` **fails any case whose reference is empty** unless the case sets
`allowEmpty: true`, which marks the emptiness as the assertion (the `*/empty-result`
negative controls). To find hollow cases without needing a SQLite mirror:

```bash
INTERMINE_URI=$MINE bun run test:compat:triage
```

It prints per-case row counts, marks hollow rows, and exits non-zero if any exist.
Run it first whenever you retarget the suite at a different mine or snapshot.

## What the comparison neutralizes (legitimate noise) vs. flags (real diffs)

Neutralized by `canonical.ts`: row order (sorted by `id`), `undefined` vs `null`,
number vs numeric-string (InterMine often stringifies), float precision
(`floatTolerance`), and explicitly ignored fields (`ignoreKeys`, e.g. `dataSetName`
which is fetched out-of-band). Flagged: total-count (`numResults`) mismatch, row-count
mismatch, missing keys, and any value divergence — reported as
`[kind] data[i].field: intermine=… sqlite=…`.

Tune per case via the `compare` field in `cases.ts`. `harness.test.ts` unit-tests the
engine itself (runs with no backends).

## Adding coverage

Add a row to `cases.ts` ({name, method, args[, compare][, skip][, allowEmpty]}). It
automatically runs in every mode. Use `skip` to document a known, accepted divergence
(e.g. a collection not materialized in the mine). Verify the row isn't hollow with
`test:compat:triage`.

## The pan-gene-set join, and why `gene` searches under-return

Worth knowing before you read a `gf/*` case and think its value is arbitrary.

`searchGeneFunctions` builds its `gene` search as seven OR'd constraints, one of
which (code `L`) has the path `GeneFunction.gene.panGeneSets.genes`. In InterMine a
constraint path implies a join, and this function declares no outer joins (it passes
`[]`, unlike `searchGenes`, which uses `geneJoinFactory`). InterMine therefore
INNER-joins that path even though `L` is only OR'd in — so **every `gene` search is
silently restricted to GeneFunctions whose gene belongs to a pan-gene set**, no
matter which OR branch actually matches.

Observable today on the live mine: `gene: 'NAM'` returns nothing, even though a
GeneFunction with symbol exactly `NAM` exists — its gene has no pan-gene set. Drop
the `L` constraint and the row comes back. This is pre-existing InterMine backend
behavior, not something the SQLite migration introduced.

Consequences for this suite:

- `gf/*` case values are picked from genes that *have* a pan-gene set, or the case
  would return nothing regardless of which branch it meant to exercise.
- `gf/gene-without-pangeneset` pins the behavior deliberately (`allowEmpty`), because
  a SQLite port that LEFT-joins the `L` path would return the row and diverge. That
  is exactly the kind of drift this suite exists to catch.

If the upstream join is ever fixed, expect that case to flip to non-empty; retarget
it rather than delete it.

## Known gaps in this mine

Coverage is bounded by what minimine-genefunction actually holds:

- `GeneFamily` has 0 rows → `genes/by-gene-family` is `skip`ped.
- `Gene.description` and `Gene.name` are null throughout → the `description` and
  `name` args of `searchGenes` have no case; they'd be vacuous here.
- Only `searchGenes` and `searchGeneFunctions` are ported to SQLite, so those are
  the only methods `cases.ts` can reference (its `method` field is typed to them).
- `INDIRECTION` in `src/data-sources/sqlite/physical-names.ts` was derived from a
  **glycinemine** pg_dump. The two mines' models are structurally identical, so the
  m2m table names should carry over, but this is unverified against a minimine dump —
  confirm once the mirror lands. Unknown paths warn (`DEBUG_SQL=1`) rather than fail.

## Note on data snapshots

`live` compares against whatever the mine currently holds, so build the SQLite mirror
from the same snapshot. Keep `pageSize` small in cases for cheap, stable comparisons.
Prefer identifier/organism-scoped queries so results are deterministic.
