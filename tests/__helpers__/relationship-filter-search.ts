/**
 * Advanced Relationship Filtering and Search System
 *
 * Sophisticated filtering and search capabilities for relationship queries
 * including text search, faceted filtering, temporal queries, and
 * complex boolean expressions across relationship networks.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';
import {CollectionRelationshipManager} from './collection-relationship-manager.js';

export interface SearchQuery {
  text?: string;
  filters: FilterCriteria[];
  sorting?: SortCriteria[];
  pagination?: PaginationCriteria;
  facets?: FacetRequest[];
  highlight?: HighlightOptions;
}

export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: any;
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'array';
  caseSensitive?: boolean;
  boost?: number; // For relevance scoring
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
  mode?: 'min' | 'max' | 'avg' | 'sum'; // For multi-value fields
  missingValuesLast?: boolean;
}

export interface PaginationCriteria {
  limit: number;
  offset: number;
  cursor?: string;
}

export interface FacetRequest {
  field: string;
  type: 'terms' | 'range' | 'date_histogram';
  size?: number;
  ranges?: {from?: number; to?: number; label: string}[];
}

export interface HighlightOptions {
  fields: string[];
  fragmentSize?: number;
  numberOfFragments?: number;
}

export interface SearchResult {
  entities: EntityNode[];
  totalCount: number;
  facets: Record<string, FacetResult>;
  highlights: Record<string, string[]>;
  suggestions: string[];
  searchTime: number;
  relevanceScores?: number[];
  metadata: {
    query: SearchQuery;
    filtersApplied: number;
    textSearched: boolean;
    facetsComputed: number;
  };
}

export interface FacetResult {
  type: string;
  buckets: Array<{
    key: string | number;
    count: number;
    label?: string;
  }>;
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists'
  | 'regex'
  | 'fuzzy'
  | 'within_distance'
  | 'intersects'; // Spatial operators

/**
 * Advanced relationship filtering and search engine
 */
