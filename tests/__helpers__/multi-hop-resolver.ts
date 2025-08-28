/**
 * Multi-Hop Relationship Resolver for Complex Chain Navigation
 *
 * Enables traversal of complex relationship chains with intelligent
 * path optimization, cycle detection, and comprehensive validation
 * for deep GraphQL relationship queries.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';

export interface MultiHopPath {
  steps: string[];
  entityTypes: string[];
  isCircular: boolean;
  maxDepth?: number;
}

export interface TraversalOptions {
  maxDepth?: number;
  allowCycles?: boolean;
  maxResults?: number;
  validateTypes?: boolean;
  collectMetrics?: boolean;
}

export interface TraversalResult {
  entities: EntityNode[];
  path: MultiHopPath;
  traversalTime: number;
  stepsExecuted: number;
  cyclesDetected: number;
  totalEntitiesVisited: number;
  warnings: string[];
  metadata: Record<string, any>;
}

export interface PathValidationResult {
  isValid: boolean;
  brokenAt?: number;
  missingRelationships: string[];
  typeConflicts: string[];
  suggestions: string[];
}

/**
 * Multi-hop relationship resolver with path optimization
 */
export class MultiHopResolver {
  private pathCache = new Map<string, TraversalResult>();
  private validationCache = new Map<string, PathValidationResult>();

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
  ) {}

  /**
   * Traverse a multi-hop relationship path from a root entity
   */
  traversePath(
    rootEntity: EntityNode,
    path: string[],
    options: TraversalOptions = {},
  ): TraversalResult {
    const startTime = Date.now();
    const {
      maxDepth = 10,
      allowCycles = false,
      maxResults = 100,
      validateTypes = true,
      collectMetrics = true,
    } = options;

    const cacheKey = this.createCacheKey(rootEntity.id, path, options);
    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey)!;
    }

    const result: TraversalResult = {
      entities: [],
      path: {
        steps: path,
        entityTypes: [rootEntity.type],
        isCircular: false,
      },
      traversalTime: 0,
      stepsExecuted: 0,
      cyclesDetected: 0,
      totalEntitiesVisited: 0,
      warnings: [],
      metadata: {},
    };

    try {
      // Validate path before traversal
      if (validateTypes) {
        const pathValidation = this.validatePath(rootEntity, path);
        if (!pathValidation.isValid) {
          result.warnings.push(
            `Path validation failed: ${pathValidation.missingRelationships.join(', ')}`,
          );
          if (pathValidation.brokenAt !== undefined) {
            result.warnings.push(
              `Path broken at step ${pathValidation.brokenAt + 1}`,
            );
          }
        }
      }

      // Check depth limits
      if (path.length > maxDepth) {
        result.warnings.push(
          `Path length ${path.length} exceeds maxDepth ${maxDepth}`,
        );
        result.traversalTime = Date.now() - startTime;
        return result;
      }

      // Execute traversal
      let currentEntities = [rootEntity];
      const visitedEntities = new Set<string>();
      const entityTypeChain: string[] = [rootEntity.type];

      visitedEntities.add(rootEntity.id);
      result.totalEntitiesVisited = 1;

      for (let stepIndex = 0; stepIndex < path.length; stepIndex++) {
        const relationshipName = path[stepIndex];
        const nextEntities: EntityNode[] = [];

        for (const currentEntity of currentEntities) {
          const resolved = this.directResolver.resolveDirectRelationship(
            currentEntity,
            relationshipName,
          );

          if (resolved && resolved.entities.length > 0) {
            for (const relatedEntity of resolved.entities) {
              // Cycle detection
              if (visitedEntities.has(relatedEntity.id)) {
                result.cyclesDetected++;
                if (!allowCycles) {
                  result.warnings.push(
                    `Cycle detected at step ${stepIndex + 1} for entity ${relatedEntity.id}`,
                  );
                  continue;
                }
                result.path.isCircular = true;
              }

              nextEntities.push(relatedEntity);
              visitedEntities.add(relatedEntity.id);
              result.totalEntitiesVisited++;
            }
          } else {
            result.warnings.push(
              `No entities found for ${currentEntity.type}.${relationshipName} at step ${stepIndex + 1}`,
            );
          }
        }

        if (nextEntities.length === 0) {
          result.warnings.push(
            `Path terminated at step ${stepIndex + 1}: no entities found`,
          );
          break;
        }

        // Update type chain
        if (nextEntities.length > 0) {
          entityTypeChain.push(nextEntities[0].type);
        }

        currentEntities = nextEntities;
        result.stepsExecuted = stepIndex + 1;

        // Apply result limits
        if (currentEntities.length > maxResults) {
          currentEntities = currentEntities.slice(0, maxResults);
          result.warnings.push(
            `Results truncated to ${maxResults} entities at step ${stepIndex + 1}`,
          );
        }
      }

      result.entities = currentEntities;
      result.path.entityTypes = entityTypeChain;

      // Collect additional metrics
      if (collectMetrics) {
        result.metadata.pathEfficiency =
          result.entities.length / Math.max(result.totalEntitiesVisited, 1);
        result.metadata.averageEntitiesPerStep =
          result.totalEntitiesVisited / Math.max(result.stepsExecuted, 1);
        result.metadata.uniqueEntityTypes = [
          ...new Set(entityTypeChain),
        ].length;
      }
    } catch (error) {
      result.warnings.push(`Traversal error: ${error}`);
    }

    result.traversalTime = Date.now() - startTime;

    // Cache result for future use
    this.pathCache.set(cacheKey, result);

    return result;
  }

  /**
   * Validate that a relationship path is viable
   */
  validatePath(rootEntity: EntityNode, path: string[]): PathValidationResult {
    const cacheKey = `validate_${rootEntity.type}_${path.join('.')}`;
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    const result: PathValidationResult = {
      isValid: true,
      missingRelationships: [],
      typeConflicts: [],
      suggestions: [],
    };

    let currentEntityType = rootEntity.type;

    for (let i = 0; i < path.length; i++) {
      const relationshipName = path[i];
      const availableRelationships =
        this.directResolver.getAvailableRelationships(currentEntityType);
      const relationship = availableRelationships.find(
        (r) => r.relationshipName === relationshipName,
      );

      if (!relationship) {
        result.isValid = false;
        result.brokenAt = i;
        result.missingRelationships.push(
          `${currentEntityType}.${relationshipName}`,
        );

        // Suggest similar relationships
        const similarRelationships = availableRelationships
          .filter((r) =>
            this.isSimilarRelationshipName(
              r.relationshipName,
              relationshipName,
            ),
          )
          .map((r) => r.relationshipName);

        if (similarRelationships.length > 0) {
          result.suggestions.push(
            `Did you mean: ${similarRelationships.join(', ')}?`,
          );
        }

        break;
      }

      currentEntityType = relationship.targetType;
    }

    this.validationCache.set(cacheKey, result);
    return result;
  }

  /**
   * Find all possible paths between two entity types
   */
  findPathsBetweenTypes(
    sourceType: string,
    targetType: string,
    maxDepth: number = 5,
  ): MultiHopPath[] {
    const paths: MultiHopPath[] = [];
    const visited = new Set<string>();

    const dfs = (
      currentType: string,
      currentPath: string[],
      currentTypes: string[],
      depth: number,
    ) => {
      if (depth > maxDepth) return;

      if (currentType === targetType && depth > 0) {
        paths.push({
          steps: [...currentPath],
          entityTypes: [...currentTypes],
          isCircular: false,
          maxDepth: depth,
        });
        return;
      }

      const stateKey = `${currentType}_${depth}_${currentPath.join('.')}`;
      if (visited.has(stateKey)) return;
      visited.add(stateKey);

      const relationships =
        this.directResolver.getAvailableRelationships(currentType);

      for (const relationship of relationships) {
        if (
          !currentTypes.includes(relationship.targetType) ||
          relationship.targetType === targetType
        ) {
          dfs(
            relationship.targetType,
            [...currentPath, relationship.relationshipName],
            [...currentTypes, relationship.targetType],
            depth + 1,
          );
        }
      }

      visited.delete(stateKey);
    };

    dfs(sourceType, [], [sourceType], 0);
    return paths;
  }

  /**
   * Execute multiple path traversals in parallel
   */
  async traverseMultiplePaths(
    rootEntity: EntityNode,
    paths: string[][],
    options: TraversalOptions = {},
  ): Promise<TraversalResult[]> {
    const results = paths.map((path) =>
      this.traversePath(rootEntity, path, options),
    );

    // Add comparative metadata
    const totalEntities = results.reduce(
      (sum, r) => sum + r.entities.length,
      0,
    );
    const avgTraversalTime =
      results.reduce((sum, r) => sum + r.traversalTime, 0) / results.length;

    results.forEach((result, index) => {
      result.metadata.pathIndex = index;
      result.metadata.relativePerformance =
        result.traversalTime / avgTraversalTime;
      result.metadata.relativeYield =
        result.entities.length / Math.max(totalEntities / results.length, 1);
    });

    return results;
  }

  /**
   * Get the shortest path between two entities
   */
  getShortestPath(
    sourceEntity: EntityNode,
    targetEntityId: string,
    maxDepth: number = 5,
  ): TraversalResult | null {
    const targetEntity = this.registry.getEntity(targetEntityId);
    if (!targetEntity) return null;

    const possiblePaths = this.findPathsBetweenTypes(
      sourceEntity.type,
      targetEntity.type,
      maxDepth,
    );
    if (possiblePaths.length === 0) return null;

    // Sort by path length (shortest first)
    possiblePaths.sort((a, b) => a.steps.length - b.steps.length);

    // Try each path until we find one that reaches the target
    for (const path of possiblePaths) {
      const result = this.traversePath(sourceEntity, path.steps, {maxDepth});

      if (result.entities.some((entity) => entity.id === targetEntityId)) {
        result.metadata.shortestPath = true;
        result.metadata.alternativePaths = possiblePaths.length - 1;
        return result;
      }
    }

    return null;
  }

  /**
   * Analyze relationship connectivity patterns
   */
  analyzeConnectivity(
    entityType: string,
    depth: number = 3,
  ): {
    reachableTypes: Set<string>;
    commonPaths: MultiHopPath[];
    connectivityScore: number;
    centralityMetrics: Record<string, number>;
  } {
    const reachableTypes = new Set<string>();
    const pathCounts = new Map<string, number>();

    const entities = this.registry.getEntitiesByType(entityType);
    const sampleEntity = entities[0];

    if (!sampleEntity) {
      return {
        reachableTypes: new Set(),
        commonPaths: [],
        connectivityScore: 0,
        centralityMetrics: {},
      };
    }

    // Analyze reachability
    const allRelationshipTypes = this.registry.getAllEntityTypes();

    for (const targetType of allRelationshipTypes) {
      if (targetType !== entityType) {
        const paths = this.findPathsBetweenTypes(entityType, targetType, depth);
        if (paths.length > 0) {
          reachableTypes.add(targetType);

          // Count path frequency
          paths.forEach((path) => {
            const pathKey = path.steps.join('->');
            pathCounts.set(pathKey, (pathCounts.get(pathKey) || 0) + 1);
          });
        }
      }
    }

    // Find most common paths
    const commonPaths: MultiHopPath[] = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pathKey, _count]) => ({
        steps: pathKey.split('->'),
        entityTypes: [], // Would need to reconstruct
        isCircular: false,
        maxDepth: pathKey.split('->').length,
      }));

    // Calculate connectivity score
    const connectivityScore =
      reachableTypes.size / Math.max(allRelationshipTypes.length - 1, 1);

    // Calculate centrality metrics
    const relationships =
      this.directResolver.getAvailableRelationships(entityType);
    const centralityMetrics = {
      outDegree: relationships.length,
      reachabilityScore: connectivityScore,
      pathDiversity: pathCounts.size,
    };

    return {
      reachableTypes,
      commonPaths,
      connectivityScore,
      centralityMetrics,
    };
  }

  /**
   * Create cache key for traversal results
   */
  private createCacheKey(
    entityId: string,
    path: string[],
    options: TraversalOptions,
  ): string {
    const optionsKey = JSON.stringify({
      maxDepth: options.maxDepth,
      allowCycles: options.allowCycles,
      maxResults: options.maxResults,
    });
    return `${entityId}_${path.join('.')}_${optionsKey}`;
  }

  /**
   * Check if two relationship names are similar (for suggestions)
   */
  private isSimilarRelationshipName(name1: string, name2: string): boolean {
    // Simple similarity check - could be enhanced with edit distance
    const lower1 = name1.toLowerCase();
    const lower2 = name2.toLowerCase();

    return (
      lower1.includes(lower2) ||
      lower2.includes(lower1) ||
      this.levenshteinDistance(lower1, lower2) <= 2
    );
  }

  /**
   * Calculate Levenshtein distance for string similarity
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Clear caches
   */
  clearCache(): void {
    this.pathCache.clear();
    this.validationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {pathCache: number; validationCache: number} {
    return {
      pathCache: this.pathCache.size,
      validationCache: this.validationCache.size,
    };
  }
}

/**
 * Factory function to create multi-hop resolver
 */
export function createMultiHopResolver(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
): MultiHopResolver {
  return new MultiHopResolver(registry, directResolver);
}
