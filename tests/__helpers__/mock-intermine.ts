import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

// Mock biological data responses matching InterMine format
const mockGeneResponse = {
  results: [
    [
      'gene1',
      'AT1G01010',
      'NAC domain containing protein 1',
      'Arabidopsis thaliana',
      'TAIR10',
      '1',
      '3631',
      '5899',
    ],
  ],
};

const mockGenesSearchResponse = {
  results: [
    [
      'gene1',
      'AT1G01010',
      'NAC domain containing protein 1',
      'Arabidopsis thaliana',
    ],
    ['gene2', 'AT1G01020', 'ARV1 family protein', 'Arabidopsis thaliana'],
    ['gene3', 'AT1G01030', 'hypothetical protein', 'Arabidopsis thaliana'],
  ],
};

const mockOrganismResponse = {
  results: [
    ['3702', 'Arabidopsis thaliana', 'Arabidopsis', 'thaliana', 'ARATH'],
  ],
};

const mockOrganismsSearchResponse = {
  results: [
    ['3702', 'Arabidopsis thaliana', 'Arabidopsis', 'thaliana', 'ARATH'],
    ['3847', 'Glycine max', 'Glycine', 'max', 'GLYCM'],
    ['3880', 'Medicago truncatula', 'Medicago', 'truncatula', 'MEDTR'],
  ],
};

const mockProteinResponse = {
  results: [
    [
      'protein1',
      'AT1G01010.1',
      'NAC domain containing protein 1',
      '356',
      'MTSSLL...',
    ],
  ],
};

const mockProteinsSearchResponse = {
  results: [
    ['protein1', 'AT1G01010.1', 'NAC domain containing protein 1', '356'],
    ['protein2', 'AT1G01020.1', 'ARV1 family protein', '197'],
    ['protein3', 'Glyma.01G000100.1', 'hypothetical protein', '234'],
  ],
};

const mockStrainResponse = {
  results: [
    [
      'Col-0',
      'Columbia-0',
      'Reference strain for Arabidopsis thaliana',
      'Laboratory collection',
    ],
  ],
};

const mockStrainsSearchResponse = {
  results: [
    ['Col-0', 'Columbia-0', 'Reference strain', 'Laboratory'],
    ['Ler-0', 'Landsberg erecta', 'Natural variant', 'Wild collection'],
    ['Ws-0', 'Wassilewskija', 'Natural variant', 'Wild collection'],
  ],
};

const mockPublicationResponse = {
  results: [
    [
      '10.1038/nature01140',
      'Analysis of the genome sequence of Arabidopsis thaliana',
      '2000',
    ],
  ],
};

const mockLinkoutResponse = {
  results: [
    {
      identifier: 'AT1G01010_TAIR',
      url: 'https://www.arabidopsis.org/servlets/TairObject?type=locus&name=AT1G01010',
      text: 'View at TAIR',
      description: 'TAIR locus page for AT1G01010',
    },
  ],
};

const mockCountResponse = {
  count: 42,
};

const mockPageInfo = {
  currentPage: 1,
  pageSize: 10,
  pageCount: 5,
  numResults: 42,
  hasNextPage: true,
  hasPreviousPage: false,
};

const mockWebPropertiesResponse = {
  'project.title': 'Test Mine',
  'project.version': '1.0.0',
  'project.releaseVersion': 'test-release',
};

// MSW request handlers for InterMine API
export const handlers = [
  // PathQuery POST endpoint for all biological data queries
  http.post('*/query/results', async ({request}) => {
    console.log('MSW intercepted POST to:', request.url);
    console.log('MSW request method:', request.method);
    const body = await request.text();
    const params = new URLSearchParams(body);
    const query = params.get('query') || '';
    const format = params.get('format') || 'json';
    const page = params.get('start')
      ? Math.floor(
          parseInt(params.get('start')!) / parseInt(params.get('size') || '10'),
        ) + 1
      : 1;
    const pageSize = parseInt(params.get('size') || '10');

    console.log('Mock InterMine Request:', {
      query: query.substring(0, 100),
      format,
      page,
      pageSize,
    });

    // Handle count queries
    if (format === 'jsoncount') {
      return HttpResponse.json(mockCountResponse);
    }

    // Handle specific entity queries by identifier
    if (query.includes('Gene.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockGeneResponse);
    }

    if (query.includes('Organism.taxonId') && query.includes('=')) {
      return HttpResponse.json(mockOrganismResponse);
    }

    if (query.includes('Protein.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockProteinResponse);
    }

    if (query.includes('Strain.identifier') && query.includes('=')) {
      return HttpResponse.json(mockStrainResponse);
    }

    if (query.includes('Publication.doi') && query.includes('=')) {
      return HttpResponse.json(mockPublicationResponse);
    }

    // Handle search queries
    if (
      query.includes('Gene') &&
      (query.includes('CONTAINS') || query.includes('description'))
    ) {
      return HttpResponse.json(mockGenesSearchResponse);
    }

    if (
      query.includes('Organism') &&
      (query.includes('CONTAINS') ||
        query.includes('name') ||
        query.includes('genus'))
    ) {
      return HttpResponse.json(mockOrganismsSearchResponse);
    }

    if (
      query.includes('Protein') &&
      (query.includes('CONTAINS') || query.includes('description'))
    ) {
      return HttpResponse.json(mockProteinsSearchResponse);
    }

    if (
      query.includes('Strain') &&
      (query.includes('CONTAINS') || query.includes('description'))
    ) {
      return HttpResponse.json(mockStrainsSearchResponse);
    }

    // Default empty response
    return HttpResponse.json({results: []});
  }),

  // Web properties endpoint
  http.get('*/web-properties', () => {
    console.log('MSW intercepted GET web-properties');
    return HttpResponse.json(mockWebPropertiesResponse);
  }),

  // Keyword search endpoint
  http.get('*/search', ({request}) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (q?.includes('kinase')) {
      return HttpResponse.json(mockGenesSearchResponse);
    }

    if (q?.includes('arabidopsis')) {
      return HttpResponse.json(mockOrganismsSearchResponse);
    }

    return HttpResponse.json({results: []});
  }),

  // Microservices endpoints for linkouts
  http.get('*/linkouts/gene/*', () => {
    console.log('MSW intercepted GET linkouts/gene');
    return HttpResponse.json(mockLinkoutResponse);
  }),

  http.get('*/linkouts/location/*', () => {
    console.log('MSW intercepted GET linkouts/location');
    return HttpResponse.json(mockLinkoutResponse);
  }),

  // Debug catch-all handler
  http.all('*', ({request}) => {
    console.log(
      'MSW CATCH-ALL - Unhandled request:',
      request.method,
      request.url,
    );
    // Don't return anything to let other handlers try first
  }),
];

// Create MSW server instance
export const server = setupServer(...handlers);

// Utility functions for test-specific mocking
export const mockEmptyResponse = () => {
  server.use(
    http.post('*/query/results', () => {
      return HttpResponse.json({results: []});
    }),
  );
};

export const mockErrorResponse = (status = 500) => {
  server.use(
    http.post('*/query/results', () => {
      return HttpResponse.json({error: 'Internal server error'}, {status});
    }),
  );
};

export const mockTimeoutResponse = (delay = 10000) => {
  server.use(
    http.post('*/query/results', async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return HttpResponse.json(mockGeneResponse);
    }),
  );
};
