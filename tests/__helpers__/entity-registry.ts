/**
 * Centralized Entity Registry for Complex GraphQL Relationship Testing
 *
 * This registry maintains a graph of biological entities with proper relationships,
 * enabling systematic testing of complex GraphQL relationship resolution.
 */

export interface Constraint {
  path: string;
  operator: string;
  value: any;
}

export interface EntityNode {
  id: string;
  type: string;
  data: any;
  relationships: Map<string, string[]>; // relationship -> related entity IDs
}

export class MockEntityRegistry {
  private entities = new Map<string, EntityNode>();
  private typeIndexes = new Map<string, Set<string>>(); // type -> entity IDs

  /**
   * Register an entity with its relationships
   */
  registerEntity(
    id: string,
    type: string,
    data: any,
    relationships: Record<string, string[]> = {},
  ): void {
    const relationshipMap = new Map<string, string[]>();
    Object.entries(relationships).forEach(([key, value]) => {
      relationshipMap.set(key, value);
    });

    const entity: EntityNode = {
      id,
      type,
      data,
      relationships: relationshipMap,
    };

    this.entities.set(id, entity);

    // Update type index
    if (!this.typeIndexes.has(type)) {
      this.typeIndexes.set(type, new Set());
    }
    this.typeIndexes.get(type)!.add(id);

    console.log(
      `Registered entity: ${type}[${id}] with ${relationshipMap.size} relationships`,
    );
  }

  /**
   * Get entity by ID
   */
  getEntity(id: string): EntityNode | null {
    return this.entities.get(id) || null;
  }

  /**
   * Get all entities of a specific type
   */
  getEntitiesByType(type: string): EntityNode[] {
    const ids = this.typeIndexes.get(type) || new Set();
    return Array.from(ids)
      .map((id) => this.entities.get(id)!)
      .filter(Boolean);
  }

  /**
   * Get related entities for a given entity and relationship type
   */
  getRelatedEntities(entityId: string, relationshipType: string): EntityNode[] {
    const entity = this.entities.get(entityId);
    if (!entity) return [];

    const relatedIds = entity.relationships.get(relationshipType) || [];
    return relatedIds
      .map((id) => this.entities.get(id))
      .filter(Boolean) as EntityNode[];
  }

  /**
   * Query entities by type with InterMine-style constraints
   */
  queryEntities(type: string, constraints: Constraint[]): EntityNode[] {
    const entities = this.getEntitiesByType(type);

    return entities.filter((entity) => {
      return constraints.every((constraint) => {
        return this.evaluateConstraint(entity, constraint);
      });
    });
  }

  /**
   * Evaluate a single constraint against an entity
   */
  private evaluateConstraint(
    entity: EntityNode,
    constraint: Constraint,
  ): boolean {
    const {path, operator, value} = constraint;

    // Handle simple field access (e.g., "primaryIdentifier")
    if (!path.includes('.')) {
      const fieldValue = entity.data[path];
      return this.compareValues(fieldValue, operator, value);
    }

    // Handle relationship path (e.g., "organism.taxonId")
    const pathParts = path.split('.');
    const [relationshipName, ...fieldPath] = pathParts;

    const relatedEntities = this.getRelatedEntities(
      entity.id,
      relationshipName,
    );
    if (relatedEntities.length === 0) return false;

    // For now, check the first related entity
    const relatedEntity = relatedEntities[0];
    const fieldValue = this.getNestedFieldValue(relatedEntity.data, fieldPath);

    return this.compareValues(fieldValue, operator, value);
  }

  /**
   * Compare values based on operator
   */
  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case '=':
        return actual === expected;
      case '!=':
        return actual !== expected;
      case 'CONTAINS':
        return typeof actual === 'string' && actual.includes(expected);
      case '>':
        return actual > expected;
      case '<':
        return actual < expected;
      case '>=':
        return actual >= expected;
      case '<=':
        return actual <= expected;
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Get nested field value from object
   */
  private getNestedFieldValue(obj: any, path: string[]): any {
    let current = obj;
    for (const field of path) {
      if (current && typeof current === 'object') {
        current = current[field];
      } else {
        return undefined;
      }
    }
    return current;
  }

  /**
   * Get all registered entity types
   */
  getAllEntityTypes(): string[] {
    return Array.from(this.typeIndexes.keys());
  }

  /**
   * Get relationship IDs for a given entity and relationship type
   */
  getRelationshipIds(entityId: string, relationshipType: string): string[] {
    const entity = this.entities.get(entityId);
    if (!entity) return [];
    return entity.relationships.get(relationshipType) || [];
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalEntities: number;
    entitiesByType: Record<string, number>;
    totalRelationships: number;
  } {
    const entitiesByType: Record<string, number> = {};
    let totalRelationships = 0;

    for (const [type, ids] of this.typeIndexes.entries()) {
      entitiesByType[type] = ids.size;
    }

    // Count total relationships
    this.entities.forEach((entity) => {
      entity.relationships.forEach((relatedIds) => {
        totalRelationships += relatedIds.length;
      });
    });

    return {
      totalEntities: this.entities.size,
      entitiesByType,
      totalRelationships,
    };
  }

  /**
   * Clear all entities (useful for test cleanup)
   */
  clear(): void {
    this.entities.clear();
    this.typeIndexes.clear();
  }
}
