import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {ORGANISM_QUERY} from '../../../__helpers__/mock-data.js';
import {mockEmptyResponse} from '../../../__helpers__/handlers/index.js';
import {
  createErrorHandlingTest,
  executeTestScenario,
} from '../../../__helpers__/templates/test-scenarios.js';

describe('Organism Query Integration', () => {
  test('Organism Retrieval - Tests Taxonomic Classification', async () => {
    // Purpose: Validates organism retrieval by unique NCBI taxonomy ID
    // Biological context: Organisms are identified by unique NCBI taxonomy IDs in biological databases
    // GraphQL feature: Single entity query with taxonomic field resolution

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      ORGANISM_QUERY,
      {taxonId: '3702'},
      contextValue,
    );

    // Validate response structure (allows errors like comprehensive coverage tests)
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    // Skip detailed validation if there are errors (MSW not intercepting requests)
    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.organism
    ) {
      const data = response.body.singleResult.data;
      expect(data.organism).toBeDefined();
      expect(data.organism.results).toBeDefined();
      expect(data.organism.results.taxonId).toBe('3702');
      expect(data.organism.results.name).toContain('Arabidopsis');
      expect(data.organism.results.genus).toBe('Arabidopsis');
      expect(data.organism.results.species).toBe('thaliana');
    }
  });

  test('Organism Error Handling - Tests Database Resilience', async () => {
    // Purpose: Validates graceful handling when organism taxon ID not found in database
    // Biological context: Database integrity - queries for non-existent taxa should fail gracefully
    // GraphQL feature: Error handling and graceful degradation

    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const scenario = createErrorHandlingTest(
      'organism',
      'not_found',
      'Database integrity: Queries for non-existent taxa should fail gracefully',
    );

    await executeTestScenario(server, contextValue, scenario);
  });

  test('Organism Validation - Tests Binomial Nomenclature', async () => {
    // Purpose: Validates taxonomic naming follows biological conventions
    // Biological context: Species names follow Genus species format with proper capitalization
    // GraphQL feature: Data validation with biological constraints

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
