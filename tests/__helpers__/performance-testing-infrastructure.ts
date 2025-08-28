/**
 * Performance Testing Infrastructure for Large Dataset Validation
 *
 * Comprehensive performance testing system for validating GraphQL
 * relationship queries under various load conditions, dataset sizes,
 * and complexity scenarios with detailed metrics and benchmarking.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';
import {MultiHopResolver} from './multi-hop-resolver.js';
import {CollectionRelationshipManager} from './collection-relationship-manager.js';
import {RelationshipFilterSearch} from './relationship-filter-search.js';

export interface PerformanceTestConfig {
  name: string;
  description: string;
  iterations: number;
  warmupIterations?: number;
  datasetSizes: number[];
  concurrency?: number;
  timeout?: number;
  memoryLimit?: number;
  cpuThreshold?: number;
}

export interface LoadTestScenario {
  name: string;
  entityType: string;
  relationshipName: string;
  queryComplexity: 'simple' | 'moderate' | 'complex' | 'extreme';
  expectedLatency?: number;
  expectedThroughput?: number;
  scalabilityTarget?: 'linear' | 'logarithmic' | 'constant';
}

export interface PerformanceMetrics {
  latency: {
    min: number;
    max: number;
    mean: number;
    median: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    operationsPerSecond: number;
  };
  resource: {
    memoryUsage: number;
    cpuUsage: number;
    cacheHitRate: number;
  };
  scalability: {
    datasetSize: number;
    linearityScore: number; // 0-1, where 1 is perfectly linear
    breakingPoint?: number;
  };
  errors: {
    timeouts: number;
    failures: number;
    rate: number;
  };
}

export interface BenchmarkResult {
  testName: string;
  scenario: LoadTestScenario;
  metrics: PerformanceMetrics;
  passed: boolean;
  timestamp: number;
  environment: {
    nodeVersion: string;
    platform: string;
    memoryLimit: number;
  };
  comparison?: {
    baseline: PerformanceMetrics;
    improvement: number; // Percentage improvement/degradation
    significantChange: boolean;
  };
}

export interface DatasetGenerator {
  generateEntities(count: number, type: string): EntityNode[];
  generateRelationships(entities: EntityNode[], density: number): void;
  createRealisticDistribution(type: string): any;
}

/**
 * Performance testing infrastructure with comprehensive benchmarking
 */
