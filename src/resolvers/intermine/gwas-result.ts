import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasGeneticMarkersFactory } from './genetic-marker.js';
import { hasGWASFactory } from './gwas.js';


export const gwasResultFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwasResult: async (_, { id }, { dataSources }) => {
            const {data: result} = await dataSources[sourceName].getGWASResult(id);
            if (result == null) {
                const msg = `GWASResult with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: result};
        },
    },
    GWASResult: {
        ...annotatableFactory(sourceName),
        ...hasGeneticMarkersFactory(sourceName),
        ...hasGWASFactory(sourceName),
        trait: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
