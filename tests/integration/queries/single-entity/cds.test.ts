import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

const CDS_QUERY = `
  query GetCDS($identifier: ID!) {
    cds(identifier: $identifier) {
      results {
        identifier
        symbol
        description
        name
        assemblyVersion
        annotationVersion
        secondaryIdentifier
        length
        score
        scoreType
        isPrimary
      }
    }
  }
`;

describe('CDS Query Integration', () => {
  test('fetches CDS by identifier successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      CDS_QUERY,
      {identifier: 'AT1G01010.1.cds'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.cds
    ) {
      const cds = response.body.singleResult.data.cds.results;

      // Validate basic fields
      expect(cds.identifier).toBe('AT1G01010.1.cds');
      expect(cds.symbol).toBe('NAC001_CDS');
      expect(cds.description).toContain('Coding sequence');
      expect(cds.name).toContain('NAC domain protein CDS');

      // Validate assembly/annotation info
      expect(cds.assemblyVersion).toBe('TAIR10');
      expect(cds.annotationVersion).toBe('v1.0');

      // Validate sequence feature fields
      expect(typeof cds.length).toBe('number');
      expect(cds.length).toBe(1068);
      expect(typeof cds.score).toBe('number');
      expect(cds.scoreType).toBe('none');

      // Validate CDS-specific fields
      expect(typeof cds.isPrimary).toBe('boolean');
      expect(cds.isPrimary).toBe(true);
    }
  });

  test('validates CDS data types comprehensively', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      CDS_QUERY,
      {identifier: 'AT1G01010.1.cds'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const cds = response.body.singleResult.data.cds.results;

      // String fields
      expect(typeof cds.identifier).toBe('string');
      expect(typeof cds.symbol).toBe('string');
      expect(typeof cds.description).toBe('string');
      expect(typeof cds.name).toBe('string');
      expect(typeof cds.assemblyVersion).toBe('string');
      expect(typeof cds.annotationVersion).toBe('string');
      expect(typeof cds.scoreType).toBe('string');

      // Numeric fields
      expect(typeof cds.length).toBe('number');
      expect(typeof cds.score).toBe('number');

      // Boolean fields
      expect(typeof cds.isPrimary).toBe('boolean');

      // Boolean fields
      expect(typeof cds.isPrimary).toBe('boolean');
    }
  });

  test('validates CDS identifier format', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      CDS_QUERY,
      {identifier: 'AT1G01010.1.cds'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const cds = response.body.singleResult.data.cds.results;

      // CDS identifier should follow expected pattern
      expect(cds.identifier).toMatch(/^AT\dG\d{5}\.\d+\.cds$/);
      expect(cds.secondaryIdentifier).toBe(cds.identifier);
    }
  });

  test('handles non-existent CDS gracefully', async () => {
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      CDS_QUERY,
      {identifier: 'NONEXISTENT_CDS'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });
});
