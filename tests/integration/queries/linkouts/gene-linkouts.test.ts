import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {GENE_LINKOUTS_QUERY} from '../../../__helpers__/mock-data.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

describe('Gene Linkouts Integration', () => {
  test('fetches gene linkouts successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_LINKOUTS_QUERY,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    // Validate successful response
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.geneLinkouts).toBeDefined();
    expect(data.geneLinkouts.results).toBeDefined();
    expect(Array.isArray(data.geneLinkouts.results)).toBe(true);

    if (data.geneLinkouts.results.length > 0) {
      const firstLinkout = data.geneLinkouts.results[0];
      expect(firstLinkout.identifier).toBeDefined();
      expect(firstLinkout.url).toBeDefined();
      expect(firstLinkout.text).toBeDefined();
      expect(firstLinkout.description).toBeDefined();
    }
  });

  test('handles gene with no linkouts', async () => {
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_LINKOUTS_QUERY,
      {identifier: 'GENE_WITH_NO_LINKOUTS'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.geneLinkouts.results).toHaveLength(0);
  });

  test('validates linkout data structure', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_LINKOUTS_QUERY,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const linkouts = response.body.singleResult.data.geneLinkouts.results;

      linkouts.forEach((linkout: any) => {
        // Validate each linkout has required fields
        expect(linkout.identifier).toBeDefined();
        expect(linkout.url).toBeDefined();
        expect(linkout.text).toBeDefined();
        expect(linkout.description).toBeDefined();

        // Validate data types
        expect(typeof linkout.identifier).toBe('string');
        expect(typeof linkout.url).toBe('string');
        expect(typeof linkout.text).toBe('string');
        expect(typeof linkout.description).toBe('string');

        // Validate URL format
        expect(linkout.url).toMatch(/^https?:\/\//);
      });
    }
  });

  test('tests various gene identifiers for linkouts', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const testGeneIds = [
      'AT1G01010',
      'AT1G01020',
      'Glyma.01G000100',
      'Medtr1g004960',
    ];

    for (const geneId of testGeneIds) {
      const response = await executeQuery(
        server,
        GENE_LINKOUTS_QUERY,
        {identifier: geneId},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // Should not error even if no linkouts are found
      expect(response.body.singleResult.data.geneLinkouts).toBeDefined();
      expect(
        Array.isArray(response.body.singleResult.data.geneLinkouts.results),
      ).toBe(true);
    }
  });
});
