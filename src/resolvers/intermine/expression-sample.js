const expressionSampleFactory = (sourceName) => ({
    Query: {
        expressionSample:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getExpressionSample(id);
        },
        expressionSamples: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchExpressionSamples(args);
        },
    },
    ExpressionSample: {
        source: async (expressionSample, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getExpressionSource(expressionSample.sourceId);
        },
    },
});


module.exports = expressionSampleFactory;
