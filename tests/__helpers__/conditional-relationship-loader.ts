/**
 * Conditional Relationship Loader with Dynamic Constraints
 *
 * Advanced relationship loading system that supports conditional loading
 * based on entity properties, user permissions, data availability,
 * and complex business logic rules.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';
import {CollectionRelationshipManager} from './collection-relationship-manager.js';

export interface LoadingCondition {
  type:
    | 'property'
    | 'permission'
    | 'availability'
    | 'business_rule'
    | 'performance';
  field?: string;
  operator?: string;
  value?: any;
  evaluator?: (entity: EntityNode, context: LoadingContext) => boolean;
  description: string;
  priority: number; // Higher priority conditions are evaluated first
}

export interface LoadingContext {
  userPermissions?: string[];
  userRole?: string;
  dataAvailability?: Record<string, boolean>;
  performanceMode?: 'fast' | 'complete' | 'balanced';
  maxLoadTime?: number;
  cacheEnabled?: boolean;
  requestMetadata?: Record<string, any>;
}

export interface ConditionalLoadingRule {
  entityType: string;
  relationshipName: string;
  conditions: LoadingCondition[];
  fallbackBehavior: 'empty' | 'error' | 'simplified' | 'cached';
  loadingStrategy: 'eager' | 'lazy' | 'conditional' | 'streaming';
  cachePolicy?: {
    enabled: boolean;
    ttl?: number;
    invalidateOn?: string[];
  };
}

export interface LoadingResult {
  entities: EntityNode[];
  loadingStrategy: string;
  conditionsEvaluated: number;
  conditionsPassed: number;
  loadingTime: number;
  fromCache: boolean;
  fallbackUsed: boolean;
  warnings: string[];
  metadata: Record<string, any>;
}

/**
 * Conditional relationship loader with dynamic constraint evaluation
 */
