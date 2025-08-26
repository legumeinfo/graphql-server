import {request} from 'graphql-request';
import {ApolloServer} from '@apollo/server';

export class GraphQLTestClient {
  constructor(private endpoint: string) {}

  async query(query: string, variables = {}) {
    try {
      const data = await request(this.endpoint, query, variables);
      return {data, errors: null};
    } catch (error: any) {
      return {
        data: null,
        errors: error.response?.errors || [{message: error.message}],
      };
    }
  }

  async executeOperation(
    server: ApolloServer,
    query: string,
    variables = {},
    contextValue?: any,
  ) {
    const response = await server.executeOperation(
      {query, variables},
      {contextValue},
    );
    return response;
  }
}

export const testClient = new GraphQLTestClient(
  'http://localhost:4000/graphql',
);
