import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const expressionSourceFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        expressionSource: async (_, { identifier }, { dataSources }) => {
            const {data: source} = await dataSources[sourceName].getExpressionSource(identifier);
            if (source == null) {
                const msg = `ExpressionSource with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: source};
        },
        expressionSources: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchExpressionSources(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    ExpressionSource: {
        ...annotatableFactory(sourceName),
        organism: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(expressionSource.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        strain: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(expressionSource.strainIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSet: async (expressionSource, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(expressionSource.dataSetName)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        samples: async (expressionSource, { page, pageSize }, { dataSources }) => {
            const args = {expressionSource, page, pageSize};
            return dataSources[sourceName].getExpressionSamples(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
    
});
