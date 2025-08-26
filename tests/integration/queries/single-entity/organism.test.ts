import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {ORGANISM_QUERY} from '../../../__helpers__/mock-data.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

describe('Organism Query Integration', () => {
  test('fetches organism by taxonId successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      ORGANISM_QUERY,
      {taxonId: '3702'},
      contextValue,
    );

    // Validate successful response
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.organism).toBeDefined();
    expect(data.organism.results).toBeDefined();
    expect(data.organism.results.taxonId).toBe('3702');
    expect(data.organism.results.name).toContain('Arabidopsis');
    expect(data.organism.results.genus).toBe('Arabidopsis');
    expect(data.organism.results.species).toBe('thaliana');
  });

  test('handles non-existent organism gracefully', async () => {
    // Mock empty response for non-existent organism
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      ORGANISM_QUERY,
      {taxonId: '99999'},
      contextValue,
    );

    // Should get an error when organism is not found
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].message).toContain('not found');
  });

  test('validates organism data structure', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      ORGANISM_QUERY,
      {taxonId: '3702'},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const organism = response.body.singleResult.data.organism.results;

      // Validate required fields are present
      expect(organism.taxonId).toBeDefined();
      expect(organism.name).toBeDefined();
      expect(organism.genus).toBeDefined();
      expect(organism.species).toBeDefined();
      expect(organism.abbreviation).toBeDefined();

      // Validate data types
      expect(typeof organism.taxonId).toBe('string');
      expect(typeof organism.name).toBe('string');
      expect(typeof organism.genus).toBe('string');
      expect(typeof organism.species).toBe('string');
    }
  });
});
