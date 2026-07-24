#!/usr/bin/env bash
# add-id-indexes.sh — post-process a SQLite mirror produced from an InterMine
# Postgres dump so that reference joins are fast.
#
# WHY THIS EXISTS
# The Postgres->SQLite conversion emits every table's `id` as a plain column
# (`[id]`), NOT `INTEGER PRIMARY KEY`. So `id` is not the rowid and has no index,
# even though the loader creates every *secondary* index (primaryidentifier, name,
# ...). Almost every reference join in the GraphQL server targets a `.id`
# (e.g. location.locatedonid -> bioentity.id). With no index on the target `id`,
# SQLite builds a throwaway "AUTOMATIC COVERING INDEX" over the whole target table
# on EVERY execution. On big tables (bioentity ~8.2M rows) that is ~4s per query,
# and the resolvers issue one such query per row (N+1), so a 20-row gene page hung
# for minutes. Adding a real index on `id` makes the plan a direct index lookup:
# measured 4.17s -> 0.003s for one gene's locations; a full gene page 2min+ -> ~48ms.
#
# THE DURABLE FIX belongs upstream: declare `id INTEGER PRIMARY KEY` in the SQLite
# schema so `id` becomes the rowid (zero extra index, smaller file, same speedup).
# This script is the in-place remedy when you only have the finished .db file.
#
# Idempotent (CREATE UNIQUE INDEX IF NOT EXISTS). InterMine object ids are globally
# unique, so UNIQUE is correct; if a table ever violated that the CREATE would fail
# loudly rather than silently masking a data problem.
#
# Usage: scripts/add-id-indexes.sh path/to/mine.db
set -euo pipefail

DB="${1:?usage: add-id-indexes.sh path/to/mine.db}"
[ -f "$DB" ] || { echo "no such db: $DB" >&2; exit 1; }

# Generate one CREATE for every table that has an `id` column, then run them.
# synchronous=OFF speeds the bulk build; the mirror is a regenerable snapshot.
sqlite3 "$DB" <<'SQL' | sqlite3 "$DB"
SELECT 'PRAGMA synchronous=OFF;';
SELECT 'CREATE UNIQUE INDEX IF NOT EXISTS "' || m.name || '__id" ON "' || m.name || '"(id);'
FROM sqlite_master m
WHERE m.type = 'table'
  AND EXISTS (SELECT 1 FROM pragma_table_info(m.name) WHERE name = 'id');
SQL

echo "id indexes created on $DB"
