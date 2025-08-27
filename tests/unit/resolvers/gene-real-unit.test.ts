import {describe, test, expect, beforeEach} from 'vitest';
import {
  geneFactory,
  hasGeneFactory,
  hasGenesFactory,
} from '../../../src/resolvers/intermine/gene.js';
import {mockGeneData, createMockGene} from '../../__helpers__/mock-data.js';

/**
 * Real Unit Tests for Gene Resolver
 * These test the actual resolver logic, not just mocked functions
 */

describe('Gene Resolver - Real Unit Tests', () => {
  let mockDataSources: any;
  let geneResolver: any;

  beforeEach(() => {
    // Create mock data sources that simulate InterMine API responses
    mockDataSources = {
      lisIntermineAPI: {
        getGene: async (identifier: string) => {
          if (identifier === 'AT1G01010') {
            return {data: mockGeneData};
          }
          if (identifier === 'NONEXISTENT') {
            return {data: null};
          }
          throw new Error('Simulated InterMine connection error');
        },
        getGenes: async (identifiers: string[]) => {
          const genes = identifiers
            .filter((id) => id.startsWith('AT'))
            .map((id, index) => createMockGene({identifier: id}));
          return {data: genes};
        },
        searchGenes: async (args: any) => {
          const {description, genus, species, page = 1, pageSize = 10} = args;

          // Simulate real search behavior
          const allResults = [
            createMockGene({
              identifier: 'AT1G01010',
              description: 'NAC domain containing protein kinase',
            }),
            createMockGene({
              identifier: 'AT1G01020',
              description: 'ARV1 family protein kinase',
            }),
            createMockGene({
              identifier: 'AT1G01030',
              description: 'protein kinase domain',
            }),
            createMockGene({
              identifier: 'AT2G01010',
              description: 'hypothetical protein',
            }),
          ];

          // Filter based on search criteria
          let filtered = allResults;
          if (description) {
            filtered = filtered.filter((g) =>
              g.description.toLowerCase().includes(description.toLowerCase()),
            );
          }

          // Simulate pagination
          const startIndex = (page - 1) * pageSize;
          const results = filtered.slice(startIndex, startIndex + pageSize);

          return {
            data: results,
            metadata: {
              pageInfo: {
                currentPage: page,
                pageSize,
                numResults: filtered.length,
                pageCount: Math.ceil(filtered.length / pageSize),
                hasNextPage: startIndex + pageSize < filtered.length,
                hasPreviousPage: page > 1,
              },
            },
          };
        },
        getGeneFlankingRegionsForGene: async (geneId: string, args: any) => {
          return {
            data: [
              {id: `${geneId}_upstream`, type: 'upstream', length: 1000},
              {id: `${geneId}_downstream`, type: 'downstream', length: 1000},
            ],
          };
        },
        getPathwaysForGene: async (geneId: string, args: any) => {
          return {
            data: [
              {identifier: 'PWY001', name: 'Photosynthesis'},
              {identifier: 'PWY002', name: 'Calvin cycle'},
            ],
          };
        },
      },
    };

    // Create the actual resolver using the factory
    geneResolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');
  });

  describe('Query.gene resolver logic', () => {
    test('successfully resolves gene and returns proper structure', async () => {
      const result = await geneResolver.Query.gene(
        {}, // parent
        {identifier: 'AT1G01010'}, // args
        {dataSources: mockDataSources}, // context
      );

      expect(result).toEqual({
        results: mockGeneData,
      });
    });

    test('throws error with proper message when gene not found', async () => {
      await expect(
        geneResolver.Query.gene(
          {},
          {identifier: 'NONEXISTENT'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Gene with identifier 'NONEXISTENT' not found");
    });

    test('propagates InterMine API errors correctly', async () => {
      await expect(
        geneResolver.Query.gene(
          {},
          {identifier: 'ERROR_CASE'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow('Simulated InterMine connection error');
    });
  });

  describe('Query.getGenes resolver logic', () => {
    test('retrieves multiple genes and filters invalid identifiers', async () => {
      const result = await geneResolver.Query.getGenes(
        {},
        {identifiers: ['AT1G01010', 'AT1G01020', 'INVALID_ID']},
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(2);
      expect(result.results[0].identifier).toBe('AT1G01010');
      expect(result.results[1].identifier).toBe('AT1G01020');
    });

    test('handles empty identifier list', async () => {
      const result = await geneResolver.Query.getGenes(
        {},
        {identifiers: []},
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(0);
    });
  });

  describe('Query.genes search resolver logic', () => {
    test('performs search with filters and returns paginated results', async () => {
      const result = await geneResolver.Query.genes(
        {},
        {
          description: 'kinase',
          genus: 'Arabidopsis',
          page: 1,
          pageSize: 2,
        },
        {dataSources: mockDataSources},
      );

      // Should return filtered results (genes with 'kinase' in description)
      expect(result.results).toHaveLength(2);
      expect(result.results[0].description).toContain('kinase');
      expect(result.results[1].description).toContain('kinase');

      // Should have proper pagination metadata
      expect(result.pageInfo.currentPage).toBe(1);
      expect(result.pageInfo.pageSize).toBe(2);
      expect(result.pageInfo.numResults).toBe(3); // Total filtered results
      expect(result.pageInfo.hasNextPage).toBe(true);
    });

    test('handles search with no results', async () => {
      const result = await geneResolver.Query.genes(
        {},
        {
          description: 'nonexistent_protein_xyz',
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(0);
      expect(result.pageInfo.numResults).toBe(0);
      expect(result.pageInfo.hasNextPage).toBe(false);
    });

    test('validates pagination logic with different page sizes', async () => {
      // Test page 2 with pageSize 1
      const result = await geneResolver.Query.genes(
        {},
        {
          description: 'kinase',
          page: 2,
          pageSize: 1,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.pageInfo.currentPage).toBe(2);
      expect(result.pageInfo.pageSize).toBe(1);
      expect(result.pageInfo.hasPreviousPage).toBe(true);
    });
  });

  describe('Gene field resolvers', () => {
    test('flankingRegions resolver calls correct API and returns results', async () => {
      const mockGene = {id: 'gene_123', identifier: 'AT1G01010'};

      const result = await geneResolver.Gene.flankingRegions(
        mockGene,
        {page: 1, pageSize: 10},
        {dataSources: mockDataSources},
      );

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('gene_123_upstream');
      expect(result[1].id).toBe('gene_123_downstream');
    });

    test('pathways resolver calls correct API and returns results', async () => {
      const mockGene = {id: 'gene_123', identifier: 'AT1G01010'};

      const result = await geneResolver.Gene.pathways(
        mockGene,
        {page: 1, pageSize: 10},
        {dataSources: mockDataSources},
      );

      expect(result).toHaveLength(2);
      expect(result[0].identifier).toBe('PWY001');
      expect(result[1].name).toBe('Calvin cycle');
    });
  });
});

describe('hasGeneFactory - Real Unit Tests', () => {
  let mockDataSources: any;
  let hasGeneResolver: any;

  beforeEach(() => {
    mockDataSources = {
      lisIntermineAPI: {
        getGene: async (identifier: string) => ({
          data: createMockGene({identifier}),
        }),
      },
    };

    hasGeneResolver = hasGeneFactory('lisIntermineAPI');
  });

  test('resolves gene for Transcript parent type', async () => {
    const mockTranscript = {geneIdentifier: 'AT1G01010'};
    const mockInfo = {
      parentType: {
        name: 'Transcript',
        getInterfaces: () => [{name: 'Transcript'}],
      },
    };

    const result = await hasGeneResolver.gene(
      mockTranscript,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result.identifier).toBe('AT1G01010');
  });

  test('resolves gene for GeneFlankingRegion parent type', async () => {
    const mockFlankingRegion = {geneIdentifier: 'AT1G01020'};
    const mockInfo = {
      parentType: {
        name: 'GeneFlankingRegion',
        getInterfaces: () => [],
      },
    };

    const result = await hasGeneResolver.gene(
      mockFlankingRegion,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result.identifier).toBe('AT1G01020');
  });

  test('returns null for unsupported parent types', async () => {
    const mockUnsupported = {someField: 'value'};
    const mockInfo = {
      parentType: {
        name: 'UnsupportedType',
        getInterfaces: () => [],
      },
    };

    const result = await hasGeneResolver.gene(
      mockUnsupported,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result).toBeNull();
  });
});

describe('hasGenesFactory - Real Unit Tests', () => {
  let mockDataSources: any;
  let hasGenesResolver: any;

  beforeEach(() => {
    mockDataSources = {
      lisIntermineAPI: {
        getGenesForGeneFamily: async (id: string) => ({
          data: [createMockGene({identifier: `${id}_gene1`})],
        }),
        getGenesForIntron: async (id: string) => ({
          data: [createMockGene({identifier: `${id}_gene2`})],
        }),
        getGenesForPanGeneSet: async (id: string) => ({
          data: [createMockGene({identifier: `${id}_gene3`})],
        }),
      },
    };

    hasGenesResolver = hasGenesFactory('lisIntermineAPI');
  });

  test('resolves genes for GeneFamily parent type', async () => {
    const mockGeneFamily = {id: 'GF001'};
    const mockInfo = {parentType: {name: 'GeneFamily'}};

    const result = await hasGenesResolver.genes(
      mockGeneFamily,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe('GF001_gene1');
  });

  test('resolves genes for Intron parent type', async () => {
    const mockIntron = {id: 'INT001'};
    const mockInfo = {parentType: {name: 'Intron'}};

    const result = await hasGenesResolver.genes(
      mockIntron,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe('INT001_gene2');
  });

  test('returns null for unsupported parent types', async () => {
    const mockUnsupported = {id: 'UNS001'};
    const mockInfo = {parentType: {name: 'UnsupportedType'}};

    const result = await hasGenesResolver.genes(
      mockUnsupported,
      {},
      {dataSources: mockDataSources},
      mockInfo,
    );

    expect(result).toBeNull();
  });
});
