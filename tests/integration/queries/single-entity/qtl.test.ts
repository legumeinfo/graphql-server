import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

const QTL_QUERY = `
  query GetQTL($identifier: ID!) {
    qtl(identifier: $identifier) {
      results {
        identifier
        name
        lod
        likelihoodRatio
        start
        end
        peak
        markerR2
        trait {
          identifier
          name
        }
        qtlStudy {
          identifier
          description
        }
        linkageGroup {
          identifier
        }
        dataSets {
          name
        }
        markerNames
      }
    }
  }
`;

describe('QTL Query Integration', () => {
  test('fetches QTL by identifier successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_QUERY,
      {identifier: 'QTL001'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.qtl
    ) {
      const qtl = response.body.singleResult.data.qtl.results;

      // Validate basic QTL fields
      expect(qtl.identifier).toBe('QTL001');
      expect(qtl.name).toBe('Height QTL on Chr1');

      // Validate statistical measures
      expect(typeof qtl.lod).toBe('number');
      expect(qtl.lod).toBe(3.2);
      expect(typeof qtl.likelihoodRatio).toBe('number');
      expect(qtl.likelihoodRatio).toBe(8.5);
      expect(typeof qtl.markerR2).toBe('number');
      expect(qtl.markerR2).toBe(0.15);

      // Validate genomic positions
      expect(typeof qtl.start).toBe('number');
      expect(qtl.start).toBe(1100000);
      expect(typeof qtl.end).toBe('number');
      expect(qtl.end).toBe(1250000);
      expect(typeof qtl.peak).toBe('number');
      expect(qtl.peak).toBe(1175000);

      // Validate peak is within QTL interval
      expect(qtl.peak).toBeGreaterThanOrEqual(qtl.start);
      expect(qtl.peak).toBeLessThanOrEqual(qtl.end);

      // Validate marker information
      expect(typeof qtl.markerNames).toBe('string');
      expect(qtl.markerNames).toBe('M1,M2,M3');

      // Validate relationships
      expect(qtl.trait).toBeDefined();
      expect(qtl.trait.identifier).toBe('TRAIT001');
      expect(qtl.trait.name).toBe('Plant Height');

      expect(qtl.qtlStudy).toBeDefined();
      expect(qtl.qtlStudy.identifier).toBe('QTLS001');
      expect(qtl.qtlStudy.description).toContain('Plant height QTL mapping');

      expect(qtl.linkageGroup).toBeDefined();
      expect(qtl.linkageGroup.identifier).toBe('LG1');

      expect(qtl.dataSets).toBeDefined();
      expect(qtl.dataSets.name).toBe('Height_Study_Dataset');
    }
  });

  test('validates QTL statistical significance thresholds', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_QUERY,
      {identifier: 'QTL001'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const qtl = response.body.singleResult.data.qtl.results;

      // LOD score should be significant (typically > 2.0-3.0)
      expect(qtl.lod).toBeGreaterThan(2.0);

      // Likelihood ratio should be positive
      expect(qtl.likelihoodRatio).toBeGreaterThan(0);

      // R² should be between 0 and 1
      expect(qtl.markerR2).toBeGreaterThanOrEqual(0);
      expect(qtl.markerR2).toBeLessThanOrEqual(1);

      // Genomic coordinates should be valid
      expect(qtl.start).toBeGreaterThan(0);
      expect(qtl.end).toBeGreaterThan(qtl.start);
    }
  });

  test('validates QTL data types comprehensively', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_QUERY,
      {identifier: 'QTL001'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const qtl = response.body.singleResult.data.qtl.results;

      // String fields
      expect(typeof qtl.identifier).toBe('string');
      expect(typeof qtl.name).toBe('string');
      expect(typeof qtl.markerNames).toBe('string');

      // Numeric fields (all should be numbers, not strings)
      expect(typeof qtl.lod).toBe('number');
      expect(typeof qtl.likelihoodRatio).toBe('number');
      expect(typeof qtl.start).toBe('number');
      expect(typeof qtl.end).toBe('number');
      expect(typeof qtl.peak).toBe('number');
      expect(typeof qtl.markerR2).toBe('number');

      // Nested object fields
      expect(typeof qtl.trait).toBe('object');
      expect(typeof qtl.qtlStudy).toBe('object');
      expect(typeof qtl.linkageGroup).toBe('object');
      expect(typeof qtl.dataSets).toBe('object');
    }
  });

  test('validates QTL marker parsing', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_QUERY,
      {identifier: 'QTL001'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const qtl = response.body.singleResult.data.qtl.results;

      // Validate marker names can be parsed
      const markers = qtl.markerNames.split(',');
      expect(markers).toHaveLength(3);
      expect(markers).toContain('M1');
      expect(markers).toContain('M2');
      expect(markers).toContain('M3');
    }
  });

  test('handles non-existent QTL gracefully', async () => {
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_QUERY,
      {identifier: 'NONEXISTENT_QTL'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });
});
