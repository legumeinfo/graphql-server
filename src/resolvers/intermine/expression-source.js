const expressionSampleFactory = (sourceName) => ({
    Query: {
        expressionSource:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getExpressionSource(id);
        },
        expressionSources: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchExpressionSources(args);
        },
    },
    ExpressionSource: {
        organism: async (expressionSource, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(expressionSource.organismId);
        },
        strain: async (expressionSource, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(expressionSource.strainId);
        },
        samples: async (expressionSource, { start, size }, { dataSources }) => {
            const args = {expressionSource, start, size};
            return dataSources[sourceName].getExpressionSamples(args);
        },
        publications: async (expressionSource, { start, size }, { dataSources }) => {
            const args = {
                annotatable: expressionSource,
                start,
                size
            };
            return dataSources[sourceName].getPublications(args);
        },
    },
});


module.exports = expressionSampleFactory;
