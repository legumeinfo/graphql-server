import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';
import {mockEmptyResponse} from '../../../__helpers__/mock-intermine.js';

describe('Location Linkouts Integration', () => {
  test('fetches location linkouts successfully', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const locationLinkoutsQuery = `
      query GetLocationLinkouts($identifier: ID!, $start: Int!, $end: Int!) {
        locationLinkouts(identifier: $identifier, start: $start, end: $end) {
          results {
            identifier
            url
            text
            description
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      locationLinkoutsQuery,
      {
        identifier: 'Chr1',
        start: 3631,
        end: 5899,
      },
      contextValue,
    );

    // Validate successful response
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.locationLinkouts).toBeDefined();
    expect(data.locationLinkouts.results).toBeDefined();
    expect(Array.isArray(data.locationLinkouts.results)).toBe(true);
  });

  test('handles location with no linkouts', async () => {
    mockEmptyResponse();

    const {server, context} = await createTestServer();
    const contextValue = await context();

    const locationLinkoutsQuery = `
      query GetLocationLinkouts($identifier: ID!, $start: Int!, $end: Int!) {
        locationLinkouts(identifier: $identifier, start: $start, end: $end) {
          results {
            identifier
            url
            text
            description
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      locationLinkoutsQuery,
      {
        identifier: 'ChrNonExistent',
        start: 1,
        end: 100,
      },
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();

    const data = response.body.singleResult.data;
    expect(data.locationLinkouts.results).toHaveLength(0);
  });

  test('validates location linkout parameters', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const locationLinkoutsQuery = `
      query GetLocationLinkouts($identifier: ID!, $start: Int!, $end: Int!) {
        locationLinkouts(identifier: $identifier, start: $start, end: $end) {
          results {
            identifier
            url
            text
            description
          }
        }
      }
    `;

    // Test various chromosome identifiers and coordinates
    const testLocations = [
      {identifier: 'Chr1', start: 1, end: 1000},
      {identifier: '1', start: 5000, end: 10000},
      {identifier: 'Gm01', start: 100000, end: 200000},
    ];

    for (const location of testLocations) {
      const response = await executeQuery(
        server,
        locationLinkoutsQuery,
        location,
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.data.locationLinkouts).toBeDefined();
    }
  });

  test('validates coordinate ranges', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const locationLinkoutsQuery = `
      query GetLocationLinkouts($identifier: ID!, $start: Int!, $end: Int!) {
        locationLinkouts(identifier: $identifier, start: $start, end: $end) {
          results {
            identifier
            url
            text
          }
        }
      }
    `;

    // Test edge cases for coordinates
    const testCases = [
      {identifier: 'Chr1', start: 1, end: 1}, // Single base
      {identifier: 'Chr1', start: 1000, end: 2000}, // Normal range
      {identifier: 'Chr1', start: 1000000, end: 1001000}, // Large coordinates
    ];

    for (const testCase of testCases) {
      const response = await executeQuery(
        server,
        locationLinkoutsQuery,
        testCase,
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // Should handle all coordinate ranges without errors
      expect(response.body.singleResult.data.locationLinkouts).toBeDefined();
    }
  });
});
