require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolvers');

const { dataSources } = require('./data-sources');

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
