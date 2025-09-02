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

  describe('Organisms Query Data Validation', () => {
    test(
      'validates organisms() query structure and data accuracy',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const organismsQuery = `
        query ValidateOrganismsQuery($page: Int, $pageSize: Int) {
          organisms(page: $page, pageSize: $pageSize) {
            results {
              id
              taxonId
              name
              genus
              species
              abbreviation
              commonName
              shortName
              description
              strains {
                id
                identifier
                name
                description
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
          organismsQuery,
          {page: 1, pageSize: 10},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const organismsResult = data.organisms;

        // Validate response structure
        expect(organismsResult.results).toBeDefined();
        expect(Array.isArray(organismsResult.results)).toBe(true);
        expect(organismsResult.pageInfo).toBeDefined();

        // Validate pagination info
        expect(organismsResult.pageInfo.currentPage).toBe(1);
        expect(organismsResult.pageInfo.pageSize).toBe(10);
        expect(typeof organismsResult.pageInfo.numResults).toBe('number');
        expect(typeof organismsResult.pageInfo.pageCount).toBe('number');

        console.log(
          `✅ organisms() query returned ${organismsResult.results.length} organisms`,
        );
        console.log(
          `   Total organisms in database: ${organismsResult.pageInfo.numResults}`,
        );

        // Validate each organism's data structure and types
        organismsResult.results.forEach((organism: any, index: number) => {
          // Required fields
          expect(organism.id).toBeDefined();
          expect(organism.taxonId).toBeDefined();
          expect(organism.name).toBeDefined();
          expect(organism.genus).toBeDefined();
          expect(organism.species).toBeDefined();

          // Type validation
          expect(typeof organism.id).toBe('string');
          expect(typeof organism.taxonId).toBe('string');
          expect(typeof organism.name).toBe('string');
          expect(typeof organism.genus).toBe('string');
          expect(typeof organism.species).toBe('string');

          // Biological consistency - name should be genus + species
          expect(organism.name).toBe(`${organism.genus} ${organism.species}`);

          // Optional fields type validation
          expect(typeof organism.abbreviation).toBe('string');
          expect(typeof organism.commonName).toBe('string');
          expect(typeof organism.shortName).toBe('string');
          expect(typeof organism.description).toBe('string');

          // Strains should always be an array
          expect(Array.isArray(organism.strains)).toBe(true);

          // Validate strain data structure
          organism.strains.forEach((strain: any) => {
            expect(strain.id).toBeDefined();
            expect(strain.identifier).toBeDefined();
            expect(typeof strain.id).toBe('string');
            expect(typeof strain.identifier).toBe('string');

            expect(typeof strain.name).toBe('string');
            expect(typeof strain.description).toBe('string');
          });

          console.log(
            `   Organism ${index + 1}: ${organism.name} (${organism.taxonId}) - ${organism.strains.length} strains`,
          );
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organisms() search filters work correctly',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const filteredOrganismsQuery = `
        query ValidateOrganismFilters($genus: String, $species: String, $name: String, $page: Int, $pageSize: Int) {
          organisms(genus: $genus, species: $species, name: $name, page: $page, pageSize: $pageSize) {
            results {
              taxonId
              name
              genus
              species
              abbreviation
              commonName
            }
            pageInfo {
              numResults
              currentPage
              pageSize
            }
          }
        }
      `;

        // Test genus filter
        const genusResponse = await executeRealQuery(
          server,
          filteredOrganismsQuery,
          {genus: REAL_TEST_CONFIG.KNOWN_GENUS, page: 1, pageSize: 5},
          contextValue,
        );

        const genusData = validateSuccessfulResponse(genusResponse);
        const genusResults = genusData.organisms.results;

        // All results should match the genus filter
        expect(genusResults.length).toBeGreaterThan(0);
        genusResults.forEach((organism: any) => {
          expect(organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
        });

        console.log(
          `✅ Genus filter "${REAL_TEST_CONFIG.KNOWN_GENUS}" returned ${genusResults.length} organisms`,
        );

        // Test species filter with genus
        const speciesResponse = await executeRealQuery(
          server,
          filteredOrganismsQuery,
          {
            genus: REAL_TEST_CONFIG.KNOWN_GENUS,
            species: REAL_TEST_CONFIG.KNOWN_SPECIES,
            page: 1,
            pageSize: 3,
          },
          contextValue,
        );

        const speciesData = validateSuccessfulResponse(speciesResponse);
        const speciesResults = speciesData.organisms.results;

        // All results should match both genus and species filters
        expect(speciesResults.length).toBeGreaterThan(0);
        speciesResults.forEach((organism: any) => {
          expect(organism.genus).toBe(REAL_TEST_CONFIG.KNOWN_GENUS);
          expect(organism.species).toBe(REAL_TEST_CONFIG.KNOWN_SPECIES);
          expect(organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);
        });

        console.log(
          `✅ Genus + species filter returned ${speciesResults.length} organisms`,
        );

        // Test name filter
        const nameResponse = await executeRealQuery(
          server,
          filteredOrganismsQuery,
          {name: REAL_TEST_CONFIG.KNOWN_NAME, page: 1, pageSize: 5},
          contextValue,
        );

        const nameData = validateSuccessfulResponse(nameResponse);
        const nameResults = nameData.organisms.results;

        // All results should match the name filter
        expect(nameResults.length).toBeGreaterThan(0);
        nameResults.forEach((organism: any) => {
          expect(organism.name).toBe(REAL_TEST_CONFIG.KNOWN_NAME);
        });

        console.log(
          `✅ Name filter "${REAL_TEST_CONFIG.KNOWN_NAME}" returned ${nameResults.length} organisms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organisms() pagination consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const paginationQuery = `
        query ValidateOrganismsPagination($page: Int, $pageSize: Int) {
          organisms(page: $page, pageSize: $pageSize) {
            results {
              taxonId
              name
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

        // Test page 1
        const page1Response = await executeRealQuery(
          server,
          paginationQuery,
          {page: 1, pageSize: 1},
          contextValue,
        );

        const page1Data = validateSuccessfulResponse(page1Response);
        const page1 = page1Data.organisms;

        // Validate page 1 pagination metadata
        expect(page1.pageInfo.currentPage).toBe(1);
        expect(page1.pageInfo.pageSize).toBe(1);
        expect(page1.pageInfo.hasPreviousPage).toBe(false);
        expect(page1.results.length).toBeLessThanOrEqual(3);

        const page2Response = await executeRealQuery(
          server,
          paginationQuery,
          {page: 2, pageSize: 1},
          contextValue,
        );

        const page2Data = validateSuccessfulResponse(page2Response);
        const page2 = page2Data.organisms;

        expect(page2.pageInfo.currentPage).toBe(2);
        expect(page2.pageInfo.hasPreviousPage).toBe(true);
        expect(page2.pageInfo.numResults).toBe(page1.pageInfo.numResults); // Total should be consistent

        // Results should be different between pages
        const page1Ids = page1.results.map((o: any) => o.taxonId);
        const page2Ids = page2.results.map((o: any) => o.taxonId);
        const intersection = page1Ids.filter((id: string) =>
          page2Ids.includes(id),
        );
        expect(intersection).toHaveLength(0); // No duplicates between pages
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organisms() data consistency with organism() query',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // First get organisms list
        const organismsListQuery = `
        query GetOrganismsList($page: Int, $pageSize: Int) {
          organisms(page: $page, pageSize: $pageSize) {
            results {
              taxonId
              name
              genus
              species
              abbreviation
              commonName
              shortName
              description
            }
          }
        }
      `;

        const listResponse = await executeRealQuery(
          server,
          organismsListQuery,
          {page: 1, pageSize: 5},
          contextValue,
        );

        const listData = validateSuccessfulResponse(listResponse);
        const organisms = listData.organisms.results;

        expect(organisms.length).toBeGreaterThan(0);

        // Test consistency with individual organism() queries
        for (const organism of organisms) {
          const individualQuery = `
          query GetIndividualOrganism($taxonId: ID!) {
            organism(taxonId: $taxonId) {
              results {
                taxonId
                name
                genus
                species
                abbreviation
                commonName
                shortName
                description
              }
            }
          }
        `;

          const individualResponse = await executeRealQuery(
            server,
            individualQuery,
            {taxonId: organism.taxonId},
            contextValue,
          );

          const individualData = validateSuccessfulResponse(individualResponse);
          const individual = individualData.organism.results;

          // Data should be identical between organisms() and organism() queries
          expect(individual.taxonId).toBe(organism.taxonId);
          expect(individual.name).toBe(organism.name);
          expect(individual.genus).toBe(organism.genus);
          expect(individual.species).toBe(organism.species);
          expect(individual.abbreviation).toBe(organism.abbreviation);
          expect(individual.commonName).toBe(organism.commonName);
          expect(individual.shortName).toBe(organism.shortName);
          expect(individual.description).toBe(organism.description);
        }

        console.log(
          `✅ Validated data consistency between organisms() and organism() for ${organisms.length} organisms`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates organisms() strain relationships and data quality',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const strainValidationQuery = `
        query ValidateOrganismStrains($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              strains {
                id
                identifier
                name
                description
                organism {
                  taxonId
                  name
                }
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          strainValidationQuery,
          {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const organism = data.organism.results;

        // Validate strain data structure and relationships
        expect(Array.isArray(organism.strains)).toBe(true);
        expect(organism.strains.length).toBe(
          REAL_TEST_CONFIG.KNOWN_STRAINS_LENGTH,
        );

        organism.strains.forEach((strain: any, index: number) => {
          // Required fields
          expect(strain.id).toBeDefined();
          expect(strain.identifier).toBeDefined();
          expect(typeof strain.id).toBe('string');
          expect(typeof strain.identifier).toBe('string');

          // Validate strain identifier matches known strains
          expect(REAL_TEST_CONFIG.KNOWN_STRAINS).toContain(strain.name);

          expect(typeof strain.name).toBe('string');
          expect(typeof strain.description).toBe('string');

          // Validate reverse relationship (strain -> organism)
          expect(strain.organism.taxonId).toBe(organism.taxonId);
          expect(strain.organism.name).toBe(organism.name);

          console.log(
            `   Strain ${index + 1}: ${strain.identifier} (${strain.name || 'N/A'})`,
          );
        });

        console.log(
          `✅ Validated ${organism.strains.length} strains for organism ${organism.name}`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Traits Query Data Validation', () => {
    test(
      'validates traits() query structure and data accuracy',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const traitsQuery = `
        query ValidateTraitsQuery($page: Int, $pageSize: Int) {
          traits(page: $page, pageSize: $pageSize) {
            results {
              id
              identifier
              name
              description
              organism {
                id
                taxonId
                name
                genus
                species
                abbreviation
                commonName
              }
              qtls {
                id
                identifier
                name
                peak
                start
                end
                lod
              }
              publications {
                id
                doi
                title
                year
                authors {
                  name
                }
              }
              dataSets {
                id
                name
                description
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          traitsQuery,
          {page: 1, pageSize: 10},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const traitsResult = data.traits;

        // Validate response structure
        expect(traitsResult.results).toBeDefined();
        expect(Array.isArray(traitsResult.results)).toBe(true);

        // Validate each trait's data structure and types
        traitsResult.results.forEach((trait: any, index: number) => {
          // Required fields
          expect(trait.id).toBeDefined();
          expect(trait.identifier).toBeDefined();
          expect(trait.name).toBeDefined();

          // Type validation
          expect(typeof trait.id).toBe('string');
          expect(typeof trait.identifier).toBe('string');
          expect(typeof trait.name).toBe('string');

          // Validate organism relationship if present
          expect(trait.organism.id).toBeDefined();
          expect(trait.organism.taxonId).toBeDefined();
          expect(trait.organism.name).toBeDefined();
          expect(typeof trait.organism.id).toBe('string');
          expect(typeof trait.organism.taxonId).toBe('string');
          expect(typeof trait.organism.name).toBe('string');
          expect(typeof trait.organism.genus).toBe('string');
          expect(typeof trait.organism.species).toBe('string');
          expect(typeof trait.organism.abbreviation).toBe('string');
          expect(typeof trait.organism.commonName).toBe('string');

          // Biological consistency
          expect(trait.organism.name).toBe(
            `${trait.organism.genus} ${trait.organism.species}`,
          );

          // Array fields should always be arrays
          expect(Array.isArray(trait.qtls)).toBe(true);
          expect(Array.isArray(trait.publications)).toBe(true);
          expect(Array.isArray(trait.dataSets)).toBe(true);

          // Validate QTL data structure
          trait.qtls.forEach((qtl: any) => {
            expect(qtl.id).toBeDefined();
            expect(qtl.identifier).toBeDefined();
            expect(typeof qtl.id).toBe('string');
            expect(typeof qtl.identifier).toBe('string');
            expect(typeof qtl.name).toBe('string');

            expect(typeof qtl.start).toBe('number');
            expect(qtl.start).toBeGreaterThanOrEqual(0);
            expect(typeof qtl.end).toBe('number');
            expect(qtl.end).toBeGreaterThan(0);
            expect(qtl.end).toBeGreaterThanOrEqual(qtl.start);
          });

          // Validate publication data structure
          trait.publications.forEach((pub: any) => {
            expect(pub.id).toBeDefined();
            expect(typeof pub.id).toBe('string');

            expect(typeof pub.doi).toBe('string');
            expect(typeof pub.title).toBe('string');
            expect(typeof pub.year).toBe('number');

            // Validate authors array
            expect(Array.isArray(pub.authors)).toBe(true);
            pub.authors.forEach((author: any) => {
              expect(typeof author.name).toBe('string');
            });
          });

          // Validate dataset data structure
          trait.dataSets.forEach((dataset: any) => {
            expect(dataset.id).toBeDefined();
            expect(typeof dataset.id).toBe('string');
            expect(typeof dataset.name).toBe('string');
            expect(typeof dataset.description).toBe('string');
          });
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates traits() search filters work correctly',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const filteredTraitsQuery = `
        query ValidateTraitFilters($name: String, $studyType: String, $publicationId: String, $author: String, $page: Int, $pageSize: Int) {
          traits(name: $name, studyType: $studyType, publicationId: $publicationId, author: $author, page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              description
              organism {
                name
                genus
                species
              }
              publications {
                doi
                title
                authors {
                  name
                }
              }
            }
            pageInfo {
              numResults
              currentPage
              pageSize
            }
          }
        }
      `;

        // Test broad search to see what traits exist
        const broadResponse = await executeRealQuery(
          server,
          filteredTraitsQuery,
          {page: 1, pageSize: 20},
          contextValue,
        );

        const broadData = validateSuccessfulResponse(broadResponse);
        const allTraits = broadData.traits.results;

        allTraits.forEach(async (sampleTrait: any, index: number) => {
          const nameResponse = await executeRealQuery(
            server,
            filteredTraitsQuery,
            {name: sampleTrait.name, page: 1, pageSize: 5},
            contextValue,
          );

          const nameData = validateSuccessfulResponse(nameResponse);
          const nameResults = nameData.traits.results;

          // Should find the specific trait
          expect(nameResults.length).toBeGreaterThan(0);
          const foundTrait = nameResults.find(
            (t: any) => t.identifier === sampleTrait.identifier,
          );
          expect(foundTrait).toBeDefined();

          // Test partial name search
          const partialName = sampleTrait.name.split(' ')[0]; // First word

          const partialResponse = await executeRealQuery(
            server,
            filteredTraitsQuery,
            {name: partialName, page: 1, pageSize: 10},
            contextValue,
          );

          const partialData = validateSuccessfulResponse(partialResponse);
          expect(partialData.traits.results.length).toBeGreaterThanOrEqual(
            nameResults.length,
          );

          // Test author search if publications exist
          const traitsWithPublications = allTraits.filter(
            (t: any) => t.publications.length > 0,
          );
          const traitWithPub = traitsWithPublications[0];
          const publication = traitWithPub.publications[0];
          const authorName = publication.authors[0].name;
          const authorResponse = await executeRealQuery(
            server,
            filteredTraitsQuery,
            {author: authorName, page: 1, pageSize: 5},
            contextValue,
          );

          const authorData = validateSuccessfulResponse(authorResponse);
          expect(authorData.traits.results.length).toBeGreaterThan(0);

          // Verify author search logic
          authorData.traits.results.forEach((trait: any) => {
            const hasMatchingAuthor = trait.publications.some((pub: any) =>
              pub.authors.some((author: any) =>
                author.name.includes(authorName),
              ),
            );
            expect(hasMatchingAuthor).toBe(true);
          });
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates trait() individual query consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // First get a list of traits
        const traitsListQuery = `
        query GetTraitsList($page: Int, $pageSize: Int) {
          traits(page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              description
              organism {
                taxonId
                name
              }
            }
          }
        }
      `;

        const listResponse = await executeRealQuery(
          server,
          traitsListQuery,
          {page: 1, pageSize: 5},
          contextValue,
        );

        const listData = validateSuccessfulResponse(listResponse);
        const traits = listData.traits.results;

        traits.forEach(async (sampleTrait: any, index: number) => {
          // Test individual trait() query for consistency
          const individualQuery = `
          query GetIndividualTrait($identifier: ID!) {
            trait(identifier: $identifier) {
              results {
                identifier
                name
                description
                organism {
                  taxonId
                  name
                  genus
                  species
                }
                qtls {
                  identifier
                  name
                  peak
                  start
                  end
                }
                publications {
                  doi
                  title
                  year
                }
                dataSets {
                  name
                  description
                }
              }
            }
          }
        `;

          const individualResponse = await executeRealQuery(
            server,
            individualQuery,
            {identifier: sampleTrait.identifier},
            contextValue,
          );

          const individualData = validateSuccessfulResponse(individualResponse);
          const individual = individualData.trait.results;

          // Validate consistency between traits() and trait() queries
          expect(individual.identifier).toBe(sampleTrait.identifier);
          expect(individual.name).toBe(sampleTrait.name);
          expect(individual.description).toBe(sampleTrait.description);

          expect(individual.organism.taxonId).toBe(
            sampleTrait.organism.taxonId,
          );
          expect(individual.organism.name).toBe(sampleTrait.organism.name);

          // Validate data completeness in individual query
          expect(Array.isArray(individual.qtls)).toBe(true);
          expect(Array.isArray(individual.publications)).toBe(true);
          expect(Array.isArray(individual.dataSets)).toBe(true);
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates traits() QTL relationships and data quality',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const qtlValidationQuery = `
        query ValidateTraitQTLRelationships($page: Int, $pageSize: Int) {
          traits(page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              qtls {
                identifier
                name
                peak
                start
                end
                lod
                likelihoodRatio
                markerR2
                trait {
                  identifier
                  name
                }
                linkageGroup {
                  identifier
                  name
                }
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          qtlValidationQuery,
          {page: 1, pageSize: 15},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const traits = data.traits.results;

        // Find traits with QTLs for validation
        const traitsWithQTLs = traits.filter(
          (trait: any) => trait.qtls.length > 0,
        );

        traitsWithQTLs.forEach((trait: any) => {
          trait.qtls.forEach((qtl: any) => {
            // Validate QTL data types and ranges
            expect(qtl.identifier).toBeDefined();
            expect(typeof qtl.identifier).toBe('string');
            expect(typeof qtl.name).toBe('string');

            expect(qtl.peak).toBe(null);
            expect(typeof qtl.start).toBe('number');
            expect(qtl.start).toBeGreaterThanOrEqual(0);
            expect(typeof qtl.end).toBe('number');
            expect(qtl.end).toBeGreaterThan(0);
            expect(qtl.lod).toBe(null);
            expect(qtl.likelihoodRatio).toBe(null);
            expect(qtl.markerR2).toBe(null);
            expect(qtl.end).toBeGreaterThanOrEqual(qtl.start);

            // Validate reverse relationship (QTL -> Trait)
            expect(qtl.trait.identifier).toBe(trait.identifier);
            expect(qtl.trait.name).toBe(trait.name);

            // Validate linkage group relationship
            expect(qtl.linkageGroup.identifier).toBeDefined();
            expect(typeof qtl.linkageGroup.identifier).toBe('string');
            expect(typeof qtl.linkageGroup.name).toBe('string');
          });
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates traits() edge cases and error handling',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const edgeCaseQuery = `
        query TraitsEdgeCases($name: String, $studyType: String, $page: Int, $pageSize: Int) {
          traits(name: $name, studyType: $studyType, page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
            }
            pageInfo {
              numResults
              currentPage
              pageCount
            }
          }
        }
      `;

        // Test empty results case
        const emptyResponse = await executeRealQuery(
          server,
          edgeCaseQuery,
          {name: 'NonexistentTrait123456789', page: 1, pageSize: 10},
          contextValue,
        );

        const emptyData = validateSuccessfulResponse(emptyResponse);
        expect(emptyData.traits.results).toHaveLength(0);
        expect(emptyData.traits.pageInfo.numResults).toBe(0);
        expect(emptyData.traits.pageInfo.currentPage).toBe(1);

        // Test large page size
        const largePageResponse = await executeRealQuery(
          server,
          edgeCaseQuery,
          {page: 1, pageSize: 100},
          contextValue,
        );

        // There are only 11 results in MiniMine
        const largePageData = validateSuccessfulResponse(largePageResponse);
        expect(largePageData.traits.pageInfo.numResults).toBe(11);
        expect(largePageData.traits.results.length).toBe(11);

        // Test individual trait query with non-existent ID
        const nonExistentTraitQuery = `
        query GetNonExistentTrait($identifier: ID!) {
          trait(identifier: $identifier) {
            results {
              identifier
              name
            }
          }
        }
      `;

        const nonExistentResponse = await executeRealQuery(
          server,
          nonExistentTraitQuery,
          {identifier: 'NonexistentTrait123456789'},
          contextValue,
        );

        const errors = nonExistentResponse.body.singleResult.errors;
        expect(errors[0].message).toBe(
          "Trait with identifier 'NonexistentTrait123456789' not found",
        );
        expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
        expect(nonExistentResponse.body.singleResult.data.trait).toBe(null);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('QTLs Query Data Validation', () => {
    test(
      'validates qtls() query structure and data accuracy',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const qtlsQuery = `
        query ValidateQTLsQuery($page: Int, $pageSize: Int) {
          qtls(page: $page, pageSize: $pageSize) {
            results {
              id
              identifier
              name
              start
              end
              peak
              lod
              likelihoodRatio
              markerR2
              trait {
                id
                identifier
                name
                description
                organism {
                  taxonId
                  name
                  genus
                  species
                }
              }
              linkageGroup {
                id
                identifier
                name
                length
                geneticMap {
                  identifier
                }
              }
              qtlStudy {
                id
                identifier
                description
              }
              markers {
                identifier
                name
              }
              dataSets {
                id
                name
                description
              }
              publications {
                id
                doi
                title
                year
                authors {
                  name
                }
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
          qtlsQuery,
          {page: 1, pageSize: 15},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const qtlsResult = data.qtls;

        // Validate response structure
        expect(qtlsResult.results).toBeDefined();
        expect(Array.isArray(qtlsResult.results)).toBe(true);
        expect(qtlsResult.pageInfo).toBeDefined();

        // Validate pagination info
        expect(qtlsResult.pageInfo.currentPage).toBe(1);
        expect(qtlsResult.pageInfo.pageSize).toBe(15);
        expect(typeof qtlsResult.pageInfo.numResults).toBe('number');
        expect(typeof qtlsResult.pageInfo.pageCount).toBe('number');

        // Validate each QTL's data structure and types
        qtlsResult.results.forEach((qtl: any, index: number) => {
          expect(qtl.id).toBeDefined();
          expect(qtl.identifier).toBeDefined();

          expect(typeof qtl.id).toBe('string');
          expect(typeof qtl.identifier).toBe('string');
          expect(typeof qtl.name).toBe('string');

          expect(qtl.start).toBeGreaterThanOrEqual(0);
          expect(qtl.end).toBeGreaterThan(0);
          expect(qtl.peak).toBe(null);
          expect(qtl.lod).toBe(null);
          expect(qtl.peak).toBe(null);
          expect(qtl.likelihoodRatio).toBe(null);
          expect(qtl.markerR2).toBe(null);

          expect(qtl.trait).toBeDefined();
          expect(typeof qtl.trait.id).toBe('string');
          expect(typeof qtl.trait.identifier).toBe('string');
          expect(typeof qtl.trait.name).toBe('string');

          expect(qtl.trait.organism).toBeDefined();
          expect(typeof qtl.trait.organism.taxonId).toBe('string');
          expect(typeof qtl.trait.organism.name).toBe('string');
          expect(typeof qtl.trait.organism.genus).toBe('string');
          expect(typeof qtl.trait.organism.species).toBe('string');
          expect(qtl.trait.organism.name).toBe(
            `${qtl.trait.organism.genus} ${qtl.trait.organism.species}`,
          );

          expect(qtl.linkageGroup).toBeDefined();
          expect(qtl.linkageGroup.id).toBeDefined();
          expect(qtl.linkageGroup.identifier).toBeDefined();
          expect(typeof qtl.linkageGroup.id).toBe('string');
          expect(typeof qtl.linkageGroup.identifier).toBe('string');
          expect(typeof qtl.linkageGroup.name).toBe('string');
          expect(typeof qtl.linkageGroup.length).toBe('number');
          expect(qtl.linkageGroup.geneticMap).toBeDefined();
          expect(typeof qtl.linkageGroup.geneticMap.identifier).toBe('string');

          expect(qtl.qtlStudy).toBeDefined();
          expect(typeof qtl.qtlStudy.id).toBe('string');
          expect(typeof qtl.qtlStudy.identifier).toBe('string');
          expect(typeof qtl.qtlStudy.description).toBe('string');

          expect(Array.isArray(qtl.markers)).toBe(true);
          expect(Array.isArray(qtl.dataSets)).toBe(true);
          expect(Array.isArray(qtl.publications)).toBe(true);

          qtl.markers.forEach((marker: any) => {
            expect(typeof marker.identifier).toBe('string');
            expect(typeof marker.name).toBe('string');
          });

          qtl.dataSets.forEach((dataset: any) => {
            expect(typeof dataset.id).toBe('string');
            expect(typeof dataset.name).toBe('string');
            expect(typeof dataset.description).toBe('string');
          });

          qtl.publications.forEach((pub: any) => {
            expect(typeof pub.id).toBe('string');
            expect(typeof pub.doi).toBe('string');
            expect(typeof pub.title).toBe('string');
            expect(typeof pub.year).toBe('number');

            expect(Array.isArray(pub.authors)).toBe(true);
            pub.authors.forEach((author: any) => {
              expect(typeof author.name).toBe('string');
            });
          });
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates qtls() search filters work correctly',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const filteredQTLsQuery = `
        query ValidateQTLFilters($traitName: String, $page: Int, $pageSize: Int) {
          qtls(traitName: $traitName, page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              trait {
                identifier
                name
              }
              linkageGroup {
                identifier
                name
              }
            }
            pageInfo {
              numResults
              currentPage
              pageSize
            }
          }
        }
      `;

        // First get all QTLs to see what trait names exist
        const broadResponse = await executeRealQuery(
          server,
          filteredQTLsQuery,
          {page: 1, pageSize: 15},
          contextValue,
        );

        const broadData = validateSuccessfulResponse(broadResponse);
        const allQTLs = broadData.qtls.results;

        // Get trait names for testing
        const traitNames = allQTLs.map((qtl: any) => qtl.trait.name);
        expect(traitNames.length).toBeGreaterThan(0);

        // Test trait name filter with first available trait
        allQTLs.forEach(async (qtl: any, index: number) => {
          const traitFilterResponse = await executeRealQuery(
            server,
            filteredQTLsQuery,
            {traitName: qtl.trait.name, page: 1, pageSize: 15},
            contextValue,
          );

          const traitFilterData =
            validateSuccessfulResponse(traitFilterResponse);
          const filteredResults = traitFilterData.qtls.results;

          expect(filteredResults.length).toBeGreaterThan(0);

          filteredResults.forEach((filteredQtl: any) => {
            expect(filteredQtl.trait.name).toBe(qtl.trait.name);
          });
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates qtl() individual query consistency',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // First get a list of QTLs
        const qtlsListQuery = `
        query GetQTLsList($page: Int, $pageSize: Int) {
          qtls(page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              start
              end
              trait {
                identifier
                name
              }
              linkageGroup {
                identifier
                name
              }
            }
          }
        }
      `;

        const listResponse = await executeRealQuery(
          server,
          qtlsListQuery,
          {page: 1, pageSize: 15},
          contextValue,
        );

        const listData = validateSuccessfulResponse(listResponse);
        const qtls = listData.qtls.results;

        expect(qtls.length).toBeGreaterThan(0);

        // Test consistency with individual qtl() queries
        qtls.forEach(async (sampleQTL: any) => {
          const individualQuery = `
          query GetIndividualQTL($identifier: ID!) {
            qtl(identifier: $identifier) {
              results {
                identifier
                name
                start
                end
                peak
                lod
                likelihoodRatio
                markerR2
                trait {
                  identifier
                  name
                  organism {
                    taxonId
                    name
                  }
                }
                linkageGroup {
                  identifier
                  name
                  length
                }
                qtlStudy {
                  identifier
                  description
                }
                markers {
                  identifier
                  name
                }
                dataSets {
                  name
                  description
                }
                publications {
                  doi
                  title
                  year
                }
              }
            }
          }
        `;

          const individualResponse = await executeRealQuery(
            server,
            individualQuery,
            {identifier: sampleQTL.identifier},
            contextValue,
          );

          const individualData = validateSuccessfulResponse(individualResponse);
          const individual = individualData.qtl.results;

          // Validate consistency between qtls() and qtl() queries
          expect(individual.identifier).toBe(sampleQTL.identifier);
          expect(individual.name).toBe(sampleQTL.name);
          expect(individual.start).toBe(sampleQTL.start);
          expect(individual.end).toBe(sampleQTL.end);

          expect(individual.trait.identifier).toBe(sampleQTL.trait.identifier);
          expect(individual.trait.name).toBe(sampleQTL.trait.name);

          expect(individual.linkageGroup.identifier).toBe(
            sampleQTL.linkageGroup.identifier,
          );
          expect(individual.linkageGroup.name).toBe(
            sampleQTL.linkageGroup.name,
          );

          // Validate data completeness in individual query
          expect(Array.isArray(individual.markers)).toBe(true);
          expect(Array.isArray(individual.dataSets)).toBe(true);
          expect(Array.isArray(individual.publications)).toBe(true);
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates QTL trait relationships and data quality',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const qtlTraitValidationQuery = `
        query ValidateQTLTraitRelationships($page: Int, $pageSize: Int) {
          qtls(page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
              start
              end
              trait {
                identifier
                name
                qtls {
                  identifier
                  name
                }
                organism {
                  taxonId
                  name
                }
              }
              linkageGroup {
                identifier
                name
                qtls {
                  identifier
                  name
                }
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          qtlTraitValidationQuery,
          {page: 1, pageSize: 15},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const qtls = data.qtls.results;

        // Validate all QTLs have traits
        qtls.forEach((qtl: any) => {
          // Validate QTL position data
          expect(typeof qtl.identifier).toBe('string');
          expect(typeof qtl.name).toBe('string');

          expect(typeof qtl.start).toBe('number');
          expect(qtl.start).toBeGreaterThanOrEqual(0);
          expect(typeof qtl.end).toBe('number');
          expect(qtl.end).toBeGreaterThan(0);
          expect(qtl.start).toBeLessThan(qtl.end);

          expect(qtl.trait).toBeDefined();
          expect(qtl.trait.qtls).toBeDefined();
          expect(Array.isArray(qtl.trait.qtls)).toBe(true);
          const foundInTrait = qtl.trait.qtls.some(
            (traitQtl: any) => traitQtl.identifier === qtl.identifier,
          );
          expect(foundInTrait).toBe(true);

          expect(qtl.linkageGroup).toBeDefined();
          expect(qtl.linkageGroup.qtls).toBeDefined();
          expect(Array.isArray(qtl.linkageGroup.qtls)).toBe(true);
          const foundInLinkageGroup = qtl.linkageGroup.qtls.some(
            (lgQtl: any) => lgQtl.identifier === qtl.identifier,
          );
          expect(foundInLinkageGroup).toBe(true);
        });
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'validates qtls() edge cases and error handling',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const edgeCaseQuery = `
        query QTLsEdgeCases($traitName: String, $page: Int, $pageSize: Int) {
          qtls(traitName: $traitName, page: $page, pageSize: $pageSize) {
            results {
              identifier
              name
            }
            pageInfo {
              numResults
              currentPage
              pageCount
            }
          }
        }
      `;

        // Test empty results case
        const emptyResponse = await executeRealQuery(
          server,
          edgeCaseQuery,
          {traitName: 'NonexistentQTL123456789', page: 1, pageSize: 10},
          contextValue,
        );

        const emptyData = validateSuccessfulResponse(emptyResponse);
        expect(emptyData.qtls.results).toHaveLength(0);
        expect(emptyData.qtls.pageInfo.numResults).toBe(0);
        expect(emptyData.qtls.pageInfo.currentPage).toBe(1);

        // Test individual QTL query with non-existent ID
        const nonExistentQTLQuery = `
        query GetNonExistentQTL($identifier: ID!) {
          qtl(identifier: $identifier) {
            results {
              identifier
              name
            }
          }
        }
      `;

        const nonExistentResponse = await executeRealQuery(
          server,
          nonExistentQTLQuery,
          {identifier: 'NonexistentQTL123456789'},
          contextValue,
        );

        // Should return an error for non-existent QTL
        const errors = nonExistentResponse.body.singleResult.errors;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].message).toBe(
          "QTL with identifier 'NonexistentQTL123456789' not found",
        );
        expect(errors[0].extensions.code).toBe('BAD_USER_INPUT');
        expect(nonExistentResponse.body.singleResult.data.qtl).toBe(null);
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
          {genus: REAL_TEST_CONFIG.KNOWN_GENUS, page: 1, pageSize: 1},
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
        expect(page1.pageInfo.pageSize).toBe(1);
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
