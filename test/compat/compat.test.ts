// compat.test.ts — the regression suite. Three modes (COMPAT_MODE):
//   live   : call InterMine AND SQLite, diff directly     (needs both env vars)
//   golden : call SQLite, diff against recorded goldens    (needs SQLITE_DB_PATH + goldens)
//   auto   : live if both backends present, else golden if goldens present, else skip (default)
import {describe, it, expect} from 'bun:test';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {makeIntermine, makeSqlite, call, Backend} from './backends.js';
import {cases} from './cases.js';
import {diffResponses, formatDiffs, vacuousReason} from './canonical.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const goldenPath = (name: string) =>
  join(HERE, 'golden', `${name.replace(/\//g, '__')}.json`);

const mode = process.env.COMPAT_MODE ?? 'auto';
const intermine = makeIntermine();
const sqlite = makeSqlite();

function referenceFor(
  name: string,
  method: string,
  args: unknown[],
): Promise<unknown> | null {
  if ((mode === 'live' || mode === 'auto') && intermine)
    return call(intermine as Backend, method, args);
  if (mode === 'golden' || mode === 'auto') {
    const p = goldenPath(name);
    if (existsSync(p))
      return Promise.resolve(JSON.parse(readFileSync(p, 'utf8')));
  }
  return null;
}

// get-one methods return {data: object|null}. Normalize to the list shape the diff
// engine and vacuous-guard expect: [] for null, [object] otherwise.
function normalizeSingle(resp: any, single?: boolean) {
  if (!single) return resp;
  const d = resp?.data;
  return {...resp, data: d == null ? [] : [d]};
}

// Live mode calls InterMine, whose gene-LOOKUP queries can take several seconds;
// give each case headroom so a slow upstream isn't reported as a failure. Golden
// mode (SQLite only) finishes in milliseconds regardless.
const CASE_TIMEOUT_MS = 30000;

describe('intermine vs sqlite compatibility', () => {
  for (const c of cases) {
    const run = c.skip ? it.skip : it;
    run(
      c.name,
      async () => {
        if (!sqlite) return; // SQLITE_DB_PATH not set -> nothing to test
        const reference = referenceFor(c.name, c.method, c.args);
        if (!reference) return; // no InterMine and no golden -> skip silently
        const [refRaw, candRaw] = await Promise.all([
          reference,
          call(sqlite, c.method, c.args),
        ]);
        const ref = normalizeSingle(refRaw, c.single);
        const cand = normalizeSingle(candRaw, c.single);
        // Fail rather than pass vacuously — this is how a mine swap (or a query
        // that quietly stopped matching) surfaces instead of going green.
        const vacuous = vacuousReason(c.name, ref as any, c.allowEmpty);
        if (vacuous) throw new Error(vacuous);
        const diffs = diffResponses(ref as any, cand as any, c.compare);
        if (diffs.length) throw new Error(formatDiffs(c.name, diffs));
        expect(diffs.length).toBe(0);
      },
      CASE_TIMEOUT_MS,
    );
  }
});
