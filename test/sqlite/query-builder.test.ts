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

  it('INNER-joins a view reference by default (InterMine joins INNER unless OUTER)', () => {
    const {sql} = qb.build('Gene', ['Gene.id', 'Gene.organism.genus']);
    expect(sql).toContain('INNER JOIN organism');
    expect(sql).not.toContain('LEFT JOIN organism');
  });

  it('LEFT-joins a view reference only when declared OUTER (outerJoins)', () => {
    const {sql} = qb.build(
      'Gene',
      ['Gene.id', 'Gene.organism.genus'],
      undefined,
      [],
      undefined,
      {},
      ['Gene.organism'],
    );
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

  it('join style follows the declaration, even for a constrained path', () => {
    // Like InterMine: a constraint does NOT change join style. strain is declared
    // OUTER and constrained, so it stays LEFT (matters for NONE OF / IS NULL — see
    // getPanGenePairs); an equality constraint over LEFT is equivalent to INNER
    // anyway. A constrained path NOT declared OUTER is INNER by default.
    const constraints: Constraint[] = [
      {path: 'Gene.strain.identifier', op: '=', value: 'Wm82', code: 'A'},
      {path: 'Gene.organism.genus', op: '=', value: 'Glycine', code: 'B'},
    ];
    const {sql} = qb.build(
      'Gene',
      ['Gene.id'],
      undefined,
      constraints,
      'A and B',
      {},
      ['Gene.strain'], // strain declared OUTER; organism is not
    );
    expect(sql).toContain('LEFT JOIN strain'); // declared OUTER wins
    expect(sql).toContain('INNER JOIN organism'); // not declared -> INNER default
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

  it('resolves the .class pseudo-attribute to the package-stripped class column', () => {
    // Location.feature.class -> the joined feature table's class, with the
    // org.intermine.model.bio. package stripped to match InterMine's short names.
    const {sql} = qb.build('Location', [
      'Location.id',
      'Location.feature.class',
    ]);
    expect(sql).toContain("replace(t1.class, 'org.intermine.model.bio.', '')");
  });

  it('resolves .objectId like .id: root objectId is the PK, ref objectId is the FK', () => {
    // Location.objectId -> t0.id; Location.feature.objectId -> the FK column (no join).
    const {sql} = qb.build('Location', [
      'Location.objectId',
      'Location.feature.objectId',
    ]);
    expect(sql).toContain('t0.id');
    expect(sql).toContain('t0.featureid');
    expect(sql).not.toContain('JOIN'); // both resolve without a join
  });
});
