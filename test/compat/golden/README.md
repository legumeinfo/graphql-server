# golden/

Recorded InterMine responses, used by `COMPAT_MODE=golden` so CI can regression-test
the SQLite backend against a frozen InterMine snapshot without a live InterMine.

Generate/refresh (run against the SAME mine your SQLite mirror was built from):

```bash
INTERMINE_URI=https://mines.dev.lis.ncgr.org/minimine-genefunction/service \
  bun run test:compat:record
```

Commit the resulting `*.json` so the suite is reproducible. Re-record whenever the
mine's data snapshot changes.

These are recordings of real InterMine responses, so they are only as meaningful as
the case that produced them: a golden of `{"data": []}` for a case that isn't marked
`allowEmpty` means the case went hollow, not that the backends agree. `bun run
test:compat:triage` catches that before you record. See ../TESTING.md.
