import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {
  geneHandlers,
  geneRelationshipHandlers,
} from './entities/gene-handlers.js';
import {
  organismHandlers,
  organismRelationshipHandlers,
} from './entities/organism-handlers.js';
import {
  proteinHandlers,
  proteinRelationshipHandlers,
} from './entities/protein-handlers.js';
import {parseIntermineParams} from './query-matcher.js';

/**
 * Consolidated MSW handlers with modular architecture
 * Purpose: Replace monolithic handler with organized, maintainable structure
 */

// Search and utility handlers
const searchHandlers = [
  // Keyword search endpoint
  http.get('*/search', ({request}) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    console.log('MSW: Handling keyword search for:', q);

    // Simple keyword-based routing
    if (q?.toLowerCase().includes('kinase')) {
      return HttpResponse.json({
        results: [
          ['AT1G01010', 'NAC001', 'NAC domain kinase-like protein'],
          ['AT2G01020', 'KIN1', 'Serine/threonine kinase'],
          ['AT3G01030', 'PKC1', 'Protein kinase C-like protein'],
        ],
      });
    }

    if (q?.toLowerCase().includes('arabidopsis')) {
      return HttpResponse.json({
        results: [
          ['3702', 'ARATH', 'Arabidopsis thaliana'],
          ['3703', 'ARATL', 'Arabidopsis lyrata'],
        ],
      });
    }

    return HttpResponse.json({results: []});
  }),
];

// Microservices handlers
const microservicesHandlers = [
  // Gene linkouts
  http.get('*/linkouts/gene/*', ({params}) => {
    console.log('MSW: Handling gene linkouts for:', params);

    return HttpResponse.json({
      results: [
        {
          identifier: 'TAIR_LINKOUT',
          url: 'https://www.arabidopsis.org/servlets/TairObject?type=locus&name=AT1G01010',
          text: 'View at TAIR',
          description: 'TAIR locus page',
        },
        {
          identifier: 'NCBI_LINKOUT',
          url: 'https://www.ncbi.nlm.nih.gov/gene/?term=AT1G01010',
          text: 'View at NCBI Gene',
          description: 'NCBI Gene database entry',
        },
      ],
    });
  }),

  // Location linkouts
  http.get('*/linkouts/location/*', ({params}) => {
    console.log('MSW: Handling location linkouts for:', params);

    return HttpResponse.json({
      results: [
        {
          identifier: 'GBROWSE_LINKOUT',
          url: 'https://gbrowse.arabidopsis.org/',
          text: 'View in Genome Browser',
          description: 'Genomic region visualization',
        },
      ],
    });
  }),
];

// Utility handlers
const utilityHandlers = [
  // Web properties endpoint
  http.get('*/web-properties', () => {
    console.log('MSW: Handling web-properties request');
    return HttpResponse.json({
      'project.title': 'Test Mine',
      'project.version': '1.0.0',
      'project.releaseVersion': 'test-release',
      'project.description': 'Test InterMine instance for MSW mocking',
    });
  }),

  // Count queries
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);

    if (params.format === 'jsoncount') {
      console.log('MSW: Handling count query');

      // Return realistic count based on query type
      let count = 42; // Default count

      if (params.query.includes('Gene'))
        count = 27416; // Arabidopsis gene count
      else if (params.query.includes('Protein'))
        count = 35386; // Protein count
      else if (params.query.includes('Organism'))
        count = 4; // Model organisms
      else if (params.query.includes('QTL')) count = 156; // QTL count

      return HttpResponse.json({count});
    }

    return; // Let other handlers process
  }),

  // Error simulation handlers
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    // Simulate server errors for specific test identifiers
    if (query.includes('SIMULATE_ERROR')) {
      console.log('MSW: Simulating server error');
      return HttpResponse.json(
        {
          error: 'Internal server error',
          message: 'Simulated error for testing',
        },
        {status: 500},
      );
    }

    if (query.includes('SIMULATE_TIMEOUT')) {
      console.log('MSW: Simulating timeout');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return HttpResponse.json({results: []});
    }

    return; // Let other handlers process
  }),
];

// Catch-all handler for debugging
const debugHandlers = [
  http.all('*', ({request}) => {
    // Only log unhandled requests that aren't common assets
    const url = request.url;
    if (
      !url.includes('.js') &&
      !url.includes('.css') &&
      !url.includes('.ico')
    ) {
      console.log(
        'MSW UNHANDLED - Method:',
        request.method,
        'URL:',
        url.substring(url.length - 50), // Last 50 chars
      );
    }
    // Don't return anything - let request pass through
  }),
];

// Export all handlers organized by category
export const allHandlers = [
  ...geneHandlers,
  ...geneRelationshipHandlers,
  ...organismHandlers,
  ...organismRelationshipHandlers,
  ...proteinHandlers,
  ...proteinRelationshipHandlers,
  ...searchHandlers,
  ...microservicesHandlers,
  ...utilityHandlers,
  ...debugHandlers, // Keep debug handler last
];

// Create MSW server instance
export const server = setupServer(...allHandlers);

// Utility functions for test-specific mocking (preserved from original)
export const mockEmptyResponse = () => {
  server.use(
    http.post('*/query/results', async ({request}) => {
      const body = await request.text();
      const params = parseIntermineParams(body);

      if (params.format === 'jsoncount') {
        return HttpResponse.json({count: 0});
      }

      return HttpResponse.json({results: []});
    }),
  );
};

export const mockErrorResponse = (status = 500) => {
  server.use(
    http.post('*/query/results', () => {
      return HttpResponse.json({error: 'Test error response'}, {status});
    }),
  );
};

export const mockTimeoutResponse = (delay = 10000) => {
  server.use(
    http.post('*/query/results', async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return HttpResponse.json({results: []});
    }),
  );
};

// Export individual handler groups for selective testing
export {
  geneHandlers,
  organismHandlers,
  proteinHandlers,
  searchHandlers,
  microservicesHandlers,
  utilityHandlers,
};
