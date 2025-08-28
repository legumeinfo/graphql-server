/**
 * DEPRECATED: This file has been replaced by modular handler architecture
 * New architecture location: tests/__helpers__/handlers/
 *
 * For new tests, import from: tests/__helpers__/handlers/index.js
 * This file is preserved for backward compatibility with existing tests
 */

import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {
  server as newServer,
  allHandlers,
  mockEmptyResponse as newMockEmptyResponse,
  mockErrorResponse as newMockErrorResponse,
  mockTimeoutResponse as newMockTimeoutResponse,
} from './handlers/index.js';

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
      'Col-0',
      'Reference strain for Arabidopsis thaliana',
      'Laboratory collection',
    ],
  ],
};

const mockStrainsSearchResponse = {
  results: [
    ['Col-0', 'Col-0', 'Reference strain', 'Laboratory'],
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

// CDS Response (SequenceFeature + transcriptIdentifier + isPrimary)
const mockCDSResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1.cds', // primaryIdentifier
      'Coding sequence for NAC domain protein', // description
      'NAC001_CDS', // symbol
      'NAC domain protein CDS', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1.cds', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      1068, // length
      'SO:0000316', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
      'AT1G01010.1', // transcript.primaryIdentifier
      true, // isPrimary
    ],
  ],
};

// Chromosome Response (SequenceFeature only)
const mockChromosomeResponse = {
  results: [
    [
      1, // id
      '1', // primaryIdentifier
      'Chromosome 1', // description
      '1', // symbol
      'Chromosome 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      '1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      30427671, // length
      'SO:0000340', // sequenceOntologyTerm.identifier
      null, // chromosomeLocation.id (self-referential, so null)
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
    ],
  ],
};

// Exon Response (SequenceFeature only)
const mockExonResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1.exon1', // primaryIdentifier
      'First exon of AT1G01010.1', // description
      'AT1G01010.1.exon1', // symbol
      'Exon 1', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1.exon1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      438, // length
      'SO:0000147', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
    ],
  ],
};

// mRNA Response (SequenceFeature only)
const mockMRNAResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1', // primaryIdentifier
      'mRNA for NAC domain protein', // description
      'AT1G01010.1', // symbol
      'AT1G01010.1 mRNA', // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      1334, // length
      'SO:0000234', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
    ],
  ],
};

// UTR Response (SequenceFeature only)
const mockUTRResponse = {
  results: [
    [
      1, // id
      'AT1G01010.1.utr', // primaryIdentifier
      "5' UTR of AT1G01010.1", // description
      'AT1G01010.1.5UTR', // symbol
      "5' UTR", // name
      'TAIR10', // assemblyVersion
      'v1.0', // annotationVersion
      'AT1G01010.1.utr', // secondaryIdentifier
      3702, // organism.taxonId
      'Col-0', // strain.identifier
      0.0, // score
      'none', // scoreType
      266, // length
      'SO:0000204', // sequenceOntologyTerm.identifier
      1, // chromosomeLocation.id
      null, // supercontigLocation.id
      1, // sequence.id
      '1', // chromosome.primaryIdentifier
      null, // supercontig.primaryIdentifier
    ],
  ],
};

// GeneFamily Response (Annotatable + name)
const mockGeneFamilyResponse = {
  results: [
    [
      1, // id
      'GF001', // primaryIdentifier
      'NAC transcription factor family', // name
    ],
  ],
};

// PanGeneSet Response (Annotatable + name)
const mockPanGeneSetResponse = {
  results: [
    [
      1, // id
      'PGS001', // primaryIdentifier
      'Plant transcription factor pan-gene set', // name
    ],
  ],
};

// Pathway Response (Annotatable + name)
const mockPathwayResponse = {
  results: [
    [
      1, // id
      'PWY001', // primaryIdentifier
      'Plant hormone signal transduction', // name
    ],
  ],
};

// Phylotree Response (Annotatable + numLeaves + geneFamilyIdentifier)
const mockPhylotreeResponse = {
  results: [
    [
      1, // id
      'TREE001', // primaryIdentifier
      15, // numLeaves
      'GF001', // geneFamily.primaryIdentifier
    ],
  ],
};

// QTL Response (Annotatable + 12 additional fields)
const mockQTLResponse = {
  results: [
    [
      1, // id
      'QTL001', // primaryIdentifier
      'Height QTL on Chr1', // name
      3.2, // lod
      8.5, // likelihoodRatio
      1250000, // end
      0.15, // markerR2
      1100000, // start
      1175000, // peak
      'TRAIT001', // trait.primaryIdentifier
      'QTLS001', // qtlStudy.primaryIdentifier
      'LG1', // linkageGroup.primaryIdentifier
      'Height_Study_Dataset', // dataSets.name
      'Plant Height', // trait.name
      'M1,M2,M3', // markerNames
    ],
  ],
};

