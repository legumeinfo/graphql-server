import {describe, test, expect, vi} from 'vitest';
import {mockProteinData} from '../../__helpers__/mock-data.js';

describe('Protein Resolver', () => {
  describe('Query.protein', () => {
    test('resolves protein by identifier successfully', async () => {
      const mockDataSources = {
        lisIntermineAPI: {
          getProtein: vi.fn().mockResolvedValue({
            data: mockProteinData,
          }),
        },
      };

      const mockProteinResolver = {
        Query: {
          protein: async (parent: any, args: any, context: any) => {
            const {data: protein} =
              await context.dataSources.lisIntermineAPI.getProtein(
                args.identifier,
              );
            if (!protein) {
              throw new Error(
                `Protein with identifier '${args.identifier}' not found`,
              );
            }
            return {results: protein};
          },
        },
      };

      const result = await mockProteinResolver.Query.protein(
        {},
        {identifier: 'AT1G01010.1'},
        {dataSources: mockDataSources},
      );

      expect(mockDataSources.lisIntermineAPI.getProtein).toHaveBeenCalledWith(
        'AT1G01010.1',
      );
      expect(result).toEqual({
        results: mockProteinData,
      });
    });

    test('throws error when protein not found', async () => {
      const mockDataSources = {
        lisIntermineAPI: {
          getProtein: vi.fn().mockResolvedValue({
            data: null,
          }),
        },
      };

      const mockProteinResolver = {
        Query: {
          protein: async (parent: any, args: any, context: any) => {
            const {data: protein} =
              await context.dataSources.lisIntermineAPI.getProtein(
                args.identifier,
              );
            if (!protein) {
              throw new Error(
                `Protein with identifier '${args.identifier}' not found`,
              );
            }
            return {results: protein};
          },
        },
      };

      await expect(
        mockProteinResolver.Query.protein(
          {},
          {identifier: 'INVALID_PROTEIN'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Protein with identifier 'INVALID_PROTEIN' not found");
    });
  });

  describe('Query.proteins (search)', () => {
    test('searches proteins with filters and pagination', async () => {
      const mockSearchResults = [mockProteinData];
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
          searchProteins: vi.fn().mockResolvedValue({
            data: mockSearchResults,
            metadata: {pageInfo: mockPageInfo},
          }),
        },
      };

      const mockProteinResolver = {
        Query: {
          proteins: async (parent: any, args: any, context: any) => {
            return context.dataSources.lisIntermineAPI
              .searchProteins(args)
              .then(({data: results, metadata: {pageInfo}}: any) => ({
                results,
                pageInfo,
              }));
          },
        },
      };

      const searchArgs = {
        description: 'kinase',
        page: 1,
        pageSize: 10,
      };

      const result = await mockProteinResolver.Query.proteins({}, searchArgs, {
        dataSources: mockDataSources,
      });

      expect(
        mockDataSources.lisIntermineAPI.searchProteins,
      ).toHaveBeenCalledWith(searchArgs);
      expect(result).toEqual({
        results: mockSearchResults,
        pageInfo: mockPageInfo,
      });
    });
  });

  describe('Protein field resolvers', () => {
    test('resolves protein domains for protein', async () => {
      const mockProteinDomains = [
        {identifier: 'PF02365', name: 'NAM domain'},
        {identifier: 'PF01124', name: 'Casein kinase II regulatory subunit'},
      ];

      const mockDataSources = {
        lisIntermineAPI: {
          getProteinDomainsForProtein: vi.fn().mockResolvedValue({
            data: mockProteinDomains,
          }),
        },
      };

      const mockProteinResolver = {
        Protein: {
          proteinDomains: async (parent: any, args: any, context: any) => {
            return context.dataSources.lisIntermineAPI
              .getProteinDomainsForProtein(parent.id, args)
              .then(({data: results}: any) => results);
          },
        },
      };

      const result = await mockProteinResolver.Protein.proteinDomains(
        {id: 'protein1'},
        {page: 1, pageSize: 10},
        {dataSources: mockDataSources},
      );

      expect(
        mockDataSources.lisIntermineAPI.getProteinDomainsForProtein,
      ).toHaveBeenCalledWith('protein1', {page: 1, pageSize: 10});
      expect(result).toEqual(mockProteinDomains);
    });

    test('resolves genes for protein', async () => {
      const mockGenes = [{identifier: 'AT1G01010', symbol: 'NAC001'}];

      const mockDataSources = {
        lisIntermineAPI: {
          getGenesForProtein: vi.fn().mockResolvedValue({
            data: mockGenes,
          }),
        },
      };

      const mockProteinResolver = {
        Protein: {
          genes: async (parent: any, args: any, context: any) => {
            return context.dataSources.lisIntermineAPI
              .getGenesForProtein(parent.id)
              .then(({data: results}: any) => results);
          },
        },
      };

      const result = await mockProteinResolver.Protein.genes(
        {id: 'protein1'},
        {},
        {dataSources: mockDataSources},
      );

      expect(
        mockDataSources.lisIntermineAPI.getGenesForProtein,
      ).toHaveBeenCalledWith('protein1');
      expect(result).toEqual(mockGenes);
    });
  });
});
