/**
 * Direct Relationship Resolver for Core Entity Types
 *
 * Implements systematic resolution of direct (single-hop) relationships
 * between biological entities with proper type safety and validation.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';

export interface DirectRelationshipConfig {
  sourceType: string;
  targetType: string;
  relationshipName: string;
  isCollection: boolean;
  isOptional: boolean;
  maxResults?: number;
}

export interface ResolvedRelationship {
  entities: EntityNode[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Core direct relationship resolver
 */
export class DirectRelationshipResolver {
  private relationshipConfigs: Map<string, DirectRelationshipConfig[]> =
    new Map();

  constructor(private registry: MockEntityRegistry) {
    this.initializeRelationshipConfigs();
  }

  /**
   * Initialize standard biological relationship configurations
   */
  private initializeRelationshipConfigs(): void {
    const configs: DirectRelationshipConfig[] = [
      // Gene relationships
      {
        sourceType: 'Gene',
        targetType: 'Organism',
        relationshipName: 'organism',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Gene',
        targetType: 'Strain',
        relationshipName: 'strain',
        isCollection: false,
        isOptional: true,
      },
      {
        sourceType: 'Gene',
        targetType: 'Chromosome',
        relationshipName: 'chromosome',
        isCollection: false,
        isOptional: true,
      },
      {
        sourceType: 'Gene',
        targetType: 'Sequence',
        relationshipName: 'sequence',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Gene',
        targetType: 'Transcript',
        relationshipName: 'transcripts',
        isCollection: true,
        isOptional: false,
      },
      {
        sourceType: 'Gene',
        targetType: 'Protein',
        relationshipName: 'proteins',
        isCollection: true,
        isOptional: false,
      },
      {
        sourceType: 'Gene',
        targetType: 'Location',
        relationshipName: 'chromosomeLocation',
        isCollection: false,
        isOptional: true,
      },

      // Protein relationships
      {
        sourceType: 'Protein',
        targetType: 'Gene',
        relationshipName: 'gene',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Protein',
        targetType: 'Transcript',
        relationshipName: 'transcript',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Protein',
        targetType: 'Organism',
        relationshipName: 'organism',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Protein',
        targetType: 'Strain',
        relationshipName: 'strain',
        isCollection: false,
        isOptional: true,
      },
      {
        sourceType: 'Protein',
        targetType: 'Sequence',
        relationshipName: 'sequence',
        isCollection: false,
        isOptional: false,
      },

      // Transcript relationships
      {
        sourceType: 'Transcript',
        targetType: 'Gene',
        relationshipName: 'gene',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Transcript',
        targetType: 'Protein',
        relationshipName: 'protein',
        isCollection: false,
        isOptional: true,
      },
      {
        sourceType: 'Transcript',
        targetType: 'Organism',
        relationshipName: 'organism',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Transcript',
        targetType: 'Chromosome',
        relationshipName: 'chromosome',
        isCollection: false,
        isOptional: true,
      },
      {
        sourceType: 'Transcript',
        targetType: 'Sequence',
        relationshipName: 'sequence',
        isCollection: false,
        isOptional: false,
      },

      // Organism relationships
      {
        sourceType: 'Organism',
        targetType: 'Gene',
        relationshipName: 'genes',
        isCollection: true,
        isOptional: false,
        maxResults: 100,
      },
      {
        sourceType: 'Organism',
        targetType: 'Protein',
        relationshipName: 'proteins',
        isCollection: true,
        isOptional: false,
        maxResults: 100,
      },
      {
        sourceType: 'Organism',
        targetType: 'Strain',
        relationshipName: 'strains',
        isCollection: true,
        isOptional: false,
      },
      {
        sourceType: 'Organism',
        targetType: 'Chromosome',
        relationshipName: 'chromosomes',
        isCollection: true,
        isOptional: false,
      },

      // QTL relationships
      {
        sourceType: 'QTL',
        targetType: 'Trait',
        relationshipName: 'trait',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'QTL',
        targetType: 'QTLStudy',
        relationshipName: 'qtlStudy',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'QTL',
        targetType: 'LinkageGroup',
        relationshipName: 'linkageGroup',
        isCollection: false,
        isOptional: true,
      },

      // Trait relationships
      {
        sourceType: 'Trait',
        targetType: 'Organism',
        relationshipName: 'organism',
        isCollection: false,
        isOptional: false,
      },
      {
        sourceType: 'Trait',
        targetType: 'QTL',
        relationshipName: 'qtls',
        isCollection: true,
        isOptional: false,
      },
    ];

    // Group by source type for efficient lookup
    configs.forEach((config) => {
      if (!this.relationshipConfigs.has(config.sourceType)) {
        this.relationshipConfigs.set(config.sourceType, []);
      }
      this.relationshipConfigs.get(config.sourceType)!.push(config);
    });

    console.log(
      'Direct relationship resolver initialized with',
      configs.length,
      'relationship configurations',
    );
  }

