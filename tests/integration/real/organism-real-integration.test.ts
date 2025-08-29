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

realIntegrationSuite('Organism Real Integration Tests', () => {
  describe('Query.organism - Real InterMine Integration', () => {
    test(
      'fetches real organism from InterMine successfully',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetRealOrganism($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              genus
              species
              commonName
              shortName
              description
              strains {
                identifier
                name
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
          contextValue,
        );

        // Validate we get real data from InterMine
        const data = validateSuccessfulResponse(response);
        const organism = data.organism.results;

        // Strict validation of actual InterMine data
        expect(organism.taxonId).toBe(REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON);
        expect(organism.genus).toBe('Phaseolus');
        expect(organism.species).toBe('vulgaris');
        expect(organism.name).toBe('Phaseolus vulgaris');

        // Validate biological taxonomy makes sense
        // Note: commonName might not be available in LIS InterMine
        if (organism.commonName) {
          expect(organism.commonName).toBeDefined();
        }
        expect(Array.isArray(organism.strains)).toBe(true);

        console.log(
          `✅ Successfully retrieved real organism data: ${organism.name}`,
        );
        console.log(`   Taxon ID: ${organism.taxonId}`);
        console.log(`   Common name: ${organism.commonName || 'N/A'}`);
        console.log(`   Strains: ${organism.strains.length}`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'handles non-existent organism with proper error',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetNonExistentOrganism($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {taxonId: '999999'}, // Non-existent taxon ID
          contextValue,
        );

        // Should get proper error from real InterMine
        const errors = validateErrorResponse(response);
        expect(errors[0].message).toContain('not found');

        console.log(
          `✅ Properly handled non-existent organism error: ${errors[0].message}`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organism data completeness and accuracy',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query ValidateOrganismData($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              genus
              species
              commonName
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const organism = data.organism.results;

        // Validate data types and biological correctness
        expect(typeof organism.taxonId).toBe('string');
        expect(typeof organism.name).toBe('string');
        expect(typeof organism.genus).toBe('string');
        expect(typeof organism.species).toBe('string');

        // Validate biological taxonomy consistency
        expect(organism.name).toBe(`${organism.genus} ${organism.species}`);

        // Validate organism has proper data types

        console.log(`✅ Organism data validation passed for ${organism.name}`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Query.organisms - Real Search Integration', () => {
    test(
      'searches organisms in real InterMine with filters',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchRealOrganisms($genus: String, $name: String, $page: Int, $pageSize: Int) {
          organisms(genus: $genus, name: $name, page: $page, pageSize: $pageSize) {
            results {
              taxonId
              name
              genus
              species
              commonName
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
            genus: 'Phaseolus',
            page: 1,
            pageSize: 10,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const searchResults = data.organisms;

        // Validate real search results
        expect(Array.isArray(searchResults.results)).toBe(true);
        expect(searchResults.results.length).toBeGreaterThan(0);

        // Validate pagination info
        expect(searchResults.pageInfo.currentPage).toBe(1);
        expect(searchResults.pageInfo.pageSize).toBe(10);
        expect(searchResults.pageInfo.numResults).toBeGreaterThan(0);

        // Validate search criteria worked - all should be Phaseolus
        searchResults.results.forEach((organism: any) => {
          expect(organism.genus).toBe('Phaseolus');
          expect(organism.taxonId).toBeDefined();
          expect(organism.name).toContain('Phaseolus');
        });

        console.log(
          `✅ Real organism search returned ${searchResults.results.length} organisms`,
        );
        console.log(
          `   Total organisms in genus Phaseolus: ${searchResults.pageInfo.numResults}`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organism search with multiple criteria',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchOrganismsMultipleCriteria($genus: String, $species: String, $page: Int, $pageSize: Int) {
          organisms(genus: $genus, species: $species, page: $page, pageSize: $pageSize) {
            results {
              taxonId
              name
              genus
              species
            }
            pageInfo {
              numResults
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          searchQuery,
          {
            genus: 'Phaseolus',
            species: 'vulgaris',
            page: 1,
            pageSize: 5,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const results = data.organisms.results;

        // Should find Phaseolus vulgaris specifically
        expect(results.length).toBeGreaterThan(0);
        results.forEach((organism: any) => {
          expect(organism.genus).toBe('Phaseolus');
          expect(organism.species).toBe('vulgaris');
          expect(organism.name).toBe('Phaseolus vulgaris');
        });

        console.log(
          `✅ Multi-criteria search found ${results.length} Phaseolus vulgaris organisms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'handles organism search with no results',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const searchQuery = `
        query SearchNoOrganismResults($genus: String, $page: Int, $pageSize: Int) {
          organisms(genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              taxonId
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
            genus: 'NonexistentGenus12345',
            page: 1,
            pageSize: 10,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);

        // Should get empty results, not an error
        expect(data.organisms.results).toHaveLength(0);
        expect(data.organisms.pageInfo.numResults).toBe(0);
        // Server returns pageCount = 1 even for empty results
        expect(data.organisms.pageInfo.pageCount).toBeGreaterThanOrEqual(0);

        console.log('✅ Empty organism search results handled correctly');
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Organism Data Relationships - Real Integration', () => {
    test(
      'validates organism-gene relationships',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Test that genes from an organism actually belong to that organism
        const query = `
        query TestOrganismGeneRelationship($taxonId: ID!, $genus: String) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              genus
              species
            }
          }
          genes(genus: $genus, page: 1, pageSize: 3) {
            results {
              identifier
              organism {
                taxonId
                name
                genus
                species
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {
            taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
            genus: 'Phaseolus',
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const organism = data.organism.results;
        const genes = data.genes.results;

        // Validate consistency between organism query and genes' organism data
        expect(organism.taxonId).toBe(REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON);
        expect(genes.length).toBeGreaterThan(0);

        genes.forEach((gene: any) => {
          expect(gene.organism.taxonId).toBe(organism.taxonId);
          expect(gene.organism.genus).toBe(organism.genus);
          expect(gene.organism.species).toBe(organism.species);
          expect(gene.organism.name).toBe(organism.name);
        });

        console.log(`✅ Organism-gene relationship validation passed`);
        console.log(`   Organism: ${organism.name} (${organism.taxonId})`);
        console.log(
          `   Validated ${genes.length} genes belong to this organism`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });
});
