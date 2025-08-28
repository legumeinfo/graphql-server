import {http, HttpResponse} from 'msw';
import {
  entityFactories,
  toIntermineArrayFormat,
  createMultipleEntities,
} from '../../factories/biological-entity-factory.js';
import {QueryMatcher, parseIntermineParams} from '../query-matcher.js';

/**
 * Gene-specific MSW handlers
 * Purpose: Mock all gene-related GraphQL operations including single queries, searches, and relationships
 * Biological context: Genes are the fundamental units of heredity, connecting to proteins, organisms, and pathways
 */

export const geneHandlers = [
  // Single gene query by identifier
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'gene_by_identifier') {
      console.log('MSW: Handling single gene query');

      // Extract identifier from query
      const identifierMatch = params.query.match(/['"]([^'"]+)['"]/);
      const identifier = identifierMatch?.[1] || 'AT1G01010';

      // Generate realistic gene data
      const gene = entityFactories.gene({
        identifier,
        description: 'NAC domain containing protein 1',
        symbol: 'NAC001',
        briefDescription: 'Transcription factor involved in development',
      });

      return HttpResponse.json({
        results: [toIntermineArrayFormat(gene, 'gene')],
      });
    }

    // Let other handlers process non-gene queries
    return;
  }),

  // Gene search queries
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'genes_search') {
      console.log('MSW: Handling gene search query');

      // Create multiple genes with variations
      const genes = createMultipleEntities('gene', 3, {
        variations: [
          {
            identifier: 'AT1G01010',
            description: 'NAC domain containing protein 1',
            symbol: 'NAC001',
            briefDescription: 'Transcription factor',
          },
          {
            identifier: 'AT1G01020',
            description: 'ARV1 family protein',
            symbol: 'ARV1',
            briefDescription: 'Membrane protein',
          },
          {
            identifier: 'AT1G01030',
            description: 'Hypothetical protein',
            symbol: 'HYP',
            briefDescription: 'Unknown function',
          },
        ],
      });

      return HttpResponse.json({
        results: genes.map((gene) => toIntermineArrayFormat(gene, 'gene')),
      });
    }

    return;
  }),
];

/**
 * Gene relationship handlers for complex nested queries
 * Purpose: Handle gene → organism, gene → protein, gene → pathway relationships
 */
export const geneRelationshipHandlers = [
  // Gene organism relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Gene') && query.includes('organism')) {
      console.log('MSW: Handling gene-organism relationship');

      const organism = entityFactories.organism({
        taxonId: '3702',
        genus: 'Arabidopsis',
        species: 'thaliana',
      });

      return HttpResponse.json({
        results: [toIntermineArrayFormat(organism, 'organism')],
      });
    }

    return;
  }),

  // Gene protein relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Gene') && query.includes('protein')) {
      console.log('MSW: Handling gene-protein relationship');

      const proteins = createMultipleEntities('protein', 2, {
        variations: [
          {
            identifier: 'AT1G01010.1',
            isPrimary: true,
            description: 'Primary protein isoform',
          },
          {
            identifier: 'AT1G01010.2',
            isPrimary: false,
            description: 'Alternative protein isoform',
          },
        ],
      });

      return HttpResponse.json({
        results: proteins.map((protein) =>
          toIntermineArrayFormat(protein, 'protein'),
        ),
      });
    }

    return;
  }),
];

/**
 * Utility function to create gene test scenarios
 * Purpose: Provide common gene testing patterns for reuse across tests
 */
export const createGeneTestScenario = (
  scenario: 'single' | 'search' | 'with_relationships',
) => {
  switch (scenario) {
    case 'single':
      return {
        identifier: 'AT1G01010',
        expectedFields: ['identifier', 'symbol', 'description', 'organism'],
        biologicalContext:
          'Single gene lookup - tests basic gene retrieval functionality',
      };

    case 'search':
      return {
        searchTerm: 'kinase',
        expectedCount: 3,
        expectedFields: ['identifier', 'symbol', 'description'],
        biologicalContext:
          'Gene search - tests query functionality for finding genes by description',
      };

    case 'with_relationships':
      return {
        identifier: 'AT1G01010',
        expectedRelationships: ['organism', 'proteins', 'pathways'],
        biologicalContext:
          'Gene with relationships - tests complex nested GraphQL queries',
      };

    default:
      throw new Error(`Unknown gene test scenario: ${scenario}`);
  }
};
