// canonical.ts — normalize + compare two backend responses for the SAME method+args.
// Neutralizes legitimate noise (row order, null/undefined, number vs numeric-string,
// float precision) so only *real* divergences are reported.
import type {ApiResponse} from '../../src/data-sources/sqlite/sqlite.server.js';

export interface CompareOptions {
  // stable sort key so row order can't cause false diffs. default: `id` then JSON.
  keyOf?: (row: Record<string, unknown>) => string;
  ignoreKeys?: string[]; // fields expected to differ (e.g. on-demand-fetched)
  coerceNumbers?: boolean; // treat "123" and 123 as equal (InterMine often stringifies)
  floatTolerance?: number; // abs diff allowed when comparing two numbers
  compareCount?: boolean; // compare metadata.pageInfo.numResults (default true)
}

const DEFAULTS: Required<Omit<CompareOptions, 'keyOf' | 'ignoreKeys'>> = {
  coerceNumbers: true,
  floatTolerance: 1e-9,
  compareCount: true,
};

export interface Diff {
  path: string;
  kind: 'count' | 'row-length' | 'missing-key' | 'value';
  intermine: unknown;
  sqlite: unknown;
}

type Row = Record<string, unknown>;

function normValue(v: unknown, coerce: boolean): unknown {
  if (v === undefined) return null;
  if (coerce && typeof v === 'string') {
    const t = v.trim();
    if (t !== '' && Number.isFinite(Number(t))) return Number(t);
  }
  return v;
}

function normRow(row: Row, opts: CompareOptions): Row {
  const coerce = opts.coerceNumbers ?? DEFAULTS.coerceNumbers;
  const ignore = new Set(opts.ignoreKeys ?? []);
  const out: Row = {};
  for (const k of Object.keys(row).sort()) {
    if (ignore.has(k)) continue;
    out[k] = normValue(row[k], coerce);
  }
  return out;
}

function defaultKeyOf(row: Row): string {
  if (row.id != null) return `id:${String(row.id)}`;
  return JSON.stringify(row);
}

export function canonicalize(
  resp: ApiResponse<Row[]>,
  opts: CompareOptions = {},
) {
  const keyOf = opts.keyOf ?? defaultKeyOf;
  const rows = (resp.data ?? []).map((r) => normRow(r, opts));
  rows.sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : keyOf(a) > keyOf(b) ? 1 : 0));
  return {rows, count: resp.metadata?.pageInfo?.numResults};
}

function valuesEqual(a: unknown, b: unknown, tol: number): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) <= tol;
  }
  return a === b;
}

// a = InterMine (reference), b = SQLite (candidate)
export function diffResponses(
  a: ApiResponse<Row[]>,
  b: ApiResponse<Row[]>,
  opts: CompareOptions = {},
): Diff[] {
  const tol = opts.floatTolerance ?? DEFAULTS.floatTolerance;
  const compareCount = opts.compareCount ?? DEFAULTS.compareCount;
  const diffs: Diff[] = [];

  const ca = canonicalize(a, opts);
  const cb = canonicalize(b, opts);

  if (
    compareCount &&
    ca.count !== undefined &&
    cb.count !== undefined &&
    ca.count !== cb.count
  ) {
    diffs.push({
      path: 'metadata.numResults',
      kind: 'count',
      intermine: ca.count,
      sqlite: cb.count,
    });
  }
  if (ca.rows.length !== cb.rows.length) {
    diffs.push({
      path: 'data.length',
      kind: 'row-length',
      intermine: ca.rows.length,
      sqlite: cb.rows.length,
    });
  }

  const n = Math.min(ca.rows.length, cb.rows.length);
  for (let i = 0; i < n; i++) {
    const ra = ca.rows[i];
    const rb = cb.rows[i];
    const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]);
    for (const k of keys) {
      if (!(k in ra) || !(k in rb)) {
        diffs.push({
          path: `data[${i}].${k}`,
          kind: 'missing-key',
          intermine: ra[k],
          sqlite: rb[k],
        });
      } else if (!valuesEqual(ra[k], rb[k], tol)) {
        diffs.push({
          path: `data[${i}].${k}`,
          kind: 'value',
          intermine: ra[k],
          sqlite: rb[k],
        });
      }
    }
  }
  return diffs;
}

// A case whose reference has no rows can't detect a divergence — both backends
// would only have to agree on nothing, so it passes for the wrong reason. Returns
// an error message when that's the situation, else null. `allowEmpty` marks the
// cases where the emptiness IS the assertion (negative controls).
export function vacuousReason(
  name: string,
  reference: ApiResponse<Row[]>,
  allowEmpty?: boolean,
): string | null {
  if (allowEmpty || reference.data?.length) return null;
  return (
    `${name}: reference returned 0 rows, so this case proves nothing. Point its ` +
    `args at data that exists in this mine, or set allowEmpty if the emptiness is ` +
    `the assertion.`
  );
}

export function formatDiffs(name: string, diffs: Diff[]): string {
  if (!diffs.length) return `✓ ${name}`;
  const lines = diffs
    .slice(0, 25)
    .map(
      (d) =>
        `  [${d.kind}] ${d.path}: intermine=${JSON.stringify(d.intermine)} sqlite=${JSON.stringify(d.sqlite)}`,
    );
  const more = diffs.length > 25 ? `\n  …and ${diffs.length - 25} more` : '';
  return `✗ ${name} (${diffs.length} diffs)\n${lines.join('\n')}${more}`;
}
