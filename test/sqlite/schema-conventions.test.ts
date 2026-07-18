// schema-conventions.test.ts — Tier 1 schema tests: internal consistency of the
// physical-naming conventions against the committed model. No database; always runs
// in CI. Guards the convention code + model file against each other, so a bad edit
// (a typo in INDIRECTION, a model swap, a broken derivation) fails here before it
// reaches a query. Mirror conformance (do these names exist in the DB?) is Tier 2,
// in schema-conformance.test.ts.
import {describe, it, expect} from 'bun:test';
import {model, classKeys, m2mCollections} from './fixture.js';
import {
  tableOf,
  attrCol,
  refCol,
  deriveIndirection,
  INDIRECTION,
  ABSENT_COLLECTIONS,
} from '../../src/data-sources/sqlite/physical-names.js';

describe('physical-name functions', () => {
  it('lowercases class/attr/ref names', () => {
    expect(tableOf('GeneFunction')).toBe('genefunction');
    expect(attrCol('primaryIdentifier')).toBe('primaryidentifier');
    expect(refCol('organism')).toBe('organismid');
  });

  it('prefixes reserved-word tables and columns with intermine_', () => {
    expect(tableOf('Sequence')).toBe('intermine_sequence');
    expect(attrCol('value')).toBe('intermine_value');
    expect(attrCol('start')).toBe('intermine_start');
  });
});

describe('m2m derivation rule', () => {
  it('farCol is the collection, nearCol is the near name, table is sorted+joined', () => {
    // Gene.panGeneSets: reverse-reference "genes" is the near name.
    expect(deriveIndirection('panGeneSets', 'genes')).toEqual({
      table: 'genespangenesets',
      nearCol: 'genes',
      farCol: 'pangenesets',
    });
  });

  it('gives both directions of a bidirectional m2m the same table', () => {
    const a = deriveIndirection('panGeneSets', 'genes');
    const b = deriveIndirection('genes', 'panGeneSets');
    expect(a.table).toBe(b.table);
    expect(a.nearCol).toBe(b.farCol);
    expect(a.farCol).toBe(b.nearCol);
  });

  it('reproduces every verified INDIRECTION override exactly', () => {
    // The map is redundant: the rule derives each entry. If this fails, either the
    // rule/declaringClass changed or a deliberate override was added (update this).
    const mismatches: string[] = [];
    for (const [key, spec] of Object.entries(INDIRECTION)) {
      const [cls, coll] = key.split('.');
      const cdef = model.classes[cls]?.collections?.[coll];
      expect(
        cdef,
        `INDIRECTION key ${key} not a collection in the model`,
      ).toBeTruthy();
      const nearName = cdef.reverseReference ?? model.declaringClass(cls, coll);
      const derived = deriveIndirection(coll, nearName);
      if (JSON.stringify(derived) !== JSON.stringify(spec)) {
        mismatches.push(
          `${key}: map=${JSON.stringify(spec)} derived=${JSON.stringify(derived)}`,
        );
      }
    }
    expect(mismatches).toEqual([]);
  });
});

describe('declaringClass', () => {
  it('finds the class that declares an inherited collection', () => {
    // childFeatures is declared on SequenceFeature; Gene inherits it.
    expect(model.declaringClass('Gene', 'childFeatures')).toBe(
      'SequenceFeature',
    );
    // dataSets/publications come from Annotatable/BioEntity, not the leaf class.
    expect(model.declaringClass('Gene', 'dataSets')).not.toBe('Gene');
  });

  it('returns the class itself for a collection it declares directly', () => {
    expect(model.declaringClass('Gene', 'panGeneSets')).toBe('Gene');
  });
});

describe('model / map cross-consistency', () => {
  it('every INDIRECTION key is a real m2m collection in the model', () => {
    for (const key of Object.keys(INDIRECTION)) {
      const [cls, coll] = key.split('.');
      const cdef = model.classes[cls]?.collections?.[coll];
      expect(cdef, `${key} missing from model`).toBeTruthy();
      expect(model.collectionKind(cdef).kind).toBe('m2m');
    }
  });

  it('every ABSENT_COLLECTIONS key is a real collection in the model', () => {
    for (const key of ABSENT_COLLECTIONS) {
      const [cls, coll] = key.split('.');
      expect(
        model.classes[cls]?.collections?.[coll],
        `${key} missing from model`,
      ).toBeTruthy();
    }
  });

  it('every collection classifies as o2m or m2m without throwing', () => {
    for (const def of Object.values<any>(model.classes)) {
      for (const cdef of Object.values<any>(def.collections ?? {})) {
        expect(['o2m', 'm2m']).toContain(model.collectionKind(cdef).kind);
      }
    }
  });

  it('has at least one m2m collection (guards the fixture/model loading)', () => {
    expect(m2mCollections().length).toBeGreaterThan(300);
  });
});

describe('class keys', () => {
  it('every kept class-key attribute resolves to a model attribute', () => {
    for (const [cls, keys] of Object.entries(classKeys)) {
      for (const k of keys) {
        expect(
          model.field(cls, k)?.kind,
          `${cls}.${k} is not an attribute`,
        ).toBe('attr');
      }
    }
  });

  it('Gene LOOKUP is keyed on primaryIdentifier (searchGeneFunctions depends on it)', () => {
    expect(classKeys['Gene']).toContain('primaryIdentifier');
  });
});
