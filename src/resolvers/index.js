// ---------------------------------------------------------------------
// Load the resolvers from all .graphql files in the resolvers directory
// ---------------------------------------------------------------------

//const path = require('path');
//const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');
const intermineResolverFactory = require('./intermine');

//const resolvers = loadFilesSync(path.join(__dirname, './intermine'), { extensions: ['js'] });

const resolvers = [
  intermineResolverFactory('lisIntermineAPI'),
  // add more resolvers here
  // NOTE: you can't use mergeResolvers with multiple intermine resolvers; you'll
  // have to implement an aggregate resolver so they don't overwrite each other
];

module.exports = mergeResolvers(resolvers);