export class RelationshipFilterSearch {
  private searchIndexes = new Map<string, Map<string, Set<string>>>();
  private facetIndexes = new Map<string, Map<string, any[]>>();
  private searchCache = new Map<
    string,
    {result: SearchResult; timestamp: number}
  >();

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
    private collectionManager: CollectionRelationshipManager,
  ) {
    this.buildSearchIndexes();
  }

  /**
   * Perform advanced relationship search with filtering and faceting
   */
  searchRelationships(
    sourceEntity: EntityNode,
    relationshipName: string,
    query: SearchQuery,
  ): SearchResult {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.createSearchCacheKey(
      sourceEntity.id,
      relationshipName,
      query,
    );
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 60000) {
      // 1-minute cache
      return cached.result;
    }

    // Get base relationship entities
    const baseResult = this.collectionManager.getCollection(
      sourceEntity,
      relationshipName,
      {
        limit: Number.MAX_SAFE_INTEGER, // Get all for filtering
      },
    );

    let entities = baseResult.entities;
    let totalCount = entities.length;

    const result: SearchResult = {
      entities: [],
      totalCount: 0,
      facets: {},
      highlights: {},
      suggestions: [],
      searchTime: 0,
      metadata: {
        query,
        filtersApplied: 0,
        textSearched: false,
        facetsComputed: 0,
      },
    };

    try {
      // Apply text search
      if (query.text && query.text.trim()) {
        entities = this.applyTextSearch(entities, query.text, query.highlight);
        result.metadata.textSearched = true;

        // Generate search suggestions
        result.suggestions = this.generateSearchSuggestions(
          query.text,
          entities,
        );

        // Apply highlighting
        if (query.highlight) {
          result.highlights = this.applyHighlighting(
            entities,
            query.text,
            query.highlight,
          );
        }
      }

      // Apply filters
      if (query.filters && query.filters.length > 0) {
        entities = this.applyFilters(entities, query.filters);
        result.metadata.filtersApplied = query.filters.length;
      }

      // Calculate relevance scores
      if (query.text) {
        result.relevanceScores = this.calculateRelevanceScores(
          entities,
          query.text,
          query.filters,
        );

        // Sort by relevance if no explicit sorting
        if (!query.sorting || query.sorting.length === 0) {
          entities = this.sortByRelevance(entities, result.relevanceScores);
        }
      }

      // Apply sorting
      if (query.sorting && query.sorting.length > 0) {
        entities = this.applySorting(entities, query.sorting);
      }

      // Compute facets on filtered results
      if (query.facets && query.facets.length > 0) {
        result.facets = this.computeFacets(entities, query.facets);
        result.metadata.facetsComputed = query.facets.length;
      }

      // Apply pagination
      totalCount = entities.length;
      if (query.pagination) {
        entities = this.applyPagination(entities, query.pagination);
      }

      result.entities = entities;
      result.totalCount = totalCount;
    } catch (error) {
      console.error('Search error:', error);
      result.entities = baseResult.entities.slice(0, 10); // Fallback to first 10
      result.totalCount = baseResult.entities.length;
    }

    result.searchTime = Date.now() - startTime;

    // Cache the result
    this.searchCache.set(cacheKey, {
      result: {...result},
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Apply text search across searchable fields
   */
  private applyTextSearch(
    entities: EntityNode[],
    searchText: string,
    _highlight?: HighlightOptions,
  ): EntityNode[] {
    const searchTerms = searchText
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);
    const searchableFields = [
      'name',
      'description',
      'identifier',
      'primaryIdentifier',
      'symbol',
      'briefDescription',
    ];

    return entities.filter((entity) => {
      return searchTerms.some((term) => {
        return searchableFields.some((field) => {
          const value = entity.data[field];
          return (
            value &&
            typeof value === 'string' &&
            value.toLowerCase().includes(term)
          );
        });
      });
    });
  }

  /**
   * Apply advanced filters
   */
  private applyFilters(
    entities: EntityNode[],
    filters: FilterCriteria[],
  ): EntityNode[] {
    return entities.filter((entity) => {
      return filters.every((filter) => this.evaluateFilter(entity, filter));
    });
  }

  /**
   * Evaluate a single filter against an entity
   */
  private evaluateFilter(entity: EntityNode, filter: FilterCriteria): boolean {
    const value = this.getFieldValue(entity.data, filter.field);
    const filterValue = filter.value;
    const caseSensitive = filter.caseSensitive ?? false;

    // Handle null/undefined values
    if (value == null) {
      return (
        filter.operator === 'not_exists' ||
        (filter.operator === 'not_equals' && filterValue != null)
      );
    }

    if (
      filterValue == null &&
      !['exists', 'not_exists'].includes(filter.operator)
    ) {
      return false;
    }

    // String operations
    if (typeof value === 'string') {
      const compareValue = caseSensitive ? value : value.toLowerCase();
      const compareFilter = caseSensitive
        ? String(filterValue)
        : String(filterValue).toLowerCase();

      switch (filter.operator) {
        case 'equals':
          return compareValue === compareFilter;
        case 'not_equals':
          return compareValue !== compareFilter;
        case 'contains':
          return compareValue.includes(compareFilter);
        case 'not_contains':
          return !compareValue.includes(compareFilter);
        case 'starts_with':
          return compareValue.startsWith(compareFilter);
        case 'ends_with':
          return compareValue.endsWith(compareFilter);
        case 'regex':
          try {
            const regex = new RegExp(filterValue, caseSensitive ? '' : 'i');
            return regex.test(value);
          } catch {
            return false;
          }
        case 'fuzzy':
          return this.fuzzyMatch(compareValue, compareFilter);
      }
    }

    // Numeric operations
    if (typeof value === 'number') {
      const numFilter = Number(filterValue);
      if (isNaN(numFilter)) return false;

      switch (filter.operator) {
        case 'equals':
          return value === numFilter;
        case 'not_equals':
          return value !== numFilter;
        case 'greater_than':
          return value > numFilter;
        case 'less_than':
          return value < numFilter;
        case 'greater_equal':
          return value >= numFilter;
        case 'less_equal':
          return value <= numFilter;
        case 'between':
          if (Array.isArray(filterValue) && filterValue.length === 2) {
            return value >= filterValue[0] && value <= filterValue[1];
          }
          return false;
      }
    }

    // Array operations
    if (Array.isArray(filterValue)) {
      switch (filter.operator) {
        case 'in':
          return filterValue.includes(value);
        case 'not_in':
          return !filterValue.includes(value);
      }
    }

    // General operations
    switch (filter.operator) {
      case 'exists':
        return value != null;
      case 'not_exists':
        return value == null;
      default:
        return true;
    }
  }

  /**
   * Apply sorting to entities
   */
  private applySorting(
    entities: EntityNode[],
    sorting: SortCriteria[],
  ): EntityNode[] {
    return [...entities].sort((a, b) => {
      for (const sort of sorting) {
        const valueA = this.getFieldValue(a.data, sort.field);
        const valueB = this.getFieldValue(b.data, sort.field);

        // Handle null values
        if (valueA == null && valueB == null) continue;
        if (valueA == null) return sort.missingValuesLast ? 1 : -1;
        if (valueB == null) return sort.missingValuesLast ? -1 : 1;

        let comparison = 0;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA).localeCompare(String(valueB));
        }

        if (comparison !== 0) {
          return sort.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Apply pagination
   */
  private applyPagination(
    entities: EntityNode[],
    pagination: PaginationCriteria,
  ): EntityNode[] {
    const start = pagination.offset || 0;
    const end = start + pagination.limit;
    return entities.slice(start, end);
  }

  /**
   * Compute facets for search results
   */
  private computeFacets(
    entities: EntityNode[],
    facetRequests: FacetRequest[],
  ): Record<string, FacetResult> {
    const facets: Record<string, FacetResult> = {};

    facetRequests.forEach((request) => {
      switch (request.type) {
        case 'terms':
          facets[request.field] = this.computeTermsFacet(entities, request);
          break;
        case 'range':
          facets[request.field] = this.computeRangeFacet(entities, request);
          break;
        case 'date_histogram':
          facets[request.field] = this.computeDateHistogramFacet(
            entities,
            request,
          );
          break;
      }
    });

    return facets;
  }

  /**
   * Compute terms facet (distinct values with counts)
   */
  private computeTermsFacet(
    entities: EntityNode[],
    request: FacetRequest,
  ): FacetResult {
    const termCounts = new Map<string, number>();

    entities.forEach((entity) => {
      const value = this.getFieldValue(entity.data, request.field);
      if (value != null) {
        const key = String(value);
        termCounts.set(key, (termCounts.get(key) || 0) + 1);
      }
    });

    const buckets = Array.from(termCounts.entries())
      .map(([key, count]) => ({key, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, request.size || 10);

    return {
      type: 'terms',
      buckets,
    };
  }

  /**
   * Compute range facet
   */
  private computeRangeFacet(
    entities: EntityNode[],
    request: FacetRequest,
  ): FacetResult {
    const ranges = request.ranges || [];
    const buckets = ranges.map((range) => {
      const count = entities.filter((entity) => {
        const value = this.getFieldValue(entity.data, request.field);
        if (typeof value !== 'number') return false;

        const withinRange =
          (range.from == null || value >= range.from) &&
          (range.to == null || value < range.to);
        return withinRange;
      }).length;

      return {
        key: `${range.from || '*'}-${range.to || '*'}`,
        count,
        label: range.label,
      };
    });

    return {
      type: 'range',
      buckets,
    };
  }

  /**
   * Compute date histogram facet
   */
  private computeDateHistogramFacet(
    entities: EntityNode[],
    request: FacetRequest,
  ): FacetResult {
    // Simplified implementation - would need proper date handling in real system
    const dateCounts = new Map<string, number>();

    entities.forEach((entity) => {
      const value = this.getFieldValue(entity.data, request.field);
      if (value) {
        const dateKey = String(value).split('T')[0]; // Extract date part
        dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
      }
    });

    const buckets = Array.from(dateCounts.entries())
      .map(([key, count]) => ({key, count}))
      .sort((a, b) => a.key.localeCompare(b.key));

    return {
      type: 'date_histogram',
      buckets,
    };
  }

  /**
   * Calculate relevance scores for search results
   */
  private calculateRelevanceScores(
    entities: EntityNode[],
    searchText: string,
    filters: FilterCriteria[],
  ): number[] {
    const searchTerms = searchText
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    return entities.map((entity) => {
      let score = 0;
      const searchableFields = [
        'name',
        'description',
        'identifier',
        'primaryIdentifier',
        'symbol',
      ];

      // Text matching score
      searchableFields.forEach((field) => {
        const value = entity.data[field];
        if (value && typeof value === 'string') {
          const lowerValue = value.toLowerCase();

          searchTerms.forEach((term) => {
            // Exact match
            if (lowerValue === term) {
              score += 100;
            }
            // Starts with term
            else if (lowerValue.startsWith(term)) {
              score += 50;
            }
            // Contains term
            else if (lowerValue.includes(term)) {
              score += 20;
            }
            // Fuzzy match
            else if (this.fuzzyMatch(lowerValue, term)) {
              score += 10;
            }
          });

          // Boost important fields
          if (field === 'name' || field === 'primaryIdentifier') {
            score *= 2;
          }
        }
      });

      // Filter boost
      filters.forEach((filter) => {
        if (filter.boost && this.evaluateFilter(entity, filter)) {
          score += filter.boost;
        }
      });

      return score;
    });
  }

  /**
   * Sort entities by relevance scores
   */
  private sortByRelevance(
    entities: EntityNode[],
    scores: number[],
  ): EntityNode[] {
    const indexed = entities.map((entity, index) => ({
      entity,
      score: scores[index],
    }));
    indexed.sort((a, b) => b.score - a.score);
    return indexed.map((item) => item.entity);
  }

  /**
   * Apply highlighting to search results
   */
  private applyHighlighting(
    entities: EntityNode[],
    searchText: string,
    options: HighlightOptions,
  ): Record<string, string[]> {
    const highlights: Record<string, string[]> = {};
    const searchTerms = searchText
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    entities.forEach((entity) => {
      const entityHighlights: string[] = [];

      options.fields.forEach((field) => {
        const value = entity.data[field];
        if (value && typeof value === 'string') {
          const highlighted = this.highlightText(value, searchTerms, options);
          if (highlighted !== value) {
            entityHighlights.push(`${field}: ${highlighted}`);
          }
        }
      });

      if (entityHighlights.length > 0) {
        highlights[entity.id] = entityHighlights;
      }
    });

    return highlights;
  }

  /**
   * Highlight search terms in text
   */
  private highlightText(
    text: string,
    terms: string[],
    _options: HighlightOptions,
  ): string {
    let highlighted = text;

    terms.forEach((term) => {
      const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
  }

  /**
   * Generate search suggestions based on partial matches
   */
  private generateSearchSuggestions(
    searchText: string,
    entities: EntityNode[],
  ): string[] {
    const suggestions = new Set<string>();
    const searchLower = searchText.toLowerCase();

    entities.forEach((entity) => {
      ['name', 'identifier', 'primaryIdentifier', 'symbol'].forEach((field) => {
        const value = entity.data[field];
        if (value && typeof value === 'string') {
          const valueLower = value.toLowerCase();
          if (valueLower.includes(searchLower) && valueLower !== searchLower) {
            suggestions.add(value);
          }
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Build search indexes for faster searching
   */
  private buildSearchIndexes(): void {
    const entityTypes = this.registry.getAllEntityTypes();

    entityTypes.forEach((entityType) => {
      const entities = this.registry.getEntitiesByType(entityType);
      const typeIndex = new Map<string, Set<string>>();
      const facetIndex = new Map<string, any[]>();

      entities.forEach((entity) => {
        // Text search index
        const searchableFields = [
          'name',
          'description',
          'identifier',
          'primaryIdentifier',
          'symbol',
        ];
        searchableFields.forEach((field) => {
          const value = entity.data[field];
          if (value && typeof value === 'string') {
            const words = value.toLowerCase().split(/\s+/);
            words.forEach((word) => {
              if (!typeIndex.has(word)) {
                typeIndex.set(word, new Set());
              }
              typeIndex.get(word)!.add(entity.id);
            });
          }
        });

        // Facet index
        Object.entries(entity.data).forEach(([field, value]) => {
          if (value != null) {
            if (!facetIndex.has(field)) {
              facetIndex.set(field, []);
            }
            facetIndex.get(field)!.push(value);
          }
        });
      });

      this.searchIndexes.set(entityType, typeIndex);
      this.facetIndexes.set(entityType, facetIndex);
    });

    console.log(`Built search indexes for ${entityTypes.length} entity types`);
  }

  /**
   * Get nested field value using dot notation
   */
  private getFieldValue(data: any, fieldPath: string): any {
    return fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
  }

  /**
   * Simple fuzzy matching implementation
   */
  private fuzzyMatch(str1: string, str2: string): boolean {
    const maxDistance = Math.max(str1.length, str2.length) * 0.3; // 30% tolerance
    return this.levenshteinDistance(str1, str2) <= maxDistance;
  }

  /**
   * Calculate Levenshtein distance
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
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Escape regex special characters
   */
  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Create cache key for search results
   */
  private createSearchCacheKey(
    entityId: string,
    relationshipName: string,
    query: SearchQuery,
  ): string {
    const queryKey = JSON.stringify({
      text: query.text,
      filters: query.filters,
      sorting: query.sorting,
      facets: query.facets,
    });
    return `${entityId}_${relationshipName}_${queryKey}`;
  }

  /**
   * Clear search cache
   */
  clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Get search statistics
   */
  getSearchStatistics(): {
    indexSize: number;
    cacheHits: number;
    averageSearchTime: number;
    topSearchTerms: string[];
  } {
    const totalIndexEntries = Array.from(this.searchIndexes.values()).reduce(
      (sum, index) => sum + index.size,
      0,
    );

    return {
      indexSize: totalIndexEntries,
      cacheHits: this.searchCache.size,
      averageSearchTime: 0, // Would track in real implementation
      topSearchTerms: [], // Would track in real implementation
    };
  }
}

/**
 * Factory function to create relationship filter search
 */
export function createRelationshipFilterSearch(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
  collectionManager: CollectionRelationshipManager,
): RelationshipFilterSearch {
  return new RelationshipFilterSearch(
    registry,
    directResolver,
    collectionManager,
  );
}
