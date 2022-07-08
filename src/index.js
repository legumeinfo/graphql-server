// dependencies
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { loadSchemaSync } = require("@graphql-tools/load");
const { ApolloServer } = require('apollo-server');
// local
const { resolvers } = require('./resolvers.js');
const { dataSources } = require('./data-sources');


// load the GraphQL schema
const typeDefs = loadSchemaSync('schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});


// create the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
});


// launch the web server.
server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});
