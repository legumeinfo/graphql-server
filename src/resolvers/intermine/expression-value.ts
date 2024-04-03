import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionValueFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionValue: async (_, { sampleIdentifier, geneIdentifier }, { dataSources }) => {
            const {data: value} = await dataSources[sourceName].getExpressionValue(sampleIdentifier, geneIdentifier);
            if (value == null) {
                const msg = `ExpressionValue for sample '${sampleIdentifier}' and gene '${geneIdentifier}' not found`;
                inputError(msg);
            }
            return {results: value};
        },
        expressionValues: async (_, { minValue, geneIdentifier, sampleIdentifier, page, pageSize }, { dataSources }) => {
            const args = {minValue, geneIdentifier, sampleIdentifier, page, pageSize};
            return dataSources[sourceName].searchExpressionValues(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    ExpressionValue: {
        sample: async (expressionValue, _, { dataSources }) => {
            return dataSources[sourceName].getExpressionSample(expressionValue.sampleIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        feature: async (expressionValue, _, { dataSources }) => {
            return dataSources[sourceName].getSequenceFeature(expressionValue.featureId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
