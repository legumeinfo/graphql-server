import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { DataSources, dataSources } from './data-sources/index.js';  // 'index.js' because node doesn't support directory imports in modules!
import { typeDefs } from './types/index.js';
import { resolvers } from './resolvers/index.js';


interface ContextValue {
  dataSources: DataSources;
}


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});


// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      // We create new instances of our data sources with each request.
      // We can pass in our server's cache, contextValue, or any other
      // info our data sources require.
      dataSources: dataSources(),
    };
  },
});


console.log(`🚀  Server ready at: ${url}`);
