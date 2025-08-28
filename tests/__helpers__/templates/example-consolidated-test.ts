import {describe, test, expect, beforeEach} from 'vitest';
import {createTestServer, executeQuery} from '../apollo-server.js';
import {server} from '../handlers/index.js';
import {
  standardTestSuites,
  executeTestScenario,
  createBiologicalValidationTest,
  createRelationshipTest,
} from './test-scenarios.js';
import {createGeneTestScenario} from '../handlers/entities/gene-handlers.js';
import {createOrganismTestScenario} from '../handlers/entities/organism-handlers.js';
import {createProteinTestScenario} from '../handlers/entities/protein-handlers.js';

/**
 * Example of consolidated test architecture
 * Purpose: Demonstrate how to use the new modular system for biological data testing
 *
 * This file shows:
 * 1. How to use test scenario templates
 * 2. How to leverage biological entity factories
 * 3. How to write clear, purpose-driven tests
 * 4. How to validate biological constraints
 */

describe('Consolidated Biological Entity Testing', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('Gene Testing Suite', () => {
    test('Single Gene Retrieval - Tests Central Dogma Foundation', async () => {
      // Purpose: Validates that genes (DNA) can be retrieved with correct biological metadata
      // Biological context: Genes are the fundamental units of heredity containing instructions for proteins
      // GraphQL feature: Single entity query with nested organism relationship

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const scenario = standardTestSuites.gene.scenarios[0]; // Single gene test
      await executeTestScenario(apolloServer, contextValue, scenario);
    });

    test('Gene-Protein Relationship - Tests Central Dogma Flow', async () => {
      // Purpose: Validates the DNA → RNA → Protein flow at the data model level
      // Biological context: Each gene should connect to its protein products (isoforms)
      // GraphQL feature: Nested field resolution with one-to-many relationships

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const relationshipScenario = createRelationshipTest(
        'gene',
        'protein',
        'AT1G01010',
        'Central dogma: Genes encode multiple protein isoforms through alternative splicing',
      );

      await executeTestScenario(
        apolloServer,
        contextValue,
        relationshipScenario,
      );
    });

    test('Gene Search with Functional Annotation - Tests Biological Discovery', async () => {
      // Purpose: Simulates how researchers find genes by functional keywords
      // Biological context: Genes are annotated with functional descriptions (GO terms, domains)
      // GraphQL feature: Full-text search with biological term matching

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
              numResults
              currentPage
              hasNextPage
            }
          }
        }
      `;

      const response = await executeQuery(
        apolloServer,
        query,
        {description: searchScenario.searchTerm, page: 1, pageSize: 10},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const data = response.body.singleResult.data.genes;
        expect(data.results).toHaveLength(searchScenario.expectedCount);

        // Validate biological content
        data.results.forEach((gene: any) => {
          expect(gene.identifier).toMatch(/^AT[1-5]G\d{5}$/); // Arabidopsis gene format
          expect(gene.description).toContain('protein'); // Should be protein-coding
          expect(gene.organism.genus).toBe('Arabidopsis');
        });
      }
    });

    test('Gene Biological Constraint Validation', async () => {
      // Purpose: Ensures gene data follows biological rules and formats
      // Biological context: Gene identifiers follow species-specific conventions
      // GraphQL feature: Data validation with domain-specific constraints

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const validationScenario = createBiologicalValidationTest(
        'gene',
        {
          identifier: (val: string) => /^AT[1-5]G\d{5}$/.test(val), // TAIR gene ID format
          length: (val: number) => val > 100 && val < 100000, // Reasonable gene length
          symbol: (val: string) => val.length >= 3 && val.length <= 10, // Gene symbol format
        },
        'Gene data must conform to Arabidopsis TAIR naming conventions and biological constraints',
      );

      await executeTestScenario(apolloServer, contextValue, validationScenario);
    });
  });

  describe('Protein Testing Suite', () => {
    test('Protein Size Variations - Tests Biological Diversity', async () => {
      // Purpose: Validates handling of protein size diversity from peptides to large complexes
      // Biological context: Proteins range from small hormones (50 aa) to large enzymes (2000+ aa)
      // GraphQL feature: Numeric field validation and range queries

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const sizeScenario = createProteinTestScenario('size_variations');
      const query = `
        query ProteinSizeVariations($description: String) {
          proteins(description: $description, page: 1, pageSize: 10) {
            results {
              identifier
              length
              molecularWeight
              description
            }
          }
        }
      `;

      const response = await executeQuery(
        apolloServer,
        query,
        {description: sizeScenario.searchTerm},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const proteins = response.body.singleResult.data.proteins.results;
        expect(proteins).toHaveLength(sizeScenario.expectedCount);

        // Validate biological size relationships
        proteins.forEach((protein: any) => {
          const avgAAWeight = protein.molecularWeight / protein.length;
          expect(avgAAWeight).toBeGreaterThan(80); // Minimum reasonable amino acid weight
          expect(avgAAWeight).toBeLessThan(150); // Maximum reasonable amino acid weight
          expect(protein.length).toBeGreaterThan(10); // Minimum protein size
        });

        // Find size extremes
        const lengths = proteins
          .map((p: any) => p.length)
          .sort((a: number, b: number) => a - b);
        const smallest = lengths[0];
        const largest = lengths[lengths.length - 1];

        expect(smallest).toBeLessThan(100); // Should have small proteins
        expect(largest).toBeGreaterThan(1000); // Should have large proteins
      }
    });

    test('Protein Isoform Relationships - Tests Alternative Splicing', async () => {
      // Purpose: Validates protein isoform data structure and primary/alternative designation
      // Biological context: One gene produces multiple protein variants through alternative splicing
      // GraphQL feature: Complex relationship queries with boolean flags

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const isoformScenario = createProteinTestScenario('isoforms');
      const query = `
        query ProteinIsoforms($geneIdentifier: String) {
          gene(identifier: $geneIdentifier) {
            results {
              identifier
              proteins {
                identifier
                isPrimary
                length
                description
              }
            }
          }
        }
      `;

      const response = await executeQuery(
        apolloServer,
        query,
        {geneIdentifier: isoformScenario.geneIdentifier},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;
        const proteins = gene.proteins;

        expect(proteins).toHaveLength(isoformScenario.expectedIsoformCount);

        // Validate isoform constraints
        const primaryProteins = proteins.filter((p: any) => p.isPrimary);
        const alternativeProteins = proteins.filter((p: any) => !p.isPrimary);

        expect(primaryProteins).toHaveLength(
          isoformScenario.expectedPrimaryCount,
        );
        expect(alternativeProteins).toHaveLength(
          isoformScenario.expectedAlternativeCount,
        );

        // Primary protein should be longest (biological convention)
        if (primaryProteins.length > 0 && alternativeProteins.length > 0) {
          const primaryLength = primaryProteins[0].length;
          const maxAlternativeLength = Math.max(
            ...alternativeProteins.map((p: any) => p.length),
          );
          expect(primaryLength).toBeGreaterThanOrEqual(maxAlternativeLength);
        }
      }
    });
  });

  describe('Cross-Entity Biological Validation', () => {
    test('Organism Taxonomic Hierarchy - Tests Biological Classification', async () => {
      // Purpose: Validates that taxonomic data follows biological naming conventions
      // Biological context: Binomial nomenclature (Genus species) with proper capitalization
      // GraphQL feature: String validation with biological domain rules

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const taxonomyScenario = createOrganismTestScenario('multi_species');
      const query = `
        query TaxonomicValidation($searchTerm: String) {
          organisms(genus: $searchTerm, page: 1, pageSize: 10) {
            results {
              taxonId
              name
              genus
              species
              abbreviation
              description
            }
          }
        }
      `;

      const response = await executeQuery(
        apolloServer,
        query,
        {searchTerm: taxonomyScenario.searchTerm},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const organisms = response.body.singleResult.data.organisms.results;
        expect(organisms.length).toBeGreaterThan(0);

        organisms.forEach((organism: any) => {
          // Validate taxonomic naming conventions
          expect(organism.genus).toMatch(/^[A-Z][a-z]+$/); // Capitalized genus
          expect(organism.species).toMatch(/^[a-z]+$/); // Lowercase species
          expect(organism.name).toBe(`${organism.genus} ${organism.species}`); // Binomial name
          expect(organism.taxonId).toMatch(/^\d+$/); // Numeric NCBI taxonomy ID
          expect(organism.abbreviation).toMatch(/^[A-Z]+$/); // Uppercase abbreviation
        });

        // Validate expected genera are present
        const genera = organisms.map((org: any) => org.genus);
        taxonomyScenario.expectedGenera.forEach((expectedGenus: string) => {
          expect(genera).toContain(expectedGenus);
        });
      }
    });

    test('Gene-Organism-Protein Consistency - Tests Multi-Entity Relationships', async () => {
      // Purpose: Validates that related entities maintain consistent biological relationships
      // Biological context: Gene, protein, and organism must share taxonomic information
      // GraphQL feature: Complex nested queries with cross-entity validation

      const {server: apolloServer, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query MultiEntityConsistency($geneId: ID!) {
          gene(identifier: $geneId) {
            results {
              identifier
              organism {
                taxonId
                genus
                species
              }
              proteins {
                identifier
                organism {
                  taxonId
                  genus
                  species  
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(
        apolloServer,
        query,
        {geneId: 'AT1G01010'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate gene-organism consistency
        expect(gene.organism.taxonId).toBeDefined();
        expect(gene.organism.genus).toBeDefined();

        // Validate protein-organism consistency (should match gene's organism)
        if (gene.proteins && gene.proteins.length > 0) {
          gene.proteins.forEach((protein: any) => {
            expect(protein.organism.taxonId).toBe(gene.organism.taxonId);
            expect(protein.organism.genus).toBe(gene.organism.genus);
            expect(protein.organism.species).toBe(gene.organism.species);
          });
        }
      }
    });
  });
});

/**
 * Performance and Edge Case Testing
 */
describe('MSW Performance and Edge Cases', () => {
  test('Handler Cache Performance', async () => {
    // Purpose: Validates that query pattern caching improves performance
    // Technical context: Pre-compiled patterns should match faster than string parsing

    const {QueryMatcher} = await import('../handlers/query-matcher.js');

    // Clear cache for clean test
    QueryMatcher.clearCache();

    const sampleQuery = 'Gene.primaryIdentifier = "AT1G01010"';
    const iterations = 1000;

    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      const pattern = QueryMatcher.matchQuery(sampleQuery);
      expect(pattern).toBeDefined();
      expect(pattern?.entityType).toBe('gene');
    }
    const endTime = performance.now();

    const avgTimePerMatch = (endTime - startTime) / iterations;
    expect(avgTimePerMatch).toBeLessThan(1); // Should be very fast with caching

    const cacheStats = QueryMatcher.getCacheStats();
    expect(cacheStats.size).toBeGreaterThan(0);
  });

  test('Concurrent Request Handling', async () => {
    // Purpose: Validates that MSW handlers can process multiple concurrent requests
    // Technical context: Biological databases receive many simultaneous queries

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query ConcurrentTest($identifier: ID!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
          }
        }
      }
    `;

    // Create 10 concurrent requests with different gene IDs
    const requests = Array.from({length: 10}, (_, i) =>
      executeQuery(
        apolloServer,
        query,
        {
          identifier: `AT${Math.ceil((i + 1) / 2)}G0${String(i + 1).padStart(4, '0')}`,
        },
        contextValue,
      ),
    );

    const responses = await Promise.all(requests);

    // All requests should complete successfully
    responses.forEach((response, index) => {
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (response.body.singleResult.data) {
        const geneData = response.body.singleResult.data.gene.results;
        expect(geneData.identifier).toBeDefined();
      }
    });
  });
});
