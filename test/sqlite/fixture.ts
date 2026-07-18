// fixture.ts — shared setup for the schema tests. The model + class keys load from
// the committed data files (no DB needed). openMirror() returns a read-only handle
// to the mirror when SQLITE_DB_PATH is set, else null so conformance tests skip.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {Database} from 'bun:sqlite';
import {Model} from '../../src/data-sources/sqlite/model.js';
import {buildClassKeys} from '../../src/data-sources/sqlite/class-keys.js';

const DATA = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/data-sources/sqlite/data',
);

const load = (f: string) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

export const model = Model.fromJSON(load('model.json'));
export const classKeysRaw = load('classkeys.json');
export const classKeys = buildClassKeys(model, classKeysRaw);

export function openMirror(): Database | null {
  const p = process.env.SQLITE_DB_PATH;
  if (!p) return null;
  return new Database(p, {readonly: true});
}

export const tableSet = (db: Database): Set<string> =>
  new Set(
    (
      db.query("SELECT name FROM sqlite_master WHERE type='table'").all() as {
        name: string;
      }[]
    ).map((r) => r.name),
  );

export const columnsOf = (db: Database, t: string): Set<string> =>
  new Set(
    (
      db.query(`PRAGMA table_info(${JSON.stringify(t)})`).all() as {
        name: string;
      }[]
    ).map((r) => r.name),
  );

export const indexNamesOf = (db: Database, t: string): string[] =>
  (
    db.query(`PRAGMA index_list(${JSON.stringify(t)})`).all() as {
      name: string;
    }[]
  ).map((r) => r.name);

// The columns of an index, in order (first element is the leftmost/leading column).
export const indexColumns = (db: Database, index: string): string[] =>
  (
    db.query(`PRAGMA index_info(${JSON.stringify(index)})`).all() as {
      name: string;
    }[]
  ).map((r) => r.name);

// Every m2m collection in the model, as {ownerClass, collection, def}.
export function m2mCollections(): Array<{cls: string; coll: string; def: any}> {
  const out: Array<{cls: string; coll: string; def: any}> = [];
  for (const [cls, def] of Object.entries<any>(model.classes)) {
    for (const [coll, cdef] of Object.entries<any>(def.collections ?? {})) {
      if (model.collectionKind(cdef).kind === 'm2m')
        out.push({cls, coll, def: cdef});
    }
  }
  return out;
}
