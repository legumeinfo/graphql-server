import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const supercontigFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        supercontig: async (_, { identifier }, { dataSources }) => {
            const {data: supercontig} = await dataSources[sourceName].getSupercontig(identifier);
            if (supercontig == null) {
                const msg = `Supercontig with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: supercontig};
        },
    },
    Supercontig: {
        organism: async (supercontig, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(supercontig.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        strain: async (supercontig, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(supercontig.strainIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (supercontig, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(supercontig, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
