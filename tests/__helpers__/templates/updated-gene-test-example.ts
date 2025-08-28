import {describe, test, expect} from 'vitest';
import {createTestServer, executeQuery} from '../apollo-server.js';
import {server} from '../handlers/index.js'; // New modular handlers
import {
  createSingleEntityTest,
  createRelationshipTest,
  executeTestScenario,
} from './test-scenarios.js';
import {createGeneTestScenario} from '../handlers/entities/gene-handlers.js';

/**
 * UPDATED Gene Query Integration Tests
 *
 * This demonstrates how the original gene.test.ts would be restructured using
 * the new modular architecture with clear biological purposes and reusable patterns.
 *
 * Key improvements:
 * 1. Clear biological context for each test
 * 2. Purpose-driven test descriptions
 * 3. Reusable test scenario templates
 * 4. Consolidated handler imports
 * 5. Biological constraint validation
 */

describe('Gene Query Integration - Central Dogma Testing', () => {
  test('Gene Retrieval by Identifier - Tests Basic Genetic Information Access', async () => {
    // Purpose: Validates retrieval of individual genes by their unique biological identifier
    // Biological context: Genes are the fundamental units of heredity, uniquely identified in databases
    // GraphQL feature: Single entity query with basic field selection
    // Replaces: Original 'fetches gene by identifier successfully' test

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const scenario = createSingleEntityTest(
      'gene',
      'AT1G01010',
      ['identifier', 'symbol', 'description', 'organism'],
      'Central dogma foundation: Genes contain DNA sequences encoding protein instructions',
    );

    const response = await executeTestScenario(
      apolloServer,
      contextValue,
      scenario,
    );

    // Additional biological validation
    if (response.body.kind === 'single' && response.body.singleResult.data) {
      const geneData = response.body.singleResult.data.gene.results;

      // Validate Arabidopsis gene identifier format (TAIR convention)
      expect(geneData.identifier).toMatch(/^AT[1-5]G\d{5}$/);
      expect(geneData.symbol).toBeDefined();
      expect(geneData.description).toContain('protein'); // Should be protein-coding

      // Validate organism relationship
      expect(geneData.organism).toBeDefined();
      expect(geneData.organism.name).toContain('Arabidopsis');
    }
  });

  test('Non-existent Gene Handling - Tests Database Boundary Conditions', async () => {
    // Purpose: Validates graceful handling when requested gene doesn't exist
    // Biological context: Not all gene identifiers exist; queries should handle missing data gracefully
    // GraphQL feature: Error handling and null data responses
    // Replaces: Original 'handles non-existent gene gracefully' test

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    // Use new error handling template
    const query = `
      query TestNonExistentGene($identifier: ID!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            description
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      query,
      {identifier: 'NONEXISTENT_GENE_ID_12345'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    // Should either return null data or errors, but not crash
    if (response.body.singleResult.errors) {
      expect(response.body.singleResult.errors).toBeInstanceOf(Array);
      expect(response.body.singleResult.errors[0].message).toContain(
        'not found',
      );
    } else {
      // If no errors, data should be null or empty
      expect(response.body.singleResult.data.gene.results).toBeNull();
    }
  });

  test('Gene-Organism Relationship - Tests Taxonomic Data Linkage', async () => {
    // Purpose: Validates that genes correctly resolve to their parent organism
    // Biological context: Every gene belongs to a specific organism/species
    // GraphQL feature: Nested field resolution with biological relationships
    // Replaces: Original 'queries nested organism data' test

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const relationshipScenario = createRelationshipTest(
      'gene',
      'organism',
      'AT1G01010',
      'Taxonomic relationship: Genes are specific to organisms and inherit taxonomic classification',
    );

    const response = await executeTestScenario(
      apolloServer,
      contextValue,
      relationshipScenario,
    );

    // Additional taxonomic validation
    if (response.body.kind === 'single' && response.body.singleResult.data) {
      const geneData = response.body.singleResult.data.gene.results;

      expect(geneData.organism).toBeDefined();
      expect(geneData.organism.taxonId).toBe('3702'); // Arabidopsis NCBI taxonomy ID
      expect(geneData.organism.genus).toBe('Arabidopsis');
      expect(geneData.organism.species).toBe('thaliana');
      expect(geneData.organism.name).toBe('Arabidopsis thaliana'); // Binomial nomenclature
    }
  });

  test('Gene Search by Functional Description - Tests Biological Discovery Workflow', async () => {
    // Purpose: Simulates how researchers discover genes by biological function
    // Biological context: Genes are annotated with functional descriptions (GO terms, domains, pathways)
    // GraphQL feature: Full-text search with pagination
    // New test - not in original file

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const searchScenario = createGeneTestScenario('search');
    const query = `
      query SearchGenesByFunction($description: String, $page: Int, $pageSize: Int) {
        genes(description: $description, page: $page, pageSize: $pageSize) {
          results {
            identifier
            symbol
            description
            briefDescription
            organism {
              genus
              species  
            }
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
      apolloServer,
      query,
      {description: searchScenario.searchTerm, page: 1, pageSize: 5},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    if (response.body.singleResult.data) {
      const data = response.body.singleResult.data.genes;

      // Validate search results
      expect(data.results).toHaveLength(searchScenario.expectedCount);
      expect(data.pageInfo.currentPage).toBe(1);
      expect(data.pageInfo.pageSize).toBe(5);

      // Validate biological content
      data.results.forEach((gene: any) => {
        expect(gene.identifier).toMatch(/^AT[1-5]G\d{5}$/); // Arabidopsis format
        expect(gene.description).toContain(
          searchScenario.searchTerm.toLowerCase(),
        ); // Should match search
        expect(gene.organism.genus).toBe('Arabidopsis'); // Should all be from same organism

        // Validate description contains biological information
        const biologicalTerms = [
          'protein',
          'domain',
          'kinase',
          'enzyme',
          'factor',
        ];
        const hasbiologicalTerm = biologicalTerms.some((term) =>
          gene.description.toLowerCase().includes(term),
        );
        expect(hasbiologicalTerm).toBe(true);
      });
    }
  });

  test('Gene Protein Relationships - Tests Central Dogma Implementation', async () => {
    // Purpose: Validates the DNA→RNA→Protein pathway at the data model level
    // Biological context: Each gene produces one or more protein isoforms through splicing
    // GraphQL feature: One-to-many relationship resolution
    // New test - demonstrates protein isoform complexity

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const relationshipScenario = createRelationshipTest(
      'gene',
      'protein',
      'AT1G01010',
      'Central dogma: Genes encode proteins, with alternative splicing creating multiple isoforms',
    );

    // Enhanced query for protein relationships
    const proteinQuery = `
      query GeneProteinRelationships($identifier: ID!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            proteins {
              identifier
              isPrimary
              length
              molecularWeight
              description
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      proteinQuery,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    if (response.body.singleResult.data) {
      const gene = response.body.singleResult.data.gene.results;

      expect(gene.proteins).toBeDefined();
      expect(Array.isArray(gene.proteins)).toBe(true);
      expect(gene.proteins.length).toBeGreaterThan(0);

      // Validate protein isoform biology
      const primaryProteins = gene.proteins.filter((p: any) => p.isPrimary);
      expect(primaryProteins).toHaveLength(1); // Should have exactly one primary isoform

      gene.proteins.forEach((protein: any) => {
        // Validate protein identifier follows gene naming
        expect(protein.identifier).toMatch(
          new RegExp(`^${gene.identifier}\\.\\d+$`),
        );
        expect(protein.length).toBeGreaterThan(50); // Reasonable protein size
        expect(protein.molecularWeight).toBeGreaterThan(5000); // Reasonable molecular weight

        // Primary protein should be longest (biological convention)
        if (protein.isPrimary && gene.proteins.length > 1) {
          const otherProteins = gene.proteins.filter((p: any) => !p.isPrimary);
          otherProteins.forEach((otherProtein: any) => {
            expect(protein.length).toBeGreaterThanOrEqual(otherProtein.length);
          });
        }
      });
    }
  });

  test('Gene Data Biological Constraints - Tests Domain-Specific Validation', async () => {
    // Purpose: Ensures gene data follows biological rules and naming conventions
    // Biological context: Gene identifiers, lengths, and attributes must be biologically plausible
    // GraphQL feature: Data validation with domain constraints
    // New test - focuses on biological data quality

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query ValidateGeneBiology($identifier: ID!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            length
            description
            briefDescription
            assemblyVersion
            annotationVersion
            organism {
              taxonId
              genus
              species
            }
            chromosome {
              primaryIdentifier
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      query,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    if (response.body.singleResult.data) {
      const gene = response.body.singleResult.data.gene.results;

      // Gene identifier validation (TAIR format)
      expect(gene.identifier).toMatch(/^AT[1-5]G\d{5}$/);

      // Gene symbol validation (short, uppercase)
      expect(gene.symbol).toMatch(/^[A-Z][A-Z0-9]{2,9}$/);
      expect(gene.symbol.length).toBeLessThanOrEqual(10);

      // Gene length validation (biologically reasonable)
      expect(gene.length).toBeGreaterThan(100); // Minimum functional gene size
      expect(gene.length).toBeLessThan(100000); // Maximum reasonable gene size

      // Description validation (should be informative)
      expect(gene.description).toBeDefined();
      expect(gene.description.length).toBeGreaterThan(10);
      expect(gene.briefDescription).toBeDefined();

      // Assembly version validation
      expect(gene.assemblyVersion).toBe('TAIR10'); // Current Arabidopsis assembly
      expect(gene.annotationVersion).toMatch(/^v\d+\.\d+$/);

      // Organism validation
      expect(gene.organism.taxonId).toBe('3702');
      expect(gene.organism.genus).toBe('Arabidopsis');
      expect(gene.organism.species).toBe('thaliana');

      // Chromosome validation (Arabidopsis has chromosomes 1-5)
      expect(gene.chromosome.primaryIdentifier).toMatch(/^[1-5]$/);

      // Cross-validation: chromosome in gene ID should match chromosome object
      const chromosomeFromId = gene.identifier.match(/AT([1-5])G/)?.[1];
      expect(gene.chromosome.primaryIdentifier).toBe(chromosomeFromId);
    }
  });
});

/**
 * Performance and Architecture Validation
 */
describe('MSW Handler Performance - New Architecture Benefits', () => {
  test('Query Pattern Matching Performance', async () => {
    // Purpose: Validates that new pre-compiled pattern system is faster than string parsing
    // Technical context: Pattern caching should improve repeated query performance

    const {QueryMatcher} = await import('../handlers/query-matcher.js');

    QueryMatcher.clearCache(); // Clean slate

    const geneQuery = 'Gene.primaryIdentifier = "AT1G01010"';
    const startTime = performance.now();

    // Test repeated pattern matching
    for (let i = 0; i < 100; i++) {
      const pattern = QueryMatcher.matchQuery(geneQuery);
      expect(pattern?.entityType).toBe('gene');
      expect(pattern?.operation).toBe('single');
    }

    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;

    expect(avgTime).toBeLessThan(0.1); // Should be very fast with caching

    const cacheStats = QueryMatcher.getCacheStats();
    expect(cacheStats.size).toBeGreaterThan(0);
  });

  test('Handler Modularity Benefits', async () => {
    // Purpose: Validates that modular handlers can be loaded independently
    // Technical context: New architecture allows selective handler loading

    // Test individual handler imports
    const {geneHandlers} = await import(
      '../handlers/entities/gene-handlers.js'
    );
    const {organismHandlers} = await import(
      '../handlers/entities/organism-handlers.js'
    );
    const {proteinHandlers} = await import(
      '../handlers/entities/protein-handlers.js'
    );

    expect(geneHandlers).toHaveLength(2); // Single and search handlers
    expect(organismHandlers).toHaveLength(2);
    expect(proteinHandlers).toHaveLength(2);

    // Test that handlers are properly structured
    geneHandlers.forEach((handler) => {
      expect(handler).toBeDefined();
      // Each handler should be an HTTP handler
      expect(typeof handler.resolver).toBe('function');
    });
  });
});
