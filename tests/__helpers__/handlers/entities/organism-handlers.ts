import {http, HttpResponse} from 'msw';
import {
  entityFactories,
  toIntermineArrayFormat,
  createMultipleEntities,
} from '../../factories/biological-entity-factory.js';
import {QueryMatcher, parseIntermineParams} from '../query-matcher.js';

/**
 * Organism-specific MSW handlers
 * Purpose: Mock all organism-related GraphQL operations
 * Biological context: Organisms represent species/taxonomic units that contain all biological entities
 */

export const organismHandlers = [
  // Single organism query by taxonId
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'organism_by_taxonId') {
      console.log('MSW: Handling single organism query');

      // Extract taxonId from query
      const taxonMatch = params.query.match(/taxonId\s*=\s*['"]?(\d+)['"]?/);
      const taxonId = taxonMatch?.[1] || '3702';

      // Generate organism data based on taxonId
      const organism = entityFactories.organism({taxonId});

      return HttpResponse.json({
        results: [toIntermineArrayFormat(organism, 'organism')],
      });
    }

    return;
  }),

  // Organism search queries
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const params = parseIntermineParams(body);
    const pattern = QueryMatcher.matchQuery(params.query);

    if (pattern?.name === 'organisms_search') {
      console.log('MSW: Handling organism search query');

      // Create multiple model organisms
      const organisms = [
        entityFactories.organism({taxonId: '3702'}), // Arabidopsis
        entityFactories.organism({taxonId: '3847'}), // Soybean
        entityFactories.organism({taxonId: '3880'}), // Medicago
        entityFactories.organism({taxonId: '4081'}), // Potato
      ];

      return HttpResponse.json({
        results: organisms.map((organism) =>
          toIntermineArrayFormat(organism, 'organism'),
        ),
      });
    }

    return;
  }),
];

/**
 * Organism relationship handlers
 * Purpose: Handle organism → genes, organism → strains relationships
 */
export const organismRelationshipHandlers = [
  // Organism genes relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Organism') && query.includes('genes')) {
      console.log('MSW: Handling organism-genes relationship');

      // Create genes belonging to the organism
      const genes = createMultipleEntities('gene', 5, {
        baseOverrides: {taxonId: '3702'}, // All genes from same organism
        variations: [
          {identifier: 'AT1G01010', symbol: 'NAC001'},
          {identifier: 'AT1G01020', symbol: 'ARV1'},
          {identifier: 'AT2G01010', symbol: 'KIN1'},
          {identifier: 'AT3G01010', symbol: 'DEF1'},
          {identifier: 'AT4G01010', symbol: 'ABC1'},
        ],
      });

      return HttpResponse.json({
        results: genes.map((gene) => toIntermineArrayFormat(gene, 'gene')),
      });
    }

    return;
  }),

  // Organism strains relationship
  http.post('*/query/results', async ({request}) => {
    const body = await request.text();
    const {query} = parseIntermineParams(body);

    if (query.includes('Organism') && query.includes('strains')) {
      console.log('MSW: Handling organism-strains relationship');

      const strains = [
        entityFactories.strain({
          identifier: 'Col-0',
          name: 'Columbia-0',
          description: 'Reference strain',
        }),
        entityFactories.strain({
          identifier: 'Ler-0',
          name: 'Landsberg erecta',
          description: 'Natural variant',
        }),
        entityFactories.strain({
          identifier: 'Ws-0',
          name: 'Wassilewskija',
          description: 'Natural variant',
        }),
      ];

      return HttpResponse.json({
        results: strains.map((strain) => [
          strain.identifier,
          strain.name,
          strain.description,
          strain.origin,
        ]),
      });
    }

    return;
  }),
];

/**
 * Organism test scenario utilities
 * Purpose: Provide standardized organism testing patterns
 */
export const createOrganismTestScenario = (
  scenario: 'single' | 'multi_species' | 'with_genes',
) => {
  switch (scenario) {
    case 'single':
      return {
        taxonId: '3702',
        expectedFields: ['taxonId', 'name', 'genus', 'species'],
        biologicalContext:
          'Single organism lookup - validates basic taxonomic data retrieval',
        expectedGenus: 'Arabidopsis',
        expectedSpecies: 'thaliana',
      };

    case 'multi_species':
      return {
        searchTerm: 'legume',
        expectedCount: 4,
        expectedFields: ['taxonId', 'name', 'genus', 'species', 'abbreviation'],
        biologicalContext:
          'Multi-organism search - tests cross-species query functionality',
        expectedGenera: ['Arabidopsis', 'Glycine', 'Medicago', 'Solanum'],
      };

    case 'with_genes':
      return {
        taxonId: '3702',
        expectedRelationships: ['genes', 'strains'],
        biologicalContext:
          'Organism with related entities - tests complex organism-centric queries',
        expectedGeneCount: 5,
        expectedStrainCount: 3,
      };

    default:
      throw new Error(`Unknown organism test scenario: ${scenario}`);
  }
};
