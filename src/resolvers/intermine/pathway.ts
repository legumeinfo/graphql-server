import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

export const pathwayFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        pathway: async (_, { identifier }, { dataSources }) => {
            const {data: pathway} = await dataSources[sourceName].getPathway(identifier);
            if (pathway == null) {
                const msg = `Pathway with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: pathway};
        },
    },
    Pathway: {
        ...annotatableInterfaceFactory(sourceName),
        dataSets: async (pathway, { page, pageSize }, { dataSources }) => {
            const args = {bioEntity: pathway, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (pathway, { page, pageSize }, { dataSources }) => {
            const args = {pathway: pathway, page, pageSize};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
