/**
 * Relationship Validation Helpers for Complex GraphQL Testing
 *
 * Provides reusable patterns for validating different types of GraphQL relationships
 * with proper error handling and detailed assertions.
 */

import {expect} from 'vitest';

export interface RelationshipValidationOptions {
  allowNull?: boolean;
  expectedCount?: number;
  validator?: (entity: any) => void;
  description?: string;
}

/**
 * Comprehensive relationship validators for different relationship patterns
 */
export const validateRelationship = {
  /**
   * Validate a direct (single) entity relationship
   * @param parent - Parent entity containing the relationship
   * @param relationshipName - Name of the relationship field
   * @param options - Validation options
   */
  direct: (
    parent: any,
    relationshipName: string,
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, validator, description} = options;
    const contextDescription =
      description || `${relationshipName} relationship`;

    if (allowNull && parent[relationshipName] === null) {
      console.log(
        `Relationship ${relationshipName} is null (allowed in test environment)`,
      );
      return null;
    }

    expect(
      parent[relationshipName],
      `${contextDescription} should be defined`,
    ).toBeDefined();
    expect(
      parent[relationshipName],
      `${contextDescription} should not be null`,
    ).not.toBeNull();
    expect(
      typeof parent[relationshipName],
      `${contextDescription} should be an object`,
    ).toBe('object');
    expect(
      Array.isArray(parent[relationshipName]),
      `${contextDescription} should not be an array`,
    ).toBe(false);

    if (validator) {
      validator(parent[relationshipName]);
    }

    return parent[relationshipName];
  },

  /**
   * Validate a collection (array) relationship
   * @param parent - Parent entity containing the relationship
   * @param relationshipName - Name of the relationship field
   * @param options - Validation options including expected count
   */
  collection: (
    parent: any,
    relationshipName: string,
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, expectedCount, validator, description} = options;
    const contextDescription = description || `${relationshipName} collection`;

    if (
      allowNull &&
      (parent[relationshipName] === null ||
        parent[relationshipName] === undefined)
    ) {
      console.log(
        `Collection ${relationshipName} is null/undefined (allowed in test environment)`,
      );
      return [];
    }

    expect(
      parent[relationshipName],
      `${contextDescription} should be defined`,
    ).toBeDefined();
    expect(
      Array.isArray(parent[relationshipName]),
      `${contextDescription} should be an array`,
    ).toBe(true);

    if (expectedCount !== undefined) {
      expect(
        parent[relationshipName],
        `${contextDescription} should have ${expectedCount} items`,
      ).toHaveLength(expectedCount);
    } else {
      expect(
        parent[relationshipName].length,
        `${contextDescription} should not be empty`,
      ).toBeGreaterThan(0);
    }

    if (validator) {
      parent[relationshipName].forEach((item: any, index: number) => {
        try {
          validator(item);
        } catch (error) {
          throw new Error(
            `${contextDescription} item ${index} validation failed: ${error}`,
          );
        }
      });
    }

    return parent[relationshipName];
  },

  /**
   * Validate an optional relationship (may be null/undefined)
   * @param parent - Parent entity containing the relationship
   * @param relationshipName - Name of the relationship field
   * @param options - Validation options
   */
  optional: (
    parent: any,
    relationshipName: string,
    options: RelationshipValidationOptions = {},
  ) => {
    const {validator, description} = options;
    const contextDescription =
      description || `optional ${relationshipName} relationship`;

    const relationship = parent[relationshipName];

    if (relationship === null || relationship === undefined) {
      console.log(`Optional relationship ${relationshipName} is not present`);
      return null;
    }

    // If present, validate as direct relationship
    expect(
      typeof relationship,
      `${contextDescription} should be an object when present`,
    ).toBe('object');
    expect(
      Array.isArray(relationship),
      `${contextDescription} should not be an array when present`,
    ).toBe(false);

    if (validator) {
      validator(relationship);
    }

    return relationship;
  },

  /**
   * Validate a relationship chain (nested relationships)
   * @param root - Root entity to start traversal from
   * @param path - Array of relationship names to traverse
   * @param options - Validation options
   */
  chain: (
    root: any,
    path: string[],
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, validator, description} = options;
    const contextDescription =
      description || `relationship chain [${path.join(' -> ')}]`;

    let current = root;
    const traversedPath: string[] = [];

    for (const step of path) {
      traversedPath.push(step);
      const currentDescription = `${contextDescription} at step ${traversedPath.join(' -> ')}`;

      if (
        allowNull &&
        (current[step] === null || current[step] === undefined)
      ) {
        console.log(
          `Relationship chain broken at ${traversedPath.join(' -> ')} (allowed in test environment)`,
        );
        return null;
      }

      expect(
        current,
        `${currentDescription} parent should be defined`,
      ).toBeDefined();
      expect(
        current[step],
        `${currentDescription} should be defined`,
      ).toBeDefined();
      expect(
        current[step],
        `${currentDescription} should not be null`,
      ).not.toBeNull();

      current = current[step];
    }

    if (validator) {
      validator(current);
    }

    return current;
  },

  /**
   * Validate bidirectional relationship consistency
   * @param entityA - First entity
   * @param entityB - Second entity
   * @param relationshipA - Relationship field on entityA pointing to entityB
   * @param relationshipB - Relationship field on entityB pointing to entityA
   * @param options - Validation options
   */
  bidirectional: (
    entityA: any,
    entityB: any,
    relationshipA: string,
    relationshipB: string,
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, description} = options;
    const contextDescription =
      description ||
      `bidirectional relationship ${relationshipA} <-> ${relationshipB}`;

    // Check A -> B relationship
    if (allowNull && entityA[relationshipA] === null) {
      console.log(
        `Bidirectional relationship ${relationshipA} is null (allowed in test environment)`,
      );
      return {forward: null, reverse: null};
    }

    const forwardRelation = validateRelationship.direct(
      entityA,
      relationshipA,
      {
        allowNull,
        description: `${contextDescription} forward direction`,
      },
    );

    // Check B -> A relationship
    const reverseRelation = validateRelationship.direct(
      entityB,
      relationshipB,
      {
        allowNull,
        description: `${contextDescription} reverse direction`,
      },
    );

    // Validate consistency (if both exist)
    if (forwardRelation && reverseRelation) {
      expect(
        forwardRelation.identifier || forwardRelation.id,
        `Forward relationship should point to correct entity`,
      ).toBe(entityB.identifier || entityB.id);
      expect(
        reverseRelation.identifier || reverseRelation.id,
        `Reverse relationship should point to correct entity`,
      ).toBe(entityA.identifier || entityA.id);
    }

    return {forward: forwardRelation, reverse: reverseRelation};
  },

  /**
   * Validate relationship with specific field expectations
   * @param parent - Parent entity
   * @param relationshipName - Relationship field name
   * @param expectedFields - Expected fields with their values or types
   * @param options - Validation options
   */
  withFields: (
    parent: any,
    relationshipName: string,
    expectedFields: Record<string, any>,
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, description} = options;
    const contextDescription =
      description || `${relationshipName} with specific fields`;

    const relationship = validateRelationship.direct(parent, relationshipName, {
      allowNull,
      description: contextDescription,
    });

    if (!relationship && allowNull) return null;

    // Validate expected fields
    Object.entries(expectedFields).forEach(([fieldName, expectedValue]) => {
      expect(
        relationship,
        `${contextDescription} should have field ${fieldName}`,
      ).toHaveProperty(fieldName);

      if (
        typeof expectedValue === 'string' &&
        expectedValue.startsWith('typeof:')
      ) {
        // Type check
        const expectedType = expectedValue.replace('typeof:', '');
        expect(
          typeof relationship[fieldName],
          `${contextDescription}.${fieldName} should be of type ${expectedType}`,
        ).toBe(expectedType);
      } else if (expectedValue !== undefined) {
        // Value check
        expect(
          relationship[fieldName],
          `${contextDescription}.${fieldName} should equal ${expectedValue}`,
        ).toBe(expectedValue);
      }
    });

    return relationship;
  },

  /**
   * Validate relationship data types comprehensively
   * @param parent - Parent entity
   * @param relationshipName - Relationship field name
   * @param typeSchema - Schema defining expected field types
   * @param options - Validation options
   */
  dataTypes: (
    parent: any,
    relationshipName: string,
    typeSchema: Record<string, string>,
    options: RelationshipValidationOptions = {},
  ) => {
    const {allowNull = false, description} = options;
    const contextDescription = description || `${relationshipName} data types`;

    const relationship = validateRelationship.direct(parent, relationshipName, {
      allowNull,
      description: contextDescription,
    });

    if (!relationship && allowNull) return null;

    // Validate all field types
    Object.entries(typeSchema).forEach(([fieldName, expectedType]) => {
      if (
        relationship[fieldName] !== null &&
        relationship[fieldName] !== undefined
      ) {
        expect(
          typeof relationship[fieldName],
          `${contextDescription}.${fieldName} should be ${expectedType}`,
        ).toBe(expectedType);

        // Additional type validations
        if (expectedType === 'number') {
          expect(
            isNaN(relationship[fieldName]),
            `${contextDescription}.${fieldName} should be a valid number`,
          ).toBe(false);
        }

        if (expectedType === 'string') {
          expect(
            relationship[fieldName].length,
            `${contextDescription}.${fieldName} should not be empty string`,
          ).toBeGreaterThan(0);
        }
      }
    });

    return relationship;
  },
};

