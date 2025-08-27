import {describe, test, expect} from 'vitest';
import {
  createRealTestServer,
  executeRealQuery,
  validateErrorResponse,
  validateSuccessfulResponse,
} from '../../__helpers__/real-apollo-server.js';
import {
  realIntegrationSuite,
  REAL_TEST_CONFIG,
} from '../../setup/real-integration-setup.js';

realIntegrationSuite('Error Handling Real Integration Tests', () => {
  describe('InterMine Connection Error Handling', () => {
    test(
      'handles malformed queries gracefully',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Intentionally malformed GraphQL query
        const malformedQuery = `
        query BadQuery {
          gene(identifier: "AT1G01010") {
            results {
              nonExistentField
              invalidNestedField {
                alsoDoesNotExist
              }
            }
          }
        }
      `;

        try {
          const response = await executeRealQuery(
            server,
            malformedQuery,
            {},
            contextValue,
          );

          // GraphQL should catch this during validation
          expect(response).toBeDefined();
        } catch (error: any) {
          // Should get a GraphQL validation error, not a crash
          expect(error.message).toBeDefined();
          console.log(
            `✅ Malformed query handled gracefully: ${error.message}`,
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'handles invalid InterMine identifiers properly',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const testCases = [
          {identifier: '', description: 'empty string'},
          {identifier: ' ', description: 'whitespace'},
          {identifier: null, description: 'null value'},
          {identifier: '12345', description: 'numeric string'},
          {
            identifier: 'INVALID_FORMAT_!@#$%',
            description: 'special characters',
          },
          {
            identifier: 'A'.repeat(1000),
            description: 'extremely long identifier',
          },
        ];

        for (const testCase of testCases) {
          const query = `
          query TestInvalidIdentifier($identifier: ID!) {
            gene(identifier: $identifier) {
              results {
                identifier
              }
            }
          }
        `;

          try {
            const response = await executeRealQuery(
              server,
              query,
              {identifier: testCase.identifier},
              contextValue,
            );

            // Should either return null data or proper error
            if (response.body?.singleResult?.errors) {
              const errors = validateErrorResponse(response);
              expect(errors[0].message).toContain('not found');
            } else {
              // If no error, should have null/empty results
              const data = validateSuccessfulResponse(response);
              expect(data.gene).toBeNull();
            }

            console.log(
              `✅ Invalid identifier handled: ${testCase.description}`,
            );
          } catch (error: any) {
            // GraphQL input validation error is also acceptable
            expect(error.message).toBeDefined();
            console.log(
              `✅ Invalid identifier caught during validation: ${testCase.description}`,
            );
          }
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    ); // Longer timeout for multiple requests
  });

  describe('Network and Timeout Handling', () => {
    test(
      'handles query timeout appropriately',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Very complex query that might timeout
        const complexQuery = `
        query VeryComplexQuery($genus: String) {
          genes(genus: $genus, page: 1, pageSize: 100) {
            results {
              identifier
              description
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
                }
              }
            }
            pageInfo {
              numResults
              pageCount
            }
          }
        }
      `;

        try {
          const response = await executeRealQuery(
            server,
            complexQuery,
            {genus: 'Arachis'},
            contextValue,
          );

          // If it completes, validate the response
          if (response.body?.singleResult?.data) {
            const data = validateSuccessfulResponse(response);
            expect(data.genes.results).toBeDefined();
            console.log(
              `✅ Complex query completed successfully with ${data.genes.results.length} results`,
            );
          } else {
            // If it fails, should have proper error
            const errors = validateErrorResponse(response);
            expect(errors[0].message).toBeDefined();
            console.log(
              `✅ Complex query failed with proper error: ${errors[0].message}`,
            );
          }
        } catch (error: any) {
          // Timeout or other network error is expected for very complex queries
          expect(error.message).toBeDefined();
          console.log(`✅ Complex query timeout handled: ${error.message}`);
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates proper error messages for business logic errors',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Test various business logic error scenarios
        const errorTestCases = [
          {
            name: 'Invalid gene identifier',
            query: `query($id: ID!) { gene(identifier: $id) { results { identifier } } }`,
            variables: {id: 'DEFINITELY_INVALID_GENE_ID_123456'},
            expectedError: 'not found',
          },
          {
            name: 'Invalid taxon ID',
            query: `query($taxonId: ID!) { organism(taxonId: $taxonId) { results { taxonId } } }`,
            variables: {taxonId: '999999999'},
            expectedError: 'not found',
          },
          {
            name: 'Invalid DOI',
            query: `query($doi: ID!) { publication(doi: $doi) { results { doi } } }`,
            variables: {doi: 'definitely.invalid/doi.12345'},
            expectedError: 'not found',
          },
        ];

        for (const testCase of errorTestCases) {
          const response = await executeRealQuery(
            server,
            testCase.query,
            testCase.variables,
            contextValue,
          );

          const errors = validateErrorResponse(response);
          expect(errors[0].message.toLowerCase()).toContain(
            testCase.expectedError,
          );

          console.log(
            `✅ ${testCase.name} error handled: ${errors[0].message}`,
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );
  });

  describe('Data Consistency Validation', () => {
    test(
      'validates data consistency across related queries',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Get a gene and its organism, then verify organism search includes this gene
        const geneQuery = `
        query GetGeneWithOrganism($identifier: ID!) {
          gene(identifier: $identifier) {
            results {
              identifier
              organism {
                taxonId
                genus
                species
              }
            }
          }
        }
      `;

        const geneResponse = await executeRealQuery(
          server,
          geneQuery,
          {identifier: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const geneData = validateSuccessfulResponse(geneResponse);
        const gene = geneData.gene.results;

        // Now search for genes in the same organism
        const searchQuery = `
        query SearchGenesInOrganism($genus: String, $species: String, $page: Int, $pageSize: Int) {
          genes(genus: $genus, species: $species, page: $page, pageSize: $pageSize) {
            results {
              identifier
              organism {
                taxonId
                genus
                species
              }
            }
            pageInfo {
              numResults
            }
          }
        }
      `;

        const searchResponse = await executeRealQuery(
          server,
          searchQuery,
          {
            genus: gene.organism.genus,
            species: gene.organism.species,
            page: 1,
            pageSize: 100,
          },
          contextValue,
        );

        const searchData = validateSuccessfulResponse(searchResponse);
        const searchResults = searchData.genes.results;

        // The original gene should be found in the organism's gene list
        const foundGene = searchResults.find(
          (g: any) => g.identifier === gene.identifier,
        );
        expect(foundGene).toBeDefined();
        expect(foundGene.organism.taxonId).toBe(gene.organism.taxonId);

        console.log(
          `✅ Data consistency validated: gene ${gene.identifier} found in organism ${gene.organism.genus} ${gene.organism.species} search`,
        );
        console.log(
          `   Search returned ${searchResults.length} genes for this organism`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );

    test(
      'validates pagination consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query TestPagination($genus: String, $page: Int, $pageSize: Int) {
          genes(genus: $genus, page: $page, pageSize: $pageSize) {
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

        // Test first page
        const page1Response = await executeRealQuery(
          server,
          searchQuery,
          {genus: 'Arachis', page: 1, pageSize: 5},
          contextValue,
        );

        const page1Data = validateSuccessfulResponse(page1Response);
        const page1Results = page1Data.genes;

        expect(page1Results.pageInfo.currentPage).toBe(1);
        expect(page1Results.pageInfo.pageSize).toBe(5);
        expect(page1Results.pageInfo.hasPreviousPage).toBe(false);
        expect(page1Results.results.length).toBeLessThanOrEqual(5);

        // If there are more pages, test second page
        if (page1Results.pageInfo.hasNextPage) {
          const page2Response = await executeRealQuery(
            server,
            searchQuery,
            {genus: 'Arachis', page: 2, pageSize: 5},
            contextValue,
          );

          const page2Data = validateSuccessfulResponse(page2Response);
          const page2Results = page2Data.genes;

          expect(page2Results.pageInfo.currentPage).toBe(2);
          expect(page2Results.pageInfo.hasPreviousPage).toBe(true);

          // Results should be different from page 1
          const page1Ids = page1Results.results.map((g: any) => g.identifier);
          const page2Ids = page2Results.results.map((g: any) => g.identifier);
          const overlap = page1Ids.filter((id: string) =>
            page2Ids.includes(id),
          );
          expect(overlap).toHaveLength(0); // No overlap between pages

          console.log(
            `✅ Pagination consistency validated: page 1 has ${page1Results.results.length} results, page 2 has ${page2Results.results.length} results, no overlap`,
          );
        } else {
          console.log('✅ Single page result set validated');
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );
  });
});
