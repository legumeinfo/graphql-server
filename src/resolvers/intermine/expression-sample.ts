import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionSampleFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        expressionSample:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getExpressionSample(id);
        },
        expressionSamples: async (_source, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchExpressionSamples(args);
        },
    },
    ExpressionSample: {
        source: async (expressionSample, { }, { dataSources }) => {
            return dataSources[sourceName].getExpressionSource(expressionSample.sourceId);
        },
        ontologyAnnotations: async (expressionSample, { start, size }, { dataSources }) => {
            const args = {annotatable: expressionSample, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
