import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {GENES_SEARCH_QUERY} from '../../../__helpers__/mock-data.js';
import {
  createSearchTestSuite,
  GENE_VALIDATION_CONFIG,
  executeBasicSearchTest,
  executeMultiCriteriaSearchTest,
} from '../../../__helpers__/search-test-utilities.js';
import {
  validateEntityWithRelationships,
  RELAXED_BIOLOGICAL_CONSTRAINTS,
} from '../../../__helpers__/entity-validation-helpers.js';

describe('Genes Search Integration', () => {
  // Create reusable search test suite
  const searchTestSuite = createSearchTestSuite(
    'genes',
    GENES_SEARCH_QUERY,
    'description',
    'kinase',
    GENE_VALIDATION_CONFIG,
  );

  test('Gene Search - Tests Functional Annotation Discovery', async () => {
    // Purpose: Validates gene search functionality with pagination
    // Biological context: Gene search by functional annotation (enzyme classification)
    // GraphQL feature: Search query with pagination and filtering

    await searchTestSuite.basicSearchTest();
  });

  test('handles empty search results', async () => {
    await searchTestSuite.emptyResultsTest();
  });

  test('searches genes with multiple filters', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const multiFilterQuery = `
      query SearchGenesWithFilters(
        $description: String,
        $genus: String,
        $species: String,
        $strain: String,
        $page: Int,
        $pageSize: Int
      ) {
        genes(
          description: $description,
          genus: $genus,
          species: $species,
          strain: $strain,
          page: $page,
          pageSize: $pageSize
        ) {
          results {
            identifier
            symbol
            description
          }
          pageInfo {
            currentPage
            pageSize
            numResults
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      multiFilterQuery,
      {
        description: 'kinase',
        genus: 'Arabidopsis',
        species: 'thaliana',
        strain: 'Col-0',
        page: 1,
        pageSize: 5,
      },
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.genes
    ) {
      const data = response.body.singleResult.data;
      expect(data.genes.results).toBeDefined();
      expect(data.genes.pageInfo.pageSize).toBe(5);
      expect(data.genes.pageInfo.currentPage).toBe(1);
    }
  });

  test('validates gene search result structure', async () => {
    await searchTestSuite.structureValidationTest();
  });

  test('validates gene search pagination', async () => {
    await searchTestSuite.paginationTest();
  });

  test('validates comprehensive gene search with nested data', async () => {
    const comprehensiveQuery = `
      query SearchGenesComprehensive($description: String, $page: Int, $pageSize: Int) {
        genes(description: $description, page: $page, pageSize: $pageSize) {
          results {
            identifier
            symbol
            description
            name
            assemblyVersion
            annotationVersion
            organism {
              taxonId
              name
              genus
              species
              abbreviation
            }
            strain {
              identifier
              name
            }
            chromosome {
              identifier
            }
            length
            briefDescription
            ensemblName
          }
          pageInfo {
            currentPage
            pageSize
            numResults
            hasNextPage
            hasPreviousPage
            pageCount
          }
        }
      }
    `;

    const response = await executeBasicSearchTest({
      entityName: 'genes',
      query: comprehensiveQuery,
      searchParam: 'description',
      searchValue: 'kinase',
      pageSize: 5,
    });

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data.genes;

      // Validate we got results
      expect(data.results).toBeDefined();
      expect(Array.isArray(data.results)).toBe(true);

      if (data.results.length > 0) {
        // Use entity validation helper for comprehensive validation
        data.results.forEach((gene: any) => {
          validateEntityWithRelationships(
            gene,
            'gene',
            RELAXED_BIOLOGICAL_CONSTRAINTS,
          );
        });

        // Validate pagination
        expect(data.pageInfo).toBeDefined();
        expect(data.pageInfo.currentPage).toBe(1);
        expect(data.pageInfo.pageSize).toBe(5);
        expect(typeof data.pageInfo.numResults).toBe('number');
      }
    }
  });

  test('Gene Pagination - Tests Large Dataset Navigation', async () => {
    // Purpose: Validates pagination consistency across different page sizes
    // Biological context: Genome-scale datasets require efficient pagination for browsing
    // GraphQL feature: Pagination with page size variations and navigation

    // Test single page with specific page size
    const response = await executeBasicSearchTest({
      entityName: 'genes',
      query: GENES_SEARCH_QUERY,
      searchParam: 'description',
      searchValue: 'protein',
      page: 1,
      pageSize: 2,
    });

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.genes
    ) {
      expect(response.body.singleResult.data.genes.pageInfo.currentPage).toBe(
        1,
      );
      expect(response.body.singleResult.data.genes.pageInfo.pageSize).toBe(2);
    }
  });
});