// QTLStudy Response (Annotatable + description + genotypes + synopsis + organism.taxonId)
const mockQTLStudyResponse = {
  results: [
    [
      1, // id
      'QTLS001', // primaryIdentifier
      'Plant height QTL mapping study in Arabidopsis', // description
      'RIL population from Col-0 x Ler-0', // genotypes
      'Comprehensive QTL mapping for plant height traits', // synopsis
      3702, // organism.taxonId
    ],
  ],
};

// Trait Response (Annotatable + description + name + dataSets.name + organism.taxonId + gwas.primaryIdentifier)
const mockTraitResponse = {
  results: [
    [
      1, // id
      'TRAIT001', // primaryIdentifier
      'Quantitative measurement of plant height', // description
      'Plant Height', // name
      'Height_Study_Dataset', // dataSets.name
      '3702', // organism.taxonId (note: string in trait model)
      'GWAS001', // gwas.primaryIdentifier
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

const _mockPageInfo = {
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

// Mock responses for related entities that are needed for relationship resolution
const mockTranscriptResponse = {
  results: [
    {
      id: 1,
      primaryIdentifier: 'AT1G01010.1',
      description: 'NAC001 transcript',
      symbol: 'NAC001',
      name: 'NAC001 transcript',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01010.1',
      organism: {taxonId: '3702'},
      strain: {identifier: 'Col-0'},
      score: 0.0,
      scoreType: 'none',
      length: 1068,
      sequenceOntologyTerm: {identifier: 'SO:0000673'},
      chromosomeLocation: {objectId: 1},
      supercontigLocation: null,
      sequence: {objectId: 1},
      chromosome: {primaryIdentifier: '1'},
      supercontig: null,
      gene: {primaryIdentifier: 'AT1G01010'},
      protein: {primaryIdentifier: 'AT1G01010.1'},
    },
  ],
};

const mockSequenceResponse = {
  results: [
    [
      1, // id
      'abcd1234efgh5678', // md5checksum
      'ATGCGTAACGTACGTACGT...', // residues (truncated)
      1068, // length
    ],
  ],
};

const mockSequenceOntologyTermResponse = {
  results: [
    [
      1, // id
      'SO:0000704', // identifier
      'gene', // name
      'A region (or regions) that includes all of the sequence elements necessary to encode a functional transcript.', // description
    ],
  ],
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

    // Handle related entity queries needed for relationship resolution
    if (query.includes('Transcript') && query.includes('primaryIdentifier')) {
      console.log(
        'Matching Transcript query, returning:',
        mockTranscriptResponse,
      );
      return HttpResponse.json(mockTranscriptResponse);
    }

    if (query.includes('Sequence.id') && query.includes('=')) {
      console.log('Matching Sequence query, returning:', mockSequenceResponse);
      return HttpResponse.json(mockSequenceResponse);
    }

    if (query.includes('SOTerm.identifier') && query.includes('=')) {
      console.log(
        'Matching SOTerm query, returning:',
        mockSequenceOntologyTermResponse,
      );
      return HttpResponse.json(mockSequenceOntologyTermResponse);
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

    if (query.includes('CDS.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockCDSResponse);
    }

    if (query.includes('Chromosome.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockChromosomeResponse);
    }

    if (query.includes('Exon.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockExonResponse);
    }

    if (query.includes('MRNA.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockMRNAResponse);
    }

    if (query.includes('UTR.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockUTRResponse);
    }

    if (query.includes('GeneFamily.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockGeneFamilyResponse);
    }

    if (query.includes('PanGeneSet.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockPanGeneSetResponse);
    }

    if (query.includes('Pathway.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockPathwayResponse);
    }

    if (query.includes('Phylotree.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockPhylotreeResponse);
    }

    if (query.includes('QTL.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockQTLResponse);
    }

    if (query.includes('QTLStudy.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockQTLStudyResponse);
    }

    if (query.includes('Trait.primaryIdentifier') && query.includes('=')) {
      return HttpResponse.json(mockTraitResponse);
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

// DEPRECATED: Use new modular handlers instead
// Create MSW server instance (preserved for backward compatibility)
export const server = newServer;

// Re-export new handlers for migration
export {allHandlers};

// DEPRECATED: Use new modular utilities instead
// Utility functions for test-specific mocking (preserved for backward compatibility)
export const mockEmptyResponse = newMockEmptyResponse;
export const mockErrorResponse = newMockErrorResponse;
export const mockTimeoutResponse = newMockTimeoutResponse;
