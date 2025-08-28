import {http, HttpResponse} from 'msw';
import {
  entityFactories,
  toIntermineArrayFormat,
  createMultipleEntities,
} from '../../factories/biological-entity-factory.js';
import {QueryMatcher, parseIntermineParams} from '../query-matcher.js';

/**
 * Protein-specific MSW handlers
 * Purpose: Mock all protein-related GraphQL operations
 * Biological context: Proteins are gene products that carry out cellular functions
 */

export const proteinHandlers = [
  // Single protein query by identifier
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'protein_by_identifier') {
      console.log('MSW: Handling single protein query');

      // Extract identifier from query
      const identifierMatch = params.query.match(/['"]([^'"]+)['"]/);
      const identifier = identifierMatch?.[1] || 'AT1G01010.1';

      // Generate realistic protein data
      const protein = entityFactories.protein({
        identifier,
        description: 'NAC domain containing protein 1',
        symbol: 'NAC001',
        isPrimary: true,
        molecularWeight: 39654,
        length: 356,
      });

      return HttpResponse.json({
        results: [toIntermineArrayFormat(protein, 'protein')],
      });
    }

    return;
  }),

  // Protein search queries with size variations
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'proteins_search') {
      console.log('MSW: Handling protein search query');

      // Create proteins with realistic size variations
      const proteins = [
        // Small protein/peptide
        entityFactories.protein({
          identifier: 'TINY_PROT.1',
          description: 'Small signaling peptide',
          symbol: 'TINY',
          length: 50,
          molecularWeight: 5500,
          isPrimary: true,
        }),
        // Average protein
        entityFactories.protein({
          identifier: 'AT1G01010.1',
          description: 'NAC domain containing protein',
          symbol: 'NAC001',
          length: 356,
          molecularWeight: 39654,
          isPrimary: true,
        }),
        // Large protein
        entityFactories.protein({
          identifier: 'LARGE_PROT.1',
          description: 'Multi-domain enzyme complex',
          symbol: 'LARGE',
          length: 2500,
          molecularWeight: 275000,
          isPrimary: true,
        }),
      ];

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
 * Protein relationship handlers
 * Purpose: Handle protein → gene, protein → domains, protein → pathways relationships
 */
export const proteinRelationshipHandlers = [
  // Protein gene relationship (reverse of gene → protein)
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Protein') && query.includes('gene')) {
      console.log('MSW: Handling protein-gene relationship');

      const gene = entityFactories.gene({
        identifier: 'AT1G01010',
        symbol: 'NAC001',
        description: 'Parent gene of protein',
      });

      return HttpResponse.json({
        results: [toIntermineArrayFormat(gene, 'gene')],
      });
    }

    return;
  }),

  // Protein domains relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Protein') && query.includes('domains')) {
      console.log('MSW: Handling protein-domains relationship');

      // Mock protein domains
      const domains = [
        {
          identifier: 'PF02365',
          name: 'NAC domain',
          description: 'Plant transcription factor domain',
          start: 45,
          end: 178,
          database: 'Pfam',
        },
        {
          identifier: 'PF12345',
          name: 'DNA-binding domain',
          description: 'Sequence-specific DNA binding',
          start: 200,
          end: 280,
          database: 'Pfam',
        },
      ];

      return HttpResponse.json({
        results: domains.map((domain) => [
          domain.identifier,
          domain.name,
          domain.description,
          domain.start,
          domain.end,
          domain.database,
        ]),
      });
    }

    return;
  }),

  // Protein isoforms relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Protein') && query.includes('isoform')) {
      console.log('MSW: Handling protein isoforms relationship');

      // Create multiple isoforms of same gene
      const isoforms = [
        entityFactories.protein({
          identifier: 'AT1G01010.1',
          isPrimary: true,
          description: 'Primary isoform',
          length: 356,
        }),
        entityFactories.protein({
          identifier: 'AT1G01010.2',
          isPrimary: false,
          description: 'Alternative isoform',
          length: 298,
        }),
        entityFactories.protein({
          identifier: 'AT1G01010.3',
          isPrimary: false,
          description: 'Short isoform',
          length: 201,
        }),
      ];

      return HttpResponse.json({
        results: isoforms.map((protein) =>
          toIntermineArrayFormat(protein, 'protein'),
        ),
      });
    }

    return;
  }),
];

/**
 * Protein test scenario utilities
 * Purpose: Provide standardized protein testing patterns with biological significance
 */
export const createProteinTestScenario = (
  scenario: 'single' | 'size_variations' | 'with_domains' | 'isoforms',
) => {
  switch (scenario) {
    case 'single':
      return {
        identifier: 'AT1G01010.1',
        expectedFields: [
          'identifier',
          'length',
          'molecularWeight',
          'isPrimary',
        ],
        biologicalContext:
          'Single protein lookup - validates basic protein properties and structure',
        expectedLength: 356,
        expectedMW: 39654,
        expectedIsPrimary: true,
      };

    case 'size_variations':
      return {
        searchTerm: 'protein',
        expectedCount: 3,
        expectedFields: ['identifier', 'length', 'molecularWeight'],
        biologicalContext:
          'Protein size diversity - tests handling of small peptides to large enzyme complexes',
        expectedSizeRange: {min: 50, max: 2500},
        expectedMWRange: {min: 5500, max: 275000},
      };

    case 'with_domains':
      return {
        identifier: 'AT1G01010.1',
        expectedRelationships: ['gene', 'domains'],
        biologicalContext:
          'Protein with functional domains - tests protein structure annotations',
        expectedDomainCount: 2,
        expectedDomains: ['NAC domain', 'DNA-binding domain'],
      };

    case 'isoforms':
      return {
        geneIdentifier: 'AT1G01010',
        expectedRelationships: ['isoforms'],
        biologicalContext:
          'Protein isoforms - tests alternative splicing representation',
        expectedIsoformCount: 3,
        expectedPrimaryCount: 1,
        expectedAlternativeCount: 2,
      };

    default:
      throw new Error(`Unknown protein test scenario: ${scenario}`);
  }
};
