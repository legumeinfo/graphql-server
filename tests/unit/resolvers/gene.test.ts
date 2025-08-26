import {describe, test, expect, vi} from 'vitest';
import {geneFactory} from '../../../src/resolvers/intermine/gene.js';
import {mockGeneData} from '../../__helpers__/mock-data.js';

describe('Gene Resolver', () => {
  describe('Query.gene', () => {
    test('resolves gene by identifier successfully', async () => {
      // Mock data sources
      const mockDataSources = {
        lisIntermineAPI: {
          getGene: vi.fn().mockResolvedValue({
            data: mockGeneData,
          }),
        },
      };

      // Get resolver from factory
      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      // Execute resolver
      const result = await resolver.Query.gene(
        {}, // parent
        {identifier: 'AT1G01010'}, // args
        {dataSources: mockDataSources}, // context
      );

      // Assertions
      expect(mockDataSources.lisIntermineAPI.getGene).toHaveBeenCalledWith(
        'AT1G01010',
      );
      expect(result).toEqual({
        results: mockGeneData,
      });
    });

    test('throws error when gene not found', async () => {
      // Mock data sources returning null
      const mockDataSources = {
        lisIntermineAPI: {
          getGene: vi.fn().mockResolvedValue({
            data: null,
          }),
        },
      };

      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      // Expect error to be thrown
      await expect(
        resolver.Query.gene(
          {},
          {identifier: 'INVALID_GENE'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Gene with identifier 'INVALID_GENE' not found");
    });
  });

  describe('Query.getGenes', () => {
    test('resolves multiple genes by identifiers', async () => {
      const mockGenesData = [
        mockGeneData,
        {...mockGeneData, identifier: 'AT1G01020'},
      ];

      const mockDataSources = {
        lisIntermineAPI: {
          getGenes: vi.fn().mockResolvedValue({
            data: mockGenesData,
          }),
        },
      };

      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      const result = await resolver.Query.getGenes(
        {},
        {identifiers: ['AT1G01010', 'AT1G01020']},
        {dataSources: mockDataSources},
      );

      expect(mockDataSources.lisIntermineAPI.getGenes).toHaveBeenCalledWith([
        'AT1G01010',
        'AT1G01020',
      ]);
      expect(result).toEqual({
        results: mockGenesData,
      });
    });
  });

  describe('Query.genes (search)', () => {
    test('searches genes with filters and pagination', async () => {
      const mockSearchResults = [mockGeneData];
      const mockPageInfo = {
        currentPage: 1,
        pageSize: 10,
        hasNextPage: false,
        hasPreviousPage: false,
        pageCount: 1,
        numResults: 1,
      };

      const mockDataSources = {
        lisIntermineAPI: {
          searchGenes: vi.fn().mockResolvedValue({
            data: mockSearchResults,
            metadata: {pageInfo: mockPageInfo},
          }),
        },
      };

      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      const searchArgs = {
        description: 'kinase',
        genus: 'Arabidopsis',
        species: 'thaliana',
        page: 1,
        pageSize: 10,
      };

      const result = await resolver.Query.genes({}, searchArgs, {
        dataSources: mockDataSources,
      });

      expect(mockDataSources.lisIntermineAPI.searchGenes).toHaveBeenCalledWith(
        searchArgs,
      );
      expect(result).toEqual({
        results: mockSearchResults,
        pageInfo: mockPageInfo,
      });
    });
  });

  describe('Gene.flankingRegions', () => {
    test('resolves flanking regions for gene', async () => {
      const mockFlankingRegions = [
        {id: 'flank1', type: 'upstream'},
        {id: 'flank2', type: 'downstream'},
      ];

      const mockDataSources = {
        lisIntermineAPI: {
          getGeneFlankingRegionsForGene: vi.fn().mockResolvedValue({
            data: mockFlankingRegions,
          }),
        },
      };

      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      const result = await resolver.Gene.flankingRegions(
        {id: 'gene1'}, // parent gene
        {page: 1, pageSize: 10}, // args
        {dataSources: mockDataSources}, // context
      );

      expect(
        mockDataSources.lisIntermineAPI.getGeneFlankingRegionsForGene,
      ).toHaveBeenCalledWith('gene1', {page: 1, pageSize: 10});
      expect(result).toEqual(mockFlankingRegions);
    });
  });

  describe('Gene.pathways', () => {
    test('resolves pathways for gene', async () => {
      const mockPathways = [
        {identifier: 'path1', name: 'Photosynthesis'},
        {identifier: 'path2', name: 'Calvin cycle'},
      ];

      const mockDataSources = {
        lisIntermineAPI: {
          getPathwaysForGene: vi.fn().mockResolvedValue({
            data: mockPathways,
          }),
        },
      };

      const resolver = geneFactory('lisIntermineAPI', 'lisMicroservicesAPI');

      const result = await resolver.Gene.pathways(
        {id: 'gene1'},
        {page: 1, pageSize: 10},
        {dataSources: mockDataSources},
      );

      expect(
        mockDataSources.lisIntermineAPI.getPathwaysForGene,
      ).toHaveBeenCalledWith('gene1', {page: 1, pageSize: 10});
      expect(result).toEqual(mockPathways);
    });
  });
});
