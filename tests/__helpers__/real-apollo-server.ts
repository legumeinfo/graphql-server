import {expect} from 'vitest';
import {REAL_TEST_CONFIG} from '../setup/real-integration-setup.js';

/**
 * GraphQL client for testing against real PeanutBase server
 * NO local server - connects directly to https://dev.peanutbase.org/mwiese/graphql
 */
export async function createRealTestServer() {
  // Return a GraphQL client that connects to the real server
  const serverInfo = {
    graphqlUrl: REAL_TEST_CONFIG.GRAPHQL_URL,
  };

  return {
    server: serverInfo,
    context: async () => ({}),
  };
}

/**
 * Execute a query against the real PeanutBase GraphQL server
 * Times out after configured timeout period
 */
export async function executeRealQuery(
  serverInfo: any, // {graphqlUrl, context}
  query: string,
  variables = {},
  _contextValue?: any, // Ignored for direct HTTP requests
) {
  const graphqlUrl = serverInfo.graphqlUrl || REAL_TEST_CONFIG.GRAPHQL_URL;

  const response = (await Promise.race([
    fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }),
    // Timeout promise
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Query timeout')),
        REAL_TEST_CONFIG.QUERY_TIMEOUT,
      ),
    ),
  ])) as Response;

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Convert to Apollo Server response format for compatibility
  return {
    body: {
      kind: 'single',
      singleResult: {
        data: data.data,
        errors: data.errors,
      },
    },
  };
}

/**
 * Helper to validate GraphQL response structure
 */
export function validateGraphQLResponse(response: any) {
  expect(response).toBeDefined();
  expect(response.body).toBeDefined();
  expect(response.body.kind).toBe('single');
  expect(response.body.singleResult).toBeDefined();

  return response.body.singleResult;
}

/**
 * Helper to validate successful GraphQL data response
 */
export function validateSuccessfulResponse(response: any) {
  const result = validateGraphQLResponse(response);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  return result.data;
}

/**
 * Helper to validate GraphQL error response
 */
export function validateErrorResponse(response: any) {
  const result = validateGraphQLResponse(response);
  expect(result.errors).toBeDefined();
  expect(Array.isArray(result.errors)).toBe(true);
  expect(result.errors.length).toBeGreaterThan(0);
  return result.errors;
}
