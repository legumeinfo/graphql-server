/**
 * Core Relationship Testing Suite - Phase 2
 *
 * Comprehensive testing of single-hop relationships using the new
 * Phase 2 infrastructure with direct resolution, collection management,
 * and enhanced validation capabilities.
 */

import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import {setupServer} from 'msw/node';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';
import {createBiologicalTestGraph} from '../../__helpers__/biological-graph.js';
import {createSmartHandlers} from '../../__helpers__/smart-handler.js';
import {createDirectRelationshipResolver} from '../../__helpers__/direct-relationship-resolver.js';
import {createCollectionRelationshipManager} from '../../__helpers__/collection-relationship-manager.js';
import {
  createEnhancedRelationshipValidators,
  ValidationContext,
} from '../../__helpers__/enhanced-relationship-validators.js';

// Phase 2 infrastructure setup
const testRegistry = createBiologicalTestGraph();
const relationshipResolver = createDirectRelationshipResolver(testRegistry);
const collectionManager = createCollectionRelationshipManager(
  testRegistry,
  relationshipResolver,
);
const validationContext: ValidationContext = {
  registry: testRegistry,
  resolver: relationshipResolver,
  collectionManager,
};
const enhancedValidators =
  createEnhancedRelationshipValidators(validationContext);

const smartHandlers = createSmartHandlers(testRegistry);
const smartServer = setupServer(...smartHandlers);

