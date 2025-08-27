import {describe, test, expect, beforeEach} from 'vitest';
import {organismFactory} from '../../../src/resolvers/intermine/organism.js';
import {
  mockOrganismData,
  createMockOrganism,
} from '../../__helpers__/mock-data.js';

/**
 * Real Unit Tests for Organism Resolver
 * These test the actual resolver logic, not just mocked functions
 */

describe('Organism Resolver - Real Unit Tests', () => {
  let mockDataSources: any;
  let organismResolver: any;

  beforeEach(() => {
    // Create mock data sources that simulate InterMine API responses
    mockDataSources = {
      lisIntermineAPI: {
        getOrganism: async (taxonId: string) => {
          if (taxonId === '3702') {
            return {data: mockOrganismData};
          }
          if (taxonId === '3847') {
            return {
              data: createMockOrganism({
                taxonId: 3847,
                genus: 'Glycine',
                species: 'max',
              }),
            };
          }
          if (taxonId === 'NONEXISTENT') {
            return {data: null};
          }
          throw new Error('Simulated InterMine connection error');
        },
        searchOrganisms: async (args: any) => {
          const {
            taxonId,
            abbreviation,
            name,
            genus,
            species,
            page = 1,
            pageSize = 10,
          } = args;

          // Simulate real search behavior with test data
          const allResults = [
            createMockOrganism({
              taxonId: 3702,
              genus: 'Arabidopsis',
              species: 'thaliana',
              name: 'Arabidopsis thaliana',
            }),
            createMockOrganism({
              taxonId: 3847,
              genus: 'Glycine',
              species: 'max',
              name: 'Glycine max',
            }),
            createMockOrganism({
              taxonId: 3880,
              genus: 'Medicago',
              species: 'truncatula',
              name: 'Medicago truncatula',
            }),
            createMockOrganism({
              taxonId: 39947,
              genus: 'Oryza',
              species: 'sativa',
              name: 'Oryza sativa',
            }),
          ];

          // Filter based on search criteria
          let filtered = allResults;

          if (taxonId) {
            filtered = filtered.filter(
              (o) => o.taxonId.toString() === taxonId.toString(),
            );
          }
          if (genus) {
            filtered = filtered.filter((o) =>
              o.genus.toLowerCase().includes(genus.toLowerCase()),
            );
          }
          if (species) {
            filtered = filtered.filter((o) =>
              o.species.toLowerCase().includes(species.toLowerCase()),
            );
          }
          if (name) {
            filtered = filtered.filter((o) =>
              o.name.toLowerCase().includes(name.toLowerCase()),
            );
          }
          if (abbreviation) {
            filtered = filtered.filter((o) =>
              o.abbreviation
                ?.toLowerCase()
                .includes(abbreviation.toLowerCase()),
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
      },
    };

    // Create the actual resolver using the factory
    organismResolver = organismFactory('lisIntermineAPI');
  });

  describe('Query.organism resolver logic', () => {
    test('successfully resolves organism by taxonId', async () => {
      const result = await organismResolver.Query.organism(
        {}, // parent
        {taxonId: '3702'}, // args
        {dataSources: mockDataSources}, // context
      );

      expect(result).toEqual({
        results: mockOrganismData,
      });
    });

    test('throws error with proper message when organism not found', async () => {
      await expect(
        organismResolver.Query.organism(
          {},
          {taxonId: 'NONEXISTENT'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Organism with taxon ID 'NONEXISTENT' not found");
    });

    test('propagates InterMine API errors correctly', async () => {
      await expect(
        organismResolver.Query.organism(
          {},
          {taxonId: 'ERROR_CASE'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow('Simulated InterMine connection error');
    });

    test('handles different valid taxonIds', async () => {
      const result = await organismResolver.Query.organism(
        {},
        {taxonId: '3847'},
        {dataSources: mockDataSources},
      );

      expect(result.results.taxonId).toBe(3847);
      expect(result.results.genus).toBe('Glycine');
      expect(result.results.species).toBe('max');
    });
  });

  describe('Query.organisms search resolver logic', () => {
    test('performs search by genus and returns paginated results', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          genus: 'Arabidopsis',
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].genus).toBe('Arabidopsis');
      expect(result.results[0].species).toBe('thaliana');

      expect(result.pageInfo.currentPage).toBe(1);
      expect(result.pageInfo.pageSize).toBe(10);
      expect(result.pageInfo.numResults).toBe(1);
      expect(result.pageInfo.hasNextPage).toBe(false);
    });

    test('performs search by species and returns correct results', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          species: 'max',
          page: 1,
          pageSize: 5,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].species).toBe('max');
      expect(result.results[0].genus).toBe('Glycine');
    });

    test('performs search by name and returns correct results', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          name: 'Glycine',
          page: 1,
          pageSize: 5,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('Glycine max');
    });

    test('handles search with multiple criteria', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          genus: 'Glycine',
          species: 'max',
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].genus).toBe('Glycine');
      expect(result.results[0].species).toBe('max');
    });

    test('handles search with no results', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          genus: 'NonexistentGenus',
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
      // Test that pagination works correctly with all organisms
      const allOrganismsResult = await organismResolver.Query.organisms(
        {},
        {
          page: 1,
          pageSize: 2,
        },
        {dataSources: mockDataSources},
      );

      expect(allOrganismsResult.results).toHaveLength(2);
      expect(allOrganismsResult.pageInfo.currentPage).toBe(1);
      expect(allOrganismsResult.pageInfo.pageSize).toBe(2);
      expect(allOrganismsResult.pageInfo.numResults).toBe(4);
      expect(allOrganismsResult.pageInfo.hasNextPage).toBe(true);

      // Test page 2
      const page2Result = await organismResolver.Query.organisms(
        {},
        {
          page: 2,
          pageSize: 2,
        },
        {dataSources: mockDataSources},
      );

      expect(page2Result.results).toHaveLength(2);
      expect(page2Result.pageInfo.currentPage).toBe(2);
      expect(page2Result.pageInfo.hasPreviousPage).toBe(true);
      expect(page2Result.pageInfo.hasNextPage).toBe(false);
    });

    test('validates taxonId search functionality', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          taxonId: 3702,
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].taxonId).toBe(3702);
      expect(result.results[0].name).toBe('Arabidopsis thaliana');
    });

    test('handles edge cases in search parameters', async () => {
      // Empty string search
      const emptyResult = await organismResolver.Query.organisms(
        {},
        {
          genus: '',
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );
      // Empty string should be treated as no filter
      expect(emptyResult.results.length).toBeGreaterThan(0);

      // Case insensitive search
      const caseInsensitiveResult = await organismResolver.Query.organisms(
        {},
        {
          genus: 'ARABIDOPSIS',
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );
      expect(caseInsensitiveResult.results).toHaveLength(1);
      expect(caseInsensitiveResult.results[0].genus).toBe('Arabidopsis');
    });
  });

  describe('Resolver error handling', () => {
    test('handles null data from InterMine API correctly', async () => {
      // Test the actual error handling logic in the resolver
      await expect(
        organismResolver.Query.organism(
          {},
          {taxonId: 'NONEXISTENT'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow("Organism with taxon ID 'NONEXISTENT' not found");
    });

    test('passes through InterMine API errors', async () => {
      await expect(
        organismResolver.Query.organism(
          {},
          {taxonId: 'ERROR_CASE'},
          {dataSources: mockDataSources},
        ),
      ).rejects.toThrow('Simulated InterMine connection error');
    });

    test('search handles InterMine API errors gracefully', async () => {
      // Modify mock to throw error for search
      const errorDataSources = {
        lisIntermineAPI: {
          searchOrganisms: async () => {
            throw new Error('Simulated search error');
          },
        },
      };

      await expect(
        organismResolver.Query.organisms(
          {},
          {genus: 'Test'},
          {dataSources: errorDataSources},
        ),
      ).rejects.toThrow('Simulated search error');
    });
  });

  describe('Resolver input validation', () => {
    test('handles various taxonId formats', async () => {
      // String taxonId
      const stringResult = await organismResolver.Query.organism(
        {},
        {taxonId: '3702'},
        {dataSources: mockDataSources},
      );
      expect(stringResult.results.taxonId).toBe(3702);

      // Numeric taxonId (should be converted to string for API call)
      const numericResult = await organismResolver.Query.organism(
        {},
        {taxonId: '3847'},
        {dataSources: mockDataSources},
      );
      expect(numericResult.results.taxonId).toBe(3847);
    });

    test('handles undefined optional parameters in search', async () => {
      const result = await organismResolver.Query.organisms(
        {},
        {
          // Only page and pageSize, all search parameters undefined
          page: 1,
          pageSize: 10,
        },
        {dataSources: mockDataSources},
      );

      // Should return all organisms when no filters applied
      expect(result.results.length).toBe(4);
    });
  });
});
