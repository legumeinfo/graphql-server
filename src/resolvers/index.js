// ---------------------------------------------------------------------
// Load the resolvers from all .graphql files in the resolvers directory
// ---------------------------------------------------------------------

const { mergeResolvers } = require('@graphql-tools/merge');
const intermineResolverFactory = require('./intermine');

const resolvers = [
    // mine for development work with genomic and genetic data
    // intermineResolverFactory('lisMiniMineAPI'),

    // add more resolvers here
    // NOTE: you can't use mergeResolvers with multiple intermine resolvers; you'll
    // have to implement an aggregate resolver so they don't overwrite each other

    // genus mines with only genomic data
    // intermineResolverFactory('lisAeschynomeneMineAPI'),
    // intermineResolverFactory('lisCajanusMineAPI'),
    // intermineResolverFactory('lisCicerMineAPI'),
    // intermineResolverFactory('lisLensMineAPI'),
    // intermineResolverFactory('lisLupinusMineAPI'),
    // intermineResolverFactory('lisMedicagoMineAPI'),

    // genus mines with genetic data as well
    // intermineResolverFactory('lisArachisMineAPI'),
    // intermineResolverFactory('lisGlycineMineAPI'),
    // intermineResolverFactory('lisPhaseolusMineAPI'),
    // intermineResolverFactory('lisVignaMineAPI'),

    // across-the-board genomic data
    intermineResolverFactory('lisLegumeMineAPI'),
];

// I don't get why we'd use mergeResolvers on intermine resolvers as per above.
// module.exports = mergeResolvers(resolvers);

module.exports = resolvers;
