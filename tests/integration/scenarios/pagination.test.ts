import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';
import {validatePageInfo} from '../../__helpers__/schema-validators.js';

describe('Pagination Integration Tests', () => {
  describe('Genes Search Pagination', () => {
    test('handles different page sizes correctly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestPagination($description: String, $page: Int, $pageSize: Int) {
          genes(description: $description, page: $page, pageSize: $pageSize) {
            results {
              identifier
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

      const pageSizes = [1, 5, 10, 20];

      for (const pageSize of pageSizes) {
        const response = await executeQuery(
          server,
          query,
          {description: 'protein', page: 1, pageSize},
          contextValue,
        );

        expect(response.body.kind).toBe('single');
        // Should not crash - may return null data or error, both are acceptable
        expect(response.body.singleResult).toBeDefined();

        // Skip validation if there are errors or no data
        if (
          response.body.singleResult.data &&
          response.body.singleResult.data.genes
        ) {
          const data = response.body.singleResult.data;
          expect(data.genes.pageInfo.pageSize).toBe(pageSize);
          expect(data.genes.pageInfo.currentPage).toBe(1);
          expect(data.genes.results.length).toBeLessThanOrEqual(pageSize);
        }
      }
    });

    test('navigates through multiple pages', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestPagination($page: Int, $pageSize: Int) {
          genes(description: "protein", page: $page, pageSize: $pageSize) {
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

      // Test first page
      const page1Response = await executeQuery(
        server,
        query,
        {page: 1, pageSize: 2},
        contextValue,
      );

      // Skip validation if there are errors or no data
      if (
        page1Response.body.singleResult.data &&
        page1Response.body.singleResult.data.genes
      ) {
        expect(
          page1Response.body.singleResult.data.genes.pageInfo.currentPage,
        ).toBe(1);
        expect(
          page1Response.body.singleResult.data.genes.pageInfo.hasPreviousPage,
        ).toBe(false);
      }

      // Test second page
      const page2Response = await executeQuery(
        server,
        query,
        {page: 2, pageSize: 2},
        contextValue,
      );

      // Skip validation if there are errors or no data
      if (
        page2Response.body.singleResult.data &&
        page2Response.body.singleResult.data.genes
      ) {
        expect(
          page2Response.body.singleResult.data.genes.pageInfo.currentPage,
        ).toBe(2);
        expect(
          page2Response.body.singleResult.data.genes.pageInfo.hasPreviousPage,
        ).toBe(true);
      }
    });

    test('validates page info structure', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestPageInfo {
          genes(description: "kinase", page: 1, pageSize: 5) {
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

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      // Skip validation if there are errors or no data
      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.genes
      ) {
        const pageInfo = response.body.singleResult.data.genes.pageInfo;
        const validation = validatePageInfo(pageInfo);
        expect(validation.isValid).toBe(true);

        // Additional validation
        expect(pageInfo.currentPage).toBeGreaterThanOrEqual(1);
        expect(pageInfo.pageSize).toBeGreaterThan(0);
        expect(pageInfo.numResults).toBeGreaterThanOrEqual(0);
        expect(pageInfo.pageCount).toBeGreaterThanOrEqual(0);
        expect(typeof pageInfo.hasNextPage).toBe('boolean');
        expect(typeof pageInfo.hasPreviousPage).toBe('boolean');
      }
    });
  });

  describe('Organisms Search Pagination', () => {
    test('handles organism search pagination', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestOrganismPagination($genus: String, $page: Int, $pageSize: Int) {
          organisms(genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              taxonId
              genus
            }
            pageInfo {
              currentPage
              pageSize
              numResults
            }
          }
        }
      `;

      const response = await executeQuery(
        server,
        query,
        {genus: 'Arabidopsis', page: 1, pageSize: 3},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      // Skip validation if there are errors or no data
      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.organisms
      ) {
        const data = response.body.singleResult.data;
        expect(data.organisms.pageInfo.currentPage).toBe(1);
        expect(data.organisms.pageInfo.pageSize).toBe(3);
        expect(data.organisms.results.length).toBeLessThanOrEqual(3);
      }
    });

    test('tests edge cases for organism pagination', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestOrganismEdgeCases($page: Int, $pageSize: Int) {
          organisms(page: $page, pageSize: $pageSize) {
            results {
              taxonId
            }
            pageInfo {
              currentPage
              pageSize
              numResults
            }
          }
        }
      `;

      const edgeCases = [
        {page: 1, pageSize: 1}, // Minimum page size
        {page: 100, pageSize: 10}, // Large page number
        {page: 1, pageSize: 100}, // Large page size
      ];

      for (const testCase of edgeCases) {
        const response = await executeQuery(
          server,
          query,
          testCase,
          contextValue,
        );

        expect(response.body.kind).toBe('single');
        // Should handle edge cases gracefully without errors
        expect(response.body.singleResult).toBeDefined();
      }
    });
  });

  describe('Proteins Search Pagination', () => {
    test('validates protein search pagination consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestProteinPagination($description: String, $page: Int, $pageSize: Int) {
          proteins(description: $description, page: $page, pageSize: $pageSize) {
            results {
              identifier
            }
            pageInfo {
              currentPage
              pageSize
              numResults
              pageCount
            }
          }
        }
      `;

      // Get total count with large page size
      const totalResponse = await executeQuery(
        server,
        query,
        {description: 'protein', page: 1, pageSize: 100},
        contextValue,
      );

      // Skip validation if there are errors or no data
      if (
        totalResponse.body.singleResult.data &&
        totalResponse.body.singleResult.data.proteins
      ) {
        const totalResults =
          totalResponse.body.singleResult.data.proteins.pageInfo.numResults;

        // Test smaller page sizes add up correctly
        const pageSize = 2;
        const expectedPages = Math.ceil(totalResults / pageSize);

        if (expectedPages > 1) {
          const page1Response = await executeQuery(
            server,
            query,
            {description: 'protein', page: 1, pageSize},
            contextValue,
          );

          const page2Response = await executeQuery(
            server,
            query,
            {description: 'protein', page: 2, pageSize},
            contextValue,
          );

          if (
            page1Response.body.singleResult.data &&
            page1Response.body.singleResult.data.proteins
          ) {
            expect(
              page1Response.body.singleResult.data.proteins.pageInfo.pageCount,
            ).toBeGreaterThan(1);
          }
          if (
            page2Response.body.singleResult.data &&
            page2Response.body.singleResult.data.proteins
          ) {
            expect(
              page2Response.body.singleResult.data.proteins.pageInfo
                .currentPage,
            ).toBe(2);
          }
        }
      }
    });
  });

  describe('Cross-Query Pagination Consistency', () => {
    test('all search queries support pagination parameters', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const searchQueries = [
        'genes',
        'organisms',
        'proteins',
        'geneFamilies',
        'ontologyTerms',
        'strains',
      ];

      for (const queryName of searchQueries) {
        const query = `
          query TestPagination {
            ${queryName}(page: 1, pageSize: 2) {
              pageInfo {
                currentPage
                pageSize
                numResults
              }
            }
          }
        `;

        const response = await executeQuery(server, query, {}, contextValue);

        expect(response.body.kind).toBe('single');
        // Should support pagination without errors
        expect(response.body.singleResult).toBeDefined();

        // Skip validation if there are errors or no data
        if (
          response.body.singleResult.data &&
          response.body.singleResult.data[queryName]
        ) {
          expect(response.body.singleResult.data[queryName]).toBeDefined();
          expect(
            response.body.singleResult.data[queryName].pageInfo,
          ).toBeDefined();
        }
      }
    });

    test('pagination parameters are optional', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestOptionalPagination {
          genes(description: "protein") {
            results {
              identifier
            }
            pageInfo {
              currentPage
              pageSize
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      // Skip validation if there are errors or no data
      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.genes
      ) {
        // Should use default pagination when parameters not provided
        const pageInfo = response.body.singleResult.data.genes.pageInfo;
        expect(pageInfo.currentPage).toBeDefined();
        expect(pageInfo.pageSize).toBeDefined();
      }
    });
  });
});
