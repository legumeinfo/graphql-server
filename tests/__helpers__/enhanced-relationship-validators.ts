/**
 * Enhanced Relationship Validators for Advanced Testing
 *
 * Builds upon the base relationship validators with advanced capabilities
 * for testing complex scenarios, performance validation, and comprehensive
 * relationship integrity checking.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';
import {CollectionRelationshipManager} from './collection-relationship-manager.js';

export interface ValidationContext {
  registry: MockEntityRegistry;
  resolver: DirectRelationshipResolver;
  collectionManager: CollectionRelationshipManager;
}

export interface AdvancedValidationOptions {
  allowNull?: boolean;
  expectedCount?: number;
  minCount?: number;
  maxCount?: number;
  validator?: (entity: any) => void;
  description?: string;
  performanceThreshold?: number; // ms
  validateReverse?: boolean;
  validateIntegrity?: boolean;
  strictTypeChecking?: boolean;
}

export interface ValidationResult {
  success: boolean;
  entityCount: number;
  validationTime: number;
  warnings: string[];
  errors: string[];
  metadata: Record<string, any>;
}

/**
 * Enhanced relationship validators with advanced features
 */
export class EnhancedRelationshipValidators {
  constructor(private context: ValidationContext) {}

  /**
   * Validate a direct relationship with advanced options
   */
  validateDirectRelationship(
    sourceEntity: EntityNode,
    relationshipName: string,
    options: AdvancedValidationOptions = {},
  ): ValidationResult {
    const startTime = Date.now();
    const result: ValidationResult = {
      success: true,
      entityCount: 0,
      validationTime: 0,
      warnings: [],
      errors: [],
      metadata: {},
    };

    const {
      allowNull = false,
      validator,
      description = `${sourceEntity.type}.${relationshipName}`,
      performanceThreshold = 100,
      validateReverse = false,
      validateIntegrity = true,
      strictTypeChecking = true,
    } = options;

    try {
      // Resolve the relationship
      const resolvedRelationship =
        this.context.resolver.resolveDirectRelationship(
          sourceEntity,
          relationshipName,
        );

      if (!resolvedRelationship || resolvedRelationship.entities.length === 0) {
        if (!allowNull) {
          result.errors.push(
            `Required relationship ${description} returned no entities`,
          );
          result.success = false;
        } else {
          result.warnings.push(
            `Optional relationship ${description} returned no entities`,
          );
        }
        result.validationTime = Date.now() - startTime;
        return result;
      }

      result.entityCount = resolvedRelationship.entities.length;
      result.metadata.totalCount = resolvedRelationship.totalCount;
      result.metadata.hasMore = resolvedRelationship.hasMore;

      // Validate entity count expectations
      this.validateEntityCounts(resolvedRelationship.entities, options, result);

      // Validate individual entities
      resolvedRelationship.entities.forEach((entity, index) => {
        try {
          // Type checking
          if (strictTypeChecking) {
            this.validateEntityType(
              entity,
              sourceEntity.type,
              relationshipName,
              result,
            );
          }

          // Custom validator
          if (validator) {
            validator(entity.data);
          }

          // Integrity checking
          if (validateIntegrity) {
            this.validateEntityIntegrity(entity, result);
          }
        } catch (error) {
          result.errors.push(
            `Entity ${index} in ${description} failed validation: ${error}`,
          );
          result.success = false;
        }
      });

      // Reverse relationship validation
      if (validateReverse && resolvedRelationship.entities.length > 0) {
        this.validateReverseRelationships(
          sourceEntity,
          resolvedRelationship.entities,
          relationshipName,
          result,
        );
      }

      // Performance validation
      result.validationTime = Date.now() - startTime;
      if (
        performanceThreshold > 0 &&
        result.validationTime > performanceThreshold
      ) {
        result.warnings.push(
          `Relationship resolution took ${result.validationTime}ms (threshold: ${performanceThreshold}ms)`,
        );
      }
    } catch (error) {
      result.errors.push(
        `Failed to resolve relationship ${description}: ${error}`,
      );
      result.success = false;
    }

    result.validationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Validate a collection relationship with pagination and filtering
   */
  validateCollectionRelationship(
    sourceEntity: EntityNode,
    relationshipName: string,
    options: AdvancedValidationOptions & {
      pageSize?: number;
      testPagination?: boolean;
      testFiltering?: boolean;
      testSorting?: boolean;
    } = {},
  ): ValidationResult {
    const startTime = Date.now();
    const result: ValidationResult = {
      success: true,
      entityCount: 0,
      validationTime: 0,
      warnings: [],
      errors: [],
      metadata: {},
    };

    const {
      pageSize = 10,
      testPagination = false,
      testFiltering = false,
      testSorting = false,
      description = `${sourceEntity.type}.${relationshipName} collection`,
    } = options;

    try {
      // Get full collection
      const collectionResult = this.context.collectionManager.getCollection(
        sourceEntity,
        relationshipName,
      );
      result.entityCount = collectionResult.entities.length;
      result.metadata = {
        ...collectionResult.metadata,
        pagination: collectionResult.pagination,
      };

      // Validate collection basics
      this.validateEntityCounts(collectionResult.entities, options, result);

      // Test pagination if requested
      if (testPagination && collectionResult.pagination.totalCount > pageSize) {
        this.validatePagination(
          sourceEntity,
          relationshipName,
          pageSize,
          result,
        );
      }

      // Test filtering if requested
      if (testFiltering) {
        this.validateFiltering(sourceEntity, relationshipName, result);
      }

      // Test sorting if requested
      if (testSorting) {
        this.validateSorting(sourceEntity, relationshipName, result);
      }

      // Validate each entity in the collection
      collectionResult.entities.forEach((entity, index) => {
        try {
          if (options.validator) {
            options.validator(entity.data);
          }

          if (options.validateIntegrity) {
            this.validateEntityIntegrity(entity, result);
          }
        } catch (error) {
          result.errors.push(
            `Collection entity ${index} in ${description} failed validation: ${error}`,
          );
          result.success = false;
        }
      });
    } catch (error) {
      result.errors.push(
        `Failed to validate collection ${description}: ${error}`,
      );
      result.success = false;
    }

    result.validationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Validate relationship chain integrity
   */
  validateRelationshipChain(
    rootEntity: EntityNode,
    chainPath: string[],
    options: AdvancedValidationOptions = {},
  ): ValidationResult {
    const startTime = Date.now();
    const result: ValidationResult = {
      success: true,
      entityCount: 0,
      validationTime: 0,
      warnings: [],
      errors: [],
      metadata: {chainPath},
    };

    const {description = `relationship chain [${chainPath.join(' -> ')}]`} =
      options;

    try {
      let currentEntities = [rootEntity];

      for (let i = 0; i < chainPath.length; i++) {
        const relationshipName = chainPath[i];
        const nextEntities: EntityNode[] = [];

        for (const currentEntity of currentEntities) {
          const resolvedRelationship =
            this.context.resolver.resolveDirectRelationship(
              currentEntity,
              relationshipName,
            );

          if (
            resolvedRelationship &&
            resolvedRelationship.entities.length > 0
          ) {
            nextEntities.push(...resolvedRelationship.entities);
          } else if (!options.allowNull) {
            result.errors.push(
              `Chain broken at step ${i + 1}: ${currentEntity.type}.${relationshipName}`,
            );
            result.success = false;
          }
        }

        if (nextEntities.length === 0 && !options.allowNull) {
          result.errors.push(`Chain ended at step ${i + 1} with no entities`);
          result.success = false;
          break;
        }

        currentEntities = nextEntities;
        result.metadata[`step${i + 1}Count`] = nextEntities.length;
      }

      result.entityCount = currentEntities.length;

      // Validate final entities
      if (options.validator) {
        currentEntities.forEach((entity, index) => {
          try {
            options.validator!(entity.data);
          } catch (error) {
            result.errors.push(
              `Final chain entity ${index} failed validation: ${error}`,
            );
            result.success = false;
          }
        });
      }
    } catch (error) {
      result.errors.push(
        `Chain validation failed for ${description}: ${error}`,
      );
      result.success = false;
    }

    result.validationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Validate bidirectional relationship consistency
   */
  validateBidirectionalConsistency(
    entityA: EntityNode,
    entityB: EntityNode,
    relationshipA: string,
    relationshipB: string,
    _options: AdvancedValidationOptions = {},
  ): ValidationResult {
    const startTime = Date.now();
    const result: ValidationResult = {
      success: true,
      entityCount: 2,
      validationTime: 0,
      warnings: [],
      errors: [],
      metadata: {},
    };

    const description = `bidirectional consistency ${entityA.type}.${relationshipA} <-> ${entityB.type}.${relationshipB}`;

    try {
      // Resolve forward relationship (A -> B)
      const forwardRelationship =
        this.context.resolver.resolveDirectRelationship(entityA, relationshipA);
      const reverseRelationship =
        this.context.resolver.resolveDirectRelationship(entityB, relationshipB);

      if (!forwardRelationship || !reverseRelationship) {
        result.errors.push(
          `One or both relationships not found for ${description}`,
        );
        result.success = false;
        result.validationTime = Date.now() - startTime;
        return result;
      }

      // Check forward consistency (A -> B should contain entityB)
      const forwardContainsB = forwardRelationship.entities.some(
        (entity) =>
          entity.id === entityB.id ||
          entity.data.identifier === entityB.data.identifier ||
          entity.data.primaryIdentifier === entityB.data.primaryIdentifier,
      );

      if (!forwardContainsB) {
        result.errors.push(
          `Forward relationship ${entityA.type}.${relationshipA} does not contain expected entity`,
        );
        result.success = false;
      }

      // Check reverse consistency (B -> A should contain entityA)
      const reverseContainsA = reverseRelationship.entities.some(
        (entity) =>
          entity.id === entityA.id ||
          entity.data.identifier === entityA.data.identifier ||
          entity.data.primaryIdentifier === entityA.data.primaryIdentifier,
      );

      if (!reverseContainsA) {
        result.errors.push(
          `Reverse relationship ${entityB.type}.${relationshipB} does not contain expected entity`,
        );
        result.success = false;
      }

      result.metadata.forwardCount = forwardRelationship.entities.length;
      result.metadata.reverseCount = reverseRelationship.entities.length;
    } catch (error) {
      result.errors.push(
        `Bidirectional validation failed for ${description}: ${error}`,
      );
      result.success = false;
    }

    result.validationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Validate entity counts against expectations
   */
  private validateEntityCounts(
    entities: EntityNode[],
    _options: AdvancedValidationOptions,
    result: ValidationResult,
  ): void {
    const {expectedCount, minCount, maxCount} = _options;

    if (expectedCount !== undefined && entities.length !== expectedCount) {
      result.errors.push(
        `Expected ${expectedCount} entities, got ${entities.length}`,
      );
      result.success = false;
    }

    if (minCount !== undefined && entities.length < minCount) {
      result.errors.push(
        `Expected at least ${minCount} entities, got ${entities.length}`,
      );
      result.success = false;
    }

    if (maxCount !== undefined && entities.length > maxCount) {
      result.warnings.push(
        `Expected at most ${maxCount} entities, got ${entities.length}`,
      );
    }
  }

  /**
   * Validate entity type matches expected relationship type
   */
  private validateEntityType(
    entity: EntityNode,
    sourceType: string,
    relationshipName: string,
    result: ValidationResult,
  ): void {
    const configs = this.context.resolver.getAvailableRelationships(sourceType);
    const config = configs.find((c) => c.relationshipName === relationshipName);

    if (config && entity.type !== config.targetType) {
      result.errors.push(
        `Expected entity type ${config.targetType}, got ${entity.type}`,
      );
      result.success = false;
    }
  }

  /**
   * Validate individual entity integrity
   */
  private validateEntityIntegrity(
    entity: EntityNode,
    result: ValidationResult,
  ): void {
    // Check required fields based on entity type
    const requiredFields = this.getRequiredFields(entity.type);

    requiredFields.forEach((field) => {
      if (entity.data[field] === undefined || entity.data[field] === null) {
        result.warnings.push(
          `Entity ${entity.id} missing required field: ${field}`,
        );
      }
    });

    // Check data type consistency
    if (typeof entity.data.length === 'string') {
      result.warnings.push(
        `Entity ${entity.id} has length as string instead of number`,
      );
    }
  }

  /**
   * Get required fields for entity type
   */
  private getRequiredFields(entityType: string): string[] {
    const fieldMap: Record<string, string[]> = {
      Gene: ['primaryIdentifier', 'name'],
      Protein: ['primaryIdentifier', 'length'],
      Organism: ['taxonId', 'name'],
      Transcript: ['primaryIdentifier', 'length'],
      Chromosome: ['primaryIdentifier', 'length'],
    };

    return fieldMap[entityType] || ['identifier'];
  }

  /**
   * Validate pagination functionality
   */
  private validatePagination(
    sourceEntity: EntityNode,
    relationshipName: string,
    pageSize: number,
    result: ValidationResult,
  ): void {
    try {
      const page1 = this.context.collectionManager.getPage(
        sourceEntity,
        relationshipName,
        1,
        pageSize,
      );
      const page2 = this.context.collectionManager.getPage(
        sourceEntity,
        relationshipName,
        2,
        pageSize,
      );

      if (page1.entities.length === 0) {
        result.warnings.push('First page returned no entities');
        return;
      }

      if (page1.entities.length > pageSize) {
        result.errors.push(
          `First page returned ${page1.entities.length} entities, expected max ${pageSize}`,
        );
        result.success = false;
      }

      // Check that pages don't overlap
      const page1Ids = new Set(page1.entities.map((e) => e.id));
      const page2Ids = new Set(page2.entities.map((e) => e.id));
      const overlap = [...page1Ids].filter((id) => page2Ids.has(id));

      if (overlap.length > 0) {
        result.errors.push(
          `Pagination overlap detected: ${overlap.length} entities appear in both pages`,
        );
        result.success = false;
      }

      result.metadata.paginationTested = true;
    } catch (error) {
      result.warnings.push(`Pagination test failed: ${error}`);
    }
  }

  /**
   * Validate filtering functionality
   */
  private validateFiltering(
    sourceEntity: EntityNode,
    relationshipName: string,
    result: ValidationResult,
  ): void {
    try {
      // Test text search filtering
      const searchResult = this.context.collectionManager.searchCollection(
        sourceEntity,
        relationshipName,
        'test',
      );

      result.metadata.filteringTested = true;
      result.metadata.searchResultCount = searchResult.entities.length;
    } catch (error) {
      result.warnings.push(`Filtering test failed: ${error}`);
    }
  }

  /**
   * Validate sorting functionality
   */
  private validateSorting(
    sourceEntity: EntityNode,
    relationshipName: string,
    result: ValidationResult,
  ): void {
    try {
      const sortedAsc = this.context.collectionManager.getCollection(
        sourceEntity,
        relationshipName,
        {sortBy: 'length', sortOrder: 'asc'},
      );

      const sortedDesc = this.context.collectionManager.getCollection(
        sourceEntity,
        relationshipName,
        {sortBy: 'length', sortOrder: 'desc'},
      );

      // Check that sorting produces different results (if there are multiple entities)
      if (sortedAsc.entities.length > 1 && sortedDesc.entities.length > 1) {
        const firstAscId = sortedAsc.entities[0].id;
        const firstDescId = sortedDesc.entities[0].id;

        if (firstAscId === firstDescId) {
          result.warnings.push(
            'Sorting test: ascending and descending produced same order',
          );
        }
      }

      result.metadata.sortingTested = true;
    } catch (error) {
      result.warnings.push(`Sorting test failed: ${error}`);
    }
  }

  /**
   * Validate reverse relationships exist
   */
  private validateReverseRelationships(
    sourceEntity: EntityNode,
    targetEntities: EntityNode[],
    relationshipName: string,
    result: ValidationResult,
  ): void {
    // This is a simplified reverse relationship check
    // In a full implementation, this would use a lookup table of reverse relationships
    targetEntities.forEach((targetEntity) => {
      // Try common reverse relationship patterns
      const reverseNames = this.guessReverseRelationshipName(
        sourceEntity.type,
        relationshipName,
      );

      reverseNames.forEach((reverseName) => {
        const reverseRelationship =
          this.context.resolver.resolveDirectRelationship(
            targetEntity,
            reverseName,
          );

        if (
          reverseRelationship &&
          reverseRelationship.entities.some((e) => e.id === sourceEntity.id)
        ) {
          result.metadata.reverseRelationshipFound = true;
        }
      });
    });
  }

  /**
   * Guess reverse relationship name based on patterns
   */
  private guessReverseRelationshipName(
    sourceType: string,
    relationshipName: string,
  ): string[] {
    // Common biological relationship patterns
    const reverseMap: Record<string, string[]> = {
      proteins: ['gene'],
      transcripts: ['gene'],
      genes: ['organism'],
      organism: ['genes', 'proteins', 'transcripts'],
      gene: ['proteins', 'transcripts'],
      strain: ['genes', 'proteins'],
    };

    return reverseMap[relationshipName] || [];
  }
}

/**
 * Factory function to create enhanced validators
 */
export function createEnhancedRelationshipValidators(
  context: ValidationContext,
): EnhancedRelationshipValidators {
  return new EnhancedRelationshipValidators(context);
}
