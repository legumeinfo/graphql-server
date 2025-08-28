/**
 * InterMine Query Parser for Semantic Understanding
 *
 * Parses InterMine XML queries into structured format for intelligent handling
 * of entity queries and relationship resolution in tests.
 */

import {Constraint} from './entity-registry.js';

export interface InterMineQuery {
  model: string;
  view: string[];
  constraints: Constraint[];
  sortOrder?: string;
  format: 'json' | 'jsonobjects' | 'jsoncount';
  entityType: string; // Primary entity type being queried
}

export class QueryParser {
  /**
   * Parse InterMine XML query string into structured format
   */
  parseQuery(xmlQuery: string, format: string = 'json'): InterMineQuery {
    // Handle empty queries
    if (!xmlQuery || xmlQuery.trim() === '') {
      throw new Error('Empty query provided');
    }

    try {
      // Extract basic components using regex (simplified XML parsing)
      const modelMatch = xmlQuery.match(/model=['"]([^'"]*)['"]/);
      const viewMatch = xmlQuery.match(/view=['"]([^'"]*)['"]/);
      const sortOrderMatch = xmlQuery.match(/sortOrder=['"]([^'"]*)['"]/);

      const model = modelMatch ? modelMatch[1] : 'genomic';
      const viewString = viewMatch ? viewMatch[1] : '';
      const sortOrder = sortOrderMatch ? sortOrderMatch[1] : undefined;

      // Parse view fields
      const view = viewString.split(/\s+/).filter((field) => field.length > 0);

      // Determine primary entity type from view
      const entityType = this.extractEntityType(view);

      // Parse constraints from XML
      const constraints = this.parseConstraints(xmlQuery);

      return {
        model,
        view,
        constraints,
        sortOrder,
        format: format as any,
        entityType,
      };
    } catch (error) {
      console.error('Error parsing query:', error);
      throw new Error(`Failed to parse InterMine query: ${error}`);
    }
  }

  /**
   * Extract the primary entity type from view fields
   */
  private extractEntityType(view: string[]): string {
    if (view.length === 0) return 'Unknown';

    // Get the first field and extract entity type
    const firstField = view[0];
    const parts = firstField.split('.');
    return parts[0] || 'Unknown';
  }

  /**
   * Parse constraints from XML query
   */
  private parseConstraints(xmlQuery: string): Constraint[] {
    const constraints: Constraint[] = [];

    // Use regex to find constraint elements
    const constraintRegex =
      /<constraint[^>]*path=['"]([^'"]*)['"]\s*op=['"]([^'"]*)['"]\s*value=['"]([^'"]*)['"]/g;

    let match;
    while ((match = constraintRegex.exec(xmlQuery)) !== null) {
      const [, path, operator, value] = match;

      // Convert InterMine operators to our format
      const normalizedOperator = this.normalizeOperator(operator);

      constraints.push({
        path,
        operator: normalizedOperator,
        value: this.parseValue(value),
      });
    }

    return constraints;
  }

  /**
   * Normalize InterMine operators to standard format
   */
  private normalizeOperator(imOperator: string): string {
    const operatorMap: Record<string, string> = {
      EQUALS: '=',
      '=': '=',
      NOT_EQUALS: '!=',
      '!=': '!=',
      CONTAINS: 'CONTAINS',
      DOES_NOT_CONTAIN: 'NOT_CONTAINS',
      GREATER_THAN: '>',
      '>': '>',
      LESS_THAN: '<',
      '<': '<',
      GREATER_THAN_EQUALS: '>=',
      '>=': '>=',
      LESS_THAN_EQUALS: '<=',
      '<=': '<=',
      IS_NULL: 'IS_NULL',
      IS_NOT_NULL: 'IS_NOT_NULL',
    };

    return operatorMap[imOperator] || imOperator;
  }

  /**
   * Parse constraint value to appropriate type
   */
  private parseValue(value: string): any {
    // Try to parse as number
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }

    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }

    // Parse boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Return as string
    return value;
  }

  /**
   * Determine if this is a relationship query
   */
  isRelationshipQuery(query: InterMineQuery): boolean {
    // Check if view includes relationship fields (contains dots)
    return query.view.some(
      (field) => field.includes('.') && field.split('.').length > 1,
    );
  }

  /**
   * Extract relationship paths from query
   */
  getRelationshipPaths(query: InterMineQuery): string[] {
    const relationships = new Set<string>();

    query.view.forEach((field) => {
      const parts = field.split('.');
      if (parts.length > 1) {
        // Extract relationship path (everything except the last field)
        const relationshipPath = parts.slice(0, -1).join('.');
        relationships.add(relationshipPath);
      }
    });

    return Array.from(relationships);
  }

  /**
   * Check if query is asking for a specific entity by ID
   */
  isEntityByIdQuery(query: InterMineQuery): boolean {
    return query.constraints.some(
      (constraint) => constraint.path === 'id' && constraint.operator === '=',
    );
  }

  /**
   * Check if query is asking for entity by unique identifier
   */
  isEntityByIdentifierQuery(query: InterMineQuery): boolean {
    return query.constraints.some(
      (constraint) =>
        (constraint.path === 'primaryIdentifier' ||
          constraint.path.endsWith('.primaryIdentifier')) &&
        constraint.operator === '=',
    );
  }

  /**
   * Get the identifier value from query constraints
   */
  getIdentifierValue(query: InterMineQuery): string | null {
    const identifierConstraint = query.constraints.find(
      (constraint) =>
        (constraint.path === 'primaryIdentifier' ||
          constraint.path.endsWith('.primaryIdentifier')) &&
        constraint.operator === '=',
    );

    return identifierConstraint ? identifierConstraint.value : null;
  }

  /**
   * Check if this is a search query (contains CONTAINS operator)
   */
  isSearchQuery(query: InterMineQuery): boolean {
    return query.constraints.some(
      (constraint) => constraint.operator === 'CONTAINS',
    );
  }

  /**
   * Get search terms from query
   */
  getSearchTerms(query: InterMineQuery): string[] {
    return query.constraints
      .filter((constraint) => constraint.operator === 'CONTAINS')
      .map((constraint) => constraint.value);
  }

  /**
   * Generate a human-readable description of the query
   */
  describeQuery(query: InterMineQuery): string {
    let description = `Query ${query.entityType}`;

    if (query.constraints.length > 0) {
      const constraintDescriptions = query.constraints.map(
        (c) => `${c.path} ${c.operator} ${c.value}`,
      );
      description += ` where ${constraintDescriptions.join(' AND ')}`;
    }

    if (query.view.length > 0) {
      description += ` returning [${query.view.join(', ')}]`;
    }

    description += ` in ${query.format} format`;

    return description;
  }
}
