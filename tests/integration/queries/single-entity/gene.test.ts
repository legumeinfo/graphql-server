import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {GENE_QUERY} from '../../../__helpers__/mock-data.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

describe('Gene Query Integration', () => {
  test('fetches gene by identifier successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_QUERY,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    // Validate successful response
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.gene).toBeDefined();
    expect(data.gene.results).toBeDefined();
    expect(data.gene.results.identifier).toBe('AT1G01010');
    expect(data.gene.results.description).toContain('NAC domain');
  });

  test('handles non-existent gene gracefully', async () => {
    // Mock empty response for non-existent gene
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_QUERY,
      {identifier: 'NONEXISTENT_GENE'},
      contextValue,
    );

    // Should get an error when gene is not found
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].message).toContain('not found');
  });

  test('queries nested organism data', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const nestedQuery = `
      query GetGeneWithOrganism($identifier: ID!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            description
            organism {
              name
              genus
              species
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      nestedQuery,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const gene = response.body.singleResult.data.gene.results;
    expect(gene.identifier).toBe('AT1G01010');
    expect(gene.description).toContain('NAC domain');
  });
});
