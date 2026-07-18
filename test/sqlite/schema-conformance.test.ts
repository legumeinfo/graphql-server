// schema-conformance.test.ts — Tier 2 schema tests: the physical names derived from
// the model actually exist in the mirror. Needs SQLITE_DB_PATH; the whole block
// skips without it (like compat live mode), so CI without a mirror stays green.
//
//   SQLITE_DB_PATH=./minimine.db bun test test/sqlite/schema-conformance.test.ts
//
// Known, accepted exceptions are allowlisted below; a NEW divergence (a class with
// no table, a fresh reserved word, an unmapped m2m) fails loudly. This is the guard
// that catches a mine swap or a different converter drifting from our assumptions.
import {describe, it, expect} from 'bun:test';
import {
  model,
  classKeys,
  openMirror,
  tableSet,
  columnsOf,
  indexNamesOf,
  indexColumns,
} from './fixture.js';
import {
  tableOf,
  attrCol,
  refCol,
  deriveIndirection,
  INDIRECTION,
  ABSENT_COLLECTIONS,
  RESERVED_ATTRS,
  SYNONYM_TABLE,
  SYNONYM_VALUE_COL,
  SYNONYM_SUBJECT_COL,
} from '../../src/data-sources/sqlite/physical-names.js';

// InterMine "simple objects": rows without a synthetic id PK. They can't be a query
// ROOT (pathQueryCount does DISTINCT t0.id), so they're excluded from the id check.
// A new no-id class here is a real problem — do not add to this list without reason.
const NO_ID_CLASSES = new Set(['ExpressionValue', 'Newick']);

const db = openMirror();
const suite = db ? describe : describe.skip;

suite('mirror conformance', () => {
  // Guarded so the (skipped) suite body doesn't dereference a null db at collection
  // time; when db is null every `it` is skipped and these are never read.
  const tables = db ? tableSet(db) : new Set<string>();
  const cols = (t: string) => (db ? columnsOf(db, t) : new Set<string>());
  const classEntries = Object.entries<any>(model.classes);

  it('(a) every model class maps to a table that exists', () => {
    const missing = classEntries
      .filter(([cls]) => !tables.has(tableOf(cls)))
      .map(([cls]) => `${cls} -> ${tableOf(cls)}`);
    expect(missing).toEqual([]);
  });

  it('(b) every class table has an id PK (except known simple objects)', () => {
    const noId = classEntries
      .filter(
        ([cls]) => tables.has(tableOf(cls)) && !cols(tableOf(cls)).has('id'),
      )
      .map(([cls]) => cls)
      .filter((cls) => !NO_ID_CLASSES.has(cls));
    expect(noId).toEqual([]);
  });

  it('(c) every attribute maps to a column', () => {
    const missing: string[] = [];
    for (const [cls, def] of classEntries) {
      const t = tableOf(cls);
      if (!tables.has(t)) continue;
      const c = cols(t);
      for (const a of Object.keys(def.attributes ?? {})) {
        if (!c.has(attrCol(a)))
          missing.push(`${cls}.${a} -> ${t}.${attrCol(a)}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('(d) every reference maps to a <name>id column', () => {
    const missing: string[] = [];
    for (const [cls, def] of classEntries) {
      const t = tableOf(cls);
      if (!tables.has(t)) continue;
      const c = cols(t);
      for (const r of Object.keys(def.references ?? {})) {
        if (!c.has(refCol(r))) missing.push(`${cls}.${r} -> ${t}.${refCol(r)}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('(e) RESERVED_ATTRS covers every reserved-word column the DB prefixed', () => {
    // If the DB stored a column as intermine_<x> for a model attribute <x> that our
    // RESERVED_ATTRS set doesn't know, attrCol(<x>) would produce the wrong (bare)
    // name. Catches a new reserved word introduced by a different mine.
    const gaps: string[] = [];
    for (const [cls, def] of classEntries) {
      const t = tableOf(cls);
      if (!tables.has(t)) continue;
      const c = cols(t);
      for (const a of Object.keys(def.attributes ?? {})) {
        const lc = a.toLowerCase();
        if (!RESERVED_ATTRS.has(lc) && c.has(`intermine_${lc}`) && !c.has(lc)) {
          gaps.push(
            `${cls}.${a} stored as intermine_${lc}, not in RESERVED_ATTRS`,
          );
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('(f) every o2m collection reverse-reference FK exists on the far table', () => {
    const missing: string[] = [];
    for (const [cls, def] of classEntries) {
      for (const [coll, cdef] of Object.entries<any>(def.collections ?? {})) {
        const ck = model.collectionKind(cdef);
        if (ck.kind !== 'o2m') continue;
        const farT = tableOf(ck.referencedType);
        if (!tables.has(farT)) {
          missing.push(`${cls}.${coll}: far table ${farT} missing`);
          continue;
        }
        const fk = refCol(ck.reverseReference);
        if (!cols(farT).has(fk))
          missing.push(`${cls}.${coll} -> ${farT}.${fk}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('(g) every non-absent m2m collection resolves to a real indirection table', () => {
    // Mirrors the resolver: INDIRECTION override, else derive; absence checked on the
    // leaf and on the declaring class (inherited overlappingFeatures).
    const broken: string[] = [];
    for (const [cls, def] of classEntries) {
      for (const [coll, cdef] of Object.entries<any>(def.collections ?? {})) {
        if (model.collectionKind(cdef).kind !== 'm2m') continue;
        const declaring = model.declaringClass(cls, coll);
        if (
          ABSENT_COLLECTIONS.has(`${cls}.${coll}`) ||
          ABSENT_COLLECTIONS.has(`${declaring}.${coll}`)
        ) {
          continue;
        }
        const nearName = cdef.reverseReference ?? declaring;
        const spec =
          INDIRECTION[`${cls}.${coll}`] ?? deriveIndirection(coll, nearName);
        const c = tables.has(spec.table) ? cols(spec.table) : new Set<string>();
        if (
          !tables.has(spec.table) ||
          !c.has(spec.nearCol) ||
          !c.has(spec.farCol)
        ) {
          broken.push(
            `${cls}.${coll} -> ${spec.table}(${spec.nearCol}, ${spec.farCol})`,
          );
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('(h) synonym table is shaped as expected and indexed on subjectid', () => {
    expect(tables.has(SYNONYM_TABLE)).toBe(true);
    const c = cols(SYNONYM_TABLE);
    expect(c.has(SYNONYM_VALUE_COL)).toBe(true);
    expect(c.has(SYNONYM_SUBJECT_COL)).toBe(true);
    // LOOKUP is unusable without an index whose leading column is subjectid.
    const leadsWithSubject = indexNamesOf(db!, SYNONYM_TABLE).some(
      (ix) => indexColumns(db!, ix)[0] === SYNONYM_SUBJECT_COL,
    );
    expect(leadsWithSubject).toBe(true);
  });

  it('(i) every class-key attribute resolves to a column in the mirror', () => {
    const missing: string[] = [];
    for (const [cls, keys] of Object.entries(classKeys)) {
      const t = tableOf(cls);
      if (!tables.has(t)) continue;
      const c = cols(t);
      for (const k of keys) if (!c.has(attrCol(k))) missing.push(`${cls}.${k}`);
    }
    expect(missing).toEqual([]);
  });
});
