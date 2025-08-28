/**
 * Smart MSW Handler for Complex Relationship Testing
 *
 * Intelligently handles InterMine queries using semantic understanding
 * and entity registry for proper relationship resolution.
 */

import {http, HttpResponse} from 'msw';
import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {QueryParser, InterMineQuery} from './query-parser.js';

export interface ResponseFormat {
  results: any[];
  count?: number;
}

export class SmartQueryHandler {
  private parser = new QueryParser();

  constructor(private registry: MockEntityRegistry) {}

  /**
   * Create MSW handler for InterMine queries
   */
  createHandler() {
    return http.post('*/query/results', async ({request}) => {
      try {
        console.log('Smart Handler: Intercepted query to:', request.url);

        const body = await request.text();
        const params = new URLSearchParams(body);
        const queryXml = params.get('query') || '';
        const format = params.get('format') || 'json';

        // Parse the query
        const parsedQuery = this.parser.parseQuery(queryXml, format);
        console.log(
          'Smart Handler: Parsed query -',
          this.parser.describeQuery(parsedQuery),
        );

        // Handle different query types
        const response = await this.executeQuery(parsedQuery);

        console.log(
          `Smart Handler: Returning ${response.results?.length || 0} results in ${format} format`,
        );
        return HttpResponse.json(response);
      } catch (error) {
        console.error('Smart Handler Error:', error);
        // Fallback to empty response
        return HttpResponse.json({results: []});
      }
    });
  }

  /**
   * Execute query against entity registry
   */
  private async executeQuery(query: InterMineQuery): Promise<ResponseFormat> {
    // Handle count queries
    if (query.format === 'jsoncount') {
      const count = this.getEntityCount(query);
      return {results: [], count};
    }

    // Get entities based on query type
    let entities: EntityNode[];

    if (this.parser.isEntityByIdentifierQuery(query)) {
      entities = this.getEntityByIdentifier(query);
    } else if (this.parser.isSearchQuery(query)) {
      entities = this.searchEntities(query);
    } else {
      entities = this.getEntitiesByType(query);
    }

    // Format response based on query format
    if (query.format === 'jsonobjects') {
      return this.formatAsObjects(entities, query);
    } else {
      return this.formatAsArrays(entities, query);
    }
  }

  /**
   * Get entity count for count queries
   */
  private getEntityCount(query: InterMineQuery): number {
    const entities = this.registry.queryEntities(
      query.entityType,
      query.constraints,
    );
    return entities.length;
  }

  /**
   * Get entity by identifier
   */
  private getEntityByIdentifier(query: InterMineQuery): EntityNode[] {
    const identifier = this.parser.getIdentifierValue(query);
    if (!identifier) return [];

    // Try to find entity by primaryIdentifier
    const entities = this.registry.getEntitiesByType(query.entityType);
    const matchingEntity = entities.find(
      (entity) =>
        entity.data.primaryIdentifier === identifier ||
        entity.data.identifier === identifier,
    );

    return matchingEntity ? [matchingEntity] : [];
  }

  /**
   * Search entities using CONTAINS queries
   */
  private searchEntities(query: InterMineQuery): EntityNode[] {
    // For now, just return entities of the requested type
    // In a full implementation, this would do text search
    return this.registry.getEntitiesByType(query.entityType).slice(0, 10);
  }

  /**
   * Get entities by type with constraints
   */
  private getEntitiesByType(query: InterMineQuery): EntityNode[] {
    return this.registry.queryEntities(query.entityType, query.constraints);
  }

  /**
   * Format response as object format (for jsonobjects)
   */
  private formatAsObjects(
    entities: EntityNode[],
    query: InterMineQuery,
  ): ResponseFormat {
    const results = entities.map((entity) =>
      this.buildObjectResponse(entity, query),
    );
    return {results};
  }

  /**
   * Format response as array format (for json)
   */
  private formatAsArrays(
    entities: EntityNode[],
    query: InterMineQuery,
  ): ResponseFormat {
    const results = entities.map((entity) =>
      this.buildArrayResponse(entity, query),
    );
    return {results};
  }

  /**
   * Build object-style response for an entity
   */
  private buildObjectResponse(entity: EntityNode, query: InterMineQuery): any {
    const result: any = {};

    for (const viewField of query.view) {
      const value = this.resolveFieldValue(entity, viewField);
      this.setNestedProperty(result, viewField, value);
    }

    return result;
  }

  /**
   * Build array-style response for an entity
   */
  private buildArrayResponse(entity: EntityNode, query: InterMineQuery): any[] {
    const result: any[] = [];

    for (const viewField of query.view) {
      const value = this.resolveFieldValue(entity, viewField);
      result.push(value);
    }

    return result;
  }

  /**
   * Resolve field value, including relationship traversal
   */
  private resolveFieldValue(entity: EntityNode, fieldPath: string): any {
    const parts = fieldPath.split('.');

    if (parts.length === 1) {
      // Direct field access
      return entity.data[parts[0]] ?? null;
    }

    // Relationship traversal
    const [relationshipName, ...remainingPath] = parts;
    const relatedEntities = this.registry.getRelatedEntities(
      entity.id,
      relationshipName,
    );

    if (relatedEntities.length === 0) {
      return null;
    }

    // For now, use the first related entity
    const relatedEntity = relatedEntities[0];
    const remainingFieldPath = remainingPath.join('.');

    return this.resolveFieldValue(relatedEntity, remainingFieldPath);
  }

  /**
   * Set nested property in object
   */
  private setNestedProperty(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Get registry statistics
   */
  getRegistryStats() {
    return this.registry.getStats();
  }
}

/**
 * Factory function to create smart handler with registry
 */
export function createSmartHandler(registry: MockEntityRegistry) {
  const handler = new SmartQueryHandler(registry);
  return handler.createHandler();
}

/**
 * Create smart handlers array for MSW setup
 */
export function createSmartHandlers(registry: MockEntityRegistry) {
  const queryHandler = createSmartHandler(registry);

  return [
    queryHandler,

    // Web properties handler
    http.get('*/web-properties', () => {
      console.log('Smart Handler: Web properties requested');
      return HttpResponse.json({
        'project.title': 'Smart Test Mine',
        'project.version': '1.0.0',
        'project.releaseVersion': 'test-release',
      });
    }),

    // Search endpoint handler
    http.get('*/search', ({request}) => {
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get('q') || '';
      console.log(`Smart Handler: Search for "${searchTerm}"`);

      // Simple search implementation
      const genes = registry.getEntitiesByType('Gene');
      const matchingGenes = genes.filter(
        (gene) =>
          gene.data.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gene.data.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return HttpResponse.json({results: matchingGenes.map((g) => g.data)});
    }),

    // Debug catch-all
    http.all('*', ({request}) => {
      console.log(
        'Smart Handler: Unhandled request:',
        request.method,
        request.url,
      );
    }),
  ];
}
