import {ApolloServer} from '@apollo/server';
import {typeDefs} from '../../src/types/index.js';
import {resolvers} from '../../src/resolvers/index.js';
import {contextFactory} from '../../src/context.js';

export async function createTestServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Use bounded cache for tests to avoid memory leaks
    cache: 'bounded',
  });

  // Create test context with mock URLs
  const testContext = contextFactory(
    'https://test-intermine.example.com/service',
    'https://test-microservices.example.com',
    server.cache,
  );

  return {server, context: testContext};
}

export async function executeQuery(
  server: ApolloServer,
  query: string,
  variables = {},
  contextValue?: any,
) {
  return await server.executeOperation(
    {
      query,
      variables,
    },
    {
      contextValue:
        contextValue || (await (await createTestServer()).context()),
    },
  );
}