export class ConditionalRelationshipLoader {
  private loadingRules = new Map<string, ConditionalLoadingRule[]>();
  private loadingCache = new Map<
    string,
    {result: LoadingResult; timestamp: number; ttl: number}
  >();
  private performanceMetrics = new Map<string, number[]>();

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
    private collectionManager: CollectionRelationshipManager,
  ) {
    this.initializeStandardRules();
  }

  /**
   * Initialize standard conditional loading rules for biological entities
   */
  private initializeStandardRules(): void {
    const standardRules: ConditionalLoadingRule[] = [
      // Gene -> Proteins: Load based on gene length and user permissions
      {
        entityType: 'Gene',
        relationshipName: 'proteins',
        conditions: [
          {
            type: 'property',
            field: 'length',
            operator: '>',
            value: 1000,
            description: 'Only load proteins for genes longer than 1kb',
            priority: 10,
          },
          {
            type: 'permission',
            evaluator: (entity, context) => {
              return context.userPermissions?.includes('view_proteins') ?? true;
            },
            description: 'User must have protein viewing permission',
            priority: 20,
          },
        ],
        fallbackBehavior: 'simplified',
        loadingStrategy: 'conditional',
        cachePolicy: {
          enabled: true,
          ttl: 300000, // 5 minutes
          invalidateOn: ['protein_update'],
        },
      },

      // Organism -> Genes: Performance-based loading
      {
        entityType: 'Organism',
        relationshipName: 'genes',
        conditions: [
          {
            type: 'performance',
            evaluator: (entity, context) => {
              const geneCount = this.registry.getRelationshipIds(
                entity.id,
                'genes',
              ).length;
              if (context.performanceMode === 'fast') {
                return geneCount <= 10;
              } else if (context.performanceMode === 'balanced') {
                return geneCount <= 100;
              }
              return true; // complete mode loads all
            },
            description: 'Load genes based on performance mode and gene count',
            priority: 15,
          },
        ],
        fallbackBehavior: 'simplified',
        loadingStrategy: 'conditional',
      },

      // QTL -> Trait: Availability-based loading
      {
        entityType: 'QTL',
        relationshipName: 'trait',
        conditions: [
          {
            type: 'availability',
            evaluator: (entity, context) => {
              return context.dataAvailability?.['traits_service'] ?? false;
            },
            description: 'Traits service must be available',
            priority: 25,
          },
          {
            type: 'business_rule',
            evaluator: (entity, _context) => {
              const qtlLod = entity.data.lod;
              return qtlLod && qtlLod >= 2.0; // Only load traits for significant QTLs
            },
            description: 'Only load traits for QTLs with LOD >= 2.0',
            priority: 5,
          },
        ],
        fallbackBehavior: 'cached',
        loadingStrategy: 'conditional',
      },

      // Protein -> Sequence: Size-based conditional loading
      {
        entityType: 'Protein',
        relationshipName: 'sequence',
        conditions: [
          {
            type: 'property',
            field: 'length',
            operator: '<',
            value: 1000,
            description:
              'Only load sequences for proteins smaller than 1000 AA',
            priority: 8,
          },
          {
            type: 'permission',
            evaluator: (entity, context) => {
              return context.userRole !== 'guest';
            },
            description: 'Registered users only',
            priority: 12,
          },
        ],
        fallbackBehavior: 'empty',
        loadingStrategy: 'lazy',
      },
    ];

    // Group rules by entity type
    standardRules.forEach((rule) => {
      const key = `${rule.entityType}.${rule.relationshipName}`;
      if (!this.loadingRules.has(key)) {
        this.loadingRules.set(key, []);
      }
      this.loadingRules.get(key)!.push(rule);
    });

    console.log(
      `Initialized ${standardRules.length} conditional loading rules`,
    );
  }

  /**
   * Load relationship with conditional evaluation
   */
  loadRelationship(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext = {},
  ): LoadingResult {
    const startTime = Date.now();
    const key = `${sourceEntity.type}.${relationshipName}`;

    // Check cache first
    const cacheResult = this.checkCache(
      sourceEntity,
      relationshipName,
      context,
    );
    if (cacheResult) {
      return cacheResult;
    }

    const result: LoadingResult = {
      entities: [],
      loadingStrategy: 'direct',
      conditionsEvaluated: 0,
      conditionsPassed: 0,
      loadingTime: 0,
      fromCache: false,
      fallbackUsed: false,
      warnings: [],
      metadata: {},
    };

    try {
      // Get applicable loading rules
      const rules = this.loadingRules.get(key) || [];

      if (rules.length === 0) {
        // No conditional rules - use direct loading
        return this.performDirectLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );
      }

      // Evaluate conditions for each rule
      for (const rule of rules) {
        const conditionResults = this.evaluateConditions(
          sourceEntity,
          rule.conditions,
          context,
        );
        result.conditionsEvaluated += conditionResults.evaluated;
        result.conditionsPassed += conditionResults.passed;
        result.loadingStrategy = rule.loadingStrategy;

        if (conditionResults.allPassed) {
          // All conditions passed - perform loading
          return this.performConditionalLoad(
            sourceEntity,
            relationshipName,
            rule,
            context,
            result,
          );
        } else {
          // Conditions failed - handle fallback
          result.warnings.push(
            `Conditions failed for rule: ${conditionResults.failedConditions.join(', ')}`,
          );
          return this.handleFallback(
            sourceEntity,
            relationshipName,
            rule,
            context,
            result,
          );
        }
      }

      // No rules matched - use direct loading
      return this.performDirectLoad(
        sourceEntity,
        relationshipName,
        context,
        result,
      );
    } catch (error) {
      result.warnings.push(`Loading error: ${error}`);
      result.entities = [];
    } finally {
      result.loadingTime = Date.now() - startTime;
      this.recordPerformanceMetrics(key, result.loadingTime);
    }

    return result;
  }

  /**
   * Evaluate loading conditions
   */
  private evaluateConditions(
    entity: EntityNode,
    conditions: LoadingCondition[],
    context: LoadingContext,
  ): {
    evaluated: number;
    passed: number;
    allPassed: boolean;
    failedConditions: string[];
  } {
    const failedConditions: string[] = [];
    let passed = 0;

    // Sort conditions by priority (highest first)
    const sortedConditions = conditions.sort((a, b) => b.priority - a.priority);

    for (const condition of sortedConditions) {
      const conditionPassed = this.evaluateCondition(
        entity,
        condition,
        context,
      );

      if (conditionPassed) {
        passed++;
      } else {
        failedConditions.push(condition.description);
      }
    }

    return {
      evaluated: conditions.length,
      passed,
      allPassed: passed === conditions.length,
      failedConditions,
    };
  }

  /**
   * Evaluate a single loading condition
   */
  private evaluateCondition(
    entity: EntityNode,
    condition: LoadingCondition,
    _context: LoadingContext,
  ): boolean {
    try {
      switch (condition.type) {
        case 'property':
          return this.evaluatePropertyCondition(entity, condition);

        case 'permission':
        case 'availability':
        case 'business_rule':
        case 'performance':
          return condition.evaluator
            ? condition.evaluator(entity, context)
            : true;

        default:
          console.warn(`Unknown condition type: ${condition.type}`);
          return true;
      }
    } catch (error) {
      console.warn(
        `Error evaluating condition ${condition.description}: ${error}`,
      );
      return false;
    }
  }

  /**
   * Evaluate property-based condition
   */
  private evaluatePropertyCondition(
    entity: EntityNode,
    condition: LoadingCondition,
  ): boolean {
    if (!condition.field || !condition.operator) return true;

    const value = entity.data[condition.field];
    const expectedValue = condition.value;

    switch (condition.operator) {
      case '>':
        return typeof value === 'number' && value > expectedValue;
      case '<':
        return typeof value === 'number' && value < expectedValue;
      case '>=':
        return typeof value === 'number' && value >= expectedValue;
      case '<=':
        return typeof value === 'number' && value <= expectedValue;
      case '=':
      case '==':
        return value === expectedValue;
      case '!=':
        return value !== expectedValue;
      case 'contains':
        return typeof value === 'string' && value.includes(expectedValue);
      case 'exists':
        return value !== null && value !== undefined;
      case 'not_exists':
        return value === null || value === undefined;
      default:
        return true;
    }
  }

  /**
   * Perform conditional loading based on rule
   */
  private performConditionalLoad(
    sourceEntity: EntityNode,
    relationshipName: string,
    rule: ConditionalLoadingRule,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    switch (rule.loadingStrategy) {
      case 'eager': {
        return this.performEagerLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );
      }

      case 'lazy':
        return this.performLazyLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );

      case 'conditional':
        return this.performDirectLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );

      case 'streaming': {
        return this.performStreamingLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );
      }

      default:
        return this.performDirectLoad(
          sourceEntity,
          relationshipName,
          context,
          result,
        );
    }
  }

  /**
   * Perform direct loading (standard approach)
   */
  private performDirectLoad(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    const resolved = this.directResolver.resolveDirectRelationship(
      sourceEntity,
      relationshipName,
    );

    if (resolved) {
      result.entities = resolved.entities;
      result.metadata.totalCount = resolved.totalCount;
      result.metadata.hasMore = resolved.hasMore;
    }

    this.cacheResult(sourceEntity, relationshipName, context, result);
    return result;
  }

  /**
   * Perform eager loading (preload related entities)
   */
  private performEagerLoad(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    // Load primary relationship
    const primaryResult = this.performDirectLoad(
      sourceEntity,
      relationshipName,
      context,
      result,
    );

    // Preload common related entities for each result
    const preloadRelationships = this.getPreloadRelationships(
      sourceEntity.type,
      relationshipName,
    );

    primaryResult.entities.forEach((entity) => {
      preloadRelationships.forEach((preloadRel) => {
        const preloaded = this.directResolver.resolveDirectRelationship(
          entity,
          preloadRel,
        );
        if (preloaded) {
          result.metadata[`preloaded_${preloadRel}`] =
            preloaded.entities.length;
        }
      });
    });

    result.loadingStrategy = 'eager';
    return primaryResult;
  }

  /**
   * Perform lazy loading (minimal initial load)
   */
  private performLazyLoad(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    // For lazy loading, just return entity IDs without full data
    const relationshipIds = this.registry.getRelationshipIds(
      sourceEntity.id,
      relationshipName,
    );

    result.entities = relationshipIds
      .slice(0, 5)
      .map((id) => {
        const entity = this.registry.getEntity(id);
        if (entity) {
          // Return minimal entity with just ID and type
          return {
            ...entity,
            data: {
              identifier:
                entity.data.identifier || entity.data.primaryIdentifier,
              id: entity.data.id,
              _lazy: true,
            },
          };
        }
        return null;
      })
      .filter((entity): entity is EntityNode => entity !== null);

    result.loadingStrategy = 'lazy';
    result.metadata.totalAvailable = relationshipIds.length;
    result.metadata.lazyLoaded = true;

    return result;
  }

  /**
   * Perform streaming load (paginated chunks)
   */
  private performStreamingLoad(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    const chunkSize = context.requestMetadata?.chunkSize || 10;
    const chunkIndex = context.requestMetadata?.chunkIndex || 0;

    const collectionResult = this.collectionManager.getPage(
      sourceEntity,
      relationshipName,
      chunkIndex + 1,
      chunkSize,
    );

    result.entities = collectionResult.entities;
    result.loadingStrategy = 'streaming';
    result.metadata = {
      ...collectionResult.metadata,
      pagination: collectionResult.pagination,
      chunkSize,
      chunkIndex,
    };

    return result;
  }

  /**
   * Handle fallback behavior when conditions fail
   */
  private handleFallback(
    sourceEntity: EntityNode,
    relationshipName: string,
    rule: ConditionalLoadingRule,
    context: LoadingContext,
    result: LoadingResult,
  ): LoadingResult {
    result.fallbackUsed = true;

    switch (rule.fallbackBehavior) {
      case 'empty':
        result.entities = [];
        result.warnings.push('Returned empty result due to failed conditions');
        break;

      case 'error':
        throw new Error(
          `Conditional loading failed for ${sourceEntity.type}.${relationshipName}`,
        );

      case 'simplified': {
        // Return simplified version with limited data
        const simplified = this.directResolver.resolveDirectRelationship(
          sourceEntity,
          relationshipName,
          {maxResults: 5},
        );
        if (simplified) {
          result.entities = simplified.entities.map((entity) => ({
            ...entity,
            data: {
              identifier:
                entity.data.identifier || entity.data.primaryIdentifier,
              name: entity.data.name,
              _simplified: true,
            },
          }));
        }
        result.warnings.push(
          'Returned simplified result due to failed conditions',
        );
        break;
      }

      case 'cached': {
        const cached = this.getCachedResult(sourceEntity, relationshipName);
        if (cached) {
          result.entities = cached.entities;
          result.fromCache = true;
          result.warnings.push(
            'Returned cached result due to failed conditions',
          );
        } else {
          result.entities = [];
          result.warnings.push('No cached result available, returned empty');
        }
        break;
      }
    }

    return result;
  }

  /**
   * Check cache for existing result
   */
  private checkCache(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
  ): LoadingResult | null {
    if (!context.cacheEnabled) return null;

    const cacheKey = this.createCacheKey(
      sourceEntity.id,
      relationshipName,
      context,
    );
    const cached = this.loadingCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      const result = {...cached.result};
      result.fromCache = true;
      return result;
    }

    return null;
  }

  /**
   * Cache loading result
   */
  private cacheResult(
    sourceEntity: EntityNode,
    relationshipName: string,
    context: LoadingContext,
    result: LoadingResult,
  ): void {
    if (!context.cacheEnabled) return;

    const cacheKey = this.createCacheKey(
      sourceEntity.id,
      relationshipName,
      context,
    );
    const rule = this.loadingRules.get(
      `${sourceEntity.type}.${relationshipName}`,
    )?.[0];
    const ttl = rule?.cachePolicy?.ttl || 300000; // Default 5 minutes

    this.loadingCache.set(cacheKey, {
      result: {...result},
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get cached result
   */
  private getCachedResult(
    sourceEntity: EntityNode,
    relationshipName: string,
  ): LoadingResult | null {
    const cacheKey = `${sourceEntity.id}_${relationshipName}`;
    const entries = Array.from(this.loadingCache.entries()).filter(([key]) =>
      key.includes(cacheKey),
    );

    if (entries.length > 0) {
      return entries[0][1].result;
    }

    return null;
  }

  /**
   * Create cache key
   */
  private createCacheKey(
    entityId: string,
    relationshipName: string,
    context: LoadingContext,
  ): string {
    const contextKey = JSON.stringify({
      permissions: context.userPermissions,
      role: context.userRole,
      performance: context.performanceMode,
    });
    return `${entityId}_${relationshipName}_${contextKey}`;
  }

  /**
   * Get relationships to preload for eager loading
   */
  private getPreloadRelationships(
    entityType: string,
    relationshipName: string,
  ): string[] {
    const preloadMap: Record<string, string[]> = {
      'Gene.proteins': ['sequence', 'transcript'],
      'Gene.transcripts': ['protein', 'sequence'],
      'Organism.genes': ['organism', 'strain'],
      'QTL.trait': ['organism'],
    };

    return preloadMap[`${entityType}.${relationshipName}`] || [];
  }

  /**
   * Record performance metrics
   */
  private recordPerformanceMetrics(key: string, loadTime: number): void {
    if (!this.performanceMetrics.has(key)) {
      this.performanceMetrics.set(key, []);
    }

    const metrics = this.performanceMetrics.get(key)!;
    metrics.push(loadTime);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * Add custom loading rule
   */
  addLoadingRule(rule: ConditionalLoadingRule): void {
    const key = `${rule.entityType}.${rule.relationshipName}`;
    if (!this.loadingRules.has(key)) {
      this.loadingRules.set(key, []);
    }
    this.loadingRules.get(key)!.push(rule);
  }

  /**
   * Get loading statistics
   */
  getLoadingStatistics(): {
    totalRules: number;
    cacheHitRate: number;
    averageLoadTimes: Record<string, number>;
    conditionSuccessRate: Record<string, number>;
  } {
    const cacheEntries = Array.from(this.loadingCache.values());
    const totalCacheRequests = cacheEntries.length;
    const cacheHits = cacheEntries.filter(
      (entry) => Date.now() - entry.timestamp < entry.ttl,
    ).length;

    const averageLoadTimes: Record<string, number> = {};
    this.performanceMetrics.forEach((times, key) => {
      if (times.length > 0) {
        averageLoadTimes[key] = times.reduce((a, b) => a + b, 0) / times.length;
      }
    });

    return {
      totalRules: Array.from(this.loadingRules.values()).reduce(
        (sum, rules) => sum + rules.length,
        0,
      ),
      cacheHitRate: totalCacheRequests > 0 ? cacheHits / totalCacheRequests : 0,
      averageLoadTimes,
      conditionSuccessRate: {}, // Would track this in a real implementation
    };
  }

  /**
   * Clear caches
   */
  clearCaches(): void {
    this.loadingCache.clear();
    this.performanceMetrics.clear();
  }
}

/**
 * Factory function to create conditional relationship loader
 */
export function createConditionalRelationshipLoader(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
  collectionManager: CollectionRelationshipManager,
): ConditionalRelationshipLoader {
  return new ConditionalRelationshipLoader(
    registry,
    directResolver,
    collectionManager,
  );
}