  /**
   * Resolve a direct relationship for an entity
   */
  resolveDirectRelationship(
    sourceEntity: EntityNode,
    relationshipName: string,
    options: {maxResults?: number; offset?: number} = {},
  ): ResolvedRelationship | null {
    const config = this.getRelationshipConfig(
      sourceEntity.type,
      relationshipName,
    );
    if (!config) {
      console.warn(
        `No relationship configuration found for ${sourceEntity.type}.${relationshipName}`,
      );
      return null;
    }

    // Get related entity IDs from registry
    const relatedEntityIds = this.registry.getRelationshipIds(
      sourceEntity.id,
      relationshipName,
    );

    if (relatedEntityIds.length === 0) {
      if (config.isOptional) {
        return {entities: [], totalCount: 0, hasMore: false};
      } else {
        console.warn(
          `Required relationship ${sourceEntity.type}.${relationshipName} has no entities`,
        );
        return {entities: [], totalCount: 0, hasMore: false};
      }
    }

    // Get actual entity objects
    const relatedEntities = relatedEntityIds
      .map((id) => this.registry.getEntity(id))
      .filter((entity): entity is EntityNode => entity !== null);

    // Validate entity types
    const validEntities = relatedEntities.filter((entity) => {
      if (entity.type !== config.targetType) {
        console.warn(
          `Relationship ${relationshipName} expected ${config.targetType} but found ${entity.type}`,
        );
        return false;
      }
      return true;
    });

    // Apply pagination
    const {maxResults = config.maxResults, offset = 0} = options;
    const totalCount = validEntities.length;

    let resultEntities = validEntities;
    let hasMore = false;

    if (maxResults && maxResults > 0) {
      const endIndex = offset + maxResults;
      resultEntities = validEntities.slice(offset, endIndex);
      hasMore = endIndex < totalCount;
    }

    // For non-collection relationships, return only one entity
    if (!config.isCollection && resultEntities.length > 0) {
      resultEntities = [resultEntities[0]];
    }

    return {
      entities: resultEntities,
      totalCount,
      hasMore,
    };
  }

  /**
   * Get relationship configuration for a source type and relationship name
   */
  private getRelationshipConfig(
    sourceType: string,
    relationshipName: string,
  ): DirectRelationshipConfig | null {
    const configs = this.relationshipConfigs.get(sourceType);
    if (!configs) return null;

    return (
      configs.find((config) => config.relationshipName === relationshipName) ||
      null
    );
  }

  /**
   * Get all available relationships for a source entity type
   */
  getAvailableRelationships(sourceType: string): DirectRelationshipConfig[] {
    return this.relationshipConfigs.get(sourceType) || [];
  }

  /**
   * Validate that a relationship is properly configured
   */
  validateRelationshipConfig(
    sourceType: string,
    relationshipName: string,
  ): boolean {
    const config = this.getRelationshipConfig(sourceType, relationshipName);
    return config !== null;
  }

  /**
   * Resolve multiple relationships for an entity at once
   */
  resolveMultipleRelationships(
    sourceEntity: EntityNode,
    relationshipNames: string[],
    options: {maxResults?: number; offset?: number} = {},
  ): Record<string, ResolvedRelationship | null> {
    const results: Record<string, ResolvedRelationship | null> = {};

    relationshipNames.forEach((relationshipName) => {
      results[relationshipName] = this.resolveDirectRelationship(
        sourceEntity,
        relationshipName,
        options,
      );
    });

    return results;
  }

  /**
   * Check if a relationship should be a collection or single entity
   */
  isCollectionRelationship(
    sourceType: string,
    relationshipName: string,
  ): boolean {
    const config = this.getRelationshipConfig(sourceType, relationshipName);
    return config ? config.isCollection : false;
  }

  /**
   * Check if a relationship is optional
   */
  isOptionalRelationship(
    sourceType: string,
    relationshipName: string,
  ): boolean {
    const config = this.getRelationshipConfig(sourceType, relationshipName);
    return config ? config.isOptional : true; // Default to optional for unknown relationships
  }

  /**
   * Get statistics about relationship configurations
   */
  getRelationshipStats(): {
    totalConfigs: number;
    entityTypes: number;
    collectionRelationships: number;
    optionalRelationships: number;
  } {
    let totalConfigs = 0;
    let collectionRelationships = 0;
    let optionalRelationships = 0;

    this.relationshipConfigs.forEach((configs) => {
      totalConfigs += configs.length;
      configs.forEach((config) => {
        if (config.isCollection) collectionRelationships++;
        if (config.isOptional) optionalRelationships++;
      });
    });

    return {
      totalConfigs,
      entityTypes: this.relationshipConfigs.size,
      collectionRelationships,
      optionalRelationships,
    };
  }
}

/**
 * Factory function to create a direct relationship resolver with registry
 */
export function createDirectRelationshipResolver(
  registry: MockEntityRegistry,
): DirectRelationshipResolver {
  return new DirectRelationshipResolver(registry);
}
