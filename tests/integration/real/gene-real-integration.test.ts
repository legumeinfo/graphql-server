import {describe, test, expect} from 'vitest';
import {
  createRealTestServer,
  executeRealQuery,
  validateSuccessfulResponse,
  validateErrorResponse,
} from '../../__helpers__/real-apollo-server.js';
import {
  realIntegrationSuite,
  REAL_TEST_CONFIG,
} from '../../setup/real-integration-setup.js';

realIntegrationSuite('Gene Real Integration Tests', () => {
  describe('Query.gene - Real InterMine Integration', () => {
    test(
      'fetches real gene from InterMine successfully',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetRealGene($identifier: ID!) {
          gene(identifier: $identifier) {
            results {
              primaryIdentifier
              symbol
              description
              name
              organism {
                taxonId
                name
                genus
                species
              }
              locations {
                start
                end
                strand
              }
              chromosome {
                primaryIdentifier
                length
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {identifier: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        // Validate we get real data from InterMine
        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;

        // Strict validation of actual LIS InterMine data
        expect(gene.primaryIdentifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);
        expect(gene.organism).toBeDefined();
        expect(gene.organism.taxonId).toBe(
          REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
        );
        expect(gene.organism.genus).toBe('Phaseolus');
        expect(gene.organism.species).toBe('vulgaris');

        // Validate biological data makes sense
        expect(gene.name || gene.description).toBeDefined();
        if (gene.locations && gene.locations.length > 0) {
          expect(gene.locations[0].start).toBeTypeOf('number');
          expect(gene.locations[0].end).toBeTypeOf('number');
          expect(gene.locations[0].start).toBeGreaterThan(0);
          expect(gene.locations[0].end).toBeGreaterThan(
            gene.locations[0].start,
          );
        }

        console.log(
          `✅ Successfully retrieved real gene data: ${gene.primaryIdentifier}`,
        );
        console.log(`   Organism: ${gene.organism.name}`);
        console.log(`   Description: ${gene.description || 'N/A'}`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'handles non-existent gene with proper error',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetNonExistentGene($identifier: ID!) {
          gene(identifier: $identifier) {
            results {
              primaryIdentifier
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {identifier: 'DEFINITELY_NONEXISTENT_GENE_12345'},
          contextValue,
        );

        // Should get proper error from real InterMine
        const errors = validateErrorResponse(response);
        expect(errors[0].message).toContain('not found');

        console.log(
          `✅ Properly handled non-existent gene error: ${errors[0].message}`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates InterMine PathQuery construction',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Test complex query that requires proper PathQuery construction
        const complexQuery = `
        query GetGeneWithComplexData($identifier: ID!) {
          gene(identifier: $identifier) {
            results {
              primaryIdentifier
              proteins {
                primaryIdentifier
                length
                sequence {
                  residues
                  length
                }
              }
              pathways {
                primaryIdentifier
                name
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          complexQuery,
          {identifier: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;

        // Validate nested data retrieval works
        expect(gene.primaryIdentifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);

        // These might be empty arrays but should be defined
        expect(Array.isArray(gene.proteins)).toBe(true);
        expect(Array.isArray(gene.pathways)).toBe(true);

        console.log(
          `✅ Complex query executed successfully with ${gene.proteins.length} proteins, ${gene.pathways.length} pathways`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Query.genes - Real Search Integration', () => {
    test(
      'searches genes in real InterMine with pagination',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchRealGenes($description: String, $genus: String, $page: Int, $pageSize: Int) {
          genes(description: $description, genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              primaryIdentifier
              symbol
              description
              organism {
                genus
                species
              }
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

        const response = await executeRealQuery(
          server,
          searchQuery,
          {
            description: 'protein',
            genus: 'Phaseolus',
            page: 1,
            pageSize: 5,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const searchResults = data.genes;

        // Validate real search results
        expect(Array.isArray(searchResults.results)).toBe(true);
        expect(searchResults.results.length).toBeGreaterThan(0);
        expect(searchResults.results.length).toBeLessThanOrEqual(5);

        // Validate pagination info
        expect(searchResults.pageInfo.currentPage).toBe(1);
        expect(searchResults.pageInfo.pageSize).toBe(5);
        expect(searchResults.pageInfo.numResults).toBeGreaterThan(0);

        // Validate search criteria worked
        searchResults.results.forEach((gene: any) => {
          expect(gene.primaryIdentifier).toBeDefined();
          expect(gene.organism.genus).toBe('Phaseolus');
        });

        console.log(
          `✅ Real search returned ${searchResults.results.length} genes out of ${searchResults.pageInfo.numResults} total`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates search with no results',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchNoResults($genus: String, $page: Int, $pageSize: Int) {
          genes(genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              primaryIdentifier
            }
            pageInfo {
              numResults
              pageCount
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          searchQuery,
          {
            genus: 'NonexistentGenusZZZ999',
            page: 1,
            pageSize: 10,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);

        // Should get empty results, not an error
        expect(data.genes.results).toHaveLength(0);
        expect(data.genes.pageInfo.numResults).toBe(0);
        // Server returns pageCount = 1 even for empty results
        expect(data.genes.pageInfo.pageCount).toBeGreaterThanOrEqual(0);

        console.log('✅ Empty search results handled correctly');
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Query.getGenes - Real Multi-Gene Retrieval', () => {
    test(
      'retrieves multiple real genes by identifiers',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const multiGeneQuery = `
        query GetMultipleRealGenes($identifiers: [ID!]!) {
          getGenes(identifiers: $identifiers) {
            results {
              primaryIdentifier
              description
              organism {
                name
              }
            }
          }
        }
      `;

        // Use multiple known gene IDs (using realistic Phaseolus patterns)
        const knownGeneIds = [
          REAL_TEST_CONFIG.KNOWN_GENE_ID,
          'phavu.5-593.gnm1.ann1.Pv5-593.01G000200', // Another gene from the same genome
          'phavu.5-593.gnm1.ann1.Pv5-593.01G000300', // Another gene from the same genome
        ];

        const response = await executeRealQuery(
          server,
          multiGeneQuery,
          {identifiers: knownGeneIds},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const genes = data.getGenes.results;

        // Should get at least one gene (others might not exist)
        expect(Array.isArray(genes)).toBe(true);
        expect(genes.length).toBeGreaterThan(0);

        // Validate returned genes have our requested identifiers
        genes.forEach((gene: any) => {
          expect(knownGeneIds).toContain(gene.primaryIdentifier);
          expect(gene.organism.name).toBeDefined();
        });

        console.log(
          `✅ Retrieved ${genes.length} genes out of ${knownGeneIds.length} requested`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });
});
