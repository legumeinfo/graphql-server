require('dotenv').config();
const { ApolloServer } = require('apollo-server');

// dependencies
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { loadSchemaSync } = require("@graphql-tools/load");

// local
const { resolvers } = require('./resolvers.js');
const { dataSources } = require('./data-sources');

// load the GraphQL schema with GraphQTLFileLoader
const typeDefs = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

// create the Apollo server
const server = new ApolloServer({
    context: async ({req}) => {
    },
    typeDefs,
    resolvers,
    dataSources,
    csrfPrevention: true,
});

// launch the web server.
server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});
