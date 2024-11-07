import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasOrganismFactory } from './organism.js';
import { hasStrainFactory } from './strain.js';


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
        ...hasOrganismFactory(sourceName),
        ...hasStrainFactory(sourceName),
        samples: async (expressionSource, { page, pageSize }, { dataSources }) => {
            const {id} = expressionSource;
            const args = {page, pageSize};
            return dataSources[sourceName].getExpressionSamplesForExpressionSource(id, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
    
});
