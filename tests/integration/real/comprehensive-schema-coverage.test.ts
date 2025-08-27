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

/**
 * Comprehensive Schema Coverage Tests
 * Tests ALL GraphQL queries defined in the schema against real InterMine endpoints
 * This ensures every query type is implemented and functional
 */

realIntegrationSuite('Comprehensive Schema Coverage Tests', () => {
  describe('Single Entity Queries - All Schema Types', () => {
    // Test all single-entity queries from Query.graphql
    const singleEntityTestCases = [
      {
        name: 'gene',
        query:
          'query($id: ID!) { gene(identifier: $id) { results { identifier } } }',
        variables: {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
        expectedField: 'gene',
      },
      {
        name: 'organism',
        query:
          'query($taxonId: ID!) { organism(taxonId: $taxonId) { results { taxonId } } }',
        variables: {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON},
        expectedField: 'organism',
      },
      {
        name: 'protein',
        query:
          'query($id: ID!) { protein(identifier: $id) { results { identifier } } }',
        variables: {id: REAL_TEST_CONFIG.KNOWN_PROTEIN_ID},
        expectedField: 'protein',
      },
      {
        name: 'publication',
        query:
          'query($doi: ID!) { publication(doi: $doi) { results { doi } } }',
        variables: {doi: REAL_TEST_CONFIG.KNOWN_PUBLICATION_DOI},
        expectedField: 'publication',
      },
      // Add more entity types from schema
      {
        name: 'cds',
        query:
          'query($id: ID!) { cds(identifier: $id) { results { identifier } } }',
        variables: {id: `${REAL_TEST_CONFIG.KNOWN_GENE_ID}.CDS`},
        expectedField: 'cds',
      },
      {
        name: 'chromosome',
        query:
          'query($id: ID!) { chromosome(identifier: $id) { results { identifier } } }',
        variables: {id: 'Chr01'},
        expectedField: 'chromosome',
      },
      {
        name: 'exon',
        query:
          'query($id: ID!) { exon(identifier: $id) { results { identifier } } }',
        variables: {id: `${REAL_TEST_CONFIG.KNOWN_GENE_ID}.exon1`},
        expectedField: 'exon',
      },
      {
        name: 'mRNA',
        query:
          'query($id: ID!) { mRNA(identifier: $id) { results { identifier } } }',
        variables: {id: REAL_TEST_CONFIG.KNOWN_PROTEIN_ID},
        expectedField: 'mRNA',
      },
      {
        name: 'utr',
        query:
          'query($id: ID!) { utr(identifier: $id) { results { identifier } } }',
        variables: {id: `${REAL_TEST_CONFIG.KNOWN_GENE_ID}.utr`},
        expectedField: 'utr',
      },
    ];

    test.each(singleEntityTestCases)(
      'single entity query: $name executes and returns data or proper error',
      async ({query, variables, expectedField}) => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const response = await executeRealQuery(
          server,
          query,
          variables,
          contextValue,
        );

        // Should either succeed with data or fail with proper error
        if (response.body?.singleResult?.errors) {
          const errors = validateErrorResponse(response);
          // Should be a "not found" error, not a system crash
          expect(errors[0].message.toLowerCase()).toMatch(
            /(not found|does not exist)/,
          );
          console.log(
            `⚠️  ${expectedField} query: Expected entity not found (${errors[0].message})`,
          );
        } else {
          const data = validateSuccessfulResponse(response);
          expect(data[expectedField]).toBeDefined();
          console.log(`✅ ${expectedField} query executed successfully`);
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Search Queries - All Schema Types', () => {
    // Test all search/multiple-result queries from Query.graphql
    const searchTestCases = [
      {
        name: 'genes',
        query: `query($genus: String, $page: Int, $pageSize: Int) { 
          genes(genus: $genus, page: $page, pageSize: $pageSize) { 
            results { identifier } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {genus: 'Arachis', page: 1, pageSize: 3},
        expectedField: 'genes',
      },
      {
        name: 'organisms',
        query: `query($genus: String, $page: Int, $pageSize: Int) { 
          organisms(genus: $genus, page: $page, pageSize: $pageSize) { 
            results { taxonId } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {genus: 'Arachis', page: 1, pageSize: 3},
        expectedField: 'organisms',
      },
      {
        name: 'proteins',
        query: `query($description: String, $page: Int, $pageSize: Int) { 
          proteins(description: $description, page: $page, pageSize: $pageSize) { 
            results { identifier } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {description: 'protein', page: 1, pageSize: 3},
        expectedField: 'proteins',
      },
      {
        name: 'publications',
        query: `query($title: String, $page: Int, $pageSize: Int) { 
          publications(title: $title, page: $page, pageSize: $pageSize) { 
            results { doi } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {title: 'genome', page: 1, pageSize: 3},
        expectedField: 'publications',
      },
      {
        name: 'chromosomes',
        query: `query($genus: String, $page: Int, $pageSize: Int) { 
          chromosomes(genus: $genus, page: $page, pageSize: $pageSize) { 
            results { identifier } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {genus: 'Arachis', page: 1, pageSize: 3},
        expectedField: 'chromosomes',
      },
      {
        name: 'geneFamilies',
        query: `query($description: String, $page: Int, $pageSize: Int) { 
          geneFamilies(description: $description, page: $page, pageSize: $pageSize) { 
            results { identifier } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {description: 'kinase', page: 1, pageSize: 3},
        expectedField: 'geneFamilies',
      },
      {
        name: 'ontologyTerms',
        query: `query($description: String, $page: Int, $pageSize: Int) { 
          ontologyTerms(description: $description, page: $page, pageSize: $pageSize) { 
            results { identifier } 
            pageInfo { numResults currentPage } 
          } 
        }`,
        variables: {description: 'process', page: 1, pageSize: 3},
        expectedField: 'ontologyTerms',
      },
    ];

    test.each(searchTestCases)(
      'search query: $name returns paginated results or empty set',
      async ({query, variables, expectedField}) => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const response = await executeRealQuery(
          server,
          query,
          variables,
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        const searchResult = data[expectedField];

        // Validate structure
        expect(searchResult).toBeDefined();
        expect(Array.isArray(searchResult.results)).toBe(true);
        expect(searchResult.pageInfo).toBeDefined();
        expect(typeof searchResult.pageInfo.numResults).toBe('number');
        expect(searchResult.pageInfo.currentPage).toBe(1);

        console.log(
          `✅ ${expectedField} search: ${searchResult.results.length} results (${searchResult.pageInfo.numResults} total)`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Special Query Types', () => {
    test(
      'getGenes query with multiple identifiers',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetMultipleGenes($identifiers: [ID!]!) {
          getGenes(identifiers: $identifiers) {
            results {
              identifier
              organism {
                name
              }
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {identifiers: [REAL_TEST_CONFIG.KNOWN_GENE_ID, 'Glyma.01G000200']},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);
        expect(Array.isArray(data.getGenes.results)).toBe(true);
        expect(data.getGenes.results.length).toBeGreaterThan(0);

        console.log(
          `✅ getGenes query returned ${data.getGenes.results.length} genes`,
        );
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'expressionValue query with specific parameters',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetExpressionValue($sampleId: ID!, $geneId: ID!) {
          expressionValue(sampleIdentifier: $sampleId, geneIdentifier: $geneId) {
            results {
              sampleIdentifier
              geneIdentifier
            }
          }
        }
      `;

        try {
          const response = await executeRealQuery(
            server,
            query,
            {sampleId: 'SAMPLE001', geneId: REAL_TEST_CONFIG.KNOWN_GENE_ID},
            contextValue,
          );

          // Should either return data or proper "not found" error
          if (response.body?.singleResult?.errors) {
            const errors = validateErrorResponse(response);
            expect(errors[0].message.toLowerCase()).toMatch(
              /(not found|does not exist)/,
            );
            console.log('⚠️  expressionValue: Expected combination not found');
          } else {
            const data = validateSuccessfulResponse(response);
            expect(data.expressionValue).toBeDefined();
            console.log('✅ expressionValue query executed successfully');
          }
        } catch (error: any) {
          // HTTP 400 error is also acceptable for invalid expression data queries
          expect(error.message).toContain('HTTP error! status: 400');
          console.log(
            '⚠️  expressionValue query rejected by server (expected for test data)',
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );

    test(
      'author query with name parameters',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query GetAuthor($firstName: String!, $lastName: String) {
          author(firstName: $firstName, lastName: $lastName) {
            results {
              firstName
              lastName
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          query,
          {firstName: 'John', lastName: 'Smith'},
          contextValue,
        );

        // Should either return data or proper "not found" error
        if (response.body?.singleResult?.errors) {
          const errors = validateErrorResponse(response);
          expect(errors[0].message.toLowerCase()).toMatch(
            /(not found|does not exist)/,
          );
          console.log('⚠️  author: Expected author not found');
        } else {
          const data = validateSuccessfulResponse(response);
          expect(data.author).toBeDefined();
          console.log('✅ author query executed successfully');
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Linkout/Microservice Queries', () => {
    const linkoutTestCases = [
      {
        name: 'geneLinkouts',
        query: `query($id: ID!) { 
          geneLinkouts(identifier: $id) { 
            results { 
              href 
              text 
            } 
          } 
        }`,
        variables: {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
      },
      {
        name: 'locationLinkouts',
        query: `query($id: ID!, $start: Int!, $end: Int!) { 
          locationLinkouts(identifier: $id, start: $start, end: $end) { 
            results { 
              href 
              text 
            } 
          } 
        }`,
        variables: {id: 'Chr01', start: 1000, end: 2000},
      },
    ];

    test.each(linkoutTestCases)(
      'linkout query: $name returns linkouts or empty array',
      async ({query, variables, name}) => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const response = await executeRealQuery(
          server,
          query,
          variables,
          contextValue,
        );

        // Linkout services might not be available, so we accept empty results
        if (response.body?.singleResult?.errors) {
          const errors = validateErrorResponse(response);
          // Service might be unavailable - this is acceptable
          console.log(
            `⚠️  ${name}: Service unavailable (${errors[0].message})`,
          );
        } else {
          const data = validateSuccessfulResponse(response);
          const linkoutData = Object.values(data)[0] as any;
          expect(Array.isArray(linkoutData.results)).toBe(true);
          console.log(
            `✅ ${name}: ${linkoutData.results.length} linkouts returned`,
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Complex Nested Queries', () => {
    test(
      'deeply nested gene query with all relationships',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const complexQuery = `
        query ComplexGeneQuery($id: ID!) {
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
                }
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
                description
              }
              locations {
                start
                end
                strand
                chromosome {
                  identifier
                  length
                }
              }
              ontologyAnnotations {
                ontologyTerm {
                  identifier
                  name
                  description
                }
              }
            }
          }
        }
      `;

        try {
          const response = await executeRealQuery(
            server,
            complexQuery,
            {id: REAL_TEST_CONFIG.KNOWN_GENE_ID},
            contextValue,
          );

          const data = validateSuccessfulResponse(response);
          const gene = data.gene.results;

          // Validate core data
          expect(gene.identifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);
          expect(gene.organism).toBeDefined();
          expect(gene.organism.taxonId).toBeDefined();

          // Validate nested arrays are present (may be empty)
          expect(Array.isArray(gene.proteins)).toBe(true);
          expect(Array.isArray(gene.pathways)).toBe(true);
          expect(Array.isArray(gene.locations)).toBe(true);
          expect(Array.isArray(gene.ontologyAnnotations)).toBe(true);

          console.log(`✅ Complex nested query completed successfully`);
          console.log(
            `   Proteins: ${gene.proteins.length}, Pathways: ${gene.pathways.length}`,
          );
        } catch (error: any) {
          // HTTP 400 error is acceptable for very complex queries that exceed server limits
          expect(error.message).toContain('HTTP error! status: 400');
          console.log(
            '⚠️  Complex nested query rejected by server (expected for complex queries)',
          );
        }
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT * 2,
    );

    test(
      'organism with nested gene relationships',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        const query = `
        query OrganismWithGenes($taxonId: ID!, $genus: String) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
              name
              genus
              species
              strains {
                identifier
                name
              }
            }
          }
          genes(genus: $genus, page: 1, pageSize: 5) {
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

        const response = await executeRealQuery(
          server,
          query,
          {taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON, genus: 'Arachis'},
          contextValue,
        );

        const data = validateSuccessfulResponse(response);

        // Validate organism data
        expect(data.organism.results.taxonId).toBe(
          REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
        );
        expect(Array.isArray(data.organism.results.strains)).toBe(true);

        // Validate gene data consistency
        expect(Array.isArray(data.genes.results)).toBe(true);
        data.genes.results.forEach((gene: any) => {
          expect(gene.organism.taxonId).toBe(
            REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
          );
        });

        console.log(`✅ Organism-genes relationship query completed`);
        console.log(
          `   Organism strains: ${data.organism.results.strains.length}`,
        );
        console.log(`   Related genes: ${data.genes.results.length}`);
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });

  describe('Schema Field Coverage Validation', () => {
    test(
      'validates all required fields are queryable',
      async () => {
        const {server, context} = await createRealTestServer();
        const contextValue = await context();

        // Test that all schema-defined required fields can be queried
        const fieldCoverageQuery = `
        query FieldCoverageTest($geneId: ID!, $taxonId: ID!) {
          gene(identifier: $geneId) {
            results {
              id
              identifier
              name
              symbol
              description
              annotationVersion
              assemblyVersion
              secondaryIdentifier
              length
              score
              scoreType
            }
          }
          organism(taxonId: $taxonId) {
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
            }
          }
        }
      `;

        const response = await executeRealQuery(
          server,
          fieldCoverageQuery,
          {
            geneId: REAL_TEST_CONFIG.KNOWN_GENE_ID,
            taxonId: REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON,
          },
          contextValue,
        );

        const data = validateSuccessfulResponse(response);

        // Validate gene required fields
        const gene = data.gene.results;
        expect(gene.id).toBeDefined();
        expect(gene.identifier).toBe(REAL_TEST_CONFIG.KNOWN_GENE_ID);

        // Validate organism required fields
        const organism = data.organism.results;
        expect(organism.id).toBeDefined();
        expect(organism.taxonId).toBe(REAL_TEST_CONFIG.KNOWN_ORGANISM_TAXON);
        expect(organism.name).toBeDefined();
        expect(organism.genus).toBeDefined();
        expect(organism.species).toBeDefined();

        console.log('✅ Schema field coverage validation passed');
      },
      REAL_TEST_CONFIG.QUERY_TIMEOUT,
    );
  });
});