describe('Core GraphQL Relationship Resolution - Phase 2', () => {
  beforeAll(() => {
    console.log(
      'Phase 2: Starting core relationship testing with enhanced infrastructure',
    );
    console.log('Registry stats:', testRegistry.getStats());
    console.log(
      'Relationship resolver stats:',
      relationshipResolver.getRelationshipStats(),
    );
    smartServer.listen({onUnhandledRequest: 'warn'});
  });

  afterAll(() => {
    smartServer.close();
  });

  describe('Direct Relationship Resolution', () => {
    test('resolves Gene -> Organism direct relationship with enhanced validation', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestGeneOrganismDirect {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              name
              organism {
                taxonId
                name
                genus
                species
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Test with enhanced validation
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];
        const validationResult = enhancedValidators.validateDirectRelationship(
          geneEntity,
          'organism',
          {
            validator: (organism) => {
              expect(organism.taxonId).toBe('3702');
              expect(organism.name).toBe('Arabidopsis thaliana');
              expect(organism.genus).toBe('Arabidopsis');
              expect(organism.species).toBe('thaliana');
            },
            description: 'Gene -> Organism enhanced validation',
            performanceThreshold: 50,
            validateIntegrity: true,
            strictTypeChecking: true,
          },
        );

        expect(validationResult.success).toBe(true);
        expect(validationResult.entityCount).toBe(1);
        expect(validationResult.errors).toHaveLength(0);
        console.log(
          `Gene -> Organism validation completed in ${validationResult.validationTime}ms`,
        );

        // Validate GraphQL response matches expectations
        expect(gene.identifier).toBe('AT1G01010');
        expect(gene.organism.taxonId).toBe('3702');
        expect(gene.organism.name).toBe('Arabidopsis thaliana');
      }
    });

    test('resolves Protein -> Gene direct relationship with bidirectional consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestProteinGeneDirect {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              name
              molecularWeight
              gene {
                identifier
                name
                length
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const protein = response.body.singleResult.data.protein.results;

        // Test bidirectional consistency
        const proteinEntity = testRegistry.getEntitiesByType('Protein')[0];
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];

        const bidirectionalResult =
          enhancedValidators.validateBidirectionalConsistency(
            proteinEntity,
            geneEntity,
            'gene',
            'proteins',
            {
              description: 'Protein <-> Gene bidirectional consistency',
              validateIntegrity: true,
            },
          );

        expect(bidirectionalResult.success).toBe(true);
        expect(bidirectionalResult.errors).toHaveLength(0);
        console.log(
          `Bidirectional validation: ${bidirectionalResult.metadata.forwardCount} forward, ${bidirectionalResult.metadata.reverseCount} reverse`,
        );

        // Validate GraphQL response
        expect(protein.identifier).toBe('AT1G01010.1');
        expect(protein.gene.identifier).toBe('AT1G01010');
        expect(typeof protein.molecularWeight).toBe('number');
      }
    });

    test('resolves QTL -> Trait -> Organism relationship chain', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestQTLTraitOrganismChain {
          qtl(identifier: "QTL001") {
            results {
              identifier
              name
              lod
              trait {
                identifier
                name
                organism {
                  taxonId
                  name
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const qtl = response.body.singleResult.data.qtl.results;

        // Test relationship chain validation
        const qtlEntity = testRegistry.getEntitiesByType('QTL')[0];
        const chainResult = enhancedValidators.validateRelationshipChain(
          qtlEntity,
          ['trait', 'organism'],
          {
            validator: (organism) => {
              expect(organism.taxonId).toBe('3702');
              expect(organism.name).toBe('Arabidopsis thaliana');
            },
            description: 'QTL -> Trait -> Organism chain',
            performanceThreshold: 100,
            validateIntegrity: true,
          },
        );

        expect(chainResult.success).toBe(true);
        expect(chainResult.entityCount).toBe(1);
        expect(chainResult.metadata.step1Count).toBe(1); // QTL -> Trait
        expect(chainResult.metadata.step2Count).toBe(1); // Trait -> Organism
        console.log(
          `Chain validation completed in ${chainResult.validationTime}ms`,
        );

        // Validate GraphQL response
        expect(qtl.identifier).toBe('QTL001');
        expect(typeof qtl.lod).toBe('number');
        expect(qtl.trait.organism.taxonId).toBe('3702');
      }
    });
  });

  describe('Collection Relationship Resolution', () => {
    test('resolves Gene -> Transcripts collection with pagination', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestGeneTranscriptsCollection {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              transcripts {
                identifier
                length
                gene {
                  identifier
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Test collection with enhanced validation
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];
        const collectionResult =
          enhancedValidators.validateCollectionRelationship(
            geneEntity,
            'transcripts',
            {
              minCount: 1,
              validator: (transcript) => {
                expect(typeof transcript.identifier).toBe('string');
                expect(typeof transcript.length).toBe('number');
                expect(transcript.length).toBeGreaterThan(0);
              },
              description: 'Gene -> Transcripts collection',
              testPagination: true,
              testSorting: true,
              pageSize: 5,
              performanceThreshold: 150,
              validateReverse: true,
            },
          );

        expect(collectionResult.success).toBe(true);
        expect(collectionResult.entityCount).toBeGreaterThan(0);
        expect(collectionResult.metadata.paginationTested).toBe(true);
        expect(collectionResult.metadata.sortingTested).toBe(true);
        console.log(
          `Collection validation: ${collectionResult.entityCount} entities in ${collectionResult.validationTime}ms`,
        );

        // Validate GraphQL response
        expect(Array.isArray(gene.transcripts)).toBe(true);
        expect(gene.transcripts.length).toBeGreaterThan(0);
        expect(gene.transcripts[0].gene.identifier).toBe(gene.identifier);
      }
    });

    test('resolves Organism -> Genes collection with filtering and summary', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestOrganismGenesCollection {
          organism(taxonId: "3702") {
            results {
              taxonId
              name
              genes {
                identifier
                name
                length
                organism {
                  taxonId
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const organism = response.body.singleResult.data.organism.results;

        // Test collection summary and filtering
        const organismEntity = testRegistry.getEntitiesByType('Organism')[0];

        // Get collection summary
        const summary = collectionManager.getCollectionSummary(
          organismEntity,
          'genes',
          {textSearch: 'NAC'},
        );

        console.log('Collection summary:', {
          total: summary.totalCount,
          filtered: summary.filteredCount,
          types: summary.uniqueTypes,
          lengthStats: summary.fieldStatistics.length,
        });

        // Test paginated access
        const page1 = collectionManager.getPage(organismEntity, 'genes', 1, 2);
        const page2 = collectionManager.getPage(organismEntity, 'genes', 2, 2);

        expect(page1.entities.length).toBeLessThanOrEqual(2);
        expect(page1.pagination.hasNext).toBe(page1.pagination.totalCount > 2);
        expect(page2.pagination.hasPrevious).toBe(true);

        // Validate GraphQL response
        expect(organism.taxonId).toBe('3702');
        expect(Array.isArray(organism.genes)).toBe(true);
        expect(organism.genes.length).toBeGreaterThan(0);

        // Validate back-references
        organism.genes.forEach((gene) => {
          expect(gene.organism.taxonId).toBe('3702');
        });
      }
    });

    test('resolves Gene -> Proteins collection with type validation', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestGeneProteinsCollection {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              proteins {
                identifier
                molecularWeight
                length
                isPrimary
                sequence {
                  length
                  md5checksum
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Test collection with strict type checking
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];
        const collectionResult =
          enhancedValidators.validateCollectionRelationship(
            geneEntity,
            'proteins',
            {
              minCount: 1,
              validator: (protein) => {
                expect(typeof protein.identifier).toBe('string');
                expect(typeof protein.molecularWeight).toBe('number');
                expect(typeof protein.length).toBe('number');
                expect(typeof protein.isPrimary).toBe('boolean');
                expect(protein.molecularWeight).toBeGreaterThan(0);
                expect(protein.length).toBeGreaterThan(0);
              },
              description: 'Gene -> Proteins with type validation',
              strictTypeChecking: true,
              validateIntegrity: true,
              testFiltering: true,
            },
          );

        expect(collectionResult.success).toBe(true);
        expect(collectionResult.warnings.length).toBeLessThan(3); // Allow some warnings
        console.log(
          `Type validation: ${collectionResult.entityCount} proteins, ${collectionResult.warnings.length} warnings`,
        );

        // Validate GraphQL response structure
        expect(Array.isArray(gene.proteins)).toBe(true);
        expect(gene.proteins.length).toBeGreaterThan(0);

        const protein = gene.proteins[0];
        expect(typeof protein.molecularWeight).toBe('number');
        expect(typeof protein.length).toBe('number');
        expect(typeof protein.isPrimary).toBe('boolean');
        expect(protein.sequence).toBeDefined();
        expect(typeof protein.sequence.length).toBe('number');
        expect(typeof protein.sequence.md5checksum).toBe('string');
      }
    });
  });

  describe('Optional Relationship Handling', () => {
    test('gracefully handles optional relationships (supercontig, location)', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestOptionalRelationships {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              supercontig {
                identifier
              }
              chromosomeLocation {
                start
                end
                strand
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Test optional relationship validation
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];

        const supercontigResult = enhancedValidators.validateDirectRelationship(
          geneEntity,
          'supercontig',
          {
            allowNull: true,
            validator: (supercontig) => {
              if (supercontig) {
                expect(typeof supercontig.identifier).toBe('string');
              }
            },
            description: 'Gene -> Supercontig optional relationship',
          },
        );

        const locationResult = enhancedValidators.validateDirectRelationship(
          geneEntity,
          'chromosomeLocation',
          {
            allowNull: true,
            validator: (location) => {
              if (location) {
                expect(typeof location.start).toBe('number');
                expect(typeof location.end).toBe('number');
                expect(location.end).toBeGreaterThan(location.start);
              }
            },
            description: 'Gene -> Location optional relationship',
          },
        );

        // Both should succeed regardless of whether relationships exist
        expect(supercontigResult.success).toBe(true);
        expect(locationResult.success).toBe(true);

        console.log(
          `Optional relationships: supercontig=${supercontigResult.entityCount}, location=${locationResult.entityCount}`,
        );

        // GraphQL response can have null values for optional relationships
        expect(gene.identifier).toBe('AT1G01010');
        // supercontig and chromosomeLocation may be null, and that's okay
      }
    });
  });

  describe('Performance and Validation Metrics', () => {
    test('measures relationship resolution performance', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const startTime = Date.now();

      const response = await executeQuery(
        server,
        `query TestPerformanceMetrics {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                taxonId
                name
              }
              proteins {
                identifier
                molecularWeight
              }
              transcripts {
                identifier
                length
              }
              sequence {
                length
                md5checksum
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      const queryTime = Date.now() - startTime;
      console.log(`Complex relationship query completed in ${queryTime}ms`);

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate that all relationships resolved correctly
        expect(gene.organism).toBeDefined();
        expect(Array.isArray(gene.proteins)).toBe(true);
        expect(Array.isArray(gene.transcripts)).toBe(true);
        expect(gene.sequence).toBeDefined();

        // Test performance thresholds
        expect(queryTime).toBeLessThan(500); // Should complete within 500ms

        // Get resolver statistics
        const resolverStats = relationshipResolver.getRelationshipStats();
        console.log('Relationship resolver statistics:', resolverStats);

        expect(resolverStats.totalConfigs).toBeGreaterThan(10);
        expect(resolverStats.entityTypes).toBeGreaterThan(5);
      }
    });

    test('validates relationship configuration completeness', async () => {
      // Test that all major entity types have proper relationship configurations
      const entityTypes = [
        'Gene',
        'Protein',
        'Transcript',
        'Organism',
        'QTL',
        'Trait',
      ];

      entityTypes.forEach((entityType) => {
        const availableRelationships =
          relationshipResolver.getAvailableRelationships(entityType);

        expect(availableRelationships.length).toBeGreaterThan(0);
        console.log(
          `${entityType} has ${availableRelationships.length} configured relationships:`,
          availableRelationships.map((r) => r.relationshipName),
        );

        // Test that each relationship has proper configuration
        availableRelationships.forEach((config) => {
          expect(config.sourceType).toBe(entityType);
          expect(typeof config.isCollection).toBe('boolean');
          expect(typeof config.isOptional).toBe('boolean');
          expect(config.targetType).toBeTruthy();
          expect(config.relationshipName).toBeTruthy();
        });
      });
    });
  });
});
