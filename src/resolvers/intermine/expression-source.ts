import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionSourceFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        expressionSource:  async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getExpressionSource(id);
        },
        expressionSources: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchExpressionSources(args);
        },
    },
    ExpressionSource: {
        organism: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(expressionSource.organismId);
        },
        strain: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(expressionSource.strainId);
        },
        dataSet: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(expressionSource.dataSetId);
        },
        samples: async (expressionSource, { start, size }, { dataSources }) => {
            const args = {expressionSource, start, size};
            return dataSources[sourceName].getExpressionSamples(args);
        },
        publications: async (expressionSource, { start, size }, { dataSources }) => {
            const args = {annotatable: expressionSource, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