/**
 * Helper to validate common biological relationship patterns
 */
export const validateBiologicalRelationships = {
  /**
   * Validate organism-related relationships (organism, strain)
   */
  organism: (entity: any, options: RelationshipValidationOptions = {}) => {
    const organism = validateRelationship.withFields(
      entity,
      'organism',
      {
        taxonId: 'typeof:string',
        name: 'typeof:string',
      },
      {...options, description: 'organism relationship'},
    );

    const strain = validateRelationship.withFields(
      entity,
      'strain',
      {
        identifier: 'typeof:string',
      },
      {...options, description: 'strain relationship'},
    );

    return {organism, strain};
  },

  /**
   * Validate sequence-related relationships (sequence, location)
   */
  sequence: (entity: any, options: RelationshipValidationOptions = {}) => {
    const sequence = validateRelationship.withFields(
      entity,
      'sequence',
      {
        length: 'typeof:number',
      },
      {...options, description: 'sequence relationship'},
    );

    const location = validateRelationship.optional(
      entity,
      'chromosomeLocation',
      {
        ...options,
        validator: (loc: any) => {
          expect(typeof loc.start).toBe('number');
          expect(typeof loc.end).toBe('number');
          expect(loc.end).toBeGreaterThan(loc.start);
        },
        description: 'chromosome location relationship',
      },
    );

    return {sequence, location};
  },

  /**
   * Validate gene-protein-transcript relationships
   */
  geneProteinTranscript: (
    gene: any,
    options: RelationshipValidationOptions = {},
  ) => {
    const proteins = validateRelationship.collection(gene, 'proteins', {
      ...options,
      validator: (protein: any) => {
        expect(typeof protein.identifier).toBe('string');
        expect(typeof protein.length).toBe('number');
      },
      description: 'gene proteins collection',
    });

    const transcripts = validateRelationship.collection(gene, 'transcripts', {
      ...options,
      validator: (transcript: any) => {
        expect(typeof transcript.identifier).toBe('string');
        expect(typeof transcript.length).toBe('number');
      },
      description: 'gene transcripts collection',
    });

    return {proteins, transcripts};
  },
};