export class PerformanceTestingInfrastructure {
  private benchmarkHistory = new Map<string, BenchmarkResult[]>();
  private activeTests = new Map<string, PerformanceTestConfig>();
  private datasetGenerator: DatasetGenerator;

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
    private multiHopResolver: MultiHopResolver,
    private collectionManager: CollectionRelationshipManager,
    private filterSearch: RelationshipFilterSearch,
  ) {
    this.datasetGenerator = this.createDatasetGenerator();
  }

  /**
   * Execute comprehensive performance test suite
   */
  async runPerformanceTestSuite(
    scenarios: LoadTestScenario[],
    config: PerformanceTestConfig,
  ): Promise<BenchmarkResult[]> {
    console.log(`\n=== Performance Test Suite: ${config.name} ===`);
    console.log(`Description: ${config.description}`);
    console.log(
      `Iterations: ${config.iterations}, Warmup: ${config.warmupIterations || 0}`,
    );
    console.log(`Dataset sizes: ${config.datasetSizes.join(', ')}`);

    const results: BenchmarkResult[] = [];

    for (const size of config.datasetSizes) {
      console.log(`\n--- Testing with dataset size: ${size} ---`);

      // Generate test dataset
      await this.prepareTestDataset(size);

      for (const scenario of scenarios) {
        console.log(`Running scenario: ${scenario.name}`);

        const result = await this.runLoadTestScenario(scenario, config, size);
        results.push(result);

        // Log immediate results
        console.log(
          `  Latency: ${result.metrics.latency.mean.toFixed(2)}ms (p95: ${result.metrics.latency.p95.toFixed(2)}ms)`,
        );
        console.log(
          `  Throughput: ${result.metrics.throughput.requestsPerSecond.toFixed(2)} req/sec`,
        );
        console.log(
          `  Memory: ${(result.metrics.resource.memoryUsage / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(`  Status: ${result.passed ? 'PASS' : 'FAIL'}`);

        // Check for performance regression
        const historical = this.getBenchmarkHistory(result.testName);
        if (historical.length > 0) {
          const baseline = historical[historical.length - 1];
          result.comparison = this.comparePerformance(
            result.metrics,
            baseline.metrics,
          );

          if (result.comparison.significantChange) {
            console.log(
              `  📊 Performance change: ${result.comparison.improvement.toFixed(1)}%`,
            );
          }
        }
      }
    }

    // Store results in history
    results.forEach((result) => {
      this.addBenchmarkResult(result);
    });

    // Generate summary report
    this.generatePerformanceReport(results, config);

    return results;
  }

  /**
   * Run a single load test scenario
   */
  private async runLoadTestScenario(
    scenario: LoadTestScenario,
    config: PerformanceTestConfig,
    datasetSize: number,
  ): Promise<BenchmarkResult> {
    const testName = `${scenario.name}_${datasetSize}`;
    const measurements: number[] = [];
    const memoryMeasurements: number[] = [];
    const errors = {timeouts: 0, failures: 0, rate: 0};

    // Get test entities
    const testEntities = this.registry.getEntitiesByType(scenario.entityType);
    if (testEntities.length === 0) {
      throw new Error(
        `No entities of type ${scenario.entityType} available for testing`,
      );
    }

    // Warmup phase
    if (config.warmupIterations && config.warmupIterations > 0) {
      console.log(`  Warming up (${config.warmupIterations} iterations)...`);
      for (let i = 0; i < config.warmupIterations; i++) {
        await this.executeTestIteration(
          scenario,
          testEntities[i % testEntities.length],
        );
      }
    }

    // Actual test phase
    const startTime = Date.now();

    for (let i = 0; i < config.iterations; i++) {
      const testEntity = testEntities[i % testEntities.length];

      try {
        const iterationStart = performance.now();
        const memoryBefore = process.memoryUsage().heapUsed;

        await this.executeTestIteration(scenario, testEntity);

        const iterationEnd = performance.now();
        const memoryAfter = process.memoryUsage().heapUsed;

        measurements.push(iterationEnd - iterationStart);
        memoryMeasurements.push(memoryAfter - memoryBefore);
      } catch (error) {
        errors.failures++;
        console.warn(`  Iteration ${i + 1} failed: ${error}`);
      }

      // Check timeout
      if (config.timeout && Date.now() - startTime > config.timeout) {
        errors.timeouts++;
        break;
      }
    }

    const totalTime = Date.now() - startTime;
    errors.rate = (errors.failures + errors.timeouts) / config.iterations;

    // Calculate metrics
    const metrics = this.calculatePerformanceMetrics(
      measurements,
      memoryMeasurements,
      totalTime,
      datasetSize,
      errors,
    );

    // Determine if test passed
    const passed = this.evaluateTestResult(scenario, metrics);

    return {
      testName,
      scenario,
      metrics,
      passed,
      timestamp: Date.now(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryLimit: config.memoryLimit || 0,
      },
    };
  }

  /**
   * Execute a single test iteration based on scenario
   */
  private async executeTestIteration(
    scenario: LoadTestScenario,
    testEntity: EntityNode,
  ): Promise<void> {
    switch (scenario.queryComplexity) {
      case 'simple': {
        // Direct relationship resolution
        this.directResolver.resolveDirectRelationship(
          testEntity,
          scenario.relationshipName,
        );
        break;
      }

      case 'moderate':
        // Collection with pagination
        this.collectionManager.getCollection(
          testEntity,
          scenario.relationshipName,
          {limit: 20},
        );
        break;

      case 'complex': {
        // Multi-hop traversal
        const complexPath = this.getComplexPath(
          scenario.entityType,
          scenario.relationshipName,
        );
        this.multiHopResolver.traversePath(testEntity, complexPath, {
          maxDepth: 4,
        });
        break;
      }

      case 'extreme':
        // Complex search with filtering
        this.filterSearch.searchRelationships(
          testEntity,
          scenario.relationshipName,
          {
            text: 'test protein gene',
            filters: [
              {field: 'length', operator: 'greater_than', value: 100},
              {field: 'name', operator: 'contains', value: 'protein'},
            ],
            facets: [
              {field: 'type', type: 'terms'},
              {
                field: 'length',
                type: 'range',
                ranges: [{from: 0, to: 1000, label: 'small'}],
              },
            ],
            sorting: [{field: 'length', direction: 'desc'}],
            pagination: {limit: 10, offset: 0},
          },
        );
        break;
    }
  }

  /**
   * Calculate comprehensive performance metrics
   */
  private calculatePerformanceMetrics(
    latencyMeasurements: number[],
    memoryMeasurements: number[],
    totalTime: number,
    datasetSize: number,
    errors: {timeouts: number; failures: number; rate: number},
  ): PerformanceMetrics {
    const sortedLatencies = latencyMeasurements.sort((a, b) => a - b);
    const validMeasurements = sortedLatencies.length;

    const latency = {
      min: Math.min(...sortedLatencies),
      max: Math.max(...sortedLatencies),
      mean: sortedLatencies.reduce((a, b) => a + b, 0) / validMeasurements,
      median: this.percentile(sortedLatencies, 0.5),
      p95: this.percentile(sortedLatencies, 0.95),
      p99: this.percentile(sortedLatencies, 0.99),
    };

    const throughput = {
      requestsPerSecond: validMeasurements / (totalTime / 1000),
      operationsPerSecond: validMeasurements / (totalTime / 1000),
    };

    const avgMemoryUsage =
      memoryMeasurements.length > 0
        ? memoryMeasurements.reduce((a, b) => a + b, 0) /
          memoryMeasurements.length
        : 0;

    const resource = {
      memoryUsage: avgMemoryUsage,
      cpuUsage: 0, // Would need OS-specific implementation
      cacheHitRate: 0.8, // Placeholder - would track actual cache hits
    };

    // Calculate scalability score (simplified)
    const expectedLinearLatency = datasetSize * 0.001; // 1ms per 1000 entities
    const linearityScore = Math.max(
      0,
      1 -
        Math.abs(latency.mean - expectedLinearLatency) / expectedLinearLatency,
    );

    const scalability = {
      datasetSize,
      linearityScore,
      breakingPoint: latency.mean > 1000 ? datasetSize : undefined,
    };

    return {
      latency,
      throughput,
      resource,
      scalability,
      errors,
    };
  }

  /**
   * Calculate percentile value
   */
  private percentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil(sortedArray.length * percentile) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Evaluate if test result meets performance criteria
   */
  private evaluateTestResult(
    scenario: LoadTestScenario,
    metrics: PerformanceMetrics,
  ): boolean {
    let passed = true;

    // Check latency requirements
    if (
      scenario.expectedLatency &&
      metrics.latency.p95 > scenario.expectedLatency
    ) {
      passed = false;
    }

    // Check throughput requirements
    if (
      scenario.expectedThroughput &&
      metrics.throughput.requestsPerSecond < scenario.expectedThroughput
    ) {
      passed = false;
    }

    // Check error rate
    if (metrics.errors.rate > 0.01) {
      // 1% error threshold
      passed = false;
    }

    // Check scalability
    if (
      scenario.scalabilityTarget === 'linear' &&
      metrics.scalability.linearityScore < 0.8
    ) {
      passed = false;
    }

    return passed;
  }

  /**
   * Prepare test dataset with specified size
   */
  private async prepareTestDataset(size: number): Promise<void> {
    console.log(`  Preparing test dataset with ${size} entities...`);

    const entityTypes = ['Gene', 'Protein', 'Transcript', 'Organism'];
    const entitiesPerType = Math.ceil(size / entityTypes.length);

    // Clear existing test data
    this.registry.clearTestData?.();

    // Generate entities
    entityTypes.forEach((type) => {
      const entities = this.datasetGenerator.generateEntities(
        entitiesPerType,
        type,
      );
      entities.forEach((entity) => {
        this.registry.registerEntity(entity.id, entity.type, entity.data, {});
      });
    });

    // Generate relationships with realistic density
    const allEntities = entityTypes.flatMap((type) =>
      this.registry.getEntitiesByType(type),
    );
    this.datasetGenerator.generateRelationships(allEntities, 0.3); // 30% relationship density

    console.log(
      `  Dataset prepared: ${this.registry.getStats().totalEntities} entities, ${this.registry.getStats().totalRelationships} relationships`,
    );
  }

  /**
   * Create dataset generator for performance testing
   */
  private createDatasetGenerator(): DatasetGenerator {
    return {
      generateEntities: (count: number, type: string): EntityNode[] => {
        const entities: EntityNode[] = [];

        for (let i = 0; i < count; i++) {
          const id = `${type.toLowerCase()}_perf_${i}`;
          const data = this.generateEntityData(type, i);

          entities.push({
            id,
            type,
            data,
            relationships: new Map(),
          });
        }

        return entities;
      },

      generateRelationships: (
        entities: EntityNode[],
        density: number,
      ): void => {
        const relationshipPairs = [
          {from: 'Gene', to: 'Organism', relationship: 'organism'},
          {from: 'Gene', to: 'Protein', relationship: 'proteins'},
          {from: 'Gene', to: 'Transcript', relationship: 'transcripts'},
          {from: 'Protein', to: 'Gene', relationship: 'gene'},
          {from: 'Transcript', to: 'Gene', relationship: 'gene'},
        ];

        relationshipPairs.forEach((pair) => {
          const sourceEntities = entities.filter((e) => e.type === pair.from);
          const targetEntities = entities.filter((e) => e.type === pair.to);

          sourceEntities.forEach((source) => {
            const relationshipCount = Math.floor(
              targetEntities.length * density * Math.random(),
            );
            const targets = targetEntities
              .sort(() => 0.5 - Math.random())
              .slice(0, relationshipCount);

            if (!source.relationships.has(pair.relationship)) {
              source.relationships.set(pair.relationship, []);
            }

            targets.forEach((target) => {
              source.relationships.get(pair.relationship)!.push(target.id);
            });
          });
        });
      },

      createRealisticDistribution: (type: string): any => {
        // Generate realistic biological data distributions
        const distributions: Record<string, () => any> = {
          Gene: () => ({
            length: Math.floor(Math.random() * 50000) + 500,
            score: Math.random(),
            name: `Gene_${Math.random().toString(36).substr(2, 8)}`,
          }),
          Protein: () => ({
            length: Math.floor(Math.random() * 2000) + 50,
            molecularWeight: Math.floor(Math.random() * 100000) + 10000,
            name: `Protein_${Math.random().toString(36).substr(2, 8)}`,
          }),
        };

        return distributions[type] ? distributions[type]() : {};
      },
    };
  }

  /**
   * Generate entity data based on type
   */
  private generateEntityData(type: string, index: number): any {
    const baseData = {
      id: index,
      identifier: `${type.toUpperCase()}_PERF_${index.toString().padStart(6, '0')}`,
      primaryIdentifier: `${type.toUpperCase()}_PERF_${index.toString().padStart(6, '0')}`,
      name: `Performance Test ${type} ${index}`,
      description: `Generated ${type} entity for performance testing`,
    };

    // Add type-specific realistic data
    const typeSpecific =
      this.datasetGenerator.createRealisticDistribution(type);

    return {...baseData, ...typeSpecific};
  }

  /**
   * Get complex path for multi-hop testing
   */
  private getComplexPath(
    entityType: string,
    relationshipName: string,
  ): string[] {
    const complexPaths: Record<string, string[]> = {
      'Gene.proteins': ['organism', 'genes', 'proteins'],
      'Protein.gene': ['gene', 'organism', 'genes'],
      'Organism.genes': ['genes', 'proteins', 'gene'],
    };

    return (
      complexPaths[`${entityType}.${relationshipName}`] || [relationshipName]
    );
  }

  /**
   * Compare performance against baseline
   */
  private comparePerformance(
    current: PerformanceMetrics,
    baseline: PerformanceMetrics,
  ): {
    baseline: PerformanceMetrics;
    improvement: number;
    significantChange: boolean;
  } {
    const latencyImprovement =
      ((baseline.latency.mean - current.latency.mean) / baseline.latency.mean) *
      100;
    const throughputImprovement =
      ((current.throughput.requestsPerSecond -
        baseline.throughput.requestsPerSecond) /
        baseline.throughput.requestsPerSecond) *
      100;

    const overallImprovement = (latencyImprovement + throughputImprovement) / 2;
    const significantChange = Math.abs(overallImprovement) > 10; // 10% threshold

    return {
      baseline,
      improvement: overallImprovement,
      significantChange,
    };
  }

  /**
   * Generate comprehensive performance report
   */
  private generatePerformanceReport(
    results: BenchmarkResult[],
    config: PerformanceTestConfig,
  ): void {
    console.log(`\n=== Performance Test Report: ${config.name} ===`);
    console.log(`Generated: ${new Date().toISOString()}`);

    // Summary statistics
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const avgLatency =
      results.reduce((sum, r) => sum + r.metrics.latency.mean, 0) / totalTests;
    const avgThroughput =
      results.reduce(
        (sum, r) => sum + r.metrics.throughput.requestsPerSecond,
        0,
      ) / totalTests;

    console.log(`\n--- Summary ---`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(
      `Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`,
    );
    console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`Average Throughput: ${avgThroughput.toFixed(2)} req/sec`);

    // Scalability analysis
    console.log(`\n--- Scalability Analysis ---`);
    const scalabilityScores = results.map(
      (r) => r.metrics.scalability.linearityScore,
    );
    const avgScalability =
      scalabilityScores.reduce((a, b) => a + b, 0) / scalabilityScores.length;
    console.log(
      `Average Linearity Score: ${(avgScalability * 100).toFixed(1)}%`,
    );

    // Performance by dataset size
    console.log(`\n--- Performance by Dataset Size ---`);
    config.datasetSizes.forEach((size) => {
      const sizeResults = results.filter(
        (r) => r.metrics.scalability.datasetSize === size,
      );
      if (sizeResults.length > 0) {
        const avgLatencyForSize =
          sizeResults.reduce((sum, r) => sum + r.metrics.latency.mean, 0) /
          sizeResults.length;
        const avgThroughputForSize =
          sizeResults.reduce(
            (sum, r) => sum + r.metrics.throughput.requestsPerSecond,
            0,
          ) / sizeResults.length;
        console.log(
          `Size ${size}: ${avgLatencyForSize.toFixed(2)}ms latency, ${avgThroughputForSize.toFixed(2)} req/sec`,
        );
      }
    });

    // Failed tests
    const failedTests = results.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      console.log(`\n--- Failed Tests ---`);
      failedTests.forEach((test) => {
        console.log(
          `${test.testName}: Latency ${test.metrics.latency.p95.toFixed(2)}ms, Errors ${(test.metrics.errors.rate * 100).toFixed(1)}%`,
        );
      });
    }

    console.log(`\n=== End Report ===\n`);
  }

  /**
   * Add benchmark result to history
   */
  private addBenchmarkResult(result: BenchmarkResult): void {
    const testName = result.testName;
    if (!this.benchmarkHistory.has(testName)) {
      this.benchmarkHistory.set(testName, []);
    }

    const history = this.benchmarkHistory.get(testName)!;
    history.push(result);

    // Keep only last 100 results
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get benchmark history for a test
   */
  private getBenchmarkHistory(testName: string): BenchmarkResult[] {
    return this.benchmarkHistory.get(testName) || [];
  }

  /**
   * Get performance testing statistics
   */
  getPerformanceStatistics(): {
    totalTests: number;
    uniqueScenarios: number;
    averageLatency: number;
    bestThroughput: number;
    scalabilityScore: number;
  } {
    const allResults = Array.from(this.benchmarkHistory.values()).flat();

    if (allResults.length === 0) {
      return {
        totalTests: 0,
        uniqueScenarios: 0,
        averageLatency: 0,
        bestThroughput: 0,
        scalabilityScore: 0,
      };
    }

    const avgLatency =
      allResults.reduce((sum, r) => sum + r.metrics.latency.mean, 0) /
      allResults.length;
    const bestThroughput = Math.max(
      ...allResults.map((r) => r.metrics.throughput.requestsPerSecond),
    );
    const avgScalability =
      allResults.reduce(
        (sum, r) => sum + r.metrics.scalability.linearityScore,
        0,
      ) / allResults.length;

    return {
      totalTests: allResults.length,
      uniqueScenarios: new Set(allResults.map((r) => r.scenario.name)).size,
      averageLatency: avgLatency,
      bestThroughput,
      scalabilityScore: avgScalability,
    };
  }

  /**
   * Clear performance history
   */
  clearHistory(): void {
    this.benchmarkHistory.clear();
  }
}

/**
 * Factory function to create performance testing infrastructure
 */
export function createPerformanceTestingInfrastructure(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
  multiHopResolver: MultiHopResolver,
  collectionManager: CollectionRelationshipManager,
  filterSearch: RelationshipFilterSearch,
): PerformanceTestingInfrastructure {
  return new PerformanceTestingInfrastructure(
    registry,
    directResolver,
    multiHopResolver,
    collectionManager,
    filterSearch,
  );
}
