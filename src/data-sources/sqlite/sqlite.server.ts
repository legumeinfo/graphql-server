// sqlite.server.ts — SQLite analogue of intermine.server.ts. Same API *shape*
// (methods return ApiResponse<G> with GraphQL-shaped rows) so existing resolvers
// call it unchanged. Uses bun:sqlite (built into Bun). Not a RESTDataSource — add
// DataLoader batching here if needed (SQLite calls are ~microseconds).
import {Database, constants} from 'bun:sqlite';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import {Model} from './model.js';
import {buildClassKeys} from './class-keys.js';
import {QueryBuilder, Constraint} from './path-resolver.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const loadJSON = (rel: string) =>
  JSON.parse(readFileSync(join(HERE, rel), 'utf8'));

// The mirror is a read-only snapshot of a Postgres dump, so we can promise SQLite
// the file will not change while it is open. `immutable=1` makes it skip all
// locking and change detection, which is what we want when many concurrent
// requests read the same file. It is a URI *parameter*, not a boolean option, so
// the filename has to be a file: URI and SQLITE_OPEN_URI has to be set.
// SQLITE_OPEN_READONLY is set as well so a write is rejected by the connection
// itself rather than relying on immutability alone.
const OPEN_FLAGS = constants.SQLITE_OPEN_READONLY | constants.SQLITE_OPEN_URI;

function openImmutable(dbPath: string): Database {
  const abs = resolve(dbPath);
  if (!existsSync(abs)) {
    throw new Error(`SQLITE_DB_PATH does not exist: ${abs}`);
  }
  // immutable=1 makes SQLite ignore the -wal sidecar completely: a mirror left in
  // WAL mode with unmerged content then reads as stale, or as having no tables at
  // all, with no error raised. Refuse to open rather than silently serve wrong
  // results. Checkpoint the mirror first (see INTEGRATION.md) — WAL *mode* is fine
  // once the sidecar is folded in and removed; it's an existing -wal that bites.
  if (existsSync(`${abs}-wal`)) {
    throw new Error(
      `Refusing to open ${abs} as immutable: a "-wal" sidecar is present, and ` +
        `immutable=1 ignores it, which would silently serve stale or empty results. ` +
        `Fold it in first:\n` +
        `  sqlite3 "${abs}" "PRAGMA wal_checkpoint(TRUNCATE); PRAGMA journal_mode=DELETE;"`,
    );
  }
  // pathToFileURL (not encodeURI) so that a '?' or '#' in the path is escaped
  // rather than parsed as the start of the URI's query/fragment.
  const url = pathToFileURL(abs);
  url.search = 'immutable=1';
  return new Database(url.href, OPEN_FLAGS);
}

export interface IntermineDataResponse<I> {
  results: I[];
}
export interface ApiResponse<G> {
  data: G;
  metadata?: {
    pageInfo?: {hasNextPage: boolean; numResults: number; pageSize: number};
  };
}
export type PageOpts = {page?: number; pageSize?: number};

export class SqliteServer {
  protected db: Database;
  protected model: Model;
  protected qb: QueryBuilder;

  constructor(
    dbPath: string,
    opts: {modelPath?: string; classKeysPath?: string} = {},
  ) {
    this.db = openImmutable(dbPath);
    const model = Model.fromJSON(
      loadJSON(opts.modelPath ?? './data/model.json'),
    );
    const classKeys = buildClassKeys(
      model,
      loadJSON(opts.classKeysPath ?? './data/classkeys.json'),
    );
    this.model = model;
    this.qb = new QueryBuilder(model, classKeys);
  }

  // Build SQL from paths, run it, return rows as POSITIONAL arrays in view order
  // (exactly what response2graphqlObjects/result2graphqlObject consume).
  pathQuery<I = unknown[]>(
    root: string,
    view: string[],
    sort?: string,
    constraints: Constraint[] = [],
    constraintLogic?: string,
    page?: PageOpts,
  ): IntermineDataResponse<I> {
    const {limit, offset} = this.paginate(page);
    const {sql, params, warnings} = this.qb.build(
      root,
      view,
      sort,
      constraints,
      constraintLogic,
      {limit, offset},
    );
    if (warnings.length && process.env.NODE_ENV === 'development')
      warnings.forEach((w) => console.warn(`[sqlite] ${w}`));
    if (!sql) return {results: []};
    if (process.env.DEBUG_SQL)
      console.log(`\n[SQL] ${sql}\n[params] ${JSON.stringify(params)}`);
    return {results: this.db.query(sql).values(...params) as unknown as I[]};
  }

  // DISTINCT on the root PK guards against row multiplication from collection joins.
  pathQueryCount(
    root: string,
    constraints: Constraint[] = [],
    constraintLogic?: string,
  ): {count: number} {
    const {sql, params} = this.qb.build(
      root,
      [`${root}.id`],
      undefined,
      constraints,
      constraintLogic,
    );
    if (!sql) return {count: 0};
    const wrapped = `SELECT COUNT(*) AS c FROM (SELECT DISTINCT t0.id ${sql.substring(sql.indexOf('\nFROM'))})`;
    const row = this.db.query(wrapped).get(...params) as {c: number} | null;
    return {count: row?.c ?? 0};
  }

  private paginate(page?: PageOpts) {
    if (!page || (page.page == null && page.pageSize == null))
      return {} as {limit?: number; offset?: number};
    const pageSize = page.pageSize ?? 10;
    const p = page.page ?? 1;
    return {limit: pageSize, offset: (p - 1) * pageSize};
  }
}
