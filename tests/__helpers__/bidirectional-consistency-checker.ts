/**
 * Bidirectional Consistency Checker for Relationship Validation
 *
 * Comprehensive validation of bidirectional relationships to ensure
 * data integrity and consistency across complex biological entity graphs.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';

export interface BidirectionalMapping {
  sourceType: string;
  targetType: string;
  forwardRelationship: string;
  reverseRelationship: string;
  isSourceCollection: boolean;
  isTargetCollection: boolean;
  required: boolean;
}

export interface ConsistencyResult {
  isConsistent: boolean;
  inconsistencies: ConsistencyIssue[];
  checkedRelationships: number;
  totalChecks: number;
  performance: {
    checkTime: number;
    entityPairsChecked: number;
    averageCheckTime: number;
  };
  recommendations: string[];
}

export interface ConsistencyIssue {
  type:
    | 'missing_reverse'
    | 'orphaned_reverse'
    | 'type_mismatch'
    | 'count_mismatch';
  severity: 'error' | 'warning' | 'info';
  sourceEntityId: string;
  targetEntityId?: string;
  relationship: string;
  description: string;
  suggestedFix?: string;
}

export interface GlobalConsistencyReport {
  overallScore: number;
  entityTypeResults: Map<string, ConsistencyResult>;
  criticalIssues: ConsistencyIssue[];
  summary: {
    totalEntities: number;
    totalRelationships: number;
    consistentRelationships: number;
    inconsistentRelationships: number;
  };
}

/**
 * Bidirectional relationship consistency checker
 */
