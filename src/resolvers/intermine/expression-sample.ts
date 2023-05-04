import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionSampleFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionSample:  async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getExpressionSample(identifier);
        },
        expressionSamples: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchExpressionSamples(args);
        },
    },
    ExpressionSample: {
        source: async (expressionSample, _, { dataSources }) => {
            return dataSources[sourceName].getExpressionSource(expressionSample.sourceIdentifier);
        },
        ontologyAnnotations: async (expressionSample, { start, size }, { dataSources }) => {
            const args = {annotatable: expressionSample, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
