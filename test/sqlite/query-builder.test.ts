// query-builder.test.ts — SQL-shape unit tests for the path→SQL translator, run
// with no database. The compat suite (test/compat) validates results end-to-end
// against a mirror; these guard the two behaviors that mirror can't be assumed
// present in CI: INNER-vs-LEFT join selection, and DISTINCT. Uses the committed
// model so it tracks the real schema.
import {describe, it, expect} from 'bun:test';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {Model} from '../../src/data-sources/sqlite/model.js';
import {buildClassKeys} from '../../src/data-sources/sqlite/class-keys.js';
import {
  QueryBuilder,
  Constraint,
} from '../../src/data-sources/sqlite/path-resolver.js';
import {tableOf} from '../../src/data-sources/sqlite/physical-names.js';

const DATA = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/data-sources/sqlite/data',
);
const model = Model.fromJSON(
  JSON.parse(readFileSync(join(DATA, 'model.json'), 'utf8')),
);
const classKeys = buildClassKeys(
  model,
  JSON.parse(readFileSync(join(DATA, 'classkeys.json'), 'utf8')),
);
const qb = new QueryBuilder(model, classKeys);

describe('QueryBuilder SQL shape', () => {
  it('emits SELECT DISTINCT so collection fan-out cannot duplicate root rows', () => {
    const {sql} = qb.build('Gene', ['Gene.id', 'Gene.primaryIdentifier']);
    expect(sql.startsWith('SELECT DISTINCT ')).toBe(true);
  });

  it('LEFT-joins a reference used only in the view (must not drop root rows)', () => {
    const {sql} = qb.build('Gene', ['Gene.id', 'Gene.organism.genus']);
    expect(sql).toContain('LEFT JOIN organism');
    expect(sql).not.toContain('INNER JOIN organism');
  });

  it('INNER-joins the same reference when it is used in a constraint', () => {
    const constraints: Constraint[] = [
      {path: 'Gene.organism.genus', op: '=', value: 'Glycine', code: 'A'},
    ];
    const {sql} = qb.build('Gene', ['Gene.id'], undefined, constraints, 'A');
    expect(sql).toContain('INNER JOIN organism');
    expect(sql).not.toContain('LEFT JOIN organism');
  });

  it('INNER-joins every hop of a constrained collection path (the NAM/pangeneset case)', () => {
    // GeneFunction.gene and .gene.panGeneSets.genes are m2m collections; a
    // constraint on them must exclude root rows lacking the path, the way
    // InterMine does — so no LEFT JOIN may remain on that path.
    const constraints: Constraint[] = [
      {
        path: 'GeneFunction.gene.panGeneSets.genes',
        op: 'LOOKUP',
        value: 'x',
        code: 'L',
      },
    ];
    const {sql} = qb.build(
      'GeneFunction',
      ['GeneFunction.id'],
      undefined,
      constraints,
      'L',
    );
    expect(sql).toContain('INNER JOIN');
    expect(sql).not.toContain('LEFT JOIN');
  });

  it('keeps view joins LEFT even when a different path is constrained', () => {
    // organism is view-only (LEFT); strain is constrained (INNER). They must not
    // bleed into each other.
    const constraints: Constraint[] = [
      {path: 'Gene.strain.identifier', op: '=', value: 'Wm82', code: 'A'},
    ];
    const {sql} = qb.build(
      'Gene',
      ['Gene.id', 'Gene.organism.genus'],
      undefined,
      constraints,
      'A',
    );
    expect(sql).toContain('LEFT JOIN organism');
    expect(sql).toContain('INNER JOIN strain');
  });

  it('resolves the reserved-word class Sequence to intermine_sequence', () => {
    expect(tableOf('Sequence')).toBe('intermine_sequence');
    // BindingSite.sequence is a reference to Sequence; the join must use the
    // prefixed table name, not the bare reserved word.
    const {sql} = qb.build('BindingSite', [
      'BindingSite.id',
      'BindingSite.sequence.length',
    ]);
    expect(sql).toContain('intermine_sequence');
    expect(sql).not.toMatch(/JOIN sequence /);
  });
});
