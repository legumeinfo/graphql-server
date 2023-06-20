import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionSampleFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionSample: async (_, { identifier }, { dataSources }) => {
            const sample = await dataSources[sourceName].getExpressionSample(identifier);
            if (sample == null) {
                const msg = `ExpressionSample with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return sample;
        },
        expressionSamples: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchExpressionSamples(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    ExpressionSample: {
        source: async (expressionSample, _, { dataSources }) => {
            return dataSources[sourceName].getExpressionSource(expressionSample.sourceIdentifier);
        },
        ontologyAnnotations: async (expressionSample, { start, size }, { dataSources }) => {
            const args = {annotatable: expressionSample, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
