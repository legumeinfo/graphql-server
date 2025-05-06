import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {config} from 'dotenv';

// import *.js files because node doesn't support directory imports in modules!
import {ContextValue, contextFactory} from './context.js';
import {typeDefs} from './types/index.js';
import {resolvers} from './resolvers/index.js';

// load environment variables from the .env file into process.env
config();

// The ApolloServer constructor requires two parameters: a schema definition and
// a set of resolvers.
// NOTE: 'introspection' option is automatically set to false when NODE_ENV is
// 'production'; see package.json
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

const port = Number(process.env.PORT) || 4000;
const intermineURI =
  process.env.INTERMINE_URI ||
  'https://mines.dev.lis.ncgr.org/minimine/service';
const microservicesURI =
  process.env.MICROSERVICES_URI || 'https://services.lis.ncgr.org';
const {cache} = server;

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs the ApolloServer instance as middleware
//  3. prepares the app to handle incoming requests
const {url} = await startStandaloneServer(server, {
  listen: {port},
  context: contextFactory(intermineURI, microservicesURI, cache),
});

console.log(`🚀  Server ready at: ${url}`);
