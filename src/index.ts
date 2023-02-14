import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// import *.js files because node doesn't support directory imports in modules!
import { ContextValue, contextFactory } from './context.js';
import { typeDefs } from './types/index.js';
import { resolvers } from './resolvers/index.js';


// The ApolloServer constructor requires two parameters: a schema definition and
// a set of resolvers.
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});


const { cache } = server;


// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs the ApolloServer instance as middleware
//  3. prepares the app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: contextFactory(cache),
});


console.log(`🚀  Server ready at: ${url}`);