export class BidirectionalConsistencyChecker {
  private mappings: BidirectionalMapping[] = [];

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
  ) {
    this.initializeStandardMappings();
  }

  /**
   * Initialize standard biological relationship mappings
   */
  private initializeStandardMappings(): void {
    const standardMappings: BidirectionalMapping[] = [
      // Gene relationships
      {
        sourceType: 'Gene',
        targetType: 'Organism',
        forwardRelationship: 'organism',
        reverseRelationship: 'genes',
        isSourceCollection: false,
        isTargetCollection: true,
        required: true,
      },
      {
        sourceType: 'Gene',
        targetType: 'Protein',
        forwardRelationship: 'proteins',
        reverseRelationship: 'gene',
        isSourceCollection: true,
        isTargetCollection: false,
        required: true,
      },
      {
        sourceType: 'Gene',
        targetType: 'Transcript',
        forwardRelationship: 'transcripts',
        reverseRelationship: 'gene',
        isSourceCollection: true,
        isTargetCollection: false,
        required: true,
      },
      {
        sourceType: 'Gene',
        targetType: 'Chromosome',
        forwardRelationship: 'chromosome',
        reverseRelationship: 'genes',
        isSourceCollection: false,
        isTargetCollection: true,
        required: false,
      },

      // Protein relationships
      {
        sourceType: 'Protein',
        targetType: 'Transcript',
        forwardRelationship: 'transcript',
        reverseRelationship: 'protein',
        isSourceCollection: false,
        isTargetCollection: false,
        required: true,
      },
      {
        sourceType: 'Protein',
        targetType: 'Organism',
        forwardRelationship: 'organism',
        reverseRelationship: 'proteins',
        isSourceCollection: false,
        isTargetCollection: true,
        required: true,
      },

      // QTL relationships
      {
        sourceType: 'QTL',
        targetType: 'Trait',
        forwardRelationship: 'trait',
        reverseRelationship: 'qtls',
        isSourceCollection: false,
        isTargetCollection: true,
        required: true,
      },
      {
        sourceType: 'QTL',
        targetType: 'QTLStudy',
        forwardRelationship: 'qtlStudy',
        reverseRelationship: 'qtls',
        isSourceCollection: false,
        isTargetCollection: true,
        required: true,
      },

      // Trait relationships
      {
        sourceType: 'Trait',
        targetType: 'Organism',
        forwardRelationship: 'organism',
        reverseRelationship: 'traits',
        isSourceCollection: false,
        isTargetCollection: true,
        required: true,
      },
    ];

    this.mappings = standardMappings;
    console.log(
      `Initialized ${this.mappings.length} bidirectional relationship mappings`,
    );
  }

  /**
   * Check consistency for a specific entity
   */
  checkEntityConsistency(entityId: string): ConsistencyResult {
    const startTime = Date.now();
    const entity = this.registry.getEntity(entityId);

    if (!entity) {
      return this.createEmptyResult(startTime, `Entity ${entityId} not found`);
    }

    const result: ConsistencyResult = {
      isConsistent: true,
      inconsistencies: [],
      checkedRelationships: 0,
      totalChecks: 0,
      performance: {
        checkTime: 0,
        entityPairsChecked: 0,
        averageCheckTime: 0,
      },
      recommendations: [],
    };

    // Get applicable mappings for this entity type
    const applicableMappings = this.mappings.filter(
      (mapping) =>
        mapping.sourceType === entity.type ||
        mapping.targetType === entity.type,
    );

    for (const mapping of applicableMappings) {
      if (mapping.sourceType === entity.type) {
        // Check forward relationship
        this.checkForwardRelationship(entity, mapping, result);
      }

      if (mapping.targetType === entity.type) {
        // Check reverse relationship
        this.checkReverseRelationship(entity, mapping, result);
      }
    }

    // Calculate performance metrics
    result.performance.checkTime = Date.now() - startTime;
    result.performance.averageCheckTime =
      result.totalChecks > 0
        ? result.performance.checkTime / result.totalChecks
        : 0;

    result.isConsistent = result.inconsistencies.length === 0;

    return result;
  }

  /**
   * Check consistency for all entities of a specific type
   */
  checkEntityTypeConsistency(entityType: string): ConsistencyResult {
    const startTime = Date.now();
    const entities = this.registry.getEntitiesByType(entityType);

    if (entities.length === 0) {
      return this.createEmptyResult(
        startTime,
        `No entities of type ${entityType} found`,
      );
    }

    const aggregateResult: ConsistencyResult = {
      isConsistent: true,
      inconsistencies: [],
      checkedRelationships: 0,
      totalChecks: 0,
      performance: {
        checkTime: 0,
        entityPairsChecked: 0,
        averageCheckTime: 0,
      },
      recommendations: [],
    };

    // Check each entity
    for (const entity of entities) {
      const entityResult = this.checkEntityConsistency(entity.id);

      // Aggregate results
      aggregateResult.inconsistencies.push(...entityResult.inconsistencies);
      aggregateResult.checkedRelationships += entityResult.checkedRelationships;
      aggregateResult.totalChecks += entityResult.totalChecks;
      aggregateResult.performance.entityPairsChecked +=
        entityResult.performance.entityPairsChecked;
    }

    aggregateResult.performance.checkTime = Date.now() - startTime;
    aggregateResult.performance.averageCheckTime =
      aggregateResult.totalChecks > 0
        ? aggregateResult.performance.checkTime / aggregateResult.totalChecks
        : 0;

    aggregateResult.isConsistent = aggregateResult.inconsistencies.length === 0;

    // Generate recommendations based on common issues
    this.generateRecommendations(aggregateResult);

    return aggregateResult;
  }

  /**
   * Perform global consistency check across all entity types
   */
  performGlobalConsistencyCheck(): GlobalConsistencyReport {
    const entityTypes = this.registry.getAllEntityTypes();
    const entityTypeResults = new Map<string, ConsistencyResult>();
    let totalConsistentRelationships = 0;
    let totalInconsistentRelationships = 0;
    const criticalIssues: ConsistencyIssue[] = [];

    // Check each entity type
    for (const entityType of entityTypes) {
      const result = this.checkEntityTypeConsistency(entityType);
      entityTypeResults.set(entityType, result);

      totalConsistentRelationships +=
        result.checkedRelationships - result.inconsistencies.length;
      totalInconsistentRelationships += result.inconsistencies.length;

      // Collect critical issues
      criticalIssues.push(
        ...result.inconsistencies.filter((issue) => issue.severity === 'error'),
      );
    }

    const totalRelationships =
      totalConsistentRelationships + totalInconsistentRelationships;
    const overallScore =
      totalRelationships > 0
        ? totalConsistentRelationships / totalRelationships
        : 1;

    return {
      overallScore,
      entityTypeResults,
      criticalIssues,
      summary: {
        totalEntities: entityTypes.reduce(
          (sum, type) => sum + this.registry.getEntitiesByType(type).length,
          0,
        ),
        totalRelationships,
        consistentRelationships: totalConsistentRelationships,
        inconsistentRelationships: totalInconsistentRelationships,
      },
    };
  }

  /**
   * Check forward relationship consistency
   */
  private checkForwardRelationship(
    sourceEntity: EntityNode,
    mapping: BidirectionalMapping,
    result: ConsistencyResult,
  ): void {
    const forwardResolution = this.directResolver.resolveDirectRelationship(
      sourceEntity,
      mapping.forwardRelationship,
    );

    result.totalChecks++;

    if (!forwardResolution || forwardResolution.entities.length === 0) {
      if (mapping.required) {
        result.inconsistencies.push({
          type: 'missing_reverse',
          severity: 'error',
          sourceEntityId: sourceEntity.id,
          relationship: mapping.forwardRelationship,
          description: `Required forward relationship ${mapping.sourceType}.${mapping.forwardRelationship} is missing`,
          suggestedFix: `Add ${mapping.forwardRelationship} relationship to ${sourceEntity.type} ${sourceEntity.id}`,
        });
      }
      return;
    }

    result.checkedRelationships++;

    // Check each target entity for reverse relationship
    for (const targetEntity of forwardResolution.entities) {
      result.performance.entityPairsChecked++;

      const reverseResolution = this.directResolver.resolveDirectRelationship(
        targetEntity,
        mapping.reverseRelationship,
      );

      if (!reverseResolution || reverseResolution.entities.length === 0) {
        result.inconsistencies.push({
          type: 'missing_reverse',
          severity: 'error',
          sourceEntityId: sourceEntity.id,
          targetEntityId: targetEntity.id,
          relationship: mapping.reverseRelationship,
          description: `Missing reverse relationship: ${targetEntity.type}.${mapping.reverseRelationship} should point back to ${sourceEntity.type}`,
          suggestedFix: `Add ${mapping.reverseRelationship} relationship from ${targetEntity.id} to ${sourceEntity.id}`,
        });
        continue;
      }

      // Check if reverse relationship includes the source entity
      const hasReverseReference = reverseResolution.entities.some(
        (reverseEntity) =>
          reverseEntity.id === sourceEntity.id ||
          reverseEntity.data.identifier === sourceEntity.data.identifier ||
          reverseEntity.data.primaryIdentifier ===
            sourceEntity.data.primaryIdentifier,
      );

      if (!hasReverseReference) {
        result.inconsistencies.push({
          type: 'orphaned_reverse',
          severity: 'error',
          sourceEntityId: sourceEntity.id,
          targetEntityId: targetEntity.id,
          relationship: mapping.reverseRelationship,
          description: `Reverse relationship ${targetEntity.type}.${mapping.reverseRelationship} exists but doesn't reference source entity`,
          suggestedFix: `Update ${targetEntity.id}.${mapping.reverseRelationship} to include ${sourceEntity.id}`,
        });
      }

      // Check collection consistency
      if (
        mapping.isSourceCollection !==
        this.directResolver.isCollectionRelationship(
          mapping.sourceType,
          mapping.forwardRelationship,
        )
      ) {
        result.inconsistencies.push({
          type: 'type_mismatch',
          severity: 'warning',
          sourceEntityId: sourceEntity.id,
          targetEntityId: targetEntity.id,
          relationship: mapping.forwardRelationship,
          description: `Collection type mismatch: expected ${mapping.isSourceCollection ? 'collection' : 'single'} relationship`,
          suggestedFix: 'Review relationship configuration',
        });
      }
    }
  }

  /**
   * Check reverse relationship consistency
   */
  private checkReverseRelationship(
    targetEntity: EntityNode,
    mapping: BidirectionalMapping,
    result: ConsistencyResult,
  ): void {
    const reverseResolution = this.directResolver.resolveDirectRelationship(
      targetEntity,
      mapping.reverseRelationship,
    );

    result.totalChecks++;

    if (!reverseResolution || reverseResolution.entities.length === 0) {
      if (mapping.required) {
        result.inconsistencies.push({
          type: 'missing_reverse',
          severity: 'error',
          sourceEntityId: targetEntity.id,
          relationship: mapping.reverseRelationship,
          description: `Required reverse relationship ${mapping.targetType}.${mapping.reverseRelationship} is missing`,
          suggestedFix: `Add ${mapping.reverseRelationship} relationship to ${targetEntity.type} ${targetEntity.id}`,
        });
      }
      return;
    }

    result.checkedRelationships++;

    // Check each source entity for forward relationship
    for (const sourceEntity of reverseResolution.entities) {
      result.performance.entityPairsChecked++;

      const forwardResolution = this.directResolver.resolveDirectRelationship(
        sourceEntity,
        mapping.forwardRelationship,
      );

      if (!forwardResolution || forwardResolution.entities.length === 0) {
        result.inconsistencies.push({
          type: 'orphaned_reverse',
          severity: 'error',
          sourceEntityId: targetEntity.id,
          targetEntityId: sourceEntity.id,
          relationship: mapping.forwardRelationship,
          description: `Orphaned reverse reference: ${sourceEntity.type} referenced by ${targetEntity.type} but doesn't have forward relationship`,
          suggestedFix: `Add ${mapping.forwardRelationship} relationship from ${sourceEntity.id} to ${targetEntity.id}`,
        });
      }
    }
  }

  /**
   * Generate recommendations based on inconsistencies
   */
  private generateRecommendations(result: ConsistencyResult): void {
    const issueTypes = new Map<string, number>();

    result.inconsistencies.forEach((issue) => {
      issueTypes.set(issue.type, (issueTypes.get(issue.type) || 0) + 1);
    });

    if (issueTypes.get('missing_reverse')) {
      result.recommendations.push(
        'Consider reviewing entity creation process to ensure bidirectional relationships are properly established',
      );
    }

    if (issueTypes.get('orphaned_reverse')) {
      result.recommendations.push(
        'Review relationship update operations to ensure consistency during modifications',
      );
    }

    if (issueTypes.get('type_mismatch')) {
      result.recommendations.push(
        'Validate relationship configurations against actual data model',
      );
    }

    if (result.performance.averageCheckTime > 50) {
      result.recommendations.push(
        'Consider optimizing relationship resolution for better performance',
      );
    }
  }

  /**
   * Create empty result for error cases
   */
  private createEmptyResult(
    startTime: number,
    message: string,
  ): ConsistencyResult {
    return {
      isConsistent: false,
      inconsistencies: [
        {
          type: 'missing_reverse',
          severity: 'error',
          sourceEntityId: 'unknown',
          relationship: 'unknown',
          description: message,
        },
      ],
      checkedRelationships: 0,
      totalChecks: 0,
      performance: {
        checkTime: Date.now() - startTime,
        entityPairsChecked: 0,
        averageCheckTime: 0,
      },
      recommendations: [],
    };
  }

  /**
   * Add custom bidirectional mapping
   */
  addCustomMapping(mapping: BidirectionalMapping): void {
    this.mappings.push(mapping);
  }

  /**
   * Get all configured mappings
   */
  getMappings(): BidirectionalMapping[] {
    return [...this.mappings];
  }

  /**
   * Get consistency statistics
   */
  getStatistics(): {
    totalMappings: number;
    requiredMappings: number;
    optionalMappings: number;
    collectionMappings: number;
  } {
    return {
      totalMappings: this.mappings.length,
      requiredMappings: this.mappings.filter((m) => m.required).length,
      optionalMappings: this.mappings.filter((m) => !m.required).length,
      collectionMappings: this.mappings.filter(
        (m) => m.isSourceCollection || m.isTargetCollection,
      ).length,
    };
  }
}

/**
 * Factory function to create bidirectional consistency checker
 */
export function createBidirectionalConsistencyChecker(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
): BidirectionalConsistencyChecker {
  return new BidirectionalConsistencyChecker(registry, directResolver);
}
