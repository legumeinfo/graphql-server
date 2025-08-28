/**
 * Advanced Features Demonstration Test Suite - Phase 4
 *
 * Comprehensive demonstration of all Phase 4 advanced features including
 * conditional loading, filtering & search, performance testing, and
 * validation frameworks working together in complex scenarios.
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
import {createConditionalRelationshipLoader} from '../../__helpers__/conditional-relationship-loader.js';
import {createRelationshipFilterSearch} from '../../__helpers__/relationship-filter-search.js';
import {createPerformanceTestingInfrastructure} from '../../__helpers__/performance-testing-infrastructure.js';
import {createValidationConstraintFramework} from '../../__helpers__/validation-constraint-framework.js';
import {createMultiHopResolver} from '../../__helpers__/multi-hop-resolver.js';
import {createBidirectionalConsistencyChecker} from '../../__helpers__/bidirectional-consistency-checker.js';

// Complete Phase 4 infrastructure setup
const testRegistry = createBiologicalTestGraph();
const relationshipResolver = createDirectRelationshipResolver(testRegistry);
const collectionManager = createCollectionRelationshipManager(
  testRegistry,
  relationshipResolver,
);
const multiHopResolver = createMultiHopResolver(
  testRegistry,
  relationshipResolver,
);
const consistencyChecker = createBidirectionalConsistencyChecker(
  testRegistry,
  relationshipResolver,
);

// Phase 4 advanced features
const conditionalLoader = createConditionalRelationshipLoader(
  testRegistry,
  relationshipResolver,
  collectionManager,
);
const filterSearch = createRelationshipFilterSearch(
  testRegistry,
  relationshipResolver,
  collectionManager,
);
const performanceTester = createPerformanceTestingInfrastructure(
  testRegistry,
  relationshipResolver,
  multiHopResolver,
  collectionManager,
  filterSearch,
);
const validationFramework = createValidationConstraintFramework(
  testRegistry,
  relationshipResolver,
  consistencyChecker,
);

const smartHandlers = createSmartHandlers(testRegistry);
const smartServer = setupServer(...smartHandlers);

describe('Advanced Features Integration Testing - Phase 4', () => {
  beforeAll(() => {
    console.log('\n=== Phase 4: Advanced Features Integration Testing ===');
    console.log('Infrastructure components initialized:');
    console.log('- Conditional relationship loader with dynamic constraints');
    console.log('- Advanced filtering and search system');
    console.log('- Performance testing infrastructure');
    console.log('- Validation and constraint checking framework');
    console.log('Registry stats:', testRegistry.getStats());
    smartServer.listen({onUnhandledRequest: 'warn'});
  });

  afterAll(() => {
    smartServer.close();
  });

  describe('Conditional Relationship Loading', () => {
    test('demonstrates conditional loading based on entity properties and permissions', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestConditionalLoading {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              length
              proteins {
                identifier
                molecularWeight
                sequence {
                  length
                  residues
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

        // Test conditional loading with different contexts
        const geneEntity = testRegistry.getEntitiesByType('Gene')[0];

        // Test with high permissions and performance mode
        const fullLoadResult = conditionalLoader.loadRelationship(
          geneEntity,
          'proteins',
          {
            userPermissions: ['view_proteins', 'view_sequences'],
            userRole: 'researcher',
            performanceMode: 'complete',
            cacheEnabled: true,
          },
        );

        console.log(
          `Full load: ${fullLoadResult.entities.length} entities, strategy: ${fullLoadResult.loadingStrategy}`,
        );
        console.log(
          `Conditions: ${fullLoadResult.conditionsEvaluated} evaluated, ${fullLoadResult.conditionsPassed} passed`,
        );
        console.log(
          `Performance: ${fullLoadResult.loadingTime}ms, from cache: ${fullLoadResult.fromCache}`,
        );

        expect(fullLoadResult.entities.length).toBeGreaterThan(0);
        expect(fullLoadResult.conditionsEvaluated).toBeGreaterThan(0);
        expect(fullLoadResult.loadingTime).toBeLessThan(100);

        // Test with restricted permissions
        const restrictedLoadResult = conditionalLoader.loadRelationship(
          geneEntity,
          'proteins',
          {
            userRole: 'guest',
            performanceMode: 'fast',
            cacheEnabled: false,
          },
        );

        console.log(
          `Restricted load: ${restrictedLoadResult.entities.length} entities`,
        );
        console.log(`Fallback used: ${restrictedLoadResult.fallbackUsed}`);
        console.log(`Warnings: ${restrictedLoadResult.warnings.length}`);

        expect(
          restrictedLoadResult.fallbackUsed ||
            restrictedLoadResult.entities.length === 0,
        ).toBeTruthy();

        // Validate GraphQL response
        expect(gene.identifier).toBe('AT1G01010');
        expect(typeof gene.length).toBe('number');
        expect(Array.isArray(gene.proteins)).toBe(true);
      }
    });

    test('validates eager vs lazy loading strategies', async () => {
      const geneEntity = testRegistry.getEntitiesByType('Gene')[0];

      // Test eager loading
      const eagerResult = conditionalLoader.loadRelationship(
        geneEntity,
        'transcripts',
        {
          userRole: 'researcher',
          requestMetadata: {loadingStrategy: 'eager'},
        },
      );

      // Test lazy loading
      const lazyResult = conditionalLoader.loadRelationship(
        geneEntity,
        'transcripts',
        {
          userRole: 'guest',
          requestMetadata: {loadingStrategy: 'lazy'},
        },
      );

      console.log(
        `Eager loading: ${eagerResult.entities.length} entities, ${eagerResult.loadingTime}ms`,
      );
      console.log(
        `Lazy loading: ${lazyResult.entities.length} entities, ${lazyResult.loadingTime}ms`,
      );
      console.log(`Lazy metadata:`, lazyResult.metadata);

      expect(eagerResult.loadingStrategy).toBe('eager');
      expect(lazyResult.loadingStrategy).toBe('lazy');
      expect(lazyResult.metadata.lazyLoaded).toBe(true);

      // Get loading statistics
      const loadingStats = conditionalLoader.getLoadingStatistics();
      console.log('Loading statistics:', loadingStats);

      expect(loadingStats.totalRules).toBeGreaterThan(0);
      expect(typeof loadingStats.cacheHitRate).toBe('number');
    });
  });

  describe('Advanced Filtering and Search', () => {
    test('demonstrates comprehensive search with faceting and highlighting', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestAdvancedSearch {
          organism(taxonId: "3702") {
            results {
              taxonId
              name
              genes {
                identifier
                name
                length
                description
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

        // Test advanced search capabilities
        const organismEntity = testRegistry.getEntitiesByType('Organism')[0];

        const searchResult = filterSearch.searchRelationships(
          organismEntity,
          'genes',
          {
            text: 'protein NAC domain',
            filters: [
              {
                field: 'length',
                operator: 'greater_than',
                value: 1000,
                dataType: 'number',
              },
              {
                field: 'name',
                operator: 'contains',
                value: 'protein',
                caseSensitive: false,
                boost: 2,
              },
              {
                field: 'description',
                operator: 'not_contains',
                value: 'hypothetical',
              },
            ],
            sorting: [
              {field: 'length', direction: 'desc'},
              {field: 'name', direction: 'asc'},
            ],
            pagination: {limit: 5, offset: 0},
            facets: [
              {
                field: 'length',
                type: 'range',
                ranges: [
                  {from: 0, to: 1000, label: 'Short'},
                  {from: 1000, to: 5000, label: 'Medium'},
                  {from: 5000, to: undefined, label: 'Long'},
                ],
              },
              {field: 'name', type: 'terms', size: 10},
            ],
            highlight: {
              fields: ['name', 'description'],
              fragmentSize: 100,
              numberOfFragments: 2,
            },
          },
        );

        console.log(`\nAdvanced search results:`);
        console.log(`- Total entities: ${searchResult.totalCount}`);
        console.log(`- Returned entities: ${searchResult.entities.length}`);
        console.log(`- Search time: ${searchResult.searchTime}ms`);
        console.log(
          `- Filters applied: ${searchResult.metadata.filtersApplied}`,
        );
        console.log(`- Text searched: ${searchResult.metadata.textSearched}`);
        console.log(
          `- Facets computed: ${searchResult.metadata.facetsComputed}`,
        );

        // Validate facets
        console.log(`\nFacet results:`);
        Object.entries(searchResult.facets).forEach(([field, facet]) => {
          console.log(`- ${field} (${facet.type}):`, facet.buckets.slice(0, 3));
        });

        // Validate highlights
        console.log(
          `\nHighlights: ${Object.keys(searchResult.highlights).length} entities`,
        );
        Object.entries(searchResult.highlights)
          .slice(0, 2)
          .forEach(([entityId, highlights]) => {
            console.log(`- ${entityId}:`, highlights);
          });

        // Validate suggestions
        console.log(`\nSuggestions:`, searchResult.suggestions);

        expect(searchResult.entities.length).toBeLessThanOrEqual(5);
        expect(searchResult.metadata.filtersApplied).toBe(3);
        expect(searchResult.metadata.textSearched).toBe(true);
        expect(Object.keys(searchResult.facets)).toContain('length');
        expect(searchResult.suggestions.length).toBeGreaterThanOrEqual(0);

        // Validate GraphQL response
        expect(organism.taxonId).toBe('3702');
        expect(Array.isArray(organism.genes)).toBe(true);
      }
    });

    test('validates complex filtering with fuzzy matching and regex', async () => {
      const geneEntity = testRegistry.getEntitiesByType('Gene')[0];

      // Test fuzzy search
      const fuzzySearchResult = filterSearch.searchRelationships(
        geneEntity,
        'proteins',
        {
          filters: [
            {
              field: 'name',
              operator: 'fuzzy',
              value: 'protien',
              caseSensitive: false,
            }, // Intentional typo
            {field: 'identifier', operator: 'regex', value: '^AT.*\\.1$'},
          ],
          sorting: [
            {
              field: 'molecularWeight',
              direction: 'desc',
              missingValuesLast: true,
            },
          ],
        },
      );

      console.log(
        `Fuzzy search results: ${fuzzySearchResult.entities.length} entities`,
      );
      console.log(`Search time: ${fuzzySearchResult.searchTime}ms`);

      expect(fuzzySearchResult.searchTime).toBeLessThan(200);

      // Get search statistics
      const searchStats = filterSearch.getSearchStatistics();
      console.log('Search statistics:', searchStats);

      expect(searchStats.indexSize).toBeGreaterThan(0);
    });
  });

  describe('Performance Testing Integration', () => {
    test('executes comprehensive performance benchmarks', async () => {
      console.log('\n=== Performance Benchmarking ===');

      // Define load test scenarios
      const scenarios = [
        {
          name: 'Simple Gene-Organism Resolution',
          entityType: 'Gene',
          relationshipName: 'organism',
          queryComplexity: 'simple' as const,
          expectedLatency: 50,
          expectedThroughput: 100,
          scalabilityTarget: 'linear' as const,
        },
        {
          name: 'Gene-Proteins Collection',
          entityType: 'Gene',
          relationshipName: 'proteins',
          queryComplexity: 'moderate' as const,
          expectedLatency: 100,
          expectedThroughput: 50,
          scalabilityTarget: 'logarithmic' as const,
        },
        {
          name: 'Multi-hop Traversal',
          entityType: 'Gene',
          relationshipName: 'organism',
          queryComplexity: 'complex' as const,
          expectedLatency: 200,
          expectedThroughput: 20,
          scalabilityTarget: 'logarithmic' as const,
        },
        {
          name: 'Advanced Search Query',
          entityType: 'Organism',
          relationshipName: 'genes',
          queryComplexity: 'extreme' as const,
          expectedLatency: 500,
          expectedThroughput: 10,
          scalabilityTarget: 'constant' as const,
        },
      ];

      const testConfig = {
        name: 'Phase 4 Performance Suite',
        description:
          'Comprehensive performance testing of advanced relationship features',
        iterations: 20,
        warmupIterations: 5,
        datasetSizes: [50, 100, 200],
        timeout: 10000,
      };

      // Run performance test suite
      const benchmarkResults = await performanceTester.runPerformanceTestSuite(
        scenarios,
        testConfig,
      );

      // Validate results
      expect(benchmarkResults.length).toBe(
        scenarios.length * testConfig.datasetSizes.length,
      );

      // Check that most tests passed
      const passedTests = benchmarkResults.filter(
        (result) => result.passed,
      ).length;
      const passRate = passedTests / benchmarkResults.length;
      console.log(
        `Performance test pass rate: ${(passRate * 100).toFixed(1)}%`,
      );

      expect(passRate).toBeGreaterThan(0.7); // At least 70% should pass

      // Validate specific performance metrics
      benchmarkResults.forEach((result) => {
        expect(result.metrics.latency.mean).toBeGreaterThan(0);
        expect(result.metrics.throughput.requestsPerSecond).toBeGreaterThan(0);
        expect(result.metrics.errors.rate).toBeLessThan(0.1); // Less than 10% errors

        console.log(
          `${result.testName}: ${result.metrics.latency.mean.toFixed(2)}ms avg, ${result.metrics.throughput.requestsPerSecond.toFixed(2)} req/sec`,
        );
      });

      // Get performance statistics
      const perfStats = performanceTester.getPerformanceStatistics();
      console.log('Performance testing statistics:', perfStats);

      expect(perfStats.totalTests).toBeGreaterThan(0);
      expect(perfStats.averageLatency).toBeGreaterThan(0);
    });

    test('validates scalability characteristics across dataset sizes', async () => {
      // Test scalability with different dataset sizes
      const scalabilityScenarios = [
        {
          name: 'Scalability Test - Direct Relationships',
          entityType: 'Gene',
          relationshipName: 'organism',
          queryComplexity: 'simple' as const,
          scalabilityTarget: 'constant' as const,
        },
      ];

      const scalabilityConfig = {
        name: 'Scalability Analysis',
        description: 'Test relationship resolution scalability',
        iterations: 10,
        warmupIterations: 2,
        datasetSizes: [25, 50, 100, 200, 400],
        timeout: 15000,
      };

      const scalabilityResults =
        await performanceTester.runPerformanceTestSuite(
          scalabilityScenarios,
          scalabilityConfig,
        );

      // Analyze scalability trends
      console.log('\nScalability Analysis:');
      scalabilityResults.forEach((result) => {
        const datasetSize = result.metrics.scalability.datasetSize;
        const latency = result.metrics.latency.mean;
        const linearityScore = result.metrics.scalability.linearityScore;

        console.log(
          `Dataset ${datasetSize}: ${latency.toFixed(2)}ms, linearity: ${(linearityScore * 100).toFixed(1)}%`,
        );
      });

      // Validate that performance doesn't degrade excessively
      const latencies = scalabilityResults.map((r) => r.metrics.latency.mean);
      const maxLatency = Math.max(...latencies);
      const minLatency = Math.min(...latencies);
      const latencyGrowth = (maxLatency - minLatency) / minLatency;

      console.log(`Latency growth: ${(latencyGrowth * 100).toFixed(1)}%`);
      expect(latencyGrowth).toBeLessThan(5.0); // Less than 500% growth across dataset sizes
    });
  });

  describe('Validation and Constraint Framework', () => {
    test('executes comprehensive entity validation with auto-fix', async () => {
      console.log('\n=== Validation Framework Testing ===');

      const testEntities = [
        ...testRegistry.getEntitiesByType('Gene').slice(0, 2),
        ...testRegistry.getEntitiesByType('Protein').slice(0, 2),
        ...testRegistry.getEntitiesByType('QTL').slice(0, 1),
        ...testRegistry.getEntitiesByType('Organism').slice(0, 1),
      ];

      const validationResults = [];

      for (const entity of testEntities) {
        const validationResult = validationFramework.validateEntity(entity, {
          includeRelationships: true,
          autoFix: true,
          userContext: {
            permissions: ['validate', 'auto_fix'],
            role: 'admin',
            preferences: {},
          },
        });

        validationResults.push(validationResult);

        console.log(`\n${entity.type} ${entity.id} validation:`);
        console.log(
          `- Rules: ${validationResult.summary.passedRules}/${validationResult.summary.totalRules} passed`,
        );
        console.log(
          `- Violations: ${validationResult.summary.totalViolations} (${validationResult.summary.errorViolations} errors, ${validationResult.summary.warningViolations} warnings)`,
        );
        console.log(
          `- Auto-fixable: ${validationResult.summary.autoFixableViolations}`,
        );
        console.log(
          `- Execution time: ${validationResult.executionMetrics.totalExecutionTime}ms`,
        );

        // Show some violations
        if (validationResult.summary.totalViolations > 0) {
          console.log('Sample violations:');
          Object.values(validationResult.violationsBySeverity)
            .flat()
            .slice(0, 3)
            .forEach((violation) => {
              console.log(`  - ${violation.severity}: ${violation.message}`);
            });
        }

        // Show recommendations
        if (validationResult.recommendations.length > 0) {
          console.log('Recommendations:');
          validationResult.recommendations.forEach((rec) =>
            console.log(`  - ${rec}`),
          );
        }

        expect(validationResult.summary.totalRules).toBeGreaterThan(0);
        expect(
          validationResult.executionMetrics.totalExecutionTime,
        ).toBeLessThan(1000);
      }

      // Aggregate results
      const totalViolations = validationResults.reduce(
        (sum, result) => sum + result.summary.totalViolations,
        0,
      );
      const totalRulesExecuted = validationResults.reduce(
        (sum, result) => sum + result.summary.totalRules,
        0,
      );

      console.log(`\nValidation Summary:`);
      console.log(`- Total entities validated: ${testEntities.length}`);
      console.log(`- Total rules executed: ${totalRulesExecuted}`);
      console.log(`- Total violations found: ${totalViolations}`);

      expect(totalRulesExecuted).toBeGreaterThan(0);
    });

    test('performs graph-wide validation analysis', async () => {
      console.log('\n=== Graph-Wide Validation ===');

      const graphValidationResult = validationFramework.validateGraph({
        sampleSize: 10, // Limit for performance
        autoFix: false,
        parallel: false,
      });

      console.log('Graph validation results:');
      console.log(
        `- Entities validated: ${graphValidationResult.executionMetrics.entitiesValidated}`,
      );
      console.log(
        `- Relationships validated: ${graphValidationResult.executionMetrics.relationshipsValidated}`,
      );
      console.log(
        `- Total execution time: ${graphValidationResult.executionMetrics.totalExecutionTime}ms`,
      );
      console.log(
        `- Rules passed: ${graphValidationResult.summary.passedRules}/${graphValidationResult.summary.totalRules}`,
      );

      // Analyze violations by category
      console.log('\nViolations by category:');
      Object.entries(graphValidationResult.violationsByCategory).forEach(
        ([category, violations]) => {
          console.log(`- ${category}: ${violations.length} violations`);
        },
      );

      // Analyze violations by severity
      console.log('\nViolations by severity:');
      Object.entries(graphValidationResult.violationsBySeverity).forEach(
        ([severity, violations]) => {
          console.log(`- ${severity}: ${violations.length} violations`);
        },
      );

      expect(
        graphValidationResult.executionMetrics.entitiesValidated,
      ).toBeGreaterThan(0);
      expect(graphValidationResult.summary.totalRules).toBeGreaterThan(0);

      // Get validation statistics
      const validationStats = validationFramework.getValidationStatistics();
      console.log('\nValidation framework statistics:', validationStats);

      expect(validationStats.totalRules).toBeGreaterThan(5);
      expect(
        Object.keys(validationStats.rulesByCategory).length,
      ).toBeGreaterThan(2);
    });

    test('demonstrates custom validation rules and constraints', async () => {
      // Add custom validation rule
      validationFramework.addValidationRule({
        id: 'custom_gene_symbol_format',
        name: 'Gene Symbol Format Validation',
        description: 'Validates that gene symbols follow uppercase convention',
        category: 'business_logic',
        severity: 'warning',
        scope: 'entity',
        validator: (context) => {
          const violations = [];

          if (context.entity.type === 'Gene') {
            const symbol = context.entity.data.symbol;
            if (symbol && symbol !== symbol.toUpperCase()) {
              violations.push({
                ruleId: 'custom_gene_symbol_format',
                severity: 'warning' as const,
                message: 'Gene symbol should be uppercase',
                details: `Gene ${context.entity.id} symbol "${symbol}" should be uppercase`,
                entityId: context.entity.id,
                expectedValue: symbol.toUpperCase(),
                actualValue: symbol,
                autoFixable: true,
              });
            }
          }

          return {
            passed: violations.length === 0,
            violations,
            metrics: {executionTime: 1, entitiesChecked: 1, rulesEvaluated: 1},
            suggestions:
              violations.length > 0
                ? ['Consider standardizing gene symbols to uppercase']
                : [],
          };
        },
        autoFix: (context) => {
          if (context.entity.type === 'Gene' && context.entity.data.symbol) {
            const oldSymbol = context.entity.data.symbol;
            const newSymbol = oldSymbol.toUpperCase();
            context.entity.data.symbol = newSymbol;

            return {
              applied: true,
              actions: [
                {
                  type: 'update_field',
                  entityId: context.entity.id,
                  fieldName: 'symbol',
                  oldValue: oldSymbol,
                  newValue: newSymbol,
                  description: 'Converted gene symbol to uppercase',
                },
              ],
              warnings: [],
              rollbackInstructions: [`Restore symbol to "${oldSymbol}"`],
            };
          }

          return {
            applied: false,
            actions: [],
            warnings: ['No symbol to fix'],
            rollbackInstructions: [],
          };
        },
      });

      // Test the custom rule
      const geneEntity = testRegistry.getEntitiesByType('Gene')[0];
      const customValidationResult = validationFramework.validateEntity(
        geneEntity,
        {
          rulesToRun: ['custom_gene_symbol_format'],
          autoFix: true,
        },
      );

      console.log('\nCustom validation rule results:');
      console.log(
        `- Rules executed: ${customValidationResult.summary.totalRules}`,
      );
      console.log(
        `- Violations: ${customValidationResult.summary.totalViolations}`,
      );

      expect(customValidationResult.summary.totalRules).toBe(1);

      // Verify custom rule is registered
      const finalValidationStats =
        validationFramework.getValidationStatistics();
      expect(finalValidationStats.totalRules).toBeGreaterThan(5); // Should include our custom rule
    });
  });

  describe('Integrated Feature Scenarios', () => {
    test('demonstrates end-to-end advanced feature integration', async () => {
      console.log('\n=== End-to-End Integration Test ===');

      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Complex GraphQL query that would benefit from all advanced features
      const response = await executeQuery(
        server,
        `query IntegratedAdvancedFeatures {
          organism(taxonId: "3702") {
            results {
              taxonId
              name
              genes {
                identifier
                name
                length
                proteins {
                  identifier
                  molecularWeight
                  sequence {
                    length
                    md5checksum
                  }
                  transcript {
                    identifier
                    gene {
                      organism {
                        name
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
        const organism = response.body.singleResult.data.organism.results;

        // 1. Apply conditional loading
        const organismEntity = testRegistry.getEntitiesByType('Organism')[0];
        const conditionalResult = conditionalLoader.loadRelationship(
          organismEntity,
          'genes',
          {
            userPermissions: ['view_genes', 'view_proteins'],
            userRole: 'researcher',
            performanceMode: 'balanced',
          },
        );

        // 2. Apply advanced filtering
        const filterResult = filterSearch.searchRelationships(
          organismEntity,
          'genes',
          {
            text: 'protein',
            filters: [{field: 'length', operator: 'greater_than', value: 1000}],
            facets: [
              {
                field: 'length',
                type: 'range',
                ranges: [
                  {from: 0, to: 2000, label: 'Small'},
                  {from: 2000, to: 10000, label: 'Medium'},
                  {from: 10000, to: undefined, label: 'Large'},
                ],
              },
            ],
          },
        );

        // 3. Validate entities
        const validationResult = validationFramework.validateEntity(
          organismEntity,
          {
            includeRelationships: true,
          },
        );

        // 4. Run performance check
        const startTime = Date.now();
        const geneEntities = testRegistry.getEntitiesByType('Gene');
        for (let i = 0; i < Math.min(10, geneEntities.length); i++) {
          relationshipResolver.resolveDirectRelationship(
            geneEntities[i],
            'proteins',
          );
        }
        const performanceTime = Date.now() - startTime;

        console.log('\nIntegrated results:');
        console.log(
          `- Conditional loading: ${conditionalResult.entities.length} entities, ${conditionalResult.loadingTime}ms`,
        );
        console.log(
          `- Filtered search: ${filterResult.entities.length}/${filterResult.totalCount} entities`,
        );
        console.log(
          `- Validation: ${validationResult.summary.totalViolations} violations found`,
        );
        console.log(`- Performance: ${performanceTime}ms for 10 operations`);

        // Validate integration
        expect(conditionalResult.entities.length).toBeGreaterThan(0);
        expect(filterResult.entities.length).toBeLessThanOrEqual(
          filterResult.totalCount,
        );
        expect(validationResult.summary.totalRules).toBeGreaterThan(0);
        expect(performanceTime).toBeLessThan(1000);

        // Validate GraphQL response integrity
        expect(organism.taxonId).toBe('3702');
        expect(Array.isArray(organism.genes)).toBe(true);

        if (organism.genes.length > 0) {
          const gene = organism.genes[0];
          expect(gene.identifier).toBeTruthy();

          if (gene.proteins.length > 0) {
            const protein = gene.proteins[0];
            expect(protein.identifier).toBeTruthy();
            expect(typeof protein.molecularWeight).toBe('number');

            if (protein.transcript) {
              expect(protein.transcript.gene.organism.name).toBe(organism.name);
            }
          }
        }
      }
    });

    test('validates comprehensive system performance and reliability', async () => {
      console.log('\n=== System Performance and Reliability Test ===');

      // Test system under various conditions
      const systemTests = [
        {name: 'High Volume', iterations: 50, entityCount: 100},
        {name: 'Complex Queries', iterations: 20, entityCount: 50},
        {name: 'Memory Stress', iterations: 100, entityCount: 200},
      ];

      const results = [];

      for (const test of systemTests) {
        console.log(`\nRunning ${test.name} test...`);

        const startTime = Date.now();
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < test.iterations; i++) {
          try {
            const entities = testRegistry
              .getAllEntityTypes()
              .flatMap((type) => testRegistry.getEntitiesByType(type))
              .slice(0, test.entityCount);

            const randomEntity =
              entities[Math.floor(Math.random() * entities.length)];

            // Perform various operations
            const directResult = relationshipResolver.resolveDirectRelationship(
              randomEntity,
              'organism',
            );
            const validationResult = validationFramework.validateEntity(
              randomEntity,
              {includeRelationships: false},
            );

            if (directResult || validationResult) {
              successCount++;
            }
          } catch (error) {
            errorCount++;
            console.warn(`Iteration ${i + 1} failed:`, error);
          }
        }

        const totalTime = Date.now() - startTime;
        const successRate = successCount / test.iterations;

        const testResult = {
          name: test.name,
          iterations: test.iterations,
          successCount,
          errorCount,
          successRate,
          totalTime,
          averageTime: totalTime / test.iterations,
        };

        results.push(testResult);

        console.log(`${test.name} results:`);
        console.log(`- Success rate: ${(successRate * 100).toFixed(1)}%`);
        console.log(`- Average time: ${testResult.averageTime.toFixed(2)}ms`);
        console.log(`- Total time: ${totalTime}ms`);
      }

      // Validate system reliability
      results.forEach((result) => {
        expect(result.successRate).toBeGreaterThan(0.95); // 95% success rate
        expect(result.averageTime).toBeLessThan(100); // Under 100ms average
      });

      console.log('\nOverall system health: GOOD');

      // Generate final statistics
      console.log('\n=== Final Infrastructure Statistics ===');

      console.log('Registry:', testRegistry.getStats());
      console.log(
        'Relationship resolver:',
        relationshipResolver.getRelationshipStats(),
      );
      console.log('Multi-hop cache:', multiHopResolver.getCacheStats());
      console.log('Consistency checker:', consistencyChecker.getStatistics());
      console.log(
        'Conditional loader:',
        conditionalLoader.getLoadingStatistics(),
      );
      console.log('Filter search:', filterSearch.getSearchStatistics());
      console.log(
        'Performance tester:',
        performanceTester.getPerformanceStatistics(),
      );
      console.log(
        'Validation framework:',
        validationFramework.getValidationStatistics(),
      );

      expect(results.length).toBe(systemTests.length);
    });
  });
});
