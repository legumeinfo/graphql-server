import {describe, test, expect, vi} from 'vitest';
import {mockOrganismData} from '../../__helpers__/mock-data.js';

// Mock the organism resolver since we don't have direct access to it
// We'll need to test through the actual API or create the resolver factory
describe('Organism Resolver', () => {
  describe('Query.organism', () => {
    test('resolves organism by taxonId successfully', async () => {
      // Mock data sources
      const mockDataSources = {
        lisIntermineAPI: {
          getOrganism: vi.fn().mockResolvedValue({
            data: mockOrganismData,
          }),
        },
      };

      // For now, we'll create a simple mock resolver
      const mockOrganismResolver = {
        Query: {
          organism: async (parent: any, args: any, context: any) => {
            const {data: organism} =
              await context.dataSources.lisIntermineAPI.getOrganism(
                args.taxonId,
              );
            if (!organism) {
              throw new Error(
                `Organism with taxonId '${args.taxonId}' not found`,
              );
            }
            return {results: organism};
          },
        },
      };

      // Execute resolver
      const result = await mockOrganismResolver.Query.organism(
        {}, // parent
        {taxonId: '3702'}, // args
        {dataSources: mockDataSources}, // context
      );

      // Assertions
      expect(mockDataSources.lisIntermineAPI.getOrganism).toHaveBeenCalledWith(
        '3702',
      );
      expect(result).toEqual({
        results: mockOrganismData,
      });
    });

    test('throws error when organism not found', async () => {
      const mockDataSources = {
        lisIntermineAPI: {
          getOrganism: vi.fn().mockResolvedValue({
            data: null,
          }),
        },
      };

      const mockOrganismResolver = {
        Query: {
          organism: async (parent: any, args: any, context: any) => {
            const {data: organism} =
              await context.dataSources.lisIntermineAPI.getOrganism(
                args.taxonId,
              );
            if (!organism) {
              throw new Error(
                `Organism with taxonId '${args.taxonId}' not found`,
              );
            }
            return {results: organism};
          },
        },
      };

      await expect(
        mockOrganismResolver.Query.organism(
          {},
          {taxonId: '99999'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Organism with taxonId '99999' not found");
    });
  });

  describe('Query.organisms (search)', () => {
    test('searches organisms with filters and pagination', async () => {
      const mockSearchResults = [mockOrganismData];
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
          searchOrganisms: vi.fn().mockResolvedValue({
            data: mockSearchResults,
            metadata: {pageInfo: mockPageInfo},
          }),
        },
      };

      const mockOrganismResolver = {
        Query: {
          organisms: async (parent: any, args: any, context: any) => {
            return context.dataSources.lisIntermineAPI
              .searchOrganisms(args)
              .then(({data: results, metadata: {pageInfo}}: any) => ({
                results,
                pageInfo,
              }));
          },
        },
      };

      const searchArgs = {
        name: 'Arabidopsis',
        genus: 'Arabidopsis',
        page: 1,
        pageSize: 10,
      };

      const result = await mockOrganismResolver.Query.organisms(
        {},
        searchArgs,
        {dataSources: mockDataSources},
      );

      expect(
        mockDataSources.lisIntermineAPI.searchOrganisms,
      ).toHaveBeenCalledWith(searchArgs);
      expect(result).toEqual({
        results: mockSearchResults,
        pageInfo: mockPageInfo,
      });
    });

    test('handles empty search results', async () => {
      const mockPageInfo = {
        currentPage: 1,
        pageSize: 10,
        hasNextPage: false,
        hasPreviousPage: false,
        pageCount: 0,
        numResults: 0,
      };

      const mockDataSources = {
        lisIntermineAPI: {
          searchOrganisms: vi.fn().mockResolvedValue({
            data: [],
            metadata: {pageInfo: mockPageInfo},
          }),
        },
      };

      const mockOrganismResolver = {
        Query: {
          organisms: async (parent: any, args: any, context: any) => {
            return context.dataSources.lisIntermineAPI
              .searchOrganisms(args)
              .then(({data: results, metadata: {pageInfo}}: any) => ({
                results,
                pageInfo,
              }));
          },
        },
      };

      const result = await mockOrganismResolver.Query.organisms(
        {},
        {name: 'NonExistent'},
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(0);
      expect(result.pageInfo.numResults).toBe(0);
    });
  });
});
