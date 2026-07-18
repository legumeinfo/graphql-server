// harness.test.ts — self-tests for the comparison engine (run with no backends).
// Proves the canonicalizer neutralizes order/null/number-noise and that real
// divergences are still caught.
import {describe, it, expect} from 'bun:test';
import {diffResponses, vacuousReason} from './canonical.js';

const wrap = (rows: any[], count?: number) => ({
  data: rows,
  metadata:
    count === undefined
      ? undefined
      : {pageInfo: {hasNextPage: false, numResults: count, pageSize: 10}},
});

describe('canonical diff engine', () => {
  it('ignores row order', () => {
    const a = wrap([
      {id: 1, s: 'x'},
      {id: 2, s: 'y'},
    ]);
    const b = wrap([
      {id: 2, s: 'y'},
      {id: 1, s: 'x'},
    ]);
    expect(diffResponses(a, b)).toEqual([]);
  });

  it('treats undefined and null as equal', () => {
    const a = wrap([{id: 1, s: undefined}]);
    const b = wrap([{id: 1, s: null}]);
    expect(diffResponses(a, b)).toEqual([]);
  });

  it('coerces numeric strings (InterMine stringifies) by default', () => {
    const a = wrap([{id: 1, taxonId: '3847', length: '1024'}]);
    const b = wrap([{id: 1, taxonId: 3847, length: 1024}]);
    expect(diffResponses(a, b)).toEqual([]);
  });

  it('applies float tolerance', () => {
    const a = wrap([{id: 1, score: 0.1 + 0.2}]);
    const b = wrap([{id: 1, score: 0.3}]);
    expect(diffResponses(a, b, {floatTolerance: 1e-6})).toEqual([]);
  });

  it('respects ignoreKeys', () => {
    const a = wrap([{id: 1, dataSetName: 'A'}]);
    const b = wrap([{id: 1, dataSetName: 'B'}]);
    expect(diffResponses(a, b, {ignoreKeys: ['dataSetName']})).toEqual([]);
  });

  it('catches a real value divergence', () => {
    const a = wrap([{id: 1, symbol: 'ACT11'}]);
    const b = wrap([{id: 1, symbol: 'ACT12'}]);
    const d = diffResponses(a, b);
    expect(d).toHaveLength(1);
    expect(d[0]).toMatchObject({
      kind: 'value',
      path: 'data[0].symbol',
      intermine: 'ACT11',
      sqlite: 'ACT12',
    });
  });

  it('catches a count mismatch', () => {
    const d = diffResponses(wrap([{id: 1}], 5), wrap([{id: 1}], 7));
    expect(d.some((x) => x.kind === 'count')).toBe(true);
  });

  it('catches missing rows', () => {
    const d = diffResponses(wrap([{id: 1}, {id: 2}]), wrap([{id: 1}]));
    expect(d.some((x) => x.kind === 'row-length')).toBe(true);
  });
});

// The reason this guard exists: two empty responses diff clean, so without it a
// case that matches nothing is indistinguishable from a case that passes.
describe('vacuous-case guard', () => {
  it('confirms an empty-vs-empty diff looks like a pass', () => {
    expect(diffResponses(wrap([]), wrap([]))).toEqual([]);
  });

  it('flags a case whose reference returned no rows', () => {
    const reason = vacuousReason('gf/by-gene-symbol', wrap([]));
    expect(reason).toContain('proves nothing');
  });

  it('allows an empty reference when the case asserts emptiness', () => {
    expect(vacuousReason('gf/empty-result', wrap([]), true)).toBeNull();
  });

  it('does not flag a case that returned rows', () => {
    expect(vacuousReason('gf/by-trait', wrap([{id: 1}]))).toBeNull();
  });
});
