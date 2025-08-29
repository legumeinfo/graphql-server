import {describe, test, expect} from 'vitest';
import {
  createRealTestServer,
  executeRealQuery,
  validateSuccessfulResponse,
} from '../../__helpers__/real-apollo-server.js';
import {
  realIntegrationSuite,
  REAL_TEST_CONFIG,
} from '../../setup/real-integration-setup.js';
import {getIntrospectionQuery} from 'graphql';

/**
 * Data Validation and Schema Compliance Tests
 * Validates biological data accuracy and GraphQL schema compliance
 */

realIntegrationSuite('Data Validation and Schema Compliance Tests', () => {
  describe('GraphQL Schema Compliance', () => {
    test(
      'validates schema introspection matches expected structure',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const introspectionQuery = getIntrospectionQuery();

        const response = await executeRealQuery(
          server,
          introspectionQuery,
          {},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const schema = data.__schema;

        // Validate schema has expected top-level structure
        expect(schema).toBeDefined();
        expect(schema.types).toBeDefined();
        expect(Array.isArray(schema.types)).toBe(true);

        // Find and validate Query type
        const queryType = schema.types.find(
          (type: any) => type.name === 'Query',
        );
        expect(queryType).toBeDefined();
        expect(queryType.kind).toBe('OBJECT');
        expect(Array.isArray(queryType.fields)).toBe(true);

        // Validate some expected queries exist
        const queryNames = queryType.fields.map((field: any) => field.name);
        expect(queryNames).toContain('gene');
        expect(queryNames).toContain('organism');
        expect(queryNames).toContain('genes');
        expect(queryNames).toContain('organisms');

        console.log(
          `✅ Schema introspection validated: ${schema.types.length} types, ${queryType.fields.length} queries`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates required fields are non-nullable in schema',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const typeIntrospectionQuery = `
        query SchemaValidation {
          __schema {
            types {
              name
              kind
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          typeIntrospectionQuery,
          {},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const types = data.__schema.types;

        // Find Gene type and validate required fields
        const geneType = types.find((type: any) => type.name === 'Gene');
        expect(geneType).toBeDefined();

        const idField = geneType.fields.find(
          (field: any) => field.name === 'id',
        );
        expect(idField).toBeDefined();
        expect(idField.type.kind).toBe('NON_NULL'); // ID! should be non-nullable

        const identifierField = geneType.fields.find(
          (field: any) => field.name === 'identifier',
        );
        expect(identifierField).toBeDefined();
        expect(identifierField.type.kind).toBe('NON_NULL'); // ID! should be non-nullable

        // Find Organism type and validate required fields
        const organismType = types.find(
          (type: any) => type.name === 'Organism',
        );
        expect(organismType).toBeDefined();

        const taxonIdField = organismType.fields.find(
          (field: any) => field.name === 'taxonId',
        );
        expect(taxonIdField).toBeDefined();
        expect(taxonIdField.type.kind).toBe('NON_NULL'); // ID! should be non-nullable

        console.log('✅ Required field nullability validation passed');
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Biological Data Validation', () => {
    test(
      'validates gene identifier format and biological consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const geneValidationQuery = `
        query ValidateGeneData($id: ID!) {
          gene(identifier: $id) {
            results {
              identifier
              symbol
              description
              organism {
                taxonId
                name
                shortName
                genus
                species
              }
              locations {
                start
                end
                strand
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          geneValidationQuery,
          {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;

        expect(gene.identifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);
        expect(gene.organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
        expect(gene.organism.species).toBe(REAL_TEST_CONFIG.KNOWN_SPECIES);
        expect(gene.organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);
        expect(gene.organism.shortName).toBe(REAL_TEST_CONFIG.KNOWN_SHORTNAME);
        expect(gene.organism.taxonId).toBe(
          REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
        );

        gene.locations.forEach((location: any) => {
          expect(typeof location.start).toBe('number');
          expect(typeof location.end).toBe('number');
          expect(location.start).toBeGreaterThan(0);
          expect(location.end).toBeGreaterThan(location.start);
          expect(['1', '-1']).toContain(location.strand); // Valid strand values
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates protein data accuracy and consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const proteinValidationQuery = `
        query ValidateProteinData($id: ID!) {
          protein(identifier: $id) {
            results {
              identifier
              name
              length
              organism {
                taxonId
                genus
                species
              }
              sequence {
                residues
                length
              }
              strain {
                name
              }
              panGeneSets {
                identifier
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          proteinValidationQuery,
          {id: REAL_TEST_CONFIG.KNOWN_PROTEIN_ID},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const protein = data.protein.results;

        expect(protein.identifier).toBe(REAL_TEST_CONFIG.KNOWN_PROTEIN_ID);
        expect(protein.length).toBe(REAL_TEST_CONFIG.KNOWN_PROTEIN_LENGTH);
        expect(protein.organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
        expect(protein.organism.species).toBe(REAL_TEST_CONFIG.KNOWN_SPECIES);
        expect(protein.organism.taxonId).toBe(
          REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
        );
        expect(protein.sequence.residues).toBe(
          REAL_TEST_CONFIG.KNOWN_PROTEIN_SEQ_RESIDUES,
        );
        expect(protein.sequence.length).toBe(protein.length);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organism taxonomy consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const taxonomyValidationQuery = `
        query ValidateTaxonomyData($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              genus
              species
              abbreviation
              commonName
              strains {
                name
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          taxonomyValidationQuery,
          {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const organism = data.organism.results;

        expect(organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);
        expect(organism.taxonId).toBe(REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON);
        expect(organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
        expect(organism.species).toBe(REAL_TEST_CONFIG.KNOWN_SPECIES);
        expect(organism.abbreviation).toBe(REAL_TEST_CONFIG.KNOWN_ABBREV);
        expect(organism.commonName).toBe(REAL_TEST_CONFIG.KNOWN_COMMONNAME);
        expect(organism.strains.length).toBe(
          REAL_TEST_CONFIG.KNOWN_STRAINS_LENGTH,
        );
        expect(
          organism.strains
            .sort()
            .every(
              (val, idx) => val.name === REAL_TEST_CONFIG.KNOWN_STRAINS[idx],
            ),
        ).toBe(true);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Data Consistency Across Queries', () => {
    test(
      'validates search result consistency with individual queries',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Search for genes in an organism
        const searchQuery = `
        query SearchGenesInOrganism($genus: String, $page: Int, $pageSize: Int) {
          genes(genus: $genus, page: $page, pageSize: $pageSize) {
            results {
              identifier
              organism {
                taxonId
                name
              }
            }
          }
        }
      `;

        const searchResponse = await executeRealQuery(
          server,
          searchQuery,
          {genus: REAL_TEST_CONFIG.KNOWN_GENUS, page: 1, pageSize: 3},
          contextValue,
        );

        const searchData = validateSuccessfulResponse(searchResponse);
        const searchResults = searchData.genes.results;
        console.log(JSON.stringify(searchResults));
        expect(searchResults.length).toBe(3);

        // Validate each search result by querying individually
        searchResults.forEach(async (result: any) => {
          const individualQuery = `
          query GetIndividualGene($id: ID!) {
            gene(identifier: $id) {
              results {
                identifier
                organism {
                  taxonId
                  name
                }
              }
            }
          }
        `;
          const individualResponse = await executeRealQuery(
            server,
            individualQuery,
            {id: result.identifier},
            contextValue,
          );

          const individualData = validateSuccessfulResponse(individualResponse);
          const individual = individualData.gene.results;

          // Search result should match individual query result
          expect(result.identifier).toBe(individual.identifier);
          expect(result.organism.taxonId).toBe(individual.organism.taxonId);
          expect(result.organism.name).toBe(individual.organism.name);
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );
  });

  describe('Data Type Validation', () => {
    test(
      'validates field data types match schema definitions',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const typeValidationQuery = `
        query ValidateDataTypes($geneId: ID!, $taxonId: ID!) {
          gene(identifier: $geneId) {
            results {
              identifier
              name
              description
              length
              organism {
                id
                taxonId
                name
                genus
                species
              }
            }
          }
          organism(taxonId: $taxonId) {
            results {
              id
              taxonId
              name
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          typeValidationQuery,
          {
            geneId: REAL_TEST_CONFIG.KNOWN_GENE_ID,
            taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;
        const organism = data.organism.results;

        expect(gene.identifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);
        expect(gene.name).toBe(REAL_TEST_CONFIG.KNOWN_GENE_NAME);
        expect(gene.description).toBe(REAL_TEST_CONFIG.KNOWN_GENE_DESC);
        expect(gene.length).toBe(REAL_TEST_CONFIG.KNOWN_GENE_LENGTH);

        expect(organism.taxonId).toBe(REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON);
        expect(organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);

        expect(gene.organism.taxonId).toBe(
          REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
        );
        expect(gene.organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);
        expect(gene.organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
        expect(gene.organism.species).toBe(REAL_TEST_CONFIG.KNOWN_SPECIES);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates array field types and structures',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const arrayValidationQuery = `
        query ValidateArrayTypes($geneId: ID!) {
          gene(identifier: $geneId) {
            results {
              identifier
              proteins {
                identifier
                length
              }
              locations {
                start
                end
                strand
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          arrayValidationQuery,
          {geneId: REAL_TEST_CONFIG.KNOWN_GENE_ID},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const gene = data.gene.results;

        // Validate array types
        expect(Array.isArray(gene.proteins)).toBe(true);
        expect(Array.isArray(gene.locations)).toBe(true);

        // Validate array element types
        gene.proteins.forEach((protein: any) => {
          expect(typeof protein.identifier).toBe('string');
          if (protein.length !== null)
            expect(typeof protein.length).toBe('number');
        });

        gene.locations.forEach((location: any) => {
          expect(typeof location.start).toBe('number');
          expect(typeof location.end).toBe('number');
          expect(typeof location.strand).toBe('string');
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Pagination Data Validation', () => {
    test(
      'validates pagination metadata accuracy',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const paginationQuery = `
        query ValidatePagination($genus: String, $page: Int, $pageSize: Int) {
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
          paginationQuery,
          {genus: REAL_TEST_CONFIG.KNOWN_GENUS, page: 1, pageSize: 5},
          contextValue,
        );

        const page1Data = validateSuccessfulResponse(page1Response);
        const page1 = page1Data.genes;

        // Validate pagination metadata types and logic
        expect(typeof page1.pageInfo.currentPage).toBe('number');
        expect(typeof page1.pageInfo.pageSize).toBe('number');
        expect(typeof page1.pageInfo.numResults).toBe('number');
        expect(typeof page1.pageInfo.pageCount).toBe('number');
        expect(typeof page1.pageInfo.hasNextPage).toBe('boolean');
        expect(typeof page1.pageInfo.hasPreviousPage).toBe('boolean');

        expect(page1.pageInfo.currentPage).toBe(1);
        expect(page1.pageInfo.pageSize).toBe(5);
        expect(page1.pageInfo.hasPreviousPage).toBe(false);
        expect(page1.results.length).toBeLessThanOrEqual(5);

        // Validate mathematical consistency
        if (page1.pageInfo.numResults > 0) {
          const expectedPageCount = Math.ceil(
            page1.pageInfo.numResults / page1.pageInfo.pageSize,
          );
          expect(page1.pageInfo.pageCount).toBe(expectedPageCount);

          const shouldHaveNextPage =
            page1.pageInfo.numResults > page1.pageInfo.pageSize;
          expect(page1.pageInfo.hasNextPage).toBe(shouldHaveNextPage);
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });
});
