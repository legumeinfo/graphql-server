import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';


export const expressionSampleFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionSample: async (_, { identifier }, { dataSources }) => {
            const {data: sample} = await dataSources[sourceName].getExpressionSample(identifier);
            if (sample == null) {
                const msg = `ExpressionSample with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: sample};
        },
        expressionSamples: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchExpressionSamples(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    ExpressionSample: {
        ...isAnnotatableFactory(sourceName),
        source: async (expressionSample, _, { dataSources }) => {
            return dataSources[sourceName].getExpressionSource(expressionSample.sourceIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
