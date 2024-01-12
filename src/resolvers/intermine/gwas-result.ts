import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

export const gwasResultFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwasResult: async (_, { identifier }, { dataSources }) => {
            const {data: result} = await dataSources[sourceName].getGWASResult(identifier);
            if (result == null) {
                const msg = `GWASResult with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: result};
        },
    },
    GWASResult: {
        ...annotatableInterfaceFactory(sourceName),
        gwas: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getGWAS(gwasResult.gwasIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        trait: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        markers: async (gwasResult, { page, pageSize }, { dataSources }) => {
            const args = {gwasResult, page, pageSize};
            return dataSources[sourceName].getGeneticMarkers(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
