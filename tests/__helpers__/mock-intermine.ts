import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

// Mock biological data responses matching InterMine format
const mockGeneResponse = {
  results: [
    [
      1, // id
      'AT1G01010', // primaryIdentifier
      'NAC domain containing protein 1', // description
      'NAC001', // symbol
      'NAC domain containing protein 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      2268, // length
      'SO:0000704', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
      'NAC domain protein', // briefDescription
      'AT1G01010', // ensemblName
    ],
  ],
};

const mockGenesSearchResponse = {
  results: [
    [
      1, // id
      'AT1G01010', // primaryIdentifier
      'NAC domain containing protein 1', // description
      'NAC001', // symbol
      'NAC domain containing protein 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      2268, // length
      'SO:0000704', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
      'NAC domain protein', // briefDescription
      'AT1G01010', // ensemblName
    ],
    [
      2, // id
      'AT1G01020', // primaryIdentifier
      'ARV1 family protein', // description
      'ARV1', // symbol
      'ARV1 family protein', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01020', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      1560, // length
      'SO:0000704', // sequenceOntologyTerm.identifier
      2, // chromosomeLocation.id
      null, // supercontigLocation.id
      2, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
      'ARV1 protein', // briefDescription
      'AT1G01020', // ensemblName
    ],
    [
      3, // id
      'AT1G01030', // primaryIdentifier
      'hypothetical protein', // description
      'HYP', // symbol
      'hypothetical protein', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01030', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      900, // length
      'SO:0000704', // sequenceOntologyTerm.identifier
      3, // chromosomeLocation.id
      null, // supercontigLocation.id
      3, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
      'Unknown function', // briefDescription
      'AT1G01030', // ensemblName
    ],
  ],
};

const mockOrganismResponse = {
  results: [
    [
      1, // id
      '3702', // taxonId
      'ARATH', // abbreviation
      'Arabidopsis thaliana', // name
      'Arabidopsis thaliana', // commonName
      'A.thaliana', // shortName
      'Model plant organism', // description
      'Arabidopsis', // genus
      'thaliana', // species
    ],
  ],
};

const mockOrganismsSearchResponse = {
  results: [
    [
      1, // id
      '3702', // taxonId
      'ARATH', // abbreviation
      'Arabidopsis thaliana', // name
      'Arabidopsis thaliana', // commonName
      'A.thaliana', // shortName
      'Model plant organism', // description
      'Arabidopsis', // genus
      'thaliana', // species
    ],
    [
      2, // id
      '3847', // taxonId
      'GLYCM', // abbreviation
      'Glycine max', // name
      'Glycine max', // commonName
      'G.max', // shortName
      'Soybean', // description
      'Glycine', // genus
      'max', // species
    ],
    [
      3, // id
      '3880', // taxonId
      'MEDTR', // abbreviation
      'Medicago truncatula', // name
      'Medicago truncatula', // commonName
      'M.truncatula', // shortName
      'Barrel medic', // description
      'Medicago', // genus
      'truncatula', // species
    ],
  ],
};

const mockProteinResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1', // primaryIdentifier
      'NAC domain containing protein 1', // description
      'NAC001', // symbol
      'NAC domain containing protein 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      'abcd1234efgh5678', // md5checksum
      'AT1G01010.1', // primaryAccession
      39654, // molecularWeight
      356, // length
      true, // isPrimary
      'phylo1', // phylonode.identifier
      'AT1G01010.1', // transcript.primaryIdentifier
      1, // sequence.id
    ],
  ],
};

const mockProteinsSearchResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1', // primaryIdentifier
      'NAC domain containing protein 1', // description
      'NAC001', // symbol
      'NAC domain containing protein 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      'abcd1234efgh5678', // md5checksum
      'AT1G01010.1', // primaryAccession
      39654, // molecularWeight
      356, // length
      true, // isPrimary
      'phylo1', // phylonode.identifier
      'AT1G01010.1', // transcript.primaryIdentifier
      1, // sequence.id
    ],
    [
      2, // id
      'AT1G01020.1', // primaryIdentifier
      'ARV1 family protein', // description
      'ARV1', // symbol
      'ARV1 family protein', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01020.1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      'efgh5678ijkl9012', // md5checksum
      'AT1G01020.1', // primaryAccession
      21876, // molecularWeight
      197, // length
      true, // isPrimary
      'phylo2', // phylonode.identifier
      'AT1G01020.1', // transcript.primaryIdentifier
      2, // sequence.id
    ],
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
    http.post('*/query/results', async ({request}) => {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const format = params.get('format') || 'json';

      // Handle count queries
      if (format === 'jsoncount') {
        return HttpResponse.json({count: 0});
      }

      // Handle regular queries
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
