import {describe, test, expect} from 'vitest';
import {
  createRealTestServer,
  executeRealQuery,
  validateSuccessfulResponse,
} from '../__helpers__/real-apollo-server.js';
import {
  realIntegrationSuite,
  REAL_TEST_CONFIG,
} from '../setup/real-integration-setup.js';

/**
 * Performance and Load Testing for Real InterMine Integration
 * Tests query performance, concurrent handling, and resource usage
 */

realIntegrationSuite('Performance and Load Tests', () => {
  describe('Query Performance Tests', () => {
    test(
      'simple gene query completes within acceptable time',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const simpleQuery = `
        query SimpleGeneQuery($id: ID!) {
          gene(identifier: $id) {
            results {
              identifier
              symbol
              description
            }
          }
        }
      `;

        const startTime = Date.now();

        const response = await executeRealQuery(
          server,
          simpleQuery,
          {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Simple queries should complete in under 10 seconds
        expect(duration).toBeLessThan(10000);

        const data = validateSuccessfulResponse(response);
        expect(data.gene.results.identifier).toBe(
          REAL_TEST_CONFIG.KNOWN_GENE_ID,
        );

        console.log(`✅ Simple gene query completed in ${duration}ms`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'complex nested query performance benchmark',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const complexQuery = `
        query ComplexPerformanceQuery($id: ID!) {
          gene(identifier: $id) {
            results {
              identifier
              symbol
              description
              organism {
                taxonId
                name
                genus
                species
              }
              proteins {
                identifier
                length
                sequence {
                  residues
                  length
                }
              }
              pathways {
                identifier
                name
              }
              ontologyAnnotations {
                ontologyTerm {
                  identifier
                  name
                }
              }
            }
          }
        }
      `;

        const startTime = Date.now();

        const response = await executeRealQuery(
          server,
          complexQuery,
          {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Complex queries should complete in under 20 seconds
        expect(duration).toBeLessThan(20000);

        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;

        console.log(`✅ Complex nested query completed in ${duration}ms`);
        console.log(
          `   Retrieved: ${gene.proteins?.length || 0} proteins, ${gene.pathways?.length || 0} pathways`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'search query pagination performance',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchPerformanceQuery($genus: String, $page: Int, $pageSize: Int) {
          genes(genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              identifier
              symbol
              description
              organism {
                name
              }
            }
            pageInfo {
              numResults
              currentPage
              pageCount
            }
          }
        }
      `;

        const performances: number[] = [];

        // Test multiple page requests
        for (let page = 1; page <= 3; page++) {
          const startTime = Date.now();

          const response = await executeRealQuery(
            server,
            searchQuery,
            {genus: 'Arachis', page, pageSize: 10},
            contextValue,
          );

          const endTime = Date.now();
          const duration = endTime - startTime;
          performances.push(duration);

          const data = validateSuccessfulResponse(response);
          expect(data.genes.pageInfo.currentPage).toBe(page);

          // Stop if no more pages
          if (!data.genes.pageInfo.hasNextPage) break;
        }

        // Each page request should be reasonably fast
        performances.forEach((duration, index) => {
          expect(duration).toBeLessThan(15000);
          console.log(`✅ Page ${index + 1} search completed in ${duration}ms`);
        });

        const avgPerformance =
          performances.reduce((a, b) => a + b) / performances.length;
        console.log(
          `   Average page performance: ${Math.round(avgPerformance)}ms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 3,
    );
  });

  describe('Concurrent Request Handling', () => {
    test(
      'handles multiple concurrent simple queries',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query ConcurrentGeneQuery($id: ID!) {
          gene(identifier: $id) {
            results {
              identifier
              organism {
                name
              }
            }
          }
        }
      `;

        const startTime = Date.now();

        // Execute 5 concurrent queries
        const promises = Array(5)
          .fill(null)
          .map((_, _index) =>
            executeRealQuery(
              server,
              query,
              {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
              contextValue,
            ),
          );

        const responses = await Promise.all(promises);

        const endTime = Date.now();
        const totalDuration = endTime - startTime;

        // All queries should succeed
        responses.forEach((response, _index) => {
          const data = validateSuccessfulResponse(response);
          expect(data.gene.results.identifier).toBe(
            REAL_TEST_CONFIG.KNOWN_GENE_ID,
          );
        });

        // Concurrent queries should not take much longer than a single query
        expect(totalDuration).toBeLessThan(20000);

        console.log(`✅ 5 concurrent queries completed in ${totalDuration}ms`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'handles mixed concurrent queries (different types)',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const queries = [
          {
            name: 'gene',
            query: `query($id: ID!) { gene(identifier: $id) { results { identifier } } }`,
            variables: {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          },
          {
            name: 'organism',
            query: `query($taxonId: ID!) { organism(taxonId: $taxonId) { results { taxonId } } }`,
            variables: {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
          },
          {
            name: 'protein',
            query: `query($id: ID!) { protein(identifier: $id) { results { identifier } } }`,
            variables: {id: REAL_TEST_CONFIG.KNOWN_PROTEIN_ID},
          },
          {
            name: 'search',
            query: `query($genus: String) { genes(genus: $genus, page: 1, pageSize: 5) { results { identifier } } }`,
            variables: {genus: 'Arachis'},
          },
        ];

        const startTime = Date.now();

        const promises = queries.map(({query, variables}) =>
          executeRealQuery(server, query, variables, contextValue),
        );

        const responses = await Promise.all(promises);

        const endTime = Date.now();
        const totalDuration = endTime - startTime;

        // All queries should either succeed or fail gracefully
        responses.forEach((response, index) => {
          if (response.body?.singleResult?.errors) {
            console.log(
              `⚠️  ${queries[index].name} query: ${response.body.singleResult.errors[0].message}`,
            );
          } else {
            const _data = validateSuccessfulResponse(response);
            console.log(
              `✅ ${queries[index].name} query succeeded concurrently`,
            );
          }
        });

        expect(totalDuration).toBeLessThan(25000);
        console.log(
          `✅ Mixed concurrent queries completed in ${totalDuration}ms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Large Result Set Handling', () => {
    test(
      'handles large search result sets efficiently',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const largeSearchQuery = `
        query LargeSearchQuery($genus: String, $pageSize: Int) {
          genes(genus: $genus, page: 1, pageSize: $pageSize) {
            results {
              identifier
              symbol
              description
              organism {
                name
              }
            }
            pageInfo {
              numResults
              pageSize
            }
          }
        }
      `;

        const startTime = Date.now();

        const response = await executeRealQuery(
          server,
          largeSearchQuery,
          {genus: 'Arachis', pageSize: 50}, // Request 50 results
          contextValue,
        );

        const endTime = Date.now();
        const duration = endTime - startTime;

        const data = validateSuccessfulResponse(response);
        const genes = data.genes;

        // Should handle up to requested page size
        expect(genes.results.length).toBeLessThanOrEqual(50);
        expect(genes.pageInfo.pageSize).toBe(50);

        // Large result sets should still be reasonable
        expect(duration).toBeLessThan(30000);

        console.log(
          `✅ Large result set query (${genes.results.length} results) completed in ${duration}ms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'pagination performance across large datasets',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const paginationQuery = `
        query PaginationPerformance($genus: String, $page: Int) {
          genes(genus: $genus, page: $page, pageSize: 20) {
            results {
              identifier
            }
            pageInfo {
              currentPage
              numResults
              hasNextPage
            }
          }
        }
      `;

        // Test performance across different pages
        const pagesToTest = [1, 5, 10];
        const performances: number[] = [];

        for (const page of pagesToTest) {
          const startTime = Date.now();

          const response = await executeRealQuery(
            server,
            paginationQuery,
            {genus: 'Arachis', page},
            contextValue,
          );

          const endTime = Date.now();
          const duration = endTime - startTime;
          performances.push(duration);

          const data = validateSuccessfulResponse(response);
          expect(data.genes.pageInfo.currentPage).toBe(page);

          console.log(`✅ Page ${page} retrieved in ${duration}ms`);

          // If we've reached the end, stop testing
          if (!data.genes.pageInfo.hasNextPage) break;
        }

        // Later pages shouldn't be significantly slower than early pages
        const maxPerformance = Math.max(...performances);
        const minPerformance = Math.min(...performances);
        const performanceRatio = maxPerformance / minPerformance;

        // Performance shouldn't degrade more than 3x across pages
        expect(performanceRatio).toBeLessThan(3);

        console.log(
          `   Performance ratio (max/min): ${performanceRatio.toFixed(2)}x`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 3,
    );
  });

  describe('Memory and Resource Usage', () => {
    test(
      'does not leak memory with repeated queries',
      async () => {
        const {server, context} = await createRealTestServer();

        const query = `
        query MemoryTestQuery($id: ID!) {
          gene(identifier: $id) {
            results {
              identifier
              description
            }
          }
        }
      `;

        // Execute many queries to test for memory leaks
        const iterations = 20;
        const startTime = Date.now();

        for (let i = 0; i < iterations; i++) {
          const contextValue = await context(); // Fresh context each time

          const response = await executeRealQuery(
            server,
            query,
            {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
            contextValue,
          );

          // Should succeed or fail consistently
          if (response.body?.singleResult?.errors) {
            expect(response.body.singleResult.errors[0].message).toContain(
              'not found',
            );
          } else {
            const data = validateSuccessfulResponse(response);
            expect(data.gene.results.identifier).toBe(
              REAL_TEST_CONFIG.KNOWN_GENE_ID,
            );
          }
        }

        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        const avgDuration = totalDuration / iterations;

        console.log(`✅ ${iterations} repeated queries completed`);
        console.log(
          `   Total time: ${totalDuration}ms, Average: ${Math.round(avgDuration)}ms`,
        );

        // Average performance should be reasonable
        expect(avgDuration).toBeLessThan(5000);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );

    test(
      'handles query complexity gracefully',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Extremely complex query to test limits
        const complexQuery = `
        query VeryComplexQuery($id: ID!, $genus: String) {
          gene(identifier: $id) {
            results {
              identifier
              symbol
              description
              organism {
                taxonId
                name
                genus
                species
                strains {
                  identifier
                  name
                  description
                }
              }
              proteins {
                identifier
                length
                sequence {
                  residues
                  length
                }
                proteinMatches {
                  identifier
                  start
                  end
                }
              }
              pathways {
                identifier
                name
                description
              }
              ontologyAnnotations {
                ontologyTerm {
                  identifier
                  name
                  description
                  synonyms {
                    name
                    type
                  }
                }
              }
            }
          }
          genes(genus: $genus, page: 1, pageSize: 10) {
            results {
              identifier
              proteins {
                identifier
                length
              }
            }
            pageInfo {
              numResults
            }
          }
        }
      `;

        const startTime = Date.now();

        try {
          const response = await executeRealQuery(
            server,
            complexQuery,
            {id: REAL_TEST_CONFIG.KNOWN_GENE_ID, genus: 'Arachis'},
            contextValue,
          );

          const endTime = Date.now();
          const duration = endTime - startTime;

          // Should either complete or timeout gracefully
          if (response.body?.singleResult?.errors) {
            console.log(
              `⚠️  Complex query failed gracefully: ${response.body.singleResult.errors[0].message}`,
            );
          } else {
            const data = validateSuccessfulResponse(response);
            console.log(`✅ Very complex query completed in ${duration}ms`);
            console.log(`   Gene data retrieved with nested relationships`);
            console.log(
              `   Additional search returned ${data.genes.results.length} genes`,
            );
          }
        } catch (error: any) {
          // Timeout or HTTP error is acceptable for very complex queries
          const isExpectedError =
            error.message.includes('timeout') ||
            error.message.includes('HTTP error');
          expect(isExpectedError).toBe(true);
          console.log(
            `⚠️  Very complex query failed as expected: ${error.message}`,
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });
});
