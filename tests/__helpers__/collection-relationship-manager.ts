/**
 * Collection Relationship Manager with Pagination Support
 *
 * Handles collection-based relationships with advanced pagination,
 * filtering, and sorting capabilities for large entity collections.
 */

import {MockEntityRegistry, EntityNode, Constraint} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  constraints?: Constraint[];
  textSearch?: string;
  fieldFilters?: Record<string, any>;
}

export interface CollectionResult {
  entities: EntityNode[];
  pagination: {
    totalCount: number;
    returnedCount: number;
    offset: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  metadata: {
    queryTime: number;
    filteredCount?: number;
    sortedBy?: string;
  };
}

/**
 * Collection relationship manager with advanced features
 */
export class CollectionRelationshipManager {
  constructor(
    private registry: MockEntityRegistry,
    private relationshipResolver: DirectRelationshipResolver,
  ) {}

  /**
   * Get a paginated collection of entities with filtering and sorting
   */
  getCollection(
    sourceEntity: EntityNode,
    relationshipName: string,
    pagination: PaginationOptions = {},
    filters: FilterOptions = {},
  ): CollectionResult {
    const startTime = Date.now();
    const {limit = 50, offset = 0, sortBy, sortOrder = 'asc'} = pagination;

    // Get all related entities first
    const relationshipResult =
      this.relationshipResolver.resolveDirectRelationship(
        sourceEntity,
        relationshipName,
        {maxResults: undefined}, // Get all to apply our own pagination
      );

    if (!relationshipResult) {
      return this.createEmptyResult(pagination, startTime);
    }

    let entities = relationshipResult.entities;
    const originalCount = entities.length;

    // Apply filters
    if (filters.constraints && filters.constraints.length > 0) {
      entities = this.applyConstraints(entities, filters.constraints);
    }

    if (filters.textSearch) {
      entities = this.applyTextSearch(entities, filters.textSearch);
    }

    if (filters.fieldFilters) {
      entities = this.applyFieldFilters(entities, filters.fieldFilters);
    }

    const filteredCount = entities.length;

    // Apply sorting
    if (sortBy) {
      entities = this.applySorting(entities, sortBy, sortOrder);
    }

    // Apply pagination
    const paginatedEntities = entities.slice(offset, offset + limit);

    const queryTime = Date.now() - startTime;

    return {
      entities: paginatedEntities,
      pagination: {
        totalCount: originalCount,
        returnedCount: paginatedEntities.length,
        offset,
        limit,
        hasNext: offset + limit < filteredCount,
        hasPrevious: offset > 0,
      },
      metadata: {
        queryTime,
        filteredCount:
          filteredCount !== originalCount ? filteredCount : undefined,
        sortedBy: sortBy,
      },
    };
  }

  /**
   * Apply constraint-based filtering
   */
  private applyConstraints(
    entities: EntityNode[],
    constraints: Constraint[],
  ): EntityNode[] {
    return entities.filter((entity) => {
      return constraints.every((constraint) => {
        const value = this.getNestedValue(entity.data, constraint.path);
        return this.evaluateConstraint(value, constraint);
      });
    });
  }

  /**
   * Apply text search across searchable fields
   */
  private applyTextSearch(
    entities: EntityNode[],
    searchTerm: string,
  ): EntityNode[] {
    const lowercaseSearch = searchTerm.toLowerCase();
    const searchableFields = [
      'name',
      'description',
      'identifier',
      'primaryIdentifier',
      'symbol',
    ];

    return entities.filter((entity) => {
      return searchableFields.some((field) => {
        const value = entity.data[field];
        return (
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(lowercaseSearch)
        );
      });
    });
  }

  /**
   * Apply field-specific filters
   */
  private applyFieldFilters(
    entities: EntityNode[],
    fieldFilters: Record<string, any>,
  ): EntityNode[] {
    return entities.filter((entity) => {
      return Object.entries(fieldFilters).every(
        ([fieldPath, expectedValue]) => {
          const actualValue = this.getNestedValue(entity.data, fieldPath);

          if (Array.isArray(expectedValue)) {
            // Check if actual value is in the array
            return expectedValue.includes(actualValue);
          } else if (
            typeof expectedValue === 'object' &&
            expectedValue !== null
          ) {
            // Handle range queries, etc.
            if (
              expectedValue.min !== undefined &&
              actualValue < expectedValue.min
            )
              return false;
            if (
              expectedValue.max !== undefined &&
              actualValue > expectedValue.max
            )
              return false;
            return true;
          } else {
            // Direct equality
            return actualValue === expectedValue;
          }
        },
      );
    });
  }

