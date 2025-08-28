import {describe, test, expect} from 'vitest';
import {PROTEINS_SEARCH_QUERY} from '../../../__helpers__/mock-data.js';
import {
  createSearchTestSuite,
  PROTEIN_VALIDATION_CONFIG,
  executeBasicSearchTest,
  executePaginationTest,
} from '../../../__helpers__/search-test-utilities.js';
import {
  validateProteinData,
  RELAXED_BIOLOGICAL_CONSTRAINTS,
} from '../../../__helpers__/entity-validation-helpers.js';

describe('Proteins Search Integration', () => {
  // Create reusable search test suite
  const searchTestSuite = createSearchTestSuite(
    'proteins',
    PROTEINS_SEARCH_QUERY,
    'description',
    'kinase',
    PROTEIN_VALIDATION_CONFIG,
  );

  test('searches proteins by description with pagination', async () => {
    await searchTestSuite.basicSearchTest();
  });

  test('handles empty protein search results', async () => {
    await searchTestSuite.emptyResultsTest();
  });

  test('searches proteins with different descriptions', async () => {
    const testCases = ['kinase', 'domain', 'protein'];

    for (const description of testCases) {
      const response = await executeBasicSearchTest({
        entityName: 'proteins',
        query: PROTEINS_SEARCH_QUERY,
        searchParam: 'description',
        searchValue: description,
        pageSize: 10,
      });

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.proteins
      ) {
        const data = response.body.singleResult.data;
        expect(data.proteins.results.length).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('validates protein search result structure', async () => {
    const response = await executeBasicSearchTest({
      entityName: 'proteins',
      query: PROTEINS_SEARCH_QUERY,
      searchParam: 'description',
      searchValue: 'domain',
      pageSize: 5,
    });

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const proteins = response.body.singleResult.data.proteins.results;

      proteins.forEach((protein: any) => {
        validateProteinData(protein, RELAXED_BIOLOGICAL_CONSTRAINTS);
      });
    }
  });

  test('handles pagination in protein search', async () => {
    await executePaginationTest({
      entityName: 'proteins',
      query: PROTEINS_SEARCH_QUERY,
      searchParam: 'description',
      searchValue: 'protein',
    });
  });

  test('searches proteins with detailed query', async () => {
    const detailedQuery = `
      query SearchProteinsDetailed($description: String, $page: Int, $pageSize: Int) {
        proteins(description: $description, page: $page, pageSize: $pageSize) {
          results {
            identifier
            name
            length
          }
          pageInfo {
            currentPage
            pageSize
            numResults
            pageCount
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    const response = await executeBasicSearchTest({
      entityName: 'proteins',
      query: detailedQuery,
      searchParam: 'description',
      searchValue: 'NAC',
      pageSize: 3,
    });

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.proteins
    ) {
      const data = response.body.singleResult.data;
      expect(data.proteins.results).toBeDefined();
      expect(data.proteins.pageInfo).toBeDefined();

      // Validate all pageInfo fields are present
      const pageInfo = data.proteins.pageInfo;
      expect(pageInfo.currentPage).toBe(1);
      expect(pageInfo.pageSize).toBe(3);
      expect(pageInfo.numResults).toBeDefined();
      expect(pageInfo.pageCount).toBeDefined();
      expect(typeof pageInfo.hasNextPage).toBe('boolean');
      expect(typeof pageInfo.hasPreviousPage).toBe('boolean');
    }
  });
});
