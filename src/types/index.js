// ----------------------------------------------------------------
// Load the typeDefs from all .graphql files in the types directory
// ----------------------------------------------------------------

const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const types = loadFilesSync(path.join(__dirname, './'), { extensions: ['graphql'] });

module.exports = mergeTypeDefs(types);
