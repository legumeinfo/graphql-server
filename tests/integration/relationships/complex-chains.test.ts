/**
 * Complex Relationship Chains Testing Suite - Phase 3
 *
 * Advanced testing of multi-hop relationships, bidirectional consistency,
 * and cross-entity validation using the Phase 3 infrastructure for
 * comprehensive relationship integrity testing.
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
import {createMultiHopResolver} from '../../__helpers__/multi-hop-resolver.js';
import {createBidirectionalConsistencyChecker} from '../../__helpers__/bidirectional-consistency-checker.js';

// Phase 3 infrastructure setup
const testRegistry = createBiologicalTestGraph();
const relationshipResolver = createDirectRelationshipResolver(testRegistry);
const multiHopResolver = createMultiHopResolver(
  testRegistry,
  relationshipResolver,
);
const consistencyChecker = createBidirectionalConsistencyChecker(
  testRegistry,
  relationshipResolver,
);

const smartHandlers = createSmartHandlers(testRegistry);
const smartServer = setupServer(...smartHandlers);

describe('Complex Relationship Chains Testing - Phase 3', () => {
  beforeAll(() => {
    console.log('Phase 3: Starting complex relationship chain testing');
    console.log('Registry stats:', testRegistry.getStats());
    console.log('Multi-hop resolver initialized');
    console.log(
      'Consistency checker mappings:',
      consistencyChecker.getStatistics(),
    );
    smartServer.listen({onUnhandledRequest: 'warn'});
  });

  afterAll(() => {
    smartServer.close();
  });

  describe('Multi-Hop Relationship Traversal', () => {
    test('traverses Gene -> Organism -> Genes -> Proteins complex chain', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestComplexMultiHop {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                taxonId
                name
                genes {
                  identifier
                  proteins {
                    identifier
                    molecularWeight
                    gene {
                      organism {
                        taxonId
                      }
                    }
                  }
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

        // Test multi-hop traversal using Phase 3 infrastructure
        const rootGene = testRegistry.getEntitiesByType('Gene')[0];

        // Test complex path: Gene -> Organism -> Genes -> Proteins
        const traversalResult = multiHopResolver.traversePath(
          rootGene,
          ['organism', 'genes', 'proteins'],
          {
            maxDepth: 5,
            allowCycles: false,
            maxResults: 50,
            collectMetrics: true,
          },
        );

        expect(traversalResult.entities.length).toBeGreaterThan(0);
        expect(traversalResult.stepsExecuted).toBe(3);
        expect(traversalResult.path.entityTypes).toEqual([
          'Gene',
          'Organism',
          'Gene',
          'Protein',
        ]);
        expect(traversalResult.traversalTime).toBeLessThan(200);

        console.log(
          `Multi-hop traversal completed in ${traversalResult.traversalTime}ms`,
        );
        console.log(
          `Path efficiency: ${traversalResult.metadata.pathEfficiency?.toFixed(3)}`,
        );
        console.log(
          `Entities visited: ${traversalResult.totalEntitiesVisited}`,
        );

        // Validate GraphQL response structure
        expect(gene.organism.taxonId).toBe('3702');
        expect(Array.isArray(gene.organism.genes)).toBe(true);
        expect(gene.organism.genes.length).toBeGreaterThan(0);

        const organismGene = gene.organism.genes[0];
        expect(Array.isArray(organismGene.proteins)).toBe(true);
        expect(organismGene.proteins.length).toBeGreaterThan(0);

        // Validate circular consistency
        const protein = organismGene.proteins[0];
        expect(protein.gene.organism.taxonId).toBe('3702');
      }
    });

    test('finds shortest path between distant entity types', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestShortestPath {
          qtl(identifier: "QTL001") {
            results {
              identifier
              trait {
                organism {
                  genes {
                    transcripts {
                      protein {
                        identifier
                      }
                    }
                  }
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

        // Test shortest path finding: QTL to Protein
        const qtlEntity = testRegistry.getEntitiesByType('QTL')[0];
        const proteinEntities = testRegistry.getEntitiesByType('Protein');

        if (proteinEntities.length > 0) {
          const shortestPathResult = multiHopResolver.getShortestPath(
            qtlEntity,
            proteinEntities[0].id,
            6, // max depth
          );

          expect(shortestPathResult).not.toBeNull();
          if (shortestPathResult) {
            expect(
              shortestPathResult.entities.some((e) => e.type === 'Protein'),
            ).toBe(true);
            expect(shortestPathResult.metadata.shortestPath).toBe(true);
            console.log(
              `Shortest path found: ${shortestPathResult.path.steps.join(' -> ')}`,
            );
            console.log(
              `Alternative paths available: ${shortestPathResult.metadata.alternativePaths}`,
            );
          }
        }

        // Validate deep GraphQL response structure
        expect(qtl.identifier).toBe('QTL001');
        expect(qtl.trait.organism.taxonId).toBe('3702');
        expect(Array.isArray(qtl.trait.organism.genes)).toBe(true);

        const gene = qtl.trait.organism.genes[0];
        expect(Array.isArray(gene.transcripts)).toBe(true);

        if (gene.transcripts.length > 0 && gene.transcripts[0].protein) {
          expect(typeof gene.transcripts[0].protein.identifier).toBe('string');
        }
      }
    });

    test('validates path traversal with cycle detection', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestCycleDetection {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              gene {
                identifier
                proteins {
                  identifier
                  transcript {
                    gene {
                      identifier
                    }
                  }
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
        const protein = response.body.singleResult.data.protein.results;

        // Test cycle detection in traversal
        const proteinEntity = testRegistry.getEntitiesByType('Protein')[0];

        // This path should create a cycle: Protein -> Gene -> Proteins -> Transcript -> Gene
        const cycleTraversalResult = multiHopResolver.traversePath(
          proteinEntity,
          ['gene', 'proteins', 'transcript', 'gene'],
          {
            maxDepth: 6,
            allowCycles: false,
            collectMetrics: true,
          },
        );

        expect(cycleTraversalResult.cyclesDetected).toBeGreaterThan(0);
        expect(
          cycleTraversalResult.warnings.some((w) =>
            w.includes('Cycle detected'),
          ),
        ).toBe(true);
        console.log(
          `Cycle detection: ${cycleTraversalResult.cyclesDetected} cycles detected`,
        );
        console.log(`Warnings: ${cycleTraversalResult.warnings.length}`);

        // Test with cycles allowed
        const allowedCycleResult = multiHopResolver.traversePath(
          proteinEntity,
          ['gene', 'proteins', 'transcript', 'gene'],
          {
            maxDepth: 6,
            allowCycles: true,
            maxResults: 10,
          },
        );

        expect(allowedCycleResult.path.isCircular).toBe(true);
        console.log(
          `With cycles allowed: ${allowedCycleResult.entities.length} final entities`,
        );

        // Validate GraphQL response
        expect(protein.identifier).toBe('AT1G01010.1');
        expect(protein.gene.identifier).toBe('AT1G01010');
        expect(Array.isArray(protein.gene.proteins)).toBe(true);

        const geneProtein = protein.gene.proteins[0];
        if (geneProtein.transcript) {
          expect(geneProtein.transcript.gene.identifier).toBe('AT1G01010');
        }
      }
    });

    test('analyzes connectivity patterns between entity types', async () => {
      // Test connectivity analysis for different entity types
      const entityTypes = ['Gene', 'Protein', 'Organism', 'QTL'];

      for (const entityType of entityTypes) {
        const connectivityAnalysis = multiHopResolver.analyzeConnectivity(
          entityType,
          3,
        );

        console.log(`${entityType} connectivity analysis:`);
        console.log(
          `  Reachable types: ${connectivityAnalysis.reachableTypes.size}`,
        );
        console.log(
          `  Connectivity score: ${connectivityAnalysis.connectivityScore.toFixed(3)}`,
        );
        console.log(
          `  Common paths: ${connectivityAnalysis.commonPaths.length}`,
        );
        console.log(
          `  Centrality metrics:`,
          connectivityAnalysis.centralityMetrics,
        );

        expect(connectivityAnalysis.reachableTypes.size).toBeGreaterThan(0);
        expect(connectivityAnalysis.connectivityScore).toBeGreaterThan(0);
        expect(connectivityAnalysis.connectivityScore).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Bidirectional Consistency Validation', () => {
    test('validates Gene <-> Protein bidirectional consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestBidirectionalConsistency {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              proteins {
                identifier
                gene {
                  identifier
                  proteins {
                    identifier
                  }
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

        // Test bidirectional consistency using Phase 3 checker
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];
        const consistencyResult = consistencyChecker.checkEntityConsistency(
          geneEntity.id,
        );

        console.log(
          `Gene consistency check: ${consistencyResult.isConsistent ? 'PASSED' : 'FAILED'}`,
        );
        console.log(
          `Checked relationships: ${consistencyResult.checkedRelationships}`,
        );
        console.log(`Total checks: ${consistencyResult.totalChecks}`);
        console.log(
          `Entity pairs checked: ${consistencyResult.performance.entityPairsChecked}`,
        );
        console.log(`Check time: ${consistencyResult.performance.checkTime}ms`);

        if (consistencyResult.inconsistencies.length > 0) {
          console.log('Inconsistencies found:');
          consistencyResult.inconsistencies.forEach((issue, index) => {
            console.log(`  ${index + 1}. ${issue.type}: ${issue.description}`);
            if (issue.suggestedFix) {
              console.log(`     Fix: ${issue.suggestedFix}`);
            }
          });
        }

        if (consistencyResult.recommendations.length > 0) {
          console.log('Recommendations:');
          consistencyResult.recommendations.forEach((rec) =>
            console.log(`  - ${rec}`),
          );
        }

        // In a well-formed test graph, we expect consistency
        expect(consistencyResult.isConsistent).toBe(true);
        expect(consistencyResult.checkedRelationships).toBeGreaterThan(0);

        // Validate GraphQL response shows bidirectional consistency
        expect(gene.identifier).toBe('AT1G01010');
        expect(Array.isArray(gene.proteins)).toBe(true);
        expect(gene.proteins.length).toBeGreaterThan(0);

        const protein = gene.proteins[0];
        expect(protein.gene.identifier).toBe(gene.identifier);
        expect(
          protein.gene.proteins.some(
            (p) => p.identifier === protein.identifier,
          ),
        ).toBe(true);
      }
    });

    test('validates Organism <-> Gene collection consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestOrganismGeneConsistency {
          organism(taxonId: "3702") {
            results {
              taxonId
              genes {
                identifier
                organism {
                  taxonId
                  genes {
                    identifier
                  }
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

        // Test organism-level consistency
        const organismEntity = testRegistry.getEntitiesByType('Organism')[0];
        const consistencyResult = consistencyChecker.checkEntityConsistency(
          organismEntity.id,
        );

        console.log(
          `Organism consistency: ${consistencyResult.isConsistent ? 'PASSED' : 'FAILED'}`,
        );
        console.log(
          `Performance: ${consistencyResult.performance.checkTime}ms for ${consistencyResult.performance.entityPairsChecked} pairs`,
        );

        expect(consistencyResult.isConsistent).toBe(true);
        expect(
          consistencyResult.performance.entityPairsChecked,
        ).toBeGreaterThan(0);

        // Validate GraphQL response consistency
        expect(organism.taxonId).toBe('3702');
        expect(Array.isArray(organism.genes)).toBe(true);

        organism.genes.forEach((gene) => {
          expect(gene.organism.taxonId).toBe(organism.taxonId);
          expect(
            gene.organism.genes.some((g) => g.identifier === gene.identifier),
          ).toBe(true);
        });
      }
    });

    test('performs comprehensive consistency check across all entity types', async () => {
      // Run global consistency check
      const globalReport = consistencyChecker.performGlobalConsistencyCheck();

      console.log('\n=== Global Consistency Report ===');
      console.log(
        `Overall Score: ${(globalReport.overallScore * 100).toFixed(2)}%`,
      );
      console.log(`Total Entities: ${globalReport.summary.totalEntities}`);
      console.log(
        `Total Relationships: ${globalReport.summary.totalRelationships}`,
      );
      console.log(
        `Consistent: ${globalReport.summary.consistentRelationships}`,
      );
      console.log(
        `Inconsistent: ${globalReport.summary.inconsistentRelationships}`,
      );
      console.log(`Critical Issues: ${globalReport.criticalIssues.length}`);

      // Report by entity type
      console.log('\n=== By Entity Type ===');
      globalReport.entityTypeResults.forEach((result, entityType) => {
        const score =
          result.checkedRelationships > 0
            ? (
                ((result.checkedRelationships - result.inconsistencies.length) /
                  result.checkedRelationships) *
                100
              ).toFixed(1)
            : '100.0';
        console.log(
          `${entityType}: ${score}% (${result.inconsistencies.length} issues)`,
        );
      });

      if (globalReport.criticalIssues.length > 0) {
        console.log('\n=== Critical Issues ===');
        globalReport.criticalIssues.slice(0, 5).forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.description}`);
        });
      }

      // In a well-designed test graph, expect high consistency
      expect(globalReport.overallScore).toBeGreaterThan(0.9);
      expect(globalReport.summary.totalEntities).toBeGreaterThan(10);
      expect(globalReport.summary.totalRelationships).toBeGreaterThan(20);
    });

    test('validates QTL relationship chain consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestQTLChainConsistency {
          qtl(identifier: "QTL001") {
            results {
              identifier
              trait {
                identifier
                qtls {
                  identifier
                  qtlStudy {
                    qtls {
                      identifier
                    }
                  }
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

        // Test QTL-specific consistency
        const qtlEntity = testRegistry.getEntitiesByType('QTL')[0];
        const consistencyResult = consistencyChecker.checkEntityConsistency(
          qtlEntity.id,
        );

        console.log(`QTL consistency check:`);
        console.log(
          `  Status: ${consistencyResult.isConsistent ? 'PASSED' : 'FAILED'}`,
        );
        console.log(
          `  Relationships checked: ${consistencyResult.checkedRelationships}`,
        );
        console.log(`  Issues: ${consistencyResult.inconsistencies.length}`);

        expect(consistencyResult.isConsistent).toBe(true);

        // Validate GraphQL response chain consistency
        expect(qtl.identifier).toBe('QTL001');
        expect(qtl.trait.identifier).toBe('TRAIT001');
        expect(Array.isArray(qtl.trait.qtls)).toBe(true);
        expect(
          qtl.trait.qtls.some((q) => q.identifier === qtl.identifier),
        ).toBe(true);

        const traitQTL = qtl.trait.qtls[0];
        if (traitQTL.qtlStudy) {
          expect(
            traitQTL.qtlStudy.qtls.some(
              (q) => q.identifier === traitQTL.identifier,
            ),
          ).toBe(true);
        }
      }
    });
  });

  describe('Cross-Entity Relationship Validation', () => {
    test('validates complex entity network integrity', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestNetworkIntegrity {
          organism(taxonId: "3702") {
            results {
              taxonId
              genes {
                identifier
                transcripts {
                  identifier
                  protein {
                    identifier
                    strain {
                      identifier
                      organism {
                        taxonId
                      }
                    }
                  }
                }
                strain {
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
        const organism = response.body.singleResult.data.organism.results;

        // Test network integrity across multiple entity types
        const entityTypes = [
          'Organism',
          'Gene',
          'Transcript',
          'Protein',
          'Strain',
        ];
        const consistencyResults = new Map();

        for (const entityType of entityTypes) {
          const result =
            consistencyChecker.checkEntityTypeConsistency(entityType);
          consistencyResults.set(entityType, result);

          console.log(
            `${entityType} type consistency: ${result.isConsistent ? 'PASSED' : 'FAILED'} (${result.inconsistencies.length} issues)`,
          );
        }

        // Validate cross-entity consistency patterns
        expect(organism.taxonId).toBe('3702');

        organism.genes.forEach((gene) => {
          // Validate gene-level consistency
          expect(gene.strain.identifier).toBeTruthy();

          gene.transcripts.forEach((transcript) => {
            if (transcript.protein && transcript.protein.strain) {
              // Cross-validate strain consistency
              expect(transcript.protein.strain.identifier).toBe(
                gene.strain.identifier,
              );
              expect(transcript.protein.strain.organism.taxonId).toBe(
                organism.taxonId,
              );
            }
          });
        });

        // Overall network should be highly consistent
        const totalIssues = Array.from(consistencyResults.values()).reduce(
          (sum, result) => sum + result.inconsistencies.length,
          0,
        );

        expect(totalIssues).toBeLessThan(5); // Allow minimal issues in test data
      }
    });

    test('validates performance of complex relationship queries', async () => {
      const startTime = Date.now();

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestComplexPerformance {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                genes {
                  proteins {
                    transcript {
                      gene {
                        organism {
                          name
                        }
                      }
                    }
                  }
                }
              }
              proteins {
                gene {
                  transcripts {
                    protein {
                      gene {
                        identifier
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      const totalQueryTime = Date.now() - startTime;

      expect(response.body.kind).toBe('single');
      expect(totalQueryTime).toBeLessThan(1000); // Should complete within 1 second

      console.log(`Complex performance test completed in ${totalQueryTime}ms`);

      // Test multi-hop resolver performance
      const gene = testRegistry.getEntitiesByType('Gene')[0];
      const multiplePathsResult = await multiHopResolver.traverseMultiplePaths(
        gene,
        [
          ['organism', 'genes', 'proteins'],
          ['proteins', 'transcript', 'gene'],
          ['transcripts', 'protein', 'gene'],
        ],
        {collectMetrics: true},
      );

      console.log('Multi-path traversal performance:');
      multiplePathsResult.forEach((result, index) => {
        console.log(
          `  Path ${index + 1}: ${result.traversalTime}ms (${result.entities.length} entities)`,
        );
        console.log(
          `    Efficiency: ${result.metadata.pathEfficiency?.toFixed(3)}`,
        );
        console.log(
          `    Relative performance: ${result.metadata.relativePerformance?.toFixed(3)}`,
        );
      });

      expect(multiplePathsResult.every((r) => r.traversalTime < 200)).toBe(
        true,
      );

      // Cache performance check
      const cacheStats = multiHopResolver.getCacheStats();
      console.log(`Multi-hop cache stats:`, cacheStats);

      expect(cacheStats.pathCache).toBeGreaterThanOrEqual(0);
      expect(cacheStats.validationCache).toBeGreaterThanOrEqual(0);
    });

    test('validates path discovery between distant entity types', async () => {
      // Test path discovery capabilities
      const pathDiscoveryTests = [
        {from: 'QTL', to: 'Protein', description: 'QTL to Protein pathway'},
        {
          from: 'Trait',
          to: 'Sequence',
          description: 'Trait to Sequence pathway',
        },
        {
          from: 'Chromosome',
          to: 'QTL',
          description: 'Chromosome to QTL pathway',
        },
      ];

      for (const test of pathDiscoveryTests) {
        const possiblePaths = multiHopResolver.findPathsBetweenTypes(
          test.from,
          test.to,
          5,
        );

        console.log(`${test.description}:`);
        console.log(`  Found ${possiblePaths.length} possible paths`);

        possiblePaths.slice(0, 3).forEach((path, index) => {
          console.log(
            `    Path ${index + 1}: ${path.steps.join(' -> ')} (depth: ${path.steps.length})`,
          );
          console.log(`      Types: ${path.entityTypes.join(' -> ')}`);
        });

        if (possiblePaths.length > 0) {
          expect(possiblePaths[0].steps.length).toBeLessThanOrEqual(5);
          expect(possiblePaths[0].entityTypes[0]).toBe(test.from);
          expect(
            possiblePaths[0].entityTypes[
              possiblePaths[0].entityTypes.length - 1
            ],
          ).toBe(test.to);
        }
      }
    });
  });

  describe('Relationship Infrastructure Statistics', () => {
    test('validates comprehensive infrastructure metrics', async () => {
      // Relationship resolver statistics
      const resolverStats = relationshipResolver.getRelationshipStats();
      console.log('\n=== Relationship Resolver Statistics ===');
      console.log(`Total configurations: ${resolverStats.totalConfigs}`);
      console.log(`Entity types: ${resolverStats.entityTypes}`);
      console.log(
        `Collection relationships: ${resolverStats.collectionRelationships}`,
      );
      console.log(
        `Optional relationships: ${resolverStats.optionalRelationships}`,
      );

      // Multi-hop resolver cache statistics
      const cacheStats = multiHopResolver.getCacheStats();
      console.log('\n=== Multi-Hop Cache Statistics ===');
      console.log(`Path cache entries: ${cacheStats.pathCache}`);
      console.log(`Validation cache entries: ${cacheStats.validationCache}`);

      // Consistency checker statistics
      const checkerStats = consistencyChecker.getStatistics();
      console.log('\n=== Consistency Checker Statistics ===');
      console.log(`Total mappings: ${checkerStats.totalMappings}`);
      console.log(`Required mappings: ${checkerStats.requiredMappings}`);
      console.log(`Optional mappings: ${checkerStats.optionalMappings}`);
      console.log(`Collection mappings: ${checkerStats.collectionMappings}`);

      // Registry statistics
      const registryStats = testRegistry.getStats();
      console.log('\n=== Entity Registry Statistics ===');
      console.log(`Total entities: ${registryStats.totalEntities}`);
      console.log(`Entity types: ${registryStats.entityTypes}`);
      console.log(`Total relationships: ${registryStats.totalRelationships}`);

      // Validate infrastructure completeness
      expect(resolverStats.totalConfigs).toBeGreaterThan(20);
      expect(resolverStats.entityTypes).toBeGreaterThan(5);
      expect(checkerStats.totalMappings).toBeGreaterThan(8);
      expect(registryStats.totalEntities).toBeGreaterThan(15);
      expect(registryStats.totalRelationships).toBeGreaterThan(30);
    });
  });
});
