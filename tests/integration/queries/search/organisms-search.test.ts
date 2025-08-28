import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {ORGANISMS_SEARCH_QUERY} from '../../../__helpers__/mock-data.js';
import {
  createSearchTestSuite,
  ORGANISM_VALIDATION_CONFIG,
  executeBasicSearchTest,
  executeMultiCriteriaSearchTest,
} from '../../../__helpers__/search-test-utilities.js';
import {
  validateOrganismData,
  RELAXED_BIOLOGICAL_CONSTRAINTS,
} from '../../../__helpers__/entity-validation-helpers.js';

describe('Organisms Search Integration', () => {
  // Create reusable search test suite
  const searchTestSuite = createSearchTestSuite(
    'organisms',
    ORGANISMS_SEARCH_QUERY,
    'name',
    'Arabidopsis',
    ORGANISM_VALIDATION_CONFIG,
  );

  test('Organism Search - Tests Taxonomic Discovery', async () => {
    // Purpose: Validates organism search functionality with pagination
    // Biological context: Organism search by taxonomic or common name for species identification
    // GraphQL feature: Search query with pagination and filtering

    await searchTestSuite.basicSearchTest();
  });

  test('searches organisms by genus', async () => {
    const response = await executeBasicSearchTest({
      entityName: 'organisms',
      query: ORGANISMS_SEARCH_QUERY,
      searchParam: 'genus',
      searchValue: 'Arabidopsis',
      pageSize: 5,
    });

    // Validate genus filtering if results are present
    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.organisms
    ) {
      const data = response.body.singleResult.data;
      expect(data.organisms.results).toBeDefined();

      // All results should have genus matching the search
      data.organisms.results.forEach((organism: any) => {
        expect(organism.genus).toContain('Arabidopsis');
      });
    }
  });

  test('handles empty organism search results', async () => {
    await searchTestSuite.emptyResultsTest();
  });

  test('searches organisms with multiple criteria', async () => {
    const multiCriteriaQuery = `
      query SearchOrganismsMultiple(
        $taxonId: Int,
        $name: String,
        $genus: String,
        $species: String,
        $page: Int,
        $pageSize: Int
      ) {
        organisms(
          taxonId: $taxonId,
          name: $name,
          genus: $genus,
          species: $species,
          page: $page,
          pageSize: $pageSize
        ) {
          results {
            taxonId
            name
            genus
            species
            abbreviation
          }
          pageInfo {
            currentPage
            pageSize
            numResults
          }
        }
      }
    `;

    const response = await executeMultiCriteriaSearchTest(
      {
        entityName: 'organisms',
        query: multiCriteriaQuery,
        searchParam: 'name',
        searchValue: '',
        pageSize: 3,
      },
      {
        genus: 'Arabidopsis',
        species: 'thaliana',
      },
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.organisms
    ) {
      const data = response.body.singleResult.data;
      expect(data.organisms.results).toBeDefined();
      expect(data.organisms.pageInfo.pageSize).toBe(3);
    }
  });

  test('validates organism search result structure', async () => {
    const response = await executeBasicSearchTest({
      entityName: 'organisms',
      query: ORGANISMS_SEARCH_QUERY,
      searchParam: 'name',
      searchValue: 'thaliana',
      pageSize: 5,
    });

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const organisms = response.body.singleResult.data.organisms.results;

      organisms.forEach((organism: any) => {
        validateOrganismData(organism, RELAXED_BIOLOGICAL_CONSTRAINTS);
      });
    }
  });

  test('handles taxonId search parameter', async () => {
    const taxonIdQuery = `
      query SearchOrganismsByTaxonId($taxonId: Int) {
        organisms(taxonId: $taxonId) {
          results {
            taxonId
            name
            genus
            species
          }
        }
      }
    `;

    const response = await executeBasicSearchTest({
      entityName: 'organisms',
      query: taxonIdQuery,
      searchParam: 'taxonId',
      searchValue: 3702,
    });

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.organisms
    ) {
      const data = response.body.singleResult.data;
      expect(data.organisms.results).toBeDefined();
    }
  });

  test('validates organism search pagination', async () => {
    await searchTestSuite.paginationTest();
  });
});
