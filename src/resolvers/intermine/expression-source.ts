import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const expressionSourceFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionSource:  async (_, { identifier }, { dataSources }) => {
            const source = dataSources[sourceName].getExpressionSource(identifier);
            if (source == null) {
                const msg = `ExpressionSource with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return source;
        },
        expressionSources: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchExpressionSources(args);
        },
    },
    ExpressionSource: {
        organism: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(expressionSource.organismTaxonId);
        },
        strain: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(expressionSource.strainIdentifier);
        },
        dataSet: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(expressionSource.dataSetName);
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
