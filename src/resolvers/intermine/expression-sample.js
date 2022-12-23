const expressionSampleFactory = (sourceName) => ({
    Query: {
        expressionSample:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getExpressionSample(id);
        },
    },
    ExpressionSample: {
        source: async (expressionSample, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getExpressionSource(expressionSample.sourceId);
        },
    },
});


module.exports = expressionSampleFactory;