  /**
   * Apply sorting to entities
   */
  private applySorting(
    entities: EntityNode[],
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): EntityNode[] {
    const sortedEntities = [...entities];

    sortedEntities.sort((a, b) => {
      const valueA = this.getNestedValue(a.data, sortBy);
      const valueB = this.getNestedValue(b.data, sortBy);

      // Handle null/undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? 1 : -1;
      if (valueB == null) return sortOrder === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;
      if (valueA < valueB) comparison = -1;
      else if (valueA > valueB) comparison = 1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return sortedEntities;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Evaluate a constraint against a value
   */
  private evaluateConstraint(value: any, constraint: Constraint): boolean {
    const {operator, value: expectedValue} = constraint;

    switch (operator) {
      case '=':
        return value === expectedValue;
      case '!=':
        return value !== expectedValue;
      case '>':
        return typeof value === 'number' && value > expectedValue;
      case '<':
        return typeof value === 'number' && value < expectedValue;
      case '>=':
        return typeof value === 'number' && value >= expectedValue;
      case '<=':
        return typeof value === 'number' && value <= expectedValue;
      case 'CONTAINS':
        return (
          typeof value === 'string' &&
          typeof expectedValue === 'string' &&
          value.toLowerCase().includes(expectedValue.toLowerCase())
        );
      case 'NOT_CONTAINS':
        return (
          typeof value === 'string' &&
          typeof expectedValue === 'string' &&
          !value.toLowerCase().includes(expectedValue.toLowerCase())
        );
      case 'IS_NULL':
        return value == null;
      case 'IS_NOT_NULL':
        return value != null;
      default:
        console.warn(`Unknown constraint operator: ${operator}`);
        return true;
    }
  }

  /**
   * Create empty result for failed queries
   */
  private createEmptyResult(
    pagination: PaginationOptions,
    startTime: number,
  ): CollectionResult {
    const {limit = 50, offset = 0} = pagination;
    const queryTime = Date.now() - startTime;

    return {
      entities: [],
      pagination: {
        totalCount: 0,
        returnedCount: 0,
        offset,
        limit,
        hasNext: false,
        hasPrevious: false,
      },
      metadata: {
        queryTime,
      },
    };
  }

  /**
   * Get collection summary statistics
   */
  getCollectionSummary(
    sourceEntity: EntityNode,
    relationshipName: string,
    filters: FilterOptions = {},
  ): {
    totalCount: number;
    filteredCount: number;
    uniqueTypes: string[];
    fieldStatistics: Record<string, any>;
  } {
    const result = this.getCollection(
      sourceEntity,
      relationshipName,
      {limit: Number.MAX_SAFE_INTEGER},
      filters,
    );

    const uniqueTypes = [...new Set(result.entities.map((e) => e.type))];

    // Calculate field statistics
    const fieldStatistics: Record<string, any> = {};
    const numericFields = ['length', 'score', 'molecularWeight', 'lod'];

    numericFields.forEach((field) => {
      const values = result.entities
        .map((e) => e.data[field])
        .filter((v) => typeof v === 'number');

      if (values.length > 0) {
        fieldStatistics[field] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        };
      }
    });

    return {
      totalCount: result.pagination.totalCount,
      filteredCount: result.entities.length,
      uniqueTypes,
      fieldStatistics,
    };
  }

  /**
   * Get paginated results for specific page
   */
  getPage(
    sourceEntity: EntityNode,
    relationshipName: string,
    pageNumber: number,
    pageSize: number = 20,
    filters: FilterOptions = {},
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): CollectionResult {
    const offset = (pageNumber - 1) * pageSize;

    return this.getCollection(
      sourceEntity,
      relationshipName,
      {limit: pageSize, offset, sortBy, sortOrder},
      filters,
    );
  }

  /**
   * Search within a collection
   */
  searchCollection(
    sourceEntity: EntityNode,
    relationshipName: string,
    searchTerm: string,
    pagination: PaginationOptions = {},
  ): CollectionResult {
    return this.getCollection(sourceEntity, relationshipName, pagination, {
      textSearch: searchTerm,
    });
  }

  /**
   * Get entities by type within a collection
   */
  getCollectionByType(
    sourceEntity: EntityNode,
    relationshipName: string,
    targetType: string,
    pagination: PaginationOptions = {},
  ): CollectionResult {
    const result = this.getCollection(
      sourceEntity,
      relationshipName,
      {limit: Number.MAX_SAFE_INTEGER},
      {},
    );

    const filteredEntities = result.entities.filter(
      (entity) => entity.type === targetType,
    );

    // Apply pagination to filtered results
    const {limit = 50, offset = 0} = pagination;
    const paginatedEntities = filteredEntities.slice(offset, offset + limit);

    return {
      entities: paginatedEntities,
      pagination: {
        totalCount: filteredEntities.length,
        returnedCount: paginatedEntities.length,
        offset,
        limit,
        hasNext: offset + limit < filteredEntities.length,
        hasPrevious: offset > 0,
      },
      metadata: {
        queryTime: result.metadata.queryTime,
        filteredCount: filteredEntities.length,
      },
    };
  }
}

/**
 * Factory function to create collection relationship manager
 */
export function createCollectionRelationshipManager(
  registry: MockEntityRegistry,
  relationshipResolver: DirectRelationshipResolver,
): CollectionRelationshipManager {
  return new CollectionRelationshipManager(registry, relationshipResolver);
}
