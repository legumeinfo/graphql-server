/**
 * Optimized query matching system with pre-compiled patterns
 * Replaces string parsing on every request with cached pattern matching
 */

export interface QueryPattern {
  name: string;
  entityType: string;
  operation: 'single' | 'search' | 'count';
  pattern: RegExp;
  fields: string[];
}

// Pre-compiled query patterns for fast matching
export const queryPatterns: QueryPattern[] = [
  // Single entity queries
  {
    name: 'gene_by_identifier',
    entityType: 'gene',
    operation: 'single',
    pattern:
      /Gene\.primaryIdentifier\s*=\s*['"]([^'"]+)['"]|Gene\.primaryIdentifier\s*=\s*\?\s*\]/,
    fields: ['primaryIdentifier', 'description', 'symbol', 'organism'],
  },
  {
    name: 'organism_by_taxonId',
    entityType: 'organism',
    operation: 'single',
    pattern: /Organism\.taxonId\s*=\s*['"]?(\d+)['"]?/,
    fields: ['taxonId', 'name', 'genus', 'species'],
  },
  {
    name: 'protein_by_identifier',
    entityType: 'protein',
    operation: 'single',
    pattern:
      /Protein\.primaryIdentifier\s*=\s*['"]([^'"]+)['"]|Protein\.primaryIdentifier\s*=\s*\?\s*\]/,
    fields: ['primaryIdentifier', 'description', 'length', 'molecularWeight'],
  },
  {
    name: 'qtl_by_identifier',
    entityType: 'qtl',
    operation: 'single',
    pattern:
      /QTL\.primaryIdentifier\s*=\s*['"]([^'"]+)['"]|QTL\.primaryIdentifier\s*=\s*\?\s*\]/,
    fields: ['primaryIdentifier', 'name', 'lod', 'markerR2'],
  },
  {
    name: 'cds_by_identifier',
    entityType: 'cds',
    operation: 'single',
    pattern:
      /CDS\.primaryIdentifier\s*=\s*['"]([^'"]+)['"]|CDS\.primaryIdentifier\s*=\s*\?\s*\]/,
    fields: ['primaryIdentifier', 'transcript', 'isPrimary'],
  },
  {
    name: 'strain_by_identifier',
    entityType: 'strain',
    operation: 'single',
    pattern:
      /Strain\.identifier\s*=\s*['"]([^'"]+)['"]|Strain\.identifier\s*=\s*\?\s*\]/,
    fields: ['identifier', 'name', 'description', 'origin'],
  },

  // Search queries
  {
    name: 'genes_search',
    entityType: 'gene',
    operation: 'search',
    pattern: /Gene.*(?:CONTAINS|description.*=)/,
    fields: ['description', 'genus', 'species', 'page', 'pageSize'],
  },
  {
    name: 'organisms_search',
    entityType: 'organism',
    operation: 'search',
    pattern: /Organism.*(?:CONTAINS|name.*=|genus.*=)/,
    fields: ['name', 'genus', 'species', 'page', 'pageSize'],
  },
  {
    name: 'proteins_search',
    entityType: 'protein',
    operation: 'search',
    pattern: /Protein.*(?:CONTAINS|description.*=)/,
    fields: ['description', 'page', 'pageSize'],
  },
  {
    name: 'strains_search',
    entityType: 'strain',
    operation: 'search',
    pattern: /Strain.*(?:CONTAINS|description.*=)/,
    fields: ['description', 'origin', 'page', 'pageSize'],
  },

  // Related entity queries
  {
    name: 'transcript_related',
    entityType: 'transcript',
    operation: 'single',
    pattern: /Transcript.*primaryIdentifier/,
    fields: ['primaryIdentifier', 'gene', 'protein'],
  },
  {
    name: 'sequence_related',
    entityType: 'sequence',
    operation: 'single',
    pattern: /Sequence\.id\s*=\s*\d+/,
    fields: ['id', 'md5checksum', 'residues', 'length'],
  },
  {
    name: 'sequence_ontology_term',
    entityType: 'sequenceOntologyTerm',
    operation: 'single',
    pattern:
      /SOTerm\.identifier\s*=\s*['"]([^'"]+)['"]|SequenceOntologyTerm\.identifier/,
    fields: ['identifier', 'name', 'description'],
  },

  // Count queries
  {
    name: 'count_query',
    entityType: 'count',
    operation: 'count',
    pattern: /jsoncount/,
    fields: [],
  },
];

export class QueryMatcher {
  private static patternCache = new Map<string, QueryPattern | null>();

  /**
   * Match a query string against pre-compiled patterns
   * Uses caching for repeated queries
   */
  static matchQuery(query: string): QueryPattern | null {
    // Check cache first
    const cacheKey = query.substring(0, 200); // Cache on first 200 chars
    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey) || null;
    }

    // Find matching pattern
    for (const pattern of queryPatterns) {
      if (pattern.pattern.test(query)) {
        this.patternCache.set(cacheKey, pattern);
        return pattern;
      }
    }

    // Cache miss result
    this.patternCache.set(cacheKey, null);
    return null;
  }

  /**
   * Extract parameter values from query using the matched pattern
   */
  static extractParameters(
    query: string,
    pattern: QueryPattern,
  ): Record<string, any> {
    const match = query.match(pattern.pattern);
    const params: Record<string, any> = {};

    if (match) {
      // Extract primary identifier or value from regex groups
      if (match[1]) {
        params.identifier = match[1];
      }
    }

    return params;
  }

  /**
   * Get cache statistics for monitoring performance
   */
  static getCacheStats() {
    return {
      size: this.patternCache.size,
      hitRate: this.patternCache.size > 0 ? 1.0 : 0.0, // Simplified for demo
    };
  }

  /**
   * Clear pattern cache (useful for tests)
   */
  static clearCache() {
    this.patternCache.clear();
  }
}

/**
 * Parse URL parameters from InterMine request
 */
export function parseIntermineParams(body: string) {
  const params = new URLSearchParams(body);
  return {
    query: params.get('query') || '',
    format: params.get('format') || 'json',
    start: parseInt(params.get('start') || '0'),
    size: parseInt(params.get('size') || '10'),
    page:
      Math.floor(
        parseInt(params.get('start') || '0') /
          parseInt(params.get('size') || '10'),
      ) + 1,
    pageSize: parseInt(params.get('size') || '10'),
  };
}
